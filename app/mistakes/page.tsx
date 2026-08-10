'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getMistakeIds } from '@/lib/storage';
import { getQuestionsByIds } from '@/data/questions';
import { getTopic } from '@/data/modules';
import { Question } from '@/types/question';
import { XCircle, RotateCcw, Trash2, ArrowRight } from 'lucide-react';

export default function MistakesPage() {
  const [mistakes, setMistakes] = useState<Question[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const ids = getMistakeIds();
    const questions = getQuestionsByIds(ids);
    setMistakes(questions);
  }, []);

  if (!mounted) {
    return (
      <div className="max-w-3xl mx-auto text-center py-20">
        <p className="text-gray-400">Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1 flex items-center gap-3">
            <XCircle size={28} className="text-red-400" />
            Những câu tôi làm sai
          </h1>
          <p className="text-gray-400 text-sm">
            {mistakes.length} câu cần ôn lại
          </p>
        </div>
        {mistakes.length > 0 && (
          <Link href={`/practice?mistakes=true`}>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium
              bg-gradient-to-r from-red-600 to-amber-600 text-white
              hover:from-red-500 hover:to-amber-500 transition-all shadow-lg shadow-red-500/20">
              <RotateCcw size={16} />
              Luyện lại tất cả
            </button>
          </Link>
        )}
      </div>

      {/* Empty State */}
      {mistakes.length === 0 && (
        <div className="text-center py-20">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
            <span className="text-3xl">🎉</span>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Tuyệt vời!</h2>
          <p className="text-gray-400 mb-6">Bạn chưa có câu nào sai. Hãy tiếp tục luyện tập!</p>
          <Link href="/modules">
            <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium
              bg-gradient-to-r from-violet-600 to-cyan-600 text-white
              hover:from-violet-500 hover:to-cyan-500 transition-all">
              Bắt đầu luyện tập
            </button>
          </Link>
        </div>
      )}

      {/* Mistakes List */}
      <div className="space-y-3">
        {mistakes.map((q) => {
          const topicInfo = getTopic(q.topic);
          const moduleColor = topicInfo?.module.color || '#8B5CF6';

          return (
            <div
              key={q.id}
              className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 md:p-5
                hover:border-white/[0.12] transition-all group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded"
                      style={{ background: `${moduleColor}20`, color: moduleColor }}
                    >
                      {q.topic}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      q.difficulty === 'easy' ? 'bg-emerald-500/15 text-emerald-400' :
                      q.difficulty === 'medium' ? 'bg-amber-500/15 text-amber-400' :
                      'bg-red-500/15 text-red-400'
                    }`}>
                      {q.difficulty}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 line-clamp-2 whitespace-pre-wrap">
                    {q.question}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Đáp án đúng: <span className="text-emerald-400">{q.options[q.answer]}</span>
                  </p>
                </div>
                <Link href={`/practice?topic=${q.topic}`}>
                  <button className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium
                    bg-white/[0.05] border border-white/[0.1] text-gray-400
                    hover:bg-white/[0.08] hover:text-white transition-all whitespace-nowrap">
                    Luyện lại
                    <ArrowRight size={12} />
                  </button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
