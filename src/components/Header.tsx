import React, { useState } from 'react';
import { AppPage, ThemeMode, UserProfile } from '../types';

interface HeaderProps {
  theme: ThemeMode;
  onToggleTheme: (newTheme: ThemeMode) => void;
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
  recipientName?: string;
  subtitle?: string;
  currentPage: AppPage;
  onNavigatePage: (page: AppPage) => void;
  user: UserProfile | null;
  onLogout: () => void;
}

const NAV_ITEMS: { id: AppPage; label: string; icon: string }[] = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'memories', label: 'Memories', icon: 'photo_library' },
  { id: 'story', label: 'Our Story', icon: 'timeline' },
  { id: 'letters', label: 'Letters', icon: 'mail' },
  { id: 'journal', label: 'Journal', icon: 'menu_book' },
  { id: 'bucket-list', label: 'Bucket List', icon: 'checklist' },
  { id: 'calendar', label: 'Calendar', icon: 'calendar_month' },
];

export const Header: React.FC<HeaderProps> = ({
  theme,
  onToggleTheme,
  isMusicPlaying,
  onToggleMusic,
  recipientName = 'Srishti and Manav',
  subtitle = 'Shishi- My kuchu puchuu',
  currentPage,
  onNavigatePage,
  user,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAquatic = theme === 'aquatic';

  const handleNav = (page: AppPage) => {
    onNavigatePage(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 backdrop-blur-xl transition-colors duration-500 border-b ${
        isAquatic
          ? 'bg-[#f0f8ff]/90 border-[#caf0f8]/90 shadow-[0_4px_20px_-4px_rgba(0,119,182,0.1)]'
          : 'bg-[#FFF7F9]/92 border-[#FBCFE8]/80 shadow-[0_4px_20px_-4px_rgba(236,72,153,0.1)]'
      }`}
    >
      <div className="h-16 md:h-[72px] max-w-[1280px] mx-auto px-4 md:px-6 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Identity ("Srishti and Manav ❤️" + "Shishi- My kuchu puchuu") */}
        <button
          type="button"
          onClick={() => handleNav('home')}
          className="flex items-center gap-2.5 cursor-pointer group select-none shrink-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EC4899] rounded-xl pr-1"
        >
          <div
            className={`w-9 h-9 md:w-10 md:h-10 rounded-full text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform shrink-0 ${
              isAquatic
                ? 'bg-[#0077B6]'
                : 'bg-gradient-to-br from-[#EC4899] to-[#BE185D]'
            }`}
          >
            <span className="material-symbols-outlined text-[19px]">
              {isAquatic ? 'sailing' : 'favorite'}
            </span>
          </div>
          <div className="flex flex-col leading-none">
            <span
              className={`font-serif text-[18px] sm:text-[21px] font-bold tracking-tight whitespace-nowrap ${
                isAquatic ? 'text-[#03045e]' : 'text-[#BE185D]'
              }`}
            >
              {recipientName} <span aria-hidden="true">❤️</span>
            </span>
            <span
              className={`font-sans text-[11px] font-semibold mt-0.5 whitespace-nowrap ${
                isAquatic ? 'text-[#0077B6]' : 'text-[#927C89]'
              }`}
            >
              {subtitle}
            </span>
          </div>
        </button>

        {/* Zone 2: Clean Single-Line Navigation (Desktop, shown when authenticated) */}
        {user ? (
          <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-5">
            {NAV_ITEMS.map((item) => {
              const active = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNav(item.id)}
                  className={`relative py-1.5 text-[13px] font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    active
                      ? isAquatic
                        ? 'text-[#0077B6]'
                        : 'text-[#BE185D]'
                      : isAquatic
                      ? 'text-[#3b5d75] hover:text-[#03045e]'
                      : 'text-[#44313B]/80 hover:text-[#BE185D]'
                  }`}
                >
                  {item.label}
                  {active && (
                    <span
                      className={`absolute left-0 right-0 -bottom-0.5 h-0.5 rounded-full ${
                        isAquatic ? 'bg-[#0077B6]' : 'bg-[#EC4899]'
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </nav>
        ) : (
          <div className="hidden lg:block text-xs font-medium text-[#927C89]">
            Private Sanctuary for Two
          </div>
        )}

        {/* Zone 3: Theme Switcher, Sound Toggle, Profile/Settings, Mobile Menu */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Romantic / Aquatic Switcher */}
          <div
            role="group"
            aria-label="Theme switcher"
            className={`relative flex items-center p-1 rounded-full border transition-all duration-300 ${
              isAquatic
                ? 'bg-[#caf0f8]/70 border-[#90e0ef]'
                : 'bg-[#FFE4EC]/85 border-[#FBCFE8]'
            }`}
          >
            <button
              type="button"
              onClick={() => onToggleTheme('romantic')}
              aria-pressed={!isAquatic}
              title="Romantic soft pink theme"
              className={`px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                !isAquatic
                  ? 'bg-gradient-to-r from-[#EC4899] to-[#BE185D] text-white shadow-xs'
                  : 'text-[#44313B] hover:text-[#BE185D]'
              }`}
            >
              <span aria-hidden="true">🌸</span>
              <span className="hidden sm:inline">Romantic</span>
            </button>
            <button
              type="button"
              onClick={() => onToggleTheme('aquatic')}
              aria-pressed={isAquatic}
              title="Aquatic ocean theme"
              className={`px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                isAquatic
                  ? 'bg-[#0077B6] text-white shadow-xs'
                  : 'text-[#44313B] hover:text-[#0077B6]'
              }`}
            >
              <span aria-hidden="true">🌊</span>
              <span className="hidden sm:inline">Aquatic</span>
            </button>
          </div>

          {/* Sound Toggle (Muted by default) */}
          <button
            type="button"
            onClick={onToggleMusic}
            aria-label={isMusicPlaying ? 'Mute ambient sound' : 'Play ambient sound'}
            title={isMusicPlaying ? 'Sound On (Click to mute)' : 'Sound Muted (Click to play)'}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer border shrink-0 ${
              isMusicPlaying
                ? isAquatic
                  ? 'bg-[#0077B6] text-white border-[#0077B6] shadow-xs'
                  : 'bg-[#EC4899] text-white border-[#EC4899] shadow-xs'
                : isAquatic
                ? 'bg-white/90 text-[#03045e] border-[#90e0ef] hover:bg-[#e0fbfc]'
                : 'bg-white/90 text-[#44313B] border-[#FBCFE8] hover:bg-[#FFF0F5]'
            }`}
          >
            <span className="material-symbols-outlined text-[19px]">
              {isMusicPlaying ? 'volume_up' : 'volume_off'}
            </span>
          </button>

          {/* Profile / Settings button when authenticated */}
          {user && (
            <>
              <button
                type="button"
                onClick={() => handleNav('settings')}
                aria-label="Profile & Settings"
                title={`Signed in as ${user.displayName} — Open Settings`}
                className={`hidden sm:flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full border text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  currentPage === 'settings'
                    ? isAquatic
                      ? 'bg-[#0077B6] text-white border-[#0077B6]'
                      : 'bg-[#BE185D] text-white border-[#BE185D]'
                    : isAquatic
                    ? 'bg-white/90 text-[#03045e] border-[#90e0ef] hover:bg-[#e0fbfc]'
                    : 'bg-white/90 text-[#44313B] border-[#FBCFE8] hover:bg-[#FFF0F5]'
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                    currentPage === 'settings'
                      ? 'bg-white/25 text-white'
                      : isAquatic
                      ? 'bg-[#caf0f8] text-[#0077B6]'
                      : 'bg-[#FCE7F3] text-[#BE185D]'
                  }`}
                >
                  {user.displayName.charAt(0).toUpperCase()}
                </span>
                <span>{user.displayName}</span>
              </button>

              {/* Mobile Menu Toggle */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen((v) => !v)}
                aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                aria-expanded={mobileMenuOpen}
                className={`lg:hidden w-10 h-10 rounded-full flex items-center justify-center border cursor-pointer shrink-0 ${
                  isAquatic
                    ? 'bg-white/90 text-[#03045e] border-[#90e0ef]'
                    : 'bg-white/90 text-[#44313B] border-[#FBCFE8]'
                }`}
              >
                <span className="material-symbols-outlined text-[21px]">
                  {mobileMenuOpen ? 'close' : 'menu'}
                </span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {user && mobileMenuOpen && (
        <div
          className={`lg:hidden border-t px-4 py-4 space-y-2 backdrop-blur-xl animate-fade-in ${
            isAquatic
              ? 'bg-[#f0f8ff]/95 border-[#caf0f8]'
              : 'bg-[#FFF7F9]/95 border-[#FBCFE8]'
          }`}
        >
          <div className="grid grid-cols-2 gap-2">
            {NAV_ITEMS.map((item) => {
              const active = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNav(item.id)}
                  className={`flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer min-h-[44px] ${
                    active
                      ? isAquatic
                        ? 'bg-[#0077B6] text-white'
                        : 'bg-gradient-to-r from-[#EC4899] to-[#BE185D] text-white'
                      : isAquatic
                      ? 'bg-white/80 text-[#03045e] border border-[#caf0f8]'
                      : 'bg-white/85 text-[#44313B] border border-[#FBCFE8]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => handleNav('settings')}
              className={`flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer min-h-[44px] ${
                currentPage === 'settings'
                  ? isAquatic
                    ? 'bg-[#0077B6] text-white'
                    : 'bg-gradient-to-r from-[#EC4899] to-[#BE185D] text-white'
                  : isAquatic
                  ? 'bg-white/80 text-[#03045e] border border-[#caf0f8]'
                  : 'bg-white/85 text-[#44313B] border border-[#FBCFE8]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">settings</span>
              <span>Settings</span>
            </button>
          </div>
          <div className="pt-2 border-t border-black/5 flex items-center justify-between text-xs">
            <span className={isAquatic ? 'text-[#0077B6]' : 'text-[#927C89]'}>
              Signed in as <strong>{user.displayName}</strong>
            </span>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onLogout();
              }}
              className="px-3 py-2 rounded-lg text-red-700 font-semibold hover:bg-red-50 cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
