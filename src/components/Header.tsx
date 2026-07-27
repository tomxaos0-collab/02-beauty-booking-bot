"use client";

import React from "react";
import { Scissors, MapPin, ChevronDown, BookmarkCheck, Shield, ArrowLeft } from "lucide-react";
import { Location } from "@/types";

interface HeaderProps {
  salonBrandName: string;
  step: number;
  mode: "client" | "admin";
  selectedLocation: Location;
  activeBookingsCount: number;
  onBack: () => void;
  onOpenLocationModal: () => void;
  onOpenBookingsModal: () => void;
  onToggleMode: () => void;
}

export default function Header({
  salonBrandName,
  step,
  mode,
  selectedLocation,
  activeBookingsCount,
  onBack,
  onOpenLocationModal,
  onOpenBookingsModal,
  onToggleMode,
}: HeaderProps) {
  return (
    <div className="relative z-20 px-5 pt-4 pb-3 flex items-center justify-between border-b border-white/10 bg-[#090a0f]/90 backdrop-blur-md sticky top-0 font-sans">
      <div className="flex items-center gap-3">
        {step > 1 && step < 5 && mode === "client" ? (
          <button
            onClick={onBack}
            className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-white" />
          </button>
        ) : (
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 p-0.5 shadow-lg shadow-pink-500/20">
            <div className="w-full h-full rounded-full bg-[#090a0f] flex items-center justify-center">
              <Scissors className="w-4 h-4 text-pink-400" />
            </div>
          </div>
        )}

        <div>
          <h1 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5 uppercase">
            {salonBrandName}
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </h1>

          <button
            onClick={onOpenLocationModal}
            className="text-[11px] font-medium text-neutral-300 hover:text-white flex items-center gap-1 transition-colors cursor-pointer group mt-0.5"
          >
            <MapPin className="w-3 h-3 text-pink-400 shrink-0" />
            <span className="font-semibold underline underline-offset-2 decoration-pink-500/50 group-hover:decoration-pink-500">
              {selectedLocation.name}
            </span>
            <ChevronDown className="w-3 h-3 text-neutral-400 group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onOpenBookingsModal}
          className="relative px-2.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-neutral-200 hover:bg-white/10 transition-all flex items-center gap-1.5"
        >
          <BookmarkCheck className="w-3.5 h-3.5 text-pink-400" />
          <span className="font-bold">{activeBookingsCount}</span>
        </button>

        <button
          onClick={onToggleMode}
          className={`p-1.5 rounded-full border text-xs transition-all ${
            mode === "admin"
              ? "bg-amber-400/20 text-amber-300 border-amber-400/50 shadow-lg shadow-amber-500/10"
              : "bg-white/5 text-neutral-400 border-white/10 hover:text-white"
          }`}
          title={mode === "admin" ? "Панель администратора студии" : "Режим клиента"}
        >
          <Shield className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
