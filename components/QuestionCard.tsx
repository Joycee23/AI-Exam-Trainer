'use client';

import { useState, useEffect, useCallback } from 'react';
import { Question } from '@/types/question';
import AnswerOption from './AnswerOption';
import ExplanationCard from './ExplanationCard';
import LearningTip from './LearningTip';
import { Bookmark, BookmarkCheck, HelpCircle } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (questionId: string, selectedAnswer: number, isCorrect: boolean) => void;
  onNext: () => void;
  onBookmark?: (questionId: string) => void;
  isBookmarked?: boolean;
  showFeedback?: boolean; // false for exam mode
  existingAnswer?: number | null; // for exam mode review
}

const labels = ['A', 'B', 'C', 'D'];

export default function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  onNext,
  onBookmark,
  isBookmarked = false,
  showFeedback = true,
  existingAnswer = null,
}: QuestionCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(existingAnswer);
  const [isRevealed, setIsRevealed] = useState(existingAnswer !== null && showFeedback);

  // Reset state when question changes
  useEffect(() => {
    setSelectedAnswer(existingAnswer);
    setIsRevealed(existingAnswer !== null && showFeedback);
  }, [question.id, existingAnswer, showFeedback]);

  const handleSelect = useCallback(
    (index: number) => {
      if (selectedAnswer !== null && showFeedback) return; // Already answered in practice mode

      setSelectedAnswer(index);
      const isCorrect = index === question.answer;

      if (showFeedback) {
        setIsRevealed(true);
      }

      onAnswer(question.id, index, isCorrect);
    },
    [selectedAnswer, showFeedback, question, onAnswer]
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const key = e.key;

      // 1-4 for options
      if (['1', '2', '3', '4'].includes(key)) {
        const index = parseInt(key) - 1;
        if (selectedAnswer === null || !showFeedback) {
          handleSelect(index);
        }
      }

      // Enter for next
      if (key === 'Enter' && isRevealed) {
        onNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedAnswer, isRevealed, showFeedback, handleSelect, onNext]);

  // Parse option text (remove "A. " prefix if present)
  const getOptionText = (option: string) => {
    return option.replace(/^[A-D]\.\s*/, '');
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Question Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-violet-500/15 text-violet-400">
            {question.topic}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            question.difficulty === 'easy' ? 'bg-emerald-500/15 text-emerald-400' :
            question.difficulty === 'medium' ? 'bg-amber-500/15 text-amber-400' :
            'bg-red-500/15 text-red-400'
          }`}>
            {question.difficulty}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {onBookmark && (
            <button
              onClick={() => onBookmark(question.id)}
              className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center
                hover:bg-white/[0.08] transition-colors"
            >
              {isBookmarked ? (
                <BookmarkCheck size={16} className="text-amber-400" />
              ) : (
                <Bookmark size={16} className="text-gray-500" />
              )}
            </button>
          )}
          <span className="text-xs text-gray-500">
            {questionNumber} / {totalQuestions}
          </span>
        </div>
      </div>

      {/* Question Text */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 md:p-6 mb-6">
        <p className="text-base md:text-lg text-white leading-relaxed whitespace-pre-wrap">
          {question.question}
        </p>
      </div>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {question.options.map((option, index) => (
          <AnswerOption
            key={`${question.id}-${index}`}
            label={labels[index]}
            text={getOptionText(option)}
            index={index}
            isSelected={selectedAnswer === index}
            isCorrect={index === question.answer}
            isRevealed={isRevealed}
            onSelect={handleSelect}
            disabled={isRevealed && showFeedback}
          />
        ))}
      </div>

      {/* Feedback (Practice Mode) */}
      {showFeedback && isRevealed && selectedAnswer !== null && (
        <div className="space-y-4 mb-6">
          <ExplanationCard
            isCorrect={selectedAnswer === question.answer}
            correctAnswer={question.options[question.answer]}
            explanation={question.explanation}
          />
          <LearningTip tip={question.tip} />
        </div>
      )}

      {/* Actions */}
      {showFeedback && isRevealed && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onBookmark?.(question.id)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-400
                bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.08] transition-colors"
            >
              <HelpCircle size={14} />
              Đánh dấu câu này
            </button>
          </div>
          <button
            onClick={onNext}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm
              bg-gradient-to-r from-violet-600 to-cyan-600 text-white
              hover:from-violet-500 hover:to-cyan-500 transition-all duration-300
              shadow-lg shadow-violet-500/20"
          >
            Câu tiếp theo →
          </button>
        </div>
      )}

      {/* Keyboard hint */}
      {!isRevealed && (
        <div className="hidden md:flex items-center justify-center gap-4 mt-6 text-xs text-gray-600">
          <span>Nhấn <kbd className="px-1.5 py-0.5 rounded border border-white/[0.1] bg-white/[0.03]">1-4</kbd> để chọn đáp án</span>
          <span>•</span>
          <span>Nhấn <kbd className="px-1.5 py-0.5 rounded border border-white/[0.1] bg-white/[0.03]">Enter</kbd> để tiếp</span>
        </div>
      )}
    </div>
  );
}
