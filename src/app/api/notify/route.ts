import { NextResponse } from "next/server";
import { Bot, InlineKeyboard } from "grammy";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "8963823447:AAGAT--TJPHYZSfsvrGnt3CRDAWQXdMABJ8";
const bot = new Bot(BOT_TOKEN);

// Helper to escape HTML characters for Telegram HTML parse_mode
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { booking, adminRecipients } = body;

    if (!booking) {
      return NextResponse.json({ error: "Booking data missing" }, { status: 400 });
    }

    const clientName = escapeHtml(booking.clientName || "Клиент");
    const clientPhone = escapeHtml(booking.clientPhone || "");
    const masterName = escapeHtml(booking.master?.name || "");
    const masterRole = escapeHtml(booking.master?.role || "");
    const locationName = escapeHtml(booking.location?.name || "");
    const locationAddress = escapeHtml(booking.location?.address || "");
    const locationMetro = escapeHtml(booking.location?.metro || "");
    const bookingCode = escapeHtml(booking.code || "");
    const dateStr = escapeHtml(booking.date || "");
    const timeStr = escapeHtml(booking.time || "");

    const servicesList = booking.services
      ?.map((s: any) => `• <b>${escapeHtml(s.name)}</b> — <code>${s.price.toLocaleString("ru-RU")} ₽</code>`)
      .join("\n") || "";

    // Professional Native Telegram Formatting using <blockquote>, <code>, and <b>
    const messageText = `
<b>⚡️ AURA BEAUTY | НОВАЯ ЗАПИСЬ № <code>${bookingCode}</code></b>

<blockquote>📅 <b>ДАТА И ВРЕМЯ</b>
<b>${dateStr}</b> в <b>${timeStr}</b></blockquote>

<blockquote>👤 <b>КЛИЕНТ</b>
• Имя: <b>${clientName}</b>
• Телефон: <code>${clientPhone}</code></blockquote>

<blockquote>💅 <b>МАСТЕР И СТУДИЯ</b>
• Специалист: <b>${masterName}</b> (<i>${masterRole}</i>)
• Салон: <b>${locationName}</b>
• Адрес: <code>${locationAddress}</code> (${locationMetro})</blockquote>

<blockquote>✂️ <b>УСЛУГИ</b>
${servicesList}</blockquote>

<b>💳 ИТОГО К ОПЛАТЕ: <code>${booking.totalPrice?.toLocaleString("ru-RU")} ₽</code></b>
<i>Статус: 🟡 Ожидает подтверждения студией</i>
    `.trim();

    // Inline Keyboard Action Buttons
    const phoneClean = clientPhone.replace(/[^0-9+]/g, "");
    const keyboard = new InlineKeyboard()
      .url("📞 Позвонить клиенту", `tel:${phoneClean}`)
      .row()
      .text("✅ Подтвердить запись", `confirm_${bookingCode}`)
      .text("❌ Отменить запись", `cancel_${bookingCode}`);

    // Target User ID: 520913321
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
