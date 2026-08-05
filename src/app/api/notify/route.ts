import { NextResponse } from "next/server";
import { Bot, InlineKeyboard } from "grammy";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const bot = new Bot(BOT_TOKEN || "INVALID_TOKEN_REVOKED");

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

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: CORS_HEADERS,
  });
}

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
    const { booking, adminRecipients, clientTelegramId } = body;

    if (!booking) {
      return NextResponse.json({ error: "Booking data missing" }, { status: 400, headers: CORS_HEADERS });
    }

    const clientName = escapeHtml(booking.clientName || "Даня Болотин");
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

    // 1. ADMIN NOTIFICATION MESSAGE
    const adminMessageText = `
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

    const shareText = encodeURIComponent(`Здравствуйте, ${booking.clientName}! По поводу вашей записи #${booking.code} в AURA BEAUTY...`);
    const shareUrl = `https://t.me/share/url?url=https://t.me/port_beauty_bot&text=${shareText}`;

    const adminKeyboard = new InlineKeyboard()
      .url("💬 Отправить сообщение клиенту", shareUrl)
      .row()
      .text("✅ Подтвердить запись", `confirm_${bookingCode}`)
      .text("❌ Отменить запись", `cancel_${bookingCode}`);

    // 2. CLIENT CONFIRMATION MESSAGE
    const clientMessageText = `
🌸 <b>ВЫ УСПЕШНО ЗАПИСАНЫ В AURA BEAUTY!</b>

<blockquote>🎟 <b>ВАШ БИЛЕТ № <code>#${bookingCode}</code></b>
📅 Дата: <b>${dateStr}</b> в <b>${timeStr}</b>
💅 Мастер: <b>${masterName}</b>
📍 Салон: <b>${locationName}</b> (${locationAddress})</blockquote>

<blockquote>✂️ <b>УСЛУГИ:</b>
${servicesList}</blockquote>

💳 <b>СУММА К ОПЛАТЕ В САЛОНЕ: <code>${booking.totalPrice?.toLocaleString("ru-RU")} ₽</code></b>

<i>Ждем вас за великолепным уходом! Если вы захотите перенести или отменить запись — нажмите кнопку «Мои записи» в меню приложения.</i>
    `.trim();

    // Isolated send helper that NEVER crashes the loop or blocks other recipients
    const safeSend = async (targetId: string, text: string, keyboard?: any) => {
      try {
        const options: any = { parse_mode: "HTML" };
        if (keyboard) options.reply_markup = keyboard;
        const res = await bot.api.sendMessage(targetId, text, options);
        return { success: true, messageId: res.message_id };
      } catch (err: any) {
        console.warn(`Notify API isolated send error for ${targetId}:`, err?.message || err);
        return { success: false, error: err?.message };
      }
    };

    // Determine target recipient IDs (Guaranteed Danil 520913321 + active client)
    const targetSet = new Set<string>();
    targetSet.add("520913321"); // Always include Danil's main account
    if (clientTelegramId && String(clientTelegramId) !== "849201948") {
      targetSet.add(String(clientTelegramId).trim());
    }

    if (Array.isArray(adminRecipients)) {
      adminRecipients.forEach((a: any) => {
        if (a.telegramId && String(a.telegramId) !== "849201948") {
          targetSet.add(String(a.telegramId).trim());
        }
      });
    }

    const results = [];

    for (const targetId of Array.from(targetSet)) {
      // 1. Send Admin Management Card
      const resAdmin = await safeSend(targetId, adminMessageText, adminKeyboard);
      results.push({ role: "admin", targetId, ...resAdmin });

      await new Promise((r) => setTimeout(r, 100));

      // 2. Send Client Ticket
      const resClient = await safeSend(targetId, clientMessageText);
      results.push({ role: "client", targetId, ...resClient });
    }

    return NextResponse.json({ success: true, results }, { headers: CORS_HEADERS });
  } catch (error: any) {
    console.error("Error in notify API:", error);
    return NextResponse.json({ error: error.message || "Failed to notify" }, { status: 500, headers: CORS_HEADERS });
  }
}
