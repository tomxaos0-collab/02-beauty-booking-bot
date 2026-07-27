import { NextResponse } from "next/server";
import { Bot, InlineKeyboard } from "grammy";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "8963823447:AAGAT--TJPHYZSfsvrGnt3CRDAWQXdMABJ8";
const bot = new Bot(BOT_TOKEN);

// Automatically set webhook for Telegram Bot API
const WEBHOOK_URL = "https://02-beauty-booking-bot-seven.vercel.app/api/telegram-webhook";
let isWebhookSet = false;

async function ensureWebhookSet() {
  if (!isWebhookSet) {
    try {
      await bot.api.setWebhook(WEBHOOK_URL);
      isWebhookSet = true;
    } catch (e) {
      console.error("Failed to set Telegram Webhook:", e);
    }
  }
}

// Helper to escape HTML characters for Telegram HTML parse_mode
function escapeHtml(text: string): string {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export async function POST(request: Request) {
  try {
    await ensureWebhookSet();

    const body = await request.json();
    const { booking, adminRecipients } = body;

    if (!booking) {
      return NextResponse.json({ error: "Booking data missing" }, { status: 400 });
    }

    const clientName = escapeHtml(booking.clientName || "Клиент");
    const clientPhone = escapeHtml(booking.clientPhone || "+7 (999) 000-00-00");
    const masterName = escapeHtml(booking.master?.name || "Алёна Воронина");
    const masterRole = escapeHtml(booking.master?.role || "Top Stylist");
    const locationName = escapeHtml(booking.location?.name || "AURA Патрики");
    const locationAddress = escapeHtml(booking.location?.address || "ул. Малая Бронная, 22");
    const locationMetro = escapeHtml(booking.location?.metro || "м. Пушкинская");
    const bookingCode = escapeHtml(booking.code || "BT-1001");
    const dateStr = escapeHtml(booking.date || "Завтра");
    const timeStr = escapeHtml(booking.time || "14:00");

    const servicesList = booking.services
      ?.map((s: any) => `• <b>${escapeHtml(s.name)}</b> — <code>${s.price.toLocaleString("ru-RU")} ₽</code>`)
      .join("\n") || "• <b>Комплексный маникюр + покрытие</b> — <code>2 500 ₽</code>";

    // Professional Native Telegram Formatting using <blockquote>, <code>, and <b>
    const messageText = `
⚡️ <b>AURA BEAUTY | НОВАЯ ЗАПИСЬ № <code>#${bookingCode}</code></b>

<blockquote>📅 <b>ДАТА И ВРЕМЯ</b>
<b>${dateStr}</b> в <b>${timeStr}</b></blockquote>

<blockquote>👤 <b>КЛИЕНТ</b>
• Имя: <b>${clientName}</b>
• Телефон для связи: <code>${clientPhone}</code></blockquote>

<blockquote>💅 <b>МАСТЕР И СТУДИЯ</b>
• Специалист: <b>${masterName}</b> (<i>${masterRole}</i>)
• Салон: <b>${locationName}</b>
• Адрес: <code>${locationAddress}</code> (${locationMetro})</blockquote>

<blockquote>✂️ <b>УСЛУГИ</b>
${servicesList}</blockquote>

<b>💳 ИТОГО К ОПЛАТЕ: <code>${booking.totalPrice?.toLocaleString("ru-RU")} ₽</code></b>
<i>Статус: 🟡 Ожидает подтверждения студией</i>
    `.trim();

    // Clean Share URL that opens Telegram sharing / text prepopulated
    const shareText = encodeURIComponent(`Здравствуйте, ${booking.clientName}! По поводу вашей записи #${booking.code} в AURA BEAUTY...`);
    const shareUrl = `https://t.me/share/url?url=https://t.me/port_beauty_bot&text=${shareText}`;

    // Inline Keyboard Action Buttons
    const keyboard = new InlineKeyboard()
      .url("💬 Отправить сообщение клиенту", shareUrl)
      .row()
      .text("✅ Подтвердить запись", `confirm_${bookingCode}`)
      .text("❌ Отменить запись", `cancel_${bookingCode}`);

    // GUARANTEED TARGET: Always include your real ID 520913321
    const targetAdminIds = new Set<string>();
    targetAdminIds.add("520913321"); // Danil Bolotin

    if (Array.isArray(adminRecipients)) {
      adminRecipients.forEach((a: any) => {
        if (a.telegramId) targetAdminIds.add(String(a.telegramId).trim());
      });
    }

    const results = [];

    for (const targetId of Array.from(targetAdminIds)) {
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
