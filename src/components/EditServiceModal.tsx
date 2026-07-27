"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Edit3, DollarSign, Clock, Sparkles } from "lucide-react";
import { BeautyService } from "@/types";

interface EditServiceModalProps {
  isOpen: boolean;
  service: BeautyService | null;
  onClose: () => void;
  onSaveService: (updatedService: BeautyService) => void;
}

export default function EditServiceModal({
  isOpen,
  service,
  onClose,
  onSaveService,
}: EditServiceModalProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(2500);
  const [durationMinutes, setDurationMinutes] = useState(90);
  const [description, setDescription] = useState("");
  const [badge, setBadge] = useState("");

  useEffect(() => {
    if (service) {
      setName(service.name);
      setPrice(service.price);
      setDurationMinutes(service.durationMinutes);
      setDescription(service.description);
      setBadge(service.badge || "");
    }
  }, [service]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!service || !name.trim()) return;

    const updated: BeautyService = {
      ...service,
      name: name.trim(),
      price: Number(price),
      durationMinutes: Number(durationMinutes),
      description: description.trim(),
      badge: badge.trim() || undefined,
    };

    onSaveService(updated);
    onClose();
  };

  if (!isOpen || !service) return null;

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
                <Edit3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-white tracking-tight">
                  Редактировать процедуру
                </h3>
                <p className="text-xs text-neutral-400">Измените ценник или длительность</p>
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
            <div>
              <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block mb-1.5">
                Название процедуры
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full py-3 px-4 rounded-2xl bg-white/[0.04] border border-white/10 text-white text-sm font-semibold focus:outline-none focus:border-pink-500/60 focus:bg-white/[0.06] transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-pink-400" />
                  Стоимость (₽)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    min={100}
                    step={50}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full py-3 px-4 rounded-2xl bg-white/[0.04] border border-white/10 text-white text-base font-extrabold focus:outline-none focus:border-pink-500/60 focus:bg-white/[0.06] transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="absolute right-3 top-3 text-xs font-bold text-pink-400">
                    ₽
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-purple-400" />
                  Длительность
                </label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    min={10}
                    step={5}
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full py-3 px-4 rounded-2xl bg-white/[0.04] border border-white/10 text-white text-base font-extrabold focus:outline-none focus:border-pink-500/60 focus:bg-white/[0.06] transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="absolute right-3 top-3 text-xs font-bold text-neutral-400">
                    мин
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block mb-1.5">
                Описание процедуры
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full py-2.5 px-4 rounded-2xl bg-white/[0.04] border border-white/10 text-white text-xs leading-relaxed focus:outline-none focus:border-pink-500/60 focus:bg-white/[0.06] transition-all resize-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block mb-1.5">
                Плашка / Бейдж
              </label>
              <input
                type="text"
                placeholder="Хит, TOP..."
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                className="w-full py-2.5 px-4 rounded-2xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-pink-500/60 focus:bg-white/[0.06] transition-all"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-white text-black font-extrabold text-sm shadow-xl shadow-white/10 hover:bg-pink-50 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-black" />
                Сохранить изменения
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
