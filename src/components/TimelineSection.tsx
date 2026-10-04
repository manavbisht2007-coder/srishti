import React, { useState } from 'react';
import { Milestone, ThemeMode } from '../types';

interface TimelineSectionProps {
  milestones: Milestone[];
  theme?: ThemeMode;
  onAddMilestone: (milestone: Omit<Milestone, 'id'>) => void;
  onEditMilestone: (milestone: Milestone) => void;
  onDeleteMilestone: (id: string) => void;
  onShowerFlowers: () => void;
}

export const TimelineSection: React.FC<TimelineSectionProps> = ({
  milestones,
  theme = 'romantic',
  onAddMilestone,
  onEditMilestone,
  onDeleteMilestone,
  onShowerFlowers,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null);

  const [dateStr, setDateStr] = useState('');
  const [chapterStr, setChapterStr] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [icon, setIcon] = useState('favorite');

  const isAquatic = theme === 'aquatic';

  const openAddModal = () => {
    setEditingMilestone(null);
    setDateStr('');
    setChapterStr(`Chapter ${milestones.length + 1}`);
    setTitle('');
    setDescription('');
    setLocation('');
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
    setIcon(m.icon);
    setShowAddModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    if (editingMilestone) {
      onEditMilestone({
        ...editingMilestone,
        chapter: chapterStr || editingMilestone.chapter,
        date: dateStr || editingMilestone.date,
        title: title.trim(),
        description: description.trim(),
        location: location.trim() || editingMilestone.location,
        icon: icon || editingMilestone.icon,
      });
    } else {
      onAddMilestone({
        chapter: chapterStr || `Chapter ${milestones.length + 1}`,
        date: dateStr || 'Special Memory',
        title: title.trim(),
        description: description.trim(),
        location: location.trim() || 'A Place in Our Hearts',
        icon: icon || 'favorite',
      });
    }

    setShowAddModal(false);
    setEditingMilestone(null);
    onShowerFlowers();
  };

  return (
    <section
      id="our-journey"
      className={`w-full py-16 md:py-24 border-y transition-colors duration-500 relative z-10 ${
        isAquatic
          ? 'bg-[#e0fbfc]/30 border-[#caf0f8]'
          : 'bg-[#f7f3ed]/70 border-[#ffd9dc]/40'
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        <div className="flex flex-col items-center text-center mb-14">
          <span
            className={`text-[11px] font-bold uppercase tracking-widest font-sans ${
              isAquatic ? 'text-[#0077b6]' : 'text-[#735c00]'
            }`}
          >
            {isAquatic ? 'Voyage Log & Milestones' : 'Chapters In Bloom'}
          </span>
          <h2
            className={`font-serif text-[32px] md:text-[38px] mt-1 font-normal ${
              isAquatic ? 'text-[#03045e]' : 'text-[#5d1826]'
            }`}
          >
            {isAquatic ? 'Our Ocean Journey Through Time' : 'Our Journey Through Time'}
          </h2>
          <p className="text-sm md:text-base text-[#544244] max-w-lg mt-2 leading-relaxed">
            The unforgettable stepping stones that brought us from quiet strangers to irreplaceable soulmates.
          </p>

          <button
            type="button"
            onClick={openAddModal}
            className={`mt-4 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold shadow-xs hover:shadow-md border transition-all hover:scale-105 active:scale-95 cursor-pointer ${
              isAquatic
                ? 'bg-white text-[#0077b6] border-[#90e0ef]'
                : 'bg-white text-[#5d1826] border-[#ffd9dc]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px] text-[#735c00]">add_circle</span>
            <span>Add a Chapter to Timeline</span>
          </button>
        </div>

        {/* Timeline Nodes */}
        <div className="relative max-w-4xl mx-auto">
          {/* Connecting Hairline Stem Track */}
          <div
            className={`absolute left-4 md:left-1/2 -translate-x-1/2 top-4 bottom-4 w-0.5 ${
              isAquatic ? 'bg-[#90e0ef]/70' : 'bg-[#d9c1c2]/70'
            }`}
          />

          <div className="space-y-12 relative">
            {milestones.length === 0 ? (
              <div className="text-center py-12 text-[#877274] bg-white/70 rounded-2xl border border-dashed border-[#d9c1c2]">
                <p className="font-serif text-lg">No chapters yet.</p>
                <p className="text-xs mt-1">Click "Add a Chapter to Timeline" above to write your first milestone!</p>
              </div>
            ) : (
              milestones.map((milestone, index) => {
                const isEven = index % 2 === 0;

                return (
                  <div
                    key={milestone.id}
                    className="flex flex-col md:flex-row items-start md:items-center gap-6 group relative"
                  >
                    {/* Left Column */}
                    <div
                      className={`w-full md:w-1/2 pl-12 md:pl-0 ${
                        isEven ? 'md:text-right md:pr-10' : 'md:text-right md:pr-10 order-1 md:order-1'
                      }`}
                    >
                      {isEven ? (
                        <div>
                          <div className="flex items-center justify-start md:justify-end gap-2">
                            <span
                              className={`text-[11px] font-bold tracking-wider uppercase font-sans ${
                                isAquatic ? 'text-[#0077b6]' : 'text-[#735c00]'
                              }`}
                            >
                              {milestone.date} • {milestone.chapter}
                            </span>
                            {/* Edit / Delete Buttons */}
                            <div className="opacity-70 group-hover:opacity-100 transition-opacity inline-flex items-center gap-1">
                              <button
                                onClick={() => openEditModal(milestone)}
                                title="Edit Chapter"
                                className="p-1 hover:text-[#5d1826] cursor-pointer text-[#877274]"
                              >
                                <span className="material-symbols-outlined text-[15px]">edit</span>
                              </button>
                              <button
                                onClick={() => onDeleteMilestone(milestone.id)}
                                title="Delete Chapter"
                                className="p-1 hover:text-red-600 cursor-pointer text-[#877274]"
                              >
                                <span className="material-symbols-outlined text-[15px]">delete</span>
                              </button>
                            </div>
                          </div>
                          <h3
                            className={`font-serif text-[20px] md:text-[22px] font-semibold mt-1 ${
                              isAquatic ? 'text-[#03045e]' : 'text-[#5d1826]'
                            }`}
                          >
                            {milestone.title}
                          </h3>
                          <p className="text-sm md:text-[15px] text-[#544244] mt-1.5 leading-relaxed">
                            {milestone.description}
                          </p>
                        </div>
                      ) : (
                        <div className="hidden md:inline-block px-3.5 py-1.5 bg-[#e6e2dc] rounded-lg text-xs font-semibold text-[#544244] shadow-2xs border border-white/60">
                          {milestone.location}
                        </div>
                      )}
                    </div>

                    {/* Marker Node in Center */}
                    <div
                      className={`absolute left-4 md:left-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-[#ffffff] shadow-md flex items-center justify-center group-hover:scale-125 transition-transform duration-300 z-10 border ${
                        isAquatic ? 'text-[#0077b6] border-[#90e0ef]' : 'text-[#5d1826] border-[#ffd9dc]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px] text-[#735c00]">
                        {milestone.icon}
                      </span>
                    </div>

                    {/* Right Column */}
                    <div
                      className={`w-full md:w-1/2 pl-12 md:pl-10 ${
                        isEven ? '' : 'order-2 md:order-2'
                      }`}
                    >
                      {isEven ? (
                        <div className="inline-block px-3.5 py-1.5 bg-[#e6e2dc] rounded-lg text-xs font-semibold text-[#544244] shadow-2xs border border-white/60">
                          {milestone.location}
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[11px] font-bold tracking-wider uppercase font-sans ${
                                isAquatic ? 'text-[#0077b6]' : 'text-[#735c00]'
                              }`}
                            >
                              {milestone.date} • {milestone.chapter}
                            </span>
                            {/* Edit / Delete Buttons */}
                            <div className="opacity-70 group-hover:opacity-100 transition-opacity inline-flex items-center gap-1">
                              <button
                                onClick={() => openEditModal(milestone)}
                                title="Edit Chapter"
                                className="p-1 hover:text-[#5d1826] cursor-pointer text-[#877274]"
                              >
                                <span className="material-symbols-outlined text-[15px]">edit</span>
                              </button>
                              <button
                                onClick={() => onDeleteMilestone(milestone.id)}
                                title="Delete Chapter"
                                className="p-1 hover:text-red-600 cursor-pointer text-[#877274]"
                              >
                                <span className="material-symbols-outlined text-[15px]">delete</span>
                              </button>
                            </div>
                          </div>
                          <h3
                            className={`font-serif text-[20px] md:text-[22px] font-semibold mt-1 ${
                              isAquatic ? 'text-[#03045e]' : 'text-[#5d1826]'
                            }`}
                          >
                            {milestone.title}
                          </h3>
                          <p className="text-sm md:text-[15px] text-[#544244] mt-1.5 leading-relaxed">
                            {milestone.description}
                          </p>
                          <div className="md:hidden mt-2 inline-block px-3.5 py-1.5 bg-[#e6e2dc] rounded-lg text-xs font-semibold text-[#544244]">
                            {milestone.location}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Add / Edit Chapter Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-[#fdf9f3] rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-[#ffd9dc] relative animate-scale-up">
            <button
              onClick={() => {
                setShowAddModal(false);
                setEditingMilestone(null);
              }}
              className="absolute top-5 right-5 text-[#877274] hover:text-[#5d1826] p-1 rounded-full cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <span className="text-[11px] font-bold text-[#735c00] uppercase tracking-wider font-sans">
              {editingMilestone ? 'Edit Chapter Node' : 'New Memory Node'}
            </span>
            <h3
              className={`font-serif text-2xl font-semibold mb-4 ${
                isAquatic ? 'text-[#03045e]' : 'text-[#5d1826]'
              }`}
            >
              {editingMilestone ? 'Edit Milestone Chapter' : 'Add a Cherished Chapter'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#544244] uppercase mb-1">
                    Date / Time
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. October 2024"
                    value={dateStr}
                    onChange={(e) => setDateStr(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg bg-[#ffffff] border border-[#d9c1c2] focus:border-[#5d1826] outline-none text-[#1c1c18]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#544244] uppercase mb-1">
                    Chapter Name
                  </label>
                  <input
                    type="text"
                    placeholder="Chapter V"
                    value={chapterStr}
                    onChange={(e) => setChapterStr(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg bg-[#ffffff] border border-[#d9c1c2] focus:border-[#5d1826] outline-none text-[#1c1c18]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#544244] uppercase mb-1">
                  Chapter Headline
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Midnight stargazing on the roof"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-[#ffffff] border border-[#d9c1c2] focus:border-[#5d1826] outline-none text-[#1c1c18]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#544244] uppercase mb-1">
                  Story & What Happened
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe that funny, gentle, or emotional moment..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-[#ffffff] border border-[#d9c1c2] focus:border-[#5d1826] outline-none text-[#1c1c18]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#544244] uppercase mb-1">
                  Location Badge
                </label>
                <input
                  type="text"
                  placeholder="e.g. The Pier at Sunrise"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-[#ffffff] border border-[#d9c1c2] focus:border-[#5d1826] outline-none text-[#1c1c18]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#544244] uppercase mb-1">
                  Icon
                </label>
                <div className="flex gap-2 flex-wrap">
                  {['favorite', 'local_florist', 'local_cafe', 'flight', 'beach_access', 'celebration', 'waves', 'sailing', 'pets'].map((ic) => (
                    <button
                      key={ic}
                      type="button"
                      onClick={() => setIcon(ic)}
                      className={`p-2 rounded-lg border text-sm transition-all cursor-pointer ${
                        icon === ic
                          ? isAquatic
                            ? 'border-[#0077b6] bg-[#caf0f8] text-[#0077b6]'
                            : 'border-[#5d1826] bg-[#ffd9dc] text-[#5d1826]'
                          : 'border-[#d9c1c2] bg-white text-[#544244]'
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
                  className="px-4 py-2 rounded-lg text-sm text-[#544244] hover:bg-[#ebe8e2] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 rounded-lg text-white text-sm font-semibold shadow-sm transition-colors cursor-pointer ${
                    isAquatic ? 'bg-[#0077b6] hover:bg-[#023e8a]' : 'bg-[#5d1826] hover:bg-[#7a2e3b]'
                  }`}
                >
                  {editingMilestone ? 'Save Changes' : 'Pin to Journey'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
