import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Lock, ShieldCheck } from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';

export const AdminLoginPage: React.FC = () => {
  const { loginAdmin, settings } = usePlatform();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@kaveripalms.in');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = loginAdmin(email, password);
    if (!res.ok) {
      setError(res.error || 'Authentication failed');
      return;
    }
    navigate('/admin/dashboard');
  };

  const handleQuickDemo = () => {
    loginAdmin('admin@kaveripalms.in', 'admin123');
    navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl p-8">
        <div className="flex items-center gap-2.5 text-[#172D4D] mb-2">
          <ShieldCheck className="w-6 h-6" />
          <span className="font-display font-bold text-lg">{settings.businessName}</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Unified Admin Portal
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          One Super Admin account for Turf, Resort, Restaurant, CRM &amp; Finance.
        </p>

        {error && (
          <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-xs text-rose-800">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Admin Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#172D4D]"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#172D4D]"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-[#172D4D] hover:bg-[#1e3a63] text-white text-sm font-semibold rounded-lg transition-colors"
          >
            Sign In to Admin Dashboard
          </button>
        </form>

        <div className="mt-5 p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-2">
          <div className="flex justify-between text-slate-600">
            <span>Demo Email:</span>
            <span className="font-mono-tabular font-semibold text-slate-900">
              admin@kaveripalms.in
            </span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Demo Password:</span>
            <span className="font-mono-tabular font-semibold text-slate-900">admin123</span>
          </div>
          <button
            type="button"
            onClick={handleQuickDemo}
            className="w-full mt-1 py-2 border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 font-semibold rounded-md transition-colors"
          >
            1-Click Demo Super Admin Login
          </button>
        </div>

        <div className="mt-6 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Customer Website</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
