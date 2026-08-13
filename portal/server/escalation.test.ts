import { describe, expect, it } from "vitest";
import { calculateDaysOverdue, getEscalationRule } from "./escalation";

describe("محرك التصعيد القانوني", () => {
  it("يطبق المراحل الأربع عند عتباتها المحددة", () => {
    expect(getEscalationRule(0).stage).toBe("normal");
    expect(getEscalationRule(1).stage).toBe("friendly");
    expect(getEscalationRule(4).stage).toBe("friendly");
    expect(getEscalationRule(5).stage).toBe("notice");
    expect(getEscalationRule(14).stage).toBe("notice");
    expect(getEscalationRule(15).stage).toBe("legal");
    expect(getEscalationRule(30).stage).toBe("eviction");
  });

  it("يحسب التأخير بأيام تقويمية دون تأثر بساعة التشغيل", () => {
    const dueDate = new Date("2026-08-01T18:00:00.000Z");
    const asOf = new Date("2026-08-04T02:00:00.000Z");
    expect(calculateDaysOverdue(dueDate, asOf)).toBe(3);
  });
});
