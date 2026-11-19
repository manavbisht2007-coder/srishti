import React, { useMemo, useRef, useState } from 'react';
import { Milestone, ThemeMode } from '../types';
import { uploadPrivateImage } from '../utils/api';
import { formatReadableDate } from '../utils/dateTracker';
import { SafeImage } from './SafeImage';

interface TimelineSectionProps {
  milestones: Milestone[];
  theme?: ThemeMode;
  onAddMilestone: (milestone: {
    chapter: string;
    date: string;
    displayDate?: string;
    title: string;
    description: string;
    location: string;
    photoUrl?: string;
    icon: string;
  }) => Promise<void>;
  onEditMilestone: (milestone: Milestone) => Promise<void>;
  onDeleteMilestone: (id: string) => Promise<void>;
  onShowerFlowers: () => void;
  onNotify: (type: 'success' | 'error' | 'info', text: string) => void;
}

export const TimelineSection: React.FC<TimelineSectionProps> = ({
  milestones,
  theme = 'romantic',
  onAddMilestone,
  onEditMilestone,
  onDeleteMilestone,
  onShowerFlowers,
  onNotify,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null);

  const [dateStr, setDateStr] = useState(() => new Date().toISOString().slice(0, 10));
  const [chapterStr, setChapterStr] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [icon, setIcon] = useState('favorite');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const photoRef = useRef<HTMLInputElement | null>(null);

  const isAquatic = theme === 'aquatic';

  const sortedMilestones = useMemo(
    () => [...milestones].sort((a, b) => a.date.localeCompare(b.date)),
    [milestones]
  );

  const openAddModal = () => {
    setEditingMilestone(null);
    setDateStr(new Date().toISOString().slice(0, 10));
    setChapterStr(`Chapter ${milestones.length + 1}`);
    setTitle('');
    setDescription('');
    setLocation('');
    setPhotoUrl('');
    setIcon('favorite');
    setShowAddModal(true);
  };

  const openEditModal = (m: Milestone) => {
    setEditingMilestone(m);
    setDateStr(m.date);
    setChapterStr(m.chapter);
    setTitle(m.title);
    setDescription(m.description);
    setLocation(m.location);
    setPhotoUrl(m.photoUrl || '');
    setIcon(m.icon || 'favorite');
    setShowAddModal(true);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
    try {
      const url = await uploadPrivateImage(file);
      setPhotoUrl(url);
      onNotify('success', 'Milestone photo uploaded.');
    } catch (err: any) {
      onNotify('error', err.message || 'Could not upload photo.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    try {
      if (editingMilestone) {
        await onEditMilestone({
          ...editingMilestone,
          chapter: chapterStr.trim() || editingMilestone.chapter,
          date: dateStr || editingMilestone.date,
          displayDate: formatReadableDate(dateStr || editingMilestone.date),
          title: title.trim(),
          description: description.trim(),
          location: location.trim(),
          photoUrl: photoUrl.trim(),
          icon,
        });
        onNotify('success', 'Milestone updated.');
      } else {
        await onAddMilestone({
          chapter: chapterStr.trim() || `Chapter ${milestones.length + 1}`,
          date: dateStr,
          displayDate: formatReadableDate(dateStr),
          title: title.trim(),
          description: description.trim(),
          location: location.trim(),
          photoUrl: photoUrl.trim(),
          icon,
        });
        onNotify('success', 'New chapter added to Our Story.');
        onShowerFlowers();
      }
      setShowAddModal(false);
      setEditingMilestone(null);
    } catch (err: any) {
      onNotify('error', err.message || 'Could not save milestone.');
    }
  };

  const headingColor = isAquatic ? 'text-[#03045e]' : 'text-[#BE185D]';
  const mutedText = isAquatic ? 'text-[#0077B6]' : 'text-[#927C89]';

  return (
    <section className="max-w-[1100px] mx-auto px-4 md:px-8 py-10 md:py-14 w-full relative z-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <p className={`text-xs font-semibold uppercase tracking-wider ${mutedText}`}>
            Our Story Timeline · <span className="tabular-nums">{sortedMilestones.length}</span> Chapters
          </p>
          <h1 className={`font-serif text-4xl md:text-5xl mt-1 ${headingColor}`}>
            Every Chapter Together
          </h1>
          <p className={`text-sm md:text-base mt-2 max-w-xl ${mutedText}`}>
            Chronological milestones from our very first spark to every promise ahead.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white shadow-sm cursor-pointer min-h-[44px] shrink-0 ${
            isAquatic
              ? 'bg-[#0077B6]'
              : 'bg-gradient-to-r from-[#EC4899] to-[#BE185D]'
          }`}
        >
          <span className="material-symbols-outlined text-[19px]">add_circle</span>
          <span>Add Milestone</span>
        </button>
      </div>

      {/* Chronological Vertical Timeline */}
      <div className="relative">
        <div
          className={`absolute left-5 md:left-1/2 md:-translate-x-1/2 top-4 bottom-4 w-0.5 ${
            isAquatic ? 'bg-[#90e0ef]' : 'bg-[#FBCFE8]'
          }`}
        />

        {sortedMilestones.length === 0 ? (
          <div className="bg-white/90 rounded-3xl p-12 text-center border border-dashed border-[#FBCFE8]">
            <p className="font-serif text-2xl">No chapters written yet.</p>
            <p className="text-sm text-[#927C89] mt-1">
              Click “Add Milestone” to record your first shared chapter.
            </p>
          </div>
        ) : (
          <div className="space-y-10 relative">
            {sortedMilestones.map((m, idx) => {
              const isLeft = idx % 2 === 0;
              return (
                <div
                  key={m.id}
                  className="relative flex flex-col md:flex-row items-start md:items-center gap-6"
                >
                  {/* Center Icon Marker */}
                  <div
                    className={`absolute left-5 md:left-1/2 -translate-x-1/2 top-6 md:top-1/2 md:-translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-md border flex items-center justify-center z-10 ${
                      isAquatic
                        ? 'text-[#0077B6] border-[#90e0ef]'
                        : 'text-[#EC4899] border-[#FBCFE8]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[19px]">{m.icon || 'favorite'}</span>
                  </div>

                  {/* Card */}
                  <div
                    className={`w-full md:w-[calc(50%-2.5rem)] pl-14 md:pl-0 ${
                      isLeft ? 'md:mr-auto' : 'md:ml-auto'
                    }`}
                  >
                    <article
                      className={`bg-white/95 rounded-2xl p-5 sm:p-6 border shadow-sm hover:shadow-md transition-all group ${
                        isAquatic ? 'border-[#caf0f8] text-[#03045e]' : 'border-[#FBCFE8] text-[#44313B]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className={`text-xs font-semibold ${mutedText}`}>
                          {m.chapter} · {m.displayDate || formatReadableDate(m.date)}
                        </span>
                        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                          <button
                            type="button"
                            onClick={() => openEditModal(m)}
                            aria-label={`Edit ${m.title}`}
                            className="p-1.5 rounded-lg hover:bg-black/5 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[16px]">edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteMilestone(m.id)}
                            aria-label={`Delete ${m.title}`}
                            className="p-1.5 rounded-lg hover:bg-red-50 hover:text-red-600 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[16px]">delete</span>
                          </button>
                        </div>
                      </div>

                      <h3 className={`font-serif text-2xl font-semibold mb-2 ${headingColor}`}>
                        {m.title}
                      </h3>

                      {m.photoUrl && (
                        <div className="w-full aspect-[16/10] rounded-xl overflow-hidden mb-3 bg-[#FFF0F5]">
                          <SafeImage
                            src={m.photoUrl}
                            alt={m.title}
                            theme={theme}
                            placeholderTitle={m.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      <p className="text-sm leading-relaxed">{m.description}</p>

                      <div className={`mt-3 pt-3 border-t border-black/5 flex items-center justify-between text-xs ${mutedText}`}>
                        <span>{m.location || 'Our World'}</span>
                        <span>Added by {m.authorName}</span>
                      </div>
                    </article>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add / Edit Milestone Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-xs animate-fade-in">
          <div className="bg-[#FFF9F2] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-[#FBCFE8] relative animate-scale-up max-h-[92vh] overflow-y-auto text-[#44313B]">
            <button
              type="button"
              onClick={() => {
                setShowAddModal(false);
                setEditingMilestone(null);
              }}
              aria-label="Close milestone dialog"
              className="absolute top-5 right-5 text-[#927C89] hover:text-[#44313B] p-1 rounded-full cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <h2 className={`font-serif text-2xl font-semibold mb-4 ${headingColor}`}>
              {editingMilestone ? 'Edit Story Milestone' : 'Add New Milestone'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={dateStr}
                    onChange={(e) => setDateStr(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#FBCFE8] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Chapter</label>
                  <input
                    type="text"
                    placeholder="Chapter V"
                    value={chapterStr}
                    onChange={(e) => setChapterStr(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#FBCFE8] text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. First Monsoon Coffee Together"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#FBCFE8] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Description *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="What happened in this chapter?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#FBCFE8] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Optional Location</label>
                <input
                  type="text"
                  placeholder="e.g. Udaipur Lakeside"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#FBCFE8] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Optional Photo</label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => photoRef.current?.click()}
                    disabled={uploadingPhoto}
                    className="px-3.5 py-2 rounded-xl bg-white border border-[#FBCFE8] text-xs font-semibold cursor-pointer hover:bg-[#FFF0F5]"
                  >
                    {uploadingPhoto ? 'Uploading...' : 'Upload Photo'}
                  </button>
                  {photoUrl && (
                    <button
                      type="button"
                      onClick={() => setPhotoUrl('')}
                      className="text-xs text-red-600 hover:underline cursor-pointer"
                    >
                      Remove Photo
                    </button>
                  )}
                  <input
                    ref={photoRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Icon</label>
                <div className="flex gap-2 flex-wrap">
                  {[
                    'favorite',
                    'local_cafe',
                    'flight',
                    'celebration',
                    'local_florist',
                    'waves',
                    'auto_stories',
                  ].map((ic) => (
                    <button
                      key={ic}
                      type="button"
                      onClick={() => setIcon(ic)}
                      className={`p-2 rounded-xl border cursor-pointer ${
                        icon === ic
                          ? isAquatic
                            ? 'border-[#0077B6] bg-[#caf0f8] text-[#0077B6]'
                            : 'border-[#BE185D] bg-[#FCE7F3] text-[#BE185D]'
                          : 'border-[#FBCFE8] bg-white'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">{ic}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingMilestone(null);
                  }}
                  className="px-4 py-2 rounded-xl text-sm text-[#927C89] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 rounded-xl text-white text-sm font-semibold cursor-pointer ${
                    isAquatic ? 'bg-[#0077B6]' : 'bg-[#BE185D]'
                  }`}
                >
                  {editingMilestone ? 'Save Changes' : 'Add to Story'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
