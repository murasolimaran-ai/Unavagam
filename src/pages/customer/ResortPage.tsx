import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, BedDouble, Calendar, CheckCircle2, Users } from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { SmartImage } from '../../components/common/SmartImage';
import { ASSETS } from '../../utils/assets';
import { addDays, formatINR, getTodayIST } from '../../utils/format';

export const ResortPage: React.FC = () => {
  const { roomCategories, resortRooms, getCategoryAvailableCount } = usePlatform();
  const navigate = useNavigate();
  const today = getTodayIST();
  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(addDays(today, 2));
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(
      `/resort/rooms?checkIn=${checkIn}&checkOut=${checkOut}&adults=${adults}&children=${children}`
    );
  };

  return (
    <div className="space-y-12 pb-12">
      {/* Dark Coastal Resort Hero + Search */}
      <section className="relative bg-[#071120] text-white overflow-hidden">
        <div className="absolute inset-0">
          <SmartImage
            src={ASSETS.poolVilla}
            alt="Kaveri Palms Private Pool Villa"
            className="w-full h-full object-cover opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#071120]/95 via-[#0B1628]/80 to-[#0B1628]/50" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="max-w-2xl">
            <p className="text-xs sm:text-sm font-semibold text-emerald-400 tracking-wide">
              20 Boutique Rooms &amp; Private Pool Villas
            </p>
            <h1 className="type-h1 font-extrabold text-white mt-2">
              Restful architectural stays surrounded by palms &amp; foothills
            </h1>
            <p className="type-lead text-slate-300 mt-3 leading-relaxed">
              Choose across 5 curated categories—Standard, Deluxe, Premium, Family Suites, and
              Private Pool Villas—with live date-based inventory.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/resort/rooms"
                className="inline-flex items-center justify-center min-h-[44px] px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-xl transition-colors"
              >
                Explore All 5 Categories
              </Link>
              <Link
                to="/resort/booking"
                className="inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 border border-white/20 text-white text-sm font-medium rounded-xl hover:bg-white/10 transition-colors"
              >
                Direct Room Booking
              </Link>
            </div>
          </div>

          {/* Responsive Search Strip */}
          <form
            onSubmit={handleSearch}
            className="mt-10 bg-white text-slate-900 rounded-2xl p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 items-end shadow-xl"
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
                  value={checkIn}
                  onChange={(e) => {
                    const val = e.target.value;
                    setCheckIn(val);
                    if (val >= checkOut) setCheckOut(addDays(val, 1));
                  }}
                  className="w-full min-h-[44px] pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium"
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
                  min={addDays(checkIn, 1)}
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full min-h-[44px] pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Adults</label>
              <div className="relative">
                <Users className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={adults}
                  onChange={(e) => setAdults(Number(e.target.value))}
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
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Children</label>
              <select
                value={children}
                onChange={(e) => setChildren(Number(e.target.value))}
                className="w-full min-h-[44px] px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium bg-white"
              >
                {[0, 1, 2, 3, 4].map((n) => (
                  <option key={n} value={n}>
                    {n} Child{n !== 1 ? 'ren' : ''}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="w-full min-h-[44px] py-2.5 px-4 bg-[#0B1628] text-white text-xs sm:text-sm font-semibold rounded-xl hover:bg-[#172D4D] transition-colors sm:col-span-2 lg:col-span-1"
            >
              Search Availability
            </button>
          </form>
        </div>
      </section>

      {/* Room Categories Overview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="type-h2 font-bold text-slate-900">Room Categories &amp; Inventory</h2>
            <p className="text-sm text-slate-600 mt-1">
              {resortRooms.length} individual rooms across {roomCategories.length} categories
            </p>
          </div>
          <Link
            to="/resort/rooms"
            className="text-sm font-semibold text-emerald-700 hover:underline inline-flex items-center gap-1 whitespace-nowrap"
          >
            <span>Compare &amp; Book</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roomCategories.map((cat) => {
            const avail = getCategoryAvailableCount(cat.id, checkIn, checkOut);
            const totalUnits = resortRooms.filter((r) => r.categoryId === cat.id).length;
            return (
              <div
                key={cat.id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col group"
              >
                <div className="aspect-[16/10] bg-slate-100 overflow-hidden">
                  <SmartImage
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                      <span className="inline-flex items-center gap-1">
                        <BedDouble className="w-3.5 h-3.5 text-emerald-700" />
                        {cat.bedType}
                      </span>
                      <span className="font-mono-tabular font-semibold text-emerald-700">
                        {avail}/{totalUnits} open
                      </span>
                    </div>
                    <h3 className="type-h3 font-bold text-slate-900">{cat.name}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1.5 line-clamp-2">
                      {cat.description}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-600">
                      {cat.amenities.slice(0, 3).map((a) => (
                        <span key={a} className="inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {a}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-base sm:text-lg font-bold font-mono-tabular text-slate-900">
                        {formatINR(cat.weekdayPrice)}
                      </span>
                      <span className="text-xs text-slate-500"> / night</span>
                    </div>
                    <Link
                      to={`/resort/booking?category=${cat.id}&checkIn=${checkIn}&checkOut=${checkOut}&adults=${adults}&children=${children}`}
                      className="inline-flex items-center justify-center min-h-[40px] px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl transition-colors"
                    >
                      Book Now
                    </Link>
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
