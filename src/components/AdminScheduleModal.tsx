import React, { useState } from 'react';
import {
  X,
  Calendar as CalendarIcon,
  Clock,
  User,
  Shield,
  Ban,
  CheckCircle,
  PlusCircle,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { Appointment, BusinessConfig, Specialist } from '../types/booking';
import { formatDatePretty, formatTime12h } from '../utils/calendar';

interface AdminScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  business: BusinessConfig;
  appointments: Appointment[];
  blockedSlotKeys: string[];
  onToggleBlockSlot: (slotKey: string) => void;
  onUpdateStatus: (aptId: string, status: 'confirmed' | 'in-progress' | 'completed' | 'cancelled') => void;
}

export const AdminScheduleModal: React.FC<AdminScheduleModalProps> = ({
  isOpen,
  onClose,
  business,
  appointments,
  blockedSlotKeys,
  onToggleBlockSlot,
  onUpdateStatus
}) => {
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [selectedSpecialistId, setSelectedSpecialistId] = useState<string>('all');

  if (!isOpen) return null;

  // Day filter
  const dayAppointments = appointments.filter((apt) => {
    if (apt.date !== selectedDate) return false;
    if (selectedSpecialistId !== 'all' && apt.specialist.id !== selectedSpecialistId) return false;
    return true;
  });

  // Calculate day stats
  const activeDayAppointments = dayAppointments.filter((a) => a.status !== 'cancelled');
  const dayRevenue = activeDayAppointments.reduce((sum, a) => sum + a.totalPrice, 0);
  const dayBookedHours = (activeDayAppointments.reduce((sum, a) => sum + a.totalDurationMinutes, 0) / 60).toFixed(1);

  // Time slots for schedule matrix
  const matrixHours = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'
  ];

  // Navigate dates
  const changeDate = (days: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-5xl w-full my-auto shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-stone-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CalendarIcon className="w-5 h-5 text-stone-300" />
            <div>
              <h3 className="text-base font-serif font-semibold">
                Studio Roster & Operations View
              </h3>
              <p className="text-xs text-stone-400 font-mono">
                Real-time appointment schedule, specialist roster, and slot blocking
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white transition-colors p-1 rounded hover:bg-stone-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Date & Filter Toolbar */}
        <div className="p-4 bg-stone-50 border-b border-stone-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => changeDate(-1)}
              className="p-1.5 rounded-lg border border-stone-300 bg-white hover:bg-stone-100 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 text-stone-700" />
            </button>
            <span className="font-serif font-semibold text-stone-900 text-sm sm:text-base px-2">
              {formatDatePretty(selectedDate)}
            </span>
            <button
              onClick={() => changeDate(1)}
              className="p-1.5 rounded-lg border border-stone-300 bg-white hover:bg-stone-100 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4 text-stone-700" />
            </button>

            <button
              onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
              className="ml-2 text-xs font-mono text-stone-600 hover:text-stone-900 underline cursor-pointer"
            >
              Jump to Today
            </button>
          </div>

          {/* Specialist Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-500 font-mono">Filter Artisan:</span>
            <select
              value={selectedSpecialistId}
              onChange={(e) => setSelectedSpecialistId(e.target.value)}
              className="text-xs py-1.5 px-3 rounded-lg border border-stone-300 bg-white text-stone-800"
            >
              <option value="all">All Artisans ({business.specialists.length})</option>
              {business.specialists.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Metrics Banner */}
        <div className="px-6 py-3 bg-white border-b border-stone-100 grid grid-cols-3 gap-4 text-xs font-mono">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-stone-400" />
            <div>
              <span className="text-stone-400 block text-[10px]">Reservations</span>
              <span className="font-semibold text-stone-900">{activeDayAppointments.length} Booked</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-stone-400" />
            <div>
              <span className="text-stone-400 block text-[10px]">Bench / Studio Time</span>
              <span className="font-semibold text-stone-900">{dayBookedHours} hrs</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-stone-400" />
            <div>
              <span className="text-stone-400 block text-[10px]">Day Revenue Value</span>
              <span className="font-semibold text-stone-900">{business.currencySymbol}{dayRevenue}</span>
            </div>
          </div>
        </div>

        {/* Schedule Grid Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span>Click any time block to toggle custom slot block (staff break / equipment maintenance):</span>
            <span className="font-mono">{blockedSlotKeys.filter(k => k.startsWith(selectedDate)).length} slots currently blocked</span>
          </div>

          <div className="border border-stone-200 rounded-xl overflow-hidden bg-white">
            <div className="grid grid-cols-1 divide-y divide-stone-100 text-xs">
              {matrixHours.map((time) => {
                const blockKey = `${selectedDate}_${time}_all`;
                const isBlocked = blockedSlotKeys.includes(blockKey);

                // Find if an appointment covers this time
                const activeApt = activeDayAppointments.find(
                  (a) => time >= a.startTime && time < a.endTime
                );

                return (
                  <div
                    key={time}
                    className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 transition-colors ${
                      activeApt
                        ? 'bg-amber-50/40 border-l-2 border-l-stone-900'
                        : isBlocked
                        ? 'bg-stone-100/70'
                        : 'hover:bg-stone-50/70'
                    }`}
                  >
                    {/* Time Column */}
                    <div className="w-24 font-mono font-semibold text-stone-900 flex items-center gap-2 shrink-0">
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      <span>{formatTime12h(time)}</span>
                    </div>

                    {/* Status / Appointment Detail */}
                    <div className="flex-1 px-3 py-1 sm:py-0">
                      {activeApt ? (
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <span className="font-semibold text-stone-900 font-serif">
                              {activeApt.customer.fullName}
                            </span>
                            <span className="text-stone-500 text-[11px] ml-2">
                              · {activeApt.service.name} ({activeApt.specialist.name})
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white border border-stone-200 text-stone-700">
                              Ref: {activeApt.referenceNumber}
                            </span>

                            {/* Status Changer */}
                            <select
                              value={activeApt.status}
                              onChange={(e) => onUpdateStatus(activeApt.id, e.target.value as any)}
                              className="text-[11px] font-mono py-0.5 px-2 rounded border border-stone-200 bg-white"
                            >
                              <option value="confirmed">Confirmed</option>
                              <option value="in-progress">In Service</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </div>
                        </div>
                      ) : isBlocked ? (
                        <div className="flex items-center gap-2 text-stone-500 italic">
                          <Ban className="w-3.5 h-3.5 text-stone-400" />
                          <span>Slot Blocked (Internal Maintenance / Staff Break)</span>
                        </div>
                      ) : (
                        <span className="text-stone-400 text-xs font-mono">Open Slot</span>
                      )}
                    </div>

                    {/* Action button */}
                    <div className="pt-2 sm:pt-0 shrink-0">
                      {!activeApt && (
                        <button
                          type="button"
                          onClick={() => onToggleBlockSlot(blockKey)}
                          className={`px-3 py-1 rounded text-[11px] font-mono font-medium transition-colors cursor-pointer ${
                            isBlocked
                              ? 'bg-stone-900 text-white hover:bg-stone-800'
                              : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
                          }`}
                        >
                          {isBlocked ? 'Unblock Slot' : 'Block Slot'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-medium bg-stone-900 text-white rounded-lg hover:bg-stone-800 cursor-pointer"
          >
            Close Studio Roster
          </button>
        </div>
      </div>
    </div>
  );
};
