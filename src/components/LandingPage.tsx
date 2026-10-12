import React from 'react';
import { ActiveTab, WallOfFameRanker } from '../types';
import { TeacherPortraitCutout } from './TeacherPortraitCutout';
import { TypewriterText } from './TypewriterText';
import { PreviousResultsSection, RankerResultItem } from './PreviousResultsSection';
import { ScrollReveal } from './ScrollReveal';
import {
  ArrowRight,
  RotateCcw,
  FileText,
  BookOpen,
  Scale,
  Zap,
  Video,
  ChevronRight,
  Sparkles,
  Play
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (tab: ActiveTab) => void;
  onOpenEnrollment: () => void;
  onOpenLogin: () => void;
  onSelectRanker: (ranker: WallOfFameRanker) => void;
  teacherImageUrl?: string;
  teacherImageScale?: number;
  resultsData?: RankerResultItem[];
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigate,
  onOpenEnrollment,
  onOpenLogin,
  onSelectRanker,
  teacherImageUrl,
  teacherImageScale,
  resultsData
}) => {
  return (
    <div className="space-y-28 md:space-y-36 pb-32 text-left">

      {/* ─────────────────────────────────────────────────────────────
          HERO SECTION: Clean, spacious, animated with Real Teacher Cutout
          and varied typography (No techy fonts, generous whitespace)
         ───────────────────────────────────────────────────────────── */}
      <section className="relative pt-6 sm:pt-14 pb-12 sm:pb-16 overflow-hidden">

        {/* Soft Ambient Radial Background Glow */}
        <div className="absolute top-1/4 left-1/4 w-[550px] h-[450px] bg-blue-200/20 rounded-full blur-[130px] -z-10 pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[500px] h-[400px] bg-sky-200/20 rounded-full blur-[120px] -z-10 pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-12 lg:grid-cols-12 gap-5 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12 items-center">

          {/* Left Column: Teacher Cutout (Significantly bigger on desktop, prominently visible on mobile & tablet) */}
          <div className="md:col-span-5 lg:col-span-6 flex justify-center order-2 md:order-1 relative w-full">
            <ScrollReveal direction="up" delay={120} duration={850}>
              <TeacherPortraitCutout customImageUrl={teacherImageUrl} customImageScale={teacherImageScale} />
            </ScrollReveal>
          </div>

          {/* Right Column: Scaled down automatically on mobile & tablet to fit neatly on screen */}
          <div className="md:col-span-7 lg:col-span-6 space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-7 order-1 md:order-2">

            {/* Title with Varied Text Styles & Typewriter Animation */}
            <ScrollReveal direction="up" delay={180}>
              <div className="space-y-1 sm:space-y-2 md:space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-slate-500">
                    MEET THE LEAD FACULTY
                  </span>
                </div>

                <h1 className="font-black text-slate-950 tracking-tight leading-[1.2]">
                  <span className="block text-slate-900 font-extrabold text-sm sm:text-base md:text-xl lg:text-3xl">
                    Under a Single Lead Faculty
                  </span>

                  <span className="inline-block mt-0.5 sm:mt-1 bg-gradient-to-r from-amber-500 via-emerald-600 to-teal-700 bg-clip-text text-transparent font-black text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl leading-tight">
                    Producing the Highest{' '}
                    <TypewriterText
                      words={['University Entrants', 'Accounting A Passes', 'Island Ranks']}
                      className="underline decoration-amber-400 decoration-3 sm:decoration-4"
                    />
                    {' '}in Sri Lanka
                  </span>

                  <span className="block text-slate-800 font-bold text-xs sm:text-sm md:text-base lg:text-2xl mt-0.5 sm:mt-1">
                    In a Single Academic Year
                  </span>

                  <span className="block text-emerald-700 font-black text-xs sm:text-sm md:text-base lg:text-2xl mt-0.5 sm:mt-1">
                    Reserve Your Seat in the #1 Accounting Class...
                  </span>
                </h1>
              </div>
            </ScrollReveal>

            {/* 3 Colorful Feature Badges (Compact 3-column grid scaling on mobile & tablet) */}
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5 md:gap-3 lg:gap-3.5 pt-0.5 sm:pt-1 md:pt-2">

              {/* Badge 1: Island First (Cyan/Blue Gradient) */}
              <ScrollReveal direction="up" delay={260}>
                <div className="p-2 sm:p-2.5 md:p-3 lg:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-cyan-500 via-sky-500 to-blue-600 text-white shadow-xs sm:shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col sm:flex-row items-center sm:items-center gap-1 sm:gap-2.5 md:gap-3 h-full cursor-default text-center sm:text-left">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-lg sm:rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-xs sm:text-sm md:text-base shrink-0 font-sans shadow-2xs">
                    1<sup className="text-[8px] sm:text-[10px]">st</sup>
                  </div>
                  <div className="min-w-0">
                    <span className="text-[8px] sm:text-[10px] md:text-[11px] font-semibold text-cyan-100 block truncate">
                      ALL-ISLAND RANK 1
                    </span>
                    <span className="text-[9px] sm:text-[11px] md:text-xs font-bold tracking-tight block">
                      ISLAND FIRST
                    </span>
                  </div>
                </div>
              </ScrollReveal>

              {/* Badge 2: Accounting Mastery Badge (Amber/Gold Gradient - Strictly Accounting) */}
              <ScrollReveal direction="up" delay={340}>
                <div className="p-2 sm:p-2.5 md:p-3 lg:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 shadow-xs sm:shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col sm:flex-row items-center sm:items-center gap-1 sm:gap-2.5 md:gap-3 h-full cursor-default text-center sm:text-left">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-lg sm:rounded-xl bg-white/30 backdrop-blur-md flex items-center justify-center shrink-0 shadow-2xs">
                    <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-slate-950" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[8px] sm:text-[10px] md:text-[11px] font-bold text-amber-950 block">
                      NATION'S NO. 1
                    </span>
                    <span className="text-[9px] sm:text-[11px] md:text-xs font-black tracking-tight block">
                      Accounting Class
                    </span>
                  </div>
                </div>
              </ScrollReveal>

              {/* Badge 3: LKAS Note Badge (Blue Gradient) */}
              <ScrollReveal direction="up" delay={420}>
                <div className="p-2 sm:p-2.5 md:p-3 lg:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-700 to-indigo-800 text-white shadow-xs sm:shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col sm:flex-row items-center sm:items-center gap-1 sm:gap-2.5 md:gap-3 h-full cursor-default text-center sm:text-left">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-lg sm:rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 shadow-2xs">
                    <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[8px] sm:text-[10px] md:text-[11px] font-semibold text-blue-200 block">
                      SRI LANKA'S BEST
                    </span>
                    <span className="text-[9px] sm:text-[11px] md:text-xs font-bold tracking-tight block">
                      LKAS Standards Note
                    </span>
                  </div>
                </div>
              </ScrollReveal>

            </div>

            {/* Pill CTAs scaled responsively */}
            <ScrollReveal direction="up" delay={480}>
              <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 md:gap-3.5 pt-1 sm:pt-2 md:pt-4">
                {/* Signature COURSES ↗ button */}
                <button
                  onClick={() => {
                    const el = document.getElementById('classes');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-3.5 py-1.5 sm:px-4 sm:py-2 md:px-6 md:py-3 text-xs sm:text-sm font-bold text-slate-800 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-full flex items-center gap-2 sm:gap-3 shadow-xs hover:shadow-md transition-all group hover:scale-[1.02]"
                >
                  <span className="tracking-wide">COURSES</span>
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-blue-600 group-hover:bg-blue-700 text-white flex items-center justify-center transition-colors shadow-2xs">
                    <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 -rotate-45" />
                  </div>
                </button>

                <button
                  onClick={onOpenEnrollment}
                  className="px-4 py-2 sm:px-5 sm:py-2.5 md:px-7 md:py-3.5 text-xs sm:text-sm font-bold text-white bg-slate-950 hover:bg-slate-800 rounded-full flex items-center gap-1.5 sm:gap-2 shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Register Now</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>

                <button
                  onClick={onOpenLogin}
                  className="px-3.5 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3.5 text-xs sm:text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-full transition-all shadow-xs"
                >
                  Student Login
                </button>
              </div>
            </ScrollReveal>

          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 2: CLASSES & PROGRAMS (Screenshot 2026-10-07 at 00.11.55.png)
          Clean text hierarchy, generous whitespace, structured programs
         ───────────────────────────────────────────────────────────── */}
      <section id="classes" className="space-y-8">

        {/* Header row */}
        <ScrollReveal direction="up" delay={50}>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                CLASSES &amp; PROGRAMS
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-950">
                Structured Academic Programs &amp; Masterclasses at Inspire Education
              </h2>
            </div>
            <span className="text-xs font-medium text-slate-500 lg:text-right shrink-0">
              05 structured programs designed for A/L Accounting excellence
            </span>
          </div>
        </ScrollReveal>

        {/* Bento Grid Layout with Staggered Entrance Animations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Card 1: Spanning 2 Rows / Prominent Dark - Theory Class */}
          <ScrollReveal direction="up" delay={120} className="lg:row-span-2">
            <div
              onClick={onOpenLogin}
              className="h-full p-8 sm:p-10 rounded-[32px] bg-slate-950 text-white flex flex-col justify-between space-y-8 relative overflow-hidden group cursor-pointer border border-slate-800 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black via-slate-950/80 to-blue-950/30" />

              <div className="relative z-10 space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-400">01</span>
                  <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-emerald-400">
                    <BookOpen className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                  Theory Class
                </h3>

                <p className="text-sm text-slate-300 leading-relaxed">
                  Systematic masterclasses covering foundational concepts and the entire national syllabus with crystal clarity.
                </p>
              </div>

              <div className="relative z-10 pt-8 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold">
                  CORE
                </span>
                <span className="text-xs font-semibold text-slate-300 group-hover:text-white flex items-center gap-1 transition-colors">
                  <span>View Details</span>
                  <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </ScrollReveal>

          {/* Card 2: Revision Classes */}
          <ScrollReveal direction="up" delay={200}>
            <div
              onClick={onOpenLogin}
              className="p-7 sm:p-8 rounded-[32px] bg-white/95 backdrop-blur-xl border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-5 group cursor-pointer hover:border-slate-300 hover:shadow-md hover:-translate-y-1 transition-all duration-300 h-full"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-400">02</span>
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                  <RotateCcw className="w-5 h-5" />
                </div>
              </div>

              <div className="space-y-2.5">
                <h3 className="text-xl font-bold text-slate-950">
                  Revision Classes
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Targeted review sessions reinforcing core exam topics, proven working methodologies, and examination techniques.
                </p>
              </div>

              <div className="pt-2 text-xs font-bold text-blue-700 flex items-center gap-1">
                <span>Explore Schedule</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </ScrollReveal>

          {/* Card 3: Paper Classes */}
          <ScrollReveal direction="up" delay={280}>
            <div
              onClick={onOpenLogin}
              className="p-7 sm:p-8 rounded-[32px] bg-white/95 backdrop-blur-xl border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-5 group cursor-pointer hover:border-slate-300 hover:shadow-md hover:-translate-y-1 transition-all duration-300 h-full"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-400">03</span>
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                  <FileText className="w-5 h-5" />
                </div>
              </div>

              <div className="space-y-2.5">
                <h3 className="text-xl font-bold text-slate-950">
                  Paper Classes
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Weekly timed paper discussions, official marking scheme walkthroughs, and exam time-management mastery.
                </p>
              </div>

              <div className="pt-2 text-xs font-bold text-blue-700 flex items-center gap-1">
                <span>View Papers</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </ScrollReveal>

          {/* Card 5: Fast Track Program (Vibrant Emerald Card) */}
          <ScrollReveal direction="up" delay={360}>
            <div
              onClick={onOpenEnrollment}
              className="p-7 sm:p-8 rounded-[32px] bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex flex-col justify-between space-y-5 group cursor-pointer shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-emerald-100">05</span>
                <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                  <Zap className="w-5 h-5" />
                </div>
              </div>

              <div className="space-y-2.5">
                <h3 className="text-xl font-bold text-white">
                  Fast Track Program
                </h3>
                <p className="text-xs sm:text-sm text-emerald-50 leading-relaxed">
                  An accelerated high-yield sprint designed to elevate academic mastery to island-top standards in record time.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  className="px-5 py-2.5 rounded-full bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all active:scale-95"
                >
                  <span>Learn more</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </ScrollReveal>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 3: PLATFORM ARCHITECTURE - 4 VIBRANT COLOR BLOCKS
          (Four small, punchy blocks in vibrant colors with generous spacing)
         ───────────────────────────────────────────────────────────── */}
      <section className="space-y-8">
        <ScrollReveal direction="up" delay={50}>
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
              PLATFORM ARCHITECTURE
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950">
              Four Core Pillars Built for Academic Mastery
            </h2>
          </div>
        </ScrollReveal>

        {/* 4 Small, Vibrant, Staggered Color Blocks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

          {/* Pillar 1: Blue / Cyan Vibrant Gradient (Past Papers) */}
          <ScrollReveal direction="up" delay={100}>
            <div
              onClick={() => onNavigate('past-papers')}
              className="p-6 rounded-3xl bg-gradient-to-br from-cyan-600 to-blue-700 text-white shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-5 h-full"
            >
              <div className="space-y-2.5">
                <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white leading-tight">
                  Past Papers &amp; Marking Schemes
                </h3>
                <p className="text-xs text-cyan-100 leading-relaxed">
                  10+ Years of archived national papers with structured marking breakdowns.
                </p>
              </div>
              <div className="text-xs font-semibold text-cyan-200 flex items-center justify-between pt-3 border-t border-white/20">
                <span>View Papers Archive</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </ScrollReveal>

          {/* Pillar 2: Indigo / Purple Vibrant Gradient (Live Masterclasses) */}
          <ScrollReveal direction="up" delay={200}>
            <div
              onClick={onOpenLogin}
              className="p-6 rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-700 text-white shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-5 h-full"
            >
              <div className="space-y-2.5">
                <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                  <Video className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white leading-tight">
                  Live Interactive Masterclasses
                </h3>
                <p className="text-xs text-purple-100 leading-relaxed">
                  High-definition hybrid lectures with real-time doubt clarification.
                </p>
              </div>
              <div className="text-xs font-semibold text-purple-200 flex items-center justify-between pt-3 border-t border-white/20">
                <span>Live Portal</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </ScrollReveal>

          {/* Pillar 3: Teal / Emerald Vibrant Gradient (Video Modules) */}
          <ScrollReveal direction="up" delay={300}>
            <div
              onClick={() => onNavigate('videos')}
              className="p-6 rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-5 h-full"
            >
              <div className="space-y-2.5">
                <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                  <Play className="w-5 h-5 fill-white" />
                </div>
                <h3 className="text-base font-bold text-white leading-tight">
                  Topical Video Modules
                </h3>
                <p className="text-xs text-emerald-100 leading-relaxed">
                  Recorded lessons categorized by topic, LKAS standards, and chapters.
                </p>
              </div>
              <div className="text-xs font-semibold text-emerald-200 flex items-center justify-between pt-3 border-t border-white/20">
                <span>Watch Video Modules</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </ScrollReveal>

          {/* Pillar 4: Amber / Rose Vibrant Gradient (Study Materials) */}
          <ScrollReveal direction="up" delay={400}>
            <div
              onClick={() => onNavigate('store')}
              className="p-6 rounded-3xl bg-gradient-to-br from-amber-500 to-rose-600 text-white shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-5 h-full"
            >
              <div className="space-y-2.5">
                <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white leading-tight">
                  Revision Kits &amp; Handbooks
                </h3>
                <p className="text-xs text-amber-100 leading-relaxed">
                  Comprehensive study tutes, model papers, and physical deliveries.
                </p>
              </div>
              <div className="text-xs font-semibold text-amber-200 flex items-center justify-between pt-3 border-t border-white/20">
                <span>Study Store</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </ScrollReveal>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 4: PREVIOUS RESULTS SECTION (Screenshot 2026-10-07 at 00.00.40.png)
         ───────────────────────────────────────────────────────────── */}
      <ScrollReveal direction="up" delay={80}>
        <PreviousResultsSection
          results={resultsData}
          onViewFullRegister={() => onNavigate('results')}
          onWatchHighlight={(item) => {
            onSelectRanker({
              id: item.id,
              rank: item.rankTitle.includes('1') ? 1 : 5,
              name: item.studentName,
              achievement: `${item.rankTitle} - A/L Commerce`,
              year: 2025,
              school: item.school || 'Maliyadeva Balika',
              district: 'Kurunegala',
              zScore: '2.8410',
              quote: 'Unrivalled guidance under Mrs. Ruwanthi Senanayaka.',
              videoDuration: '3:45 min'
            });
          }}
        />
      </ScrollReveal>

    </div>
  );
};
