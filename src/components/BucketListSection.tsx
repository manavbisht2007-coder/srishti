import React, { useRef, useState } from 'react';
import { BucketCategory, BucketItem, ThemeMode } from '../types';
import { uploadPrivateImage } from '../utils/api';
import { formatReadableDate } from '../utils/dateTracker';
import { SafeImage } from './SafeImage';

interface BucketListSectionProps {
  items: BucketItem[];
  theme?: ThemeMode;
  onAddItem: (item: {
    title: string;
    description: string;
    category: BucketCategory;
    targetDate?: string;
  }) => Promise<void>;
  onUpdateItem: (item: BucketItem) => Promise<void>;
  onDeleteItem: (id: string) => Promise<void>;
  onShowerFlowers: () => void;
  onNotify: (type: 'success' | 'error' | 'info', text: string) => void;
}

const CATEGORIES: BucketCategory[] = ['Travel', 'Food', 'Cozy', 'Adventure', 'Milestone'];

export const BucketListSection: React.FC<BucketListSectionProps> = ({
  items,
  theme = 'romantic',
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onShowerFlowers,
  onNotify,
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<BucketItem | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<BucketCategory>('Adventure');
  const [targetDate, setTargetDate] = useState('');

  // Completion photo modal
  const [completingItem, setCompletingItem] = useState<BucketItem | null>(null);
  const [completionPhotoUrl, setCompletionPhotoUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const isAquatic = theme === 'aquatic';
  const headingColor = isAquatic ? 'text-[#03045e]' : 'text-[#BE185D]';
  const mutedText = isAquatic ? 'text-[#0077B6]' : 'text-[#927C89]';

  const completedCount = items.filter((i) => i.completed).length;
  const percent = items.length ? Math.round((completedCount / items.length) * 100) : 0;

  const filtered = items.filter((i) => {
    if (filter === 'pending') return !i.completed;
    if (filter === 'completed') return i.completed;
    return true;
  });

  const openAdd = () => {
    setEditing(null);
    setTitle('');
    setDescription('');
    setCategory('Adventure');
    setTargetDate('');
    setShowModal(true);
  };

  const openEdit = (item: BucketItem) => {
    setEditing(item);
    setTitle(item.title);
    setDescription(item.description);
    setCategory(item.category);
    setTargetDate(item.targetDate || '');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      if (editing) {
        await onUpdateItem({
          ...editing,
          title: title.trim(),
          description: description.trim(),
          category,
          targetDate: targetDate || '',
        });
        onNotify('success', 'Bucket list dream updated.');
      } else {
        await onAddItem({
          title: title.trim(),
          description: description.trim(),
          category,
          targetDate: targetDate || '',
        });
        onNotify('success', 'Added to your shared bucket list.');
      }
      setShowModal(false);
      setEditing(null);
    } catch (err: any) {
      onNotify('error', err.message || 'Could not save bucket list item.');
    }
  };

  const handleToggleComplete = async (item: BucketItem) => {
    if (!item.completed) {
      setCompletingItem(item);
      setCompletionPhotoUrl(item.completionPhotoUrl || '');
    } else {
      try {
        await onUpdateItem({
          ...item,
          completed: false,
          completedAt: '',
        });
        onNotify('info', 'Moved back to pending.');
      } catch (err: any) {
        onNotify('error', err.message || 'Update failed.');
      }
    }
  };

  const handleCompletionUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadPrivateImage(file);
      setCompletionPhotoUrl(url);
    } catch (err: any) {
      onNotify('error', err.message || 'Could not upload photo.');
    } finally {
      setUploading(false);
    }
  };

  const confirmComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!completingItem) return;
    try {
      await onUpdateItem({
        ...completingItem,
        completed: true,
        completedAt: new Date().toISOString().slice(0, 10),
        completionPhotoUrl: completionPhotoUrl.trim(),
      });
      setCompletingItem(null);
      setCompletionPhotoUrl('');
      onShowerFlowers();
      onNotify('success', 'Dream marked as lived together!');
    } catch (err: any) {
      onNotify('error', err.message || 'Could not mark complete.');
    }
  };

  return (
    <section className="max-w-[1100px] mx-auto px-4 md:px-8 py-10 md:py-14 w-full relative z-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <p className={`text-xs font-semibold uppercase tracking-wider ${mutedText}`}>
            Shared Adventures &amp; Dreams
          </p>
          <h1 className={`font-serif text-4xl md:text-5xl mt-1 ${headingColor}`}>
            Our Bucket List
          </h1>
          <p className={`text-sm md:text-base mt-2 max-w-xl ${mutedText}`}>
            Places to wander, cozy nights to plan, and memories waiting to be checked off together.
          </p>
        </div>

        <button
          type="button"
          onClick={openAdd}
          className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white shadow-sm cursor-pointer min-h-[44px] shrink-0 ${
            isAquatic
              ? 'bg-[#0077B6]'
              : 'bg-gradient-to-r from-[#EC4899] to-[#BE185D]'
          }`}
        >
          <span className="material-symbols-outlined text-[19px]">add_task</span>
          <span>Add Dream</span>
        </button>
      </div>

      {/* Progress Card */}
      <div
        className={`rounded-2xl p-5 sm:p-6 border mb-8 bg-white/95 ${
          isAquatic ? 'border-[#caf0f8] text-[#03045e]' : 'border-[#FBCFE8] text-[#44313B]'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
          <span className="text-sm font-semibold">Progress Together</span>
          <span className={`text-sm font-bold tabular-nums ${headingColor}`}>
            {completedCount} of {items.length} completed ({percent}%)
          </span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-black/5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isAquatic ? 'bg-[#0077B6]' : 'bg-gradient-to-r from-[#EC4899] to-[#BE185D]'
            }`}
            style={{ width: `${percent}%` }}
          />
        </div>

        <div className="flex flex-wrap gap-2 mt-5">
          {(
            [
              ['all', `All (${items.length})`],
              ['pending', `Pending (${items.length - completedCount})`],
              ['completed', `Completed (${completedCount})`],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setFilter(id)}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${
                filter === id
                  ? isAquatic
                    ? 'bg-[#0077B6] text-white'
                    : 'bg-[#BE185D] text-white'
                  : 'bg-[#FFF7F9] text-[#44313B] border border-[#FBCFE8]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Bucket Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white/90 rounded-3xl p-12 text-center border border-dashed border-[#FBCFE8]">
          <p className="font-serif text-2xl">No bucket list items in this filter.</p>
          <p className={`text-sm mt-1 ${mutedText}`}>
            Add a new dream or switch filters above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((item) => (
            <article
              key={item.id}
              className={`bg-white/95 rounded-2xl p-5 sm:p-6 border shadow-sm flex flex-col justify-between transition-all ${
                isAquatic ? 'border-[#caf0f8] text-[#03045e]' : 'border-[#FBCFE8] text-[#44313B]'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <button
                    type="button"
                    onClick={() => handleToggleComplete(item)}
                    className="flex items-start gap-3 text-left flex-1 cursor-pointer"
                  >
                    <span
                      className={`material-symbols-outlined text-[24px] mt-0.5 shrink-0 ${
                        item.completed
                          ? isAquatic
                            ? 'text-[#0077B6]'
                            : 'text-[#EC4899]'
                          : 'opacity-40'
                      }`}
                    >
                      {item.completed ? 'check_circle' : 'radio_button_unchecked'}
                    </span>
                    <div>
                      <p className={`text-xs font-medium ${mutedText}`}>
                        {item.category}
                        {item.targetDate ? ` · Target ${formatReadableDate(item.targetDate)}` : ''}
                      </p>
                      <h3
                        className={`font-serif text-2xl font-semibold mt-0.5 ${
                          item.completed ? 'line-through opacity-70' : headingColor
                        }`}
                      >
                        {item.title}
                      </h3>
                    </div>
                  </button>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => openEdit(item)}
                      aria-label={`Edit ${item.title}`}
                      className="p-1.5 rounded-lg hover:bg-black/5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[17px]">edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteItem(item.id)}
                      aria-label={`Delete ${item.title}`}
                      className="p-1.5 rounded-lg hover:bg-red-50 hover:text-red-600 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[17px]">delete</span>
                    </button>
                  </div>
                </div>

                {item.description && (
                  <p className="text-sm opacity-90 pl-9 mb-3 leading-relaxed">{item.description}</p>
                )}

                {item.completed && item.completionPhotoUrl && (
                  <div className="pl-9 mb-3">
                    <div className="w-full aspect-[16/9] rounded-xl overflow-hidden bg-[#FFF0F5]">
                      <SafeImage
                        src={item.completionPhotoUrl}
                        alt={`${item.title} completion memory`}
                        theme={theme}
                        placeholderTitle={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className={`pl-9 pt-3 border-t border-black/5 flex items-center justify-between text-xs ${mutedText}`}>
                <span>Added by {item.authorName}</span>
                {item.completed && item.completedAt ? (
                  <span className="font-semibold">
                    Completed {formatReadableDate(item.completedAt)}
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleToggleComplete(item)}
                    className={`font-semibold hover:underline cursor-pointer ${headingColor}`}
                  >
                    Mark Completed
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Add / Edit Dream Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-xs animate-fade-in">
          <div className="bg-[#FFF9F2] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[#FBCFE8] relative animate-scale-up text-[#44313B]">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              aria-label="Close dialog"
              className="absolute top-5 right-5 text-[#927C89] p-1 rounded-full cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <h2 className={`font-serif text-2xl font-semibold mb-4 ${headingColor}`}>
              {editing ? 'Edit Bucket List Item' : 'Add a Shared Dream'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Activity / Dream *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Watch snowfall together"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#FBCFE8] text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as BucketCategory)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#FBCFE8] text-sm"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Target Date (Optional)</label>
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#FBCFE8] text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Details, wishes, or where we want to go..."
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#FBCFE8] text-sm"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-sm text-[#927C89] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 rounded-xl text-white text-sm font-semibold cursor-pointer ${
                    isAquatic ? 'bg-[#0077B6]' : 'bg-[#BE185D]'
                  }`}
                >
                  {editing ? 'Save Changes' : 'Add to List'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mark Completed + Optional Photo Modal */}
      {completingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-xs animate-fade-in">
          <div className="bg-[#FFF9F2] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[#FBCFE8] relative animate-scale-up text-[#44313B]">
            <button
              type="button"
              onClick={() => setCompletingItem(null)}
              aria-label="Close completion dialog"
              className="absolute top-5 right-5 text-[#927C89] p-1 rounded-full cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <h2 className={`font-serif text-2xl font-semibold mb-2 ${headingColor}`}>
              Celebrate Completion
            </h2>
            <p className="text-xs text-[#927C89] mb-4">
              Marking <strong>“{completingItem.title}”</strong> as completed! Optionally upload a photo from this moment.
            </p>
            <form onSubmit={confirmComplete} className="space-y-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="px-4 py-2 rounded-xl bg-white border border-[#FBCFE8] text-xs font-semibold cursor-pointer"
                >
                  {uploading ? 'Uploading...' : 'Upload Completion Photo'}
                </button>
                {completionPhotoUrl && (
                  <span className="text-xs font-semibold text-emerald-700">Photo attached</span>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  onChange={handleCompletionUpload}
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCompletingItem(null)}
                  className="px-4 py-2 rounded-xl text-sm text-[#927C89] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 rounded-xl text-white text-sm font-semibold cursor-pointer ${
                    isAquatic ? 'bg-[#0077B6]' : 'bg-[#BE185D]'
                  }`}
                >
                  Mark Completed
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
