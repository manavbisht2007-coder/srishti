import React from 'react';
import { ThemeMode } from '../types';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  text: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
  theme: ThemeMode;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss, theme }) => {
  if (toasts.length === 0) return null;
  const isAquatic = theme === 'aquatic';

  return (
    <div
      aria-live="polite"
      className="fixed top-20 right-4 z-[60] flex flex-col gap-2 max-w-sm w-[calc(100vw-2rem)] pointer-events-none"
    >
      {toasts.map((t) => {
        const isError = t.type === 'error';
        const styleClass = isError
          ? 'bg-red-50 border-red-200 text-red-900'
          : isAquatic
          ? 'bg-[#f0f8ff] border-[#90e0ef] text-[#03045e]'
          : 'bg-[#FFF9F2] border-[#FBCFE8] text-[#44313B]';

        return (
          <div
            key={t.id}
            role="status"
            className={`pointer-events-auto flex items-start gap-2.5 px-4 py-3 rounded-xl border shadow-lg backdrop-blur-md animate-scale-up text-sm ${styleClass}`}
          >
            <span
              className={`material-symbols-outlined text-[18px] mt-0.5 shrink-0 ${
                isError ? 'text-red-600' : isAquatic ? 'text-[#0077B6]' : 'text-[#EC4899]'
              }`}
            >
              {isError ? 'error' : t.type === 'info' ? 'info' : 'check_circle'}
            </span>
            <p className="flex-1 leading-snug font-medium">{t.text}</p>
            <button
              type="button"
              onClick={() => onDismiss(t.id)}
              aria-label="Dismiss notification"
              className="opacity-60 hover:opacity-100 p-0.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        );
      })}
    </div>
  );
};
