'use client';

interface ExplanationCardProps {
  isCorrect: boolean;
  correctAnswer: string;
  explanation: string;
}

export default function ExplanationCard({
  isCorrect,
  correctAnswer,
  explanation,
}: ExplanationCardProps) {
  return (
    <div
      className={`rounded-xl border p-4 md:p-5 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4 ${
        isCorrect
          ? 'bg-emerald-500/5 border-emerald-500/20'
          : 'bg-red-500/5 border-red-500/20'
      }`}
    >
      {/* Result Header */}
      <div className="flex items-center gap-2 mb-3">
        <span className={`text-xl ${isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
          {isCorrect ? '✓' : '✗'}
        </span>
        <span className={`font-semibold text-base ${isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
          {isCorrect ? 'Chính xác!' : 'Chưa chính xác'}
        </span>
      </div>

      {/* Correct Answer */}
      <div className="mb-3">
        <span className="text-xs uppercase tracking-wider text-gray-500">Đáp án đúng</span>
        <p className="text-white font-medium mt-0.5">{correctAnswer}</p>
      </div>

      {/* Explanation */}
      <div>
        <span className="text-xs uppercase tracking-wider text-gray-500">Giải thích</span>
        <p className="text-gray-300 mt-0.5 text-sm md:text-base leading-relaxed whitespace-pre-wrap">
          {explanation}
        </p>
      </div>
    </div>
  );
}
