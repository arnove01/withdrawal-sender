import { describe, it, expect } from "vitest";

describe("Telegram Bot Token Validation", () => {
  it("should validate bot token format", async () => {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    
    // Check if token exists
    expect(token).toBeDefined();
    expect(token).not.toBe("");
    
    // Check token format (should be numeric:alphanumeric)
    const tokenRegex = /^\d+:[A-Za-z0-9_-]+$/;
    expect(token).toMatch(tokenRegex);
  });

  it("should be able to call Telegram API with the token", async () => {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) {
      throw new Error("TELEGRAM_BOT_TOKEN not set");
    }

    try {
      const response = await fetch(`https://api.telegram.org/bot${token}/getMe`, {
        method: "GET",
      });

      const data = (await response.json()) as any;
      
      // Check if API call was successful
      expect(data.ok).toBe(true);
      expect(data.result).toBeDefined();
      expect(data.result.is_bot).toBe(true);
      
      console.log(`✓ Bot verified: @${data.result.username}`);
    } catch (error) {
      throw new Error(`Failed to validate bot token: ${error}`);
    }
  });
});
