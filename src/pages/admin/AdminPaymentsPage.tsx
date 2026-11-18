import React, { useMemo, useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { ServiceTag, StatusLabel } from '../../components/common/StatusLabel';
import { PaymentMethod, PaymentStatus, ServiceType } from '../../types';
import { formatDateTimeIST, formatINR } from '../../utils/format';

export const AdminPaymentsPage: React.FC = () => {
  const { payments, updatePaymentStatus } = usePlatform();
  const [serviceFilter, setServiceFilter] = useState<'All' | ServiceType>('All');
  const [methodFilter, setMethodFilter] = useState<'All' | PaymentMethod>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | PaymentStatus>('All');

  const filtered = useMemo(() => {
    return payments
      .filter((p) => {
        if (serviceFilter !== 'All' && p.service !== serviceFilter) return false;
        if (methodFilter !== 'All' && p.method !== methodFilter) return false;
        if (statusFilter !== 'All' && p.status !== statusFilter) return false;
        return true;
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [payments, serviceFilter, methodFilter, statusFilter]);

  const totalCollected = payments
    .filter((p) => p.status === 'Paid')
    .reduce((s, p) => s + p.amount, 0);
  const totalPending = payments
    .filter((p) => p.status === 'Pending')
    .reduce((s, p) => s + p.amount, 0);
  const totalRefunded = payments
    .filter((p) => p.status === 'Refunded')
    .reduce((s, p) => s + p.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="type-h1 font-bold text-slate-900">
          Payments &amp; Transactions
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Unified simulated transaction ledger across UPI, Card, and Cash settlements.
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="text-xs text-slate-500">Total Collected (Paid)</div>
          <div className="text-2xl font-bold font-mono-tabular text-emerald-700 mt-1">
            {formatINR(totalCollected)}
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="text-xs text-slate-500">Pending Settlement</div>
          <div className="text-2xl font-bold font-mono-tabular text-amber-700 mt-1">
            {formatINR(totalPending)}
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="text-xs text-slate-500">Refunded Volume</div>
          <div className="text-2xl font-bold font-mono-tabular text-slate-700 mt-1">
            {formatINR(totalRefunded)}
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="text-xs text-slate-500">Total Transactions</div>
          <div className="text-2xl font-bold font-mono-tabular text-slate-900 mt-1">
            {payments.length}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-wrap items-center gap-3">
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
          value={methodFilter}
          onChange={(e) => setMethodFilter(e.target.value as 'All' | PaymentMethod)}
          className="px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white"
        >
          <option value="All">Method: All</option>
          <option value="UPI">UPI</option>
          <option value="Card">Card</option>
          <option value="Cash">Cash</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as 'All' | PaymentStatus)}
          className="px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white"
        >
          <option value="All">Status: All</option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
          <option value="Failed">Failed</option>
          <option value="Refunded">Refunded</option>
        </select>
      </div>

      {/* Mobile Transaction Cards (< md) */}
      <div className="md:hidden space-y-3">
        {filtered.map((p) => (
          <div key={p.id} className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-mono-tabular font-bold text-slate-900">{p.id}</span>
              <StatusLabel status={p.status} />
            </div>
            <div className="flex items-center justify-between text-slate-700">
              <span className="font-medium">{p.customerName}</span>
              <ServiceTag service={p.service} />
            </div>
            <div className="text-slate-500 font-mono-tabular">
              {p.bookingId} · {p.method} · {formatDateTimeIST(p.date)}
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-sm font-bold font-mono-tabular text-slate-900">
                {formatINR(p.amount)}
              </span>
              {p.status === 'Pending' && (
                <button
                  type="button"
                  onClick={() => updatePaymentStatus(p.id, 'Paid')}
                  className="min-h-[36px] px-3 py-1.5 bg-emerald-700 text-white rounded-xl font-semibold"
                >
                  Mark Paid
                </button>
              )}
              {p.status === 'Paid' && (
                <button
                  type="button"
                  onClick={() => updatePaymentStatus(p.id, 'Refunded')}
                  className="min-h-[36px] px-3 py-1.5 border border-slate-200 text-slate-700 rounded-xl font-medium"
                >
                  Refund
                </button>
              )}
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
                <th className="py-3 px-4">Transaction ID</th>
                <th className="py-3 px-4">Booking ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Service</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/70">
                  <td className="py-3 px-4 font-mono-tabular font-semibold text-slate-900">
                    {p.id}
                  </td>
                  <td className="py-3 px-4 font-mono-tabular text-slate-700">{p.bookingId}</td>
                  <td className="py-3 px-4 font-medium text-slate-800">{p.customerName}</td>
                  <td className="py-3 px-4">
                    <ServiceTag service={p.service} />
                  </td>
                  <td className="py-3 px-4">{p.method}</td>
                  <td className="py-3 px-4 text-right font-mono-tabular font-semibold">
                    {formatINR(p.amount)}
                  </td>
                  <td className="py-3 px-4 font-mono-tabular text-slate-500 whitespace-nowrap">
                    {formatDateTimeIST(p.date)}
                  </td>
                  <td className="py-3 px-4">
                    <StatusLabel status={p.status} />
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    {p.status === 'Pending' && (
                      <button
                        type="button"
                        onClick={() => updatePaymentStatus(p.id, 'Paid')}
                        className="px-2.5 py-1 bg-emerald-700 text-white rounded-lg text-[11px] font-semibold hover:bg-emerald-800"
                      >
                        Mark Paid
                      </button>
                    )}
                    {p.status === 'Paid' && (
                      <button
                        type="button"
                        onClick={() => updatePaymentStatus(p.id, 'Refunded')}
                        className="px-2.5 py-1 border border-slate-200 text-slate-700 rounded-lg text-[11px] font-medium hover:bg-slate-100"
                      >
                        Refund
                      </button>
                    )}
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
