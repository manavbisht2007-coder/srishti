// Web Audio API ambient audio synthesizer for soothing music, petal chimes, and aquatic bubble splash effects
let audioCtx: AudioContext | null = null;
let musicInterval: number | null = null;
let isAudioPlaying = false;
let currentMusicTheme: 'romantic' | 'aquatic' = 'romantic';

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Gentle acoustic music box notes (Pentatonic scale in F# major: F#4, G#4, A#4, C#5, D#5, F#5)
const PENTATONIC_FREQUENCIES = [
  369.99, // F#4
  415.30, // G#4
  466.16, // A#4
  554.37, // C#5
  622.25, // D#5
  739.99, // F#5
  830.61, // G#5
];

// Soothing aquatic ocean notes (D major / Dorian calming ocean tones)
const AQUATIC_FREQUENCIES = [
  293.66, // D4
  329.63, // E4
  369.99, // F#4
  440.0,  // A4
  493.88, // B4
  587.33, // D5
  659.25, // E5
];

export function playSingleChime(freq = 554.37, duration = 1.2, volume = 0.05) {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    console.warn('Audio not allowed yet:', e);
  }
}

export function playPetalShowerChime() {
  try {
    const notes = [466.16, 554.37, 739.99, 830.61];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        playSingleChime(freq, 1.4, 0.04);
      }, idx * 75);
    });
  } catch (e) {
    console.warn('Audio error:', e);
  }
}

// Playful cute water bubble pops & splash chime for aquatic theme
export function playBubbleSplashChime() {
  try {
    const ctx = getAudioContext();
    const bubblePitches = [320, 480, 640, 880, 1100];

    bubblePitches.forEach((startFreq, i) => {
      setTimeout(() => {
        try {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          // Upward bubble frequency ramp
          osc.frequency.setValueAtTime(startFreq, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(startFreq * 1.5, ctx.currentTime + 0.12);

          gain.gain.setValueAtTime(0.04, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.14);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start();
          osc.stop(ctx.currentTime + 0.15);
        } catch {
          // ignore
        }
      }, i * 65);
    });
  } catch (e) {
    console.warn('Bubble sound error:', e);
  }
}

export function toggleAmbientMusic(
  theme: 'romantic' | 'aquatic' = 'romantic',
  onStateChange?: (playing: boolean) => void
): boolean {
  if (isAudioPlaying) {
    stopAmbientMusic();
    onStateChange?.(false);
    return false;
  } else {
    currentMusicTheme = theme;
    startAmbientMusic(theme);
    onStateChange?.(true);
    return true;
  }
}

export function startAmbientMusic(theme: 'romantic' | 'aquatic' = 'romantic') {
  if (isAudioPlaying) return;
  const ctx = getAudioContext();
  isAudioPlaying = true;
  currentMusicTheme = theme;

  let step = 0;
  const melody = [0, 3, 2, 4, 1, 3, 5, 2, 0, 4, 3, 1];
  const scale = theme === 'aquatic' ? AQUATIC_FREQUENCIES : PENTATONIC_FREQUENCIES;

  musicInterval = window.setInterval(() => {
    if (!isAudioPlaying) return;
    const noteIdx = melody[step % melody.length];
    const freq = scale[noteIdx % scale.length];

    // Play root chime note
    playSingleChime(freq, 2.0, theme === 'aquatic' ? 0.03 : 0.035);

    // Warm undertone
    if (step % 4 === 0) {
      playSingleChime(freq / 2, 2.5, 0.02);
    }

    step++;
  }, 950);
}

export function stopAmbientMusic() {
  isAudioPlaying = false;
  if (musicInterval !== null) {
    clearInterval(musicInterval);
    musicInterval = null;
  }
}

export function getIsMusicPlaying(): boolean {
  return isAudioPlaying;
}
