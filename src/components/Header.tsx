import React from 'react';
import { Calendar, Clock, Sparkles } from 'lucide-react';
import { BusinessConfig, BusinessType } from '../types/booking';

interface HeaderProps {
  business: BusinessConfig;
  currentType: BusinessType;
  onSelectBusinessType: (type: BusinessType) => void;
  onOpenManageBookings: () => void;
  onOpenAdminSchedule: () => void;
  onStartBooking: () => void;
  activeAppointmentsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  business,
  currentType,
  onSelectBusinessType,
  onOpenManageBookings,
  onOpenAdminSchedule,
  onStartBooking,
  activeAppointmentsCount
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#fbfbf9]/95 backdrop-blur-md border-b border-stone-200/80 transition-all">
      {/* Top Bar Contract: 3 zones separated by gap-8 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element Brand wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onStartBooking();
            }}
            className="text-xl sm:text-2xl font-serif font-semibold tracking-tight text-stone-900 whitespace-nowrap shrink-0 hover:text-stone-700 transition-colors"
          >
            {business.name.split(' ')[0]} <span className="font-sans font-light text-stone-500 text-lg sm:text-xl">Atelier</span>
          </a>
        </div>

        {/* Zone 2: 4-5 clean single-line nav links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
          <a
            href="#services"
            className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0"
          >
            Services
          </a>
          <a
            href="#specialists"
            className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0"
          >
            Artisans
          </a>
          <a
            href="#booking-engine"
            className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0"
          >
            Real-Time Slots
          </a>
          <button
            onClick={onOpenManageBookings}
            className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <Clock className="w-4 h-4 text-stone-400" />
            <span>Manage Booking</span>
            {activeAppointmentsCount > 0 && (
              <span className="font-mono text-xs bg-stone-900 text-white rounded-full px-1.5 py-0.2 leading-tight">
                {activeAppointmentsCount}
              </span>
            )}
          </button>
          <button
            onClick={onOpenAdminSchedule}
            className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer text-stone-500 hover:text-stone-800"
          >
            <Calendar className="w-4 h-4 text-stone-400" />
            <span>Studio Schedule</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onStartBooking}
            className="px-5 py-2.5 text-xs sm:text-sm font-medium text-white bg-stone-900 rounded-lg hover:bg-stone-800 transition-colors whitespace-nowrap shrink-0 shadow-sm cursor-pointer"
          >
            Reserve Slot
          </button>
        </div>
      </div>

      {/* Domain Mode Switcher strip (Allows testing Salon, Repair Lab, and Consultancy seamlessly) */}
      <div className="bg-stone-100/70 border-t border-stone-200/50 py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-stone-500">
            <Sparkles className="w-3.5 h-3.5 text-stone-400" />
            <span className="font-medium text-stone-700">Business Model Demo:</span>
            <span className="hidden sm:inline text-stone-500">Switch booking context to explore tailored workflows</span>
          </div>

          {/* Interactive filter tabs / segmented controls */}
          <div className="flex items-center gap-1 p-0.5 bg-white border border-stone-200/80 rounded-lg shadow-2xs">
            <button
              onClick={() => onSelectBusinessType('salon')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                currentType === 'salon'
                  ? 'bg-stone-900 text-white shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Salon & Spa
            </button>
            <button
              onClick={() => onSelectBusinessType('repair')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                currentType === 'repair'
                  ? 'bg-stone-900 text-white shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Precision Repair Centre
            </button>
            <button
              onClick={() => onSelectBusinessType('consultancy')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                currentType === 'consultancy'
                  ? 'bg-stone-900 text-white shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Executive Consultancy
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
