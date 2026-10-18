import React, { useState, useEffect, useRef } from 'react';
import { PetalCanvas, PetalCanvasHandle } from './components/PetalCanvas';
import { AquaticBackground } from './components/AquaticBackground';
import { RomanticBackground } from './components/RomanticBackground';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { TimelineSection } from './components/TimelineSection';
import { GallerySection } from './components/GallerySection';
import { LettersSection } from './components/LettersSection';
import { PinboardSection } from './components/PinboardSection';
import { CelebrationBanner } from './components/CelebrationBanner';
import { Footer } from './components/Footer';
import { OpenWhenModal } from './components/OpenWhenModal';
import { CertificateModal } from './components/CertificateModal';
import { MemoryModal } from './components/MemoryModal';
import {
  Milestone,
  MemoryItem,
  LetterItem,
  StickyWish,
  KeepsakeSettings,
  ThemeMode,
} from './types';
import {
  toggleAmbientMusic,
  startAmbientMusic,
  stopAmbientMusic,
  playPetalShowerChime,
  playBubbleSplashChime,
} from './utils/sound';

const DEFAULT_SETTINGS: KeepsakeSettings = {
  recipientName: 'Srishti and Manav',
  subtitle: 'Shishi- My kuch puchuu',
  startDate: '2025-12-01', // 1st December 2025
  petalsGiven: 1420,
  mainQuote:
    'From a long-distance spark to right here in my arms',
  heroImageUrl:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBrl9gYx78SUS7omxQOos2juTyjesBhhbF8zZNesct8MqT9_b0ELvIatWQVfNC9GdLtg0p4ohQcUQKvNULaU6qONuUFWdPESiK9OXzU6Ms9254Z1DFhpttFdeRzFV5tz4Gpt63DAKVCKvDl8xBM7NXbko9SxQhXlWtnZvTH1-Io6Y6nDgpVoSoSLZhARPoxs1dVAp7QYgfR_5fYankrtto_hXfBlrV6fdsIM_O3FtUe1Ut756a83lzz',
  heroPhotoLabel: 'Srishti & Manav',
  heroPhotoSub: 'Forever & Always',
  mainLetterTitle: 'A Letter For When You Need a Smile',
  mainLetterContent: `If you are reading this on an ordinary Tuesday or on an evening when the world feels slightly too heavy, I want you to take a slow breath and remember something simple:\n\n“You have this quiet, effortless magic of making spaces feel softer and people feel understood. You never ask for the spotlight, yet everyone in your presence blooms a little wider.”\n\nThank you for laughing at my worst puns, for holding my silence when words were too messy, and for celebrating every little victory like it was the world cup. Meeting you wasn’t luck—it was grace. Here’s to every horizon we haven't crossed yet.`,
};

const DEFAULT_MILESTONES: Milestone[] = [
  {
    id: 'm-1',
    chapter: 'Chapter I',
    date: 'October 2019',
    title: 'The Coffee Spill Encounter',
    description:
      'Both reaching for the last cinnamon brioche in the library café. One spilled latte led to two hours of uninterrupted giggles.',
    location: 'Campus Corner Bookshop',
    icon: 'local_cafe',
  },
  {
    id: 'm-2',
    chapter: 'Chapter II',
    date: 'July 2021',
    title: 'The Coastal Flat-Tire Fiasco',
    description:
      'Stranded at dusk on the scenic bluff with no cell service. We ate warm cherries, danced on the hood, and watched the milky way emerge.',
    location: 'Highway 101 Overlook',
    icon: 'directions_car',
  },
  {
    id: 'm-3',
    chapter: 'Chapter III',
    date: 'May 2023',
    title: 'The Graduation Hug That Melted Time',
    description:
      'Through study marathons and career doubts, stepping into adulthood hand in hand. The tears were real, but the pride was boundless.',
    location: 'Sunlit Grand Amphitheater',
    icon: 'school',
  },
  {
    id: 'm-4',
    chapter: 'Chapter IV',
    date: 'Present Day',
    title: 'Surprise Sanctuary Celebration',
    description:
      'Gathering every heart you have touched across the years into one single love-letter keepsake that will stay forever alive.',
    location: 'The Rooftop Greenhouse',
    icon: 'cake',
  },
];

const DEFAULT_MEMORIES: MemoryItem[] = [
  {
    id: 'mem-1',
    title: 'Golden Hour Botanical Magic',
    date: 'April 14 • Kyoto trip',
    category: 'trips',
    tag: 'Garden Blooms',
    caption:
      '“Our happiest afternoon — running between greenhouses until the staff gently told us they were locking up.”',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDDgqvZ0qgApbOQ09Rc2Qvm8h0Gyj_FD4ENJzbTxvkFeUqBAIt3xkSRKmIyovxyc1Q6SSrQz6_2gdob6n7cx9Zy2omtFwsl3WUFIhz1npP6HyEyoo_44s5_dM3dKgCVVgmuDtEvGGYK2UWSXY_9OOFAhhxMb03SD5KX3f5ZkxQokt_lopxiOocq-dQ23loTn3ScnDHKQA5jRGXU7lmTvXZuaJnGf2WaQhg3xIxq9vX3k2TOFcJ8Wqkx',
    likes: 148,
    author: 'Maya',
    authorInitial: 'M',
  },
  {
    id: 'mem-2',
    title: 'Spilling More Tea Than Drinking',
    date: 'September 29 • Weekend ritual',
    category: 'silly',
    tag: 'Matcha Afternoons',
    caption: '“When a thirty-minute catch-up inevitably turns into a 4-hour heart-to-heart.”',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCFPGoY7l-G7hcHiyh34SEdHdZ7CRf0nK-F98_TBlGjP-NvC8vXfeQzvARVPYpwKEISY2EAEtxNZmn2wrjenBW2T0EdLISc9AXiIfU8vcisCkKcK_W-FS8AZjPmZdLEmp6FHQRVJZABiwH3J1XqhjFuYGkjCSD0_VSMVNdQNLPS1s3VhVq0s_ezix7QwU5xamkMl-AQEaKh2z591qzOw9LIJ97DSvxKXxvTAzIiYzoCV7ckP7XvHJZL',
    likes: 94,
    author: 'Sam',
    authorInitial: 'S',
  },
  {
    id: 'mem-3',
    title: 'Silence That Needs No Words',
    date: 'August 03 • Big Sur',
    category: 'trips',
    tag: 'Coastal Dusk',
    caption: '“Sitting wrapped in that oversized blanket watching the Pacific swallow the sun.”',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCk7qdtIpZMs-s3vG8k5c0zf_pIamN5h50q4-1uSMkCTgcDnxk5dojkIB0InN5d7c6GgIMfm6Sgq5ZC9oD-yJmcCGwtnwsa__JaDqppYYnjIdfeKwxQ3YUpS-U2ZgmNATbFfdIWFX4aXhyQqc7WIhmYpVERA2TpcRDiQSVVKhPQX7LdH5TtZEizux5tIFmoz16LKBA12hX7kpNF4ncGoTTwGHV933vjfUe1kWmpAc5_OhEpx4e_9smr',
    likes: 210,
    author: 'Elena',
    authorInitial: 'E',
  },
  {
    id: 'mem-4',
    title: 'First Apartment Keys',
    date: 'November 18 • New Keys',
    category: 'milestones',
    tag: 'Milestones',
    caption: '“Eating cold takeout pizza on cardboard moving boxes, declaring ourselves official adults.”',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDP-T3XBOh2wrzDHoD4rWhTkvpMnzJFw21Z2wFVpMmPO2x6Os0Q0Q0KDewVwsmyQ8YvDc3BbxR4Qhf4qtSZ4mLEv53ImJtdTQn-cVtDWyWzzCuP8TGGYjeLJxJLSHzjNhS5J7IggOvitXtq37ixE5ob2d0rNBdO8wPaSbeo8B-DLrj3AjUWDfsHKUgXF0Q2_BwI46jP2oYikpx5qfOuAdlQuljvYuqTWbc6At-kXCS1RdhYp2UpR2Jx',
    likes: 176,
    author: 'Chloe',
    authorInitial: 'C',
  },
  {
    id: 'mem-5',
    title: 'Strip 4 of 12 Unfiltered',
    date: 'January 02 • Arcade night',
    category: 'silly',
    tag: 'Photo Booth',
    caption: '“We spent our last ten dollars on the vintage camera booth instead of dinner.”',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBrAcLH0LRJ-yOZDagP4vDw9wgA68ZzzX1moG_Tpl8ur5UDuG7FCC3Fa9icqnzHhA__Exerpgq259alHSgTLQN_bvtGXNeUtume29o6XQfkzugnsXXfxyfmmpdH7chQCC6HWxMK2Shmw-a4idzNAQxz0axL9C0n-0rqLZTlEJUBKi8QgDKEC_6GZldS4u3bGqNk3NudJ9cSTuqIPoOhs-AJhkI-ooiuH2ccYx6GsOXx4iOvgG8IOlc9',
    likes: 241,
    author: 'Jess',
    authorInitial: 'J',
  },
];

const DEFAULT_LETTERS: LetterItem[] = [
  {
    id: 'letter-scary-dreams',
    title: 'When you have big scary dreams ahead',
    condition: 'Open When: You have big scary dreams ahead',
    preview: 'You were never meant for a small, timid life...',
    content: `My brilliant friend,\n\nWhenever the world feels daunting and your ambitions feel larger than your hands, please remember how many mountain passes you have already traversed.\n\nYou have an instinct that is sharp, a heart that is stubborn in the best ways, and an imagination that deserves to take up space. Don't shrink to fit rooms that were built before you arrived.\n\nTake the leap. Even if your knees shake, take it anyway. I will be right here on the ground, cheering with bells on, ready with celebration lattes or ice cream depending on the day.\n\nYou've got this. You always have.\n\nWith unending faith in you,\nYour Biggest Fan`,
  },
  {
    id: 'letter-late-night-drives',
    title: 'When you miss our late-night drives',
    condition: 'Open When: You miss our late-night drives',
    preview: 'Roll down the window, put on that 2010s playlist...',
    content: `Hey night owl,\n\nIf you're missing the chill of coastal air through cracked windows and the sound of our voices harmonizing terribly to songs we only half-remembered: close your eyes for five seconds.\n\nPicture the yellow streetlights streaking against the dashboard. Smell the warm French fries in the passenger seat. That warmth isn't gone; it's saved in the bank of our memories, earning interest every single day.\n\nText me right now, even if it's 3 AM. I might be asleep, but I'll wake up to your ping with a grin on my face.\n\nUntil the next empty highway,\nYour Road Trip Navigator`,
  },
  {
    id: 'letter-rainy-days',
    title: 'When you need a reminder of how loved you are',
    condition: 'Open When: You need a gentle reminder of your light',
    preview: 'On days when you feel invisible or exhausted...',
    content: `Dearest soul,\n\nIf today was unkind to you, please be extra gentle with yourself tonight. Make yourself hot chamomile tea, wrap yourself in the softest blanket in your home, and lay down your worries.\n\nYou do not have to be remarkable every single hour. Your worth has never been tied to productivity. You are deeply cherished simply for your laugh, your kindness, and the way you care for the people in your orbit.\n\nRest up. The sun will rise again tomorrow, and so will you.\n\nAlways and forever in your corner,\nWith all my love`,
  },
];

const DEFAULT_WISHES: StickyWish[] = [
  {
    id: 'w-1',
    name: 'Maya L.',
    note: 'Thank you for being the first person who made this city feel like a home. You are pure sunlight.',
    stamp: '💐',
    tag: '#sunshine',
    timestamp: 'Today, 2:15 PM',
    colorTheme: 'ivory',
  },
  {
    id: 'w-2',
    name: 'Lucas T.',
    note: 'I still laugh whenever I think of us trying to pitch a tent in 30mph coastal winds. Never change!',
    stamp: '✨',
    tag: '#tentDisaster',
    timestamp: 'Yesterday',
    colorTheme: 'rose',
  },
  {
    id: 'w-3',
    name: 'Anika & Jordan',
    note: 'May this next year bring you all the gentle peace and roaring adventures you so deeply deserve!',
    stamp: '💖',
    tag: '#blessings',
    timestamp: '3 days ago',
    colorTheme: 'gold',
  },
  {
    id: 'w-4',
    name: 'Chloe V.',
    note: 'To the designated driver of my chaotic thoughts and the best co-pilot in the cosmos!',
    stamp: '🥂',
    tag: '#forever',
    timestamp: '1 week ago',
    colorTheme: 'soft-taupe',
  },
];

export default function App() {
  const petalCanvasRef = useRef<PetalCanvasHandle | null>(null);

  // Theme state: 'romantic' or 'aquatic'
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const cached = localStorage.getItem('rosewood_theme');
    if (cached === 'aquatic' || cached === 'romantic') {
      return cached;
    }
    return 'romantic';
  });

  // App State with localStorage caching
  const [settings, setSettings] = useState<KeepsakeSettings>(() => {
    const cached = localStorage.getItem('rosewood_settings');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        return {
          ...parsed,
          recipientName: 'Srishti and Manav',
          subtitle: 'Shishi- My kuch puchuu',
          startDate: '2025-12-01',
          mainQuote: 'From a long-distance spark to right here in my arms',
        };
      } catch {
        return DEFAULT_SETTINGS;
      }
    }
    return DEFAULT_SETTINGS;
  });

  const [milestones, setMilestones] = useState<Milestone[]>(() => {
    const cached = localStorage.getItem('rosewood_milestones');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        return DEFAULT_MILESTONES;
      }
    }
    return DEFAULT_MILESTONES;
  });

  const [memories, setMemories] = useState<MemoryItem[]>(() => {
    const cached = localStorage.getItem('rosewood_memories');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        return DEFAULT_MEMORIES;
      }
    }
    return DEFAULT_MEMORIES;
  });

  const [letters, setLetters] = useState<LetterItem[]>(() => {
    const cached = localStorage.getItem('rosewood_letters');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        return DEFAULT_LETTERS;
      }
    }
    return DEFAULT_LETTERS;
  });

  const [wishes, setWishes] = useState<StickyWish[]>(() => {
    const cached = localStorage.getItem('rosewood_wishes');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        return DEFAULT_WISHES;
      }
    }
    return DEFAULT_WISHES;
  });

  // Navigation & modals
  const [activeSection, setActiveSection] = useState('hero');
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState<LetterItem | null>(null);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState<MemoryItem | null>(null);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('rosewood_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('rosewood_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('rosewood_milestones', JSON.stringify(milestones));
  }, [milestones]);

  useEffect(() => {
    localStorage.setItem('rosewood_memories', JSON.stringify(memories));
  }, [memories]);

  useEffect(() => {
    localStorage.setItem('rosewood_letters', JSON.stringify(letters));
  }, [letters]);

  useEffect(() => {
    localStorage.setItem('rosewood_wishes', JSON.stringify(wishes));
  }, [wishes]);

  // Petal / Bubble burst trigger (ONLY showers when button is pushed!)
  const handleShowerPetals = (count = 50) => {
    if (petalCanvasRef.current) {
      petalCanvasRef.current.burst(count);
    }
    if (theme === 'aquatic') {
      playBubbleSplashChime();
    } else {
      playPetalShowerChime();
    }
    setSettings((prev) => ({
      ...prev,
      petalsGiven: prev.petalsGiven + count,
    }));
  };

  const handleToggleTheme = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    if (newTheme === 'aquatic') {
      playBubbleSplashChime();
    } else {
      playPetalShowerChime();
    }
    if (petalCanvasRef.current) {
      petalCanvasRef.current.burst(25);
    }
    if (isMusicPlaying) {
      stopAmbientMusic();
      startAmbientMusic(newTheme);
    }
  };

  const handleToggleMusic = () => {
    const nextState = toggleAmbientMusic(theme, (playing) => {
      setIsMusicPlaying(playing);
    });
    setIsMusicPlaying(nextState);
    if (nextState) {
      handleShowerPetals(25);
    }
  };

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const elem = document.getElementById(sectionId);
    if (elem) {
      const topOffset = elem.getBoundingClientRect().top + window.pageYOffset - 90;
      window.scrollTo({ top: topOffset, behavior: 'smooth' });
    }
  };

  // Milestone actions
  const handleAddMilestone = (newMilestone: Omit<Milestone, 'id'>) => {
    const item: Milestone = {
      ...newMilestone,
      id: `m-${Date.now()}`,
    };
    setMilestones((prev) => [...prev, item]);
  };

  const handleEditMilestone = (updated: Milestone) => {
    setMilestones((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
  };

  const handleDeleteMilestone = (id: string) => {
    setMilestones((prev) => prev.filter((m) => m.id !== id));
  };

  // Memory actions
  const handleAddMemory = (newMemory: Omit<MemoryItem, 'id' | 'likes'>) => {
    const item: MemoryItem = {
      ...newMemory,
      id: `mem-${Date.now()}`,
      likes: 1,
    };
    setMemories((prev) => [item, ...prev]);
  };

  const handleEditMemory = (updated: MemoryItem) => {
    setMemories((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
  };

  const handleDeleteMemory = (id: string) => {
    setMemories((prev) => prev.filter((m) => m.id !== id));
  };

  const handleLikeMemory = (id: string) => {
    setMemories((prev) =>
      prev.map((m) => (m.id === id ? { ...m, likes: m.likes + 1 } : m))
    );
  };

  // Letter actions
  const handleAddLetter = (newLetter: Omit<LetterItem, 'id'>) => {
    const item: LetterItem = {
      ...newLetter,
      id: `letter-${Date.now()}`,
      isCustom: true,
    };
    setLetters((prev) => [...prev, item]);
  };

  const handleEditLetter = (updated: LetterItem) => {
    setLetters((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
  };

  const handleDeleteLetter = (id: string) => {
    setLetters((prev) => prev.filter((l) => l.id !== id));
  };

  const handleEditMainLetter = (title: string, content: string) => {
    setSettings((prev) => ({
      ...prev,
      mainLetterTitle: title,
      mainLetterContent: content,
    }));
  };

  // Wish actions
  const handleAddWish = (newWish: Omit<StickyWish, 'id' | 'timestamp'>) => {
    const item: StickyWish = {
      ...newWish,
      id: `w-${Date.now()}`,
      timestamp: 'Just now',
    };
    setWishes((prev) => [item, ...prev]);
  };

  const handleEditWish = (updated: StickyWish) => {
    setWishes((prev) => prev.map((w) => (w.id === updated.id ? updated : w)));
  };

  const handleDeleteWish = (id: string) => {
    setWishes((prev) => prev.filter((w) => w.id !== id));
  };

  const handleOpenPhotoLightbox = (imgUrl: string, title: string) => {
    setSelectedMemory({
      id: 'hero-portrait',
      title,
      date: 'Cherished Forever',
      category: 'milestones',
      tag: 'Heart of Keepsake',
      caption: settings.mainQuote,
      imageUrl: imgUrl,
      likes: 520,
      author: settings.recipientName,
      authorInitial: '❤',
    });
  };

  const isAquatic = theme === 'aquatic';

  return (
    <div
      className={`relative min-h-screen transition-colors duration-700 font-sans antialiased overflow-x-hidden ${
        isAquatic
          ? 'bg-gradient-to-b from-[#f0f8ff] via-[#e6f4f8] to-[#edf7fa] text-[#03045e] selection:bg-[#caf0f8] selection:text-[#0077b6]'
          : 'bg-gradient-to-b from-[#fff5f8] via-[#ffeaf1] to-[#fff0f6] text-[#4a1525] selection:bg-[#fbcfe8] selection:text-[#831843]'
      }`}
    >
      {/* 1. Only showers when button is pushed: Petal/Bubble Canvas */}
      <PetalCanvas
        ref={petalCanvasRef}
        theme={theme}
        onPetalAdded={(count) => {
          setSettings((prev) => ({
            ...prev,
            petalsGiven: prev.petalsGiven + count,
          }));
        }}
      />

      {/* 2. Background continuous animations based on selected theme */}
      {isAquatic ? (
        <>
          {/* Animated cute cartoon seals, otters, sharks, beluga whales, and normal whales! */}
          <AquaticBackground />
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[650px] h-[650px] bg-[#90e0ef]/20 blur-[140px] rounded-full pointer-events-none -z-10" />
          <div className="absolute top-[800px] -left-40 w-[500px] h-[500px] bg-[#caf0f8]/30 blur-[130px] rounded-full pointer-events-none -z-10" />
          <div className="absolute top-[1800px] -right-40 w-[600px] h-[600px] bg-[#48cae4]/15 blur-[150px] rounded-full pointer-events-none -z-10" />
        </>
      ) : (
        <>
          {/* Sweet Romantic continuous motion: flying love doves with roses, winged love letters, chibi cupid, heart hot air balloon, swans, and floating hearts! */}
          <RomanticBackground />
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[650px] h-[650px] bg-[#fbcfe8]/45 blur-[140px] rounded-full pointer-events-none -z-10" />
          <div className="absolute top-[800px] -left-40 w-[500px] h-[500px] bg-[#f472b6]/25 blur-[130px] rounded-full pointer-events-none -z-10" />
          <div className="absolute top-[1800px] -right-40 w-[600px] h-[600px] bg-[#fda4af]/35 blur-[150px] rounded-full pointer-events-none -z-10" />
        </>
      )}

      {/* Floating Single Shower Action Button (No count badge anywhere as requested) */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center">
        <button
          aria-label={isAquatic ? 'Trigger Bubble Shower' : 'Trigger Petal Shower'}
          onClick={() => handleShowerPetals(40)}
          className={`relative group p-4 text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center cursor-pointer border ${
            isAquatic
              ? 'bg-[#0077b6] hover:bg-[#023e8a] border-[#caf0f8] shadow-[0_8px_24px_rgba(0,119,182,0.4)]'
              : 'bg-gradient-to-tr from-[#ec4899] to-[#f43f5e] hover:from-[#db2777] hover:to-[#e11d48] border-[#fce7f3] shadow-[0_8px_24px_rgba(236,72,153,0.4)]'
          }`}
          type="button"
          title={isAquatic ? 'Shower sea bubbles & pearls' : 'Shower flower petals'}
        >
          <span className="material-symbols-outlined text-[26px] text-[#ffe088] transition-transform group-hover:rotate-45">
            {isAquatic ? 'bubble_chart' : 'local_florist'}
          </span>
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isAquatic ? 'bg-[#90e0ef]' : 'bg-[#ffe088]'
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-3 w-3 ${
                isAquatic ? 'bg-[#48cae4]' : 'bg-[#fed65b]'
              }`}
            />
          </span>
        </button>
      </div>

      {/* Header with Theme Slider Switch */}
      <Header
        theme={theme}
        onToggleTheme={handleToggleTheme}
        isMusicPlaying={isMusicPlaying}
        onToggleMusic={handleToggleMusic}
        recipientName={settings.recipientName}
        subtitle={settings.subtitle}
      />

      {/* Main Content */}
      <main className="w-full pt-20 min-h-[calc(100vh-160px)] relative z-10">
        {/* Hero Section with Live 24hr Day Counter Icon */}
        <HeroSection
          settings={settings}
          theme={theme}
          onAddMemoryClick={() => handleNavigate('wish-wall')}
          onOpenPhotoLightbox={handleOpenPhotoLightbox}
        />

        {/* Timeline Section with Edit & Delete */}
        <TimelineSection
          milestones={milestones}
          theme={theme}
          onAddMilestone={handleAddMilestone}
          onEditMilestone={handleEditMilestone}
          onDeleteMilestone={handleDeleteMilestone}
          onShowerFlowers={() => handleShowerPetals(40)}
        />

        {/* Gallery Section with Edit & Delete */}
        <GallerySection
          memories={memories}
          theme={theme}
          onAddMemory={handleAddMemory}
          onEditMemory={handleEditMemory}
          onDeleteMemory={handleDeleteMemory}
          onLikeMemory={handleLikeMemory}
          onOpenLightbox={(memory) => setSelectedMemory(memory)}
          onShowerFlowers={() => handleShowerPetals(30)}
        />

        {/* Letters & Envelopes Section with Edit & Delete */}
        <LettersSection
          letters={letters}
          theme={theme}
          mainLetterTitle={settings.mainLetterTitle}
          mainLetterContent={settings.mainLetterContent}
          onOpenLetter={(letter) => setSelectedLetter(letter)}
          onAddLetter={handleAddLetter}
          onEditLetter={handleEditLetter}
          onDeleteLetter={handleDeleteLetter}
          onEditMainLetter={handleEditMainLetter}
          onOpenCertificate={() => setIsCertificateOpen(true)}
          onShowerFlowers={() => handleShowerPetals(30)}
          isMusicPlaying={isMusicPlaying}
          onToggleMusic={handleToggleMusic}
        />

        {/* Pinboard Wish Wall with Edit & Delete */}
        <PinboardSection
          wishes={wishes}
          theme={theme}
          onAddWish={handleAddWish}
          onEditWish={handleEditWish}
          onDeleteWish={handleDeleteWish}
          onShowerFlowers={() => handleShowerPetals(40)}
        />

        {/* Celebration Banner */}
        <CelebrationBanner
          theme={theme}
        />
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        recipientName={settings.recipientName}
      />

      {/* Modals */}
      <OpenWhenModal
        letter={selectedLetter}
        onClose={() => setSelectedLetter(null)}
        onShowerFlowers={() => handleShowerPetals(35)}
      />

      <CertificateModal
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
        recipientName={settings.recipientName}
        onShowerFlowers={() => handleShowerPetals(50)}
      />

      <MemoryModal
        memory={selectedMemory}
        onClose={() => setSelectedMemory(null)}
        onLike={handleLikeMemory}
        onShowerFlowers={() => handleShowerPetals(25)}
      />
    </div>
  );
}
