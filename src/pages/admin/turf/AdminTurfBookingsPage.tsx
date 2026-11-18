import React, { useMemo, useState } from 'react';
import { Eye, Search } from 'lucide-react';
import { usePlatform } from '../../../context/PlatformContext';
import { StatusLabel } from '../../../components/common/StatusLabel';
import { Modal } from '../../../components/common/Modal';
import { GeneralBookingStatus, TurfBooking } from '../../../types';
import { formatDateShort, formatINR } from '../../../utils/format';

export const AdminTurfBookingsPage: React.FC = () => {
  const { turfBookings, updateTurfBookingStatus } = usePlatform();
  const [statusFilter, setStatusFilter] = useState<'All' | GeneralBookingStatus>('All');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<TurfBooking | null>(null);

  const filtered = useMemo(() => {
    return turfBookings
      .filter((b) => {
        if (statusFilter !== 'All' && b.bookingStatus !== statusFilter) return false;
        if (search.trim()) {
          const q = search.toLowerCase();
          return (
            b.id.toLowerCase().includes(q) ||
            b.customerName.toLowerCase().includes(q) ||
            b.customerPhone.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [turfBookings, statusFilter, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Turf Bookings</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Confirm, complete, or cancel slot bookings. Cancelled slots release automatically.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ID, name, phone..."
              className="pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs bg-white w-56"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'All' | GeneralBookingStatus)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase">
                <th className="py-3 px-4">Booking ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Time Slot(s)</th>
                <th className="py-3 px-4 text-center">Duration</th>
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
                  <td className="py-3 px-4 font-medium text-slate-900">
                    {b.customerName}
                    {b.teamName && (
                      <div className="text-[11px] text-slate-500">{b.teamName}</div>
                    )}
                  </td>
                  <td className="py-3 px-4 font-mono-tabular text-slate-600">{b.customerPhone}</td>
                  <td className="py-3 px-4 font-mono-tabular whitespace-nowrap">
                    {formatDateShort(b.date)}
                  </td>
                  <td className="py-3 px-4 font-mono-tabular text-blue-700">
                    {b.slots.join(', ')}
                  </td>
                  <td className="py-3 px-4 text-center font-mono-tabular">{b.durationHours}h</td>
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
                    <div className="inline-flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setSelected(b)}
                        className="px-2 py-1 text-slate-700 hover:bg-slate-100 rounded inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" /> View
                      </button>
                      {b.bookingStatus === 'Pending' && (
                        <button
                          type="button"
                          onClick={() => updateTurfBookingStatus(b.id, 'Confirmed')}
                          className="px-2 py-1 bg-emerald-700 text-white rounded text-[11px] font-semibold"
                        >
                          Confirm
                        </button>
                      )}
                      {b.bookingStatus === 'Confirmed' && (
                        <button
                          type="button"
                          onClick={() => updateTurfBookingStatus(b.id, 'Completed')}
                          className="px-2 py-1 bg-blue-600 text-white rounded text-[11px] font-semibold"
                        >
                          Complete
                        </button>
                      )}
                      {(b.bookingStatus === 'Pending' || b.bookingStatus === 'Confirmed') && (
                        <button
                          type="button"
                          onClick={() => updateTurfBookingStatus(b.id, 'Cancelled')}
                          className="px-2 py-1 border border-rose-200 text-rose-700 rounded text-[11px] font-medium hover:bg-rose-50"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
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
        title={selected ? `Turf Booking · ${selected.id}` : ''}
        subtitle={selected ? `${formatDateShort(selected.date)} · ${selected.slots.join(', ')}` : ''}
      >
        {selected && (
          <div className="space-y-4 text-xs">
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg p-3">
              <div className="py-2 flex justify-between">
                <span className="text-slate-500">Customer</span>
                <span className="font-semibold">{selected.customerName}</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-slate-500">Contact</span>
                <span className="font-mono-tabular">
                  {selected.customerPhone} · {selected.customerEmail}
                </span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-slate-500">Team / Players</span>
                <span>
                  {selected.teamName || '—'} ({selected.playersCount} players)
                </span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-slate-500">Total Amount</span>
                <span className="font-mono-tabular font-bold">{formatINR(selected.totalAmount)}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 justify-end">
              {(['Pending', 'Confirmed', 'Completed', 'Cancelled'] as GeneralBookingStatus[]).map(
                (st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => {
                      updateTurfBookingStatus(selected.id, st);
                      setSelected({ ...selected, bookingStatus: st });
                    }}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold ${
                      selected.bookingStatus === st
                        ? 'bg-[#172D4D] text-white border-[#172D4D]'
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                )
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
