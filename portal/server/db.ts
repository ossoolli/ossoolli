import { desc, eq, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { automationJobs, escalationLogs, InsertUser, leases, owners, payments, properties, tenants, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function ensureOwnerForUser(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("قاعدة البيانات غير متاحة");
  const existing = await db.select().from(owners).where(eq(owners.userId, userId)).limit(1);
  if (existing[0]) return existing[0];
  await db.insert(owners).values({ userId });
  const owner = await db.select().from(owners).where(eq(owners.userId, userId)).limit(1);
  if (!owner[0]) throw new Error("تعذر إنشاء ملف المالك");
  return owner[0];
}

export async function getOwnerProperty(ownerId: number, propertyId: number) {
  const db = await getDb();
  if (!db) throw new Error("قاعدة البيانات غير متاحة");
  return (await db.select().from(properties).where(eq(properties.id, propertyId)).limit(1))[0];
}

export async function getOwnerPortfolio(ownerId: number) {
  const db = await getDb();
  if (!db) throw new Error("قاعدة البيانات غير متاحة");
  const ownerProperties = await db.select().from(properties).where(eq(properties.ownerId, ownerId)).orderBy(desc(properties.createdAt));
  const propertyIds = ownerProperties.map(property => property.id);
  if (propertyIds.length === 0) return { properties: [], tenants: [], leases: [], payments: [], logs: [] };
  const [ownerTenants, ownerLeases, ownerPayments] = await Promise.all([
    db.select().from(tenants).where(inArray(tenants.propertyId, propertyIds)),
    db.select().from(leases).where(inArray(leases.propertyId, propertyIds)),
    db.select().from(payments).where(inArray(payments.propertyId, propertyIds)).orderBy(desc(payments.dueDate)),
  ]);
  const paymentIds = ownerPayments.map(payment => payment.id);
  const logs = paymentIds.length ? await db.select().from(escalationLogs).where(inArray(escalationLogs.paymentId, paymentIds)).orderBy(desc(escalationLogs.triggeredAt)) : [];
  return { properties: ownerProperties, tenants: ownerTenants, leases: ownerLeases, payments: ownerPayments, logs };
}

export async function getAutomationJobByTaskUid(taskUid: string) {
  const db = await getDb();
  if (!db) throw new Error("قاعدة البيانات غير متاحة");
  return (await db.select().from(automationJobs).where(eq(automationJobs.scheduleCronTaskUid, taskUid)).limit(1))[0];
}

export async function getAutomationJob() {
  const db = await getDb();
  if (!db) throw new Error("قاعدة البيانات غير متاحة");
  return (await db.select().from(automationJobs).where(eq(automationJobs.jobKey, "daily-escalation-scan")).limit(1))[0];
}
