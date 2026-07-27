"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, X, Check } from "lucide-react";
import { Location } from "@/types";

interface LocationModalProps {
  isOpen: boolean;
  locations: Location[];
  selectedLocation: Location;
  onClose: () => void;
  onSelectLocation: (loc: Location) => void;
}

export default function LocationModal({
  isOpen,
  locations,
  selectedLocation,
  onClose,
  onSelectLocation,
}: LocationModalProps) {
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
          className="w-full max-w-md bg-[#11131f]/95 border-t sm:border border-white/15 rounded-t-[32px] sm:rounded-3xl p-6 space-y-4 shadow-2xl backdrop-blur-2xl relative overflow-hidden"
        >
          {/* Top Mobile Drag Handle Indicator */}
          <div className="w-10 h-1 bg-white/20 rounded-full mx-auto sm:hidden" />

          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-white tracking-tight">
                  Выберите салон
                </h3>
                <p className="text-xs text-neutral-400">Студии сети в Москве</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-neutral-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {locations.map((loc) => {
              const isSelected = selectedLocation.id === loc.id;
              return (
                <div
                  key={loc.id}
                  onClick={() => onSelectLocation(loc)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between backdrop-blur-md ${
                    isSelected
                      ? "bg-gradient-to-r from-pink-950/40 to-purple-950/40 border-pink-500/50 shadow-lg shadow-pink-500/10"
                      : "bg-white/[0.04] border-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-white/10 shrink-0 bg-neutral-800">
                      <img
                        src={loc.image}
                        alt={loc.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div>
                      <h4 className="font-bold text-sm text-white">{loc.name}</h4>
                      <p className="text-xs text-neutral-300 mt-0.5">{loc.address}</p>
                      <div className="flex items-center gap-1.5 mt-1 text-[10px] text-neutral-400 font-semibold">
                        <span className={`w-2 h-2 rounded-full ${loc.metroColor}`} />
                        {loc.metro}
                      </div>
                    </div>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                      isSelected
                        ? "bg-pink-500 border-pink-400 text-black"
                        : "border-white/30 bg-transparent"
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
