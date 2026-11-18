import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarCheck, Clock, Plus, ShoppingBag, UtensilsCrossed } from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { SmartImage } from '../../components/common/SmartImage';
import { VegMarker } from '../../components/common/StatusLabel';
import { ASSETS } from '../../utils/assets';
import { formatINR } from '../../utils/format';

export const RestaurantPage: React.FC = () => {
  const { foodCategories, foodItems, restaurantTables, settings, addToCart, cart, updateCartQty } =
    usePlatform();

  const featured = foodItems.filter((f) => f.featured && f.available);
  const availableTablesCount = restaurantTables.filter((t) => t.status === 'Available').length;
  const getQty = (id: string) =>
    cart.filter((c) => c.foodItemId === id).reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="space-y-12 pb-12">
      {/* Restaurant Hero */}
      <section className="bg-[#172D4D] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-6 flex flex-col justify-center">
            <p className="text-xs font-semibold text-orange-300 tracking-wide">
              Kaveri Courtyard Kitchen · {settings.restaurantHours}
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mt-2 text-balance">
              Copper-handi biryanis, South Indian tiffin &amp; charcoal grills
            </h1>
            <p className="text-sm sm:text-base text-slate-300 mt-3 max-w-xl leading-relaxed">
              Order online for dine-in, takeaway pickup, or doorstep delivery—or reserve a table
              independently in our indoor hall or garden courtyard.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/restaurant/menu"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                <UtensilsCrossed className="w-4 h-4" />
                <span>Order Food Online</span>
              </Link>
              <Link
                to="/restaurant/table-booking"
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-400 text-white text-sm font-medium rounded-lg hover:bg-white/10 transition-colors"
              >
                <CalendarCheck className="w-4 h-4" />
                <span>Reserve a Table ({availableTablesCount} open now)</span>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 min-h-[280px] rounded-xl overflow-hidden border border-slate-700/60">
            <SmartImage
              src={ASSETS.restaurantHall}
              alt="Kaveri Courtyard Kitchen"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Two Independent Workflows */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-orange-700 font-semibold mb-1.5">
              <span>Workflow A · Online Food Ordering</span>
              <span className="inline-flex items-center gap-1 text-slate-500 font-normal">
                <Clock className="w-3.5 h-3.5" /> 15–25 min prep
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Dine-in, Takeaway Pickup &amp; Home Delivery
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Browse {foodItems.length} curated dishes across {foodCategories.length} categories.
              Customize spice levels, apply coupons, and track live kitchen status.
            </p>
          </div>
          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
            <Link
              to="/restaurant/menu"
              className="px-4 py-2 bg-orange-600 text-white text-xs font-semibold rounded-lg hover:bg-orange-700"
            >
              Browse Full Menu
            </Link>
            <Link
              to="/restaurant/cart"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Cart ({cart.reduce((s, c) => s + c.quantity, 0)})</span>
            </Link>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-[#172D4D] font-semibold mb-1.5">
              <span>Workflow B · Table Reservation</span>
              <span className="text-slate-500 font-normal font-mono-tabular">
                {restaurantTables.length} tables · 2 to 8 seats
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Reserve Your Dining Table
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Book your preferred seating across Indoor Hall, Garden Courtyard, or Private Alcove
              without pre-ordering food.
            </p>
          </div>
          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
            <Link
              to="/restaurant/table-booking"
              className="px-4 py-2 bg-[#172D4D] text-white text-xs font-semibold rounded-lg hover:bg-[#1e3a63]"
            >
              Reserve a Table
            </Link>
            <span className="text-xs text-slate-500">Zero booking fee</span>
          </div>
        </div>
      </section>

      {/* Categories Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Food Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {[...foodCategories]
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((cat) => (
              <Link
                key={cat.id}
                to={`/restaurant/menu?category=${cat.id}`}
                className="bg-white border border-slate-200 hover:border-orange-600 rounded-lg p-3 text-center transition-colors"
              >
                <div className="text-xs font-semibold text-slate-900 truncate">{cat.name}</div>
                <div className="text-[11px] text-slate-500 mt-0.5 font-mono-tabular">
                  {foodItems.filter((f) => f.categoryId === cat.id && f.available).length} items
                </div>
              </Link>
            ))}
        </div>
      </section>

      {/* Featured Dishes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Chef&apos;s Featured Dishes</h2>
          <Link to="/restaurant/menu" className="text-xs font-semibold text-orange-700 hover:underline">
            View all dishes →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((item) => {
            const qty = getQty(item.id);
            return (
              <div
                key={item.id}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col"
              >
                <div className="aspect-[4/3] bg-slate-100">
                  <SmartImage
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <VegMarker isVeg={item.isVeg} />
                      <span className="text-xs text-slate-500 font-mono-tabular">
                        {item.prepTimeMins} min
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900">{item.name}</h3>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2">{item.description}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-base font-bold font-mono-tabular text-slate-900">
                      {formatINR(item.price)}
                    </span>
                    {qty > 0 ? (
                      <div className="flex items-center gap-2 border border-orange-600 rounded-lg px-2.5 py-1 text-xs font-semibold text-orange-700">
                        <button type="button" onClick={() => updateCartQty(item.id, qty - 1)}>
                          -
                        </button>
                        <span className="font-mono-tabular">{qty}</span>
                        <button type="button" onClick={() => addToCart(item.id, 1)}>
                          +
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => addToCart(item.id, 1)}
                        className="inline-flex items-center gap-1 px-3.5 py-1.5 bg-orange-600 text-white text-xs font-semibold rounded-lg hover:bg-orange-700"
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
      </section>
    </div>
  );
};
