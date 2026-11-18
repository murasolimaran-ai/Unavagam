import React, { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  CreditCard,
  ShieldCheck,
  Tag,
} from 'lucide-react';
import { usePlatform, TURF_SLOTS } from '../../context/PlatformContext';
import { PaymentMethod, TurfBooking } from '../../types';
import { addDays, formatDateShort, formatINR, getTodayIST } from '../../utils/format';

export const TurfBookingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const {
    turfConfig,
    currentCustomer,
    getTurfSlotStatus,
    getTurfSlotPrice,
    validateCoupon,
    createTurfBooking,
    settings,
  } = usePlatform();

  const today = getTodayIST();
  const initialDate = searchParams.get('date') || today;
  const initialSlot = searchParams.get('slot') || '';

  const [step, setStep] = useState<number>(1);
  const [date, setDate] = useState<string>(initialDate);
  const [durationHours, setDurationHours] = useState<1 | 2>(1);
  const [selectedSlots, setSelectedSlots] = useState<string[]>(
    initialSlot && getTurfSlotStatus(initialDate, initialSlot).status === 'Available'
      ? [initialSlot]
      : []
  );
  const [customerName, setCustomerName] = useState(currentCustomer?.name || '');
  const [customerPhone, setCustomerPhone] = useState(currentCustomer?.phone || '');
  const [customerEmail, setCustomerEmail] = useState(currentCustomer?.email || '');
  const [teamName, setTeamName] = useState('');
  const [playersCount, setPlayersCount] = useState(14);
  const [notes, setNotes] = useState('');

  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [couponMsg, setCouponMsg] = useState('');

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [simulateFail, setSimulateFail] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState<TurfBooking | null>(null);

  const handleDateChange = (newDate: string) => {
    setDate(newDate);
    setSelectedSlots([]);
  };

  const handleDurationChange = (dur: 1 | 2) => {
    setDurationHours(dur);
    setSelectedSlots([]);
  };

  const handleSlotClick = (slot: string) => {
    setErrorMsg('');
    const idx = TURF_SLOTS.indexOf(slot as (typeof TURF_SLOTS)[number]);
    if (durationHours === 1) {
      if (getTurfSlotStatus(date, slot).status !== 'Available') return;
      setSelectedSlots([slot]);
    } else {
      if (idx < 0 || idx >= TURF_SLOTS.length - 1) {
        setErrorMsg('Please choose an earlier start slot for a 2-hour consecutive session.');
        return;
      }
      const nextSlot = TURF_SLOTS[idx + 1];
      if (
        getTurfSlotStatus(date, slot).status !== 'Available' ||
        getTurfSlotStatus(date, nextSlot).status !== 'Available'
      ) {
        setErrorMsg('Two consecutive available slots are required for a 2-hour booking.');
        return;
      }
      setSelectedSlots([slot, nextSlot]);
    }
  };

  const pricing = useMemo(() => {
    const baseAmount = selectedSlots.reduce(
      (sum, s) => sum + getTurfSlotPrice(date, s),
      0
    );
    let discountAmount = 0;
    if (appliedCoupon && baseAmount > 0) {
      const res = validateCoupon(appliedCoupon, 'Turf', baseAmount);
      if (res.valid) discountAmount = res.discount;
    }
    const taxable = Math.max(0, baseAmount - discountAmount);
    const taxAmount = Math.round((taxable * settings.gstRatePercent) / 100);
    const totalAmount = taxable + taxAmount;
    return { baseAmount, discountAmount, taxAmount, totalAmount };
  }, [selectedSlots, date, appliedCoupon, getTurfSlotPrice, validateCoupon, settings.gstRatePercent]);

  const handleApplyCoupon = () => {
    const res = validateCoupon(couponInput, 'Turf', pricing.baseAmount);
    setCouponMsg(res.message);
    if (res.valid) {
      setAppliedCoupon(couponInput.trim().toUpperCase());
    } else {
      setAppliedCoupon('');
    }
  };

  const handleConfirmPayment = () => {
    setErrorMsg('');
    if (!customerName.trim() || !customerPhone.trim() || !customerEmail.trim()) {
      setErrorMsg('Please enter customer name, phone, and email.');
      return;
    }
    const res = createTurfBooking({
      customerName,
      customerPhone,
      customerEmail,
      date,
      slots: selectedSlots,
      teamName,
      playersCount,
      couponCode: appliedCoupon,
      paymentMethod,
      simulateFailure: simulateFail,
      notes,
    });
    if (!res.ok || !res.booking) {
      setErrorMsg(res.error || 'Could not complete booking.');
      return;
    }
    setConfirmedBooking(res.booking);
    setStep(4);
  };

  if (step === 4 && confirmedBooking) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-3 text-emerald-700">
            <CheckCircle2 className="w-7 h-7 shrink-0" />
            <div>
              <h1 className="type-h1 text-[#0B1628]">Turf Slot Confirmed</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Booking ID: <span className="font-mono-tabular font-semibold">{confirmedBooking.id}</span>
              </p>
            </div>
          </div>

          <div className="mt-6 border-t border-b border-slate-200 py-5 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Ground</span>
              <span className="font-semibold text-slate-900">{turfConfig.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Date</span>
              <span className="font-semibold font-mono-tabular text-slate-900">
                {formatDateShort(confirmedBooking.date)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Time Slot(s)</span>
              <span className="font-semibold font-mono-tabular text-blue-700">
                {confirmedBooking.slots.join(' & ')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Player / Captain</span>
              <span className="font-medium text-slate-900">
                {confirmedBooking.customerName} ({confirmedBooking.customerPhone})
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Payment</span>
              <span className="font-medium text-slate-900">
                {confirmedBooking.paymentMethod} · {confirmedBooking.paymentStatus}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-100">
              <span className="font-semibold text-slate-900">Total Amount</span>
              <span className="text-lg font-bold font-mono-tabular text-slate-900">
                {formatINR(confirmedBooking.totalAmount)}
              </span>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/my-bookings"
              className="flex-1 min-h-[44px] inline-flex items-center justify-center px-5 py-2.5 bg-[#0B1628] text-white text-xs font-semibold rounded-xl hover:bg-[#172D4D] transition-colors"
            >
              View in My Bookings
            </Link>
            <Link
              to="/turf"
              className="min-h-[44px] inline-flex items-center justify-center px-5 py-2.5 border border-slate-200 text-slate-700 text-xs font-medium rounded-xl hover:bg-slate-50 transition-colors"
            >
              Back to Turf
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#C89B54]">{turfConfig.name}</p>
          <h1 className="type-h1 text-[#0B1628] mt-1">
            Book Your Turf Slot
          </h1>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium overflow-x-auto pb-1">
          {[
            { id: 1, label: '1. Date & Slot' },
            { id: 2, label: '2. Player Details' },
            { id: 3, label: '3. Review & Pay' },
          ].map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                if (s.id < step) setStep(s.id);
              }}
              className={`min-h-[40px] px-3.5 py-2 rounded-xl border whitespace-nowrap transition-colors ${
                step === s.id
                  ? 'bg-[#0B1628] text-white border-[#0B1628]'
                  : step > s.id
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-white text-slate-500 border-slate-200'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2.5 text-xs text-rose-800">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-5 sm:p-6">
          {step === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Step 1: Select Match Date
                  </label>
                  <input
                    type="date"
                    min={today}
                    max={addDays(today, 30)}
                    value={date}
                    onChange={(e) => handleDateChange(e.target.value)}
                    className="w-full min-h-[44px] px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#0B1628]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Step 2: Select Session Duration
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleDurationChange(1)}
                      className={`min-h-[44px] py-2.5 text-xs font-semibold rounded-xl border transition-colors ${
                        durationHours === 1
                          ? 'bg-[#0B1628] text-white border-[#0B1628]'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      1 Hour (Single Slot)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDurationChange(2)}
                      className={`min-h-[44px] py-2.5 text-xs font-semibold rounded-xl border transition-colors ${
                        durationHours === 2
                          ? 'bg-[#0B1628] text-white border-[#0B1628]'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      2 Hours (Back-to-Back)
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-semibold text-slate-700">
                    Step 3: Choose Available Time Slot ({formatDateShort(date)})
                  </label>
                  <span className="text-[11px] text-slate-500">
                    Grey = Booked · Amber = Admin Blocked
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {TURF_SLOTS.map((slot) => {
                    const info = getTurfSlotStatus(date, slot);
                    const price = getTurfSlotPrice(date, slot);
                    const isSelected = selectedSlots.includes(slot);
                    const isDisabled = info.status !== 'Available';

                    return (
                      <button
                        key={slot}
                        type="button"
                        disabled={isDisabled}
                        onClick={() => handleSlotClick(slot)}
                        className={`min-h-[52px] p-3.5 rounded-xl border text-left flex items-center justify-between transition-colors ${
                          isSelected
                            ? 'bg-[#0B1628] text-white border-[#0B1628]'
                            : isDisabled
                            ? info.status === 'Blocked'
                              ? 'bg-amber-50 border-amber-200 text-amber-800 cursor-not-allowed opacity-80'
                              : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                            : 'bg-white border-slate-200 hover:border-[#0B1628] text-slate-800'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-1.5 text-xs font-semibold font-mono-tabular">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{slot}</span>
                          </div>
                          <div className="text-[11px] mt-1 opacity-85">
                            {isSelected
                              ? 'Selected'
                              : info.status === 'Available'
                              ? 'Available'
                              : info.status === 'Blocked'
                              ? `Blocked · ${info.blockReason || 'Hold'}`
                              : 'Booked'}
                          </div>
                        </div>
                        <span className="text-xs font-bold font-mono-tabular">
                          {formatINR(price)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    if (!selectedSlots.length) {
                      setErrorMsg('Please select an available time slot first.');
                      return;
                    }
                    setErrorMsg('');
                    setStep(2);
                  }}
                  className="min-h-[44px] w-full sm:w-auto px-6 py-2.5 bg-[#0B1628] text-white text-sm font-semibold rounded-xl hover:bg-[#172D4D] transition-colors"
                >
                  Continue to Customer Details
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-slate-900">Step 5: Captain &amp; Match Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Arun Kumar"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+91 98422 11045"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="arun.kumar@example.in"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Team / Group Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="e.g. Kovai Strikers FC"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Players Count
                  </label>
                  <input
                    type="number"
                    min={4}
                    max={22}
                    value={playersCount}
                    onChange={(e) => setPlayersCount(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm font-mono-tabular focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Special Notes (Bibs / Cricket stumps)
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Need 14 bibs & match ball"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 border border-slate-200 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-50"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!customerName.trim() || !customerPhone.trim() || !customerEmail.trim()) {
                      setErrorMsg('Please complete all required contact fields.');
                      return;
                    }
                    setErrorMsg('');
                    setStep(3);
                  }}
                  className="px-6 py-2.5 bg-[#172D4D] text-white text-sm font-semibold rounded-lg hover:bg-[#1e3a63]"
                >
                  Review &amp; Proceed to Payment
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-slate-900">
                Step 6 &amp; 7: Review &amp; Simulate Payment
              </h2>

              <div className="p-4 bg-[#F8FAFC] border border-slate-200 rounded-lg space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Customer</span>
                  <span className="font-medium text-slate-900">
                    {customerName} · {customerPhone}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Match Date</span>
                  <span className="font-medium font-mono-tabular">{formatDateShort(date)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Selected Slot(s)</span>
                  <span className="font-semibold font-mono-tabular text-blue-700">
                    {selectedSlots.join(', ')}
                  </span>
                </div>
                {teamName && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Team</span>
                    <span className="font-medium">{teamName} ({playersCount} players)</span>
                  </div>
                )}
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Select Demo Payment Method
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['UPI', 'Card', 'Cash'] as PaymentMethod[]).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`py-3 px-4 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
                        paymentMethod === method
                          ? 'bg-[#172D4D] text-white border-[#172D4D]'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>{method === 'Cash' ? 'Pay at Venue' : method}</span>
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={simulateFail}
                  onChange={(e) => setSimulateFail(e.target.checked)}
                  className="rounded border-slate-300"
                />
                <span>Simulate payment gateway failure (demo test toggle)</span>
              </label>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="min-h-[44px] px-4 py-2.5 border border-slate-200 text-slate-700 text-xs font-medium rounded-xl hover:bg-slate-50"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleConfirmPayment}
                  className="min-h-[44px] inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#0B1628] text-white text-sm font-semibold rounded-xl hover:bg-[#172D4D] transition-colors"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Confirm &amp; Pay {formatINR(pricing.totalAmount)}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Summary & Coupon Sidebar */}
        <aside className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-5 lg:sticky lg:top-24">
          <div>
            <h3 className="text-base font-bold text-slate-900">Booking Price Summary</h3>
            <p className="text-xs text-slate-500 mt-0.5">{formatDateShort(date)}</p>
          </div>

          <div className="space-y-2.5 text-sm border-t border-b border-slate-200 py-4">
            <div className="flex justify-between">
              <span className="text-slate-600">
                Slots ({selectedSlots.length} hr{selectedSlots.length === 2 ? 's' : ''})
              </span>
              <span className="font-mono-tabular font-medium">
                {formatINR(pricing.baseAmount)}
              </span>
            </div>
            {pricing.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Coupon ({appliedCoupon})</span>
                <span className="font-mono-tabular font-medium">
                  -{formatINR(pricing.discountAmount)}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-600">GST ({settings.gstRatePercent}%)</span>
              <span className="font-mono-tabular font-medium">
                {formatINR(pricing.taxAmount)}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-100 text-base font-bold text-slate-900">
              <span>Total Payable</span>
              <span className="font-mono-tabular">{formatINR(pricing.totalAmount)}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Apply Offer Code (Try TURF20 or WELCOME10)
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="TURF20"
                  className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-lg text-xs uppercase font-mono-tabular focus:outline-none focus:border-blue-600"
                />
              </div>
              <button
                type="button"
                onClick={handleApplyCoupon}
                className="px-3.5 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800"
              >
                Apply
              </button>
            </div>
            {couponMsg && (
              <p
                className={`text-[11px] mt-1.5 ${
                  appliedCoupon ? 'text-emerald-700' : 'text-rose-600'
                }`}
              >
                {couponMsg}
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};
