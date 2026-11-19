import React, { useCallback, useEffect, useRef, useState } from 'react';
import { PetalCanvas, PetalCanvasHandle } from './components/PetalCanvas';
import { AquaticBackground } from './components/AquaticBackground';
import { RomanticBackground } from './components/RomanticBackground';
import { Header } from './components/Header';
import { AuthGate } from './components/AuthGate';
import { HomeDashboard } from './components/HomeDashboard';
import { MemoriesSection } from './components/MemoriesSection';
import { TimelineSection } from './components/TimelineSection';
import { LettersSection } from './components/LettersSection';
import { JournalSection } from './components/JournalSection';
import { BucketListSection } from './components/BucketListSection';
import { CalendarSection } from './components/CalendarSection';
import { SettingsSection } from './components/SettingsSection';
import { Footer } from './components/Footer';
import { OpenWhenModal } from './components/OpenWhenModal';
import { CertificateModal } from './components/CertificateModal';
import { MemoryModal } from './components/MemoryModal';
import { ToastContainer, ToastMessage } from './components/Toast';
import {
  AppPage,
  BucketCategory,
  BucketItem,
  JournalEntry,
  JournalMood,
  KeepsakeSettings,
  LetterItem,
  LittleThingCategory,
  LittleThingItem,
  MemoryCategory,
  MemoryItem,
  Milestone,
  SanctuaryState,
  SpecialDateEvent,
  SpecialEventType,
  ThemeMode,
  UserProfile,
  VisibilityMode,
} from './types';
import { apiFetch, getAuthToken, setAuthToken } from './utils/api';
import {
  toggleAmbientMusic,
  startAmbientMusic,
  stopAmbientMusic,
  playPetalShowerChime,
  playBubbleSplashChime,
} from './utils/sound';

const DEFAULT_PUBLIC_HERO: Partial<KeepsakeSettings> = {
  recipientName: 'Srishti and Manav',
  subtitle: 'Shishi- My kuchu puchuu',
  startDate: '2025-12-01',
  mainQuote: 'From a long-distance spark to right here in my arms',
  heroImageUrl: '/api/seed-asset/hero',
};

export default function App() {
  const petalCanvasRef = useRef<PetalCanvasHandle | null>(null);

  const [theme, setTheme] = useState<ThemeMode>(() => {
    const cached = localStorage.getItem('rosewood_theme');
    return cached === 'aquatic' ? 'aquatic' : 'romantic';
  });

  // Kept muted by default on initial load
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  const [checkingSession, setCheckingSession] = useState(true);
  const [loadingSanctuary, setLoadingSanctuary] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [publicHero, setPublicHero] = useState<Partial<KeepsakeSettings>>(DEFAULT_PUBLIC_HERO);
  const [sanctuary, setSanctuary] = useState<SanctuaryState | null>(null);
  const [currentPage, setCurrentPage] = useState<AppPage>('home');

  const [selectedMemory, setSelectedMemory] = useState<MemoryItem | null>(null);
  const [selectedLetter, setSelectedLetter] = useState<LetterItem | null>(null);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const notify = useCallback((type: 'success' | 'error' | 'info', text: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { id, type, text }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4200);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    localStorage.setItem('rosewood_theme', theme);
  }, [theme]);

  const loadSanctuary = useCallback(async () => {
    setLoadingSanctuary(true);
    try {
      const localSanctuary: SanctuaryState = {
        settings: {
          recipientName: (publicHero.recipientName as string) || 'Srishti and Manav',
          subtitle: (publicHero.subtitle as string) || 'Shishi- My kuchu puchuu',
          startDate: (publicHero.startDate as string) || '2025-12-01',
          mainQuote:
            (publicHero.mainQuote as string) ||
            'From a long-distance spark to right here in my arms',
          heroImageUrl: (publicHero.heroImageUrl as string) || '',
          ourStoryTitle: 'Our Story',
          ourStorySubtitle: 'Every chapter with you',
          letterUnlockDate: '2025-12-01',
          defaultTheme: theme,
          musicEnabled: false,
          musicTitle: 'Our Song',
          updatedAt: new Date().toISOString(),
        } as KeepsakeSettings,
        milestones: [],
        memories: [],
        letters: [],
        journal: [],
        bucketList: [],
        specialDates: [],
        littleThings: [],
        wishes: [],
        partners: user ? [user as unknown as SanctuaryState['partners'][number]] : [],
        backendStatus: {
          provider: 'local-express',
          supabaseConfigured: false,
          message: 'Running locally without backend API',
        },
      };

      setSanctuary(localSanctuary);
      setPublicHero({
        recipientName: localSanctuary.settings.recipientName,
        subtitle: localSanctuary.settings.subtitle,
        startDate: localSanctuary.settings.startDate,
        mainQuote: localSanctuary.settings.mainQuote,
        heroImageUrl: localSanctuary.settings.heroImageUrl,
      });
    } catch (err: any) {
      notify('error', err.message || 'Could not load sanctuary.');
    } finally {
      setLoadingSanctuary(false);
    }
  }, [notify, publicHero, theme, user]);

  useEffect(() => {
    let active = true;
    async function boot() {
      try {
        const hero = await apiFetch<Partial<KeepsakeSettings>>('/api/public/hero');
        if (active && hero) {
          setPublicHero(hero);
        }
      } catch {
        // fallback hero remains
      }

      if (!getAuthToken()) {
        // Also try cookie-based session if present
        try {
          const meRes = await apiFetch<{ user: UserProfile }>('/api/auth/me');
          if (active && meRes?.user) {
            setUser(meRes.user);
            await loadSanctuary();
          }
        } catch {
          // Not authenticated
        } finally {
          if (active) setCheckingSession(false);
        }
        return;
      }

      try {
        const meRes = await apiFetch<{ user: UserProfile }>('/api/auth/me');
        if (active && meRes?.user) {
          setUser(meRes.user);
          await loadSanctuary();
        }
      } catch {
        setAuthToken(null);
        if (active) {
          setUser(null);
          setSanctuary(null);
        }
      } finally {
        if (active) setCheckingSession(false);
      }
    }

    boot();
    return () => {
      active = false;
      stopAmbientMusic();
    };
  }, [loadSanctuary]);

  const handleAuthenticated = async (loggedInUser: UserProfile) => {
    setUser(loggedInUser);
    setCurrentPage('home');
    if (
      !localStorage.getItem('rosewood_theme') &&
      (loggedInUser.preferredTheme === 'aquatic' || loggedInUser.preferredTheme === 'romantic')
    ) {
      setTheme(loggedInUser.preferredTheme);
    }
    await loadSanctuary();
    notify('success', `Welcome back, ${loggedInUser.displayName}!`);
  };

  const handleLogout = async () => {
    try {
      await apiFetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // ignore network errors on logout
    }
    stopAmbientMusic();
    setIsMusicPlaying(false);
    setAuthToken(null);
    setUser(null);
    setSanctuary(null);
    setSelectedMemory(null);
    setSelectedLetter(null);
    setIsCertificateOpen(false);
    setCurrentPage('home');
    notify('info', 'Signed out of your private sanctuary.');
  };

  const handleAccountDeleted = () => {
    stopAmbientMusic();
    setIsMusicPlaying(false);
    setAuthToken(null);
    setUser(null);
    setSanctuary(null);
    setSelectedMemory(null);
    setSelectedLetter(null);
    setIsCertificateOpen(false);
    setCurrentPage('home');
    notify('info', 'Your account has been removed and private entries deleted.');
  };

  const handleShowerPetals = (count = 40) => {
    petalCanvasRef.current?.burst(count);
    if (isMusicPlaying) {
      if (theme === 'aquatic') {
        playBubbleSplashChime();
      } else {
        playPetalShowerChime();
      }
    }
  };

  const handleToggleTheme = async (newTheme: ThemeMode) => {
    setTheme(newTheme);
    localStorage.setItem('rosewood_theme', newTheme);
    petalCanvasRef.current?.burst(25);
    if (isMusicPlaying) {
      stopAmbientMusic();
      startAmbientMusic(newTheme);
      if (newTheme === 'aquatic') {
        playBubbleSplashChime();
      } else {
        playPetalShowerChime();
      }
    }
    if (user) {
      try {
        const res = await apiFetch<{ user: UserProfile }>('/api/auth/profile', {
          method: 'PATCH',
          body: JSON.stringify({ preferredTheme: newTheme }),
        });
        setUser(res.user);
      } catch {
        // non-blocking preference sync
      }
    }
  };

  const handleToggleMusic = () => {
    const nextState = toggleAmbientMusic(theme, (playing) => {
      setIsMusicPlaying(playing);
    });
    setIsMusicPlaying(nextState);
    if (nextState) {
      petalCanvasRef.current?.burst(25);
      if (theme === 'aquatic') {
        playBubbleSplashChime();
      } else {
        playPetalShowerChime();
      }
    }
  };

  const handleUpdateHeroSettings = async (patch: Partial<KeepsakeSettings>) => {
    const res = await apiFetch<{ settings: KeepsakeSettings }>('/api/sanctuary/settings', {
      method: 'PATCH',
      body: JSON.stringify(patch),
    });
    setSanctuary((prev) => (prev ? { ...prev, settings: res.settings } : prev));
    setPublicHero({
      recipientName: res.settings.recipientName,
      subtitle: res.settings.subtitle,
      startDate: res.settings.startDate,
      mainQuote: res.settings.mainQuote,
      heroImageUrl: res.settings.heroImageUrl,
    });
  };

  const handleUpdateProfile = async (patch: Partial<UserProfile>) => {
    const res = await apiFetch<{ user: UserProfile }>('/api/auth/profile', {
      method: 'PATCH',
      body: JSON.stringify(patch),
    });
    setUser(res.user);
    setSanctuary((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        partners: prev.partners.map((p) =>
          p.id === res.user.id
            ? {
                ...p,
                displayName: res.user.displayName,
                nickname: res.user.nickname,
                avatarUrl: res.user.avatarUrl,
                bio: res.user.bio,
              }
            : p
        ),
      };
    });
  };

  // Little Things CRUD
  const handleAddLittleThing = async (item: {
    category: LittleThingCategory;
    title: string;
    note: string;
  }) => {
    const created = await apiFetch<LittleThingItem>('/api/little-things', {
      method: 'POST',
      body: JSON.stringify(item),
    });
    setSanctuary((prev) =>
      prev ? { ...prev, littleThings: [created, ...prev.littleThings] } : prev
    );
  };

  const handleDeleteLittleThing = async (id: string) => {
    await apiFetch(`/api/little-things/${id}`, { method: 'DELETE' });
    setSanctuary((prev) =>
      prev ? { ...prev, littleThings: prev.littleThings.filter((i) => i.id !== id) } : prev
    );
    notify('info', 'Removed from Little Things We Love.');
  };

  // Milestones CRUD
  const handleAddMilestone = async (milestone: {
    chapter: string;
    date: string;
    displayDate?: string;
    title: string;
    description: string;
    location: string;
    photoUrl?: string;
    icon: string;
  }) => {
    const created = await apiFetch<Milestone>('/api/milestones', {
      method: 'POST',
      body: JSON.stringify(milestone),
    });
    setSanctuary((prev) =>
      prev
        ? {
            ...prev,
            milestones: [...prev.milestones, created].sort((a, b) =>
              a.date.localeCompare(b.date)
            ),
          }
        : prev
    );
  };

  const handleEditMilestone = async (updated: Milestone) => {
    const saved = await apiFetch<Milestone>(`/api/milestones/${updated.id}`, {
      method: 'PATCH',
      body: JSON.stringify(updated),
    });
    setSanctuary((prev) =>
      prev
        ? {
            ...prev,
            milestones: prev.milestones
              .map((m) => (m.id === saved.id ? saved : m))
              .sort((a, b) => a.date.localeCompare(b.date)),
          }
        : prev
    );
  };

  const handleDeleteMilestone = async (id: string) => {
    await apiFetch(`/api/milestones/${id}`, { method: 'DELETE' });
    setSanctuary((prev) =>
      prev ? { ...prev, milestones: prev.milestones.filter((m) => m.id !== id) } : prev
    );
    notify('info', 'Milestone removed.');
  };

  // Memories CRUD
  const handleAddMemory = async (memory: {
    title: string;
    date: string;
    location: string;
    category: MemoryCategory;
    caption: string;
    imageUrl: string;
  }) => {
    const created = await apiFetch<MemoryItem>('/api/memories', {
      method: 'POST',
      body: JSON.stringify(memory),
    });
    setSanctuary((prev) => (prev ? { ...prev, memories: [created, ...prev.memories] } : prev));
  };

  const handleEditMemory = async (updated: MemoryItem) => {
    const saved = await apiFetch<MemoryItem>(`/api/memories/${updated.id}`, {
      method: 'PATCH',
      body: JSON.stringify(updated),
    });
    setSanctuary((prev) =>
      prev
        ? { ...prev, memories: prev.memories.map((m) => (m.id === saved.id ? saved : m)) }
        : prev
    );
    if (selectedMemory?.id === saved.id) setSelectedMemory(saved);
  };

  const handleDeleteMemory = async (id: string) => {
    await apiFetch(`/api/memories/${id}`, { method: 'DELETE' });
    setSanctuary((prev) =>
      prev ? { ...prev, memories: prev.memories.filter((m) => m.id !== id) } : prev
    );
    if (selectedMemory?.id === id) setSelectedMemory(null);
    notify('info', 'Memory deleted.');
  };

  const handleLikeMemory = async (id: string) => {
    if (id === 'hero-portrait') {
      handleShowerPetals(25);
      return;
    }
    const saved = await apiFetch<MemoryItem>(`/api/memories/${id}/like`, { method: 'POST' });
    setSanctuary((prev) =>
      prev
        ? { ...prev, memories: prev.memories.map((m) => (m.id === saved.id ? saved : m)) }
        : prev
    );
    if (selectedMemory?.id === saved.id) setSelectedMemory(saved);
  };

  const handleAddMemoryNote = async (memoryId: string, text: string) => {
    const saved = await apiFetch<MemoryItem>(`/api/memories/${memoryId}/notes`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
    setSanctuary((prev) =>
      prev
        ? { ...prev, memories: prev.memories.map((m) => (m.id === saved.id ? saved : m)) }
        : prev
    );
    if (selectedMemory?.id === saved.id) setSelectedMemory(saved);
  };

  // Letters CRUD
  const handleAddLetter = async (letter: {
    title: string;
    condition: string;
    content: string;
    date: string;
    unlockDate?: string;
    status: 'draft' | 'sent';
    visibility: VisibilityMode;
  }) => {
    const created = await apiFetch<LetterItem>('/api/letters', {
      method: 'POST',
      body: JSON.stringify(letter),
    });
    setSanctuary((prev) => (prev ? { ...prev, letters: [created, ...prev.letters] } : prev));
  };

  const handleEditLetter = async (updated: LetterItem) => {
    const saved = await apiFetch<LetterItem>(`/api/letters/${updated.id}`, {
      method: 'PATCH',
      body: JSON.stringify(updated),
    });
    setSanctuary((prev) =>
      prev
        ? { ...prev, letters: prev.letters.map((l) => (l.id === saved.id ? saved : l)) }
        : prev
    );
    if (selectedLetter?.id === saved.id) setSelectedLetter(saved);
  };

  const handleDeleteLetter = async (id: string) => {
    await apiFetch(`/api/letters/${id}`, { method: 'DELETE' });
    setSanctuary((prev) =>
      prev ? { ...prev, letters: prev.letters.filter((l) => l.id !== id) } : prev
    );
    if (selectedLetter?.id === id) setSelectedLetter(null);
    notify('info', 'Letter removed.');
  };

  const handleEditMainLetter = async (title: string, content: string) => {
    await handleUpdateHeroSettings({ mainLetterTitle: title, mainLetterContent: content });
  };

  // Journal CRUD
  const handleAddJournalEntry = async (entry: {
    date: string;
    title: string;
    content: string;
    mood: JournalMood;
    photoUrl?: string;
    visibility: VisibilityMode;
  }) => {
    const created = await apiFetch<JournalEntry>('/api/journal', {
      method: 'POST',
      body: JSON.stringify(entry),
    });
    setSanctuary((prev) =>
      prev
        ? {
            ...prev,
            journal: [created, ...prev.journal].sort((a, b) => b.date.localeCompare(a.date)),
          }
        : prev
    );
  };

  const handleEditJournalEntry = async (updated: JournalEntry) => {
    const saved = await apiFetch<JournalEntry>(`/api/journal/${updated.id}`, {
      method: 'PATCH',
      body: JSON.stringify(updated),
    });
    setSanctuary((prev) =>
      prev
        ? {
            ...prev,
            journal: prev.journal
              .map((j) => (j.id === saved.id ? saved : j))
              .sort((a, b) => b.date.localeCompare(a.date)),
          }
        : prev
    );
  };

  const handleDeleteJournalEntry = async (id: string) => {
    await apiFetch(`/api/journal/${id}`, { method: 'DELETE' });
    setSanctuary((prev) =>
      prev ? { ...prev, journal: prev.journal.filter((j) => j.id !== id) } : prev
    );
    notify('info', 'Journal entry deleted.');
  };

  // Bucket List CRUD
  const handleAddBucketItem = async (item: {
    title: string;
    description: string;
    category: BucketCategory;
    targetDate?: string;
  }) => {
    const created = await apiFetch<BucketItem>('/api/bucket-list', {
      method: 'POST',
      body: JSON.stringify(item),
    });
    setSanctuary((prev) =>
      prev ? { ...prev, bucketList: [created, ...prev.bucketList] } : prev
    );
  };

  const handleUpdateBucketItem = async (updated: BucketItem) => {
    const saved = await apiFetch<BucketItem>(`/api/bucket-list/${updated.id}`, {
      method: 'PATCH',
      body: JSON.stringify(updated),
    });
    setSanctuary((prev) =>
      prev
        ? {
            ...prev,
            bucketList: prev.bucketList.map((b) => (b.id === saved.id ? saved : b)),
          }
        : prev
    );
  };

  const handleDeleteBucketItem = async (id: string) => {
    await apiFetch(`/api/bucket-list/${id}`, { method: 'DELETE' });
    setSanctuary((prev) =>
      prev ? { ...prev, bucketList: prev.bucketList.filter((b) => b.id !== id) } : prev
    );
    notify('info', 'Bucket list item deleted.');
  };

  const handleQuickToggleBucket = async (item: BucketItem) => {
    const nextCompleted = !item.completed;
    await handleUpdateBucketItem({
      ...item,
      completed: nextCompleted,
      completedAt: nextCompleted ? new Date().toISOString().slice(0, 10) : '',
    });
    if (nextCompleted) handleShowerPetals(30);
    notify('success', nextCompleted ? 'Dream marked completed!' : 'Moved back to pending.');
  };

  // Special Dates CRUD
  const handleAddEvent = async (ev: {
    title: string;
    date: string;
    type: SpecialEventType;
    description: string;
    recurringYearly: boolean;
    reminderDays: number | null;
  }) => {
    const created = await apiFetch<SpecialDateEvent>('/api/special-dates', {
      method: 'POST',
      body: JSON.stringify(ev),
    });
    setSanctuary((prev) =>
      prev ? { ...prev, specialDates: [...prev.specialDates, created] } : prev
    );
  };

  const handleUpdateEvent = async (updated: SpecialDateEvent) => {
    const saved = await apiFetch<SpecialDateEvent>(`/api/special-dates/${updated.id}`, {
      method: 'PATCH',
      body: JSON.stringify(updated),
    });
    setSanctuary((prev) =>
      prev
        ? {
            ...prev,
            specialDates: prev.specialDates.map((s) => (s.id === saved.id ? saved : s)),
          }
        : prev
    );
  };

  const handleDeleteEvent = async (id: string) => {
    await apiFetch(`/api/special-dates/${id}`, { method: 'DELETE' });
    setSanctuary((prev) =>
      prev ? { ...prev, specialDates: prev.specialDates.filter((s) => s.id !== id) } : prev
    );
    notify('info', 'Special date removed.');
  };

  const handleOpenHeroLightbox = () => {
    if (!sanctuary) return;
    setSelectedMemory({
      id: 'hero-portrait',
      title: sanctuary.settings.heroPhotoLabel || 'Srishti & Manav',
      date: sanctuary.settings.startDate,
      location: 'Our Sanctuary',
      category: 'Favorite Photos',
      caption: sanctuary.settings.mainQuote,
      imageUrl: sanctuary.settings.heroImageUrl,
      likes: 520,
      authorId: 'user-manav',
      authorName: sanctuary.settings.recipientName,
      authorInitial: '❤',
      notes: [],
    });
  };

  const isAquatic = theme === 'aquatic';
  const settings = sanctuary?.settings;

  return (
    <div
      className={`relative min-h-screen transition-colors duration-700 font-sans antialiased overflow-x-hidden ${
        isAquatic
          ? 'bg-gradient-to-b from-[#f0f8ff] via-[#e6f4f8] to-[#edf7fa] text-[#03045e] bg-aquatic-texture selection:bg-[#caf0f8] selection:text-[#0077b6]'
          : 'bg-gradient-to-b from-[#FFF7F9] via-[#FFEBF2] to-[#FFF9F2] text-[#44313B] bg-sanctuary-texture selection:bg-[#FBCFE8] selection:text-[#BE185D]'
      }`}
    >
      {/* Interactive Burst Canvas */}
      <PetalCanvas ref={petalCanvasRef} theme={theme} />

      {/* Continuous Theme Background Motion */}
      {isAquatic ? (
        <>
          <AquaticBackground />
          <div className="fixed top-10 left-1/2 -translate-x-1/2 w-[620px] h-[620px] bg-[#90e0ef]/20 blur-[140px] rounded-full pointer-events-none -z-10" />
          <div className="fixed bottom-0 -left-40 w-[500px] h-[500px] bg-[#caf0f8]/30 blur-[130px] rounded-full pointer-events-none -z-10" />
        </>
      ) : (
        <>
          <RomanticBackground />
          <div className="fixed top-10 left-1/2 -translate-x-1/2 w-[620px] h-[620px] bg-[#FBCFE8]/35 blur-[140px] rounded-full pointer-events-none -z-10" />
          <div className="fixed bottom-0 -right-40 w-[520px] h-[520px] bg-[#EDE9FE]/45 blur-[140px] rounded-full pointer-events-none -z-10" />
        </>
      )}

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} theme={theme} />

      {/* Single Floating Shower Button at Bottom-Right (No count badge) */}
      <div className="fixed bottom-5 right-5 z-40">
        <button
          type="button"
          onClick={() => handleShowerPetals(40)}
          aria-label={isAquatic ? 'Shower Sea Bubbles' : 'Shower Flower Petals'}
          title={isAquatic ? 'Shower sea bubbles & pearls' : 'Shower flower petals'}
          className={`w-14 h-14 rounded-full text-white shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center cursor-pointer border ${
            isAquatic
              ? 'bg-[#0077B6] hover:bg-[#023e8a] border-[#caf0f8] shadow-[0_8px_24px_rgba(0,119,182,0.35)]'
              : 'bg-gradient-to-tr from-[#EC4899] to-[#BE185D] hover:opacity-95 border-[#FCE7F3] shadow-[0_8px_24px_rgba(236,72,153,0.35)]'
          }`}
        >
          <span className="material-symbols-outlined text-[25px] text-[#ffe088]">
            {isAquatic ? 'bubble_chart' : 'local_florist'}
          </span>
        </button>
      </div>

      {/* Preserved 3-Zone Header */}
      <Header
        theme={theme}
        onToggleTheme={handleToggleTheme}
        isMusicPlaying={isMusicPlaying}
        onToggleMusic={handleToggleMusic}
        recipientName={settings?.recipientName || publicHero.recipientName || 'Srishti and Manav'}
        subtitle={settings?.subtitle || publicHero.subtitle || 'Shishi- My kuchu puchuu'}
        currentPage={currentPage}
        onNavigatePage={setCurrentPage}
        user={user}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main className="w-full pt-20 md:pt-24 min-h-[calc(100vh-180px)] relative z-10">
        {checkingSession || (user && loadingSanctuary && !sanctuary) ? (
          <div className="max-w-md mx-auto py-28 px-4 text-center">
            <div
              className={`w-12 h-12 rounded-full border-4 border-t-transparent animate-spin mx-auto mb-4 ${
                isAquatic ? 'border-[#0077B6]' : 'border-[#EC4899]'
              }`}
            />
            <p className="font-serif text-xl">Opening Srishti &amp; Manav’s Sanctuary...</p>
          </div>
        ) : !user || !sanctuary ? (
          <AuthGate
            theme={theme}
            publicHero={publicHero}
            onAuthenticated={handleAuthenticated}
          />
        ) : (
          <>
            {currentPage === 'home' && (
              <HomeDashboard
                theme={theme}
                settings={sanctuary.settings}
                milestones={sanctuary.milestones}
                memories={sanctuary.memories}
                littleThings={sanctuary.littleThings}
                bucketList={sanctuary.bucketList}
                specialDates={sanctuary.specialDates}
                onNavigatePage={setCurrentPage}
                onOpenPhotoLightbox={handleOpenHeroLightbox}
                onOpenMemoryLightbox={(m) => setSelectedMemory(m)}
                onUpdateHeroSettings={handleUpdateHeroSettings}
                onAddLittleThing={handleAddLittleThing}
                onDeleteLittleThing={handleDeleteLittleThing}
                onToggleBucketItem={handleQuickToggleBucket}
                onNotify={notify}
              />
            )}

            {currentPage === 'memories' && (
              <MemoriesSection
                memories={sanctuary.memories}
                theme={theme}
                onAddMemory={handleAddMemory}
                onEditMemory={handleEditMemory}
                onDeleteMemory={handleDeleteMemory}
                onLikeMemory={handleLikeMemory}
                onOpenLightbox={(m) => setSelectedMemory(m)}
                onShowerFlowers={() => handleShowerPetals(30)}
                onNotify={notify}
              />
            )}

            {currentPage === 'story' && (
              <TimelineSection
                milestones={sanctuary.milestones}
                theme={theme}
                onAddMilestone={handleAddMilestone}
                onEditMilestone={handleEditMilestone}
                onDeleteMilestone={handleDeleteMilestone}
                onShowerFlowers={() => handleShowerPetals(35)}
                onNotify={notify}
              />
            )}

            {currentPage === 'letters' && (
              <LettersSection
                letters={sanctuary.letters}
                currentUser={user}
                theme={theme}
                mainLetterTitle={sanctuary.settings.mainLetterTitle}
                mainLetterContent={sanctuary.settings.mainLetterContent}
                onOpenLetter={(letter) => setSelectedLetter(letter)}
                onAddLetter={handleAddLetter}
                onEditLetter={handleEditLetter}
                onDeleteLetter={handleDeleteLetter}
                onEditMainLetter={handleEditMainLetter}
                onOpenCertificate={() => setIsCertificateOpen(true)}
                onShowerFlowers={() => handleShowerPetals(30)}
                isMusicPlaying={isMusicPlaying}
                onToggleMusic={handleToggleMusic}
                onNotify={notify}
              />
            )}

            {currentPage === 'journal' && (
              <JournalSection
                entries={sanctuary.journal}
                currentUser={user}
                theme={theme}
                onAddEntry={handleAddJournalEntry}
                onEditEntry={handleEditJournalEntry}
                onDeleteEntry={handleDeleteJournalEntry}
                onNotify={notify}
              />
            )}

            {currentPage === 'bucket-list' && (
              <BucketListSection
                items={sanctuary.bucketList}
                theme={theme}
                onAddItem={handleAddBucketItem}
                onUpdateItem={handleUpdateBucketItem}
                onDeleteItem={handleDeleteBucketItem}
                onShowerFlowers={() => handleShowerPetals(35)}
                onNotify={notify}
              />
            )}

            {currentPage === 'calendar' && (
              <CalendarSection
                events={sanctuary.specialDates}
                theme={theme}
                onAddEvent={handleAddEvent}
                onUpdateEvent={handleUpdateEvent}
                onDeleteEvent={handleDeleteEvent}
                onNotify={notify}
              />
            )}

            {currentPage === 'settings' && (
              <SettingsSection
                user={user}
                partners={sanctuary.partners}
                theme={theme}
                isMusicPlaying={isMusicPlaying}
                backendStatus={sanctuary.backendStatus}
                onToggleTheme={handleToggleTheme}
                onToggleMusic={handleToggleMusic}
                onUpdateProfile={handleUpdateProfile}
                onLogout={handleLogout}
                onAccountDeleted={handleAccountDeleted}
                onNotify={notify}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigatePage={user ? setCurrentPage : undefined}
        recipientName={settings?.recipientName || 'Srishti and Manav'}
        theme={theme}
      />

      {/* Modals */}
      <OpenWhenModal
        letter={selectedLetter}
        theme={theme}
        onClose={() => setSelectedLetter(null)}
        onShowerFlowers={() => handleShowerPetals(30)}
      />

      <CertificateModal
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
        recipientName={settings?.recipientName || 'Srishti and Manav'}
        theme={theme}
        onShowerFlowers={() => handleShowerPetals(45)}
      />

      <MemoryModal
        memory={selectedMemory}
        memories={
          selectedMemory?.id === 'hero-portrait' ? [] : sanctuary?.memories || []
        }
        theme={theme}
        onSelectMemory={(m) => setSelectedMemory(m)}
        onClose={() => setSelectedMemory(null)}
        onLike={handleLikeMemory}
        onAddNote={
          selectedMemory?.id === 'hero-portrait' ? undefined : handleAddMemoryNote
        }
        onShowerFlowers={() => handleShowerPetals(25)}
      />
    </div>
  );
}
