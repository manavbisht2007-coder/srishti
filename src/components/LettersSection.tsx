import React, { useState, useEffect } from 'react';
import { LetterItem } from '../types';
import { toggleAmbientMusic, getIsMusicPlaying } from '../utils/sound';

interface LettersSectionProps {
  onOpenLetter: (letter: LetterItem) => void;
  onOpenCertificate: () => void;
  onShowerFlowers: () => void;
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
}

export const LettersSection: React.FC<LettersSectionProps> = ({
  onOpenLetter,
  onOpenCertificate,
  onShowerFlowers,
  isMusicPlaying,
  onToggleMusic,
}) => {
  const [isLetterUnsealed, setIsLetterUnsealed] = useState(true);
  const [waveHeights, setWaveHeights] = useState<number[]>([12, 28, 36, 20, 32, 16, 40, 24, 32, 20, 12, 24, 36, 16]);

  // Animate audio waveform bars when music is playing
  useEffect(() => {
    if (!isMusicPlaying) return;
    const interval = window.setInterval(() => {
      setWaveHeights((prev) =>
        prev.map(() => Math.floor(Math.random() * 32) + 8)
      );
    }, 180);
    return () => clearInterval(interval);
  }, [isMusicPlaying]);

  const handleToggleSeal = () => {
    setIsLetterUnsealed(!isLetterUnsealed);
    onShowerFlowers();
  };

  const sealedLetters: LetterItem[] = [
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

  return (
    <section id="heartfelt-letters" className="w-full bg-[#f7f3ed]/60 py-16 md:py-24 border-y border-[#ffd9dc]/40">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <span className="text-[11px] font-bold text-[#735c00] uppercase tracking-widest font-sans">
            Words For The Heart
          </span>
          <h2 className="font-serif text-[32px] md:text-[38px] text-[#5d1826] mt-1 font-normal">
            Keepsake Letters & Envelopes
          </h2>
          <p className="text-sm md:text-base text-[#544244] max-w-lg mt-2 leading-relaxed">
            Treasured notes sealed with tenderness, meant to be uncurled whenever you need a reminder of who you are to us.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Folded Stationery & Open When Envelopes */}
          <div className="lg:col-span-7 bg-[#ffffff] rounded-3xl p-6 md:p-8 shadow-md border border-[#ffd9dc]/50">
            <div className="flex items-center justify-between pb-6 border-b border-[#f1ede7]">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[28px] text-[#5d1826]">
                  markunread_mailbox
                </span>
                <div>
                  <span className="text-[11px] font-bold text-[#735c00] uppercase font-sans">
                    Folded Stationery
                  </span>
                  <h3 className="font-serif text-[20px] md:text-[22px] font-semibold text-[#5d1826]">
                    A Letter For When You Need a Smile
                  </h3>
                </div>
              </div>

              {/* Break Wax Seal / Fold Button */}
              <button
                type="button"
                onClick={handleToggleSeal}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#f7f3ed] text-[#5d1826] hover:bg-[#ebe8e2] transition-all cursor-pointer border border-[#ffd9dc] text-xs font-semibold shadow-2xs active:scale-95"
              >
                <span>{isLetterUnsealed ? 'Fold Letter' : 'Break Wax Seal'}</span>
                <span className="material-symbols-outlined text-[17px]">
                  {isLetterUnsealed ? 'lock' : 'lock_open'}
                </span>
              </button>
            </div>

            {/* Unfolded Letter Sheet */}
            <div
              className={`transition-all duration-700 overflow-hidden relative ${
                isLetterUnsealed
                  ? 'max-h-[850px] opacity-100 mt-6 bg-[#f7f3ed]/50 rounded-2xl p-6 md:p-8 border border-[#ffd9dc]/60'
                  : 'max-h-0 opacity-0 mt-0 py-0 border-0'
              }`}
            >
              {/* Vintage Paper Watermark Motif */}
              <div className="absolute right-4 bottom-4 opacity-5 pointer-events-none">
                <span className="material-symbols-outlined text-[140px] text-[#5d1826]">
                  local_florist
                </span>
              </div>

              <p className="text-[11px] font-bold text-[#877274] mb-4 uppercase tracking-widest font-sans">
                TO MY IRREPLACEABLE BEST FRIEND —
              </p>

              <p className="text-base md:text-lg text-[#1c1c18] leading-relaxed mb-4">
                If you are reading this on an ordinary Tuesday or on an evening when the world feels slightly too heavy, I want you to take a slow breath and remember something simple:
              </p>

              <p className="font-serif italic text-lg md:text-[21px] text-[#5d1826] leading-relaxed mb-4 pl-4 border-l-2 border-[#7a2e3b]">
                “You have this quiet, effortless magic of making spaces feel softer and people feel understood. You never ask for the spotlight, yet everyone in your presence blooms a little wider.”
              </p>

              <p className="text-sm md:text-[15px] text-[#544244] leading-relaxed mb-6">
                Thank you for laughing at my worst puns, for holding my silence when words were too messy, and for celebrating every little victory like it was the world cup. Meeting you wasn’t luck—it was grace. Here’s to every horizon we haven't crossed yet.
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-[#d9c1c2]/40">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-[#5d1826] text-[#fed65b] flex items-center justify-center text-xs font-bold shadow-2xs">
                    ★
                  </span>
                  <span className="font-serif text-lg font-semibold text-[#5d1826]">
                    Forever in your corner, always.
                  </span>
                </div>
                <span className="text-[11px] font-bold text-[#877274] tracking-wider uppercase font-sans">
                  Sanctuary Archive • 2024
                </span>
              </div>
            </div>

            {/* Folded wax seal placeholder when folded */}
            {!isLetterUnsealed && (
              <div
                onClick={handleToggleSeal}
                className="mt-6 py-10 bg-[#f7f3ed]/60 rounded-2xl border border-dashed border-[#d9c1c2] flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[#ebe8e2] transition-colors"
              >
                <div className="w-14 h-14 rounded-full bg-[#7a2e3b] text-[#fed65b] flex items-center justify-center shadow-md mb-2">
                  <span className="material-symbols-outlined text-[28px]">mark_email_unread</span>
                </div>
                <p className="font-serif text-lg font-medium text-[#5d1826]">The letter is folded & wax-sealed</p>
                <p className="text-xs text-[#544244] mt-0.5">Click here or the button above to break the seal and read.</p>
              </div>
            )}

            {/* Secondary Sealed Mini Tabs ("Open When") */}
            <div className="mt-6 space-y-3">
              <span className="text-[11px] font-bold text-[#735c00] uppercase tracking-wider block font-sans">
                Sealed Vault: "Open When..." Letters
              </span>

              {sealedLetters.map((letter) => (
                <div
                  key={letter.id}
                  onClick={() => onOpenLetter(letter)}
                  className="p-4 rounded-xl bg-[#f7f3ed] hover:bg-[#ebe8e2] border border-[#ffd9dc]/70 flex items-center justify-between transition-all cursor-pointer group hover:-translate-y-0.5 shadow-2xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#735c00] text-[22px] group-hover:scale-110 transition-transform">
                      drafts
                    </span>
                    <span className="text-sm md:text-base text-[#1c1c18] font-medium group-hover:text-[#5d1826] transition-colors">
                      {letter.condition}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-[#877274] group-hover:text-[#5d1826] uppercase font-sans tracking-wider whitespace-nowrap">
                    Sealed • Click to Read
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Audio Memory Box & Friendship Pact */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Audio Memory Box */}
            <div className="bg-[#ffffff] rounded-3xl p-6 md:p-8 shadow-md border border-[#ffd9dc]/50">
              <span className="text-[11px] font-bold text-[#735c00] uppercase tracking-wider font-sans">
                Audio Keepsake
              </span>
              <h3 className="font-serif text-[20px] md:text-[22px] font-semibold text-[#5d1826] mt-1 mb-2">
                Our Road Trip Voice Tape
              </h3>
              <p className="text-xs md:text-sm text-[#544244] mb-6 leading-relaxed">
                A snippet of spontaneous car singing, bad acoustic guitar, and pure joyous laughter from Highway 1.
              </p>

              {/* Audio Player Glass Component */}
              <div className="p-4 rounded-2xl bg-[#f7f3ed] border border-[#ffd9dc] flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={onToggleMusic}
                      className="w-12 h-12 rounded-full bg-[#5d1826] text-[#fed65b] flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer border border-[#fed65b]/40"
                      type="button"
                      title={isMusicPlaying ? 'Pause melody' : 'Play melody'}
                    >
                      <span className="material-symbols-outlined text-[24px]">
                        {isMusicPlaying ? 'pause' : 'play_arrow'}
                      </span>
                    </button>
                    <div>
                      <p className="font-serif text-base font-semibold text-[#5d1826]">
                        Soundtrack to 2 AM
                      </p>
                      <p className="text-xs text-[#544244]">
                        {isMusicPlaying ? 'Now Playing • Soft Ambient Lullaby' : 'Singing off-key • 02:44'}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#735c00] bg-[#fed65b]/30 px-2 py-0.5 rounded-full border border-[#fed65b]/60">
                    HQ Audio
                  </span>
                </div>

                {/* Visual Audio Waveform */}
                <div className="flex items-end gap-1.5 h-11 px-2 pt-2 justify-between">
                  {waveHeights.map((h, i) => (
                    <span
                      key={i}
                      style={{ height: `${isMusicPlaying ? h : Math.max(8, (i % 5) * 5 + 8)}px` }}
                      className={`w-1.5 rounded-full transition-all duration-150 ${
                        i % 3 === 0
                          ? 'bg-[#735c00]'
                          : i % 2 === 0
                          ? 'bg-[#5d1826]'
                          : 'bg-[#5d1826]/60'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Friendship Certificate / Blessing Token */}
            <div
              onClick={onOpenCertificate}
              className="bg-gradient-to-br from-[#f1ede7] to-[#ebe8e2] p-6 rounded-3xl shadow-sm text-center flex flex-col items-center border border-[#ffd9dc]/60 hover:shadow-md transition-all cursor-pointer group"
            >
              <span className="material-symbols-outlined text-[38px] text-[#735c00] mb-2 group-hover:scale-110 transition-transform">
                workspace_premium
              </span>
              <h4 className="font-serif text-[20px] font-semibold text-[#5d1826]">
                Unconditional Friendship Pact
              </h4>
              <p className="text-xs text-[#544244] mt-1.5 mb-4 max-w-xs leading-relaxed">
                Valid in all time zones, through bad haircut crises, spontaneous mid-week brunch demands, and forever onwards.
              </p>
              <div className="px-4 py-1.5 rounded-full bg-[#ffffff] text-[11px] font-bold text-[#5d1826] shadow-2xs border border-[#ffd9dc] uppercase font-sans tracking-wider group-hover:bg-[#5d1826] group-hover:text-white transition-colors">
                SIGNED • NO EXPIRATION DATE
              </div>
              <span className="text-[10px] text-[#735c00] mt-2 underline font-semibold">
                Click to inspect & print pact
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
