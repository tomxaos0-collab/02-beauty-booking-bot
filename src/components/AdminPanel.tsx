"use client";

import React, { useState } from "react";
import { Shield, Bell, Trash2, Sun, UserPlus, Users, CalendarCheck, MapPin, Edit3, Plus, Scissors, Clock, Send, ExternalLink, HelpCircle } from "lucide-react";
import { ActiveBooking, Master, Location, BeautyService, AdminRecipient } from "@/types";
import AddMasterModal from "./AddMasterModal";
import AddLocationModal from "./AddLocationModal";
import EditSalonNameModal from "./EditSalonNameModal";
import AddServiceModal from "./AddServiceModal";
import EditServiceModal from "./EditServiceModal";
import AddAdminModal from "./AddAdminModal";

interface AdminPanelProps {
  salonBrandName: string;
  activeBookings: ActiveBooking[];
  masters: Master[];
  locations: Location[];
  services: BeautyService[];
  adminRecipients: AdminRecipient[];
  selectedLocation: Location;
  onExitAdmin: () => void;
  onCancelBooking: (code: string) => void;
  onToggleVacation: (masterId: string) => void;
  onDeleteMaster: (masterId: string) => void;
  onAddMaster: (master: Master) => void;
  onAddLocation: (loc: Location) => void;
  onDeleteLocation: (locId: string) => void;
  onSaveSalonBrandName: (newName: string) => void;
  onAddService: (service: BeautyService) => void;
  onEditService: (updatedService: BeautyService) => void;
  onDeleteService: (serviceId: string) => void;
  onAddAdminRecipient: (telegramId: string, name: string) => void;
  onDeleteAdminRecipient: (id: string) => void;
}

export default function AdminPanel({
  salonBrandName,
  activeBookings,
  masters,
  locations,
  services,
  adminRecipients,
  selectedLocation,
  onExitAdmin,
  onCancelBooking,
  onToggleVacation,
  onDeleteMaster,
  onAddMaster,
  onAddLocation,
  onDeleteLocation,
  onSaveSalonBrandName,
  onAddService,
  onEditService,
  onDeleteService,
  onAddAdminRecipient,
  onDeleteAdminRecipient,
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<"bookings" | "masters" | "locations" | "services" | "admins">("bookings");
  const [isAddMasterModalOpen, setIsAddMasterModalOpen] = useState(false);
  const [isAddLocationModalOpen, setIsAddLocationModalOpen] = useState(false);
  const [isEditSalonNameModalOpen, setIsEditSalonNameModalOpen] = useState(false);
  const [isAddAdminModalOpen, setIsAddAdminModalOpen] = useState(false);

  // Services Modal State
  const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<BeautyService | null>(null);

  return (
    <div className="relative z-10 px-5 py-4 flex-1 space-y-4 font-sans">
      {/* Banner */}
      <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-amber-400 shrink-0" />
          <div>
            <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              Управляющий: {salonBrandName}
            </h3>
            <p className="text-[11px] text-amber-200/80">
              Управление заказами, прайсом и Telegram-админами
            </p>
          </div>
        </div>

        <button
          onClick={onExitAdmin}
          className="text-[10px] font-bold bg-amber-400 text-black px-2.5 py-1 rounded-md hover:bg-amber-300 transition-colors"
        >
          ВЫЙТИ
        </button>
      </div>

      {/* Admin Tab Switcher: Bookings vs Masters vs Services vs Locations vs Admins */}
      <div className="grid grid-cols-5 gap-1 bg-white/[0.04] p-1 rounded-xl border border-white/10">
        <button
          onClick={() => setActiveTab("bookings")}
          className={`py-2 text-[9px] font-bold rounded-lg transition-colors flex flex-col items-center justify-center gap-0.5 ${
            activeTab === "bookings"
              ? "bg-amber-400 text-black shadow-md"
              : "text-neutral-400 hover:text-white"
          }`}
        >
          <CalendarCheck className="w-3.5 h-3.5" />
          <span>Записи ({activeBookings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("masters")}
          className={`py-2 text-[9px] font-bold rounded-lg transition-colors flex flex-col items-center justify-center gap-0.5 ${
            activeTab === "masters"
              ? "bg-amber-400 text-black shadow-md"
              : "text-neutral-400 hover:text-white"
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Мастера ({masters.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("services")}
          className={`py-2 text-[9px] font-bold rounded-lg transition-colors flex flex-col items-center justify-center gap-0.5 ${
            activeTab === "services"
              ? "bg-amber-400 text-black shadow-md"
              : "text-neutral-400 hover:text-white"
          }`}
        >
          <Scissors className="w-3.5 h-3.5" />
          <span>Прайс ({services.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("locations")}
          className={`py-2 text-[9px] font-bold rounded-lg transition-colors flex flex-col items-center justify-center gap-0.5 ${
            activeTab === "locations"
              ? "bg-amber-400 text-black shadow-md"
              : "text-neutral-400 hover:text-white"
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>Точки ({locations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("admins")}
          className={`py-2 text-[9px] font-bold rounded-lg transition-colors flex flex-col items-center justify-center gap-0.5 ${
            activeTab === "admins"
              ? "bg-amber-400 text-black shadow-md"
              : "text-neutral-400 hover:text-white"
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span>Админы ({adminRecipients.length})</span>
        </button>
      </div>

      {/* TAB 1: BOOKINGS MANAGEMENT */}
      {activeTab === "bookings" && (
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-white flex items-center justify-between">
            <span>Активные записи клиентов</span>
            <span className="text-xs font-medium text-neutral-400">{selectedLocation.name}</span>
          </h2>

          {activeBookings.length === 0 ? (
            <div className="p-8 rounded-2xl border border-white/10 bg-white/[0.02] text-center space-y-2">
              <Bell className="w-8 h-8 text-neutral-600 mx-auto" />
              <p className="text-xs text-neutral-400">Активных записей пока нет</p>
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
                      <h4 className="font-bold text-sm text-white mt-1.5">{b.clientName}</h4>
                      <p className="text-xs text-neutral-400">{b.clientPhone}</p>
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
                      onClick={() => onCancelBooking(b.code)}
                      className="w-full py-2 rounded-xl bg-red-500/20 text-red-300 border border-red-500/40 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-red-500/30 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Отменить запись (Студия)
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MASTERS & VACATIONS MANAGEMENT */}
      {activeTab === "masters" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white">Штат мастеров ({masters.length})</h2>
            <button
              onClick={() => setIsAddMasterModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-amber-400 text-black text-xs font-bold flex items-center gap-1.5 hover:bg-amber-300 transition-colors cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              + Мастер
            </button>
          </div>

          <div className="space-y-3">
            {masters.map((m) => (
              <div
                key={m.id}
                className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={m.avatar}
                      alt={m.name}
                      className="w-12 h-12 rounded-full object-cover border border-white/20 shrink-0 bg-neutral-800"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-white">{m.name}</h4>
                      <p className="text-xs text-pink-300">{m.role}</p>
                    </div>
                  </div>

                  {m.onVacation ? (
                    <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40">
                      В отпуске
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/40">
                      Работает
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5">
                  <button
                    onClick={() => onToggleVacation(m.id)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                      m.onVacation
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30"
                        : "bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30"
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5" />
                    {m.onVacation ? "Вернуть из отпуска" : "Отправить в отпуск"}
                  </button>

                  <button
                    onClick={() => onDeleteMaster(m.id)}
                    className="py-2 rounded-xl bg-red-500/15 text-red-300 border border-red-500/30 text-xs font-bold hover:bg-red-500/25 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Удалить
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: SERVICES & PRICING MANAGEMENT */}
      {activeTab === "services" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white">Прайс-лист услуг ({services.length})</h2>
            <button
              onClick={() => setIsAddServiceModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-amber-400 text-black text-xs font-bold flex items-center gap-1.5 hover:bg-amber-300 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              + Процедура
            </button>
          </div>

          <div className="space-y-3">
            {services.map((s) => (
              <div
                key={s.id}
                className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-3 relative overflow-hidden"
              >
                {s.badge && (
                  <span className="absolute top-3 right-3 px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/40">
                    {s.badge}
                  </span>
                )}

                <div className="pr-12">
                  <h4 className="font-bold text-sm text-white">{s.name}</h4>
                  <p className="text-xs text-neutral-400 mt-0.5 leading-relaxed">{s.description}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs font-bold">
                  <span className="text-pink-300 text-base">{s.price.toLocaleString("ru-RU")} ₽</span>
                  <span className="text-neutral-400 font-normal flex items-center gap-1">
                    <Clock className="w-3 h-3 text-pink-400" />
                    {s.durationMinutes} мин
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5">
                  <button
                    onClick={() => setEditingService(s)}
                    className="py-2 rounded-xl bg-white/10 text-white border border-white/15 text-xs font-bold hover:bg-white/20 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                    Изменить цену
                  </button>

                  <button
                    onClick={() => onDeleteService(s.id)}
                    className="py-2 rounded-xl bg-red-500/15 text-red-300 border border-red-500/30 text-xs font-bold hover:bg-red-500/25 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Удалить
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: LOCATIONS & SALON BRAND NAME MANAGEMENT */}
      {activeTab === "locations" && (
        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 to-orange-950/40 border border-amber-500/30 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider">
                Бренд Студии
              </span>
              <h3 className="text-base font-extrabold text-white mt-0.5">{salonBrandName}</h3>
            </div>

            <button
              onClick={() => setIsEditSalonNameModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-amber-400 text-black text-xs font-bold flex items-center gap-1 hover:bg-amber-300 transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Изменить
            </button>
          </div>

          <div className="flex items-center justify-between pt-1">
            <h2 className="text-sm font-bold text-white">Сеть филиалов ({locations.length})</h2>
            <button
              onClick={() => setIsAddLocationModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-amber-400 text-black text-xs font-bold flex items-center gap-1 hover:bg-amber-300 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              + Новая точка
            </button>
          </div>

          <div className="space-y-3">
            {locations.map((loc) => (
              <div
                key={loc.id}
                className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={loc.image}
                    alt={loc.name}
                    className="w-12 h-12 rounded-xl object-cover border border-white/10 shrink-0 bg-neutral-800"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-white">{loc.name}</h4>
                    <p className="text-xs text-neutral-300 mt-0.5">{loc.address}</p>
                    <div className="flex items-center gap-1.5 mt-1 text-[10px] text-neutral-400">
                      <span className={`w-2 h-2 rounded-full ${loc.metroColor}`} />
                      {loc.metro}
                    </div>
                  </div>
                </div>

                {locations.length > 1 && (
                  <button
                    onClick={() => onDeleteLocation(loc.id)}
                    className="p-2.5 rounded-xl bg-red-500/15 text-red-300 border border-red-500/30 text-xs font-bold hover:bg-red-500/25 transition-colors cursor-pointer"
                    title="Удалить точку"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: TELEGRAM ADMIN RECIPIENTS MANAGEMENT (NEW) */}
      {activeTab === "admins" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white">Админы в Telegram ({adminRecipients.length})</h2>
            <button
              onClick={() => setIsAddAdminModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-amber-400 text-black text-xs font-bold flex items-center gap-1.5 hover:bg-amber-300 transition-colors cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              + Админ Telegram
            </button>
          </div>

          {/* Helper Bot Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-950/30 to-purple-950/30 border border-pink-500/30 space-y-2">
            <div className="flex items-center gap-2 text-pink-300 font-bold text-xs">
              <HelpCircle className="w-4 h-4 shrink-0" />
              <span>Бот для автоматического извлечения Telegram ID:</span>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Чтобы узнать цифровой ID нового администратора, откройте нашего бота-помощника:
            </p>
            <a
              href="https://t.me/user_id_fetcher_bot"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500/40 text-pink-300 text-xs font-bold transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              @user_id_fetcher_bot
              <ExternalLink className="w-3 h-3 ml-0.5" />
            </a>
          </div>

          <div className="space-y-3 pt-1">
            {adminRecipients.map((admin) => (
              <div
                key={admin.id}
                className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-between"
              >
                <div>
                  <h4 className="font-bold text-sm text-white">{admin.name}</h4>
                  <p className="text-xs font-mono text-pink-300 mt-0.5">
                    Telegram ID: {admin.telegramId}
                  </p>
                </div>

                <button
                  onClick={() => onDeleteAdminRecipient(admin.id)}
                  className="p-2.5 rounded-xl bg-red-500/15 text-red-300 border border-red-500/30 text-xs font-bold hover:bg-red-500/25 transition-colors cursor-pointer"
                  title="Удалить администратора"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Master Modal */}
      <AddMasterModal
        isOpen={isAddMasterModalOpen}
        locations={locations}
        onClose={() => setIsAddMasterModalOpen(false)}
        onAddMaster={onAddMaster}
      />

      {/* Add Location Branch Modal */}
      <AddLocationModal
        isOpen={isAddLocationModalOpen}
        onClose={() => setIsAddLocationModalOpen(false)}
        onAddLocation={onAddLocation}
      />

      {/* Edit Salon Brand Name Modal */}
      <EditSalonNameModal
        isOpen={isEditSalonNameModalOpen}
        currentSalonName={salonBrandName}
        onClose={() => setIsEditSalonNameModalOpen(false)}
        onSaveSalonName={onSaveSalonBrandName}
      />

      {/* Add Service Modal */}
      <AddServiceModal
        isOpen={isAddServiceModalOpen}
        onClose={() => setIsAddServiceModalOpen(false)}
        onAddService={onAddService}
      />

      {/* Edit Service Modal */}
      <EditServiceModal
        isOpen={!!editingService}
        service={editingService}
        onClose={() => setEditingService(null)}
        onSaveService={onEditService}
      />

      {/* Add Telegram Admin ID Modal */}
      <AddAdminModal
        isOpen={isAddAdminModalOpen}
        onClose={() => setIsAddAdminModalOpen(false)}
        onAddAdminId={onAddAdminRecipient}
      />
    </div>
  );
}
