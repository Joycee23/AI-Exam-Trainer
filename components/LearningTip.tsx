'use client';

import { Lightbulb } from 'lucide-react';

interface LearningTipProps {
  tip: string;
}

export default function LearningTip({ tip }: LearningTipProps) {
  return (
    <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 md:p-5
      transition-all duration-500 animate-in fade-in slide-in-from-bottom-4"
      style={{ animationDelay: '150ms' }}
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center shrink-0 mt-0.5">
          <Lightbulb size={16} className="text-amber-400" />
        </div>
        <div>
          <span className="text-xs uppercase tracking-wider text-amber-400/80 font-semibold">
            💡 Mẹo nhớ
          </span>
          <p className="text-gray-300 mt-1 text-sm md:text-base leading-relaxed whitespace-pre-wrap">
            {tip}
          </p>
        </div>
      </div>
    </div>
  );
}
