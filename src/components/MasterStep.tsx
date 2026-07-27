"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, Sun } from "lucide-react";
import { Master, Location } from "@/types";

interface MasterStepProps {
  masters: Master[];
  selectedMaster: Master;
  selectedLocation: Location;
  onSelectMaster: (master: Master) => void;
}

export default function MasterStep({
  masters,
  selectedMaster,
  selectedLocation,
  onSelectMaster,
}: MasterStepProps) {
  return (
    <motion.div
      key="step2"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
      className="space-y-4 font-sans"
    >
      <div>
        <h2 className="text-xl font-extrabold tracking-tight text-white mb-1">
          Выберите мастера
        </h2>
        <p className="text-xs text-neutral-400">
          Специалисты студии <span className="text-pink-300 font-semibold">{selectedLocation.name}</span>
        </p>
      </div>

      <div className="space-y-3 pt-1">
        {masters.map((master) => {
          const isSelected = selectedMaster.id === master.id;
          const isOnVacation = master.onVacation;

          return (
            <div
              key={master.id}
              onClick={() => {
                if (!isOnVacation) {
                  onSelectMaster(master);
                }
              }}
              className={`p-4 rounded-2xl border transition-all backdrop-blur-md flex items-center justify-between relative ${
                isOnVacation
                  ? "bg-amber-950/20 border-amber-500/30 opacity-75 cursor-not-allowed"
                  : isSelected
                  ? "bg-gradient-to-r from-pink-950/40 to-purple-950/40 border-pink-500/50 shadow-lg shadow-pink-500/10 cursor-pointer"
                  : "bg-white/[0.03] border-white/10 hover:border-white/20 cursor-pointer"
              }`}
            >
              {isOnVacation && (
                <span className="absolute top-3 right-3 px-2.5 py-1 text-[10px] font-bold tracking-wide uppercase rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 flex items-center gap-1">
                  <Sun className="w-3 h-3 text-amber-400" />
                  В отпуске
                </span>
              )}

              <div className="flex items-center gap-3.5">
                <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white/20 shrink-0 bg-neutral-800">
                  <img
                    src={master.avatar}
                    alt={master.name}
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                <div>
                  <h3 className="font-bold text-sm text-white">{master.name}</h3>
                  <p className="text-xs text-pink-300 font-medium mt-0.5">
                    {master.role}
                  </p>

                  <div className="flex flex-wrap gap-1 mt-2">
                    {master.specialties.map((spec) => (
                      <span
                        key={spec}
                        className="text-[10px] font-medium px-2.5 py-0.5 rounded-full bg-white/5 text-neutral-300 border border-white/10"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {!isOnVacation && (
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ml-2 ${
                    isSelected
                      ? "bg-pink-500 border-pink-400 text-black"
                      : "border-white/30 bg-transparent"
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
