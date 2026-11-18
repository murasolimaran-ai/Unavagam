import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { Modal } from '../../components/common/Modal';
import { StatusLabel } from '../../components/common/StatusLabel';
import { StaffRole } from '../../types';
import { formatDateShort, getTodayIST } from '../../utils/format';

const ROLES: StaffRole[] = [
  'Super Admin',
  'Turf Manager',
  'Resort Manager',
  'Restaurant Manager',
  'Reception Staff',
  'Kitchen Staff',
];

export const AdminStaffPage: React.FC = () => {
  const { staff, addStaff, updateStaff } = usePlatform();
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<StaffRole>('Reception Staff');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addStaff({
      name,
      email,
      phone,
      role,
      active: true,
      joinedDate: getTodayIST(),
    });
    setModalOpen(false);
    setName('');
    setEmail('');
    setPhone('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Staff &amp; Role Structure
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Demo operates under a single Super Admin account; role structures are ready for multi-staff access.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#172D4D] text-white text-xs font-semibold rounded-lg self-start"
        >
          <Plus className="w-3.5 h-3.5" /> Add Staff Member
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase">
                <th className="py-3 px-4">Staff ID</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Joined</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {staff.map((s) => (
                <tr key={s.id}>
                  <td className="py-3 px-4 font-mono-tabular font-semibold">{s.id}</td>
                  <td className="py-3 px-4 font-semibold text-slate-900">{s.name}</td>
                  <td className="py-3 px-4">
                    <select
                      value={s.role}
                      onChange={(e) => updateStaff(s.id, { role: e.target.value as StaffRole })}
                      className="px-2 py-1 border border-slate-200 rounded text-xs bg-white"
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{s.email}</td>
                  <td className="py-3 px-4 font-mono-tabular text-slate-600">{s.phone}</td>
                  <td className="py-3 px-4 font-mono-tabular text-slate-500">
                    {formatDateShort(s.joinedDate)}
                  </td>
                  <td className="py-3 px-4">
                    <StatusLabel status={s.active ? 'Confirmed' : 'Cancelled'} />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => updateStaff(s.id, { active: !s.active })}
                      className="px-2.5 py-1 border border-slate-200 rounded text-[11px] font-medium hover:bg-slate-50"
                    >
                      {s.active ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Permission Reference */}
      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <h2 className="text-sm font-bold text-slate-900 mb-3">Role Access Architecture</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {[
            { role: 'Super Admin', scope: 'Full access across Turf, Resort, Restaurant, CRM, Payments & Settings' },
            { role: 'Turf Manager', scope: 'Turf Calendar, Slot Blocking, Bookings & Turf Pricing' },
            { role: 'Resort Manager', scope: 'Room Inventory, Availability Matrix, Check-in/out & Pricing' },
            { role: 'Restaurant Manager', scope: 'Menu, Categories, Live Orders, Tables & Reservations' },
            { role: 'Reception Staff', scope: 'Guest Check-in/Check-out, Table Seating & Desk Payments' },
            { role: 'Kitchen Staff', scope: 'Kitchen Order Display (KDS) & Food Preparation Status' },
          ].map((item) => (
            <div key={item.role} className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="font-bold text-slate-900">{item.role}</div>
              <div className="text-slate-600 mt-1 leading-relaxed">{item.scope}</div>
            </div>
          ))}
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Staff Member">
        <form onSubmit={handleAdd} className="space-y-3.5">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as StaffRole)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 border border-slate-200 rounded-lg text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#172D4D] text-white rounded-lg text-xs font-semibold"
            >
              Add Staff
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
