import React, { useEffect, useState } from 'react';
import { MemoryItem, ThemeMode } from '../types';
import { formatReadableDate } from '../utils/dateTracker';
import { SafeImage } from './SafeImage';

interface MemoryModalProps {
  memory: MemoryItem | null;
  memories?: MemoryItem[];
  theme?: ThemeMode;
  onSelectMemory?: (memory: MemoryItem) => void;
  onClose: () => void;
  onLike: (id: string) => void;
  onAddNote?: (memoryId: string, text: string) => Promise<void>;
  onShowerFlowers: () => void;
}

export const MemoryModal: React.FC<MemoryModalProps> = ({
  memory,
  memories = [],
  theme = 'romantic',
  onSelectMemory,
  onClose,
  onLike,
  onAddNote,
  onShowerFlowers,
}) => {
  const [newComment, setNewComment] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  const currentIdx = memory ? memories.findIndex((m) => m.id === memory.id) : -1;
  const hasPrev = currentIdx > 0;
  const hasNext = currentIdx >= 0 && currentIdx < memories.length - 1;

  useEffect(() => {
    if (!memory) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && hasPrev && onSelectMemory) {
        onSelectMemory(memories[currentIdx - 1]);
      }
      if (e.key === 'ArrowRight' && hasNext && onSelectMemory) {
        onSelectMemory(memories[currentIdx + 1]);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [memory, currentIdx, hasPrev, hasNext, memories, onSelectMemory, onClose]);

  if (!memory) return null;

  const isAquatic = theme === 'aquatic';
  const notes = memory.notes || [];

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    if (onAddNote) {
      setSavingNote(true);
      try {
        await onAddNote(memory.id, newComment.trim());
        setNewComment('');
        onShowerFlowers();
      } finally {
        setSavingNote(false);
      }
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={memory.title}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`rounded-3xl max-w-4xl w-full p-5 sm:p-8 shadow-2xl border relative animate-scale-up max-h-[92vh] overflow-y-auto ${
          isAquatic
            ? 'bg-[#f0f8ff] border-[#90e0ef] text-[#03045e]'
            : 'bg-[#FFF9F2] border-[#FBCFE8] text-[#44313B]'
        }`}
      >
        {/* Top Controls: Prev / Next / Close */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {memories.length > 1 && onSelectMemory && (
              <>
                <button
                  type="button"
                  disabled={!hasPrev}
                  onClick={() => hasPrev && onSelectMemory(memories[currentIdx - 1])}
                  aria-label="Previous photo"
                  className="w-9 h-9 rounded-full bg-white border border-black/10 flex items-center justify-center disabled:opacity-35 hover:bg-black/5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[19px]">chevron_left</span>
                </button>
                <button
                  type="button"
                  disabled={!hasNext}
                  onClick={() => hasNext && onSelectMemory(memories[currentIdx + 1])}
                  aria-label="Next photo"
                  className="w-9 h-9 rounded-full bg-white border border-black/10 flex items-center justify-center disabled:opacity-35 hover:bg-black/5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[19px]">chevron_right</span>
                </button>
                {currentIdx >= 0 && (
                  <span className="text-xs font-medium opacity-70 tabular-nums ml-1">
                    {currentIdx + 1} / {memories.length}
                  </span>
                )}
              </>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close lightbox"
            className="w-9 h-9 rounded-full bg-white border border-black/10 flex items-center justify-center hover:bg-black/5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[19px]">close</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Left: High-Res Image */}
          <div className="md:col-span-7 relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-white shadow-sm border border-black/5">
            <SafeImage
              src={memory.imageUrl}
              alt={memory.title}
              theme={theme}
              loading="eager"
              placeholderTitle={memory.title}
              className="w-full h-full object-contain bg-black/5"
            />
          </div>

          {/* Right: Story, Metadata & Notes */}
          <div className="md:col-span-5 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-semibold opacity-75">
                  {memory.category} · {formatReadableDate(memory.date)}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    onLike(memory.id);
                    onShowerFlowers();
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                    isAquatic
                      ? 'bg-[#caf0f8] text-[#0077B6]'
                      : 'bg-[#FCE7F3] text-[#BE185D]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]">favorite</span>
                  <span className="tabular-nums">{memory.likes}</span>
                </button>
              </div>

              <h2
                className={`font-serif text-2xl sm:text-3xl font-semibold mb-3 ${
                  isAquatic ? 'text-[#03045e]' : 'text-[#BE185D]'
                }`}
              >
                {memory.title}
              </h2>

              <p className="font-serif italic text-base leading-relaxed bg-white p-4 rounded-xl border border-black/5 mb-4">
                “{memory.caption}”
              </p>

              <p className="text-xs opacity-75 mb-5">
                {memory.location} · Uploaded by <strong>{memory.authorName}</strong>
              </p>

              {onAddNote && (
                <div className="space-y-2.5 mb-4">
                  <p className="text-xs font-semibold uppercase tracking-wider opacity-70">
                    Keepsake Notes ({notes.length})
                  </p>
                  {notes.length === 0 ? (
                    <p className="text-xs italic opacity-65">
                      No notes on this photo yet. Leave a sweet reply below.
                    </p>
                  ) : (
                    <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                      {notes.map((n) => (
                        <div
                          key={n.id}
                          className="text-xs bg-white p-2.5 rounded-xl border border-black/5"
                        >
                          <span className="font-semibold">{n.authorName}:</span> “{n.text}”
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {onAddNote && (
              <form onSubmit={handleAddComment} className="flex gap-2 mt-2">
                <input
                  type="text"
                  placeholder="Write a sweet note..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs rounded-xl bg-white border border-[#FBCFE8] outline-none"
                />
                <button
                  type="submit"
                  disabled={savingNote}
                  className={`px-4 py-2 text-white text-xs font-semibold rounded-xl cursor-pointer ${
                    isAquatic ? 'bg-[#0077B6]' : 'bg-[#BE185D]'
                  }`}
                >
                  Save
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
