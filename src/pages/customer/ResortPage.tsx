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
      {/* Resort Hero + Quick Search */}
      <section className="relative bg-[#172D4D] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            <div className="lg:col-span-6 flex flex-col justify-center">
              <p className="text-xs font-semibold text-emerald-300 tracking-wide">
                20 Boutique Rooms &amp; Private Pool Villas
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mt-2 text-balance">
                Restful architectural stays surrounded by palms &amp; foothills
              </h1>
              <p className="text-sm sm:text-base text-slate-300 mt-3 max-w-xl leading-relaxed">
                Choose across 5 curated categories—Standard, Deluxe, Premium, Family Suites, and
                Private Pool Villas—with live date-based inventory.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/resort/rooms"
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  Explore All 5 Categories
                </Link>
                <Link
                  to="/resort/booking"
                  className="px-5 py-2.5 border border-slate-500 text-white text-sm font-medium rounded-lg hover:bg-white/10 transition-colors"
                >
                  Direct Room Booking
                </Link>
              </div>
            </div>
            <div className="lg:col-span-6 min-h-[280px] rounded-xl overflow-hidden border border-slate-700/60">
              <SmartImage
                src={ASSETS.poolVilla}
                alt="Kaveri Palms Private Pool Villa"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Search Strip */}
          <form
            onSubmit={handleSearch}
            className="mt-10 bg-white text-slate-900 rounded-xl p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end shadow-sm"
          >
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Check-in Date
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="date"
                  min={today}
                  value={checkIn}
                  onChange={(e) => {
                    const val = e.target.value;
                    setCheckIn(val);
                    if (val >= checkOut) setCheckOut(addDays(val, 1));
                  }}
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs font-medium"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Check-out Date
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="date"
                  min={addDays(checkIn, 1)}
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs font-medium"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Adults
              </label>
              <div className="relative">
                <Users className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  value={adults}
                  onChange={(e) => setAdults(Number(e.target.value))}
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs font-medium bg-white"
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
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Children
              </label>
              <select
                value={children}
                onChange={(e) => setChildren(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium bg-white"
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
              className="w-full py-2.5 px-4 bg-[#172D4D] text-white text-xs font-semibold rounded-lg hover:bg-[#1e3a63] transition-colors"
            >
              Search Availability
            </button>
          </form>
        </div>
      </section>

      {/* Room Categories Overview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Room Categories &amp; Inventory</h2>
            <p className="text-sm text-slate-600 mt-1">
              {resortRooms.length} individual rooms across {roomCategories.length} categories
            </p>
          </div>
          <Link
            to="/resort/rooms"
            className="text-sm font-semibold text-emerald-700 hover:underline inline-flex items-center gap-1"
          >
            <span>Compare all rooms</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roomCategories.map((cat) => {
            const totalInCat = resortRooms.filter((r) => r.categoryId === cat.id).length;
            const avail = getCategoryAvailableCount(cat.id, checkIn, checkOut);
            return (
              <div
                key={cat.id}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col"
              >
                <div className="aspect-[4/3] bg-slate-100 overflow-hidden">
                  <SmartImage
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                      <span className="inline-flex items-center gap-1">
                        <BedDouble className="w-3.5 h-3.5" /> {cat.bedType}
                      </span>
                      <span className="font-mono-tabular text-emerald-700 font-semibold">
                        {avail} / {totalInCat} available
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">{cat.name}</h3>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                      {cat.description}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-500">
                      {cat.amenities.slice(0, 3).map((am) => (
                        <span key={am} className="inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {am}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-base font-bold text-slate-900 font-mono-tabular">
                        {formatINR(cat.weekdayPrice)}
                      </span>
                      <span className="text-xs text-slate-500"> / night</span>
                    </div>
                    <Link
                      to={`/resort/booking?category=${cat.id}&checkIn=${checkIn}&checkOut=${checkOut}&adults=${adults}&children=${children}`}
                      className="px-4 py-2 bg-emerald-700 text-white text-xs font-semibold rounded-lg hover:bg-emerald-800 transition-colors"
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
