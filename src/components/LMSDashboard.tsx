import React, { useState, useMemo } from 'react';
import { CurrentUser, VideoModule, PastPaper, StudyMaterial, Medium } from '../types';
import { videoModulesData, pastPapersData, studyMaterialsData } from '../data/mockData';
import { ModulePaymentModal, UnlockedModule } from './ModulePaymentModal';
import { InspireLogo } from './InspireLogo';
import {
  Search,
  Play,
  BookOpen,
  FileText,
  Layers,
  Video,
  ChevronRight,
  Bell,
  ShoppingBag,
  Lock,
  ArrowRight,
  ArrowLeft,
  X,
  Sparkles,
  Calendar,
  Clock,
  MoreHorizontal,
  Compass,
  Radio,
  Download,
  Filter,
  CheckCircle2,
  Star,
  SlidersHorizontal
} from 'lucide-react';

interface LMSDashboardProps {
  currentUser: CurrentUser;
  onSelectVideo: (video: VideoModule) => void;
  onSelectPaper: (paper: PastPaper) => void;
  onAddToCart: (material: StudyMaterial) => void;
  onNavigate: (tab: any) => void;
  overrideCourses?: any[];
  overrideVideos?: VideoModule[];
}

type LMSSidebarItem =
  | 'my-lessons'
  | 'al-2028'
  | 'al-2027'
  | 'al-2026'
  | 'al-video-modules'
  | 'git'
  | 'ol-courses'
  | 'paper-class'
  | 'tutes'
  | 'past-papers';

interface MonthlyVideoItem {
  id: string;
  lessonNo: string;
  title: string;
  subtitle: string;
  description: string;
  duration: string;
  date: string;
  topic: string;
  chapters: { title: string; time: string }[];
  notesSummary: string[];
}

export const LMSDashboard: React.FC<LMSDashboardProps> = ({
  currentUser,
  onSelectVideo,
  onSelectPaper,
  onAddToCart,
  onNavigate,
  overrideCourses,
  overrideVideos
}) => {
  const [activeSidebar, setActiveSidebar] = useState<LMSSidebarItem>('my-lessons');
  const [sidebarSearch, setSidebarSearch] = useState<string>('');
  const [selectedTopicFilter, setSelectedTopicFilter] = useState<string>('all');
  const [selectedPaymentModule, setSelectedPaymentModule] = useState<UnlockedModule | null>(null);

  // Past Papers Search & Filter State inside LMS
  const [paperSearch, setPaperSearch] = useState<string>('');
  const [paperMedium, setPaperMedium] = useState<'all' | Medium>('all');
  const [paperCategory, setPaperCategory] = useState<string>('all');
  const [paperYear, setPaperYear] = useState<string>('all');
  const [downloadingPaperId, setDownloadingPaperId] = useState<string | null>(null);

  // Video Modules Search & Filter State inside LMS
  const [videoSearch, setVideoSearch] = useState<string>('');
  const [videoTopicFilter, setVideoTopicFilter] = useState<string>('all');
  const [expandedVideoId, setExpandedVideoId] = useState<string | null>(null);
  const [expandedNotesId, setExpandedNotesId] = useState<string | null>(null);

  // Tutes & Study Materials Search & Filter State inside LMS
  const [tuteSearch, setTuteSearch] = useState<string>('');
  const [tuteCategoryFilter, setTuteCategoryFilter] = useState<string>('all');
  const [tuteBatchFilter, setTuteBatchFilter] = useState<string>('all');
  const [downloadingTuteId, setDownloadingTuteId] = useState<string | null>(null);

  // Month detail navigation: when a user clicks 'Visit' inside an A/L batch month
  const [selectedMonthId, setSelectedMonthId] = useState<string | null>(null);

  // Mobile sidebar drawer state: retracts to 3 dots (•••) and slides from left
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState<boolean>(false);

  // Available monthly modules
  // Available monthly modules
  const [monthlyModules, setMonthlyModules] = useState<UnlockedModule[]>(overrideCourses && overrideCourses.length > 0 ? overrideCourses : [
    {
      id: 'mod-2027-sep',
      batch: 'A/L 2027',
      month: 'September',
      title: '2027 Revision - September (Partnership Accounts)',
      priceLKR: 3000,
      description: '2027 Live Theory Masterclass held every Thursday from 3:30 PM to 6:00 PM. Includes in-depth past paper review and on-demand replay access anytime.',
      isUnlocked: true,
      videoCount: 4,
      tuteCount: 2
    },
    {
      id: 'mod-2027-aug',
      batch: 'A/L 2027',
      month: 'August',
      title: 'August Month Lesson - (Financial Statements & LKAS 01)',
      priceLKR: 3000,
      description: '2027 Live Theory Masterclass and revisions. High-definition recorded sessions and study handouts unlocked upon course activation.',
      isUnlocked: true,
      videoCount: 4,
      tuteCount: 1
    },
    {
      id: 'mod-2027-jul',
      batch: 'A/L 2027',
      month: 'July',
      title: 'July Month Lesson - (Double Entry Principles & Adjustments)',
      priceLKR: 3000,
      description: 'Comprehensive theoretical breakdown of double-entry bookkeeping, trial balance reconciliations, and year-end financial adjustments.',
      isUnlocked: true,
      videoCount: 4,
      tuteCount: 2
    },
    {
      id: 'mod-2027-oct',
      batch: 'A/L 2027',
      month: 'October',
      title: 'October Month Masterclass - (LKAS 02 Inventories & Manufacturing Accounts)',
      priceLKR: 3000,
      description: 'Specialized masterclass series covering manufacturing accounts and LKAS 02 Inventories valuation standards.',
      isUnlocked: false,
      videoCount: 4,
      tuteCount: 2
    },
    {
      id: 'mod-2028-oct',
      batch: 'A/L 2028',
      month: 'October',
      title: 'October Month Lesson - Number Systems & Accounting Intro',
      priceLKR: 3000,
      description: '2028 Foundation Live Class held every Tuesday from 7:00 PM to 9:00 PM. Full on-demand replay accessible 24/7.',
      isUnlocked: false,
      videoCount: 4,
      tuteCount: 1
    },
    {
      id: 'mod-2028-sep',
      batch: 'A/L 2028',
      month: 'September',
      title: 'September Month Lesson - Accounting Equations & Double Entry',
      priceLKR: 3000,
      description: '2028 Foundation Live Class held every Tuesday from 7:00 PM to 9:00 PM. Full live session replay available anytime.',
      isUnlocked: true,
      videoCount: 4,
      tuteCount: 1
    },
    {
      id: 'mod-2026-sprint',
      batch: 'A/L 2026',
      month: 'Final Sprint',
      title: '2026 Intensive Paper Class & Model Discussion',
      priceLKR: 3500,
      description: 'Fast-paced revision and comprehensive model paper walkthrough engineered specifically for the 2026 National Examination.',
      isUnlocked: true,
      videoCount: 6,
      tuteCount: 3
    }
  ]);

  // Specific videos available inside months when students visit a month
  const monthlyVideosMap: Record<string, MonthlyVideoItem[]> = {
    'mod-2027-sep': [
      {
        id: 'v-2027-sep-01',
        lessonNo: 'Lesson 01',
        title: 'Partnership Act 1890 Provisions, Capital & Current Accounts',
        subtitle: 'Foundation principles, capital ratios vs profit sharing, and opening ledger setups',
        description: 'Full practical discussion on partnership deeds, Partnership Act 1890 statutory provisions, and fixed vs fluctuating capital account architectures.',
        duration: '1h 48m',
        date: 'Sep 04, 2025',
        topic: 'Partnership Accounts',
        chapters: [
          { title: '01. 1890 Partnership Act Statutory Provisions', time: '00:00' },
          { title: '02. Fixed vs Fluctuating Capital Architecture', time: '24:10' },
          { title: '03. Profit & Loss Appropriation Schedule', time: '52:15' },
          { title: '04. Worked Illustration with Current Account Balances', time: '1:20:00' }
        ],
        notesSummary: [
          'In the absence of an agreement, profits and losses are shared equally.',
          'Partners are not entitled to interest on capital unless expressly agreed.',
          'Interest at 5% per annum is payable on partner advances/loans.'
        ]
      },
      {
        id: 'v-2027-sep-02',
        lessonNo: 'Lesson 02',
        title: 'Goodwill Valuation & Admission of a New Partner',
        subtitle: 'Super-profit formula, goodwill adjustments, and revaluation on entry',
        description: 'Exam-focused drills on goodwill calculation upon partner admission, opening and closing of goodwill accounts, and revaluation adjustments.',
        duration: '1h 55m',
        date: 'Sep 11, 2025',
        topic: 'Goodwill & Admission',
        chapters: [
          { title: '01. Why Goodwill Arises upon Partner Admission', time: '00:00' },
          { title: '02. Super Profits & Capitalisation Calculation Rules', time: '28:30' },
          { title: '03. Ledger Adjustments without Retaining Goodwill Account', time: '58:00' },
          { title: '04. Comprehensive Admission Drill with Past Exam Question', time: '1:26:40' }
        ],
        notesSummary: [
          'Goodwill must only be recognized in accounts if acquired or temporarily adjusted.',
          'Sacrificing ratio governs how existing partners share incoming partner contribution.'
        ]
      },
      {
        id: 'v-2027-sep-03',
        lessonNo: 'Lesson 03',
        title: 'Revaluation Account & Retirement of a Partner',
        subtitle: 'Asset & liability revaluation, settlement of retiring partner balances',
        description: 'Asset and liability revaluations upon partner retirement, profit/loss appropriation, and retiring partner loan settlement terms.',
        duration: '2h 10m',
        date: 'Sep 18, 2025',
        topic: 'Revaluation & Retirement',
        chapters: [
          { title: '01. Revaluation Account Double-Entry Mechanism', time: '00:00' },
          { title: '02. Provision for Depreciation and Bad Debts Revaluation', time: '36:15' },
          { title: '03. Retiring Partner Loan Account Settlement Terms', time: '1:10:00' },
          { title: '04. Complete Balance Sheet after Partner Departure', time: '1:45:10' }
        ],
        notesSummary: [
          'Revaluation profit/loss is distributed among all partners in their old profit-sharing ratio.',
          'Retiring partner share may be transferred to a loan account bearing commercial interest.'
        ]
      },
      {
        id: 'v-2027-sep-04',
        lessonNo: 'Lesson 04',
        title: 'Dissolution of Partnership & National Exam Model Walkthrough',
        subtitle: 'Realisation account, settlement order under Section 44, and model paper review',
        description: 'Partnership dissolution mechanics, realization accounts, statutory priority order under Section 44, and national model paper discussion.',
        duration: '1h 42m',
        date: 'Sep 25, 2025',
        topic: 'Dissolution & Past Papers',
        chapters: [
          { title: '01. Dissolution Mechanics: Realisation Account Opening', time: '00:00' },
          { title: '02. Section 44 Priority Order in Settling Liabilities', time: '26:50' },
          { title: '03. Garner v Murray Rule & Partner Deficiencies', time: '55:10' },
          { title: '04. Full 2024 National Exam Essay Question Discussion', time: '1:18:00' }
        ],
        notesSummary: [
          'External liabilities must be settled prior to partner loans or capital payouts.',
          'Piecemeal realization ensures no overpayment before all assets are liquidated.'
        ]
      }
    ],
    'mod-2027-aug': [
      {
        id: 'v-2027-aug-01',
        lessonNo: 'Lesson 01',
        title: 'Financial Statements Framework & LKAS 01 Standards',
        subtitle: 'Presentation of financial statements, statement of comprehensive income',
        description: 'Standardized reporting framework for Statement of Comprehensive Income and Financial Position under LKAS 01.',
        duration: '1h 50m',
        date: 'Aug 07, 2025',
        topic: 'LKAS 01 Financial Reporting',
        chapters: [
          { title: '01. Purpose and Scope of LKAS 01 Standard', time: '00:00' },
          { title: '02. Statement of Profit or Loss Classification by Nature vs Function', time: '30:00' },
          { title: '03. Other Comprehensive Income (OCI) Components', time: '1:05:00' }
        ],
        notesSummary: ['Expenses can be presented either by nature or by function based on operational clarity.']
      },
      {
        id: 'v-2027-aug-02',
        lessonNo: 'Lesson 02',
        title: 'Statement of Financial Position (Balance Sheet) & Disclosures',
        subtitle: 'Current vs non-current assets, equity layout, and note structures',
        description: 'Segregation of current vs non-current assets and liabilities, and compilation of mandatory financial statement disclosures.',
        duration: '2h 05m',
        date: 'Aug 14, 2025',
        topic: 'LKAS 01 Balance Sheet',
        chapters: [
          { title: '01. Current vs Non-Current Asset Segregation Criteria', time: '00:00' },
          { title: '02. Equity and Reserve Classifications', time: '40:00' },
          { title: '03. Mandatory Note Disclosures for Examination Questions', time: '1:20:00' }
        ],
        notesSummary: ['Operating cycle rule defines current asset status for inventory and trade debtors.']
      }
    ]
  };

  React.useEffect(() => {
    if (overrideCourses && overrideCourses.length > 0) {
      setMonthlyModules(overrideCourses);
    }
  }, [overrideCourses]);

  const handleUnlockSuccess = (moduleId: string) => {
    setMonthlyModules(prev =>
      prev.map(m => m.id === moduleId ? { ...m, isUnlocked: true } : m)
    );
  };

  const sidebarPrimaryLinks: { id: LMSSidebarItem; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'my-lessons', label: 'My Lessons', icon: Play },
    { id: 'al-2028', label: 'A/L 2028 Batch', icon: BookOpen },
    { id: 'al-2027', label: 'A/L 2027 Batch', icon: BookOpen },
    { id: 'al-2026', label: 'A/L 2026 Sprint', icon: BookOpen },
  ];

  const sidebarResourceLinks: { id: LMSSidebarItem; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'al-video-modules', label: 'All Lecture Modules', icon: Video },
    { id: 'past-papers', label: 'Past Papers Library', icon: FileText },
    { id: 'tutes', label: 'Study Tutes & Notes', icon: BookOpen },
    { id: 'paper-class', label: 'Paper Class Archives', icon: FileText },
    { id: 'git', label: 'General IT (GIT)', icon: Layers },
    { id: 'ol-courses', label: 'O/L Commerce', icon: Compass },
  ];

  // When a student selects a specific video inside a monthly batch
  const handleLaunchMonthlyVideo = (item: MonthlyVideoItem) => {
    const convertedVideo: VideoModule = {
      id: item.id,
      title: item.title,
      subtitle: item.subtitle,
      description: item.description,
      duration: item.duration,
      date: item.date,
      month: selectedMonthModule ? selectedMonthModule.month : 'September',
      topic: item.topic,
      thumbnailGradient: 'from-blue-600/30 to-indigo-600/20',
      chapters: item.chapters,
      notesSummary: item.notesSummary
    };
    onSelectVideo(convertedVideo);
  };

  const selectedMonthModule = monthlyModules.find(m => m.id === selectedMonthId);
  const selectedMonthVideos = selectedMonthId ? (monthlyVideosMap[selectedMonthId] || monthlyVideosMap['mod-2027-sep']) : [];

  // Filter lessons for my-lessons based on sidebar search and selected topic
  const filteredVideoLessons = useMemo(() => {
    const sourceData = overrideVideos && overrideVideos.length > 0 ? overrideVideos : videoModulesData;
    return sourceData.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(sidebarSearch.toLowerCase()) ||
        item.topic.toLowerCase().includes(sidebarSearch.toLowerCase()) ||
        item.description.toLowerCase().includes(sidebarSearch.toLowerCase());

      const matchesTopic =
        selectedTopicFilter === 'all' ||
        item.topic.toLowerCase().includes(selectedTopicFilter.toLowerCase());

      return matchesSearch && matchesTopic;
    });
  }, [sidebarSearch, selectedTopicFilter]);

  // Download simulator for past papers inside LMS
  const handleDownloadPaper = (paper: PastPaper) => {
    setDownloadingPaperId(paper.id);
    setTimeout(() => {
      setDownloadingPaperId(null);
      const link = document.createElement('a');
      link.href = '#';
      link.setAttribute('download', `${paper.title.replace(/\s+/g, '_')}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 700);
  };

  // Download simulator for free tutes inside LMS
  const handleDownloadTute = (tute: StudyMaterial) => {
    setDownloadingTuteId(tute.id);
    setTimeout(() => {
      setDownloadingTuteId(null);
      const link = document.createElement('a');
      link.href = '#';
      link.setAttribute('download', `${tute.title.replace(/\s+/g, '_')}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 700);
  };

  // Filtered Past Papers for LMS past-papers view
  const filteredPastPapers = useMemo(() => {
    return pastPapersData.filter((paper) => {
      const matchesSearch =
        paper.title.toLowerCase().includes(paperSearch.toLowerCase()) ||
        paper.subtitle.toLowerCase().includes(paperSearch.toLowerCase()) ||
        paper.year.toString().includes(paperSearch);

      const matchesMedium = paperMedium === 'all' || paper.medium === paperMedium;
      const matchesYear = paperYear === 'all' || paper.year.toString() === paperYear;
      const matchesCategory = paperCategory === 'all' ||
        (paperCategory === 'marking' && paper.hasMarkingScheme) ||
        (paperCategory === 'national' && paper.category === 'Final Exam') ||
        (paperCategory === 'model' && paper.category === 'Model Paper');

      return matchesSearch && matchesMedium && matchesYear && matchesCategory;
    });
  }, [paperSearch, paperMedium, paperYear, paperCategory]);

  // Filtered Video Modules for LMS catalog view
  const filteredCatalogVideos = useMemo(() => {
    const sourceData = overrideVideos && overrideVideos.length > 0 ? overrideVideos : videoModulesData;
    return sourceData.filter((video) => {
      const matchesSearch =
        video.title.toLowerCase().includes(videoSearch.toLowerCase()) ||
        video.topic.toLowerCase().includes(videoSearch.toLowerCase()) ||
        video.description.toLowerCase().includes(videoSearch.toLowerCase());

      const matchesTopic = videoTopicFilter === 'all' || video.topic.toLowerCase().includes(videoTopicFilter.toLowerCase());

      return matchesSearch && matchesTopic;
    });
  }, [videoSearch, videoTopicFilter]);

  // Filtered Study Materials for LMS tutes view
  const filteredTutes = useMemo(() => {
    return studyMaterialsData.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(tuteSearch.toLowerCase()) ||
        item.description.toLowerCase().includes(tuteSearch.toLowerCase()) ||
        item.batchTag.toLowerCase().includes(tuteSearch.toLowerCase());

      const matchesCategory =
        tuteCategoryFilter === 'all' ||
        (tuteCategoryFilter === 'free' && item.isFree) ||
        item.category.toLowerCase().replace(/\s+/g, '-').includes(tuteCategoryFilter.toLowerCase());

      const matchesBatch = tuteBatchFilter === 'all' || item.batchTag.includes(tuteBatchFilter);

      return matchesSearch && matchesCategory && matchesBatch;
    });
  }, [tuteSearch, tuteCategoryFilter, tuteBatchFilter]);

  // Reusable Sidebar Nav Content (used for both desktop column & mobile slide-out drawer)
  const renderSidebarContent = (isMobile: boolean = false) => (
    <div className="space-y-5 text-left h-full flex flex-col justify-between">
      <div className="space-y-4">
        {/* Header with Inspire Logo */}
        <div className="pb-3 border-b border-slate-100/80 flex items-center justify-between">
          <InspireLogo size="sm" />
          {isMobile && (
            <button
              onClick={() => setIsMobileDrawerOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              title="Close drawer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Search - Tech Vibe with Terminal / Monospace Hint */}
        <div className="relative w-full group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="w-3.5 h-3.5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
          </div>
          <input
            type="text"
            value={sidebarSearch}
            onChange={(e) => setSidebarSearch(e.target.value)}
            placeholder="Filter modules..."
            className="w-full pl-8 pr-12 py-2 text-xs rounded-lg bg-slate-50/80 hover:bg-slate-50 border border-slate-200/80 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-mono transition-all placeholder:font-sans placeholder:text-slate-400"
          />
          <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-mono text-slate-400 bg-slate-100 border border-slate-200/90 rounded">⌘K</kbd>
          </div>
        </div>

        {/* Section 1: Main Classroom Desk */}
        <div className="space-y-1 pt-1">
          <div className="px-3 flex items-center justify-between">
            <p className="text-[10px] font-mono font-bold tracking-wider uppercase text-slate-400">
              MODULES // DESK
            </p>
          </div>
          {sidebarPrimaryLinks.map((item) => {
            const Icon = item.icon;
            const isActive = activeSidebar === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSidebar(item.id);
                  setSelectedMonthId(null);
                  if (isMobile) setIsMobileDrawerOpen(false);
                }}
                className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs font-bold'
                    : 'text-slate-700 hover:bg-slate-100/70 hover:text-slate-950'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.id === 'my-lessons' && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${isActive ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    Active
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Section 2: Archives & Resources */}
        <div className="space-y-1 pt-2 border-t border-slate-100/80">
          <p className="px-3 text-[10px] font-mono font-bold tracking-wider uppercase text-slate-400">
            VAULT // REPOSITORY
          </p>
          {sidebarResourceLinks.map((item) => {
            const Icon = item.icon;
            const isActive = activeSidebar === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSidebar(item.id);
                  setSelectedMonthId(null);
                  if (isMobile) setIsMobileDrawerOpen(false);
                }}
                className={`w-full px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.id === 'past-papers' && (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Student Badge Footer in Sidebar - Tech Profile Pill */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center text-xs font-mono font-bold shrink-0 shadow-xs ring-1 ring-slate-800">
              {currentUser.name.charAt(0)}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
          </div>
          <div className="min-w-0 text-left">
            <p className="text-xs font-bold text-slate-900 truncate tracking-tight">{currentUser.name}</p>
            <p className="text-[10px] font-mono text-slate-500 truncate">{currentUser.batch} · <span className="text-blue-600 font-semibold">{currentUser.indexNumber}</span></p>
          </div>
        </div>
        <div className="relative p-2 rounded-lg bg-slate-50 border border-slate-200/60 text-slate-600 hover:bg-slate-100 cursor-pointer transition-colors">
          <Bell className="w-3.5 h-3.5" />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-blue-600 text-white text-[8px] font-mono font-bold flex items-center justify-center shadow-2xs">
            4
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full pb-20">

      {/* Mobile Slide-Out Drawer */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${
          isMobileDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs"
          onClick={() => setIsMobileDrawerOpen(false)}
        />

        <aside
          className={`absolute inset-y-0 left-0 w-80 max-w-[85vw] bg-white shadow-2xl p-5 transform transition-transform duration-300 ease-out flex flex-col justify-between ${
            isMobileDrawerOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {renderSidebarContent(true)}
        </aside>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          SEAMLESS EXPANSIVE LMS GRID:
          Wide architecture with crisp unified surface styling
         ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8 items-start w-full">

        {/* ── DESKTOP LEFT SIDEBAR (docked and structured) ────────── */}
        <aside className="hidden lg:block lg:col-span-3 xl:col-span-3 2xl:col-span-2.5 bg-white/90 backdrop-blur-xl rounded-3xl border border-slate-200/70 shadow-[0_4px_30px_rgba(15,23,42,0.03)] p-5 sticky top-24">
          {renderSidebarContent(false)}
        </aside>

        {/* ── RIGHT MAIN WORKSPACE AREA ─────────────────────────── */}
        <main className="lg:col-span-9 xl:col-span-9 2xl:col-span-9.5 space-y-6 text-left w-full">

          {/* Top Bar: Clean Breadcrumbs + Live Stream Status Badge */}
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-slate-200/70 shadow-[0_4px_24px_rgba(15,23,42,0.02)] px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">

            <div className="flex items-center gap-3">
              {/* Mobile 3-Dots Button */}
              <button
                onClick={() => setIsMobileDrawerOpen(true)}
                className="lg:hidden flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/60 text-slate-800 font-bold text-xs transition-colors shadow-2xs"
                title="Open LMS navigation menu"
              >
                <MoreHorizontal className="w-4 h-4 text-slate-700" />
                <span className="font-semibold">Modules</span>
              </button>

              {/* Breadcrumb Trail */}
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <span className="hover:text-blue-600 cursor-pointer font-semibold" onClick={() => setSelectedMonthId(null)}>Inspire LMS</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                <span className="capitalize font-bold text-slate-800">
                  {activeSidebar.replace(/-/g, ' ')}
                </span>
                {selectedMonthModule && (
                  <>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                    <span className="text-blue-600 font-extrabold truncate">
                      {selectedMonthModule.month} Curriculum
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Live Masterclass Broadcast Alert */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-800 text-[11px] font-semibold">
                <Radio className="w-3 h-3 text-blue-600 animate-pulse" />
                <span>Next Live: Thursday 3:30 PM · Online HD Stream</span>
              </div>

              {selectedMonthId && (
                <button
                  onClick={() => setSelectedMonthId(null)}
                  className="text-xs font-bold text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 px-3.5 py-1.5 rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>All Batches</span>
                </button>
              )}
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              VIEW 1: MY LESSONS VIEW (Executive-Grade Video Lecture Deck)
             ───────────────────────────────────────────────────────────── */}
          {activeSidebar === 'my-lessons' && (
            <div className="space-y-6">

              {/* Ultra-Premium Welcome Command Banner (Inspired by image.png depth & clarity) */}
              <div className="rounded-3xl bg-gradient-to-r from-slate-950 via-[#0B1528] to-blue-950 text-white shadow-[0_12px_40px_rgba(15,23,42,0.12)] border border-slate-800/80 p-6 sm:p-8 relative overflow-hidden">
                {/* Background Ambient Radial Glow & Monogram Watermark */}
                <div className="absolute -top-12 -right-12 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
                <span className="absolute right-4 bottom-2 text-white/5 font-black text-9xl tracking-tighter select-none font-sans pointer-events-none">
                  RS
                </span>

                <div className="relative z-10 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-0.5 rounded-full">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>ACCREDITED SRI LANKA A/L COMMERCE FACULTY</span>
                    </div>
                    <span className="text-xs text-slate-400 font-medium">
                      Student ID: {currentUser.indexNumber}
                    </span>
                  </div>

                  <div className="max-w-2xl space-y-2">
                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                      Welcome, {currentUser.name} · {currentUser.batch}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                      Your personal academic portal. Watch on-demand masterclasses, download standardized LKAS frameworks, and track model exam performance under Mrs. Ruwanthi Senanayaka.
                    </p>
                  </div>

                  {/* Fast Stat Badges Row */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Active Month</span>
                      <span className="text-sm font-black text-white block">September 2025</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Unlocked Lectures</span>
                      <span className="text-sm font-black text-emerald-400 block">4 Sessions Ready</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Syllabus Standard</span>
                      <span className="text-sm font-black text-white block">LKAS Compliant</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Academic Mentor</span>
                      <span className="text-sm font-black text-blue-400 block">Island Rank 1 Faculty</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Topic Filter Pills Bar */}
              <div className="flex items-center justify-between gap-3 overflow-x-auto pb-1 no-scrollbar">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1 hidden sm:inline">
                    FILTER:
                  </span>
                  {[
                    { id: 'all', label: 'All Lessons' },
                    { id: 'Partnership', label: 'Partnership Accounts' },
                    { id: 'LKAS', label: 'LKAS 01 Standards' },
                    { id: 'Goodwill', label: 'Goodwill & Revaluation' },
                    { id: 'Dissolution', label: 'Dissolution' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setSelectedTopicFilter(tab.id)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                        selectedTopicFilter === tab.id
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-white/80 hover:bg-white text-slate-700 border border-slate-200/70'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
                <span className="text-xs text-slate-400 font-medium shrink-0">
                  {filteredVideoLessons.length} sessions
                </span>
              </div>

              {/* Studio-Grade Video Lessons Grid (High-definition presentation) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredVideoLessons.map((item, idx) => {
                  const gradientPalette = [
                    'from-blue-900 via-slate-900 to-indigo-950',
                    'from-slate-950 via-blue-950 to-teal-950',
                    'from-indigo-950 via-slate-900 to-sky-950',
                    'from-slate-900 via-blue-900 to-cyan-950'
                  ][idx % 4];

                  return (
                    <div
                      key={item.id}
                      className="bg-white/95 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-[0_4px_24px_rgba(15,23,42,0.04)] hover:shadow-[0_12px_36px_rgba(15,23,42,0.08)] p-6 space-y-4 transition-all flex flex-col justify-between group"
                    >
                      <div className="space-y-3.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100/80">
                            {item.topic}
                          </span>
                          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>{item.duration}</span>
                          </div>
                        </div>

                        <h3 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">
                          {item.title}
                        </h3>

                        {/* High-Definition Stylized Video Poster with Live Watermark */}
                        <div
                          className={`relative aspect-[16/9] rounded-2xl bg-gradient-to-br ${gradientPalette} overflow-hidden flex items-center justify-center text-white cursor-pointer shadow-sm border border-slate-800/40`}
                          onClick={() => onSelectVideo(item)}
                        >
                          {/* Financial Ledger / Grid background pattern */}
                          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />

                          {/* Stylized Topic Watermark */}
                          <div className="absolute -right-2 -bottom-2 text-white/10 font-black text-6xl select-none font-sans tracking-tight uppercase">
                            {item.topic.split(' ')[0]}
                          </div>

                          {/* Top-left broadcast badge */}
                          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold tracking-wide text-white border border-white/10">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                            <span>1080p HD · REPLAY</span>
                          </div>

                          {/* Top-right lesson index */}
                          <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-blue-600 text-[10px] font-bold tracking-wide text-white shadow-2xs">
                            Session 0{idx + 1}
                          </div>

                          {/* Center Animated Frosted Play Button */}
                          <div className="relative z-10 w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white group-hover:scale-115 transition-transform duration-300 shadow-xl group-hover:bg-blue-600">
                            <Play className="w-6 h-6 fill-white ml-0.5 transition-colors" />
                          </div>

                          {/* Bottom Duration pill */}
                          <span className="absolute bottom-3 right-3 text-[11px] font-mono font-semibold bg-black/75 backdrop-blur-xs px-2.5 py-0.5 rounded text-white border border-white/10">
                            {item.duration}
                          </span>

                          {/* Progress indicator bar */}
                          <div className="absolute bottom-0 inset-x-0 h-1 bg-white/20">
                            <div className="h-full bg-blue-500 w-3/4 rounded-r" />
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="pt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center">
                            RS
                          </div>
                          <span className="text-[11px] text-slate-500 font-medium truncate">
                            Mrs. Ruwanthi Senanayaka
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              const targetPaper = pastPapersData[0];
                              onSelectPaper(targetPaper);
                            }}
                            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
                            title="Open LKAS study notes"
                          >
                            PDF Notes
                          </button>

                          <button
                            onClick={() => onSelectVideo(item)}
                            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 active:scale-95"
                          >
                            <Play className="w-3.5 h-3.5 fill-white" />
                            <span>Watch Lesson</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              VIEW 2: A/L 2027 / 2028 / 2026 BATCH MODULES
             ───────────────────────────────────────────────────────────── */}
          {(activeSidebar === 'al-2027' || activeSidebar === 'al-2028' || activeSidebar === 'al-2026') && (
            <div>
              {!selectedMonthId ? (
                /* ── MONTHS LIST FOR THE BATCH ── */
                <div className="space-y-6">

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="text-xl font-bold text-slate-950">
                        {activeSidebar === 'al-2027' && 'A/L 2027 Accounting Masterclass Modules'}
                        {activeSidebar === 'al-2028' && 'A/L 2028 Accounting Foundation Series'}
                        {activeSidebar === 'al-2026' && 'A/L 2026 Intensive Examination Revisions'}
                      </h3>
                      <p className="text-xs text-slate-500">
                        Select an unlocked month to access full recordings, past exam papers, and downloadable LKAS study tutes.
                      </p>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full w-fit">
                      {monthlyModules.filter(m => m.isUnlocked).length} Months Enrolled
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {monthlyModules
                      .filter(m => {
                        if (overrideCourses) {
                          // Try to respect the batch filter for real courses based on the sidebar tab
                          if (activeSidebar === 'al-2027') return m.batch?.includes('2027');
                          if (activeSidebar === 'al-2028') return m.batch?.includes('2028');
                          if (activeSidebar === 'al-2026') return m.batch?.includes('2026');
                          return true;
                        }
                        if (activeSidebar === 'al-2027') return m.batch === 'A/L 2027';
                        if (activeSidebar === 'al-2028') return m.batch === 'A/L 2028';
                        return m.batch === 'A/L 2026';
                      })
                      .map((mod) => (
                        <div
                          key={mod.id}
                          className="bg-white/95 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-[0_4px_24px_rgba(15,23,42,0.03)] hover:shadow-[0_8px_32px_rgba(15,23,42,0.06)] p-6 md:p-7 space-y-5 text-left flex flex-col justify-between transition-all"
                        >
                          <div className="space-y-3.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                                {mod.month} · {mod.batch}
                              </span>
                              <span className="text-xs text-slate-400 font-medium">
                                {mod.videoCount} Masterclasses
                              </span>
                            </div>

                            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug">
                              {mod.title}
                            </h3>

                            {/* Fee Card if locked */}
                            {!mod.isUnlocked && (
                              <div className="py-2.5 px-4 rounded-2xl bg-rose-50/80 border border-rose-200 text-center">
                                <span className="text-xl font-black text-rose-600 font-sans">
                                  Rs. {mod.priceLKR.toFixed(2)}
                                </span>
                                <span className="text-[11px] text-rose-500 font-medium block">Monthly Live + Recorded Class Access</span>
                              </div>
                            )}

                            <p className="text-xs text-slate-600 leading-relaxed">
                              {mod.description}
                            </p>
                          </div>

                          {/* Action Button */}
                          <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                            <span className="text-xs text-slate-500 font-medium">
                              {mod.tuteCount} Tutes included
                            </span>

                            {mod.isUnlocked ? (
                              <button
                                onClick={() => {
                                  if ((mod as any).course_id) {
                                    const nav = onNavigate as any;
                                    if (typeof nav === 'function') {
                                       nav('course-' + (mod as any).course_id);
                                    }
                                  } else {
                                    setSelectedMonthId(mod.id);
                                  }
                                }}
                                className="px-6 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs shadow-xs flex items-center gap-2 transition-all hover:scale-[1.02]"
                              >
                                <span>Enter Classroom</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            ) : (
                              <button
                                onClick={() => setSelectedPaymentModule(mod)}
                                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-colors"
                              >
                                <Lock className="w-3.5 h-3.5" />
                                <span>Enroll (Pay Online)</span>
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ) : (
                /* ── INSIDE THE SELECTED MONTH: MULTI-VIDEO SELECTION ── */
                <div className="space-y-6">

                  {/* Month Hero Header */}
                  <div className="p-6 sm:p-8 rounded-3xl bg-white/95 backdrop-blur-xl border border-slate-200/80 shadow-[0_6px_30px_rgba(15,23,42,0.03)] space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                        <Sparkles className="w-3 h-3 text-blue-600" />
                        <span>{selectedMonthModule?.batch} · {selectedMonthModule?.month} Curriculum</span>
                      </div>
                      <span className="text-xs font-semibold text-slate-500">
                        {selectedMonthVideos.length} Recorded Sessions Available
                      </span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      {selectedMonthModule?.title}
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
                      Select any session below to launch the video classroom. Includes full question discussion and downloadable note summaries.
                    </p>
                  </div>

                  {/* Multi-Videos Grid inside this month */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {selectedMonthVideos.map((videoItem) => (
                      <div
                        key={videoItem.id}
                        className="bg-white/95 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-[0_4px_24px_rgba(15,23,42,0.03)] hover:shadow-[0_8px_32px_rgba(15,23,42,0.06)] p-6 space-y-4 flex flex-col justify-between transition-all"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                              {videoItem.lessonNo}
                            </span>
                            <span className="text-xs font-sans font-semibold text-slate-400">
                              {videoItem.duration}
                            </span>
                          </div>

                          <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                            {videoItem.title}
                          </h3>

                          {/* Video Playable Box */}
                          <div
                            className="relative aspect-[16/9] rounded-2xl bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 overflow-hidden flex items-center justify-center text-white group cursor-pointer shadow-xs border border-slate-800/60"
                            onClick={() => handleLaunchMonthlyVideo(videoItem)}
                          >
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            <div className="w-13 h-13 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                              <Play className="w-5 h-5 fill-white ml-0.5" />
                            </div>
                            <span className="absolute bottom-2.5 right-3 text-[11px] font-mono font-semibold bg-black/70 px-2 py-0.5 rounded text-white">
                              {videoItem.duration}
                            </span>
                          </div>

                          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                            {videoItem.description}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-xs text-slate-400">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{videoItem.date}</span>
                          </div>

                          <button
                            onClick={() => handleLaunchMonthlyVideo(videoItem)}
                            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-all hover:scale-[1.02]"
                          >
                            <Play className="w-3.5 h-3.5 fill-white" />
                            <span>Watch Session</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Month Tutes Attachment */}
                  <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-[0_4px_24px_rgba(15,23,42,0.03)] p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-emerald-600" />
                        <h4 className="text-sm font-bold text-slate-900">Study Materials for this Month</h4>
                      </div>
                      <span className="text-xs text-slate-400">2 Publications Included</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {studyMaterialsData.slice(0, 2).map((tute) => (
                        <div key={tute.id} className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70 flex items-center justify-between gap-4">
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-900 truncate">{tute.title}</p>
                            <p className="text-[11px] text-slate-500">{tute.pageCount} Pages · Official LKAS Document</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => {
                                const paper = pastPapersData[0];
                                onSelectPaper(paper);
                              }}
                              className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-800 hover:bg-slate-50 transition-colors shadow-2xs"
                            >
                              PDF
                            </button>
                            <button
                              onClick={() => onAddToCart(tute)}
                              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-2xs"
                            >
                              Order
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              VIEW 3: PAST PAPERS (Full Library with Search, Filters, Mediums & Downloads)
             ───────────────────────────────────────────────────────────── */}
          {activeSidebar === 'past-papers' && (
            <div className="space-y-6 text-left">

              {/* Header Hero Banner */}
              <div className="p-6 sm:p-7 rounded-[28px] bg-gradient-to-r from-slate-950 via-[#0B1528] to-blue-950 text-white shadow-[0_12px_36px_rgba(15,23,42,0.1)] border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider text-blue-400 bg-blue-950/70 border border-blue-500/30">
                      G.C.E. A/L ARCHIVES
                    </span>
                    <span className="text-xs text-slate-400 font-sans">2019–2025 All Mediums</span>
                  </div>
                  <h3 className="text-lg sm:text-2xl font-black text-white">Official Past Examination Papers &amp; Marking Schemes</h3>
                  <p className="text-xs text-slate-300 max-w-2xl">
                    Full official Department of Examinations papers, marking schemes, model questions, and provincial trial sets.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-mono px-3 py-1.5 rounded-full bg-white/10 text-blue-200 border border-white/10">
                    {filteredPastPapers.length} Papers Found
                  </span>
                </div>
              </div>

              {/* Search & Multi-Filters Control Bar */}
              <div className="p-4 sm:p-5 rounded-3xl bg-white/90 backdrop-blur-xl border border-slate-200/80 shadow-[0_4px_24px_rgba(15,23,42,0.03)] space-y-4">

                {/* Search Input Row */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Search className="w-4 h-4 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    value={paperSearch}
                    onChange={(e) => setPaperSearch(e.target.value)}
                    placeholder="Search by year (2025, 2024...), title, or exam category..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50/90 border border-slate-200/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs text-slate-900 transition-all font-sans"
                  />
                  {paperSearch && (
                    <button
                      onClick={() => setPaperSearch('')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-slate-600"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Filter Trays */}
                <div className="space-y-3 pt-1">

                  {/* Medium Selector */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">Medium:</span>
                    {[
                      { id: 'all', label: 'All Mediums' },
                      { id: 'sinhala', label: 'සිංහල (Sinhala)' },
                      { id: 'english', label: 'English Medium' },
                      { id: 'tamil', label: 'தமிழ் (Tamil)' }
                    ].map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setPaperMedium(m.id as any)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                          paperMedium === m.id
                            ? 'bg-slate-950 text-white shadow-xs font-bold'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>

                  {/* Category Selector */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">Category:</span>
                    {[
                      { id: 'all', label: 'All Categories' },
                      { id: 'national', label: 'National Exam (A/L)' },
                      { id: 'marking', label: 'Marking Schemes' },
                      { id: 'model', label: 'Model Papers' }
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setPaperCategory(cat.id)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                          paperCategory === cat.id
                            ? 'bg-blue-600 text-white shadow-xs font-bold'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  {/* Year Quick Filter Pills */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">Year:</span>
                    {['all', '2025', '2024', '2023', '2022', '2021', '2020', '2019'].map((yr) => (
                      <button
                        key={yr}
                        onClick={() => setPaperYear(yr)}
                        className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold transition-all ${
                          paperYear === yr
                            ? 'bg-slate-900 text-white shadow-xs'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                        }`}
                      >
                        {yr === 'all' ? 'All' : `#${yr}`}
                      </button>
                    ))}
                  </div>

                </div>

              </div>

              {/* Papers Grid */}
              {filteredPastPapers.length === 0 ? (
                <div className="p-12 text-center rounded-3xl bg-white/80 border border-slate-200/80 space-y-3">
                  <FileText className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-sm font-bold text-slate-700">No past examination papers match your filters</p>
                  <button
                    onClick={() => {
                      setPaperSearch('');
                      setPaperMedium('all');
                      setPaperCategory('all');
                      setPaperYear('all');
                    }}
                    className="px-4 py-2 rounded-full bg-slate-900 text-white text-xs font-bold"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                  {filteredPastPapers.map((paper) => (
                    <div
                      key={paper.id}
                      className="bg-white/95 backdrop-blur-xl rounded-[28px] border border-slate-200/80 shadow-[0_4px_24px_rgba(15,23,42,0.03)] hover:border-blue-300 hover:shadow-[0_12px_36px_rgba(15,23,42,0.06)] p-6 space-y-4 text-left flex flex-col justify-between transition-all"
                    >
                      <div className="space-y-3">
                        {/* Top Badges Row */}
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                              #{paper.year}
                            </span>
                            <span className={`text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded-full border ${
                              paper.medium === 'sinhala'
                                ? 'bg-amber-50 text-amber-800 border-amber-200/60'
                                : paper.medium === 'english'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200/60'
                                : 'bg-purple-50 text-purple-800 border-purple-200/60'
                            }`}>
                              {paper.medium}
                            </span>
                          </div>

                          {paper.hasMarkingScheme && (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Marking Scheme</span>
                            </span>
                          )}
                        </div>

                        {/* Title & Description */}
                        <div>
                          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">
                            ACC-33 · {paper.category}
                          </span>
                          <h4 className="text-base font-extrabold text-slate-950 leading-snug mt-0.5">
                            {paper.title}
                          </h4>
                          <p className="text-xs text-slate-600 leading-relaxed mt-1">
                            {paper.subtitle}
                          </p>
                        </div>

                        {/* Metadata row */}
                        <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400 pt-1">
                          <span>{paper.pages} Pages</span>
                          <span>•</span>
                          <span>{paper.fileSize}</span>
                          <span>•</span>
                          <span>{paper.downloadCount.toLocaleString()} Downloads</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2.5">
                        <button
                          onClick={() => onSelectPaper(paper)}
                          className="flex-1 py-2.5 rounded-full bg-slate-950 hover:bg-blue-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-colors active:scale-95"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>View PDF</span>
                        </button>

                        <button
                          onClick={() => handleDownloadPaper(paper)}
                          disabled={downloadingPaperId === paper.id}
                          className="px-4 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors active:scale-95 disabled:opacity-60"
                        >
                          {downloadingPaperId === paper.id ? (
                            <span className="inline-block animate-spin text-xs">⟳</span>
                          ) : (
                            <Download className="w-3.5 h-3.5" />
                          )}
                          <span>{downloadingPaperId === paper.id ? 'Saving...' : 'Download'}</span>
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              VIEW 4: TUTES & STUDY MATERIALS (Full Store Experience with Filters & Free Downloads)
             ───────────────────────────────────────────────────────────── */}
          {activeSidebar === 'tutes' && (
            <div className="space-y-6 text-left">

              {/* Header Hero Banner */}
              <div className="p-6 sm:p-7 rounded-[28px] bg-gradient-to-r from-slate-950 via-[#0B1528] to-blue-950 text-white shadow-[0_12px_36px_rgba(15,23,42,0.1)] border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/70 border border-emerald-500/30">
                      PRINT &amp; DIGITAL HANDBOOKS
                    </span>
                    <span className="text-xs text-slate-400 font-sans">Official LKAS Standards Series</span>
                  </div>
                  <h3 className="text-lg sm:text-2xl font-black text-white">Academic Study Tutes, Notes &amp; Handouts</h3>
                  <p className="text-xs text-slate-300 max-w-2xl">
                    Comprehensive study materials, theory tutorials, LKAS standard summaries, and exam prep kits. Read PDF online or order physical copies.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-mono px-3 py-1.5 rounded-full bg-white/10 text-emerald-200 border border-white/10">
                    {filteredTutes.length} Publications
                  </span>
                </div>
              </div>

              {/* Search & Category Filter Bar */}
              <div className="p-4 sm:p-5 rounded-3xl bg-white/90 backdrop-blur-xl border border-slate-200/80 shadow-[0_4px_24px_rgba(15,23,42,0.03)] space-y-4">

                {/* Search Input */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Search className="w-4 h-4 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    value={tuteSearch}
                    onChange={(e) => setTuteSearch(e.target.value)}
                    placeholder="Search by publication name, topic, or batch (2028, 2027...)..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50/90 border border-slate-200/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs text-slate-900 transition-all font-sans"
                  />
                  {tuteSearch && (
                    <button
                      onClick={() => setTuteSearch('')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-slate-600"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Filter Trays */}
                <div className="space-y-3 pt-1">

                  {/* Category Filter */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">Category:</span>
                    {[
                      { id: 'all', label: 'All Handbooks' },
                      { id: 'lesson-wise-tutes', label: 'Lesson Wise Tutes' },
                      { id: 'revision-notes', label: 'Revision Notes' },
                      { id: 'past-paper-books', label: 'Past Paper Books' },
                      { id: 'free', label: 'Free Tutes' }
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setTuteCategoryFilter(cat.id)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                          tuteCategoryFilter === cat.id
                            ? 'bg-slate-950 text-white shadow-xs font-bold'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  {/* Batch Filter */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">Batch:</span>
                    {['all', '2028', '2027', '2026'].map((b) => (
                      <button
                        key={b}
                        onClick={() => setTuteBatchFilter(b === 'all' ? 'all' : `A/L ${b}`)}
                        className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold transition-all ${
                          (b === 'all' && tuteBatchFilter === 'all') || tuteBatchFilter === `A/L ${b}`
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                        }`}
                      >
                        {b === 'all' ? 'All Batches' : `A/L ${b}`}
                      </button>
                    ))}
                  </div>

                </div>

              </div>

              {/* Tutes Grid */}
              {filteredTutes.length === 0 ? (
                <div className="p-12 text-center rounded-3xl bg-white/80 border border-slate-200/80 space-y-3">
                  <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-sm font-bold text-slate-700">No study handbooks match your search criteria</p>
                  <button
                    onClick={() => {
                      setTuteSearch('');
                      setTuteCategoryFilter('all');
                      setTuteBatchFilter('all');
                    }}
                    className="px-4 py-2 rounded-full bg-slate-900 text-white text-xs font-bold"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                  {filteredTutes.map((item) => (
                    <div
                      key={item.id}
                      className="p-6 md:p-7 rounded-[28px] bg-white/95 backdrop-blur-xl border border-slate-200/80 shadow-[0_4px_24px_rgba(15,23,42,0.03)] hover:shadow-[0_12px_36px_rgba(15,23,42,0.06)] hover:border-blue-300 space-y-4 flex flex-col justify-between text-left transition-all"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                              {item.batchTag}
                            </span>
                            <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
                              {item.category}
                            </span>
                          </div>
                          <span className="text-xs font-mono font-medium text-slate-400">
                            {item.pageCount} Pages
                          </span>
                        </div>

                        <div>
                          <h4 className="text-base font-extrabold text-slate-950 leading-snug">
                            {item.title}
                          </h4>
                          <p className="text-xs text-slate-500 font-medium mt-0.5">
                            {item.subtitle}
                          </p>
                          <p className="text-xs text-slate-600 leading-relaxed mt-1 line-clamp-2">
                            {item.description}
                          </p>
                        </div>

                        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                          <div className="flex items-center gap-1 text-amber-500">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <span className="font-bold text-slate-800">{item.rating}</span>
                            <span className="text-slate-400 text-[11px]">({item.reviewsCount} reviews)</span>
                          </div>
                          <span className="text-[11px] font-medium text-slate-500">{item.format}</span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 justify-between">
                        {item.isFree ? (
                          <>
                            <button
                              onClick={() => {
                                const targetPaper = pastPapersData[0];
                                onSelectPaper(targetPaper);
                              }}
                              className="px-4 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
                            >
                              <FileText className="w-3.5 h-3.5 text-blue-600" />
                              <span>View PDF</span>
                            </button>

                            <button
                              onClick={() => handleDownloadTute(item)}
                              disabled={downloadingTuteId === item.id}
                              className="px-4 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
                            >
                              {downloadingTuteId === item.id ? (
                                <span className="inline-block animate-spin text-xs">⟳</span>
                              ) : (
                                <Download className="w-3.5 h-3.5" />
                              )}
                              <span>{downloadingTuteId === item.id ? 'Downloading...' : 'Free Download'}</span>
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => {
                                const targetPaper = pastPapersData[0];
                                onSelectPaper(targetPaper);
                              }}
                              className="px-4 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
                            >
                              <FileText className="w-3.5 h-3.5 text-blue-600" />
                              <span>Preview PDF</span>
                            </button>

                            <button
                              onClick={() => onAddToCart(item)}
                              className="px-5 py-2.5 rounded-full bg-slate-950 hover:bg-blue-600 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs active:scale-95"
                            >
                              <ShoppingBag className="w-3.5 h-3.5" />
                              <span>Add to Cart (Rs. {item.priceLKR.toLocaleString()})</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              VIEW 5: AL VIDEO MODULES / LECTURE CATALOG
              Full Masterclass library with Search, Topics, Chapters & Handouts
             ───────────────────────────────────────────────────────────── */}
          {(activeSidebar === 'al-video-modules' || activeSidebar === 'paper-class' || activeSidebar === 'git' || activeSidebar === 'ol-courses') && (
            <div className="space-y-6 text-left">

              {/* Header Hero Banner */}
              <div className="p-6 sm:p-7 rounded-[28px] bg-gradient-to-r from-slate-950 via-[#0B1528] to-blue-950 text-white shadow-[0_12px_36px_rgba(15,23,42,0.1)] border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/70 border border-emerald-500/30">
                      ON-DEMAND REPOSITORY
                    </span>
                    <span className="text-xs text-slate-400 font-sans">1080p HD Studio Masterclasses</span>
                  </div>
                  <h3 className="text-lg sm:text-2xl font-black text-white capitalize">
                    {activeSidebar.replace(/-/g, ' ')} Video Catalog
                  </h3>
                  <p className="text-xs text-slate-300 max-w-2xl">
                    High-definition lecture recordings, chapter breakdowns with direct timestamps, live Q&amp;A summaries, and syllabus revision notes.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-mono px-3 py-1.5 rounded-full bg-white/10 text-emerald-200 border border-white/10">
                    {filteredCatalogVideos.length} Masterclasses
                  </span>
                </div>
              </div>

              {/* Search & Topic Filters */}
              <div className="p-4 sm:p-5 rounded-3xl bg-white/90 backdrop-blur-xl border border-slate-200/80 shadow-[0_4px_24px_rgba(15,23,42,0.03)] space-y-4">

                {/* Search Input */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Search className="w-4 h-4 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    value={videoSearch}
                    onChange={(e) => setVideoSearch(e.target.value)}
                    placeholder="Search masterclasses by topic (Partnership, LKAS 01...), title, or syllabus note..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50/90 border border-slate-200/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs text-slate-900 transition-all font-sans"
                  />
                  {videoSearch && (
                    <button
                      onClick={() => setVideoSearch('')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-slate-600"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Topic Filter Pills */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">Topic:</span>
                  {[
                    { id: 'all', label: 'All Topics' },
                    { id: 'Partnership', label: 'Partnership Accounts' },
                    { id: 'LKAS 01', label: 'LKAS 01 Standards' },
                    { id: 'LKAS 02', label: 'Inventories (LKAS 02)' },
                    { id: 'Cash Flow', label: 'Cash Flow LKAS 07' },
                    { id: 'Company', label: 'Company Accounts' },
                    { id: 'Cost', label: 'Cost & Management' }
                  ].map((topic) => (
                    <button
                      key={topic.id}
                      onClick={() => setVideoTopicFilter(topic.id)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                        videoTopicFilter === topic.id
                          ? 'bg-blue-600 text-white shadow-xs font-bold'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {topic.label}
                    </button>
                  ))}
                </div>

              </div>

              {/* Videos Grid */}
              {filteredCatalogVideos.length === 0 ? (
                <div className="p-12 text-center rounded-3xl bg-white/80 border border-slate-200/80 space-y-3">
                  <Video className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-sm font-bold text-slate-700">No masterclasses match your search criteria</p>
                  <button
                    onClick={() => {
                      setVideoSearch('');
                      setVideoTopicFilter('all');
                    }}
                    className="px-4 py-2 rounded-full bg-slate-900 text-white text-xs font-bold"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                  {filteredCatalogVideos.map((item) => {
                    const isChaptersExpanded = expandedVideoId === item.id;
                    const isNotesExpanded = expandedNotesId === item.id;

                    return (
                      <div
                        key={item.id}
                        className="bg-white/95 backdrop-blur-xl rounded-[28px] border border-slate-200/80 shadow-[0_4px_24px_rgba(15,23,42,0.03)] hover:border-blue-300 hover:shadow-[0_12px_36px_rgba(15,23,42,0.06)] p-6 space-y-4 text-left flex flex-col justify-between transition-all group"
                      >
                        <div className="space-y-3">
                          {/* Badges Row */}
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                                {item.topic}
                              </span>
                              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                                1080p HD
                              </span>
                            </div>
                            <span className="text-xs font-mono font-medium text-slate-400">
                              {item.duration} · {item.date}
                            </span>
                          </div>

                          {/* Title & Description */}
                          <div>
                            <h4 className="text-base font-extrabold text-slate-950 group-hover:text-blue-600 transition-colors leading-snug">
                              {item.title}
                            </h4>
                            <p className="text-xs text-slate-500 font-medium mt-0.5">
                              {item.subtitle}
                            </p>
                            <p className="text-xs text-slate-600 leading-relaxed mt-1">
                              {item.description}
                            </p>
                          </div>

                          {/* Expandable Chapter Timestamps Accordion */}
                          <div className="pt-1">
                            <button
                              onClick={() => setExpandedVideoId(isChaptersExpanded ? null : item.id)}
                              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1.5 py-1"
                            >
                              <Clock className="w-3.5 h-3.5" />
                              <span>{isChaptersExpanded ? 'Hide Chapters' : `View ${item.chapters.length} Timed Chapters`}</span>
                              <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isChaptersExpanded ? 'rotate-90' : ''}`} />
                            </button>

                            {isChaptersExpanded && (
                              <div className="mt-2 space-y-1.5 p-3 rounded-2xl bg-slate-50/90 border border-slate-200/70 text-xs">
                                {item.chapters.map((ch, idx) => (
                                  <div key={idx} className="flex items-center justify-between py-1 border-b border-slate-100 last:border-0">
                                    <span className="text-slate-800 font-medium truncate mr-2">{ch.title}</span>
                                    <span className="font-mono text-[11px] font-bold text-blue-600 shrink-0">{ch.time}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Expandable Key Handout Notes Accordion */}
                          <div>
                            <button
                              onClick={() => setExpandedNotesId(isNotesExpanded ? null : item.id)}
                              className="text-xs font-bold text-emerald-600 hover:text-emerald-800 flex items-center gap-1.5 py-1"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>{isNotesExpanded ? 'Hide Notes' : 'Key Handout Notes & Formulae'}</span>
                              <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isNotesExpanded ? 'rotate-90' : ''}`} />
                            </button>

                            {isNotesExpanded && (
                              <div className="mt-2 space-y-1.5 p-3 rounded-2xl bg-emerald-50/60 border border-emerald-200/60 text-xs text-emerald-950">
                                <ul className="list-disc list-inside space-y-1">
                                  {item.notesSummary.map((note, nIdx) => (
                                    <li key={nIdx} className="leading-relaxed">{note}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>

                        </div>

                        {/* Action Buttons */}
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                          <span className="text-xs text-slate-400 font-mono font-medium">{item.duration}</span>
                          <button
                            onClick={() => onSelectVideo(item)}
                            className="px-5 py-2.5 rounded-full bg-slate-950 hover:bg-blue-600 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-2xs active:scale-95"
                          >
                            <Play className="w-3.5 h-3.5 fill-white" />
                            <span>Play Masterclass</span>
                          </button>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          )}

        </main>

      </div>

      {/* Module Payment Modal */}
      <ModulePaymentModal
        module={selectedPaymentModule}
        isOpen={Boolean(selectedPaymentModule)}
        onClose={() => setSelectedPaymentModule(null)}
        onSuccessUnlock={handleUnlockSuccess}
      />

    </div>
  );
};
