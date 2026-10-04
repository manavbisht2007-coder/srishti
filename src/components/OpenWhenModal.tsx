import React from 'react';
import { LetterItem } from '../types';

interface OpenWhenModalProps {
  letter: LetterItem | null;
  onClose: () => void;
  onShowerFlowers: () => void;
}

export const OpenWhenModal: React.FC<OpenWhenModalProps> = ({
  letter,
  onClose,
  onShowerFlowers,
}) => {
  if (!letter) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-xs animate-fade-in">
      <div className="bg-[#fdf9f3] rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-2xl border border-[#ffd9dc] relative animate-scale-up max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#877274] hover:text-[#5d1826] p-1.5 rounded-full hover:bg-[#ebe8e2] transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* Top Header Badge */}
        <div className="flex items-center gap-2 mb-2">
          <span className="w-7 h-7 rounded-full bg-[#7a2e3b] text-[#fed65b] flex items-center justify-center shadow-xs">
            <span className="material-symbols-outlined text-[16px]">drafts</span>
          </span>
          <span className="text-[11px] font-bold text-[#735c00] tracking-widest uppercase font-sans">
            Unsealed Keepsake Letter
          </span>
        </div>

        <h3 className="font-serif text-2xl md:text-3xl font-semibold text-[#5d1826] mb-1">
          {letter.condition}
        </h3>

        <div className="w-full h-0.5 bg-[#ffd9dc] my-4" />

        {/* Vintage Paper Container */}
        <div className="bg-[#ffffff] p-6 md:p-8 rounded-2xl border border-[#d9c1c2]/50 shadow-inner relative overflow-hidden">
          {/* Subtle floral watermark */}
          <div className="absolute -right-6 -bottom-6 opacity-5 pointer-events-none">
            <span className="material-symbols-outlined text-[160px] text-[#5d1826]">
              local_florist
            </span>
          </div>

          <div className="relative z-10 space-y-4 font-serif text-[16px] md:text-[18px] text-[#1c1c18] leading-relaxed whitespace-pre-line">
            {letter.content}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#544244]">
            <span className="material-symbols-outlined text-[18px] text-[#735c00]">verified</span>
            <span>Always tenderly preserved</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onShowerFlowers();
              }}
              className="px-4 py-2 rounded-lg bg-[#ffd9dc] text-[#5d1826] hover:bg-[#ffb2ba] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Shower Petals</span>
              <span>🌸</span>
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-lg bg-[#5d1826] hover:bg-[#7a2e3b] text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              Fold Back & Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
