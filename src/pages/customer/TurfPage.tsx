import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, CheckCircle2, Clock } from 'lucide-react';
import { usePlatform, TURF_SLOTS } from '../../context/PlatformContext';
import { SmartImage } from '../../components/common/SmartImage';
import { addDays, formatDateShort, formatINR, getTodayIST } from '../../utils/format';

export const TurfPage: React.FC = () => {
  const { turfConfig, getTurfSlotStatus, getTurfSlotPrice } = usePlatform();
  const today = getTodayIST();
  const [selectedDate, setSelectedDate] = useState(today);

  const availableCount = TURF_SLOTS.filter(
    (s) => getTurfSlotStatus(selectedDate, s).status === 'Available'
  ).length;

  return (
    <div className="space-y-12 pb-12">
      {/* Dark Coastal Turf Hero */}
      <section className="relative bg-[#071120] text-white overflow-hidden">
        <div className="absolute inset-0">
          <SmartImage
            src={turfConfig.image}
            alt={turfConfig.name}
            className="w-full h-full object-cover opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#071120]/95 via-[#0B1628]/80 to-[#0B1628]/55" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-7">
              <p className="text-xs sm:text-sm font-semibold text-blue-400 tracking-wide">
                Single Championship Floodlit Turf Ground
              </p>
              <h1 className="type-h1 font-extrabold text-white mt-2">{turfConfig.name}</h1>
              <p className="type-lead text-slate-300 mt-3 max-w-2xl">{turfConfig.description}</p>

              <div className="mt-7 flex flex-wrap items-center gap-4">
                <Link
                  to={`/turf/booking?date=${selectedDate}`}
                  className="inline-flex items-center justify-center min-h-[46px] px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors whitespace-nowrap"
                >
                  Book Slot Now
                </Link>
                <div className="text-sm text-slate-300">
                  From{' '}
                  <strong className="font-mono-tabular text-white text-lg">
                    {formatINR(turfConfig.weekdayPrice)}
                  </strong>
                  /hr
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 grid grid-cols-2 gap-3.5 bg-[#0B1628]/80 backdrop-blur-xs border border-white/15 rounded-2xl p-5 text-xs">
              <div>
                <div className="text-slate-400">Dimensions</div>
                <div className="font-semibold text-white mt-0.5">{turfConfig.dimensions}</div>
              </div>
              <div>
                <div className="text-slate-400">Operating Hours</div>
                <div className="font-semibold text-white mt-0.5">{turfConfig.operatingHours}</div>
              </div>
              <div>
                <div className="text-slate-400">Surface</div>
                <div className="font-semibold text-white mt-0.5">{turfConfig.surface}</div>
              </div>
              <div>
                <div className="text-slate-400">Match Format</div>
                <div className="font-semibold text-white mt-0.5">{turfConfig.capacity}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing & Live Slots */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h2 className="type-h3 font-bold text-slate-900 mb-4">Hourly Tariff Structure</h2>
            <div className="divide-y divide-slate-100 text-sm">
              <div className="py-3.5 flex items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-900">Weekday Morning / Afternoon</div>
                  <div className="text-xs text-slate-500">Mon – Fri · 06:00 AM – 05:00 PM</div>
                </div>
                <span className="font-bold font-mono-tabular text-slate-900 shrink-0">
                  {formatINR(turfConfig.weekdayPrice)}/hr
                </span>
              </div>
              <div className="py-3.5 flex items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-900">Weekend Day Slots</div>
                  <div className="text-xs text-slate-500">Sat – Sun · 06:00 AM – 05:00 PM</div>
                </div>
                <span className="font-bold font-mono-tabular text-slate-900 shrink-0">
                  {formatINR(turfConfig.weekendPrice)}/hr
                </span>
              </div>
              <div className="py-3.5 flex items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-900">Floodlit Peak Evening</div>
                  <div className="text-xs text-slate-500">All Days · 05:00 PM – 10:00 PM</div>
                </div>
                <span className="font-bold font-mono-tabular text-blue-700 shrink-0">
                  {formatINR(turfConfig.peakHourPrice)}/hr
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h2 className="type-h3 font-bold text-slate-900 mb-3">Included Ground Amenities</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-sm text-slate-700">
              {turfConfig.amenities.map((a) => (
                <li key={a} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>{a}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 p-3.5 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-900">
              {turfConfig.specialOfferText}
            </div>
          </div>
        </div>

        {/* Live Availability Preview */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <h2 className="type-h3 font-bold text-slate-900">Live Ground Slot Availability</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {formatDateShort(selectedDate)} · {availableCount} of {TURF_SLOTS.length} slots open
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <input
                type="date"
                min={today}
                max={addDays(today, 30)}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="min-h-[40px] px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {TURF_SLOTS.map((slot) => {
              const info = getTurfSlotStatus(selectedDate, slot);
              const price = getTurfSlotPrice(selectedDate, slot);
              const isAvail = info.status === 'Available';
              return (
                <Link
                  key={slot}
                  to={
                    isAvail
                      ? `/turf/booking?date=${selectedDate}&slot=${encodeURIComponent(slot)}`
                      : '#'
                  }
                  onClick={(e) => {
                    if (!isAvail) e.preventDefault();
                  }}
                  className={`p-3.5 min-h-[60px] rounded-xl border flex items-center justify-between transition-colors ${
                    isAvail
                      ? 'border-slate-200 hover:border-blue-600 hover:bg-blue-50/40'
                      : 'border-slate-100 bg-slate-50 opacity-75 cursor-not-allowed'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold font-mono-tabular text-slate-900">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{slot}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {isAvail ? 'Tap to reserve slot' : info.blockReason || info.status}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold font-mono-tabular text-slate-900">
                      {formatINR(price)}
                    </div>
                    <div
                      className={`text-[11px] font-semibold mt-0.5 ${
                        info.status === 'Available'
                          ? 'text-emerald-700'
                          : info.status === 'Booked'
                          ? 'text-slate-500'
                          : 'text-rose-700'
                      }`}
                    >
                      {info.status}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
