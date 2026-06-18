import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { telegramUsers, tasks, leaderboard, withdrawals, paymentMethods, promoCodes } from "../../drizzle/schema";
import { eq, desc, and } from "drizzle-orm";

export const miniappRouter = router({
  // Get user profile
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db || !ctx.user) return null;

    // For now, return mock data - in production, you'd fetch from telegram_users table
    return {
      id: ctx.user.id,
      name: ctx.user.name,
      coins: 1250,
      totalEarned: 5800,
      level: 5,
      referralCode: "ABC123",
      referralCount: 12,
    };
  }),

  // Get active tasks
  getTasks: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];

    return db.select().from(tasks).where(eq(tasks.isActive, true)).orderBy(tasks.sortOrder);
  }),

  // Complete a task
  completeTask: protectedProcedure
    .input(z.object({ taskId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new Error("Not authenticated");
      // TODO: Implement task completion logic
      return { success: true };
    }),

  // Get leaderboard
  getLeaderboard: publicProcedure
    .input(z.object({ limit: z.number().default(10) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      return db.select().from(leaderboard).orderBy(leaderboard.rank).limit(input.limit);
    }),

  // Get user's leaderboard rank
  getUserRank: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db || !ctx.user) return null;

    // TODO: Fetch user's rank from leaderboard
    return { rank: 45, totalCoins: 1250 };
  }),

  // Get payment methods
  getPaymentMethods: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db || !ctx.user) return [];

    // TODO: Fetch from database
    return [];
  }),

  // Add payment method
  addPaymentMethod: protectedProcedure
    .input(
      z.object({
        type: z.enum(["bkash", "nagad", "rocket", "bank", "paypal"]),
        accountNumber: z.string(),
        accountName: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new Error("Not authenticated");
      // TODO: Implement payment method addition
      return { success: true };
    }),

  // Request withdrawal
  requestWithdrawal: protectedProcedure
    .input(
      z.object({
        amount: z.number(),
        paymentMethodId: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new Error("Not authenticated");
      // TODO: Implement withdrawal request
      return { success: true, withdrawalId: 1 };
    }),

  // Validate promo code
  validatePromoCode: protectedProcedure
    .input(z.object({ code: z.string() }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new Error("Not authenticated");
      // TODO: Implement promo code validation
      return { valid: true, reward: 100 };
    }),

  // Spin wheel
  spinWheel: protectedProcedure.mutation(async ({ ctx }) => {
    if (!ctx.user) throw new Error("Not authenticated");
    // TODO: Implement spin wheel logic
    return { reward: 250, label: "Lucky Prize" };
  }),
});
