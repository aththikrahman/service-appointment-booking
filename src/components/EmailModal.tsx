import React, { useState } from 'react';
import {
  X,
  Mail,
  Send,
  Calendar,
  Clock,
  MapPin,
  Check,
  Download,
  QrCode,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import { Appointment, BusinessConfig } from '../types/booking';
import { formatDatePretty, formatTime12h, downloadIcsFile, getGoogleCalendarUrl } from '../utils/calendar';

interface EmailModalProps {
  appointment: Appointment | null;
  business: BusinessConfig;
  isOpen: boolean;
  onClose: () => void;
  onRescheduleClick?: (apt: Appointment) => void;
}

export const EmailModal: React.FC<EmailModalProps> = ({
  appointment,
  business,
  isOpen,
  onClose,
  onRescheduleClick
}) => {
  const [resending, setResending] = useState(false);
  const [resentSuccess, setResentSuccess] = useState(false);

  if (!isOpen || !appointment) return null;

  const handleResend = () => {
    setResending(true);
    setTimeout(() => {
      setResending(false);
      setResentSuccess(true);
      setTimeout(() => setResentSuccess(false), 3000);
    }, 1000);
  };

  const handleDownloadIcs = () => {
    downloadIcsFile(appointment, business);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full my-auto shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Email Client Header Bar */}
        <div className="bg-stone-900 text-white px-5 py-3.5 flex items-center justify-between gap-4 border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <Mail className="w-4 h-4 text-stone-300" />
            <span className="text-xs font-mono font-medium tracking-wide">
              Dispatched Transactional Email Preview
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResend}
              disabled={resending}
              className="px-3 py-1 text-xs font-medium bg-stone-800 hover:bg-stone-700 rounded-md transition-colors text-stone-200 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {resentSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Email Dispatched!</span>
                </>
              ) : (
                <>
                  <Send className={`w-3.5 h-3.5 ${resending ? 'animate-pulse' : ''}`} />
                  <span>{resending ? 'Sending...' : 'Resend to Client'}</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="text-stone-400 hover:text-white transition-colors p-1 rounded hover:bg-stone-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Email Metadata Strip */}
        <div className="bg-stone-50 border-b border-stone-200 px-6 py-3 text-xs space-y-1 font-mono text-stone-600">
          <div className="flex items-center gap-2">
            <span className="text-stone-400 w-16">From:</span>
            <span className="font-semibold text-stone-900">{business.name} &lt;{business.email}&gt;</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-stone-400 w-16">To:</span>
            <span className="text-stone-900">{appointment.customer.fullName} &lt;{appointment.customer.email}&gt;</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-stone-400 w-16">Subject:</span>
            <span className="font-medium text-stone-900">
              Confirmed: Your reservation at {business.name} · Ref #{appointment.referenceNumber}
            </span>
          </div>
        </div>

        {/* HTML Email Canvas Preview (Scrollable) */}
        <div className="p-6 sm:p-10 overflow-y-auto bg-stone-100/50 space-y-6">
          <div className="bg-white rounded-xl border border-stone-200/90 shadow-xs p-6 sm:p-8 space-y-6 max-w-xl mx-auto">
            {/* Atelier Brand Header */}
            <div className="text-center pb-6 border-b border-stone-100 space-y-1">
              <h1 className="text-2xl font-serif font-bold text-stone-900 tracking-tight">
                {business.name}
              </h1>
              <p className="text-xs text-stone-500 font-serif italic">
                {business.tagline}
              </p>
            </div>

            {/* Greeting */}
            <div className="space-y-2">
              <p className="text-sm text-stone-700">
                Dear <strong className="text-stone-900">{appointment.customer.fullName}</strong>,
              </p>
              <p className="text-xs text-stone-600 leading-relaxed">
                Thank you for reserving your service with us. Your appointment has been secured on our atelier calendar. Below are your booking specifications, preparation guidelines, and arrival details.
              </p>
            </div>

            {/* Reference & Check-in Pass */}
            <div className="bg-[#fbfbf9] rounded-xl border border-stone-200 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-stone-200/70 pb-3">
                <div>
                  <span className="text-[11px] font-mono text-stone-400 uppercase tracking-wider block">
                    Booking Reference
                  </span>
                  <span className="text-xl font-mono font-bold text-stone-900">
                    {appointment.referenceNumber}
                  </span>
                </div>
                <div className="w-12 h-12 bg-white rounded-lg border border-stone-200 flex items-center justify-center text-stone-700">
                  <QrCode className="w-8 h-8" />
                </div>
              </div>

              {/* Service specs */}
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-stone-500 block text-[11px]">Primary Service:</span>
                  <span className="font-semibold text-stone-900 text-sm font-serif">{appointment.service.name}</span>
                </div>

                {appointment.addons.length > 0 && (
                  <div>
                    <span className="text-stone-500 block text-[11px]">Enhancements:</span>
                    <ul className="text-stone-700 list-disc list-inside">
                      {appointment.addons.map((a) => (
                        <li key={a.id}>{a.name} (+{business.currencySymbol}{a.price})</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-stone-200/60 font-mono">
                  <div>
                    <span className="text-stone-500 block text-[10px]">Date:</span>
                    <span className="font-semibold text-stone-900">{formatDatePretty(appointment.date)}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block text-[10px]">Time:</span>
                    <span className="font-semibold text-stone-900">
                      {formatTime12h(appointment.startTime)} – {formatTime12h(appointment.endTime)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-stone-200/60">
                  <div>
                    <span className="text-stone-500 block text-[10px] font-mono">Dedicated Artisan:</span>
                    <span className="font-medium text-stone-900">{appointment.specialist.name}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block text-[10px] font-mono">Duration:</span>
                    <span className="font-medium text-stone-900 font-mono">{appointment.totalDurationMinutes} mins</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Preparation Notes */}
            {appointment.service.prepNotes && appointment.service.prepNotes.length > 0 && (
              <div className="bg-stone-50 rounded-lg p-4 border border-stone-200/70 space-y-1.5 text-xs text-stone-600">
                <span className="font-semibold text-stone-800">Preparation & Recommendations:</span>
                <ul className="list-disc list-inside space-y-1 text-stone-600 text-[11px]">
                  {appointment.service.prepNotes.map((note, idx) => (
                    <li key={idx}>{note}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Payment Summary */}
            <div className="border-t border-stone-100 pt-4 space-y-1.5 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Total Service Price:</span>
                <span className="font-medium text-stone-900 tabular-nums">{business.currencySymbol}{appointment.totalPrice}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Amount Charged Today:</span>
                <span className="font-medium text-emerald-700 tabular-nums font-mono">{business.currencySymbol}{appointment.payment.amountCharged}</span>
              </div>
              {appointment.payment.remainingBalance > 0 && (
                <div className="flex justify-between text-stone-500 font-mono text-[11px]">
                  <span>Due at Atelier ({formatDatePretty(appointment.date)}):</span>
                  <span className="tabular-nums">{business.currencySymbol}{appointment.payment.remainingBalance}</span>
                </div>
              )}
            </div>

            {/* Location & Contact */}
            <div className="border-t border-stone-100 pt-4 space-y-2 text-xs text-stone-600">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-stone-800 block">{business.name}</span>
                  <span>{business.address}</span>
                </div>
              </div>
              <div className="text-[11px] text-stone-500 pl-6">
                Reception Telephone: {business.phone}
              </div>
            </div>

            {/* Calendar & Reschedule CTA */}
            <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleDownloadIcs}
                className="w-full sm:w-1/2 py-2.5 px-3 rounded-lg bg-stone-900 text-white text-xs font-medium hover:bg-stone-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save to Calendar (.ics)</span>
              </button>

              {onRescheduleClick && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onRescheduleClick(appointment);
                  }}
                  className="w-full sm:w-1/2 py-2.5 px-3 rounded-lg border border-stone-300 text-stone-700 text-xs font-medium hover:bg-stone-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Reschedule or Cancel</span>
                </button>
              )}
            </div>

            <div className="text-center text-[10px] text-stone-400 pt-4 border-t border-stone-100">
              Lumière Atelier · Mayfair, London · All rights reserved · Automated notification
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
