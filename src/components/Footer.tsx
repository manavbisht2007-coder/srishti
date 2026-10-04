import React from 'react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  recipientName?: string;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, recipientName = 'For My Favorite Person' }) => {
  return (
    <footer className="w-full bg-[#f7f3ed] pt-16 pb-12 shadow-[0_-4px_24px_-6px_rgba(122,46,59,0.05)] border-t border-[#ffd9dc]/60">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 flex flex-col items-center text-center">
        <div className="flex items-center gap-2 mb-4 text-[#5d1826]">
          <span className="material-symbols-outlined text-[20px] text-[#7a2e3b]">favorite</span>
          <span className="font-serif italic text-lg sm:text-xl text-[#5d1826]">
            A lifetime of smiles, laughter, and unbreakable bonds
          </span>
          <span className="material-symbols-outlined text-[20px] text-[#7a2e3b]">favorite</span>
        </div>

        <p className="text-xs md:text-sm text-[#544244] max-w-md mx-auto mb-6 leading-relaxed">
          Crafted with warmth, reverence, and gratitude. Thank you for making every ordinary day feel like an extraordinary story.
        </p>

        <div className="flex flex-wrap justify-center items-center gap-6 text-xs font-semibold text-[#544244]">
          <button
            onClick={() => onNavigate('our-journey')}
            className="hover:text-[#5d1826] transition-colors cursor-pointer"
          >
            Our Story
          </button>
          <button
            onClick={() => onNavigate('memories-gallery')}
            className="hover:text-[#5d1826] transition-colors cursor-pointer"
          >
            Treasured Moments
          </button>
          <button
            onClick={() => onNavigate('heartfelt-letters')}
            className="hover:text-[#5d1826] transition-colors cursor-pointer"
          >
            Envelope Keepsakes
          </button>
          <button
            onClick={() => onNavigate('wish-wall')}
            className="hover:text-[#5d1826] transition-colors cursor-pointer"
          >
            Kind Wishes
          </button>
        </div>

        <div className="mt-8 pt-6 w-full max-w-sm flex items-center justify-center text-center text-[11px] font-bold text-[#877274] tracking-widest uppercase font-sans border-t border-[#d9c1c2]/40">
          © {new Date().getFullYear()} {recipientName} • Forever Sanctuary
        </div>
      </div>
    </footer>
  );
};
