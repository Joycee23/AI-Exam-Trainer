// ============================================================
// AI Exam Trainer — Type Definitions
// ============================================================

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Question {
  id: string;           // e.g. "A1-001"
  module: string;       // e.g. "A"
  topic: string;        // e.g. "A1"
  difficulty: Difficulty;
  question: string;
  options: [string, string, string, string]; // Exactly 4 options
  answer: 0 | 1 | 2 | 3; // 0=A, 1=B, 2=C, 3=D
  explanation: string;
  tip: string;          // Learning tip / mẹo nhớ
  tags: string[];
}

export interface Topic {
  id: string;           // e.g. "A1"
  moduleId: string;     // e.g. "A"
  name: string;         // e.g. "Đại số tuyến tính cơ bản"
  targetCount: number;  // Target number of questions
  icon?: string;
}

export interface Module {
  id: string;           // e.g. "A"
  name: string;         // e.g. "Toán học & Tư duy định lượng"
  description: string;
  icon: string;         // Lucide icon name
  color: string;        // Accent color for the module
  topics: Topic[];
}

// ============================================================
// Session & Progress Types
// ============================================================

export interface QuizSession {
  questions: Question[];
  currentIndex: number;
  answers: (number | null)[];   // User's selected answers
  isComplete: boolean;
  score: number;
  totalAnswered: number;
}

export interface ExamSession extends QuizSession {
  timeLimit: number;       // seconds
  timeRemaining: number;   // seconds
  isSubmitted: boolean;
  startedAt: number;       // timestamp
}

export interface AnswerRecord {
  questionId: string;
  selectedAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
  answeredAt: number;      // timestamp
}

export interface UserProgress {
  totalAnswered: number;
  totalCorrect: number;
  highScore: number;        // best exam score percentage
  answeredQuestions: Record<string, AnswerRecord>; // questionId -> record
  bookmarkedQuestions: string[];  // question IDs
  lastSessionDate: string;
}

// ============================================================
// Cheat Sheet Types
// ============================================================

export interface CheatSheetSection {
  title: string;
  items: CheatSheetItem[];
}

export interface CheatSheetItem {
  label: string;
  formula?: string;
  description: string;
}

export interface CheatSheetModule {
  moduleId: string;
  moduleName: string;
  sections: CheatSheetSection[];
}
