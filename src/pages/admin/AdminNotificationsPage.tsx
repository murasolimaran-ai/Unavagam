import React, { useState } from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { ServiceTag } from '../../components/common/StatusLabel';
import { formatDateTimeIST } from '../../utils/format';

export const AdminNotificationsPage: React.FC = () => {
  const { notifications, markNotificationRead, markAllNotificationsRead } = usePlatform();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const list = notifications.filter((n) => (filter === 'unread' ? !n.read : true));

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="type-h1 text-[#0B1628]">
            Unified Notifications
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time event feed for Turf bookings, Resort stays, Food orders, and Payments.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-xl">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`min-h-[36px] px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                filter === 'all' ? 'bg-[#0B1628] text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('unread')}
              className={`min-h-[36px] px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                filter === 'unread' ? 'bg-[#0B1628] text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Unread ({notifications.filter((n) => !n.read).length})
            </button>
          </div>
          <button
            type="button"
            onClick={markAllNotificationsRead}
            className="min-h-[40px] inline-flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 bg-white text-xs font-semibold text-slate-700 rounded-xl hover:bg-slate-50"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark All Read</span>
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100">
        {list.length === 0 ? (
          <div className="p-10 text-center text-xs text-slate-500">
            <Bell className="w-7 h-7 text-slate-300 mx-auto mb-2" />
            No notifications in this view.
          </div>
        ) : (
          list.map((n) => (
            <div
              key={n.id}
              className={`p-4 flex items-start justify-between gap-4 ${
                n.read ? 'bg-white' : 'bg-slate-50/70'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  <ServiceTag service={n.service} />
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-500">{n.type}</span>
                  <span className="text-slate-400">·</span>
                  <span className="font-mono-tabular text-slate-500">
                    {formatDateTimeIST(n.createdAt)}
                  </span>
                </div>
                <h3 className={`text-sm ${n.read ? 'font-medium' : 'font-bold'} text-slate-900`}>
                  {n.title}
                </h3>
                <p className="text-xs text-slate-600">{n.message}</p>
              </div>

              {!n.read && (
                <button
                  type="button"
                  onClick={() => markNotificationRead(n.id)}
                  className="px-2.5 py-1 border border-slate-200 bg-white rounded text-[11px] font-semibold text-slate-700 hover:bg-slate-100 shrink-0"
                >
                  Mark Read
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
