import React, { useMemo, useState } from 'react';
import { SpecialDateEvent, SpecialEventType, ThemeMode } from '../types';
import { getDaysRemainingForEvent, parseLocalDate } from '../utils/dateTracker';

interface CalendarSectionProps {
  events: SpecialDateEvent[];
  theme?: ThemeMode;
  onAddEvent: (ev: {
    title: string;
    date: string;
    type: SpecialEventType;
    description: string;
    recurringYearly: boolean;
    reminderDays: number | null;
  }) => Promise<void>;
  onUpdateEvent: (ev: SpecialDateEvent) => Promise<void>;
  onDeleteEvent: (id: string) => Promise<void>;
  onNotify: (type: 'success' | 'error' | 'info', text: string) => void;
}

const EVENT_TYPES: SpecialEventType[] = [
  'Anniversary',
  'Birthday',
  'First Meeting',
  'Milestone',
  'Custom Event',
];

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const CalendarSection: React.FC<CalendarSectionProps> = ({
  events,
  theme = 'romantic',
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent,
  onNotify,
}) => {
  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth()); // 0-indexed

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<SpecialDateEvent | null>(null);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [type, setType] = useState<SpecialEventType>('Custom Event');
  const [description, setDescription] = useState('');
  const [recurringYearly, setRecurringYearly] = useState(true);
  const [reminderDays, setReminderDays] = useState<number | null>(7);

  const isAquatic = theme === 'aquatic';
  const headingColor = isAquatic ? 'text-[#03045e]' : 'text-[#BE185D]';
  const mutedText = isAquatic ? 'text-[#0077B6]' : 'text-[#927C89]';

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOffset = new Date(viewYear, viewMonth, 1).getDay();

  const monthEventsMap = useMemo(() => {
    const map: Record<number, SpecialDateEvent[]> = {};
    events.forEach((ev) => {
      const parsed = parseLocalDate(ev.date);
      const matchesMonth = ev.recurringYearly
        ? parsed.getMonth() === viewMonth
        : parsed.getFullYear() === viewYear && parsed.getMonth() === viewMonth;
      if (matchesMonth) {
        const day = parsed.getDate();
        if (!map[day]) map[day] = [];
        map[day].push(ev);
      }
    });
    return map;
  }, [events, viewYear, viewMonth]);

  const upcomingList = useMemo(() => {
    return events
      .map((ev) => ({
        ...ev,
        ...getDaysRemainingForEvent(ev.date, ev.recurringYearly),
      }))
      .sort((a, b) => a.daysRemaining - b.daysRemaining);
  }, [events]);

  const openAddForDay = (day?: number) => {
    setEditing(null);
    const mStr = String(viewMonth + 1).padStart(2, '0');
    const dStr = String(day || now.getDate()).padStart(2, '0');
    setDate(`${viewYear}-${mStr}-${dStr}`);
    setTitle('');
    setType('Custom Event');
    setDescription('');
    setRecurringYearly(true);
    setReminderDays(7);
    setShowModal(true);
  };

  const openEditModal = (ev: SpecialDateEvent) => {
    setEditing(ev);
    setTitle(ev.title);
    setDate(ev.date);
    setType(ev.type);
    setDescription(ev.description);
    setRecurringYearly(ev.recurringYearly);
    setReminderDays(ev.reminderDays);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date) return;
    try {
      if (editing) {
        await onUpdateEvent({
          ...editing,
          title: title.trim(),
          date,
          type,
          description: description.trim(),
          recurringYearly,
          reminderDays,
        });
        onNotify('success', 'Special date updated.');
      } else {
        await onAddEvent({
          title: title.trim(),
          date,
          type,
          description: description.trim(),
          recurringYearly,
          reminderDays,
        });
        onNotify('success', 'Special date added to calendar.');
      }
      setShowModal(false);
      setEditing(null);
    } catch (err: any) {
      onNotify('error', err.message || 'Could not save event.');
    }
  };

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const monthLabel = new Date(viewYear, viewMonth, 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <section className="max-w-[1200px] mx-auto px-4 md:px-8 py-10 md:py-14 w-full relative z-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <p className={`text-xs font-semibold uppercase tracking-wider ${mutedText}`}>
            Special Dates &amp; Reminders
          </p>
          <h1 className={`font-serif text-4xl md:text-5xl mt-1 ${headingColor}`}>
            Our Calendar
          </h1>
          <p className={`text-sm md:text-base mt-2 max-w-xl ${mutedText}`}>
            Anniversaries, birthdays, first-meeting milestones, and every celebration worth counting down to.
          </p>
        </div>

        <button
          type="button"
          onClick={() => openAddForDay()}
          className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white shadow-sm cursor-pointer min-h-[44px] shrink-0 ${
            isAquatic
              ? 'bg-[#0077B6]'
              : 'bg-gradient-to-r from-[#EC4899] to-[#BE185D]'
          }`}
        >
          <span className="material-symbols-outlined text-[19px]">event_available</span>
          <span>Add Special Date</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Monthly Calendar Grid */}
        <div
          className={`lg:col-span-7 bg-white/95 rounded-3xl p-5 sm:p-7 border shadow-sm ${
            isAquatic ? 'border-[#caf0f8] text-[#03045e]' : 'border-[#FBCFE8] text-[#44313B]'
          }`}
        >
          <div className="flex items-center justify-between gap-2 mb-6">
            <h2 className={`font-serif text-2xl sm:text-3xl font-semibold ${headingColor}`}>
              {monthLabel}
            </h2>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={prevMonth}
                aria-label="Previous month"
                className="w-9 h-9 rounded-xl border border-black/10 flex items-center justify-center hover:bg-black/5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[19px]">chevron_left</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setViewYear(now.getFullYear());
                  setViewMonth(now.getMonth());
                }}
                className="px-3 py-1.5 rounded-xl border border-black/10 text-xs font-semibold hover:bg-black/5 cursor-pointer"
              >
                Today
              </button>
              <button
                type="button"
                onClick={nextMonth}
                aria-label="Next month"
                className="w-9 h-9 rounded-xl border border-black/10 flex items-center justify-center hover:bg-black/5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[19px]">chevron_right</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-semibold opacity-65 mb-2">
            {WEEKDAYS.map((d) => (
              <div key={d} className="py-1">
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {Array.from({ length: firstDayOffset }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const day = idx + 1;
              const dayEvents = monthEventsMap[day] || [];
              const isToday =
                viewYear === now.getFullYear() &&
                viewMonth === now.getMonth() &&
                day === now.getDate();

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => {
                    if (dayEvents.length > 0) {
                      openEditModal(dayEvents[0]);
                    } else {
                      openAddForDay(day);
                    }
                  }}
                  title={
                    dayEvents.length > 0
                      ? dayEvents.map((e) => e.title).join(', ')
                      : 'Click to add an event on this day'
                  }
                  className={`aspect-square rounded-xl p-1 sm:p-1.5 border flex flex-col items-center justify-between transition-all cursor-pointer tabular-nums ${
                    isToday
                      ? isAquatic
                        ? 'bg-[#0077B6] text-white border-[#0077B6] font-bold'
                        : 'bg-[#BE185D] text-white border-[#BE185D] font-bold'
                      : dayEvents.length > 0
                      ? isAquatic
                        ? 'bg-[#e0fbfc] border-[#90e0ef] text-[#03045e] font-semibold'
                        : 'bg-[#FCE7F3] border-[#EC4899]/50 text-[#BE185D] font-semibold'
                      : 'bg-[#FFF9F2]/60 border-black/5 hover:bg-black/5'
                  }`}
                >
                  <span className="text-xs sm:text-sm">{day}</span>
                  {dayEvents.length > 0 && (
                    <span className="text-[10px] leading-none truncate w-full text-center">
                      {dayEvents[0].title.slice(0, 7)}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Upcoming Events List */}
        <div className="lg:col-span-5 space-y-4">
          <div
            className={`bg-white/95 rounded-3xl p-6 border shadow-sm ${
              isAquatic ? 'border-[#caf0f8] text-[#03045e]' : 'border-[#FBCFE8] text-[#44313B]'
            }`}
          >
            <h2 className={`font-serif text-2xl font-semibold mb-4 ${headingColor}`}>
              Upcoming &amp; Saved Dates
            </h2>

            <div className="space-y-3">
              {upcomingList.map((ev) => (
                <div
                  key={ev.id}
                  className={`p-4 rounded-2xl border flex items-start justify-between gap-3 ${
                    isAquatic
                      ? 'bg-[#f0f8ff]/80 border-[#caf0f8]'
                      : 'bg-[#FFF7F9] border-[#FBCFE8]/70'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <p className={`text-xs font-medium ${mutedText}`}>
                      {ev.type} ·{' '}
                      {ev.nextDate.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                      {ev.recurringYearly ? ' · Yearly' : ''}
                    </p>
                    <h3 className="font-serif text-xl font-semibold mt-0.5 truncate">
                      {ev.title}
                    </h3>
                    {ev.description && (
                      <p className="text-xs opacity-80 mt-1 leading-relaxed">{ev.description}</p>
                    )}
                    {ev.reminderDays !== null && (
                      <p className={`text-[11px] mt-1.5 ${mutedText}`}>
                        Reminder: {ev.reminderDays === 0 ? 'On the day' : `${ev.reminderDays} day(s) before`}
                      </p>
                    )}
                  </div>

                  <div className="text-right shrink-0 flex flex-col items-end gap-1.5">
                    <span className={`font-serif text-2xl font-bold tabular-nums leading-none ${headingColor}`}>
                      {ev.daysRemaining === 0
                        ? 'Today'
                        : ev.daysRemaining > 0
                        ? `${ev.daysRemaining}d`
                        : 'Past'}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => openEditModal(ev)}
                        aria-label={`Edit ${ev.title}`}
                        className="p-1 rounded-lg hover:bg-black/5 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[15px]">edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteEvent(ev.id)}
                        aria-label={`Delete ${ev.title}`}
                        className="p-1 rounded-lg hover:bg-red-50 hover:text-red-600 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[15px]">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add / Edit Event Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-xs animate-fade-in">
          <div className="bg-[#FFF9F2] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[#FBCFE8] relative animate-scale-up text-[#44313B]">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              aria-label="Close event dialog"
              className="absolute top-5 right-5 text-[#927C89] p-1 rounded-full cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <h2 className={`font-serif text-2xl font-semibold mb-4 ${headingColor}`}>
              {editing ? 'Edit Special Date' : 'Add Special Date'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Second Anniversary"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#FBCFE8] text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#FBCFE8] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as SpecialEventType)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#FBCFE8] text-sm"
                  >
                    {EVENT_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Plans or notes for this day..."
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#FBCFE8] text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 items-center">
                <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={recurringYearly}
                    onChange={(e) => setRecurringYearly(e.target.checked)}
                    className="rounded accent-[#EC4899]"
                  />
                  <span>Repeat every year</span>
                </label>

                <div>
                  <label className="block text-xs font-semibold mb-1">Reminder</label>
                  <select
                    value={reminderDays === null ? 'none' : String(reminderDays)}
                    onChange={(e) =>
                      setReminderDays(e.target.value === 'none' ? null : Number(e.target.value))
                    }
                    className="w-full px-3 py-1.5 rounded-xl bg-white border border-[#FBCFE8] text-xs"
                  >
                    <option value="none">No reminder</option>
                    <option value="0">On the day</option>
                    <option value="1">1 day before</option>
                    <option value="7">7 days before</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-sm text-[#927C89] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 rounded-xl text-white text-sm font-semibold cursor-pointer ${
                    isAquatic ? 'bg-[#0077B6]' : 'bg-[#BE185D]'
                  }`}
                >
                  {editing ? 'Save Event' : 'Save Date'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
