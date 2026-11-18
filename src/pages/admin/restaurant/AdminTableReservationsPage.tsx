import React, { useState } from 'react';
import { usePlatform } from '../../../context/PlatformContext';
import { StatusLabel } from '../../../components/common/StatusLabel';
import { TableReservationStatus } from '../../../types';
import { formatDateShort } from '../../../utils/format';

export const AdminTableReservationsPage: React.FC = () => {
  const { tableReservations, updateTableReservationStatus } = usePlatform();
  const [statusFilter, setStatusFilter] = useState<'All' | TableReservationStatus>('All');

  const filtered = tableReservations
    .filter((r) => statusFilter === 'All' || r.status === statusFilter)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="type-h1 text-[#0B1628]">Table Reservations</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Confirm, seat, complete, or cancel guest table bookings.
          </p>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as 'All' | TableReservationStatus)}
          className="min-h-[40px] px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white self-start focus:outline-none focus:border-[#0B1628]"
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Seated">Seated</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Mobile stacked reservation cards */}
      <div className="md:hidden space-y-3">
        {filtered.map((r) => (
          <div key={r.id} className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-xs font-mono-tabular font-bold text-[#0B1628]">{r.id}</div>
                <div className="text-sm font-semibold text-slate-900 mt-0.5">{r.customerName}</div>
                <div className="text-[11px] font-mono-tabular text-slate-500">{r.customerPhone}</div>
              </div>
              <StatusLabel status={r.status} />
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <div>
                <span className="font-mono-tabular text-slate-800">
                  {formatDateShort(r.date)} · {r.timeSlot}
                </span>
                <div className="text-[11px] text-slate-500">{r.guests} Guests</div>
              </div>
              <span className="font-semibold text-orange-700">{r.tableNumber}</span>
            </div>
            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
              {r.status === 'Pending' && (
                <button
                  type="button"
                  onClick={() => updateTableReservationStatus(r.id, 'Confirmed')}
                  className="min-h-[38px] px-3 py-1.5 bg-emerald-700 text-white rounded-xl text-xs font-semibold"
                >
                  Confirm
                </button>
              )}
              {r.status === 'Confirmed' && (
                <button
                  type="button"
                  onClick={() => updateTableReservationStatus(r.id, 'Seated')}
                  className="min-h-[38px] px-3 py-1.5 bg-orange-600 text-white rounded-xl text-xs font-semibold"
                >
                  Mark Seated
                </button>
              )}
              {r.status === 'Seated' && (
                <button
                  type="button"
                  onClick={() => updateTableReservationStatus(r.id, 'Completed')}
                  className="min-h-[38px] px-3 py-1.5 bg-[#0B1628] text-white rounded-xl text-xs font-semibold"
                >
                  Complete
                </button>
              )}
              {(r.status === 'Pending' || r.status === 'Confirmed') && (
                <button
                  type="button"
                  onClick={() => updateTableReservationStatus(r.id, 'Cancelled')}
                  className="min-h-[38px] px-3 py-1.5 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="hidden md:block bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase">
                <th className="py-3 px-4">Reservation ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-4 text-center">Guests</th>
                <th className="py-3 px-4">Table</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/70">
                  <td className="py-3 px-4 font-mono-tabular font-semibold text-slate-900">
                    {r.id}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-slate-900">{r.customerName}</div>
                    {r.occasion && (
                      <div className="text-[11px] text-slate-500">{r.occasion}</div>
                    )}
                  </td>
                  <td className="py-3 px-4 font-mono-tabular text-slate-600">{r.customerPhone}</td>
                  <td className="py-3 px-4 font-mono-tabular whitespace-nowrap">
                    {formatDateShort(r.date)}
                  </td>
                  <td className="py-3 px-4 font-mono-tabular">{r.timeSlot}</td>
                  <td className="py-3 px-4 text-center font-mono-tabular">{r.guests}</td>
                  <td className="py-3 px-4 font-semibold text-orange-700">{r.tableNumber}</td>
                  <td className="py-3 px-4">
                    <StatusLabel status={r.status} />
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5">
                      {r.status === 'Pending' && (
                        <button
                          type="button"
                          onClick={() => updateTableReservationStatus(r.id, 'Confirmed')}
                          className="px-2.5 py-1 bg-emerald-700 text-white rounded text-[11px] font-semibold"
                        >
                          Confirm
                        </button>
                      )}
                      {r.status === 'Confirmed' && (
                        <button
                          type="button"
                          onClick={() => updateTableReservationStatus(r.id, 'Seated')}
                          className="px-2.5 py-1 bg-orange-600 text-white rounded text-[11px] font-semibold"
                        >
                          Mark Seated
                        </button>
                      )}
                      {r.status === 'Seated' && (
                        <button
                          type="button"
                          onClick={() => updateTableReservationStatus(r.id, 'Completed')}
                          className="px-2.5 py-1 bg-[#172D4D] text-white rounded text-[11px] font-semibold"
                        >
                          Complete
                        </button>
                      )}
                      {(r.status === 'Pending' || r.status === 'Confirmed') && (
                        <button
                          type="button"
                          onClick={() => updateTableReservationStatus(r.id, 'Cancelled')}
                          className="px-2.5 py-1 border border-rose-200 text-rose-700 rounded text-[11px] font-medium"
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
    </div>
  );
};
