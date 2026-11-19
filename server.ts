import express, { type Request, type Response, type NextFunction } from 'express';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const PORT = 3000;
const DATA_DIR = path.join(process.cwd(), 'data');
const UPLOAD_DIR = path.join(DATA_DIR, 'uploads');
const DB_FILE = path.join(DATA_DIR, 'sanctuary-db.json');
const SECRET_FILE = path.join(DATA_DIR, 'session.key');
const SPACE_ID = 'srishti-manav-sanctuary';

fs.mkdirSync(DATA_DIR, { recursive: true });
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// Stable server-side HMAC secret (never exposed to client)
function getSessionSecret(): string {
  if (process.env.SESSION_SECRET && process.env.SESSION_SECRET.length >= 32) {
    return process.env.SESSION_SECRET;
  }
  if (fs.existsSync(SECRET_FILE)) {
    return fs.readFileSync(SECRET_FILE, 'utf8').trim();
  }
  const generated = crypto.randomBytes(48).toString('hex');
  fs.writeFileSync(SECRET_FILE, generated, { mode: 0o600 });
  return generated;
}

const SESSION_SECRET = getSessionSecret();

function hashPassword(password: string, existingSalt?: string): { hash: string; salt: string } {
  const salt = existingSalt || crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(password, salt, 64).toString('hex');
  return { hash: derived, salt };
}

function verifyPassword(password: string, hash: string, salt: string): boolean {
  const derived = crypto.scryptSync(password, salt, 64);
  const stored = Buffer.from(hash, 'hex');
  if (derived.length !== stored.length) return false;
  return crypto.timingSafeEqual(derived, stored);
}

function signToken(payload: { uid: string; email: string; exp: number }): string {
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', SESSION_SECRET).update(data).digest('base64url');
  return `${data}.${sig}`;
}

function verifyToken(token: string): { uid: string; email: string; exp: number } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    const [data, sig] = parts;
    const expectedSig = crypto.createHmac('sha256', SESSION_SECRET).update(data).digest('base64url');
    const sigBuf = Buffer.from(sig);
    const expBuf = Buffer.from(expectedSig);
    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
      return null;
    }
    const decoded = JSON.parse(Buffer.from(data, 'base64url').toString('utf8'));
    if (!decoded.uid || !decoded.exp || Date.now() > decoded.exp) {
      return null;
    }
    return decoded;
  } catch {
    return null;
  }
}

interface StoredUser {
  id: string;
  email: string;
  passwordHash: string;
  passwordSalt: string;
  inviteCode: string;
  displayName: string;
  nickname: string;
  bio: string;
  avatarUrl: string;
  birthday: string;
  preferredTheme: 'romantic' | 'aquatic';
  soundEnabled: boolean;
  defaultVisibility: 'shared' | 'private';
  active: boolean;
}

interface SanctuaryDatabase {
  users: StoredUser[];
  settings: {
    recipientName: string;
    subtitle: string;
    startDate: string;
    petalsGiven: number;
    mainQuote: string;
    heroMessage: string;
    heroImageUrl: string;
    heroPhotoLabel: string;
    heroPhotoSub: string;
    mainLetterTitle: string;
    mainLetterContent: string;
  };
  milestones: any[];
  memories: any[];
  letters: any[];
  journal: any[];
  bucketList: any[];
  specialDates: any[];
  littleThings: any[];
  wishes: any[];
}

function createInitialDatabase(): SanctuaryDatabase {
  const manavPass = hashPassword('manav2025');
  const srishtiPass = hashPassword('srishti2025');

  return {
    users: [
      {
        id: 'user-manav',
        email: 'manav@srishtimanav.love',
        passwordHash: manavPass.hash,
        passwordSalt: manavPass.salt,
        inviteCode: 'SM-2025-MANAV',
        displayName: 'Manav',
        nickname: 'Manav',
        bio: 'Keeping every sunrise, late-night call, and memory safe for us.',
        avatarUrl: '',
        birthday: '2004-08-14',
        preferredTheme: 'romantic',
        soundEnabled: false,
        defaultVisibility: 'shared',
        active: true,
      },
      {
        id: 'user-srishti',
        email: 'srishti@srishtimanav.love',
        passwordHash: srishtiPass.hash,
        passwordSalt: srishtiPass.salt,
        inviteCode: 'SM-2025-SHISHI',
        displayName: 'Srishti',
        nickname: 'Shishi (Kuchu Puchuu)',
        bio: 'Turning ordinary moments into warmth, laughter, and magic.',
        avatarUrl: '',
        birthday: '2005-03-22',
        preferredTheme: 'romantic',
        soundEnabled: false,
        defaultVisibility: 'shared',
        active: true,
      },
    ],
    settings: {
      recipientName: 'Srishti and Manav',
      subtitle: 'Shishi- My kuchu puchuu',
      startDate: '2025-12-01',
      petalsGiven: 1420,
      mainQuote: 'From a long-distance spark to right here in my arms',
      heroMessage: 'Every mile between us only taught our hearts how to reach closer.',
      heroImageUrl: '/api/seed-asset/hero',
      heroPhotoLabel: 'Srishti & Manav',
      heroPhotoSub: 'Forever & Always',
      mainLetterTitle: 'A Letter For When You Need a Smile',
      mainLetterContent:
        `My dearest Shishi,\n\nIf you are reading this on an ordinary afternoon or an evening when the day feels slightly heavy, take a slow breath and remember how deeply you are loved.\n\nFrom our very first long-distance spark to finally holding your hand without a screen between us, you have turned quiet moments into my favorite memories. Thank you for laughing at my worst puns, for trusting me with your silence, and for making every day bloom.\n\nNo matter where life takes us, this little corner of the world belongs strictly to us.`,
    },
    milestones: [
      {
        id: 'm-1',
        chapter: 'Chapter I',
        date: '2025-09-12',
        displayDate: 'September 12, 2025',
        title: 'The Long-Distance Spark',
        description:
          'What started as a simple late-night conversation turned into hours of forgetting to check the clock. Neither of us wanted to say goodnight first.',
        location: 'Across Two Cities',
        photoUrl: '/api/seed-asset/spark',
        icon: 'local_cafe',
        authorId: 'user-manav',
        authorName: 'Manav',
      },
      {
        id: 'm-2',
        chapter: 'Chapter II',
        date: '2025-12-01',
        displayDate: 'December 1, 2025',
        title: 'Day One of Forever',
        description:
          'The day we officially chose "us" — marking our anniversary and promising that distance was only a temporary chapter.',
        location: 'Our Official Beginning',
        photoUrl: '/api/seed-asset/hero',
        icon: 'favorite',
        authorId: 'user-srishti',
        authorName: 'Srishti',
      },
      {
        id: 'm-3',
        chapter: 'Chapter III',
        date: '2026-02-14',
        displayDate: 'February 14, 2026',
        title: 'Right Here In My Arms',
        description:
          'Counting down the seconds until we finally met in person — the hug that made every mile and every waiting night completely worth it.',
        location: 'Together At Last',
        photoUrl: '/api/seed-asset/coastal',
        icon: 'flight',
        authorId: 'user-manav',
        authorName: 'Manav',
      },
      {
        id: 'm-4',
        chapter: 'Chapter IV',
        date: '2026-06-20',
        displayDate: 'June 20, 2026',
        title: 'Twilight Lanterns & Promises',
        description:
          'A quiet evening blanket under pastel skies, Polaroid snapshots, and planning every adventure still waiting on our bucket list.',
        location: 'Hilltop Overlook',
        photoUrl: '/api/seed-asset/picnic',
        icon: 'celebration',
        authorId: 'user-srishti',
        authorName: 'Srishti',
      },
    ],
    memories: [
      {
        id: 'mem-1',
        title: 'Warm Coffee & Fairy Lights',
        date: '2025-12-01',
        location: 'Corner Rose Cafe',
        category: 'Firsts',
        caption: 'Two ceramic cups, endless laughter, and the exact moment time slowed down.',
        imageUrl: '/api/seed-asset/spark',
        likes: 24,
        authorId: 'user-manav',
        authorName: 'Manav',
        authorInitial: 'M',
        notes: [
          {
            id: 'note-1',
            authorId: 'user-srishti',
            authorName: 'Srishti',
            text: 'Still my favorite evening ever.',
            createdAt: '2025-12-02',
          },
        ],
      },
      {
        id: 'mem-2',
        title: 'Pastel Lavender Shoreline',
        date: '2026-02-15',
        location: 'Quiet Coastline',
        category: 'Adventures',
        caption: 'Walking barefoot along the water while the sky turned soft rose and lavender.',
        imageUrl: '/api/seed-asset/coastal',
        likes: 31,
        authorId: 'user-srishti',
        authorName: 'Srishti',
        authorInitial: 'S',
        notes: [],
      },
      {
        id: 'mem-3',
        title: 'Twilight Picnic & Peonies',
        date: '2026-05-09',
        location: 'Meadow Ridge',
        category: 'Special Days',
        caption: 'A warm lantern, fresh blush peonies, and a stack of polaroids we will keep forever.',
        imageUrl: '/api/seed-asset/picnic',
        likes: 19,
        authorId: 'user-manav',
        authorName: 'Manav',
        authorInitial: 'M',
        notes: [],
      },
      {
        id: 'mem-4',
        title: 'Rainy Morning Slow Brew',
        date: '2026-08-19',
        location: 'Window Nook',
        category: 'Random Moments',
        caption: 'Listening to raindrops on the glass with two warm mugs and nowhere to rush.',
        imageUrl: '/api/seed-asset/rainy',
        likes: 27,
        authorId: 'user-srishti',
        authorName: 'Srishti',
        authorInitial: 'S',
        notes: [],
      },
      {
        id: 'mem-5',
        title: 'Beneath The Sakura Canopy',
        date: '2026-04-04',
        location: 'Blossom Trail',
        category: 'Favorite Photos',
        caption: 'Holding hands under drifting pink blossoms — my favorite keepsake portrait of us.',
        imageUrl: '/api/seed-asset/hero',
        likes: 42,
        authorId: 'user-manav',
        authorName: 'Manav',
        authorInitial: 'M',
        notes: [],
      },
    ],
    letters: [
      {
        id: 'letter-1',
        title: 'When You Miss Me On Quiet Nights',
        condition: 'Open When: You miss our late-night talks',
        preview: 'Close your eyes for five seconds and remember how close we really are...',
        content:
          `My sweet Shishi,\n\nWhenever the night feels quiet and you wish I were sitting right next to you, put on our favorite playlist and read these words slowly.\n\nEvery single memory we have built — from sleepy voice notes to long walks hand in hand — lives right here. You are my calmest place to land.\n\nText me anytime, day or night. I am always yours.\n\nLove always,\nManav`,
        date: '2025-12-14',
        unlockDate: '',
        status: 'sent',
        visibility: 'shared',
        authorId: 'user-manav',
        authorName: 'Manav',
      },
      {
        id: 'letter-2',
        title: 'For Our First Anniversary',
        condition: 'Open When: It is December 1st, 2026',
        preview: 'One whole year of choosing each other across every day and every mile...',
        content:
          `Happy First Anniversary, my kuchu puchuu!\n\nA whole year since December 1st, 2025 — and somehow you still make my heart skip the same way you did on day one. Thank you for being my partner, my comfort, and my brightest adventure.\n\nHere is to decades more of little memories together.\n\nForever yours,\nManav`,
        date: '2026-10-15',
        unlockDate: '2026-12-01',
        status: 'sent',
        visibility: 'shared',
        authorId: 'user-manav',
        authorName: 'Manav',
      },
      {
        id: 'letter-3',
        title: 'Why I Adore Your Laugh',
        condition: 'Open When: You need a reminder of how loved you are',
        preview: 'You light up every room without even trying...',
        content:
          `Hey Manav,\n\nI just wanted to leave a quiet note here for a rainy day: thank you for always listening patiently, for making me laugh until my cheeks hurt, and for building this little world with me.\n\nAlways your Shishi ❤️`,
        date: '2026-03-10',
        unlockDate: '',
        status: 'sent',
        visibility: 'shared',
        authorId: 'user-srishti',
        authorName: 'Srishti',
      },
    ],
    journal: [
      {
        id: 'j-1',
        date: '2026-11-10',
        title: 'Sunday Evening Tea & Future Plans',
        content:
          'We spent an hour sketching out places we want to visit next year and laughing over how seriously we take dessert menus. Even ordinary Sundays feel like a celebration with you.',
        mood: 'Grateful',
        photoUrl: '/api/seed-asset/spark',
        visibility: 'shared',
        authorId: 'user-manav',
        authorName: 'Manav',
        updatedAt: '2026-11-10T19:30:00.000Z',
      },
      {
        id: 'j-2',
        date: '2026-11-14',
        title: 'Counting Down To December 1st',
        content:
          'Looking through our photos from the past few months reminded me how far we have come since that very first call. Cannot wait to celebrate our one-year anniversary together.',
        mood: 'In Love',
        photoUrl: '',
        visibility: 'shared',
        authorId: 'user-srishti',
        authorName: 'Srishti',
        updatedAt: '2026-11-14T21:15:00.000Z',
      },
    ],
    bucketList: [
      {
        id: 'b-1',
        title: 'Watch the sunrise by a quiet beach',
        description: 'Wake up early with thermoses of hot coffee and watch the sky turn pink.',
        category: 'Travel',
        targetDate: '2026-12-20',
        completed: true,
        completedAt: '2026-02-15',
        completionPhotoUrl: '/api/seed-asset/coastal',
        authorId: 'user-manav',
        authorName: 'Manav',
      },
      {
        id: 'b-2',
        title: 'Stargazing picnic with fairy lights',
        description: 'Bring a cozy blanket, polaroid camera, and our favorite snacks.',
        category: 'Cozy',
        targetDate: '2026-06-30',
        completed: true,
        completedAt: '2026-05-09',
        completionPhotoUrl: '/api/seed-asset/picnic',
        authorId: 'user-srishti',
        authorName: 'Srishti',
      },
      {
        id: 'b-3',
        title: 'Take a spontaneous weekend train trip',
        description: 'Pick a cozy hill town, stay at a boutique inn, and explore on foot.',
        category: 'Adventure',
        targetDate: '2027-02-14',
        completed: false,
        authorId: 'user-manav',
        authorName: 'Manav',
      },
      {
        id: 'b-4',
        title: 'Cook a full 3-course dinner together',
        description: 'Homemade pasta, garlic bread, and molten chocolate cake with music playing.',
        category: 'Food',
        targetDate: '2026-12-01',
        completed: false,
        authorId: 'user-srishti',
        authorName: 'Srishti',
      },
    ],
    specialDates: [
      {
        id: 'sd-1',
        title: 'Our Anniversary ❤️',
        date: '2025-12-01',
        type: 'Anniversary',
        description: 'The day Srishti and Manav officially became forever.',
        recurringYearly: true,
        reminderDays: 7,
        authorId: 'user-manav',
        authorName: 'Manav',
      },
      {
        id: 'sd-2',
        title: 'First Long-Distance Spark',
        date: '2025-09-12',
        type: 'First Meeting',
        description: 'The night a simple message turned into hours of magic.',
        recurringYearly: true,
        reminderDays: 1,
        authorId: 'user-srishti',
        authorName: 'Srishti',
      },
      {
        id: 'sd-3',
        title: "Srishti's Birthday 🌸",
        date: '2005-03-22',
        type: 'Birthday',
        description: 'Celebrating my kuchu puchuu with flowers, cake, and surprises.',
        recurringYearly: true,
        reminderDays: 7,
        authorId: 'user-manav',
        authorName: 'Manav',
      },
      {
        id: 'sd-4',
        title: "Manav's Birthday ✨",
        date: '2004-08-14',
        type: 'Birthday',
        description: 'Making Manav feel like the luckiest person alive.',
        recurringYearly: true,
        reminderDays: 7,
        authorId: 'user-srishti',
        authorName: 'Srishti',
      },
    ],
    littleThings: [
      {
        id: 'lt-1',
        category: 'Songs',
        title: 'Late-Night Acoustic Playlist',
        note: 'The songs we always queue during sleepy midnight calls.',
        authorId: 'user-manav',
        authorName: 'Manav',
      },
      {
        id: 'lt-2',
        category: 'Food',
        title: 'Warm Iced Lattes & Momos',
        note: 'Our non-negotiable comfort order on every date.',
        authorId: 'user-srishti',
        authorName: 'Srishti',
      },
      {
        id: 'lt-3',
        category: 'Places',
        title: 'Quiet Ocean Boardwalks at Sunset',
        note: 'Where the sky turns soft pink and lavender.',
        authorId: 'user-manav',
        authorName: 'Manav',
      },
      {
        id: 'lt-4',
        category: 'Activities',
        title: 'Polaroid Walks & Bookstore Dates',
        note: 'Picking out books for each other and writing notes inside the cover.',
        authorId: 'user-srishti',
        authorName: 'Srishti',
      },
      {
        id: 'lt-5',
        category: 'Shared Interests',
        title: 'Stargazing & Cozy Movie Marathons',
        note: 'Wrapped in one blanket arguing gently over which movie comes next.',
        authorId: 'user-manav',
        authorName: 'Manav',
      },
    ],
    wishes: [
      {
        id: 'w-1',
        name: 'Manav',
        note: 'To a lifetime of waking up grateful for your smile, Shishi.',
        stamp: '💖',
        tag: '#foreverUs',
        timestamp: 'Pinned with love',
        colorTheme: 'rose',
        authorId: 'user-manav',
      },
      {
        id: 'w-2',
        name: 'Srishti',
        note: 'From miles apart to right in your arms — best journey of my life.',
        stamp: '🌸',
        tag: '#kuchuPuchuu',
        timestamp: 'Pinned with love',
        colorTheme: 'ivory',
        authorId: 'user-srishti',
      },
    ],
  };
}

function loadDatabase(): SanctuaryDatabase {
  if (!fs.existsSync(DB_FILE)) {
    const initial = createInitialDatabase();
    saveDatabase(initial);
    return initial;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(raw) as SanctuaryDatabase;
  } catch {
    const fallback = createInitialDatabase();
    saveDatabase(fallback);
    return fallback;
  }
}

function saveDatabase(db: SanctuaryDatabase) {
  const tempFile = `${DB_FILE}.tmp`;
  fs.writeFileSync(tempFile, JSON.stringify(db, null, 2), 'utf8');
  fs.renameSync(tempFile, DB_FILE);
}

let db: SanctuaryDatabase = loadDatabase();

function parseCookies(cookieHeader?: string): Record<string, string> {
  const result: Record<string, string> = {};
  if (!cookieHeader) return result;
  cookieHeader.split(';').forEach((part) => {
    const [k, ...v] = part.trim().split('=');
    if (k) result[k] = decodeURIComponent(v.join('='));
  });
  return result;
}

interface AuthedRequest extends Request {
  user?: StoredUser;
}

function getRequestUser(req: Request): StoredUser | null {
  const authHeader = req.headers.authorization;
  let token: string | undefined;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.slice(7).trim();
  } else {
    const cookies = parseCookies(req.headers.cookie);
    token = cookies['sm_session'];
  }
  if (!token) return null;
  const payload = verifyToken(token);
  if (!payload) return null;
  const user = db.users.find((u) => u.id === payload.uid && u.active);
  return user || null;
}

function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const user = getRequestUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Authentication required to enter the private sanctuary.' });
  }
  req.user = user;
  next();
}

function toPublicUserProfile(u: StoredUser) {
  return {
    id: u.id,
    email: u.email,
    displayName: u.displayName,
    nickname: u.nickname,
    bio: u.bio,
    avatarUrl: u.avatarUrl,
    birthday: u.birthday,
    preferredTheme: u.preferredTheme,
    soundEnabled: u.soundEnabled,
    defaultVisibility: u.defaultVisibility,
  };
}

function getTodayIso(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function filterSanctuaryForUser(userId: string) {
  const today = getTodayIso();

  // Strictly enforce letter privacy & scheduled unlock dates on the server
  const visibleLetters = db.letters
    .filter((l) => {
      if (l.authorId === userId) return true;
      if (l.visibility === 'private') return false;
      if (l.status === 'draft') return false;
      return true;
    })
    .map((l) => {
      const isScheduledLocked =
        l.authorId !== userId && Boolean(l.unlockDate) && l.unlockDate > today;
      if (isScheduledLocked) {
        return {
          ...l,
          content: '',
          preview: `Sealed until ${l.unlockDate}. Come back on that special day to unseal.`,
          isLocked: true,
        };
      }
      return { ...l, isLocked: false };
    });

  // Strictly enforce journal privacy on the server
  const visibleJournal = db.journal.filter(
    (entry) => entry.authorId === userId || entry.visibility === 'shared'
  );

  const partners = db.users
    .filter((u) => u.active)
    .map((u) => ({
      id: u.id,
      displayName: u.displayName,
      nickname: u.nickname,
      avatarUrl: u.avatarUrl,
      bio: u.bio,
    }));

  return {
    settings: db.settings,
    milestones: [...db.milestones].sort((a, b) => a.date.localeCompare(b.date)),
    memories: db.memories,
    letters: visibleLetters,
    journal: [...visibleJournal].sort((a, b) => b.date.localeCompare(a.date)),
    bucketList: db.bucketList,
    specialDates: db.specialDates,
    littleThings: db.littleThings,
    wishes: db.wishes,
    partners,
    backendStatus: {
      provider: 'local-express' as const,
      supabaseConfigured: Boolean(process.env.VITE_SUPABASE_URL && process.env.VITE_SUPABASE_ANON_KEY),
      message:
        'Secured by Express Sanctuary Server (scrypt password hashing, HMAC session tokens, server-enforced privacy & private media endpoints). Supabase SQL schema is ready in supabase/schema.sql.',
    },
  };
}

const SEED_ASSET_MAP: Record<string, string> = {
  hero: 'hero_keepsake_portrait_1794854280491.jpg',
  spark: 'memory_first_spark_1794854280008.jpg',
  coastal: 'memory_coastal_dusk_1794854279401.jpg',
  picnic: 'memory_starry_picnic_1794854280595.jpg',
  rainy: 'memory_rainy_morning_1794854281337.jpg',
};

const MIME_SIGNATURES: Record<string, { ext: string; check: (buf: Buffer) => boolean }> = {
  'image/jpeg': {
    ext: 'jpg',
    check: (buf) => buf.length > 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff,
  },
  'image/png': {
    ext: 'png',
    check: (buf) =>
      buf.length > 8 &&
      buf[0] === 0x89 &&
      buf[1] === 0x50 &&
      buf[2] === 0x4e &&
      buf[3] === 0x47,
  },
  'image/webp': {
    ext: 'webp',
    check: (buf) =>
      buf.length > 12 &&
      buf.subarray(0, 4).toString('ascii') === 'RIFF' &&
      buf.subarray(8, 12).toString('ascii') === 'WEBP',
  },
  'image/gif': {
    ext: 'gif',
    check: (buf) => buf.length > 6 && buf.subarray(0, 3).toString('ascii') === 'GIF',
  },
};

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));

  // Public seed artwork (safe cover imagery only; never user-uploaded private photos)
  app.get('/api/seed-asset/:key', (req, res) => {
    const filename = SEED_ASSET_MAP[req.params.key];
    if (!filename) return res.status(404).json({ error: 'Asset not found' });
    const filePath = path.join(process.cwd(), 'src', 'assets', 'images', filename);
    if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'File missing' });
    res.sendFile(filePath);
  });

  // Public Hero Metadata ONLY (no private user content or emails exposed)
  app.get('/api/public/hero', (_req, res) => {
    res.json({
      recipientName: db.settings.recipientName,
      subtitle: db.settings.subtitle,
      startDate: db.settings.startDate,
      mainQuote: db.settings.mainQuote,
      heroMessage: db.settings.heroMessage,
      heroImageUrl: db.settings.heroImageUrl,
      heroPhotoLabel: db.settings.heroPhotoLabel,
      heroPhotoSub: db.settings.heroPhotoSub,
    });
  });

  // Block public registration explicitly
  app.post('/api/auth/register', (req, res) => {
    const { email, inviteCode, password, displayName } = req.body || {};
    if (!inviteCode || !email || !password) {
      return res.status(403).json({
        error:
          'Public registration is disabled. Only invited members (Srishti & Manav) with an invitation code can access this private space.',
      });
    }
    const normalizedEmail = String(email).trim().toLowerCase();
    const invitedUser = db.users.find(
      (u) => u.email.toLowerCase() === normalizedEmail && u.inviteCode === String(inviteCode).trim()
    );
    if (!invitedUser) {
      return res.status(403).json({
        error: 'Invalid invitation code or non-invited email. Public signups are not permitted.',
      });
    }
    if (String(password).length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }
    const { hash, salt } = hashPassword(String(password));
    invitedUser.passwordHash = hash;
    invitedUser.passwordSalt = salt;
    invitedUser.active = true;
    if (displayName && String(displayName).trim()) {
      invitedUser.displayName = String(displayName).trim();
    }
    saveDatabase(db);

    const token = signToken({
      uid: invitedUser.id,
      email: invitedUser.email,
      exp: Date.now() + 1000 * 60 * 60 * 24 * 14,
    });
    res.cookie('sm_session', token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 14,
      path: '/',
    });
    return res.json({ token, user: toPublicUserProfile(invitedUser) });
  });

  // Login for invited members
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'Please enter both email and passphrase.' });
    }
    const normalized = String(email).trim().toLowerCase();
    const user = db.users.find((u) => u.email.toLowerCase() === normalized && u.active);
    if (!user || !verifyPassword(String(password), user.passwordHash, user.passwordSalt)) {
      return res.status(401).json({ error: 'Incorrect email or passphrase.' });
    }
    const token = signToken({
      uid: user.id,
      email: user.email,
      exp: Date.now() + 1000 * 60 * 60 * 24 * 14,
    });
    res.cookie('sm_session', token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 14,
      path: '/',
    });
    res.json({ token, user: toPublicUserProfile(user) });
  });

  app.post('/api/auth/logout', (_req, res) => {
    res.clearCookie('sm_session', { path: '/' });
    res.json({ ok: true });
  });

  // Password Reset using Invited Member Email + Sanctuary Invite Code
  app.post('/api/auth/reset-password', (req, res) => {
    const { email, inviteCode, newPassword } = req.body || {};
    if (!email || !inviteCode || !newPassword) {
      return res
        .status(400)
        .json({ error: 'Email, partner invite code, and new passphrase are required.' });
    }
    if (String(newPassword).length < 6) {
      return res.status(400).json({ error: 'New passphrase must be at least 6 characters.' });
    }
    const normalized = String(email).trim().toLowerCase();
    const user = db.users.find(
      (u) => u.email.toLowerCase() === normalized && u.inviteCode === String(inviteCode).trim()
    );
    if (!user) {
      return res.status(403).json({
        error: 'Email and invite code do not match an invited sanctuary member.',
      });
    }
    const { hash, salt } = hashPassword(String(newPassword));
    user.passwordHash = hash;
    user.passwordSalt = salt;
    user.active = true;
    saveDatabase(db);
    res.json({ ok: true, message: 'Passphrase updated successfully. You may now sign in.' });
  });

  // Authenticated User Profile
  app.get('/api/auth/me', requireAuth, (req: AuthedRequest, res) => {
    res.json({ user: toPublicUserProfile(req.user!) });
  });

  app.patch('/api/auth/profile', requireAuth, (req: AuthedRequest, res) => {
    const user = req.user!;
    const {
      displayName,
      nickname,
      bio,
      avatarUrl,
      birthday,
      preferredTheme,
      soundEnabled,
      defaultVisibility,
    } = req.body || {};

    if (typeof displayName === 'string' && displayName.trim()) {
      user.displayName = displayName.trim().slice(0, 60);
    }
    if (typeof nickname === 'string') user.nickname = nickname.trim().slice(0, 60);
    if (typeof bio === 'string') user.bio = bio.trim().slice(0, 280);
    if (typeof avatarUrl === 'string') user.avatarUrl = avatarUrl.trim();
    if (typeof birthday === 'string') user.birthday = birthday.trim();
    if (preferredTheme === 'romantic' || preferredTheme === 'aquatic') {
      user.preferredTheme = preferredTheme;
    }
    if (typeof soundEnabled === 'boolean') user.soundEnabled = soundEnabled;
    if (defaultVisibility === 'shared' || defaultVisibility === 'private') {
      user.defaultVisibility = defaultVisibility;
    }

    saveDatabase(db);
    res.json({ user: toPublicUserProfile(user) });
  });

  app.post('/api/auth/change-password', requireAuth, (req: AuthedRequest, res) => {
    const user = req.user!;
    const { currentPassword, newPassword } = req.body || {};
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new passphrases are required.' });
    }
    if (!verifyPassword(String(currentPassword), user.passwordHash, user.passwordSalt)) {
      return res.status(403).json({ error: 'Current passphrase is incorrect.' });
    }
    if (String(newPassword).length < 6) {
      return res.status(400).json({ error: 'New passphrase must be at least 6 characters.' });
    }
    const { hash, salt } = hashPassword(String(newPassword));
    user.passwordHash = hash;
    user.passwordSalt = salt;
    saveDatabase(db);
    res.json({ ok: true });
  });

  // Private Media Upload (Strict validation: MIME, magic bytes, <= 5MB)
  app.post('/api/media/upload', requireAuth, (req: AuthedRequest, res) => {
    const { dataUrl } = req.body || {};
    if (typeof dataUrl !== 'string') {
      return res.status(400).json({ error: 'Invalid upload payload.' });
    }
    const match = dataUrl.match(/^data:(image\/(?:jpeg|png|webp|gif));base64,([A-Za-z0-9+/=]+)$/);
    if (!match) {
      return res
        .status(400)
        .json({ error: 'Only JPEG, PNG, WEBP, or GIF images are permitted.' });
    }
    const mime = match[1];
    const base64Data = match[2];
    const buffer = Buffer.from(base64Data, 'base64');

    const MAX_BYTES = 5 * 1024 * 1024;
    if (buffer.length > MAX_BYTES) {
      return res.status(413).json({ error: 'Image exceeds the 5 MB size limit.' });
    }
    const sig = MIME_SIGNATURES[mime];
    if (!sig || !sig.check(buffer)) {
      return res.status(400).json({ error: 'Uploaded file failed image signature verification.' });
    }

    const filename = `${crypto.randomUUID()}.${sig.ext}`;
    const dest = path.join(UPLOAD_DIR, filename);
    fs.writeFileSync(dest, buffer);

    res.status(201).json({ url: `/api/media/${filename}` });
  });

  // Private Media Serving (Requires Authentication - never public URLs)
  app.get('/api/media/:filename', requireAuth, (req: AuthedRequest, res) => {
    const rawName = req.params.filename || '';
    if (!/^[a-zA-Z0-9-]+\.(jpg|png|webp|gif)$/.test(rawName)) {
      return res.status(400).json({ error: 'Invalid media identifier.' });
    }
    const safePath = path.join(UPLOAD_DIR, path.basename(rawName));
    if (!fs.existsSync(safePath)) {
      return res.status(404).json({ error: 'Media file not found.' });
    }
    res.setHeader('Cache-Control', 'private, max-age=86400');
    res.sendFile(safePath);
  });

  // Full Sanctuary Data (filtered per authenticated user)
  app.get('/api/sanctuary', requireAuth, (req: AuthedRequest, res) => {
    res.json(filterSanctuaryForUser(req.user!.id));
  });

  app.patch('/api/sanctuary/settings', requireAuth, (req: AuthedRequest, res) => {
    const allowed = [
      'heroMessage',
      'heroImageUrl',
      'heroPhotoLabel',
      'heroPhotoSub',
      'mainLetterTitle',
      'mainLetterContent',
      'petalsGiven',
    ] as const;

    for (const key of allowed) {
      if (req.body && req.body[key] !== undefined) {
        (db.settings as any)[key] = req.body[key];
      }
    }
    // Preserve core Srishti and Manav identity permanently
    db.settings.recipientName = 'Srishti and Manav';
    db.settings.subtitle = 'Shishi- My kuchu puchuu';
    db.settings.startDate = '2025-12-01';
    db.settings.mainQuote = 'From a long-distance spark to right here in my arms';

    saveDatabase(db);
    res.json({ settings: db.settings });
  });

  // Milestones CRUD
  app.post('/api/milestones', requireAuth, (req: AuthedRequest, res) => {
    const u = req.user!;
    const { chapter, date, displayDate, title, description, location, photoUrl, icon } = req.body || {};
    if (!title?.trim() || !description?.trim()) {
      return res.status(400).json({ error: 'Title and description are required.' });
    }
    const item = {
      id: `m-${Date.now()}`,
      chapter: String(chapter || `Chapter ${db.milestones.length + 1}`).trim(),
      date: String(date || getTodayIso()),
      displayDate: displayDate ? String(displayDate) : undefined,
      title: String(title).trim(),
      description: String(description).trim(),
      location: String(location || 'In Our Hearts').trim(),
      photoUrl: photoUrl ? String(photoUrl).trim() : '',
      icon: String(icon || 'favorite'),
      authorId: u.id,
      authorName: u.displayName,
    };
    db.milestones.push(item);
    saveDatabase(db);
    res.status(201).json(item);
  });

  app.patch('/api/milestones/:id', requireAuth, (req: AuthedRequest, res) => {
    const idx = db.milestones.findIndex((m) => m.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Milestone not found.' });
    const existing = db.milestones[idx];
    const body = req.body || {};
    const nextTitle = body.title !== undefined ? String(body.title).trim() : existing.title;
    const nextDesc =
      body.description !== undefined ? String(body.description).trim() : existing.description;
    if (!nextTitle || !nextDesc) {
      return res.status(400).json({ error: 'Title and description are required.' });
    }
    db.milestones[idx] = {
      ...existing,
      chapter: body.chapter !== undefined ? String(body.chapter).trim() || existing.chapter : existing.chapter,
      date: body.date !== undefined ? String(body.date).trim() || existing.date : existing.date,
      displayDate:
        body.displayDate !== undefined ? String(body.displayDate).trim() || undefined : existing.displayDate,
      title: nextTitle,
      description: nextDesc,
      location: body.location !== undefined ? String(body.location).trim() : existing.location,
      photoUrl: body.photoUrl !== undefined ? String(body.photoUrl).trim() : existing.photoUrl,
      icon: body.icon !== undefined ? String(body.icon).trim() || existing.icon : existing.icon,
      id: existing.id,
      authorId: existing.authorId,
      authorName: existing.authorName,
    };
    saveDatabase(db);
    res.json(db.milestones[idx]);
  });

  app.delete('/api/milestones/:id', requireAuth, (req: AuthedRequest, res) => {
    const idx = db.milestones.findIndex((m) => m.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Milestone not found.' });
    db.milestones.splice(idx, 1);
    saveDatabase(db);
    res.json({ ok: true });
  });

  // Memories CRUD
  app.post('/api/memories', requireAuth, (req: AuthedRequest, res) => {
    const u = req.user!;
    const { title, date, location, category, caption, imageUrl } = req.body || {};
    if (!title?.trim() || !imageUrl?.trim()) {
      return res.status(400).json({ error: 'Title and photo are required.' });
    }
    const item = {
      id: `mem-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      title: String(title).trim(),
      date: String(date || getTodayIso()),
      location: String(location || 'Our Little World').trim(),
      category: category || 'Random Moments',
      caption: String(caption || '').trim(),
      imageUrl: String(imageUrl).trim(),
      likes: 1,
      authorId: u.id,
      authorName: u.displayName,
      authorInitial: u.displayName.charAt(0).toUpperCase(),
      notes: [],
    };
    db.memories.unshift(item);
    saveDatabase(db);
    res.status(201).json(item);
  });

  app.patch('/api/memories/:id', requireAuth, (req: AuthedRequest, res) => {
    const idx = db.memories.findIndex((m) => m.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Memory not found.' });
    const existing = db.memories[idx];
    const body = req.body || {};
    const nextTitle = body.title !== undefined ? String(body.title).trim() : existing.title;
    if (!nextTitle) {
      return res.status(400).json({ error: 'Memory title is required.' });
    }
    const nextImageUrl =
      body.imageUrl !== undefined ? String(body.imageUrl).trim() || existing.imageUrl : existing.imageUrl;
    db.memories[idx] = {
      ...existing,
      title: nextTitle,
      date: body.date !== undefined ? String(body.date).trim() || existing.date : existing.date,
      location: body.location !== undefined ? String(body.location).trim() || 'Our Little World' : existing.location,
      category: body.category !== undefined ? body.category : existing.category,
      caption: body.caption !== undefined ? String(body.caption).trim() : existing.caption,
      imageUrl: nextImageUrl,
      id: existing.id,
      likes: existing.likes,
      notes: existing.notes,
      authorId: existing.authorId,
      authorName: existing.authorName,
      authorInitial: existing.authorInitial,
    };
    saveDatabase(db);
    res.json(db.memories[idx]);
  });

  app.delete('/api/memories/:id', requireAuth, (req: AuthedRequest, res) => {
    const idx = db.memories.findIndex((m) => m.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Memory not found.' });
    db.memories.splice(idx, 1);
    saveDatabase(db);
    res.json({ ok: true });
  });

  app.post('/api/memories/:id/like', requireAuth, (req: AuthedRequest, res) => {
    const item = db.memories.find((m) => m.id === req.params.id);
    if (!item) return res.status(404).json({ error: 'Memory not found.' });
    item.likes += 1;
    saveDatabase(db);
    res.json(item);
  });

  app.post('/api/memories/:id/notes', requireAuth, (req: AuthedRequest, res) => {
    const u = req.user!;
    const item = db.memories.find((m) => m.id === req.params.id);
    if (!item) return res.status(404).json({ error: 'Memory not found.' });
    const text = String(req.body?.text || '').trim();
    if (!text) return res.status(400).json({ error: 'Note text is required.' });
    if (!Array.isArray(item.notes)) item.notes = [];
    item.notes.push({
      id: `note-${Date.now()}`,
      authorId: u.id,
      authorName: u.displayName,
      text,
      createdAt: getTodayIso(),
    });
    saveDatabase(db);
    res.status(201).json(item);
  });

  // Letters CRUD (Strict author-only modification & deletion)
  app.post('/api/letters', requireAuth, (req: AuthedRequest, res) => {
    const u = req.user!;
    const { title, condition, content, date, unlockDate, status, visibility } = req.body || {};
    if (!title?.trim() || !content?.trim()) {
      return res.status(400).json({ error: 'Title and letter content are required.' });
    }
    const cleanContent = String(content).trim();
    const item = {
      id: `letter-${Date.now()}`,
      title: String(title).trim(),
      condition: String(condition || `Open When: ${title.trim()}`).trim(),
      preview: cleanContent.slice(0, 72) + (cleanContent.length > 72 ? '...' : ''),
      content: cleanContent,
      date: String(date || getTodayIso()),
      unlockDate: unlockDate ? String(unlockDate) : '',
      status: status === 'draft' ? 'draft' : 'sent',
      visibility: visibility === 'private' ? 'private' : 'shared',
      authorId: u.id,
      authorName: u.displayName,
    };
    db.letters.unshift(item);
    saveDatabase(db);
    res.status(201).json(item);
  });

  app.patch('/api/letters/:id', requireAuth, (req: AuthedRequest, res) => {
    const idx = db.letters.findIndex((l) => l.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Letter not found.' });
    const existing = db.letters[idx];
    if (existing.authorId !== req.user!.id) {
      return res.status(403).json({ error: 'Only the author can edit this letter.' });
    }
    const body = req.body || {};
    const nextTitle = body.title !== undefined ? String(body.title).trim() : existing.title;
    const content = body.content !== undefined ? String(body.content).trim() : existing.content;
    if (!nextTitle || !content) {
      return res.status(400).json({ error: 'Title and letter content are required.' });
    }
    db.letters[idx] = {
      ...existing,
      title: nextTitle,
      condition:
        body.condition !== undefined ? String(body.condition).trim() || `Open When: ${nextTitle}` : existing.condition,
      content,
      preview: content.slice(0, 72) + (content.length > 72 ? '...' : ''),
      date: body.date !== undefined ? String(body.date).trim() || existing.date : existing.date,
      unlockDate: body.unlockDate !== undefined ? String(body.unlockDate).trim() : existing.unlockDate,
      status: body.status === 'draft' ? 'draft' : body.status === 'sent' ? 'sent' : existing.status,
      visibility:
        body.visibility === 'private'
          ? 'private'
          : body.visibility === 'shared'
          ? 'shared'
          : existing.visibility,
      id: existing.id,
      authorId: existing.authorId,
      authorName: existing.authorName,
    };
    saveDatabase(db);
    res.json(db.letters[idx]);
  });

  app.delete('/api/letters/:id', requireAuth, (req: AuthedRequest, res) => {
    const idx = db.letters.findIndex((l) => l.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Letter not found.' });
    if (db.letters[idx].authorId !== req.user!.id) {
      return res.status(403).json({ error: 'Only the author can delete this letter.' });
    }
    db.letters.splice(idx, 1);
    saveDatabase(db);
    res.json({ ok: true });
  });

  // Journal CRUD (Strict author-only modification & deletion)
  app.post('/api/journal', requireAuth, (req: AuthedRequest, res) => {
    const u = req.user!;
    const { date, title, content, mood, photoUrl, visibility } = req.body || {};
    if (!title?.trim() || !content?.trim()) {
      return res.status(400).json({ error: 'Title and journal text are required.' });
    }
    const item = {
      id: `j-${Date.now()}`,
      date: String(date || getTodayIso()),
      title: String(title).trim(),
      content: String(content).trim(),
      mood: mood || 'In Love',
      photoUrl: photoUrl ? String(photoUrl).trim() : '',
      visibility: visibility === 'private' ? 'private' : 'shared',
      authorId: u.id,
      authorName: u.displayName,
      updatedAt: new Date().toISOString(),
    };
    db.journal.unshift(item);
    saveDatabase(db);
    res.status(201).json(item);
  });

  app.patch('/api/journal/:id', requireAuth, (req: AuthedRequest, res) => {
    const idx = db.journal.findIndex((j) => j.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Journal entry not found.' });
    const existing = db.journal[idx];
    if (existing.authorId !== req.user!.id) {
      return res.status(403).json({ error: 'Only the author can edit this journal entry.' });
    }
    const body = req.body || {};
    const nextTitle = body.title !== undefined ? String(body.title).trim() : existing.title;
    const nextContent = body.content !== undefined ? String(body.content).trim() : existing.content;
    if (!nextTitle || !nextContent) {
      return res.status(400).json({ error: 'Title and journal text are required.' });
    }
    db.journal[idx] = {
      ...existing,
      date: body.date !== undefined ? String(body.date).trim() || existing.date : existing.date,
      title: nextTitle,
      content: nextContent,
      mood: body.mood !== undefined ? body.mood : existing.mood,
      photoUrl: body.photoUrl !== undefined ? String(body.photoUrl).trim() : existing.photoUrl,
      visibility:
        body.visibility === 'private'
          ? 'private'
          : body.visibility === 'shared'
          ? 'shared'
          : existing.visibility,
      id: existing.id,
      authorId: existing.authorId,
      authorName: existing.authorName,
      updatedAt: new Date().toISOString(),
    };
    saveDatabase(db);
    res.json(db.journal[idx]);
  });

  app.delete('/api/journal/:id', requireAuth, (req: AuthedRequest, res) => {
    const idx = db.journal.findIndex((j) => j.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Journal entry not found.' });
    if (db.journal[idx].authorId !== req.user!.id) {
      return res.status(403).json({ error: 'Only the author can delete this journal entry.' });
    }
    db.journal.splice(idx, 1);
    saveDatabase(db);
    res.json({ ok: true });
  });

  // Bucket List CRUD
  app.post('/api/bucket-list', requireAuth, (req: AuthedRequest, res) => {
    const u = req.user!;
    const { title, description, category, targetDate } = req.body || {};
    if (!title?.trim()) {
      return res.status(400).json({ error: 'Bucket list activity title is required.' });
    }
    const item = {
      id: `b-${Date.now()}`,
      title: String(title).trim(),
      description: String(description || '').trim(),
      category: category || 'Adventure',
      targetDate: targetDate ? String(targetDate) : '',
      completed: false,
      completedAt: '',
      completionPhotoUrl: '',
      authorId: u.id,
      authorName: u.displayName,
    };
    db.bucketList.unshift(item);
    saveDatabase(db);
    res.status(201).json(item);
  });

  app.patch('/api/bucket-list/:id', requireAuth, (req: AuthedRequest, res) => {
    const idx = db.bucketList.findIndex((b) => b.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Bucket list item not found.' });
    const existing = db.bucketList[idx];
    const body = req.body || {};
    const nextTitle = body.title !== undefined ? String(body.title).trim() : existing.title;
    if (!nextTitle) {
      return res.status(400).json({ error: 'Bucket list activity title is required.' });
    }
    db.bucketList[idx] = {
      ...existing,
      title: nextTitle,
      description: body.description !== undefined ? String(body.description).trim() : existing.description,
      category: body.category !== undefined ? body.category : existing.category,
      targetDate: body.targetDate !== undefined ? String(body.targetDate).trim() : existing.targetDate,
      completed: body.completed !== undefined ? Boolean(body.completed) : existing.completed,
      completedAt: body.completedAt !== undefined ? String(body.completedAt).trim() : existing.completedAt,
      completionPhotoUrl:
        body.completionPhotoUrl !== undefined
          ? String(body.completionPhotoUrl).trim()
          : existing.completionPhotoUrl,
      id: existing.id,
      authorId: existing.authorId,
      authorName: existing.authorName,
    };
    saveDatabase(db);
    res.json(db.bucketList[idx]);
  });

  app.delete('/api/bucket-list/:id', requireAuth, (req: AuthedRequest, res) => {
    const idx = db.bucketList.findIndex((b) => b.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Bucket list item not found.' });
    db.bucketList.splice(idx, 1);
    saveDatabase(db);
    res.json({ ok: true });
  });

  // Special Dates CRUD
  app.post('/api/special-dates', requireAuth, (req: AuthedRequest, res) => {
    const u = req.user!;
    const { title, date, type, description, recurringYearly, reminderDays } = req.body || {};
    if (!title?.trim() || !date) {
      return res.status(400).json({ error: 'Event title and date are required.' });
    }
    const item = {
      id: `sd-${Date.now()}`,
      title: String(title).trim(),
      date: String(date),
      type: type || 'Custom Event',
      description: String(description || '').trim(),
      recurringYearly: Boolean(recurringYearly),
      reminderDays: reminderDays === null || reminderDays === undefined ? null : Number(reminderDays),
      authorId: u.id,
      authorName: u.displayName,
    };
    db.specialDates.push(item);
    saveDatabase(db);
    res.status(201).json(item);
  });

  app.patch('/api/special-dates/:id', requireAuth, (req: AuthedRequest, res) => {
    const idx = db.specialDates.findIndex((s) => s.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Event not found.' });
    const existing = db.specialDates[idx];
    const body = req.body || {};
    const nextTitle = body.title !== undefined ? String(body.title).trim() : existing.title;
    const nextDate = body.date !== undefined ? String(body.date).trim() : existing.date;
    if (!nextTitle || !nextDate) {
      return res.status(400).json({ error: 'Event title and date are required.' });
    }
    db.specialDates[idx] = {
      ...existing,
      title: nextTitle,
      date: nextDate,
      type: body.type !== undefined ? body.type : existing.type,
      description: body.description !== undefined ? String(body.description).trim() : existing.description,
      recurringYearly:
        body.recurringYearly !== undefined ? Boolean(body.recurringYearly) : existing.recurringYearly,
      reminderDays:
        body.reminderDays !== undefined
          ? body.reminderDays === null
            ? null
            : Number(body.reminderDays)
          : existing.reminderDays,
      id: existing.id,
      authorId: existing.authorId,
      authorName: existing.authorName,
    };
    saveDatabase(db);
    res.json(db.specialDates[idx]);
  });

  app.delete('/api/special-dates/:id', requireAuth, (req: AuthedRequest, res) => {
    const idx = db.specialDates.findIndex((s) => s.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Event not found.' });
    db.specialDates.splice(idx, 1);
    saveDatabase(db);
    res.json({ ok: true });
  });

  // Little Things We Love CRUD
  app.post('/api/little-things', requireAuth, (req: AuthedRequest, res) => {
    const u = req.user!;
    const { category, title, note } = req.body || {};
    if (!title?.trim()) {
      return res.status(400).json({ error: 'Title is required.' });
    }
    const item = {
      id: `lt-${Date.now()}`,
      category: category || 'Shared Interests',
      title: String(title).trim(),
      note: String(note || '').trim(),
      authorId: u.id,
      authorName: u.displayName,
    };
    db.littleThings.unshift(item);
    saveDatabase(db);
    res.status(201).json(item);
  });

  app.patch('/api/little-things/:id', requireAuth, (req: AuthedRequest, res) => {
    const idx = db.littleThings.findIndex((l) => l.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Item not found.' });
    const existing = db.littleThings[idx];
    const body = req.body || {};
    const nextTitle = body.title !== undefined ? String(body.title).trim() : existing.title;
    if (!nextTitle) {
      return res.status(400).json({ error: 'Title is required.' });
    }
    db.littleThings[idx] = {
      ...existing,
      category: body.category !== undefined ? body.category : existing.category,
      title: nextTitle,
      note: body.note !== undefined ? String(body.note).trim() : existing.note,
      id: existing.id,
      authorId: existing.authorId,
      authorName: existing.authorName,
    };
    saveDatabase(db);
    res.json(db.littleThings[idx]);
  });

  app.delete('/api/little-things/:id', requireAuth, (req: AuthedRequest, res) => {
    const idx = db.littleThings.findIndex((l) => l.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Item not found.' });
    db.littleThings.splice(idx, 1);
    saveDatabase(db);
    res.json({ ok: true });
  });

  // Wishes CRUD (preserved from original pinboard)
  app.post('/api/wishes', requireAuth, (req: AuthedRequest, res) => {
    const u = req.user!;
    const { name, note, stamp, tag, colorTheme } = req.body || {};
    if (!note?.trim()) return res.status(400).json({ error: 'Note text is required.' });
    const item = {
      id: `w-${Date.now()}`,
      name: String(name || u.displayName).trim(),
      note: String(note).trim(),
      stamp: String(stamp || '💖'),
      tag: String(tag || '#foreverUs'),
      timestamp: 'Just now',
      colorTheme: colorTheme || 'rose',
      authorId: u.id,
    };
    db.wishes.unshift(item);
    saveDatabase(db);
    res.status(201).json(item);
  });

  app.patch('/api/wishes/:id', requireAuth, (req: AuthedRequest, res) => {
    const idx = db.wishes.findIndex((w) => w.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Wish not found.' });
    db.wishes[idx] = { ...db.wishes[idx], ...req.body, id: db.wishes[idx].id };
    saveDatabase(db);
    res.json(db.wishes[idx]);
  });

  app.delete('/api/wishes/:id', requireAuth, (req: AuthedRequest, res) => {
    const idx = db.wishes.findIndex((w) => w.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Wish not found.' });
    db.wishes.splice(idx, 1);
    saveDatabase(db);
    res.json({ ok: true });
  });

  // Data Export (Strictly filtered for requesting user's privacy)
  app.get('/api/account/export', requireAuth, (req: AuthedRequest, res) => {
    const u = req.user!;
    const exportPayload = {
      exportedAt: new Date().toISOString(),
      spaceId: SPACE_ID,
      account: toPublicUserProfile(u),
      data: filterSanctuaryForUser(u.id),
    };
    res.setHeader('Content-Type', 'application/json');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="srishti-manav-keepsake-${u.displayName.toLowerCase()}-${getTodayIso()}.json"`
    );
    res.send(JSON.stringify(exportPayload, null, 2));
  });

  // Account Deletion (Requires passphrase confirmation; removes private data & deactivates account)
  app.delete('/api/account', requireAuth, (req: AuthedRequest, res) => {
    const u = req.user!;
    const { password } = req.body || {};
    if (!password || !verifyPassword(String(password), u.passwordHash, u.passwordSalt)) {
      return res.status(403).json({ error: 'Incorrect passphrase. Account deletion cancelled.' });
    }
    // Delete user's private letters and private journal entries
    db.letters = db.letters.filter((l) => !(l.authorId === u.id && l.visibility === 'private'));
    db.journal = db.journal.filter((j) => !(j.authorId === u.id && j.visibility === 'private'));
    u.active = false;
    u.avatarUrl = '';
    u.bio = '';
    saveDatabase(db);
    res.clearCookie('sm_session', { path: '/' });
    res.json({
      ok: true,
      message: 'Your account has been deactivated and all private entries removed.',
    });
  });

  // Vite integration in dev vs static dist in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Srishti & Manav Sanctuary running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
