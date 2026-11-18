import React, { useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  BedDouble,
  Home,
  Mail,
  MapPin,
  Menu,
  Phone,
  ShieldCheck,
  ShoppingBag,
  Trophy,
  User,
  UtensilsCrossed,
  X,
} from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';

export const CustomerLayout: React.FC = () => {
  const { cart, currentCustomer, settings } = usePlatform();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navLinks = [
    { to: '/', label: 'Home', end: true },
    { to: '/turf', label: 'Turf' },
    { to: '/resort', label: 'Resort' },
    { to: '/restaurant', label: 'Restaurant' },
    { to: '/my-bookings', label: 'My Bookings' },
  ];

  const isRouteActive = (prefix: string, exact = false) =>
    exact ? location.pathname === prefix : location.pathname.startsWith(prefix);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 pb-14 md:pb-0">
      {/* Top Bar: Static compact 56px on Mobile (< md), Sticky 64px 3-zone header on Tablet/Desktop (md+) */}
      <header className="md:sticky md:top-0 z-40 bg-[#0B1628] text-white border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 md:h-16 flex items-center justify-between gap-4 md:gap-8">
          {/* Zone 1: Single-line Brand Wordmark */}
          <Link
            to="/"
            className="text-lg sm:text-xl font-bold tracking-tight text-white whitespace-nowrap shrink-0 font-display"
          >
            Kaveri Palms
          </Link>

          {/* Zone 2: Clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-slate-300">
            {navLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `whitespace-nowrap shrink-0 transition-colors py-1.5 border-b-2 ${
                    isActive
                      ? 'text-white border-[#C89B54] font-semibold'
                      : 'border-transparent hover:text-white'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Zone 3: Action Cluster */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link
              to="/restaurant/cart"
              className="relative inline-flex items-center justify-center gap-1.5 min-h-[40px] px-2.5 sm:px-3 py-1.5 text-xs font-medium text-slate-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors whitespace-nowrap shrink-0"
              aria-label="Food cart"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {totalCartItems > 0 && (
                <span className="font-mono-tabular text-xs font-semibold text-[#C89B54]">
                  ({totalCartItems})
                </span>
              )}
            </Link>

            <Link
              to="/profile"
              className="hidden sm:inline-flex items-center gap-1.5 min-h-[40px] px-3 py-1.5 text-xs font-medium text-slate-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              <User className="w-4 h-4" />
              <span className="max-w-[100px] truncate">
                {currentCustomer ? currentCustomer.name.split(' ')[0] : 'Sign In'}
              </span>
            </Link>

            <Link
              to="/admin/dashboard"
              className="hidden sm:inline-flex items-center gap-1.5 min-h-[40px] px-4 py-1.5 text-xs font-semibold text-[#0B1628] bg-[#C89B54] hover:bg-[#d6aa63] rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Panel</span>
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile & Small-Tablet Slide-Out Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex justify-end">
          <div
            className="fixed inset-0 bg-[#071120]/70 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-80 max-w-[85vw] h-full bg-[#0B1628] text-white border-l border-white/10 flex flex-col justify-between z-10 p-5 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <span className="font-display font-bold text-lg tracking-tight text-white">
                  Kaveri Palms
                </span>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
                  aria-label="Close navigation menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="mt-5 space-y-1.5">
                {navLinks.map((item) => {
                  const active = isRouteActive(item.to, item.end);
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between min-h-[46px] px-4 rounded-xl text-sm font-medium transition-colors ${
                        active
                          ? 'bg-white/12 text-white font-semibold border border-white/15'
                          : 'text-slate-300 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <span>{item.label}</span>
                      {active && <span className="text-xs text-[#C89B54]">Active</span>}
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-6 pt-5 border-t border-white/10 space-y-2.5">
                <p className="px-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Direct Booking
                </p>
                <Link
                  to="/turf/booking"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between min-h-[44px] px-4 rounded-xl bg-blue-600/20 border border-blue-400/30 text-blue-200 text-xs font-semibold"
                >
                  <span>Reserve Turf Slot</span>
                  <span>→</span>
                </Link>
                <Link
                  to="/resort/booking"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between min-h-[44px] px-4 rounded-xl bg-emerald-600/20 border border-emerald-400/30 text-emerald-200 text-xs font-semibold"
                >
                  <span>Book Resort Stay</span>
                  <span>→</span>
                </Link>
                <Link
                  to="/restaurant/table-booking"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between min-h-[44px] px-4 rounded-xl bg-orange-600/20 border border-orange-400/30 text-orange-200 text-xs font-semibold"
                >
                  <span>Reserve Dining Table</span>
                  <span>→</span>
                </Link>
              </div>
            </div>

            <div className="pt-5 border-t border-white/10 space-y-2.5">
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 min-h-[44px] w-full px-4 border border-white/15 rounded-xl text-xs font-medium text-slate-200 hover:bg-white/10"
              >
                <User className="w-4 h-4" />
                <span>{currentCustomer ? currentCustomer.name : 'Guest Sign In'}</span>
              </Link>
              <Link
                to="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 min-h-[44px] w-full px-4 bg-[#C89B54] text-[#0B1628] rounded-xl text-xs font-bold"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Open Admin Panel</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Fixed Compact Bottom Quick-Action Bar on Mobile (< md) — 56px height (< 15% mobile sticky cap) */}
      <nav
        aria-label="Mobile quick navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0B1628]/95 backdrop-blur-md border-t border-white/10 pb-safe"
      >
        <div className="grid grid-cols-4 h-14">
          <Link
            to="/"
            className={`flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition-colors ${
              isRouteActive('/', true) ? 'text-[#C89B54]' : 'text-slate-300'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </Link>
          <Link
            to="/turf/booking"
            className={`flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition-colors ${
              isRouteActive('/turf') ? 'text-blue-400' : 'text-slate-300'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Turf</span>
          </Link>
          <Link
            to="/resort/booking"
            className={`flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition-colors ${
              isRouteActive('/resort') ? 'text-emerald-400' : 'text-slate-300'
            }`}
          >
            <BedDouble className="w-4 h-4" />
            <span>Resort</span>
          </Link>
          <Link
            to="/restaurant/menu"
            className={`relative flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition-colors ${
              isRouteActive('/restaurant') ? 'text-orange-400' : 'text-slate-300'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>
              Menu
              {totalCartItems > 0 ? ` (${totalCartItems})` : ''}
            </span>
          </Link>
        </div>
      </nav>

      {/* Coastal Hospitality Footer */}
      <footer className="bg-[#0B1628] text-slate-300 border-t border-white/10 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-white/10">
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight font-display">
                {settings.businessName}
              </h3>
              <p className="text-sm text-slate-400 mt-2.5 leading-relaxed">
                {settings.tagline}
              </p>
              <p className="text-xs text-[#C89B54] font-medium mt-3">
                Turf · Boutique Stays · Courtyard Kitchen
              </p>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-white tracking-wider uppercase mb-3.5">
                Experiences
              </h4>
              <ul className="space-y-2.5 text-sm text-slate-300">
                <li>
                  <Link to="/turf" className="hover:text-white transition-colors">
                    Turf Ground Booking
                  </Link>
                </li>
                <li>
                  <Link to="/resort/rooms" className="hover:text-white transition-colors">
                    Resort Rooms &amp; Villas
                  </Link>
                </li>
                <li>
                  <Link to="/restaurant/menu" className="hover:text-white transition-colors">
                    Online Food Ordering
                  </Link>
                </li>
                <li>
                  <Link
                    to="/restaurant/table-booking"
                    className="hover:text-white transition-colors"
                  >
                    Table Reservations
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-white tracking-wider uppercase mb-3.5">
                Guest Portal
              </h4>
              <ul className="space-y-2.5 text-sm text-slate-300">
                <li>
                  <Link to="/my-bookings" className="hover:text-white transition-colors">
                    My Bookings &amp; Orders
                  </Link>
                </li>
                <li>
                  <Link to="/profile" className="hover:text-white transition-colors">
                    Profile &amp; Saved Addresses
                  </Link>
                </li>
                <li>
                  <Link to="/admin/login" className="hover:text-white transition-colors">
                    Unified Admin Portal
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-white tracking-wider uppercase mb-3.5">
                Estate Desk
              </h4>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-[#C89B54]" />
                  <span>
                    {settings.address}, {settings.city}
                  </span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 shrink-0 text-[#C89B54]" />
                  <span className="font-mono-tabular">{settings.phone}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 shrink-0 text-[#C89B54]" />
                  <span className="break-all">{settings.email}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 text-center sm:text-left">
            <span>
              © {new Date().getFullYear()} {settings.businessName}. GSTIN: {settings.gstNumber}
            </span>
            <span className="font-mono-tabular">Asia/Kolkata (IST) · Currency INR (₹)</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
