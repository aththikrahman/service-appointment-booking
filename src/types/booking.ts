export type BusinessType = 'salon' | 'repair' | 'consultancy';

export interface ServiceAddon {
  id: string;
  name: string;
  price: number;
  durationMinutes: number;
  description: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  category: string;
  price: number;
  durationMinutes: number;
  description: string;
  longDescription?: string;
  prepNotes: string[];
  recommendedAddons?: ServiceAddon[];
}

export interface Specialist {
  id: string;
  name: string;
  title: string;
  role: string;
  bio: string;
  experienceYears: number;
  rating: number;
  reviewCount: number;
  avatarUrl: string;
  specialties: string[];
  availableDays: number[]; // 0 = Sunday, 1 = Monday, etc.
  availableHours: { start: string; end: string };
}

export type SlotStatus = 'available' | 'booked' | 'filling-fast' | 'blocked';

export interface TimeSlot {
  time: string; // "09:00", "09:30", etc.
  status: SlotStatus;
  specialistId?: string;
  remainingCapacity?: number;
}

export type PaymentMethodType = 'card' | 'apple_pay' | 'google_pay';
export type PaymentScheduleType = 'deposit' | 'full' | 'venue_guarantee';

export interface PaymentDetails {
  method: PaymentMethodType;
  schedule: PaymentScheduleType;
  cardBrand?: 'visa' | 'mastercard' | 'amex' | 'discover' | 'unknown';
  cardLast4?: string;
  cardHolderName?: string;
  amountCharged: number;
  remainingBalance: number;
  transactionId: string;
  timestamp: string;
  status: 'paid' | 'authorized' | 'refunded';
}

export interface CustomerInfo {
  fullName: string;
  email: string;
  phone: string;
  notes?: string;
  preferences?: {
    quietAppointment?: boolean;
    beverageChoice?: string;
    allergiesOrSensitivities?: string;
  };
}

export interface Appointment {
  id: string;
  referenceNumber: string;
  businessType: BusinessType;
  service: ServiceItem;
  addons: ServiceAddon[];
  specialist: Specialist;
  date: string; // YYYY-MM-DD
  startTime: string; // "14:00"
  endTime: string; // "15:30"
  totalDurationMinutes: number;
  customer: CustomerInfo;
  payment: PaymentDetails;
  totalPrice: number;
  status: 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface BusinessConfig {
  id: BusinessType;
  name: string;
  tagline: string;
  industry: string;
  address: string;
  phone: string;
  email: string;
  depositPercentage: number;
  heroImage: string;
  brandAccent: string;
  currency: string;
  currencySymbol: string;
  services: ServiceItem[];
  specialists: Specialist[];
}
