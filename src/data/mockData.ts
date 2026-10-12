import {
  PastPaper,
  VideoModule,
  StudyMaterial,
  Lesson,
  Announcement,
  StudentTask,
  WallOfFameRanker,
  CurrentUser
} from '../types';

export const initialUser: CurrentUser = {
  id: 'usr-8901',
  name: 'Ruwanthi',
  role: 'Student',
  indexNumber: '2024-8901',
  batch: '2025 A/L Commerce',
  overallProgress: 65,
  email: 'ruwanthi.student@inspire.ac.lk',
  phone: '+94 77 123 4567'
};

export const pastPapersData: PastPaper[] = [
  // 2025 Papers (Strictly Accounting & Commerce)
  {
    id: 'pp-2025-sin-acc',
    year: 2025,
    subject: 'Accounting Principles',
    medium: 'sinhala',
    title: 'Financial Accounting - Paper I & II',
    subtitle: 'National Model Assessment 2025',
    pages: 24,
    fileSize: '5.8 MB',
    hasMarkingScheme: true,
    downloadCount: 3810,
    category: 'Final Exam'
  },
  {
    id: 'pp-2025-sin-part',
    year: 2025,
    subject: 'Partnership Accounts',
    medium: 'sinhala',
    title: 'Partnership Accounts & Financial Statements',
    subtitle: 'Comprehensive Pre-Board Evaluation 2025',
    pages: 22,
    fileSize: '5.2 MB',
    hasMarkingScheme: true,
    downloadCount: 3420,
    category: 'Model Paper'
  },
  {
    id: 'pp-2025-sin-lkas',
    year: 2025,
    subject: 'LKAS Standards',
    medium: 'sinhala',
    title: 'LKAS 01, 02 & 07 Practical Applications',
    subtitle: 'Standardized Assessment & Structured Answer Key',
    pages: 18,
    fileSize: '4.6 MB',
    hasMarkingScheme: true,
    downloadCount: 2950,
    category: 'Mid-Term Assessment'
  },
  {
    id: 'pp-2025-eng-acc',
    year: 2025,
    subject: 'Accounting Principles',
    medium: 'english',
    title: 'Accounting Principles & Financial Reporting',
    subtitle: 'Comprehensive Pre-Board Paper (English Medium)',
    pages: 26,
    fileSize: '5.2 MB',
    hasMarkingScheme: true,
    downloadCount: 2950,
    category: 'Final Exam'
  },
  {
    id: 'pp-2025-eng-cost',
    year: 2025,
    subject: 'Cost Accounting',
    medium: 'english',
    title: 'Cost & Management Accounting Master Pack',
    subtitle: 'Variance Analysis & Decision Making',
    pages: 20,
    fileSize: '4.8 MB',
    hasMarkingScheme: true,
    downloadCount: 2610,
    category: 'Model Paper'
  },
  {
    id: 'pp-2025-tam-acc',
    year: 2025,
    subject: 'Accounting Principles',
    medium: 'tamil',
    title: 'Financial Accounting - Paper I & II (Tamil Medium)',
    subtitle: 'Departmental & Consolidated Statements',
    pages: 24,
    fileSize: '5.6 MB',
    hasMarkingScheme: true,
    downloadCount: 1220,
    category: 'Final Exam'
  },

  // 2024 Papers
  {
    id: 'pp-2024-sin-acc',
    year: 2024,
    subject: 'Accounting Principles',
    medium: 'sinhala',
    title: 'G.C.E. A/L Accounting Official Paper',
    subtitle: 'Advanced Level Examination 2024 with Official Scheme',
    pages: 28,
    fileSize: '6.4 MB',
    hasMarkingScheme: true,
    downloadCount: 5410,
    category: 'Final Exam'
  },
  {
    id: 'pp-2024-sin-econ',
    year: 2024,
    subject: 'Economics',
    medium: 'sinhala',
    title: 'Economics Comprehensive Exam',
    subtitle: 'Micro & Macro Dynamics Assessment',
    pages: 20,
    fileSize: '4.8 MB',
    hasMarkingScheme: true,
    downloadCount: 3200,
    category: 'Final Exam'
  },
  {
    id: 'pp-2024-sin-bs',
    year: 2024,
    subject: 'Business Studies',
    medium: 'sinhala',
    title: 'Business Studies Official Paper',
    subtitle: 'Corporate Governance & Management',
    pages: 22,
    fileSize: '5.1 MB',
    hasMarkingScheme: true,
    downloadCount: 2980,
    category: 'Final Exam'
  },
  {
    id: 'pp-2024-eng-acc',
    year: 2024,
    subject: 'Accounting Principles',
    medium: 'english',
    title: 'G.C.E. A/L Accounting Official Paper',
    subtitle: 'English Medium National Examination 2024',
    pages: 28,
    fileSize: '6.2 MB',
    hasMarkingScheme: true,
    downloadCount: 4120,
    category: 'Final Exam'
  },
  {
    id: 'pp-2024-eng-econ',
    year: 2024,
    subject: 'Economics',
    medium: 'english',
    title: 'Economics Principles Assessment',
    subtitle: 'Fiscal Policy & International Trade Evaluation',
    pages: 20,
    fileSize: '4.6 MB',
    hasMarkingScheme: true,
    downloadCount: 2450,
    category: 'Final Exam'
  },
  {
    id: 'pp-2024-tam-acc',
    year: 2024,
    subject: 'Accounting Principles',
    medium: 'tamil',
    title: 'G.C.E. A/L Accounting Official Paper',
    subtitle: 'Tamil Medium Complete Exam with Scheme',
    pages: 28,
    fileSize: '6.3 MB',
    hasMarkingScheme: true,
    downloadCount: 2190,
    category: 'Final Exam'
  },

  // 2023 Papers
  {
    id: 'pp-2023-sin-acc',
    year: 2023,
    subject: 'Accounting Principles',
    medium: 'sinhala',
    title: 'G.C.E. A/L Accounting Examination 2023',
    subtitle: 'Department of Examinations Official Archive',
    pages: 30,
    fileSize: '6.9 MB',
    hasMarkingScheme: true,
    downloadCount: 6800,
    category: 'Final Exam'
  },
  {
    id: 'pp-2023-eng-acc',
    year: 2023,
    subject: 'Accounting Principles',
    medium: 'english',
    title: 'G.C.E. A/L Accounting Examination 2023',
    subtitle: 'English Medium Archive with Marking Guide',
    pages: 30,
    fileSize: '6.7 MB',
    hasMarkingScheme: true,
    downloadCount: 5120,
    category: 'Final Exam'
  },
  {
    id: 'pp-2023-tam-acc',
    year: 2023,
    subject: 'Accounting Principles',
    medium: 'tamil',
    title: 'G.C.E. A/L Accounting Examination 2023',
    subtitle: 'Tamil Medium Archive with Model Answers',
    pages: 30,
    fileSize: '6.8 MB',
    hasMarkingScheme: true,
    downloadCount: 2800,
    category: 'Final Exam'
  },

  // 2022 Papers
  {
    id: 'pp-2022-sin-acc',
    year: 2022,
    subject: 'Accounting Principles',
    medium: 'sinhala',
    title: 'G.C.E. A/L Accounting Examination 2022',
    subtitle: 'Standardized Assessment & Answer Key',
    pages: 26,
    fileSize: '5.9 MB',
    hasMarkingScheme: true,
    downloadCount: 7200,
    category: 'Final Exam'
  },
  {
    id: 'pp-2022-eng-acc',
    year: 2022,
    subject: 'Accounting Principles',
    medium: 'english',
    title: 'G.C.E. A/L Accounting Examination 2022',
    subtitle: 'English Medium Assessment with Annotations',
    pages: 26,
    fileSize: '5.8 MB',
    hasMarkingScheme: true,
    downloadCount: 4900,
    category: 'Final Exam'
  },

  // 2021 Papers
  {
    id: 'pp-2021-sin-acc',
    year: 2021,
    subject: 'Accounting Principles',
    medium: 'sinhala',
    title: 'G.C.E. A/L Accounting Examination 2021',
    subtitle: 'National Examination Archive',
    pages: 28,
    fileSize: '6.0 MB',
    hasMarkingScheme: true,
    downloadCount: 8100,
    category: 'Final Exam'
  },
  {
    id: 'pp-2021-eng-acc',
    year: 2021,
    subject: 'Accounting Principles',
    medium: 'english',
    title: 'G.C.E. A/L Accounting Examination 2021',
    subtitle: 'Official English Formulation',
    pages: 28,
    fileSize: '5.9 MB',
    hasMarkingScheme: true,
    downloadCount: 5600,
    category: 'Final Exam'
  }
];

export const lessonsData: Lesson[] = [
  {
    id: 'les-01',
    lessonNumber: '01',
    title: 'Introduction to Accounting & Conceptual Framework',
    chapter: 'Chapter 1: Foundational Framework & Accounting Equation',
    description: 'Fundamental conventions, qualitative characteristics of financial information, double-entry bookkeeping, and primary books of entry.',
    lastAccessed: 'Today at 10:30 AM',
    durationMinutes: 90,
    isCompleted: true,
    category: 'My Lessons',
    progress: 100
  },
  {
    id: 'les-02',
    lessonNumber: '02',
    title: 'Partnership Accounts: Formations & Goodwill',
    chapter: 'Chapter 4: Financial Reporting Modifications and Strategic Analysis',
    description: 'In-depth breakdown of partnership accounting principles, capital contributions, profit sharing ratios, and revaluation adjustments.',
    lastAccessed: 'Yesterday',
    durationMinutes: 120,
    isCompleted: false,
    category: 'My Lessons',
    progress: 65
  },
  {
    id: 'les-03',
    lessonNumber: '03',
    title: 'Cash Flow Statements (LKAS 7)',
    chapter: 'Chapter 5: Operating, Investing, and Financing Cash Activities',
    description: 'Direct vs indirect methods, reconciliation of profit before tax to net cash from operations, non-cash transactions handling.',
    lastAccessed: '3 days ago',
    durationMinutes: 110,
    isCompleted: false,
    category: 'My Lessons',
    progress: 30
  },
  {
    id: 'les-04',
    lessonNumber: '04',
    title: 'Manufacturing Accounts & Cost Allocation',
    chapter: 'Chapter 6: Cost Flow, Factory Overheads, and WIP Calculations',
    description: 'Prime costs, factory cost allocation, work-in-progress adjustments, and finished goods inventory valuations.',
    lastAccessed: '1 week ago',
    durationMinutes: 95,
    isCompleted: false,
    category: 'My Lessons',
    progress: 0
  },
  // Practical Sessions
  {
    id: 'les-prac-01',
    lessonNumber: 'P1',
    title: 'Bank Reconciliation Statements Workshop',
    chapter: 'Practical Lab 1: Real-World Discrepancy Reconciliation',
    description: 'Unpresented cheques, uncredited deposits, direct bank debits, and correcting cash book cash balance errors.',
    lastAccessed: '2 days ago',
    durationMinutes: 75,
    isCompleted: true,
    category: 'Practical Sessions',
    progress: 100
  },
  {
    id: 'les-prac-02',
    lessonNumber: 'P2',
    title: 'Error Correction & Suspense Accounts Practical',
    chapter: 'Practical Lab 2: Ledger Corrections & Trial Balance Balancing',
    description: 'Errors of omission, commission, principle, and compensating errors resolved through journal vouchers.',
    lastAccessed: '4 days ago',
    durationMinutes: 80,
    isCompleted: false,
    category: 'Practical Sessions',
    progress: 45
  },
  // Tutes
  {
    id: 'les-tute-01',
    lessonNumber: 'T1',
    title: 'Tute 08: Published Financial Statements Drill',
    chapter: 'Comprehensive Problem Set with 50 Examination Questions',
    description: 'Structured drills covering notes to financial statements, dividend declarations, and income tax provisions.',
    lastAccessed: '5 days ago',
    durationMinutes: 60,
    isCompleted: true,
    category: 'Tutes',
    progress: 100
  },
  // Past Papers
  {
    id: 'les-pp-01',
    lessonNumber: 'PP1',
    title: '2023 A/L Model Discussion & Paper Marking Analysis',
    chapter: 'Examiner Insights & Common Student Pitfalls',
    description: 'Step-by-step review of the 2023 National Paper with examiner scoring criteria and maximum mark allocations.',
    lastAccessed: '6 days ago',
    durationMinutes: 150,
    isCompleted: false,
    category: 'Past Papers',
    progress: 20
  }
];

export const videoModulesData: VideoModule[] = [
  {
    id: 'vid-01',
    title: 'Partnership Accounts & Formations',
    subtitle: 'Comprehensive Breakdown of Capital & Profit Sharing',
    description: 'Comprehensive breakdown of partnership accounting principles, including capital contributions, profit sharing, and formation requirements.',
    duration: '1h 48m',
    date: 'Aug 15, 2025',
    month: 'August',
    topic: 'Partnership',
    thumbnailGradient: 'from-blue-600/30 to-indigo-600/20',
    isCompleted: true,
    progressPercent: 100,
    chapters: [
      { title: '01. Partnership Act of 1890 Provisions', time: '00:00' },
      { title: '02. Fixed vs Fluctuating Capital Accounts', time: '22:15' },
      { title: '03. Profit and Loss Appropriation Mechanics', time: '48:30' },
      { title: '04. Admission of a New Partner & Goodwill', time: '1:12:00' },
      { title: '05. Summary & Past Paper Problem Walkthrough', time: '1:35:10' }
    ],
    notesSummary: [
      'Interest on capital is only permissible if explicitly stated in the deed.',
      'In the absence of an agreement, profits and losses are shared equally.',
      'No interest is allowed on capital or charged on drawings unless specified.',
      'Partners are entitled to 5% per annum interest on loans made to the firm.'
    ]
  },
  {
    id: 'vid-02',
    title: 'System Development + Evolution',
    subtitle: 'From Legacy Systems to Modern Distributed Accounting Systems',
    description: 'Explore the history of computing alongside modern system development lifecycles, from legacy systems to contemporary delivery models.',
    duration: '2h 10m',
    date: 'Aug 02, 2025',
    month: 'August',
    topic: 'Systems & Technology',
    thumbnailGradient: 'from-sky-500/30 to-blue-600/20',
    isCompleted: false,
    progressPercent: 60,
    chapters: [
      { title: '01. SDLC Phases: Analysis to Implementation', time: '00:00' },
      { title: '02. Cloud ERP & Real-Time Audit Trails', time: '35:20' },
      { title: '03. Internal Control Frameworks in Database Systems', time: '1:05:40' },
      { title: '04. Exam Questions on AIS Architecture', time: '1:45:00' }
    ],
    notesSummary: [
      'Segregation of duties must be architected at user permission levels.',
      'Automated transaction validation reduces suspense account frequencies.',
      'Batch processing vs online real-time transaction processing tradeoffs.'
    ]
  },
  {
    id: 'vid-03',
    title: 'Networking Fundamentals & Data Integrity',
    subtitle: 'OSI Model, Security Protocols & Audit Trail Verification',
    description: 'Deep dive into OSI models, TCP/IP protocols, and practical subnetting exercises for stronger network understanding and transaction security.',
    duration: '1h 35m',
    date: 'Jul 20, 2025',
    month: 'July',
    topic: 'Information Systems',
    thumbnailGradient: 'from-cyan-500/30 to-blue-500/20',
    isCompleted: false,
    progressPercent: 25,
    chapters: [
      { title: '01. Network Topologies in Financial Institutions', time: '00:00' },
      { title: '02. Encryption: In-Transit vs At-Rest', time: '28:10' },
      { title: '03. Backup Protocols & Disaster Recovery Planning', time: '55:30' }
    ],
    notesSummary: [
      'Offsite air-gapped backups protect ledger integrity against ransomware.',
      'Digital signature verification ensures non-repudiation in electronic invoices.'
    ]
  },
  {
    id: 'vid-04',
    title: 'Consolidated Financial Statements (LKAS 28 & 10)',
    subtitle: 'Parent-Subsidiary Relationships & Non-Controlling Interest',
    description: 'Step-by-step masterclass on acquiring subsidiaries, calculating goodwill on acquisition, and eliminating inter-company balances.',
    duration: '2h 25m',
    date: 'Jul 05, 2025',
    month: 'July',
    topic: 'Corporate Accounting',
    thumbnailGradient: 'from-indigo-600/30 to-sky-600/20',
    isCompleted: false,
    progressPercent: 0,
    chapters: [
      { title: '01. Control Definition & Fair Value Adjustments', time: '00:00' },
      { title: '02. Goodwill Calculation: Proportionate vs Full Fair Value', time: '40:15' },
      { title: '03. Unrealized Intra-Group Profits Elimination', time: '1:20:00' },
      { title: '04. Comprehensive Consolidated Balance Sheet Drill', time: '1:50:30' }
    ],
    notesSummary: [
      'Always eliminate 100% of inter-company sales and unrealized inventory profits.',
      'Allocate inventory mark-up adjustment between parent and NCI based on seller identity.'
    ]
  }
];

export const studyMaterialsData: StudyMaterial[] = [
  {
    id: 'mat-01',
    title: 'Lesson 08 - Financial Statements Complete Study Guide',
    subtitle: 'Comprehensive study notes covering Income Statements, SFP & Notes',
    description: 'Full theory explanation, 30 worked examples with comprehensive adjustments, tax provisions, and LKAS compliant layout templates.',
    category: 'Lesson Wise Tutes',
    batchTag: 'A/L 2025',
    isFree: false,
    priceLKR: 1500,
    priceUSD: 12,
    format: 'Physical Book + PDF',
    pageCount: 140,
    rating: 4.95,
    reviewsCount: 320,
    inStock: true
  },
  {
    id: 'mat-02',
    title: 'Lesson 09 - Partnership Accounts Revision Guide',
    subtitle: 'Detailed notes on Partnership Formation, Revaluation & Dissolution',
    description: 'Master the full partnership lifecycle with visual summary sheets, quick calculation shortcuts, and past exam trick questions.',
    category: 'Lesson Wise Tutes',
    batchTag: 'A/L 2025',
    isFree: true,
    priceLKR: 0,
    priceUSD: 0,
    format: 'Downloadable PDF',
    pageCount: 88,
    rating: 4.9,
    reviewsCount: 480,
    inStock: true
  },
  {
    id: 'mat-03',
    title: 'Complete Revision Kit - Commerce & Accounting',
    subtitle: 'Past paper analysis, targeted questions & high-yield summaries',
    description: 'The ultimate 400-page examination companion engineered specifically for students targeting Island Top 10 ranks.',
    category: 'Revision Notes',
    batchTag: 'A/L 2024',
    isFree: false,
    priceLKR: 4500,
    priceUSD: 35,
    format: 'Full Kit',
    pageCount: 412,
    rating: 5.0,
    reviewsCount: 650,
    inStock: true
  },
  {
    id: 'mat-04',
    title: 'Model Paper Set 01 - Predicted Examination Papers',
    subtitle: 'Set of 2 comprehensive model papers with step-by-step marking schemes',
    description: 'Simulated 3-hour examination papers calibrated to the exact difficulty and question styling of the official examination board.',
    category: 'Model Papers',
    batchTag: 'A/L 2025',
    isFree: true,
    priceLKR: 0,
    priceUSD: 0,
    format: 'Downloadable PDF',
    pageCount: 52,
    rating: 4.88,
    reviewsCount: 290,
    inStock: true
  },
  {
    id: 'mat-05',
    title: 'Past Paper Compendium (2015 - 2024 Classified by Topic)',
    subtitle: 'All 10 years of official questions reorganized chapter-by-chapter',
    description: 'No more flipping between random exam years. Study topic-by-topic with verified marking schemes for each section.',
    category: 'Past Paper Books',
    batchTag: 'A/L 2024',
    isFree: false,
    priceLKR: 3800,
    priceUSD: 30,
    format: 'Physical Book + PDF',
    pageCount: 320,
    rating: 4.97,
    reviewsCount: 512,
    inStock: true
  },
  {
    id: 'mat-06',
    title: 'Accounting Standards Quick Revision Pocket Guide',
    subtitle: 'LKAS 1, 2, 7, 8, 10, 16 & 28 distilled into bite-sized reference cards',
    description: 'High-density reference cards designed for rapid recall on the morning of your examination.',
    category: 'Revision Notes',
    batchTag: 'A/L 2025',
    isFree: false,
    priceLKR: 1200,
    priceUSD: 9,
    format: 'Physical Book + PDF',
    pageCount: 64,
    rating: 4.92,
    reviewsCount: 195,
    inStock: true
  }
];

export const announcementsData: Announcement[] = [
  {
    id: 'ann-01',
    type: 'SCHEDULE CHANGE',
    title: 'Economics Class Rescheduled',
    description: "Tomorrow's session is moved to 4:00 PM due to a public holiday. Live stream access links remain unchanged.",
    timeAgo: '2 hours ago',
    isUrgent: true
  },
  {
    id: 'ann-02',
    type: 'MOCK EXAM',
    title: 'Accounting Paper I Online Assessment',
    description: 'Available starting this Friday at 8:00 AM. Ensure all Chapter 1-4 modules are marked completed before starting.',
    timeAgo: 'Yesterday',
    isUrgent: false
  },
  {
    id: 'ann-03',
    type: 'RESOURCE UPDATE',
    title: '2024 Marking Scheme Uploaded',
    description: 'The official revised marking scheme for the 2024 National Accounting paper has been added to the Past Papers Library.',
    timeAgo: '3 days ago',
    isUrgent: false
  }
];

export const initialTasksData: StudentTask[] = [
  {
    id: 'task-01',
    title: 'Read Chapter 4-5 Notes (Partnership Goodwill)',
    courseCode: 'ACC201',
    dueDate: 'Tomorrow',
    isCompleted: false,
    priority: 'high'
  },
  {
    id: 'task-02',
    title: 'Submit Cash Flow Statement Problem Set #3',
    courseCode: 'ACC201',
    dueDate: 'Today 11:59 PM',
    isCompleted: false,
    priority: 'high'
  },
  {
    id: 'task-03',
    title: 'Review Past Paper 2023 Section B - Question 4',
    courseCode: 'ECON102',
    dueDate: 'In 3 days',
    isCompleted: true,
    priority: 'medium'
  },
  {
    id: 'task-04',
    title: 'Complete Quiz on LKAS 16 Property Plant & Equipment',
    courseCode: 'ACC201',
    dueDate: 'This Sunday',
    isCompleted: false,
    priority: 'normal'
  }
];

export const wallOfFameData: WallOfFameRanker[] = [
  {
    id: 'rank-2025-01',
    rank: 1,
    name: 'Sadini Nimnathara',
    achievement: 'Island 1st - Commerce Stream (2025)',
    year: 2025,
    school: 'Maliyadeva Balika Vidyalaya',
    district: 'Kurunegala',
    zScore: '2.8941',
    indexNo: '2620936',
    university: 'University of Colombo (Faculty of Management & Finance)',
    subjects: 'Accounting (A), Economics (A), Business Studies (A)',
    quote: 'The rigorous LKAS standard analyses and weekly mock papers at Inspire transformed my entire preparation. Mrs. Ruwanthi ensured every concept was intuitive.',
    videoDuration: '4:30 min'
  },
  {
    id: 'rank-01',
    rank: 1,
    name: 'Kasun Perera',
    achievement: 'Island 1st - Commerce Stream (2023)',
    year: 2023,
    school: 'Royal College, Colombo',
    district: 'Colombo',
    zScore: '2.8412',
    indexNo: '2109482',
    university: 'University of Colombo (Faculty of Management & Finance)',
    subjects: 'Accounting (A), Economics (A), Business Studies (A)',
    quote: 'The systematic structure, clarity of lecture notes, and weekly paper discussions at Inspire were the sole reason I secured Island 1st rank.',
    videoDuration: '3:45 min'
  },
  {
    id: 'rank-03',
    rank: 3,
    name: 'Nuwantha Bandara',
    achievement: 'Island 3rd - Commerce Stream (2022)',
    year: 2022,
    school: 'Kingswood College, Kandy',
    district: 'Kandy',
    zScore: '2.7680',
    indexNo: '2084931',
    university: 'University of Sri Jayewardenepura (Faculty of Management)',
    subjects: 'Accounting (A), Economics (A), Business Studies (A)',
    quote: 'Even attending online from Kandy, the live speed, past paper library, and personal doubt clarifications made me feel right in the front row.',
    videoDuration: '2:50 min'
  },
  {
    id: 'rank-2022-05',
    rank: 5,
    name: 'Anupama Kenulda Silva',
    achievement: 'Island 5th - Commerce Stream (2022)',
    year: 2022,
    school: 'Royal College, Colombo',
    district: 'Colombo',
    zScore: '2.7810',
    indexNo: '2102633',
    university: 'University of Colombo (Faculty of Management & Finance)',
    subjects: 'Accounting (A), Economics (A), Business Studies (A)',
    quote: 'Inspire provided the most rigorous exam preparation available in Sri Lanka. Ruwanthi Miss teaches you not just to pass, but to excel with precision.',
    videoDuration: '3:15 min'
  },
  {
    id: 'rank-05',
    rank: 5,
    name: 'Amandi Silva',
    achievement: 'Island 5th - Commerce Stream (2023)',
    year: 2023,
    school: 'Visakha Vidyalaya, Colombo',
    district: 'Colombo',
    zScore: '2.7150',
    indexNo: '2118394',
    university: 'University of Sri Jayewardenepura (Faculty of Management)',
    subjects: 'Accounting (A), Economics (A), Business Studies (A)',
    quote: 'From confusing accounting standards to crystal-clear intuition. Ruwanthi Miss teaches you not just to pass, but to think like a chartered accountant.',
    videoDuration: '4:12 min'
  },
  {
    id: 'rank-2024-04',
    rank: 4,
    name: 'Senula Methmira',
    achievement: 'Island 4th / District 1st - Galle (2024)',
    year: 2024,
    school: 'Mahinda College, Galle',
    district: 'Galle',
    zScore: '2.7340',
    indexNo: '2491028',
    university: 'University of Colombo (Faculty of Management & Finance)',
    subjects: 'Accounting (A), Economics (A), Business Studies (A)',
    quote: 'The revision kits and mock exam simulations under real timing gave me 100% confidence on the final exam day.',
    videoDuration: '3:30 min'
  },
  {
    id: 'rank-07',
    rank: 7,
    name: 'Kaveesha De Silva',
    achievement: 'Island 7th - Commerce Stream (2022)',
    year: 2022,
    school: 'Ananda College, Colombo',
    district: 'Colombo',
    zScore: '2.6890',
    indexNo: '2093847',
    university: 'University of Kelaniya (Faculty of Commerce & Management)',
    subjects: 'Accounting (A), Economics (A), Business Studies (A)',
    quote: 'The step-by-step cash flow statements and partnership breakdown techniques made high-difficulty exam questions effortless.',
    videoDuration: '3:20 min'
  },
  {
    id: 'rank-2024-08',
    rank: 8,
    name: 'Dinithi Jayasuriya',
    achievement: 'Island 8th / District 2nd - Colombo (2024)',
    year: 2024,
    school: 'Devi Balika Vidyalaya',
    district: 'Colombo',
    zScore: '2.6950',
    indexNo: '2418390',
    university: 'University of Sri Jayewardenepura (Faculty of Management)',
    subjects: 'Accounting (A), Economics (A), Business Studies (A)',
    quote: 'The individual feedback on model papers helped me spot subtle errors in balance sheet adjustments that cost marks.',
    videoDuration: '2:40 min'
  }
];

export const courseDisciplines = [
  {
    title: 'Theory',
    badge: 'Core Curriculum',
    description: 'In-depth coverage of the entire syllabus from foundational principles to advanced corporate standards and consolidation methods.',
    highlights: ['200+ Guided Hours', 'Comprehensive Textbook Handouts', 'Weekly Quizzes']
  },
  {
    title: 'Revision',
    badge: 'High-Yield Drill',
    description: 'Targeted review sessions focusing on high-yield topics, common student misconceptions, and exam strategies.',
    highlights: ['Fast-Paced Synthesis', 'LKAS Summary Flashcards', 'Time Management Hacks']
  },
  {
    title: 'Paper Class',
    badge: 'Simulated Exams',
    description: 'Rigorous practice with past papers and model questions under simulated exam conditions with individualized marking.',
    highlights: ['Timed 3-Hour Sessions', 'Line-by-Line Marking Schemes', 'Rank Analysis Reports']
  },
  {
    title: 'Fast Track',
    badge: 'Sprint Program',
    description: 'Intensive crash course designed for final month preparation and rapid revision before the national examination.',
    highlights: ['4-Week Focused Sprint', '100 Guaranteed Score Boosters', 'Direct Doubt Clearing']
  }
];
