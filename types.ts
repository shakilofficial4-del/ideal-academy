
export enum ViewMode {
  CLASS_SELECTOR = 'class_selector',
  CHAPTER_LIST = 'chapter_list',
  LESSON_VIEWER = 'lesson_viewer',
  DASHBOARD = 'dashboard',
  QUIZ = 'quiz',
  ADMIN = 'admin',
  COURSES = 'courses',
  LEADERBOARD = 'leaderboard',
  AI_CHAT = 'ai_chat',
  MESSAGES = 'messages',
  IMAGE_EDITOR = 'image_editor'
}

export enum AuthMethod {
  OTP = 'otp',
  PASSWORD = 'password',
  BOTH = 'both'
}

export interface Lesson {
  id: string;
  title: string;
  videoUrl: string;
  description: string;
}

export interface Chapter {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Subject {
  id: string;
  title: string;
  icon: string;
  chapters: Chapter[];
}

export interface ClassCategory {
  id: string;
  title: string;
  icon: string;
  subjects: Subject[];
}

export interface AdminConfig {
  appName: string;
  appLogo: string; 
  brandColor: string;
  secondaryColor: string;
  systemInstruction: string;
  welcomeMessage: string;
  messagingEnabled: boolean;
  rankingEnabled: boolean;
  authMethod: AuthMethod;
  parentMobileMandatory: boolean;
  classes: ClassCategory[];
  courses: any[];
  navIcons: any;
}

export interface UserProfile {
  id: string;
  name: string;
  className: string;
  school: string;
  studentMobile: string;
  parentMobile: string;
  password?: string;
  points: number;
  rank: number;
  brainPower: number;
  streak: number;
  followersCount: number;
  isFollowing?: boolean;
  allowMessaging: boolean;
  theme?: 'light' | 'dark';
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  className: string;
  school: string;
  points: number;
  rank: number;
  isCurrentUser?: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: number;
}

export interface MessageRequest {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  status: 'pending' | 'accepted' | 'declined';
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface QuizResult {
  id: string;
  topic: string;
  subject: string;
  className: string;
  score: number;
  total: number;
  date: string;
}

export interface StudyPlanDay {
  day: number;
  topics: string[];
  duration: string;
  goal: string;
}
