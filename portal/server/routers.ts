import { COOKIE_NAME } from "@shared/const";
import { TRPCError } from "@trpc/server";
import { and, count, desc, eq, inArray } from "drizzle-orm";
import { parse as parseCookie } from "cookie";
import { z } from "zod";
import { automationJobs, escalationLogs, leases, owners, payments, properties, tenants, users } from "../drizzle/schema";
import * as db from "./db";
import { getSessionCookieOptions } from "./_core/cookies";
import { createHeartbeatJob } from "./_core/heartbeat";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { escalationLabels } from "./escalation";
import { runEscalationScan } from "./escalationService";

const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN", message: "هذه الصفحة مخصصة للمشرف." });
  return next();
});

const dateInput = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "أدخل التاريخ بصيغة صحيحة");
const toDate = (value: string) => new Date(`${value}T00:00:00.000Z`);

async function requireOwnerProperty(userId: number, propertyId: number) {
  const owner = await db.ensureOwnerForUser(userId);
  const property = await db.getOwnerProperty(owner.id, propertyId);
  if (!property || property.ownerId !== owner.id) throw new TRPCError({ code: "NOT_FOUND", message: "العقار غير موجود ضمن محفظتك." });
  return { owner, property };
}

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  portal: router({
    dashboard: protectedProcedure.query(async ({ ctx }) => {
      const owner = await db.ensureOwnerForUser(ctx.user.id);
      const portfolio = await db.getOwnerPortfolio(owner.id);
      const tenantByProperty = new Map(portfolio.tenants.map(tenant => [tenant.propertyId, tenant]));
      const activeLeaseByProperty = new Map(portfolio.leases.filter(lease => lease.status === "active").map(lease => [lease.propertyId, lease]));
      const latestPaymentByProperty = new Map<number, (typeof portfolio.payments)[number]>();
      portfolio.payments.forEach(payment => { if (!latestPaymentByProperty.has(payment.propertyId)) latestPaymentByProperty.set(payment.propertyId, payment); });
      const propertyRows = portfolio.properties.map(property => ({
        ...property,
        tenant: tenantByProperty.get(property.id) ?? null,
        lease: activeLeaseByProperty.get(property.id) ?? null,
        latestPayment: latestPaymentByProperty.get(property.id) ?? null,
      }));
      const totalMonthlyRent = portfolio.properties.reduce((total, property) => total + Number(property.monthlyRent), 0);
      const collected = portfolio.payments.filter(payment => payment.status === "paid").reduce((total, payment) => total + Number(payment.amount), 0);
      const outstanding = portfolio.payments.filter(payment => payment.status !== "paid").reduce((total, payment) => total + Number(payment.amount), 0);
      return {
        owner,
        properties: propertyRows,
        payments: portfolio.payments,
        logs: portfolio.logs,
        summary: {
          totalMonthlyRent,
          collected,
          outstanding,
          activeProperties: portfolio.properties.filter(property => property.status === "occupied").length,
          activeEscalations: portfolio.payments.filter(payment => ["friendly", "notice", "legal", "eviction"].includes(payment.escalationStage)).length,
        },
      };
    }),
    addProperty: protectedProcedure.input(z.object({
      title: z.string().min(3).max(255), propertyType: z.enum(["apartment", "villa", "office", "shop", "building", "other"]),
      governorate: z.string().min(2).max(100), address: z.string().min(5), monthlyRent: z.number().positive(), dueDay: z.number().int().min(1).max(28),
    })).mutation(async ({ ctx, input }) => {
      const owner = await db.ensureOwnerForUser(ctx.user.id);
      const database = await db.getDb(); if (!database) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      await database.insert(properties).values({ ...input, ownerId: owner.id, monthlyRent: input.monthlyRent.toFixed(2) });
      return { success: true };
    }),
    addTenantAndLease: protectedProcedure.input(z.object({
      propertyId: z.number().int().positive(), fullName: z.string().min(3), nationalId: z.string().max(50).optional(), phone: z.string().min(7).max(24),
      riskScore: z.number().int().min(0).max(100), monthlyRent: z.number().positive(), startDate: dateInput, endDate: dateInput,
    })).mutation(async ({ ctx, input }) => {
      const { property } = await requireOwnerProperty(ctx.user.id, input.propertyId);
      const database = await db.getDb(); if (!database) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const tenantResult = await database.insert(tenants).values({ propertyId: property.id, fullName: input.fullName, nationalId: input.nationalId || null, phone: input.phone, riskScore: input.riskScore });
      await database.insert(leases).values({ propertyId: property.id, tenantId: Number(tenantResult[0].insertId), monthlyRent: input.monthlyRent.toFixed(2), startDate: toDate(input.startDate), endDate: toDate(input.endDate), status: "active" });
      await database.update(properties).set({ status: "occupied" }).where(eq(properties.id, property.id));
      return { success: true };
    }),
    addPayment: protectedProcedure.input(z.object({ propertyId: z.number().int().positive(), tenantId: z.number().int().positive(), amount: z.number().positive(), dueDate: dateInput })).mutation(async ({ ctx, input }) => {
      const { property } = await requireOwnerProperty(ctx.user.id, input.propertyId);
      const database = await db.getDb(); if (!database) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const tenant = (await database.select().from(tenants).where(and(eq(tenants.id, input.tenantId), eq(tenants.propertyId, property.id))).limit(1))[0];
      if (!tenant) throw new TRPCError({ code: "NOT_FOUND", message: "المستأجر لا يتبع هذا العقار." });
      const lease = (await database.select().from(leases).where(and(eq(leases.propertyId, property.id), eq(leases.tenantId, tenant.id), eq(leases.status, "active"))).limit(1))[0];
      await database.insert(payments).values({ propertyId: property.id, tenantId: tenant.id, leaseId: lease?.id ?? null, amount: input.amount.toFixed(2), dueDate: toDate(input.dueDate), status: "pending", escalationStage: "normal" });
      return { success: true };
    }),
    markPaymentPaid: protectedProcedure.input(z.object({ paymentId: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
      const database = await db.getDb(); if (!database) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const owner = await db.ensureOwnerForUser(ctx.user.id);
      const row = (await database.select({ id: payments.id, ownerId: properties.ownerId }).from(payments).innerJoin(properties, eq(payments.propertyId, properties.id)).where(eq(payments.id, input.paymentId)).limit(1))[0];
      if (!row || row.ownerId !== owner.id) throw new TRPCError({ code: "NOT_FOUND", message: "الدفعة غير موجودة." });
      const now = new Date();
      await database.update(payments).set({ status: "paid", paidDate: now, transferredAt: now, escalationStage: "normal" }).where(eq(payments.id, input.paymentId));
      return { success: true };
    }),
    escalationLabels: publicProcedure.query(() => escalationLabels),
  }),
  admin: router({
    overview: adminProcedure.query(async () => {
      const database = await db.getDb(); if (!database) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const [[ownerCount], [propertyCount], legalCases] = await Promise.all([
        database.select({ value: count() }).from(owners), database.select({ value: count() }).from(properties),
        database.select({ id: payments.id, amount: payments.amount, stage: payments.escalationStage, dueDate: payments.dueDate, propertyTitle: properties.title, governorName: users.name, tenantName: tenants.fullName })
          .from(payments).innerJoin(properties, eq(payments.propertyId, properties.id)).innerJoin(owners, eq(properties.ownerId, owners.id)).innerJoin(users, eq(owners.userId, users.id)).innerJoin(tenants, eq(payments.tenantId, tenants.id))
          .where(inArray(payments.escalationStage, ["legal", "eviction"])) .orderBy(desc(payments.dueDate)),
      ]);
      return { ownerCount: ownerCount?.value ?? 0, propertyCount: propertyCount?.value ?? 0, legalCases };
    }),
    owners: adminProcedure.query(async () => {
      const database = await db.getDb(); if (!database) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      return database.select({ ownerId: owners.id, name: users.name, email: users.email, phone: owners.phone, createdAt: owners.createdAt }).from(owners).innerJoin(users, eq(owners.userId, users.id)).orderBy(desc(owners.createdAt));
    }),
    runEscalationScan: adminProcedure.mutation(() => runEscalationScan()),
    automationStatus: adminProcedure.query(() => db.getAutomationJob()),
    enableDailyScan: adminProcedure.mutation(async ({ ctx }) => {
      if (process.env.NODE_ENV !== "production") {
        throw new TRPCError({ code: "PRECONDITION_FAILED", message: "انشر النسخة الحالية أولاً، ثم فعّل الفحص اليومي من لوحة المشرف." });
      }
      const existing = await db.getAutomationJob();
      if (existing?.scheduleCronTaskUid) return { taskUid: existing.scheduleCronTaskUid, alreadyConfigured: true };
      const sessionToken = parseCookie(ctx.req.headers.cookie ?? "")[COOKIE_NAME] ?? "";
      const job = await createHeartbeatJob({ name: "ossoolli-daily-escalation", cron: "0 0 6 * * *", path: "/api/scheduled/daily-escalation", description: "فحص يومي لدفعات أصولي وتحديث مراحل التصعيد" }, sessionToken);
      const database = await db.getDb(); if (!database) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      await database.insert(automationJobs).values({ jobKey: "daily-escalation-scan", scheduleCronTaskUid: job.taskUid, cronExpression: "0 0 6 * * *", enabled: 1 }).onDuplicateKeyUpdate({ set: { scheduleCronTaskUid: job.taskUid, cronExpression: "0 0 6 * * *", enabled: 1 } });
      return { taskUid: job.taskUid, alreadyConfigured: false, nextExecutionAt: job.nextExecutionAt };
    }),
  }),
});

export type AppRouter = typeof appRouter;
