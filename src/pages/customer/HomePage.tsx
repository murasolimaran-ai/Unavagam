import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BedDouble,
  Calendar,
  Check,
  Clock,
  MapPin,
  Phone,
  Plus,
  ShoppingBag,
  Trophy,
  UtensilsCrossed,
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { SmartImage } from '../../components/common/SmartImage';
import { VegMarker } from '../../components/common/StatusLabel';
import { ASSETS } from '../../utils/assets';
import { addDays, formatINR, getTodayIST, TURF_SLOTS } from '../../utils/format';

export const HomePage: React.FC = () => {
  const {
    turfConfig,
    getTurfSlotStatus,
    roomCategories,
    getCategoryAvailableCount,
    foodItems,
    coupons,
    settings,
    cart,
    addToCart,
    updateCartQty,
  } = usePlatform();

  const today = getTodayIST();
  const tomorrow = addDays(today, 1);

  const availableSlotsToday = TURF_SLOTS.filter(
    (s) => getTurfSlotStatus(today, s).status === 'Available'
  ).length;

  const totalRoomsAvailableToday = roomCategories.reduce(
    (sum, cat) => sum + getCategoryAvailableCount(cat.id, today, tomorrow),
    0
  );

  const featuredRooms = roomCategories.slice(0, 3);
  const popularFoods = foodItems.filter((f) => f.featured && f.available).slice(0, 4);
  const activeCoupons = coupons.filter((c) => c.active);

  const getCartQty = (foodId: string) =>
    cart.filter((c) => c.foodItemId === foodId).reduce((s, i) => s + i.quantity, 0);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-[#172D4D] text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            <div className="lg:col-span-6 flex flex-col justify-center">
              <p className="text-xs font-medium text-slate-300 tracking-wide mb-3">
                Coimbatore Foothills · Turf, Eco-Resort &amp; Fine Dining
              </p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.12] text-balance">
                Play under the lights. Stay among the palms. Dine by the courtyard.
              </h1>
              <p className="mt-4 text-base text-slate-300 leading-relaxed max-w-xl">
                Three distinct experiences at one private estate—FIFA-grade 7v7 floodlit turf,
                20 boutique resort rooms and pool villas, and an all-day South Indian kitchen.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  to="/resort/booking"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#172D4D] text-sm font-semibold rounded-lg hover:bg-slate-100 transition-colors whitespace-nowrap"
                >
                  <span>Book Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/turf/booking"
                  className="inline-flex items-center gap-2 px-5 py-3 border border-slate-500 text-white text-sm font-medium rounded-lg hover:bg-white/10 transition-colors whitespace-nowrap"
                >
                  <span>Reserve Turf Slot</span>
                </Link>
              </div>
              <div className="mt-10 pt-6 border-t border-slate-700/70 grid grid-cols-3 gap-6 max-w-lg">
                <div>
                  <div className="text-xl font-bold font-mono-tabular">{availableSlotsToday}/10</div>
                  <div className="text-xs text-slate-300 mt-0.5">Turf slots open today</div>
                </div>
                <div>
                  <div className="text-xl font-bold font-mono-tabular">{totalRoomsAvailableToday}/20</div>
                  <div className="text-xs text-slate-300 mt-0.5">Rooms open tonight</div>
                </div>
                <div>
                  <div className="text-xl font-bold font-mono-tabular">30 min</div>
                  <div className="text-xs text-slate-300 mt-0.5">Kitchen dispatch</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="h-72 sm:h-96 lg:h-full min-h-[340px] rounded-xl overflow-hidden border border-slate-700/60">
                <SmartImage
                  src={ASSETS.heroEstate}
                  alt="Kaveri Palms Estate Resort and Pool"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Three Service Modules Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Three experiences, one unified booking desk
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Select a service to check live availability and confirm online in under a minute.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 1. Turf Service Card */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col">
            <div className="aspect-[16/10] bg-slate-100 overflow-hidden">
              <SmartImage
                src={ASSETS.turfArena}
                alt="Kaveri Arena FIFA Turf"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span className="font-semibold text-blue-700 inline-flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5" /> Turf Arena
                  </span>
                  <span className="font-mono-tabular">{availableSlotsToday} slots open today</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  {turfConfig.name}
                </h3>
                <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                  65m × 45m FIFA Pro 7v7 floodlit pitch · From {formatINR(turfConfig.weekdayPrice)}/hr
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-3">
                <Link
                  to="/turf/booking"
                  className="flex-1 text-center px-4 py-2.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
                >
                  Book Your Slot
                </Link>
                <Link
                  to="/turf"
                  className="px-4 py-2.5 border border-slate-200 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap"
                >
                  View Availability
                </Link>
              </div>
            </div>
          </div>

          {/* 2. Resort Service Card */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col">
            <div className="aspect-[16/10] bg-slate-100 overflow-hidden">
              <SmartImage
                src={ASSETS.poolVilla}
                alt="Kaveri Palms Resort Villas"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span className="font-semibold text-emerald-700 inline-flex items-center gap-1.5">
                    <BedDouble className="w-3.5 h-3.5" /> Boutique Resort
                  </span>
                  <span className="font-mono-tabular">20 rooms · 5 categories</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  Garden Suites &amp; Pool Villas
                </h3>
                <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                  Standard, Deluxe, Premium, Family &amp; Private Pool Villas · From {formatINR(3200)}/night
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-3">
                <Link
                  to="/resort/booking"
                  className="flex-1 text-center px-4 py-2.5 bg-emerald-700 text-white text-xs font-semibold rounded-lg hover:bg-emerald-800 transition-colors whitespace-nowrap"
                >
                  Book Your Stay
                </Link>
                <Link
                  to="/resort/rooms"
                  className="px-4 py-2.5 border border-slate-200 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap"
                >
                  Explore Rooms
                </Link>
              </div>
            </div>
          </div>

          {/* 3. Restaurant Service Card */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col">
            <div className="aspect-[16/10] bg-slate-100 overflow-hidden">
              <SmartImage
                src={ASSETS.restaurantHall}
                alt="Kaveri Courtyard Kitchen"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span className="font-semibold text-orange-700 inline-flex items-center gap-1.5">
                    <UtensilsCrossed className="w-3.5 h-3.5" /> Courtyard Kitchen
                  </span>
                  <span>Dine-in · Pickup · Delivery</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  South Indian Kitchen &amp; Grills
                </h3>
                <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                  Copper-handi biryanis, breakfast tiffin, tandoor starters &amp; live table booking.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-3">
                <Link
                  to="/restaurant/menu"
                  className="flex-1 text-center px-4 py-2.5 bg-orange-600 text-white text-xs font-semibold rounded-lg hover:bg-orange-700 transition-colors whitespace-nowrap"
                >
                  Order Food
                </Link>
                <Link
                  to="/restaurant/table-booking"
                  className="px-4 py-2.5 border border-slate-200 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap"
                >
                  Reserve a Table
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Resort Rooms */}
      <section className="bg-white border-y border-slate-200 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                Featured Resort Stays
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Live inventory across 20 rooms with instant date-based confirmation.
              </p>
            </div>
            <Link
              to="/resort/rooms"
              className="text-sm font-semibold text-[#172D4D] hover:underline inline-flex items-center gap-1 whitespace-nowrap"
            >
              <span>All 5 room categories</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredRooms.map((room) => {
              const avail = getCategoryAvailableCount(room.id, today, tomorrow);
              return (
                <div
                  key={room.id}
                  className="border border-slate-200 rounded-xl overflow-hidden flex flex-col bg-[#F8FAFC]"
                >
                  <div className="aspect-[4/3] bg-slate-200 overflow-hidden">
                    <SmartImage
                      src={room.image}
                      alt={room.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between bg-white">
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                        <span>{room.bedType} · {room.sizeSqFt} sq.ft</span>
                        <span className="font-mono-tabular text-emerald-700 font-medium">
                          {avail} open tonight
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900">{room.name}</h3>
                      <p className="text-xs text-slate-600 mt-1.5 line-clamp-2">
                        {room.description}
                      </p>
                    </div>
                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-base font-bold text-slate-900 font-mono-tabular">
                          {formatINR(room.weekdayPrice)}
                        </span>
                        <span className="text-xs text-slate-500"> / night</span>
                      </div>
                      <Link
                        to={`/resort/booking?category=${room.id}`}
                        className="px-3.5 py-2 bg-[#172D4D] text-white text-xs font-semibold rounded-lg hover:bg-[#1e3a63] transition-colors"
                      >
                        Book Room
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Popular Food Items */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Signature Kitchen Favourites
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Freshly prepared for dine-in tables, quick takeaway, or doorstep delivery.
            </p>
          </div>
          <Link
            to="/restaurant/menu"
            className="text-sm font-semibold text-orange-700 hover:underline inline-flex items-center gap-1 whitespace-nowrap"
          >
            <span>Explore full menu</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {popularFoods.map((item) => {
            const qty = getCartQty(item.id);
            return (
              <div
                key={item.id}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col"
              >
                <div className="aspect-[4/3] bg-slate-100 overflow-hidden">
                  <SmartImage
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <VegMarker isVeg={item.isVeg} />
                      <span className="text-[11px] text-slate-500 font-mono-tabular">
                        {item.prepTimeMins} min
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">{item.name}</h3>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900 font-mono-tabular">
                      {formatINR(item.price)}
                    </span>
                    {qty > 0 ? (
                      <div className="flex items-center gap-2 border border-orange-600 rounded-lg px-2 py-1 text-xs font-semibold text-orange-700">
                        <button
                          type="button"
                          onClick={() => updateCartQty(item.id, qty - 1)}
                          className="px-1 hover:text-orange-900"
                        >
                          -
                        </button>
                        <span className="font-mono-tabular">{qty}</span>
                        <button
                          type="button"
                          onClick={() => addToCart(item.id, 1)}
                          className="px-1 hover:text-orange-900"
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => addToCart(item.id, 1)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-orange-600 text-white text-xs font-semibold rounded-lg hover:bg-orange-700 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {cart.length > 0 && (
          <div className="mt-6 flex items-center justify-between bg-slate-900 text-white px-5 py-3.5 rounded-xl">
            <div className="flex items-center gap-3 text-sm">
              <ShoppingBag className="w-4 h-4 text-orange-400" />
              <span>
                <strong className="font-mono-tabular">
                  {cart.reduce((s, c) => s + c.quantity, 0)}
                </strong>{' '}
                item(s) in your kitchen cart
              </span>
            </div>
            <Link
              to="/restaurant/cart"
              className="px-4 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              Review Cart &amp; Checkout
            </Link>
          </div>
        )}
      </section>

      {/* Turf Promotion & Special Offers */}
      <section className="bg-white border-y border-slate-200 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-7 bg-[#172D4D] text-white rounded-xl p-8 flex flex-col justify-between">
            <div>
              <p className="text-xs font-semibold text-blue-300 tracking-wide">
                Kaveri Arena Promotion
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold mt-2 tracking-tight">
                Night Floodlight Matches &amp; Corporate Tournaments
              </h2>
              <p className="text-sm text-slate-300 mt-3 max-w-xl leading-relaxed">
                {turfConfig.specialOfferText}. Includes match bibs, FIFA-standard balls, chilled water, and dugout seating.
              </p>
              <ul className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-200">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-blue-400" />
                  <span>Instant single &amp; double-hour slot booking</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-blue-400" />
                  <span>Zero double-booking slot lock guarantee</span>
                </li>
              </ul>
            </div>
            <div className="mt-8">
              <Link
                to="/turf/booking"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                <Calendar className="w-4 h-4" />
                <span>Check Live Turf Slots</span>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 border border-slate-200 rounded-xl p-6 bg-[#F8FAFC] flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Active Estate Offers</h3>
              <p className="text-xs text-slate-500 mt-1">
                Apply any promo code directly during checkout.
              </p>
              <div className="mt-4 divide-y divide-slate-200 border-t border-slate-200">
                {activeCoupons.map((c) => (
                  <div key={c.id} className="py-3 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{c.title}</div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {c.applicableService} · Min order {formatINR(c.minOrderAmount)}
                      </div>
                    </div>
                    <span className="font-mono-tabular text-xs font-bold text-[#172D4D] bg-white border border-slate-300 px-2.5 py-1 rounded">
                      {c.code}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials + Estate Contact */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-6">
              Guest &amp; Captain Feedback
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <p className="text-sm text-slate-700 leading-relaxed">
                  “Our 14-member squad books the 7–9 PM floodlit slot every Friday and orders Chicken Biryani for post-match dinner. One portal handles both without phone follow-ups.”
                </p>
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="text-xs font-bold text-slate-900">Arun Kumar</div>
                  <div className="text-xs text-slate-500">Captain, Kovai Strikers FC · 18 Turf Bookings</div>
                </div>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <p className="text-sm text-slate-700 leading-relaxed">
                  “We stayed two nights in the Private Pool Villa with family and reserved Table 06 for Saturday dinner. Check-in took two minutes and the food arrived piping hot.”
                </p>
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="text-xs font-bold text-slate-900">Priya Menon</div>
                  <div className="text-xs text-slate-500">Guest from Chennai · Villa &amp; Dining Stay</div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-slate-900">Visit Kaveri Palms Estate</h3>
            <p className="text-xs text-slate-500 mt-1">
              Single campus with dedicated parking, reception desk, and sports clubhouse.
            </p>
            <div className="mt-5 space-y-3 text-sm text-slate-700">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <span>
                  {settings.address}, {settings.city}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="font-mono-tabular">{settings.phone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                <span>
                  Turf: {settings.turfHours} · Kitchen: {settings.restaurantHours}
                </span>
              </div>
            </div>
            <div className="mt-6 flex items-center gap-3">
              <Link
                to="/my-bookings"
                className="flex-1 text-center px-4 py-2.5 bg-[#172D4D] text-white text-xs font-semibold rounded-lg hover:bg-[#1e3a63] transition-colors"
              >
                Track My Bookings
              </Link>
              <Link
                to="/profile"
                className="px-4 py-2.5 border border-slate-200 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-50 transition-colors"
              >
                Guest Profile
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
