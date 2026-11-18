import React from 'react';
import { Link } from 'react-router-dom';
import { BedDouble, Calendar, CalendarCheck } from 'lucide-react';
import { usePlatform } from '../../../context/PlatformContext';
import { StatusLabel } from '../../../components/common/StatusLabel';
import { formatDateShort, formatINR, getTodayIST } from '../../../utils/format';

export const AdminResortOverviewPage: React.FC = () => {
  const { roomCategories, resortRooms, resortBookings, updateResortBookingStatus } = usePlatform();
  const today = getTodayIST();

  const totalRooms = resortRooms.length;
  const occupied = resortRooms.filter((r) => r.status === 'Occupied').length;
  const available = resortRooms.filter((r) => r.status === 'Available').length;
  const todaysCheckIns = resortBookings.filter(
    (b) => b.checkIn === today && b.bookingStatus !== 'Cancelled'
  );
  const todaysCheckOuts = resortBookings.filter(
    (b) => b.checkOut === today && b.bookingStatus !== 'Cancelled'
  );
  const totalRevenue = resortBookings
    .filter((b) => b.bookingStatus !== 'Cancelled')
    .reduce((s, b) => s + b.totalAmount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-emerald-700 inline-flex items-center gap-1.5">
            <BedDouble className="w-3.5 h-3.5" /> Resort Operations
          </p>
          <h1 className="type-h1 text-[#0B1628]">Resort Overview</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {totalRooms} individual rooms across {roomCategories.length} room categories
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/admin/resort/check-in-out"
            className="min-h-[40px] inline-flex items-center gap-1.5 px-4 py-2 bg-[#0B1628] text-white text-xs font-semibold rounded-xl hover:bg-[#172D4D] transition-colors"
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Check-in / Out Desk</span>
          </Link>
          <Link
            to="/admin/resort/availability"
            className="min-h-[40px] inline-flex items-center gap-1.5 px-4 py-2 border border-slate-200 bg-white text-slate-700 text-xs font-medium rounded-xl hover:bg-slate-50 transition-colors"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Availability Calendar</span>
          </Link>
        </div>
      </div>

      {/* 6 KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5">
          <div className="text-xs text-slate-500">Total Rooms</div>
          <div className="type-h2 font-mono-tabular text-[#0B1628] mt-1">
            {totalRooms}
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5">
          <div className="text-xs text-slate-500">Occupied</div>
          <div className="type-h2 font-mono-tabular text-blue-700 mt-1">{occupied}</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5">
          <div className="text-xs text-slate-500">Available</div>
          <div className="type-h2 font-mono-tabular text-emerald-700 mt-1">
            {available}
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5">
          <div className="text-xs text-slate-500">Today&apos;s Check-ins</div>
          <div className="type-h2 font-mono-tabular text-[#0B1628] mt-1">
            {todaysCheckIns.length}
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5">
          <div className="text-xs text-slate-500">Today&apos;s Check-outs</div>
          <div className="type-h2 font-mono-tabular text-[#0B1628] mt-1">
            {todaysCheckOuts.length}
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5">
          <div className="text-xs text-slate-500">Total Revenue</div>
          <div className="type-h3 font-mono-tabular text-emerald-700 mt-1">
            {formatINR(totalRevenue)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Room Category Breakdown */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-5">
          <h2 className="text-sm font-bold text-slate-900 mb-3">
            Room Inventory by Category
          </h2>
          <div className="divide-y divide-slate-100 text-xs">
            {roomCategories.map((cat) => {
              const units = resortRooms.filter((r) => r.categoryId === cat.id);
              const occ = units.filter((r) => r.status === 'Occupied').length;
              const res = units.filter((r) => r.status === 'Reserved').length;
              const avail = units.filter((r) => r.status === 'Available').length;
              return (
                <div key={cat.id} className="py-3 flex items-center justify-between gap-3">
                  <div>
                    <div className="font-semibold text-slate-900">{cat.name}</div>
                    <div className="text-[11px] text-slate-500 font-mono-tabular">
                      {units.length} total · Weekday {formatINR(cat.weekdayPrice)}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 font-mono-tabular">
                    <span className="text-emerald-700 font-semibold">{avail} Avail</span>
                    <span className="text-blue-700">{occ} Occ</span>
                    <span className="text-amber-700">{res} Res</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Today's Arrivals */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-slate-900">
              Today&apos;s Arrivals ({formatDateShort(today)})
            </h2>
            <Link to="/admin/resort/check-in-out" className="text-xs font-semibold text-emerald-700">
              Full Desk →
            </Link>
          </div>
          {todaysCheckIns.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">No arrivals scheduled today.</p>
          ) : (
            <div className="divide-y divide-slate-100 text-xs">
              {todaysCheckIns.map((b) => (
                <div key={b.id} className="py-3 flex items-center justify-between gap-3">
                  <div>
                    <div className="font-semibold text-slate-900">
                      {b.customerName} <span className="font-mono-tabular text-slate-500">({b.id})</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {b.categoryName} · Room {b.assignedRoomNumbers.join(', ')} · {b.nights}N
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusLabel status={b.bookingStatus} />
                    {(b.bookingStatus === 'Confirmed' || b.bookingStatus === 'Pending') && (
                      <button
                        type="button"
                        onClick={() => updateResortBookingStatus(b.id, 'Checked-in')}
                        className="px-2.5 py-1 bg-emerald-700 text-white rounded text-[11px] font-semibold"
                      >
                        Check-in
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
