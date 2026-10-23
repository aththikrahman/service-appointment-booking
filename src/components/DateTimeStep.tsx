import React, { useMemo } from 'react';
import { Calendar as CalendarIcon, Clock, ArrowLeft, Sun, Sunset, Moon, CheckCircle2 } from 'lucide-react';
import { Specialist, Appointment, BusinessConfig } from '../types/booking';
import { getDailySlots, formatDatePretty, formatTime12h, calculateEndTime } from '../utils/calendar';

interface DateTimeStepProps {
  business: BusinessConfig;
  selectedDate: string;
  selectedTime: string;
  totalDurationMinutes: number;
  selectedSpecialist: Specialist | null;
  existingAppointments: Appointment[];
  blockedSlotKeys: string[];
  onSelectDate: (date: string) => void;
  onSelectTime: (time: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const DateTimeStep: React.FC<DateTimeStepProps> = ({
  business,
  selectedDate,
  selectedTime,
  totalDurationMinutes,
  selectedSpecialist,
  existingAppointments,
  blockedSlotKeys,
  onSelectDate,
  onSelectTime,
  onNext,
  onBack
}) => {
  // Generate next 21 days for availability selection
  const availableDates = useMemo(() => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 21; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNum = d.getDate();
      const monthName = d.toLocaleDateString('en-US', { month: 'short' });
      const isWeekend = d.getDay() === 0 || d.getDay() === 6;
      dates.push({
        iso,
        dayName,
        dayNum,
        monthName,
        isWeekend
      });
    }
    return dates;
  }, []);

  // Compute live slots for the currently selected date
  const slots = useMemo(() => {
    return getDailySlots(selectedDate, selectedSpecialist, existingAppointments, blockedSlotKeys);
  }, [selectedDate, selectedSpecialist, existingAppointments, blockedSlotKeys]);

  // Group slots into Morning, Afternoon, Evening
  const morningSlots = slots.filter((s) => {
    const hour = parseInt(s.time.split(':')[0], 10);
    return hour < 12;
  });

  const afternoonSlots = slots.filter((s) => {
    const hour = parseInt(s.time.split(':')[0], 10);
    return hour >= 12 && hour < 17;
  });

  const eveningSlots = slots.filter((s) => {
    const hour = parseInt(s.time.split(':')[0], 10);
    return hour >= 17;
  });

  const calculatedEndTime = selectedTime ? calculateEndTime(selectedTime, totalDurationMinutes) : null;

  return (
    <div className="space-y-8">
      {/* Step Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-medium text-stone-500 uppercase tracking-wider mb-2">
          <span>Step 03</span>
          <span aria-hidden="true">·</span>
          <span>Live Availability</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-2xl sm:text-3xl font-serif font-medium text-stone-900 tracking-tight">
            Select Appointment Date & Time
          </h2>
          <div className="text-xs text-stone-500 flex items-center gap-1.5 bg-stone-100/80 px-3 py-1.5 rounded-lg border border-stone-200/80 self-start sm:self-auto font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            <span>Real-time availability synced</span>
          </div>
        </div>
        <p className="mt-1 text-sm text-stone-600 max-w-2xl">
          Showing real-time openings for {selectedSpecialist ? selectedSpecialist.name : 'all available artisans'}. Total session duration is <strong className="font-semibold text-stone-900 font-mono">{totalDurationMinutes} mins</strong>.
        </p>
      </div>

      {/* Date Picker Horizontal Strip */}
      <div className="space-y-3">
        <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
          <CalendarIcon className="w-3.5 h-3.5 text-stone-400" />
          <span>Available Dates</span>
        </label>

        <div className="flex items-center gap-2 overflow-x-auto pb-3 scrollbar-thin">
          {availableDates.map((item) => {
            const isSelected = selectedDate === item.iso;
            return (
              <button
                key={item.iso}
                type="button"
                onClick={() => {
                  onSelectDate(item.iso);
                  onSelectTime(''); // Reset time when date changes
                }}
                className={`flex flex-col items-center justify-center min-w-18 py-3 px-2 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-stone-900 bg-stone-900 text-white shadow-sm'
                    : 'border-stone-200 bg-white text-stone-700 hover:border-stone-400 hover:bg-stone-50'
                }`}
              >
                <span className={`text-[11px] font-medium uppercase ${isSelected ? 'text-stone-300' : 'text-stone-400'}`}>
                  {item.dayName}
                </span>
                <span className={`text-lg font-serif font-semibold my-0.5 tabular-nums ${isSelected ? 'text-white' : 'text-stone-900'}`}>
                  {item.dayNum}
                </span>
                <span className={`text-[10px] uppercase font-mono ${isSelected ? 'text-stone-300' : 'text-stone-500'}`}>
                  {item.monthName}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Slots Area */}
      <div className="bg-white rounded-xl border border-stone-200/90 p-5 sm:p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div>
            <h3 className="text-base font-serif font-medium text-stone-900">
              Openings for {formatDatePretty(selectedDate)}
            </h3>
            <p className="text-xs text-stone-500 mt-0.5 font-mono">
              Slots automatically lock for 15 minutes once chosen
            </p>
          </div>

          {selectedTime && (
            <div className="text-right">
              <span className="text-xs text-stone-500 font-mono block">Estimated Time:</span>
              <span className="text-xs font-semibold text-stone-900 font-mono">
                {formatTime12h(selectedTime)} – {formatTime12h(calculatedEndTime || '')}
              </span>
            </div>
          )}
        </div>

        {slots.length === 0 ? (
          <div className="py-12 text-center text-stone-500 space-y-2">
            <Clock className="w-8 h-8 mx-auto text-stone-300" />
            <p className="text-sm font-medium text-stone-700">No available slots on this date.</p>
            <p className="text-xs text-stone-500">
              The selected specialist does not hold studio hours on this day. Please pick another date or select &quot;First Available Specialist&quot;.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Morning */}
            {morningSlots.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-medium text-stone-500">
                  <Sun className="w-3.5 h-3.5 text-stone-400" />
                  <span>Morning (09:00 – 12:00)</span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                  {morningSlots.map((slot) => renderSlotButton(slot))}
                </div>
              </div>
            )}

            {/* Afternoon */}
            {afternoonSlots.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-medium text-stone-500">
                  <Sunset className="w-3.5 h-3.5 text-stone-400" />
                  <span>Afternoon (12:00 – 17:00)</span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                  {afternoonSlots.map((slot) => renderSlotButton(slot))}
                </div>
              </div>
            )}

            {/* Evening */}
            {eveningSlots.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-medium text-stone-500">
                  <Moon className="w-3.5 h-3.5 text-stone-400" />
                  <span>Evening (17:00 – 19:30)</span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                  {eveningSlots.map((slot) => renderSlotButton(slot))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Legend */}
        <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center gap-4 text-xs text-stone-500 font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm border border-stone-300 bg-white"></span>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-100 border border-amber-300"></span>
            <span>1 Slot Remaining</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-stone-100 border border-stone-200"></span>
            <span>Booked / Reserved</span>
          </div>
        </div>
      </div>

      {/* Navigation Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-900 flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Artisans</span>
        </button>

        <button
          onClick={onNext}
          disabled={!selectedTime}
          className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
            selectedTime
              ? 'bg-stone-900 text-white hover:bg-stone-800 shadow-sm'
              : 'bg-stone-200 text-stone-400 cursor-not-allowed'
          }`}
        >
          Enter Details &rarr;
        </button>
      </div>
    </div>
  );

  function renderSlotButton(slot: { time: string; status: string }) {
    const isSelected = selectedTime === slot.time;
    const isBooked = slot.status === 'booked';
    const isBlocked = slot.status === 'blocked';
    const isFillingFast = slot.status === 'filling-fast';
    const isDisabled = isBooked || isBlocked;

    return (
      <button
        key={slot.time}
        type="button"
        disabled={isDisabled}
        onClick={() => onSelectTime(slot.time)}
        className={`relative py-2.5 px-2 rounded-lg text-xs font-mono font-medium transition-all text-center ${
          isSelected
            ? 'bg-stone-900 text-white shadow-sm ring-1 ring-stone-900'
            : isDisabled
            ? 'bg-stone-100/70 text-stone-400 border border-stone-200/50 cursor-not-allowed line-through'
            : isFillingFast
            ? 'bg-amber-50/70 text-stone-900 border border-amber-200 hover:border-amber-400 cursor-pointer'
            : 'bg-white text-stone-800 border border-stone-200 hover:border-stone-400 hover:bg-stone-50 cursor-pointer'
        }`}
      >
        <div className="tabular-nums font-semibold">
          {formatTime12h(slot.time)}
        </div>
        {isFillingFast && !isSelected && (
          <div className="text-[9px] text-amber-700 tracking-tight mt-0.5 font-sans">
            Popular
          </div>
        )}
        {isDisabled && (
          <div className="text-[9px] text-stone-400 tracking-tight mt-0.5 font-sans">
            {isBlocked ? 'Reserved' : 'Booked'}
          </div>
        )}
      </button>
    );
  }
};
