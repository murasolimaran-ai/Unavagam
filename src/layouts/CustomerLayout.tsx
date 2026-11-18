import React, { useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  Menu,
  ShoppingBag,
  ShieldCheck,
  User,
  X,
  Phone,
  Mail,
  MapPin,
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

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900">
      {/* Top Bar Contract: 3 clean zones separated by gap-8 */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single-line Brand Wordmark */}
          <Link
            to="/"
            className="text-lg sm:text-xl font-bold tracking-tight text-[#172D4D] whitespace-nowrap shrink-0 font-display"
          >
            Kaveri Palms
          </Link>

          {/* Zone 2: Concise single-line navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            {navLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 ${
                    isActive
                      ? 'text-[#172D4D] border-[#172D4D] font-semibold'
                      : 'border-transparent hover:text-slate-900'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Zone 3: Action Cluster (Cart, Profile, Admin Portal) */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/restaurant/cart"
              className="relative inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap shrink-0"
              aria-label="Food cart"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {totalCartItems > 0 && (
                <span className="font-mono-tabular text-xs font-semibold text-orange-700">
                  ({totalCartItems})
                </span>
              )}
            </Link>

            <Link
              to="/profile"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              <User className="w-4 h-4" />
              <span className="max-w-[110px] truncate">
                {currentCustomer ? currentCustomer.name.split(' ')[0] : 'Sign In'}
              </span>
            </Link>

            <Link
              to="/admin/dashboard"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#172D4D] hover:bg-[#1e3a63] rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Panel</span>
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="md:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-2">
            {navLinks.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2.5 rounded-lg text-sm font-medium ${
                  location.pathname === item.to
                    ? 'bg-slate-100 text-[#172D4D] font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-slate-200 flex items-center gap-2">
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-800"
              >
                <User className="w-4 h-4" />
                <span>{currentCustomer ? currentCustomer.name : 'Account'}</span>
              </Link>
              <Link
                to="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 bg-[#172D4D] text-white rounded-lg text-xs font-semibold"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Panel</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Quiet Hospitality Footer */}
      <footer className="bg-[#172D4D] text-slate-200 border-t border-slate-800 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-700/60">
            <div className="md:col-span-1">
              <h3 className="text-lg font-bold text-white tracking-tight">
                {settings.businessName}
              </h3>
              <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                {settings.tagline}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-slate-300 tracking-wide mb-3">
                Services
              </h4>
              <ul className="space-y-2 text-sm text-slate-300">
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
              <h4 className="text-xs font-semibold text-slate-300 tracking-wide mb-3">
                Guest Portal
              </h4>
              <ul className="space-y-2 text-sm text-slate-300">
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
              <h4 className="text-xs font-semibold text-slate-300 tracking-wide mb-3">
                Estate Contact
              </h4>
              <ul className="space-y-2.5 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-slate-400" />
                  <span>
                    {settings.address}, {settings.city}
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 shrink-0 text-slate-400" />
                  <span className="font-mono-tabular">{settings.phone}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 shrink-0 text-slate-400" />
                  <span>{settings.email}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <span>
              © {new Date().getFullYear()} {settings.businessName}. GSTIN: {settings.gstNumber}
            </span>
            <span>Timezone: Asia/Kolkata (IST) · Currency: INR (₹)</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
