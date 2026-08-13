import { and, eq, ne } from "drizzle-orm";
import { escalationLogs, payments } from "../drizzle/schema";
import { getDb } from "./db";
import { calculateDaysOverdue, getEscalationRule } from "./escalation";

/**
 * Applies the deterministic collection ladder once. It is idempotent: a stage
 * entry is created only when a payment enters a new escalation stage.
 */
export async function runEscalationScan(asOf = new Date()) {
  const db = await getDb();
  if (!db) throw new Error("قاعدة البيانات غير متاحة لتشغيل فحص التحصيل.");

  const openPayments = await db.select().from(payments).where(ne(payments.status, "paid"));
  let updated = 0;
  let escalated = 0;

  for (const payment of openPayments) {
    const daysOverdue = calculateDaysOverdue(payment.dueDate, asOf);
    const nextRule = getEscalationRule(daysOverdue);
    const nextStatus = daysOverdue > 0 ? "overdue" : "pending";
    const changed = payment.status !== nextStatus || payment.escalationStage !== nextRule.stage;

    if (changed) {
      await db
        .update(payments)
        .set({ status: nextStatus, escalationStage: nextRule.stage, updatedAt: asOf })
        .where(eq(payments.id, payment.id));
      updated += 1;
    }

    if (nextRule.stage !== "normal" && payment.escalationStage !== nextRule.stage) {
      const sameStageLog = await db
        .select({ id: escalationLogs.id })
        .from(escalationLogs)
        .where(and(eq(escalationLogs.paymentId, payment.id), eq(escalationLogs.stage, nextRule.stage)))
        .limit(1);

      if (sameStageLog.length === 0) {
        await db.insert(escalationLogs).values({
          paymentId: payment.id,
          stage: nextRule.stage,
          actionTaken: nextRule.action,
          notes: `تأخير محسوب: ${daysOverdue} يوم/أيام.`,
          triggeredAt: asOf,
        });
        escalated += 1;
      }
    }
  }

  return { scanned: openPayments.length, updated, escalated, ranAt: asOf };
}
