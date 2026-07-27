export interface Location {
  id: string;
  name: string;
  address: string;
  metro: string;
  metroColor: string;
  image: string;
}

export interface BeautyService {
  id: string;
  name: string;
  category: "manicure" | "pedicure" | "extra";
  durationMinutes: number;
  price: number;
  description: string;
  badge?: string;
  popular?: boolean;
}

export interface Master {
  id: string;
  name: string;
  role: string;
  avatar: string;
  specialties: string[];
  nextSlot: string;
  locationId: string;
  onVacation?: boolean;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface ActiveBooking {
  code: string;
  location: Location;
  master: Master;
  date: string;
  time: string;
  services: BeautyService[];
  totalPrice: number;
  clientName: string;
  clientPhone: string;
  createdAt: string;
}

export interface DayItem {
  dateObj: Date;
  dayNum: number;
  dayName: string;
  monthName: string;
  monthNum: number;
  fullLabel: string;
  isWeekend: boolean;
  fullyBooked: boolean;
}

export interface AdminRecipient {
  id: string;
  telegramId: string;
  name: string;
  active: boolean;
}
