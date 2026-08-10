'use client';

import { useState, useEffect, useMemo, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { modules } from '@/data/modules';
import { getRandomQuestions, getQuestionsByIds } from '@/data/questions';
import { getMistakeIds, saveAnswer, toggleBookmark, getProgress } from '@/lib/storage';
import QuestionCard from '@/components/QuestionCard';
import ProgressBar from '@/components/ProgressBar';
import { Question } from '@/types/question';
import {
  Zap,
  Shuffle,
  Calculator,
  Code2,
  Brain,
  Shield,
  XCircle,
  Trophy,
  RotateCcw,
  ArrowLeft,
} from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  A: <Calculator size={18} />,
  B: <Code2 size={18} />,
  C: <Brain size={18} />,
  D: <Shield size={18} />,
};

type Mode = 'setup' | 'practice' | 'complete';

export default function QuickPracticePage() {
  const [mode, setMode] = useState<Mode>('setup');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);
  const [practiceTitle, setPracticeTitle] = useState('');

  useEffect(() => {
    setMounted(true);
    const progress = getProgress();
    setBookmarkedIds(new Set(progress.bookmarkedQuestions));
  }, []);

  const startRandom = (moduleId?: string) => {
    const qs = getRandomQuestions(10, moduleId);
    if (qs.length === 0) return;
    setQuestions(qs);
    setCurrentIndex(0);
    setScore(0);
    setAnswered(0);
    setPracticeTitle(moduleId ? `Module ${moduleId} — Random 10` : 'Random 10 câu');
    setMode('practice');
  };

  const startMistakes = () => {
    const ids = getMistakeIds();
    const qs = getQuestionsByIds(ids).sort(() => Math.random() - 0.5).slice(0, 10);
    if (qs.length === 0) return;
    setQuestions(qs);
    setCurrentIndex(0);
    setScore(0);
    setAnswered(0);
    setPracticeTitle('Câu tôi từng sai');
    setMode('practice');
  };

  const handleAnswer = useCallback(
    (questionId: string, selectedAnswer: number, isCorrect: boolean) => {
      setAnswered((p) => p + 1);
      if (isCorrect) setScore((p) => p + 1);
      saveAnswer({
        questionId,
        selectedAnswer,
        correctAnswer: questions[currentIndex]?.answer ?? 0,
        isCorrect,
        answeredAt: Date.now(),
      });
    },
    [currentIndex, questions]
  );

  const handleNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((p) => p + 1);
    } else {
      setMode('complete');
    }
  }, [currentIndex, questions.length]);

  const handleBookmark = useCallback((questionId: string) => {
    toggleBookmark(questionId);
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(questionId)) next.delete(questionId);
      else next.add(questionId);
      return next;
    });
  }, []);

  const mistakeCount = useMemo(() => {
    if (!mounted) return 0;
    return getMistakeIds().length;
  }, [mounted]);

  // ========================================
  // SETUP
  // ========================================
  if (mode === 'setup') {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
            <Zap size={28} className="text-white" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Quick Practice</h1>
          <p className="text-gray-400">Random 10 câu — chọn nguồn câu hỏi</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Random All */}
          <button
            onClick={() => startRandom()}
            className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5
              hover:border-violet-500/30 hover:bg-violet-500/5 transition-all group cursor-pointer text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-violet-500/15 flex items-center justify-center mb-3">
              <Shuffle size={20} className="text-violet-400" />
            </div>
            <h3 className="text-white font-semibold mb-1 group-hover:text-violet-400 transition-colors">
              Random tất cả
            </h3>
            <p className="text-xs text-gray-500">10 câu random từ tất cả module</p>
          </button>

          {/* Mistakes Only */}
          <button
            onClick={startMistakes}
            disabled={mistakeCount === 0}
            className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5
              hover:border-red-500/30 hover:bg-red-500/5 transition-all group cursor-pointer text-left
              disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <div className="w-10 h-10 rounded-xl bg-red-500/15 flex items-center justify-center mb-3">
              <XCircle size={20} className="text-red-400" />
            </div>
            <h3 className="text-white font-semibold mb-1 group-hover:text-red-400 transition-colors">
              Chỉ câu tôi từng sai
            </h3>
            <p className="text-xs text-gray-500">
              {mounted ? `${mistakeCount} câu sai` : '...'}
            </p>
          </button>
        </div>

        {/* Per Module */}
        <h3 className="text-sm font-semibold text-gray-400 mb-3">Theo Module</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {modules.map((mod) => (
            <button
              key={mod.id}
              onClick={() => startRandom(mod.id)}
              className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4
                hover:border-white/[0.15] hover:bg-white/[0.05] transition-all group cursor-pointer text-left"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{ background: `${mod.color}20` }}
                >
                  <span style={{ color: mod.color }}>{iconMap[mod.id]}</span>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white">Module {mod.id}</h4>
                  <p className="text-xs text-gray-500">{mod.name}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ========================================
  // COMPLETE
  // ========================================
  if (mode === 'complete') {
    const accuracy = answered > 0 ? Math.round((score / answered) * 100) : 0;
    return (
      <div className="max-w-xl mx-auto text-center py-12">
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 animate-slide-up">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
            <Trophy size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Hoàn thành!</h2>
          <p className="text-gray-400 mb-6">{practiceTitle}</p>
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white/[0.03] rounded-xl p-4">
              <p className="text-2xl font-bold text-white">{answered}</p>
              <p className="text-xs text-gray-500">Tổng</p>
            </div>
            <div className="bg-white/[0.03] rounded-xl p-4">
              <p className="text-2xl font-bold text-emerald-400">{score}</p>
              <p className="text-xs text-gray-500">Đúng</p>
            </div>
            <div className="bg-white/[0.03] rounded-xl p-4">
              <p className="text-2xl font-bold text-violet-400">{accuracy}%</p>
              <p className="text-xs text-gray-500">Accuracy</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => setMode('setup')}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium
                bg-gradient-to-r from-violet-600 to-cyan-600 text-white
                hover:from-violet-500 hover:to-cyan-500 transition-all"
            >
              <RotateCcw size={16} />
              Luyện tiếp
            </button>
            <Link href="/">
              <button className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium
                bg-white/[0.05] border border-white/[0.1] text-gray-300 hover:bg-white/[0.08] transition-all w-full">
                Dashboard
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ========================================
  // PRACTICE
  // ========================================
  const currentQuestion = questions[currentIndex];
  const progress = (currentIndex / questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => setMode('setup')}
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-3"
        >
          <ArrowLeft size={16} />
          Quick Practice
        </button>
        <h1 className="text-lg md:text-xl font-bold text-white">{practiceTitle}</h1>
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
            <span>Câu {currentIndex + 1} / {questions.length}</span>
            <span>Đúng: {score}/{answered}</span>
          </div>
          <ProgressBar value={progress} size="sm" showLabel={false} />
        </div>
      </div>

      {currentQuestion && (
        <QuestionCard
          question={currentQuestion}
          questionNumber={currentIndex + 1}
          totalQuestions={questions.length}
          onAnswer={handleAnswer}
          onNext={handleNext}
          onBookmark={handleBookmark}
          isBookmarked={bookmarkedIds.has(currentQuestion.id)}
          showFeedback={true}
        />
      )}
    </div>
  );
}
