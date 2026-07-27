"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, QrCode, BookmarkCheck, RefreshCw } from "lucide-react";
import { Master, Location, DayItem } from "@/types";

interface SuccessTicketStepProps {
  bookingCode: string;
  selectedMaster: Master;
  selectedLocation: Location;
  selectedDayItem: DayItem;
  selectedTime: string;
  totalPrice: number;
  onOpenBookings: () => void;
  onNewBooking: () => void;
}

export default function SuccessTicketStep({
  bookingCode,
  selectedMaster,
  selectedLocation,
  selectedDayItem,
  selectedTime,
  totalPrice,
  onOpenBookings,
  onNewBooking,
}: SuccessTicketStepProps) {
  return (
    <motion.div
      key="step5"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-4 text-center pt-2 font-sans"
    >
      <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-400 shadow-xl shadow-emerald-500/10">
        <CheckCircle2 className="w-9 h-9" />
      </div>

      <div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight">
          Вы успешно записаны!
        </h2>
        <p className="text-xs text-neutral-400 mt-1">
          Подтверждение отправлено в ваш Telegram
        </p>
      </div>

      {/* Digital Ticket Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-b from-white/10 to-white/[0.03] border border-white/20 text-left space-y-4 backdrop-blur-xl relative overflow-hidden shadow-2xl">
        <div className="flex justify-between items-center pb-3 border-b border-white/10">
          <div>
            <span className="text-[10px] font-semibold text-neutral-400 uppercase">
              Код бронирования
            </span>
            <p className="text-lg font-extrabold text-pink-400">
              {bookingCode}
            </p>
          </div>
          <div className="p-2 bg-white rounded-xl text-black">
            <QrCode className="w-8 h-8" />
          </div>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between text-neutral-300">
            <span className="text-neutral-400">Салон:</span>
            <span className="font-bold text-white">{selectedLocation.name}</span>
          </div>
          <div className="flex justify-between text-neutral-300">
            <span className="text-neutral-400">Мастер:</span>
            <span className="font-bold text-white">{selectedMaster.name}</span>
          </div>
          <div className="flex justify-between text-neutral-300">
            <span className="text-neutral-400">Дата и время:</span>
            <span className="font-bold text-white">
              {selectedDayItem.fullLabel}, {selectedTime}
            </span>
          </div>
          <div className="flex justify-between text-neutral-300">
            <span className="text-neutral-400">Адрес:</span>
            <span className="font-bold text-white">{selectedLocation.address}</span>
          </div>
        </div>

        <div className="pt-3 border-t border-white/10 flex justify-between items-center">
          <span className="text-xs text-neutral-400">К оплате:</span>
          <span className="text-base font-bold text-pink-400">
            {totalPrice} ₽
          </span>
        </div>
      </div>

      <div className="pt-2 flex flex-col gap-2.5">
        <button
          onClick={onOpenBookings}
          className="w-full py-3 px-4 rounded-xl bg-pink-500/20 text-pink-300 border border-pink-500/40 font-bold text-sm hover:bg-pink-500/30 transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <BookmarkCheck className="w-4 h-4" />
          Управление моими записями
        </button>

        <button
          onClick={onNewBooking}
          className="w-full py-3 px-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          Записаться еще
        </button>
      </div>
    </motion.div>
  );
}
