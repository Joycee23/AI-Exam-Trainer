// ============================================================
// AI Exam Trainer — localStorage Abstraction Layer
// ============================================================
// Toàn bộ state persistence đi qua file này.
// Dễ dàng migrate sang Supabase/API bằng cách thay đổi implementation.
// ============================================================

import { UserProgress, AnswerRecord } from '@/types/question';

const STORAGE_KEY = 'ai-exam-trainer-progress';

function getDefaultProgress(): UserProgress {
  return {
    totalAnswered: 0,
    totalCorrect: 0,
    highScore: 0,
    answeredQuestions: {},
    bookmarkedQuestions: [],
    lastSessionDate: new Date().toISOString(),
  };
}

// ============================================================
// Core CRUD
// ============================================================

export function getProgress(): UserProgress {
  if (typeof window === 'undefined') return getDefaultProgress();
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return getDefaultProgress();
    return JSON.parse(data) as UserProgress;
  } catch {
    return getDefaultProgress();
  }
}

export function saveProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') return;
  try {
    progress.lastSessionDate = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error('Failed to save progress:', e);
  }
}

// ============================================================
// Answer Recording
// ============================================================

export function saveAnswer(record: AnswerRecord): void {
  const progress = getProgress();

  // Check if this question was already answered
  const existing = progress.answeredQuestions[record.questionId];

  if (!existing) {
    // First time answering
    progress.totalAnswered++;
    if (record.isCorrect) {
      progress.totalCorrect++;
    }
  } else {
    // Re-answering: update correct count
    if (existing.isCorrect && !record.isCorrect) {
      progress.totalCorrect--;
    } else if (!existing.isCorrect && record.isCorrect) {
      progress.totalCorrect++;
    }
  }

  progress.answeredQuestions[record.questionId] = record;
  saveProgress(progress);
}

// ============================================================
// Mistakes
// ============================================================

export function getMistakeIds(): string[] {
  const progress = getProgress();
  return Object.entries(progress.answeredQuestions)
    .filter(([, record]) => !record.isCorrect)
    .map(([id]) => id);
}

export function clearMistake(questionId: string): void {
  const progress = getProgress();
  const record = progress.answeredQuestions[questionId];
  if (record && !record.isCorrect) {
    delete progress.answeredQuestions[questionId];
    progress.totalAnswered--;
    saveProgress(progress);
  }
}

// ============================================================
// Bookmarks
// ============================================================

export function toggleBookmark(questionId: string): boolean {
  const progress = getProgress();
  const idx = progress.bookmarkedQuestions.indexOf(questionId);
  if (idx === -1) {
    progress.bookmarkedQuestions.push(questionId);
    saveProgress(progress);
    return true; // bookmarked
  } else {
    progress.bookmarkedQuestions.splice(idx, 1);
    saveProgress(progress);
    return false; // unbookmarked
  }
}

export function isBookmarked(questionId: string): boolean {
  return getProgress().bookmarkedQuestions.includes(questionId);
}

// ============================================================
// High Score
// ============================================================

export function updateHighScore(score: number): boolean {
  const progress = getProgress();
  if (score > progress.highScore) {
    progress.highScore = score;
    saveProgress(progress);
    return true;
  }
  return false;
}

// ============================================================
// Statistics Helpers
// ============================================================

export function getModuleStats(moduleId: string) {
  const progress = getProgress();
  const moduleAnswers = Object.entries(progress.answeredQuestions)
    .filter(([id]) => id.startsWith(moduleId))
    .map(([, record]) => record);

  const total = moduleAnswers.length;
  const correct = moduleAnswers.filter((r) => r.isCorrect).length;

  return {
    total,
    correct,
    wrong: total - correct,
    accuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
  };
}

export function getTopicStats(topicId: string) {
  const progress = getProgress();
  const topicAnswers = Object.entries(progress.answeredQuestions)
    .filter(([id]) => id.startsWith(topicId + '-'))
    .map(([, record]) => record);

  const total = topicAnswers.length;
  const correct = topicAnswers.filter((r) => r.isCorrect).length;

  return {
    total,
    correct,
    wrong: total - correct,
    accuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
  };
}

export function getOverallStats() {
  const progress = getProgress();
  return {
    totalAnswered: progress.totalAnswered,
    totalCorrect: progress.totalCorrect,
    totalWrong: progress.totalAnswered - progress.totalCorrect,
    accuracy: progress.totalAnswered > 0
      ? Math.round((progress.totalCorrect / progress.totalAnswered) * 100)
      : 0,
    highScore: progress.highScore,
  };
}

// ============================================================
// Reset
// ============================================================

export function resetAllProgress(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}
