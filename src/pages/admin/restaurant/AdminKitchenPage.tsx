import React from 'react';
import { ChefHat, Clock } from 'lucide-react';
import { usePlatform } from '../../../context/PlatformContext';
import { StatusLabel, VegMarker } from '../../../components/common/StatusLabel';
import { FoodOrderStatus } from '../../../types';
import { formatDateTimeIST } from '../../../utils/format';

export const AdminKitchenPage: React.FC = () => {
  const { foodOrders, updateFoodOrderStatus } = usePlatform();

  const activeTickets = foodOrders
    .filter((o) => ['New', 'Accepted', 'Preparing', 'Ready'].includes(o.orderStatus))
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));

  const nextActionFor = (
    status: FoodOrderStatus,
    fulfilment: string
  ): { label: string; next: FoodOrderStatus } | null => {
    if (status === 'New') return { label: 'Accept Ticket', next: 'Accepted' };
    if (status === 'Accepted') return { label: 'Start Preparing', next: 'Preparing' };
    if (status === 'Preparing') return { label: 'Mark Ready', next: 'Ready' };
    if (status === 'Ready') {
      return fulfilment === 'Home Delivery'
        ? { label: 'Hand to Rider', next: 'Out for Delivery' }
        : { label: 'Serve / Handover', next: 'Completed' };
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-orange-700 inline-flex items-center gap-1.5">
            <ChefHat className="w-3.5 h-3.5" /> Kitchen Display System (KDS)
          </p>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Active Kitchen Order Tickets ({activeTickets.length})
          </h1>
        </div>
      </div>

      {activeTickets.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
          <p className="text-sm font-medium text-slate-700">No active kitchen tickets right now.</p>
          <p className="text-xs text-slate-500 mt-1">
            New customer food orders appear here automatically.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {activeTickets.map((order) => {
            const next = nextActionFor(order.orderStatus, order.fulfilmentType);
            return (
              <div
                key={order.id}
                className="bg-white border border-slate-200 rounded-xl flex flex-col justify-between overflow-hidden"
              >
                <div>
                  <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="font-mono-tabular text-sm font-bold text-slate-900">
                        {order.id}
                      </span>
                      <span className="text-xs text-slate-500 ml-2">
                        · {order.fulfilmentType}
                        {order.tableNumber ? ` (${order.tableNumber})` : ''}
                      </span>
                    </div>
                    <StatusLabel status={order.orderStatus} />
                  </div>

                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="font-medium text-slate-800">{order.customerName}</span>
                      <span className="inline-flex items-center gap-1 font-mono-tabular">
                        <Clock className="w-3 h-3" /> {formatDateTimeIST(order.createdAt)}
                      </span>
                    </div>

                    <div className="divide-y divide-slate-100 border-t border-b border-slate-100 py-1">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="py-2 flex items-start justify-between gap-2 text-xs">
                          <div className="flex items-start gap-2">
                            <VegMarker isVeg={item.isVeg} />
                            <div>
                              <div className="font-semibold text-slate-900">
                                {item.quantity} × {item.name}
                              </div>
                              {item.customization && (
                                <div className="text-[11px] text-orange-700">
                                  {item.customization}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {order.notes && (
                      <p className="text-[11px] text-amber-800 bg-amber-50 px-2.5 py-1.5 rounded">
                        Kitchen Note: {order.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-4 pt-0 flex items-center gap-2">
                  {next && (
                    <button
                      type="button"
                      onClick={() => updateFoodOrderStatus(order.id, next.next)}
                      className="flex-1 py-2.5 bg-[#172D4D] hover:bg-[#1e3a63] text-white text-xs font-semibold rounded-lg transition-colors"
                    >
                      {next.label}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => updateFoodOrderStatus(order.id, 'Cancelled')}
                    className="px-3 py-2.5 border border-slate-200 text-rose-700 text-xs font-medium rounded-lg hover:bg-rose-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
