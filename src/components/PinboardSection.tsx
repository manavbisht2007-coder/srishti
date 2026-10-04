import React, { useState } from 'react';
import { StickyWish } from '../types';

interface PinboardSectionProps {
  wishes: StickyWish[];
  onAddWish: (wish: Omit<StickyWish, 'id' | 'timestamp'>) => void;
  onShowerFlowers: () => void;
}

export const PinboardSection: React.FC<PinboardSectionProps> = ({
  wishes,
  onAddWish,
  onShowerFlowers,
}) => {
  const [senderName, setSenderName] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [selectedStamp, setSelectedStamp] = useState('✨');
  const [selectedTag, setSelectedTag] = useState('#sunshine');
  const [customTag, setCustomTag] = useState('');
  const [isPinnedSuccess, setIsPinnedSuccess] = useState(false);

  const stamps = ['✨', '💐', '💖', '🥂', '🌸', '💌', '☕', '🌟'];
  const popularTags = ['#sunshine', '#forever', '#blessings', '#partnersInCrime', '#laughter'];

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

  return (
    <section id="wish-wall" className="max-w-[1200px] mx-auto px-4 md:px-8 py-16 md:py-24 w-full">
      <div className="flex flex-col items-center text-center mb-12">
        <span className="text-[11px] font-bold text-[#735c00] uppercase tracking-widest font-sans">
          Kind Wishes & Sticky Notes
        </span>
        <h2 className="font-serif text-[32px] md:text-[38px] text-[#5d1826] mt-1 font-normal">
          The Warm Friendship Pinboard
        </h2>
        <p className="text-sm md:text-base text-[#544244] max-w-lg mt-2 leading-relaxed">
          Pin a sticker, leave an inside joke, or write a blessing for her journey ahead.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Interactive Note Creator Form */}
        <div className="lg:col-span-5 bg-[#ffffff] rounded-3xl p-6 md:p-8 shadow-md border border-[#ffd9dc]/60">
          <h3 className="font-serif text-[20px] font-semibold text-[#5d1826] mb-1">
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
                        ? 'bg-[#ffd9dc] ring-2 ring-[#5d1826] scale-110 shadow-sm'
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
                        ? 'bg-[#7a2e3b] text-white font-semibold'
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
                  : 'bg-[#5d1826] text-white hover:bg-[#7a2e3b] hover:shadow-[0_0_16px_rgba(212,175,55,0.3)] active:scale-95'
              }`}
            >
              {isPinnedSuccess ? 'Pinned With Love to Wall 📌🌸' : 'Pin to Friendship Wall 📌'}
            </button>
          </form>
        </div>

        {/* Pastel Pinboard Grid */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {wishes.map((wish) => {
            let bgClass = 'bg-[#f7f3ed]';
            let tapeClass = 'bg-[#ffe088]/60';

            if (wish.colorTheme === 'rose') {
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
                    <span className="text-[11px] font-bold text-[#877274] tracking-wider uppercase font-sans">
                      {wish.timestamp}
                    </span>
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
          })}
        </div>
      </div>
    </section>
  );
};
