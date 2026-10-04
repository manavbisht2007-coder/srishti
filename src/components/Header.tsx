import React from 'react';

interface HeaderProps {
  activeSection: string;
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
  onNavigate,
  onShowerFlowers,
  isMusicPlaying,
  onToggleMusic,
  onOpenSettings,
  recipientName = 'For My Favorite Person',
  subtitle = 'An Enduring Keepsake',
}) => {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#fdf9f3]/85 backdrop-blur-xl shadow-[0_4px_20px_-4px_rgba(122,46,59,0.07)] border-b border-[#ffd9dc]/40">
      <div className="h-20 max-w-[1200px] mx-auto px-4 md:px-8 flex items-center justify-between">
        {/* Brand / Monogram */}
        <div
          onClick={() => onNavigate('hero')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <img
            alt="Blossom Friendship Monogram"
            className="h-8 md:h-9 w-auto object-contain transition-transform group-hover:scale-105 duration-300"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuChchE9wzof1jsaA0OBQjlxjXuD-AM4TWq7YFrBlyKn3hVO_SttdEDz4dg40Bd4Ax-B1Y9UxaJ05wmt-ItyXW6BcoP0pyIa4Te-2b7QaJsw_zDK97vLBe8I1bSNb2Z33F0tQ3IWhYKWOi9mmIQ6nTFrfWd_ETa8VanXfiURMiFRu7B1TBb1KvrxbxNhVVOSdzM5z8t7W29TsMqmoruWRr-kPyIy5kO_UDyEELqlWl6jlHrtQaI_27uZ"
          />
          <div className="flex flex-col">
            <span className="font-serif text-[19px] md:text-[21px] text-[#5d1826] font-semibold tracking-tight leading-tight">
              {recipientName}
            </span>
            <span className="font-sans text-[10px] md:text-[11px] text-[#544244] uppercase tracking-widest hidden sm:inline-block font-semibold">
              {subtitle}
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1.5 bg-[#f7f3ed]/80 p-1.5 rounded-full shadow-[inset_0_1px_3px_rgba(122,46,59,0.06)] border border-[#d9c1c2]/30">
          <button
            onClick={() => onNavigate('our-journey')}
            className={`px-4 py-2 rounded-full text-xs md:text-sm transition-all cursor-pointer ${
              activeSection === 'our-journey'
                ? 'bg-[#7a2e3b] text-white font-semibold shadow-sm'
                : 'text-[#544244] hover:bg-[#ebe8e2] hover:text-[#1c1c18] font-medium'
            }`}
          >
            Our Journey
          </button>
          <button
            onClick={() => onNavigate('memories-gallery')}
            className={`px-4 py-2 rounded-full text-xs md:text-sm transition-all cursor-pointer ${
              activeSection === 'memories-gallery'
                ? 'bg-[#7a2e3b] text-white font-semibold shadow-sm'
                : 'text-[#544244] hover:bg-[#ebe8e2] hover:text-[#1c1c18] font-medium'
            }`}
          >
            Memories Gallery
          </button>
          <button
            onClick={() => onNavigate('heartfelt-letters')}
            className={`px-4 py-2 rounded-full text-xs md:text-sm transition-all cursor-pointer ${
              activeSection === 'heartfelt-letters'
                ? 'bg-[#7a2e3b] text-white font-semibold shadow-sm'
                : 'text-[#544244] hover:bg-[#ebe8e2] hover:text-[#1c1c18] font-medium'
            }`}
          >
            Heartfelt Letters
          </button>
          <button
            onClick={() => onNavigate('wish-wall')}
            className={`px-4 py-2 rounded-full text-xs md:text-sm transition-all cursor-pointer ${
              activeSection === 'wish-wall'
                ? 'bg-[#7a2e3b] text-white font-semibold shadow-sm'
                : 'text-[#544244] hover:bg-[#ebe8e2] hover:text-[#1c1c18] font-medium'
            }`}
          >
            Wish Wall
          </button>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 md:gap-3">
          {/* Shower Flowers Button */}
          <button
            onClick={onShowerFlowers}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#f7f3ed] text-[#5d1826] hover:bg-[#ebe8e2] hover:text-[#1c1c18] transition-all shadow-[0_2px_8px_rgba(122,46,59,0.08)] border border-[#ffd9dc] active:scale-95 cursor-pointer text-xs md:text-sm font-semibold"
            type="button"
            title="Shower blossoms across screen"
          >
            <span className="material-symbols-outlined text-[18px] text-[#735c00]">local_florist</span>
            <span className="hidden sm:inline">Shower Flowers</span>
          </button>

          {/* Ambient Music / Sound Toggle */}
          <button
            onClick={onToggleMusic}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer border ${
              isMusicPlaying
                ? 'bg-[#ffd9dc] text-[#5d1826] border-[#ffb2ba] shadow-sm animate-pulse'
                : 'bg-[#f7f3ed] text-[#544244] border-[#d9c1c2]/40 hover:bg-[#ebe8e2] hover:text-[#1c1c18]'
            }`}
            type="button"
            title={isMusicPlaying ? 'Mute soothing melody' : 'Play peaceful keepsake music'}
          >
            <span className="material-symbols-outlined text-[19px]">
              {isMusicPlaying ? 'volume_up' : 'volume_off'}
            </span>
          </button>

          {/* Settings / Personalize Modal */}
          <button
            onClick={onOpenSettings}
            className="w-9 h-9 rounded-full bg-[#5d1826] hover:bg-[#7a2e3b] text-white flex items-center justify-center shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
            type="button"
            title="Personalize keepsake details"
          >
            <span className="material-symbols-outlined text-[18px]">person</span>
          </button>
        </div>
      </div>

      {/* Mobile subnav row */}
      <div className="lg:hidden flex items-center justify-center gap-1 px-3 py-2 bg-[#f7f3ed]/90 border-t border-[#d9c1c2]/30 overflow-x-auto">
        <button
          onClick={() => onNavigate('our-journey')}
          className={`px-3 py-1 rounded-full text-xs whitespace-nowrap ${
            activeSection === 'our-journey' ? 'bg-[#7a2e3b] text-white font-medium' : 'text-[#544244]'
          }`}
        >
          Our Journey
        </button>
        <button
          onClick={() => onNavigate('memories-gallery')}
          className={`px-3 py-1 rounded-full text-xs whitespace-nowrap ${
            activeSection === 'memories-gallery' ? 'bg-[#7a2e3b] text-white font-medium' : 'text-[#544244]'
          }`}
        >
          Memories
        </button>
        <button
          onClick={() => onNavigate('heartfelt-letters')}
          className={`px-3 py-1 rounded-full text-xs whitespace-nowrap ${
            activeSection === 'heartfelt-letters' ? 'bg-[#7a2e3b] text-white font-medium' : 'text-[#544244]'
          }`}
        >
          Letters
        </button>
        <button
          onClick={() => onNavigate('wish-wall')}
          className={`px-3 py-1 rounded-full text-xs whitespace-nowrap ${
            activeSection === 'wish-wall' ? 'bg-[#7a2e3b] text-white font-medium' : 'text-[#544244]'
          }`}
        >
          Wish Wall
        </button>
      </div>
    </header>
  );
};
