import React, { useState } from 'react';
import { MemoryItem } from '../types';

interface MemoryModalProps {
  memory: MemoryItem | null;
  onClose: () => void;
  onLike: (id: string) => void;
  onShowerFlowers: () => void;
}

export const MemoryModal: React.FC<MemoryModalProps> = ({
  memory,
  onClose,
  onLike,
  onShowerFlowers,
}) => {
  const [comments, setComments] = useState<string[]>([]);
  const [newComment, setNewComment] = useState('');

  if (!memory) return null;

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setComments([...comments, newComment.trim()]);
    setNewComment('');
    onShowerFlowers();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-fade-in">
      <div className="bg-[#fdf9f3] rounded-3xl max-w-3xl w-full p-6 md:p-8 shadow-2xl border border-[#ffd9dc] relative animate-scale-up max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#877274] hover:text-[#5d1826] p-1.5 rounded-full hover:bg-[#ebe8e2] transition-colors cursor-pointer z-10"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Left: Image */}
          <div className="relative w-full aspect-[4/3] md:aspect-square rounded-2xl overflow-hidden bg-[#ebe8e2] shadow-md border border-[#ffd9dc]">
            <img
              src={memory.imageUrl}
              alt={memory.title}
              className="w-full h-full object-cover"
            />
            <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-xs text-[10px] font-bold text-[#5d1826] uppercase font-sans tracking-wider shadow-sm">
              {memory.tag}
            </span>
          </div>

          {/* Right: Story & Details */}
          <div className="flex flex-col h-full justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-[#735c00] uppercase tracking-wider font-sans">
                  {memory.date}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    onLike(memory.id);
                    onShowerFlowers();
                  }}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffd9dc] text-[#5d1826] text-xs font-semibold hover:bg-[#ffb2ba] transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">favorite</span>
                  <span>{memory.likes} Loves</span>
                </button>
              </div>

              <h3 className="font-serif text-2xl font-semibold text-[#5d1826] mb-3">
                {memory.title}
              </h3>

              <div className="bg-[#ffffff] p-4 rounded-xl border border-[#ffd9dc]/60 mb-4">
                <p className="font-serif italic text-[#1c1c18] text-base leading-relaxed">
                  {memory.caption}
                </p>
              </div>

              <div className="flex items-center gap-2 mb-6">
                <div className="w-7 h-7 rounded-full bg-[#5d1826] text-[#fed65b] flex items-center justify-center text-xs font-bold">
                  {memory.authorInitial}
                </div>
                <span className="text-xs text-[#544244] font-medium">
                  Preserved in album by {memory.author}
                </span>
              </div>

              {/* Memory Comments / Reactions */}
              <div className="space-y-2 mb-4">
                <span className="text-[11px] font-bold text-[#544244] uppercase tracking-wider block font-sans">
                  Keepsake Notes ({comments.length})
                </span>
                {comments.length === 0 ? (
                  <p className="text-xs text-[#877274] italic">
                    No extra notes yet. Add an inside joke or memory below!
                  </p>
                ) : (
                  comments.map((c, i) => (
                    <div
                      key={i}
                      className="text-xs bg-[#ffffff] p-2.5 rounded-lg border border-[#ffd9dc]/50 text-[#1c1c18]"
                    >
                      “{c}”
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Add note input */}
            <form onSubmit={handleAddComment} className="flex gap-2 mt-2">
              <input
                type="text"
                placeholder="Leave an affectionate reaction..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 px-3 py-2 text-xs rounded-lg bg-[#ffffff] border border-[#d9c1c2] text-[#1c1c18] outline-none focus:border-[#5d1826]"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#5d1826] hover:bg-[#7a2e3b] text-white text-xs font-semibold rounded-lg cursor-pointer"
              >
                Pin
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
