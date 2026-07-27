"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookmarkCheck, X, Bell, Trash2 } from "lucide-react";
import { ActiveBooking } from "@/types";

interface MyBookingsModalProps {
  isOpen: boolean;
  activeBookings: ActiveBooking[];
  onClose: () => void;
  onRequestCancel: (code: string) => void;
}

export default function MyBookingsModal({
  isOpen,
  activeBookings,
  onClose,
  onRequestCancel,
}: MyBookingsModalProps) {
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
          className="w-full max-w-md bg-[#11131f]/95 border-t sm:border border-white/15 rounded-t-[32px] sm:rounded-3xl p-6 space-y-4 shadow-2xl backdrop-blur-2xl relative overflow-hidden max-h-[85vh] overflow-y-auto"
        >
          {/* Top Mobile Drag Handle Indicator */}
          <div className="w-10 h-1 bg-white/20 rounded-full mx-auto sm:hidden" />

          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400">
                <BookmarkCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-white tracking-tight">
                  Мои записи ({activeBookings.length})
                </h3>
                <p className="text-xs text-neutral-400">Предстоящие визиты в салон</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-neutral-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {activeBookings.length === 0 ? (
            <div className="p-8 text-center space-y-2">
              <Bell className="w-8 h-8 text-neutral-600 mx-auto" />
              <p className="text-xs text-neutral-400">У вас нет активных записей</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeBookings.map((b) => (
                <div
                  key={b.code}
                  className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-3 relative overflow-hidden"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold text-pink-400 px-2 py-0.5 rounded-full bg-pink-500/10 border border-pink-500/30">
                        {b.code}
                      </span>
                      <h4 className="font-bold text-sm text-white mt-1.5">{b.location.name}</h4>
                      <p className="text-xs text-neutral-400">{b.location.address}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-bold text-white">{b.time}</span>
                      <p className="text-[10px] text-neutral-400">{b.date}</p>
                    </div>
                  </div>

                  <div className="text-xs text-neutral-300 pt-2 border-t border-white/5 flex justify-between items-center">
                    <span>Мастер: <strong className="text-white">{b.master.name}</strong></span>
                    <span className="font-bold text-pink-300">{b.totalPrice} ₽</span>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => onRequestCancel(b.code)}
                      className="w-full py-2.5 rounded-xl bg-red-500/15 text-red-300 border border-red-500/30 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-red-500/25 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Отменить запись
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
