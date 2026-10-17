import Link from 'next/link';
import { ArrowRight, BookOpenCheck } from 'lucide-react';
import { aiThucChienTrackStats } from '@/data/ai-thuc-chien-bank';

const tracks = [
  {
    id: 'track-1',
    name: 'Track 1',
    focus: 'AI Builder & Operations',
    description: 'Từ nền tảng LLM và khám phá bài toán đến agent, RAG, data pipeline, triển khai và đánh giá hệ thống AI.',
    tone: 'border-violet-300/20 bg-violet-400/[0.06]',
    accent: 'text-violet-300',
  },
  {
    id: 'track-4',
    name: 'Track 4',
    focus: 'Computer Vision & Robotics',
    description: 'Mạng nơ-ron, perception 2D/3D, camera và LiDAR, tracking, sensor fusion cùng quy trình dữ liệu.',
    tone: 'border-cyan-300/20 bg-cyan-400/[0.06]',
    accent: 'text-cyan-300',
  },
] as const;

export default function AiThucChienPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <header className="mb-9 max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">Chọn track để ôn tập</h1>
        <p className="mt-3 text-base leading-7 text-gray-300">
          Track 1 và Track 4 có nội dung cùng ngân hàng câu hỏi riêng. Hãy chọn đúng chương trình bạn đang học.
        </p>
      </header>
      <div className="grid gap-5 md:grid-cols-2">
        {tracks.map((track) => {
          const stats = aiThucChienTrackStats[track.id];
          return (
            <section key={track.id} className={`flex min-h-72 flex-col rounded-2xl border p-6 md:p-7 ${track.tone}`}>
              <h2 className={`text-2xl font-bold ${track.accent}`}>{track.name}</h2>
              <h3 className="mt-2 text-lg font-semibold text-white">{track.focus}</h3>
              <p className="mt-3 max-w-prose text-sm leading-6 text-gray-300">{track.description}</p>
              <p className="mt-5 text-sm text-gray-300">
                <strong className="text-white">{stats.questions} câu</strong> · {stats.artifacts} artifact thực hành
              </p>
              <Link href={`/ai-thuc-chien/${track.id}`} className="mt-auto inline-flex w-fit items-center gap-2 rounded-lg bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                <BookOpenCheck size={17} /> Luyện riêng {track.name} <ArrowRight size={15} />
              </Link>
            </section>
          );
        })}
      </div>
    </div>
  );
}
