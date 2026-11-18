import React, { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  AlertCircle,
  CheckCircle2,
  CreditCard,
  ShieldCheck,
  Tag,
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { PaymentMethod, ResortBooking } from '../../types';
import { addDays, formatDateShort, formatINR, getTodayIST } from '../../utils/format';

export const ResortBookingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const {
    roomCategories,
    currentCustomer,
    getCategoryAvailableCount,
    calculateResortQuote,
    validateCoupon,
    createResortBooking,
    settings,
  } = usePlatform();

  const today = getTodayIST();
  const [step, setStep] = useState(1);

  const [checkIn, setCheckIn] = useState(searchParams.get('checkIn') || today);
  const [checkOut, setCheckOut] = useState(searchParams.get('checkOut') || addDays(today, 2));
  const [adults, setAdults] = useState(Number(searchParams.get('adults') || 2));
  const [children, setChildren] = useState(Number(searchParams.get('children') || 0));

  const [categoryId, setCategoryId] = useState(
    searchParams.get('category') || roomCategories[1]?.id || 'CAT-DLX'
  );
  const [roomCount, setRoomCount] = useState(1);
  const [extraBeds, setExtraBeds] = useState(0);

  const [customerName, setCustomerName] = useState(currentCustomer?.name || '');
  const [customerPhone, setCustomerPhone] = useState(currentCustomer?.phone || '');
  const [customerEmail, setCustomerEmail] = useState(currentCustomer?.email || '');
  const [specialRequests, setSpecialRequests] = useState('');

  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [couponMsg, setCouponMsg] = useState('');

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [simulateFail, setSimulateFail] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState<ResortBooking | null>(null);

  const selectedCategory = roomCategories.find((c) => c.id === categoryId);
  const maxAvailableForCat = getCategoryAvailableCount(categoryId, checkIn, checkOut);

  const quote = useMemo(
    () =>
      calculateResortQuote({
        categoryId,
        checkIn,
        checkOut,
        roomCount,
        extraBeds,
        couponCode: appliedCoupon,
      }),
    [categoryId, checkIn, checkOut, roomCount, extraBeds, appliedCoupon, calculateResortQuote]
  );

  const handleApplyCoupon = () => {
    const gross = quote.roomSubtotal + quote.extraBedTotal;
    const res = validateCoupon(couponInput, 'Resort', gross);
    setCouponMsg(res.message);
    if (res.valid) {
      setAppliedCoupon(couponInput.trim().toUpperCase());
    } else {
      setAppliedCoupon('');
    }
  };

  const handleConfirmBooking = () => {
    setErrorMsg('');
    if (!customerName.trim() || !customerPhone.trim() || !customerEmail.trim()) {
      setErrorMsg('Please fill in guest name, phone, and email.');
      return;
    }
    const res = createResortBooking({
      customerName,
      customerPhone,
      customerEmail,
      categoryId,
      roomCount,
      checkIn,
      checkOut,
      adults,
      children,
      extraBeds,
      couponCode: appliedCoupon,
      paymentMethod,
      simulateFailure: simulateFail,
      specialRequests,
    });
    if (!res.ok || !res.booking) {
      setErrorMsg(res.error || 'Could not confirm resort reservation.');
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
              <h1 className="type-h1 text-[#0B1628]">Resort Stay Confirmed</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Reservation ID:{' '}
                <span className="font-mono-tabular font-semibold">{confirmedBooking.id}</span>
              </p>
            </div>
          </div>

          <div className="mt-6 border-t border-b border-slate-200 py-5 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Room Category</span>
              <span className="font-semibold text-slate-900">
                {confirmedBooking.roomCount} × {confirmedBooking.categoryName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Assigned Room(s)</span>
              <span className="font-mono-tabular font-semibold text-emerald-700">
                Room {confirmedBooking.assignedRoomNumbers.join(', ')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Check-in / Check-out</span>
              <span className="font-mono-tabular font-medium">
                {formatDateShort(confirmedBooking.checkIn)} → {formatDateShort(confirmedBooking.checkOut)} (
                {confirmedBooking.nights} Nights)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Primary Guest</span>
              <span className="font-medium">
                {confirmedBooking.customerName} ({confirmedBooking.adults}A, {confirmedBooking.children}C)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Payment</span>
              <span className="font-medium">
                {confirmedBooking.paymentMethod} · {confirmedBooking.paymentStatus}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-100">
              <span className="font-semibold text-slate-900">Total Paid / Due</span>
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
              to="/resort/rooms"
              className="min-h-[44px] inline-flex items-center justify-center px-5 py-2.5 border border-slate-200 text-slate-700 text-xs font-medium rounded-xl hover:bg-slate-50 transition-colors"
            >
              Explore Rooms
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
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#C89B54]">Kaveri Palms Resort</p>
          <h1 className="type-h1 text-[#0B1628] mt-1">
            Reserve Your Stay
          </h1>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium overflow-x-auto pb-1">
          {[
            { id: 1, label: '1. Dates & Rooms' },
            { id: 2, label: '2. Guest Details' },
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
        <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2.5 text-xs text-rose-800">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-5 sm:p-6">
          {step === 1 && (
            <div className="space-y-6">
              {/* Dates & Guests */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Check-in Date
                  </label>
                  <input
                    type="date"
                    min={today}
                    value={checkIn}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCheckIn(val);
                      if (val >= checkOut) setCheckOut(addDays(val, 1));
                    }}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Check-out Date
                  </label>
                  <input
                    type="date"
                    min={addDays(checkIn, 1)}
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Adults
                  </label>
                  <select
                    value={adults}
                    onChange={(e) => setAdults(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium bg-white"
                  >
                    {[1, 2, 3, 4, 5, 6, 8].map((n) => (
                      <option key={n} value={n}>
                        {n} Adults
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Children
                  </label>
                  <select
                    value={children}
                    onChange={(e) => setChildren(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium bg-white"
                  >
                    {[0, 1, 2, 3, 4].map((n) => (
                      <option key={n} value={n}>
                        {n} Children
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Available Room Categories */}
              <div>
                <h2 className="text-sm font-bold text-slate-900 mb-3">
                  Select Available Room Category ({quote.nights} Night{quote.nights > 1 ? 's' : ''})
                </h2>
                <div className="space-y-3">
                  {roomCategories.map((cat) => {
                    const avail = getCategoryAvailableCount(cat.id, checkIn, checkOut);
                    const isSelected = categoryId === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        disabled={avail === 0}
                        onClick={() => {
                          setCategoryId(cat.id);
                          setRoomCount(1);
                        }}
                        className={`w-full text-left p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                          isSelected
                            ? 'border-emerald-700 bg-emerald-50/40'
                            : avail === 0
                            ? 'border-slate-200 bg-slate-50 opacity-55 cursor-not-allowed'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-900">{cat.name}</span>
                            <span className="text-xs text-slate-500">· {cat.bedType}</span>
                          </div>
                          <div className="text-xs text-slate-600 mt-1">
                            Max {cat.maxAdults}A + {cat.maxChildren}C ·{' '}
                            <span
                              className={`font-mono-tabular font-semibold ${
                                avail > 0 ? 'text-emerald-700' : 'text-rose-700'
                              }`}
                            >
                              {avail} room(s) available
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold font-mono-tabular text-slate-900">
                            {formatINR(cat.weekdayPrice)}
                            <span className="text-xs font-normal text-slate-500">/night</span>
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono-tabular">
                            Weekend {formatINR(cat.weekendPrice)}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity & Extra Beds & Addons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Number of Rooms
                  </label>
                  <select
                    value={roomCount}
                    onChange={(e) => setRoomCount(Number(e.target.value))}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-white font-mono-tabular"
                  >
                    {Array.from({ length: Math.max(1, maxAvailableForCat) }, (_, i) => i + 1).map(
                      (n) => (
                        <option key={n} value={n}>
                          {n} Room{n > 1 ? 's' : ''}
                        </option>
                      )
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Extra Beds ({selectedCategory ? formatINR(selectedCategory.extraBedPrice) : ''}/night)
                  </label>
                  <select
                    value={extraBeds}
                    onChange={(e) => setExtraBeds(Number(e.target.value))}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-white font-mono-tabular"
                  >
                    {[0, 1, 2, 3].map((n) => (
                      <option key={n} value={n}>
                        {n} Extra Bed{n !== 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    if (maxAvailableForCat < roomCount) {
                      setErrorMsg('Insufficient rooms available for these dates.');
                      return;
                    }
                    setErrorMsg('');
                    setStep(2);
                  }}
                  className="min-h-[44px] w-full sm:w-auto px-6 py-2.5 bg-[#0B1628] text-white text-sm font-semibold rounded-xl hover:bg-[#172D4D] transition-colors"
                >
                  Continue to Guest Details
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-slate-900">Step 7: Guest Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Primary Guest Name *
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Priya Menon"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+91 99401 77812"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="priya.menon@example.in"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Special Requests (Early check-in, dietary notes, crib)
                  </label>
                  <textarea
                    rows={3}
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="Optional arrival notes..."
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm"
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
                      setErrorMsg('Please fill all required guest fields.');
                      return;
                    }
                    setErrorMsg('');
                    setStep(3);
                  }}
                  className="px-6 py-2.5 bg-[#172D4D] text-white text-sm font-semibold rounded-lg hover:bg-[#1e3a63]"
                >
                  Review &amp; Pay
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-slate-900">Step 8 &amp; 9: Review &amp; Payment</h2>

              <div className="p-4 bg-[#F8FAFC] border border-slate-200 rounded-lg space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Guest</span>
                  <span className="font-medium">
                    {customerName} · {customerPhone}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Stay</span>
                  <span className="font-semibold text-emerald-700">
                    {roomCount} × {selectedCategory?.name} ({quote.nights} Nights)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Dates</span>
                  <span className="font-mono-tabular">
                    {formatDateShort(checkIn)} → {formatDateShort(checkOut)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Occupancy</span>
                  <span>
                    {adults} Adults, {children} Children {extraBeds > 0 ? `+ ${extraBeds} Extra Bed` : ''}
                  </span>
                </div>
              </div>

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
                      <span>{method === 'Cash' ? 'Pay at Desk' : method}</span>
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={simulateFail}
                  onChange={(e) => setSimulateFail(e.target.checked)}
                />
                <span>Simulate payment failure (demo test toggle)</span>
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
                  onClick={handleConfirmBooking}
                  className="min-h-[44px] inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#0B1628] text-white text-sm font-semibold rounded-xl hover:bg-[#172D4D] transition-colors"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Confirm &amp; Pay {formatINR(quote.totalAmount)}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Price Breakdown Sidebar */}
        <aside className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-5 lg:sticky lg:top-24">
          <div>
            <h3 className="text-base font-bold text-slate-900">Stay Price Breakdown</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {selectedCategory?.name} · {roomCount} room(s) · {quote.nights} night(s)
              {settings.seasonalPricingActive ? ' · Seasonal rate active' : ''}
            </p>
          </div>

          <div className="space-y-2.5 text-sm border-t border-b border-slate-200 py-4">
            <div className="flex justify-between">
              <span className="text-slate-600">Room Tariff</span>
              <span className="font-mono-tabular font-medium">
                {formatINR(quote.roomSubtotal)}
              </span>
            </div>
            {quote.extraBedTotal > 0 && (
              <div className="flex justify-between">
                <span className="text-slate-600">Extra Beds ({extraBeds})</span>
                <span className="font-mono-tabular font-medium">
                  {formatINR(quote.extraBedTotal)}
                </span>
              </div>
            )}
            {quote.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Discount ({appliedCoupon})</span>
                <span className="font-mono-tabular font-medium">
                  -{formatINR(quote.discountAmount)}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-600">Hospitality GST (12%)</span>
              <span className="font-mono-tabular font-medium">
                {formatINR(quote.taxAmount)}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-100 text-base font-bold text-slate-900">
              <span>Total Amount</span>
              <span className="font-mono-tabular">{formatINR(quote.totalAmount)}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Promo Code (Try RESORT15 or WELCOME10)
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="RESORT15"
                  className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-lg text-xs uppercase font-mono-tabular"
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
