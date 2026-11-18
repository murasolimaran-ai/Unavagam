import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { usePlatform, TURF_SLOTS } from '../../../context/PlatformContext';

export const AdminTurfPricingPage: React.FC = () => {
  const { turfConfig, updateTurfConfig } = usePlatform();

  const [baseHourlyPrice, setBaseHourlyPrice] = useState(turfConfig.baseHourlyPrice);
  const [weekdayPrice, setWeekdayPrice] = useState(turfConfig.weekdayPrice);
  const [weekendPrice, setWeekendPrice] = useState(turfConfig.weekendPrice);
  const [peakHourPrice, setPeakHourPrice] = useState(turfConfig.peakHourPrice);
  const [peakSlots, setPeakSlots] = useState<string[]>(turfConfig.peakSlots);
  const [specialOfferText, setSpecialOfferText] = useState(turfConfig.specialOfferText);
  const [saved, setSaved] = useState(false);

  const togglePeakSlot = (slot: string) => {
    setPeakSlots((prev) =>
      prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateTurfConfig({
      baseHourlyPrice,
      weekdayPrice,
      weekendPrice,
      peakHourPrice,
      peakSlots,
      specialOfferText,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Turf Pricing &amp; Peak Hours
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Updates reflect immediately on the customer Turf booking calculator.
        </p>
      </div>

      <form
        onSubmit={handleSave}
        className="bg-white border border-slate-200 rounded-xl p-6 space-y-5"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Base Hourly Price (₹)
            </label>
            <input
              type="number"
              value={baseHourlyPrice}
              onChange={(e) => setBaseHourlyPrice(Number(e.target.value))}
              className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm font-mono-tabular"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Weekday Day Price (₹)
            </label>
            <input
              type="number"
              value={weekdayPrice}
              onChange={(e) => setWeekdayPrice(Number(e.target.value))}
              className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm font-mono-tabular"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Weekend Day Price (₹)
            </label>
            <input
              type="number"
              value={weekendPrice}
              onChange={(e) => setWeekendPrice(Number(e.target.value))}
              className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm font-mono-tabular"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Peak / Floodlight Hour Price (₹)
            </label>
            <input
              type="number"
              value={peakHourPrice}
              onChange={(e) => setPeakHourPrice(Number(e.target.value))}
              className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm font-mono-tabular"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Peak-Hour Slots
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {TURF_SLOTS.map((slot) => {
              const active = peakSlots.includes(slot);
              return (
                <label
                  key={slot}
                  className={`p-2.5 rounded-lg border text-xs flex items-center gap-2 cursor-pointer ${
                    active ? 'border-blue-600 bg-blue-50/40 font-semibold' : 'border-slate-200'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={() => togglePeakSlot(slot)}
                  />
                  <span className="font-mono-tabular">{slot}</span>
                </label>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Special Offer Banner Copy
          </label>
          <input
            type="text"
            value={specialOfferText}
            onChange={(e) => setSpecialOfferText(e.target.value)}
            className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm"
          />
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          {saved ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
              <Check className="w-4 h-4" /> Pricing saved &amp; live on customer portal
            </span>
          ) : (
            <span />
          )}
          <button
            type="submit"
            className="px-5 py-2.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700"
          >
            Save Turf Pricing
          </button>
        </div>
      </form>
    </div>
  );
};
