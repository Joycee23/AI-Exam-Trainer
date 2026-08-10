'use client';

import { useEffect, useState } from 'react';

interface ProgressBarProps {
  value: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  showLabel?: boolean;
  animated?: boolean;
}

export default function ProgressBar({
  value,
  size = 'md',
  color,
  showLabel = true,
  animated = true,
}: ProgressBarProps) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => setWidth(Math.min(100, Math.max(0, value))), 100);
      return () => clearTimeout(timer);
    } else {
      setWidth(Math.min(100, Math.max(0, value)));
    }
  }, [value, animated]);

  const heights = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-4' };

  return (
    <div className="w-full">
      <div className={`w-full bg-white/5 rounded-full overflow-hidden ${heights[size]}`}>
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${width}%`,
            background: color || 'linear-gradient(90deg, #8B5CF6, #06B6D4)',
          }}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-gray-400 mt-1 text-right">{Math.round(value)}%</p>
      )}
    </div>
  );
}
