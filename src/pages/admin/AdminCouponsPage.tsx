import React, { useState } from 'react';
import { Plus, Tag } from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { Modal } from '../../components/common/Modal';
import { ServiceTag, StatusLabel } from '../../components/common/StatusLabel';
import { Coupon, ServiceType } from '../../types';
import { addDays, formatDateShort, formatINR, getTodayIST } from '../../utils/format';

export const AdminCouponsPage: React.FC = () => {
  const { coupons, addCoupon, toggleCouponActive } = usePlatform();
  const today = getTodayIST();

  const [modalOpen, setModalOpen] = useState(false);
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState(15);
  const [minOrderAmount, setMinOrderAmount] = useState(1000);
  const [maxDiscount, setMaxDiscount] = useState(1000);
  const [validFrom, setValidFrom] = useState(today);
  const [validUntil, setValidUntil] = useState(addDays(today, 30));
  const [applicableService, setApplicableService] = useState<'All' | ServiceType>('All');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !title.trim()) return;
    const payload: Omit<Coupon, 'id'> = {
      code: code.trim().toUpperCase(),
      title: title.trim(),
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscount,
      validFrom,
      validUntil,
      applicableService,
      active: true,
    };
    addCoupon(payload);
    setModalOpen(false);
    setCode('');
    setTitle('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Coupons &amp; Offers</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Promotional codes apply instantly across customer checkout flows.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#172D4D] text-white text-xs font-semibold rounded-lg hover:bg-[#1e3a63]"
        >
          <Plus className="w-3.5 h-3.5" /> Create Coupon
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase">
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Offer Title</th>
                <th className="py-3 px-4">Applicable Service</th>
                <th className="py-3 px-4">Discount</th>
                <th className="py-3 px-4">Min Order</th>
                <th className="py-3 px-4">Validity</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Toggle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {coupons.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/70">
                  <td className="py-3 px-4 font-mono-tabular font-bold text-[#172D4D]">
                    <span className="inline-flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-slate-400" />
                      {c.code}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-900">{c.title}</td>
                  <td className="py-3 px-4">
                    {c.applicableService === 'All' ? (
                      <span className="font-semibold text-slate-700">All Services</span>
                    ) : (
                      <ServiceTag service={c.applicableService} />
                    )}
                  </td>
                  <td className="py-3 px-4 font-mono-tabular font-semibold">
                    {c.discountType === 'percentage'
                      ? `${c.discountValue}% (max ${formatINR(c.maxDiscount)})`
                      : formatINR(c.discountValue)}
                  </td>
                  <td className="py-3 px-4 font-mono-tabular">{formatINR(c.minOrderAmount)}</td>
                  <td className="py-3 px-4 font-mono-tabular text-slate-500 whitespace-nowrap">
                    {formatDateShort(c.validFrom)} – {formatDateShort(c.validUntil)}
                  </td>
                  <td className="py-3 px-4">
                    <StatusLabel status={c.active ? 'Confirmed' : 'Cancelled'} />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => toggleCouponActive(c.id)}
                      className="px-3 py-1 border border-slate-200 rounded text-[11px] font-semibold hover:bg-slate-100"
                    >
                      {c.active ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Create Promotional Coupon">
        <form onSubmit={handleCreate} className="space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Coupon Code *</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="WEEKEND15"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono-tabular uppercase"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Service</label>
              <select
                value={applicableService}
                onChange={(e) => setApplicableService(e.target.value as 'All' | ServiceType)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
              >
                <option value="All">All Services</option>
                <option value="Turf">Turf</option>
                <option value="Resort">Resort</option>
                <option value="Restaurant">Restaurant</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="15% Off Weekend Bookings"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Discount Type</label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as 'percentage' | 'fixed')}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (₹)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Discount Value</label>
              <input
                type="number"
                value={discountValue}
                onChange={(e) => setDiscountValue(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono-tabular"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Min Order (₹)</label>
              <input
                type="number"
                value={minOrderAmount}
                onChange={(e) => setMinOrderAmount(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono-tabular"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Max Discount (₹)</label>
              <input
                type="number"
                value={maxDiscount}
                onChange={(e) => setMaxDiscount(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono-tabular"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Valid From</label>
              <input
                type="date"
                value={validFrom}
                onChange={(e) => setValidFrom(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Valid Until</label>
              <input
                type="date"
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 border border-slate-200 rounded-lg text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#172D4D] text-white rounded-lg text-xs font-semibold"
            >
              Save Coupon
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
