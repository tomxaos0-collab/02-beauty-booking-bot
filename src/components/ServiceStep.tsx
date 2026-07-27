"use client";

import React from "react";
import { motion } from "framer-motion";
import { Clock, Check } from "lucide-react";
import { BeautyService, Location } from "@/types";

interface ServiceStepProps {
  services: BeautyService[];
  selectedServiceIds: string[];
  selectedLocation: Location;
  onToggleService: (id: string) => void;
}

export default function ServiceStep({
  services,
  selectedServiceIds,
  selectedLocation,
  onToggleService,
}: ServiceStepProps) {
  return (
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
      className="space-y-4 font-sans"
    >
      <div>
        <h2 className="text-xl font-extrabold tracking-tight text-white mb-1">
          Выберите услуги
        </h2>
        <p className="text-xs text-neutral-400">
          Филиал: <span className="text-pink-300 font-semibold">{selectedLocation.name} ({selectedLocation.address})</span>
        </p>
      </div>

      <div className="space-y-3 pt-1">
        {services.map((service) => {
          const isSelected = selectedServiceIds.includes(service.id);
          return (
            <div
              key={service.id}
              onClick={() => onToggleService(service.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden backdrop-blur-md ${
                isSelected
                  ? "bg-gradient-to-r from-pink-950/40 to-purple-950/40 border-pink-500/50 shadow-lg shadow-pink-500/10"
                  : "bg-white/[0.03] border-white/10 hover:border-white/20"
              }`}
            >
              {service.badge && (
                <span className="absolute top-3 right-3 px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/40">
                  {service.badge}
                </span>
              )}

              <div className="flex items-start gap-3 pr-10">
                <div
                  className={`w-5 h-5 rounded-md border flex items-center justify-center mt-0.5 shrink-0 transition-colors ${
                    isSelected
                      ? "bg-pink-500 border-pink-400 text-black"
                      : "border-white/30 bg-transparent"
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>

                <div>
                  <h3 className="font-bold text-sm text-white leading-snug">
                    {service.name}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                    {service.description}
                  </p>

                  <div className="flex items-center gap-4 mt-3 pt-2 border-t border-white/5 text-xs">
                    <span className="text-pink-300 font-bold">
                      {service.price.toLocaleString("ru-RU")} ₽
                    </span>
                    <span className="text-neutral-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-neutral-400" />
                      {service.durationMinutes} мин
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
