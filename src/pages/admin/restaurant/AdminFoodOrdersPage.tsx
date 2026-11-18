import React, { useMemo, useState } from 'react';
import { usePlatform } from '../../../context/PlatformContext';
import { StatusLabel } from '../../../components/common/StatusLabel';
import { FoodOrderStatus, FulfilmentType } from '../../../types';
import { formatDateTimeIST, formatINR } from '../../../utils/format';

export const AdminFoodOrdersPage: React.FC = () => {
  const { foodOrders, updateFoodOrderStatus } = usePlatform();
  const [fulfilmentFilter, setFulfilmentFilter] = useState<'All' | FulfilmentType>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | FoodOrderStatus>('All');

  const filtered = useMemo(() => {
    return foodOrders
      .filter((o) => {
        if (fulfilmentFilter !== 'All' && o.fulfilmentType !== fulfilmentFilter) return false;
        if (statusFilter !== 'All' && o.orderStatus !== statusFilter) return false;
        return true;
      })
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [foodOrders, fulfilmentFilter, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="type-h1 text-[#0B1628]">Live Food Orders</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Accept, prepare, dispatch, and complete Dine-in, Takeaway, and Home Delivery orders.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-xl overflow-x-auto">
            {(['All', 'Dine-in', 'Takeaway', 'Home Delivery'] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFulfilmentFilter(f)}
                className={`min-h-[36px] px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  fulfilmentFilter === f ? 'bg-[#0B1628] text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {f === 'Takeaway' ? 'Pickup' : f}
              </button>
            ))}
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'All' | FoodOrderStatus)}
            className="min-h-[40px] px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none focus:border-[#0B1628]"
          >
            <option value="All">Status: All</option>
            <option value="New">New</option>
            <option value="Accepted">Accepted</option>
            <option value="Preparing">Preparing</option>
            <option value="Ready">Ready</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Mobile stacked order cards */}
      <div className="md:hidden space-y-3">
        {filtered.map((o) => (
          <div key={o.id} className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-xs font-mono-tabular font-bold text-[#0B1628]">{o.id}</div>
                <div className="text-sm font-semibold text-slate-900 mt-0.5">{o.customerName}</div>
                <div className="text-[11px] text-slate-500">
                  {o.fulfilmentType} · {o.tableNumber || o.pickupTime || o.deliveryAddress || ''}
                </div>
              </div>
              <StatusLabel status={o.orderStatus} />
            </div>
            <div className="text-xs text-slate-700 bg-slate-50 rounded-xl p-2.5">
              {o.items.map((i) => `${i.quantity}× ${i.name}`).join(', ')}
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <span className="font-mono-tabular text-slate-500">{formatDateTimeIST(o.createdAt)}</span>
              <span className="font-mono-tabular font-bold text-slate-900">{formatINR(o.totalAmount)}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {o.orderStatus === 'New' && (
                <>
                  <button
                    type="button"
                    onClick={() => updateFoodOrderStatus(o.id, 'Accepted')}
                    className="min-h-[38px] px-3 py-1.5 bg-emerald-700 text-white rounded-xl text-xs font-semibold"
                  >
                    Accept
                  </button>
                  <button
                    type="button"
                    onClick={() => updateFoodOrderStatus(o.id, 'Cancelled')}
                    className="min-h-[38px] px-3 py-1.5 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium"
                  >
                    Reject
                  </button>
                </>
              )}
              {o.orderStatus === 'Accepted' && (
                <button
                  type="button"
                  onClick={() => updateFoodOrderStatus(o.id, 'Preparing')}
                  className="min-h-[38px] px-3 py-1.5 bg-orange-600 text-white rounded-xl text-xs font-semibold"
                >
                  Start Preparing
                </button>
              )}
              {o.orderStatus === 'Preparing' && (
                <button
                  type="button"
                  onClick={() => updateFoodOrderStatus(o.id, 'Ready')}
                  className="min-h-[38px] px-3 py-1.5 bg-emerald-700 text-white rounded-xl text-xs font-semibold"
                >
                  Mark Ready
                </button>
              )}
              {o.orderStatus === 'Ready' && o.fulfilmentType === 'Home Delivery' && (
                <button
                  type="button"
                  onClick={() => updateFoodOrderStatus(o.id, 'Out for Delivery')}
                  className="min-h-[38px] px-3 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-semibold"
                >
                  Out for Delivery
                </button>
              )}
              {(o.orderStatus === 'Ready' && o.fulfilmentType !== 'Home Delivery') ||
              o.orderStatus === 'Out for Delivery' ? (
                <button
                  type="button"
                  onClick={() => updateFoodOrderStatus(o.id, 'Completed')}
                  className="min-h-[38px] px-3 py-1.5 bg-[#0B1628] text-white rounded-xl text-xs font-semibold"
                >
                  Complete
                </button>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      <div className="hidden md:block bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase">
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Items</th>
                <th className="py-3 px-4">Qty</th>
                <th className="py-3 px-4">Fulfilment</th>
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Workflow Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filtered.map((o) => {
                const totalQty = o.items.reduce((s, i) => s + i.quantity, 0);
                return (
                  <tr key={o.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-mono-tabular font-bold text-slate-900">
                      {o.id}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-900">{o.customerName}</div>
                      <div className="text-[11px] text-slate-500 font-mono-tabular">
                        {o.customerPhone}
                      </div>
                    </td>
                    <td className="py-3 px-4 max-w-[220px]">
                      <div className="truncate text-slate-800">
                        {o.items.map((i) => `${i.quantity}× ${i.name}`).join(', ')}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono-tabular">{totalQty}</td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800">{o.fulfilmentType}</div>
                      <div className="text-[11px] text-slate-500 truncate max-w-[140px]">
                        {o.tableNumber || o.pickupTime || o.deliveryAddress || ''}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono-tabular text-slate-500 whitespace-nowrap">
                      {formatDateTimeIST(o.createdAt)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono-tabular font-semibold">
                      {formatINR(o.totalAmount)}
                    </td>
                    <td className="py-3 px-4">
                      <StatusLabel status={o.paymentStatus} />
                    </td>
                    <td className="py-3 px-4">
                      <StatusLabel status={o.orderStatus} />
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        {o.orderStatus === 'New' && (
                          <>
                            <button
                              type="button"
                              onClick={() => updateFoodOrderStatus(o.id, 'Accepted')}
                              className="px-2.5 py-1 bg-emerald-700 text-white rounded text-[11px] font-semibold"
                            >
                              Accept
                            </button>
                            <button
                              type="button"
                              onClick={() => updateFoodOrderStatus(o.id, 'Cancelled')}
                              className="px-2.5 py-1 border border-rose-200 text-rose-700 rounded text-[11px] font-medium"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {o.orderStatus === 'Accepted' && (
                          <button
                            type="button"
                            onClick={() => updateFoodOrderStatus(o.id, 'Preparing')}
                            className="px-2.5 py-1 bg-orange-600 text-white rounded text-[11px] font-semibold"
                          >
                            Start Preparing
                          </button>
                        )}
                        {o.orderStatus === 'Preparing' && (
                          <button
                            type="button"
                            onClick={() => updateFoodOrderStatus(o.id, 'Ready')}
                            className="px-2.5 py-1 bg-emerald-700 text-white rounded text-[11px] font-semibold"
                          >
                            Mark Ready
                          </button>
                        )}
                        {o.orderStatus === 'Ready' && o.fulfilmentType === 'Home Delivery' && (
                          <button
                            type="button"
                            onClick={() => updateFoodOrderStatus(o.id, 'Out for Delivery')}
                            className="px-2.5 py-1 bg-blue-600 text-white rounded text-[11px] font-semibold"
                          >
                            Out for Delivery
                          </button>
                        )}
                        {(o.orderStatus === 'Ready' && o.fulfilmentType !== 'Home Delivery') ||
                        o.orderStatus === 'Out for Delivery' ? (
                          <button
                            type="button"
                            onClick={() => updateFoodOrderStatus(o.id, 'Completed')}
                            className="px-2.5 py-1 bg-[#172D4D] text-white rounded text-[11px] font-semibold"
                          >
                            Complete
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
