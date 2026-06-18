import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { telegramUsers, withdrawals, tasks, channels, settings, broadcasts } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

// Admin-only procedure
const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  if (ctx.user?.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});

export const adminRouter = router({
  // Get dashboard stats
  getStats: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return { totalUsers: 0, totalCoins: 0, pendingWithdrawals: 0, activeReferrals: 0 };

    // TODO: Implement actual stats queries
    return {
      totalUsers: 1234,
      totalCoins: 45200,
      pendingWithdrawals: 23,
      activeReferrals: 567,
    };
  }),

  // Get all users
  getUsers: adminProcedure
    .input(z.object({ limit: z.number().default(50), offset: z.number().default(0) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      return db.select().from(telegramUsers).limit(input.limit).offset(input.offset);
    }),

  // Get pending withdrawals
  getPendingWithdrawals: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];

    return db.select().from(withdrawals).where(eq(withdrawals.status, "pending"));
  }),

  // Approve withdrawal
  approveWithdrawal: adminProcedure
    .input(z.object({ withdrawalId: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db.update(withdrawals).set({ status: "approved" }).where(eq(withdrawals.id, input.withdrawalId));

      return { success: true };
    }),

  // Reject withdrawal
  rejectWithdrawal: adminProcedure
    .input(z.object({ withdrawalId: z.number(), reason: z.string().optional() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db.update(withdrawals).set({ status: "rejected", notes: input.reason }).where(eq(withdrawals.id, input.withdrawalId));

      return { success: true };
    }),

  // Create task
  createTask: adminProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string().optional(),
        reward: z.number(),
        type: z.enum(["daily", "one_time", "repeatable"]),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const [task] = await db.insert(tasks).values(input).$returningId();
      return task;
    }),

  // Update task
  updateTask: adminProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        reward: z.number().optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const { id, ...data } = input;
      await db.update(tasks).set(data).where(eq(tasks.id, id));

      return { success: true };
    }),

  // Get all tasks
  getTasks: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];

    return db.select().from(tasks);
  }),

  // Create channel
  createChannel: adminProcedure
    .input(
      z.object({
        name: z.string(),
        username: z.string(),
        url: z.string().optional(),
        type: z.enum(["channel", "group"]),
        isRequired: z.boolean().default(false),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const [channel] = await db.insert(channels).values(input).$returningId();
      return channel;
    }),

  // Get all channels
  getChannels: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];

    return db.select().from(channels);
  }),

  // Update channel
  updateChannel: adminProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        isActive: z.boolean().optional(),
        isRequired: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const { id, ...data } = input;
      await db.update(channels).set(data).where(eq(channels.id, id));

      return { success: true };
    }),

  // Get settings
  getSettings: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return {};

    const allSettings = await db.select().from(settings);
    const result: Record<string, string> = {};
    for (const s of allSettings) {
      result[s.key] = s.value ?? "";
    }
    return result;
  }),

  // Update settings
  updateSettings: adminProcedure
    .input(z.record(z.string(), z.string()))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      for (const [key, value] of Object.entries(input)) {
        await db.insert(settings).values({ key, value }).onDuplicateKeyUpdate({
          set: { value },
        });
      }

      return { success: true };
    }),

  // Send broadcast message
  sendBroadcast: adminProcedure
    .input(z.object({ message: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db || !ctx.user) throw new Error("Database not available");

      // Create broadcast record
      const [broadcast] = await db.insert(broadcasts).values({
        message: input.message,
        sentBy: ctx.user.id,
      }).$returningId();

      // TODO: Actually send messages via Telegram bot
      // For now, just create the record
      return { success: true, broadcastId: broadcast };
    }),

  // Get broadcast history
  getBroadcasts: adminProcedure
    .input(z.object({ limit: z.number().default(20) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      return db.select().from(broadcasts).limit(input.limit);
    }),
});
