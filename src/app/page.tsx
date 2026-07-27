"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, AlertTriangle, Clock } from "lucide-react";
import { BEAUTY_SERVICES as INITIAL_SERVICES, INITIAL_MASTERS, TIME_SLOTS, LOCATIONS as INITIAL_LOCATIONS } from "@/data/mockData";
import { ActiveBooking, DayItem, Location, Master, BeautyService, AdminRecipient } from "@/types";

// Modular Components
import Header from "@/components/Header";
import ServiceStep from "@/components/ServiceStep";
import MasterStep from "@/components/MasterStep";
import DateTimeStep from "@/components/DateTimeStep";
import ConfirmStep from "@/components/ConfirmStep";
import SuccessTicketStep from "@/components/SuccessTicketStep";
import AdminPanel from "@/components/AdminPanel";
import LocationModal from "@/components/LocationModal";
import MyBookingsModal from "@/components/MyBookingsModal";

// Helper to generate days for current and next month
const generateDaysList = (): DayItem[] => {
  const days: DayItem[] = [];
  const today = new Date();
  const dayNames = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
  const monthNames = [
    "января",
    "февраля",
    "марта",
    "апреля",
    "мая",
    "июня",
    "июля",
    "августа",
    "сентября",
    "октября",
    "ноября",
    "декабря",
  ];

  for (let i = 0; i < 30; i++) {
    const d = new Date();
    d.setDate(today.getDate() + i);

    const isToday = i === 0;
    const isTomorrow = i === 1;

    let displayLabel = `${d.getDate()} ${monthNames[d.getMonth()]}`;
    if (isToday) displayLabel = `Сегодня, ${d.getDate()} ${monthNames[d.getMonth()]}`;
    if (isTomorrow) displayLabel = `Завтра, ${d.getDate()} ${monthNames[d.getMonth()]}`;

    days.push({
      dateObj: d,
      dayNum: d.getDate(),
      dayName: dayNames[d.getDay()],
      monthName: monthNames[d.getMonth()],
      monthNum: d.getMonth(),
      fullLabel: displayLabel,
      isWeekend: d.getDay() === 0 || d.getDay() === 6,
      fullyBooked: i === 3 || i === 7 || i === 12,
    });
  }
  return days;
};

export default function Home() {
  const daysList = generateDaysList();

  // App State
  const [step, setStep] = useState<number>(1);
  const [mode, setMode] = useState<"client" | "admin">("client");

  // Dynamic Brand & Salon Network State
  const [salonBrandName, setSalonBrandName] = useState<string>("AURA BEAUTY");
  const [locations, setLocations] = useState<Location[]>(INITIAL_LOCATIONS);

  // Dynamic Price List / Services State
  const [services, setServices] = useState<BeautyService[]>(INITIAL_SERVICES);

  // Dynamic Masters state
  const [masters, setMasters] = useState<Master[]>(INITIAL_MASTERS);

  // Client Telegram User ID (Default Danil's ID: 520913321)
  const [clientTelegramId, setClientTelegramId] = useState<string>("520913321");

  // Dynamic Admin Telegram Recipients State (User is both Admin and Client)
  const [adminRecipients, setAdminRecipients] = useState<AdminRecipient[]>([
    {
      id: "a1",
      telegramId: "520913321",
      name: "Даня Болотин (Управляющий)",
      active: true,
    },
  ]);

  // Active Bookings state
  const [activeBookings, setActiveBookings] = useState<ActiveBooking[]>([
    {
      code: "BT-7721",
      location: INITIAL_LOCATIONS[0],
      master: INITIAL_MASTERS[0],
      date: "Сегодня, 27 июля",
      time: "14:00",
      services: [INITIAL_SERVICES[0]],
      totalPrice: 2500,
      clientName: "Екатерина Смирнова",
      clientPhone: "+7 (916) 123-45-67",
      createdAt: "10:30",
    },
  ]);

  // Selections
  const [selectedLocation, setSelectedLocation] = useState<Location>(INITIAL_LOCATIONS[0]);
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>(["s1"]);
  const [selectedMaster, setSelectedMaster] = useState<Master>(INITIAL_MASTERS[0]);
  const [selectedDayItem, setSelectedDayItem] = useState<DayItem>(daysList[0]);
  const [selectedTime, setSelectedTime] = useState<string>("10:00");
  const [clientName, setClientName] = useState<string>("Даня Болотин");
  const [clientPhone, setClientPhone] = useState<string>("+7 (999) 000-00-00");
  const [latestBookingCode, setLatestBookingCode] = useState<string>("");

  // Modals state
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isMyBookingsModalOpen, setIsMyBookingsModalOpen] = useState(false);
  const [isCalendarGridModalOpen, setIsCalendarGridModalOpen] = useState(false);
  const [cancelingCode, setCancelingCode] = useState<string | null>(null);

  // Slots state
  const [slots, setSlots] = useState(TIME_SLOTS);

  // Dynamically set active Telegram user as BOTH Client and Admin
  useEffect(() => {
    try {
      if (typeof window !== "undefined" && (window as any).Telegram?.WebApp) {
        const tg = (window as any).Telegram.WebApp;
        tg.ready();
        tg.expand();

        if (tg.initDataUnsafe?.user) {
          const user = tg.initDataUnsafe.user;
          if (user.id) {
            const detectedId = String(user.id).trim();
            const fullName = `${user.first_name || ""} ${user.last_name || ""}`.trim() || "Пользователь Telegram";
            
            setClientTelegramId(detectedId);
            setClientName(fullName);

            setAdminRecipients([
              {
                id: "user_" + detectedId,
                telegramId: detectedId,
                name: `${fullName} (Управляющий)`,
                active: true,
              },
            ]);
          }
        }
      }
    } catch (e) {
      console.error("Telegram SDK init error:", e);
    }
  }, []);

  const triggerHaptic = (type: "light" | "medium" | "heavy" | "success" | "error" = "light") => {
    try {
      if (typeof window !== "undefined" && (window as any).Telegram?.WebApp?.HapticFeedback) {
        const haptic = (window as any).Telegram.WebApp.HapticFeedback;
        if (type === "success") {
          haptic.notificationOccurred("success");
        } else if (type === "error") {
          haptic.notificationOccurred("error");
        } else {
          haptic.impactOccurred(type);
        }
      }
    } catch (e) {}
  };

  // Calculations
  const selectedServices = services.filter((s) => selectedServiceIds.includes(s.id));
  const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const totalDuration = selectedServices.reduce((sum, s) => sum + s.durationMinutes, 0);

  // Handlers
  const toggleService = (id: string) => {
    triggerHaptic("light");
    setSelectedServiceIds((prev) => {
      if (prev.includes(id)) {
        if (prev.length === 1) return prev;
        return prev.filter((item) => item !== id);
      }
      return [...prev, id];
    });
  };

  const sendNotificationPayload = (bookingObj: ActiveBooking) => {
    try {
      const payload = JSON.stringify({
        booking: bookingObj,
        adminRecipients,
        clientTelegramId,
      });

      const primaryUrl = "https://02-beauty-booking-bot-seven.vercel.app/api/notify";

      // 1. Direct async fetch to primary endpoint
      fetch(primaryUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch((err) => console.error("Fetch notify err:", err));

      // 2. Relative endpoint fallback
      fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch((err) => console.error("Fetch relative notify err:", err));
    } catch (e) {
      console.error("sendNotificationPayload error:", e);
    }
  };

  const handleConfirmBooking = () => {
    triggerHaptic("success");
    const code = "BT-" + Math.floor(1000 + Math.random() * 9000);
    setLatestBookingCode(code);

    const newBooking: ActiveBooking = {
      code,
      location: selectedLocation,
      master: selectedMaster,
      date: selectedDayItem.fullLabel,
      time: selectedTime,
      services: selectedServices,
      totalPrice,
      clientName,
      clientPhone,
      createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setActiveBookings((prev) => [newBooking, ...prev]);
    setSlots((prev) => prev.map((s) => (s.time === selectedTime ? { ...s, available: false } : s)));
    setStep(5);

    // Trigger notification dispatch
    sendNotificationPayload(newBooking);

    // Safe Canvas Confetti invocation
    setTimeout(() => {
      try {
        import("canvas-confetti").then((confettiModule) => {
          confettiModule.default({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
        }).catch(() => {});
      } catch (e) {}
    }, 200);
  };

  const handleCancelBooking = (codeToCancel: string) => {
    triggerHaptic("error");
    const booking = activeBookings.find((b) => b.code === codeToCancel);
    if (booking) {
      setSlots((prev) => prev.map((s) => (s.time === booking.time ? { ...s, available: true } : s)));
    }
    setActiveBookings((prev) => prev.filter((b) => b.code !== codeToCancel));
    setCancelingCode(null);
  };

  // Admin Actions for Masters
  const handleToggleVacation = (masterId: string) => {
    triggerHaptic("medium");
    setMasters((prev) =>
      prev.map((m) => (m.id === masterId ? { ...m, onVacation: !m.onVacation } : m))
    );
  };

  const handleDeleteMaster = (masterId: string) => {
    triggerHaptic("error");
    setMasters((prev) => prev.filter((m) => m.id !== masterId));
  };

  const handleAddMaster = (newMaster: Master) => {
    triggerHaptic("success");
    setMasters((prev) => [...prev, newMaster]);
  };

  // Admin Actions for Locations & Brand Name
  const handleAddLocation = (newLoc: Location) => {
    triggerHaptic("success");
    setLocations((prev) => [...prev, newLoc]);
    setSelectedLocation(newLoc);
  };

  const handleDeleteLocation = (locId: string) => {
    triggerHaptic("error");
    setLocations((prev) => {
      const filtered = prev.filter((l) => l.id !== locId);
      if (selectedLocation.id === locId && filtered.length > 0) {
        setSelectedLocation(filtered[0]);
      }
      return filtered;
    });
  };

  const handleSaveSalonBrandName = (newName: string) => {
    triggerHaptic("success");
    setSalonBrandName(newName);
  };

  // Admin Actions for Services / Pricing CRUD
  const handleAddService = (newService: BeautyService) => {
    triggerHaptic("success");
    setServices((prev) => [...prev, newService]);
  };

  const handleEditService = (updatedService: BeautyService) => {
    triggerHaptic("success");
    setServices((prev) =>
      prev.map((s) => (s.id === updatedService.id ? updatedService : s))
    );
  };

  const handleDeleteService = (serviceId: string) => {
    triggerHaptic("error");
    setServices((prev) => {
      const filtered = prev.filter((s) => s.id !== serviceId);
      if (selectedServiceIds.includes(serviceId) && filtered.length > 0) {
        setSelectedServiceIds([filtered[0].id]);
      }
      return filtered;
    });
  };

  // Admin Actions for Telegram ID Recipients
  const handleAddAdminRecipient = (telegramId: string, name: string) => {
    triggerHaptic("success");
    const newAdmin: AdminRecipient = {
      id: "admin_" + Date.now(),
      telegramId,
      name,
      active: true,
    };
    setAdminRecipients((prev) => [...prev, newAdmin]);
  };

  const handleDeleteAdminRecipient = (id: string) => {
    triggerHaptic("error");
    setAdminRecipients((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <main className="min-h-screen bg-[#090a0f] text-white flex flex-col justify-between max-w-md mx-auto relative overflow-hidden select-none pb-8 font-sans">
      {/* Background ambient lighting */}
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-pink-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-32 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Modular Header */}
      <Header
        salonBrandName={salonBrandName}
        step={step}
        mode={mode}
        selectedLocation={selectedLocation}
        activeBookingsCount={activeBookings.length}
        onBack={() => {
          triggerHaptic("light");
          setStep((s) => s - 1);
        }}
        onOpenLocationModal={() => {
          triggerHaptic("light");
          setIsLocationModalOpen(true);
        }}
        onOpenBookingsModal={() => {
          triggerHaptic("light");
          setIsMyBookingsModalOpen(true);
        }}
        onToggleMode={() => {
          triggerHaptic("medium");
          setMode((m) => (m === "client" ? "admin" : "client"));
        }}
      />

      {/* ADMIN PANEL VIEW */}
      {mode === "admin" ? (
        <AdminPanel
          salonBrandName={salonBrandName}
          activeBookings={activeBookings}
          masters={masters}
          locations={locations}
          services={services}
          adminRecipients={adminRecipients}
          selectedLocation={selectedLocation}
          onExitAdmin={() => setMode("client")}
          onCancelBooking={(code) => setCancelingCode(code)}
          onToggleVacation={handleToggleVacation}
          onDeleteMaster={handleDeleteMaster}
          onAddMaster={handleAddMaster}
          onAddLocation={handleAddLocation}
          onDeleteLocation={handleDeleteLocation}
          onSaveSalonBrandName={handleSaveSalonBrandName}
          onAddService={handleAddService}
          onEditService={handleEditService}
          onDeleteService={handleDeleteService}
          onAddAdminRecipient={handleAddAdminRecipient}
          onDeleteAdminRecipient={handleDeleteAdminRecipient}
        />
      ) : (
        /* CLIENT STEPPER VIEW */
        <div className="relative z-10 px-5 py-4 flex-1">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <ServiceStep
                services={services}
                selectedServiceIds={selectedServiceIds}
                selectedLocation={selectedLocation}
                onToggleService={toggleService}
              />
            )}

            {step === 2 && (
              <MasterStep
                masters={masters}
                selectedMaster={selectedMaster}
                selectedLocation={selectedLocation}
                onSelectMaster={(master) => {
                  triggerHaptic("medium");
                  setSelectedMaster(master);
                }}
              />
            )}

            {step === 3 && (
              <DateTimeStep
                selectedMaster={selectedMaster}
                selectedDayItem={selectedDayItem}
                selectedTime={selectedTime}
                daysList={daysList}
                slots={slots}
                totalDuration={totalDuration}
                onSelectDay={(day) => {
                  triggerHaptic("light");
                  setSelectedDayItem(day);
                }}
                onSelectTime={(time) => {
                  triggerHaptic("light");
                  setSelectedTime(time);
                }}
                onOpenCalendarGrid={() => {
                  triggerHaptic("light");
                  setIsCalendarGridModalOpen(true);
                }}
              />
            )}

            {step === 4 && (
              <ConfirmStep
                selectedMaster={selectedMaster}
                selectedLocation={selectedLocation}
                selectedDayItem={selectedDayItem}
                selectedTime={selectedTime}
                selectedServices={selectedServices}
                totalDuration={totalDuration}
                totalPrice={totalPrice}
                clientName={clientName}
                clientPhone={clientPhone}
                onChangeName={setClientName}
                onChangePhone={setClientPhone}
              />
            )}

            {step === 5 && (
              <SuccessTicketStep
                bookingCode={latestBookingCode}
                selectedMaster={selectedMaster}
                selectedLocation={selectedLocation}
                selectedDayItem={selectedDayItem}
                selectedTime={selectedTime}
                totalPrice={totalPrice}
                onOpenBookings={() => {
                  triggerHaptic("light");
                  setIsMyBookingsModalOpen(true);
                }}
                onNewBooking={() => {
                  triggerHaptic("light");
                  setStep(1);
                }}
              />
            )}
          </AnimatePresence>
        </div>
      )}

      {/* LOCATION MODAL */}
      <LocationModal
        isOpen={isLocationModalOpen}
        locations={locations}
        selectedLocation={selectedLocation}
        onClose={() => setIsLocationModalOpen(false)}
        onSelectLocation={(loc) => {
          triggerHaptic("medium");
          setSelectedLocation(loc);
          setIsLocationModalOpen(false);
        }}
      />

      {/* MY BOOKINGS MODAL */}
      <MyBookingsModal
        isOpen={isMyBookingsModalOpen}
        activeBookings={activeBookings}
        onClose={() => setIsMyBookingsModalOpen(false)}
        onRequestCancel={(code) => setCancelingCode(code)}
      />

      {/* CONFIRM CANCELLATION WARNING DIALOG */}
      <AnimatePresence>
        {cancelingCode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-5 font-sans"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm bg-[#13151f] border border-red-500/40 rounded-3xl p-5 text-center space-y-4 shadow-2xl"
            >
              <div className="w-12 h-12 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center mx-auto text-red-400">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-base font-bold text-white">Отменить запись #{cancelingCode}?</h3>
                <p className="text-xs text-neutral-300 mt-1">
                  Временной слот будет освобожден, а бронирование удалено.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-2">
                <button
                  onClick={() => setCancelingCode(null)}
                  className="py-2.5 px-4 rounded-xl bg-white/10 text-white font-bold text-xs hover:bg-white/20 transition-colors"
                >
                  Оставить
                </button>
                <button
                  onClick={() => handleCancelBooking(cancelingCode)}
                  className="py-2.5 px-4 rounded-xl bg-red-500 text-white font-bold text-xs hover:bg-red-600 transition-colors shadow-lg shadow-red-500/25 cursor-pointer"
                >
                  Да, отменить
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ULTRA-PREMIUM LUXURY BOTTOM ACTION BAR */}
      {step < 5 && mode === "client" && (
        <div className="relative z-20 px-5 pt-3.5 pb-3 bg-[#0d0f17]/95 backdrop-blur-xl border-t border-white/10 shadow-2xl">
          <div className="flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">
                Итого к оплате
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-xl font-extrabold text-white tracking-tight">
                  {totalPrice.toLocaleString("ru-RU")} ₽
                </span>
                <span className="text-xs text-neutral-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-pink-400" />
                  {totalDuration} мин
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                if (step < 4) {
                  triggerHaptic("medium");
                  setStep((s) => s + 1);
                } else {
                  handleConfirmBooking();
                }
              }}
              className="py-3 px-6 rounded-2xl bg-white text-black font-extrabold text-sm hover:bg-pink-50 transition-all flex items-center gap-2 shadow-lg shadow-white/10 active:scale-[0.97] cursor-pointer shrink-0"
            >
              <span>
                {step === 1 && "Выбрать мастера"}
                {step === 2 && "Выбрать дату"}
                {step === 3 && "Подтвердить"}
                {step === 4 && "Записаться"}
              </span>
              <ArrowRight className="w-4 h-4 text-black" />
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
