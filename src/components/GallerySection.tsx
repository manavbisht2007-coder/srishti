import React, { useState, useRef } from 'react';
import { MemoryItem } from '../types';

interface GallerySectionProps {
  memories: MemoryItem[];
  onAddMemory: (memory: Omit<MemoryItem, 'id' | 'likes'>) => void;
  onLikeMemory: (id: string) => void;
  onOpenLightbox: (memory: MemoryItem) => void;
  onShowerFlowers: () => void;
}

export const GallerySection: React.FC<GallerySectionProps> = ({
  memories,
  onAddMemory,
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
    const finalImage = previewImage || imageUrlInput.trim() || 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80';
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

    // Reset fields
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

  return (
    <section id="memories-gallery" className="max-w-[1200px] mx-auto px-4 md:px-8 py-16 md:py-24 w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <span className="text-[11px] font-bold text-[#735c00] uppercase tracking-widest font-sans">
            Visual Chronicle
          </span>
          <h2 className="font-serif text-[32px] md:text-[38px] text-[#5d1826] mt-1 font-normal">
            Treasured Keepsake Gallery
          </h2>
          <p className="text-sm md:text-base text-[#544244] mt-1">
            Candid frames, honest moments, and laughter etched in amber light.
          </p>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-[#5d1826] text-white shadow-sm'
                : 'bg-[#f7f3ed] text-[#544244] hover:bg-[#ebe8e2]'
            }`}
            type="button"
          >
            All Memories
          </button>
          <button
            onClick={() => setFilter('trips')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              filter === 'trips'
                ? 'bg-[#5d1826] text-white shadow-sm'
                : 'bg-[#f7f3ed] text-[#544244] hover:bg-[#ebe8e2]'
            }`}
            type="button"
          >
            Trips & Sunsets
          </button>
          <button
            onClick={() => setFilter('silly')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              filter === 'silly'
                ? 'bg-[#5d1826] text-white shadow-sm'
                : 'bg-[#f7f3ed] text-[#544244] hover:bg-[#ebe8e2]'
            }`}
            type="button"
          >
            Silly Moments
          </button>
          <button
            onClick={() => setFilter('milestones')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              filter === 'milestones'
                ? 'bg-[#5d1826] text-white shadow-sm'
                : 'bg-[#f7f3ed] text-[#544244] hover:bg-[#ebe8e2]'
            }`}
            type="button"
          >
            Milestones
          </button>
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
                Add your favorite candid snapshot of her to this shared treasure chest.
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
                  : 'bg-[#5d1826] text-white hover:bg-[#7a2e3b] hover:shadow-md'
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
            className="bg-[#ffffff] p-5 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col border border-[#ffd9dc]/40 hover:-translate-y-1 group"
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
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium gap-1">
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
              className="font-serif text-[20px] font-semibold text-[#5d1826] mb-1 cursor-pointer hover:underline"
            >
              {card.title}
            </p>

            <p className="font-serif italic text-[#544244] text-[15px] leading-relaxed line-clamp-3">
              {card.caption}
            </p>

            <div className="mt-auto pt-4 flex items-center justify-between border-t border-[#f1ede7]">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#ffd9dc] flex items-center justify-center text-[10px] text-[#3f0111] font-bold">
                  {card.authorInitial}
                </div>
                <span className="text-xs text-[#544244] font-medium">Pinned by {card.author}</span>
              </div>
              <button
                type="button"
                onClick={() => onOpenLightbox(card)}
                className="text-[11px] text-[#735c00] hover:underline font-semibold"
              >
                Read note
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
