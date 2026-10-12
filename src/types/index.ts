export type ActiveTab = 'home' | 'lms' | 'past-papers' | 'videos' | 'store' | 'results' | 'login';

export type Medium = 'sinhala' | 'english' | 'tamil';

export interface PastPaper {
  id: string;
  year: number;
  subject: string;
  medium: Medium;
  title: string;
  subtitle: string;
  pages: number;
  fileSize: string;
  hasMarkingScheme: boolean;
  downloadCount: number;
  category: 'Final Exam' | 'Mid-Term Assessment' | 'Mock Examination' | 'Model Paper' | 'Practical Theory';
}

export interface VideoModule {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  duration: string;
  date: string;
  month: string;
  topic: string;
  thumbnailGradient: string;
  isCompleted?: boolean;
  progressPercent?: number;
  chapters: { title: string; time: string }[];
  notesSummary: string[];
}

export interface StudyMaterial {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: 'Lesson Wise Tutes' | 'Revision Notes' | 'Past Paper Books' | 'Model Papers';
  batchTag: string; // e.g. "A/L 2025", "A/L 2024"
  isFree: boolean;
  priceLKR: number;
  priceUSD: number;
  format: 'Physical Book + PDF' | 'Downloadable PDF' | 'Full Kit';
  pageCount: number;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
}

export interface Lesson {
  id: string;
  lessonNumber: string;
  title: string;
  chapter: string;
  description: string;
  lastAccessed: string;
  durationMinutes: number;
  isCompleted: boolean;
  category: 'My Lessons' | 'Practical Sessions' | 'Tutes' | 'Past Papers';
  progress: number;
}

export interface Announcement {
  id: string;
  type: 'SCHEDULE CHANGE' | 'MOCK EXAM' | 'IMPORTANT NOTICE' | 'RESOURCE UPDATE';
  title: string;
  description: string;
  timeAgo: string;
  isUrgent?: boolean;
}

export interface StudentTask {
  id: string;
  title: string;
  courseCode: string;
  dueDate: string;
  isCompleted: boolean;
  priority: 'high' | 'medium' | 'normal';
}

export interface WallOfFameRanker {
  id: string;
  rank: number;
  name: string;
  achievement: string;
  year: number;
  school: string;
  district: string;
  zScore: string;
  quote: string;
  videoDuration: string;
  indexNo?: string;
  university?: string;
  subjects?: string;
}

export interface CartItem {
  material: StudyMaterial;
  quantity: number;
}

export interface CurrentUser {
  id: string;
  name: string;
  role: 'Student' | 'Tutor' | 'Parent';
  indexNumber: string;
  batch: string;
  overallProgress: number;
  avatarUrl?: string;
  email: string;
  phone: string;
}
