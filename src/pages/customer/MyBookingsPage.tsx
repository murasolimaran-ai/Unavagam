import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, XCircle } from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { ServiceTag, StatusLabel } from '../../components/common/StatusLabel';
import { Modal } from '../../components/common/Modal';
import { ServiceType } from '../../types';
import { formatDateShort, formatDateTimeIST, formatINR } from '../../utils/format';

interface UnifiedCustomerRecord {
  id: string;
  service: ServiceType;
  type: 'Slot Booking' | 'Room Booking' | 'Food Order' | 'Table Reservation';
  title: string;
  dateLabel: string;
  amount: number;
  paymentStatus: string;
  status: string;
  canCancel: boolean;
  details: Record<string, string>;
}

export const MyBookingsPage: React.FC = () => {
  const {
    currentCustomer,
    turfBookings,
    resortBookings,
    foodOrders,
    tableReservations,
    updateTurfBookingStatus,
    updateResortBookingStatus,
    updateFoodOrderStatus,
    updateTableReservationStatus,
  } = usePlatform();

  const [serviceFilter, setServiceFilter] = useState<'All' | ServiceType>('All');
  const [selectedRecord, setSelectedRecord] = useState<UnifiedCustomerRecord | null>(null);

  const records = useMemo<UnifiedCustomerRecord[]>(() => {
    const cid = currentCustomer?.id;
    const matchCustomer = (id: string) => (!cid ? true : id === cid);

    const list: UnifiedCustomerRecord[] = [];

    turfBookings
      .filter((b) => matchCustomer(b.customerId))
      .forEach((b) => {
        list.push({
          id: b.id,
          service: 'Turf',
          type: 'Slot Booking',
          title: `Turf Ground · ${b.slots.join(', ')}`,
          dateLabel: formatDateShort(b.date),
          amount: b.totalAmount,
          paymentStatus: b.paymentStatus,
          status: b.bookingStatus,
          canCancel: b.bookingStatus === 'Pending' || b.bookingStatus === 'Confirmed',
          details: {
            Customer: `${b.customerName} (${b.customerPhone})`,
            Date: formatDateShort(b.date),
            Slots: b.slots.join(' & '),
            Duration: `${b.durationHours} hr(s)`,
            Team: b.teamName || '—',
            Payment: `${b.paymentMethod} (${b.paymentStatus})`,
          },
        });
      });

    resortBookings
      .filter((b) => matchCustomer(b.customerId))
      .forEach((b) => {
        list.push({
          id: b.id,
          service: 'Resort',
          type: 'Room Booking',
          title: `${b.roomCount} × ${b.categoryName} (${b.nights}N)`,
          dateLabel: `${formatDateShort(b.checkIn)} → ${formatDateShort(b.checkOut)}`,
          amount: b.totalAmount,
          paymentStatus: b.paymentStatus,
          status: b.bookingStatus,
          canCancel: b.bookingStatus === 'Pending' || b.bookingStatus === 'Confirmed',
          details: {
            Guest: `${b.customerName} (${b.adults} Adults, ${b.children} Children)`,
            Rooms: `Room ${b.assignedRoomNumbers.join(', ')}`,
            'Check-in': formatDateShort(b.checkIn),
            'Check-out': formatDateShort(b.checkOut),
            Payment: `${b.paymentMethod} (${b.paymentStatus})`,
          },
        });
      });

    foodOrders
      .filter((o) => matchCustomer(o.customerId))
      .forEach((o) => {
        list.push({
          id: o.id,
          service: 'Restaurant',
          type: 'Food Order',
          title: `${o.fulfilmentType} · ${o.items.map((i) => `${i.quantity}× ${i.name}`).join(', ')}`,
          dateLabel: formatDateTimeIST(o.createdAt),
          amount: o.totalAmount,
          paymentStatus: o.paymentStatus,
          status: o.orderStatus,
          canCancel: o.orderStatus === 'New' || o.orderStatus === 'Accepted',
          details: {
            Customer: `${o.customerName} (${o.customerPhone})`,
            Fulfilment: o.fulfilmentType,
            Destination: o.tableNumber || o.pickupTime || o.deliveryAddress || '—',
            Items: o.items
              .map((i) => `${i.quantity}× ${i.name} (${formatINR(i.price * i.quantity)})`)
              .join('; '),
            Payment: `${o.paymentMethod} (${o.paymentStatus})`,
          },
        });
      });

    tableReservations
      .filter((r) => matchCustomer(r.customerId))
      .forEach((r) => {
        list.push({
          id: r.id,
          service: 'Restaurant',
          type: 'Table Reservation',
          title: `${r.tableNumber} · ${r.guests} Guests`,
          dateLabel: `${formatDateShort(r.date)} · ${r.timeSlot}`,
          amount: 0,
          paymentStatus: 'No Fee',
          status: r.status,
          canCancel: r.status === 'Pending' || r.status === 'Confirmed',
          details: {
            Guest: `${r.customerName} (${r.customerPhone})`,
            Table: r.tableNumber,
            'Date & Time': `${formatDateShort(r.date)} at ${r.timeSlot}`,
            Party: `${r.guests} Guests`,
            Occasion: r.occasion || '—',
          },
        });
      });

    return list.filter((r) => serviceFilter === 'All' || r.service === serviceFilter);
  }, [
    currentCustomer,
    turfBookings,
    resortBookings,
    foodOrders,
    tableReservations,
    serviceFilter,
  ]);

  const handleCancel = (rec: UnifiedCustomerRecord) => {
    if (rec.type === 'Slot Booking') updateTurfBookingStatus(rec.id, 'Cancelled');
    else if (rec.type === 'Room Booking') updateResortBookingStatus(rec.id, 'Cancelled');
    else if (rec.type === 'Food Order') updateFoodOrderStatus(rec.id, 'Cancelled');
    else if (rec.type === 'Table Reservation') updateTableReservationStatus(rec.id, 'Cancelled');
    setSelectedRecord(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-[#C89B54] uppercase tracking-wider">
            {currentCustomer ? `Signed in as ${currentCustomer.name}` : 'All Demo Bookings'}
          </p>
          <h1 className="type-h1 font-bold text-slate-900 mt-1">
            My Bookings &amp; Live Orders
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Turf slots, resort stays, food orders, and table reservations in one unified timeline.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-200/70 rounded-xl self-start">
          {(['All', 'Turf', 'Resort', 'Restaurant'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setServiceFilter(tab)}
              className={`min-h-[40px] px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                serviceFilter === tab
                  ? 'bg-[#0B1628] text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {records.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-10 sm:p-12 text-center">
          <p className="text-sm font-medium text-slate-700">No bookings found for this account.</p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link
              to="/turf/booking"
              className="inline-flex items-center justify-center min-h-[42px] px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl"
            >
              Book Turf Slot
            </Link>
            <Link
              to="/resort/booking"
              className="inline-flex items-center justify-center min-h-[42px] px-4 py-2 bg-emerald-700 text-white text-xs font-semibold rounded-xl"
            >
              Book Resort Room
            </Link>
            <Link
              to="/restaurant/menu"
              className="inline-flex items-center justify-center min-h-[42px] px-4 py-2 bg-orange-600 text-white text-xs font-semibold rounded-xl"
            >
              Order Food
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Mobile Stacked Card View (< md) */}
          <div className="md:hidden space-y-3">
            {records.map((rec) => (
              <div
                key={rec.id}
                className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-mono-tabular font-bold text-slate-900">{rec.id}</span>
                      <span aria-hidden="true" className="text-slate-300">
                        ·
                      </span>
                      <ServiceTag service={rec.service} />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{rec.type}</p>
                  </div>
                  <StatusLabel status={rec.status} />
                </div>

                <div className="text-sm font-semibold text-slate-900">{rec.title}</div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                  <span className="font-mono-tabular text-slate-600">{rec.dateLabel}</span>
                  <span className="font-mono-tabular font-bold text-slate-900">
                    {rec.amount > 0 ? formatINR(rec.amount) : 'No Fee'}
                  </span>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setSelectedRecord(rec)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 min-h-[42px] px-3 py-2 border border-slate-200 text-xs font-semibold text-slate-700 rounded-xl hover:bg-slate-50"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Details</span>
                  </button>
                  {rec.canCancel && (
                    <button
                      type="button"
                      onClick={() => handleCancel(rec)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 min-h-[42px] px-3 py-2 border border-rose-200 text-xs font-semibold text-rose-700 rounded-xl hover:bg-rose-50"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Cancel</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Tablet & Desktop Tabular Ledger (md+) */}
          <div className="hidden md:block bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="py-3.5 px-4">Booking ID</th>
                    <th className="py-3.5 px-4">Service</th>
                    <th className="py-3.5 px-4">Summary</th>
                    <th className="py-3.5 px-4">Date &amp; Time</th>
                    <th className="py-3.5 px-4 text-right">Amount</th>
                    <th className="py-3.5 px-4">Payment</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {records.map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-50/70">
                      <td className="py-3.5 px-4 font-mono-tabular text-xs font-semibold text-slate-900">
                        {rec.id}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col">
                          <ServiceTag service={rec.service} />
                          <span className="text-[11px] text-slate-500">{rec.type}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-800 max-w-xs truncate">
                        {rec.title}
                      </td>
                      <td className="py-3.5 px-4 text-xs font-mono-tabular text-slate-600 whitespace-nowrap">
                        {rec.dateLabel}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono-tabular text-xs font-semibold text-slate-900">
                        {rec.amount > 0 ? formatINR(rec.amount) : '—'}
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusLabel status={rec.paymentStatus} />
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusLabel status={rec.status} />
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setSelectedRecord(rec)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Details</span>
                        </button>
                        {rec.canCancel && (
                          <button
                            type="button"
                            onClick={() => handleCancel(rec)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-50 rounded-lg ml-1"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Cancel</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <Modal
        open={Boolean(selectedRecord)}
        onClose={() => setSelectedRecord(null)}
        title={selectedRecord ? `${selectedRecord.type} · ${selectedRecord.id}` : ''}
        subtitle={selectedRecord?.dateLabel}
      >
        {selectedRecord && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
              <ServiceTag service={selectedRecord.service} />
              <StatusLabel status={selectedRecord.status} />
            </div>
            <div className="divide-y divide-slate-100 text-sm">
              {Object.entries(selectedRecord.details).map(([k, v]) => (
                <div key={k} className="py-2.5 flex justify-between gap-4">
                  <span className="text-slate-500 text-xs">{k}</span>
                  <span className="text-slate-900 font-medium text-xs text-right">{v}</span>
                </div>
              ))}
              {selectedRecord.amount > 0 && (
                <div className="py-2.5 flex justify-between gap-4 font-bold">
                  <span className="text-slate-700 text-xs">Total Amount</span>
                  <span className="font-mono-tabular text-slate-900 text-sm">
                    {formatINR(selectedRecord.amount)}
                  </span>
                </div>
              )}
            </div>
            {selectedRecord.canCancel && (
              <div className="pt-3 border-t border-slate-200 flex justify-end">
                <button
                  type="button"
                  onClick={() => handleCancel(selectedRecord)}
                  className="min-h-[42px] px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl"
                >
                  Cancel This Booking
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};
