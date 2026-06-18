import { eq, and, desc, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, telegramUsers, TelegramUser, InsertTelegramUser, channels, tasks, paymentMethods, withdrawals, promoCodes, leaderboard, settings } from "../drizzle/schema";
import { ENV } from './_core/env';
import { nanoid } from "nanoid";

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

// ============ Telegram User Functions ============

export async function getOrCreateTelegramUser(
  telegramId: string,
  firstName: string,
  lastName?: string,
  username?: string,
  languageCode?: string,
  referralCode?: string
): Promise<{ user: TelegramUser; isNew: boolean }> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await db.select().from(telegramUsers).where(eq(telegramUsers.telegramId, telegramId)).limit(1);
  if (existing.length > 0) return { user: existing[0], isNew: false };

  const code = nanoid(8).toUpperCase();
  let referrerId: number | undefined;
  
  if (referralCode) {
    const [referrer] = await db.select().from(telegramUsers).where(eq(telegramUsers.referralCode, referralCode)).limit(1);
    if (referrer && referrer.telegramId !== telegramId) referrerId = referrer.id;
  }

  const referralReward = parseInt(await getSetting("referral_reward") || "100");
  const result = await db.insert(telegramUsers).values({
    telegramId,
    firstName,
    lastName,
    username,
    referralCode: code,
    referredBy: referrerId,
    coins: referrerId ? referralReward : 0,
    totalEarned: referrerId ? referralReward : 0,
    language: languageCode === "bn" ? "bn" : "en",
  });
  const newUser = (await db.select().from(telegramUsers).where(eq(telegramUsers.telegramId, telegramId)).limit(1))[0];

  if (referrerId) {
    await db.update(telegramUsers)
      .set({
        coins: sql`coins + ${referralReward}`,
        totalEarned: sql`total_earned + ${referralReward}`,
        referralCount: sql`referral_count + 1`,
      })
      .where(eq(telegramUsers.id, referrerId));
  }

  return { user: newUser, isNew: true };
}

export async function getTelegramUserById(id: number): Promise<TelegramUser | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(telegramUsers).where(eq(telegramUsers.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getTelegramUserByTelegramId(telegramId: string): Promise<TelegramUser | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(telegramUsers).where(eq(telegramUsers.telegramId, telegramId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateTelegramUserCoins(userId: number, amount: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.update(telegramUsers)
    .set({
      coins: sql`coins + ${amount}`,
      totalEarned: sql`total_earned + ${Math.max(0, amount)}`,
    })
    .where(eq(telegramUsers.id, userId));
}

// ============ Settings Functions ============

export async function getSetting(key: string): Promise<string> {
  const db = await getDb();
  if (!db) return "";
  const [s] = await db.select().from(settings).where(eq(settings.key, key)).limit(1);
  return s?.value ?? "";
}

export async function setSetting(key: string, value: string): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.insert(settings).values({ key, value }).onDuplicateKeyUpdate({
    set: { value },
  });
}

// ============ Channel Functions ============

export async function getRequiredChannels() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(channels)
    .where(and(eq(channels.isActive, true), eq(channels.isRequired, true)))
    .orderBy(channels.sortOrder, channels.id);
}

export async function getAllChannels() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(channels).orderBy(channels.sortOrder, channels.id);
}

// ============ Task Functions ============

export async function getActiveTasks() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(tasks).where(eq(tasks.isActive, true)).orderBy(tasks.sortOrder);
}

// ============ Payment Methods Functions ============

export async function getUserPaymentMethods(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(paymentMethods).where(eq(paymentMethods.userId, userId));
}

export async function getDefaultPaymentMethod(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(paymentMethods)
    .where(and(eq(paymentMethods.userId, userId), eq(paymentMethods.isDefault, true)))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ============ Withdrawal Functions ============

export async function createWithdrawal(userId: number, amount: number, paymentMethodId: number) {
  const db = await getDb();
  if (!db) return undefined;
  await db.insert(withdrawals).values({
    userId,
    amount,
    paymentMethodId,
    status: "pending",
  });
  const result = await db.select().from(withdrawals).where(and(eq(withdrawals.userId, userId), eq(withdrawals.amount, amount))).orderBy(desc(withdrawals.createdAt)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getPendingWithdrawals() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(withdrawals).where(eq(withdrawals.status, "pending"));
}

// ============ Promo Code Functions ============

export async function validateAndUsePromoCode(userId: number, code: string): Promise<{ valid: boolean; reward?: number; message: string }> {
  const db = await getDb();
  if (!db) return { valid: false, message: "Database not available" };

  const [promoCode] = await db.select().from(promoCodes).where(eq(promoCodes.code, code)).limit(1);
  
  if (!promoCode) return { valid: false, message: "Promo code not found" };
  if (!promoCode.isActive) return { valid: false, message: "Promo code is not active" };
  if (promoCode.expiresAt && new Date(promoCode.expiresAt) < new Date()) {
    return { valid: false, message: "Promo code has expired" };
  }
  if (promoCode.maxUses && promoCode.currentUses >= promoCode.maxUses) {
    return { valid: false, message: "Promo code has reached maximum uses" };
  }

  // Check if user already used this code
  const userUsage = await db.select().from(telegramUsers).where(eq(telegramUsers.id, userId)).limit(1);
  if (userUsage.length === 0) return { valid: false, message: "User not found" };

  return { valid: true, reward: promoCode.reward, message: "Promo code is valid" };
}

// ============ Leaderboard Functions ============

export async function getTopLeaderboard(limit: number = 10) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(leaderboard).orderBy(leaderboard.rank).limit(limit);
}

export async function getUserLeaderboardRank(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(leaderboard).where(eq(leaderboard.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}
