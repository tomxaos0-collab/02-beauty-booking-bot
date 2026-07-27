import { NextResponse } from "next/server";
import { Bot, InlineKeyboard } from "grammy";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "8963823447:AAGAT--TJPHYZSfsvrGnt3CRDAWQXdMABJ8";
const bot = new Bot(BOT_TOKEN);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { booking, adminRecipients } = body;

    if (!booking) {
      return NextResponse.json({ error: "Booking data missing" }, { status: 400 });
    }

    const servicesFormatted = booking.services
      ?.map((s: any) => `  💎 <b>${s.name}</b> — <code>${s.price.toLocaleString("ru-RU")} ₽</code>`)
      .join("\n");

    const messageText = `
✨ <b>AURA BEAUTY — НОВАЯ ЗАПИСЬ</b> ✨
━━━━━━━━━━━━━━━━━━━━━━

🎟 <b>Номер брони:</b> <code>#${booking.code}</code>
📅 <b>Дата & Время:</b> <b>${booking.date}</b> в <b>${booking.time}</b>

👤 <b>КЛИЕНТ</b>
 └ Имя: <b>${booking.clientName}</b>
 └ Тел: <code>${booking.clientPhone}</code>

💅 <b>МАСТЕР & САЛОН</b>
 └ Специалист: <b>${booking.master?.name}</b> (<i>${booking.master?.role}</i>)
 └ Филиал: <b>${booking.location?.name}</b>
 └ Адрес: <code>${booking.location?.address}</code> (${booking.location?.metro})

✂️ <b>ВЫБРАННЫЕ УСЛУГИ</b>
${servicesFormatted}

━━━━━━━━━━━━━━━━━━━━━━
💳 <b>ИТОГО К ОПЛАТЕ:</b> <b>${booking.totalPrice?.toLocaleString("ru-RU")} ₽</b>
💎 <i>Статус: Бронирование подтверждено</i>
    `.trim();

    // Luxury Inline Keyboard Actions for Telegram Admins
    const keyboard = new InlineKeyboard()
      .url("📞 Связаться с клиентом", `tel:${booking.clientPhone?.replace(/[^0-9+]/g, "")}`)
      .row()
      .text("❌ Отменить бронь", `cancel_${booking.code}`)
      .text("✅ Подтвердить визит", `confirm_${booking.code}`);

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
          reply_markup: keyboard,
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
