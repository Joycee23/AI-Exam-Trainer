'use client';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
  subtitle?: string;
}

export default function StatsCard({ label, value, icon, color, subtitle }: StatsCardProps) {
  return (
    <div className="relative group">
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"
        style={{ background: color || '#8B5CF6', opacity: 0.1 }}
      />
      <div className="relative bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 md:p-5 backdrop-blur-sm
        hover:border-white/[0.12] transition-all duration-300">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">{label}</p>
            <p className="text-2xl md:text-3xl font-bold text-white">{value}</p>
            {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
          </div>
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ background: `${color || '#8B5CF6'}20` }}
          >
            <div style={{ color: color || '#8B5CF6' }}>{icon}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
