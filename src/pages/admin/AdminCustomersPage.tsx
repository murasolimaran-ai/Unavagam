import React, { useMemo, useState } from 'react';
import { Eye, Pencil, Search } from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { Modal } from '../../components/common/Modal';
import { StatusLabel } from '../../components/common/StatusLabel';
import { Customer } from '../../types';
import { formatDateShort, formatINR } from '../../utils/format';

export const AdminCustomersPage: React.FC = () => {
  const {
    customers,
    turfBookings,
    resortBookings,
    foodOrders,
    tableReservations,
    payments,
    updateCustomerProfile,
  } = usePlatform();

  const [search, setSearch] = useState('');
  const [detailCust, setDetailCust] = useState<Customer | null>(null);
  const [editCust, setEditCust] = useState<Customer | null>(null);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');

  const enrichedCustomers = useMemo(() => {
    return customers
      .map((c) => {
        const tb = turfBookings.filter((b) => b.customerId === c.id);
        const rb = resortBookings.filter((b) => b.customerId === c.id);
        const fo = foodOrders.filter((o) => o.customerId === c.id);
        const tr = tableReservations.filter((r) => r.customerId === c.id);
        const totalBookings = tb.length + rb.length + fo.length + tr.length;
        const totalSpent = payments
          .filter((p) => p.customerId === c.id && p.status === 'Paid')
          .reduce((s, p) => s + p.amount, 0);
        const dates = [
          ...tb.map((x) => x.date),
          ...rb.map((x) => x.checkIn),
          ...fo.map((x) => x.createdAt.slice(0, 10)),
          ...tr.map((x) => x.date),
        ].sort();
        const lastBooking = dates.length ? dates[dates.length - 1] : '';
        return {
          ...c,
          totalBookings,
          totalSpent,
          lastBooking,
          tb,
          rb,
          fo,
          tr,
        };
      })
      .filter((c) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
          c.name.toLowerCase().includes(q) ||
          c.phone.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.id.toLowerCase().includes(q)
        );
      });
  }, [customers, turfBookings, resortBookings, foodOrders, tableReservations, payments, search]);

  const openEdit = (c: Customer) => {
    setEditCust(c);
    setEditName(c.name);
    setEditPhone(c.phone);
    setEditEmail(c.email);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCust) return;
    updateCustomerProfile(editCust.id, {
      name: editName,
      phone: editPhone,
      email: editEmail,
    });
    setEditCust(null);
  };

  const activeDetail = detailCust
    ? enrichedCustomers.find((c) => c.id === detailCust.id)
    : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Shared Customer Database
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Unified customer profiles across Turf, Resort, and Restaurant ({customers.length} customers)
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, phone..."
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs bg-white"
          />
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase">
                <th className="py-3 px-4">Customer ID</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4 text-right">Bookings</th>
                <th className="py-3 px-4 text-right">Total Spent</th>
                <th className="py-3 px-4">Last Activity</th>
                <th className="py-3 px-4">Registered</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {enrichedCustomers.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/70">
                  <td className="py-3 px-4 font-mono-tabular font-semibold text-slate-900">
                    {c.id}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-900">{c.name}</td>
                  <td className="py-3 px-4 font-mono-tabular text-slate-600">{c.phone}</td>
                  <td className="py-3 px-4 text-slate-600">{c.email}</td>
                  <td className="py-3 px-4 text-right font-mono-tabular font-semibold">
                    {c.totalBookings}
                  </td>
                  <td className="py-3 px-4 text-right font-mono-tabular font-semibold text-emerald-700">
                    {formatINR(c.totalSpent)}
                  </td>
                  <td className="py-3 px-4 font-mono-tabular text-slate-600">
                    {c.lastBooking ? formatDateShort(c.lastBooking) : '—'}
                  </td>
                  <td className="py-3 px-4 font-mono-tabular text-slate-500">
                    {formatDateShort(c.registrationDate)}
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => setDetailCust(c)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-slate-700 hover:bg-slate-100 rounded"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>History</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => openEdit(c)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-slate-700 hover:bg-slate-100 rounded ml-1"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail History Modal */}
      <Modal
        open={Boolean(activeDetail)}
        onClose={() => setDetailCust(null)}
        title={activeDetail ? `${activeDetail.name} (${activeDetail.id})` : ''}
        subtitle={activeDetail ? `${activeDetail.phone} · ${activeDetail.email}` : ''}
        maxWidthClass="max-w-3xl"
      >
        {activeDetail && (
          <div className="space-y-6 text-xs">
            <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <div>
                <div className="text-slate-500">Total Spent</div>
                <div className="text-lg font-bold font-mono-tabular text-slate-900">
                  {formatINR(activeDetail.totalSpent)}
                </div>
              </div>
              <div>
                <div className="text-slate-500">Total Bookings</div>
                <div className="text-lg font-bold font-mono-tabular text-slate-900">
                  {activeDetail.totalBookings}
                </div>
              </div>
              <div>
                <div className="text-slate-500">Registered</div>
                <div className="text-sm font-semibold font-mono-tabular text-slate-900 mt-1">
                  {formatDateShort(activeDetail.registrationDate)}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-blue-700 mb-1.5">
                  Turf Bookings ({activeDetail.tb.length})
                </h4>
                {activeDetail.tb.length === 0 ? (
                  <p className="text-slate-400">No turf bookings.</p>
                ) : (
                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg">
                    {activeDetail.tb.map((b) => (
                      <div key={b.id} className="p-2.5 flex justify-between items-center">
                        <span>
                          <strong className="font-mono-tabular">{b.id}</strong> ·{' '}
                          {formatDateShort(b.date)} ({b.slots.join(', ')})
                        </span>
                        <span className="flex items-center gap-3">
                          <StatusLabel status={b.bookingStatus} />
                          <span className="font-mono-tabular font-semibold">
                            {formatINR(b.totalAmount)}
                          </span>
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h4 className="font-bold text-emerald-700 mb-1.5">
                  Resort Stays ({activeDetail.rb.length})
                </h4>
                {activeDetail.rb.length === 0 ? (
                  <p className="text-slate-400">No resort stays.</p>
                ) : (
                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg">
                    {activeDetail.rb.map((b) => (
                      <div key={b.id} className="p-2.5 flex justify-between items-center">
                        <span>
                          <strong className="font-mono-tabular">{b.id}</strong> · {b.categoryName}{' '}
                          ({formatDateShort(b.checkIn)} – {formatDateShort(b.checkOut)})
                        </span>
                        <span className="flex items-center gap-3">
                          <StatusLabel status={b.bookingStatus} />
                          <span className="font-mono-tabular font-semibold">
                            {formatINR(b.totalAmount)}
                          </span>
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h4 className="font-bold text-orange-700 mb-1.5">
                  Food Orders ({activeDetail.fo.length}) &amp; Table Reservations ({activeDetail.tr.length})
                </h4>
                {activeDetail.fo.length === 0 && activeDetail.tr.length === 0 ? (
                  <p className="text-slate-400">No restaurant activity.</p>
                ) : (
                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg">
                    {activeDetail.fo.map((o) => (
                      <div key={o.id} className="p-2.5 flex justify-between items-center">
                        <span>
                          <strong className="font-mono-tabular">{o.id}</strong> · {o.fulfilmentType}{' '}
                          ({o.items.length} items)
                        </span>
                        <span className="flex items-center gap-3">
                          <StatusLabel status={o.orderStatus} />
                          <span className="font-mono-tabular font-semibold">
                            {formatINR(o.totalAmount)}
                          </span>
                        </span>
                      </div>
                    ))}
                    {activeDetail.tr.map((r) => (
                      <div key={r.id} className="p-2.5 flex justify-between items-center">
                        <span>
                          <strong className="font-mono-tabular">{r.id}</strong> · {r.tableNumber} on{' '}
                          {formatDateShort(r.date)} at {r.timeSlot}
                        </span>
                        <StatusLabel status={r.status} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={Boolean(editCust)}
        onClose={() => setEditCust(null)}
        title="Edit Customer Details"
      >
        <form onSubmit={handleSaveEdit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Phone</label>
            <input
              type="tel"
              value={editPhone}
              onChange={(e) => setEditPhone(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              required
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setEditCust(null)}
              className="px-4 py-2 border border-slate-200 rounded-lg text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#172D4D] text-white rounded-lg text-xs font-semibold"
            >
              Save Customer
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
