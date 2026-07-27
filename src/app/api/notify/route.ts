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

    // Send notifications to all active admin Telegram IDs
    const recipients = adminRecipients || [{ telegramId: "849201948" }];
    const sendPromises = recipients.map(async (admin: any) => {
      if (admin.telegramId) {
        try {
          await bot.api.sendMessage(admin.telegramId, messageText, {
            parse_mode: "HTML",
          });
        } catch (err) {
          console.error(`Failed to send Telegram message to ${admin.telegramId}:`, err);
        }
      }
    });

    await Promise.all(sendPromises);

    return NextResponse.json({ success: true, message: "Notifications sent successfully" });
  } catch (error: any) {
    console.error("Error in notify API:", error);
    return NextResponse.json({ error: error.message || "Failed to notify" }, { status: 500 });
  }
}
