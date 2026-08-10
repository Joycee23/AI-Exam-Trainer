'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { allQuestions, getRandomQuestions } from '@/data/questions';
import { saveAnswer, updateHighScore } from '@/lib/storage';
import QuestionCard from '@/components/QuestionCard';
import ProgressBar from '@/components/ProgressBar';
import Timer from '@/components/Timer';
import ExplanationCard from '@/components/ExplanationCard';
import LearningTip from '@/components/LearningTip';
import {
  ClipboardCheck,
  Clock,
  Trophy,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Send,
  AlertTriangle,
} from 'lucide-react';
import Link from 'next/link';
import { Question } from '@/types/question';

type ExamPhase = 'setup' | 'exam' | 'review';

const examOptions = [
  { count: 10, time: 10, label: '10 câu', subtitle: '10 phút' },
  { count: 20, time: 20, label: '20 câu', subtitle: '20 phút' },
  { count: 30, time: 30, label: '30 câu', subtitle: '30 phút' },
  { count: 50, time: 50, label: '50 câu', subtitle: '50 phút' },
];

export default function ExamPage() {
  const [phase, setPhase] = useState<ExamPhase>('setup');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLimit, setTimeLimit] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [reviewIndex, setReviewIndex] = useState(0);

  const handleStartExam = (count: number, minutes: number) => {
    const examQuestions = getRandomQuestions(count);
    setQuestions(examQuestions);
    setAnswers({});
    setCurrentIndex(0);
    setTimeLimit(minutes * 60);
    setIsTimerRunning(true);
    setPhase('exam');
  };

  const handleStartFull = () => {
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    setQuestions(shuffled);
    setAnswers({});
    setCurrentIndex(0);
    setTimeLimit(shuffled.length * 60); // 1 min per question
    setIsTimerRunning(true);
    setPhase('exam');
  };

  const handleAnswer = useCallback(
    (_questionId: string, selectedAnswer: number) => {
      setAnswers((prev) => ({ ...prev, [currentIndex]: selectedAnswer }));
    },
    [currentIndex]
  );

  const handleSubmit = useCallback(() => {
    setIsTimerRunning(false);

    // Save all answers
    questions.forEach((q, idx) => {
      const selected = answers[idx];
      if (selected !== undefined) {
        saveAnswer({
          questionId: q.id,
          selectedAnswer: selected,
          correctAnswer: q.answer,
          isCorrect: selected === q.answer,
          answeredAt: Date.now(),
        });
      }
    });

    // Calculate and save high score
    const answeredCount = Object.keys(answers).length;
    const correctCount = questions.filter((q, idx) => answers[idx] === q.answer).length;
    const scorePercent = answeredCount > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
    updateHighScore(scorePercent);

    setReviewIndex(0);
    setPhase('review');
  }, [questions, answers]);

  const handleTimeUp = useCallback(() => {
    handleSubmit();
  }, [handleSubmit]);

  // Exam keyboard shortcuts
  useEffect(() => {
    if (phase !== 'exam') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === 'ArrowRight' && currentIndex < questions.length - 1) {
        setCurrentIndex((p) => p + 1);
      }
      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        setCurrentIndex((p) => p - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, currentIndex, questions.length]);

  // Stats for review
  const examStats = useMemo(() => {
    const answeredCount = Object.keys(answers).length;
    const correctCount = questions.filter((q, idx) => answers[idx] === q.answer).length;
    const wrongCount = answeredCount - correctCount;
    const unanswered = questions.length - answeredCount;
    const accuracy = answeredCount > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
    return { answeredCount, correctCount, wrongCount, unanswered, accuracy };
  }, [questions, answers]);

  // ========================================
  // SETUP PHASE
  // ========================================
  if (phase === 'setup') {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-500 to-red-500 flex items-center justify-center">
            <ClipboardCheck size={28} className="text-white" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Exam Mode</h1>
          <p className="text-gray-400">Chọn số câu hỏi để bắt đầu bài thi thử</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {examOptions.map((opt) => (
            <button
              key={opt.count}
              onClick={() => handleStartExam(opt.count, opt.time)}
              className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 text-center
                hover:border-violet-500/30 hover:bg-violet-500/5 transition-all duration-300 group cursor-pointer"
            >
              <p className="text-2xl font-bold text-white group-hover:text-violet-400 transition-colors">
                {opt.label}
              </p>
              <div className="flex items-center justify-center gap-1 mt-2 text-xs text-gray-500">
                <Clock size={12} />
                {opt.subtitle}
              </div>
            </button>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={handleStartFull}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm
              bg-gradient-to-r from-amber-600 to-red-600 text-white
              hover:from-amber-500 hover:to-red-500 transition-all shadow-lg shadow-amber-500/20"
          >
            <Trophy size={16} />
            Full Exam ({allQuestions.length} câu)
          </button>
        </div>

        <div className="mt-8 bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 text-sm text-gray-400">
          <div className="flex items-start gap-2">
            <AlertTriangle size={16} className="text-amber-500 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-gray-300 mb-1">Lưu ý Exam Mode:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-500">
                <li>Đáp án và giải thích chỉ hiện <strong>sau khi nộp bài</strong></li>
                <li>Có đồng hồ đếm ngược — hết giờ tự động nộp bài</li>
                <li>Câu hỏi random từ tất cả Module</li>
                <li>Có thể quay lại câu trước để sửa đáp án</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ========================================
  // EXAM PHASE
  // ========================================
  if (phase === 'exam') {
    const currentQuestion = questions[currentIndex];
    const progress = (Object.keys(answers).length / questions.length) * 100;
    const answeredCount = Object.keys(answers).length;

    return (
      <div className="max-w-3xl mx-auto">
        {/* Exam Header */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-semibold text-white">Exam Mode</h2>
              <p className="text-xs text-gray-500">{answeredCount}/{questions.length} đã trả lời</p>
            </div>
            <Timer
              initialSeconds={timeLimit}
              isRunning={isTimerRunning}
              onTimeUp={handleTimeUp}
            />
          </div>
          <ProgressBar value={progress} size="sm" color="#F59E0B" showLabel={false} />
        </div>

        {/* Question Navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setCurrentIndex((p) => Math.max(0, p - 1))}
            disabled={currentIndex === 0}
            className="flex items-center gap-1 text-sm text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
          >
            <ChevronLeft size={16} /> Câu trước
          </button>
          <span className="text-sm text-gray-400">
            Câu {currentIndex + 1} / {questions.length}
          </span>
          <button
            onClick={() => setCurrentIndex((p) => Math.min(questions.length - 1, p + 1))}
            disabled={currentIndex === questions.length - 1}
            className="flex items-center gap-1 text-sm text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
          >
            Câu sau <ChevronRight size={16} />
          </button>
        </div>

        {/* Question (no feedback) */}
        {currentQuestion && (
          <QuestionCard
            question={currentQuestion}
            questionNumber={currentIndex + 1}
            totalQuestions={questions.length}
            onAnswer={handleAnswer}
            onNext={() => {
              if (currentIndex < questions.length - 1) {
                setCurrentIndex((p) => p + 1);
              }
            }}
            showFeedback={false}
            existingAnswer={answers[currentIndex] ?? null}
          />
        )}

        {/* Question Grid */}
        <div className="mt-8 bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-3">Danh sách câu hỏi</p>
          <div className="flex flex-wrap gap-2">
            {questions.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-8 h-8 rounded-lg text-xs font-medium transition-all
                  ${idx === currentIndex
                    ? 'bg-violet-500 text-white'
                    : answers[idx] !== undefined
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-white/[0.03] text-gray-500 border border-white/[0.06] hover:border-white/[0.15]'
                  }
                `}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Submit button */}
        <div className="mt-6 text-center">
          <button
            onClick={handleSubmit}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-sm
              bg-gradient-to-r from-amber-600 to-red-600 text-white
              hover:from-amber-500 hover:to-red-500 transition-all shadow-lg shadow-amber-500/20"
          >
            <Send size={16} />
            Nộp bài ({answeredCount}/{questions.length})
          </button>
        </div>
      </div>
    );
  }

  // ========================================
  // REVIEW PHASE
  // ========================================
  const reviewQuestion = questions[reviewIndex];
  const reviewAnswer = answers[reviewIndex];
  const isCorrect = reviewAnswer === reviewQuestion?.answer;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Results Summary */}
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 md:p-8 mb-8 text-center animate-slide-up">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-500 to-red-500 flex items-center justify-center">
          <Trophy size={32} className="text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-1">Kết quả bài thi</h2>
        <p className="text-4xl font-extrabold mt-4 mb-2" style={{
          color: examStats.accuracy >= 70 ? '#10B981' : examStats.accuracy >= 50 ? '#F59E0B' : '#EF4444'
        }}>
          {examStats.accuracy}%
        </p>

        <div className="grid grid-cols-4 gap-3 mt-6 mb-6">
          <div className="bg-white/[0.03] rounded-xl p-3">
            <p className="text-lg font-bold text-white">{questions.length}</p>
            <p className="text-[10px] text-gray-500">Tổng</p>
          </div>
          <div className="bg-white/[0.03] rounded-xl p-3">
            <p className="text-lg font-bold text-emerald-400">{examStats.correctCount}</p>
            <p className="text-[10px] text-gray-500">Đúng</p>
          </div>
          <div className="bg-white/[0.03] rounded-xl p-3">
            <p className="text-lg font-bold text-red-400">{examStats.wrongCount}</p>
            <p className="text-[10px] text-gray-500">Sai</p>
          </div>
          <div className="bg-white/[0.03] rounded-xl p-3">
            <p className="text-lg font-bold text-gray-400">{examStats.unanswered}</p>
            <p className="text-[10px] text-gray-500">Bỏ qua</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => { setPhase('setup'); setAnswers({}); }}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium
              bg-gradient-to-r from-violet-600 to-cyan-600 text-white
              hover:from-violet-500 hover:to-cyan-500 transition-all"
          >
            <RotateCcw size={16} />
            Thi lại
          </button>
          <Link href="/">
            <button className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium
              bg-white/[0.05] border border-white/[0.1] text-gray-300 hover:bg-white/[0.08] transition-all w-full">
              Dashboard
            </button>
          </Link>
        </div>
      </div>

      {/* Review Questions */}
      <h3 className="text-lg font-semibold text-white mb-4">Xem lại câu hỏi</h3>

      {/* Review Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setReviewIndex((p) => Math.max(0, p - 1))}
          disabled={reviewIndex === 0}
          className="flex items-center gap-1 text-sm text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
        >
          <ChevronLeft size={16} /> Câu trước
        </button>
        <span className="text-sm text-gray-400">
          Câu {reviewIndex + 1} / {questions.length}
        </span>
        <button
          onClick={() => setReviewIndex((p) => Math.min(questions.length - 1, p + 1))}
          disabled={reviewIndex === questions.length - 1}
          className="flex items-center gap-1 text-sm text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
        >
          Câu sau <ChevronRight size={16} />
        </button>
      </div>

      {/* Review Card */}
      {reviewQuestion && (
        <div className="space-y-4">
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-violet-500/15 text-violet-400">
                {reviewQuestion.topic}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                reviewAnswer === undefined
                  ? 'bg-gray-500/15 text-gray-400'
                  : isCorrect
                  ? 'bg-emerald-500/15 text-emerald-400'
                  : 'bg-red-500/15 text-red-400'
              }`}>
                {reviewAnswer === undefined ? 'Bỏ qua' : isCorrect ? 'Đúng' : 'Sai'}
              </span>
            </div>
            <p className="text-white whitespace-pre-wrap">{reviewQuestion.question}</p>

            {/* Options review */}
            <div className="space-y-2 mt-4">
              {reviewQuestion.options.map((option, idx) => {
                const isTheAnswer = idx === reviewQuestion.answer;
                const wasSelected = idx === reviewAnswer;
                let optClass = 'border-white/[0.04] bg-white/[0.01] text-gray-600';
                if (isTheAnswer) optClass = 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400';
                if (wasSelected && !isTheAnswer) optClass = 'border-red-500/50 bg-red-500/10 text-red-400';

                return (
                  <div key={idx} className={`flex items-center gap-3 p-3 rounded-xl border ${optClass}`}>
                    <span className="text-sm">{option}</span>
                    {isTheAnswer && <span className="ml-auto text-emerald-400">✓</span>}
                    {wasSelected && !isTheAnswer && <span className="ml-auto text-red-400">✗</span>}
                  </div>
                );
              })}
            </div>
          </div>

          <ExplanationCard
            isCorrect={reviewAnswer !== undefined && isCorrect}
            correctAnswer={reviewQuestion.options[reviewQuestion.answer]}
            explanation={reviewQuestion.explanation}
          />
          <LearningTip tip={reviewQuestion.tip} />
        </div>
      )}

      {/* Question Grid for review */}
      <div className="mt-8 bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
        <p className="text-xs text-gray-500 mb-3">Tổng quan</p>
        <div className="flex flex-wrap gap-2">
          {questions.map((q, idx) => {
            const ans = answers[idx];
            const correct = ans === q.answer;
            return (
              <button
                key={idx}
                onClick={() => setReviewIndex(idx)}
                className={`w-8 h-8 rounded-lg text-xs font-medium transition-all
                  ${idx === reviewIndex
                    ? 'ring-2 ring-violet-500'
                    : ''
                  }
                  ${ans === undefined
                    ? 'bg-white/[0.03] text-gray-500 border border-white/[0.06]'
                    : correct
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }
                `}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
