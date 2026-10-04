// Utility to calculate real-time elapsed days and countdown to the next 24hr daily update

export function calculateDaysElapsed(startDateStr: string): number {
  try {
    const start = new Date(startDateStr);
    const now = new Date();
    // Normalize to dates
    const diffTime = Math.max(0, now.getTime() - start.getTime());
    return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1; // Day 1 onwards
  } catch {
    return 1;
  }
}

export function calculateYearsAndDays(startDateStr: string): { years: number; totalDays: number } {
  const totalDays = calculateDaysElapsed(startDateStr);
  const years = Math.max(1, Math.floor(totalDays / 365.25));
  return { years, totalDays };
}

export function getTimeUntilNextMidnight(): { hours: number; minutes: number; seconds: number; formatted: string } {
  const now = new Date();
  const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
  const diffMs = Math.max(0, nextMidnight.getTime() - now.getTime());

  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

  const formatted = `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;

  return { hours, minutes, seconds, formatted };
}
