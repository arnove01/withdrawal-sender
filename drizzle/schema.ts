import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  bigint,
  boolean,
  decimal,
  json,
  uniqueIndex,
  index,
} from "drizzle-orm/mysql-core";

/**
 * Core user table for Manus OAuth authentication.
 * Extended with Telegram-specific fields for the mini app.
 */
export const users = mysqlTable(
  "users",
  {
    id: int("id").autoincrement().primaryKey(),
    openId: varchar("openId", { length: 64 }).notNull().unique(),
    name: text("name"),
    email: varchar("email", { length: 320 }),
    loginMethod: varchar("loginMethod", { length: 64 }),
    role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
    lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
  },
  (table) => ({
    openIdIdx: uniqueIndex("openId_idx").on(table.openId),
  })
);

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Telegram users table - stores Telegram-specific user data
 * Linked to the main users table via openId or standalone
 */
export const telegramUsers = mysqlTable(
  "telegram_users",
  {
    id: int("id").autoincrement().primaryKey(),
    telegramId: varchar("telegramId", { length: 64 }).notNull().unique(),
    firstName: varchar("firstName", { length: 255 }),
    lastName: varchar("lastName", { length: 255 }),
    username: varchar("username", { length: 255 }),
    language: mysqlEnum("language", ["en", "bn"]).default("en").notNull(),
    coins: bigint("coins", { mode: "number" }).default(0).notNull(),
    totalEarned: bigint("totalEarned", { mode: "number" }).default(0).notNull(),
    level: int("level").default(1).notNull(),
    referralCode: varchar("referralCode", { length: 16 }).notNull().unique(),
    referredBy: int("referredBy"),
    referralCount: int("referralCount").default(0).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    telegramIdIdx: uniqueIndex("telegramId_idx").on(table.telegramId),
    referralCodeIdx: uniqueIndex("referralCode_idx").on(table.referralCode),
    levelIdx: index("level_idx").on(table.level),
    coinsIdx: index("coins_idx").on(table.coins),
  })
);

export type TelegramUser = typeof telegramUsers.$inferSelect;
export type InsertTelegramUser = typeof telegramUsers.$inferInsert;

/**
 * Referrals table - tracks referral relationships and rewards
 */
export const referrals = mysqlTable(
  "referrals",
  {
    id: int("id").autoincrement().primaryKey(),
    referrerId: int("referrerId").notNull(),
    referredUserId: int("referredUserId").notNull(),
    reward: bigint("reward", { mode: "number" }).default(0).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    referrerIdx: index("referrer_idx").on(table.referrerId),
    referredIdx: index("referred_idx").on(table.referredUserId),
  })
);

export type Referral = typeof referrals.$inferSelect;
export type InsertReferral = typeof referrals.$inferInsert;

/**
 * Channels table - required channels for force-join verification
 */
export const channels = mysqlTable(
  "channels",
  {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    username: varchar("username", { length: 255 }).notNull().unique(),
    url: varchar("url", { length: 512 }),
    type: mysqlEnum("type", ["channel", "group"]).default("channel").notNull(),
    isActive: boolean("isActive").default(true).notNull(),
    isRequired: boolean("isRequired").default(false).notNull(),
    sortOrder: int("sortOrder").default(0).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    usernameIdx: uniqueIndex("username_idx").on(table.username),
    activeIdx: index("active_idx").on(table.isActive),
  })
);

export type Channel = typeof channels.$inferSelect;
export type InsertChannel = typeof channels.$inferInsert;

/**
 * Tasks table - earning tasks for users
 */
export const tasks = mysqlTable(
  "tasks",
  {
    id: int("id").autoincrement().primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    reward: bigint("reward", { mode: "number" }).notNull(),
    type: mysqlEnum("type", ["daily", "one_time", "repeatable"]).default("daily").notNull(),
    isActive: boolean("isActive").default(true).notNull(),
    sortOrder: int("sortOrder").default(0).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    activeIdx: index("active_idx").on(table.isActive),
  })
);

export type Task = typeof tasks.$inferSelect;
export type InsertTask = typeof tasks.$inferInsert;

/**
 * User task completion - tracks which tasks users have completed
 */
export const userTaskCompletion = mysqlTable(
  "user_task_completion",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    taskId: int("taskId").notNull(),
    completedAt: timestamp("completedAt").defaultNow().notNull(),
  },
  (table) => ({
    userTaskIdx: index("user_task_idx").on(table.userId, table.taskId),
  })
);

export type UserTaskCompletion = typeof userTaskCompletion.$inferSelect;
export type InsertUserTaskCompletion = typeof userTaskCompletion.$inferInsert;

/**
 * Withdrawals table - user withdrawal requests
 */
export const withdrawals = mysqlTable(
  "withdrawals",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    amount: bigint("amount", { mode: "number" }).notNull(),
    paymentMethodId: int("paymentMethodId").notNull(),
    status: mysqlEnum("status", ["pending", "approved", "rejected", "completed"]).default("pending").notNull(),
    transactionId: varchar("transactionId", { length: 255 }),
    notes: text("notes"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    userIdx: index("user_idx").on(table.userId),
    statusIdx: index("status_idx").on(table.status),
  })
);

export type Withdrawal = typeof withdrawals.$inferSelect;
export type InsertWithdrawal = typeof withdrawals.$inferInsert;

/**
 * Payment methods table - user's saved payment accounts
 */
export const paymentMethods = mysqlTable(
  "payment_methods",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    type: mysqlEnum("type", ["bkash", "nagad", "rocket", "bank", "paypal"]).notNull(),
    accountNumber: varchar("accountNumber", { length: 255 }).notNull(),
    accountName: varchar("accountName", { length: 255 }),
    isDefault: boolean("isDefault").default(false).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    userIdx: index("user_idx").on(table.userId),
  })
);

export type PaymentMethod = typeof paymentMethods.$inferSelect;
export type InsertPaymentMethod = typeof paymentMethods.$inferInsert;

/**
 * Promo codes table - discount/bonus codes
 */
export const promoCodes = mysqlTable(
  "promo_codes",
  {
    id: int("id").autoincrement().primaryKey(),
    code: varchar("code", { length: 64 }).notNull().unique(),
    reward: bigint("reward", { mode: "number" }).notNull(),
    maxUses: int("maxUses"),
    currentUses: int("currentUses").default(0).notNull(),
    expiresAt: timestamp("expiresAt"),
    isActive: boolean("isActive").default(true).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    codeIdx: uniqueIndex("code_idx").on(table.code),
    activeIdx: index("active_idx").on(table.isActive),
  })
);

export type PromoCode = typeof promoCodes.$inferSelect;
export type InsertPromoCode = typeof promoCodes.$inferInsert;

/**
 * User promo code usage - tracks which users have used which codes
 */
export const userPromoCodeUsage = mysqlTable(
  "user_promo_code_usage",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    promoCodeId: int("promoCodeId").notNull(),
    usedAt: timestamp("usedAt").defaultNow().notNull(),
  },
  (table) => ({
    userPromoIdx: index("user_promo_idx").on(table.userId, table.promoCodeId),
  })
);

export type UserPromoCodeUsage = typeof userPromoCodeUsage.$inferSelect;
export type InsertUserPromoCodeUsage = typeof userPromoCodeUsage.$inferInsert;

/**
 * Ad tasks table - advertising tasks for earning
 */
export const adTasks = mysqlTable(
  "ad_tasks",
  {
    id: int("id").autoincrement().primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    reward: bigint("reward", { mode: "number" }).notNull(),
    adUrl: varchar("adUrl", { length: 512 }).notNull(),
    isActive: boolean("isActive").default(true).notNull(),
    sortOrder: int("sortOrder").default(0).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    activeIdx: index("active_idx").on(table.isActive),
  })
);

export type AdTask = typeof adTasks.$inferSelect;
export type InsertAdTask = typeof adTasks.$inferInsert;

/**
 * User ad task completion - tracks which ad tasks users have completed
 */
export const userAdTaskCompletion = mysqlTable(
  "user_ad_task_completion",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    adTaskId: int("adTaskId").notNull(),
    completedAt: timestamp("completedAt").defaultNow().notNull(),
  },
  (table) => ({
    userAdTaskIdx: index("user_ad_task_idx").on(table.userId, table.adTaskId),
  })
);

export type UserAdTaskCompletion = typeof userAdTaskCompletion.$inferSelect;
export type InsertUserAdTaskCompletion = typeof userAdTaskCompletion.$inferInsert;

/**
 * Monetag integration - user monetag accounts
 */
export const monetagAccounts = mysqlTable(
  "monetag_accounts",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    monetagUserId: varchar("monetagUserId", { length: 255 }).notNull().unique(),
    balance: decimal("balance", { precision: 10, scale: 2 }).default("0").notNull(),
    lastSyncedAt: timestamp("lastSyncedAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    userIdx: index("user_idx").on(table.userId),
    monetagUserIdIdx: uniqueIndex("monetag_user_id_idx").on(table.monetagUserId),
  })
);

export type MonetageAccount = typeof monetagAccounts.$inferSelect;
export type InsertMonetageAccount = typeof monetagAccounts.$inferInsert;

/**
 * Achievements table - user achievements/badges
 */
export const achievements = mysqlTable(
  "achievements",
  {
    id: int("id").autoincrement().primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    icon: varchar("icon", { length: 512 }),
    requirement: int("requirement").notNull(),
    rewardCoins: bigint("rewardCoins", { mode: "number" }).default(0).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  }
);

export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = typeof achievements.$inferInsert;

/**
 * User achievements - tracks which achievements users have unlocked
 */
export const userAchievements = mysqlTable(
  "user_achievements",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    achievementId: int("achievementId").notNull(),
    unlockedAt: timestamp("unlockedAt").defaultNow().notNull(),
  },
  (table) => ({
    userAchievementIdx: index("user_achievement_idx").on(table.userId, table.achievementId),
  })
);

export type UserAchievement = typeof userAchievements.$inferSelect;
export type InsertUserAchievement = typeof userAchievements.$inferInsert;

/**
 * Leaderboard - cached leaderboard data for performance
 */
export const leaderboard = mysqlTable(
  "leaderboard",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull().unique(),
    rank: int("rank").notNull(),
    totalCoins: bigint("totalCoins", { mode: "number" }).notNull(),
    lastUpdatedAt: timestamp("lastUpdatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    rankIdx: index("rank_idx").on(table.rank),
    userIdIdx: uniqueIndex("user_id_idx").on(table.userId),
  })
);

export type LeaderboardEntry = typeof leaderboard.$inferSelect;
export type InsertLeaderboardEntry = typeof leaderboard.$inferInsert;

/**
 * Spin wheel entries - rewards for the spin wheel game
 */
export const spinWheelEntries = mysqlTable(
  "spin_wheel_entries",
  {
    id: int("id").autoincrement().primaryKey(),
    label: varchar("label", { length: 255 }).notNull(),
    reward: bigint("reward", { mode: "number" }).notNull(),
    probability: decimal("probability", { precision: 5, scale: 2 }).notNull(),
    isActive: boolean("isActive").default(true).notNull(),
    sortOrder: int("sortOrder").default(0).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    activeIdx: index("active_idx").on(table.isActive),
  })
);

export type SpinWheelEntry = typeof spinWheelEntries.$inferSelect;
export type InsertSpinWheelEntry = typeof spinWheelEntries.$inferInsert;

/**
 * User spin history - tracks spin wheel results
 */
export const userSpinHistory = mysqlTable(
  "user_spin_history",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    spinWheelEntryId: int("spinWheelEntryId").notNull(),
    reward: bigint("reward", { mode: "number" }).notNull(),
    spunAt: timestamp("spunAt").defaultNow().notNull(),
  },
  (table) => ({
    userIdx: index("user_idx").on(table.userId),
  })
);

export type UserSpinHistory = typeof userSpinHistory.$inferSelect;
export type InsertUserSpinHistory = typeof userSpinHistory.$inferInsert;

/**
 * Settings table - global app settings
 */
export const settings = mysqlTable("settings", {
  id: int("id").autoincrement().primaryKey(),
  key: varchar("key", { length: 255 }).notNull().unique(),
  value: text("value"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Setting = typeof settings.$inferSelect;
export type InsertSetting = typeof settings.$inferInsert;

/**
 * Broadcast messages - admin broadcast history
 */
export const broadcasts = mysqlTable(
  "broadcasts",
  {
    id: int("id").autoincrement().primaryKey(),
    message: text("message").notNull(),
    sentBy: int("sentBy").notNull(),
    totalSent: int("totalSent").default(0).notNull(),
    totalFailed: int("totalFailed").default(0).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    sentByIdx: index("sent_by_idx").on(table.sentBy),
  })
);

export type Broadcast = typeof broadcasts.$inferSelect;
export type InsertBroadcast = typeof broadcasts.$inferInsert;

/**
 * Logs table - activity logging
 */
export const logs = mysqlTable(
  "logs",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId"),
    action: varchar("action", { length: 255 }).notNull(),
    details: json("details"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    userIdx: index("user_idx").on(table.userId),
    actionIdx: index("action_idx").on(table.action),
  })
);

export type Log = typeof logs.$inferSelect;
export type InsertLog = typeof logs.$inferInsert;
