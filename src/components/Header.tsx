import React from 'react';
import { ThemeMode } from '../types';

interface HeaderProps {
  theme: ThemeMode;
  onToggleTheme: (newTheme: ThemeMode) => void;
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
  recipientName?: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onToggleTheme,
  isMusicPlaying,
  onToggleMusic,
  recipientName = 'Srishti and Manav',
  subtitle = 'Shishi- My kuch puchuu',
}) => {
  const isAquatic = theme === 'aquatic';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 backdrop-blur-xl transition-colors duration-500 border-b ${
        isAquatic
          ? 'bg-[#f0f8ff]/90 border-[#caf0f8]/80 shadow-[0_4px_20px_-4px_rgba(0,119,182,0.12)]'
          : 'bg-[#fff5f8]/90 border-[#fbcfe8]/80 shadow-[0_4px_20px_-4px_rgba(244,114,182,0.12)]'
      }`}
    >
      <div className="h-16 md:h-20 max-w-[1240px] mx-auto px-4 md:px-8 flex items-center justify-between gap-4">
        {/* Brand: Srishti and Manav with Red Heart */}
        <div
          onClick={scrollToTop}
          className="flex items-center gap-2.5 md:gap-3 cursor-pointer group select-none flex-shrink-0"
        >
          {isAquatic ? (
            <div className="w-10 h-10 rounded-full bg-[#0077b6] text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[22px]">sailing</span>
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#f472b6] to-[#ec4899] text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[20px]">favorite</span>
            </div>
          )}

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 font-serif text-[19px] sm:text-[23px] md:text-[25px] font-bold tracking-tight leading-tight">
              <span className={isAquatic ? 'text-[#03045e]' : 'text-[#be185d]'}>
                {recipientName}
              </span>
              <span className="text-red-500 text-lg md:text-xl inline-block group-hover:scale-125 transition-transform duration-300">
                ❤️
              </span>
            </div>
            <span
              className={`font-sans text-[11px] md:text-[12px] tracking-normal font-semibold ${
                isAquatic ? 'text-[#0077b6]' : 'text-[#db2777]'
              }`}
            >
              {subtitle}
            </span>
          </div>
        </div>

        {/* Theme Transition Slider Button (Center) */}
        <div className="flex items-center">
          <div
            className={`relative flex items-center p-1 rounded-full border transition-all duration-300 shadow-inner ${
              isAquatic
                ? 'bg-[#caf0f8]/60 border-[#90e0ef]'
                : 'bg-[#ffe4ec]/80 border-[#fbcfe8]'
            }`}
          >
            {/* Sliding highlight indicator */}
            <div
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full transition-transform duration-300 ease-out shadow-sm ${
                isAquatic
                  ? 'translate-x-[calc(100%+4px)] bg-[#0077b6]'
                  : 'translate-x-0 bg-gradient-to-r from-[#ec4899] to-[#f43f5e]'
              }`}
            />

            {/* Romantic Theme Button */}
            <button
              type="button"
              onClick={() => onToggleTheme('romantic')}
              className={`relative z-10 px-3 sm:px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer select-none ${
                !isAquatic ? 'text-white' : 'text-[#831843] hover:text-[#500724]'
              }`}
              title="Switch to Sweet Baby Pink Romantic theme"
            >
              <span className="text-sm">🌸</span>
              <span className="hidden sm:inline font-sans">Romantic</span>
            </button>

            {/* Aquatic Theme Button */}
            <button
              type="button"
              onClick={() => onToggleTheme('aquatic')}
              className={`relative z-10 px-3 sm:px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer select-none ${
                isAquatic ? 'text-white' : 'text-[#831843] hover:text-[#500724]'
              }`}
              title="Switch to Aquatic Ocean theme with cute sea creatures"
            >
              <span className="text-sm">🌊</span>
              <span className="hidden sm:inline font-sans">Aquatic</span>
            </button>
          </div>
        </div>

        {/* Right side controls: Ambient Music Toggle */}
        <div className="flex items-center gap-2.5 md:gap-3 flex-shrink-0">
          {/* Ambient Music Toggle */}
          <button
            onClick={onToggleMusic}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer border ${
              isMusicPlaying
                ? isAquatic
                  ? 'bg-[#90e0ef] text-[#03045e] border-[#48cae4] shadow-sm animate-pulse'
                  : 'bg-[#fce7f3] text-[#db2777] border-[#fbcfe8] shadow-sm animate-pulse'
                : 'bg-white/80 text-[#831843] border-pink-200 hover:bg-pink-50'
            }`}
            type="button"
            title={isMusicPlaying ? 'Mute soothing melody' : 'Play peaceful melody'}
          >
            <span className="material-symbols-outlined text-[19px]">
              {isMusicPlaying ? 'volume_up' : 'volume_off'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
