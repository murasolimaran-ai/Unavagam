import React, { useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { usePlatform } from '../../../context/PlatformContext';
import { VegMarker } from '../../../components/common/StatusLabel';
import { Modal } from '../../../components/common/Modal';
import { FoodItem } from '../../../types';
import { IMAGE_GALLERY_OPTIONS } from '../../../utils/assets';
import { formatINR } from '../../../utils/format';

export const AdminMenuManagementPage: React.FC = () => {
  const {
    foodItems,
    foodCategories,
    addFoodItem,
    updateFoodItem,
    deleteFoodItem,
    toggleFoodAvailability,
  } = usePlatform();

  const [catFilter, setCatFilter] = useState('ALL');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<FoodItem | null>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState(foodCategories[0]?.id || '');
  const [price, setPrice] = useState(200);
  const [isVeg, setIsVeg] = useState(true);
  const [prepTimeMins, setPrepTimeMins] = useState(15);
  const [featured, setFeatured] = useState(false);
  const [image, setImage] = useState(IMAGE_GALLERY_OPTIONS[6].url);
  const [customInput, setCustomInput] = useState('Regular, Spicy');

  const openAdd = () => {
    setEditing(null);
    setName('');
    setDescription('');
    setCategoryId(foodCategories[0]?.id || '');
    setPrice(220);
    setIsVeg(true);
    setPrepTimeMins(15);
    setFeatured(false);
    setImage(IMAGE_GALLERY_OPTIONS[6].url);
    setCustomInput('Regular, Spicy');
    setModalOpen(true);
  };

  const openEdit = (item: FoodItem) => {
    setEditing(item);
    setName(item.name);
    setDescription(item.description);
    setCategoryId(item.categoryId);
    setPrice(item.price);
    setIsVeg(item.isVeg);
    setPrepTimeMins(item.prepTimeMins);
    setFeatured(item.featured);
    setImage(item.image);
    setCustomInput(item.customizations.join(', '));
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const customizations = customInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (editing) {
      updateFoodItem(editing.id, {
        name,
        description,
        categoryId,
        price,
        isVeg,
        prepTimeMins,
        featured,
        image,
        customizations,
      });
    } else {
      addFoodItem({
        name,
        description,
        categoryId,
        price,
        isVeg,
        available: true,
        featured,
        prepTimeMins,
        image,
        customizations,
      });
    }
    setModalOpen(false);
  };

  const visible = foodItems.filter((f) => catFilter === 'ALL' || f.categoryId === catFilter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="type-h1 text-[#0B1628]">Menu Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Changes sync immediately with the Customer Restaurant Menu.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value)}
            className="min-h-[40px] px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none focus:border-[#0B1628]"
          >
            <option value="ALL">All Categories ({foodItems.length})</option>
            {foodCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={openAdd}
            className="min-h-[40px] inline-flex items-center gap-1.5 px-4 py-2 bg-[#0B1628] text-white text-xs font-semibold rounded-xl hover:bg-[#172D4D] transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Add Dish
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase">
                <th className="py-3 px-4">Dish</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4 text-right">Price</th>
                <th className="py-3 px-4">Availability</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {visible.map((item) => {
                const catName =
                  foodCategories.find((c) => c.id === item.categoryId)?.name || '—';
                return (
                  <tr key={item.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <div className="font-semibold text-slate-900">{item.name}</div>
                          <div className="text-[11px] text-slate-500 max-w-xs truncate">
                            {item.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-700">{catName}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1.5">
                        <VegMarker isVeg={item.isVeg} />
                        <span>{item.isVeg ? 'Veg' : 'Non-Veg'}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono-tabular font-semibold">
                      {formatINR(item.price)}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => toggleFoodAvailability(item.id)}
                        className={`px-2.5 py-1 rounded text-[11px] font-semibold ${
                          item.available
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {item.available ? 'Available' : 'Unavailable'}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => openEdit(item)}
                        className="p-1.5 text-slate-600 hover:text-slate-900 rounded"
                        aria-label="Edit item"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteFoodItem(item.id)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded ml-1"
                        aria-label="Delete item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? `Edit ${editing.name}` : 'Add Menu Dish'}
      >
        <form onSubmit={handleSave} className="space-y-3.5">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Dish Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
              >
                {foodCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Price (₹)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono-tabular"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Dietary</label>
              <select
                value={isVeg ? 'veg' : 'nonveg'}
                onChange={(e) => setIsVeg(e.target.value === 'veg')}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
              >
                <option value="veg">Vegetarian</option>
                <option value="nonveg">Non-Vegetarian</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Dish Image</label>
              <select
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
              >
                {IMAGE_GALLERY_OPTIONS.map((opt) => (
                  <option key={opt.label} value={opt.url}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Customizations (comma-separated)
            </label>
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            />
          </div>
          <label className="flex items-center gap-2 text-xs text-slate-700">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
            />
            <span>Feature on Restaurant &amp; Homepage</span>
          </label>
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
              className="px-4 py-2 bg-orange-600 text-white rounded-lg text-xs font-semibold"
            >
              Save Dish
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
