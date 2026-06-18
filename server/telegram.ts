import { Router, Request, Response } from "express";
import { getDb } from "./db";
import {
  getOrCreateTelegramUser,
  getTelegramUserByTelegramId,
  getSetting,
  getRequiredChannels,
  updateTelegramUserCoins,
} from "./db";
import { telegramUsers, referrals } from "../drizzle/schema";
import { eq } from "drizzle-orm";

const router = Router();

const TEXTS: Record<string, Record<string, string>> = {
  en: {
    select_lang: "🌍 <b>Welcome!</b>\n\nPlease select your language:",
    lang_en: "🇬🇧 English",
    lang_bn: "🇧🇩 বাংলা",
    join_title: "📢 <b>Join Required Channels</b>\n\nYou must join ALL channels below to use the bot:",
    join_item_joined: "✅",
    join_item_not_joined: "❌",
    btn_join: "➕ Join",
    btn_verify: "✅ I've Joined — Verify",
    btn_open_app: "🚀 Open Mini App",
    btn_invite: "👥 Invite Friends",
    btn_balance: "💰 Check Balance",
    all_joined: "✅ <b>All channels verified!</b>\n\nWelcome to <b>{botName}</b>, {name}! 🎉\n\n🪙 Balance: <b>{coins} YZ</b>\n\n👇 Open the app to start earning:",
    not_all_joined: "❌ <b>Please join all required channels first!</b>\n\nYou haven't joined:\n{missing}\n\nClick the join buttons above, then click Verify again.",
    welcome_new: "🎉 <b>Welcome to {botName}, {name}!</b>\n\n{welcomeMsg}\n\n🪙 Balance: <b>{coins} YZ</b>\n\n👇 Join the channels below to start:",
    welcome_back: "👋 <b>Welcome back, {name}!</b>\n\n🪙 Balance: <b>{coins} YZ</b>\n💎 Total Earned: <b>{totalEarned} YZ</b>",
    balance_msg: "💰 <b>Your Balance</b>\n\n🪙 YZ: <b>{coins}</b>\n💎 Total Earned: <b>{totalEarned}</b>\n🏆 Level: <b>{level}</b>",
    referral_msg: "👥 <b>Invite Friends & Earn!</b>\n\nShare your link and earn for every friend who joins!\n\n🔗 Your Link:\n<code>{link}</code>",
    help_msg: "ℹ️ <b>{botName} Help</b>\n\n/start — Start / register\n/app — Open Mini App\n/balance — Check your balance\n/referral — Get referral link\n/help — This help message",
  },
  bn: {
    select_lang: "🌍 <b>স্বাগতম!</b>\n\nঅনুগ্রহ করে আপনার ভাষা নির্বাচন করুন:",
    lang_en: "🇬🇧 English",
    lang_bn: "🇧🇩 বাংলা",
    join_title: "📢 <b>প্রয়োজনীয় চ্যানেলে যোগ দিন</b>\n\nবট ব্যবহার করতে নিচের সকল চ্যানেলে যোগ দিতে হবে:",
    join_item_joined: "✅",
    join_item_not_joined: "❌",
    btn_join: "➕ যোগ দিন",
    btn_verify: "✅ যোগ দিয়েছি — যাচাই করুন",
    btn_open_app: "🚀 মিনি অ্যাপ খুলুন",
    btn_invite: "👥 বন্ধুদের আমন্ত্রণ করুন",
    btn_balance: "💰 ব্যালেন্স চেক করুন",
    all_joined: "✅ <b>সব চ্যানেল যাচাই হয়েছে!</b>\n\n<b>{botName}</b>-এ স্বাগতম, {name}! 🎉\n\n🪙 ব্যালেন্স: <b>{coins} YZ</b>\n\n👇 উপার্জন শুরু করতে অ্যাপ খুলুন:",
    not_all_joined: "❌ <b>প্রথমে সব প্রয়োজনীয় চ্যানেলে যোগ দিন!</b>\n\nযোগ দেননি:\n{missing}\n\nউপরের বোতামে ক্লিক করে যোগ দিন, তারপর আবার যাচাই করুন।",
    welcome_new: "🎉 <b>{botName}-এ স্বাগতম, {name}!</b>\n\n{welcomeMsg}\n\n🪙 ব্যালেন্স: <b>{coins} YZ</b>\n\n👇 শুরু করতে নিচের চ্যানেলে যোগ দিন:",
    welcome_back: "👋 <b>আবার স্বাগতম, {name}!</b>\n\n🪙 ব্যালেন্স: <b>{coins} YZ</b>\n💎 মোট উপার্জন: <b>{totalEarned} YZ</b>",
    balance_msg: "💰 <b>আপনার ব্যালেন্স</b>\n\n🪙 YZ: <b>{coins}</b>\n💎 মোট উপার্জন: <b>{totalEarned}</b>\n🏆 লেভেল: <b>{level}</b>",
    referral_msg: "👥 <b>বন্ধুদের আমন্ত্রণ করুন ও উপার্জন করুন!</b>\n\nআপনার লিংক শেয়ার করুন!\n\n🔗 আপনার লিংক:\n<code>{link}</code>",
    help_msg: "ℹ️ <b>{botName} সাহায্য</b>\n\n/start — শুরু করুন / রেজিস্টার করুন\n/app — মিনি অ্যাপ খুলুন\n/balance — ব্যালেন্স চেক করুন\n/referral — রেফারেল লিংক পান\n/help — এই সাহায্য বার্তা",
  },
};

function t(lang: string, key: string, vars?: Record<string, string | number | null | undefined>): string {
  const langMap = TEXTS[lang] ?? TEXTS.en;
  let text = langMap[key] ?? TEXTS.en[key] ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      text = text.replaceAll(`{${k}}`, String(v ?? ""));
    }
  }
  return text;
}

async function callTelegram(method: string, body: object): Promise<any> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.error("[TG] No bot token");
    return null;
  }
  try {
    const r = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = (await r.json()) as any;
    if (!data.ok) {
      console.error(`[TG] ${method} failed:`, JSON.stringify(data));
    }
    return data;
  } catch (err) {
    console.error(`[TG] ${method} threw:`, err);
    return null;
  }
}

async function sendMessage(chatId: number | string, text: string, extra?: object) {
  await callTelegram("sendMessage", { chat_id: chatId, text, parse_mode: "HTML", ...extra });
}

async function answerCallbackQuery(callbackQueryId: string, text?: string, showAlert?: boolean) {
  await callTelegram("answerCallbackQuery", { callback_query_id: callbackQueryId, text, show_alert: showAlert });
}

async function checkTelegramMembership(telegramId: string, username: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.warn("[TG] No bot token for membership check");
    return false;
  }
  try {
    const chatId = username.startsWith("@") ? username : `@${username}`;
    const r = await fetch(
      `https://api.telegram.org/bot${token}/getChatMember?chat_id=${encodeURIComponent(chatId)}&user_id=${telegramId}`
    );
    if (!r.ok) {
      console.warn(`[TG] Membership check failed for ${username}:`, r.status);
      return false;
    }
    const data = (await r.json()) as { ok: boolean; result?: { status: string } };
    if (!data.ok || !data.result) {
      console.warn(`[TG] Membership check error for ${username}:`, data);
      return false;
    }
    const { status } = data.result;
    return status === "creator" || status === "administrator" || status === "member" || status === "restricted";
  } catch (err) {
    console.warn(`[TG] Membership check exception for ${username}:`, err);
    return false;
  }
}

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

interface TelegramMessage {
  message_id: number;
  from?: TelegramUser;
  chat: { id: number; type: string };
  text?: string;
}

interface TelegramCallbackQuery {
  id: string;
  from: TelegramUser;
  message?: TelegramMessage;
  data?: string;
}

interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
  callback_query?: TelegramCallbackQuery;
}

async function handleMessage(msg: TelegramMessage) {
  const from = msg.from;
  if (!from || msg.chat.type !== "private") return;

  const chatId = msg.chat.id;
  const text = msg.text ?? "";

  if (text.startsWith("/start")) {
    const parts = text.split(" ");
    const refCode = parts[1] ?? "";

    const existing = await getTelegramUserByTelegramId(String(from.id));
    if (existing) {
      // User already registered
      const lang = existing.language ?? "en";
      const channels = await getRequiredChannels();

      if (channels.length === 0) {
        const appUrl = `${process.env.APP_URL || "https://example.com"}/app`;
        const botName = (await getSetting("bot_name")) || "YZ Earn";
        await sendMessage(
          chatId,
          t(lang, "welcome_back", { name: existing.firstName, coins: existing.coins, totalEarned: existing.totalEarned, botName }),
          {
            reply_markup: {
              inline_keyboard: [
                [{ text: t(lang, "btn_open_app"), web_app: { url: appUrl } }],
                [{ text: t(lang, "btn_invite"), callback_data: "referral" }],
                [{ text: t(lang, "btn_balance"), callback_data: "balance" }],
              ],
            },
          }
        );
      } else {
        // Check channel membership
        const memberChecks = await Promise.all(
          channels.map(async (ch) => ({
            channel: ch,
            isMember: await checkTelegramMembership(existing.telegramId, ch.username),
          }))
        );

        const allJoined = memberChecks.every((m) => m.isMember);
        const appUrl = `${process.env.APP_URL || "https://example.com"}/app`;
        const botName = (await getSetting("bot_name")) || "YZ Earn";

        if (allJoined) {
          await sendMessage(
            chatId,
            t(lang, "all_joined", { name: existing.firstName, coins: existing.coins, botName }),
            {
              reply_markup: {
                inline_keyboard: [
                  [{ text: t(lang, "btn_open_app"), web_app: { url: appUrl } }],
                  [{ text: t(lang, "btn_invite"), callback_data: "referral" }],
                ],
              },
            }
          );
        } else {
          let msgText = t(lang, "join_title") + "\n\n";
          for (const { channel, isMember } of memberChecks) {
            const icon = isMember ? t(lang, "join_item_joined") : t(lang, "join_item_not_joined");
            const chType = channel.type === "group" ? "👥" : "📢";
            msgText += `${icon} ${chType} <b>${channel.name}</b>\n`;
          }

          const joinButtons = memberChecks
            .filter((m) => !m.isMember)
            .map((m) => [
              {
                text: `${t(lang, "btn_join")} ${m.channel.name}`,
                url: m.channel.url ?? `https://t.me/${m.channel.username}`,
              },
            ]);

          const keyboard = [...joinButtons, [{ text: t(lang, "btn_verify"), callback_data: "verify_membership" }]];

          await sendMessage(chatId, msgText, { reply_markup: { inline_keyboard: keyboard } });
        }
      }
      return;
    }

    // New user - show language selection
    await sendMessage(chatId, t("en", "select_lang"), {
      reply_markup: {
        inline_keyboard: [
          [
            { text: t("en", "lang_en"), callback_data: `set_lang:en:${refCode}` },
            { text: t("en", "lang_bn"), callback_data: `set_lang:bn:${refCode}` },
          ],
        ],
      },
    });
    return;
  }

  if (text === "/app" || text === "/earn") {
    const user = await getTelegramUserByTelegramId(String(from.id));
    if (!user) {
      await sendMessage(chatId, "Please use /start first");
      return;
    }
    const lang = user.language ?? "en";
    const appUrl = `${process.env.APP_URL || "https://example.com"}/app`;
    await sendMessage(chatId, "👇", {
      reply_markup: { inline_keyboard: [[{ text: t(lang, "btn_open_app"), web_app: { url: appUrl } }]] },
    });
    return;
  }

  if (text === "/balance") {
    const user = await getTelegramUserByTelegramId(String(from.id));
    if (!user) {
      await sendMessage(chatId, "Please use /start first");
      return;
    }
    const lang = user.language ?? "en";
    await sendMessage(
      chatId,
      t(lang, "balance_msg", { coins: user.coins, totalEarned: user.totalEarned, level: user.level })
    );
    return;
  }

  if (text === "/referral" || text === "/refer" || text === "/invite") {
    const user = await getTelegramUserByTelegramId(String(from.id));
    if (!user) {
      await sendMessage(chatId, "Please use /start first");
      return;
    }
    const lang = user.language ?? "en";
    const botUsername = (await getSetting("bot_username")) || "YZ_EARN_BOT";
    const refLink = `https://t.me/${botUsername}?start=${user.referralCode}`;
    await sendMessage(chatId, t(lang, "referral_msg", { link: refLink }), {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: lang === "bn" ? "📤 শেয়ার করুন" : "📤 Share Link",
              switch_inline_query: refLink,
            },
          ],
        ],
      },
    });
    return;
  }

  if (text === "/help") {
    const botName = (await getSetting("bot_name")) || "YZ Earn";
    await sendMessage(chatId, t("en", "help_msg", { botName }));
    return;
  }
}

async function handleCallbackQuery(cbq: TelegramCallbackQuery) {
  const from = cbq.from;
  const chatId = cbq.message?.chat.id || from.id;
  const data = cbq.data ?? "";

  if (data.startsWith("set_lang:")) {
    const parts = data.split(":");
    const lang = (parts[1] ?? "en") as "en" | "bn";
    const refCode = parts[2] ?? "";

    const { user, isNew } = await getOrCreateTelegramUser(
      String(from.id),
      from.first_name,
      from.last_name,
      from.username,
      lang,
      refCode || undefined
    );

    await answerCallbackQuery(cbq.id, "Language set!");

    // Now show welcome/channel join flow
    const channels = await getRequiredChannels();

    if (channels.length === 0) {
      const appUrl = `${process.env.APP_URL || "https://example.com"}/app`;
      const botName = (await getSetting("bot_name")) || "YZ Earn";
      await sendMessage(
        chatId,
        t(lang, "welcome_back", { name: user.firstName, coins: user.coins, totalEarned: user.totalEarned, botName }),
        {
          reply_markup: {
            inline_keyboard: [
              [{ text: t(lang, "btn_open_app"), web_app: { url: appUrl } }],
              [{ text: t(lang, "btn_invite"), callback_data: "referral" }],
              [{ text: t(lang, "btn_balance"), callback_data: "balance" }],
            ],
          },
        }
      );
    } else {
      // Check channel membership
      const memberChecks = await Promise.all(
        channels.map(async (ch) => ({
          channel: ch,
          isMember: await checkTelegramMembership(user.telegramId, ch.username),
        }))
      );

      const allJoined = memberChecks.every((m) => m.isMember);
      const appUrl = `${process.env.APP_URL || "https://example.com"}/app`;
      const botName = (await getSetting("bot_name")) || "YZ Earn";

      if (allJoined) {
        await sendMessage(
          chatId,
          t(lang, "all_joined", { name: user.firstName, coins: user.coins, botName }),
          {
            reply_markup: {
              inline_keyboard: [
                [{ text: t(lang, "btn_open_app"), web_app: { url: appUrl } }],
                [{ text: t(lang, "btn_invite"), callback_data: "referral" }],
              ],
            },
          }
        );
      } else {
        let msgText = t(lang, "join_title") + "\n\n";
        for (const { channel, isMember } of memberChecks) {
          const icon = isMember ? t(lang, "join_item_joined") : t(lang, "join_item_not_joined");
          const chType = channel.type === "group" ? "👥" : "📢";
          msgText += `${icon} ${chType} <b>${channel.name}</b>\n`;
        }

        const joinButtons = memberChecks
          .filter((m) => !m.isMember)
          .map((m) => [
            {
              text: `${t(lang, "btn_join")} ${m.channel.name}`,
              url: m.channel.url ?? `https://t.me/${m.channel.username}`,
            },
          ]);

        const keyboard = [...joinButtons, [{ text: t(lang, "btn_verify"), callback_data: "verify_membership" }]];

        await sendMessage(chatId, msgText, { reply_markup: { inline_keyboard: keyboard } });
      }
    }
    return;
  }

  if (data === "verify_membership") {
    const user = await getTelegramUserByTelegramId(String(from.id));
    if (!user) {
      await answerCallbackQuery(cbq.id, "User not found", true);
      return;
    }

    const lang = user.language ?? "en";
    const channels = await getRequiredChannels();
    const memberChecks = await Promise.all(
      channels.map(async (ch) => ({
        channel: ch,
        isMember: await checkTelegramMembership(user.telegramId, ch.username),
      }))
    );

    const allJoined = memberChecks.every((m) => m.isMember);
    const appUrl = `${process.env.APP_URL || "https://example.com"}/app`;
    const botName = (await getSetting("bot_name")) || "YZ Earn";

    if (allJoined) {
      await answerCallbackQuery(cbq.id, "All channels verified!");
      await sendMessage(
        chatId,
        t(lang, "all_joined", { name: user.firstName, coins: user.coins, botName }),
        {
          reply_markup: {
            inline_keyboard: [
              [{ text: t(lang, "btn_open_app"), web_app: { url: appUrl } }],
              [{ text: t(lang, "btn_invite"), callback_data: "referral" }],
            ],
          },
        }
      );
    } else {
      const missing = memberChecks
        .filter((m) => !m.isMember)
        .map((m) => `• ${m.channel.name}`)
        .join("\n");
      await answerCallbackQuery(cbq.id, "Please join all channels first", true);
      await sendMessage(chatId, t(lang, "not_all_joined", { missing }));
    }
    return;
  }

  if (data === "referral") {
    const user = await getTelegramUserByTelegramId(String(from.id));
    if (!user) return;
    const lang = user.language ?? "en";
    const botUsername = (await getSetting("bot_username")) || "YZ_EARN_BOT";
    const refLink = `https://t.me/${botUsername}?start=${user.referralCode}`;
    await sendMessage(chatId, t(lang, "referral_msg", { link: refLink }), {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: lang === "bn" ? "📤 শেয়ার করুন" : "📤 Share Link",
              switch_inline_query: refLink,
            },
          ],
        ],
      },
    });
    return;
  }

  if (data === "balance") {
    const user = await getTelegramUserByTelegramId(String(from.id));
    if (!user) return;
    const lang = user.language ?? "en";
    await sendMessage(
      chatId,
      t(lang, "balance_msg", { coins: user.coins, totalEarned: user.totalEarned, level: user.level })
    );
    return;
  }
}

router.post("/webhook", async (req: Request, res: Response) => {
  res.sendStatus(200);

  const update = req.body as TelegramUpdate;
  console.log(`[TG] update #${update.update_id}`);

  try {
    if (update.message) await handleMessage(update.message);
    else if (update.callback_query) await handleCallbackQuery(update.callback_query);
  } catch (err) {
    console.error("[TG] webhook handler error:", err);
  }
});

export async function setupBot(): Promise<{ ok: boolean; webhookUrl?: string; error?: string; description?: string }> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const appUrl = process.env.APP_URL;

  if (!token || !appUrl) {
    return { ok: false, error: "Missing TELEGRAM_BOT_TOKEN or APP_URL" };
  }

  const webhookUrl = `${appUrl}/api/telegram/webhook`;

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: webhookUrl }),
    });

    const data = (await response.json()) as any;
    if (data.ok) {
      return { ok: true, webhookUrl };
    } else {
      return { ok: false, error: data.error_code, description: data.description };
    }
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

export default router;
