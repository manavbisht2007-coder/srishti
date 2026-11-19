import React, { useState } from 'react';
import { LetterItem, ThemeMode, UserProfile, VisibilityMode } from '../types';
import { formatReadableDate } from '../utils/dateTracker';

interface LettersSectionProps {
  letters: LetterItem[];
  currentUser: UserProfile;
  theme?: ThemeMode;
  mainLetterTitle: string;
  mainLetterContent: string;
  onOpenLetter: (letter: LetterItem) => void;
  onAddLetter: (letter: {
    title: string;
    condition: string;
    content: string;
    date: string;
    unlockDate?: string;
    status: 'draft' | 'sent';
    visibility: VisibilityMode;
  }) => Promise<void>;
  onEditLetter: (letter: LetterItem) => Promise<void>;
  onDeleteLetter: (id: string) => Promise<void>;
  onEditMainLetter: (title: string, content: string) => Promise<void>;
  onOpenCertificate: () => void;
  onShowerFlowers: () => void;
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
  onNotify: (type: 'success' | 'error' | 'info', text: string) => void;
}

export const LettersSection: React.FC<LettersSectionProps> = ({
  letters,
  currentUser,
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
  onNotify,
}) => {
  const [isLetterUnsealed, setIsLetterUnsealed] = useState(true);
  const [filterTab, setFilterTab] = useState<'all' | 'shared' | 'private' | 'drafts'>('all');

  // Letter composer modal
  const [showLetterModal, setShowLetterModal] = useState(false);
  const [editingLetter, setEditingLetter] = useState<LetterItem | null>(null);
  const [letterTitle, setLetterTitle] = useState('');
  const [letterCondition, setLetterCondition] = useState('');
  const [letterDate, setLetterDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [unlockDate, setUnlockDate] = useState('');
  const [visibility, setVisibility] = useState<VisibilityMode>(
    currentUser.defaultVisibility || 'shared'
  );
  const [letterContent, setLetterContent] = useState('');

  // Main letter modal
  const [showEditMainModal, setShowEditMainModal] = useState(false);
  const [editMainTitle, setEditMainTitle] = useState(mainLetterTitle);
  const [editMainContent, setEditMainContent] = useState(mainLetterContent);

  const isAquatic = theme === 'aquatic';
  const headingColor = isAquatic ? 'text-[#03045e]' : 'text-[#BE185D]';
  const mutedText = isAquatic ? 'text-[#0077B6]' : 'text-[#927C89]';

  const visibleLetters = letters.filter((l) => {
    if (filterTab === 'shared') return l.visibility === 'shared' && l.status === 'sent';
    if (filterTab === 'private') return l.visibility === 'private';
    if (filterTab === 'drafts') return l.status === 'draft';
    return true;
  });

  const openNewLetterModal = () => {
    setEditingLetter(null);
    setLetterTitle('');
    setLetterCondition('');
    setLetterDate(new Date().toISOString().slice(0, 10));
    setUnlockDate('');
    setVisibility(currentUser.defaultVisibility || 'shared');
    setLetterContent('');
    setShowLetterModal(true);
  };

  const openEditModal = (l: LetterItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingLetter(l);
    setLetterTitle(l.title);
    setLetterCondition(l.condition);
    setLetterDate(l.date);
    setUnlockDate(l.unlockDate || '');
    setVisibility(l.visibility);
    setLetterContent(l.content);
    setShowLetterModal(true);
  };

  const saveLetterWithStatus = async (status: 'draft' | 'sent') => {
    if (!letterTitle.trim() || !letterContent.trim()) {
      onNotify('error', 'Please add a title and letter message.');
      return;
    }

    try {
      if (editingLetter) {
        await onEditLetter({
          ...editingLetter,
          title: letterTitle.trim(),
          condition: letterCondition.trim() || `Open When: ${letterTitle.trim()}`,
          content: letterContent.trim(),
          date: letterDate,
          unlockDate: unlockDate || '',
          status,
          visibility,
        });
        onNotify('success', status === 'draft' ? 'Draft updated.' : 'Letter updated.');
      } else {
        await onAddLetter({
          title: letterTitle.trim(),
          condition: letterCondition.trim() || `Open When: ${letterTitle.trim()}`,
          content: letterContent.trim(),
          date: letterDate,
          unlockDate: unlockDate || '',
          status,
          visibility,
        });
        onNotify(
          'success',
          status === 'draft' ? 'Saved to your private drafts.' : 'Letter sealed with love.'
        );
        if (status === 'sent') onShowerFlowers();
      }
      setShowLetterModal(false);
      setEditingLetter(null);
    } catch (err: any) {
      onNotify('error', err.message || 'Could not save letter.');
    }
  };

  const handleSaveMainLetter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editMainTitle.trim() || !editMainContent.trim()) return;
    try {
      await onEditMainLetter(editMainTitle.trim(), editMainContent.trim());
      setShowEditMainModal(false);
      onNotify('success', 'Main keepsake letter updated.');
    } catch (err: any) {
      onNotify('error', err.message || 'Could not update letter.');
    }
  };

  return (
    <section className="max-w-[1200px] mx-auto px-4 md:px-8 py-10 md:py-14 w-full relative z-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <p className={`text-xs font-semibold uppercase tracking-wider ${mutedText}`}>
            Private &amp; Shared Envelopes
          </p>
          <h1 className={`font-serif text-4xl md:text-5xl mt-1 ${headingColor}`}>
            {isAquatic ? 'Bottled Letters & Notes' : 'Letters For Each Other'}
          </h1>
          <p className={`text-sm md:text-base mt-2 max-w-xl ${mutedText}`}>
            Write heartfelt letters, keep private drafts, or schedule a special opening date for your partner.
          </p>
        </div>

        <button
          type="button"
          onClick={openNewLetterModal}
          className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white shadow-sm cursor-pointer min-h-[44px] shrink-0 ${
            isAquatic
              ? 'bg-[#0077B6]'
              : 'bg-gradient-to-r from-[#EC4899] to-[#BE185D]'
          }`}
        >
          <span className="material-symbols-outlined text-[19px]">edit_square</span>
          <span>Write a Letter</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {(
          [
            ['all', `All (${letters.length})`],
            ['shared', 'Shared Letters'],
            ['private', 'My Private Letters'],
            ['drafts', 'My Drafts'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setFilterTab(id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              filterTab === id
                ? isAquatic
                  ? 'bg-[#0077B6] text-white'
                  : 'bg-gradient-to-r from-[#EC4899] to-[#BE185D] text-white'
                : 'bg-white/90 border border-[#FBCFE8] text-[#44313B] hover:bg-white'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Envelope Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {visibleLetters.length === 0 ? (
          <div className="md:col-span-2 lg:col-span-3 bg-white/90 rounded-3xl p-10 text-center border border-dashed border-[#FBCFE8]">
            <p className="font-serif text-2xl">No letters in this view yet.</p>
            <p className={`text-sm mt-1 ${mutedText}`}>
              Click “Write a Letter” to seal a private or shared envelope.
            </p>
          </div>
        ) : (
          visibleLetters.map((letter) => {
            const isOwner = letter.authorId === currentUser.id;
            const isLocked = Boolean(letter.isLocked);

            return (
              <div
                key={letter.id}
                onClick={() => {
                  if (isLocked) {
                    onNotify(
                      'info',
                      `This letter unlocks on ${formatReadableDate(letter.unlockDate || '')}.`
                    );
                    return;
                  }
                  onOpenLetter(letter);
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (!isLocked) onOpenLetter(letter);
                  }
                }}
                className={`group relative rounded-2xl p-6 border shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1 flex flex-col justify-between overflow-hidden ${
                  isAquatic
                    ? 'bg-white/95 border-[#caf0f8] text-[#03045e]'
                    : 'bg-[#FFF9F2] border-[#FBCFE8] text-[#44313B]'
                }`}
              >
                {/* Envelope Flap Hairline SVG Motif */}
                <div
                  className={`h-1.5 -mx-6 -mt-6 mb-5 ${
                    isAquatic
                      ? 'bg-gradient-to-r from-[#0077B6] to-[#48cae4]'
                      : 'bg-gradient-to-r from-[#EC4899] via-[#f472b6] to-[#EDE9FE]'
                  }`}
                />

                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`text-xs font-medium ${mutedText}`}>
                      {formatReadableDate(letter.date)} ·{' '}
                      {letter.visibility === 'private' ? 'Private' : 'Shared'}
                      {letter.status === 'draft' ? ' · Draft' : ''}
                    </span>

                    {isOwner && (
                      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={(e) => openEditModal(letter, e)}
                          aria-label={`Edit ${letter.title}`}
                          className="p-1 rounded-lg hover:bg-black/5 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteLetter(letter.id);
                          }}
                          aria-label={`Delete ${letter.title}`}
                          className="p-1 rounded-lg hover:bg-red-50 hover:text-red-600 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <h3 className={`font-serif text-2xl font-semibold mb-1.5 ${headingColor}`}>
                    {letter.title}
                  </h3>
                  <p className={`text-xs font-semibold mb-3 ${mutedText}`}>{letter.condition}</p>

                  <p className="font-serif italic text-[15px] opacity-85 line-clamp-3 leading-relaxed">
                    {isLocked
                      ? `Scheduled to open on ${formatReadableDate(letter.unlockDate || '')}.`
                      : letter.preview}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-black/5 flex items-center justify-between text-xs">
                  <span className={mutedText}>From {letter.authorName}</span>
                  <span
                    className={`inline-flex items-center gap-1 font-semibold ${headingColor}`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {isLocked ? 'lock_clock' : 'drafts'}
                    </span>
                    <span>{isLocked ? 'Time-Locked' : 'Unseal Letter'}</span>
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Preserved Folded Stationery + Sound Box + Forever Pact */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div
          className={`lg:col-span-7 bg-white/95 rounded-3xl p-6 md:p-8 shadow-sm border ${
            isAquatic ? 'border-[#caf0f8] text-[#03045e]' : 'border-[#FBCFE8] text-[#44313B]'
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-black/5">
            <div>
              <p className={`text-xs font-semibold uppercase tracking-wider ${mutedText}`}>
                Featured Keepsake Stationery
              </p>
              <h2 className={`font-serif text-2xl font-semibold mt-0.5 ${headingColor}`}>
                {mainLetterTitle}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setEditMainTitle(mainLetterTitle);
                  setEditMainContent(mainLetterContent);
                  setShowEditMainModal(true);
                }}
                aria-label="Edit featured letter"
                className="p-2 rounded-xl hover:bg-black/5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">edit</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsLetterUnsealed((v) => !v);
                  onShowerFlowers();
                }}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border cursor-pointer transition-colors ${
                  isAquatic
                    ? 'bg-[#e0fbfc] text-[#03045e] border-[#90e0ef]'
                    : 'bg-[#FFF0F5] text-[#BE185D] border-[#FBCFE8]'
                }`}
              >
                {isLetterUnsealed ? 'Fold Letter' : 'Break Seal'}
              </button>
            </div>
          </div>

          {isLetterUnsealed ? (
            <div className="mt-6 bg-[#FFF9F2] rounded-2xl p-6 border border-black/5 animate-envelope-open">
              <div className="font-serif text-[17px] leading-relaxed whitespace-pre-line">
                {mainLetterContent}
              </div>
            </div>
          ) : (
            <div
              onClick={() => {
                setIsLetterUnsealed(true);
                onShowerFlowers();
              }}
              className="mt-6 py-10 bg-[#FFF9F2] rounded-2xl border border-dashed border-[#FBCFE8] flex flex-col items-center justify-center text-center cursor-pointer"
            >
              <span className={`material-symbols-outlined text-[32px] mb-2 ${headingColor}`}>
                mark_email_unread
              </span>
              <p className="font-serif text-lg font-medium">Wax-sealed &amp; folded</p>
              <p className={`text-xs mt-1 ${mutedText}`}>Click to break the seal and read.</p>
            </div>
          )}
        </div>

        <div className="lg:col-span-5 flex flex-col gap-6">
          <div
            className={`bg-white/95 rounded-3xl p-6 shadow-sm border ${
              isAquatic ? 'border-[#caf0f8] text-[#03045e]' : 'border-[#FBCFE8] text-[#44313B]'
            }`}
          >
            <p className={`text-xs font-semibold uppercase tracking-wider ${mutedText}`}>
              Ambient Soundtrack
            </p>
            <h3 className={`font-serif text-2xl font-semibold mt-1 mb-2 ${headingColor}`}>
              Late-Night Melody Box
            </h3>
            <p className={`text-xs leading-relaxed mb-5 ${mutedText}`}>
              Gentle instrumental chimes tailored to your active theme (muted by default).
            </p>
            <button
              type="button"
              onClick={onToggleMusic}
              className={`w-full py-3 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 cursor-pointer ${
                isAquatic
                  ? 'bg-[#0077B6]'
                  : 'bg-gradient-to-r from-[#EC4899] to-[#BE185D]'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                {isMusicPlaying ? 'pause' : 'play_arrow'}
              </span>
              <span>{isMusicPlaying ? 'Pause Ambient Melody' : 'Play Ambient Melody'}</span>
            </button>
          </div>

          <div
            onClick={onOpenCertificate}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onOpenCertificate();
              }
            }}
            className={`rounded-3xl p-6 border shadow-sm text-center cursor-pointer transition-transform hover:-translate-y-0.5 ${
              isAquatic
                ? 'bg-[#e0fbfc]/80 border-[#90e0ef] text-[#03045e]'
                : 'bg-[#FFF9F2] border-[#FBCFE8] text-[#44313B]'
            }`}
          >
            <span className={`material-symbols-outlined text-[34px] mb-2 ${headingColor}`}>
              workspace_premium
            </span>
            <h3 className={`font-serif text-xl font-semibold ${headingColor}`}>
              Srishti &amp; Manav Forever Pact
            </h3>
            <p className={`text-xs mt-1 mb-4 ${mutedText}`}>
              Inspect and print our keepsake covenant certificate.
            </p>
            <span className={`text-xs font-semibold underline ${headingColor}`}>
              Open Certificate
            </span>
          </div>
        </div>
      </div>

      {/* Write / Edit Letter Modal */}
      {showLetterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-xs animate-fade-in">
          <div className="bg-[#FFF9F2] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-[#FBCFE8] relative animate-scale-up max-h-[92vh] overflow-y-auto text-[#44313B]">
            <button
              type="button"
              onClick={() => {
                setShowLetterModal(false);
                setEditingLetter(null);
              }}
              aria-label="Close letter editor"
              className="absolute top-5 right-5 text-[#927C89] hover:text-[#44313B] p-1 rounded-full cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <h2 className={`font-serif text-2xl font-semibold mb-4 ${headingColor}`}>
              {editingLetter ? 'Edit Letter' : 'Compose a Letter'}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Title *</label>
                <input
                  type="text"
                  value={letterTitle}
                  onChange={(e) => setLetterTitle(e.target.value)}
                  placeholder="e.g. For Our Second Anniversary"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#FBCFE8] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Envelope Prompt</label>
                <input
                  type="text"
                  value={letterCondition}
                  onChange={(e) => setLetterCondition(e.target.value)}
                  placeholder="e.g. Open When: You need a warm hug"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#FBCFE8] text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Letter Date</label>
                  <input
                    type="date"
                    value={letterDate}
                    onChange={(e) => setLetterDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#FBCFE8] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Scheduled Opening Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={unlockDate}
                    onChange={(e) => setUnlockDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#FBCFE8] text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Visibility</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setVisibility('shared')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border cursor-pointer ${
                      visibility === 'shared'
                        ? 'bg-[#FCE7F3] border-[#EC4899] text-[#BE185D]'
                        : 'bg-white border-[#FBCFE8] text-[#927C89]'
                    }`}
                  >
                    Shared With Partner
                  </button>
                  <button
                    type="button"
                    onClick={() => setVisibility('private')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border cursor-pointer ${
                      visibility === 'private'
                        ? 'bg-[#EDE9FE] border-[#BE185D] text-[#44313B]'
                        : 'bg-white border-[#FBCFE8] text-[#927C89]'
                    }`}
                  >
                    Private (Only Me)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Letter Message *</label>
                <textarea
                  rows={6}
                  value={letterContent}
                  onChange={(e) => setLetterContent(e.target.value)}
                  placeholder="Write from your heart..."
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#FBCFE8] text-sm font-serif leading-relaxed"
                />
              </div>

              <div className="flex flex-wrap justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => saveLetterWithStatus('draft')}
                  className="px-4 py-2 rounded-xl border border-[#FBCFE8] bg-white text-xs font-semibold hover:bg-[#FFF0F5] cursor-pointer"
                >
                  Save Draft
                </button>
                <button
                  type="button"
                  onClick={() => saveLetterWithStatus('sent')}
                  className={`px-5 py-2 rounded-xl text-white text-xs font-semibold cursor-pointer ${
                    isAquatic ? 'bg-[#0077B6]' : 'bg-[#BE185D]'
                  }`}
                >
                  Seal &amp; Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Main Stationery Letter Modal */}
      {showEditMainModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-xs animate-fade-in">
          <div className="bg-[#FFF9F2] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-[#FBCFE8] relative animate-scale-up text-[#44313B]">
            <button
              type="button"
              onClick={() => setShowEditMainModal(false)}
              aria-label="Close main letter editor"
              className="absolute top-5 right-5 text-[#927C89] p-1 rounded-full cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <h2 className={`font-serif text-2xl font-semibold mb-4 ${headingColor}`}>
              Edit Featured Letter
            </h2>
            <form onSubmit={handleSaveMainLetter} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={editMainTitle}
                  onChange={(e) => setEditMainTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#FBCFE8] text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Message</label>
                <textarea
                  rows={8}
                  required
                  value={editMainContent}
                  onChange={(e) => setEditMainContent(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#FBCFE8] text-sm font-serif"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditMainModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-[#927C89] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 rounded-xl text-white text-xs font-semibold cursor-pointer ${
                    isAquatic ? 'bg-[#0077B6]' : 'bg-[#BE185D]'
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
