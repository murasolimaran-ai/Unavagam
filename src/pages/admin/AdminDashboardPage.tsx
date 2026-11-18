import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BedDouble,
  Calendar,
  Trophy,
  UtensilsCrossed,
} from 'lucide-react';
import { usePlatform, TURF_SLOTS } from '../../context/PlatformContext';
import {
  ServiceSplitBar,
  SimpleBarChart,
  TrendSparkLine,
} from '../../components/common/Charts';
import { ServiceTag, StatusLabel } from '../../components/common/StatusLabel';
import { addDays, formatDateShort, formatINR, getTodayIST } from '../../utils/format';

type DateRangePreset = 'today' | 'yesterday' | '7d' | '30d' | 'custom';

export const AdminDashboardPage: React.FC = () => {
  const {
    turfBookings,
    resortBookings,
    resortRooms,
    foodOrders,
    tableReservations,
    customers,
    getTurfSlotStatus,
  } = usePlatform();

  const today = getTodayIST();
  const yesterday = addDays(today, -1);

  const [preset, setPreset] = useState<DateRangePreset>('30d');
  const [customStart, setCustomStart] = useState(addDays(today, -7));
  const [customEnd, setCustomEnd] = useState(today);

  const dateBounds = useMemo(() => {
    if (preset === 'today') return { start: today, end: today };
    if (preset === 'yesterday') return { start: yesterday, end: yesterday };
    if (preset === '7d') return { start: addDays(today, -6), end: today };
    if (preset === '30d') return { start: addDays(today, -29), end: today };
    return { start: customStart, end: customEnd };
  }, [preset, today, yesterday, customStart, customEnd]);

  const inRange = (dateStr: string) => {
    const d = dateStr.slice(0, 10);
    return d >= dateBounds.start && d <= dateBounds.end;
  };

  const filteredTurf = useMemo(
    () => turfBookings.filter((b) => inRange(b.date) && b.bookingStatus !== 'Cancelled'),
    [turfBookings, dateBounds]
  );
  const filteredResort = useMemo(
    () => resortBookings.filter((b) => inRange(b.checkIn) && b.bookingStatus !== 'Cancelled'),
    [resortBookings, dateBounds]
  );
  const filteredFood = useMemo(
    () => foodOrders.filter((o) => inRange(o.createdAt) && o.orderStatus !== 'Cancelled'),
    [foodOrders, dateBounds]
  );
  const filteredTables = useMemo(
    () => tableReservations.filter((r) => inRange(r.date) && r.status !== 'Cancelled'),
    [tableReservations, dateBounds]
  );

  // Derived Totals
  const turfRevenue = filteredTurf.reduce((s, b) => s + b.totalAmount, 0);
  const resortRevenue = filteredResort.reduce((s, b) => s + b.totalAmount, 0);
  const foodRevenue = filteredFood.reduce((s, o) => s + o.totalAmount, 0);
  const totalRevenue = turfRevenue + resortRevenue + foodRevenue;

  const totalBookings =
    filteredTurf.length + filteredResort.length + filteredFood.length + filteredTables.length;

  const todaysBookingsCount =
    turfBookings.filter((b) => b.date === today && b.bookingStatus !== 'Cancelled').length +
    resortBookings.filter((b) => b.checkIn === today && b.bookingStatus !== 'Cancelled').length +
    foodOrders.filter((o) => o.createdAt.slice(0, 10) === today && o.orderStatus !== 'Cancelled')
      .length +
    tableReservations.filter((r) => r.date === today && r.status !== 'Cancelled').length;

  const pendingBookingsCount =
    turfBookings.filter((b) => b.bookingStatus === 'Pending').length +
    resortBookings.filter((b) => b.bookingStatus === 'Pending').length +
    foodOrders.filter((o) => o.orderStatus === 'New' || o.orderStatus === 'Accepted').length +
    tableReservations.filter((r) => r.status === 'Pending').length;

  // Live Today Service Snapshot Metrics
  const availableSlotsToday = TURF_SLOTS.filter(
    (s) => getTurfSlotStatus(today, s).status === 'Available'
  ).length;
  const occupiedSlotsToday = TURF_SLOTS.length - availableSlotsToday;

  const occupiedRoomsNow = resortRooms.filter((r) => r.status === 'Occupied').length;
  const availableRoomsNow = resortRooms.filter((r) => r.status === 'Available').length;
  const todaysCheckIns = resortBookings.filter(
    (b) => b.checkIn === today && b.bookingStatus !== 'Cancelled'
  ).length;
  const todaysCheckOuts = resortBookings.filter(
    (b) => b.checkOut === today && b.bookingStatus !== 'Cancelled'
  ).length;

  const preparingOrders = foodOrders.filter((o) => o.orderStatus === 'Preparing').length;
  const readyOrders = foodOrders.filter((o) => o.orderStatus === 'Ready').length;

  // 7-day revenue & booking volume series
  const last7DaysSeries = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, i) => addDays(today, i - 6));
    return days.map((d) => {
      const tr = turfBookings
        .filter((b) => b.date === d && b.bookingStatus !== 'Cancelled')
        .reduce((s, b) => s + b.totalAmount, 0);
      const rr = resortBookings
        .filter((b) => b.checkIn === d && b.bookingStatus !== 'Cancelled')
        .reduce((s, b) => s + b.totalAmount, 0);
      const fr = foodOrders
        .filter((o) => o.createdAt.slice(0, 10) === d && o.orderStatus !== 'Cancelled')
        .reduce((s, o) => s + o.totalAmount, 0);

      const count =
        turfBookings.filter((b) => b.date === d && b.bookingStatus !== 'Cancelled').length +
        resortBookings.filter((b) => b.checkIn === d && b.bookingStatus !== 'Cancelled').length +
        foodOrders.filter((o) => o.createdAt.slice(0, 10) === d && o.orderStatus !== 'Cancelled')
          .length;

      return {
        label: d.slice(5),
        revenue: tr + rr + fr,
        count,
      };
    });
  }, [today, turfBookings, resortBookings, foodOrders]);

  // Weekly performance (last 4 weeks)
  const weeklyMonthlySeries = useMemo(() => {
    return [3, 2, 1, 0].map((wIdx) => {
      const end = addDays(today, -wIdx * 7);
      const start = addDays(end, -6);
      const sumDay = (d: string) => d >= start && d <= end;
      const rev =
        turfBookings
          .filter((b) => sumDay(b.date) && b.bookingStatus !== 'Cancelled')
          .reduce((s, b) => s + b.totalAmount, 0) +
        resortBookings
          .filter((b) => sumDay(b.checkIn) && b.bookingStatus !== 'Cancelled')
          .reduce((s, b) => s + b.totalAmount, 0) +
        foodOrders
          .filter((o) => sumDay(o.createdAt.slice(0, 10)) && o.orderStatus !== 'Cancelled')
          .reduce((s, o) => s + o.totalAmount, 0);
      return {
        label: wIdx === 0 ? 'This Wk' : `W-${wIdx}`,
        value: rev,
      };
    });
  }, [today, turfBookings, resortBookings, foodOrders]);

  // Unified Recent Activity across all services
  const recentActivity = useMemo(() => {
    const combined = [
      ...turfBookings.map((b) => ({
        id: b.id,
        customer: b.customerName,
        service: 'Turf' as const,
        date: b.date,
        amount: b.totalAmount,
        status: b.bookingStatus,
        createdAt: b.createdAt,
      })),
      ...resortBookings.map((b) => ({
        id: b.id,
        customer: b.customerName,
        service: 'Resort' as const,
        date: b.checkIn,
        amount: b.totalAmount,
        status: b.bookingStatus,
        createdAt: b.createdAt,
      })),
      ...foodOrders.map((o) => ({
        id: o.id,
        customer: o.customerName,
        service: 'Restaurant' as const,
        date: o.createdAt.slice(0, 10),
        amount: o.totalAmount,
        status: o.orderStatus,
        createdAt: o.createdAt,
      })),
      ...tableReservations.map((r) => ({
        id: r.id,
        customer: r.customerName,
        service: 'Restaurant' as const,
        date: r.date,
        amount: 0,
        status: r.status,
        createdAt: r.createdAt,
      })),
    ];
    return combined
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, 10);
  }, [turfBookings, resortBookings, foodOrders, tableReservations]);

  return (
    <div className="space-y-6">
      {/* Coastal Executive Header */}
      <div className="bg-[#0B1628] text-white rounded-2xl p-5 sm:p-6 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold text-[#C89B54] uppercase tracking-wider">
            Unified Estate Command
          </p>
          <h1 className="type-h2 font-bold text-white mt-0.5">Unified Executive Overview</h1>
          <p className="text-xs text-slate-300 mt-1">
            Live metrics across Turf, Resort &amp; Restaurant ({formatDateShort(dateBounds.start)} –{' '}
            {formatDateShort(dateBounds.end)})
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap items-center gap-1 p-1 bg-white/10 border border-white/10 rounded-xl">
            {(
              [
                { id: 'today', label: 'Today' },
                { id: 'yesterday', label: 'Yesterday' },
                { id: '7d', label: 'Last 7 Days' },
                { id: '30d', label: 'Last 30 Days' },
                { id: 'custom', label: 'Custom' },
              ] as const
            ).map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPreset(p.id)}
                className={`min-h-[36px] px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  preset === p.id
                    ? 'bg-[#C89B54] text-[#0B1628]'
                    : 'text-slate-200 hover:text-white hover:bg-white/10'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {preset === 'custom' && (
            <div className="flex items-center gap-1.5 bg-white text-slate-900 rounded-xl px-2.5 py-1.5 text-xs">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="date"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                className="text-xs focus:outline-none"
              />
              <span className="text-slate-400">–</span>
              <input
                type="date"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="text-xs focus:outline-none"
              />
            </div>
          )}
        </div>
      </div>

      {/* Top 5 KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5">
          <div className="text-xs text-slate-500 font-medium">Total Revenue</div>
          <div className="text-xl sm:text-2xl font-bold font-mono-tabular text-slate-900 mt-1">
            {formatINR(totalRevenue)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Selected range</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5">
          <div className="text-xs text-slate-500 font-medium">Total Bookings</div>
          <div className="text-xl sm:text-2xl font-bold font-mono-tabular text-slate-900 mt-1">
            {totalBookings}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Across all 3 services</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5">
          <div className="text-xs text-slate-500 font-medium">Today&apos;s Bookings</div>
          <div className="text-xl sm:text-2xl font-bold font-mono-tabular text-[#0B1628] mt-1">
            {todaysBookingsCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Scheduled for today</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5">
          <div className="text-xs text-slate-500 font-medium">Pending Action</div>
          <div className="text-xl sm:text-2xl font-bold font-mono-tabular text-amber-700 mt-1">
            {pendingBookingsCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Awaiting confirmation</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 col-span-2 lg:col-span-1">
          <div className="text-xs text-slate-500 font-medium">Total Customers</div>
          <div className="text-2xl font-bold font-mono-tabular text-slate-900 mt-1">
            {customers.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Shared CRM database</div>
        </div>
      </div>

      {/* Service Performance Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Turf Performance */}
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="inline-flex items-center gap-2 text-sm font-bold text-blue-700">
              <Trophy className="w-4 h-4" /> Turf Performance
            </span>
            <Link to="/admin/turf" className="text-xs font-medium text-slate-500 hover:text-slate-900">
              Manage →
            </Link>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-y-3 gap-x-4 text-xs">
            <div>
              <div className="text-slate-500">Revenue</div>
              <div className="text-base font-bold font-mono-tabular text-slate-900 mt-0.5">
                {formatINR(turfRevenue)}
              </div>
            </div>
            <div>
              <div className="text-slate-500">Total Bookings</div>
              <div className="text-base font-bold font-mono-tabular text-slate-900 mt-0.5">
                {filteredTurf.length}
              </div>
            </div>
            <div>
              <div className="text-slate-500">Available Slots (Today)</div>
              <div className="text-sm font-semibold font-mono-tabular text-emerald-700 mt-0.5">
                {availableSlotsToday} / {TURF_SLOTS.length}
              </div>
            </div>
            <div>
              <div className="text-slate-500">Occupied / Blocked</div>
              <div className="text-sm font-semibold font-mono-tabular text-slate-800 mt-0.5">
                {occupiedSlotsToday}
              </div>
            </div>
          </div>
        </div>

        {/* Resort Performance */}
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700">
              <BedDouble className="w-4 h-4" /> Resort Performance
            </span>
            <Link to="/admin/resort" className="text-xs font-medium text-slate-500 hover:text-slate-900">
              Manage →
            </Link>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-y-3 gap-x-3 text-xs">
            <div>
              <div className="text-slate-500">Revenue</div>
              <div className="text-base font-bold font-mono-tabular text-slate-900 mt-0.5">
                {formatINR(resortRevenue)}
              </div>
            </div>
            <div>
              <div className="text-slate-500">Bookings</div>
              <div className="text-base font-bold font-mono-tabular text-slate-900 mt-0.5">
                {filteredResort.length}
              </div>
            </div>
            <div>
              <div className="text-slate-500">Occupied</div>
              <div className="text-base font-bold font-mono-tabular text-blue-700 mt-0.5">
                {occupiedRoomsNow}/20
              </div>
            </div>
            <div>
              <div className="text-slate-500">Available Now</div>
              <div className="text-sm font-semibold font-mono-tabular text-emerald-700 mt-0.5">
                {availableRoomsNow} rooms
              </div>
            </div>
            <div>
              <div className="text-slate-500">Today Check-ins</div>
              <div className="text-sm font-semibold font-mono-tabular text-slate-800 mt-0.5">
                {todaysCheckIns}
              </div>
            </div>
            <div>
              <div className="text-slate-500">Today Check-outs</div>
              <div className="text-sm font-semibold font-mono-tabular text-slate-800 mt-0.5">
                {todaysCheckOuts}
              </div>
            </div>
          </div>
        </div>

        {/* Restaurant Performance */}
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="inline-flex items-center gap-2 text-sm font-bold text-orange-700">
              <UtensilsCrossed className="w-4 h-4" /> Restaurant Performance
            </span>
            <Link to="/admin/restaurant" className="text-xs font-medium text-slate-500 hover:text-slate-900">
              Manage →
            </Link>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-y-3 gap-x-3 text-xs">
            <div>
              <div className="text-slate-500">Revenue</div>
              <div className="text-base font-bold font-mono-tabular text-slate-900 mt-0.5">
                {formatINR(foodRevenue)}
              </div>
            </div>
            <div>
              <div className="text-slate-500">Food Orders</div>
              <div className="text-base font-bold font-mono-tabular text-slate-900 mt-0.5">
                {filteredFood.length}
              </div>
            </div>
            <div>
              <div className="text-slate-500">Table Res.</div>
              <div className="text-base font-bold font-mono-tabular text-slate-900 mt-0.5">
                {filteredTables.length}
              </div>
            </div>
            <div>
              <div className="text-slate-500">Preparing</div>
              <div className="text-sm font-semibold font-mono-tabular text-amber-700 mt-0.5">
                {preparingOrders} orders
              </div>
            </div>
            <div>
              <div className="text-slate-500">Ready</div>
              <div className="text-sm font-semibold font-mono-tabular text-emerald-700 mt-0.5">
                {readyOrders} orders
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Overall Daily Revenue (Last 7 Days)</h2>
              <p className="text-xs text-slate-500">Combined across Turf, Resort &amp; Restaurant</p>
            </div>
          </div>
          <SimpleBarChart
            data={last7DaysSeries.map((d) => ({ label: d.label, value: d.revenue }))}
            height={190}
          />
        </div>

        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Service-wise Revenue Comparison</h2>
            <p className="text-xs text-slate-500 mb-5">Selected range revenue contribution</p>
            <ServiceSplitBar
              items={[
                {
                  label: 'Resort Rooms & Villas',
                  amount: resortRevenue,
                  color: '#15803D',
                  countLabel: `${filteredResort.length} stays`,
                },
                {
                  label: 'Turf Ground Slots',
                  amount: turfRevenue,
                  color: '#2563EB',
                  countLabel: `${filteredTurf.length} slots`,
                },
                {
                  label: 'Restaurant Orders',
                  amount: foodRevenue,
                  color: '#EA580C',
                  countLabel: `${filteredFood.length} orders`,
                },
              ]}
            />
          </div>
        </div>

        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-5">
          <h2 className="text-sm font-bold text-slate-900 mb-1">7-Day Booking Volume Trend</h2>
          <p className="text-xs text-slate-500 mb-3">Combined daily booking &amp; order count</p>
          <TrendSparkLine
            data={last7DaysSeries.map((d) => ({ label: d.label, value: d.count }))}
            strokeColor="#2563EB"
            height={130}
          />
        </div>

        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-5">
          <h2 className="text-sm font-bold text-slate-900 mb-1">4-Week Performance Rolling Revenue</h2>
          <p className="text-xs text-slate-500 mb-3">Weekly revenue momentum across all services</p>
          <SimpleBarChart data={weeklyMonthlySeries} height={155} defaultColor="#15803D" />
        </div>
      </div>

      {/* Recent Unified Activity: Mobile Stacked Cards + Desktop Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">Recent Activity Across All Services</h2>
          <Link
            to="/admin/bookings"
            className="text-xs font-semibold text-[#0B1628] hover:underline whitespace-nowrap"
          >
            View All Bookings →
          </Link>
        </div>

        <div className="md:hidden divide-y divide-slate-100">
          {recentActivity.map((row) => (
            <div key={row.id} className="p-4 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono-tabular font-bold text-slate-900">{row.id}</span>
                <StatusLabel status={row.status} />
              </div>
              <div className="flex items-center justify-between text-slate-700">
                <span className="font-medium">{row.customer}</span>
                <ServiceTag service={row.service} />
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="font-mono-tabular text-slate-500">{formatDateShort(row.date)}</span>
                <span className="font-mono-tabular font-bold text-slate-900">
                  {row.amount > 0 ? formatINR(row.amount) : '—'}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase">
                <th className="py-3 px-4">Booking ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Service</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {recentActivity.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/70">
                  <td className="py-3 px-4 font-mono-tabular font-semibold text-slate-900">
                    {row.id}
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-800">{row.customer}</td>
                  <td className="py-3 px-4">
                    <ServiceTag service={row.service} />
                  </td>
                  <td className="py-3 px-4 font-mono-tabular text-slate-600">
                    {formatDateShort(row.date)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono-tabular font-semibold">
                    {row.amount > 0 ? formatINR(row.amount) : '—'}
                  </td>
                  <td className="py-3 px-4">
                    <StatusLabel status={row.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
