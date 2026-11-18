import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Trophy } from 'lucide-react';
import { usePlatform, TURF_SLOTS } from '../../../context/PlatformContext';
import { SimpleBarChart } from '../../../components/common/Charts';
import { StatusLabel } from '../../../components/common/StatusLabel';
import { addDays, formatDateShort, formatINR, getTodayIST } from '../../../utils/format';

export const AdminTurfOverviewPage: React.FC = () => {
  const { turfConfig, turfBookings, getTurfSlotStatus } = usePlatform();
  const today = getTodayIST();

  const todaysBookings = turfBookings.filter(
    (b) => b.date === today && b.bookingStatus !== 'Cancelled'
  );
  const todaysRevenue = todaysBookings.reduce((s, b) => s + b.totalAmount, 0);
  const availableToday = TURF_SLOTS.filter(
    (s) => getTurfSlotStatus(today, s).status === 'Available'
  ).length;
  const bookedToday = TURF_SLOTS.filter(
    (s) => getTurfSlotStatus(today, s).status === 'Booked'
  ).length;
  const pendingCount = turfBookings.filter((b) => b.bookingStatus === 'Pending').length;

  const last7Days = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = addDays(today, i - 6);
      const rev = turfBookings
        .filter((b) => b.date === d && b.bookingStatus !== 'Cancelled')
        .reduce((s, b) => s + b.totalAmount, 0);
      return { label: d.slice(5), value: rev };
    });
  }, [today, turfBookings]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-blue-700 inline-flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5" /> Single Turf Management
          </p>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{turfConfig.name}</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {turfConfig.dimensions} · {turfConfig.operatingHours}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/admin/turf/calendar"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Open Slot Calendar</span>
          </Link>
          <Link
            to="/admin/turf/pricing"
            className="px-4 py-2 border border-slate-200 bg-white text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-50"
          >
            Edit Pricing
          </Link>
        </div>
      </div>

      {/* 5 Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="text-xs text-slate-500">Today&apos;s Bookings</div>
          <div className="text-2xl font-bold font-mono-tabular text-slate-900 mt-1">
            {todaysBookings.length}
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="text-xs text-slate-500">Today&apos;s Revenue</div>
          <div className="text-2xl font-bold font-mono-tabular text-blue-700 mt-1">
            {formatINR(todaysRevenue)}
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="text-xs text-slate-500">Available Slots (Today)</div>
          <div className="text-2xl font-bold font-mono-tabular text-emerald-700 mt-1">
            {availableToday}
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="text-xs text-slate-500">Booked Slots (Today)</div>
          <div className="text-2xl font-bold font-mono-tabular text-slate-900 mt-1">
            {bookedToday}
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 col-span-2 lg:col-span-1">
          <div className="text-xs text-slate-500">Pending Bookings</div>
          <div className="text-2xl font-bold font-mono-tabular text-amber-700 mt-1">
            {pendingCount}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Today's Slot Feed */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5">
          <h2 className="text-sm font-bold text-slate-900 mb-3">
            Today&apos;s Slot Schedule ({formatDateShort(today)})
          </h2>
          <div className="divide-y divide-slate-100 text-xs">
            {TURF_SLOTS.map((slot) => {
              const info = getTurfSlotStatus(today, slot);
              return (
                <div key={slot} className="py-2.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 font-mono-tabular text-slate-800">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{slot}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {info.booking && (
                      <span className="text-slate-600 truncate max-w-[110px]">
                        {info.booking.customerName}
                      </span>
                    )}
                    <StatusLabel status={info.status} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Revenue Trend */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">7-Day Turf Revenue Trend</h2>
            <p className="text-xs text-slate-500 mb-4">Daily confirmed &amp; completed slot revenue</p>
            <SimpleBarChart data={last7Days} height={200} defaultColor="#2563EB" />
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-slate-500">Weekday Rate</span>
              <div className="font-bold font-mono-tabular text-slate-900 mt-0.5">
                {formatINR(turfConfig.weekdayPrice)}/hr
              </div>
            </div>
            <div>
              <span className="text-slate-500">Weekend Rate</span>
              <div className="font-bold font-mono-tabular text-slate-900 mt-0.5">
                {formatINR(turfConfig.weekendPrice)}/hr
              </div>
            </div>
            <div>
              <span className="text-slate-500">Peak Evening</span>
              <div className="font-bold font-mono-tabular text-blue-700 mt-0.5">
                {formatINR(turfConfig.peakHourPrice)}/hr
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
