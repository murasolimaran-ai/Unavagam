import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { usePlatform } from '../../../context/PlatformContext';
import { addDays, formatDateShort, getTodayIST } from '../../../utils/format';

export const AdminResortAvailabilityPage: React.FC = () => {
  const { roomCategories, resortRooms, getCategoryAvailableCount } = usePlatform();
  const [startDate, setStartDate] = useState(getTodayIST());
  const days = Array.from({ length: 10 }, (_, i) => addDays(startDate, i));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Room Availability Matrix
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Date-based inventory remaining per category (excludes confirmed/checked-in overlapping stays &amp; maintenance).
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-2 py-1">
          <button
            type="button"
            onClick={() => setStartDate(addDays(startDate, -5))}
            className="p-1 hover:bg-slate-100 rounded"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="text-xs font-mono-tabular font-medium px-1 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setStartDate(addDays(startDate, 5))}
            className="p-1 hover:bg-slate-100 rounded"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-600">
                <th className="py-3 px-4 min-w-[170px]">Room Category</th>
                {days.map((d) => (
                  <th key={d} className="py-3 px-2 text-center font-mono-tabular min-w-[88px]">
                    {formatDateShort(d).slice(0, 6)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {roomCategories.map((cat) => {
                const total = resortRooms.filter((r) => r.categoryId === cat.id).length;
                return (
                  <tr key={cat.id}>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{cat.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono-tabular">
                        Total: {total} rooms
                      </div>
                    </td>
                    {days.map((d) => {
                      const avail = getCategoryAvailableCount(cat.id, d, addDays(d, 1));
                      return (
                        <td key={d} className="p-2 text-center font-mono-tabular">
                          <div
                            className={`py-1.5 rounded text-xs font-semibold ${
                              avail === 0
                                ? 'bg-rose-50 text-rose-700'
                                : avail <= 1
                                ? 'bg-amber-50 text-amber-800'
                                : 'bg-emerald-50 text-emerald-700'
                            }`}
                          >
                            {avail}/{total}
                          </div>
                        </td>
                      );
                    })}
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
