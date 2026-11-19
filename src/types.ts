export type ThemeMode = 'romantic' | 'aquatic';

export type VisibilityMode = 'shared' | 'private';

export type MemoryCategory =
  | 'Firsts'
  | 'Adventures'
  | 'Special Days'
  | 'Random Moments'
  | 'Favorite Photos';

export type JournalMood =
  | 'In Love'
  | 'Grateful'
  | 'Peaceful'
  | 'Playful'
  | 'Nostalgic'
  | 'Missing You';

export type BucketCategory = 'Travel' | 'Food' | 'Cozy' | 'Adventure' | 'Milestone';

export type SpecialEventType =
  | 'Anniversary'
  | 'Birthday'
  | 'First Meeting'
  | 'Milestone'
  | 'Custom Event';

export type LittleThingCategory =
  | 'Songs'
  | 'Places'
  | 'Food'
  | 'Activities'
  | 'Shared Interests';

export type AppPage =
  | 'home'
  | 'memories'
  | 'story'
  | 'letters'
  | 'journal'
  | 'bucket-list'
  | 'calendar'
  | 'settings';

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  nickname: string;
  bio: string;
  avatarUrl: string;
  birthday: string;
  preferredTheme: ThemeMode;
  soundEnabled: boolean;
  defaultVisibility: VisibilityMode;
}

export interface PartnerSummary {
  id: string;
  displayName: string;
  nickname: string;
  avatarUrl: string;
  bio: string;
}

export interface Milestone {
  id: string;
  chapter: string;
  date: string; // YYYY-MM-DD for chronological sorting
  displayDate?: string;
  title: string;
  description: string;
  location: string;
  photoUrl?: string;
  icon: string;
  authorId: string;
  authorName: string;
}

export interface MemoryNote {
  id: string;
  authorId: string;
  authorName: string;
  text: string;
  createdAt: string;
}

export interface MemoryItem {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  location: string;
  category: MemoryCategory;
  caption: string;
  imageUrl: string;
  likes: number;
  authorId: string;
  authorName: string;
  authorInitial: string;
  notes?: MemoryNote[];
}

export interface LetterItem {
  id: string;
  title: string;
  condition: string;
  preview: string;
  content: string;
  date: string; // YYYY-MM-DD
  unlockDate?: string; // Optional YYYY-MM-DD scheduled opening date
  status: 'draft' | 'sent';
  visibility: VisibilityMode;
  authorId: string;
  authorName: string;
  isLocked?: boolean;
}

export interface JournalEntry {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  content: string;
  mood: JournalMood;
  photoUrl?: string;
  visibility: VisibilityMode;
  authorId: string;
  authorName: string;
  updatedAt: string;
}

export interface BucketItem {
  id: string;
  title: string;
  description: string;
  category: BucketCategory;
  targetDate?: string;
  completed: boolean;
  completedAt?: string;
  completionPhotoUrl?: string;
  authorId: string;
  authorName: string;
}

export interface SpecialDateEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  type: SpecialEventType;
  description: string;
  recurringYearly: boolean;
  reminderDays: number | null; // 0, 1, 7, or null
  authorId: string;
  authorName: string;
}

export interface LittleThingItem {
  id: string;
  category: LittleThingCategory;
  title: string;
  note: string;
  authorId: string;
  authorName: string;
}

export interface StickyWish {
  id: string;
  name: string;
  note: string;
  stamp: string;
  tag: string;
  timestamp: string;
  colorTheme?: 'ivory' | 'rose' | 'gold' | 'soft-taupe';
  authorId?: string;
}

export interface KeepsakeSettings {
  recipientName: string;
  subtitle: string;
  startDate: string; // ISO YYYY-MM-DD
  petalsGiven: number;
  mainQuote: string;
  heroMessage: string;
  heroImageUrl: string;
  heroPhotoLabel: string;
  heroPhotoSub: string;
  mainLetterTitle: string;
  mainLetterContent: string;
}

export interface SanctuaryState {
  settings: KeepsakeSettings;
  milestones: Milestone[];
  memories: MemoryItem[];
  letters: LetterItem[];
  journal: JournalEntry[];
  bucketList: BucketItem[];
  specialDates: SpecialDateEvent[];
  littleThings: LittleThingItem[];
  wishes: StickyWish[];
  partners: PartnerSummary[];
  backendStatus: {
    provider: 'local-express';
    supabaseConfigured: boolean;
    message: string;
  };
}
