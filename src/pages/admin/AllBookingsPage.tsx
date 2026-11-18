import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Eye, Search } from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { ServiceTag, StatusLabel } from '../../components/common/StatusLabel';
import { Modal } from '../../components/common/Modal';
import {
  BookingType,
  FoodOrderStatus,
  GeneralBookingStatus,
  PaymentStatus,
  ResortBookingStatus,
  ServiceType,
  TableReservationStatus,
} from '../../types';
import { formatDateShort, formatINR } from '../../utils/format';

interface UnifiedAdminBooking {
  id: string;
  customerName: string;
  customerPhone: string;
  service: ServiceType;
  bookingType: BookingType;
  date: string;
  summary: string;
  amount: number;
  paymentStatus: PaymentStatus | 'No Fee';
  status: string;
  createdAt: string;
}

export const AllBookingsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const {
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
  const [typeFilter, setTypeFilter] = useState<'All' | BookingType>('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('All');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [selected, setSelected] = useState<UnifiedAdminBooking | null>(null);

  const allRecords = useMemo<UnifiedAdminBooking[]>(() => {
    const list: UnifiedAdminBooking[] = [
      ...turfBookings.map((b) => ({
        id: b.id,
        customerName: b.customerName,
        customerPhone: b.customerPhone,
        service: 'Turf' as const,
        bookingType: 'Slot Booking' as const,
        date: b.date,
        summary: `${b.slots.join(', ')} (${b.durationHours}h)`,
        amount: b.totalAmount,
        paymentStatus: b.paymentStatus,
        status: b.bookingStatus,
        createdAt: b.createdAt,
      })),
      ...resortBookings.map((b) => ({
        id: b.id,
        customerName: b.customerName,
        customerPhone: b.customerPhone,
        service: 'Resort' as const,
        bookingType: 'Room Booking' as const,
        date: b.checkIn,
        summary: `${b.roomCount}× ${b.categoryName} (${b.nights}N) · Rm ${b.assignedRoomNumbers.join(',')}`,
        amount: b.totalAmount,
        paymentStatus: b.paymentStatus,
        status: b.bookingStatus,
        createdAt: b.createdAt,
      })),
      ...foodOrders.map((o) => ({
        id: o.id,
        customerName: o.customerName,
        customerPhone: o.customerPhone,
        service: 'Restaurant' as const,
        bookingType: 'Food Order' as const,
        date: o.createdAt.slice(0, 10),
        summary: `${o.fulfilmentType} · ${o.items.length} item(s)`,
        amount: o.totalAmount,
        paymentStatus: o.paymentStatus,
        status: o.orderStatus,
        createdAt: o.createdAt,
      })),
      ...tableReservations.map((r) => ({
        id: r.id,
        customerName: r.customerName,
        customerPhone: r.customerPhone,
        service: 'Restaurant' as const,
        bookingType: 'Table Reservation' as const,
        date: r.date,
        summary: `${r.tableNumber} at ${r.timeSlot} (${r.guests} guests)`,
        amount: 0,
        paymentStatus: 'No Fee' as const,
        status: r.status,
        createdAt: r.createdAt,
      })),
    ];

    return list
      .filter((r) => {
        if (serviceFilter !== 'All' && r.service !== serviceFilter) return false;
        if (typeFilter !== 'All' && r.bookingType !== typeFilter) return false;
        if (statusFilter !== 'All' && r.status !== statusFilter) return false;
        if (paymentFilter !== 'All' && r.paymentStatus !== paymentFilter) return false;
        if (dateFrom && r.date < dateFrom) return false;
        if (dateTo && r.date > dateTo) return false;
        if (search.trim()) {
          const q = search.trim().toLowerCase();
          if (
            !r.id.toLowerCase().includes(q) &&
            !r.customerName.toLowerCase().includes(q) &&
            !r.customerPhone.toLowerCase().includes(q)
          ) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [
    turfBookings,
    resortBookings,
    foodOrders,
    tableReservations,
    serviceFilter,
    typeFilter,
    statusFilter,
    paymentFilter,
    dateFrom,
    dateTo,
    search,
  ]);

  const handleStatusChange = (rec: UnifiedAdminBooking, newStatus: string) => {
    if (rec.bookingType === 'Slot Booking') {
      updateTurfBookingStatus(rec.id, newStatus as GeneralBookingStatus);
    } else if (rec.bookingType === 'Room Booking') {
      updateResortBookingStatus(rec.id, newStatus as ResortBookingStatus);
    } else if (rec.bookingType === 'Food Order') {
      updateFoodOrderStatus(rec.id, newStatus as FoodOrderStatus);
    } else {
      updateTableReservationStatus(rec.id, newStatus as TableReservationStatus);
    }
    setSelected((prev) => (prev ? { ...prev, status: newStatus } : null));
  };

  const getStatusOptions = (type: BookingType): string[] => {
    if (type === 'Slot Booking') return ['Pending', 'Confirmed', 'Completed', 'Cancelled'];
    if (type === 'Room Booking')
      return ['Pending', 'Confirmed', 'Checked-in', 'Completed', 'Cancelled'];
    if (type === 'Food Order')
      return ['New', 'Accepted', 'Preparing', 'Ready', 'Out for Delivery', 'Completed', 'Cancelled'];
    return ['Pending', 'Confirmed', 'Seated', 'Completed', 'Cancelled'];
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="type-h1 font-bold text-slate-900">
          All Bookings &amp; Orders
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Single searchable ledger combining Turf Slots, Resort Stays, Food Orders, and Table Reservations.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Booking ID, customer name, or phone..."
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs"
            />
          </div>

          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value as 'All' | ServiceType)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white"
          >
            <option value="All">Service: All</option>
            <option value="Turf">Turf</option>
            <option value="Resort">Resort</option>
            <option value="Restaurant">Restaurant</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as 'All' | BookingType)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white"
          >
            <option value="All">Type: All</option>
            <option value="Slot Booking">Slot Booking</option>
            <option value="Room Booking">Room Booking</option>
            <option value="Food Order">Food Order</option>
            <option value="Table Reservation">Table Reservation</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white"
          >
            <option value="All">Status: All</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Preparing">Preparing</option>
            <option value="Checked-in">Checked-in</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white"
          >
            <option value="All">Payment: All</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
            <option value="Refunded">Refunded</option>
          </select>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Date range:</span>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="px-2 py-1 border border-slate-200 rounded text-xs"
            />
            <span className="text-slate-400">to</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="px-2 py-1 border border-slate-200 rounded text-xs"
            />
          </div>
          <span className="text-slate-500 font-mono-tabular">
            Showing {allRecords.length} record(s)
          </span>
        </div>
      </div>

      {/* Mobile Card Stack (< md) */}
      <div className="md:hidden space-y-3">
        {allRecords.map((rec) => (
          <div key={rec.id} className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2.5 text-xs">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono-tabular font-bold text-slate-900">{rec.id}</span>
                  <ServiceTag service={rec.service} />
                </div>
                <div className="font-semibold text-slate-900 mt-1">{rec.customerName}</div>
                <div className="text-[11px] font-mono-tabular text-slate-500">{rec.customerPhone}</div>
              </div>
              <StatusLabel status={rec.status} />
            </div>

            <div className="text-slate-700">{rec.summary}</div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="font-mono-tabular text-slate-500">{formatDateShort(rec.date)}</span>
              <span className="font-mono-tabular font-bold text-slate-900">
                {rec.amount > 0 ? formatINR(rec.amount) : 'No Fee'}
              </span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <StatusLabel status={rec.paymentStatus} />
              <button
                type="button"
                onClick={() => setSelected(rec)}
                className="inline-flex items-center gap-1.5 min-h-[38px] px-3 py-1.5 border border-slate-200 rounded-xl font-semibold text-slate-700 hover:bg-slate-50"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Manage</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Tablet & Desktop Table (md+) */}
      <div className="hidden md:block bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase">
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Service / Type</th>
                <th className="py-3 px-4">Details</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {allRecords.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50/70">
                  <td className="py-3 px-4 font-mono-tabular font-semibold text-slate-900">
                    {rec.id}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-slate-900">{rec.customerName}</div>
                    <div className="text-[11px] text-slate-500 font-mono-tabular">
                      {rec.customerPhone}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <ServiceTag service={rec.service} />
                    <div className="text-[11px] text-slate-500">{rec.bookingType}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-700 max-w-[230px] truncate">
                    {rec.summary}
                  </td>
                  <td className="py-3 px-4 font-mono-tabular text-slate-600 whitespace-nowrap">
                    {formatDateShort(rec.date)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono-tabular font-semibold">
                    {rec.amount > 0 ? formatINR(rec.amount) : '—'}
                  </td>
                  <td className="py-3 px-4">
                    <StatusLabel status={rec.paymentStatus} />
                  </td>
                  <td className="py-3 px-4">
                    <StatusLabel status={rec.status} />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => setSelected(rec)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Manage</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manage Modal */}
      <Modal
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={selected ? `${selected.bookingType} · ${selected.id}` : ''}
        subtitle={selected ? `${selected.customerName} (${selected.customerPhone})` : ''}
      >
        {selected && (
          <div className="space-y-4 text-sm">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Service</span>
                <ServiceTag service={selected.service} />
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date</span>
                <span className="font-mono-tabular">{formatDateShort(selected.date)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Summary</span>
                <span className="font-medium text-right">{selected.summary}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Amount</span>
                <span className="font-mono-tabular font-bold">
                  {selected.amount > 0 ? formatINR(selected.amount) : 'No Fee'}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Update Booking / Order Status
              </label>
              <div className="flex flex-wrap gap-2">
                {getStatusOptions(selected.bookingType).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => handleStatusChange(selected, st)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                      selected.status === st
                        ? 'bg-[#172D4D] text-white border-[#172D4D]'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
