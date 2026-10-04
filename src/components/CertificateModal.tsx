import React from 'react';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientName: string;
  onShowerFlowers: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  recipientName,
  onShowerFlowers,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-[#fdf9f3] rounded-3xl max-w-2xl w-full p-6 md:p-10 shadow-2xl border-4 border-[#fed65b] relative animate-scale-up max-h-[95vh] overflow-y-auto print:border-none print:shadow-none print:m-0 print:p-4">
        {/* Close Button (Hidden on Print) */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#877274] hover:text-[#5d1826] p-1.5 rounded-full hover:bg-[#ebe8e2] transition-colors cursor-pointer print:hidden"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* Certificate Frame */}
        <div className="border-2 border-dashed border-[#735c00]/40 p-6 md:p-8 rounded-2xl bg-[#ffffff] relative text-center">
          {/* Top Wax Seal */}
          <div className="w-16 h-16 rounded-full bg-[#5d1826] text-[#fed65b] flex items-center justify-center mx-auto mb-4 shadow-lg border-2 border-[#fed65b]">
            <span className="material-symbols-outlined text-[34px]">workspace_premium</span>
          </div>

          <span className="text-[11px] font-bold text-[#735c00] tracking-widest uppercase font-sans">
            Charter of Boundless Devotion
          </span>

          <h2 className="font-serif text-2xl md:text-3xl font-semibold text-[#5d1826] mt-1 mb-2">
            Unconditional Friendship Pact
          </h2>

          <p className="font-serif italic text-sm md:text-base text-[#544244] max-w-md mx-auto mb-6">
            Conferred unto <span className="font-bold text-[#5d1826] not-italic underline decoration-[#fed65b] decoration-2">{recipientName}</span> for being an unshakeable lighthouse and safe haven.
          </p>

          <div className="text-left space-y-4 my-6 text-xs md:text-sm text-[#1c1c18] font-sans">
            <div className="p-3 bg-[#f7f3ed] rounded-xl border border-[#ffd9dc]/60">
              <strong className="text-[#5d1826] font-serif text-base block mb-0.5">
                Article I • Infinite Compassion & Zero Judgement
              </strong>
              <p className="text-[#544244]">
                Neither chaotic mistakes, bad haircut crises, nor sudden bouts of overthinking shall ever diminish our bond.
              </p>
            </div>

            <div className="p-3 bg-[#f7f3ed] rounded-xl border border-[#ffd9dc]/60">
              <strong className="text-[#5d1826] font-serif text-base block mb-0.5">
                Article II • The 2 AM Emergency Hotline
              </strong>
              <p className="text-[#544244]">
                Any call, voice note, or meme shared at unusual hours shall be met with open ears, honest hugs, or silent accompaniment.
              </p>
            </div>

            <div className="p-3 bg-[#f7f3ed] rounded-xl border border-[#ffd9dc]/60">
              <strong className="text-[#5d1826] font-serif text-base block mb-0.5">
                Article III • Spontaneous Escapes & Shared Brioches
              </strong>
              <p className="text-[#544244]">
                We hereby reserve the lifelong right to drop everything for road trips, botanical gardens, and long coffee chats.
              </p>
            </div>

            <div className="p-3 bg-[#f7f3ed] rounded-xl border border-[#ffd9dc]/60">
              <strong className="text-[#5d1826] font-serif text-base block mb-0.5">
                Article IV • Perpetual Validity
              </strong>
              <p className="text-[#544244]">
                This covenant possesses zero expiration date, remains effective across all earthly continents, and transcends time.
              </p>
            </div>
          </div>

          {/* Signatures & Seal */}
          <div className="pt-6 border-t border-[#d9c1c2]/60 grid grid-cols-2 gap-6 items-end">
            <div className="text-center">
              <p className="font-serif italic text-lg text-[#5d1826] border-b border-[#5d1826]/40 pb-1">
                Your Faithful Best Friend
              </p>
              <span className="text-[10px] font-bold text-[#877274] uppercase tracking-wider block mt-1">
                Guardian of Memories
              </span>
            </div>

            <div className="text-center">
              <p className="font-serif italic text-lg text-[#5d1826] border-b border-[#5d1826]/40 pb-1">
                {recipientName}
              </p>
              <span className="text-[10px] font-bold text-[#877274] uppercase tracking-wider block mt-1">
                Cherished Soulmate
              </span>
            </div>
          </div>
        </div>

        {/* Modal Controls (Hidden on Print) */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <button
            onClick={() => {
              onShowerFlowers();
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#fed65b]/40 text-[#735c00] hover:bg-[#fed65b] text-xs font-semibold transition-colors cursor-pointer border border-[#fed65b]"
          >
            <span>Shower Golden Blessings</span>
            <span>✨</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-lg bg-[#ffffff] text-[#5d1826] hover:bg-[#ebe8e2] text-xs font-semibold border border-[#ffd9dc] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              <span>Print / Save Keepsake</span>
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-lg bg-[#5d1826] hover:bg-[#7a2e3b] text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
