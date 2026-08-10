'use client';

import { useEffect, useState } from 'react';
import { modules, getModuleTotalQuestions } from '@/data/modules';
import { getQuestionsByModule } from '@/data/questions';
import { getModuleStats } from '@/lib/storage';
import ModuleCard from '@/components/ModuleCard';

export default function ModulesPage() {
  const [moduleStats, setModuleStats] = useState<Record<string, { total: number; correct: number }>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mStats: Record<string, { total: number; correct: number }> = {};
    modules.forEach((m) => {
      mStats[m.id] = getModuleStats(m.id);
    });
    setModuleStats(mStats);
  }, []);

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Modules</h1>
      <p className="text-gray-400 mb-8">Chọn module để xem danh sách chủ đề và bắt đầu luyện tập</p>

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
