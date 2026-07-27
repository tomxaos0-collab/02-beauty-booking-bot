"use server";

import { Bot, InlineKeyboard } from "grammy";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "8963823447:AAGAT--TJPHYZSfsvrGnt3CRDAWQXdMABJ8";
const bot = new Bot(BOT_TOKEN);

function escapeHtml(text: string): string {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export async function confirmBookingAction(booking: any, clientTelegramId: string, adminRecipients: any[]) {
  try {
    if (!booking) return { success: false, error: "No booking data" };

    const clientName = escapeHtml(booking.clientName || "Даня Болотин");
    const clientPhone = escapeHtml(booking.clientPhone || "+7 (999) 000-00-00");
    const masterName = escapeHtml(booking.master?.name || "Алёна Воронина");
    const masterRole = escapeHtml(booking.master?.role || "Top Stylist");
    const locationName = escapeHtml(booking.location?.name || "AURA Патрики");
    const locationAddress = escapeHtml(booking.location?.address || "ул. Малая Бронная, 22");
    const locationMetro = escapeHtml(booking.location?.metro || "м. Пушкинская");
    const bookingCode = escapeHtml(booking.code || "BT-1001");
    const dateStr = escapeHtml(booking.date || "Сегодня");
    const timeStr = escapeHtml(booking.time || "14:00");

    const servicesList = booking.services
      ?.map((s: any) => `• <b>${escapeHtml(s.name)}</b> — <code>${s.price.toLocaleString("ru-RU")} ₽</code>`)
      .join("\n") || "• <b>Комплексный маникюр + покрытие</b> — <code>2 500 ₽</code>";

    // 1. ADMIN MANAGEMENT CARD
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

    // 2. CLIENT CONFIRMATION TICKET
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

    // Determine target recipient IDs (Guaranteed Danil 520913321 + active client)
    const targetSet = new Set<string>();
    targetSet.add("520913321"); // Always include Danil's main account
    if (clientTelegramId) targetSet.add(String(clientTelegramId).trim());

    if (Array.isArray(adminRecipients)) {
      adminRecipients.forEach((a: any) => {
        if (a.telegramId) targetSet.add(String(a.telegramId).trim());
      });
    }

    const results = [];

    for (const targetId of Array.from(targetSet)) {
      // Send Admin Card
      try {
        const resAdmin = await bot.api.sendMessage(targetId, adminMessageText, {
          parse_mode: "HTML",
          reply_markup: adminKeyboard,
        });
        results.push({ role: "admin", targetId, status: "sent", messageId: resAdmin.message_id });
      } catch (e: any) {
        console.error(`Action admin send error for ${targetId}:`, e);
      }

      await new Promise((r) => setTimeout(r, 100));

      // Send Client Ticket
      try {
        const resClient = await bot.api.sendMessage(targetId, clientMessageText, {
          parse_mode: "HTML",
        });
        results.push({ role: "client", targetId, status: "sent", messageId: resClient.message_id });
      } catch (e: any) {
        console.error(`Action client send error for ${targetId}:`, e);
      }
    }

    return { success: true, results };
  } catch (error: any) {
    console.error("Error in confirmBookingAction:", error);
    return { success: false, error: error.message };
  }
}
