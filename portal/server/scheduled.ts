import type { Request, Response } from "express";
import { getAutomationJobByTaskUid } from "./db";
import { runEscalationScan } from "./escalationService";
import { sdk } from "./_core/sdk";

/** Platform-authenticated daily job endpoint. It deliberately ignores request body data. */
export async function dailyEscalationHandler(req: Request, res: Response) {
  try {
    const user = await sdk.authenticateRequest(req);
    if (!user.isCron || !user.taskUid) {
      return res.status(403).json({ error: "cron-only" });
    }

    const job = await getAutomationJobByTaskUid(user.taskUid);
    if (!job || job.jobKey !== "daily-escalation-scan") {
      return res.json({ ok: true, skipped: "orphan" });
    }

    const result = await runEscalationScan();
    return res.json({ ok: true, result });
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : String(error),
      context: { url: req.originalUrl },
      timestamp: new Date().toISOString(),
    });
  }
}
