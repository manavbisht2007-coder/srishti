// Timezone-safe date calculations for anniversary tracking, countdowns, and special dates

export function parseLocalDate(dateStr: string): Date {
  const parts = dateStr.split('-').map(Number);
  if (parts.length === 3 && !parts.some(isNaN)) {
    return new Date(parts[0], parts[1] - 1, parts[2], 0, 0, 0, 0);
  }
  const fallback = new Date(dateStr);
  return new Date(fallback.getFullYear(), fallback.getMonth(), fallback.getDate(), 0, 0, 0, 0);
}

export function getTodayLocal(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
}

export function calculateDaysElapsed(startDateStr: string): number {
  try {
    const start = parseLocalDate(startDateStr);
    const today = getTodayLocal();
    const diffMs = Math.max(0, today.getTime() - start.getTime());
    return Math.round(diffMs / (1000 * 60 * 60 * 24)) + 1; // Day 1 on anniversary date
  } catch {
    return 1;
  }
}

export function calculateYearsAndDays(startDateStr: string): {
  years: number;
  months: number;
  remainingDays: number;
  totalDays: number;
} {
  const totalDays = calculateDaysElapsed(startDateStr);
  const start = parseLocalDate(startDateStr);
  const today = getTodayLocal();

  let years = today.getFullYear() - start.getFullYear();
  let months = today.getMonth() - start.getMonth();
  let days = today.getDate() - start.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonthLastDay = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    days += prevMonthLastDay;
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return {
    years: Math.max(0, years),
    months: Math.max(0, months),
    remainingDays: Math.max(0, days),
    totalDays,
  };
}

export function getTimeUntilNextMidnight(): {
  hours: number;
  minutes: number;
  seconds: number;
  formatted: string;
} {
  const now = new Date();
  const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
  const diffMs = Math.max(0, nextMidnight.getTime() - now.getTime());

  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

  const formatted = `${hours.toString().padStart(2, '0')}h ${minutes
    .toString()
    .padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;

  return { hours, minutes, seconds, formatted };
}

export function getDaysRemainingForEvent(
  dateStr: string,
  recurringYearly: boolean
): { daysRemaining: number; nextDate: Date } {
  const today = getTodayLocal();
  const base = parseLocalDate(dateStr);

  if (!recurringYearly) {
    const diff = Math.round((base.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return { daysRemaining: diff, nextDate: base };
  }

  let next = new Date(today.getFullYear(), base.getMonth(), base.getDate(), 0, 0, 0, 0);
  if (next.getTime() < today.getTime()) {
    next = new Date(today.getFullYear() + 1, base.getMonth(), base.getDate(), 0, 0, 0, 0);
  }
  const diff = Math.round((next.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return { daysRemaining: diff, nextDate: next };
}

export function formatReadableDate(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const d = parseLocalDate(dateStr);
    return d.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}
