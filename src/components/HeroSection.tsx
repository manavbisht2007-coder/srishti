import React, { useState, useEffect, useRef } from 'react';
import { KeepsakeSettings, ThemeMode } from '../types';
import {
  calculateYearsAndDays,
  getTimeUntilNextMidnight,
} from '../utils/dateTracker';
import { uploadPrivateImage } from '../utils/api';
import { SafeImage } from './SafeImage';

interface HeroSectionProps {
  settings: KeepsakeSettings;
  theme?: ThemeMode;
  onOpenPhotoLightbox: () => void;
  onUpdateHeroSettings: (patch: Partial<KeepsakeSettings>) => Promise<void>;
  onNavigateMemories: () => void;
  onNotify: (type: 'success' | 'error' | 'info', text: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  settings,
  theme = 'romantic',
  onOpenPhotoLightbox,
  onUpdateHeroSettings,
  onNavigateMemories,
  onNotify,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [lovedHeart, setLovedHeart] = useState(false);
  const [countdown, setCountdown] = useState(getTimeUntilNextMidnight());
  const [editingMsg, setEditingMsg] = useState(false);
  const [draftMsg, setDraftMsg] = useState(settings.heroMessage || '');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const isAquatic = theme === 'aquatic';

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getTimeUntilNextMidnight());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setDraftMsg(settings.heroMessage || '');
  }, [settings.heroMessage]);

  const { years, months, remainingDays, totalDays } = calculateYearsAndDays(settings.startDate);

  const handleSaveMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onUpdateHeroSettings({ heroMessage: draftMsg.trim() });
      setEditingMsg(false);
      onNotify('success', 'Keepsake message updated.');
    } catch (err: any) {
      onNotify('error', err.message || 'Could not update message.');
    }
  };

  const handlePortraitUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
    try {
      const url = await uploadPrivateImage(file);
      await onUpdateHeroSettings({ heroImageUrl: url });
      onNotify('success', 'Keepsake portrait updated.');
    } catch (err: any) {
      onNotify('error', err.message || 'Could not upload portrait.');
    } finally {
      setUploadingPhoto(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <section className="max-w-[1200px] mx-auto px-4 md:px-8 pt-8 md:pt-12 pb-14 w-full relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        {/* Left: Editorial Copy, Poetic Quote, Customizable Message & Live Counter */}
        <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
          <p
            className={`text-xs font-semibold tracking-wider uppercase mb-3 tabular-nums ${
              isAquatic ? 'text-[#0077B6]' : 'text-[#BE185D]'
            }`}
          >
            {settings.recipientName} · Together Since Dec 1, 2025 · Day {totalDays.toLocaleString()}
          </p>

          <h1
            className={`font-serif text-[36px] sm:text-[46px] md:text-[56px] tracking-tight mb-4 leading-[1.12] text-balance ${
              isAquatic ? 'text-[#03045e]' : 'text-[#BE185D]'
            }`}
          >
            {isAquatic
              ? 'To The One Who Makes Every Ocean Calm'
              : 'To The One Who Makes Every Day Bloom'}
          </h1>

          <p
            className={`font-serif italic text-lg sm:text-xl md:text-[23px] max-w-2xl mb-6 leading-relaxed ${
              isAquatic ? 'text-[#0077B6]' : 'text-[#44313B]'
            }`}
          >
            “{settings.mainQuote}”
          </p>

          {/* Short Customizable Message */}
          <div
            className={`w-full max-w-xl rounded-2xl p-4 sm:p-5 mb-7 border transition-colors ${
              isAquatic
                ? 'bg-white/85 border-[#90e0ef] text-[#03045e]'
                : 'bg-[#FFF9F2]/90 border-[#FBCFE8] text-[#44313B]'
            }`}
          >
            {editingMsg ? (
              <form onSubmit={handleSaveMessage} className="space-y-3">
                <label className="block text-xs font-semibold text-[#927C89]" htmlFor="hero-msg-input">
                  Customizable keepsake note
                </label>
                <textarea
                  id="hero-msg-input"
                  rows={2}
                  maxLength={220}
                  value={draftMsg}
                  onChange={(e) => setDraftMsg(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#FBCFE8] text-sm text-[#44313B] focus:outline-none focus:ring-2 focus:ring-[#EC4899]"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setDraftMsg(settings.heroMessage || '');
                      setEditingMsg(false);
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#927C89] hover:bg-black/5 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`px-4 py-1.5 rounded-lg text-xs font-semibold text-white cursor-pointer ${
                      isAquatic ? 'bg-[#0077B6]' : 'bg-[#EC4899]'
                    }`}
                  >
                    Save Note
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm leading-relaxed text-left">
                  {settings.heroMessage || 'Every mile between us only taught our hearts how to reach closer.'}
                </p>
                <button
                  type="button"
                  onClick={() => setEditingMsg(true)}
                  title="Customize message"
                  aria-label="Edit keepsake message"
                  className={`p-1.5 rounded-lg shrink-0 transition-colors cursor-pointer ${
                    isAquatic
                      ? 'text-[#0077B6] hover:bg-[#e0fbfc]'
                      : 'text-[#BE185D] hover:bg-[#FCE7F3]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[17px]">edit</span>
                </button>
              </div>
            )}
          </div>

          {/* Live 24-Hour Relationship Counter Card */}
          <div
            className={`w-full max-w-xl rounded-2xl p-5 border shadow-xs backdrop-blur-md transition-colors ${
              isAquatic
                ? 'bg-white/90 border-[#90e0ef]'
                : 'bg-white/90 border-[#FBCFE8]'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    isAquatic
                      ? 'bg-[#e0fbfc] text-[#0077B6]'
                      : 'bg-[#FCE7F3] text-[#BE185D]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[24px]">calendar_today</span>
                </div>
                <div className="text-left">
                  <p className={`text-xs font-semibold ${isAquatic ? 'text-[#0077B6]' : 'text-[#927C89]'}`}>
                    Relationship Day Counter
                  </p>
                  <p
                    className={`font-serif text-3xl font-bold leading-tight tabular-nums ${
                      isAquatic ? 'text-[#03045e]' : 'text-[#BE185D]'
                    }`}
                  >
                    Day {totalDays.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right text-xs tabular-nums">
                <p className="font-semibold text-[#44313B]">
                  {years > 0 ? `${years}y ` : ''}
                  {months}m {remainingDays}d together
                </p>
                <p className="text-[#927C89] mt-0.5">
                  Next day in <span className="font-mono font-semibold">{countdown.formatted}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Primary Action */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mt-7">
            <button
              type="button"
              onClick={onNavigateMemories}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white shadow-sm transition-all hover:opacity-95 active:scale-[0.98] cursor-pointer min-h-[44px] ${
                isAquatic
                  ? 'bg-[#0077B6]'
                  : 'bg-gradient-to-r from-[#EC4899] to-[#BE185D]'
              }`}
            >
              <span className="material-symbols-outlined text-[19px]">add_a_photo</span>
              <span>Add a Memory</span>
            </button>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploadingPhoto}
              className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm border transition-colors cursor-pointer min-h-[44px] ${
                isAquatic
                  ? 'bg-white/90 text-[#03045e] border-[#90e0ef] hover:bg-[#e0fbfc]'
                  : 'bg-white/90 text-[#44313B] border-[#FBCFE8] hover:bg-[#FFF0F5]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">photo_camera</span>
              <span>{uploadingPhoto ? 'Uploading...' : 'Change Portrait'}</span>
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={handlePortraitUpload}
            />
          </div>
        </div>

        {/* Right: Large Keepsake Portrait Card */}
        <div className="lg:col-span-5 flex justify-center">
          <div
            className="relative group w-full max-w-md cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onOpenPhotoLightbox}
          >
            {/* Soft Ambient Glow */}
            <div
              className={`absolute inset-2 rounded-3xl blur-2xl transition-opacity duration-500 ${
                isAquatic
                  ? 'bg-gradient-to-tr from-[#90e0ef]/45 via-[#caf0f8]/60 to-[#0077b6]/25'
                  : 'bg-gradient-to-tr from-[#EC4899]/25 via-[#FBCFE8]/50 to-[#EDE9FE]/55'
              } ${isHovered ? 'opacity-100' : 'opacity-70'}`}
            />

            {/* Heart/Drop Seal */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLovedHeart((v) => !v);
              }}
              aria-label={isAquatic ? 'Toggle ocean heart' : 'Toggle favorite heart'}
              className={`absolute -top-4 left-1/2 -translate-x-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-transform hover:scale-110 cursor-pointer border ${
                isAquatic
                  ? 'bg-[#0077B6] text-white border-[#caf0f8]'
                  : 'bg-gradient-to-tr from-[#EC4899] to-[#BE185D] text-white border-[#FFF7F9]'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                {isAquatic ? 'water_drop' : lovedHeart ? 'favorite' : 'favorite'}
              </span>
            </button>

            <div
              className={`relative bg-white p-4 sm:p-5 rounded-3xl shadow-md border transition-transform duration-300 group-hover:-translate-y-1 ${
                isAquatic ? 'border-[#caf0f8]' : 'border-[#FBCFE8]'
              }`}
            >
              <div className="relative w-full aspect-square overflow-hidden rounded-2xl bg-[#FFF0F5]">
                <SafeImage
                  src={settings.heroImageUrl}
                  alt="Srishti and Manav keepsake portrait"
                  theme={theme}
                  loading="eager"
                  placeholderTitle="Srishti & Manav"
                  className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-500"
                />
                <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity text-xs font-semibold flex items-center gap-1 shadow-xs text-[#44313B]">
                  <span className="material-symbols-outlined text-[15px]">zoom_in</span>
                  <span>Inspect</span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between px-1">
                <div className="text-left">
                  <p
                    className={`text-[11px] font-semibold uppercase tracking-wider ${
                      isAquatic ? 'text-[#0077B6]' : 'text-[#927C89]'
                    }`}
                  >
                    {settings.heroPhotoSub}
                  </p>
                  <p
                    className={`font-serif text-xl font-semibold ${
                      isAquatic ? 'text-[#03045e]' : 'text-[#BE185D]'
                    }`}
                  >
                    {settings.heroPhotoLabel}
                  </p>
                </div>
                <span
                  className={`text-xs font-semibold ${
                    isAquatic ? 'text-[#0077B6]' : 'text-[#BE185D]'
                  }`}
                >
                  {lovedHeart ? 'Cherished ❤️' : 'Always'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
