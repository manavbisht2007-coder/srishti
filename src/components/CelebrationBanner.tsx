import React from 'react';
import { ThemeMode } from '../types';

interface CelebrationBannerProps {
  theme?: ThemeMode;
}

export const CelebrationBanner: React.FC<CelebrationBannerProps> = ({
  theme = 'romantic',
}) => {
  const isAquatic = theme === 'aquatic';

  return (
    <section className="max-w-[1200px] mx-auto px-4 md:px-8 pb-20 w-full relative z-10">
      <div
        className={`relative overflow-hidden rounded-3xl text-white p-8 md:p-14 text-center shadow-xl border transition-colors duration-500 ${
          isAquatic
            ? 'bg-[#004e89] border-[#0077b6] shadow-[0_16px_36px_-6px_rgba(0,119,182,0.3)]'
            : 'bg-gradient-to-br from-[#f472b6] via-[#ec4899] to-[#db2777] border-[#fbcfe8] shadow-[0_16px_36px_-6px_rgba(236,72,153,0.3)]'
        }`}
      >
        {/* Decorative background watermarks */}
        <div className="absolute -right-10 -bottom-10 opacity-15 pointer-events-none select-none">
          <span className="material-symbols-outlined text-[240px] text-white">
            {isAquatic ? 'waves' : 'favorite'}
          </span>
        </div>
        <div className="absolute -left-10 -top-10 opacity-15 pointer-events-none select-none">
          <span className="material-symbols-outlined text-[200px] text-white">
            {isAquatic ? 'bubble_chart' : 'spa'}
          </span>
        </div>

        <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs border border-white/30 text-[11px] font-bold text-white uppercase tracking-widest mb-3 font-sans">
            <span>❤️</span>
            <span>{isAquatic ? 'Endless Ocean Sanctuary' : 'Sweet Love Sanctuary'}</span>
          </div>
          <h2 className="font-serif text-[38px] md:text-[54px] text-white leading-tight mb-4 font-normal">
            {isAquatic ? 'Infinite Ocean, Boundless Love' : 'Always Here, Always Loved'}
          </h2>
          <p className="font-serif italic text-lg md:text-[21px] text-[#ffe4e6] font-normal leading-relaxed">
            {isAquatic
              ? 'Whenever you need a reminder of how cherished you are, dive back into this sanctuary and feel the gentle warmth of our bond.'
              : 'Whenever you need a reminder of how cherished you are, come back here and feel the gentle warmth of our bond.'}
          </p>
        </div>
      </div>
    </section>
  );
};
