import { date, decimal, index, int, mysqlEnum, mysqlTable, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const owners = mysqlTable("owners", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
  phone: varchar("phone", { length: 24 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const properties = mysqlTable("properties", {
  id: int("id").autoincrement().primaryKey(),
  ownerId: int("ownerId").notNull().references(() => owners.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  propertyType: mysqlEnum("propertyType", ["apartment", "villa", "office", "shop", "building", "other"]).notNull(),
  governorate: varchar("governorate", { length: 100 }).notNull(),
  address: text("address").notNull(),
  monthlyRent: decimal("monthlyRent", { precision: 10, scale: 2 }).notNull(),
  dueDay: int("dueDay").notNull().default(1),
  status: mysqlEnum("status", ["occupied", "vacant", "suspended"]).notNull().default("vacant"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => [index("properties_owner_idx").on(table.ownerId)]);

export const tenants = mysqlTable("tenants", {
  id: int("id").autoincrement().primaryKey(),
  propertyId: int("propertyId").notNull().references(() => properties.id, { onDelete: "cascade" }),
  fullName: varchar("fullName", { length: 255 }).notNull(),
  nationalId: varchar("nationalId", { length: 50 }),
  phone: varchar("phone", { length: 24 }).notNull(),
  riskScore: int("riskScore").notNull().default(85),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => [index("tenants_property_idx").on(table.propertyId)]);

export const leases = mysqlTable("leases", {
  id: int("id").autoincrement().primaryKey(),
  propertyId: int("propertyId").notNull().references(() => properties.id, { onDelete: "cascade" }),
  tenantId: int("tenantId").notNull().references(() => tenants.id, { onDelete: "cascade" }),
  monthlyRent: decimal("monthlyRent", { precision: 10, scale: 2 }).notNull(),
  startDate: date("startDate", { mode: "date" }).notNull(),
  endDate: date("endDate", { mode: "date" }).notNull(),
  status: mysqlEnum("status", ["active", "ended", "draft"]).notNull().default("active"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => [index("leases_property_idx").on(table.propertyId), index("leases_tenant_idx").on(table.tenantId)]);

export const payments = mysqlTable("payments", {
  id: int("id").autoincrement().primaryKey(),
  propertyId: int("propertyId").notNull().references(() => properties.id, { onDelete: "cascade" }),
  tenantId: int("tenantId").notNull().references(() => tenants.id, { onDelete: "cascade" }),
  leaseId: int("leaseId").references(() => leases.id, { onDelete: "set null" }),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  dueDate: date("dueDate", { mode: "date" }).notNull(),
  paidDate: timestamp("paidDate"),
  transferredAt: timestamp("transferredAt"),
  status: mysqlEnum("status", ["pending", "paid", "overdue"]).notNull().default("pending"),
  escalationStage: mysqlEnum("escalationStage", ["normal", "friendly", "notice", "legal", "eviction"]).notNull().default("normal"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => [index("payments_property_idx").on(table.propertyId), index("payments_due_date_idx").on(table.dueDate), index("payments_status_idx").on(table.status)]);

export const escalationLogs = mysqlTable("escalationLogs", {
  id: int("id").autoincrement().primaryKey(),
  paymentId: int("paymentId").notNull().references(() => payments.id, { onDelete: "cascade" }),
  stage: mysqlEnum("stage", ["friendly", "notice", "legal", "eviction"]).notNull(),
  actionTaken: text("actionTaken").notNull(),
  notes: text("notes"),
  lawyerAssigned: varchar("lawyerAssigned", { length: 255 }),
  triggeredAt: timestamp("triggeredAt").defaultNow().notNull(),
}, table => [index("escalation_logs_payment_idx").on(table.paymentId)]);

/** Persists platform schedule identities rather than trusting a request payload. */
export const automationJobs = mysqlTable("automationJobs", {
  id: int("id").autoincrement().primaryKey(),
  jobKey: varchar("jobKey", { length: 100 }).notNull(),
  scheduleCronTaskUid: varchar("scheduleCronTaskUid", { length: 65 }),
  cronExpression: varchar("cronExpression", { length: 80 }).notNull(),
  enabled: int("enabled").notNull().default(1),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => [uniqueIndex("automation_jobs_key_uniq").on(table.jobKey), uniqueIndex("automation_jobs_task_uniq").on(table.scheduleCronTaskUid)]);
