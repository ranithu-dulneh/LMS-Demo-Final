import React, { useState, useMemo } from 'react';
import { VideoModule } from '../types';
import { videoModulesData } from '../data/mockData';
import {
  Play,
  Clock,
  Calendar,
  CheckCircle2,
  Video,
  Search,
  Filter,
  Sparkles,
  ChevronDown,
  ChevronUp,
  FileText,
  Radio,
  BookOpen,
  Layers,
  ArrowRight
} from 'lucide-react';

interface VideoModulesViewProps {
  onSelectVideo: (video: VideoModule) => void;
}

export const VideoModulesView: React.FC<VideoModulesViewProps> = ({ onSelectVideo }) => {
  const [selectedMonth, setSelectedMonth] = useState<string>('All');
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedChapterId, setExpandedChapterId] = useState<string | null>(null);

  const months = ['All', 'August', 'July'];

  // Extract unique topics
  const availableTopics = useMemo(() => {
    const topicsSet = new Set<string>();
    videoModulesData.forEach(v => topicsSet.add(v.topic));
    return ['All', ...Array.from(topicsSet)];
  }, []);

  const filteredVideos = useMemo(() => {
    return videoModulesData.filter(v => {
      const matchesMonth = selectedMonth === 'All' || v.month === selectedMonth;
      const matchesTopic = selectedTopic === 'All' || v.topic.toLowerCase().includes(selectedTopic.toLowerCase());
      const matchesSearch =
        searchQuery === '' ||
        v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesMonth && matchesTopic && matchesSearch;
    });
  }, [selectedMonth, selectedTopic, searchQuery]);

  // Featured Spotlight Video
  const featuredVideo = videoModulesData[0];

  return (
    <div className="space-y-12 sm:space-y-16 pb-24 text-left">

      {/* ─────────────────────────────────────────────────────────────
          HERO SECTION: Ambient background glow, badge & massive title
         ───────────────────────────────────────────────────────────── */}
      <section className="relative pt-2 sm:pt-6 overflow-hidden">
        {/* Soft Ambient Radial Background Glow */}
        <div className="absolute top-0 left-1/3 w-[600px] h-[450px] bg-blue-300/20 rounded-full blur-[140px] -z-10 pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[500px] h-[400px] bg-indigo-200/25 rounded-full blur-[120px] -z-10 pointer-events-none" />

        <div className="space-y-6 max-w-4xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span className="uppercase tracking-[0.2em] text-blue-700 font-bold">
              ON-DEMAND REPOSITORY // HD LECTURE MODULES
            </span>
            <span aria-hidden="true">·</span>
            <span>Recorded Theory &amp; Paper Masterclasses</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-[1.12]">
            Comprehensive Video Modules &amp;{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 bg-clip-text text-transparent">
              Topic Breakdowns
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
            Stream high-definition lecture recordings with synchronized chapter indexing and downloadable handouts.
            Designed and instructed by Mrs. Ruwanthi Senanayaka for A/L Commerce scholars across Sri Lanka.
          </p>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            FEATURED QUICK-RESUME SPOTLIGHT BENTO CARD
           ───────────────────────────────────────────────────────────── */}
        <div className="mt-10 p-6 sm:p-8 rounded-[32px] bg-gradient-to-r from-slate-950 via-[#0B1528] to-blue-950 text-white shadow-[0_16px_50px_rgba(15,23,42,0.14)] border border-slate-800 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="relative z-10 space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/70 border border-emerald-500/30">
                <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                <span>UPCOMING &amp; RECENT BROADCAST</span>
              </span>
              <span className="text-xs text-slate-400 font-medium">Session Replay</span>
            </div>

            <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight">
              {featuredVideo.title}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
              {featuredVideo.description}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                <span>{featuredVideo.duration}</span>
              </span>
              <span>·</span>
              <span>{featuredVideo.chapters.length} Chapter Timestamps</span>
              <span>·</span>
              <span className="text-emerald-400 font-bold">1080p HD Studio Master</span>
            </div>
          </div>

          <div className="relative z-10 shrink-0 w-full sm:w-auto flex sm:flex-col items-center justify-end gap-3">
            <button
              onClick={() => onSelectVideo(featuredVideo)}
              className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2.5 active:scale-95 transition-all"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Resume Masterclass</span>
            </button>
            <span className="text-[11px] text-slate-400 text-center hidden sm:block">Replays available 24/7</span>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          FLOATING PILL FILTER CONTROL BAR: Clean Apple-Style Pills
         ───────────────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-2 sm:p-3 bg-white/80 backdrop-blur-2xl border border-slate-200/80 rounded-[28px] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">

          {/* Month & Topic Filters Pill Trays */}
          <div className="flex flex-wrap items-center gap-2">

            {/* Month Filter */}
            <div className="flex items-center gap-1 p-1 bg-slate-100/80 rounded-full border border-slate-200/60 overflow-x-auto no-scrollbar">
              {months.map(m => (
                <button
                  key={m}
                  onClick={() => setSelectedMonth(m)}
                  className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 whitespace-nowrap ${
                    selectedMonth === m
                      ? 'bg-slate-950 text-white shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-white/60'
                  }`}
                >
                  {m} {m !== 'All' ? 'Sessions' : 'All Months'}
                </button>
              ))}
            </div>

            {/* Topic Filter */}
            <div className="flex items-center gap-1 p-1 bg-slate-100/80 rounded-full border border-slate-200/60 overflow-x-auto no-scrollbar">
              {availableTopics.map(t => (
                <button
                  key={t}
                  onClick={() => setSelectedTopic(t)}
                  className={`px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 whitespace-nowrap ${
                    selectedTopic === t
                      ? 'bg-blue-600 text-white shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-white/60'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

          </div>

          {/* Search Bar with ⌘K Hint */}
          <div className="relative min-w-[240px] max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search module title, chapter, topic..."
              className="w-full pl-9 pr-12 py-2 text-xs rounded-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200/80 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 transition-all font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

        </div>

        {/* Quick Result Counter */}
        <div className="flex items-center justify-between px-2 text-xs text-slate-500 font-medium">
          <span>Showing <strong className="text-slate-900">{filteredVideos.length}</strong> masterclass modules</span>
          {(selectedMonth !== 'All' || selectedTopic !== 'All' || searchQuery !== '') && (
            <button
              onClick={() => {
                setSelectedMonth('All');
                setSelectedTopic('All');
                setSearchQuery('');
              }}
              className="text-blue-600 hover:underline font-semibold"
            >
              Reset Filters
            </button>
          )}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          STUDIO-GRADE VIDEO MODULES GRID: Slick rounded cards
         ───────────────────────────────────────────────────────────── */}
      <section>
        {filteredVideos.length === 0 ? (
          <div className="p-12 text-center rounded-[32px] bg-white/80 border border-slate-200/80 space-y-3">
            <Video className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No video modules found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No recorded modules match your selected month, topic, or search query. Try clearing filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => {
              const isExpanded = expandedChapterId === video.id;

              return (
                <div
                  key={video.id}
                  className="rounded-[32px] bg-white/95 backdrop-blur-2xl border border-slate-200/80 shadow-[0_12px_36px_-10px_rgba(15,23,42,0.06)] hover:border-blue-400 hover:shadow-xl transition-all duration-300 group overflow-hidden flex flex-col justify-between"
                >

                  {/* Top Studio Video Thumbnail Banner */}
                  <div
                    onClick={() => onSelectVideo(video)}
                    className="relative h-48 bg-gradient-to-tr from-slate-950 via-slate-900 to-blue-950 p-5 flex flex-col justify-between overflow-hidden cursor-pointer"
                  >
                    {/* Glowing Shimmer Accent */}
                    <div className="absolute top-0 right-0 w-44 h-44 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />

                    {/* Top Badges */}
                    <div className="relative z-10 flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white/10 text-white backdrop-blur-md border border-white/15">
                        {video.month} Session
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold text-emerald-300 bg-emerald-950/60 border border-emerald-500/30">
                        HD 1080p
                      </span>
                    </div>

                    {/* Center Glowing Play Button */}
                    <div className="relative z-10 self-center">
                      <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-blue-600 transition-all duration-200 shadow-xl shadow-black/20">
                        <Play className="w-6 h-6 fill-white ml-0.5" />
                      </div>
                    </div>

                    {/* Bottom Metadata: Live Date & Duration */}
                    <div className="relative z-10 flex items-center justify-between text-xs text-slate-300 font-mono">
                      <span>Broadcast: {video.date}</span>
                      <span className="px-2 py-0.5 rounded-md bg-black/40 text-white text-[11px] font-bold">
                        {video.duration}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 sm:p-7 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-blue-600 uppercase tracking-wider block">
                          {video.topic}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {video.chapters.length} Chapters
                        </span>
                      </div>

                      <h3
                        onClick={() => onSelectVideo(video)}
                        className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-snug cursor-pointer"
                      >
                        {video.title}
                      </h3>

                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                        {video.description}
                      </p>
                    </div>

                    {/* Timestamped Chapters Accordion / Preview */}
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedChapterId(isExpanded ? null : video.id);
                        }}
                        className="w-full flex items-center justify-between text-xs font-semibold text-slate-700 hover:text-slate-950 py-1 transition-colors"
                      >
                        <span className="flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-slate-400" />
                          <span>Key Chapter Indexes</span>
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                        )}
                      </button>

                      {isExpanded ? (
                        <div className="space-y-1.5 pt-1 max-h-44 overflow-y-auto no-scrollbar text-left">
                          {video.chapters.map((ch, idx) => (
                            <div
                              key={idx}
                              onClick={() => onSelectVideo(video)}
                              className="p-2 rounded-xl bg-slate-50 hover:bg-blue-50/70 border border-slate-100 flex items-center justify-between text-xs text-slate-800 transition-colors cursor-pointer"
                            >
                              <span className="truncate pr-2 font-medium">{ch.title}</span>
                              <span className="font-mono text-[10px] text-slate-400 shrink-0 font-bold">{ch.time}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-1.5 pt-0.5">
                          {video.chapters.slice(0, 2).map((ch, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-50 border border-slate-100 text-slate-600 truncate max-w-[200px]"
                            >
                              {ch.title.split('.')[1] || ch.title}
                            </span>
                          ))}
                          {video.chapters.length > 2 && (
                            <span className="text-[10px] font-mono px-1.5 py-0.5 text-slate-400">
                              +{video.chapters.length - 2} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Bottom Action Button */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => onSelectVideo(video)}
                        className="w-full py-2.5 px-4 rounded-full bg-slate-950 hover:bg-blue-600 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 active:scale-95 group-hover:bg-blue-600"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>Watch Module</span>
                      </button>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ─────────────────────────────────────────────────────────────
          STREAMING INFRASTRUCTURE & SYLLABUS GUARANTEE BENTO CARD
         ───────────────────────────────────────────────────────────── */}
      <section className="p-7 sm:p-10 rounded-[32px] bg-gradient-to-r from-slate-950 via-[#0B1528] to-blue-950 text-white shadow-[0_16px_50px_rgba(15,23,42,0.14)] border border-slate-800 relative overflow-hidden">
        {/* Glow & Monogram Watermark */}
        <div className="absolute -top-16 -right-16 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <span className="absolute right-6 bottom-2 text-white/5 font-black text-9xl tracking-tighter select-none font-sans pointer-events-none">
          HD
        </span>

        <div className="relative z-10 space-y-6 max-w-4xl">
          <div className="inline-flex items-center gap-2 text-[11px] font-mono font-bold uppercase tracking-wider text-blue-400 bg-blue-950/70 border border-blue-500/30 px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>ACCELERATED VIDEO MASTERCLASS FEATURES</span>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Studio-Quality Delivery &amp; Chapter Bookmarks
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal max-w-2xl">
              Engineered for seamless revision with interactive features designed specifically for A/L candidates:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-1.5">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-400 block">
                SPEED CONTROLS
              </span>
              <p className="text-xs font-semibold text-white">0.75x to 2.0x Dynamic Playback</p>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Review familiar double-entry concepts at 1.5x speed or slow down during complex partnership adjustments.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-1.5">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 block">
                TIMESTAMPED CHAPTERS
              </span>
              <p className="text-xs font-semibold text-white">Direct Jump to Exam Questions</p>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Skip straight to past examination problem walkthroughs without searching through hours of footage.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-1.5">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-sky-400 block">
                HANDOUT REVIEWS
              </span>
              <p className="text-xs font-semibold text-white">Synchronized Theory Slides</p>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Study notes and LKAS diagrams align directly with the on-screen lecturer explanations.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
