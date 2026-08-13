export type EscalationStage = "normal" | "friendly" | "notice" | "legal" | "eviction";

export type EscalationRule = {
  stage: EscalationStage;
  label: string;
  action: string;
};

const RULES: Record<EscalationStage, EscalationRule> = {
  normal: {
    stage: "normal",
    label: "منتظم",
    action: "لا يلزم إجراء؛ الدفعة ضمن الجدول المتفق عليه.",
  },
  friendly: {
    stage: "friendly",
    label: "إشعار ودي",
    action: "إرسال تذكير آلي للمستأجر بموعد السداد المتأخر.",
  },
  notice: {
    stage: "notice",
    label: "إنذار رسمي",
    action: "تسجيل إنذار رسمي بالتأخير وإحالة الحالة للمتابعة.",
  },
  legal: {
    stage: "legal",
    label: "إنذار عدلي",
    action: "تحويل الملف للتدقيق القانوني وتجهيز مسودة الإنذار العدلي.",
  },
  eviction: {
    stage: "eviction",
    label: "دعوى إخلاء",
    action: "إحالة الملف لإجراء دعوى الإخلاء وفق اعتماد الفريق القانوني.",
  },
};

export function getEscalationRule(daysOverdue: number): EscalationRule {
  if (daysOverdue >= 30) return RULES.eviction;
  if (daysOverdue >= 15) return RULES.legal;
  if (daysOverdue >= 5) return RULES.notice;
  if (daysOverdue >= 1) return RULES.friendly;
  return RULES.normal;
}

/** Computes calendar-day delay in UTC, preventing time-of-day drift in daily jobs. */
export function calculateDaysOverdue(dueDate: Date, asOf = new Date()): number {
  const dueUtc = Date.UTC(dueDate.getUTCFullYear(), dueDate.getUTCMonth(), dueDate.getUTCDate());
  const currentUtc = Date.UTC(asOf.getUTCFullYear(), asOf.getUTCMonth(), asOf.getUTCDate());
  return Math.max(0, Math.floor((currentUtc - dueUtc) / 86_400_000));
}

export const escalationLabels: Record<EscalationStage, string> = Object.fromEntries(
  Object.entries(RULES).map(([key, rule]) => [key, rule.label])
) as Record<EscalationStage, string>;
