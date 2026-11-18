import React, { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Plus, Search, ShoppingBag } from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { SmartImage } from '../../components/common/SmartImage';
import { VegMarker } from '../../components/common/StatusLabel';
import { formatINR } from '../../utils/format';

export const RestaurantMenuPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { foodCategories, foodItems, cart, addToCart, updateCartQty } = usePlatform();

  const [selectedCat, setSelectedCat] = useState(searchParams.get('category') || 'ALL');
  const [dietFilter, setDietFilter] = useState<'ALL' | 'VEG' | 'NONVEG'>('ALL');
  const [search, setSearch] = useState('');
  const [selectedCustomizations, setSelectedCustomizations] = useState<Record<string, string>>({});

  const sortedCategories = useMemo(
    () => [...foodCategories].sort((a, b) => a.sortOrder - b.sortOrder),
    [foodCategories]
  );

  const filteredItems = useMemo(() => {
    return foodItems.filter((item) => {
      if (selectedCat !== 'ALL' && item.categoryId !== selectedCat) return false;
      if (dietFilter === 'VEG' && !item.isVeg) return false;
      if (dietFilter === 'NONVEG' && item.isVeg) return false;
      if (
        search.trim() &&
        !item.name.toLowerCase().includes(search.toLowerCase()) &&
        !item.description.toLowerCase().includes(search.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [foodItems, selectedCat, dietFilter, search]);

  const cartSummary = useMemo(() => {
    let count = 0;
    let total = 0;
    cart.forEach((ci) => {
      const fi = foodItems.find((f) => f.id === ci.foodItemId);
      if (fi) {
        count += ci.quantity;
        total += fi.price * ci.quantity;
      }
    });
    return { count, total };
  }, [cart, foodItems]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-orange-700 uppercase tracking-wider">
            Kaveri Courtyard Kitchen
          </p>
          <h1 className="type-h1 font-bold text-slate-900 mt-1">
            Full Food &amp; Beverage Menu
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search biryani, dosa, paneer..."
              className="w-full sm:w-56 min-h-[42px] pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none focus:border-orange-600"
            />
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-xl">
            {(
              [
                { id: 'ALL', label: 'All' },
                { id: 'VEG', label: 'Veg' },
                { id: 'NONVEG', label: 'Non-Veg' },
              ] as const
            ).map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setDietFilter(d.id)}
                className={`min-h-[38px] px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  dietFilter === d.id
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>

          <Link
            to="/restaurant/table-booking"
            className="inline-flex items-center justify-center min-h-[42px] px-4 py-2 border border-slate-200 bg-white text-slate-700 text-xs font-medium rounded-xl hover:bg-slate-50"
          >
            Reserve Table Instead
          </Link>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          type="button"
          onClick={() => setSelectedCat('ALL')}
          className={`min-h-[40px] px-3.5 py-2 text-xs font-semibold rounded-xl border whitespace-nowrap shrink-0 transition-colors ${
            selectedCat === 'ALL'
              ? 'bg-[#0B1628] text-white border-[#0B1628]'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          All Categories
        </button>
        {sortedCategories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCat(cat.id)}
            className={`min-h-[40px] px-3.5 py-2 text-xs font-semibold rounded-xl border whitespace-nowrap shrink-0 transition-colors ${
              selectedCat === cat.id
                ? 'bg-[#0B1628] text-white border-[#0B1628]'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Menu Grid */}
      {filteredItems.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
          <p className="text-sm font-medium text-slate-700">No dishes match your filter.</p>
          <button
            type="button"
            onClick={() => {
              setSelectedCat('ALL');
              setDietFilter('ALL');
              setSearch('');
            }}
            className="mt-3 min-h-[42px] px-4 py-2 bg-[#0B1628] text-white text-xs font-semibold rounded-xl"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const catName = foodCategories.find((c) => c.id === item.categoryId)?.name || '';
            const custom =
              selectedCustomizations[item.id] ?? item.customizations[0] ?? undefined;
            const cartEntry = cart.find(
              (c) => c.foodItemId === item.id && (c.customization || '') === (custom || '')
            );
            const qty = cartEntry?.quantity || 0;

            return (
              <div
                key={item.id}
                className={`bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col group ${
                  !item.available ? 'opacity-65' : ''
                }`}
              >
                <div className="aspect-[16/10] bg-slate-100 overflow-hidden">
                  <SmartImage
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-1.5">
                      <span className="inline-flex items-center gap-2">
                        <VegMarker isVeg={item.isVeg} />
                        <span>{catName}</span>
                      </span>
                      <span className="font-mono-tabular">{item.prepTimeMins} min</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900">{item.name}</h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {item.description}
                    </p>

                    {item.customizations.length > 0 && item.available && (
                      <div className="mt-3">
                        <select
                          value={custom || ''}
                          onChange={(e) =>
                            setSelectedCustomizations((prev) => ({
                              ...prev,
                              [item.id]: e.target.value,
                            }))
                          }
                          className="w-full min-h-[38px] px-2.5 py-1.5 border border-slate-200 rounded-xl text-xs text-slate-700 bg-slate-50"
                        >
                          {item.customizations.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-base font-bold font-mono-tabular text-slate-900">
                      {formatINR(item.price)}
                    </span>

                    {!item.available ? (
                      <span className="text-xs font-semibold text-rose-600">Out of Stock</span>
                    ) : qty > 0 ? (
                      <div className="flex items-center gap-3 border border-orange-600 rounded-xl px-3 min-h-[40px] text-xs font-semibold text-orange-700">
                        <button
                          type="button"
                          onClick={() => updateCartQty(item.id, qty - 1, custom)}
                          className="px-1 py-1"
                        >
                          -
                        </button>
                        <span className="font-mono-tabular">{qty}</span>
                        <button
                          type="button"
                          onClick={() => addToCart(item.id, 1, custom)}
                          className="px-1 py-1"
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => addToCart(item.id, 1, custom)}
                        className="inline-flex items-center gap-1.5 min-h-[40px] px-4 py-2 bg-orange-600 text-white text-xs font-semibold rounded-xl hover:bg-orange-700 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add to Cart</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Floating Cart Bar (sits cleanly above mobile 56px bottom nav) */}
      {cartSummary.count > 0 && (
        <div className="sticky bottom-16 md:bottom-4 z-30 bg-[#0B1628] text-white px-4 sm:px-5 py-3.5 rounded-2xl shadow-xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-sm">
            <ShoppingBag className="w-4 h-4 text-[#C89B54] shrink-0" />
            <span>
              <strong className="font-mono-tabular">{cartSummary.count}</strong> item(s) ·{' '}
              <strong className="font-mono-tabular">{formatINR(cartSummary.total)}</strong>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/restaurant/cart"
              className="flex-1 sm:flex-initial text-center min-h-[40px] inline-flex items-center justify-center px-4 py-2 border border-white/20 text-xs font-medium rounded-xl hover:bg-white/10"
            >
              View Cart
            </Link>
            <Link
              to="/restaurant/checkout"
              className="flex-1 sm:flex-initial text-center min-h-[40px] inline-flex items-center justify-center px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold rounded-xl"
            >
              Checkout →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
