import React from 'react';
import { ThemeMode } from '../types';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientName: string;
  theme?: ThemeMode;
  onShowerFlowers: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  recipientName,
  theme = 'romantic',
  onShowerFlowers,
}) => {
  if (!isOpen) return null;

  const isAquatic = theme === 'aquatic';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Srishti and Manav Forever Pact"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`rounded-3xl max-w-2xl w-full p-6 md:p-10 shadow-2xl border-2 relative animate-scale-up max-h-[95vh] overflow-y-auto print:border-none print:shadow-none ${
          isAquatic
            ? 'bg-[#f0f8ff] border-[#90e0ef] text-[#03045e]'
            : 'bg-[#FFF9F2] border-[#FBCFE8] text-[#44313B]'
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close certificate"
          className="absolute top-5 right-5 opacity-70 hover:opacity-100 p-1.5 rounded-full hover:bg-black/5 cursor-pointer print:hidden"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        <div className="border border-dashed border-black/15 p-6 md:p-8 rounded-2xl bg-white text-center">
          <div
            className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm ${
              isAquatic ? 'bg-[#0077B6] text-white' : 'bg-[#BE185D] text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[28px]">workspace_premium</span>
          </div>

          <p className="text-xs font-semibold uppercase tracking-widest opacity-70">
            Charter of Devotion
          </p>

          <h2
            className={`font-serif text-3xl font-semibold mt-1 mb-2 ${
              isAquatic ? 'text-[#03045e]' : 'text-[#BE185D]'
            }`}
          >
            Forever Pact — {recipientName}
          </h2>

          <p className="font-serif italic text-base opacity-85 max-w-md mx-auto mb-6">
            A quiet promise between Srishti and Manav to always choose patience, kindness, and laughter.
          </p>

          <div className="text-left space-y-3 my-6 text-sm">
            <div className="p-3.5 bg-[#FFF7F9] rounded-xl border border-black/5">
              <strong className="font-serif text-base block mb-0.5">
                I. Gentle Listening &amp; Safe Haven
              </strong>
              <p className="text-xs opacity-80">
                No matter how busy or tired the day becomes, we always make time to listen and hold space for each other.
              </p>
            </div>
            <div className="p-3.5 bg-[#FFF7F9] rounded-xl border border-black/5">
              <strong className="font-serif text-base block mb-0.5">
                II. Zero Distance Too Far
              </strong>
              <p className="text-xs opacity-80">
                From long-distance sparks to side-by-side mornings, every mile only deepens our gratitude.
              </p>
            </div>
            <div className="p-3.5 bg-[#FFF7F9] rounded-xl border border-black/5">
              <strong className="font-serif text-base block mb-0.5">
                III. Adventures &amp; Little Joys
              </strong>
              <p className="text-xs opacity-80">
                To keep celebrating small wins, cozy dinners, shared dreams, and spontaneous walks forever.
              </p>
            </div>
          </div>

          <div className="pt-5 border-t border-black/10 grid grid-cols-2 gap-6">
            <div>
              <p className="font-serif italic text-lg border-b border-black/20 pb-1">Manav</p>
              <span className="text-[11px] opacity-65 block mt-1">Signed Forever</span>
            </div>
            <div>
              <p className="font-serif italic text-lg border-b border-black/20 pb-1">Srishti</p>
              <span className="text-[11px] opacity-65 block mt-1">Signed Forever</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <button
            type="button"
            onClick={onShowerFlowers}
            className="px-4 py-2 rounded-xl bg-[#FCE7F3] text-[#BE185D] text-xs font-semibold cursor-pointer"
          >
            Celebrate ✨
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="px-4 py-2 rounded-xl bg-white border border-black/10 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              <span>Print</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className={`px-5 py-2 rounded-xl text-white text-xs font-semibold cursor-pointer ${
                isAquatic ? 'bg-[#0077B6]' : 'bg-[#BE185D]'
              }`}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
