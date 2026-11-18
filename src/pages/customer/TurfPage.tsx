import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, CheckCircle2, Clock, Shield, Trophy, Users } from 'lucide-react';
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Turf Hero */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch">
        <div className="lg:col-span-7 min-h-[280px] bg-slate-100">
          <SmartImage
            src={turfConfig.image}
            alt={turfConfig.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold text-blue-700 tracking-wide">
              Single Championship Turf Ground
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1.5 tracking-tight">
              {turfConfig.name}
            </h1>
            <p className="text-sm text-slate-600 mt-3 leading-relaxed">
              {turfConfig.description}
            </p>

            <div className="mt-6 grid grid-cols-2 gap-4 pt-5 border-t border-slate-100 text-xs">
              <div>
                <div className="text-slate-500">Dimensions</div>
                <div className="font-semibold text-slate-900 mt-0.5">{turfConfig.dimensions}</div>
              </div>
              <div>
                <div className="text-slate-500">Operating Hours</div>
                <div className="font-semibold text-slate-900 mt-0.5">{turfConfig.operatingHours}</div>
              </div>
              <div>
                <div className="text-slate-500">Surface</div>
                <div className="font-semibold text-slate-900 mt-0.5">{turfConfig.surface}</div>
              </div>
              <div>
                <div className="text-slate-500">Match Format</div>
                <div className="font-semibold text-slate-900 mt-0.5">{turfConfig.capacity}</div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-5 border-t border-slate-200 flex items-center justify-between gap-4">
            <div>
              <div className="text-xs text-slate-500">Starting at</div>
              <div className="text-xl font-bold text-slate-900 font-mono-tabular">
                {formatINR(turfConfig.weekdayPrice)}
                <span className="text-xs font-normal text-slate-500"> / hour</span>
              </div>
            </div>
            <Link
              to={`/turf/booking?date=${selectedDate}`}
              className="px-6 py-3 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
            >
              Book Now
            </Link>
          </div>
        </div>
      </div>

      {/* Pricing & Specs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Hourly Tariff Structure</h2>
            <div className="divide-y divide-slate-100 text-sm">
              <div className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-medium text-slate-900">Weekday Morning / Afternoon</div>
                  <div className="text-xs text-slate-500">Mon – Fri · 06:00 AM – 05:00 PM</div>
                </div>
                <span className="font-bold font-mono-tabular text-slate-900">
                  {formatINR(turfConfig.weekdayPrice)}/hr
                </span>
              </div>
              <div className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-medium text-slate-900">Weekend Day Slots</div>
                  <div className="text-xs text-slate-500">Sat – Sun · 06:00 AM – 05:00 PM</div>
                </div>
                <span className="font-bold font-mono-tabular text-slate-900">
                  {formatINR(turfConfig.weekendPrice)}/hr
                </span>
              </div>
              <div className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-medium text-slate-900">Floodlit Peak Evening</div>
                  <div className="text-xs text-slate-500">All Days · 05:00 PM – 10:00 PM</div>
                </div>
                <span className="font-bold font-mono-tabular text-blue-700">
                  {formatINR(turfConfig.peakHourPrice)}/hr
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-3">Included Ground Amenities</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-sm text-slate-700">
              {turfConfig.amenities.map((a) => (
                <li key={a} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>{a}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 p-3.5 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-900">
              {turfConfig.specialOfferText}
            </div>
          </div>
        </div>

        {/* Live Availability Preview */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Live Ground Slot Availability</h2>
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
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-600"
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
                  className={`p-3.5 rounded-lg border flex items-center justify-between transition-colors ${
                    isAvail
                      ? 'border-slate-200 hover:border-blue-600 hover:bg-blue-50/40 cursor-pointer'
                      : info.status === 'Booked'
                      ? 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'border-amber-200 bg-amber-50/50 text-amber-800 cursor-not-allowed'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold font-mono-tabular">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{slot}</span>
                    </div>
                    <div className="text-[11px] mt-1">
                      {info.status === 'Available' && (
                        <span className="text-emerald-700 font-medium">Available · Tap to book</span>
                      )}
                      {info.status === 'Booked' && <span>Booked</span>}
                      {info.status === 'Blocked' && (
                        <span>Blocked ({info.blockReason || 'Maintenance'})</span>
                      )}
                    </div>
                  </div>
                  <span className="text-xs font-bold font-mono-tabular">
                    {isAvail ? formatINR(price) : info.status}
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-blue-600" /> One unified turf ground
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-slate-500" /> 5v5 / 7v7 ready
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-600" /> Double-booking protected
              </span>
            </div>
            <Link
              to={`/turf/booking?date=${selectedDate}`}
              className="font-semibold text-blue-700 hover:underline"
            >
              Open Full Booking Wizard →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
