import React, { useState } from 'react';
import {
  CreditCard,
  ShieldCheck,
  Lock,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Smartphone,
  AlertCircle
} from 'lucide-react';
import {
  BusinessConfig,
  ServiceItem,
  ServiceAddon,
  Specialist,
  PaymentScheduleType,
  PaymentMethodType,
  PaymentDetails
} from '../types/booking';
import { formatDatePretty, formatTime12h, calculateEndTime } from '../utils/calendar';

interface PaymentStepProps {
  business: BusinessConfig;
  service: ServiceItem;
  addons: ServiceAddon[];
  specialist: Specialist | null;
  selectedDate: string;
  selectedTime: string;
  totalDurationMinutes: number;
  customerName: string;
  customerEmail: string;
  onPaymentComplete: (payment: PaymentDetails) => void;
  onBack: () => void;
}

export const PaymentStep: React.FC<PaymentStepProps> = ({
  business,
  service,
  addons,
  specialist,
  selectedDate,
  selectedTime,
  totalDurationMinutes,
  customerName,
  customerEmail,
  onPaymentComplete,
  onBack
}) => {
  const [schedule, setSchedule] = useState<PaymentScheduleType>('deposit');
  const [method, setMethod] = useState<PaymentMethodType>('card');

  // Card fields
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardHolder, setCardHolder] = useState(customerName || '');
  const [saveCard, setSaveCard] = useState(true);

  // Authorization / processing modal states
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Financial calculations
  const subtotal = service.price + addons.reduce((sum, a) => sum + a.price, 0);
  const depositAmount = Math.round(subtotal * (business.depositPercentage / 100));

  let amountToCharge = 0;
  let remainingDue = 0;

  if (schedule === 'deposit') {
    amountToCharge = depositAmount;
    remainingDue = subtotal - depositAmount;
  } else if (schedule === 'full') {
    amountToCharge = subtotal;
    remainingDue = 0;
  } else {
    // venue_guarantee
    amountToCharge = 0;
    remainingDue = subtotal;
  }

  // Detect card brand
  const getCardBrand = (num: string): 'visa' | 'mastercard' | 'amex' | 'discover' | 'unknown' => {
    const clean = num.replace(/\s+/g, '');
    if (/^4/.test(clean)) return 'visa';
    if (/^5[1-5]/.test(clean) || /^2[2-7]/.test(clean)) return 'mastercard';
    if (/^3[47]/.test(clean)) return 'amex';
    if (/^6(?:011|5)/.test(clean)) return 'discover';
    return 'unknown';
  };

  const cardBrand = getCardBrand(cardNumber);

  // Card formatting handler
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const parts = raw.match(/.{1,4}/g);
    setCardNumber(parts ? parts.join(' ') : raw);
    if (errorMessage) setErrorMessage(null);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 2) {
      setExpiry(`${raw.slice(0, 2)}/${raw.slice(2)}`);
    } else {
      setExpiry(raw);
    }
    if (errorMessage) setErrorMessage(null);
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    setCvv(raw);
    if (errorMessage) setErrorMessage(null);
  };

  // Demo auto-fill helper
  const fillTestCard = () => {
    setCardNumber('4242 •••• •••• 4242');
    setExpiry('12/28');
    setCvv('883');
    setCardHolder(customerName || 'Genevieve Dupré');
    setErrorMessage(null);
  };

  // Trigger payment execution with realistic 3DS animation
  const handleProcessPayment = async () => {
    if (method === 'card') {
      const cleanNum = cardNumber.replace(/\D/g, '');
      if (cleanNum.length < 15 && !cardNumber.includes('4242')) {
        setErrorMessage('Please enter a valid 15 or 16-digit card number.');
        return;
      }
      if (expiry.length < 5) {
        setErrorMessage('Please enter an expiration date in MM/YY format.');
        return;
      }
      if (cvv.length < 3) {
        setErrorMessage('Please enter a 3 or 4-digit security code (CVV).');
        return;
      }
    }

    setIsProcessing(true);
    setProcessingStage('Connecting to secure payment gateway...');

    await new Promise((r) => setTimeout(r, 900));
    setProcessingStage('Initiating 3-D Secure 2.0 cryptographic handshake...');

    await new Promise((r) => setTimeout(r, 1100));
    setProcessingStage('Issuing bank verification confirmed. Capturing ledger record...');

    await new Promise((r) => setTimeout(r, 800));

    const paymentResult: PaymentDetails = {
      method,
      schedule,
      cardBrand: cardBrand === 'unknown' ? 'visa' : cardBrand,
      cardLast4: cardNumber.replace(/\D/g, '').slice(-4) || '4242',
      cardHolderName: cardHolder || customerName || 'Valued Client',
      amountCharged: amountToCharge,
      remainingBalance: remainingDue,
      transactionId: `txn_${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      timestamp: new Date().toISOString(),
      status: amountToCharge > 0 ? 'paid' : 'authorized'
    };

    setIsProcessing(false);
    onPaymentComplete(paymentResult);
  };

  return (
    <div className="space-y-8">
      {/* Step Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-medium text-stone-500 uppercase tracking-wider mb-2">
          <span>Step 05</span>
          <span aria-hidden="true">·</span>
          <span>Payment Processing</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-medium text-stone-900 tracking-tight">
          Secure Payment & Slot Confirmation
        </h2>
        <p className="mt-1 text-sm text-stone-600 max-w-2xl">
          Complete your reservation with PCI DSS Level 1 encrypted payment processing. Choose full payment, deposit, or venue hold.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Payment Form */}
        <div className="lg:col-span-7 space-y-6">
          {/* Payment Schedule Selector */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider block">
              Payment Schedule
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setSchedule('deposit')}
                className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                  schedule === 'deposit'
                    ? 'border-stone-900 bg-white ring-1 ring-stone-900 shadow-2xs'
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                <div className="text-xs font-semibold text-stone-900">Hold with Deposit</div>
                <div className="text-base font-serif font-medium text-stone-900 mt-1 tabular-nums">
                  {business.currencySymbol}{depositAmount}
                </div>
                <div className="text-[11px] text-stone-500 mt-0.5">
                  {business.depositPercentage}% today, rest at venue
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSchedule('full')}
                className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                  schedule === 'full'
                    ? 'border-stone-900 bg-white ring-1 ring-stone-900 shadow-2xs'
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                <div className="text-xs font-semibold text-stone-900">Pay in Full</div>
                <div className="text-base font-serif font-medium text-stone-900 mt-1 tabular-nums">
                  {business.currencySymbol}{subtotal}
                </div>
                <div className="text-[11px] text-stone-500 mt-0.5">
                  Complete 100% settlement
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSchedule('venue_guarantee')}
                className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                  schedule === 'venue_guarantee'
                    ? 'border-stone-900 bg-white ring-1 ring-stone-900 shadow-2xs'
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                <div className="text-xs font-semibold text-stone-900">Card Guarantee</div>
                <div className="text-base font-serif font-medium text-stone-900 mt-1 tabular-nums">
                  {business.currencySymbol}0 today
                </div>
                <div className="text-[11px] text-stone-500 mt-0.5">
                  Pay 100% on arrival
                </div>
              </button>
            </div>
          </div>

          {/* Payment Method Tabs */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider block">
                Payment Method
              </label>
              <div className="flex items-center gap-1.5 text-xs text-stone-500 font-mono">
                <Lock className="w-3.5 h-3.5 text-stone-400" />
                <span>256-bit Encrypted</span>
              </div>
            </div>

            {/* Segmented Control */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-stone-100 rounded-lg">
              <button
                type="button"
                onClick={() => setMethod('card')}
                className={`py-2 px-3 text-xs font-medium rounded-md transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  method === 'card'
                    ? 'bg-white text-stone-900 shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Credit or Debit Card</span>
              </button>
              <button
                type="button"
                onClick={() => setMethod('apple_pay')}
                className={`py-2 px-3 text-xs font-medium rounded-md transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  method === 'apple_pay'
                    ? 'bg-white text-stone-900 shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>Apple Pay / Google Pay</span>
              </button>
            </div>
          </div>

          {/* Card Form */}
          {method === 'card' ? (
            <div className="bg-white rounded-xl border border-stone-200/90 p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-stone-700">Enter Payment Details</span>
                <button
                  type="button"
                  onClick={fillTestCard}
                  className="text-xs text-stone-600 hover:text-stone-900 underline flex items-center gap-1 cursor-pointer font-mono"
                >
                  <Sparkles className="w-3 h-3 text-stone-400" />
                  <span>Autofill Sandbox Card</span>
                </button>
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Card Number */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-stone-600">Card Number</label>
                <div className="relative">
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="4242 4242 4242 4242"
                    className="w-full px-3.5 py-2.5 text-sm font-mono rounded-lg border border-stone-300 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 bg-white tracking-wider"
                  />
                  <div className="absolute right-3 top-2.5 text-xs font-semibold uppercase text-stone-400 font-mono">
                    {cardBrand !== 'unknown' ? cardBrand : 'Card'}
                  </div>
                </div>
              </div>

              {/* Expiry & CVV */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-stone-600">Expiration</label>
                  <input
                    type="text"
                    value={expiry}
                    onChange={handleExpiryChange}
                    placeholder="MM/YY"
                    className="w-full px-3.5 py-2.5 text-sm font-mono rounded-lg border border-stone-300 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-stone-600 flex items-center justify-between">
                    <span>CVV / CVC</span>
                    <span className="text-[10px] text-stone-400 font-mono">3-4 digits</span>
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    value={cvv}
                    onChange={handleCvvChange}
                    placeholder="•••"
                    className="w-full px-3.5 py-2.5 text-sm font-mono rounded-lg border border-stone-300 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 bg-white"
                  />
                </div>
              </div>

              {/* Cardholder Name */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-stone-600">Name on Card</label>
                <input
                  type="text"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  placeholder="e.g. Genevieve Dupré"
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-stone-300 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 bg-white"
                />
              </div>

              {/* Save Card */}
              <label className="flex items-center gap-2 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={saveCard}
                  onChange={(e) => setSaveCard(e.target.checked)}
                  className="rounded border-stone-300 text-stone-900 focus:ring-stone-900"
                />
                <span className="text-xs text-stone-600">
                  Save card securely for seamless check-in and future appointments
                </span>
              </label>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-stone-200/90 p-8 text-center space-y-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-stone-100 flex items-center justify-center text-stone-900">
                <Smartphone className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-serif font-medium text-stone-900">
                  One-Touch Biometric Express Checkout
                </h4>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  Clicking authorize below will prompt Touch ID / Face ID verification with your device default wallet.
                </p>
              </div>
            </div>
          )}

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-2 px-1 text-xs text-stone-500 border-t border-stone-100">
            <div className="flex items-center gap-1.5 font-mono">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>PCI-DSS Level 1 Certified</span>
            </div>
            <div className="flex items-center gap-1.5 font-mono">
              <CheckCircle2 className="w-4 h-4 text-stone-500" />
              <span>Free cancellation up to 24h prior</span>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Ledger */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-stone-200/90 p-6 space-y-6 sticky top-28">
          <div>
            <h3 className="text-base font-serif font-medium text-stone-900">
              Reservation Summary
            </h3>
            <p className="text-xs text-stone-500 font-mono mt-0.5">
              {business.name}
            </p>
          </div>

          {/* Appointment Specs */}
          <div className="p-4 bg-stone-50 rounded-lg space-y-2 text-xs text-stone-600">
            <div className="flex justify-between">
              <span className="text-stone-500">Date:</span>
              <span className="font-medium text-stone-900">{formatDatePretty(selectedDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Time:</span>
              <span className="font-medium text-stone-900 font-mono">
                {formatTime12h(selectedTime)} – {formatTime12h(calculateEndTime(selectedTime, totalDurationMinutes))}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Specialist:</span>
              <span className="font-medium text-stone-900">{specialist ? specialist.name : 'First Available Artisan'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Total Duration:</span>
              <span className="font-medium text-stone-900 font-mono">{totalDurationMinutes} mins</span>
            </div>
          </div>

          {/* Line Item Breakdown */}
          <div className="space-y-3 pt-2">
            <div className="flex justify-between text-xs text-stone-800">
              <span>{service.name}</span>
              <span className="font-serif font-medium tabular-nums">{business.currencySymbol}{service.price}</span>
            </div>

            {addons.map((a) => (
              <div key={a.id} className="flex justify-between text-xs text-stone-600">
                <span className="pl-2">↳ {a.name}</span>
                <span className="font-serif tabular-nums">+{business.currencySymbol}{a.price}</span>
              </div>
            ))}

            <div className="pt-3 border-t border-stone-100 flex justify-between text-sm font-medium text-stone-900">
              <span>Subtotal</span>
              <span className="font-serif tabular-nums">{business.currencySymbol}{subtotal}</span>
            </div>

            <div className="pt-2 border-t border-stone-200/80 space-y-1.5">
              <div className="flex justify-between text-base font-serif font-semibold text-stone-900">
                <span>Due Today</span>
                <span className="tabular-nums">
                  {amountToCharge === 0 ? 'Guarantee ($0)' : `${business.currencySymbol}${amountToCharge}`}
                </span>
              </div>
              {remainingDue > 0 && (
                <div className="flex justify-between text-xs text-stone-500 font-mono">
                  <span>Balance Due at Appointment:</span>
                  <span className="tabular-nums">{business.currencySymbol}{remainingDue}</span>
                </div>
              )}
            </div>
          </div>

          {/* Cancellation Policy Box */}
          <div className="p-3 bg-stone-50/70 border border-stone-200/60 rounded-lg text-[11px] text-stone-500 space-y-1 leading-relaxed">
            <p className="font-semibold text-stone-700">Cancellation Policy:</p>
            <p>
              Cancellations or rescheduling requests with $\ge$ 24 hours notice receive 100% refund of deposit. Late cancellations under 24h are subject to a 50% reservation fee.
            </p>
          </div>

          {/* Primary Submit Action */}
          <button
            type="button"
            disabled={isProcessing}
            onClick={handleProcessPayment}
            className="w-full py-3.5 px-4 rounded-xl text-sm font-medium bg-stone-900 text-white hover:bg-stone-800 transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4 text-stone-400" />
            <span>
              {schedule === 'venue_guarantee'
                ? 'Confirm Reservation with Card Guarantee'
                : `Authorize & Pay ${business.currencySymbol}${amountToCharge}`}
            </span>
          </button>
        </div>
      </div>

      {/* Back Button */}
      <div className="pt-4">
        <button
          type="button"
          disabled={isProcessing}
          onClick={onBack}
          className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-900 flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Guest Details</span>
        </button>
      </div>

      {/* Realistic 3-D Secure / Processing Overlay Modal */}
      {isProcessing && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl border border-stone-200 text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-stone-100 flex items-center justify-center relative">
              <div className="w-10 h-10 border-2 border-stone-900 border-t-transparent rounded-full animate-spin"></div>
              <ShieldCheck className="w-5 h-5 text-stone-900 absolute" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-serif font-semibold text-stone-900">
                Processing Secure Transaction
              </h3>
              <p className="text-xs text-stone-500 font-mono">
                {processingStage}
              </p>
            </div>

            <div className="p-3 bg-stone-50 rounded-lg text-[11px] text-stone-500 font-mono text-left space-y-1">
              <div className="flex justify-between">
                <span>Network:</span>
                <span className="font-semibold text-stone-700 uppercase">{cardBrand} 3-D Secure 2.0</span>
              </div>
              <div className="flex justify-between">
                <span>Encryption:</span>
                <span className="font-semibold text-stone-700">AES-256-GCM / TLS 1.3</span>
              </div>
              <div className="flex justify-between">
                <span>Amount:</span>
                <span className="font-semibold text-stone-700">{business.currencySymbol}{amountToCharge}</span>
              </div>
            </div>

            <p className="text-[11px] text-stone-400">
              Please do not close or refresh this browser window.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
