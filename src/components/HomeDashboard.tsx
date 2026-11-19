import React, { useState } from 'react';
import {
  AppPage,
  BucketItem,
  KeepsakeSettings,
  LittleThingCategory,
  LittleThingItem,
  MemoryItem,
  Milestone,
  SpecialDateEvent,
  ThemeMode,
} from '../types';
import { HeroSection } from './HeroSection';
import { CelebrationBanner } from './CelebrationBanner';
import { SafeImage } from './SafeImage';
import { formatReadableDate, getDaysRemainingForEvent } from '../utils/dateTracker';

interface HomeDashboardProps {
  theme: ThemeMode;
  settings: KeepsakeSettings;
  milestones: Milestone[];
  memories: MemoryItem[];
  littleThings: LittleThingItem[];
  bucketList: BucketItem[];
  specialDates: SpecialDateEvent[];
  onNavigatePage: (page: AppPage) => void;
  onOpenPhotoLightbox: () => void;
  onOpenMemoryLightbox: (memory: MemoryItem) => void;
  onUpdateHeroSettings: (patch: Partial<KeepsakeSettings>) => Promise<void>;
  onAddLittleThing: (item: { category: LittleThingCategory; title: string; note: string }) => Promise<void>;
  onDeleteLittleThing: (id: string) => Promise<void>;
  onToggleBucketItem: (item: BucketItem) => Promise<void>;
  onNotify: (type: 'success' | 'error' | 'info', text: string) => void;
}

const LITTLE_THING_CATEGORIES: LittleThingCategory[] = [
  'Songs',
  'Places',
  'Food',
  'Activities',
  'Shared Interests',
];

const LITTLE_ICON_MAP: Record<LittleThingCategory, string> = {
  Songs: 'music_note',
  Places: 'location_on',
  Food: 'restaurant',
  Activities: 'local_activity',
  'Shared Interests': 'favorite',
};

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  theme,
  settings,
  milestones,
  memories,
  littleThings,
  bucketList,
  specialDates,
  onNavigatePage,
  onOpenPhotoLightbox,
  onOpenMemoryLightbox,
  onUpdateHeroSettings,
  onAddLittleThing,
  onDeleteLittleThing,
  onToggleBucketItem,
  onNotify,
}) => {
  const isAquatic = theme === 'aquatic';

  const [showAddLittle, setShowAddLittle] = useState(false);
  const [ltCategory, setLtCategory] = useState<LittleThingCategory>('Songs');
  const [ltTitle, setLtTitle] = useState('');
  const [ltNote, setLtNote] = useState('');

  const topMilestones = [...milestones]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 3);

  const recentMemories = memories.slice(0, 3);

  const completedCount = bucketList.filter((b) => b.completed).length;
  const bucketPercent = bucketList.length
    ? Math.round((completedCount / bucketList.length) * 100)
    : 0;
  const previewBucket = [
    ...bucketList.filter((b) => !b.completed).slice(0, 2),
    ...bucketList.filter((b) => b.completed).slice(0, 2),
  ].slice(0, 4);

  const upcomingEvents = specialDates
    .map((ev) => ({
      ...ev,
      ...getDaysRemainingForEvent(ev.date, ev.recurringYearly),
    }))
    .filter((ev) => ev.daysRemaining >= 0)
    .sort((a, b) => a.daysRemaining - b.daysRemaining)
    .slice(0, 3);

  const handleSaveLittleThing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ltTitle.trim()) return;
    try {
      await onAddLittleThing({
        category: ltCategory,
        title: ltTitle.trim(),
        note: ltNote.trim(),
      });
      setLtTitle('');
      setLtNote('');
      setShowAddLittle(false);
      onNotify('success', 'Added to Little Things We Love.');
    } catch (err: any) {
      onNotify('error', err.message || 'Could not add favorite.');
    }
  };

  const cardSurface = isAquatic
    ? 'bg-white/90 border-[#caf0f8] text-[#03045e]'
    : 'bg-white/90 border-[#FBCFE8] text-[#44313B]';

  const mutedText = isAquatic ? 'text-[#0077B6]' : 'text-[#927C89]';
  const headingColor = isAquatic ? 'text-[#03045e]' : 'text-[#BE185D]';

  return (
    <div className="w-full">
      {/* 1. Hero Section */}
      <HeroSection
        settings={settings}
        theme={theme}
        onOpenPhotoLightbox={onOpenPhotoLightbox}
        onUpdateHeroSettings={onUpdateHeroSettings}
        onNavigateMemories={() => onNavigatePage('memories')}
        onNotify={onNotify}
      />

      {/* 2. Our Story Preview */}
      <section className="max-w-[1200px] mx-auto px-4 md:px-8 py-12 relative z-10">
        <div
          className={`rounded-3xl p-6 sm:p-8 md:p-10 border shadow-xs backdrop-blur-md ${cardSurface}`}
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <p className={`text-xs font-semibold uppercase tracking-wider ${mutedText}`}>
                Our Story
              </p>
              <h2 className={`font-serif text-3xl md:text-4xl mt-1 ${headingColor}`}>
                From A Long-Distance Spark To Us
              </h2>
              <p className={`text-sm mt-2 max-w-xl leading-relaxed ${mutedText}`}>
                Every conversation, milestone, and quiet turning point that carried Srishti and Manav from miles apart to home in each other’s arms.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigatePage('story')}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white shrink-0 cursor-pointer transition-opacity hover:opacity-95 min-h-[42px] ${
                isAquatic
                  ? 'bg-[#0077B6]'
                  : 'bg-gradient-to-r from-[#EC4899] to-[#BE185D]'
              }`}
            >
              <span>Explore Full Timeline</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {topMilestones.map((m) => (
              <div
                key={m.id}
                className={`p-5 rounded-2xl border transition-colors ${
                  isAquatic
                    ? 'bg-[#f0f8ff]/80 border-[#caf0f8]'
                    : 'bg-[#FFF9F2] border-[#FBCFE8]/70'
                }`}
              >
                <div className={`text-xs font-medium mb-1.5 ${mutedText}`}>
                  {m.chapter} · {m.displayDate || formatReadableDate(m.date)}
                </div>
                <h3 className={`font-serif text-xl font-semibold mb-2 ${headingColor}`}>
                  {m.title}
                </h3>
                <p className="text-sm leading-relaxed line-clamp-3">{m.description}</p>
                {m.location && (
                  <p className={`text-xs mt-3 font-medium ${mutedText}`}>{m.location}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Recent Memories Preview */}
      <section className="max-w-[1200px] mx-auto px-4 md:px-8 py-12 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className={`text-xs font-semibold uppercase tracking-wider ${mutedText}`}>
              Recent Memories
            </p>
            <h2 className={`font-serif text-3xl md:text-4xl mt-1 ${headingColor}`}>
              Captured Moments
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigatePage('memories')}
            className={`inline-flex items-center gap-1.5 text-sm font-semibold hover:underline cursor-pointer ${headingColor}`}
          >
            <span>View All {memories.length} Memories</span>
            <span className="material-symbols-outlined text-[17px]">arrow_forward</span>
          </button>
        </div>

        {recentMemories.length === 0 ? (
          <div className={`rounded-2xl p-8 text-center border border-dashed ${cardSurface}`}>
            <p className="font-serif text-lg">No memories uploaded yet.</p>
            <button
              type="button"
              onClick={() => onNavigatePage('memories')}
              className="mt-3 text-xs font-semibold underline cursor-pointer"
            >
              Upload your first photo
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentMemories.map((mem) => (
              <div
                key={mem.id}
                onClick={() => onOpenMemoryLightbox(mem)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onOpenMemoryLightbox(mem);
                  }
                }}
                className={`group rounded-2xl p-4 border shadow-xs hover:shadow-md transition-all cursor-pointer hover:-translate-y-1 flex flex-col ${cardSurface}`}
              >
                <div className="w-full aspect-[4/3] rounded-xl overflow-hidden mb-3.5 bg-[#FFF0F5]">
                  <SafeImage
                    src={mem.imageUrl}
                    alt={mem.title}
                    theme={theme}
                    placeholderTitle={mem.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className={`text-xs font-medium mb-1 ${mutedText}`}>
                  {mem.category} · {formatReadableDate(mem.date)}
                </div>
                <h3 className={`font-serif text-xl font-semibold ${headingColor}`}>
                  {mem.title}
                </h3>
                <p className="text-sm mt-1.5 line-clamp-2 opacity-90">{mem.caption}</p>
                <div className={`mt-auto pt-3 text-xs font-medium ${mutedText}`}>
                  Added by {mem.authorName}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. Little Things We Love */}
      <section className="max-w-[1200px] mx-auto px-4 md:px-8 py-12 relative z-10">
        <div
          className={`rounded-3xl p-6 sm:p-8 border shadow-xs backdrop-blur-md ${cardSurface}`}
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <p className={`text-xs font-semibold uppercase tracking-wider ${mutedText}`}>
                Little Things We Love
              </p>
              <h2 className={`font-serif text-3xl mt-1 ${headingColor}`}>
                Our Favorite Songs, Places &amp; Comforts
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setShowAddLittle((v) => !v)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border cursor-pointer transition-colors min-h-[40px] ${
                isAquatic
                  ? 'bg-[#e0fbfc] text-[#0077B6] border-[#90e0ef] hover:bg-[#caf0f8]'
                  : 'bg-[#FFF0F5] text-[#BE185D] border-[#FBCFE8] hover:bg-[#FCE7F3]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">
                {showAddLittle ? 'close' : 'add'}
              </span>
              <span>{showAddLittle ? 'Close Form' : 'Add Favorite'}</span>
            </button>
          </div>

          {showAddLittle && (
            <form
              onSubmit={handleSaveLittleThing}
              className={`mb-6 p-4 rounded-2xl border grid grid-cols-1 md:grid-cols-4 gap-3 ${
                isAquatic
                  ? 'bg-[#f0f8ff] border-[#caf0f8]'
                  : 'bg-[#FFF9F2] border-[#FBCFE8]'
              }`}
            >
              <select
                value={ltCategory}
                onChange={(e) => setLtCategory(e.target.value as LittleThingCategory)}
                aria-label="Favorite category"
                className="px-3 py-2 rounded-xl bg-white border border-[#FBCFE8] text-sm text-[#44313B]"
              >
                {LITTLE_THING_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <input
                type="text"
                required
                placeholder="Favorite item (e.g. Midnight Chai)"
                value={ltTitle}
                onChange={(e) => setLtTitle(e.target.value)}
                className="px-3 py-2 rounded-xl bg-white border border-[#FBCFE8] text-sm text-[#44313B]"
              />
              <input
                type="text"
                placeholder="Why we love it..."
                value={ltNote}
                onChange={(e) => setLtNote(e.target.value)}
                className="px-3 py-2 rounded-xl bg-white border border-[#FBCFE8] text-sm text-[#44313B]"
              />
              <button
                type="submit"
                className={`px-4 py-2 rounded-xl text-white text-sm font-semibold cursor-pointer ${
                  isAquatic ? 'bg-[#0077B6]' : 'bg-[#EC4899]'
                }`}
              >
                Save Favorite
              </button>
            </form>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {littleThings.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border flex items-start justify-between gap-3 group ${
                  isAquatic
                    ? 'bg-[#f0f8ff]/70 border-[#caf0f8]'
                    : 'bg-[#FFF7F9] border-[#FBCFE8]/70'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isAquatic
                        ? 'bg-[#e0fbfc] text-[#0077B6]'
                        : 'bg-[#FCE7F3] text-[#BE185D]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {LITTLE_ICON_MAP[item.category]}
                    </span>
                  </div>
                  <div>
                    <p className={`text-xs font-medium ${mutedText}`}>
                      {item.category} · {item.authorName}
                    </p>
                    <h3 className="font-serif text-lg font-semibold leading-snug">{item.title}</h3>
                    {item.note && <p className="text-xs opacity-80 mt-1">{item.note}</p>}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onDeleteLittleThing(item.id)}
                  aria-label={`Remove ${item.title}`}
                  className="opacity-50 group-hover:opacity-100 hover:text-red-600 p-1 cursor-pointer shrink-0"
                >
                  <span className="material-symbols-outlined text-[16px]">delete</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Bucket List & Special Dates Split */}
      <section className="max-w-[1200px] mx-auto px-4 md:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Bucket List Preview */}
          <div
            className={`lg:col-span-6 rounded-3xl p-6 sm:p-8 border shadow-xs backdrop-blur-md flex flex-col ${cardSurface}`}
          >
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <p className={`text-xs font-semibold uppercase tracking-wider ${mutedText}`}>
                  Our Bucket List
                </p>
                <h2 className={`font-serif text-2xl sm:text-3xl mt-1 ${headingColor}`}>
                  Dreams To Live Together
                </h2>
              </div>
              <span className={`text-xs font-bold tabular-nums ${headingColor}`}>
                {completedCount}/{bucketList.length} Done ({bucketPercent}%)
              </span>
            </div>

            <div className="w-full h-2 rounded-full bg-black/5 overflow-hidden mb-5">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isAquatic ? 'bg-[#0077B6]' : 'bg-gradient-to-r from-[#EC4899] to-[#BE185D]'
                }`}
                style={{ width: `${bucketPercent}%` }}
              />
            </div>

            <div className="space-y-3 flex-1">
              {previewBucket.map((item) => (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 ${
                    isAquatic
                      ? 'bg-[#f0f8ff]/70 border-[#caf0f8]'
                      : 'bg-[#FFF9F2] border-[#FBCFE8]/70'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => onToggleBucketItem(item)}
                    className="flex items-center gap-3 text-left flex-1 cursor-pointer"
                  >
                    <span
                      className={`material-symbols-outlined text-[20px] ${
                        item.completed
                          ? isAquatic
                            ? 'text-[#0077B6]'
                            : 'text-[#EC4899]'
                          : 'opacity-40'
                      }`}
                    >
                      {item.completed ? 'check_circle' : 'radio_button_unchecked'}
                    </span>
                    <div>
                      <p
                        className={`text-sm font-semibold ${
                          item.completed ? 'line-through opacity-65' : ''
                        }`}
                      >
                        {item.title}
                      </p>
                      <p className={`text-xs ${mutedText}`}>
                        {item.category}
                        {item.targetDate ? ` · Target ${formatReadableDate(item.targetDate)}` : ''}
                      </p>
                    </div>
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => onNavigatePage('bucket-list')}
              className={`mt-6 inline-flex items-center gap-1.5 text-xs font-semibold hover:underline cursor-pointer self-start ${headingColor}`}
            >
              <span>Open Full Bucket List</span>
              <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
            </button>
          </div>

          {/* Special Dates Preview */}
          <div
            className={`lg:col-span-6 rounded-3xl p-6 sm:p-8 border shadow-xs backdrop-blur-md flex flex-col ${cardSurface}`}
          >
            <div className="flex items-center justify-between gap-3 mb-5">
              <div>
                <p className={`text-xs font-semibold uppercase tracking-wider ${mutedText}`}>
                  Special Dates
                </p>
                <h2 className={`font-serif text-2xl sm:text-3xl mt-1 ${headingColor}`}>
                  Upcoming Milestones
                </h2>
              </div>
              <span className={`material-symbols-outlined text-[24px] ${mutedText}`}>
                event
              </span>
            </div>

            <div className="space-y-3 flex-1">
              {upcomingEvents.map((ev) => (
                <div
                  key={ev.id}
                  className={`p-4 rounded-xl border flex items-center justify-between gap-4 ${
                    isAquatic
                      ? 'bg-[#f0f8ff]/70 border-[#caf0f8]'
                      : 'bg-[#FFF7F9] border-[#FBCFE8]/70'
                  }`}
                >
                  <div>
                    <p className={`text-xs font-medium ${mutedText}`}>
                      {ev.type} · {ev.nextDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                    <h3 className="font-serif text-lg font-semibold mt-0.5">{ev.title}</h3>
                    {ev.description && (
                      <p className="text-xs opacity-80 mt-0.5 line-clamp-1">{ev.description}</p>
                    )}
                  </div>
                  <div className="text-right shrink-0 tabular-nums">
                    <span className={`font-serif text-2xl font-bold block leading-none ${headingColor}`}>
                      {ev.daysRemaining === 0 ? 'Today' : ev.daysRemaining}
                    </span>
                    {ev.daysRemaining > 0 && (
                      <span className={`text-[11px] font-medium ${mutedText}`}>
                        {ev.daysRemaining === 1 ? 'day left' : 'days left'}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => onNavigatePage('calendar')}
              className={`mt-6 inline-flex items-center gap-1.5 text-xs font-semibold hover:underline cursor-pointer self-start ${headingColor}`}
            >
              <span>Open Special Dates Calendar</span>
              <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </section>

      {/* 6. Celebration Banner */}
      <CelebrationBanner theme={theme} />
    </div>
  );
};
