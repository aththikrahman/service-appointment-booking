import React, { useState } from 'react';
import {
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Mail,
  Download,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { Appointment, BusinessConfig } from '../types/booking';
import { formatDatePretty, formatTime12h, downloadIcsFile, getGoogleCalendarUrl } from '../utils/calendar';

interface ConfirmationViewProps {
  appointment: Appointment;
  business: BusinessConfig;
  onOpenEmailPreview: () => void;
  onBookAnother: () => void;
  onOpenManageBookings: () => void;
}

export const ConfirmationView: React.FC<ConfirmationViewProps> = ({
  appointment,
  business,
  onOpenEmailPreview,
  onBookAnother,
  onOpenManageBookings
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyRef = () => {
    navigator.clipboard.writeText(appointment.referenceNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadIcs = () => {
    downloadIcsFile(appointment, business);
  };

  const googleCalUrl = getGoogleCalendarUrl(appointment, business);

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-4">
      {/* Success Hero Badge */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-600">
          <CheckCircle2 className="w-9 h-9 stroke-[2]" />
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-center gap-2 text-xs font-mono text-stone-500 uppercase tracking-wider">
            <span>Booking Confirmed</span>
            <span aria-hidden="true">·</span>
            <span>Ref: {appointment.referenceNumber}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-medium text-stone-900 tracking-tight">
            We Look Forward to Welcoming You
          </h2>
          <p className="text-sm text-stone-600 max-w-lg mx-auto">
            Your appointment has been reserved in real-time. A formal confirmation and calendar invite have been sent to{' '}
            <strong className="font-semibold text-stone-900">{appointment.customer.email}</strong>.
          </p>
        </div>
      </div>

      {/* Appointment Summary Card */}
      <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm overflow-hidden">
        {/* Card Header Strip */}
        <div className="bg-stone-900 text-white p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs text-stone-400 font-mono uppercase tracking-wider">Reference Code</span>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-mono font-bold tracking-wider">{appointment.referenceNumber}</span>
              <button
                onClick={handleCopyRef}
                className="text-stone-400 hover:text-white transition-colors cursor-pointer p-1 rounded hover:bg-stone-800"
                title="Copy reference code"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            onClick={onOpenEmailPreview}
            className="px-4 py-2 text-xs font-medium bg-white text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer flex items-center gap-2 shrink-0 shadow-2xs"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>View Dispatched Email Preview</span>
          </button>
        </div>

        {/* Card Body Details */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Service & Specialist */}
            <div className="space-y-4">
              <div>
                <span className="text-xs font-mono text-stone-500 uppercase tracking-wider block">Service</span>
                <h4 className="text-lg font-serif font-medium text-stone-900 mt-0.5">
                  {appointment.service.name}
                </h4>
                {appointment.addons.length > 0 && (
                  <div className="mt-1 space-y-0.5">
                    {appointment.addons.map((a) => (
                      <div key={a.id} className="text-xs text-stone-500 flex items-center gap-1">
                        <span className="text-stone-400">+</span>
                        <span>{a.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <span className="text-xs font-mono text-stone-500 uppercase tracking-wider block">Dedicated Artisan</span>
                <div className="flex items-center gap-2.5 mt-1">
                  <img
                    src={appointment.specialist.avatarUrl}
                    alt={appointment.specialist.name}
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded-full object-cover border border-stone-200"
                  />
                  <div>
                    <span className="text-sm font-medium text-stone-900 block">{appointment.specialist.name}</span>
                    <span className="text-xs text-stone-500">{appointment.specialist.title}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Date, Time & Location */}
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-start gap-2.5 text-xs text-stone-700">
                  <Calendar className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-stone-900 block">{formatDatePretty(appointment.date)}</span>
                    <span className="text-stone-500 font-mono">
                      {formatTime12h(appointment.startTime)} – {formatTime12h(appointment.endTime)} ({appointment.totalDurationMinutes} mins)
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 text-xs text-stone-700">
                  <MapPin className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-stone-900 block">{business.name}</span>
                    <span className="text-stone-500">{business.address}</span>
                  </div>
                </div>
              </div>

              {/* Client and Notes */}
              <div className="pt-3 border-t border-stone-100 text-xs space-y-1">
                <div className="text-stone-500">
                  Client: <strong className="font-medium text-stone-800">{appointment.customer.fullName}</strong> ({appointment.customer.phone})
                </div>
                {appointment.customer.notes && (
                  <div className="text-stone-500 italic bg-stone-50 p-2.5 rounded border border-stone-100">
                    &ldquo;{appointment.customer.notes}&rdquo;
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Payment Receipt Strip */}
          <div className="pt-6 border-t border-stone-100 bg-stone-50/70 -mx-6 -mb-6 sm:-mx-8 sm:-mb-8 p-6 sm:p-8 space-y-3">
            <div className="flex items-center justify-between text-xs text-stone-500 font-mono">
              <span>Transaction Reference: {appointment.payment.transactionId}</span>
              <span>Paid via {appointment.payment.method === 'apple_pay' ? 'Apple Pay' : `${appointment.payment.cardBrand?.toUpperCase()} •••• ${appointment.payment.cardLast4}`}</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-stone-200/60">
              <div className="text-xs text-stone-600">
                <span>Total Service Value: </span>
                <strong className="font-serif font-semibold text-stone-900">{business.currencySymbol}{appointment.totalPrice}</strong>
                {appointment.payment.remainingBalance > 0 ? (
                  <span className="text-stone-500 font-mono block sm:inline sm:ml-2">
                    ({business.currencySymbol}{appointment.payment.amountCharged} paid today · {business.currencySymbol}{appointment.payment.remainingBalance} due at atelier)
                  </span>
                ) : (
                  <span className="text-emerald-700 font-mono block sm:inline sm:ml-2">(Paid in Full)</span>
                )}
              </div>

              <span className="text-xs font-medium text-emerald-800 bg-emerald-100/70 border border-emerald-200 px-2 py-0.5 rounded font-mono self-start sm:self-auto">
                Payment Authorized
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Sync & Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={handleDownloadIcs}
          className="p-4 rounded-xl border border-stone-200 bg-white hover:border-stone-400 hover:shadow-2xs transition-all text-left flex items-center justify-between cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center text-stone-700 group-hover:bg-stone-900 group-hover:text-white transition-colors">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-stone-900">Download .ics Calendar Invite</div>
              <div className="text-[11px] text-stone-500">Apple Calendar, Outlook, and devices</div>
            </div>
          </div>
        </button>

        <a
          href={googleCalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-4 rounded-xl border border-stone-200 bg-white hover:border-stone-400 hover:shadow-2xs transition-all text-left flex items-center justify-between cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center text-stone-700 group-hover:bg-stone-900 group-hover:text-white transition-colors">
              <ExternalLink className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-stone-900">Add to Google Calendar</div>
              <div className="text-[11px] text-stone-500">Opens in Google Calendar web/app</div>
            </div>
          </div>
        </a>
      </div>

      {/* Footer Navigation Actions */}
      <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs">
        <button
          onClick={onOpenManageBookings}
          className="px-4 py-2 text-stone-600 hover:text-stone-900 font-medium cursor-pointer"
        >
          Manage or Reschedule Appointments &rarr;
        </button>
        <span className="text-stone-300 hidden sm:inline">|</span>
        <button
          onClick={onBookAnother}
          className="px-4 py-2 text-stone-600 hover:text-stone-900 font-medium cursor-pointer"
        >
          Book Another Service
        </button>
      </div>
    </div>
  );
};
