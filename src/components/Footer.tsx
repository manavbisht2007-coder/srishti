import React from 'react';
import { AppPage, ThemeMode } from '../types';

interface FooterProps {
  onNavigatePage?: (page: AppPage) => void;
  recipientName?: string;
  theme?: ThemeMode;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigatePage,
  recipientName = 'Srishti and Manav',
  theme = 'romantic',
}) => {
  const isAquatic = theme === 'aquatic';

  return (
    <footer
      className={`w-full pt-12 pb-12 border-t transition-colors duration-500 relative z-10 ${
        isAquatic
          ? 'bg-[#e6f4f8]/90 border-[#90e0ef]/70 text-[#03045e]'
          : 'bg-[#FFF9F2]/95 border-[#FBCFE8]/80 text-[#44313B]'
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 flex flex-col items-center text-center">
        <p
          className={`font-serif italic text-xl sm:text-2xl mb-2 ${
            isAquatic ? 'text-[#03045e]' : 'text-[#BE185D]'
          }`}
        >
          Made with love, for our little world ❤️
        </p>

        <p
          className={`text-xs md:text-sm max-w-md mx-auto mb-6 leading-relaxed ${
            isAquatic ? 'text-[#0077B6]' : 'text-[#927C89]'
          }`}
        >
          A private sanctuary for {recipientName} — preserving every letter, quiet milestone, and shared dream.
        </p>

        {onNavigatePage && (
          <nav aria-label="Footer navigation" className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-6 text-xs font-semibold">
            {(
              [
                ['home', 'Home'],
                ['memories', 'Memories'],
                ['story', 'Our Story'],
                ['letters', 'Letters'],
                ['journal', 'Journal'],
                ['bucket-list', 'Bucket List'],
                ['calendar', 'Calendar'],
              ] as [AppPage, string][]
            ).map(([page, label]) => (
              <button
                key={page}
                type="button"
                onClick={() => {
                  onNavigatePage(page);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`hover:underline cursor-pointer ${
                  isAquatic ? 'text-[#0077B6]' : 'text-[#BE185D]'
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
        )}

        <div
          className={`w-full max-w-md pt-5 border-t text-xs font-medium tabular-nums ${
            isAquatic
              ? 'border-[#90e0ef]/50 text-[#0077B6]'
              : 'border-[#FBCFE8]/70 text-[#927C89]'
          }`}
        >
          © {new Date().getFullYear()} {recipientName} · Together since December 1, 2025
        </div>
      </div>
    </footer>
  );
};
