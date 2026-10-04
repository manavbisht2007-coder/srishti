import React, { useState } from 'react';
import { KeepsakeSettings, ThemeMode } from '../types';
import { calculateYearsAndDays } from '../utils/dateTracker';

interface SettingsModalProps {
  isOpen: boolean;
  theme?: ThemeMode;
  onClose: () => void;
  settings: KeepsakeSettings;
  onSave: (newSettings: KeepsakeSettings) => void;
  onShowerFlowers: () => void;
}

const PHOTO_PRESETS = [
  {
    label: 'Warm Spring Roses (Default)',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBrl9gYx78SUS7omxQOos2juTyjesBhhbF8zZNesct8MqT9_b0ELvIatWQVfNC9GdLtg0p4ohQcUQKvNULaU6qONuUFWdPESiK9OXzU6Ms9254Z1DFhpttFdeRzFV5tz4Gpt63DAKVCKvDl8xBM7NXbko9SxQhXlWtnZvTH1-Io6Y6nDgpVoSoSLZhARPoxs1dVAp7QYgfR_5fYankrtto_hXfBlrV6fdsIM_O3FtUe1Ut756a83lzz',
  },
  {
    label: 'Botanical Garden Joy',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDgqvZ0qgApbOQ09Rc2Qvm8h0Gyj_FD4ENJzbTxvkFeUqBAIt3xkSRKmIyovxyc1Q6SSrQz6_2gdob6n7cx9Zy2omtFwsl3WUFIhz1npP6HyEyoo_44s5_dM3dKgCVVgmuDtEvGGYK2UWSXY_9OOFAhhxMb03SD5KX3f5ZkxQokt_lopxiOocq-dQ23loTn3ScnDHKQA5jRGXU7lmTvXZuaJnGf2WaQhg3xIxq9vX3k2TOFcJ8Wqkx',
  },
  {
    label: 'Matcha Afternoon Giggles',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFPGoY7l-G7hcHiyh34SEdHdZ7CRf0nK-F98_TBlGjP-NvC8vXfeQzvARVPYpwKEISY2EAEtxNZmn2wrjenBW2T0EdLISc9AXiIfU8vcisCkKcK_W-FS8AZjPmZdLEmp6FHQRVJZABiwH3J1XqhjFuYGkjCSD0_VSMVNdQNLPS1s3VhVq0s_ezix7QwU5xamkMl-AQEaKh2z591qzOw9LIJ97DSvxKXxvTAzIiYzoCV7ckP7XvHJZL',
  },
  {
    label: 'Coastal Twilight Glow',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCk7qdtIpZMs-s3vG8k5c0zf_pIamN5h50q4-1uSMkCTgcDnxk5dojkIB0InN5d7c6GgIMfm6Sgq5ZC9oD-yJmcCGwtnwsa__JaDqppYYnjIdfeKwxQ3YUpS-U2ZgmNATbFfdIWFX4aXhyQqc7WIhmYpVERA2TpcRDiQSVVKhPQX7LdH5TtZEizux5tIFmoz16LKBA12hX7kpNF4ncGoTTwGHV933vjfUe1kWmpAc5_OhEpx4e_9smr',
  },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  theme = 'romantic',
  onClose,
  settings,
  onSave,
  onShowerFlowers,
}) => {
  const [formData, setFormData] = useState<KeepsakeSettings>(settings);
  const isAquatic = theme === 'aquatic';

  if (!isOpen) return null;

  const currentTracker = calculateYearsAndDays(formData.startDate);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onShowerFlowers();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-[#fdf9f3] rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-[#ffd9dc] relative animate-scale-up max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#877274] hover:text-[#5d1826] p-1.5 rounded-full hover:bg-[#ebe8e2] transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        <div className="flex items-center gap-2 mb-2">
          <span
            className={`w-7 h-7 rounded-full text-[#fed65b] flex items-center justify-center shadow-xs ${
              isAquatic ? 'bg-[#0077b6]' : 'bg-[#5d1826]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">edit</span>
          </span>
          <span className="text-[11px] font-bold text-[#735c00] tracking-widest uppercase font-sans">
            Personalize Sanctuary
          </span>
        </div>

        <h3
          className={`font-serif text-2xl font-semibold mb-4 ${
            isAquatic ? 'text-[#03045e]' : 'text-[#5d1826]'
          }`}
        >
          Customize Your Keepsake
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-[#544244] uppercase mb-1 font-sans">
              Recipient Name / Title
            </label>
            <input
              type="text"
              required
              value={formData.recipientName}
              onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
              placeholder="e.g. For Elena or For My Favorite Person"
              className="w-full px-3 py-2 text-sm rounded-lg bg-white border border-[#d9c1c2] text-[#1c1c18] outline-none focus:border-[#5d1826]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#544244] uppercase mb-1 font-sans">
              Header Subtitle
            </label>
            <input
              type="text"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              placeholder="e.g. An Enduring Keepsake"
              className="w-full px-3 py-2 text-sm rounded-lg bg-white border border-[#d9c1c2] text-[#1c1c18] outline-none focus:border-[#5d1826]"
            />
          </div>

          {/* Dynamic 24-Hour Start Date Setting */}
          <div className="p-4 bg-white rounded-xl border border-[#ffd9dc]/80 shadow-2xs">
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[11px] font-bold text-[#5d1826] uppercase font-sans">
                Friendship / Anniversary Start Date
              </label>
              <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Auto-tracks daily
              </span>
            </div>
            <p className="text-xs text-[#544244] mb-2 leading-relaxed">
              The day count auto-increments every 24 hours at midnight based on this date.
            </p>
            <input
              type="date"
              required
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-lg bg-[#f7f3ed] border border-[#d9c1c2] text-[#1c1c18] outline-none"
            />
            <div className="mt-2 text-xs text-[#735c00] font-semibold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[15px]">calendar_today</span>
              <span>Currently: Day {currentTracker.totalDays.toLocaleString()} ({currentTracker.years} Years)</span>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#544244] uppercase mb-1 font-sans">
              Main Poetic Quote
            </label>
            <textarea
              rows={3}
              value={formData.mainQuote}
              onChange={(e) => setFormData({ ...formData, mainQuote: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-lg bg-white border border-[#d9c1c2] text-[#1c1c18] outline-none italic font-serif"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#544244] uppercase mb-1 font-sans">
              Hero Photo Preset or Custom Link
            </label>
            <div className="space-y-1.5 mb-2">
              {PHOTO_PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setFormData({ ...formData, heroImageUrl: p.url })}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between cursor-pointer ${
                    formData.heroImageUrl === p.url
                      ? 'bg-[#ffd9dc] text-[#5d1826] font-semibold border border-[#ffb2ba]'
                      : 'bg-white text-[#544244] hover:bg-[#ebe8e2]'
                  }`}
                >
                  <span>{p.label}</span>
                  {formData.heroImageUrl === p.url && <span className="text-[14px]">✓</span>}
                </button>
              ))}
            </div>
            <input
              type="url"
              placeholder="Or paste custom image URL..."
              value={formData.heroImageUrl}
              onChange={(e) => setFormData({ ...formData, heroImageUrl: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-lg bg-white border border-[#d9c1c2] text-[#1c1c18] outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-[#d9c1c2]/50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-[#544244] hover:bg-[#ebe8e2] rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-5 py-2 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer ${
                isAquatic ? 'bg-[#0077b6] hover:bg-[#023e8a]' : 'bg-[#5d1826] hover:bg-[#7a2e3b]'
              }`}
            >
              Save Keepsake Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
