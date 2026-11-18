import React, { useState } from 'react';
import { Pencil, Plus, Users } from 'lucide-react';
import { usePlatform } from '../../../context/PlatformContext';
import { StatusLabel } from '../../../components/common/StatusLabel';
import { Modal } from '../../../components/common/Modal';
import { RestaurantTable, TableStatus } from '../../../types';

export const AdminTablesPage: React.FC = () => {
  const { restaurantTables, updateTableStatus, addTable, updateTable } = usePlatform();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<RestaurantTable | null>(null);
  const [tableNumber, setTableNumber] = useState('');
  const [seats, setSeats] = useState(4);
  const [zone, setZone] = useState<RestaurantTable['zone']>('Garden Courtyard');
  const [status, setStatus] = useState<TableStatus>('Available');

  const openAdd = () => {
    setEditing(null);
    setTableNumber(`Table 0${restaurantTables.length + 1}`);
    setSeats(4);
    setZone('Garden Courtyard');
    setStatus('Available');
    setModalOpen(true);
  };

  const openEdit = (t: RestaurantTable) => {
    setEditing(t);
    setTableNumber(t.tableNumber);
    setSeats(t.seats);
    setZone(t.zone);
    setStatus(t.status);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      updateTable(editing.id, { tableNumber, seats, zone, status });
    } else {
      addTable({ tableNumber, seats, zone, status });
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="type-h1 text-[#0B1628]">Table Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage dining hall &amp; courtyard tables, seating capacities, and live occupancy.
          </p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="min-h-[40px] inline-flex items-center gap-1.5 px-4 py-2 bg-[#0B1628] text-white text-xs font-semibold rounded-xl hover:bg-[#172D4D] transition-colors self-start"
        >
          <Plus className="w-3.5 h-3.5" /> Add Table
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {restaurantTables.map((t) => (
          <div
            key={t.id}
            className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between gap-4"
          >
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">{t.tableNumber}</h3>
                <StatusLabel status={t.status} />
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-600 mt-2">
                <span className="inline-flex items-center gap-1 font-mono-tabular">
                  <Users className="w-3.5 h-3.5 text-slate-400" /> {t.seats} Seats
                </span>
                <span>· {t.zone}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <select
                value={t.status}
                onChange={(e) => updateTableStatus(t.id, e.target.value as TableStatus)}
                className="px-2.5 py-1.5 border border-slate-200 rounded-md text-xs bg-white"
              >
                <option value="Available">Available</option>
                <option value="Reserved">Reserved</option>
                <option value="Occupied">Occupied</option>
                <option value="Maintenance">Maintenance</option>
              </select>
              <button
                type="button"
                onClick={() => openEdit(t)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-md"
              >
                <Pencil className="w-3.5 h-3.5" /> Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? `Edit ${editing.tableNumber}` : 'Add Restaurant Table'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Table Name</label>
              <input
                type="text"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Seats</label>
              <input
                type="number"
                min={2}
                max={16}
                value={seats}
                onChange={(e) => setSeats(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono-tabular"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Dining Zone</label>
              <select
                value={zone}
                onChange={(e) => setZone(e.target.value as RestaurantTable['zone'])}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
              >
                <option value="Indoor Hall">Indoor Hall</option>
                <option value="Garden Courtyard">Garden Courtyard</option>
                <option value="Private Alcove">Private Alcove</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TableStatus)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
              >
                <option value="Available">Available</option>
                <option value="Reserved">Reserved</option>
                <option value="Occupied">Occupied</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
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
              Save Table
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
