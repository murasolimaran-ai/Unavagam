import React, { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { usePlatform } from '../../../context/PlatformContext';

export const AdminResortPricingPage: React.FC = () => {
  const { roomCategories, updateResortCategory, settings, updateSettings } = usePlatform();
  const [savedId, setSavedId] = useState<string | null>(null);

  const buildDrafts = () =>
    Object.fromEntries(
      roomCategories.map((c) => [
        c.id,
        {
          weekdayPrice: c.weekdayPrice,
          weekendPrice: c.weekendPrice,
          seasonalMultiplier: c.seasonalMultiplier,
          extraBedPrice: c.extraBedPrice,
          specialOffer: c.specialOffer || '',
        },
      ])
    );

  const [drafts, setDrafts] = useState(buildDrafts);

  useEffect(() => {
    setDrafts(buildDrafts());
  }, [roomCategories]);

  const handleUpdateDraft = (id: string, field: string, value: string | number) => {
    setDrafts((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleSaveCategory = (id: string) => {
    const d = drafts[id];
    if (!d) return;
    updateResortCategory(id, {
      weekdayPrice: Number(d.weekdayPrice),
      weekendPrice: Number(d.weekendPrice),
      seasonalMultiplier: Number(d.seasonalMultiplier),
      extraBedPrice: Number(d.extraBedPrice),
      specialOffer: d.specialOffer || undefined,
    });
    setSavedId(id);
    setTimeout(() => setSavedId(null), 2200);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="type-h1 text-[#0B1628]">
            Resort Pricing &amp; Seasonal Rules
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure weekday, weekend, seasonal multiplier, extra bed, and category offers.
          </p>
        </div>

        <label className="min-h-[42px] inline-flex items-center gap-2.5 px-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-semibold text-slate-800 cursor-pointer self-start">
          <input
            type="checkbox"
            checked={settings.seasonalPricingActive}
            onChange={(e) => updateSettings({ seasonalPricingActive: e.target.checked })}
          />
          <span>Peak Seasonal Multiplier Active</span>
        </label>
      </div>

      <div className="space-y-4">
        {roomCategories.map((cat) => {
          const d = drafts[cat.id];
          if (!d) return null;
          return (
            <div
              key={cat.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900">{cat.name}</h2>
                {savedId === cat.id && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                    <Check className="w-3.5 h-3.5" /> Saved
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    Weekday (₹)
                  </label>
                  <input
                    type="number"
                    value={d.weekdayPrice}
                    onChange={(e) => handleUpdateDraft(cat.id, 'weekdayPrice', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono-tabular"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    Weekend (₹)
                  </label>
                  <input
                    type="number"
                    value={d.weekendPrice}
                    onChange={(e) => handleUpdateDraft(cat.id, 'weekendPrice', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono-tabular"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    Seasonal (×)
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    value={d.seasonalMultiplier}
                    onChange={(e) =>
                      handleUpdateDraft(cat.id, 'seasonalMultiplier', Number(e.target.value))
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono-tabular"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    Extra Bed (₹)
                  </label>
                  <input
                    type="number"
                    value={d.extraBedPrice}
                    onChange={(e) => handleUpdateDraft(cat.id, 'extraBedPrice', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono-tabular"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    Special Offer
                  </label>
                  <input
                    type="text"
                    value={d.specialOffer}
                    onChange={(e) => handleUpdateDraft(cat.id, 'specialOffer', e.target.value)}
                    placeholder="Optional promo..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => handleSaveCategory(cat.id)}
                  className="min-h-[40px] px-4 py-2 bg-[#0B1628] hover:bg-[#172D4D] text-white text-xs font-semibold rounded-xl transition-colors"
                >
                  Save {cat.name} Rates
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
