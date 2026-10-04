import React, { useState, useRef } from 'react';
import { MemoryItem, ThemeMode } from '../types';

interface GallerySectionProps {
  memories: MemoryItem[];
  theme?: ThemeMode;
  onAddMemory: (memory: Omit<MemoryItem, 'id' | 'likes'>) => void;
  onEditMemory: (memory: MemoryItem) => void;
  onDeleteMemory: (id: string) => void;
  onLikeMemory: (id: string) => void;
  onOpenLightbox: (memory: MemoryItem) => void;
  onShowerFlowers: () => void;
}

export const GallerySection: React.FC<GallerySectionProps> = ({
  memories,
  theme = 'romantic',
  onAddMemory,
  onEditMemory,
  onDeleteMemory,
  onLikeMemory,
  onOpenLightbox,
  onShowerFlowers,
}) => {
  const [filter, setFilter] = useState<'all' | 'trips' | 'silly' | 'milestones'>('all');
  const [selectedTag, setSelectedTag] = useState('Adventures');
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadQuote, setUploadQuote] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [isPinnedFeedback, setIsPinnedFeedback] = useState(false);

  // Edit memory modal state
  const [editingMemory, setEditingMemory] = useState<MemoryItem | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCaption, setEditCaption] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editTag, setEditTag] = useState('');
  const [editCategory, setEditCategory] = useState<'trips' | 'silly' | 'milestones'>('trips');
  const [editImageUrl, setEditImageUrl] = useState('');
  const [editAuthor, setEditAuthor] = useState('');

  const isAquatic = theme === 'aquatic';
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const filteredMemories = memories.filter((item) => {
    if (filter === 'all') return true;
    return item.category === filter;
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPreviewImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPreviewImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitUpload = (e: React.FormEvent) => {
    e.preventDefault();
    const finalImage =
      previewImage ||
      imageUrlInput.trim() ||
      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80';
    const finalTitle = uploadTitle.trim() || 'A Precious Memory';
    const finalQuote = uploadQuote.trim() || '“One of those days where everything felt like poetry.”';
    const finalAuthor = authorName.trim() || 'Bestie';

    let cat: 'trips' | 'silly' | 'milestones' = 'trips';
    if (selectedTag === 'Unfiltered smiles' || selectedTag === 'Coffee dates') cat = 'silly';
    if (selectedTag === 'Milestones') cat = 'milestones';

    onAddMemory({
      title: finalTitle,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' • New Memory',
      category: cat,
      tag: selectedTag,
      caption: finalQuote,
      imageUrl: finalImage,
      author: finalAuthor,
      authorInitial: finalAuthor.charAt(0).toUpperCase() || 'M',
    });

    setIsPinnedFeedback(true);
    onShowerFlowers();

    setPreviewImage(null);
    setImageUrlInput('');
    setUploadTitle('');
    setUploadQuote('');
    setAuthorName('');
    if (fileInputRef.current) fileInputRef.current.value = '';

    setTimeout(() => {
      setIsPinnedFeedback(false);
    }, 3000);
  };

  const openEditModal = (mem: MemoryItem) => {
    setEditingMemory(mem);
    setEditTitle(mem.title);
    setEditCaption(mem.caption);
    setEditDate(mem.date);
    setEditTag(mem.tag);
    setEditCategory(mem.category === 'all' ? 'trips' : mem.category);
    setEditImageUrl(mem.imageUrl);
    setEditAuthor(mem.author);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMemory) return;

    onEditMemory({
      ...editingMemory,
      title: editTitle.trim() || editingMemory.title,
      caption: editCaption.trim() || editingMemory.caption,
      date: editDate.trim() || editingMemory.date,
      tag: editTag.trim() || editingMemory.tag,
      category: editCategory,
      imageUrl: editImageUrl.trim() || editingMemory.imageUrl,
      author: editAuthor.trim() || editingMemory.author,
      authorInitial: editAuthor.trim().charAt(0).toUpperCase() || editingMemory.authorInitial,
    });

    setEditingMemory(null);
    onShowerFlowers();
  };

  return (
    <section id="memories-gallery" className="max-w-[1200px] mx-auto px-4 md:px-8 py-16 md:py-24 w-full relative z-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <span
            className={`text-[11px] font-bold uppercase tracking-widest font-sans ${
              isAquatic ? 'text-[#0077b6]' : 'text-[#735c00]'
            }`}
          >
            {isAquatic ? 'Ocean Visual Chronicle' : 'Visual Chronicle'}
          </span>
          <h2
            className={`font-serif text-[32px] md:text-[38px] mt-1 font-normal ${
              isAquatic ? 'text-[#03045e]' : 'text-[#5d1826]'
            }`}
          >
            {isAquatic ? 'Treasured Sea Keepsake Gallery' : 'Treasured Keepsake Gallery'}
          </h2>
          <p className="text-sm md:text-base text-[#544244] mt-1">
            Candid frames, honest moments, and laughter etched in amber light.
          </p>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap gap-2">
          {(['all', 'trips', 'silly', 'milestones'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                filter === cat
                  ? isAquatic
                    ? 'bg-[#0077b6] text-white shadow-sm'
                    : 'bg-[#5d1826] text-white shadow-sm'
                  : 'bg-[#ffffff]/80 text-[#544244] hover:bg-white border border-[#d9c1c2]/40'
              }`}
              type="button"
            >
              {cat === 'all'
                ? 'All Memories'
                : cat === 'trips'
                ? 'Trips & Sunsets'
                : cat === 'silly'
                ? 'Silly Moments'
                : 'Milestones'}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Grid with Upload Slot */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Interactive Upload Card */}
        <div className="bg-[#ffffff]/90 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-[#ffd9dc]/60 flex flex-col justify-between group transition-all duration-300 hover:shadow-md">
          <form onSubmit={handleSubmitUpload} className="flex flex-col h-full justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-bold text-[#5d1826] uppercase font-sans">
                  Add Your Frame
                </span>
                <span className="material-symbols-outlined text-[#735c00] text-[20px]">
                  add_photo_alternate
                </span>
              </div>
              <p className="font-serif text-[20px] font-semibold text-[#5d1826] mb-1">
                Upload a Memory
              </p>
              <p className="text-xs text-[#544244] mb-4">
                Add your favorite candid snapshot to this shared treasure chest.
              </p>

              {/* Drag and Drop Target */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-6 px-4 bg-[#f7f3ed]/70 hover:bg-[#ebe8e2]/80 border border-dashed border-[#d9c1c2] rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-colors relative overflow-hidden"
              >
                {previewImage ? (
                  <div className="relative w-full h-32 rounded-lg overflow-hidden">
                    <img
                      src={previewImage}
                      alt="Upload preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/35 flex items-center justify-center text-white text-xs font-medium">
                      Click to change photo
                    </div>
                  </div>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[32px] text-[#5d1826]/70 mb-2">
                      cloud_upload
                    </span>
                    <span className="text-xs font-semibold text-[#5d1826]">
                      Drop a favorite photo here
                    </span>
                    <span className="text-[11px] text-[#544244] mt-0.5">or browse your library</span>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  type="file"
                  onChange={handleFileChange}
                />
              </div>

              {/* Toggle to input URL directly */}
              <div className="mt-2 text-right">
                <button
                  type="button"
                  onClick={() => setShowUrlInput(!showUrlInput)}
                  className="text-[11px] text-[#735c00] underline font-medium cursor-pointer"
                >
                  {showUrlInput ? 'Hide Image Link Input' : 'Or paste image link'}
                </button>
              </div>

              {showUrlInput && (
                <div className="mt-2">
                  <input
                    type="url"
                    placeholder="https://example.com/photo.jpg"
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg bg-[#f7f3ed] border border-[#d9c1c2] text-[#1c1c18] outline-none"
                  />
                </div>
              )}

              {/* Title & Caption inputs */}
              <div className="mt-3 space-y-2">
                <input
                  type="text"
                  placeholder="Memory Title (e.g. Sunset in Venice)"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg bg-[#f7f3ed] border border-[#d9c1c2] text-[#1c1c18] outline-none"
                />
                <input
                  type="text"
                  placeholder="Short quote or reflection..."
                  value={uploadQuote}
                  onChange={(e) => setUploadQuote(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg bg-[#f7f3ed] border border-[#d9c1c2] text-[#1c1c18] outline-none italic"
                />
                <input
                  type="text"
                  placeholder="Your Name (e.g. Maya)"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg bg-[#f7f3ed] border border-[#d9c1c2] text-[#1c1c18] outline-none"
                />
              </div>

              {/* Tag Presets */}
              <div className="mt-3">
                <span className="text-[10px] font-bold text-[#544244] uppercase block mb-1.5 font-sans">
                  Select Mood Tag
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {['Coffee dates', 'Adventures', 'Unfiltered smiles', 'Milestones'].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setSelectedTag(tag)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors cursor-pointer ${
                        selectedTag === tag
                          ? 'bg-[#ffd9dc] text-[#5d1826] font-semibold border border-[#ffb2ba]'
                          : 'bg-[#f1ede7] text-[#544244] hover:bg-[#ffd9dc]/50'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              className={`mt-5 w-full py-2.5 rounded-lg text-xs font-semibold shadow-xs transition-all cursor-pointer ${
                isPinnedFeedback
                  ? 'bg-[#735c00] text-white'
                  : isAquatic
                  ? 'bg-[#0077b6] text-white hover:bg-[#023e8a]'
                  : 'bg-[#5d1826] text-white hover:bg-[#7a2e3b]'
              }`}
              type="submit"
            >
              {isPinnedFeedback ? 'Memory Pinned With Love 🌸' : 'Pin Photo to Keepsake'}
            </button>
          </form>
        </div>

        {/* Existing Memory Cards */}
        {filteredMemories.map((card) => (
          <div
            key={card.id}
            className={`bg-[#ffffff] p-5 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col border hover:-translate-y-1 group relative ${
              isAquatic ? 'border-[#caf0f8]' : 'border-[#ffd9dc]/40'
            }`}
          >
            {/* Image Frame */}
            <div
              onClick={() => onOpenLightbox(card)}
              className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-[#f1ede7] shadow-inner mb-4 cursor-pointer"
            >
              <img
                alt={card.title}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                src={card.imageUrl}
                loading="lazy"
              />
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-xs text-[10px] font-bold text-[#5d1826] uppercase font-sans tracking-wider shadow-2xs">
                {card.tag}
              </span>

              {/* Edit / Delete quick buttons overlay */}
              <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    openEditModal(card);
                  }}
                  title="Edit Memory"
                  className="w-7 h-7 rounded-full bg-white/90 text-[#544244] hover:text-[#5d1826] hover:bg-white flex items-center justify-center shadow-xs cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[15px]">edit</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteMemory(card.id);
                  }}
                  title="Delete Memory"
                  className="w-7 h-7 rounded-full bg-white/90 text-[#544244] hover:text-red-600 hover:bg-white flex items-center justify-center shadow-xs cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[15px]">delete</span>
                </button>
              </div>

              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium gap-1 pointer-events-none">
                <span className="material-symbols-outlined text-[18px]">zoom_in</span>
                <span>Enlarge</span>
              </div>
            </div>

            {/* Meta row */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-[#735c00] uppercase tracking-wider font-sans">
                {card.date}
              </span>
              <button
                type="button"
                onClick={() => {
                  onLikeMemory(card.id);
                  onShowerFlowers();
                }}
                className="flex items-center gap-1 text-[#544244] hover:text-[#5d1826] transition-colors cursor-pointer group/like"
              >
                <span className="material-symbols-outlined text-[18px] group-hover/like:scale-125 transition-transform text-[#5d1826]">
                  favorite
                </span>
                <span className="text-xs font-semibold text-[#544244]">{card.likes}</span>
              </button>
            </div>

            <p
              onClick={() => onOpenLightbox(card)}
              className={`font-serif text-[20px] font-semibold mb-1 cursor-pointer hover:underline ${
                isAquatic ? 'text-[#03045e]' : 'text-[#5d1826]'
              }`}
            >
              {card.title}
            </p>

            <p className="font-serif italic text-[#544244] text-[15px] leading-relaxed line-clamp-3">
              {card.caption}
            </p>

            <div className="mt-auto pt-4 flex items-center justify-between border-t border-[#f1ede7]">
              <div className="flex items-center gap-2">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isAquatic ? 'bg-[#caf0f8] text-[#0077b6]' : 'bg-[#ffd9dc] text-[#3f0111]'
                  }`}
                >
                  {card.authorInitial}
                </div>
                <span className="text-xs text-[#544244] font-medium">Pinned by {card.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openEditModal(card)}
                  className="text-[11px] text-[#735c00] hover:underline font-semibold cursor-pointer"
                >
                  Edit
                </button>
                <span className="text-[#d9c1c2]">•</span>
                <button
                  type="button"
                  onClick={() => onOpenLightbox(card)}
                  className="text-[11px] text-[#735c00] hover:underline font-semibold cursor-pointer"
                >
                  Read note
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Memory Modal */}
      {editingMemory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-[#fdf9f3] rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-[#ffd9dc] relative animate-scale-up max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEditingMemory(null)}
              className="absolute top-5 right-5 text-[#877274] hover:text-[#5d1826] p-1 rounded-full cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <span className="text-[11px] font-bold text-[#735c00] uppercase tracking-wider font-sans">
              Edit Gallery Item
            </span>
            <h3
              className={`font-serif text-2xl font-semibold mb-4 ${
                isAquatic ? 'text-[#03045e]' : 'text-[#5d1826]'
              }`}
            >
              Update Treasured Memory
            </h3>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-[#544244] uppercase mb-1">
                  Memory Title
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-[#ffffff] border border-[#d9c1c2] outline-none text-[#1c1c18]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#544244] uppercase mb-1">
                  Story & Reflection
                </label>
                <textarea
                  required
                  rows={3}
                  value={editCaption}
                  onChange={(e) => setEditCaption(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-[#ffffff] border border-[#d9c1c2] outline-none text-[#1c1c18] italic font-serif"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#544244] uppercase mb-1">
                  Photo URL
                </label>
                <input
                  type="url"
                  required
                  value={editImageUrl}
                  onChange={(e) => setEditImageUrl(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-[#ffffff] border border-[#d9c1c2] outline-none text-[#1c1c18]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#544244] uppercase mb-1">
                    Date Tag
                  </label>
                  <input
                    type="text"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg bg-[#ffffff] border border-[#d9c1c2] outline-none text-[#1c1c18]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#544244] uppercase mb-1">
                    Mood Badge
                  </label>
                  <input
                    type="text"
                    value={editTag}
                    onChange={(e) => setEditTag(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg bg-[#ffffff] border border-[#d9c1c2] outline-none text-[#1c1c18]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#544244] uppercase mb-1">
                  Pinned By
                </label>
                <input
                  type="text"
                  value={editAuthor}
                  onChange={(e) => setEditAuthor(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-[#ffffff] border border-[#d9c1c2] outline-none text-[#1c1c18]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#d9c1c2]/50">
                <button
                  type="button"
                  onClick={() => setEditingMemory(null)}
                  className="px-4 py-2 rounded-lg text-sm text-[#544244] hover:bg-[#ebe8e2] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 rounded-lg text-white text-sm font-semibold shadow-sm transition-colors cursor-pointer ${
                    isAquatic ? 'bg-[#0077b6] hover:bg-[#023e8a]' : 'bg-[#5d1826] hover:bg-[#7a2e3b]'
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
