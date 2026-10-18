import React from 'react';

interface FooterProps {
  onNavigate?: (sectionId: string) => void;
  recipientName?: string;
}

export const Footer: React.FC<FooterProps> = ({ recipientName = 'Srishti and Manav' }) => {
  return (
    <footer className="w-full bg-[#fff0f5]/90 pt-12 pb-12 shadow-[0_-4px_24px_-6px_rgba(244,114,182,0.1)] border-t border-[#fbcfe8]">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 flex flex-col items-center text-center">
        <div className="flex items-center gap-2 mb-3 text-[#9d174d]">
          <span className="text-red-500 text-lg">❤️</span>
          <span className="font-serif italic text-lg sm:text-xl text-[#9d174d]">
            A lifetime of smiles, laughter, and unbreakable bonds
          </span>
          <span className="text-red-500 text-lg">❤️</span>
        </div>

        <p className="text-xs md:text-sm text-[#831843] max-w-md mx-auto mb-6 leading-relaxed">
          Crafted with warmth, reverence, and gratitude. Thank you for making every ordinary day feel like an extraordinary story.
        </p>

        <div className="w-full max-w-sm flex items-center justify-center text-center text-[11px] font-bold text-pink-500 tracking-widest uppercase font-sans border-t border-pink-200 pt-5">
          © {new Date().getFullYear()} {recipientName} • Forever Sanctuary
        </div>
      </div>
    </footer>
  );
};
