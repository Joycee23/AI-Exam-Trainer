'use client';

import { useEffect, useState } from 'react';
import { modules } from '@/data/modules';
import { getQuestionsByModule, getQuestionsByTopic } from '@/data/questions';
import { getOverallStats, getModuleStats, getTopicStats, resetAllProgress } from '@/lib/storage';
import ProgressBar from '@/components/ProgressBar';
import StatsCard from '@/components/StatsCard';
import {
  BarChart3,
  Target,
  CheckCircle2,
  XCircle,
  TrendingUp,
  AlertTriangle,
  Trophy,
  Trash2,
} from 'lucide-react';

interface TopicStat {
  topicId: string;
  topicName: string;
  moduleId: string;
  moduleColor: string;
  accuracy: number;
  answered: number;
}

export default function StatisticsPage() {
  const [stats, setStats] = useState({
    totalAnswered: 0,
    totalCorrect: 0,
    totalWrong: 0,
    accuracy: 0,
    highScore: 0,
  });
  const [moduleData, setModuleData] = useState<
    { id: string; name: string; color: string; total: number; correct: number; accuracy: number }[]
  >([]);
  const [weakTopics, setWeakTopics] = useState<TopicStat[]>([]);
  const [strongTopics, setStrongTopics] = useState<TopicStat[]>([]);
  const [mounted, setMounted] = useState(false);
  const [showReset, setShowReset] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadStats();
  }, []);

  const loadStats = () => {
    setStats(getOverallStats());

    // Module stats
    const mData = modules.map((mod) => {
      const s = getModuleStats(mod.id);
      return {
        id: mod.id,
        name: mod.name,
        color: mod.color,
        total: s.total,
        correct: s.correct,
        accuracy: s.accuracy,
      };
    });
    setModuleData(mData);

    // Topic stats
    const allTopicStats: TopicStat[] = [];
    modules.forEach((mod) => {
      mod.topics.forEach((topic) => {
        const s = getTopicStats(topic.id);
        if (s.total > 0) {
          allTopicStats.push({
            topicId: topic.id,
            topicName: topic.name,
            moduleId: mod.id,
            moduleColor: mod.color,
            accuracy: s.accuracy,
            answered: s.total,
          });
        }
      });
    });

    // Sort for weak/strong
    const sorted = [...allTopicStats].sort((a, b) => a.accuracy - b.accuracy);
    setWeakTopics(sorted.filter((t) => t.accuracy < 70).slice(0, 5));
    setStrongTopics(sorted.filter((t) => t.accuracy >= 70).sort((a, b) => b.accuracy - a.accuracy).slice(0, 5));
  };

  const handleReset = () => {
    resetAllProgress();
    loadStats();
    setShowReset(false);
  };

  if (!mounted) {
    return (
      <div className="max-w-5xl mx-auto text-center py-20">
        <p className="text-gray-400">Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1 flex items-center gap-3">
            <BarChart3 size={28} className="text-violet-400" />
            Statistics
          </h1>
          <p className="text-gray-400 text-sm">Theo dõi tiến độ học tập của bạn</p>
        </div>
        <button
          onClick={() => setShowReset(true)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-500
            bg-white/[0.03] border border-white/[0.06] hover:bg-red-500/10 hover:text-red-400
            hover:border-red-500/30 transition-all"
        >
          <Trash2 size={14} />
          Reset
        </button>
      </div>

      {/* Reset Confirmation */}
      {showReset && (
        <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 mb-6 flex items-center justify-between">
          <p className="text-sm text-red-300">Xóa toàn bộ tiến độ? Hành động này không thể hoàn tác.</p>
          <div className="flex gap-2">
            <button onClick={() => setShowReset(false)}
              className="px-3 py-1.5 rounded-lg text-xs bg-white/[0.05] text-gray-400 hover:bg-white/[0.1] transition-colors">
              Hủy
            </button>
            <button onClick={handleReset}
              className="px-3 py-1.5 rounded-lg text-xs bg-red-500/20 text-red-400 border border-red-500/30
                hover:bg-red-500/30 transition-colors">
              Xác nhận xóa
            </button>
          </div>
        </div>
      )}

      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 mb-10">
        <StatsCard
          label="Tổng câu hỏi"
          value={stats.totalAnswered + stats.totalWrong > 0 ? stats.totalAnswered : '—'}
          icon={<Target size={18} />}
          color="#8B5CF6"
        />
        <StatsCard
          label="Đã trả lời"
          value={stats.totalAnswered}
          icon={<CheckCircle2 size={18} />}
          color="#06B6D4"
        />
        <StatsCard
          label="Đúng"
          value={stats.totalCorrect}
          icon={<CheckCircle2 size={18} />}
          color="#10B981"
        />
        <StatsCard
          label="Sai"
          value={stats.totalWrong}
          icon={<XCircle size={18} />}
          color="#EF4444"
        />
        <StatsCard
          label="Accuracy"
          value={`${stats.accuracy}%`}
          icon={<TrendingUp size={18} />}
          color="#F59E0B"
        />
      </div>

      {/* Module Progress */}
      <h2 className="text-lg font-bold text-white mb-4">Tiến độ theo Module</h2>
      <div className="space-y-4 mb-10">
        {moduleData.map((mod) => {
          const totalQ = getQuestionsByModule(mod.id).length;
          return (
            <div
              key={mod.id}
              className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded"
                    style={{ background: `${mod.color}20`, color: mod.color }}
                  >
                    {mod.id}
                  </span>
                  <span className="text-sm text-white font-medium">{mod.name}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span>{mod.total}/{totalQ} câu</span>
                  <span className="font-semibold" style={{ color: mod.color }}>{mod.accuracy}%</span>
                </div>
              </div>
              <ProgressBar
                value={totalQ > 0 ? (mod.total / totalQ) * 100 : 0}
                size="sm"
                color={mod.color}
                showLabel={false}
              />
            </div>
          );
        })}
      </div>

      {/* Weak & Strong Topics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Weak Topics */}
        <div>
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <AlertTriangle size={18} className="text-amber-400" />
            Weak Topics
          </h2>
          {weakTopics.length === 0 ? (
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6 text-center">
              <p className="text-gray-500 text-sm">Chưa có dữ liệu. Hãy làm thêm bài!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {weakTopics.map((t) => (
                <div
                  key={t.topicId}
                  className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-3 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400">⚠</span>
                    <span className="text-sm text-gray-300">{t.topicName}</span>
                  </div>
                  <span className="text-sm font-semibold text-amber-400">{t.accuracy}%</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Strong Topics */}
        <div>
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Trophy size={18} className="text-emerald-400" />
            Strong Topics
          </h2>
          {strongTopics.length === 0 ? (
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6 text-center">
              <p className="text-gray-500 text-sm">Chưa có dữ liệu. Hãy làm thêm bài!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {strongTopics.map((t) => (
                <div
                  key={t.topicId}
                  className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-3 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400">✓</span>
                    <span className="text-sm text-gray-300">{t.topicName}</span>
                  </div>
                  <span className="text-sm font-semibold text-emerald-400">{t.accuracy}%</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
