import React, { useEffect } from 'react';
import { LetterItem, ThemeMode } from '../types';
import { formatReadableDate } from '../utils/dateTracker';

interface OpenWhenModalProps {
  letter: LetterItem | null;
  theme?: ThemeMode;
  onClose: () => void;
  onShowerFlowers: () => void;
}

export const OpenWhenModal: React.FC<OpenWhenModalProps> = ({
  letter,
  theme = 'romantic',
  onClose,
  onShowerFlowers,
}) => {
  useEffect(() => {
    if (!letter) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [letter, onClose]);

  if (!letter) return null;

  const isAquatic = theme === 'aquatic';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={letter.title}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-2xl border relative animate-envelope-open max-h-[90vh] overflow-y-auto ${
          isAquatic
            ? 'bg-[#f0f8ff] border-[#90e0ef] text-[#03045e]'
            : 'bg-[#FFF9F2] border-[#FBCFE8] text-[#44313B]'
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close letter"
          className="absolute top-5 right-5 opacity-70 hover:opacity-100 p-1.5 rounded-full hover:bg-black/5 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        <p
          className={`text-xs font-semibold uppercase tracking-wider mb-1 ${
            isAquatic ? 'text-[#0077B6]' : 'text-[#927C89]'
          }`}
        >
          {formatReadableDate(letter.date)} · From {letter.authorName} ·{' '}
          {letter.visibility === 'private' ? 'Private' : 'Shared'}
        </p>

        <h2
          className={`font-serif text-2xl md:text-3xl font-semibold mb-1 ${
            isAquatic ? 'text-[#03045e]' : 'text-[#BE185D]'
          }`}
        >
          {letter.title}
        </h2>
        <p className="text-xs font-semibold opacity-75 mb-4">{letter.condition}</p>

        <div className="bg-white p-6 md:p-8 rounded-2xl border border-black/5 shadow-inner">
          <div className="font-serif text-[17px] md:text-[18px] leading-relaxed whitespace-pre-line">
            {letter.content}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onShowerFlowers}
            className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer ${
              isAquatic
                ? 'bg-[#caf0f8] text-[#0077B6]'
                : 'bg-[#FCE7F3] text-[#BE185D]'
            }`}
          >
            {isAquatic ? 'Shower Bubbles 🫧' : 'Shower Petals 🌸'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className={`px-5 py-2 rounded-xl text-white text-xs font-semibold cursor-pointer ${
              isAquatic ? 'bg-[#0077B6]' : 'bg-[#BE185D]'
            }`}
          >
            Fold &amp; Close
          </button>
        </div>
      </div>
    </div>
  );
};
