'use client';

import Link from 'next/link';
import ProgressBar from './ProgressBar';
import { Topic } from '@/types/question';
import { ChevronRight } from 'lucide-react';

interface TopicCardProps {
  topic: Topic;
  moduleColor: string;
  answeredCount: number;
  actualQuestionCount: number;
}

export default function TopicCard({
  topic,
  moduleColor,
  answeredCount,
  actualQuestionCount,
}: TopicCardProps) {
  const totalCount = actualQuestionCount;
  const progress = totalCount > 0 ? (answeredCount / totalCount) * 100 : 0;

  return (
    <Link href={`/practice?topic=${topic.id}`}>
      <div className="group bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 md:p-5
        hover:border-white/[0.15] hover:bg-white/[0.05] transition-all duration-300 cursor-pointer">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <span
              className="text-xs font-bold px-2 py-0.5 rounded"
              style={{ background: `${moduleColor}20`, color: moduleColor }}
            >
              {topic.id}
            </span>
            <h4 className="text-sm md:text-base font-medium text-white group-hover:text-white/90">
              {topic.name}
            </h4>
          </div>
          <ChevronRight size={16} className="text-gray-600 group-hover:text-gray-400 transition-colors" />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1">
            <ProgressBar value={progress} size="sm" color={moduleColor} showLabel={false} />
          </div>
          <span className="text-xs text-gray-500 whitespace-nowrap">
            {answeredCount}/{totalCount} câu
          </span>
        </div>
      </div>
    </Link>
  );
}
