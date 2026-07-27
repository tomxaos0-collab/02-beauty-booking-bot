import { NextResponse } from "next/server";
import { Bot } from "grammy";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "8963823447:AAGAT--TJPHYZSfsvrGnt3CRDAWQXdMABJ8";
const bot = new Bot(BOT_TOKEN);

export async function POST(request: Request) {
  try {
    const update = await request.json();

    // Handle Inline Keyboard Callback Queries (Confirm / Cancel buttons)
    if (update.callback_query) {
      const callbackQuery = update.callback_query;
      const data = callbackQuery.data || "";
      const callbackQueryId = callbackQuery.id;

      if (data.startsWith("confirm_")) {
        const code = data.replace("confirm_", "");
        await bot.api.answerCallbackQuery(callbackQueryId, {
          text: `✅ Запись #${code} успешно ПОДТВЕРЖДЕНА!`,
          show_alert: true,
        });

        // Edit original message status tag
        if (callbackQuery.message) {
          const originalText = callbackQuery.message.text || callbackQuery.message.caption || "";
          const updatedText = originalText.replace(
            "<i>Статус: 🟡 Ожидает подтверждения студией</i>",
            "<i>Статус: ✅ ПОДТВЕРЖДЕНО СТУДИЕЙ</i>"
          );
          try {
            await bot.api.editMessageText(
              callbackQuery.message.chat.id,
              callbackQuery.message.message_id,
              updatedText,
              { parse_mode: "HTML" }
            );
          } catch (e) {}
        }
      } else if (data.startsWith("cancel_")) {
        const code = data.replace("cancel_", "");
        await bot.api.answerCallbackQuery(callbackQueryId, {
          text: `❌ Запись #${code} ОТМЕНЕНА студией!`,
          show_alert: true,
        });

        // Edit original message status tag
        if (callbackQuery.message) {
          const originalText = callbackQuery.message.text || callbackQuery.message.caption || "";
          const updatedText = originalText.replace(
            "<i>Статус: 🟡 Ожидает подтверждения студией</i>",
            "<i>Статус: 🔴 ОТМЕНЕНО СТУДИЕЙ</i>"
          );
          try {
            await bot.api.editMessageText(
              callbackQuery.message.chat.id,
              callbackQuery.message.message_id,
              updatedText,
              { parse_mode: "HTML" }
            );
          } catch (e) {}
        }
      } else {
        await bot.api.answerCallbackQuery(callbackQueryId, {
          text: "Действие обработано",
        });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Error in telegram webhook route:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
