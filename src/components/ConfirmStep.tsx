"use client";

import React from "react";
import { motion } from "framer-motion";
import { MapPin, Calendar as CalendarIcon, Clock, User, Phone } from "lucide-react";
import { Master, Location, BeautyService, DayItem } from "@/types";

interface ConfirmStepProps {
  selectedMaster: Master;
  selectedLocation: Location;
  selectedDayItem: DayItem;
  selectedTime: string;
  selectedServices: BeautyService[];
  totalDuration: number;
  totalPrice: number;
  clientName: string;
  clientPhone: string;
  onChangeName: (name: string) => void;
  onChangePhone: (phone: string) => void;
}

export default function ConfirmStep({
  selectedMaster,
  selectedLocation,
  selectedDayItem,
  selectedTime,
  selectedServices,
  totalDuration,
  totalPrice,
  clientName,
  clientPhone,
  onChangeName,
  onChangePhone,
}: ConfirmStepProps) {
  return (
    <motion.div
      key="step4"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
      className="space-y-4 font-sans"
    >
      <div>
        <h2 className="text-xl font-extrabold tracking-tight text-white mb-1">
          Подтверждение записи
        </h2>
        <p className="text-xs text-neutral-400">
          Проверьте параметры перед финальным подтверждением
        </p>
      </div>

      {/* Summary Card */}
      <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-4 backdrop-blur-md">
        <div className="flex items-center gap-3 pb-3 border-b border-white/10">
          <img
            src={selectedMaster.avatar}
            alt={selectedMaster.name}
            className="w-12 h-12 rounded-full object-cover border border-white/20 shrink-0"
          />
          <div>
            <h3 className="font-bold text-sm text-white">{selectedMaster.name}</h3>
            <p className="text-xs text-pink-300">{selectedMaster.role}</p>
          </div>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-center text-neutral-300">
            <span className="flex items-center gap-1.5 text-neutral-400">
              <MapPin className="w-3.5 h-3.5 text-pink-400" />
              Салон:
            </span>
            <span className="font-semibold text-white">
              {selectedLocation.name} ({selectedLocation.address})
            </span>
          </div>

          <div className="flex justify-between items-center text-neutral-300">
            <span className="flex items-center gap-1.5 text-neutral-400">
              <CalendarIcon className="w-3.5 h-3.5 text-pink-400" />
              Дата и время:
            </span>
            <span className="font-semibold text-white">
              {selectedDayItem.fullLabel}, {selectedTime}
            </span>
          </div>

          <div className="flex justify-between items-center text-neutral-300">
            <span className="flex items-center gap-1.5 text-neutral-400">
              <Clock className="w-3.5 h-3.5 text-purple-400" />
              Длительность:
            </span>
            <span className="font-semibold text-white">{totalDuration} мин</span>
          </div>
        </div>

        <div className="pt-3 border-t border-white/10 space-y-1.5">
          <span className="text-[11px] font-semibold uppercase text-neutral-400 tracking-wider">
            Услуги:
          </span>
          {selectedServices.map((s) => (
            <div key={s.id} className="flex justify-between text-xs font-medium text-white">
              <span>• {s.name}</span>
              <span className="font-bold text-pink-300">{s.price} ₽</span>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-white/10 flex justify-between items-center font-bold">
          <span className="text-sm text-neutral-300">Итого к оплате на месте:</span>
          <span className="text-lg text-pink-400 font-extrabold">{totalPrice} ₽</span>
        </div>
      </div>

      {/* Client Info Inputs */}
      <div className="space-y-3 pt-1">
        <div>
          <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block mb-1">
            Ваше имя (Telegram)
          </label>
          <div className="relative">
            <User className="w-4 h-4 absolute left-3.5 top-3.5 text-neutral-400" />
            <input
              type="text"
              value={clientName}
              onChange={(e) => onChangeName(e.target.value)}
              className="w-full py-2.5 pl-10 pr-4 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-pink-500"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block mb-1">
            Телефон для связи
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-neutral-400" />
            <input
              type="text"
              value={clientPhone}
              onChange={(e) => onChangePhone(e.target.value)}
              className="w-full py-2.5 pl-10 pr-4 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-pink-500 font-medium"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
