import React from 'react';

interface CelebrationBannerProps {
  onShower100Petals: () => void;
}

export const CelebrationBanner: React.FC<CelebrationBannerProps> = ({ onShower100Petals }) => {
  return (
    <section className="max-w-[1200px] mx-auto px-4 md:px-8 pb-20 w-full">
      <div className="relative overflow-hidden rounded-3xl bg-[#5d1826] text-white p-8 md:p-14 text-center shadow-xl border border-[#7a2e3b]">
        {/* Decorative floral background watermarks */}
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none select-none">
          <span className="material-symbols-outlined text-[240px] text-white">spa</span>
        </div>
        <div className="absolute -left-10 -top-10 opacity-10 pointer-events-none select-none">
          <span className="material-symbols-outlined text-[200px] text-white">local_florist</span>
        </div>

        <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
          <span className="text-[11px] font-bold text-[#ffe088] uppercase tracking-widest mb-3 font-sans">
            Endless Celebration
          </span>
          <h2 className="font-serif text-[38px] md:text-[54px] text-white leading-tight mb-4 font-normal">
            Always Here, Always Loved
          </h2>
          <p className="font-serif italic text-lg md:text-[21px] text-[#ffd9dc] mb-8 font-normal leading-relaxed">
            Whenever you need a reminder of how cherished you are, come back here and shower the petals again.
          </p>

          <button
            onClick={onShower100Petals}
            className="flex items-center gap-2.5 px-8 py-4 rounded-xl bg-[#735c00] hover:bg-[#8a6e00] text-white font-semibold text-sm shadow-lg hover:shadow-[0_0_24px_rgba(254,214,91,0.5)] transition-all hover:scale-105 active:scale-95 cursor-pointer border border-[#ffe088]/40"
            type="button"
          >
            <span className="material-symbols-outlined text-[22px] text-[#fed65b]">local_florist</span>
            <span>Shower 100 Petals Right Now 🌸</span>
          </button>
        </div>
      </div>
    </section>
  );
};
