import React, { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  AlertCircle,
  CheckCircle2,
  CreditCard,
  Home,
  ShoppingBag,
  Store,
  Utensils,
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { FoodOrder, FulfilmentType, PaymentMethod } from '../../types';
import { formatINR } from '../../utils/format';

export const RestaurantCheckoutPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const {
    cart,
    foodItems,
    restaurantTables,
    currentCustomer,
    validateCoupon,
    createFoodOrder,
    foodOrders,
    settings,
  } = usePlatform();

  const [fulfilmentType, setFulfilmentType] = useState<FulfilmentType>('Dine-in');
  const [tableNumber, setTableNumber] = useState(restaurantTables[0]?.tableNumber || 'Table 01');
  const [pickupTime, setPickupTime] = useState('01:30 PM');
  const [deliveryAddress, setDeliveryAddress] = useState(
    currentCustomer?.savedAddresses[0] || ''
  );

  const [customerName, setCustomerName] = useState(currentCustomer?.name || '');
  const [customerPhone, setCustomerPhone] = useState(currentCustomer?.phone || '');
  const [customerEmail, setCustomerEmail] = useState(currentCustomer?.email || '');
  const [notes, setNotes] = useState('');

  const [couponCode, setCouponCode] = useState(searchParams.get('coupon') || '');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [simulateFail, setSimulateFail] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);

  const liveOrder: FoodOrder | undefined = placedOrderId
    ? foodOrders.find((o) => o.id === placedOrderId)
    : undefined;

  const resolvedItems = useMemo(() => {
    return cart
      .map((ci) => {
        const fi = foodItems.find((f) => f.id === ci.foodItemId);
        return fi ? { ...ci, item: fi } : null;
      })
      .filter((x): x is NonNullable<typeof x> => Boolean(x));
  }, [cart, foodItems]);

  const subtotal = resolvedItems.reduce((s, r) => s + r.item.price * r.quantity, 0);
  const deliveryFee = fulfilmentType === 'Home Delivery' ? settings.deliveryFee : 0;
  const couponRes = couponCode ? validateCoupon(couponCode, 'Restaurant', subtotal) : null;
  const discount = couponRes?.valid ? couponRes.discount : 0;
  const taxable = Math.max(0, subtotal - discount);
  const tax = Math.round((taxable * settings.gstRatePercent) / 100);
  const total = taxable + tax + deliveryFee;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!customerName.trim() || !customerPhone.trim() || !customerEmail.trim()) {
      setErrorMsg('Please enter customer name, phone, and email.');
      return;
    }
    if (fulfilmentType === 'Home Delivery' && !deliveryAddress.trim()) {
      setErrorMsg('Please enter a delivery address.');
      return;
    }

    const res = createFoodOrder({
      customerName,
      customerPhone,
      customerEmail,
      items: cart,
      fulfilmentType,
      tableNumber: fulfilmentType === 'Dine-in' ? tableNumber : undefined,
      pickupTime: fulfilmentType === 'Takeaway' ? pickupTime : undefined,
      deliveryAddress: fulfilmentType === 'Home Delivery' ? deliveryAddress : undefined,
      couponCode: discount > 0 ? couponCode : undefined,
      paymentMethod,
      simulateFailure: simulateFail,
      notes,
    });

    if (!res.ok || !res.order) {
      setErrorMsg(res.error || 'Unable to place order.');
      return;
    }
    setPlacedOrderId(res.order.id);
  };

  if (liveOrder) {
    const stages =
      liveOrder.fulfilmentType === 'Home Delivery'
        ? ['New', 'Accepted', 'Preparing', 'Ready', 'Out for Delivery', 'Completed']
        : ['New', 'Accepted', 'Preparing', 'Ready', 'Completed'];
    const currentIdx = stages.indexOf(liveOrder.orderStatus);

    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white border border-slate-200 rounded-xl p-8">
          <div className="flex items-center gap-3 text-emerald-700">
            <CheckCircle2 className="w-7 h-7" />
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Food Order Confirmed</h1>
              <p className="text-xs text-slate-500">
                Order ID: <span className="font-mono-tabular font-semibold">{liveOrder.id}</span> ·{' '}
                {liveOrder.fulfilmentType}
              </p>
            </div>
          </div>

          {/* Live Order Status Tracker */}
          <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <div className="flex items-center justify-between text-xs mb-3">
              <span className="font-semibold text-slate-700">Live Kitchen Order Status</span>
              <span className="font-bold text-orange-700">{liveOrder.orderStatus}</span>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {stages.slice(0, 5).map((st, idx) => {
                const done = currentIdx >= idx && liveOrder.orderStatus !== 'Cancelled';
                return (
                  <div key={st} className="text-center">
                    <div
                      className={`h-1.5 rounded-sm ${done ? 'bg-orange-600' : 'bg-slate-200'}`}
                    />
                    <div className="text-[10px] text-slate-600 mt-1 truncate">{st}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-5 border-t border-b border-slate-200 py-4 space-y-2 text-sm">
            {liveOrder.items.map((it, idx) => (
              <div key={idx} className="flex justify-between">
                <span className="text-slate-700">
                  {it.quantity} × {it.name}
                </span>
                <span className="font-mono-tabular font-medium">
                  {formatINR(it.price * it.quantity)}
                </span>
              </div>
            ))}
            <div className="flex justify-between pt-2 border-t border-slate-100 font-bold text-slate-900">
              <span>Total ({liveOrder.paymentMethod} · {liveOrder.paymentStatus})</span>
              <span className="font-mono-tabular">{formatINR(liveOrder.totalAmount)}</span>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/my-bookings"
              className="flex-1 text-center px-5 py-2.5 bg-[#172D4D] text-white text-xs font-semibold rounded-lg"
            >
              Track in My Bookings
            </Link>
            <Link
              to="/restaurant/menu"
              className="px-5 py-2.5 border border-slate-200 text-slate-700 text-xs font-medium rounded-lg"
            >
              Order More
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (resolvedItems.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="bg-white border border-slate-200 rounded-xl p-8">
          <ShoppingBag className="w-8 h-8 text-slate-300 mx-auto" />
          <h1 className="text-lg font-bold text-slate-900 mt-3">No items to checkout</h1>
          <Link
            to="/restaurant/menu"
            className="inline-block mt-4 px-5 py-2 bg-orange-600 text-white text-xs font-semibold rounded-lg"
          >
            Return to Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <p className="text-xs font-semibold text-orange-700">Kaveri Courtyard Kitchen</p>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Food Order Checkout</h1>
      </div>

      {errorMsg && (
        <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-xs text-rose-800">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6">
          {/* Fulfilment Type */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-900">1. Select Order Fulfilment</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(
                [
                  { id: 'Dine-in', icon: Utensils, sub: 'Serve at dining table' },
                  { id: 'Takeaway', icon: Store, sub: 'Counter pickup' },
                  { id: 'Home Delivery', icon: Home, sub: `Doorstep (+${formatINR(settings.deliveryFee)})` },
                ] as const
              ).map((opt) => {
                const Icon = opt.icon;
                const active = fulfilmentType === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setFulfilmentType(opt.id)}
                    className={`p-4 rounded-xl border text-left transition-colors ${
                      active
                        ? 'border-orange-600 bg-orange-50/50 text-slate-900'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Icon className={`w-4 h-4 mb-2 ${active ? 'text-orange-600' : 'text-slate-400'}`} />
                    <div className="text-xs font-bold">{opt.id}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{opt.sub}</div>
                  </button>
                );
              })}
            </div>

            {fulfilmentType === 'Dine-in' && (
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Select Dining Table
                </label>
                <select
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  className="w-full sm:w-72 px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
                >
                  {restaurantTables.map((t) => (
                    <option key={t.id} value={t.tableNumber}>
                      {t.tableNumber} · {t.seats} Seats ({t.zone})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {fulfilmentType === 'Takeaway' && (
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Preferred Pickup Time
                </label>
                <select
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  className="w-full sm:w-72 px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
                >
                  {['In 20 mins', '01:00 PM', '01:30 PM', '07:30 PM', '08:00 PM', '08:30 PM'].map(
                    (t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    )
                  )}
                </select>
              </div>
            )}

            {fulfilmentType === 'Home Delivery' && (
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Delivery Address *
                </label>
                {currentCustomer && currentCustomer.savedAddresses.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {currentCustomer.savedAddresses.map((addr) => (
                      <button
                        key={addr}
                        type="button"
                        onClick={() => setDeliveryAddress(addr)}
                        className={`text-[11px] px-2.5 py-1 rounded border ${
                          deliveryAddress === addr
                            ? 'border-orange-600 bg-orange-50 text-orange-800'
                            : 'border-slate-200 text-slate-600'
                        }`}
                      >
                        {addr}
                      </button>
                    ))}
                  </div>
                )}
                <textarea
                  rows={2}
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Door No, Street, Landmark, Coimbatore..."
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>
            )}
          </div>

          {/* Customer Contact */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-900">2. Contact Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Name *</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Phone *</label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Kitchen Notes (Optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Less spicy, extra mint chutney..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-900">3. Payment Method</h2>
            <div className="grid grid-cols-3 gap-3">
              {(['UPI', 'Card', 'Cash'] as PaymentMethod[]).map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setPaymentMethod(method)}
                  className={`py-3 px-4 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 ${
                    paymentMethod === method
                      ? 'bg-[#172D4D] text-white border-[#172D4D]'
                      : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>{method === 'Cash' ? 'Cash on Delivery / Desk' : method}</span>
                </button>
              ))}
            </div>
            <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={simulateFail}
                onChange={(e) => setSimulateFail(e.target.checked)}
              />
              <span>Simulate payment failure (test toggle)</span>
            </label>
          </div>
        </div>

        {/* Summary */}
        <aside className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-6 space-y-4 sticky top-24">
          <h2 className="text-base font-bold text-slate-900">Order Summary</h2>
          <div className="space-y-2 text-xs max-h-48 overflow-y-auto border-b border-slate-200 pb-3">
            {resolvedItems.map((r) => (
              <div
                key={`${r.foodItemId}-${r.customization || ''}`}
                className="flex justify-between gap-2"
              >
                <span className="text-slate-700 truncate">
                  {r.quantity} × {r.item.name}
                </span>
                <span className="font-mono-tabular font-medium shrink-0">
                  {formatINR(r.item.price * r.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Coupon Code</label>
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              placeholder="FEAST100"
              className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-mono-tabular uppercase"
            />
            {couponCode && couponRes && (
              <p className={`text-[11px] mt-1 ${couponRes.valid ? 'text-emerald-700' : 'text-rose-600'}`}>
                {couponRes.message}
              </p>
            )}
          </div>

          <div className="space-y-2 text-sm border-t border-slate-200 pt-3">
            <div className="flex justify-between">
              <span className="text-slate-600">Subtotal</span>
              <span className="font-mono-tabular">{formatINR(subtotal)}</span>
            </div>
            {deliveryFee > 0 && (
              <div className="flex justify-between">
                <span className="text-slate-600">Delivery Fee</span>
                <span className="font-mono-tabular">{formatINR(deliveryFee)}</span>
              </div>
            )}
            {discount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Discount</span>
                <span className="font-mono-tabular">-{formatINR(discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-600">GST ({settings.gstRatePercent}%)</span>
              <span className="font-mono-tabular">{formatINR(tax)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-100 text-base font-bold text-slate-900">
              <span>Total</span>
              <span className="font-mono-tabular">{formatINR(total)}</span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            Place Order ({formatINR(total)})
          </button>
        </aside>
      </form>
    </div>
  );
};
