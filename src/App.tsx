import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  ShieldCheck,
  Star,
  CheckCircle2,
  Sparkles,
  MapPin,
  Phone,
  Mail,
  ChevronRight,
  ArrowRight
} from 'lucide-react';

import {
  BusinessType,
  ServiceItem,
  ServiceAddon,
  Specialist,
  Appointment,
  CustomerInfo,
  PaymentDetails
} from './types/booking';

import { BUSINESS_CONFIGS, INITIAL_APPOINTMENTS } from './data/mockData';
import { Header } from './components/Header';
import { ServiceStep } from './components/ServiceStep';
import { SpecialistStep } from './components/SpecialistStep';
import { DateTimeStep } from './components/DateTimeStep';
import { DetailsStep } from './components/DetailsStep';
import { PaymentStep } from './components/PaymentStep';
import { ConfirmationView } from './components/ConfirmationView';
import { EmailModal } from './components/EmailModal';
import { ManageBookingsModal } from './components/ManageBookingsModal';
import { AdminScheduleModal } from './components/AdminScheduleModal';
import { calculateEndTime } from './utils/calendar';

export default function App() {
  // Current active business profile ('salon' | 'repair' | 'consultancy')
  const [businessType, setBusinessType] = useState<BusinessType>('salon');
  const currentBusiness = BUSINESS_CONFIGS[businessType];

  // Global appointments state with pre-seeded realistic bookings
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);

  // Admin blocked slots (e.g. "YYYY-MM-DD_12:00_all")
  const [blockedSlotKeys, setBlockedSlotKeys] = useState<string[]>([]);

  // Wizard active step (1 to 5, or 6 = confirmed)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Wizard selections
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(() => currentBusiness.services[0]);
  const [selectedAddons, setSelectedAddons] = useState<ServiceAddon[]>([]);
  const [selectedSpecialist, setSelectedSpecialist] = useState<Specialist | null>(null);

  // Today + 2 days by default for comfortable testing
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [selectedTime, setSelectedTime] = useState<string>('11:00');

  // Customer information with default user email from metadata
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    fullName: 'Genevieve Dupré',
    email: 'rahmanaththik2@gmail.com',
    phone: '+44 7700 900382',
    notes: 'Looking forward to customized balayage tone consultation.',
    preferences: {
      quietAppointment: false,
      beverageChoice: 'Matcha Latte',
      allergiesOrSensitivities: ''
    }
  });

  // Recently completed appointment for confirmation view
  const [latestAppointment, setLatestAppointment] = useState<Appointment | null>(null);

  // Modal controls
  const [emailModalAppointment, setEmailModalAppointment] = useState<Appointment | null>(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // Switch business type handler
  const handleSelectBusinessType = (type: BusinessType) => {
    setBusinessType(type);
    const newBiz = BUSINESS_CONFIGS[type];
    setSelectedService(newBiz.services[0]);
    setSelectedAddons([]);
    setSelectedSpecialist(null);
    setCurrentStep(1);
    setLatestAppointment(null);
  };

  // Add-on toggle
  const handleToggleAddon = (addon: ServiceAddon) => {
    setSelectedAddons((prev) => {
      const exists = prev.some((a) => a.id === addon.id);
      if (exists) {
        return prev.filter((a) => a.id !== addon.id);
      } else {
        return [...prev, addon];
      }
    });
  };

  // Total duration in minutes
  const totalDurationMinutes = (selectedService?.durationMinutes || 0) +
    selectedAddons.reduce((sum, a) => sum + a.durationMinutes, 0);

  // Payment completed handler
  const handlePaymentComplete = (payment: PaymentDetails) => {
    if (!selectedService) return;

    const assignedSpecialist = selectedSpecialist || currentBusiness.specialists[0];
    const calculatedEndTimeStr = calculateEndTime(selectedTime, totalDurationMinutes);
    const subtotal = selectedService.price + selectedAddons.reduce((sum, a) => sum + a.price, 0);
    const refCode = `${currentBusiness.name.slice(0, 3).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`;

    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      referenceNumber: refCode,
      businessType,
      service: selectedService,
      addons: selectedAddons,
      specialist: assignedSpecialist,
      date: selectedDate,
      startTime: selectedTime,
      endTime: calculatedEndTimeStr,
      totalDurationMinutes,
      customer: customerInfo,
      payment,
      totalPrice: subtotal,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    setAppointments((prev) => [newAppointment, ...prev]);
    setLatestAppointment(newAppointment);
    setCurrentStep(6); // Step 6 = Confirmation View

    // Scroll to booking engine view smoothly
    document.getElementById('booking-engine')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Update existing appointment (reschedule)
  const handleUpdateAppointment = (updatedApt: Appointment) => {
    setAppointments((prev) => prev.map((a) => (a.id === updatedApt.id ? updatedApt : a)));
  };

  // Cancel appointment
  const handleCancelAppointment = (aptId: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === aptId ? { ...a, status: 'cancelled' as const } : a))
    );
  };

  // Toggle admin block slot
  const handleToggleBlockSlot = (slotKey: string) => {
    setBlockedSlotKeys((prev) =>
      prev.includes(slotKey) ? prev.filter((k) => k !== slotKey) : [...prev, slotKey]
    );
  };

  // Update appointment status from admin view
  const handleUpdateStatus = (aptId: string, status: 'confirmed' | 'in-progress' | 'completed' | 'cancelled') => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === aptId ? { ...a, status } : a))
    );
  };

  // Reset to start a new booking
  const handleStartNewBooking = () => {
    setCurrentStep(1);
    setLatestAppointment(null);
    setSelectedAddons([]);
    document.getElementById('booking-engine')?.scrollIntoView({ behavior: 'smooth' });
  };

  const steps = [
    { num: 1, label: 'Services' },
    { num: 2, label: 'Artisan' },
    { num: 3, label: 'Availability' },
    { num: 4, label: 'Details' },
    { num: 5, label: 'Payment' }
  ];

  return (
    <div className="min-h-screen bg-[#fbfbf9] text-stone-900 flex flex-col font-sans selection:bg-stone-900 selection:text-white">
      {/* Top Bar Navigation adhering to Top Bar Contract */}
      <Header
        business={currentBusiness}
        currentType={businessType}
        onSelectBusinessType={handleSelectBusinessType}
        onOpenManageBookings={() => setIsManageModalOpen(true)}
        onOpenAdminSchedule={() => setIsAdminModalOpen(true)}
        onStartBooking={handleStartNewBooking}
        activeAppointmentsCount={appointments.filter((a) => a.status === 'confirmed').length}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-stone-200/80 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              {/* Left Column: Editorial Headline & Proof */}
              <div className="lg:col-span-7 space-y-6">
                <div className="flex items-center gap-2 text-xs font-mono text-stone-500 uppercase tracking-wider">
                  <span>{currentBusiness.industry}</span>
                  <span aria-hidden="true">·</span>
                  <span>Mayfair Flagship</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-medium tracking-tight text-stone-900 text-balance leading-[1.12]">
                  {businessType === 'salon'
                    ? 'Artisanal Hair Design & Botanical Scalp Care'
                    : businessType === 'repair'
                    ? 'Certified Chronometry & Micro-Electronic Bench'
                    : 'Board-Level Advisory & Enterprise Architecture'}
                </h1>

                <p className="text-base sm:text-lg text-stone-600 max-w-xl font-normal leading-relaxed">
                  {currentBusiness.tagline} Experience seamless real-time appointment scheduling, dedicated artisan matching, and guaranteed reservation security.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <a
                    href="#booking-engine"
                    className="px-6 py-3.5 bg-stone-900 text-white rounded-xl text-sm font-medium hover:bg-stone-800 transition-all shadow-md inline-flex items-center gap-2 cursor-pointer"
                  >
                    <span>Reserve an Appointment</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>

                  <button
                    onClick={() => setIsManageModalOpen(true)}
                    className="px-5 py-3.5 rounded-xl border border-stone-300 text-stone-700 text-sm font-medium hover:bg-stone-50 transition-colors inline-flex items-center gap-2 cursor-pointer"
                  >
                    <Clock className="w-4 h-4 text-stone-500" />
                    <span>Lookup Existing Booking</span>
                  </button>
                </div>

                {/* Claim-to-Proof Quantitative Adjacency (Zero-Pill Discipline) */}
                <div className="pt-6 border-t border-stone-100 grid grid-cols-3 gap-6 text-stone-800">
                  <div>
                    <div className="text-2xl font-serif font-semibold text-stone-900 tabular-nums">4.98</div>
                    <div className="text-xs text-stone-500 font-mono mt-0.5">Verified Client Rating</div>
                  </div>
                  <div>
                    <div className="text-2xl font-serif font-semibold text-stone-900 tabular-nums">100%</div>
                    <div className="text-xs text-stone-500 font-mono mt-0.5">Real-Time Slot Guarantee</div>
                  </div>
                  <div>
                    <div className="text-2xl font-serif font-semibold text-stone-900 tabular-nums">14+ Yrs</div>
                    <div className="text-xs text-stone-500 font-mono mt-0.5">Master Artisan Guild</div>
                  </div>
                </div>
              </div>

              {/* Right Column: High-Fidelity Domain Image */}
              <div className="lg:col-span-5 relative">
                <div className="relative rounded-2xl overflow-hidden border border-stone-200/90 shadow-lg aspect-4/3 lg:aspect-square bg-stone-100">
                  <img
                    src={currentBusiness.heroImage}
                    alt={currentBusiness.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  {/* Measured Scrim for subtle presence */}
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent flex items-end p-6">
                    <div className="text-white space-y-1">
                      <div className="text-xs font-mono tracking-wider uppercase text-stone-300">
                        {currentBusiness.name}
                      </div>
                      <div className="text-sm font-medium text-stone-100">
                        {currentBusiness.address}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Booking Interface Section */}
        <section id="booking-engine" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          {/* Progress Indicator (Steps 1 to 5) */}
          {currentStep <= 5 && (
            <div className="mb-10">
              <div className="flex items-center justify-between max-w-xl mx-auto relative">
                {/* Horizontal progress bar track */}
                <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-0.5 bg-stone-200 -z-0"></div>
                <div
                  className="absolute top-1/2 left-0 -translate-y-1/2 h-0.5 bg-stone-900 transition-all duration-300 -z-0"
                  style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                ></div>

                {steps.map((s) => {
                  const isDone = currentStep > s.num;
                  const isCurrent = currentStep === s.num;

                  return (
                    <button
                      key={s.num}
                      type="button"
                      disabled={s.num > currentStep}
                      onClick={() => setCurrentStep(s.num)}
                      className={`relative z-10 flex flex-col items-center group ${
                        s.num <= currentStep ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-medium transition-all ${
                          isDone
                            ? 'bg-stone-900 text-white'
                            : isCurrent
                            ? 'bg-stone-900 text-white ring-4 ring-stone-200'
                            : 'bg-white border-2 border-stone-300 text-stone-500'
                        }`}
                      >
                        {isDone ? <CheckCircle2 className="w-4 h-4" /> : s.num}
                      </div>
                      <span className={`text-[11px] font-medium mt-1.5 whitespace-nowrap ${
                        isCurrent ? 'text-stone-900 font-semibold' : 'text-stone-500'
                      }`}>
                        {s.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Active Wizard Step Component */}
          {currentStep === 1 && (
            <ServiceStep
              business={currentBusiness}
              selectedService={selectedService}
              selectedAddons={selectedAddons}
              onSelectService={(srv) => setSelectedService(srv)}
              onToggleAddon={handleToggleAddon}
              onNext={() => setCurrentStep(2)}
            />
          )}

          {currentStep === 2 && (
            <SpecialistStep
              business={currentBusiness}
              selectedSpecialist={selectedSpecialist}
              onSelectSpecialist={(spec) => setSelectedSpecialist(spec)}
              onNext={() => setCurrentStep(3)}
              onBack={() => setCurrentStep(1)}
            />
          )}

          {currentStep === 3 && (
            <DateTimeStep
              business={currentBusiness}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              totalDurationMinutes={totalDurationMinutes}
              selectedSpecialist={selectedSpecialist}
              existingAppointments={appointments}
              blockedSlotKeys={blockedSlotKeys}
              onSelectDate={(d) => setSelectedDate(d)}
              onSelectTime={(t) => setSelectedTime(t)}
              onNext={() => setCurrentStep(4)}
              onBack={() => setCurrentStep(2)}
            />
          )}

          {currentStep === 4 && (
            <DetailsStep
              business={currentBusiness}
              customerInfo={customerInfo}
              onChangeCustomerInfo={(info) => setCustomerInfo(info)}
              onNext={() => setCurrentStep(5)}
              onBack={() => setCurrentStep(3)}
            />
          )}

          {currentStep === 5 && selectedService && (
            <PaymentStep
              business={currentBusiness}
              service={selectedService}
              addons={selectedAddons}
              specialist={selectedSpecialist}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              totalDurationMinutes={totalDurationMinutes}
              customerName={customerInfo.fullName}
              customerEmail={customerInfo.email}
              onPaymentComplete={handlePaymentComplete}
              onBack={() => setCurrentStep(4)}
            />
          )}

          {currentStep === 6 && latestAppointment && (
            <ConfirmationView
              appointment={latestAppointment}
              business={currentBusiness}
              onOpenEmailPreview={() => {
                setEmailModalAppointment(latestAppointment);
                setIsEmailModalOpen(true);
              }}
              onBookAnother={handleStartNewBooking}
              onOpenManageBookings={() => setIsManageModalOpen(true)}
            />
          )}
        </section>

        {/* Trust & Guarantee Section */}
        <section className="bg-white border-t border-stone-200/80 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center text-stone-800">
                  <Clock className="w-5 h-5" />
                </div>
                <h4 className="text-base font-serif font-medium text-stone-900">
                  Real-Time Availability Engine
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Time slots sync in real-time with our master calendar. When you select an opening, your slot is held instantly without double bookings.
                </p>
              </div>

              <div className="space-y-2">
                <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center text-stone-800">
                  <Mail className="w-5 h-5" />
                </div>
                <h4 className="text-base font-serif font-medium text-stone-900">
                  Automated Email & Calendar Sync
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Receive a detailed HTML itinerary with a mobile QR check-in pass, pre-care instructions, and standard RFC 5545 .ics calendar synchronization.
                </p>
              </div>

              <div className="space-y-2">
                <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center text-stone-800">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="text-base font-serif font-medium text-stone-900">
                  Encrypted Payment Gateway
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Choose deposit, full settlement, or card guarantee with 256-bit TLS encryption, PCI-DSS Level 1 compliance, and 3-D Secure biometric challenge.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 py-12 border-t border-stone-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="text-base font-serif font-semibold text-white">
              {currentBusiness.name}
            </div>
            <p className="text-stone-400">{currentBusiness.address} · {currentBusiness.phone}</p>
          </div>

          <div className="flex items-center gap-6 font-mono text-[11px]">
            <span>© 2026 {currentBusiness.name.split(' ')[0]} Atelier</span>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setIsManageModalOpen(true)}
              className="text-stone-300 hover:text-white underline cursor-pointer"
            >
              Lookup Booking
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setIsAdminModalOpen(true)}
              className="text-stone-300 hover:text-white underline cursor-pointer"
            >
              Staff Roster
            </button>
          </div>
        </div>
      </footer>

      {/* Dispatched Email Preview Modal */}
      <EmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        appointment={emailModalAppointment}
        business={currentBusiness}
        onRescheduleClick={(apt) => {
          setIsManageModalOpen(true);
        }}
      />

      {/* Client Self-Service Management Portal */}
      <ManageBookingsModal
        isOpen={isManageModalOpen}
        onClose={() => setIsManageModalOpen(false)}
        appointments={appointments}
        business={currentBusiness}
        onUpdateAppointment={handleUpdateAppointment}
        onCancelAppointment={handleCancelAppointment}
        onViewEmail={(apt) => {
          setEmailModalAppointment(apt);
          setIsEmailModalOpen(true);
        }}
        blockedSlotKeys={blockedSlotKeys}
      />

      {/* Studio Admin / Receptionist Schedule Modal */}
      <AdminScheduleModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        business={currentBusiness}
        appointments={appointments}
        blockedSlotKeys={blockedSlotKeys}
        onToggleBlockSlot={handleToggleBlockSlot}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
}
