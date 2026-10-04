export type ThemeMode = 'romantic' | 'aquatic';

export interface Milestone {
  id: string;
  chapter: string;
  date: string;
  title: string;
  description: string;
  location: string;
  icon: string;
}

export interface MemoryItem {
  id: string;
  title: string;
  date: string;
  category: 'trips' | 'silly' | 'milestones' | 'all';
  tag: string;
  caption: string;
  imageUrl: string;
  likes: number;
  author: string;
  authorInitial: string;
}

export interface LetterItem {
  id: string;
  title: string;
  condition: string;
  preview: string;
  content: string;
  isCustom?: boolean;
}

export interface StickyWish {
  id: string;
  name: string;
  note: string;
  stamp: string;
  tag: string;
  timestamp: string;
  colorTheme?: 'ivory' | 'rose' | 'gold' | 'soft-taupe';
}

export interface KeepsakeSettings {
  recipientName: string;
  subtitle: string;
  startDate: string; // ISO date format YYYY-MM-DD for dynamic 24hr daily day tracking
  petalsGiven: number;
  mainQuote: string;
  heroImageUrl: string;
  heroPhotoLabel: string;
  heroPhotoSub: string;
  mainLetterTitle: string;
  mainLetterContent: string;
  mainLetterSalutation?: string;
}
