import React, { useState } from 'react';
import { User, Mail, Phone, MessageSquare, ArrowLeft, Coffee, VolumeX } from 'lucide-react';
import { CustomerInfo, BusinessConfig } from '../types/booking';

interface DetailsStepProps {
  business: BusinessConfig;
  customerInfo: CustomerInfo;
  onChangeCustomerInfo: (info: CustomerInfo) => void;
  onNext: () => void;
  onBack: () => void;
}

export const DetailsStep: React.FC<DetailsStepProps> = ({
  business,
  customerInfo,
  onChangeCustomerInfo,
  onNext,
  onBack
}) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!customerInfo.fullName.trim()) {
      newErrors.fullName = 'Please enter your full name.';
    }

    if (!customerInfo.email.trim()) {
      newErrors.email = 'Please provide an email address for confirmation.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!customerInfo.phone.trim()) {
      newErrors.phone = 'Phone number is required for SMS arrival updates.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onNext();
    }
  };

  const isSalon = business.id === 'salon';
  const isRepair = business.id === 'repair';
  const isConsultancy = business.id === 'consultancy';

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Step Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-medium text-stone-500 uppercase tracking-wider mb-2">
          <span>Step 04</span>
          <span aria-hidden="true">·</span>
          <span>Guest Details</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-medium text-stone-900 tracking-tight">
          Client Information & Atelier Care
        </h2>
        <p className="mt-1 text-sm text-stone-600 max-w-2xl">
          Your booking confirmation, calendar sync invite, and arrival instructions will be dispatched to these credentials.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-stone-200/90 p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-stone-400" />
              <span>Full Name</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Genevieve Dupré"
              value={customerInfo.fullName}
              onChange={(e) => {
                onChangeCustomerInfo({ ...customerInfo, fullName: e.target.value });
                if (errors.fullName) setErrors({ ...errors, fullName: '' });
              }}
              className={`w-full px-3.5 py-2.5 text-sm rounded-lg border transition-colors bg-white ${
                errors.fullName
                  ? 'border-red-400 focus:ring-1 focus:ring-red-400'
                  : 'border-stone-300 focus:border-stone-900 focus:ring-1 focus:ring-stone-900'
              }`}
            />
            {errors.fullName && <p className="text-xs text-red-600">{errors.fullName}</p>}
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-stone-400" />
              <span>Email Address (for instant confirmation)</span>
            </label>
            <input
              type="email"
              required
              placeholder="e.g. rahmanaththik2@gmail.com"
              value={customerInfo.email}
              onChange={(e) => {
                onChangeCustomerInfo({ ...customerInfo, email: e.target.value });
                if (errors.email) setErrors({ ...errors, email: '' });
              }}
              className={`w-full px-3.5 py-2.5 text-sm rounded-lg border transition-colors bg-white ${
                errors.email
                  ? 'border-red-400 focus:ring-1 focus:ring-red-400'
                  : 'border-stone-300 focus:border-stone-900 focus:ring-1 focus:ring-stone-900'
              }`}
            />
            {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
          </div>

          {/* Phone Number */}
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-stone-400" />
              <span>Mobile Phone Number</span>
            </label>
            <input
              type="tel"
              required
              placeholder="e.g. +44 7700 900382"
              value={customerInfo.phone}
              onChange={(e) => {
                onChangeCustomerInfo({ ...customerInfo, phone: e.target.value });
                if (errors.phone) setErrors({ ...errors, phone: '' });
              }}
              className={`w-full px-3.5 py-2.5 text-sm rounded-lg border transition-colors bg-white ${
                errors.phone
                  ? 'border-red-400 focus:ring-1 focus:ring-red-400'
                  : 'border-stone-300 focus:border-stone-900 focus:ring-1 focus:ring-stone-900'
              }`}
            />
            {errors.phone && <p className="text-xs text-red-600">{errors.phone}</p>}
          </div>
        </div>

        {/* Domain-specific Bespoke Preferences */}
        <div className="pt-6 border-t border-stone-100 space-y-4">
          <h4 className="text-xs font-semibold text-stone-800 uppercase tracking-wider">
            {isSalon ? 'Atelier Hospitality & Care Preferences' : isRepair ? 'Intake & Diagnostic Notes' : 'Engagement Specifications'}
          </h4>

          {isSalon && (
            <div className="space-y-4">
              <label className="flex items-start gap-3 p-3.5 rounded-lg border border-stone-200/80 hover:bg-stone-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={customerInfo.preferences?.quietAppointment || false}
                  onChange={(e) =>
                    onChangeCustomerInfo({
                      ...customerInfo,
                      preferences: {
                        ...customerInfo.preferences,
                        quietAppointment: e.target.checked
                      }
                    })
                  }
                  className="mt-0.5 rounded border-stone-300 text-stone-900 focus:ring-stone-900"
                />
                <div className="space-y-0.5">
                  <div className="text-xs font-semibold text-stone-900 flex items-center gap-1.5">
                    <VolumeX className="w-3.5 h-3.5 text-stone-500" />
                    <span>Quiet Appointment Request</span>
                  </div>
                  <p className="text-xs text-stone-500">
                    After our initial consultation, we will keep conversation to essential service questions so you can read, work, or unwind in silence.
                  </p>
                </div>
              </label>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
                  <Coffee className="w-3.5 h-3.5 text-stone-400" />
                  <span>Complimentary Beverage Pairing on Arrival</span>
                </label>
                <select
                  value={customerInfo.preferences?.beverageChoice || 'Matcha Latte'}
                  onChange={(e) =>
                    onChangeCustomerInfo({
                      ...customerInfo,
                      preferences: {
                        ...customerInfo.preferences,
                        beverageChoice: e.target.value
                      }
                    })
                  }
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 bg-white focus:border-stone-900"
                >
                  <option value="Matcha Latte">Ceremonial Grade Uji Matcha Latte (Oat Milk)</option>
                  <option value="Sparkling Water">Perrier Sparkling Mineral Water with Fresh Lime & Mint</option>
                  <option value="Espresso">Artisan Double Espresso (Single Origin Ethiopian)</option>
                  <option value="Herbal Infusion">Organic Chamomile & Lemongrass Herbal Infusion</option>
                  <option value="Champagne">Veuve Clicquot Brut Champagne (Afternoon/Evening)</option>
                </select>
              </div>
            </div>
          )}

          {/* Notes or details */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-stone-400" />
              <span>
                {isSalon
                  ? 'Allergies, scalp sensitivities, or hair goals'
                  : isRepair
                  ? 'Device serial number, symptoms, or repair history'
                  : 'Key advisory topics or discussion priorities'}
              </span>
            </label>
            <textarea
              rows={3}
              placeholder={
                isSalon
                  ? 'e.g. Mild sensitivity to high heat; aiming to blend natural gray roots with honey tones.'
                  : isRepair
                  ? 'e.g. Calibre 3135 losing ~45s/day; crown feels gritty when hand-winding.'
                  : 'e.g. Reviewing Series A unit economics and pipeline capacity before Q4 board meet.'
              }
              value={customerInfo.notes || ''}
              onChange={(e) =>
                onChangeCustomerInfo({
                  ...customerInfo,
                  notes: e.target.value
                })
              }
              className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-stone-300 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 bg-white"
            />
          </div>
        </div>
      </div>

      {/* Navigation Actions */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-900 flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Date & Time</span>
        </button>

        <button
          type="submit"
          className="px-6 py-2.5 rounded-lg text-sm font-medium bg-stone-900 text-white hover:bg-stone-800 transition-colors shadow-sm cursor-pointer"
        >
          Proceed to Secure Payment &rarr;
        </button>
      </div>
    </form>
  );
};
