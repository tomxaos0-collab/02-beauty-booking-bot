"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Sparkles, ExternalLink, HelpCircle, ShieldCheck } from "lucide-react";

interface AddAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAdminId: (telegramId: string, name: string) => void;
}

export default function AddAdminModal({
  isOpen,
  onClose,
  onAddAdminId,
}: AddAdminModalProps) {
  const [telegramId, setTelegramId] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!telegramId.trim()) return;

    onAddAdminId(telegramId.trim(), name.trim() || "Администратор");
    setTelegramId("");
    setName("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-end justify-center sm:items-center p-0 sm:p-4 font-sans"
      >
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md bg-[#11131f]/95 border-t sm:border border-white/15 rounded-t-[32px] sm:rounded-3xl p-6 space-y-5 shadow-2xl backdrop-blur-2xl relative overflow-hidden"
        >
          {/* Top Mobile Drag Handle Indicator */}
          <div className="w-10 h-1 bg-white/20 rounded-full mx-auto sm:hidden" />

          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-white tracking-tight">
                  Добавить получателя уведомлений
                </h3>
                <p className="text-xs text-neutral-400">Администратор / управляющий салона</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-neutral-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Helper info box with bot link */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-950/30 to-purple-950/30 border border-pink-500/30 space-y-2">
            <div className="flex items-center gap-2 text-pink-300 font-bold text-xs">
              <HelpCircle className="w-4 h-4 shrink-0" />
              <span>Как узнать свой Telegram ID?</span>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Перейдите в нашего специального помощника бота и нажмите <strong>Start</strong>:
            </p>
            <a
              href="https://t.me/user_id_fetcher_bot"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500/40 text-pink-300 text-xs font-bold transition-colors mt-1"
            >
              <Send className="w-3.5 h-3.5" />
              @user_id_fetcher_bot
              <ExternalLink className="w-3 h-3 ml-0.5" />
            </a>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block mb-1.5">
                Имя сотрудника / роль
              </label>
              <input
                type="text"
                required
                placeholder="Данил (Управляющий)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full py-3 px-4 rounded-2xl bg-white/[0.04] border border-white/10 text-white text-sm font-semibold focus:outline-none focus:border-pink-500/60 focus:bg-white/[0.06] transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block mb-1.5">
                Telegram User ID (цифровой код)
              </label>
              <input
                type="text"
                required
                placeholder="Например: 849201948"
                value={telegramId}
                onChange={(e) => setTelegramId(e.target.value)}
                className="w-full py-3 px-4 rounded-2xl bg-white/[0.04] border border-white/10 text-white text-sm font-bold focus:outline-none focus:border-pink-500/60 focus:bg-white/[0.06] transition-all font-mono"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-white text-black font-extrabold text-sm shadow-xl shadow-white/10 hover:bg-pink-50 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-black" />
                Сохранить админа
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
