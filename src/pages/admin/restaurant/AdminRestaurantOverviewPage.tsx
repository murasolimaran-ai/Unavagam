import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, ClipboardList, UtensilsCrossed } from 'lucide-react';
import { usePlatform } from '../../../context/PlatformContext';
import { SimpleBarChart } from '../../../components/common/Charts';
import { StatusLabel } from '../../../components/common/StatusLabel';
import { addDays, formatDateTimeIST, formatINR, getTodayIST } from '../../../utils/format';

export const AdminRestaurantOverviewPage: React.FC = () => {
  const { foodOrders, tableReservations, foodItems } = usePlatform();
  const today = getTodayIST();

  const todaysOrders = foodOrders.filter(
    (o) => o.createdAt.slice(0, 10) === today && o.orderStatus !== 'Cancelled'
  );
  const todaysRevenue = todaysOrders.reduce((s, o) => s + o.totalAmount, 0);
  const newCount = foodOrders.filter((o) => o.orderStatus === 'New').length;
  const preparingCount = foodOrders.filter((o) => o.orderStatus === 'Preparing').length;
  const readyCount = foodOrders.filter((o) => o.orderStatus === 'Ready').length;
  const todaysTableRes = tableReservations.filter(
    (r) => r.date === today && r.status !== 'Cancelled'
  ).length;

  const popularDishes = useMemo(() => {
    const counts: Record<string, { name: string; qty: number; rev: number }> = {};
    foodOrders
      .filter((o) => o.orderStatus !== 'Cancelled')
      .forEach((o) => {
        o.items.forEach((it) => {
          if (!counts[it.foodItemId]) {
            counts[it.foodItemId] = { name: it.name, qty: 0, rev: 0 };
          }
          counts[it.foodItemId].qty += it.quantity;
          counts[it.foodItemId].rev += it.price * it.quantity;
        });
      });
    return Object.values(counts)
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);
  }, [foodOrders]);

  const last7Days = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = addDays(today, i - 6);
      const rev = foodOrders
        .filter((o) => o.createdAt.slice(0, 10) === d && o.orderStatus !== 'Cancelled')
        .reduce((s, o) => s + o.totalAmount, 0);
      return { label: d.slice(5), value: rev };
    });
  }, [today, foodOrders]);

  const liveOrders = foodOrders.filter(
    (o) => !['Completed', 'Cancelled'].includes(o.orderStatus)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-orange-700 inline-flex items-center gap-1.5">
            <UtensilsCrossed className="w-3.5 h-3.5" /> Restaurant &amp; Kitchen
          </p>
          <h1 className="type-h1 text-[#0B1628]">
            Restaurant Overview
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {foodItems.length} menu dishes · Live order fulfilment &amp; table reservations
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/admin/restaurant/kitchen"
            className="min-h-[40px] inline-flex items-center gap-1.5 px-4 py-2 bg-[#0B1628] text-white text-xs font-semibold rounded-xl hover:bg-[#172D4D] transition-colors"
          >
            <ChefHat className="w-3.5 h-3.5" />
            <span>Open Kitchen Display (KDS)</span>
          </Link>
          <Link
            to="/admin/restaurant/orders"
            className="min-h-[40px] inline-flex items-center gap-1.5 px-4 py-2 border border-slate-200 bg-white text-slate-700 text-xs font-medium rounded-xl hover:bg-slate-50 transition-colors"
          >
            <ClipboardList className="w-3.5 h-3.5" />
            <span>All Orders</span>
          </Link>
        </div>
      </div>

      {/* 6 KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5">
          <div className="text-xs text-slate-500">Today&apos;s Orders</div>
          <div className="type-h2 font-mono-tabular text-[#0B1628] mt-1">
            {todaysOrders.length}
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5">
          <div className="text-xs text-slate-500">Today&apos;s Revenue</div>
          <div className="type-h3 font-mono-tabular text-orange-700 mt-1">
            {formatINR(todaysRevenue)}
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5">
          <div className="text-xs text-slate-500">New Orders</div>
          <div className="type-h2 font-mono-tabular text-amber-700 mt-1">
            {newCount}
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5">
          <div className="text-xs text-slate-500">Preparing</div>
          <div className="type-h2 font-mono-tabular text-[#0B1628] mt-1">
            {preparingCount}
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5">
          <div className="text-xs text-slate-500">Ready</div>
          <div className="type-h2 font-mono-tabular text-emerald-700 mt-1">
            {readyCount}
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5">
          <div className="text-xs text-slate-500">Today Table Res.</div>
          <div className="type-h2 font-mono-tabular text-[#0B1628] mt-1">
            {todaysTableRes}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5">
          <h2 className="text-sm font-bold text-slate-900">7-Day Restaurant Sales Trend</h2>
          <p className="text-xs text-slate-500 mb-3">Dine-in, Takeaway &amp; Delivery revenue</p>
          <SimpleBarChart data={last7Days} height={190} defaultColor="#EA580C" />
        </div>

        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5">
          <h2 className="text-sm font-bold text-slate-900 mb-3">Top Popular Dishes</h2>
          <div className="divide-y divide-slate-100 text-xs">
            {popularDishes.map((d) => (
              <div key={d.name} className="py-2.5 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-900">{d.name}</div>
                  <div className="text-[11px] text-slate-500 font-mono-tabular">
                    {d.qty} portions sold
                  </div>
                </div>
                <span className="font-mono-tabular font-bold text-slate-900">
                  {formatINR(d.rev)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Orders Queue */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">
            Active Kitchen Queue ({liveOrders.length})
          </h2>
          <Link to="/admin/restaurant/orders" className="text-xs font-semibold text-orange-700">
            Manage All Orders →
          </Link>
        </div>
        <div className="divide-y divide-slate-100 text-xs">
          {liveOrders.length === 0 ? (
            <p className="p-6 text-center text-slate-500">All orders are currently completed.</p>
          ) : (
            liveOrders.map((o) => (
              <div key={o.id} className="px-5 py-3 flex items-center justify-between gap-4">
                <div>
                  <span className="font-mono-tabular font-bold text-slate-900">{o.id}</span> ·{' '}
                  <span className="font-medium">{o.customerName}</span> ·{' '}
                  <span className="text-slate-500">
                    {o.fulfilmentType} ({o.items.reduce((s, i) => s + i.quantity, 0)} items)
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-slate-500 font-mono-tabular hidden sm:inline">
                    {formatDateTimeIST(o.createdAt)}
                  </span>
                  <span className="font-mono-tabular font-semibold">{formatINR(o.totalAmount)}</span>
                  <StatusLabel status={o.orderStatus} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
