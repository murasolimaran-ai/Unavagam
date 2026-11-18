import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Lock, Plus, Unlock } from 'lucide-react';
import { usePlatform, TURF_SLOTS } from '../../../context/PlatformContext';
import { Modal } from '../../../components/common/Modal';
import { PaymentMethod, TurfBooking } from '../../../types';
import { addDays, formatDateShort, formatINR, getTodayIST } from '../../../utils/format';

export const AdminTurfCalendarPage: React.FC = () => {
  const {
    getTurfSlotStatus,
    getTurfSlotPrice,
    toggleBlockTurfSlot,
    createTurfBooking,
    updateTurfBookingStatus,
  } = usePlatform();

  const today = getTodayIST();
  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');
  const [selectedDate, setSelectedDate] = useState(today);

  const [viewBooking, setViewBooking] = useState<TurfBooking | null>(null);
  const [blockModal, setBlockModal] = useState<{ date: string; slot: string } | null>(null);
  const [blockReason, setBlockReason] = useState('Maintenance / Pitch brushing');

  const [manualModal, setManualModal] = useState<{ date: string; slot: string } | null>(null);
  const [manName, setManName] = useState('');
  const [manPhone, setManPhone] = useState('');
  const [manEmail, setManEmail] = useState('');
  const [manTeam, setManTeam] = useState('');
  const [manPay, setManPay] = useState<PaymentMethod>('Cash');
  const [manError, setManError] = useState('');

  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(selectedDate, i));

  const handleConfirmBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blockModal) return;
    toggleBlockTurfSlot(blockModal.date, blockModal.slot, blockReason);
    setBlockModal(null);
  };

  const handleCreateManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualModal) return;
    setManError('');
    if (!manName.trim() || !manPhone.trim()) {
      setManError('Customer name and phone are required.');
      return;
    }
    const res = createTurfBooking({
      customerName: manName,
      customerPhone: manPhone,
      customerEmail: manEmail || `${manName.toLowerCase().replace(/\s+/g, '.')}@walkin.in`,
      date: manualModal.date,
      slots: [manualModal.slot],
      teamName: manTeam,
      playersCount: 14,
      paymentMethod: manPay,
    });
    if (!res.ok) {
      setManError(res.error || 'Could not create manual booking.');
      return;
    }
    setManualModal(null);
    setManName('');
    setManPhone('');
    setManEmail('');
    setManTeam('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Interactive Turf Slot Calendar
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Block/unblock slots, inspect reservations, or add walk-in bookings on the single turf ground.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-lg">
            <button
              type="button"
              onClick={() => setViewMode('daily')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md ${
                viewMode === 'daily' ? 'bg-[#172D4D] text-white' : 'text-slate-600'
              }`}
            >
              Daily View
            </button>
            <button
              type="button"
              onClick={() => setViewMode('weekly')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md ${
                viewMode === 'weekly' ? 'bg-[#172D4D] text-white' : 'text-slate-600'
              }`}
            >
              Weekly Grid
            </button>
          </div>

          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg px-2 py-1">
            <button
              type="button"
              onClick={() => setSelectedDate(addDays(selectedDate, -1))}
              className="p-1 hover:bg-slate-100 rounded"
              aria-label="Previous day"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="text-xs font-mono-tabular font-medium px-1 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setSelectedDate(addDays(selectedDate, 1))}
              className="p-1 hover:bg-slate-100 rounded"
              aria-label="Next day"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'daily' ? (
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-4">
            <h2 className="text-base font-bold text-slate-900">
              {formatDateShort(selectedDate)} · 10 Daily Slots
            </h2>
            <div className="flex items-center gap-4 text-[11px] text-slate-500">
              <span>Available = Ready to book</span>
              <span className="text-blue-700 font-medium">Booked = Occupied</span>
              <span className="text-amber-700 font-medium">Blocked = Maintenance Hold</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {TURF_SLOTS.map((slot) => {
              const info = getTurfSlotStatus(selectedDate, slot);
              const price = getTurfSlotPrice(selectedDate, slot);

              return (
                <div
                  key={slot}
                  className={`p-4 rounded-xl border flex items-center justify-between gap-3 ${
                    info.status === 'Available'
                      ? 'border-slate-200 bg-white'
                      : info.status === 'Booked'
                      ? 'border-blue-200 bg-blue-50/40'
                      : 'border-amber-200 bg-amber-50/40'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold font-mono-tabular text-slate-900">
                      {slot}
                    </div>
                    <div className="text-xs text-slate-600 mt-1">
                      {info.status === 'Available' && (
                        <span className="text-emerald-700 font-medium">
                          Available · {formatINR(price)}
                        </span>
                      )}
                      {info.status === 'Booked' && info.booking && (
                        <span>
                          <strong className="text-blue-800">{info.booking.customerName}</strong> (
                          {info.booking.id}) · {info.booking.bookingStatus}
                        </span>
                      )}
                      {info.status === 'Blocked' && (
                        <span className="text-amber-800">
                          Blocked · {info.blockReason}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {info.status === 'Available' && (
                      <>
                        <button
                          type="button"
                          onClick={() => setManualModal({ date: selectedDate, slot })}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-blue-600 text-white text-[11px] font-semibold rounded-md hover:bg-blue-700"
                        >
                          <Plus className="w-3 h-3" /> Book
                        </button>
                        <button
                          type="button"
                          onClick={() => setBlockModal({ date: selectedDate, slot })}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-slate-200 text-slate-700 text-[11px] font-medium rounded-md hover:bg-slate-100"
                        >
                          <Lock className="w-3 h-3" /> Block
                        </button>
                      </>
                    )}
                    {info.status === 'Blocked' && (
                      <button
                        type="button"
                        onClick={() => toggleBlockTurfSlot(selectedDate, slot)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-amber-600 text-white text-[11px] font-semibold rounded-md hover:bg-amber-700"
                      >
                        <Unlock className="w-3 h-3" /> Unblock
                      </button>
                    )}
                    {info.status === 'Booked' && info.booking && (
                      <button
                        type="button"
                        onClick={() => setViewBooking(info.booking!)}
                        className="px-2.5 py-1.5 border border-blue-200 bg-white text-blue-700 text-[11px] font-semibold rounded-md hover:bg-blue-50"
                      >
                        View Booking
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Weekly Grid */
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-600">
                  <th className="py-3 px-3 min-w-[140px]">Time Slot</th>
                  {weekDates.map((d) => (
                    <th key={d} className="py-3 px-2 text-center font-mono-tabular min-w-[115px]">
                      {formatDateShort(d)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[11px]">
                {TURF_SLOTS.map((slot) => (
                  <tr key={slot}>
                    <td className="py-2.5 px-3 font-mono-tabular font-semibold text-slate-800 whitespace-nowrap">
                      {slot}
                    </td>
                    {weekDates.map((d) => {
                      const info = getTurfSlotStatus(d, slot);
                      return (
                        <td key={d} className="p-1.5 text-center">
                          {info.status === 'Available' && (
                            <button
                              type="button"
                              onClick={() => setManualModal({ date: d, slot })}
                              className="w-full py-1.5 px-2 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-medium truncate"
                              title="Click to create manual booking"
                            >
                              Open
                            </button>
                          )}
                          {info.status === 'Booked' && info.booking && (
                            <button
                              type="button"
                              onClick={() => setViewBooking(info.booking!)}
                              className="w-full py-1.5 px-2 rounded bg-blue-600 text-white font-medium truncate"
                              title={info.booking.customerName}
                            >
                              {info.booking.customerName.split(' ')[0]}
                            </button>
                          )}
                          {info.status === 'Blocked' && (
                            <button
                              type="button"
                              onClick={() => toggleBlockTurfSlot(d, slot)}
                              className="w-full py-1.5 px-2 rounded bg-amber-100 text-amber-800 font-medium truncate"
                              title="Click to unblock"
                            >
                              Blocked
                            </button>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Block Slot Modal */}
      <Modal
        open={Boolean(blockModal)}
        onClose={() => setBlockModal(null)}
        title="Block Turf Slot"
        subtitle={blockModal ? `${formatDateShort(blockModal.date)} · ${blockModal.slot}` : ''}
      >
        <form onSubmit={handleConfirmBlock} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Block Reason</label>
            <input
              type="text"
              value={blockReason}
              onChange={(e) => setBlockReason(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setBlockModal(null)}
              className="px-4 py-2 border border-slate-200 rounded-lg text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-600 text-white rounded-lg text-xs font-semibold"
            >
              Confirm Block
            </button>
          </div>
        </form>
      </Modal>

      {/* Manual Booking Modal */}
      <Modal
        open={Boolean(manualModal)}
        onClose={() => setManualModal(null)}
        title="Create Manual Turf Booking"
        subtitle={manualModal ? `${formatDateShort(manualModal.date)} · ${manualModal.slot}` : ''}
      >
        <form onSubmit={handleCreateManual} className="space-y-3.5">
          {manError && (
            <p className="text-xs text-rose-700 bg-rose-50 p-2.5 rounded-lg">{manError}</p>
          )}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Customer Name *</label>
            <input
              type="text"
              value={manName}
              onChange={(e) => setManName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Phone *</label>
            <input
              type="tel"
              value={manPhone}
              onChange={(e) => setManPhone(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Team Name</label>
              <input
                type="text"
                value={manTeam}
                onChange={(e) => setManTeam(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Payment</label>
              <select
                value={manPay}
                onChange={(e) => setManPay(e.target.value as PaymentMethod)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
              >
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
                <option value="Card">Card</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setManualModal(null)}
              className="px-4 py-2 border border-slate-200 rounded-lg text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold"
            >
              Create Booking
            </button>
          </div>
        </form>
      </Modal>

      {/* View Booking Modal */}
      <Modal
        open={Boolean(viewBooking)}
        onClose={() => setViewBooking(null)}
        title={viewBooking ? `Turf Booking · ${viewBooking.id}` : ''}
      >
        {viewBooking && (
          <div className="space-y-4 text-xs">
            <div className="space-y-2 p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="flex justify-between">
                <span className="text-slate-500">Customer</span>
                <span className="font-semibold">
                  {viewBooking.customerName} ({viewBooking.customerPhone})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date &amp; Slot</span>
                <span className="font-mono-tabular">
                  {formatDateShort(viewBooking.date)} · {viewBooking.slots.join(', ')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Amount</span>
                <span className="font-mono-tabular font-bold">
                  {formatINR(viewBooking.totalAmount)} ({viewBooking.paymentStatus})
                </span>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  updateTurfBookingStatus(viewBooking.id, 'Cancelled');
                  setViewBooking(null);
                }}
                className="px-3.5 py-2 border border-rose-200 text-rose-700 rounded-lg text-xs font-semibold hover:bg-rose-50"
              >
                Cancel Booking &amp; Release Slot
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
