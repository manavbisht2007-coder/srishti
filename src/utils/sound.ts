// Web Audio API ambient audio synthesizer for soothing music and petal chime effects
let audioCtx: AudioContext | null = null;
let musicInterval: number | null = null;
let isAudioPlaying = false;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
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

export function toggleAmbientMusic(onStateChange?: (playing: boolean) => void): boolean {
  if (isAudioPlaying) {
    stopAmbientMusic();
    onStateChange?.(false);
    return false;
  } else {
    startAmbientMusic();
    onStateChange?.(true);
    return true;
  }
}

export function startAmbientMusic() {
  if (isAudioPlaying) return;
  const ctx = getAudioContext();
  isAudioPlaying = true;

  let step = 0;
  // A peaceful, nostalgic arpeggio pattern reminiscent of studio ghibli music boxes
  const melody = [0, 3, 2, 4, 1, 3, 5, 2, 0, 4, 3, 1];

  musicInterval = window.setInterval(() => {
    if (!isAudioPlaying) return;
    const noteIdx = melody[step % melody.length];
    const freq = PENTATONIC_FREQUENCIES[noteIdx % PENTATONIC_FREQUENCIES.length];
    
    // Play root note with soft bell envelope
    playSingleChime(freq, 2.0, 0.035);

    // Occasionally add a gentle bass note
    if (step % 4 === 0) {
      playSingleChime(freq / 2, 2.5, 0.025);
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
