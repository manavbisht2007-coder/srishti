import React from 'react';
import { ThemeMode } from '../types';

interface HeaderProps {
  activeSection: string;
  theme: ThemeMode;
  onToggleTheme: (newTheme: ThemeMode) => void;
  onNavigate: (sectionId: string) => void;
  onShowerFlowers: () => void;
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
  onOpenSettings: () => void;
  recipientName?: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeSection,
  theme,
  onToggleTheme,
  onNavigate,
  onShowerFlowers,
  isMusicPlaying,
  onToggleMusic,
  onOpenSettings,
  recipientName = 'For My Favorite Person',
  subtitle,
}) => {
  const isAquatic = theme === 'aquatic';

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 backdrop-blur-xl transition-colors duration-500 border-b ${
        isAquatic
          ? 'bg-[#f0f8ff]/85 border-[#caf0f8]/80 shadow-[0_4px_20px_-4px_rgba(0,119,182,0.12)]'
          : 'bg-[#fdf9f3]/85 border-[#ffd9dc]/40 shadow-[0_4px_20px_-4px_rgba(122,46,59,0.07)]'
      }`}
    >
      <div className="h-20 max-w-[1240px] mx-auto px-4 md:px-6 flex items-center justify-between gap-2">
        {/* Brand / Monogram */}
        <div
          onClick={() => onNavigate('hero')}
          className="flex items-center gap-2.5 md:gap-3 cursor-pointer group select-none flex-shrink-0"
        >
          {isAquatic ? (
            <div className="w-9 h-9 rounded-full bg-[#0077b6] text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[22px]">scuba_diving</span>
            </div>
          ) : (
            <img
              alt="Blossom Friendship Monogram"
              className="h-8 md:h-9 w-auto object-contain transition-transform group-hover:scale-105 duration-300"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuChchE9wzof1jsaA0OBQjlxjXuD-AM4TWq7YFrBlyKn3hVO_SttdEDz4dg40Bd4Ax-B1Y9UxaJ05wmt-ItyXW6BcoP0pyIa4Te-2b7QaJsw_zDK97vLBe8I1bSNb2Z33F0tQ3IWhYKWOi9mmIQ6nTFrfWd_ETa8VanXfiURMiFRu7B1TBb1KvrxbxNhVVOSdzM5z8t7W29TsMqmoruWRr-kPyIy5kO_UDyEELqlWl6jlHrtQaI_27uZ"
            />
          )}
          <div className="flex flex-col">
            <span
              className={`font-serif text-[18px] md:text-[21px] font-semibold tracking-tight leading-tight transition-colors ${
                isAquatic ? 'text-[#03045e]' : 'text-[#5d1826]'
              }`}
            >
              {recipientName}
            </span>
            <span
              className={`font-sans text-[10px] md:text-[11px] uppercase tracking-widest hidden sm:inline-block font-semibold transition-colors ${
                isAquatic ? 'text-[#0077b6]' : 'text-[#544244]'
              }`}
            >
              {subtitle || (isAquatic ? 'An Ocean of Memories 🐋' : 'An Enduring Keepsake')}
            </span>
          </div>
        </div>

        {/* Theme Transition Slider Button */}
        <div className="flex items-center">
          <div
            className={`relative flex items-center p-1 rounded-full border transition-all duration-300 shadow-inner ${
              isAquatic
                ? 'bg-[#caf0f8]/60 border-[#90e0ef]'
                : 'bg-[#f1ede7] border-[#d9c1c2]/50'
            }`}
          >
            {/* Sliding highlight indicator */}
            <div
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full transition-transform duration-300 ease-out shadow-sm ${
                isAquatic
                  ? 'translate-x-[calc(100%+4px)] bg-[#0077b6]'
                  : 'translate-x-0 bg-[#7a2e3b]'
              }`}
            />

            {/* Romantic Theme Button */}
            <button
              type="button"
              onClick={() => onToggleTheme('romantic')}
              className={`relative z-10 px-2.5 sm:px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer select-none ${
                !isAquatic ? 'text-white' : 'text-[#544244] hover:text-[#1c1c18]'
              }`}
              title="Switch to Romantic Blossom theme"
            >
              <span className="text-sm">🌸</span>
              <span className="hidden md:inline font-sans">Romantic</span>
            </button>

            {/* Aquatic Theme Button */}
            <button
              type="button"
              onClick={() => onToggleTheme('aquatic')}
              className={`relative z-10 px-2.5 sm:px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer select-none ${
                isAquatic ? 'text-white' : 'text-[#544244] hover:text-[#1c1c18]'
              }`}
              title="Switch to Aquatic Ocean theme with cute sea creatures"
            >
              <span className="text-sm">🌊</span>
              <span className="hidden md:inline font-sans">Aquatic</span>
            </button>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav
          className={`hidden xl:flex items-center gap-1 p-1.5 rounded-full border transition-colors shadow-2xs ${
            isAquatic
              ? 'bg-[#e0fbfc]/70 border-[#90e0ef]/40'
              : 'bg-[#f7f3ed]/80 border-[#d9c1c2]/30 shadow-[inset_0_1px_3px_rgba(122,46,59,0.06)]'
          }`}
        >
          <button
            onClick={() => onNavigate('our-journey')}
            className={`px-3.5 py-1.5 rounded-full text-xs transition-all cursor-pointer ${
              activeSection === 'our-journey'
                ? isAquatic
                  ? 'bg-[#0077b6] text-white font-semibold shadow-sm'
                  : 'bg-[#7a2e3b] text-white font-semibold shadow-sm'
                : 'text-[#544244] hover:text-[#1c1c18] font-medium'
            }`}
          >
            {isAquatic ? 'Voyage Log' : 'Our Journey'}
          </button>
          <button
            onClick={() => onNavigate('memories-gallery')}
            className={`px-3.5 py-1.5 rounded-full text-xs transition-all cursor-pointer ${
              activeSection === 'memories-gallery'
                ? isAquatic
                  ? 'bg-[#0077b6] text-white font-semibold shadow-sm'
                  : 'bg-[#7a2e3b] text-white font-semibold shadow-sm'
                : 'text-[#544244] hover:text-[#1c1c18] font-medium'
            }`}
          >
            {isAquatic ? 'Sea Gallery' : 'Memories Gallery'}
          </button>
          <button
            onClick={() => onNavigate('heartfelt-letters')}
            className={`px-3.5 py-1.5 rounded-full text-xs transition-all cursor-pointer ${
              activeSection === 'heartfelt-letters'
                ? isAquatic
                  ? 'bg-[#0077b6] text-white font-semibold shadow-sm'
                  : 'bg-[#7a2e3b] text-white font-semibold shadow-sm'
                : 'text-[#544244] hover:text-[#1c1c18] font-medium'
            }`}
          >
            {isAquatic ? 'Bottled Letters' : 'Heartfelt Letters'}
          </button>
          <button
            onClick={() => onNavigate('wish-wall')}
            className={`px-3.5 py-1.5 rounded-full text-xs transition-all cursor-pointer ${
              activeSection === 'wish-wall'
                ? isAquatic
                  ? 'bg-[#0077b6] text-white font-semibold shadow-sm'
                  : 'bg-[#7a2e3b] text-white font-semibold shadow-sm'
                : 'text-[#544244] hover:text-[#1c1c18] font-medium'
            }`}
          >
            {isAquatic ? 'Shell Pinboard' : 'Wish Wall'}
          </button>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
          {/* Shower Trigger Button */}
          <button
            onClick={onShowerFlowers}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all shadow-xs active:scale-95 cursor-pointer text-xs md:text-sm font-semibold border ${
              isAquatic
                ? 'bg-[#caf0f8]/80 text-[#03045e] border-[#90e0ef] hover:bg-[#90e0ef]/70'
                : 'bg-[#f7f3ed] text-[#5d1826] border-[#ffd9dc] hover:bg-[#ebe8e2]'
            }`}
            type="button"
            title={isAquatic ? 'Shower iridescent bubbles & sea stars' : 'Shower blossoms across screen'}
          >
            <span className="material-symbols-outlined text-[18px] text-[#735c00]">
              {isAquatic ? 'bubble_chart' : 'local_florist'}
            </span>
            <span className="hidden sm:inline">
              {isAquatic ? 'Shower Bubbles' : 'Shower Flowers'}
            </span>
          </button>

          {/* Ambient Music Toggle */}
          <button
            onClick={onToggleMusic}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer border ${
              isMusicPlaying
                ? isAquatic
                  ? 'bg-[#90e0ef] text-[#03045e] border-[#48cae4] shadow-sm animate-pulse'
                  : 'bg-[#ffd9dc] text-[#5d1826] border-[#ffb2ba] shadow-sm animate-pulse'
                : 'bg-white/80 text-[#544244] border-gray-200 hover:bg-gray-100'
            }`}
            type="button"
            title={isMusicPlaying ? 'Mute soothing melody' : 'Play peaceful melody'}
          >
            <span className="material-symbols-outlined text-[19px]">
              {isMusicPlaying ? 'volume_up' : 'volume_off'}
            </span>
          </button>

          {/* Settings / Personalize Modal */}
          <button
            onClick={onOpenSettings}
            className={`w-9 h-9 rounded-full text-white flex items-center justify-center shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer ${
              isAquatic ? 'bg-[#0077b6] hover:bg-[#023e8a]' : 'bg-[#5d1826] hover:bg-[#7a2e3b]'
            }`}
            type="button"
            title="Personalize keepsake details"
          >
            <span className="material-symbols-outlined text-[18px]">person</span>
          </button>
        </div>
      </div>

      {/* Mobile subnav row */}
      <div
        className={`xl:hidden flex items-center justify-center gap-1.5 px-3 py-1.5 border-t overflow-x-auto ${
          isAquatic ? 'bg-[#e0fbfc]/90 border-[#90e0ef]/40' : 'bg-[#f7f3ed]/90 border-[#d9c1c2]/30'
        }`}
      >
        <button
          onClick={() => onNavigate('our-journey')}
          className={`px-3 py-1 rounded-full text-xs whitespace-nowrap ${
            activeSection === 'our-journey'
              ? isAquatic
                ? 'bg-[#0077b6] text-white font-medium'
                : 'bg-[#7a2e3b] text-white font-medium'
              : 'text-[#544244]'
          }`}
        >
          {isAquatic ? 'Voyage Log' : 'Our Journey'}
        </button>
        <button
          onClick={() => onNavigate('memories-gallery')}
          className={`px-3 py-1 rounded-full text-xs whitespace-nowrap ${
            activeSection === 'memories-gallery'
              ? isAquatic
                ? 'bg-[#0077b6] text-white font-medium'
                : 'bg-[#7a2e3b] text-white font-medium'
              : 'text-[#544244]'
          }`}
        >
          {isAquatic ? 'Sea Gallery' : 'Memories'}
        </button>
        <button
          onClick={() => onNavigate('heartfelt-letters')}
          className={`px-3 py-1 rounded-full text-xs whitespace-nowrap ${
            activeSection === 'heartfelt-letters'
              ? isAquatic
                ? 'bg-[#0077b6] text-white font-medium'
                : 'bg-[#7a2e3b] text-white font-medium'
              : 'text-[#544244]'
          }`}
        >
          {isAquatic ? 'Bottled Letters' : 'Letters'}
        </button>
        <button
          onClick={() => onNavigate('wish-wall')}
          className={`px-3 py-1 rounded-full text-xs whitespace-nowrap ${
            activeSection === 'wish-wall'
              ? isAquatic
                ? 'bg-[#0077b6] text-white font-medium'
                : 'bg-[#7a2e3b] text-white font-medium'
              : 'text-[#544244]'
          }`}
        >
          {isAquatic ? 'Shell Pinboard' : 'Wish Wall'}
        </button>
      </div>
    </header>
  );
};
