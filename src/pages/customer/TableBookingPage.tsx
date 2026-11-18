import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, CheckCircle2, Users } from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { TableReservation } from '../../types';
import { addDays, formatDateShort, getTodayIST, TABLE_TIME_SLOTS } from '../../utils/format';

export const TableBookingPage: React.FC = () => {
  const {
    restaurantTables,
    currentCustomer,
    isTableAvailableAt,
    createTableReservation,
  } = usePlatform();

  const today = getTodayIST();
  const [date, setDate] = useState(today);
  const [timeSlot, setTimeSlot] = useState<string>(TABLE_TIME_SLOTS[4]);
  const [guests, setGuests] = useState(4);
  const [selectedTableId, setSelectedTableId] = useState('');

  const [customerName, setCustomerName] = useState(currentCustomer?.name || '');
  const [customerPhone, setCustomerPhone] = useState(currentCustomer?.phone || '');
  const [customerEmail, setCustomerEmail] = useState(currentCustomer?.email || '');
  const [occasion, setOccasion] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmed, setConfirmed] = useState<TableReservation | null>(null);

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!selectedTableId) {
      setErrorMsg('Please select an available table.');
      return;
    }
    if (!customerName.trim() || !customerPhone.trim() || !customerEmail.trim()) {
      setErrorMsg('Please enter your contact details.');
      return;
    }
    const res = createTableReservation({
      customerName,
      customerPhone,
      customerEmail,
      date,
      timeSlot,
      guests,
      tableId: selectedTableId,
      occasion,
      specialRequests,
    });
    if (!res.ok || !res.reservation) {
      setErrorMsg(res.error || 'Could not reserve table.');
      return;
    }
    setConfirmed(res.reservation);
  };

  if (confirmed) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-3 text-emerald-700">
            <CheckCircle2 className="w-7 h-7 shrink-0" />
            <div>
              <h1 className="type-h1 text-[#0B1628]">Table Reservation Confirmed</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Reservation ID: <span className="font-mono-tabular font-semibold">{confirmed.id}</span>
              </p>
            </div>
          </div>
          <div className="mt-6 border-t border-b border-slate-200 py-4 space-y-2.5 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Table</span>
              <span className="font-semibold text-slate-900">{confirmed.tableNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Date &amp; Time</span>
              <span className="font-mono-tabular font-medium">
                {formatDateShort(confirmed.date)} · {confirmed.timeSlot}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Party Size</span>
              <span className="font-mono-tabular">{confirmed.guests} Guests</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Guest</span>
              <span>{confirmed.customerName} ({confirmed.customerPhone})</span>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/my-bookings"
              className="flex-1 min-h-[44px] inline-flex items-center justify-center px-4 py-2.5 bg-[#0B1628] text-white text-xs font-semibold rounded-xl hover:bg-[#172D4D] transition-colors"
            >
              View in My Bookings
            </Link>
            <Link
              to="/restaurant/menu"
              className="min-h-[44px] inline-flex items-center justify-center px-4 py-2.5 border border-slate-200 text-slate-700 text-xs font-medium rounded-xl hover:bg-slate-50 transition-colors"
            >
              Browse Food Menu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#C89B54]">Kaveri Courtyard Kitchen</p>
        <h1 className="type-h1 text-[#0B1628] mt-1">
          Reserve a Dining Table
        </h1>
        <p className="text-sm text-slate-600 mt-1.5">
          Independent table booking with conflict-free time slots. No food pre-order required.
        </p>
      </div>

      {errorMsg && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-800">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleConfirm} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Step 1: Date
              </label>
              <input
                type="date"
                min={today}
                max={addDays(today, 30)}
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  setSelectedTableId('');
                }}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Step 2: Time Slot
              </label>
              <select
                value={timeSlot}
                onChange={(e) => {
                  setTimeSlot(e.target.value);
                  setSelectedTableId('');
                }}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium bg-white"
              >
                {TABLE_TIME_SLOTS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Step 3: Guests
              </label>
              <select
                value={guests}
                onChange={(e) => {
                  setGuests(Number(e.target.value));
                  setSelectedTableId('');
                }}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium bg-white"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <option key={n} value={n}>
                    {n} Guest{n > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <h2 className="text-xs font-semibold text-slate-700 mb-3">
              Step 4 &amp; 5: Select Available Table ({formatDateShort(date)} at {timeSlot})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {restaurantTables.map((table) => {
                const slotFree = isTableAvailableAt(table.id, date, timeSlot);
                const fits = table.seats >= guests;
                const selectable = slotFree && fits;
                const isSelected = selectedTableId === table.id;

                return (
                  <button
                    key={table.id}
                    type="button"
                    disabled={!selectable}
                    onClick={() => setSelectedTableId(table.id)}
                    className={`p-4 rounded-xl border text-left transition-colors ${
                      isSelected
                        ? 'border-orange-600 bg-orange-50/50'
                        : !selectable
                        ? 'border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed'
                        : 'border-slate-200 hover:border-orange-500 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-900">{table.tableNumber}</span>
                      <span className="inline-flex items-center gap-1 text-xs font-mono-tabular">
                        <Users className="w-3.5 h-3.5" /> {table.seats} Seats
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">{table.zone}</div>
                    <div className="text-[11px] font-medium mt-2">
                      {table.status === 'Maintenance' ? (
                        <span className="text-rose-600">Maintenance</span>
                      ) : !slotFree ? (
                        <span className="text-amber-700">Already Reserved at {timeSlot}</span>
                      ) : !fits ? (
                        <span className="text-slate-400">Seats fewer than {guests} guests</span>
                      ) : (
                        <span className="text-emerald-700">Available</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4">
          <h2 className="text-base font-bold text-slate-900">Step 6: Guest Details</h2>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Full Name *</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full min-h-[44px] px-3 py-2 border border-slate-200 rounded-xl text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Mobile Number *</label>
            <input
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full min-h-[44px] px-3 py-2 border border-slate-200 rounded-xl text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Email *</label>
            <input
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="w-full min-h-[44px] px-3 py-2 border border-slate-200 rounded-xl text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Occasion (Optional)
            </label>
            <input
              type="text"
              value={occasion}
              onChange={(e) => setOccasion(e.target.value)}
              placeholder="Birthday, Team Lunch, Anniversary..."
              className="w-full min-h-[44px] px-3 py-2 border border-slate-200 rounded-xl text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Special Requests (Optional)
            </label>
            <textarea
              rows={2}
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full min-h-[48px] py-3 bg-[#0B1628] hover:bg-[#172D4D] text-white text-sm font-semibold rounded-xl transition-colors"
          >
            Confirm Table Reservation
          </button>
        </div>
      </form>
    </div>
  );
};
