import React, { useRef, useState } from 'react';
import { PartnerSummary, ThemeMode, UserProfile, VisibilityMode } from '../types';
import { apiFetch, uploadPrivateImage } from '../utils/api';
import { SafeImage } from './SafeImage';

interface SettingsSectionProps {
  user: UserProfile;
  partners: PartnerSummary[];
  theme: ThemeMode;
  isMusicPlaying: boolean;
  backendStatus: {
    provider: string;
    supabaseConfigured: boolean;
    message: string;
  };
  onToggleTheme: (theme: ThemeMode) => void;
  onToggleMusic: () => void;
  onUpdateProfile: (patch: Partial<UserProfile>) => Promise<void>;
  onLogout: () => void;
  onAccountDeleted: () => void;
  onNotify: (type: 'success' | 'error' | 'info', text: string) => void;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({
  user,
  partners,
  theme,
  isMusicPlaying,
  backendStatus,
  onToggleTheme,
  onToggleMusic,
  onUpdateProfile,
  onLogout,
  onAccountDeleted,
  onNotify,
}) => {
  const [displayName, setDisplayName] = useState(user.displayName);
  const [nickname, setNickname] = useState(user.nickname);
  const [bio, setBio] = useState(user.bio);
  const [birthday, setBirthday] = useState(user.birthday);
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl);
  const [defaultVisibility, setDefaultVisibility] = useState<VisibilityMode>(
    user.defaultVisibility
  );
  const [savingProfile, setSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleting, setDeleting] = useState(false);

  const avatarRef = useRef<HTMLInputElement | null>(null);
  const isAquatic = theme === 'aquatic';
  const headingColor = isAquatic ? 'text-[#03045e]' : 'text-[#BE185D]';
  const mutedText = isAquatic ? 'text-[#0077B6]' : 'text-[#927C89]';
  const cardSurface = isAquatic
    ? 'bg-white/95 border-[#caf0f8] text-[#03045e]'
    : 'bg-white/95 border-[#FBCFE8] text-[#44313B]';

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadPrivateImage(file);
      setAvatarUrl(url);
      await onUpdateProfile({ avatarUrl: url });
      onNotify('success', 'Profile photo updated.');
    } catch (err: any) {
      onNotify('error', err.message || 'Could not upload avatar.');
    }
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await onUpdateProfile({
        displayName,
        nickname,
        bio,
        birthday,
        avatarUrl,
        defaultVisibility,
      });
      onNotify('success', 'Profile and privacy preferences saved.');
    } catch (err: any) {
      onNotify('error', err.message || 'Could not save profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPassword(true);
    try {
      await apiFetch('/api/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      setCurrentPassword('');
      setNewPassword('');
      onNotify('success', 'Your passphrase has been updated.');
    } catch (err: any) {
      onNotify('error', err.message || 'Failed to update passphrase.');
    } finally {
      setSavingPassword(false);
    }
  };

  const handleExportData = async () => {
    try {
      const payload = await apiFetch<string>('/api/account/export');
      const blob = new Blob([typeof payload === 'string' ? payload : JSON.stringify(payload, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `srishti-manav-keepsake-${user.displayName.toLowerCase()}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      onNotify('success', 'Your keepsake archive has been downloaded.');
    } catch (err: any) {
      onNotify('error', err.message || 'Export failed.');
    }
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setDeleting(true);
    try {
      await apiFetch('/api/account', {
        method: 'DELETE',
        body: JSON.stringify({ password: deletePassword }),
      });
      onAccountDeleted();
    } catch (err: any) {
      onNotify('error', err.message || 'Could not delete account.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <section className="max-w-[1000px] mx-auto px-4 md:px-8 py-10 md:py-14 w-full relative z-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className={`text-xs font-semibold uppercase tracking-wider ${mutedText}`}>
            Profile, Privacy &amp; Data
          </p>
          <h1 className={`font-serif text-4xl md:text-5xl mt-1 ${headingColor}`}>
            Sanctuary Settings
          </h1>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 bg-white text-red-700 text-xs font-semibold hover:bg-red-50 cursor-pointer self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-[17px]">logout</span>
          <span>Sign Out ({user.displayName})</span>
        </button>
      </div>

      {/* Members in this Shared Private Space */}
      <div className={`rounded-3xl p-6 border shadow-xs ${cardSurface}`}>
        <h2 className={`font-serif text-2xl font-semibold mb-4 ${headingColor}`}>
          Members in This Private Space
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {partners.map((p) => (
            <div
              key={p.id}
              className="p-4 rounded-2xl border border-black/5 bg-[#FFF9F2] flex items-center gap-3.5"
            >
              <div className="w-12 h-12 rounded-full overflow-hidden bg-[#FCE7F3] shrink-0 flex items-center justify-center font-serif text-xl font-bold text-[#BE185D]">
                {p.avatarUrl ? (
                  <SafeImage
                    src={p.avatarUrl}
                    alt={p.displayName}
                    theme={theme}
                    placeholderTitle={p.displayName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  p.displayName.charAt(0).toUpperCase()
                )}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm truncate">
                  {p.displayName} {p.id === user.id ? '(You)' : ''}
                </p>
                <p className="text-xs text-[#927C89] truncate">{p.nickname}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Profile & Privacy Editing */}
      <form onSubmit={handleProfileSave} className={`rounded-3xl p-6 sm:p-8 border shadow-xs space-y-5 ${cardSurface}`}>
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-black/5">
          <div>
            <h2 className={`font-serif text-2xl font-semibold ${headingColor}`}>
              Profile &amp; Privacy Defaults
            </h2>
            <p className={`text-xs mt-0.5 ${mutedText}`}>{user.email}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => avatarRef.current?.click()}
              className="px-3.5 py-2 rounded-xl border border-[#FBCFE8] bg-[#FFF7F9] text-xs font-semibold cursor-pointer hover:bg-[#FCE7F3]"
            >
              Upload Avatar
            </button>
            <input
              ref={avatarRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={handleAvatarUpload}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold mb-1">Display Name</label>
            <input
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-[#FFF9F2] border border-[#FBCFE8] text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Nickname</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-[#FFF9F2] border border-[#FBCFE8] text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Birthday</label>
            <input
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-[#FFF9F2] border border-[#FBCFE8] text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">
              Default Letter &amp; Journal Visibility
            </label>
            <select
              value={defaultVisibility}
              onChange={(e) => setDefaultVisibility(e.target.value as VisibilityMode)}
              className="w-full px-3.5 py-2 rounded-xl bg-[#FFF9F2] border border-[#FBCFE8] text-sm"
            >
              <option value="shared">Shared with partner</option>
              <option value="private">Private (only me)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1">Short Bio</label>
          <textarea
            rows={2}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-[#FFF9F2] border border-[#FBCFE8] text-sm"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={savingProfile}
            className={`px-6 py-2.5 rounded-xl text-white text-sm font-semibold cursor-pointer ${
              isAquatic ? 'bg-[#0077B6]' : 'bg-[#BE185D]'
            }`}
          >
            {savingProfile ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>

      {/* Theme & Sound Settings */}
      <div className={`rounded-3xl p-6 sm:p-8 border shadow-xs grid grid-cols-1 sm:grid-cols-2 gap-6 ${cardSurface}`}>
        <div>
          <h2 className={`font-serif text-2xl font-semibold mb-2 ${headingColor}`}>Theme</h2>
          <p className={`text-xs mb-4 ${mutedText}`}>
            Your theme choice is saved across visits.
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onToggleTheme('romantic')}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold border cursor-pointer ${
                theme === 'romantic'
                  ? 'bg-gradient-to-r from-[#EC4899] to-[#BE185D] text-white border-transparent'
                  : 'bg-white border-[#FBCFE8]'
              }`}
            >
              🌸 Romantic Pink
            </button>
            <button
              type="button"
              onClick={() => onToggleTheme('aquatic')}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold border cursor-pointer ${
                theme === 'aquatic'
                  ? 'bg-[#0077B6] text-white border-transparent'
                  : 'bg-white border-[#90e0ef]'
              }`}
            >
              🌊 Aquatic Ocean
            </button>
          </div>
        </div>

        <div>
          <h2 className={`font-serif text-2xl font-semibold mb-2 ${headingColor}`}>Sound</h2>
          <p className={`text-xs mb-4 ${mutedText}`}>
            Ambient melodies stay muted by default until you turn them on.
          </p>
          <button
            type="button"
            onClick={onToggleMusic}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold border flex items-center justify-center gap-2 cursor-pointer ${
              isMusicPlaying
                ? isAquatic
                  ? 'bg-[#0077B6] text-white border-[#0077B6]'
                  : 'bg-[#EC4899] text-white border-[#EC4899]'
                : 'bg-[#FFF9F2] border-[#FBCFE8]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {isMusicPlaying ? 'volume_up' : 'volume_off'}
            </span>
            <span>{isMusicPlaying ? 'Ambient Sound: On (Click to Mute)' : 'Ambient Sound: Muted'}</span>
          </button>
        </div>
      </div>

      {/* Password Update */}
      <form onSubmit={handlePasswordChange} className={`rounded-3xl p-6 sm:p-8 border shadow-xs space-y-4 ${cardSurface}`}>
        <h2 className={`font-serif text-2xl font-semibold ${headingColor}`}>
          Account Security &amp; Passphrase
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold mb-1">Current Passphrase</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-[#FFF9F2] border border-[#FBCFE8] text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">New Passphrase (min 6 chars)</label>
            <input
              type="password"
              required
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-[#FFF9F2] border border-[#FBCFE8] text-sm"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={savingPassword}
            className="px-5 py-2 rounded-xl border border-[#FBCFE8] bg-[#FFF7F9] text-xs font-semibold hover:bg-[#FCE7F3] cursor-pointer"
          >
            {savingPassword ? 'Updating...' : 'Update Passphrase'}
          </button>
        </div>
      </form>

      {/* Backend & Supabase Status + Data Export + Account Deletion */}
      <div className={`rounded-3xl p-6 sm:p-8 border shadow-xs space-y-6 ${cardSurface}`}>
        <div>
          <h2 className={`font-serif text-2xl font-semibold mb-1 ${headingColor}`}>
            Backend, Database &amp; Data Management
          </h2>
          <p className="text-xs leading-relaxed opacity-85">{backendStatus.message}</p>
          <p className="text-xs mt-2 opacity-75">
            Supabase Cloud Status:{' '}
            <strong>
              {backendStatus.supabaseConfigured
                ? 'Configured via environment variables'
                : 'Not yet configured (running securely on local Express Sanctuary Server; SQL & RLS policies ready in supabase/schema.sql)'}
            </strong>
          </p>
        </div>

        <div className="pt-4 border-t border-black/10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-sm">Export Your Memories &amp; Data</h3>
            <p className="text-xs opacity-75">
              Download a JSON archive of shared memories, milestones, bucket list, calendar events, and your private letters/journal entries.
            </p>
          </div>
          <button
            type="button"
            onClick={handleExportData}
            className={`px-4 py-2.5 rounded-xl text-white text-xs font-semibold cursor-pointer ${
              isAquatic ? 'bg-[#0077B6]' : 'bg-[#BE185D]'
            }`}
          >
            Download JSON Export
          </button>
        </div>

        <div className="pt-4 border-t border-red-200/70">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-sm text-red-700">Delete / Deactivate Account</h3>
              <p className="text-xs opacity-80 max-w-xl">
                Deactivating your account permanently deletes all of your private letters and private journal entries, removes your profile bio/avatar, and signs you out. Shared memories remain preserved for your partner. You can reclaim your invited account later using your partner invite code.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowDeleteConfirm((v) => !v)}
              className="px-4 py-2.5 rounded-xl border border-red-300 text-red-700 text-xs font-semibold hover:bg-red-50 cursor-pointer"
            >
              {showDeleteConfirm ? 'Cancel' : 'Delete Account'}
            </button>
          </div>

          {showDeleteConfirm && (
            <form onSubmit={handleDeleteAccount} className="mt-4 p-4 rounded-2xl bg-red-50 border border-red-200 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <input
                type="password"
                required
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                placeholder="Enter your passphrase to confirm permanent removal"
                className="flex-1 px-3.5 py-2 rounded-xl bg-white border border-red-200 text-sm text-[#44313B]"
              />
              <button
                type="submit"
                disabled={deleting}
                className="px-5 py-2 rounded-xl bg-red-700 hover:bg-red-800 text-white text-xs font-semibold cursor-pointer"
              >
                {deleting ? 'Removing...' : 'Confirm Account Deletion'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
