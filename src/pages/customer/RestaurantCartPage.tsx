import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Tag, Trash2 } from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { SmartImage } from '../../components/common/SmartImage';
import { VegMarker } from '../../components/common/StatusLabel';
import { formatINR } from '../../utils/format';

export const RestaurantCartPage: React.FC = () => {
  const { cart, foodItems, updateCartQty, removeFromCart, clearCart, validateCoupon, settings } =
    usePlatform();

  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [couponMsg, setCouponMsg] = useState('');

  const resolvedCart = useMemo(() => {
    return cart
      .map((ci) => {
        const item = foodItems.find((f) => f.id === ci.foodItemId);
        return item ? { ...ci, item } : null;
      })
      .filter((x): x is NonNullable<typeof x> => Boolean(x));
  }, [cart, foodItems]);

  const subtotal = resolvedCart.reduce((s, r) => s + r.item.price * r.quantity, 0);

  const discount = useMemo(() => {
    if (!appliedCoupon || subtotal === 0) return 0;
    const res = validateCoupon(appliedCoupon, 'Restaurant', subtotal);
    return res.valid ? res.discount : 0;
  }, [appliedCoupon, subtotal, validateCoupon]);

  const taxable = Math.max(0, subtotal - discount);
  const tax = Math.round((taxable * settings.gstRatePercent) / 100);
  const total = taxable + tax;

  const handleApplyCoupon = () => {
    const res = validateCoupon(couponInput, 'Restaurant', subtotal);
    setCouponMsg(res.message);
    if (res.valid) setAppliedCoupon(couponInput.trim().toUpperCase());
    else setAppliedCoupon('');
  };

  if (resolvedCart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-10">
          <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto" />
          <h1 className="type-h2 text-[#0B1628] mt-4">Your Kitchen Cart is Empty</h1>
          <p className="text-sm text-slate-600 mt-1.5">
            Explore our South Indian tiffin, biryanis, and grills to start an order.
          </p>
          <Link
            to="/restaurant/menu"
            className="min-h-[44px] inline-flex items-center justify-center mt-6 px-6 py-2.5 bg-[#0B1628] text-white text-xs font-semibold rounded-xl hover:bg-[#172D4D] transition-colors"
          >
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#C89B54]">Kaveri Courtyard Kitchen</p>
          <h1 className="type-h1 text-[#0B1628] mt-1">Your Food Cart</h1>
        </div>
        <button
          type="button"
          onClick={clearCart}
          className="min-h-[40px] px-3 text-xs font-medium text-rose-600 hover:underline"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl divide-y divide-slate-200">
          {resolvedCart.map((entry) => (
            <div
              key={`${entry.foodItemId}-${entry.customization || ''}`}
              className="p-4 sm:p-5 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                  <SmartImage
                    src={entry.item.image}
                    alt={entry.item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <VegMarker isVeg={entry.item.isVeg} />
                    <h3 className="text-sm font-bold text-slate-900 truncate">
                      {entry.item.name}
                    </h3>
                  </div>
                  {entry.customization && (
                    <p className="text-xs text-slate-500 mt-0.5">{entry.customization}</p>
                  )}
                  <p className="text-xs font-mono-tabular text-slate-600 mt-1">
                    {formatINR(entry.item.price)} each
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-2 py-1 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() =>
                      updateCartQty(entry.foodItemId, entry.quantity - 1, entry.customization)
                    }
                    className="w-7 h-7 inline-flex items-center justify-center rounded-lg hover:bg-slate-100"
                  >
                    -
                  </button>
                  <span className="font-mono-tabular w-5 text-center">{entry.quantity}</span>
                  <button
                    type="button"
                    onClick={() =>
                      updateCartQty(entry.foodItemId, entry.quantity + 1, entry.customization)
                    }
                    className="w-7 h-7 inline-flex items-center justify-center rounded-lg hover:bg-slate-100"
                  >
                    +
                  </button>
                </div>

                <div className="w-16 sm:w-20 text-right text-sm font-bold font-mono-tabular text-slate-900">
                  {formatINR(entry.item.price * entry.quantity)}
                </div>

                <button
                  type="button"
                  onClick={() => removeFromCart(entry.foodItemId, entry.customization)}
                  className="p-2 text-slate-400 hover:text-rose-600 rounded-lg"
                  aria-label="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <aside className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-5">
          <h2 className="text-base font-bold text-slate-900">Bill Summary</h2>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Promo Code (Try FEAST100)
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="FEAST100"
                  className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-lg text-xs uppercase font-mono-tabular"
                />
              </div>
              <button
                type="button"
                onClick={handleApplyCoupon}
                className="px-3.5 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg"
              >
                Apply
              </button>
            </div>
            {couponMsg && (
              <p className={`text-[11px] mt-1.5 ${appliedCoupon ? 'text-emerald-700' : 'text-rose-600'}`}>
                {couponMsg}
              </p>
            )}
          </div>

          <div className="space-y-2.5 text-sm border-t border-b border-slate-200 py-4">
            <div className="flex justify-between">
              <span className="text-slate-600">Item Subtotal</span>
              <span className="font-mono-tabular font-medium">{formatINR(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Discount ({appliedCoupon})</span>
                <span className="font-mono-tabular font-medium">-{formatINR(discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-600">GST ({settings.gstRatePercent}%)</span>
              <span className="font-mono-tabular font-medium">{formatINR(tax)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-100 font-bold text-slate-900">
              <span>Estimated Total</span>
              <span className="font-mono-tabular">{formatINR(total)}</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Delivery fee ({formatINR(settings.deliveryFee)}) applies if Home Delivery is selected at checkout.
            </p>
          </div>

          <div className="space-y-2.5">
            <Link
              to={`/restaurant/checkout${appliedCoupon ? `?coupon=${appliedCoupon}` : ''}`}
              className="min-h-[44px] flex items-center justify-center w-full px-5 py-2.5 bg-[#0B1628] text-white text-sm font-semibold rounded-xl hover:bg-[#172D4D] transition-colors"
            >
              Proceed to Checkout
            </Link>
            <Link
              to="/restaurant/menu"
              className="min-h-[44px] flex items-center justify-center w-full px-5 py-2 border border-slate-200 text-slate-700 text-xs font-medium rounded-xl hover:bg-slate-50 transition-colors"
            >
              Add More Items
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
};
