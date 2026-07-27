import { Location, BeautyService, Master, TimeSlot } from "@/types";

export const LOCATIONS: Location[] = [
  {
    id: "loc1",
    name: "Аура Арбат",
    address: "ул. Арбат, 12",
    metro: "м. Смоленская",
    metroColor: "bg-sky-500",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500&auto=format&fit=crop&q=80",
  },
  {
    id: "loc2",
    name: "Аура Сити",
    address: "Пресненская наб., 8",
    metro: "м. Выставочная",
    metroColor: "bg-teal-500",
    image: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=500&auto=format&fit=crop&q=80",
  },
  {
    id: "loc3",
    name: "Аура Тверская",
    address: "ул. Тверская, 19",
    metro: "м. Маяковская",
    metroColor: "bg-green-500",
    image: "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=500&auto=format&fit=crop&q=80",
  },
];

export const BEAUTY_SERVICES: BeautyService[] = [
  {
    id: "s1",
    name: "Комплексный маникюр + покрытие",
    category: "manicure",
    durationMinutes: 90,
    price: 2500,
    description: "Снятие, выравнивание ногтевой пластины, комбинированный маникюр, гель-лак",
    popular: true,
    badge: "Хит",
  },
  {
    id: "s2",
    name: "Smart-педикюр с покрытием",
    category: "pedicure",
    durationMinutes: 90,
    price: 3200,
    description: "Обработка стоп smart-диском, пальчиков, выравнивание и покрытие гель-лаком",
    popular: true,
    badge: "TOP",
  },
  {
    id: "s3",
    name: "Экспресс-маникюр без покрытия",
    category: "manicure",
    durationMinutes: 45,
    price: 1500,
    description: "Гигиенический маникюр, придавание формы, масло для кутикулы",
  },
  {
    id: "s4",
    name: "Дизайн ногтей (френч / втирка / градиент)",
    category: "extra",
    durationMinutes: 30,
    price: 500,
    description: "Авторский дизайн на все ногти или френч любой сложности",
  },
  {
    id: "s5",
    name: "Снятие чужого покрытия",
    category: "extra",
    durationMinutes: 20,
    price: 400,
    description: "Деликатное снятие гель-лака фрезой без повреждения ногтей",
  },
];

export const INITIAL_MASTERS: Master[] = [
  {
    id: "m1",
    name: "Алёна Воронина",
    role: "Top Master & Инструктор",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    specialties: ["Френч", "Сложный дизайн", "Наращивание"],
    nextSlot: "Сегодня в 14:00",
    locationId: "loc1",
    onVacation: false,
  },
  {
    id: "m2",
    name: "София Морозова",
    role: "Senior Nail Artist",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80",
    specialties: ["Smart-педикюр", "Минимализм", "Эко-глянец"],
    nextSlot: "Сегодня в 16:30",
    locationId: "loc1",
    onVacation: false,
  },
  {
    id: "m3",
    name: "Кристина Белкова",
    role: "Nail Stylist",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80",
    specialties: ["Экспресс-маникюр", "Графика", "Гель-укрепление"],
    nextSlot: "Завтра в 10:00",
    locationId: "loc2",
    onVacation: true,
  },
];

export const TIME_SLOTS: TimeSlot[] = [
  { time: "10:00", available: true },
  { time: "12:00", available: true },
  { time: "14:00", available: false },
  { time: "15:30", available: true },
  { time: "17:00", available: false },
  { time: "18:30", available: true },
];
