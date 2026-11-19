import React, { useEffect, useState } from 'react';
import { KeepsakeSettings, ThemeMode, UserProfile } from '../types';
import { apiFetch, setAuthToken } from '../utils/api';
import { calculateYearsAndDays, getTimeUntilNextMidnight } from '../utils/dateTracker';
import { SafeImage } from './SafeImage';

interface AuthGateProps {
  theme: ThemeMode;
  publicHero: Partial<KeepsakeSettings>;
  onAuthenticated: (user: UserProfile) => void;
}

type AuthTab = 'login' | 'activate' | 'reset';

export const AuthGate: React.FC<AuthGateProps> = ({ theme, publicHero, onAuthenticated }) => {
  const [tab, setTab] = useState<AuthTab>('login');
  const [email, setEmail] = useState('manav@srishtimanav.love');
  const [password, setPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(getTimeUntilNextMidnight());

  const isAquatic = theme === 'aquatic';
  const startDate = publicHero.startDate || '2025-12-01';
  const { totalDays } = calculateYearsAndDays(startDate);

  useEffect(() => {
    const id = setInterval(() => setCountdown(getTimeUntilNextMidnight()), 1000);
    return () => clearInterval(id);
  }, []);

 const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setNotice('');
    setLoading(true);

    const normalizedEmail = email.trim().toLowerCase();
    const isManav = normalizedEmail === 'manav@srishtimanav.love' && password === 'manav2025';
    const isSrishti = normalizedEmail === 'srishti@srishtimanav.love' && password === 'srishti2025';

    if (isManav || isSrishti) {
      const user = {
        id: isManav ? 'manav' : 'srishti',
        email: normalizedEmail,
        displayName: isManav ? 'Manav' : 'Srishti',
        role: isManav ? 'partner_a' : 'partner_b',
      } as unknown as UserProfile;

      setAuthToken('local-sanctuary-token');
      onAuthenticated(user);
    } else {
      setError('Invalid email or passphrase.');
    }

    setLoading(false);
  };

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setNotice('');
    setLoading(true);
    try {
      const res = await apiFetch<{ token: string; user: UserProfile }>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, inviteCode, password, displayName }),
      });
      setAuthToken(res.token);
      onAuthenticated(res.user);
    } catch (err: any) {
      setError(err.message || 'Activation failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setNotice('');
    setLoading(true);
    try {
      const res = await apiFetch<{ message: string }>('/api/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ email, inviteCode, newPassword }),
      });
      setNotice(res.message);
      setTab('login');
      setPassword(newPassword);
    } catch (err: any) {
      setError(err.message || 'Password reset failed.');
    } finally {
      setLoading(false);
    }
  };

  const fillAccount = (who: 'manav' | 'srishti') => {
    setError('');
    if (who === 'manav') {
      setEmail('manav@srishtimanav.love');
      setPassword('manav2025');
    } else {
      setEmail('srishti@srishtimanav.love');
      setPassword('srishti2025');
    }
  };

  return (
    <section className="max-w-[1200px] mx-auto px-4 md:px-8 pt-10 pb-20 w-full relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Left: Preserved Hero Identity & Keepsake Portrait */}
        <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
          <p
            className={`text-xs font-semibold tracking-wider uppercase mb-3 ${
              isAquatic ? 'text-[#0077B6]' : 'text-[#BE185D]'
            }`}
          >
            Together Since December 1, 2025 · Day {totalDays.toLocaleString()}
          </p>

          <h1
            className={`font-serif text-[36px] sm:text-[46px] md:text-[54px] leading-[1.12] tracking-tight mb-4 text-balance ${
              isAquatic ? 'text-[#03045e]' : 'text-[#BE185D]'
            }`}
          >
            {isAquatic
              ? 'To The One Who Makes Every Ocean Calm'
              : 'To The One Who Makes Every Day Bloom'}
          </h1>

          <p
            className={`font-serif italic text-xl md:text-[23px] mb-8 leading-relaxed ${
              isAquatic ? 'text-[#0077B6]' : 'text-[#44313B]'
            }`}
          >
            “{publicHero.mainQuote || 'From a long-distance spark to right here in my arms'}”
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-6 w-full max-w-xl">
            <div
              className={`w-48 h-48 sm:w-52 sm:h-52 shrink-0 bg-white p-3 rounded-3xl shadow-md border ${
                isAquatic ? 'border-[#90e0ef]' : 'border-[#FBCFE8]'
              }`}
            >
              <div className="w-full h-full rounded-2xl overflow-hidden">
                <SafeImage
                  src={publicHero.heroImageUrl || '/api/seed-asset/hero'}
                  alt="Srishti and Manav keepsake portrait"
                  theme={theme}
                  loading="eager"
                  className="w-full h-full object-cover"
                  placeholderTitle="Srishti & Manav"
                />
              </div>
            </div>

            <div
              className={`flex-1 w-full rounded-2xl p-5 border backdrop-blur-md ${
                isAquatic
                  ? 'bg-white/85 border-[#90e0ef] text-[#03045e]'
                  : 'bg-[#FFF9F2]/90 border-[#FBCFE8] text-[#44313B]'
              }`}
            >
              <p className="text-xs font-semibold uppercase tracking-wider opacity-75">
                Live Relationship Counter
              </p>
              <p
                className={`font-serif text-3xl font-bold mt-1 tabular-nums ${
                  isAquatic ? 'text-[#0077B6]' : 'text-[#BE185D]'
                }`}
              >
                Day {totalDays.toLocaleString()}
              </p>
              <p className="text-xs mt-2 opacity-80 tabular-nums">
                Next daily count in <strong className="font-mono">{countdown.formatted}</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Right: Invite-Only Sanctuary Sign-In Card */}
        <div className="lg:col-span-5">
          <div
            className={`rounded-3xl p-6 sm:p-8 shadow-xl border backdrop-blur-xl ${
              isAquatic
                ? 'bg-white/92 border-[#90e0ef] text-[#03045e]'
                : 'bg-white/92 border-[#FBCFE8] text-[#44313B]'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2
                  className={`font-serif text-2xl font-bold ${
                    isAquatic ? 'text-[#03045e]' : 'text-[#BE185D]'
                  }`}
                >
                  Enter Our Sanctuary
                </h2>
                <p className="text-xs text-[#927C89] mt-0.5">
                  Invite-only space for Srishti &amp; Manav. Private letters &amp; photos stay locked until sign-in.
                </p>
              </div>
              <span
                className={`material-symbols-outlined text-[24px] ${
                  isAquatic ? 'text-[#0077B6]' : 'text-[#EC4899]'
                }`}
              >
                lock
              </span>
            </div>

            {/* Segmented Tab Switcher */}
            <div
              className={`grid grid-cols-3 gap-1 p-1 rounded-xl mb-5 text-xs font-semibold ${
                isAquatic ? 'bg-[#e0fbfc]' : 'bg-[#FFF0F5]'
              }`}
            >
              {(
                [
                  ['login', 'Sign In'],
                  ['activate', 'Invite Code'],
                  ['reset', 'Reset'],
                ] as [AuthTab, string][]
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setTab(id);
                    setError('');
                    setNotice('');
                  }}
                  className={`py-2 rounded-lg transition-all cursor-pointer ${
                    tab === id
                      ? isAquatic
                        ? 'bg-[#0077B6] text-white shadow-xs'
                        : 'bg-white text-[#BE185D] shadow-xs'
                      : 'text-[#927C89] hover:text-[#44313B]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {error && (
              <div
                role="alert"
                className="mb-4 px-3.5 py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-medium"
              >
                {error}
              </div>
            )}
            {notice && (
              <div
                role="status"
                className="mb-4 px-3.5 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium"
              >
                {notice}
              </div>
            )}

            {tab === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5" htmlFor="auth-email">
                    Invited Email
                  </label>
                  <input
                    id="auth-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="manav@srishtimanav.love"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF9F2] border border-[#FBCFE8] text-sm text-[#44313B] focus:outline-none focus:ring-2 focus:ring-[#EC4899]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1.5" htmlFor="auth-password">
                    Passphrase
                  </label>
                  <input
                    id="auth-password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your secret passphrase"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF9F2] border border-[#FBCFE8] text-sm text-[#44313B] focus:outline-none focus:ring-2 focus:ring-[#EC4899]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 rounded-xl text-white text-sm font-semibold shadow-sm transition-all cursor-pointer disabled:opacity-60 ${
                    isAquatic
                      ? 'bg-[#0077B6] hover:bg-[#023e8a]'
                      : 'bg-gradient-to-r from-[#EC4899] to-[#BE185D] hover:opacity-95'
                  }`}
                >
                  {loading ? 'Unlocking Sanctuary...' : 'Unlock Private Space'}
                </button>

                {/* Helpful Member Switcher for Testing Both Accounts */}
                <div className="pt-3 border-t border-black/5">
                  <p className="text-[11px] text-[#927C89] mb-2">
                    Quick-fill invited member credentials (change passphrases anytime in Settings):
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => fillAccount('manav')}
                      className="px-3 py-2 rounded-lg text-xs font-semibold border border-[#FBCFE8] bg-[#FFF7F9] hover:bg-[#FCE7F3] text-[#BE185D] cursor-pointer transition-colors"
                    >
                      Use Manav
                    </button>
                    <button
                      type="button"
                      onClick={() => fillAccount('srishti')}
                      className="px-3 py-2 rounded-lg text-xs font-semibold border border-[#FBCFE8] bg-[#FFF7F9] hover:bg-[#FCE7F3] text-[#BE185D] cursor-pointer transition-colors"
                    >
                      Use Srishti
                    </button>
                  </div>
                </div>
              </form>
            )}

            {tab === 'activate' && (
              <form onSubmit={handleActivate} className="space-y-3.5">
                <p className="text-xs text-[#927C89]">
                  Public registration is disabled. Enter your invited email and partner invite code to claim or reactivate your account.
                </p>
                <div>
                  <label className="block text-xs font-semibold mb-1" htmlFor="act-email">
                    Invited Email
                  </label>
                  <input
                    id="act-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="srishti@srishtimanav.love"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF9F2] border border-[#FBCFE8] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1" htmlFor="act-code">
                    Partner Invite Code
                  </label>
                  <input
                    id="act-code"
                    type="text"
                    required
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    placeholder="SM-2025-SHISHI or SM-2025-MANAV"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF9F2] border border-[#FBCFE8] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1" htmlFor="act-name">
                    Display Name
                  </label>
                  <input
                    id="act-name"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Srishti or Manav"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF9F2] border border-[#FBCFE8] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1" htmlFor="act-pass">
                    Set Passphrase (min 6 chars)
                  </label>
                  <input
                    id="act-pass"
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF9F2] border border-[#FBCFE8] text-sm"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 rounded-xl text-white text-sm font-semibold shadow-sm cursor-pointer ${
                    isAquatic
                      ? 'bg-[#0077B6] hover:bg-[#023e8a]'
                      : 'bg-gradient-to-r from-[#EC4899] to-[#BE185D]'
                  }`}
                >
                  {loading ? 'Verifying Invite...' : 'Activate Invited Account'}
                </button>
              </form>
            )}

            {tab === 'reset' && (
              <form onSubmit={handleReset} className="space-y-3.5">
                <p className="text-xs text-[#927C89]">
                  Verify your invited email and partner invite code to set a new passphrase.
                </p>
                <div>
                  <label className="block text-xs font-semibold mb-1" htmlFor="rst-email">
                    Invited Email
                  </label>
                  <input
                    id="rst-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF9F2] border border-[#FBCFE8] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1" htmlFor="rst-code">
                    Partner Invite Code
                  </label>
                  <input
                    id="rst-code"
                    type="text"
                    required
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    placeholder="SM-2025-MANAV or SM-2025-SHISHI"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF9F2] border border-[#FBCFE8] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1" htmlFor="rst-pass">
                    New Passphrase (min 6 chars)
                  </label>
                  <input
                    id="rst-pass"
                    type="password"
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF9F2] border border-[#FBCFE8] text-sm"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 rounded-xl text-white text-sm font-semibold shadow-sm cursor-pointer ${
                    isAquatic
                      ? 'bg-[#0077B6] hover:bg-[#023e8a]'
                      : 'bg-gradient-to-r from-[#EC4899] to-[#BE185D]'
                  }`}
                >
                  {loading ? 'Updating Passphrase...' : 'Reset Passphrase'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

