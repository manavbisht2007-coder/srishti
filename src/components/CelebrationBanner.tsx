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
    <section className="max-w-[1200px] mx-auto px-4 md:px-8 pb-16 w-full relative z-10">
      <div
        className={`relative overflow-hidden rounded-3xl text-white p-8 md:p-14 text-center shadow-lg border transition-colors duration-500 ${
          isAquatic
            ? 'bg-gradient-to-br from-[#023e8a] via-[#0077B6] to-[#0096c7] border-[#90e0ef]/50'
            : 'bg-gradient-to-br from-[#EC4899] via-[#db2777] to-[#BE185D] border-[#FBCFE8]/50'
        }`}
      >
        <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
          <p className="text-xs font-semibold tracking-wider text-white/85 mb-2">
            {isAquatic ? 'Endless Ocean Sanctuary' : 'Our Private Forever'}
          </p>
          <h2 className="font-serif text-[32px] md:text-[46px] text-white leading-tight mb-4 font-normal text-balance">
            {isAquatic ? 'Infinite Ocean, Boundless Love' : 'Always Here, Always Loved'}
          </h2>
          <p className="font-serif italic text-lg md:text-[21px] text-white/90 font-normal leading-relaxed">
            {isAquatic
              ? 'Whenever you need a reminder of how cherished you are, dive back into this sanctuary and feel the gentle warmth of our bond.'
              : 'Whenever you need a reminder of how cherished you are, come back here and feel the gentle warmth of our bond.'}
          </p>
        </div>
      </div>
    </section>
  );
};
