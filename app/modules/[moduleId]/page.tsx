'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getModule } from '@/data/modules';
import { getQuestionsByModule, getQuestionsByTopic } from '@/data/questions';
import { getTopicStats } from '@/lib/storage';
import TopicCard from '@/components/TopicCard';
import ProgressBar from '@/components/ProgressBar';
import { ArrowLeft, BookOpen, Shuffle } from 'lucide-react';

export default function ModuleDetailPage() {
  const params = useParams();
  const moduleId = params.moduleId as string;
  const mod = getModule(moduleId);

  const [topicStats, setTopicStats] = useState<Record<string, number>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (mod) {
      const stats: Record<string, number> = {};
      mod.topics.forEach((t) => {
        const s = getTopicStats(t.id);
        stats[t.id] = s.total;
      });
      setTopicStats(stats);
    }
  }, [mod]);

  if (!mod) {
    return (
      <div className="max-w-3xl mx-auto text-center py-20">
        <p className="text-gray-400 text-lg">Module không tìm thấy</p>
        <Link href="/modules" className="text-violet-400 hover:underline mt-2 inline-block">
          ← Quay lại
        </Link>
      </div>
    );
  }

  const moduleQuestions = getQuestionsByModule(moduleId);
  const totalAnswered = mounted ? Object.values(topicStats).reduce((s, v) => s + v, 0) : 0;
  const totalQuestions = moduleQuestions.length;
  const progress = totalQuestions > 0 ? (totalAnswered / totalQuestions) * 100 : 0;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back button */}
      <Link href="/modules" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-6">
        <ArrowLeft size={16} />
        Tất cả Modules
      </Link>

      {/* Module Header */}
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 md:p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <span
              className="text-xs font-bold px-2.5 py-1 rounded-full mb-2 inline-block"
              style={{ background: `${mod.color}15`, color: mod.color }}
            >
              Module {mod.id}
            </span>
            <h1 className="text-xl md:text-2xl font-bold text-white mt-2">{mod.name}</h1>
            <p className="text-sm text-gray-400 mt-1">{mod.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-sm text-gray-400 mb-4">
          <span>{mod.topics.length} chủ đề</span>
          <span>{totalQuestions} câu hỏi</span>
          {mounted && totalAnswered > 0 && <span>{totalAnswered} đã làm</span>}
        </div>

        <ProgressBar value={progress} size="md" color={mod.color} />

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mt-5">
          <Link href={`/practice?module=${mod.id}`}>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium
              bg-gradient-to-r from-violet-600 to-cyan-600 text-white
              hover:from-violet-500 hover:to-cyan-500 transition-all shadow-lg shadow-violet-500/20">
              <Shuffle size={16} />
              Luyện toàn bộ Module
            </button>
          </Link>
          <Link href={`/practice?module=${mod.id}`}>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium
              bg-white/[0.05] border border-white/[0.1] text-gray-300
              hover:bg-white/[0.08] transition-all">
              <BookOpen size={16} />
              Học theo chủ đề
            </button>
          </Link>
        </div>
      </div>

      {/* Topics List */}
      <h2 className="text-lg font-semibold text-white mb-4">Chủ đề</h2>
      <div className="space-y-3">
        {mod.topics.map((topic) => {
          const topicQuestions = getQuestionsByTopic(topic.id);
          return (
            <TopicCard
              key={topic.id}
              topic={topic}
              moduleColor={mod.color}
              answeredCount={mounted ? (topicStats[topic.id] || 0) : 0}
              actualQuestionCount={topicQuestions.length}
            />
          );
        })}
      </div>
    </div>
  );
}
