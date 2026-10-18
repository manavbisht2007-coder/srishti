import React, { useState, useEffect } from 'react';
import { KeepsakeSettings, ThemeMode } from '../types';
import {
  calculateYearsAndDays,
  getTimeUntilNextMidnight,
} from '../utils/dateTracker';

interface HeroSectionProps {
  settings: KeepsakeSettings;
  theme?: ThemeMode;
  onAddMemoryClick: () => void;
  onOpenPhotoLightbox: (imgUrl: string, title: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  settings,
  theme = 'romantic',
  onAddMemoryClick,
  onOpenPhotoLightbox,
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
  };

  return (
    <section className="max-w-[1200px] mx-auto px-4 md:px-8 pt-8 md:pt-12 pb-16 w-full flex flex-col items-center text-center relative z-10">
      {/* Milestone Overline & Counter (Auto-calculated from Start Date) */}
      <div
        className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full shadow-sm mb-6 border transition-colors ${
          isAquatic
            ? 'bg-[#e0fbfc]/90 border-[#90e0ef] text-[#03045e]'
            : 'bg-[#fff0f5]/90 border-[#fbcfe8] text-[#be185d]'
        }`}
      >
        <span className="material-symbols-outlined text-[16px] text-pink-500">
          {isAquatic ? 'waves' : 'auto_awesome'}
        </span>
        <span className="text-[11px] font-bold tracking-widest uppercase font-sans">
          {isAquatic
            ? `Cherishing ${years > 0 ? `${years} Year${years > 1 ? 's' : ''} Together • ` : ''}${totalDays.toLocaleString()} Days in Our Haven`
            : `Cherishing ${years > 0 ? `${years} Year${years > 1 ? 's' : ''} Together • ` : ''}${totalDays.toLocaleString()} Days of Radiance`}
        </span>
        <span className="material-symbols-outlined text-[16px] text-pink-500">
          {isAquatic ? 'waves' : 'auto_awesome'}
        </span>
      </div>

      {/* Poetic Main Title */}
      <h1
        className={`font-serif text-[38px] sm:text-[46px] md:text-[56px] max-w-4xl tracking-tight mb-4 leading-[1.14] transition-colors ${
          isAquatic ? 'text-[#03045e]' : 'text-[#9d174d]'
        }`}
      >
        {isAquatic ? 'To The One Who Makes Every Ocean Calm' : 'To The One Who Makes Every Day Bloom'}
      </h1>

      {/* Poetic Pull Quote */}
      <p
        className={`font-serif italic text-lg sm:text-xl md:text-[22px] max-w-2xl mx-auto mb-10 leading-relaxed font-normal transition-colors ${
          isAquatic ? 'text-[#0077b6]' : 'text-[#db2777]'
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
              : 'bg-gradient-to-tr from-[#f472b6]/35 via-[#fbcfe8]/60 to-[#fda4af]/30'
          } ${isHovered ? 'scale-110 opacity-100' : 'scale-100 opacity-75'}`}
        />

        {/* Seal Accent Top Center */}
        <div
          onClick={handleHeartClick}
          title={isAquatic ? 'Send a sea splash heartbeat' : 'Send a heartbeat'}
          className={`absolute -top-5 left-1/2 -translate-x-1/2 z-20 w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95 cursor-pointer border ${
            isAquatic
              ? 'bg-[#0077b6] hover:bg-[#023e8a] text-[#fed65b] border-[#90e0ef]'
              : 'bg-gradient-to-tr from-[#ec4899] to-[#f43f5e] hover:from-[#db2777] hover:to-[#e11d48] text-white border-[#fce7f3]'
          }`}
        >
          <span
            className={`material-symbols-outlined text-[22px] ${
              lovedHeart ? (isAquatic ? 'text-[#ffb4a2]' : 'text-[#ffe4e6]') : ''
            }`}
          >
            {isAquatic ? 'water_drop' : 'favorite'}
          </span>
        </div>

        {/* Faux Washi Tape Accents */}
        <div
          className={`absolute -top-3 -left-4 z-20 w-16 h-5 backdrop-blur-xs -rotate-12 shadow-sm rounded-xs pointer-events-none border border-white/50 ${
            isAquatic ? 'bg-[#caf0f8]/80' : 'bg-[#fbcfe8]/85'
          }`}
        />
        <div
          className={`absolute -bottom-3 -right-4 z-20 w-16 h-5 backdrop-blur-xs rotate-12 shadow-sm rounded-xs pointer-events-none border border-white/50 ${
            isAquatic ? 'bg-[#caf0f8]/80' : 'bg-[#fbcfe8]/85'
          }`}
        />

        {/* Polaroid / Heirloom Matte Frame */}
        <div
          className={`relative bg-[#ffffff] p-4 md:p-6 rounded-3xl shadow-[0_16px_36px_-6px_rgba(236,72,153,0.14)] transition-all duration-500 group-hover:-translate-y-1.5 border ${
            isAquatic ? 'border-[#caf0f8]' : 'border-[#fbcfe8]'
          }`}
        >
          <div className="relative w-full aspect-square overflow-hidden rounded-2xl bg-[#fff0f5] shadow-inner">
            <img
              alt="Radiant keepsake portrait"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              src={settings.heroImageUrl}
              loading="eager"
            />
            <div
              className={`absolute inset-0 bg-gradient-to-t via-transparent to-transparent opacity-40 pointer-events-none ${
                isAquatic ? 'from-[#03045e]/30' : 'from-[#9d174d]/25'
              }`}
            />

            {/* View Fullscreen overlay hint */}
            <div
              className={`absolute bottom-3 right-3 bg-white/85 backdrop-blur-md px-2.5 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-[11px] font-semibold flex items-center gap-1 shadow-sm ${
                isAquatic ? 'text-[#0077b6]' : 'text-[#db2777]'
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
                  isAquatic ? 'text-[#0077b6]' : 'text-[#db2777]'
                }`}
              >
                {settings.heroPhotoSub}
              </span>
              <p
                className={`font-serif text-[20px] md:text-[22px] font-semibold ${
                  isAquatic ? 'text-[#03045e]' : 'text-[#9d174d]'
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
                  : 'bg-[#fff0f5] hover:bg-[#fce7f3] text-[#db2777] border-[#fbcfe8]'
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

      {/* Action CTA: Add Memory & Note */}
      <div className="flex items-center justify-center mt-6 z-10">
        <button
          onClick={onAddMemoryClick}
          className={`flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm transition-all shadow-md hover:scale-105 active:scale-95 cursor-pointer border ${
            isAquatic
              ? 'bg-[#0077b6] text-white hover:bg-[#023e8a] border-[#0077b6]'
              : 'bg-gradient-to-r from-[#ec4899] to-[#f43f5e] hover:from-[#db2777] hover:to-[#e11d48] text-white border-[#fce7f3] shadow-[0_8px_20px_rgba(236,72,153,0.3)]'
          }`}
          type="button"
        >
          <span className="material-symbols-outlined text-[20px]">edit_note</span>
          <span>Add Your Memory & Note</span>
        </button>
      </div>

      {/* Live 24-Hour Day Counter Icon Card */}
      <div className="w-full max-w-lg mt-10">
        <div
          className={`bg-[#ffffff]/95 backdrop-blur-md p-6 rounded-3xl shadow-sm border transition-all duration-300 text-left relative overflow-hidden ${
            isAquatic
              ? 'border-[#caf0f8]'
              : 'border-[#fbcfe8] shadow-[0_4px_20px_rgba(244,114,182,0.1)]'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3.5">
              {/* Day Counter Animated Icon */}
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-xs transition-transform group-hover:scale-110 ${
                  isAquatic
                    ? 'bg-[#e0fbfc] text-[#0077b6] border border-[#90e0ef]'
                    : 'bg-[#fce7f3] text-[#db2777] border border-[#fbcfe8]'
                }`}
              >
                <span className="material-symbols-outlined text-[28px] animate-pulse">
                  calendar_today
                </span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-pink-600 font-sans">
                    Live 24h Day Tracker
                  </span>
                  <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping" />
                </div>
                <p
                  className={`font-serif text-[32px] sm:text-[36px] font-semibold leading-none mt-1 ${
                    isAquatic ? 'text-[#03045e]' : 'text-[#9d174d]'
                  }`}
                >
                  Day {totalDays.toLocaleString()}
                </p>
              </div>
            </div>

            <span
              className={`text-[11px] font-semibold px-3 py-1 rounded-full border ${
                isAquatic
                  ? 'bg-[#caf0f8]/60 text-[#0077b6] border-[#90e0ef]'
                  : 'bg-[#fff0f5] text-[#db2777] border-[#fbcfe8]'
              }`}
            >
              Anniversary: 1st December 2025
            </span>
          </div>

          {/* 24-hr increment status indicator */}
          <div className="mt-4 pt-3.5 border-t border-pink-100 flex items-center justify-between text-xs text-[#831843]">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-pink-500">
                schedule
              </span>
              <span>Next day count in:</span>
              <span className="font-mono font-bold text-[#db2777] bg-[#fce7f3] px-2 py-0.5 rounded text-[11px]">
                {countdown.formatted}
              </span>
            </div>
            <span className="text-[11px] text-pink-500 font-medium">
              Updates daily at midnight
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
