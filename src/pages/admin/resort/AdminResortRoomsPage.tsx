import React, { useState } from 'react';
import { Pencil, Plus } from 'lucide-react';
import { usePlatform } from '../../../context/PlatformContext';
import { StatusLabel } from '../../../components/common/StatusLabel';
import { Modal } from '../../../components/common/Modal';
import { ResortRoom, ResortRoomCategory, RoomStatus } from '../../../types';
import { IMAGE_GALLERY_OPTIONS } from '../../../utils/assets';
import { formatINR } from '../../../utils/format';

export const AdminResortRoomsPage: React.FC = () => {
  const {
    roomCategories,
    resortRooms,
    updateRoomStatus,
    addResortRoom,
    updateResortRoom,
    addResortCategory,
    updateResortCategory,
  } = usePlatform();

  const [tab, setTab] = useState<'rooms' | 'categories'>('rooms');
  const [catFilter, setCatFilter] = useState('ALL');

  // Room Modal
  const [roomModalOpen, setRoomModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<ResortRoom | null>(null);
  const [rmNumber, setRmNumber] = useState('');
  const [rmCatId, setRmCatId] = useState(roomCategories[0]?.id || 'CAT-STD');
  const [rmFloor, setRmFloor] = useState('Ground Wing');
  const [rmStatus, setRmStatus] = useState<RoomStatus>('Available');

  // Category Modal
  const [catModalOpen, setCatModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<ResortRoomCategory | null>(null);
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catBed, setCatBed] = useState('1 King Bed');
  const [catAdults, setCatAdults] = useState(2);
  const [catChildren, setCatChildren] = useState(1);
  const [catWeekday, setCatWeekday] = useState(4500);
  const [catWeekend, setCatWeekend] = useState(5500);
  const [catImage, setCatImage] = useState(IMAGE_GALLERY_OPTIONS[2].url);

  const openAddRoom = () => {
    setEditingRoom(null);
    setRmNumber('');
    setRmCatId(roomCategories[0]?.id || 'CAT-STD');
    setRmFloor('Ground Wing');
    setRmStatus('Available');
    setRoomModalOpen(true);
  };

  const openEditRoom = (r: ResortRoom) => {
    setEditingRoom(r);
    setRmNumber(r.roomNumber);
    setRmCatId(r.categoryId);
    setRmFloor(r.floor);
    setRmStatus(r.status);
    setRoomModalOpen(true);
  };

  const handleSaveRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRoom) {
      updateResortRoom(editingRoom.id, {
        roomNumber: rmNumber,
        categoryId: rmCatId,
        floor: rmFloor,
        status: rmStatus,
      });
    } else {
      addResortRoom({
        roomNumber: rmNumber,
        categoryId: rmCatId,
        floor: rmFloor,
        status: rmStatus,
      });
    }
    setRoomModalOpen(false);
  };

  const openAddCat = () => {
    setEditingCat(null);
    setCatName('');
    setCatDesc('');
    setCatBed('1 King Bed');
    setCatAdults(2);
    setCatChildren(1);
    setCatWeekday(5000);
    setCatWeekend(6000);
    setCatImage(IMAGE_GALLERY_OPTIONS[3].url);
    setCatModalOpen(true);
  };

  const openEditCat = (c: ResortRoomCategory) => {
    setEditingCat(c);
    setCatName(c.name);
    setCatDesc(c.description);
    setCatBed(c.bedType);
    setCatAdults(c.maxAdults);
    setCatChildren(c.maxChildren);
    setCatWeekday(c.weekdayPrice);
    setCatWeekend(c.weekendPrice);
    setCatImage(c.image);
    setCatModalOpen(true);
  };

  const handleSaveCat = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCat) {
      updateResortCategory(editingCat.id, {
        name: catName,
        description: catDesc,
        bedType: catBed,
        maxAdults: catAdults,
        maxChildren: catChildren,
        weekdayPrice: catWeekday,
        weekendPrice: catWeekend,
        image: catImage,
      });
    } else {
      addResortCategory({
        name: catName,
        slug: catName.toLowerCase().replace(/\s+/g, '-'),
        description: catDesc,
        bedType: catBed,
        maxAdults: catAdults,
        maxChildren: catChildren,
        sizeSqFt: 450,
        weekdayPrice: catWeekday,
        weekendPrice: catWeekend,
        seasonalMultiplier: 1.15,
        extraBedPrice: 1000,
        amenities: ['High-Speed Wi-Fi', 'Breakfast Included', 'Air Conditioning'],
        image: catImage,
      });
    }
    setCatModalOpen(false);
  };

  const visibleRooms = resortRooms.filter(
    (r) => catFilter === 'ALL' || r.categoryId === catFilter
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="type-h1 text-[#0B1628]">
            Room Inventory &amp; Categories
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage all {resortRooms.length} rooms, statuses, and {roomCategories.length} categories.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-xl">
            <button
              type="button"
              onClick={() => setTab('rooms')}
              className={`min-h-[36px] px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                tab === 'rooms' ? 'bg-[#0B1628] text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Individual Rooms ({resortRooms.length})
            </button>
            <button
              type="button"
              onClick={() => setTab('categories')}
              className={`min-h-[36px] px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                tab === 'categories' ? 'bg-[#0B1628] text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Categories ({roomCategories.length})
            </button>
          </div>
          <button
            type="button"
            onClick={tab === 'rooms' ? openAddRoom : openAddCat}
            className="min-h-[40px] inline-flex items-center gap-1.5 px-4 py-2 bg-[#0B1628] text-white text-xs font-semibold rounded-xl hover:bg-[#172D4D] transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{tab === 'rooms' ? 'Add Room' : 'Add Category'}</span>
          </button>
        </div>
      </div>

      {tab === 'rooms' ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => setCatFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg border text-xs font-medium whitespace-nowrap ${
                catFilter === 'ALL'
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-slate-200'
              }`}
            >
              All Rooms
            </button>
            {roomCategories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCatFilter(c.id)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-medium whitespace-nowrap ${
                  catFilter === c.id
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-200'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase">
                    <th className="py-3 px-4">Room No.</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Wing / Floor</th>
                    <th className="py-3 px-4">Current Status</th>
                    <th className="py-3 px-4">Quick Status Change</th>
                    <th className="py-3 px-4 text-right">Edit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {visibleRooms.map((r) => {
                    const cat = roomCategories.find((c) => c.id === r.categoryId);
                    return (
                      <tr key={r.id} className="hover:bg-slate-50/70">
                        <td className="py-3 px-4 font-mono-tabular font-bold text-slate-900">
                          Room {r.roomNumber}
                        </td>
                        <td className="py-3 px-4 font-medium">{cat?.name || r.categoryId}</td>
                        <td className="py-3 px-4 text-slate-600">{r.floor}</td>
                        <td className="py-3 px-4">
                          <StatusLabel status={r.status} />
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={r.status}
                            onChange={(e) => updateRoomStatus(r.id, e.target.value as RoomStatus)}
                            className="px-2.5 py-1 border border-slate-200 rounded text-xs bg-white"
                          >
                            <option value="Available">Available</option>
                            <option value="Occupied">Occupied</option>
                            <option value="Reserved">Reserved</option>
                            <option value="Cleaning">Cleaning</option>
                            <option value="Maintenance">Maintenance</option>
                          </select>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => openEditRoom(r)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-slate-700 hover:bg-slate-100 rounded"
                          >
                            <Pencil className="w-3.5 h-3.5" /> Edit
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {roomCategories.map((cat) => {
            const count = resortRooms.filter((r) => r.categoryId === cat.id).length;
            return (
              <div
                key={cat.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-24 h-20 object-cover rounded-lg border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-slate-900">{cat.name}</h3>
                      <span className="text-xs font-mono-tabular text-emerald-700 font-semibold">
                        {count} rooms
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{cat.description}</p>
                    <div className="mt-2 text-xs font-mono-tabular text-slate-700">
                      Weekday: {formatINR(cat.weekdayPrice)} · Weekend: {formatINR(cat.weekendPrice)}
                    </div>
                  </div>
                </div>
                <div className="pt-3 border-t border-slate-100 flex justify-end">
                  <button
                    type="button"
                    onClick={() => openEditCat(cat)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <Pencil className="w-3.5 h-3.5" /> Edit Category
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Room Modal */}
      <Modal
        open={roomModalOpen}
        onClose={() => setRoomModalOpen(false)}
        title={editingRoom ? `Edit Room ${editingRoom.roomNumber}` : 'Add Individual Room'}
      >
        <form onSubmit={handleSaveRoom} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Room Number</label>
              <input
                type="text"
                value={rmNumber}
                onChange={(e) => setRmNumber(e.target.value)}
                placeholder="e.g. 504"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono-tabular"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Category</label>
              <select
                value={rmCatId}
                onChange={(e) => setRmCatId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
              >
                {roomCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Floor / Wing</label>
              <input
                type="text"
                value={rmFloor}
                onChange={(e) => setRmFloor(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Status</label>
              <select
                value={rmStatus}
                onChange={(e) => setRmStatus(e.target.value as RoomStatus)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
              >
                <option value="Available">Available</option>
                <option value="Occupied">Occupied</option>
                <option value="Reserved">Reserved</option>
                <option value="Cleaning">Cleaning</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setRoomModalOpen(false)}
              className="px-4 py-2 border border-slate-200 rounded-lg text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-700 text-white rounded-lg text-xs font-semibold"
            >
              Save Room
            </button>
          </div>
        </form>
      </Modal>

      {/* Category Modal */}
      <Modal
        open={catModalOpen}
        onClose={() => setCatModalOpen(false)}
        title={editingCat ? `Edit ${editingCat.name}` : 'Add Room Category'}
      >
        <form onSubmit={handleSaveCat} className="space-y-3.5">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Category Name</label>
            <input
              type="text"
              value={catName}
              onChange={(e) => setCatName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Description</label>
            <textarea
              rows={2}
              value={catDesc}
              onChange={(e) => setCatDesc(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Bed Type</label>
              <input
                type="text"
                value={catBed}
                onChange={(e) => setCatBed(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Photo Asset</label>
              <select
                value={catImage}
                onChange={(e) => setCatImage(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
              >
                {IMAGE_GALLERY_OPTIONS.map((opt) => (
                  <option key={opt.label} value={opt.url}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Weekday Price (₹)</label>
              <input
                type="number"
                value={catWeekday}
                onChange={(e) => setCatWeekday(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono-tabular"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Weekend Price (₹)</label>
              <input
                type="number"
                value={catWeekend}
                onChange={(e) => setCatWeekend(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono-tabular"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setCatModalOpen(false)}
              className="px-4 py-2 border border-slate-200 rounded-lg text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-700 text-white rounded-lg text-xs font-semibold"
            >
              Save Category
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
