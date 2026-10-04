import React, { useState } from 'react';
import { StickyWish, ThemeMode } from '../types';

interface PinboardSectionProps {
  wishes: StickyWish[];
  theme?: ThemeMode;
  onAddWish: (wish: Omit<StickyWish, 'id' | 'timestamp'>) => void;
  onEditWish: (wish: StickyWish) => void;
  onDeleteWish: (id: string) => void;
  onShowerFlowers: () => void;
}

export const PinboardSection: React.FC<PinboardSectionProps> = ({
  wishes,
  theme = 'romantic',
  onAddWish,
  onEditWish,
  onDeleteWish,
  onShowerFlowers,
}) => {
  const [senderName, setSenderName] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [selectedStamp, setSelectedStamp] = useState('✨');
  const [selectedTag, setSelectedTag] = useState('#sunshine');
  const [customTag, setCustomTag] = useState('');
  const [isPinnedSuccess, setIsPinnedSuccess] = useState(false);

  // Edit wish state
  const [editingWish, setEditingWish] = useState<StickyWish | null>(null);
  const [editName, setEditName] = useState('');
  const [editNote, setEditNote] = useState('');
  const [editStamp, setEditStamp] = useState('✨');
  const [editTag, setEditTag] = useState('');

  const isAquatic = theme === 'aquatic';

  const stamps = isAquatic
    ? ['🫧', '🐚', '🐋', '🐬', '🌊', '🌟', '💖', '✨']
    : ['✨', '💐', '💖', '🥂', '🌸', '💌', '☕', '🌟'];

  const popularTags = isAquatic
    ? ['#oceanOfLove', '#deepestTrust', '#foreverSoulmate', '#seaAdventures', '#sunshine']
    : ['#sunshine', '#forever', '#blessings', '#partnersInCrime', '#laughter'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName.trim() || !noteContent.trim()) return;

    const finalTag = customTag.trim()
      ? customTag.startsWith('#')
        ? customTag.trim()
        : `#${customTag.trim()}`
      : selectedTag;

    const colorOptions: StickyWish['colorTheme'][] = ['ivory', 'rose', 'gold', 'soft-taupe'];
    const assignedTheme = colorOptions[wishes.length % colorOptions.length];

    onAddWish({
      name: senderName.trim(),
      note: noteContent.trim(),
      stamp: selectedStamp,
      tag: finalTag,
      colorTheme: assignedTheme,
    });

    setSenderName('');
    setNoteContent('');
    setCustomTag('');
    setIsPinnedSuccess(true);
    onShowerFlowers();

    setTimeout(() => {
      setIsPinnedSuccess(false);
    }, 2800);
  };

  const openEditModal = (wish: StickyWish) => {
    setEditingWish(wish);
    setEditName(wish.name);
    setEditNote(wish.note);
    setEditStamp(wish.stamp);
    setEditTag(wish.tag);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWish) return;

    onEditWish({
      ...editingWish,
      name: editName.trim() || editingWish.name,
      note: editNote.trim() || editingWish.note,
      stamp: editStamp || editingWish.stamp,
      tag: editTag.trim() || editingWish.tag,
    });

    setEditingWish(null);
    onShowerFlowers();
  };

  return (
    <section id="wish-wall" className="max-w-[1200px] mx-auto px-4 md:px-8 py-16 md:py-24 w-full relative z-10">
      <div className="flex flex-col items-center text-center mb-12">
        <span
          className={`text-[11px] font-bold uppercase tracking-widest font-sans ${
            isAquatic ? 'text-[#0077b6]' : 'text-[#735c00]'
          }`}
        >
          {isAquatic ? 'Kind Sea Notes & Wishes' : 'Kind Wishes & Sticky Notes'}
        </span>
        <h2
          className={`font-serif text-[32px] md:text-[38px] mt-1 font-normal ${
            isAquatic ? 'text-[#03045e]' : 'text-[#5d1826]'
          }`}
        >
          {isAquatic ? 'The Warm Ocean Pinboard' : 'The Warm Friendship Pinboard'}
        </h2>
        <p className="text-sm md:text-base text-[#544244] max-w-lg mt-2 leading-relaxed">
          Pin a sticker, leave an inside joke, or write a blessing for her journey ahead.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Interactive Note Creator Form */}
        <div className="lg:col-span-5 bg-[#ffffff] rounded-3xl p-6 md:p-8 shadow-md border border-[#ffd9dc]/60">
          <h3
            className={`font-serif text-[20px] font-semibold mb-1 ${
              isAquatic ? 'text-[#03045e]' : 'text-[#5d1826]'
            }`}
          >
            Pin Your Heartfelt Wish
          </h3>
          <p className="text-xs text-[#544244] mb-6">
            Leave a warm token to adorn her perpetual memory wall.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className="block text-[11px] font-bold text-[#544244] mb-1 uppercase font-sans"
                htmlFor="sender-name"
              >
                Your Name / Nickname
              </label>
              <input
                id="sender-name"
                required
                type="text"
                placeholder="e.g. Your Partner in Crime"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-[#f7f3ed] text-[#1c1c18] text-sm placeholder:italic placeholder:text-[#877274] focus:outline-none focus:bg-[#ebe8e2] border border-[#d9c1c2]/50 transition-all"
              />
            </div>

            <div>
              <label
                className="block text-[11px] font-bold text-[#544244] mb-1 uppercase font-sans"
                htmlFor="note-content"
              >
                Your Tribute Note
              </label>
              <textarea
                id="note-content"
                required
                rows={4}
                placeholder="Write something heartfelt, nostalgic, or hilarious..."
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-[#f7f3ed] text-[#1c1c18] text-sm placeholder:italic placeholder:text-[#877274] focus:outline-none focus:bg-[#ebe8e2] border border-[#d9c1c2]/50 transition-all font-serif italic"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#544244] mb-2 uppercase font-sans">
                Choose a Washi Stamp
              </label>
              <div className="flex flex-wrap items-center gap-2">
                {stamps.map((stamp) => (
                  <button
                    key={stamp}
                    type="button"
                    onClick={() => setSelectedStamp(stamp)}
                    className={`text-2xl p-2 rounded-xl transition-all cursor-pointer ${
                      selectedStamp === stamp
                        ? isAquatic
                          ? 'bg-[#caf0f8] ring-2 ring-[#0077b6] scale-110 shadow-sm'
                          : 'bg-[#ffd9dc] ring-2 ring-[#5d1826] scale-110 shadow-sm'
                        : 'bg-[#f1ede7] hover:bg-[#ebe8e2] hover:scale-105'
                    }`}
                  >
                    {stamp}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#544244] mb-1.5 uppercase font-sans">
                Select or Add Hashtag
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {popularTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      setSelectedTag(tag);
                      setCustomTag('');
                    }}
                    className={`px-2.5 py-1 rounded-full text-xs transition-colors cursor-pointer ${
                      selectedTag === tag && !customTag
                        ? isAquatic
                          ? 'bg-[#0077b6] text-white font-semibold'
                          : 'bg-[#7a2e3b] text-white font-semibold'
                        : 'bg-[#f1ede7] text-[#544244] hover:bg-[#ffd9dc]'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <input
                type="text"
                placeholder="Or custom tag (e.g. #foreverFriends)"
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg bg-[#f7f3ed] text-[#1c1c18] border border-[#d9c1c2]/50 outline-none"
              />
            </div>

            <button
              type="submit"
              className={`w-full py-3.5 rounded-lg text-sm font-semibold shadow-sm transition-all cursor-pointer ${
                isPinnedSuccess
                  ? 'bg-[#735c00] text-white'
                  : isAquatic
                  ? 'bg-[#0077b6] text-white hover:bg-[#023e8a]'
                  : 'bg-[#5d1826] text-white hover:bg-[#7a2e3b] hover:shadow-[0_0_16px_rgba(212,175,55,0.3)] active:scale-95'
              }`}
            >
              {isPinnedSuccess ? 'Pinned With Love to Wall 📌🌸' : 'Pin to Friendship Wall 📌'}
            </button>
          </form>
        </div>

        {/* Pastel Pinboard Grid */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {wishes.length === 0 ? (
            <div className="sm:col-span-2 p-8 text-center text-sm text-[#877274] bg-[#f7f3ed] rounded-2xl border border-dashed border-[#d9c1c2]">
              No notes on the wall yet. Pin your first wish using the form on the left!
            </div>
          ) : (
            wishes.map((wish) => {
              let bgClass = 'bg-[#f7f3ed]';
              let tapeClass = 'bg-[#ffe088]/60';

              if (isAquatic) {
                bgClass = 'bg-[#e0fbfc]/70 border border-[#90e0ef]/60';
                tapeClass = 'bg-[#48cae4]/50';
              } else if (wish.colorTheme === 'rose') {
                bgClass = 'bg-[#ffd9dc]/40 border border-[#ffb2ba]/50';
                tapeClass = 'bg-[#7a2e3b]/25';
              } else if (wish.colorTheme === 'gold') {
                bgClass = 'bg-[#fed65b]/20 border border-[#fed65b]/40';
                tapeClass = 'bg-[#e9c349]/50';
              } else if (wish.colorTheme === 'soft-taupe') {
                bgClass = 'bg-[#ebe8e2] border border-[#d9c1c2]/50';
                tapeClass = 'bg-[#877274]/30';
              }

              return (
                <div
                  key={wish.id}
                  className={`relative ${bgClass} p-5 rounded-2xl shadow-sm hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group`}
                >
                  {/* Washi Tape Strip Accent */}
                  <div
                    className={`absolute -top-2.5 left-1/2 -translate-x-1/2 w-12 h-4.5 ${tapeClass} backdrop-blur-xs shadow-2xs rounded-2xs pointer-events-none`}
                  />

                  <div>
                    <div className="flex items-center justify-between mb-3 pt-2">
                      <span className="text-xl">{wish.stamp}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-bold text-[#877274] tracking-wider uppercase font-sans">
                          {wish.timestamp}
                        </span>
                        {/* Edit & Delete Note Buttons */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                          <button
                            type="button"
                            onClick={() => openEditModal(wish)}
                            title="Edit Note"
                            className="p-1 text-[#877274] hover:text-[#5d1826] cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[15px]">edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteWish(wish.id)}
                            title="Delete Note"
                            className="p-1 text-[#877274] hover:text-red-600 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[15px]">delete</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    <p className="font-serif italic text-[#1c1c18] text-[17px] leading-relaxed mb-4">
                      “{wish.note}”
                    </p>
                  </div>

                  <div className="flex items-center justify-between font-sans text-xs text-[#5d1826] font-semibold pt-2 border-t border-black/5">
                    <span>— {wish.name}</span>
                    <span className="text-xs text-[#544244] font-normal">{wish.tag}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Edit Sticky Note Modal */}
      {editingWish && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-[#fdf9f3] rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-[#ffd9dc] relative animate-scale-up">
            <button
              onClick={() => setEditingWish(null)}
              className="absolute top-5 right-5 text-[#877274] hover:text-[#5d1826] p-1 rounded-full cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <span className="text-[11px] font-bold text-[#735c00] uppercase tracking-wider font-sans">
              Edit Sticky Note
            </span>
            <h3
              className={`font-serif text-2xl font-semibold mb-4 ${
                isAquatic ? 'text-[#03045e]' : 'text-[#5d1826]'
              }`}
            >
              Update Tribute Wish
            </h3>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-[#544244] uppercase mb-1 font-sans">
                  Author / Name
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-white border border-[#d9c1c2] outline-none text-[#1c1c18]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#544244] uppercase mb-1 font-sans">
                  Tribute Note
                </label>
                <textarea
                  required
                  rows={4}
                  value={editNote}
                  onChange={(e) => setEditNote(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-white border border-[#d9c1c2] outline-none text-[#1c1c18] font-serif italic"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#544244] uppercase mb-1 font-sans">
                  Choose Stamp
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  {stamps.map((stamp) => (
                    <button
                      key={stamp}
                      type="button"
                      onClick={() => setEditStamp(stamp)}
                      className={`text-2xl p-2 rounded-xl transition-all cursor-pointer ${
                        editStamp === stamp
                          ? 'bg-[#ffd9dc] ring-2 ring-[#5d1826] scale-110 shadow-sm'
                          : 'bg-[#f1ede7] hover:bg-[#ebe8e2]'
                      }`}
                    >
                      {stamp}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#544244] uppercase mb-1 font-sans">
                  Tag
                </label>
                <input
                  type="text"
                  value={editTag}
                  onChange={(e) => setEditTag(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg bg-white border border-[#d9c1c2] outline-none text-[#1c1c18]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-[#d9c1c2]/50">
                <button
                  type="button"
                  onClick={() => setEditingWish(null)}
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
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
