import React, { useMemo, useState } from 'react';
import { Eye, Search } from 'lucide-react';
import { usePlatform } from '../../../context/PlatformContext';
import { StatusLabel } from '../../../components/common/StatusLabel';
import { Modal } from '../../../components/common/Modal';
import { ResortBooking, ResortBookingStatus } from '../../../types';
import { formatDateShort, formatINR } from '../../../utils/format';

export const AdminResortBookingsPage: React.FC = () => {
  const {
    resortBookings,
    resortRooms,
    updateResortBookingStatus,
    assignResortRooms,
  } = usePlatform();

  const [statusFilter, setStatusFilter] = useState<'All' | ResortBookingStatus>('All');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<ResortBooking | null>(null);
  const [assignInput, setAssignInput] = useState('');

  const filtered = useMemo(() => {
    return resortBookings
      .filter((b) => {
        if (statusFilter !== 'All' && b.bookingStatus !== statusFilter) return false;
        if (search.trim()) {
          const q = search.toLowerCase();
          return (
            b.id.toLowerCase().includes(q) ||
            b.customerName.toLowerCase().includes(q) ||
            b.categoryName.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [resortBookings, statusFilter, search]);

  const openManage = (b: ResortBooking) => {
    setSelected(b);
    setAssignInput(b.assignedRoomNumbers.join(', '));
  };

  const handleSaveRoomAssign = () => {
    if (!selected) return;
    const nums = assignInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    assignResortRooms(selected.id, nums);
    setSelected({ ...selected, assignedRoomNumbers: nums });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="type-h1 text-[#0B1628]">Room Bookings</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Assign room numbers, confirm stays, check-in, check-out, or cancel reservations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ID, guest, category..."
              className="w-full sm:w-56 min-h-[40px] pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none focus:border-[#0B1628]"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'All' | ResortBookingStatus)}
            className="min-h-[40px] px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none focus:border-[#0B1628]"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Checked-in">Checked-in</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Mobile stacked room booking cards */}
      <div className="md:hidden space-y-3">
        {filtered.map((b) => (
          <div key={b.id} className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-xs font-mono-tabular font-bold text-[#0B1628]">{b.id}</div>
                <div className="text-sm font-semibold text-slate-900 mt-0.5">{b.customerName}</div>
                <div className="text-xs text-slate-600">{b.roomCount}× {b.categoryName}</div>
              </div>
              <StatusLabel status={b.bookingStatus} />
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
              <div>
                <span className="text-[11px] text-slate-400 block">Stay Dates &amp; Room</span>
                <span className="font-mono-tabular text-slate-800">
                  {formatDateShort(b.checkIn)} → {formatDateShort(b.checkOut)}
                </span>
                <div className="font-mono-tabular text-[11px] font-semibold text-emerald-700">
                  Room {b.assignedRoomNumbers.join(', ') || 'Unassigned'}
                </div>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-400 block">Amount</span>
                <span className="font-mono-tabular font-bold text-slate-900">{formatINR(b.totalAmount)}</span>
                <div className="mt-0.5"><StatusLabel status={b.paymentStatus} /></div>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => openManage(b)}
                className="w-full min-h-[40px] inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-[#0B1628] text-white rounded-xl text-xs font-semibold hover:bg-[#172D4D] transition-colors"
              >
                <Eye className="w-3.5 h-3.5" /> Manage Booking &amp; Room
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden md:block bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase">
                <th className="py-3 px-4">Booking ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Room No.</th>
                <th className="py-3 px-4">Check-in</th>
                <th className="py-3 px-4">Check-out</th>
                <th className="py-3 px-4">Guests</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/70">
                  <td className="py-3 px-4 font-mono-tabular font-semibold text-slate-900">
                    {b.id}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-slate-900">{b.customerName}</div>
                    <div className="text-[11px] text-slate-500 font-mono-tabular">
                      {b.customerPhone}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {b.roomCount}× {b.categoryName}
                  </td>
                  <td className="py-3 px-4 font-mono-tabular font-semibold text-emerald-700">
                    {b.assignedRoomNumbers.join(', ') || 'Unassigned'}
                  </td>
                  <td className="py-3 px-4 font-mono-tabular whitespace-nowrap">
                    {formatDateShort(b.checkIn)}
                  </td>
                  <td className="py-3 px-4 font-mono-tabular whitespace-nowrap">
                    {formatDateShort(b.checkOut)}
                  </td>
                  <td className="py-3 px-4 font-mono-tabular">
                    {b.adults}A, {b.children}C
                  </td>
                  <td className="py-3 px-4 text-right font-mono-tabular font-semibold">
                    {formatINR(b.totalAmount)}
                  </td>
                  <td className="py-3 px-4">
                    <StatusLabel status={b.paymentStatus} />
                  </td>
                  <td className="py-3 px-4">
                    <StatusLabel status={b.bookingStatus} />
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => openManage(b)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 border border-slate-200 rounded text-slate-700 hover:bg-slate-100"
                    >
                      <Eye className="w-3.5 h-3.5" /> Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={selected ? `Room Booking · ${selected.id}` : ''}
        subtitle={selected ? `${selected.customerName} · ${selected.categoryName}` : ''}
      >
        {selected && (
          <div className="space-y-5 text-xs">
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Stay</span>
                <span className="font-mono-tabular font-medium">
                  {formatDateShort(selected.checkIn)} → {formatDateShort(selected.checkOut)} (
                  {selected.nights}N)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Guests</span>
                <span>
                  {selected.adults} Adults, {selected.children} Children · {selected.extraBeds} Extra
                  Beds
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Amount</span>
                <span className="font-mono-tabular font-bold">{formatINR(selected.totalAmount)}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Assign Room Number(s)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={assignInput}
                  onChange={(e) => setAssignInput(e.target.value)}
                  placeholder="e.g. 203"
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono-tabular"
                />
                <button
                  type="button"
                  onClick={handleSaveRoomAssign}
                  className="px-3.5 py-2 bg-slate-900 text-white rounded-lg font-semibold"
                >
                  Assign
                </button>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Category units:{' '}
                {resortRooms
                  .filter((r) => r.categoryId === selected.categoryId)
                  .map((r) => `${r.roomNumber} (${r.status})`)
                  .join(', ')}
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Booking Status Workflow
              </label>
              <div className="flex flex-wrap gap-2">
                {(['Pending', 'Confirmed', 'Checked-in', 'Completed', 'Cancelled'] as ResortBookingStatus[]).map(
                  (st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => {
                        updateResortBookingStatus(selected.id, st);
                        setSelected({ ...selected, bookingStatus: st });
                      }}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-semibold ${
                        selected.bookingStatus === st
                          ? 'bg-emerald-700 text-white border-emerald-700'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {st === 'Completed' ? 'Check-out / Complete' : st}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
