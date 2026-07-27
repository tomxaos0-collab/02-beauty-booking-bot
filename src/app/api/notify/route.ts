import { NextResponse } from "next/server";
import { Bot } from "grammy";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "8963823447:AAGAT--TJPHYZSfsvrGnt3CRDAWQXdMABJ8";
const bot = new Bot(BOT_TOKEN);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { booking, adminRecipients } = body;

    if (!booking) {
      return NextResponse.json({ error: "Booking data missing" }, { status: 400 });
    }

    const servicesList = booking.services
      ?.map((s: any) => `• ${s.name} (${s.price} ₽)`)
      .join("\n");

    const messageText = `
🔔 <b>НОВАЯ ЗАПИСЬ В САЛОН!</b> [#${booking.code}]

👤 <b>Клиент:</b> ${booking.clientName}
📞 <b>Телефон:</b> <code>${booking.clientPhone}</code>
💅 <b>Мастер:</b> ${booking.master?.name} (${booking.master?.role})
📍 <b>Салон:</b> ${booking.location?.name} (${booking.location?.address})
📅 <b>Дата и время:</b> ${booking.date}, ${booking.time}

✨ <b>Услуги:</b>
${servicesList}

💳 <b>Итого к оплате:</b> <b>${booking.totalPrice} ₽</b>
    `.trim();

    // Default recipients set to user's real Telegram ID 520913321
    const recipients = (adminRecipients && adminRecipients.length > 0)
      ? adminRecipients
      : [{ telegramId: "520913321", name: "Данил Болотин" }];

    const results = [];

    for (const admin of recipients) {
      const targetId = admin.telegramId || "520913321";
      try {
        const res = await bot.api.sendMessage(targetId, messageText, {
          parse_mode: "HTML",
        });
        results.push({ telegramId: targetId, status: "sent", messageId: res.message_id });
      } catch (err: any) {
        console.error(`Failed to send message to ${targetId}:`, err);
        results.push({ telegramId: targetId, status: "error", error: err.message });
      }
    }

    return NextResponse.json({ success: true, results });
  } catch (error: any) {
    console.error("Error in notify API:", error);
    return NextResponse.json({ error: error.message || "Failed to notify" }, { status: 500 });
  }
}
