"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Sparkles, Image as ImageIcon } from "lucide-react";
import { Location } from "@/types";

interface AddLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLocation: (loc: Location) => void;
}

export default function AddLocationModal({
  isOpen,
  onClose,
  onAddLocation,
}: AddLocationModalProps) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [metro, setMetro] = useState("м. Смоленская");
  const [metroColor, setMetroColor] = useState("bg-pink-500");
  const [image, setImage] = useState(
    "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500&auto=format&fit=crop&q=80"
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !address.trim()) return;

    const newLoc: Location = {
      id: "loc_" + Date.now(),
      name: name.trim(),
      address: address.trim(),
      metro: metro.trim() || "м. Смоленская",
      metroColor,
      image: image.trim() || "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500&auto=format&fit=crop&q=80",
    };

    onAddLocation(newLoc);
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
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-white tracking-tight">
                  Добавить филиал
                </h3>
                <p className="text-xs text-neutral-400">Новый салон в сеть</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-neutral-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Image Preview & URL */}
            <div className="flex items-center gap-3.5 bg-white/[0.03] p-3.5 rounded-2xl border border-white/10">
              <div className="w-14 h-14 rounded-2xl overflow-hidden border border-white/20 shrink-0 bg-neutral-800 shadow-md">
                <img
                  src={image}
                  alt="Предпросмотр филиала"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500&auto=format&fit=crop&q=80";
                  }}
                />
              </div>

              <div className="flex-1">
                <label className="text-xs font-semibold text-neutral-300 block mb-1 flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5 text-pink-400" />
                  Фото интерьера (URL)
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-pink-500/60 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block mb-1.5">
                Название точки
              </label>
              <input
                type="text"
                required
                placeholder="Аура Патрики"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full py-3 px-4 rounded-2xl bg-white/[0.04] border border-white/10 text-white text-sm font-semibold focus:outline-none focus:border-pink-500/60 focus:bg-white/[0.06] transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block mb-1.5">
                Точный адрес
              </label>
              <input
                type="text"
                required
                placeholder="ул. Малая Бронная, 22"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full py-3 px-4 rounded-2xl bg-white/[0.04] border border-white/10 text-white text-sm font-semibold focus:outline-none focus:border-pink-500/60 focus:bg-white/[0.06] transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block mb-1.5">
                Ближайшее метро
              </label>
              <input
                type="text"
                placeholder="м. Пушкинская"
                value={metro}
                onChange={(e) => setMetro(e.target.value)}
                className="w-full py-3 px-4 rounded-2xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-pink-500/60 focus:bg-white/[0.06] transition-all"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-white text-black font-extrabold text-sm shadow-xl shadow-white/10 hover:bg-pink-50 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-black" />
                Сохранить точку
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
