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
      <div className="max-w-lg mx-auto px-4 py-14">
        <div className="bg-white border border-slate-200 rounded-xl p-8">
          <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-lg mb-6">
            <button
              type="button"
              onClick={() => setAuthTab('login')}
              className={`flex-1 py-2 text-xs font-semibold rounded-md ${
                authTab === 'login' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setAuthTab('register')}
              className={`flex-1 py-2 text-xs font-semibold rounded-md ${
                authTab === 'register' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Create Account
            </button>
          </div>

          {authError && (
            <p className="mb-4 text-xs text-rose-700 bg-rose-50 border border-rose-200 p-3 rounded-lg">
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
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-[#172D4D] text-white text-sm font-semibold rounded-lg hover:bg-[#1e3a63]"
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
                      className="px-2.5 py-1.5 border border-slate-200 rounded-md text-xs text-slate-700 hover:bg-slate-50"
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
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm"
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
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-[#172D4D] text-white text-sm font-semibold rounded-lg"
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#172D4D] text-white flex items-center justify-center font-bold">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{currentCustomer.name}</h1>
            <p className="text-xs text-slate-500 font-mono-tabular">
              {currentCustomer.id} · {currentCustomer.email}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/my-bookings"
            className="px-4 py-2 border border-slate-200 bg-white text-xs font-semibold text-slate-700 rounded-lg hover:bg-slate-50"
          >
            My Bookings
          </Link>
          <button
            type="button"
            onClick={logoutCustomer}
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-rose-200 text-rose-700 text-xs font-semibold rounded-lg hover:bg-rose-50"
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
            className="bg-white border border-slate-200 rounded-xl p-6 space-y-4"
          >
            <h2 className="text-base font-bold text-slate-900">Personal Information</h2>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Phone</label>
              <input
                type="tel"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-emerald-700">{savedNotice}</span>
              <button
                type="submit"
                className="px-4 py-2 bg-[#172D4D] text-white text-xs font-semibold rounded-lg"
              >
                Save Changes
              </button>
            </div>
          </form>

          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-900">Saved Delivery Addresses</h2>
            <div className="space-y-2">
              {currentCustomer.savedAddresses.map((addr, i) => (
                <div
                  key={i}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 flex items-start gap-2"
                >
                  <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
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
                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-xs"
              />
              <button
                type="button"
                onClick={handleAddAddress}
                className="inline-flex items-center gap-1 px-3 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>
        </div>

        {/* Payment History */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Payment History</h2>
            <span className="text-xs font-mono-tabular text-slate-500">
              {customerPayments.length} transaction(s)
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase">
                  <th className="py-2.5 px-4">Transaction</th>
                  <th className="py-2.5 px-4">Booking</th>
                  <th className="py-2.5 px-4">Method</th>
                  <th className="py-2.5 px-4">Date</th>
                  <th className="py-2.5 px-4 text-right">Amount</th>
                  <th className="py-2.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {customerPayments.map((p) => (
                  <tr key={p.id}>
                    <td className="py-2.5 px-4 font-mono-tabular font-semibold">{p.id}</td>
                    <td className="py-2.5 px-4">
                      <span className="font-mono-tabular">{p.bookingId}</span> · {p.service}
                    </td>
                    <td className="py-2.5 px-4">{p.method}</td>
                    <td className="py-2.5 px-4 font-mono-tabular text-slate-500">
                      {formatDateTimeIST(p.date)}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono-tabular font-semibold">
                      {formatINR(p.amount)}
                    </td>
                    <td className="py-2.5 px-4">
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
