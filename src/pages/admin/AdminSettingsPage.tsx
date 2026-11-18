import React, { useEffect, useState } from 'react';
import { Check, RotateCcw } from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';

export const AdminSettingsPage: React.FC = () => {
  const { settings, updateSettings, resetDemoData } = usePlatform();
  const [form, setForm] = useState(settings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    resetDemoData();
    setSaved(false);
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="type-h1 text-[#0B1628]">
            Business &amp; Platform Settings
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Unified profile, operating hours, tax rates, booking policies, and payment options.
          </p>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="min-h-[40px] inline-flex items-center gap-1.5 px-3.5 py-2 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl hover:bg-rose-50 self-start"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo Data</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-900">Business Profile &amp; Contact</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Business Name</label>
              <input
                type="text"
                value={form.businessName}
                onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">GSTIN</label>
              <input
                type="text"
                value={form.gstNumber}
                onChange={(e) => setForm({ ...form, gstNumber: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono-tabular"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Contact Phone</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono-tabular"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Concierge Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-700 mb-1">Street Address</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-900">
            Operating Hours, Tax &amp; Cancellation Policies
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Turf Hours</label>
              <input
                type="text"
                value={form.turfHours}
                onChange={(e) => setForm({ ...form, turfHours: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Resort Check-in</label>
              <input
                type="text"
                value={form.resortCheckInTime}
                onChange={(e) => setForm({ ...form, resortCheckInTime: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Restaurant Hours</label>
              <input
                type="text"
                value={form.restaurantHours}
                onChange={(e) => setForm({ ...form, restaurantHours: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Standard GST (%)
              </label>
              <input
                type="number"
                value={form.gstRatePercent}
                onChange={(e) => setForm({ ...form, gstRatePercent: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono-tabular"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Delivery Fee (₹)
              </label>
              <input
                type="number"
                value={form.deliveryFee}
                onChange={(e) => setForm({ ...form, deliveryFee: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono-tabular"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Turf Free Cancel Window (hrs)
              </label>
              <input
                type="number"
                value={form.turfCancellationHours}
                onChange={(e) =>
                  setForm({ ...form, turfCancellationHours: Number(e.target.value) })
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono-tabular"
              />
            </div>
          </div>

          <div className="pt-2 flex flex-wrap gap-6 text-xs text-slate-700">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.enableUPI}
                onChange={(e) => setForm({ ...form, enableUPI: e.target.checked })}
              />
              <span>Accept UPI</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.enableCard}
                onChange={(e) => setForm({ ...form, enableCard: e.target.checked })}
              />
              <span>Accept Credit / Debit Card</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.enableCash}
                onChange={(e) => setForm({ ...form, enableCash: e.target.checked })}
              />
              <span>Accept Pay at Venue / Cash</span>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-between">
          {saved ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
              <Check className="w-4 h-4" /> Settings saved across customer &amp; admin portals
            </span>
          ) : (
            <span />
          )}
          <button
            type="submit"
            className="min-h-[44px] px-6 py-2.5 bg-[#0B1628] text-white text-xs font-semibold rounded-xl hover:bg-[#172D4D] transition-colors"
          >
            Save All Settings
          </button>
        </div>
      </form>
    </div>
  );
};
