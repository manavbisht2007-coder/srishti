import React, { useMemo, useRef, useState } from 'react';
import { MemoryCategory, MemoryItem, ThemeMode } from '../types';
import { uploadPrivateImage } from '../utils/api';
import { formatReadableDate } from '../utils/dateTracker';
import { SafeImage } from './SafeImage';

interface MemoriesSectionProps {
  memories: MemoryItem[];
  theme?: ThemeMode;
  onAddMemory: (memory: {
    title: string;
    date: string;
    location: string;
    category: MemoryCategory;
    caption: string;
    imageUrl: string;
  }) => Promise<void>;
  onEditMemory: (memory: MemoryItem) => Promise<void>;
  onDeleteMemory: (id: string) => Promise<void>;
  onLikeMemory: (id: string) => Promise<void>;
  onOpenLightbox: (memory: MemoryItem) => void;
  onShowerFlowers: () => void;
  onNotify: (type: 'success' | 'error' | 'info', text: string) => void;
}

const CATEGORIES: ('All' | MemoryCategory)[] = [
  'All',
  'Firsts',
  'Adventures',
  'Special Days',
  'Random Moments',
  'Favorite Photos',
];

export const MemoriesSection: React.FC<MemoriesSectionProps> = ({
  memories,
  theme = 'romantic',
  onAddMemory,
  onEditMemory,
  onDeleteMemory,
  onLikeMemory,
  onOpenLightbox,
  onShowerFlowers,
  onNotify,
}) => {
  const [categoryFilter, setCategoryFilter] = useState<'All' | MemoryCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState(''); // YYYY-MM
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Multi-photo upload state
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [uploadPreviews, setUploadPreviews] = useState<string[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState<MemoryCategory>('Special Days');
  const [submitting, setSubmitting] = useState(false);

  // Edit modal state
  const [editingMemory, setEditingMemory] = useState<MemoryItem | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCaption, setEditCaption] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editCategory, setEditCategory] = useState<MemoryCategory>('Special Days');

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const isAquatic = theme === 'aquatic';

  const availableMonths = useMemo(() => {
    const months = new Set<string>();
    memories.forEach((m) => {
      if (m.date && m.date.length >= 7) months.add(m.date.slice(0, 7));
    });
    return Array.from(months).sort((a, b) => b.localeCompare(a));
  }, [memories]);

  const filteredMemories = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return memories.filter((item) => {
      if (categoryFilter !== 'All' && item.category !== categoryFilter) return false;
      if (dateFilter && !item.date.startsWith(dateFilter)) return false;
      if (q) {
        const match =
          item.title.toLowerCase().includes(q) ||
          item.caption.toLowerCase().includes(q) ||
          item.location.toLowerCase().includes(q) ||
          item.authorName.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [memories, categoryFilter, dateFilter, searchQuery]);

  const handleFilesSelected = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const selected = Array.from(files).slice(0, 8);
    setUploadFiles(selected);
    const urls = selected.map((f) => URL.createObjectURL(f));
    setUploadPreviews(urls);
  };

  const resetUploadForm = () => {
    uploadPreviews.forEach((u) => URL.revokeObjectURL(u));
    setUploadFiles([]);
    setUploadPreviews([]);
    setImageUrlInput('');
    setTitle('');
    setCaption('');
    setLocation('');
    setCategory('Special Days');
    setDate(new Date().toISOString().slice(0, 10));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadFiles.length === 0 && !imageUrlInput.trim()) {
      onNotify('error', 'Please select one or more photos or provide an image link.');
      return;
    }

    setSubmitting(true);
    try {
      if (uploadFiles.length > 0) {
        for (let i = 0; i < uploadFiles.length; i++) {
          const uploadedUrl = await uploadPrivateImage(uploadFiles[i]);
          const suffix = uploadFiles.length > 1 ? ` (${i + 1})` : '';
          await onAddMemory({
            title: (title.trim() || 'Cherished Moment') + suffix,
            date,
            location: location.trim() || 'Our Little World',
            category,
            caption: caption.trim() || 'A quiet moment worth keeping forever.',
            imageUrl: uploadedUrl,
          });
        }
        onNotify(
          'success',
          `${uploadFiles.length} ${uploadFiles.length === 1 ? 'memory' : 'memories'} saved safely.`
        );
      } else {
        await onAddMemory({
          title: title.trim() || 'Cherished Moment',
          date,
          location: location.trim() || 'Our Little World',
          category,
          caption: caption.trim() || 'A quiet moment worth keeping forever.',
          imageUrl: imageUrlInput.trim(),
        });
        onNotify('success', 'Memory added to gallery.');
      }

      onShowerFlowers();
      resetUploadForm();
      setShowUploadModal(false);
    } catch (err: any) {
      onNotify('error', err.message || 'Could not upload memory.');
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (mem: MemoryItem) => {
    setEditingMemory(mem);
    setEditTitle(mem.title);
    setEditCaption(mem.caption);
    setEditDate(mem.date);
    setEditLocation(mem.location);
    setEditCategory(mem.category);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMemory) return;
    try {
      await onEditMemory({
        ...editingMemory,
        title: editTitle.trim() || editingMemory.title,
        caption: editCaption.trim(),
        date: editDate || editingMemory.date,
        location: editLocation.trim() || 'Our Little World',
        category: editCategory,
      });
      setEditingMemory(null);
      onNotify('success', 'Memory updated.');
    } catch (err: any) {
      onNotify('error', err.message || 'Could not update memory.');
    }
  };

  const headingColor = isAquatic ? 'text-[#03045e]' : 'text-[#BE185D]';
  const mutedText = isAquatic ? 'text-[#0077B6]' : 'text-[#927C89]';
  const cardSurface = isAquatic
    ? 'bg-white/95 border-[#caf0f8] text-[#03045e]'
    : 'bg-white/95 border-[#FBCFE8] text-[#44313B]';

  return (
    <section className="max-w-[1200px] mx-auto px-4 md:px-8 py-10 md:py-14 w-full relative z-10">
      {/* Header & Upload CTA */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <p className={`text-xs font-semibold uppercase tracking-wider ${mutedText}`}>
            Memories Gallery · <span className="tabular-nums">{filteredMemories.length}</span> of{' '}
            <span className="tabular-nums">{memories.length}</span> Photos
          </p>
          <h1 className={`font-serif text-4xl md:text-5xl mt-1 ${headingColor}`}>
            Our Keepsake Polaroids
          </h1>
          <p className={`text-sm md:text-base mt-2 max-w-xl ${mutedText}`}>
            Every candid snapshot, adventure, and quiet afternoon saved in one private album.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowUploadModal(true)}
          className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white shadow-sm cursor-pointer transition-opacity hover:opacity-95 min-h-[44px] shrink-0 ${
            isAquatic
              ? 'bg-[#0077B6]'
              : 'bg-gradient-to-r from-[#EC4899] to-[#BE185D]'
          }`}
        >
          <span className="material-symbols-outlined text-[19px]">add_photo_alternate</span>
          <span>Upload Photos</span>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div
        className={`rounded-2xl p-4 sm:p-5 border mb-8 space-y-4 backdrop-blur-md ${cardSurface}`}
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-8 relative">
            <span className="material-symbols-outlined text-[18px] absolute left-3.5 top-1/2 -translate-y-1/2 opacity-50">
              search
            </span>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, caption, location, or partner..."
              aria-label="Search memories"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FFF9F2] border border-[#FBCFE8] text-sm text-[#44313B] focus:outline-none focus:ring-2 focus:ring-[#EC4899]"
            />
          </div>
          <div className="md:col-span-4">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              aria-label="Filter memories by month"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF9F2] border border-[#FBCFE8] text-sm text-[#44313B] focus:outline-none"
            >
              <option value="">All Dates</option>
              {availableMonths.map((ym) => (
                <option key={ym} value={ym}>
                  {new Date(`${ym}-01T00:00:00`).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => {
            const active = categoryFilter === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  active
                    ? isAquatic
                      ? 'bg-[#0077B6] text-white shadow-xs'
                      : 'bg-gradient-to-r from-[#EC4899] to-[#BE185D] text-white shadow-xs'
                    : isAquatic
                    ? 'bg-[#f0f8ff] text-[#03045e] hover:bg-[#caf0f8]'
                    : 'bg-[#FFF7F9] text-[#44313B] hover:bg-[#FCE7F3]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Polaroid Grid */}
      {filteredMemories.length === 0 ? (
        <div className={`rounded-3xl p-12 text-center border border-dashed ${cardSurface}`}>
          <span className="material-symbols-outlined text-[40px] opacity-40 mb-2">
            photo_library
          </span>
          <h2 className="font-serif text-2xl">No memories match your filter</h2>
          <p className={`text-sm mt-1 ${mutedText}`}>
            Try clearing your search or upload a new moment together.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredMemories.map((card) => (
            <article
              key={card.id}
              className={`bg-white p-4 pb-5 rounded-2xl border shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col hover:-translate-y-1 group ${
                isAquatic ? 'border-[#caf0f8]' : 'border-[#FBCFE8]'
              }`}
            >
              {/* Polaroid Image Frame */}
              <div
                onClick={() => onOpenLightbox(card)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onOpenLightbox(card);
                  }
                }}
                className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-[#FFF0F5] mb-4 cursor-pointer"
              >
                <SafeImage
                  src={card.imageUrl}
                  alt={card.title}
                  theme={theme}
                  placeholderTitle={card.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />

                <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 opacity-95 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditModal(card);
                    }}
                    aria-label={`Edit ${card.title}`}
                    className="w-8 h-8 rounded-full bg-white/95 text-[#44313B] hover:text-[#BE185D] flex items-center justify-center shadow-sm cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">edit</span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteMemory(card.id);
                    }}
                    aria-label={`Delete ${card.title}`}
                    className="w-8 h-8 rounded-full bg-white/95 text-[#44313B] hover:text-red-600 flex items-center justify-center shadow-sm cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                  </button>
                </div>
              </div>

              {/* Clean Unboxed Metadata */}
              <div className={`flex items-center justify-between text-xs mb-1.5 ${mutedText}`}>
                <span className="truncate">
                  {card.category} · {formatReadableDate(card.date)}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    onLikeMemory(card.id);
                    onShowerFlowers();
                  }}
                  className="inline-flex items-center gap-1 font-semibold hover:scale-105 transition-transform cursor-pointer shrink-0"
                >
                  <span
                    className={`material-symbols-outlined text-[16px] ${
                      isAquatic ? 'text-[#0077B6]' : 'text-[#EC4899]'
                    }`}
                  >
                    favorite
                  </span>
                  <span className="tabular-nums">{card.likes}</span>
                </button>
              </div>

              <h3
                onClick={() => onOpenLightbox(card)}
                className={`font-serif text-xl font-semibold cursor-pointer hover:underline ${headingColor}`}
              >
                {card.title}
              </h3>

              <p className="font-serif italic text-[15px] text-[#44313B] mt-1.5 leading-relaxed line-clamp-2">
                {card.caption}
              </p>

              <div
                className={`mt-auto pt-3.5 mt-4 border-t flex items-center justify-between text-xs ${
                  isAquatic ? 'border-[#e0fbfc]' : 'border-[#FCE7F3]'
                }`}
              >
                <span className={mutedText}>
                  {card.location} · By {card.authorName}
                </span>
                <button
                  type="button"
                  onClick={() => onOpenLightbox(card)}
                  className={`font-semibold hover:underline cursor-pointer ${headingColor}`}
                >
                  Open
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Multi-Photo Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-xs animate-fade-in">
          <div className="bg-[#FFF9F2] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-[#FBCFE8] relative animate-scale-up max-h-[92vh] overflow-y-auto text-[#44313B]">
            <button
              type="button"
              onClick={() => {
                setShowUploadModal(false);
                resetUploadForm();
              }}
              aria-label="Close upload dialog"
              className="absolute top-5 right-5 text-[#927C89] hover:text-[#44313B] p-1 rounded-full cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <p className="text-xs font-semibold uppercase tracking-wider text-[#927C89]">
              Private Photo Storage
            </p>
            <h2 className={`font-serif text-2xl sm:text-3xl font-semibold mb-4 ${headingColor}`}>
              Upload New Memories
            </h2>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  handleFilesSelected(e.dataTransfer.files);
                }}
                onClick={() => fileInputRef.current?.click()}
                className="p-5 rounded-2xl border-2 border-dashed border-[#FBCFE8] bg-[#FFF7F9] hover:bg-[#FCE7F3]/50 text-center cursor-pointer transition-colors"
              >
                {uploadPreviews.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2">
                    {uploadPreviews.map((url, idx) => (
                      <img
                        key={idx}
                        src={url}
                        alt={`Selected preview ${idx + 1}`}
                        className="w-full h-20 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                ) : (
                  <div>
                    <span className="material-symbols-outlined text-[32px] text-[#EC4899] mb-1">
                      cloud_upload
                    </span>
                    <p className="text-sm font-semibold text-[#BE185D]">
                      Drop up to 8 photos or click to browse
                    </p>
                    <p className="text-xs text-[#927C89] mt-0.5">
                      JPEG, PNG, WEBP, or GIF (max 5 MB each)
                    </p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  onChange={(e) => handleFilesSelected(e.target.files)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Or Image URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#FBCFE8] text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Evening Walk"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#FBCFE8] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as MemoryCategory)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#FBCFE8] text-sm"
                  >
                    {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#FBCFE8] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Marine Drive"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#FBCFE8] text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Caption</label>
                <textarea
                  rows={3}
                  placeholder="Write what made this moment unforgettable..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#FBCFE8] text-sm font-serif italic"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowUploadModal(false);
                    resetUploadForm();
                  }}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-[#927C89] hover:bg-black/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`px-6 py-2.5 rounded-xl text-white text-sm font-semibold cursor-pointer ${
                    isAquatic
                      ? 'bg-[#0077B6]'
                      : 'bg-gradient-to-r from-[#EC4899] to-[#BE185D]'
                  }`}
                >
                  {submitting ? 'Saving...' : 'Save Memories'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Memory Modal */}
      {editingMemory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-xs animate-fade-in">
          <div className="bg-[#FFF9F2] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[#FBCFE8] relative animate-scale-up text-[#44313B]">
            <button
              type="button"
              onClick={() => setEditingMemory(null)}
              aria-label="Close edit dialog"
              className="absolute top-5 right-5 text-[#927C89] hover:text-[#44313B] p-1 rounded-full cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <h2 className={`font-serif text-2xl font-semibold mb-4 ${headingColor}`}>
              Edit Memory Details
            </h2>
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#FBCFE8] text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Date</label>
                  <input
                    type="date"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#FBCFE8] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Category</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value as MemoryCategory)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#FBCFE8] text-sm"
                  >
                    {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Location</label>
                <input
                  type="text"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#FBCFE8] text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Caption</label>
                <textarea
                  rows={3}
                  value={editCaption}
                  onChange={(e) => setEditCaption(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#FBCFE8] text-sm font-serif italic"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingMemory(null)}
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
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
