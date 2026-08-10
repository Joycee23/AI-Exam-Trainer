'use client';

interface AnswerOptionProps {
  label: string;      // "A", "B", "C", "D"
  text: string;       // Full option text
  index: number;      // 0-3
  isSelected: boolean;
  isCorrect: boolean;
  isRevealed: boolean; // Whether answer has been revealed
  onSelect: (index: number) => void;
  disabled: boolean;
}

export default function AnswerOption({
  label,
  text,
  index,
  isSelected,
  isCorrect,
  isRevealed,
  onSelect,
  disabled,
}: AnswerOptionProps) {
  const getStyles = () => {
    if (!isRevealed) {
      if (isSelected) {
        return 'border-violet-500/50 bg-violet-500/10 text-white';
      }
      return 'border-white/[0.08] bg-white/[0.02] hover:border-white/[0.2] hover:bg-white/[0.05] text-gray-300';
    }

    // After reveal
    if (isCorrect) {
      return 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400';
    }
    if (isSelected && !isCorrect) {
      return 'border-red-500/50 bg-red-500/10 text-red-400';
    }
    return 'border-white/[0.04] bg-white/[0.01] text-gray-600';
  };

  const getLabelStyles = () => {
    if (!isRevealed) {
      if (isSelected) return 'bg-violet-500/30 text-violet-300 border-violet-500/50';
      return 'bg-white/[0.05] text-gray-400 border-white/[0.1]';
    }
    if (isCorrect) return 'bg-emerald-500/30 text-emerald-300 border-emerald-500/50';
    if (isSelected && !isCorrect) return 'bg-red-500/30 text-red-300 border-red-500/50';
    return 'bg-white/[0.03] text-gray-600 border-white/[0.06]';
  };

  const shortcutKey = index + 1;

  return (
    <button
      onClick={() => !disabled && onSelect(index)}
      disabled={disabled}
      className={`w-full flex items-center gap-3 md:gap-4 p-3.5 md:p-4 rounded-xl border transition-all duration-300
        ${getStyles()}
        ${disabled ? 'cursor-default' : 'cursor-pointer active:scale-[0.99]'}
      `}
    >
      <span className={`w-8 h-8 md:w-9 md:h-9 rounded-lg border flex items-center justify-center
        text-sm font-bold shrink-0 transition-all duration-300 ${getLabelStyles()}`}>
        {label}
      </span>
      <span className="text-left text-sm md:text-base flex-1 whitespace-pre-wrap">{text}</span>
      {!isRevealed && !disabled && (
        <span className="hidden md:block text-xs text-gray-600 border border-white/[0.06] rounded px-1.5 py-0.5">
          {shortcutKey}
        </span>
      )}
      {isRevealed && isCorrect && (
        <span className="text-emerald-400 font-bold text-lg">✓</span>
      )}
      {isRevealed && isSelected && !isCorrect && (
        <span className="text-red-400 font-bold text-lg">✗</span>
      )}
    </button>
  );
}
