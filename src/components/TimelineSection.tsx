import React, { useState } from 'react';
import { Milestone } from '../types';

interface TimelineSectionProps {
  milestones: Milestone[];
  onAddMilestone: (milestone: Omit<Milestone, 'id'>) => void;
  onShowerFlowers: () => void;
}

export const TimelineSection: React.FC<TimelineSectionProps> = ({
  milestones,
  onAddMilestone,
  onShowerFlowers,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [dateStr, setDateStr] = useState('');
  const [chapterStr, setChapterStr] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [icon, setIcon] = useState('favorite');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    onAddMilestone({
      chapter: chapterStr || `Chapter ${milestones.length + 1}`,
      date: dateStr || 'Special Memory',
      title,
      description,
      location: location || 'A Place in Our Hearts',
      icon: icon || 'favorite',
    });

    setTitle('');
    setDescription('');
    setDateStr('');
    setChapterStr('');
    setLocation('');
    setShowAddModal(false);
    onShowerFlowers();
  };

  return (
    <section id="our-journey" className="w-full bg-[#f7f3ed]/70 py-16 md:py-24 border-y border-[#ffd9dc]/40">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        <div className="flex flex-col items-center text-center mb-14">
          <span className="text-[11px] font-bold text-[#735c00] uppercase tracking-widest font-sans">
            Chapters In Bloom
          </span>
          <h2 className="font-serif text-[32px] md:text-[38px] text-[#5d1826] mt-1 font-normal">
            Our Journey Through Time
          </h2>
          <p className="text-sm md:text-base text-[#544244] max-w-lg mt-2 leading-relaxed">
            The unforgettable stepping stones that brought us from quiet strangers to irreplaceable soulmates.
          </p>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#ffffff] text-[#5d1826] text-xs font-semibold shadow-xs hover:shadow-md border border-[#ffd9dc] transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px] text-[#735c00]">add_circle</span>
            <span>Add a Chapter to Timeline</span>
          </button>
        </div>

        {/* Timeline Nodes */}
        <div className="relative max-w-4xl mx-auto">
          {/* Connecting Hairline Stem Track */}
          <div className="absolute left-4 md:left-1/2 -translate-x-1/2 top-4 bottom-4 w-0.5 bg-[#d9c1c2]/70" />

          <div className="space-y-12 relative">
            {milestones.map((milestone, index) => {
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
                        <span className="text-[11px] font-bold text-[#735c00] tracking-wider uppercase font-sans">
                          {milestone.date} • {milestone.chapter}
                        </span>
                        <h3 className="font-serif text-[20px] md:text-[22px] font-semibold text-[#5d1826] mt-1">
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
                  <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-[#ffffff] shadow-md flex items-center justify-center text-[#5d1826] group-hover:scale-125 transition-transform duration-300 border border-[#ffd9dc] z-10">
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
                        <span className="text-[11px] font-bold text-[#735c00] tracking-wider uppercase font-sans">
                          {milestone.date} • {milestone.chapter}
                        </span>
                        <h3 className="font-serif text-[20px] md:text-[22px] font-semibold text-[#5d1826] mt-1">
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
            })}
          </div>
        </div>
      </div>

      {/* Add Chapter Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-fade-in">
          <div className="bg-[#fdf9f3] rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-[#ffd9dc] relative animate-scale-up">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-5 right-5 text-[#877274] hover:text-[#5d1826] p-1 rounded-full cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <span className="text-[11px] font-bold text-[#735c00] uppercase tracking-wider font-sans">
              New Memory Node
            </span>
            <h3 className="font-serif text-2xl font-semibold text-[#5d1826] mb-4">
              Add a Cherished Chapter
            </h3>

            <form onSubmit={handleCreate} className="space-y-4">
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
                <div className="flex gap-2">
                  {['favorite', 'local_florist', 'local_cafe', 'flight', 'beach_access', 'celebration'].map((ic) => (
                    <button
                      key={ic}
                      type="button"
                      onClick={() => setIcon(ic)}
                      className={`p-2 rounded-lg border text-sm transition-all ${
                        icon === ic
                          ? 'border-[#5d1826] bg-[#ffd9dc] text-[#5d1826]'
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
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg text-sm text-[#544244] hover:bg-[#ebe8e2]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#5d1826] text-white text-sm font-semibold shadow-sm hover:bg-[#7a2e3b] transition-colors"
                >
                  Pin to Journey
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
