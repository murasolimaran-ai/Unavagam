import React from 'react';
import { usePlatform } from '../../../context/PlatformContext';
import { StatusLabel } from '../../../components/common/StatusLabel';
import { formatDateShort, formatINR, getTodayIST } from '../../../utils/format';

export const AdminResortCheckInOutPage: React.FC = () => {
  const { resortBookings, updateResortBookingStatus } = usePlatform();
  const today = getTodayIST();

  const arrivals = resortBookings.filter(
    (b) => b.checkIn === today && (b.bookingStatus === 'Confirmed' || b.bookingStatus === 'Pending')
  );
  const staying = resortBookings.filter((b) => b.bookingStatus === 'Checked-in');
  const departures = resortBookings.filter(
    (b) => b.checkOut === today && b.bookingStatus === 'Checked-in'
  );

  const renderRows = (
    list: typeof resortBookings,
    actionLabel: string,
    onAction: (id: string) => void
  ) => {
    if (list.length === 0) {
      return <p className="text-xs text-slate-500 py-6 text-center">No guests in this queue.</p>;
    }
    return (
      <div className="divide-y divide-slate-100">
        {list.map((b) => (
          <div key={b.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-mono-tabular font-bold text-slate-900">{b.id}</span>
                <span className="font-semibold text-slate-900">{b.customerName}</span>
                <span className="font-mono-tabular text-slate-500">({b.customerPhone})</span>
              </div>
              <div className="text-slate-600">
                {b.roomCount}× {b.categoryName} · Room{' '}
                <strong className="font-mono-tabular text-emerald-700">
                  {b.assignedRoomNumbers.join(', ')}
                </strong>{' '}
                · {formatDateShort(b.checkIn)} → {formatDateShort(b.checkOut)} ({b.nights}N)
              </div>
              {b.specialRequests && (
                <div className="text-[11px] text-amber-800">Note: {b.specialRequests}</div>
              )}
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="text-right text-xs">
                <div className="font-mono-tabular font-semibold">{formatINR(b.totalAmount)}</div>
                <StatusLabel status={b.paymentStatus} />
              </div>
              <button
                type="button"
                onClick={() => onAction(b.id)}
                className="min-h-[40px] px-3.5 py-2 bg-[#0B1628] hover:bg-[#172D4D] text-white text-xs font-semibold rounded-xl transition-colors"
              >
                {actionLabel}
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="type-h1 text-[#0B1628]">
          Front Desk: Check-in / Check-out
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Today ({formatDateShort(today)}) · Updates automatically sync room occupancy statuses.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
            <h2 className="text-sm font-bold text-slate-900">Today&apos;s Arrivals</h2>
            <span className="text-xs font-mono-tabular font-semibold text-emerald-700">
              {arrivals.length} pending
            </span>
          </div>
          {renderRows(arrivals, 'Confirm & Check-in', (id) =>
            updateResortBookingStatus(id, 'Checked-in')
          )}
        </section>

        <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
            <h2 className="text-sm font-bold text-slate-900">Today&apos;s Departures</h2>
            <span className="text-xs font-mono-tabular font-semibold text-amber-700">
              {departures.length} due out
            </span>
          </div>
          {renderRows(departures, 'Complete Check-out', (id) =>
            updateResortBookingStatus(id, 'Completed')
          )}
        </section>

        <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
            <h2 className="text-sm font-bold text-slate-900">Currently Staying In-House</h2>
            <span className="text-xs font-mono-tabular font-semibold text-blue-700">
              {staying.length} active
            </span>
          </div>
          {renderRows(staying, 'Early Check-out', (id) =>
            updateResortBookingStatus(id, 'Completed')
          )}
        </section>
      </div>
    </div>
  );
};
