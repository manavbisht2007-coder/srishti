import React, { useState, useEffect } from 'react';
import { LetterItem, ThemeMode } from '../types';

interface LettersSectionProps {
  letters: LetterItem[];
  theme?: ThemeMode;
  mainLetterTitle: string;
  mainLetterContent: string;
  onOpenLetter: (letter: LetterItem) => void;
  onAddLetter: (letter: Omit<LetterItem, 'id'>) => void;
  onEditLetter: (letter: LetterItem) => void;
  onDeleteLetter: (id: string) => void;
  onEditMainLetter: (title: string, content: string) => void;
  onOpenCertificate: () => void;
  onShowerFlowers: () => void;
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
}

export const LettersSection: React.FC<LettersSectionProps> = ({
  letters,
  theme = 'romantic',
  mainLetterTitle,
  mainLetterContent,
  onOpenLetter,
  onAddLetter,
  onEditLetter,
  onDeleteLetter,
  onEditMainLetter,
  onOpenCertificate,
  onShowerFlowers,
  isMusicPlaying,
  onToggleMusic,
}) => {
  const [isLetterUnsealed, setIsLetterUnsealed] = useState(true);
  const [waveHeights, setWaveHeights] = useState<number[]>([12, 28, 36, 20, 32, 16, 40, 24, 32, 20, 12, 24, 36, 16]);

  // Modal states for editing
  const [editingLetter, setEditingLetter] = useState<LetterItem | null>(null);
  const [showAddLetterModal, setShowAddLetterModal] = useState(false);
  const [showEditMainModal, setShowEditMainModal] = useState(false);

  // Form states for Open When letter
  const [letterCondition, setLetterCondition] = useState('');
  const [letterTitle, setLetterTitle] = useState('');
  const [letterContent, setLetterContent] = useState('');

  // Form states for Main letter
  const [editMainTitle, setEditMainTitle] = useState(mainLetterTitle);
  const [editMainContent, setEditMainContent] = useState(mainLetterContent);

  const isAquatic = theme === 'aquatic';

  // Animate audio waveform bars when music is playing
  useEffect(() => {
    if (!isMusicPlaying) return;
    const interval = window.setInterval(() => {
      setWaveHeights((prev) =>
        prev.map(() => Math.floor(Math.random() * 32) + 8)
      );
    }, 180);
    return () => clearInterval(interval);
  }, [isMusicPlaying]);

  const handleToggleSeal = () => {
    setIsLetterUnsealed(!isLetterUnsealed);
    onShowerFlowers();
  };

  const openAddLetter = () => {
    setLetterCondition('Open When: ');
    setLetterTitle('');
    setLetterContent('');
    setShowAddLetterModal(true);
  };

  const openEditLetter = (l: LetterItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingLetter(l);
    setLetterCondition(l.condition);
    setLetterTitle(l.title);
    setLetterContent(l.content);
    setShowAddLetterModal(true);
  };

  const handleSaveLetter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!letterCondition.trim() || !letterContent.trim()) return;

    if (editingLetter) {
      onEditLetter({
        ...editingLetter,
        condition: letterCondition.trim(),
        title: letterTitle.trim() || letterCondition.trim(),
        content: letterContent.trim(),
        preview: letterContent.trim().slice(0, 60) + '...',
      });
    } else {
      onAddLetter({
        condition: letterCondition.trim(),
        title: letterTitle.trim() || letterCondition.trim(),
        content: letterContent.trim(),
        preview: letterContent.trim().slice(0, 60) + '...',
      });
    }

    setShowAddLetterModal(false);
    setEditingLetter(null);
    onShowerFlowers();
  };

  const handleSaveMainLetter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editMainTitle.trim() || !editMainContent.trim()) return;
    onEditMainLetter(editMainTitle.trim(), editMainContent.trim());
    setShowEditMainModal(false);
    onShowerFlowers();
  };

  return (
    <section
      id="heartfelt-letters"
      className={`w-full py-16 md:py-24 border-y transition-colors duration-500 relative z-10 ${
        isAquatic ? 'bg-[#caf0f8]/20 border-[#caf0f8]' : 'bg-[#fff5f8]/75 border-[#fbcfe8]/70'
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <span
            className={`text-[11px] font-bold uppercase tracking-widest font-sans ${
              isAquatic ? 'text-[#0077b6]' : 'text-[#db2777]'
            }`}
          >
            {isAquatic ? 'Bottled Messages & Ocean Notes' : 'Words For The Heart'}
          </span>
          <h2
            className={`font-serif text-[32px] md:text-[38px] mt-1 font-normal ${
              isAquatic ? 'text-[#03045e]' : 'text-[#9d174d]'
            }`}
          >
            {isAquatic ? 'Bottled Letters & Envelopes' : 'Keepsake Letters & Envelopes'}
          </h2>
          <p className="text-sm md:text-base text-[#831843] max-w-lg mt-2 leading-relaxed">
            Treasured notes sealed with tenderness, meant to be uncurled whenever you need a reminder of who you are to us.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Folded Stationery & Open When Envelopes */}
          <div className="lg:col-span-7 bg-[#ffffff] rounded-3xl p-6 md:p-8 shadow-md border border-[#fbcfe8]">
            <div className="flex items-center justify-between pb-6 border-b border-pink-100">
              <div className="flex items-center gap-3">
                <span
                  className={`material-symbols-outlined text-[28px] ${
                    isAquatic ? 'text-[#0077b6]' : 'text-[#ec4899]'
                  }`}
                >
                  markunread_mailbox
                </span>
                <div>
                  <span
                    className={`text-[11px] font-bold uppercase font-sans ${
                      isAquatic ? 'text-[#0077b6]' : 'text-[#db2777]'
                    }`}
                  >
                    Folded Stationery
                  </span>
                  <h3
                    className={`font-serif text-[20px] md:text-[22px] font-semibold ${
                      isAquatic ? 'text-[#03045e]' : 'text-[#9d174d]'
                    }`}
                  >
                    {mainLetterTitle}
                  </h3>
                </div>
              </div>

              {/* Action Buttons: Edit Main & Toggle Fold */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditMainTitle(mainLetterTitle);
                    setEditMainContent(mainLetterContent);
                    setShowEditMainModal(true);
                  }}
                  title="Edit this letter's message"
                  className="p-1.5 rounded-full text-[#831843] hover:text-[#db2777] hover:bg-[#fff0f5] transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                </button>
                <button
                  type="button"
                  onClick={handleToggleSeal}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full transition-all cursor-pointer border text-xs font-semibold shadow-2xs active:scale-95 ${
                    isAquatic
                      ? 'bg-[#caf0f8] text-[#03045e] hover:bg-[#90e0ef] border-[#90e0ef]'
                      : 'bg-[#fff0f5] text-[#db2777] hover:bg-[#fce7f3] border-[#fbcfe8]'
                  }`}
                >
                  <span>{isLetterUnsealed ? 'Fold Letter' : 'Break Wax Seal'}</span>
                  <span className="material-symbols-outlined text-[17px]">
                    {isLetterUnsealed ? 'lock' : 'lock_open'}
                  </span>
                </button>
              </div>
            </div>

            {/* Unfolded Letter Sheet */}
            <div
              className={`transition-all duration-700 overflow-hidden relative ${
                isLetterUnsealed
                  ? 'max-h-[850px] opacity-100 mt-6 bg-[#f7f3ed]/50 rounded-2xl p-6 md:p-8 border border-[#ffd9dc]/60'
                  : 'max-h-0 opacity-0 mt-0 py-0 border-0'
              }`}
            >
              {/* Vintage Paper Watermark Motif */}
              <div className="absolute right-4 bottom-4 opacity-5 pointer-events-none select-none">
                <span className="material-symbols-outlined text-[140px] text-[#5d1826]">
                  {isAquatic ? 'waves' : 'local_florist'}
                </span>
              </div>

              <div className="flex items-center justify-between mb-4">
                <p className="text-[11px] font-bold text-[#877274] uppercase tracking-widest font-sans">
                  TO MY IRREPLACEABLE BEST FRIEND —
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setEditMainTitle(mainLetterTitle);
                    setEditMainContent(mainLetterContent);
                    setShowEditMainModal(true);
                  }}
                  className="text-xs text-[#735c00] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px]">edit</span>
                  <span>Edit Letter</span>
                </button>
              </div>

              <div className="space-y-4 font-serif text-[16px] md:text-[18px] text-[#1c1c18] leading-relaxed whitespace-pre-line">
                {mainLetterContent}
              </div>

              <div className="flex items-center justify-between pt-4 mt-6 border-t border-[#d9c1c2]/40">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-[#5d1826] text-[#fed65b] flex items-center justify-center text-xs font-bold shadow-2xs">
                    ★
                  </span>
                  <span className="font-serif text-lg font-semibold text-[#5d1826]">
                    Forever in your corner, always.
                  </span>
                </div>
                <span className="text-[11px] font-bold text-[#877274] tracking-wider uppercase font-sans">
                  Sanctuary Archive • Forever
                </span>
              </div>
            </div>

            {/* Folded wax seal placeholder when folded */}
            {!isLetterUnsealed && (
              <div
                onClick={handleToggleSeal}
                className="mt-6 py-10 bg-[#f7f3ed]/60 rounded-2xl border border-dashed border-[#d9c1c2] flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[#ebe8e2] transition-colors"
              >
                <div className="w-14 h-14 rounded-full bg-[#7a2e3b] text-[#fed65b] flex items-center justify-center shadow-md mb-2">
                  <span className="material-symbols-outlined text-[28px]">mark_email_unread</span>
                </div>
                <p className="font-serif text-lg font-medium text-[#5d1826]">The letter is folded & wax-sealed</p>
                <p className="text-xs text-[#544244] mt-0.5">Click here or the button above to break the seal and read.</p>
              </div>
            )}

            {/* Secondary Sealed Mini Tabs ("Open When") */}
            <div className="mt-8 space-y-3">
              <div className="flex items-center justify-between">
                <span
                  className={`text-[11px] font-bold uppercase tracking-wider font-sans ${
                    isAquatic ? 'text-[#0077b6]' : 'text-[#735c00]'
                  }`}
                >
                  Sealed Vault: "Open When..." Letters ({letters.length})
                </span>
                <button
                  type="button"
                  onClick={openAddLetter}
                  className={`text-xs font-semibold px-3 py-1 rounded-full border transition-all flex items-center gap-1 cursor-pointer ${
                    isAquatic
                      ? 'bg-white text-[#0077b6] border-[#90e0ef] hover:bg-[#e0fbfc]'
                      : 'bg-white text-[#5d1826] border-[#ffd9dc] hover:bg-[#ffd9dc]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]">add</span>
                  <span>Add New Sealed Letter</span>
                </button>
              </div>

              {letters.length === 0 ? (
                <div className="p-6 text-center text-sm text-[#877274] bg-[#f7f3ed] rounded-xl border border-dashed border-[#d9c1c2]">
                  No sealed letters left. Click "Add New Sealed Letter" to craft one!
                </div>
              ) : (
                letters.map((letter) => (
                  <div
                    key={letter.id}
                    onClick={() => onOpenLetter(letter)}
                    className="p-4 rounded-xl bg-[#f7f3ed] hover:bg-[#ebe8e2] border border-[#ffd9dc]/70 flex items-center justify-between transition-all cursor-pointer group hover:-translate-y-0.5 shadow-2xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[#735c00] text-[22px] group-hover:scale-110 transition-transform">
                        drafts
                      </span>
                      <span className="text-sm md:text-base text-[#1c1c18] font-medium group-hover:text-[#5d1826] transition-colors">
                        {letter.condition}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => openEditLetter(letter, e)}
                        title="Edit Letter"
                        className="p-1 text-[#877274] hover:text-[#5d1826] cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteLetter(letter.id);
                        }}
                        title="Delete Letter"
                        className="p-1 text-[#877274] hover:text-red-600 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                      <span className="text-[11px] font-bold text-[#877274] group-hover:text-[#5d1826] uppercase font-sans tracking-wider whitespace-nowrap ml-1">
                        Sealed • Click
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Column: Audio Memory Box & Friendship Pact */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Audio Memory Box */}
            <div className="bg-[#ffffff] rounded-3xl p-6 md:p-8 shadow-md border border-[#ffd9dc]/50">
              <span
                className={`text-[11px] font-bold uppercase tracking-wider font-sans ${
                  isAquatic ? 'text-[#0077b6]' : 'text-[#735c00]'
                }`}
              >
                Audio Keepsake
              </span>
              <h3
                className={`font-serif text-[20px] md:text-[22px] font-semibold mt-1 mb-2 ${
                  isAquatic ? 'text-[#03045e]' : 'text-[#5d1826]'
                }`}
              >
                Our Road Trip Voice Tape
              </h3>
              <p className="text-xs md:text-sm text-[#544244] mb-6 leading-relaxed">
                A snippet of spontaneous car singing, bad acoustic guitar, and pure joyous laughter from Highway 1.
              </p>

              {/* Audio Player Glass Component */}
              <div className="p-4 rounded-2xl bg-[#f7f3ed] border border-[#ffd9dc] flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={onToggleMusic}
                      className={`w-12 h-12 rounded-full text-[#fed65b] flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer border ${
                        isAquatic
                          ? 'bg-[#0077b6] border-[#90e0ef]'
                          : 'bg-[#5d1826] border-[#fed65b]/40'
                      }`}
                      type="button"
                      title={isMusicPlaying ? 'Pause melody' : 'Play melody'}
                    >
                      <span className="material-symbols-outlined text-[24px]">
                        {isMusicPlaying ? 'pause' : 'play_arrow'}
                      </span>
                    </button>
                    <div>
                      <p
                        className={`font-serif text-base font-semibold ${
                          isAquatic ? 'text-[#03045e]' : 'text-[#5d1826]'
                        }`}
                      >
                        Soundtrack to 2 AM
                      </p>
                      <p className="text-xs text-[#544244]">
                        {isMusicPlaying ? 'Now Playing • Soft Ambient Lullaby' : 'Singing off-key • 02:44'}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#735c00] bg-[#fed65b]/30 px-2 py-0.5 rounded-full border border-[#fed65b]/60">
                    HQ Audio
                  </span>
                </div>

                {/* Visual Audio Waveform */}
                <div className="flex items-end gap-1.5 h-11 px-2 pt-2 justify-between">
                  {waveHeights.map((h, i) => (
                    <span
                      key={i}
                      style={{ height: `${isMusicPlaying ? h : Math.max(8, (i % 5) * 5 + 8)}px` }}
                      className={`w-1.5 rounded-full transition-all duration-150 ${
                        isAquatic
                          ? i % 2 === 0
                            ? 'bg-[#0077b6]'
                            : 'bg-[#48cae4]'
                          : i % 3 === 0
                          ? 'bg-[#735c00]'
                          : i % 2 === 0
                          ? 'bg-[#5d1826]'
                          : 'bg-[#5d1826]/60'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Friendship Certificate / Blessing Token */}
            <div
              onClick={onOpenCertificate}
              className="bg-gradient-to-br from-[#f1ede7] to-[#ebe8e2] p-6 rounded-3xl shadow-sm text-center flex flex-col items-center border border-[#ffd9dc]/60 hover:shadow-md transition-all cursor-pointer group"
            >
              <span className="material-symbols-outlined text-[38px] text-[#735c00] mb-2 group-hover:scale-110 transition-transform">
                workspace_premium
              </span>
              <h4
                className={`font-serif text-[20px] font-semibold ${
                  isAquatic ? 'text-[#03045e]' : 'text-[#5d1826]'
                }`}
              >
                Unconditional Friendship Pact
              </h4>
              <p className="text-xs text-[#544244] mt-1.5 mb-4 max-w-xs leading-relaxed">
                Valid in all time zones, through bad haircut crises, spontaneous mid-week brunch demands, and forever onwards.
              </p>
              <div
                className={`px-4 py-1.5 rounded-full text-[11px] font-bold shadow-2xs border uppercase font-sans tracking-wider transition-colors ${
                  isAquatic
                    ? 'bg-white text-[#0077b6] border-[#90e0ef] group-hover:bg-[#0077b6] group-hover:text-white'
                    : 'bg-white text-[#5d1826] border-[#ffd9dc] group-hover:bg-[#5d1826] group-hover:text-white'
                }`}
              >
                SIGNED • NO EXPIRATION DATE
              </div>
              <span className="text-[10px] text-[#735c00] mt-2 underline font-semibold">
                Click to inspect & print pact
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Add / Edit Open When Letter Modal */}
      {showAddLetterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-[#fdf9f3] rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-[#ffd9dc] relative animate-scale-up max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setShowAddLetterModal(false);
                setEditingLetter(null);
              }}
              className="absolute top-5 right-5 text-[#877274] hover:text-[#5d1826] p-1 rounded-full cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <span className="text-[11px] font-bold text-[#735c00] uppercase tracking-wider font-sans">
              {editingLetter ? 'Edit Sealed Letter' : 'New Sealed Letter'}
            </span>
            <h3
              className={`font-serif text-2xl font-semibold mb-4 ${
                isAquatic ? 'text-[#03045e]' : 'text-[#5d1826]'
              }`}
            >
              {editingLetter ? 'Update Letter' : 'Craft an "Open When" Letter'}
            </h3>

            <form onSubmit={handleSaveLetter} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-[#544244] uppercase mb-1">
                  Envelope Prompt ("Open When...")
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Open When: You have big scary dreams ahead"
                  value={letterCondition}
                  onChange={(e) => setLetterCondition(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-white border border-[#d9c1c2] outline-none text-[#1c1c18]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#544244] uppercase mb-1">
                  Letter Title / Subject
                </label>
                <input
                  type="text"
                  placeholder="e.g. A letter for when courage feels distant"
                  value={letterTitle}
                  onChange={(e) => setLetterTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-white border border-[#d9c1c2] outline-none text-[#1c1c18]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#544244] uppercase mb-1">
                  Letter Content
                </label>
                <textarea
                  required
                  rows={6}
                  placeholder="Write from the heart. What does she need to hear in this moment?"
                  value={letterContent}
                  onChange={(e) => setLetterContent(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-white border border-[#d9c1c2] outline-none text-[#1c1c18] font-serif leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-[#d9c1c2]/50">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddLetterModal(false);
                    setEditingLetter(null);
                  }}
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
                  {editingLetter ? 'Save Changes' : 'Seal With Wax ✉'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Main Folded Letter Modal */}
      {showEditMainModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-[#fdf9f3] rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border border-[#ffd9dc] relative animate-scale-up max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowEditMainModal(false)}
              className="absolute top-5 right-5 text-[#877274] hover:text-[#5d1826] p-1 rounded-full cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <span className="text-[11px] font-bold text-[#735c00] uppercase tracking-wider font-sans">
              Main Stationery
            </span>
            <h3
              className={`font-serif text-2xl font-semibold mb-4 ${
                isAquatic ? 'text-[#03045e]' : 'text-[#5d1826]'
              }`}
            >
              Edit Main Folded Letter
            </h3>

            <form onSubmit={handleSaveMainLetter} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-[#544244] uppercase mb-1">
                  Letter Title
                </label>
                <input
                  type="text"
                  required
                  value={editMainTitle}
                  onChange={(e) => setEditMainTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-white border border-[#d9c1c2] outline-none text-[#1c1c18]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#544244] uppercase mb-1">
                  Letter Body
                </label>
                <textarea
                  required
                  rows={8}
                  value={editMainContent}
                  onChange={(e) => setEditMainContent(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-white border border-[#d9c1c2] outline-none text-[#1c1c18] font-serif leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-[#d9c1c2]/50">
                <button
                  type="button"
                  onClick={() => setShowEditMainModal(false)}
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
                  Save Letter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
