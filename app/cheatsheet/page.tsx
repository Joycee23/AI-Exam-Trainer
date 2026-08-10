'use client';

import { useState, useMemo } from 'react';
import { cheatSheetData } from '@/data/cheatsheet';
import { Search, BookOpen } from 'lucide-react';

export default function CheatSheetPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModule, setActiveModule] = useState<string>('all');

  const filteredData = useMemo(() => {
    let data = cheatSheetData;
    if (activeModule !== 'all') {
      data = data.filter((m) => m.moduleId === activeModule);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      data = data.map((mod) => ({
        ...mod,
        sections: mod.sections
          .map((sec) => ({
            ...sec,
            items: sec.items.filter(
              (item) =>
                item.label.toLowerCase().includes(q) ||
                item.description.toLowerCase().includes(q) ||
                (item.formula && item.formula.toLowerCase().includes(q))
            ),
          }))
          .filter((sec) => sec.items.length > 0),
      })).filter((mod) => mod.sections.length > 0);
    }
    return data;
  }, [searchQuery, activeModule]);

  const moduleColors: Record<string, string> = {
    A: '#8B5CF6',
    B: '#06B6D4',
    C: '#F59E0B',
    D: '#10B981',
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <BookOpen size={28} className="text-violet-400" />
        <h1 className="text-2xl md:text-3xl font-bold text-white">Cheat Sheet</h1>
      </div>
      <p className="text-gray-400 text-sm mb-6">Công thức và khái niệm quan trọng</p>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          placeholder="Tìm kiếm công thức, khái niệm..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08]
            text-white placeholder-gray-500 text-sm
            focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.05] transition-all"
        />
      </div>

      {/* Module Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveModule('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all
            ${activeModule === 'all'
              ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
              : 'bg-white/[0.03] text-gray-400 border border-white/[0.06] hover:bg-white/[0.06]'
            }
          `}
        >
          Tất cả
        </button>
        {cheatSheetData.map((mod) => (
          <button
            key={mod.moduleId}
            onClick={() => setActiveModule(mod.moduleId)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all
              ${activeModule === mod.moduleId
                ? `border`
                : 'bg-white/[0.03] text-gray-400 border border-white/[0.06] hover:bg-white/[0.06]'
              }
            `}
            style={
              activeModule === mod.moduleId
                ? {
                    background: `${moduleColors[mod.moduleId]}20`,
                    color: moduleColors[mod.moduleId],
                    borderColor: `${moduleColors[mod.moduleId]}40`,
                  }
                : {}
            }
          >
            Module {mod.moduleId}
          </button>
        ))}
      </div>

      {/* Content */}
      {filteredData.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-400">Không tìm thấy kết quả cho &ldquo;{searchQuery}&rdquo;</p>
        </div>
      )}

      <div className="space-y-8">
        {filteredData.map((mod) => (
          <div key={mod.moduleId}>
            <h2
              className="text-lg font-bold mb-4 flex items-center gap-2"
              style={{ color: moduleColors[mod.moduleId] }}
            >
              <span className="w-2 h-2 rounded-full" style={{ background: moduleColors[mod.moduleId] }} />
              Module {mod.moduleId} — {mod.moduleName}
            </h2>

            <div className="space-y-6">
              {mod.sections.map((section, sIdx) => (
                <div
                  key={sIdx}
                  className="bg-white/[0.02] border border-white/[0.06] rounded-xl overflow-hidden"
                >
                  <div className="px-5 py-3 border-b border-white/[0.06] bg-white/[0.02]">
                    <h3 className="text-sm font-semibold text-white">{section.title}</h3>
                  </div>
                  <div className="divide-y divide-white/[0.04]">
                    {section.items.map((item, iIdx) => (
                      <div key={iIdx} className="px-5 py-3 hover:bg-white/[0.02] transition-colors">
                        <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4">
                          <span className="text-sm font-medium text-white min-w-[140px] shrink-0">
                            {item.label}
                          </span>
                          <div className="flex-1">
                            {item.formula && (
                              <code className="text-sm text-violet-300 block mb-1">
                                {item.formula}
                              </code>
                            )}
                            <p className="text-xs text-gray-400">{item.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
