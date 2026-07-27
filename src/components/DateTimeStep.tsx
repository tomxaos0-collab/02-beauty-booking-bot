"use client";

import React from "react";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon } from "lucide-react";
import { Master, TimeSlot, DayItem } from "@/types";

interface DateTimeStepProps {
  selectedMaster: Master;
  selectedDayItem: DayItem;
  selectedTime: string;
  daysList: DayItem[];
  slots: TimeSlot[];
  totalDuration: number;
  onSelectDay: (day: DayItem) => void;
  onSelectTime: (time: string) => void;
  onOpenCalendarGrid: () => void;
}

export default function DateTimeStep({
  selectedMaster,
  selectedDayItem,
  selectedTime,
  daysList,
  slots,
  totalDuration,
  onSelectDay,
  onSelectTime,
  onOpenCalendarGrid,
}: DateTimeStepProps) {
  return (
    <motion.div
      key="step3"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
      className="space-y-4 font-sans"
    >
      <div>
        <h2 className="text-xl font-extrabold tracking-tight text-white mb-1">
          Дата и время записи
        </h2>
        <p className="text-xs text-neutral-400">
          Мастер: <span className="text-pink-300 font-semibold">{selectedMaster.name}</span>
        </p>
      </div>

      {/* Month Navigation & Full Month Calendar Trigger */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
            Выберите день приема
          </label>
          <button
            onClick={onOpenCalendarGrid}
            className="text-[11px] font-bold text-pink-400 hover:text-pink-300 flex items-center gap-1 cursor-pointer"
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            Весь месяц ➔
          </button>
        </div>

        {/* Horizontal Scrollable Days Slider */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth">
          {daysList.map((d, idx) => {
            const isSelected = selectedDayItem.fullLabel === d.fullLabel;
            return (
              <button
                key={idx}
                disabled={d.fullyBooked}
                onClick={() => {
                  if (!d.fullyBooked) {
                    onSelectDay(d);
                  }
                }}
                className={`py-3 px-3.5 rounded-2xl border transition-all flex flex-col items-center justify-center shrink-0 min-w-[70px] relative ${
                  d.fullyBooked
                    ? "bg-red-950/20 border-red-500/20 text-neutral-500 cursor-not-allowed opacity-60"
                    : isSelected
                    ? "bg-gradient-to-b from-pink-500 to-purple-600 text-white border-pink-400 shadow-lg shadow-pink-500/25 scale-[1.03]"
                    : "bg-white/[0.04] text-neutral-300 border-white/10 hover:border-white/30"
                }`}
              >
                <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold">
                  {d.dayName}
                </span>
                <span className="text-lg font-black my-0.5">
                  {d.dayNum}
                </span>
                <span className="text-[9px] text-neutral-400 truncate max-w-[55px]">
                  {d.monthName}
                </span>

                {d.fullyBooked && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 border border-black" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Date Summary Badge */}
      <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between text-xs">
        <span className="text-neutral-400">Выбранная дата:</span>
        <span className="font-bold text-pink-300">{selectedDayItem.fullLabel}</span>
      </div>

      {/* Time Slots Grid */}
      <div className="space-y-2 pt-1">
        <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center justify-between">
          <span>Свободные окна</span>
          <span className="text-[10px] text-pink-400 font-normal">
            Длительность: {totalDuration} мин
          </span>
        </label>

        <div className="grid grid-cols-3 gap-2.5">
          {slots.map((slot) => {
            const isSelected = selectedTime === slot.time;
            return (
              <button
                key={slot.time}
                disabled={!slot.available}
                onClick={() => {
                  if (slot.available) {
                    onSelectTime(slot.time);
                  }
                }}
                className={`py-3 px-3 rounded-xl text-sm font-bold border transition-all flex flex-col items-center justify-center gap-1 ${
                  !slot.available
                    ? "bg-red-950/40 text-red-400 border-red-500/30 line-through cursor-not-allowed shadow-inner opacity-85"
                    : isSelected
                    ? "bg-gradient-to-tr from-pink-500 to-purple-600 text-white border-pink-400 shadow-lg shadow-pink-500/25 scale-[1.02]"
                    : "bg-white/[0.04] text-white border-white/10 hover:border-white/30"
                }`}
              >
                <span>{slot.time}</span>
                {slot.available ? (
                  <span className="text-[9px] font-sans font-normal text-emerald-400">
                    Свободно
                  </span>
                ) : (
                  <span className="text-[9px] font-sans font-semibold text-red-400 no-underline uppercase tracking-wider">
                    Занято
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
