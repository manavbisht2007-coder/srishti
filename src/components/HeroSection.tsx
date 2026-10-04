import React, { useState, useEffect } from 'react';
import { KeepsakeSettings, ThemeMode } from '../types';
import {
  calculateYearsAndDays,
  getTimeUntilNextMidnight,
} from '../utils/dateTracker';

interface HeroSectionProps {
  settings: KeepsakeSettings;
  theme?: ThemeMode;
  onShowerFlowers: () => void;
  onAddMemoryClick: () => void;
  onOpenPhotoLightbox: (imgUrl: string, title: string) => void;
  onOpenSettings: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  settings,
  theme = 'romantic',
  onShowerFlowers,
  onAddMemoryClick,
  onOpenPhotoLightbox,
  onOpenSettings,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [lovedHeart, setLovedHeart] = useState(false);
  const [countdown, setCountdown] = useState(getTimeUntilNextMidnight());
  const isAquatic = theme === 'aquatic';

  // Live 24-hour countdown ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getTimeUntilNextMidnight());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const { years, totalDays } = calculateYearsAndDays(settings.startDate);

  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLovedHeart(!lovedHeart);
    onShowerFlowers();
  };

  return (
    <section className="max-w-[1200px] mx-auto px-4 md:px-8 pt-8 md:pt-12 pb-16 w-full flex flex-col items-center text-center relative z-10">
      {/* Milestone Overline & Counter (Auto-calculated from Start Date) */}
      <div
        className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full shadow-sm mb-6 border transition-colors ${
          isAquatic
            ? 'bg-[#e0fbfc]/90 border-[#90e0ef] text-[#03045e]'
            : 'bg-[#f7f3ed] border-[#ffd9dc]/60 text-[#544244]'
        }`}
      >
        <span className="material-symbols-outlined text-[16px] text-[#735c00]">
          {isAquatic ? 'waves' : 'auto_awesome'}
        </span>
        <span className="text-[11px] font-bold tracking-widest uppercase font-sans">
          {isAquatic
            ? `Cherishing ${years} Years Together • ${totalDays.toLocaleString()} Days in Our Haven`
            : `Cherishing ${years} Years Together • ${totalDays.toLocaleString()} Days of Radiance`}
        </span>
        <span className="material-symbols-outlined text-[16px] text-[#735c00]">
          {isAquatic ? 'waves' : 'auto_awesome'}
        </span>
      </div>

      {/* Poetic Main Title */}
      <h1
        className={`font-serif text-[38px] sm:text-[46px] md:text-[56px] max-w-4xl tracking-tight mb-4 leading-[1.14] transition-colors ${
          isAquatic ? 'text-[#03045e]' : 'text-[#5d1826]'
        }`}
      >
        {isAquatic ? 'To The One Who Makes Every Ocean Calm' : 'To The One Who Makes Every Day Bloom'}
      </h1>

      {/* Poetic Pull Quote */}
      <p
        className={`font-serif italic text-lg sm:text-xl md:text-[22px] max-w-2xl mx-auto mb-10 leading-relaxed font-normal transition-colors ${
          isAquatic ? 'text-[#0077b6]' : 'text-[#544244]'
        }`}
      >
        “{settings.mainQuote}”
      </p>

      {/* Hero Portrait Keepsake Frame */}
      <div
        className="relative group my-4 w-full max-w-md mx-auto cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => onOpenPhotoLightbox(settings.heroImageUrl, settings.heroPhotoLabel)}
      >
        {/* Glow effect */}
        <div
          className={`absolute inset-0 rounded-3xl blur-2xl transform transition-all duration-700 ${
            isAquatic
              ? 'bg-gradient-to-tr from-[#90e0ef]/45 via-[#caf0f8]/60 to-[#0077b6]/30'
              : 'bg-gradient-to-tr from-[#e9c349]/35 via-[#ffd9dc]/60 to-[#7a2e3b]/20'
          } ${isHovered ? 'scale-110 opacity-100' : 'scale-100 opacity-75'}`}
        />

        {/* Seal Accent Top Center */}
        <div
          onClick={handleHeartClick}
          title={isAquatic ? 'Send a sea splash heartbeat' : 'Send a heartbeat'}
          className={`absolute -top-5 left-1/2 -translate-x-1/2 z-20 w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95 cursor-pointer border ${
            isAquatic
              ? 'bg-[#0077b6] hover:bg-[#023e8a] text-[#fed65b] border-[#90e0ef]'
              : 'bg-[#7a2e3b] hover:bg-[#5d1826] text-[#fed65b] border-[#fed65b]/40'
          }`}
        >
          <span
            className={`material-symbols-outlined text-[22px] ${
              lovedHeart ? (isAquatic ? 'text-[#ffb4a2]' : 'text-[#ff99a6]') : ''
            }`}
          >
            {isAquatic ? 'water_drop' : 'favorite'}
          </span>
        </div>

        {/* Faux Washi Tape Accents */}
        <div
          className={`absolute -top-3 -left-4 z-20 w-16 h-5 backdrop-blur-xs -rotate-12 shadow-sm rounded-xs pointer-events-none border border-white/50 ${
            isAquatic ? 'bg-[#caf0f8]/80' : 'bg-[#e6e2dc]/80'
          }`}
        />
        <div
          className={`absolute -bottom-3 -right-4 z-20 w-16 h-5 backdrop-blur-xs rotate-12 shadow-sm rounded-xs pointer-events-none border border-white/50 ${
            isAquatic ? 'bg-[#caf0f8]/80' : 'bg-[#e6e2dc]/80'
          }`}
        />

        {/* Polaroid / Heirloom Matte Frame */}
        <div
          className={`relative bg-[#ffffff] p-4 md:p-6 rounded-3xl shadow-[0_16px_36px_-6px_rgba(13,59,102,0.12)] transition-all duration-500 group-hover:-translate-y-1.5 border ${
            isAquatic ? 'border-[#caf0f8]' : 'border-[#ffd9dc]/50'
          }`}
        >
          <div className="relative w-full aspect-square overflow-hidden rounded-2xl bg-[#f1ede7] shadow-inner">
            <img
              alt="Radiant keepsake portrait"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              src={settings.heroImageUrl}
              loading="eager"
            />
            <div
              className={`absolute inset-0 bg-gradient-to-t via-transparent to-transparent opacity-40 pointer-events-none ${
                isAquatic ? 'from-[#03045e]/30' : 'from-[#5d1826]/30'
              }`}
            />

            {/* View Fullscreen overlay hint */}
            <div
              className={`absolute bottom-3 right-3 bg-white/85 backdrop-blur-md px-2.5 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-[11px] font-semibold flex items-center gap-1 shadow-sm ${
                isAquatic ? 'text-[#0077b6]' : 'text-[#5d1826]'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">zoom_in</span>
              <span>View Keepsake</span>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between px-2">
            <div className="text-left">
              <span
                className={`text-[11px] font-bold tracking-widest uppercase font-sans ${
                  isAquatic ? 'text-[#0077b6]' : 'text-[#735c00]'
                }`}
              >
                {settings.heroPhotoSub}
              </span>
              <p
                className={`font-serif text-[20px] md:text-[22px] font-semibold ${
                  isAquatic ? 'text-[#03045e]' : 'text-[#5d1826]'
                }`}
              >
                {settings.heroPhotoLabel}
              </p>
            </div>
            <button
              type="button"
              onClick={handleHeartClick}
              className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition-colors border ${
                isAquatic
                  ? 'bg-[#caf0f8] hover:bg-[#90e0ef] text-[#03045e] border-[#90e0ef]'
                  : 'bg-[#f7f3ed] hover:bg-[#ffd9dc] text-[#544244] hover:text-[#5d1826] border-[#ffd9dc]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">
                {isAquatic ? 'water_drop' : 'favorite'}
              </span>
              <span>{isAquatic ? 'Pure Soul' : 'Always'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Action CTAs */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-8 z-10">
        <button
          onClick={onShowerFlowers}
          className={`flex items-center gap-2 px-7 py-3.5 rounded-lg text-white font-semibold text-sm shadow-md transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer ${
            isAquatic
              ? 'bg-[#0077b6] hover:bg-[#023e8a] hover:shadow-[0_0_20px_rgba(72,202,228,0.5)]'
              : 'bg-[#5d1826] hover:bg-[#7a2e3b] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]'
          }`}
          type="button"
        >
          <span className="material-symbols-outlined text-[20px] text-[#ffe088]">
            {isAquatic ? 'bubble_chart' : 'spa'}
          </span>
          <span>{isAquatic ? 'Shower Bubbles & Pearls 🫧' : 'Shower Flowers & Petals 🌸'}</span>
        </button>

        <button
          onClick={onAddMemoryClick}
          className={`flex items-center gap-2 px-6 py-3.5 rounded-lg font-semibold text-sm transition-all shadow-sm active:scale-95 cursor-pointer border ${
            isAquatic
              ? 'bg-[#e0fbfc] text-[#03045e] hover:bg-[#caf0f8] border-[#90e0ef]'
              : 'bg-[#f7f3ed] text-[#5d1826] hover:bg-[#ebe8e2] border-[#ffd9dc]'
          }`}
          type="button"
        >
          <span className="material-symbols-outlined text-[20px]">edit_note</span>
          <span>{isAquatic ? 'Add Sea Memory & Note' : 'Add Your Memory & Note'}</span>
        </button>
      </div>

      {/* NEW: Live 24-Hour Day Counter & Showered Stats (Unwanted stats removed) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-2xl mt-12">
        {/* Dynamic 24hr Day Counter Card */}
        <div
          onClick={onOpenSettings}
          title="Click to edit start date or customize sanctuary"
          className={`bg-[#ffffff]/95 backdrop-blur-md p-5 rounded-2xl shadow-sm border transition-all duration-300 hover:shadow-md cursor-pointer group text-left relative overflow-hidden ${
            isAquatic ? 'border-[#caf0f8] hover:border-[#0077b6]' : 'border-[#ffd9dc] hover:border-[#7a2e3b]'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {/* Day Counter Animated Icon */}
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs transition-transform group-hover:scale-110 ${
                  isAquatic
                    ? 'bg-[#e0fbfc] text-[#0077b6] border border-[#90e0ef]'
                    : 'bg-[#ffd9dc] text-[#5d1826] border border-[#ffb2ba]'
                }`}
              >
                <span className="material-symbols-outlined text-[26px] animate-pulse">
                  calendar_today
                </span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#735c00] font-sans">
                    Live 24h Day Tracker
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                </div>
                <p
                  className={`font-serif text-[28px] sm:text-[32px] font-semibold leading-none mt-0.5 ${
                    isAquatic ? 'text-[#03045e]' : 'text-[#5d1826]'
                  }`}
                >
                  Day {totalDays.toLocaleString()}
                </p>
              </div>
            </div>

            <span
              className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                isAquatic
                  ? 'bg-[#caf0f8]/60 text-[#0077b6] border-[#90e0ef]'
                  : 'bg-[#f7f3ed] text-[#7a2e3b] border-[#ffd9dc]'
              }`}
            >
              Since {new Date(settings.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>

          {/* 24-hr increment status indicator */}
          <div className="mt-3.5 pt-3 border-t border-black/5 flex items-center justify-between text-xs text-[#544244]">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[15px] text-[#735c00]">
                schedule
              </span>
              <span>Next day count in:</span>
              <span className="font-mono font-bold text-[#5d1826] bg-[#f7f3ed] px-1.5 py-0.5 rounded text-[11px]">
                {countdown.formatted}
              </span>
            </div>
            <span className="text-[10px] text-[#735c00] font-medium group-hover:underline">
              Edit date ✎
            </span>
          </div>
        </div>

        {/* Petals / Wonders Given Live Counter */}
        <div
          onClick={onShowerFlowers}
          title="Click to shower more petals or bubbles!"
          className={`bg-[#ffffff]/95 backdrop-blur-md p-5 rounded-2xl shadow-sm border transition-all duration-300 hover:shadow-md cursor-pointer group text-left relative overflow-hidden ${
            isAquatic ? 'border-[#caf0f8] hover:border-[#0077b6]' : 'border-[#ffd9dc] hover:border-[#7a2e3b]'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs transition-transform group-hover:scale-110 ${
                  isAquatic
                    ? 'bg-[#e0fbfc] text-[#0077b6] border border-[#90e0ef]'
                    : 'bg-[#fed65b]/30 text-[#735c00] border border-[#fed65b]'
                }`}
              >
                <span className="material-symbols-outlined text-[26px]">
                  {isAquatic ? 'bubble_chart' : 'local_florist'}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#735c00] font-sans">
                  {isAquatic ? 'Bubbles Showered' : 'Petals Tenderly Given'}
                </span>
                <p className="font-serif text-[28px] sm:text-[32px] font-semibold text-[#735c00] leading-none mt-0.5">
                  {settings.petalsGiven.toLocaleString()}
                </p>
              </div>
            </div>

            <span className="text-[11px] font-semibold text-[#544244] px-2.5 py-1 rounded-full bg-[#f7f3ed] border border-[#d9c1c2]/50 group-hover:bg-[#ffd9dc] transition-colors">
              Tap to Shower 🌸
            </span>
          </div>

          <div className="mt-3.5 pt-3 border-t border-black/5 flex items-center justify-between text-xs text-[#544244]">
            <span>Click anytime to celebrate with floral & bubble physics</span>
            <span className="text-sm">✨</span>
          </div>
        </div>
      </div>
    </section>
  );
};
