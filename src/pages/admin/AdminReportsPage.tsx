import React, { useMemo, useState } from 'react';
import { usePlatform, TURF_SLOTS } from '../../context/PlatformContext';
import { ServiceSplitBar, SimpleBarChart } from '../../components/common/Charts';
import { addDays, formatINR, getTodayIST } from '../../utils/format';

export const AdminReportsPage: React.FC = () => {
  const {
    turfBookings,
    resortBookings,
    resortRooms,
    roomCategories,
    foodOrders,
    customers,
  } = usePlatform();

  const today = getTodayIST();
  const [daysWindow, setDaysWindow] = useState<7 | 30 | 90>(30);
  const startDate = addDays(today, -(daysWindow - 1));

  const inWin = (d: string) => d.slice(0, 10) >= startDate && d.slice(0, 10) <= today;

  const activeTurf = useMemo(
    () => turfBookings.filter((b) => inWin(b.date) && b.bookingStatus !== 'Cancelled'),
    [turfBookings, startDate, today]
  );
  const activeResort = useMemo(
    () => resortBookings.filter((b) => inWin(b.checkIn) && b.bookingStatus !== 'Cancelled'),
    [resortBookings, startDate, today]
  );
  const activeFood = useMemo(
    () => foodOrders.filter((o) => inWin(o.createdAt) && o.orderStatus !== 'Cancelled'),
    [foodOrders, startDate, today]
  );

  const turfRev = activeTurf.reduce((s, b) => s + b.totalAmount, 0);
  const resortRev = activeResort.reduce((s, b) => s + b.totalAmount, 0);
  const foodRev = activeFood.reduce((s, o) => s + o.totalAmount, 0);
  const totalRev = turfRev + resortRev + foodRev;

  // Turf Popular Times
  const turfSlotCounts = useMemo(() => {
    const map: Record<string, number> = {};
    TURF_SLOTS.forEach((s) => (map[s] = 0));
    activeTurf.forEach((b) =>
      b.slots.forEach((s) => {
        if (map[s] !== undefined) map[s] += 1;
      })
    );
    return TURF_SLOTS.map((s) => ({
      label: s.split('–')[0].trim().replace(':00 ', ''),
      value: map[s],
    }));
  }, [activeTurf]);

  // Resort Category Revenue
  const resortCatPerf = useMemo(() => {
    return roomCategories.map((cat) => {
      const bookings = activeResort.filter((b) => b.categoryId === cat.id);
      const rev = bookings.reduce((s, b) => s + b.totalAmount, 0);
      const nights = bookings.reduce((s, b) => s + b.nights * b.roomCount, 0);
      return { name: cat.name, bookings: bookings.length, nights, rev };
    });
  }, [roomCategories, activeResort]);

  // Restaurant Fulfilment Split
  const fulfilmentStats = useMemo(() => {
    return (['Dine-in', 'Takeaway', 'Home Delivery'] as const).map((type) => {
      const list = activeFood.filter((o) => o.fulfilmentType === type);
      return {
        type,
        count: list.length,
        rev: list.reduce((s, o) => s + o.totalAmount, 0),
      };
    });
  }, [activeFood]);

  const occupiedRooms = resortRooms.filter(
    (r) => r.status === 'Occupied' || r.status === 'Reserved'
  ).length;
  const roomOccupancyPct = Math.round((occupiedRooms / Math.max(1, resortRooms.length)) * 100);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="type-h1 text-[#0B1628]">
            Reports &amp; Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Combined and service-specific performance metrics across the unified estate.
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-xl self-start">
          {([7, 30, 90] as const).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDaysWindow(d)}
              className={`min-h-[36px] px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                daysWindow === d ? 'bg-[#0B1628] text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Last {d} Days
            </button>
          ))}
        </div>
      </div>

      {/* Overall KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5">
          <div className="text-xs text-slate-500">Total Period Revenue</div>
          <div className="type-h2 font-mono-tabular text-[#0B1628] mt-1">
            {formatINR(totalRev)}
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5">
          <div className="text-xs text-slate-500">Total Active Bookings</div>
          <div className="type-h2 font-mono-tabular text-[#0B1628] mt-1">
            {activeTurf.length + activeResort.length + activeFood.length}
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5">
          <div className="text-xs text-slate-500">Resort Live Occupancy</div>
          <div className="type-h2 font-mono-tabular text-emerald-700 mt-1">
            {roomOccupancyPct}%
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5">
          <div className="text-xs text-slate-500">Customer Base</div>
          <div className="type-h2 font-mono-tabular text-[#0B1628] mt-1">
            {customers.length}
          </div>
        </div>
      </div>

      {/* Service Revenue Breakdown + Turf Popular Times */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5">
          <h2 className="text-sm font-bold text-slate-900 mb-4">Revenue Share by Service</h2>
          <ServiceSplitBar
            items={[
              {
                label: 'Resort Stays',
                amount: resortRev,
                color: '#15803D',
                countLabel: `${activeResort.length} bookings`,
              },
              {
                label: 'Turf Slots',
                amount: turfRev,
                color: '#2563EB',
                countLabel: `${activeTurf.length} slots`,
              },
              {
                label: 'Restaurant',
                amount: foodRev,
                color: '#EA580C',
                countLabel: `${activeFood.length} orders`,
              },
            ]}
          />
        </div>

        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5">
          <h2 className="text-sm font-bold text-slate-900">
            Turf Popular Booking Times (Bookings per Slot)
          </h2>
          <p className="text-xs text-slate-500 mb-3">
            Floodlit evening slots (6 PM – 9 PM) drive highest occupancy
          </p>
          <SimpleBarChart
            data={turfSlotCounts}
            height={175}
            formatValue={(v) => `${v} bookings`}
            defaultColor="#2563EB"
          />
        </div>
      </div>

      {/* Resort Category Performance + Restaurant Fulfilment */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200">
            <h2 className="text-sm font-bold text-slate-900">Resort Category Performance</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase">
                  <th className="py-2.5 px-4">Room Category</th>
                  <th className="py-2.5 px-4 text-right">Bookings</th>
                  <th className="py-2.5 px-4 text-right">Room Nights</th>
                  <th className="py-2.5 px-4 text-right">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {resortCatPerf.map((row) => (
                  <tr key={row.name}>
                    <td className="py-2.5 px-4 font-semibold text-slate-900">{row.name}</td>
                    <td className="py-2.5 px-4 text-right font-mono-tabular">{row.bookings}</td>
                    <td className="py-2.5 px-4 text-right font-mono-tabular">{row.nights}</td>
                    <td className="py-2.5 px-4 text-right font-mono-tabular font-semibold text-emerald-700">
                      {formatINR(row.rev)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200">
            <h2 className="text-sm font-bold text-slate-900">
              Restaurant Orders: Dine-in vs Takeaway vs Delivery
            </h2>
          </div>
          <div className="divide-y divide-slate-100 text-xs">
            {fulfilmentStats.map((fs) => (
              <div key={fs.type} className="p-4 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-900">{fs.type}</div>
                  <div className="text-[11px] text-slate-500 font-mono-tabular">
                    {fs.count} orders
                  </div>
                </div>
                <span className="font-mono-tabular font-bold text-orange-700 text-sm">
                  {formatINR(fs.rev)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
