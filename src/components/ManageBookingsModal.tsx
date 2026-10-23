import React, { useState } from 'react';
import {
  X,
  Search,
  Calendar,
  Clock,
  MapPin,
  Mail,
  AlertTriangle,
  CheckCircle2,
  Download,
  Trash2,
  RefreshCw,
  ArrowRight
} from 'lucide-react';
import { Appointment, BusinessConfig, Specialist } from '../types/booking';
import { formatDatePretty, formatTime12h, getDailySlots, calculateEndTime, downloadIcsFile } from '../utils/calendar';

interface ManageBookingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointments: Appointment[];
  business: BusinessConfig;
  onUpdateAppointment: (updatedApt: Appointment) => void;
  onCancelAppointment: (aptId: string) => void;
  onViewEmail: (apt: Appointment) => void;
  blockedSlotKeys: string[];
}

export const ManageBookingsModal: React.FC<ManageBookingsModalProps> = ({
  isOpen,
  onClose,
  appointments,
  business,
  onUpdateAppointment,
  onCancelAppointment,
  onViewEmail,
  blockedSlotKeys
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAptId, setSelectedAptId] = useState<string | null>(null);

  // Reschedule mode states
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [newDate, setNewDate] = useState<string>('');
  const [newTime, setNewTime] = useState<string>('');
  const [rescheduleSuccess, setRescheduleSuccess] = useState(false);

  // Cancellation confirm state
  const [showCancelConfirmId, setShowCancelConfirmId] = useState<string | null>(null);

  if (!isOpen) return null;

  // Filter appointments by search or show all for current business
  const filteredAppointments = appointments.filter((apt) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      apt.referenceNumber.toLowerCase().includes(q) ||
      apt.customer.email.toLowerCase().includes(q) ||
      apt.customer.fullName.toLowerCase().includes(q)
    );
  });

  const selectedApt = appointments.find((a) => a.id === selectedAptId) || filteredAppointments[0] || null;

  // Handle Reschedule action
  const handleStartReschedule = (apt: Appointment) => {
    setSelectedAptId(apt.id);
    setIsRescheduling(true);
    setNewDate(apt.date);
    setNewTime('');
    setRescheduleSuccess(false);
  };

  const handleConfirmReschedule = () => {
    if (!selectedApt || !newDate || !newTime) return;

    const newEndTime = calculateEndTime(newTime, selectedApt.totalDurationMinutes);
    const updated: Appointment = {
      ...selectedApt,
      date: newDate,
      startTime: newTime,
      endTime: newEndTime
    };

    onUpdateAppointment(updated);
    setRescheduleSuccess(true);
    setTimeout(() => {
      setIsRescheduling(false);
      setRescheduleSuccess(false);
    }, 1500);
  };

  // Next 14 days for rescheduling
  const upcomingDates = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return {
      iso: d.toISOString().split('T')[0],
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNum: d.getDate(),
      month: d.toLocaleDateString('en-US', { month: 'short' })
    };
  });

  // Calculate slots for rescheduling date
  const rescheduleSlots = newDate && selectedApt
    ? getDailySlots(newDate, selectedApt.specialist, appointments.filter((a) => a.id !== selectedApt.id), blockedSlotKeys)
    : [];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full my-auto shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-stone-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-stone-300" />
            <div>
              <h3 className="text-base font-serif font-semibold">
                Client Reservation Portal
              </h3>
              <p className="text-xs text-stone-400 font-mono">
                Manage, reschedule, or cancel active atelier bookings
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

        {/* Search Bar */}
        <div className="p-4 bg-stone-50 border-b border-stone-200 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by Reference (e.g. LMR-89241) or email address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-white rounded-lg border border-stone-300 focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
            />
          </div>
          <span className="text-xs text-stone-500 font-mono shrink-0">
            {filteredAppointments.length} reservation{filteredAppointments.length !== 1 ? 's' : ''} found
          </span>
        </div>

        {/* Content Area: Left list & Right detail */}
        <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-hidden min-h-[420px]">
          {/* Left Column: Appointments List */}
          <div className="md:col-span-5 border-r border-stone-200 overflow-y-auto p-4 space-y-3 bg-[#fbfbf9]/60">
            {filteredAppointments.length === 0 ? (
              <div className="text-center py-12 text-stone-500 space-y-2">
                <Clock className="w-8 h-8 mx-auto text-stone-300" />
                <p className="text-xs font-medium">No matching bookings found.</p>
                <p className="text-[11px] text-stone-400">Try searching with your email or reference code.</p>
              </div>
            ) : (
              filteredAppointments.map((apt) => {
                const isSelected = selectedApt?.id === apt.id;
                const isCancelled = apt.status === 'cancelled';

                return (
                  <div
                    key={apt.id}
                    onClick={() => {
                      setSelectedAptId(apt.id);
                      setIsRescheduling(false);
                    }}
                    className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'border-stone-900 bg-white ring-1 ring-stone-900 shadow-2xs'
                        : 'border-stone-200/90 bg-white hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-mono font-semibold text-stone-900">{apt.referenceNumber}</span>
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                          isCancelled
                            ? 'bg-stone-100 text-stone-500 line-through'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                        }`}
                      >
                        {apt.status.toUpperCase()}
                      </span>
                    </div>

                    <h4 className="text-xs font-serif font-semibold text-stone-900 truncate">
                      {apt.service.name}
                    </h4>

                    <div className="mt-2 text-[11px] text-stone-500 flex items-center justify-between font-mono">
                      <span>{formatDatePretty(apt.date)}</span>
                      <span>{formatTime12h(apt.startTime)}</span>
                    </div>

                    <div className="mt-1 text-[11px] text-stone-400 truncate">
                      {apt.customer.fullName} · {apt.specialist.name}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right Column: Detail View or Reschedule Interface */}
          <div className="md:col-span-7 overflow-y-auto p-6 bg-white space-y-6">
            {selectedApt ? (
              isRescheduling ? (
                /* Reschedule Flow */
                <div className="space-y-5">
                  <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                    <div>
                      <h4 className="text-base font-serif font-semibold text-stone-900">
                        Reschedule Appointment
                      </h4>
                      <p className="text-xs text-stone-500 font-mono">
                        Ref #{selectedApt.referenceNumber} · {selectedApt.service.name}
                      </p>
                    </div>

                    <button
                      onClick={() => setIsRescheduling(false)}
                      className="text-xs text-stone-500 hover:text-stone-900 underline cursor-pointer"
                    >
                      Cancel Reschedule
                    </button>
                  </div>

                  {rescheduleSuccess ? (
                    <div className="p-8 text-center bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                      <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                      <h5 className="text-base font-serif font-semibold text-emerald-900">
                        Appointment Rescheduled!
                      </h5>
                      <p className="text-xs text-emerald-700">
                        Updated confirmation email and calendar sync file have been refreshed.
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Pick new date */}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider block">
                          Select New Date:
                        </label>
                        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                          {upcomingDates.map((d) => (
                            <button
                              key={d.iso}
                              type="button"
                              onClick={() => {
                                setNewDate(d.iso);
                                setNewTime('');
                              }}
                              className={`py-2 px-3 rounded-lg border text-center min-w-16 cursor-pointer transition-all ${
                                newDate === d.iso
                                  ? 'bg-stone-900 text-white border-stone-900'
                                  : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
                              }`}
                            >
                              <div className="text-[10px] uppercase font-mono">{d.dayName}</div>
                              <div className="text-sm font-semibold">{d.dayNum}</div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Pick new slot */}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider block">
                          Available Slots for {formatDatePretty(newDate)}:
                        </label>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                          {rescheduleSlots.filter((s) => s.status !== 'booked' && s.status !== 'blocked').map((slot) => (
                            <button
                              key={slot.time}
                              type="button"
                              onClick={() => setNewTime(slot.time)}
                              className={`py-2 px-1 text-xs font-mono rounded-lg border transition-all cursor-pointer ${
                                newTime === slot.time
                                  ? 'bg-stone-900 text-white border-stone-900'
                                  : 'bg-white text-stone-800 border-stone-200 hover:border-stone-400'
                              }`}
                            >
                              {formatTime12h(slot.time)}
                            </button>
                          ))}
                        </div>
                      </div>

                      {newTime && (
                        <div className="p-3 bg-stone-50 rounded-lg text-xs text-stone-700 font-mono">
                          New Time Window:{' '}
                          <span className="font-semibold text-stone-900">
                            {formatTime12h(newTime)} – {formatTime12h(calculateEndTime(newTime, selectedApt.totalDurationMinutes))}
                          </span>
                        </div>
                      )}

                      <div className="pt-2 flex justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => setIsRescheduling(false)}
                          className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          disabled={!newDate || !newTime}
                          onClick={handleConfirmReschedule}
                          className={`px-5 py-2 text-xs font-medium rounded-lg text-white transition-all cursor-pointer ${
                            newDate && newTime
                              ? 'bg-stone-900 hover:bg-stone-800'
                              : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                          }`}
                        >
                          Confirm Rescheduled Slot
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                /* Selected Appointment Details */
                <div className="space-y-6">
                  <div className="flex items-start justify-between border-b border-stone-200 pb-4">
                    <div>
                      <span className="text-xs font-mono text-stone-400 uppercase tracking-wider block">
                        Reservation Details
                      </span>
                      <h4 className="text-xl font-serif font-semibold text-stone-900 mt-0.5">
                        {selectedApt.service.name}
                      </h4>
                      <p className="text-xs text-stone-500 font-mono">
                        Ref: {selectedApt.referenceNumber}
                      </p>
                    </div>

                    <button
                      onClick={() => onViewEmail(selectedApt)}
                      className="px-3 py-1.5 text-xs font-medium bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>View Email</span>
                    </button>
                  </div>

                  {/* Summary Cards */}
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="p-3.5 bg-stone-50 rounded-lg space-y-1">
                      <span className="text-stone-400 block font-mono text-[10px]">Date & Time</span>
                      <div className="font-semibold text-stone-900">{formatDatePretty(selectedApt.date)}</div>
                      <div className="text-stone-600 font-mono">
                        {formatTime12h(selectedApt.startTime)} – {formatTime12h(selectedApt.endTime)}
                      </div>
                    </div>

                    <div className="p-3.5 bg-stone-50 rounded-lg space-y-1">
                      <span className="text-stone-400 block font-mono text-[10px]">Artisan & Duration</span>
                      <div className="font-semibold text-stone-900">{selectedApt.specialist.name}</div>
                      <div className="text-stone-600 font-mono">{selectedApt.totalDurationMinutes} minutes session</div>
                    </div>
                  </div>

                  {/* Payment Details */}
                  <div className="p-4 bg-stone-50 rounded-lg border border-stone-200/80 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-stone-500">Service Value:</span>
                      <span className="font-medium text-stone-900">{business.currencySymbol}{selectedApt.totalPrice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Paid Today:</span>
                      <span className="font-medium text-emerald-700 font-mono">{business.currencySymbol}{selectedApt.payment.amountCharged}</span>
                    </div>
                    {selectedApt.payment.remainingBalance > 0 && (
                      <div className="flex justify-between">
                        <span className="text-stone-500">Balance Due at Studio:</span>
                        <span className="font-medium text-stone-900 font-mono">{business.currencySymbol}{selectedApt.payment.remainingBalance}</span>
                      </div>
                    )}
                    <div className="text-[11px] text-stone-400 font-mono pt-1 border-t border-stone-200/60">
                      Transaction ID: {selectedApt.payment.transactionId}
                    </div>
                  </div>

                  {/* Self-service Actions */}
                  {selectedApt.status !== 'cancelled' ? (
                    <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => handleStartReschedule(selectedApt)}
                        className="px-4 py-2 text-xs font-medium bg-stone-900 text-white hover:bg-stone-800 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Reschedule Appointment</span>
                      </button>

                      <button
                        onClick={() => downloadIcsFile(selectedApt, business)}
                        className="px-4 py-2 text-xs font-medium border border-stone-300 text-stone-700 hover:bg-stone-50 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download .ics</span>
                      </button>

                      <button
                        onClick={() => setShowCancelConfirmId(selectedApt.id)}
                        className="px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ml-auto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  ) : (
                    <div className="p-3 bg-stone-100 rounded-lg text-xs text-stone-500 text-center">
                      This reservation has been cancelled. Any eligible deposits have been refunded.
                    </div>
                  )}

                  {/* Cancel confirmation dialog inline */}
                  {showCancelConfirmId === selectedApt.id && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl space-y-3">
                      <div className="flex items-start gap-2.5">
                        <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                        <div className="text-xs text-red-800 space-y-1">
                          <p className="font-semibold">Confirm Cancellation?</p>
                          <p>
                            Are you sure you wish to cancel reservation #{selectedApt.referenceNumber}? As per our policy, eligible deposits will be credited back within 3-5 business days.
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          onClick={() => setShowCancelConfirmId(null)}
                          className="px-3 py-1.5 text-xs text-stone-600 hover:text-stone-900 bg-white rounded border border-stone-300 cursor-pointer"
                        >
                          Keep Appointment
                        </button>
                        <button
                          onClick={() => {
                            onCancelAppointment(selectedApt.id);
                            setShowCancelConfirmId(null);
                          }}
                          className="px-3 py-1.5 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded cursor-pointer"
                        >
                          Yes, Cancel Appointment
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            ) : (
              <div className="h-full flex items-center justify-center text-stone-400 text-xs">
                Select a reservation from the list to view specifications or reschedule.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
