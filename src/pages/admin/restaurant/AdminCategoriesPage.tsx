import React, { useState } from 'react';
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2 } from 'lucide-react';
import { usePlatform } from '../../../context/PlatformContext';
import { Modal } from '../../../components/common/Modal';
import { FoodCategory } from '../../../types';

export const AdminCategoriesPage: React.FC = () => {
  const {
    foodCategories,
    foodItems,
    addFoodCategory,
    updateFoodCategory,
    deleteFoodCategory,
    reorderFoodCategory,
  } = usePlatform();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<FoodCategory | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const sorted = [...foodCategories].sort((a, b) => a.sortOrder - b.sortOrder);

  const openAdd = () => {
    setEditing(null);
    setName('');
    setDescription('');
    setModalOpen(true);
  };

  const openEdit = (cat: FoodCategory) => {
    setEditing(cat);
    setName(cat.name);
    setDescription(cat.description);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      updateFoodCategory(editing.id, { name, description });
    } else {
      const nextOrder = Math.max(0, ...foodCategories.map((c) => c.sortOrder)) + 1;
      addFoodCategory({ name, description, sortOrder: nextOrder });
    }
    setModalOpen(false);
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Menu Categories</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Add, edit, delete, or reorder food categories shown on the customer menu.
          </p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-orange-600 text-white text-xs font-semibold rounded-lg hover:bg-orange-700"
        >
          <Plus className="w-3.5 h-3.5" /> Add Category
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100">
        {sorted.map((cat, idx) => {
          const itemCount = foodItems.filter((f) => f.categoryId === cat.id).length;
          return (
            <div key={cat.id} className="p-4 flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono-tabular text-xs text-slate-400">#{idx + 1}</span>
                  <h3 className="text-sm font-bold text-slate-900">{cat.name}</h3>
                  <span className="text-xs font-mono-tabular text-slate-500">
                    · {itemCount} dishes
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{cat.description}</p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => reorderFoodCategory(cat.id, 'up')}
                  className="p-1.5 text-slate-500 hover:text-slate-900 disabled:opacity-30"
                  aria-label="Move up"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  disabled={idx === sorted.length - 1}
                  onClick={() => reorderFoodCategory(cat.id, 'down')}
                  className="p-1.5 text-slate-500 hover:text-slate-900 disabled:opacity-30"
                  aria-label="Move down"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => openEdit(cat)}
                  className="p-1.5 text-slate-600 hover:text-slate-900"
                  aria-label="Edit category"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => deleteFoodCategory(cat.id)}
                  className="p-1.5 text-rose-600 hover:bg-rose-50 rounded"
                  aria-label="Delete category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? `Edit ${editing.name}` : 'Add Category'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Category Name</label>
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
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            />
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
              className="px-4 py-2 bg-orange-600 text-white rounded-lg text-xs font-semibold"
            >
              Save Category
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
