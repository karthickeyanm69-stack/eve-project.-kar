export interface Lesson {
  id: string;
  title: string;
  type: 'reading' | 'quiz' | 'reward' | 'assessment';
  content?: string;
  duration?: string;
  xpValue: number;
  completed?: boolean;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Course {
  id: string;
  title: string;
  category: string;
  instructor: string;
  progress: number; // 0 to 100
  lessons: Lesson[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
}

export interface DailyChallenge {
  id: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  description: string;
  starterCode: string;
  solutionTemplate: string;
  testCases: { input: string; expected: string }[];
  xpReward: number;
  coinsReward: number;
}

export interface AptitudeQuestion {
  id: string;
  category: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface MiniProject {
  id: string;
  title: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  objective: string;
  steps: string[];
  starterCode: string;
  checker: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlockedAt?: string;
  progress: number; // 0 to 100
  maxProgress: number;
  icon: string;
  type: 'xp' | 'streak' | 'course' | 'code' | 'interview' | 'aptitude' | 'project';
}

export interface Guild {
  id: string;
  name: string;
  tag: string;
  membersCount: number;
  maxMembers: number;
  totalXp: number;
  description: string;
  joined: boolean;
  messages: { sender: string; avatar: string; text: string; timestamp: string }[];
}

export interface UserState {
  displayName: string;
  email: string;
  isLoggedIn: boolean;
  level: number;
  xp: number;
  nextLevelXp: number;
  streak: number;
  coins: number;
  careerReadinessScore: number;
  activeCourseId: string;
  activeLessonId: string;
  completedLessonIds: string[];
  badgesCount: number;
  weeklyProgress: { day: string; xp: number }[];
}
