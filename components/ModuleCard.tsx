'use client';

import Link from 'next/link';
import ProgressBar from './ProgressBar';
import { Module } from '@/types/question';
import {
  Calculator,
  Code2,
  Brain,
  Shield,
  ChevronRight,
} from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  Calculator: <Calculator size={24} />,
  Code2: <Code2 size={24} />,
  Brain: <Brain size={24} />,
  Shield: <Shield size={24} />,
};

interface ModuleCardProps {
  module: Module;
  totalQuestions: number;
  answeredCount: number;
  correctCount: number;
}

export default function ModuleCard({
  module,
  totalQuestions,
  answeredCount,
  correctCount,
}: ModuleCardProps) {
  const progress = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;
  const accuracy = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;

  return (
    <Link href={`/modules/${module.id}`}>
      <div className="group relative overflow-hidden">
        {/* Glow effect */}
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl"
          style={{ background: module.color, opacity: 0.08 }}
        />
        <div className="relative bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 md:p-6
          hover:border-white/[0.15] hover:bg-white/[0.05] transition-all duration-300 cursor-pointer h-full">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: `${module.color}20` }}
            >
              <div style={{ color: module.color }}>
                {iconMap[module.icon] || <Brain size={24} />}
              </div>
            </div>
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{
                background: `${module.color}15`,
                color: module.color,
              }}
            >
              Module {module.id}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-white/90">
            {module.name}
          </h3>
          <p className="text-sm text-gray-400 mb-4 line-clamp-2">{module.description}</p>

          {/* Stats */}
          <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
            <span>{module.topics.length} chủ đề</span>
            <span>•</span>
            <span>{totalQuestions} câu</span>
            {answeredCount > 0 && (
              <>
                <span>•</span>
                <span style={{ color: module.color }}>{accuracy}% chính xác</span>
              </>
            )}
          </div>

          {/* Progress */}
          <ProgressBar value={progress} size="sm" color={module.color} showLabel={false} />
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-gray-500">
              {answeredCount}/{totalQuestions} câu
            </span>
            <div className="flex items-center gap-1 text-xs font-medium group-hover:gap-2 transition-all"
              style={{ color: module.color }}>
              Bắt đầu <ChevronRight size={14} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
