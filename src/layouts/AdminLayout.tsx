import React, { useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  BedDouble,
  Bell,
  Calendar,
  CalendarCheck,
  ChefHat,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  CreditCard,
  ExternalLink,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Settings,
  Tag,
  Trophy,
  UserCog,
  Users,
  UtensilsCrossed,
  X,
  IndianRupee,
  LogIn,
} from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';

interface NavGroup {
  id: string;
  label: string;
  accentColor: string;
  items: { to: string; label: string; icon: React.ComponentType<{ className?: string }> }[];
}

export const AdminLayout: React.FC = () => {
  const { isAdminAuthenticated, logoutAdmin, notifications, settings } = usePlatform();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    turf: true,
    resort: true,
    restaurant: true,
    common: true,
  });

  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-xl p-8 text-center">
          <h2 className="text-xl font-bold text-[#172D4D]">Admin Session Required</h2>
          <p className="text-sm text-slate-600 mt-2">
            Sign in with the unified Super Admin account to manage Turf, Resort, and Restaurant operations.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <Link
              to="/admin/login"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#172D4D] text-white text-sm font-semibold rounded-lg hover:bg-[#1e3a63] transition-colors"
            >
              <LogIn className="w-4 h-4" />
              <span>Go to Admin Login</span>
            </Link>
            <Link
              to="/"
              className="text-xs font-medium text-slate-600 hover:text-slate-900"
            >
              Return to Customer Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  const groups: NavGroup[] = [
    {
      id: 'turf',
      label: 'Turf Management',
      accentColor: 'text-blue-600',
      items: [
        { to: '/admin/turf', label: 'Turf Overview', icon: Trophy },
        { to: '/admin/turf/bookings', label: 'Bookings', icon: ClipboardList },
        { to: '/admin/turf/calendar', label: 'Slot Calendar', icon: Calendar },
        { to: '/admin/turf/pricing', label: 'Pricing & Offers', icon: IndianRupee },
      ],
    },
    {
      id: 'resort',
      label: 'Resort Management',
      accentColor: 'text-emerald-600',
      items: [
        { to: '/admin/resort', label: 'Resort Overview', icon: BedDouble },
        { to: '/admin/resort/bookings', label: 'Room Bookings', icon: ClipboardList },
        { to: '/admin/resort/rooms', label: 'Room Inventory', icon: FolderKanban },
        { to: '/admin/resort/availability', label: 'Room Availability', icon: Calendar },
        { to: '/admin/resort/check-in-out', label: 'Check-in / Check-out', icon: CalendarCheck },
        { to: '/admin/resort/pricing', label: 'Pricing', icon: IndianRupee },
      ],
    },
    {
      id: 'restaurant',
      label: 'Restaurant Management',
      accentColor: 'text-orange-600',
      items: [
        { to: '/admin/restaurant', label: 'Restaurant Overview', icon: UtensilsCrossed },
        { to: '/admin/restaurant/orders', label: 'Food Orders', icon: ClipboardList },
        { to: '/admin/restaurant/kitchen', label: 'Kitchen Display (KDS)', icon: ChefHat },
        { to: '/admin/restaurant/menu', label: 'Menu Management', icon: UtensilsCrossed },
        { to: '/admin/restaurant/categories', label: 'Categories', icon: FolderKanban },
        { to: '/admin/restaurant/tables', label: 'Table Management', icon: LayoutDashboard },
        { to: '/admin/restaurant/reservations', label: 'Table Reservations', icon: CalendarCheck },
      ],
    },
    {
      id: 'common',
      label: 'Common Management',
      accentColor: 'text-slate-700',
      items: [
        { to: '/admin/bookings', label: 'All Bookings', icon: ClipboardList },
        { to: '/admin/customers', label: 'Customers', icon: Users },
        { to: '/admin/payments', label: 'Payments & Transactions', icon: CreditCard },
        { to: '/admin/coupons', label: 'Coupons & Offers', icon: Tag },
        { to: '/admin/notifications', label: 'Notifications', icon: Bell },
        { to: '/admin/reports', label: 'Reports & Analytics', icon: BarChart3 },
        { to: '/admin/staff', label: 'Staff Management', icon: UserCog },
        { to: '/admin/settings', label: 'Settings', icon: Settings },
      ],
    },
  ];

  const toggleGroup = (id: string) => {
    setExpandedGroups((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleGlobalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/admin/bookings?q=${encodeURIComponent(searchQuery.trim())}`);
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white border-r border-slate-200">
      <div className="h-16 px-5 flex items-center justify-between border-b border-slate-200 shrink-0">
        <Link to="/admin/dashboard" className="font-display font-bold text-base text-[#172D4D] truncate">
          {settings.businessName}
        </Link>
        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden p-1.5 text-slate-500 hover:text-slate-900 rounded-md"
          aria-label="Close sidebar"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        <div>
          <p className="px-3 mb-1.5 text-[11px] font-semibold text-slate-400 tracking-wider uppercase">
            Overview
          </p>
          <NavLink
            to="/admin/dashboard"
            end
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[#172D4D] text-white'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`
            }
          >
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            <span>Dashboard</span>
          </NavLink>
        </div>

        {groups.map((group) => {
          const isOpen = expandedGroups[group.id];
          return (
            <div key={group.id}>
              <button
                type="button"
                onClick={() => toggleGroup(group.id)}
                className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-semibold tracking-wider uppercase text-slate-500 hover:text-slate-900"
              >
                <span className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-xs bg-current ${group.accentColor}`} />
                  <span>{group.label}</span>
                </span>
                {isOpen ? (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>
              {isOpen && (
                <div className="mt-1 space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        end={
                          item.to === '/admin/turf' ||
                          item.to === '/admin/resort' ||
                          item.to === '/admin/restaurant'
                        }
                        onClick={() => setSidebarOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors ${
                            isActive
                              ? 'bg-slate-100 text-[#172D4D] font-semibold'
                              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                          }`
                        }
                      >
                        <span className="flex items-center gap-2.5 min-w-0">
                          <Icon className={`w-4 h-4 shrink-0 ${group.accentColor}`} />
                          <span className="truncate">{item.label}</span>
                        </span>
                        {item.to === '/admin/notifications' && unreadCount > 0 && (
                          <span className="font-mono-tabular text-[11px] font-semibold text-rose-700">
                            {unreadCount}
                          </span>
                        )}
                      </NavLink>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="p-3 border-t border-slate-200 space-y-1.5">
        <Link
          to="/"
          className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <span>Customer Website</span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-rose-700 hover:bg-rose-50 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  // Derive breadcrumb from path
  const segments = location.pathname.replace('/admin/', '').split('/').filter(Boolean);
  const breadcrumb = segments.length
    ? segments.map((s) => s.replace(/-/g, ' ')).join(' / ')
    : 'Dashboard';

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] h-full z-10">
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Main Content Shell */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
              aria-label="Open admin menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="text-sm font-medium text-slate-500 capitalize truncate">
              Admin <span className="text-slate-300 mx-1">/</span>{' '}
              <span className="text-slate-900 font-semibold">{breadcrumb}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <form onSubmit={handleGlobalSearch} className="hidden md:block relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ID, customer..."
                className="pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg w-52 focus:outline-none focus:border-[#172D4D] focus:bg-white"
              />
            </form>

            <Link
              to="/admin/notifications"
              className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 bg-rose-600 text-white text-[10px] font-mono-tabular font-semibold rounded flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Link>

            <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-slate-200">
              <div className="w-7 h-7 rounded-lg bg-[#172D4D] text-white text-xs font-semibold flex items-center justify-center">
                SA
              </div>
              <div className="leading-tight">
                <div className="text-xs font-semibold text-slate-900">Vigneshwaran M</div>
                <div className="text-[11px] text-slate-500">Super Admin</div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1440px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
