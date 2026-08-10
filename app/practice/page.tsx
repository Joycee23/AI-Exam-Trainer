'use client';

import { useEffect, useState, useMemo, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getQuestionsByModule, getQuestionsByTopic, allQuestions } from '@/data/questions';
import { getModule, getTopic } from '@/data/modules';
import { saveAnswer, toggleBookmark, getProgress } from '@/lib/storage';
import QuestionCard from '@/components/QuestionCard';
import ProgressBar from '@/components/ProgressBar';
import { ArrowLeft, RotateCcw, Trophy } from 'lucide-react';
import { Question } from '@/types/question';

function PracticeContent() {
  const searchParams = useSearchParams();
  const moduleId = searchParams.get('module');
  const topicId = searchParams.get('topic');

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [isComplete, setIsComplete] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Get questions based on params
  const questions: Question[] = useMemo(() => {
    if (topicId) {
      return getQuestionsByTopic(topicId);
    }
    if (moduleId) {
      return getQuestionsByModule(moduleId);
    }
    return allQuestions;
  }, [moduleId, topicId]);

  // Shuffle questions on mount
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);

  useEffect(() => {
    setMounted(true);
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    setShuffledQuestions(shuffled);

    // Load bookmarks
    const progress = getProgress();
    setBookmarkedIds(new Set(progress.bookmarkedQuestions));
  }, [questions]);

  const currentQuestion = shuffledQuestions[currentIndex];

  // Title
  const getTitle = () => {
    if (topicId) {
      const result = getTopic(topicId);
      if (result) return `${result.topic.id} — ${result.topic.name}`;
    }
    if (moduleId) {
      const mod = getModule(moduleId);
      if (mod) return `Module ${mod.id} — ${mod.name}`;
    }
    return 'Practice Mode';
  };

  const getSubtitle = () => {
    if (topicId) {
      const result = getTopic(topicId);
      if (result) return `Module ${result.module.id}`;
    }
    if (moduleId) return 'Luyện toàn bộ module';
    return 'Tất cả câu hỏi';
  };

  const getModuleColor = () => {
    if (topicId) {
      const result = getTopic(topicId);
      if (result) return result.module.color;
    }
    if (moduleId) {
      const mod = getModule(moduleId);
      if (mod) return mod.color;
    }
    return '#8B5CF6';
  };

  const handleAnswer = useCallback(
    (questionId: string, selectedAnswer: number, isCorrect: boolean) => {
      setAnswered((prev) => prev + 1);
      if (isCorrect) setScore((prev) => prev + 1);

      saveAnswer({
        questionId,
        selectedAnswer,
        correctAnswer: shuffledQuestions[currentIndex]?.answer ?? 0,
        isCorrect,
        answeredAt: Date.now(),
      });
    },
    [currentIndex, shuffledQuestions]
  );

  const handleNext = useCallback(() => {
    if (currentIndex < shuffledQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsComplete(true);
    }
  }, [currentIndex, shuffledQuestions.length]);

  const handleBookmark = useCallback((questionId: string) => {
    toggleBookmark(questionId);
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(questionId)) {
        next.delete(questionId);
      } else {
        next.add(questionId);
      }
      return next;
    });
  }, []);

  const handleRestart = () => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    setShuffledQuestions(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setAnswered(0);
    setIsComplete(false);
  };

  if (!mounted || shuffledQuestions.length === 0) {
    return (
      <div className="max-w-3xl mx-auto text-center py-20">
        <p className="text-gray-400 text-lg">
          {!mounted ? 'Đang tải...' : 'Không có câu hỏi nào cho chủ đề này.'}
        </p>
        <Link href="/modules" className="text-violet-400 hover:underline mt-2 inline-block">
          ← Chọn chủ đề khác
        </Link>
      </div>
    );
  }

  // Completion screen
  if (isComplete) {
    const accuracy = answered > 0 ? Math.round((score / answered) * 100) : 0;
    return (
      <div className="max-w-xl mx-auto text-center py-12">
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 animate-slide-up">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
            <Trophy size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Hoàn thành!</h2>
          <p className="text-gray-400 mb-6">{getTitle()}</p>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white/[0.03] rounded-xl p-4">
              <p className="text-2xl font-bold text-white">{answered}</p>
              <p className="text-xs text-gray-500">Tổng câu</p>
            </div>
            <div className="bg-white/[0.03] rounded-xl p-4">
              <p className="text-2xl font-bold text-emerald-400">{score}</p>
              <p className="text-xs text-gray-500">Đúng</p>
            </div>
            <div className="bg-white/[0.03] rounded-xl p-4">
              <p className="text-2xl font-bold" style={{ color: getModuleColor() }}>
                {accuracy}%
              </p>
              <p className="text-xs text-gray-500">Accuracy</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleRestart}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium
                bg-gradient-to-r from-violet-600 to-cyan-600 text-white
                hover:from-violet-500 hover:to-cyan-500 transition-all"
            >
              <RotateCcw size={16} />
              Làm lại
            </button>
            <Link href={moduleId ? `/modules/${moduleId}` : '/modules'}>
              <button className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium
                bg-white/[0.05] border border-white/[0.1] text-gray-300 hover:bg-white/[0.08] transition-all w-full">
                Quay lại Module
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const progress = ((currentIndex) / shuffledQuestions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link
          href={moduleId ? `/modules/${moduleId}` : '/modules'}
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-3"
        >
          <ArrowLeft size={16} />
          {getSubtitle()}
        </Link>
        <h1 className="text-lg md:text-xl font-bold text-white">{getTitle()}</h1>

        {/* Progress */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
            <span>Câu {currentIndex + 1} / {shuffledQuestions.length}</span>
            <span>Đúng: {score}/{answered}</span>
          </div>
          <ProgressBar value={progress} size="sm" color={getModuleColor()} showLabel={false} />
        </div>
      </div>

      {/* Question */}
      {currentQuestion && (
        <QuestionCard
          question={currentQuestion}
          questionNumber={currentIndex + 1}
          totalQuestions={shuffledQuestions.length}
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

export default function PracticePage() {
  return (
    <Suspense fallback={<div className="max-w-3xl mx-auto text-center py-20"><p className="text-gray-400">Đang tải...</p></div>}>
      <PracticeContent />
    </Suspense>
  );
}
