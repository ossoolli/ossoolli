import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function makeContext(user: TrpcContext["user"]): TrpcContext {
  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => undefined } as TrpcContext["res"],
  };
}

const regularUser = {
  id: 7,
  openId: "owner-user",
  name: "مالك تجريبي",
  email: "owner@example.com",
  loginMethod: "manus",
  role: "user" as const,
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSignedIn: new Date(),
};

const adminUser = {
  ...regularUser,
  id: 1,
  openId: "project-owner",
  role: "admin" as const,
};

describe("صلاحيات بوابة أصولي", () => {
  it("يرفض الوصول إلى محفظة المالك دون جلسة موثقة", async () => {
    const caller = appRouter.createCaller(makeContext(null));
    await expect(caller.portal.dashboard()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("يمنع المالك العادي من إجراءات لوحة المشرف", async () => {
    const caller = appRouter.createCaller(makeContext(regularUser));
    await expect(caller.admin.overview()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("يمنع إنشاء المهمة اليومية قبل نشر النسخة", async () => {
    const caller = appRouter.createCaller(makeContext(adminUser));
    await expect(caller.admin.enableDailyScan()).rejects.toMatchObject({ code: "PRECONDITION_FAILED" });
  });
});
