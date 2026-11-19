import React, { useRef, useState } from 'react';
import { JournalEntry, JournalMood, ThemeMode, UserProfile, VisibilityMode } from '../types';
import { uploadPrivateImage } from '../utils/api';
import { formatReadableDate } from '../utils/dateTracker';
import { SafeImage } from './SafeImage';

interface JournalSectionProps {
  entries: JournalEntry[];
  currentUser: UserProfile;
  theme?: ThemeMode;
  onAddEntry: (entry: {
    date: string;
    title: string;
    content: string;
    mood: JournalMood;
    photoUrl?: string;
    visibility: VisibilityMode;
  }) => Promise<void>;
  onEditEntry: (entry: JournalEntry) => Promise<void>;
  onDeleteEntry: (id: string) => Promise<void>;
  onNotify: (type: 'success' | 'error' | 'info', text: string) => void;
}

const MOODS: JournalMood[] = [
  'In Love',
  'Grateful',
  'Peaceful',
  'Playful',
  'Nostalgic',
  'Missing You',
];

function renderFormattedText(text: string) {
  return text.split('\n').map((line, i) => {
    const trimmed = line.trim();
    if (!trimmed) return <div key={i} className="h-3" />;
    if (trimmed.startsWith('> ')) {
      return (
        <blockquote key={i} className="font-serif italic opacity-85 pl-4 my-2 border-l border-[#EC4899]/40">
          {trimmed.slice(2)}
        </blockquote>
      );
    }
    const parts = line.split(/(\*\*[^*]+\*\*|_[^_]+_)/g);
    return (
      <p key={i} className="leading-relaxed">
        {parts.map((part, idx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={idx}>{part.slice(2, -2)}</strong>;
          }
          if (part.startsWith('_') && part.endsWith('_')) {
            return <em key={idx}>{part.slice(1, -1)}</em>;
          }
          return <React.Fragment key={idx}>{part}</React.Fragment>;
        })}
      </p>
    );
  });
}

export const JournalSection: React.FC<JournalSectionProps> = ({
  entries,
  currentUser,
  theme = 'romantic',
  onAddEntry,
  onEditEntry,
  onDeleteEntry,
  onNotify,
}) => {
  const [filterVis, setFilterVis] = useState<'all' | 'shared' | 'private'>('all');
  const [showComposer, setShowComposer] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);

  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<JournalMood>('In Love');
  const [visibility, setVisibility] = useState<VisibilityMode>(
    currentUser.defaultVisibility || 'shared'
  );
  const [photoUrl, setPhotoUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const textRef = useRef<HTMLTextAreaElement | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const isAquatic = theme === 'aquatic';
  const headingColor = isAquatic ? 'text-[#03045e]' : 'text-[#BE185D]';
  const mutedText = isAquatic ? 'text-[#0077B6]' : 'text-[#927C89]';

  const filtered = entries.filter((e) => {
    if (filterVis === 'all') return true;
    return e.visibility === filterVis;
  });

  const openNewComposer = () => {
    setEditingEntry(null);
    setDate(new Date().toISOString().slice(0, 10));
    setTitle('');
    setContent('');
    setMood('In Love');
    setVisibility(currentUser.defaultVisibility || 'shared');
    setPhotoUrl('');
    setShowComposer(true);
  };

  const openEditComposer = (entry: JournalEntry) => {
    setEditingEntry(entry);
    setDate(entry.date);
    setTitle(entry.title);
    setContent(entry.content);
    setMood(entry.mood);
    setVisibility(entry.visibility);
    setPhotoUrl(entry.photoUrl || '');
    setShowComposer(true);
  };

  const insertFormat = (wrapLeft: string, wrapRight: string) => {
    const el = textRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = content.slice(start, end) || 'text';
    const next = content.slice(0, start) + wrapLeft + selected + wrapRight + content.slice(end);
    setContent(next);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadPrivateImage(file);
      setPhotoUrl(url);
      onNotify('success', 'Photo attached to journal entry.');
    } catch (err: any) {
      onNotify('error', err.message || 'Could not upload photo.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    try {
      if (editingEntry) {
        await onEditEntry({
          ...editingEntry,
          date,
          title: title.trim(),
          content: content.trim(),
          mood,
          photoUrl: photoUrl.trim(),
          visibility,
        });
        onNotify('success', 'Journal entry updated.');
      } else {
        await onAddEntry({
          date,
          title: title.trim(),
          content: content.trim(),
          mood,
          photoUrl: photoUrl.trim(),
          visibility,
        });
        onNotify('success', 'Journal entry saved.');
      }
      setShowComposer(false);
      setEditingEntry(null);
    } catch (err: any) {
      onNotify('error', err.message || 'Could not save journal entry.');
    }
  };

  return (
    <section className="max-w-[1000px] mx-auto px-4 md:px-8 py-10 md:py-14 w-full relative z-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <p className={`text-xs font-semibold uppercase tracking-wider ${mutedText}`}>
            Shared &amp; Private Reflections
          </p>
          <h1 className={`font-serif text-4xl md:text-5xl mt-1 ${headingColor}`}>
            Our Daily Journal
          </h1>
          <p className={`text-sm md:text-base mt-2 max-w-xl ${mutedText}`}>
            Quiet reflections, moods, and everyday notes — keep entries private to yourself or share them together.
          </p>
        </div>

        <button
          type="button"
          onClick={openNewComposer}
          className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white shadow-sm cursor-pointer min-h-[44px] shrink-0 ${
            isAquatic
              ? 'bg-[#0077B6]'
              : 'bg-gradient-to-r from-[#EC4899] to-[#BE185D]'
          }`}
        >
          <span className="material-symbols-outlined text-[19px]">edit_note</span>
          <span>Write Today’s Entry</span>
        </button>
      </div>

      {/* Visibility Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {(
          [
            ['all', `All Visible (${entries.length})`],
            ['shared', 'Shared Together'],
            ['private', 'My Private Entries'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setFilterVis(id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer ${
              filterVis === id
                ? isAquatic
                  ? 'bg-[#0077B6] text-white'
                  : 'bg-gradient-to-r from-[#EC4899] to-[#BE185D] text-white'
                : 'bg-white/90 border border-[#FBCFE8] text-[#44313B]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Journal Feed */}
      <div className="space-y-6">
        {filtered.length === 0 ? (
          <div className="bg-white/90 rounded-3xl p-12 text-center border border-dashed border-[#FBCFE8]">
            <p className="font-serif text-2xl">No journal entries yet.</p>
            <p className={`text-sm mt-1 ${mutedText}`}>
              Start writing a daily memory or quiet thought above.
            </p>
          </div>
        ) : (
          filtered.map((entry) => {
            const isOwner = entry.authorId === currentUser.id;
            return (
              <article
                key={entry.id}
                className={`bg-white/95 rounded-3xl p-6 sm:p-8 border shadow-sm ${
                  isAquatic ? 'border-[#caf0f8] text-[#03045e]' : 'border-[#FBCFE8] text-[#44313B]'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className={`text-xs font-medium ${mutedText}`}>
                    {formatReadableDate(entry.date)} · Mood: {entry.mood} ·{' '}
                    {entry.visibility === 'private' ? 'Private to Author' : 'Shared'} · By{' '}
                    <strong>{entry.authorName}</strong>
                  </div>

                  {isOwner && (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => openEditComposer(entry)}
                        aria-label={`Edit ${entry.title}`}
                        className="p-1.5 rounded-lg hover:bg-black/5 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[17px]">edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteEntry(entry.id)}
                        aria-label={`Delete ${entry.title}`}
                        className="p-1.5 rounded-lg hover:bg-red-50 hover:text-red-600 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[17px]">delete</span>
                      </button>
                    </div>
                  )}
                </div>

                <h2 className={`font-serif text-2xl sm:text-3xl font-semibold mb-4 ${headingColor}`}>
                  {entry.title}
                </h2>

                {entry.photoUrl && (
                  <div className="w-full max-h-80 rounded-2xl overflow-hidden mb-5 bg-[#FFF0F5]">
                    <SafeImage
                      src={entry.photoUrl}
                      alt={entry.title}
                      theme={theme}
                      placeholderTitle={entry.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="text-[15px] space-y-2">{renderFormattedText(entry.content)}</div>
              </article>
            );
          })
        )}
      </div>

      {/* Composer Modal */}
      {showComposer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-xs animate-fade-in">
          <div className="bg-[#FFF9F2] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-[#FBCFE8] relative animate-scale-up max-h-[92vh] overflow-y-auto text-[#44313B]">
            <button
              type="button"
              onClick={() => {
                setShowComposer(false);
                setEditingEntry(null);
              }}
              aria-label="Close journal composer"
              className="absolute top-5 right-5 text-[#927C89] p-1 rounded-full cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <h2 className={`font-serif text-2xl font-semibold mb-4 ${headingColor}`}>
              {editingEntry ? 'Edit Journal Entry' : 'New Journal Entry'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#FBCFE8] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Mood</label>
                  <select
                    value={mood}
                    onChange={(e) => setMood(e.target.value as JournalMood)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#FBCFE8] text-sm"
                  >
                    {MOODS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Evening chai on the balcony"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#FBCFE8] text-sm"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold">Reflection *</label>
                  <div className="flex items-center gap-1 text-xs">
                    <button
                      type="button"
                      onClick={() => insertFormat('**', '**')}
                      className="px-2 py-0.5 rounded bg-white border border-[#FBCFE8] font-bold cursor-pointer"
                      title="Bold"
                    >
                      B
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormat('_', '_')}
                      className="px-2 py-0.5 rounded bg-white border border-[#FBCFE8] italic cursor-pointer"
                      title="Italic"
                    >
                      I
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormat('\n> ', '')}
                      className="px-2 py-0.5 rounded bg-white border border-[#FBCFE8] cursor-pointer"
                      title="Quote"
                    >
                      “”
                    </button>
                  </div>
                </div>
                <textarea
                  ref={textRef}
                  required
                  rows={6}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write about today..."
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#FBCFE8] text-sm leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
                <div>
                  <label className="block text-xs font-semibold mb-1">Visibility</label>
                  <select
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value as VisibilityMode)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#FBCFE8] text-sm"
                  >
                    <option value="shared">Shared with partner</option>
                    <option value="private">Private (only me)</option>
                  </select>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#FBCFE8] text-xs font-semibold cursor-pointer hover:bg-[#FFF0F5]"
                  >
                    {uploading ? 'Uploading...' : photoUrl ? 'Change Photo' : 'Attach Optional Photo'}
                  </button>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowComposer(false)}
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
                  {editingEntry ? 'Save Entry' : 'Publish Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
