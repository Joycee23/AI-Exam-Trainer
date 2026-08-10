'use client';

import { useState, useEffect } from 'react';

interface TimerProps {
  initialSeconds: number;
  isRunning: boolean;
  onTimeUp: () => void;
  onTick?: (remaining: number) => void;
}

export default function Timer({ initialSeconds, isRunning, onTimeUp, onTick }: TimerProps) {
  const [remaining, setRemaining] = useState(initialSeconds);

  useEffect(() => {
    setRemaining(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (!isRunning || remaining <= 0) return;

    const interval = setInterval(() => {
      setRemaining((prev) => {
        const next = prev - 1;
        onTick?.(next);
        if (next <= 0) {
          clearInterval(interval);
          onTimeUp();
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, remaining, onTimeUp, onTick]);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const percentage = (remaining / initialSeconds) * 100;

  const getColor = () => {
    if (percentage > 50) return 'text-emerald-400';
    if (percentage > 25) return 'text-amber-400';
    return 'text-red-400 animate-pulse';
  };

  return (
    <div className="flex items-center gap-3">
      <div className="relative w-10 h-10">
        <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
          <circle
            cx="18" cy="18" r="15"
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="3"
          />
          <circle
            cx="18" cy="18" r="15"
            fill="none"
            stroke={percentage > 50 ? '#10B981' : percentage > 25 ? '#F59E0B' : '#EF4444'}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={`${percentage * 0.942} 100`}
            className="transition-all duration-1000"
          />
        </svg>
      </div>
      <span className={`font-mono text-lg font-bold ${getColor()}`}>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
}
