import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  BedDouble,
  Calendar,
  CalendarCheck,
  Check,
  Clock,
  MapPin,
  Phone,
  Plus,
  ShoppingBag,
  Trophy,
  Users,
  UtensilsCrossed,
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { SmartImage } from '../../components/common/SmartImage';
import { VegMarker } from '../../components/common/StatusLabel';
import { ASSETS } from '../../utils/assets';
import { addDays, formatDateShort, formatINR, getTodayIST, TURF_SLOTS } from '../../utils/format';

type QuickTab = 'resort' | 'turf' | 'restaurant';
type ShowcaseKey = 'turf' | 'resort' | 'restaurant';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    turfConfig,
    getTurfSlotStatus,
    roomCategories,
    getCategoryAvailableCount,
    foodItems,
    restaurantTables,
    coupons,
    settings,
    cart,
    addToCart,
    updateCartQty,
  } = usePlatform();

  const today = getTodayIST();
  const tomorrow = addDays(today, 1);

  // Quick Booking Bar state
  const [quickTab, setQuickTab] = useState<QuickTab>('resort');
  const [qCheckIn, setQCheckIn] = useState(today);
  const [qCheckOut, setQCheckOut] = useState(addDays(today, 2));
  const [qAdults, setQAdults] = useState(2);
  const [qTurfDate, setQTurfDate] = useState(today);

  // Interactive Editorial Showcase state
  const [activeShowcase, setActiveShowcase] = useState<ShowcaseKey>('turf');

  const availableSlotsToday = TURF_SLOTS.filter(
    (s) => getTurfSlotStatus(today, s).status === 'Available'
  ).length;
  const availableSlotsForQuickDate = TURF_SLOTS.filter(
    (s) => getTurfSlotStatus(qTurfDate, s).status === 'Available'
  ).length;

  const totalRoomsAvailableToday = roomCategories.reduce(
    (sum, cat) => sum + getCategoryAvailableCount(cat.id, today, tomorrow),
    0
  );
  const availableTablesNow = restaurantTables.filter((t) => t.status === 'Available').length;

  const featuredRooms = roomCategories.slice(0, 3);
  const popularFoods = foodItems.filter((f) => f.featured && f.available).slice(0, 4);
  const activeCoupons = coupons.filter((c) => c.active);

  const getCartQty = (foodId: string) =>
    cart.filter((c) => c.foodItemId === foodId).reduce((s, i) => s + i.quantity, 0);

  const handleQuickResortSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/resort/rooms?checkIn=${qCheckIn}&checkOut=${qCheckOut}&adults=${qAdults}`);
  };

  const handleQuickTurfSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/turf/booking?date=${qTurfDate}`);
  };

  const showcaseItems: Record<
    ShowcaseKey,
    {
      index: string;
      eyebrow: string;
      title: string;
      description: string;
      image: string;
      imageAlt: string;
      primaryTo: string;
      primaryLabel: string;
      secondaryTo: string;
      secondaryLabel: string;
      specs: { label: string; value: string }[];
    }
  > = {
    turf: {
      index: '01',
      eyebrow: 'Single Championship Floodlit Ground',
      title: turfConfig.name,
      description:
        'Precision 50mm FIFA Quality Pro monofilament grass with glare-free 400W mast floodlights, covered players dugout, and real-time slot locks.',
      image: ASSETS.turfArena,
      imageAlt: 'Kaveri Arena floodlit 7v7 football turf',
      primaryTo: '/turf/booking',
      primaryLabel: 'Book Turf Slot',
      secondaryTo: '/turf',
      secondaryLabel: 'View Live Schedule',
      specs: [
        { label: 'Dimensions', value: '65m × 45m (7v7)' },
        { label: 'Weekday Rate', value: `${formatINR(turfConfig.weekdayPrice)} / hr` },
        { label: 'Peak Evening', value: `${formatINR(turfConfig.peakHourPrice)} / hr` },
        { label: 'Open Today', value: `${availableSlotsToday} / ${TURF_SLOTS.length} slots` },
      ],
    },
    resort: {
      index: '02',
      eyebrow: '20 Boutique Suites & Pool Villas',
      title: 'Private Palms Sanctuary & Architectural Stays',
      description:
        'Five curated room tiers from Deluxe Garden Rooms to Private Plunge Pool Villas with instant date-overlap allocation and transparent nightly tariffs.',
      image: ASSETS.poolVilla,
      imageAlt: 'Private Pool Villa at Kaveri Palms Estate',
      primaryTo: '/resort/booking',
      primaryLabel: 'Reserve Your Stay',
      secondaryTo: '/resort/rooms',
      secondaryLabel: 'Explore 5 Categories',
      specs: [
        { label: 'Inventory', value: '20 Rooms · 5 Tiers' },
        { label: 'Weekday From', value: `${formatINR(3200)} / night` },
        { label: 'Open Tonight', value: `${totalRoomsAvailableToday} / 20 rooms` },
        { label: 'Check-in / Out', value: `${settings.resortCheckInTime} / ${settings.resortCheckOutTime}` },
      ],
    },
    restaurant: {
      index: '03',
      eyebrow: 'All-Day South Indian & Grill Dining',
      title: 'Kaveri Courtyard Kitchen & Table Concierge',
      description:
        'Order piping-hot copper-handi biryanis, breakfast tiffin, and charcoal grills for dine-in, takeaway, or doorstep delivery—or reserve a courtyard table independently.',
      image: ASSETS.restaurantHall,
      imageAlt: 'Kaveri Courtyard Dining Hall',
      primaryTo: '/restaurant/menu',
      primaryLabel: 'Order Food Online',
      secondaryTo: '/restaurant/table-booking',
      secondaryLabel: 'Reserve a Table',
      specs: [
        { label: 'Kitchen Hours', value: settings.restaurantHours },
        { label: 'Active Menu', value: `${foodItems.filter((f) => f.available).length} Fresh Dishes` },
        { label: 'Dining Tables', value: `${availableTablesNow} Open Now` },
        { label: 'Avg Dispatch', value: '20 – 30 mins' },
      ],
    },
  };

  const activeData = showcaseItems[activeShowcase];

  return (
    <div>
      {/* 1. Full-Bleed Dark Coastal Hero + Integrated Quick Booking Bar */}
      <section className="relative bg-[#071120] text-white overflow-hidden">
        <div className="absolute inset-0">
          <SmartImage
            src={ASSETS.heroEstate}
            alt="Kaveri Palms Estate twilight resort and floodlit grounds"
            className="w-full h-full object-cover opacity-55"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#071120]/95 via-[#0B1628]/80 to-[#0B1628]/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#071120] via-transparent to-[#071120]/40" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-12 sm:pt-16 sm:pb-16 lg:pt-20 lg:pb-20">
          <div className="max-w-3xl">
            <p className="text-xs sm:text-sm font-semibold text-[#C89B54] tracking-wide">
              {settings.city} · Turf Club, Eco-Resort &amp; Courtyard Kitchen
            </p>
            <h1 className="type-hero font-extrabold text-white mt-3">
              Play under the lights. Wake among the palms. Dine by the courtyard.
            </h1>
            <p className="type-lead text-slate-300 mt-4 max-w-2xl">
              One private estate uniting a FIFA-grade 7v7 floodlit turf, 20 boutique rooms and
              plunge-pool villas, and an all-day South Indian kitchen with instant live booking.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3.5">
              <Link
                to="/resort/booking"
                className="inline-flex items-center justify-center gap-2 min-h-[46px] px-6 py-3 bg-[#C89B54] text-[#071120] text-sm font-bold rounded-xl hover:bg-[#d6aa63] transition-colors whitespace-nowrap"
              >
                <span>Reserve Your Stay</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/turf/booking"
                className="inline-flex items-center justify-center gap-2 min-h-[46px] px-5 py-3 bg-white/10 backdrop-blur-xs border border-white/20 text-white text-sm font-semibold rounded-xl hover:bg-white/15 transition-colors whitespace-nowrap"
              >
                <span>Book Turf Slot</span>
              </Link>
              <Link
                to="/restaurant/menu"
                className="inline-flex items-center justify-center gap-2 min-h-[46px] px-5 py-3 border border-white/20 text-slate-200 text-sm font-medium rounded-xl hover:text-white hover:bg-white/10 transition-colors whitespace-nowrap"
              >
                <span>Order Dining</span>
              </Link>
            </div>

            {/* Live Availability Strip */}
            <div className="mt-9 pt-6 border-t border-white/15 grid grid-cols-3 gap-4 sm:gap-8 max-w-xl">
              <div>
                <div className="text-xl sm:text-2xl font-bold font-mono-tabular text-white">
                  {availableSlotsToday}/{TURF_SLOTS.length}
                </div>
                <div className="text-xs text-slate-300 mt-0.5">Turf slots open today</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold font-mono-tabular text-white">
                  {totalRoomsAvailableToday}/20
                </div>
                <div className="text-xs text-slate-300 mt-0.5">Rooms open tonight</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold font-mono-tabular text-[#C89B54]">
                  {availableTablesNow} Tables
                </div>
                <div className="text-xs text-slate-300 mt-0.5">Courtyard ready</div>
              </div>
            </div>
          </div>

          {/* Integrated Quick Booking & Service Launcher Bar */}
          <div className="mt-10 bg-white text-slate-900 rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
            <div className="flex flex-wrap border-b border-slate-200 bg-slate-50/80 px-2 pt-2 gap-1">
              {(
                [
                  { id: 'resort', label: 'Resort Stays', icon: BedDouble },
                  { id: 'turf', label: 'Turf Arena', icon: Trophy },
                  { id: 'restaurant', label: 'Kitchen & Dining', icon: UtensilsCrossed },
                ] as const
              ).map((tab) => {
                const Icon = tab.icon;
                const active = quickTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setQuickTab(tab.id)}
                    className={`inline-flex items-center gap-2 min-h-[44px] px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-t-xl transition-colors whitespace-nowrap ${
                      active
                        ? 'bg-white text-[#0B1628] border-t border-x border-slate-200 -mb-px'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {quickTab === 'resort' && (
              <form
                onSubmit={handleQuickResortSubmit}
                className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 items-end"
              >
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Check-in Date
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="date"
                      min={today}
                      value={qCheckIn}
                      onChange={(e) => {
                        const val = e.target.value;
                        setQCheckIn(val);
                        if (val >= qCheckOut) setQCheckOut(addDays(val, 1));
                      }}
                      className="w-full min-h-[44px] pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium bg-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Check-out Date
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="date"
                      min={addDays(qCheckIn, 1)}
                      value={qCheckOut}
                      onChange={(e) => setQCheckOut(e.target.value)}
                      className="w-full min-h-[44px] pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium bg-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Guests
                  </label>
                  <div className="relative">
                    <Users className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select
                      value={qAdults}
                      onChange={(e) => setQAdults(Number(e.target.value))}
                      className="w-full min-h-[44px] pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium bg-white"
                    >
                      {[1, 2, 3, 4, 5, 6].map((n) => (
                        <option key={n} value={n}>
                          {n} Adult{n > 1 ? 's' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full min-h-[44px] px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-semibold rounded-xl transition-colors"
                >
                  Check Room Availability
                </button>
              </form>
            )}

            {quickTab === 'turf' && (
              <form
                onSubmit={handleQuickTurfSubmit}
                className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-3 gap-4 items-end"
              >
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Select Match Date
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="date"
                      min={today}
                      max={addDays(today, 30)}
                      value={qTurfDate}
                      onChange={(e) => setQTurfDate(e.target.value)}
                      className="w-full min-h-[44px] pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium bg-white"
                    />
                  </div>
                </div>
                <div className="min-h-[44px] px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                  <span className="text-slate-600">
                    Open on {formatDateShort(qTurfDate)}
                  </span>
                  <span className="font-mono-tabular font-bold text-blue-700">
                    {availableSlotsForQuickDate} / {TURF_SLOTS.length} Slots
                  </span>
                </div>
                <button
                  type="submit"
                  className="w-full min-h-[44px] px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-xl transition-colors"
                >
                  Pick Time Slot &amp; Book
                </button>
              </form>
            )}

            {quickTab === 'restaurant' && (
              <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    Dine-in, Takeaway Pickup, Delivery &amp; Table Reservations
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Kitchen open {settings.restaurantHours} · {availableTablesNow} dining tables open right now
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link
                    to="/restaurant/menu"
                    className="inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs sm:text-sm font-semibold rounded-xl transition-colors"
                  >
                    Order Food Online
                  </Link>
                  <Link
                    to="/restaurant/table-booking"
                    className="inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 bg-[#0B1628] hover:bg-[#172D4D] text-white text-xs sm:text-sm font-semibold rounded-xl transition-colors"
                  >
                    Reserve a Table
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. Interactive Editorial Service Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold text-[#C89B54] uppercase tracking-wider">
              The Coastal Club
            </p>
            <h2 className="type-h2 font-bold text-slate-900 mt-1">
              Three experiences, one unified booking desk
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2">
              Switch between our championship pitch, private villa stays, and courtyard kitchen to
              inspect live specs and reserve directly.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-200/70 rounded-xl self-start">
            {(
              [
                { id: 'turf', label: '01. Turf Arena' },
                { id: 'resort', label: '02. Resort & Villas' },
                { id: 'restaurant', label: '03. Courtyard Kitchen' },
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveShowcase(item.id)}
                className={`min-h-[40px] px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  activeShowcase === item.id
                    ? 'bg-[#0B1628] text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-6 min-h-[260px] sm:min-h-[340px] lg:min-h-[440px] bg-slate-100 overflow-hidden group">
            <SmartImage
              src={activeData.image}
              alt={activeData.imageAlt}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-500">
                <span className="font-mono-tabular text-[#C89B54]">{activeData.index}</span>
                <span aria-hidden="true">·</span>
                <span>{activeData.eyebrow}</span>
              </div>
              <h3 className="type-h2 font-bold text-slate-900 mt-2">{activeData.title}</h3>
              <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
                {activeData.description}
              </p>

              <div className="mt-7 grid grid-cols-2 gap-4 pt-6 border-t border-slate-100">
                {activeData.specs.map((sp) => (
                  <div key={sp.label}>
                    <div className="text-xs text-slate-500">{sp.label}</div>
                    <div className="text-sm sm:text-base font-bold font-mono-tabular text-slate-900 mt-0.5">
                      {sp.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center gap-3">
              <Link
                to={activeData.primaryTo}
                className="inline-flex items-center justify-center gap-2 min-h-[44px] px-6 py-2.5 bg-[#0B1628] text-white text-xs sm:text-sm font-semibold rounded-xl hover:bg-[#172D4D] transition-colors whitespace-nowrap"
              >
                <span>{activeData.primaryLabel}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to={activeData.secondaryTo}
                className="inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 border border-slate-200 text-slate-700 text-xs sm:text-sm font-medium rounded-xl hover:bg-slate-50 transition-colors whitespace-nowrap"
              >
                {activeData.secondaryLabel}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Asymmetric Estate Moments Photo Gallery */}
      <section className="bg-[#0B1628] text-white py-14 sm:py-18">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-xs font-semibold text-[#C89B54] uppercase tracking-wider">
                Estate Moments
              </p>
              <h2 className="type-h2 font-bold text-white mt-1">
                Inside Kaveri Palms Estate
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md">
              From sunset 7v7 kickoffs to morning courtyard filter coffee and plunge-pool mornings.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4">
            <Link
              to="/resort/rooms"
              className="sm:col-span-2 lg:col-span-6 relative aspect-[16/10] lg:aspect-auto lg:min-h-[340px] rounded-2xl overflow-hidden group border border-white/10"
            >
              <SmartImage
                src={ASSETS.poolVilla}
                alt="Private Pool Villa courtyard"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5">
                <span className="text-xs font-medium text-[#C89B54]">Boutique Stays</span>
                <h3 className="text-lg sm:text-xl font-bold text-white mt-0.5">
                  Private Plunge Pool Villas &amp; Suites
                </h3>
              </div>
            </Link>

            <Link
              to="/turf"
              className="lg:col-span-3 relative aspect-[4/3] lg:aspect-auto lg:min-h-[340px] rounded-2xl overflow-hidden group border border-white/10"
            >
              <SmartImage
                src={ASSETS.turfArena}
                alt="Floodlit FIFA turf ground"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5">
                <span className="text-xs font-medium text-blue-300">Floodlit Pitch</span>
                <h3 className="text-lg font-bold text-white mt-0.5">FIFA 7v7 Turf Arena</h3>
              </div>
            </Link>

            <div className="lg:col-span-3 grid grid-cols-2 lg:grid-cols-1 gap-4">
              <Link
                to="/restaurant/table-booking"
                className="relative aspect-[4/3] lg:aspect-auto lg:h-[162px] rounded-2xl overflow-hidden group border border-white/10"
              >
                <SmartImage
                  src={ASSETS.restaurantHall}
                  alt="Courtyard dining hall"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                <div className="absolute bottom-3.5 left-4 right-4">
                  <h3 className="text-sm sm:text-base font-bold text-white">Courtyard Dining</h3>
                </div>
              </Link>

              <Link
                to="/restaurant/menu"
                className="relative aspect-[4/3] lg:aspect-auto lg:h-[162px] rounded-2xl overflow-hidden group border border-white/10"
              >
                <SmartImage
                  src={ASSETS.biryaniHandi}
                  alt="Copper handi biryani"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                <div className="absolute bottom-3.5 left-4 right-4">
                  <h3 className="text-sm sm:text-base font-bold text-white">Copper-Handi Kitchen</h3>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Featured Resort Stays */}
      <section className="bg-white border-b border-slate-200 py-14 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="type-h2 font-bold text-slate-900">Featured Resort Stays</h2>
              <p className="text-sm text-slate-600 mt-1">
                Live inventory across 20 rooms with instant date-based confirmation.
              </p>
            </div>
            <Link
              to="/resort/rooms"
              className="text-sm font-semibold text-[#0B1628] hover:underline inline-flex items-center gap-1 whitespace-nowrap"
            >
              <span>All 5 room categories</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredRooms.map((room) => {
              const avail = getCategoryAvailableCount(room.id, today, tomorrow);
              return (
                <div
                  key={room.id}
                  className="border border-slate-200 rounded-2xl overflow-hidden flex flex-col bg-white group"
                >
                  <div className="aspect-[4/3] bg-slate-100 overflow-hidden">
                    <SmartImage
                      src={room.image}
                      alt={room.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                        <span>
                          {room.bedType} · {room.sizeSqFt} sq.ft
                        </span>
                        <span className="font-mono-tabular text-emerald-700 font-semibold">
                          {avail} open tonight
                        </span>
                      </div>
                      <h3 className="type-h3 font-bold text-slate-900">{room.name}</h3>
                      <p className="text-xs sm:text-sm text-slate-600 mt-1.5 line-clamp-2">
                        {room.description}
                      </p>
                    </div>
                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                      <div>
                        <span className="text-base sm:text-lg font-bold text-slate-900 font-mono-tabular">
                          {formatINR(room.weekdayPrice)}
                        </span>
                        <span className="text-xs text-slate-500"> / night</span>
                      </div>
                      <Link
                        to={`/resort/booking?category=${room.id}`}
                        className="inline-flex items-center justify-center min-h-[40px] px-4 py-2 bg-[#0B1628] text-white text-xs font-semibold rounded-xl hover:bg-[#172D4D] transition-colors"
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

      {/* 5. Signature Kitchen Favourites */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="type-h2 font-bold text-slate-900">Signature Kitchen Favourites</h2>
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
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col group"
              >
                <div className="aspect-[4/3] bg-slate-100 overflow-hidden">
                  <SmartImage
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <VegMarker isVeg={item.isVeg} />
                      <span className="text-[11px] text-slate-500 font-mono-tabular">
                        {item.prepTimeMins} min
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">{item.name}</h3>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2">{item.description}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-sm sm:text-base font-bold text-slate-900 font-mono-tabular">
                      {formatINR(item.price)}
                    </span>
                    {qty > 0 ? (
                      <div className="flex items-center gap-2.5 border border-orange-600 rounded-xl px-2.5 min-h-[40px] text-xs font-semibold text-orange-700">
                        <button
                          type="button"
                          onClick={() => updateCartQty(item.id, qty - 1)}
                          className="px-1.5 py-1 hover:text-orange-900"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="font-mono-tabular">{qty}</span>
                        <button
                          type="button"
                          onClick={() => addToCart(item.id, 1)}
                          className="px-1.5 py-1 hover:text-orange-900"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => addToCart(item.id, 1)}
                        className="inline-flex items-center gap-1 min-h-[40px] px-3.5 py-1.5 bg-orange-600 text-white text-xs font-semibold rounded-xl hover:bg-orange-700 transition-colors"
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
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0B1628] text-white px-5 py-4 rounded-2xl">
            <div className="flex items-center gap-3 text-sm">
              <ShoppingBag className="w-4 h-4 text-[#C89B54] shrink-0" />
              <span>
                <strong className="font-mono-tabular">
                  {cart.reduce((s, c) => s + c.quantity, 0)}
                </strong>{' '}
                item(s) waiting in your kitchen cart
              </span>
            </div>
            <Link
              to="/restaurant/cart"
              className="inline-flex items-center justify-center min-h-[42px] px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold rounded-xl transition-colors"
            >
              Review Cart &amp; Checkout
            </Link>
          </div>
        )}
      </section>

      {/* 6. Turf Promotion & Active Offers */}
      <section className="bg-white border-y border-slate-200 py-14 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          <div className="lg:col-span-7 bg-[#0B1628] text-white rounded-2xl p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
            <div>
              <p className="text-xs font-semibold text-[#C89B54] uppercase tracking-wider">
                Kaveri Arena Promotion
              </p>
              <h2 className="type-h2 font-bold text-white mt-2">
                Night Floodlight Matches &amp; Corporate Tournaments
              </h2>
              <p className="text-sm sm:text-base text-slate-300 mt-3 max-w-xl leading-relaxed">
                {turfConfig.specialOfferText}. Includes match bibs, FIFA-standard balls, chilled
                water, and shaded dugout seating.
              </p>
              <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-200">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Instant 1 &amp; 2-hour slot booking</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Zero double-booking slot guarantee</span>
                </li>
              </ul>
            </div>
            <div className="mt-8">
              <Link
                to="/turf/booking"
                className="inline-flex items-center justify-center gap-2 min-h-[44px] px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-xl transition-colors"
              >
                <CalendarCheck className="w-4 h-4" />
                <span>Check Live Turf Slots</span>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 border border-slate-200 rounded-2xl p-6 sm:p-8 bg-[#F8FAFC] flex flex-col justify-between">
            <div>
              <h3 className="type-h3 font-bold text-slate-900">Active Estate Offers</h3>
              <p className="text-xs text-slate-500 mt-1">
                Apply any promo code directly during checkout.
              </p>
              <div className="mt-4 divide-y divide-slate-200 border-t border-slate-200">
                {activeCoupons.map((c) => (
                  <div key={c.id} className="py-3.5 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-slate-900 truncate">{c.title}</div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {c.applicableService} · Min order {formatINR(c.minOrderAmount)}
                      </div>
                    </div>
                    <span className="font-mono-tabular text-xs font-bold text-[#0B1628] bg-white border border-slate-300 px-2.5 py-1 rounded-lg shrink-0">
                      {c.code}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Testimonials & Estate Campus Desk */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7">
            <h2 className="type-h2 font-bold text-slate-900 mb-6">Guest &amp; Captain Feedback</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between">
                <p className="text-sm text-slate-700 leading-relaxed">
                  “Our 14-member squad books the 7–9 PM floodlit slot every Friday and orders
                  Chicken Biryani for post-match dinner. One portal handles both without phone
                  follow-ups.”
                </p>
                <div className="mt-5 pt-3 border-t border-slate-100">
                  <div className="text-xs font-bold text-slate-900">Arun Kumar</div>
                  <div className="text-xs text-slate-500">
                    Captain, Kovai Strikers FC · 18 Turf Bookings
                  </div>
                </div>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between">
                <p className="text-sm text-slate-700 leading-relaxed">
                  “We stayed two nights in the Private Pool Villa with family and reserved Table 06
                  for Saturday dinner. Check-in took two minutes and the food arrived piping hot.”
                </p>
                <div className="mt-5 pt-3 border-t border-slate-100">
                  <div className="text-xs font-bold text-slate-900">Priya Menon</div>
                  <div className="text-xs text-slate-500">
                    Guest from Chennai · Villa &amp; Dining Stay
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <h3 className="type-h3 font-bold text-slate-900">Visit Kaveri Palms Estate</h3>
              <p className="text-xs text-slate-500 mt-1">
                Single campus with dedicated parking, reception desk, and sports clubhouse.
              </p>
              <div className="mt-5 space-y-3.5 text-sm text-slate-700">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#C89B54] mt-0.5 shrink-0" />
                  <span>
                    {settings.address}, {settings.city}
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#C89B54] shrink-0" />
                  <span className="font-mono-tabular">{settings.phone}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-[#C89B54] shrink-0" />
                  <span>
                    Turf: {settings.turfHours} · Kitchen: {settings.restaurantHours}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                to="/my-bookings"
                className="flex-1 inline-flex items-center justify-center min-h-[44px] px-4 py-2.5 bg-[#0B1628] text-white text-xs font-semibold rounded-xl hover:bg-[#172D4D] transition-colors"
              >
                Track My Bookings
              </Link>
              <Link
                to="/profile"
                className="inline-flex items-center justify-center min-h-[44px] px-4 py-2.5 border border-slate-200 text-slate-700 text-xs font-medium rounded-xl hover:bg-slate-50 transition-colors"
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
