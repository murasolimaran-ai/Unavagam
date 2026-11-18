import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LogOut, MapPin, Plus, User } from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { StatusLabel } from '../../components/common/StatusLabel';
import { formatDateTimeIST, formatINR } from '../../utils/format';

export const ProfilePage: React.FC = () => {
  const {
    currentCustomer,
    customers,
    loginCustomer,
    registerCustomer,
    logoutCustomer,
    updateCustomerProfile,
    payments,
  } = usePlatform();

  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');
  const [loginInput, setLoginInput] = useState('arun.kumar@example.in');
  const [authError, setAuthError] = useState('');

  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regAddress, setRegAddress] = useState('');

  const [editName, setEditName] = useState(currentCustomer?.name || '');
  const [editPhone, setEditPhone] = useState(currentCustomer?.phone || '');
  const [editEmail, setEditEmail] = useState(currentCustomer?.email || '');
  const [newAddress, setNewAddress] = useState('');
  const [savedNotice, setSavedNotice] = useState('');

  useEffect(() => {
    if (currentCustomer) {
      setEditName(currentCustomer.name);
      setEditPhone(currentCustomer.phone);
      setEditEmail(currentCustomer.email);
    }
  }, [currentCustomer]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const res = loginCustomer(loginInput);
    if (!res.ok) setAuthError(res.error || 'Login failed');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!regName.trim() || !regEmail.trim() || !regPhone.trim()) {
      setAuthError('All fields are required.');
      return;
    }
    registerCustomer({
      name: regName,
      email: regEmail,
      phone: regPhone,
      address: regAddress,
    });
  };

  if (!currentCustomer) {
    return (
      <div className="max-w-lg mx-auto px-4 py-12 sm:py-16">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8">
          <h1 className="type-h2 font-bold text-slate-900 mb-1">Guest Portal</h1>
          <p className="text-xs text-slate-500 mb-5">
            Access your bookings, saved addresses, and payment receipts.
          </p>

          <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => setAuthTab('login')}
              className={`flex-1 min-h-[40px] py-2 text-xs font-semibold rounded-lg transition-colors ${
                authTab === 'login' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setAuthTab('register')}
              className={`flex-1 min-h-[40px] py-2 text-xs font-semibold rounded-lg transition-colors ${
                authTab === 'register' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Create Account
            </button>
          </div>

          {authError && (
            <p className="mb-4 text-xs text-rose-700 bg-rose-50 border border-rose-200 p-3 rounded-xl">
              {authError}
            </p>
          )}

          {authTab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Email or Mobile Number
                </label>
                <input
                  type="text"
                  value={loginInput}
                  onChange={(e) => setLoginInput(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm"
                />
              </div>
              <button
                type="submit"
                className="w-full min-h-[44px] py-2.5 bg-[#0B1628] text-white text-sm font-semibold rounded-xl hover:bg-[#172D4D] transition-colors"
              >
                Sign In to Guest Portal
              </button>

              <div className="pt-4 border-t border-slate-100">
                <p className="text-[11px] font-semibold text-slate-500 mb-2">
                  Quick Demo Accounts
                </p>
                <div className="flex flex-wrap gap-2">
                  {customers.slice(0, 4).map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => loginCustomer(c.email)}
                      className="min-h-[38px] px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-700 hover:bg-slate-50"
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2 border border-slate-200 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2 border border-slate-200 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2 border border-slate-200 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Delivery Address (Optional)
                </label>
                <input
                  type="text"
                  value={regAddress}
                  onChange={(e) => setRegAddress(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2 border border-slate-200 rounded-xl text-sm"
                />
              </div>
              <button
                type="submit"
                className="w-full min-h-[44px] py-2.5 bg-[#0B1628] text-white text-sm font-semibold rounded-xl hover:bg-[#172D4D]"
              >
                Register Account
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  const customerPayments = payments.filter((p) => p.customerId === currentCustomer.id);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateCustomerProfile(currentCustomer.id, {
      name: editName || currentCustomer.name,
      phone: editPhone || currentCustomer.phone,
      email: editEmail || currentCustomer.email,
    });
    setSavedNotice('Profile updated.');
    setTimeout(() => setSavedNotice(''), 2500);
  };

  const handleAddAddress = () => {
    if (!newAddress.trim()) return;
    updateCustomerProfile(currentCustomer.id, {
      savedAddresses: [...currentCustomer.savedAddresses, newAddress.trim()],
    });
    setNewAddress('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#0B1628] text-[#C89B54] flex items-center justify-center font-bold shrink-0">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h1 className="type-h1 font-bold text-slate-900">{currentCustomer.name}</h1>
            <p className="text-xs text-slate-500 font-mono-tabular">
              {currentCustomer.id} · {currentCustomer.email}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/my-bookings"
            className="inline-flex items-center justify-center min-h-[42px] px-4 py-2 border border-slate-200 bg-white text-xs font-semibold text-slate-700 rounded-xl hover:bg-slate-50"
          >
            My Bookings
          </Link>
          <button
            type="button"
            onClick={logoutCustomer}
            className="inline-flex items-center justify-center gap-1.5 min-h-[42px] px-4 py-2 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl hover:bg-rose-50"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Profile & Addresses */}
        <div className="lg:col-span-5 space-y-6">
          <form
            onSubmit={handleSaveProfile}
            className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4"
          >
            <h2 className="type-h3 font-bold text-slate-900">Personal Information</h2>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full min-h-[42px] px-3 py-2 border border-slate-200 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Phone</label>
              <input
                type="tel"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                className="w-full min-h-[42px] px-3 py-2 border border-slate-200 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                className="w-full min-h-[42px] px-3 py-2 border border-slate-200 rounded-xl text-sm"
              />
            </div>
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-emerald-700 font-medium">{savedNotice}</span>
              <button
                type="submit"
                className="min-h-[42px] px-5 py-2 bg-[#0B1628] text-white text-xs font-semibold rounded-xl hover:bg-[#172D4D]"
              >
                Save Changes
              </button>
            </div>
          </form>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
            <h2 className="type-h3 font-bold text-slate-900">Saved Delivery Addresses</h2>
            <div className="space-y-2">
              {currentCustomer.savedAddresses.map((addr, i) => (
                <div
                  key={i}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 flex items-start gap-2"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#C89B54] mt-0.5 shrink-0" />
                  <span>{addr}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                placeholder="Add new Coimbatore address..."
                className="flex-1 min-h-[42px] px-3 py-2 border border-slate-200 rounded-xl text-xs"
              />
              <button
                type="button"
                onClick={handleAddAddress}
                className="inline-flex items-center gap-1 min-h-[42px] px-4 py-2 bg-[#0B1628] text-white text-xs font-semibold rounded-xl hover:bg-[#172D4D]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>
        </div>

        {/* Payment History: Mobile Cards + Desktop Table */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex items-center justify-between">
            <h2 className="type-h3 font-bold text-slate-900">Payment History</h2>
            <span className="text-xs font-mono-tabular text-slate-500">
              {customerPayments.length} transaction(s)
            </span>
          </div>

          {/* Mobile Card Stack (< md) */}
          <div className="md:hidden divide-y divide-slate-100">
            {customerPayments.map((p) => (
              <div key={p.id} className="p-4 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono-tabular font-bold text-slate-900">{p.id}</span>
                  <StatusLabel status={p.status} />
                </div>
                <div className="text-slate-600">
                  <span className="font-mono-tabular">{p.bookingId}</span> · {p.service} ·{' '}
                  {p.method}
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="font-mono-tabular text-slate-500">
                    {formatDateTimeIST(p.date)}
                  </span>
                  <span className="font-mono-tabular font-bold text-slate-900 text-sm">
                    {formatINR(p.amount)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table (md+) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase">
                  <th className="py-3 px-4">Transaction</th>
                  <th className="py-3 px-4">Booking</th>
                  <th className="py-3 px-4">Method</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {customerPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-mono-tabular font-semibold">{p.id}</td>
                    <td className="py-3 px-4">
                      <span className="font-mono-tabular">{p.bookingId}</span> · {p.service}
                    </td>
                    <td className="py-3 px-4">{p.method}</td>
                    <td className="py-3 px-4 font-mono-tabular text-slate-500">
                      {formatDateTimeIST(p.date)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono-tabular font-semibold">
                      {formatINR(p.amount)}
                    </td>
                    <td className="py-3 px-4">
                      <StatusLabel status={p.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
