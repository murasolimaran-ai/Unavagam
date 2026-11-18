import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { BedDouble, Calendar, CheckCircle2, Maximize2, Users } from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { SmartImage } from '../../components/common/SmartImage';
import { Modal } from '../../components/common/Modal';
import { ResortRoomCategory } from '../../types';
import { addDays, formatDateShort, formatINR, getTodayIST } from '../../utils/format';

export const ResortRoomsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { roomCategories, resortRooms, getCategoryAvailableCount, settings } = usePlatform();
  const today = getTodayIST();

  const [checkIn, setCheckIn] = useState(searchParams.get('checkIn') || today);
  const [checkOut, setCheckOut] = useState(searchParams.get('checkOut') || addDays(today, 2));
  const [adults, setAdults] = useState(Number(searchParams.get('adults') || 2));
  const [children, setChildren] = useState(Number(searchParams.get('children') || 0));
  const [detailCat, setDetailCat] = useState<ResortRoomCategory | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-emerald-700">Kaveri Palms Resort</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-0.5">
            Explore Rooms &amp; Villas (20 Rooms)
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Live date-based availability · Check-in {settings.resortCheckInTime} · Check-out{' '}
            {settings.resortCheckOutTime}
          </p>
        </div>

        {/* Date & Guest Bar */}
        <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="date"
              min={today}
              value={checkIn}
              onChange={(e) => {
                setCheckIn(e.target.value);
                if (e.target.value >= checkOut) setCheckOut(addDays(e.target.value, 1));
              }}
              className="border border-slate-200 rounded-md px-2 py-1 text-xs"
            />
            <span className="text-slate-400">to</span>
            <input
              type="date"
              min={addDays(checkIn, 1)}
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="border border-slate-200 rounded-md px-2 py-1 text-xs"
            />
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={adults}
              onChange={(e) => setAdults(Number(e.target.value))}
              className="border border-slate-200 rounded-md px-2 py-1 text-xs bg-white"
            >
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>
                  {n} Adults
                </option>
              ))}
            </select>
            <select
              value={children}
              onChange={(e) => setChildren(Number(e.target.value))}
              className="border border-slate-200 rounded-md px-2 py-1 text-xs bg-white"
            >
              {[0, 1, 2, 3].map((n) => (
                <option key={n} value={n}>
                  {n} Children
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Category Rows */}
      <div className="space-y-6">
        {roomCategories.map((cat) => {
          const total = resortRooms.filter((r) => r.categoryId === cat.id).length;
          const available = getCategoryAvailableCount(cat.id, checkIn, checkOut);
          return (
            <div
              key={cat.id}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch"
            >
              <div className="lg:col-span-4 min-h-[220px] bg-slate-100">
                <SmartImage
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="lg:col-span-8 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                    <span>
                      {cat.bedType} · Max {cat.maxAdults} Adults, {cat.maxChildren} Child ·{' '}
                      {cat.sizeSqFt} sq.ft
                    </span>
                    <span
                      className={`font-mono-tabular font-semibold ${
                        available > 0 ? 'text-emerald-700' : 'text-rose-700'
                      }`}
                    >
                      {available} of {total} rooms available ({formatDateShort(checkIn)} –{' '}
                      {formatDateShort(checkOut)})
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-slate-900 mt-1.5">{cat.name}</h2>
                  <p className="text-sm text-slate-600 mt-2 leading-relaxed">{cat.description}</p>

                  {cat.specialOffer && (
                    <p className="text-xs font-medium text-emerald-700 mt-2">
                      Offer: {cat.specialOffer}
                    </p>
                  )}

                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-700">
                    {cat.amenities.map((am) => (
                      <span key={am} className="inline-flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{am}</span>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-baseline gap-4">
                    <div>
                      <span className="text-lg font-bold text-slate-900 font-mono-tabular">
                        {formatINR(cat.weekdayPrice)}
                      </span>
                      <span className="text-xs text-slate-500"> / weekday night</span>
                    </div>
                    <div className="text-xs text-slate-500 font-mono-tabular">
                      Weekend: {formatINR(cat.weekendPrice)}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setDetailCat(cat)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-200 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-50"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>View Details</span>
                    </button>
                    {available > 0 ? (
                      <Link
                        to={`/resort/booking?category=${cat.id}&checkIn=${checkIn}&checkOut=${checkOut}&adults=${adults}&children=${children}`}
                        className="px-5 py-2 bg-emerald-700 text-white text-xs font-semibold rounded-lg hover:bg-emerald-800 transition-colors"
                      >
                        Book Now
                      </Link>
                    ) : (
                      <span className="px-4 py-2 bg-slate-100 text-slate-400 text-xs font-semibold rounded-lg cursor-not-allowed">
                        Sold Out
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Modal */}
      <Modal
        open={Boolean(detailCat)}
        onClose={() => setDetailCat(null)}
        title={detailCat?.name || ''}
        subtitle={
          detailCat
            ? `${detailCat.bedType} · ${detailCat.sizeSqFt} sq.ft · Up to ${detailCat.maxAdults} Adults`
            : undefined
        }
        maxWidthClass="max-w-2xl"
      >
        {detailCat && (
          <div className="space-y-5">
            <div className="aspect-[16/9] rounded-lg overflow-hidden bg-slate-100">
              <SmartImage
                src={detailCat.image}
                alt={detailCat.name}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">{detailCat.description}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs">
              <div>
                <span className="text-slate-500">Weekday Tariff</span>
                <div className="font-bold font-mono-tabular text-slate-900 mt-0.5">
                  {formatINR(detailCat.weekdayPrice)}/night
                </div>
              </div>
              <div>
                <span className="text-slate-500">Weekend Tariff</span>
                <div className="font-bold font-mono-tabular text-slate-900 mt-0.5">
                  {formatINR(detailCat.weekendPrice)}/night
                </div>
              </div>
              <div>
                <span className="text-slate-500">Extra Bed</span>
                <div className="font-bold font-mono-tabular text-slate-900 mt-0.5">
                  {formatINR(detailCat.extraBedPrice)}/night
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-700 mb-2">Room Units &amp; Amenities</h4>
              <div className="flex flex-wrap gap-2 text-xs text-slate-600 mb-3">
                {resortRooms
                  .filter((r) => r.categoryId === detailCat.id)
                  .map((r) => (
                    <span
                      key={r.id}
                      className="px-2.5 py-1 bg-slate-100 rounded border border-slate-200 font-mono-tabular"
                    >
                      Room {r.roomNumber} ({r.status})
                    </span>
                  ))}
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-700">
                {detailCat.amenities.map((a) => (
                  <span key={a} className="inline-flex items-center gap-1.5">
                    <BedDouble className="w-3.5 h-3.5 text-emerald-600" /> {a}
                  </span>
                ))}
              </div>
            </div>
            <div className="pt-3 border-t border-slate-200 flex justify-end">
              <Link
                to={`/resort/booking?category=${detailCat.id}&checkIn=${checkIn}&checkOut=${checkOut}&adults=${adults}&children=${children}`}
                className="px-5 py-2.5 bg-emerald-700 text-white text-xs font-semibold rounded-lg hover:bg-emerald-800"
              >
                Proceed to Book {detailCat.name}
              </Link>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
