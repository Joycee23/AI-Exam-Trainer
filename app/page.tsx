'use client';

import { useEffect, useState } from 'react';
import { modules, getModuleTotalQuestions } from '@/data/modules';
import { getQuestionsByModule } from '@/data/questions';
import { getOverallStats, getModuleStats } from '@/lib/storage';
import StatsCard from '@/components/StatsCard';
import ModuleCard from '@/components/ModuleCard';
import { allQuestions } from '@/data/questions';
import { dataTrackQuestionCount } from '@/data/data-track-bank';
import {
  Target,
  CheckCircle2,
  BarChart3,
  Trophy,
  Sparkles,
  Zap,
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalAnswered: 0,
    totalCorrect: 0,
    totalWrong: 0,
    accuracy: 0,
    highScore: 0,
  });
  const [moduleStats, setModuleStats] = useState<Record<string, { total: number; correct: number }>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setStats(getOverallStats());
    const mStats: Record<string, { total: number; correct: number }> = {};
    modules.forEach((m) => {
      mStats[m.id] = getModuleStats(m.id);
    });
    setModuleStats(mStats);
  }, []);

  const totalAvailableQuestions = allQuestions.length;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero */}
      <div className="relative mb-8 md:mb-12">
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-10 left-1/3 w-64 h-64 bg-cyan-500/8 rounded-full blur-3xl pointer-events-none" />

        <div className="relative text-center py-8 md:py-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-medium mb-4">
            <Sparkles size={12} />
            Luyện thi Kỹ sư AI
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-3">
            AI Exam Trainer
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-md mx-auto">
            Master AI. One Question at a Time.
          </p>

          {/* Quick Practice Button */}
          <Link href="/quick-practice">
            <button className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm
              bg-gradient-to-r from-violet-600 to-cyan-600 text-white
              hover:from-violet-500 hover:to-cyan-500 transition-all duration-300
              shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40
              hover:scale-105 active:scale-100">
              <Zap size={16} />
              Quick Practice
            </button>
          </Link>
        </div>
      </div>

      <section className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-violet-300/20 bg-violet-400/[0.07] p-5 md:p-6">
        <div>
          <p className="text-xs font-semibold tracking-wide text-violet-300">ÔN TẬP DATA TRACK</p>
          <h2 className="mt-1 text-lg font-bold text-white">Ngân hàng Data Track · {dataTrackQuestionCount} câu</h2>
          <p className="mt-1 text-sm text-gray-300">Luyện theo chủ đề hoặc thi thử 50 câu / 90 phút.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/data-track" className="inline-flex shrink-0 items-center justify-center rounded-lg border border-white/15 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/5">Luyện theo chủ đề</Link>
          <Link href="/midterm" className="inline-flex shrink-0 items-center justify-center rounded-lg bg-violet-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-400">Thi thử Midterm</Link>
        </div>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 mb-8 md:mb-12">
        <StatsCard
          label="Tổng câu hỏi"
          value={totalAvailableQuestions}
          icon={<Target size={18} />}
          color="#8B5CF6"
        />
        <StatsCard
          label="Đã làm"
          value={mounted ? stats.totalAnswered : '—'}
          icon={<CheckCircle2 size={18} />}
          color="#06B6D4"
        />
        <StatsCard
          label="Đúng"
          value={mounted ? stats.totalCorrect : '—'}
          icon={<CheckCircle2 size={18} />}
          color="#10B981"
        />
        <StatsCard
          label="Accuracy"
          value={mounted ? `${stats.accuracy}%` : '—'}
          icon={<BarChart3 size={18} />}
          color="#F59E0B"
        />
        <StatsCard
          label="High Score"
          value={mounted ? `${stats.highScore}%` : '—'}
          icon={<Trophy size={18} />}
          color="#EF4444"
        />
      </div>

      {/* Module Cards */}
      <div className="mb-6">
        <h2 className="text-lg md:text-xl font-bold text-white mb-1">Modules</h2>
        <p className="text-sm text-gray-500 mb-5">Chọn module để bắt đầu luyện tập</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
        {modules.map((mod) => {
          const totalQ = getModuleTotalQuestions(mod.id);
          const availableQ = getQuestionsByModule(mod.id).length;
          const mStat = moduleStats[mod.id] || { total: 0, correct: 0 };
          return (
            <ModuleCard
              key={mod.id}
              module={mod}
              totalQuestions={availableQ || totalQ}
              answeredCount={mounted ? mStat.total : 0}
              correctCount={mounted ? mStat.correct : 0}
            />
          );
        })}
      </div>
    </div>
  );
}
