import React from 'react';
import { ThemeMode } from '../types';

interface CelebrationBannerProps {
  theme?: ThemeMode;
  onShower100Petals: () => void;
}

export const CelebrationBanner: React.FC<CelebrationBannerProps> = ({
  theme = 'romantic',
  onShower100Petals,
}) => {
  const isAquatic = theme === 'aquatic';

  return (
    <section className="max-w-[1200px] mx-auto px-4 md:px-8 pb-20 w-full relative z-10">
      <div
        className={`relative overflow-hidden rounded-3xl text-white p-8 md:p-14 text-center shadow-xl border transition-colors duration-500 ${
          isAquatic
            ? 'bg-[#004e89] border-[#0077b6] shadow-[0_16px_36px_-6px_rgba(0,119,182,0.3)]'
            : 'bg-[#5d1826] border-[#7a2e3b]'
        }`}
      >
        {/* Decorative background watermarks */}
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none select-none">
          <span className="material-symbols-outlined text-[240px] text-white">
            {isAquatic ? 'waves' : 'spa'}
          </span>
        </div>
        <div className="absolute -left-10 -top-10 opacity-10 pointer-events-none select-none">
          <span className="material-symbols-outlined text-[200px] text-white">
            {isAquatic ? 'bubble_chart' : 'local_florist'}
          </span>
        </div>

        <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
          <span className="text-[11px] font-bold text-[#ffe088] uppercase tracking-widest mb-3 font-sans">
            {isAquatic ? 'Endless Ocean Celebration' : 'Endless Celebration'}
          </span>
          <h2 className="font-serif text-[38px] md:text-[54px] text-white leading-tight mb-4 font-normal">
            {isAquatic ? 'Infinite Ocean, Boundless Love' : 'Always Here, Always Loved'}
          </h2>
          <p className="font-serif italic text-lg md:text-[21px] text-[#ffd9dc] mb-8 font-normal leading-relaxed">
            {isAquatic
              ? 'Whenever you need a reminder of how cherished you are, dive back in and splash the sea wonders again.'
              : 'Whenever you need a reminder of how cherished you are, come back here and shower the petals again.'}
          </p>

          <button
            onClick={onShower100Petals}
            className={`flex items-center gap-2.5 px-8 py-4 rounded-xl font-semibold text-sm shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer border ${
              isAquatic
                ? 'bg-[#0077b6] hover:bg-[#023e8a] text-white border-[#caf0f8]/40 hover:shadow-[0_0_24px_rgba(72,202,228,0.6)]'
                : 'bg-[#735c00] hover:bg-[#8a6e00] text-white border-[#ffe088]/40 hover:shadow-[0_0_24px_rgba(254,214,91,0.5)]'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[22px] text-[#fed65b]">
              {isAquatic ? 'bubble_chart' : 'local_florist'}
            </span>
            <span>
              {isAquatic ? 'Splash 100 Sea Bubbles & Pearls 🫧' : 'Shower 100 Petals Right Now 🌸'}
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};
