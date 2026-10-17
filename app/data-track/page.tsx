'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, BookOpenCheck, CheckCircle2, RotateCcw, Shuffle } from 'lucide-react';
import { dataTrackQuestions } from '@/data/data-track-bank';
import { aiThucChienQuestions, aiThucChienQuestionCount, aiThucChienArtifactCount, aiThucChienCurriculum } from '@/data/ai-thuc-chien-bank';
import type { MidtermQuestion } from '@/data/midterm';

type Phase = 'setup' | 'practice' | 'result';
const HISTORY_KEY = 'ai-exam-trainer-data-track-seen';
const SESSION_SIZE = 10;
const topicGroups = [
  {label:'AI foundations & data lifecycle',matches:/^AI \/ ML|^Dữ liệu và nhãn$|^AI lifecycle$|^Data lifecycle|^Ground truth$/i},
  {label:'Detection, boxes & metrics',matches:/^2D detection|^Detection|metrics|bounding box|^IoU|^YOLO$|bài toán thị giác|precision \/ recall/i},
  {label:'Tracking & identity',matches:/tracking|identity|ID switch|ByteTrack/i},
  {label:'Pose & keypoints',matches:/pose|keypoint|heatmap/i},
  {label:'Segmentation & masks',matches:/segmentation|U-Net/i},
  {label:'Annotation workflow & QC',matches:/annotation|guideline|inter-annotator|release gate|QA\/QC/i},
  {label:'Model-assisted & active learning',matches:/model-assisted|active learning|synthetic data/i},
  {label:'Road elements, DMS & privacy',matches:/road elements|traffic light|DMS|privacy/i},
  {label:'Fisheye & 360° cameras',matches:/fisheye|camera 360|surround view/i},
  {label:'LiDAR & 3D cuboids',matches:/LiDAR|3D cuboid/i},
  {label:'Calibration & multi-sensor',matches:/calibration|multi-sensor/i},
];

function randomize<T>(values: T[]) {
  const shuffled = [...values];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1));
    [shuffled[index],shuffled[target]] = [shuffled[target],shuffled[index]];
  }
  return shuffled;
}

function getSeenIds(course: 'data-track'|'ai-thuc-chien'): number[] {
  try {
    const value = localStorage.getItem(`${HISTORY_KEY}-${course}`);
    return value ? JSON.parse(value) as number[] : [];
  } catch { return []; }
}

export default function DataTrackPracticePage() {
  const [phase, setPhase] = useState<Phase>('setup');
  const [topic, setTopic] = useState('Tất cả chủ đề');
  const [course, setCourse] = useState<'data-track'|'ai-thuc-chien'>('data-track');
  const [practiceOnly, setPracticeOnly] = useState(false);
  const [session, setSession] = useState<MidtermQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number[] | string>>({});
  const [revealed, setRevealed] = useState<number[]>([]);
  const [rubricChecks, setRubricChecks] = useState<Record<number, boolean[]>>({});
  const courseQuestions = course === 'ai-thuc-chien' ? aiThucChienQuestions : dataTrackQuestions;
  const courseTopics = course === 'ai-thuc-chien' ? [...new Set(aiThucChienQuestions.map((question)=>question.topic))] : topicGroups.filter((group)=>dataTrackQuestions.some((question)=>group.matches.test(question.topic))).map((group)=>group.label);
  const pool = useMemo(() => courseQuestions.filter((question) => (!practiceOnly || question.workSample) && (topic === 'Tất cả chủ đề' || (course === 'ai-thuc-chien' ? question.topic === topic : Boolean(topicGroups.find((group)=>group.label===topic)?.matches.test(question.topic))))), [topic, practiceOnly, course, courseQuestions]);
  const question = session[index];
  const answerCount = Object.keys(answers).length;
  const scoredQuestions = session.filter((item) => item.kind !== 'written');
  const score = scoredQuestions.filter((item) => {
    const picked = answers[item.id];
    return Array.isArray(picked) && picked.length === item.answer?.length && picked.every((choice) => item.answer?.includes(choice));
  }).length;

  const start = () => {
    const eligible = pool.length >= SESSION_SIZE ? pool : practiceOnly ? courseQuestions.filter((item)=>item.workSample) : courseQuestions;
    const seen = new Set(getSeenIds(course));
    let unseen = eligible.filter((item) => !seen.has(item.id));
    if (unseen.length < SESSION_SIZE) {
      seen.clear();
      unseen = eligible;
    }
    const selected = randomize(unseen).slice(0,SESSION_SIZE);
    setSession(selected);
    setIndex(0);
    setAnswers({});
    setRevealed([]);
    setRubricChecks({});
    setPhase('practice');
    try {
      localStorage.setItem(`${HISTORY_KEY}-${course}`, JSON.stringify([...seen,...selected.map((item)=>item.id)]));
    } catch { /* Practice remains available when browser storage is blocked. */ }
  };

  const choose = (option: number) => {
    if (question.kind === 'multiple') {
      const current = Array.isArray(answers[question.id]) ? answers[question.id] as number[] : [];
      setAnswers({...answers,[question.id]:current.includes(option)?current.filter((value)=>value!==option):[...current,option].sort()});
    } else setAnswers({...answers,[question.id]:[option]});
    setRevealed(revealed.filter((id)=>id!==question.id));
  };

  if (phase === 'setup') return <div className="max-w-5xl mx-auto">
    <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-8"><ArrowLeft size={16}/> Về trang học tập</Link>
    <section className="rounded-3xl border border-white/10 bg-[#151923] p-6 md:p-10">
      <p className="text-sm font-semibold text-violet-300 mb-3">{course === 'ai-thuc-chien' ? 'AI THỰC CHIẾN · LUYỆN THEO CHỦ ĐỀ' : 'DATA TRACK · LUYỆN THEO CHỦ ĐỀ'}</p>
      <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight">Học để xử lý tình huống thật</h1>
      <label htmlFor="practice-course" className="mt-6 block text-sm font-semibold text-white">Chọn bộ học</label><select id="practice-course" value={course} onChange={(event)=>{setCourse(event.target.value as 'data-track'|'ai-thuc-chien');setTopic('Tất cả chủ đề');}} className="mt-2 w-full max-w-xl rounded-xl border border-white/10 bg-[#0f1117] px-4 py-3 text-white focus:border-violet-400 focus:outline-none"><option value="data-track">Data Track · dữ liệu xe tự hành</option><option value="ai-thuc-chien">AI Thực Chiến · L3–4</option></select>
      <p className="mt-4 max-w-2xl text-gray-300 leading-7">{course === 'ai-thuc-chien' ? `Luyện ${aiThucChienQuestionCount} câu được xây từ ${aiThucChienArtifactCount} artifact trong slide L3–4: AI product, agent, RAG, vận hành, computer vision, cảm biến, tracking, fusion và data pipeline.` : `Luyện ${dataTrackQuestions.length} câu về dữ liệu xe tự hành, annotation, detection, tracking, camera, LiDAR và QA.`} Câu đã gặp được ghi nhớ trên thiết bị để ưu tiên câu chưa làm.</p>
      {course === 'ai-thuc-chien' && <details className="mt-5 rounded-xl border border-white/10 bg-[#10131a] p-4">
        <summary className="cursor-pointer font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-300">Xem tổng hợp nội dung slide L3–4</summary>
        <div className="mt-4 grid gap-5 md:grid-cols-2">
          <div><h2 className="font-semibold text-sky-200">L3 · AI builder & vận hành</h2><ul className="mt-2 space-y-2 text-sm leading-6 text-gray-300">{aiThucChienCurriculum.l3.map((item)=><li key={item}>{item}</li>)}</ul></div>
          <div><h2 className="font-semibold text-sky-200">L4 · Computer vision & robotics</h2><ul className="mt-2 space-y-2 text-sm leading-6 text-gray-300">{aiThucChienCurriculum.l4.map((item)=><li key={item}>{item}</li>)}</ul></div>
        </div>
      </details>}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 border-y border-white/10 py-6">{[[String(courseQuestions.length),'câu trong ngân hàng'],[String(courseTopics.length),'chủ đề'],[String(courseQuestions.filter((item)=>item.workSample).length),'câu thực hành'],['10 câu','mỗi lượt']].map(([value,label])=><div key={`${value}-${label}`}><p className="text-xl font-bold text-white">{value}</p><p className="mt-1 text-sm text-gray-400">{label}</p></div>)}</div>
      <label htmlFor="practice-topic" className="mt-7 block text-sm font-semibold text-white">Chọn chủ đề</label>
      <select id="practice-topic" value={topic} onChange={(event)=>setTopic(event.target.value)} className="mt-2 w-full max-w-xl rounded-xl border border-white/10 bg-[#0f1117] px-4 py-3 text-white focus:border-violet-400 focus:outline-none"><option>Tất cả chủ đề</option>{courseTopics.map((item)=><option key={item}>{item}</option>)}</select>
      <label className="mt-4 flex w-fit items-center gap-3 text-sm text-gray-200"><input type="checkbox" checked={practiceOnly} onChange={(event)=>setPracticeOnly(event.target.checked)} className="accent-violet-400"/>Chỉ bài lab thực hành · artifact để review/sửa</label>
      <p className="mt-3 text-sm text-gray-400">{pool.length} câu thuộc lựa chọn này. Nếu chủ đề có ít hơn 10 câu, lượt luyện sẽ bổ sung từ cùng bộ học.</p>
      <button onClick={start} className="mt-7 inline-flex items-center gap-2 rounded-xl bg-violet-500 px-5 py-3 font-semibold text-white hover:bg-violet-400"><Shuffle size={17}/> Bắt đầu lượt luyện</button>
      <div className="mt-6 border-t border-white/10 pt-5"><Link href="/midterm" className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white"><BookOpenCheck size={16}/> Thi mô phỏng 50 câu / 90 phút <ArrowRight size={15}/></Link></div>
    </section>
  </div>;

  if (phase === 'result') return <div className="max-w-4xl mx-auto">
    <section className="rounded-3xl border border-white/10 bg-[#151923] p-6 md:p-9">
      <CheckCircle2 size={30} className="text-emerald-300"/><h1 className="mt-4 text-3xl font-bold text-white">Hoàn thành lượt luyện</h1>
      <p className="mt-2 text-gray-300">{topic} · {answerCount}/{session.length} câu đã trả lời</p>
      <p className="mt-5 text-2xl font-bold text-white">{score}/{scoredQuestions.length} câu trắc nghiệm đúng</p>
      <p className="mt-2 text-sm text-gray-400">Câu tự luận được tự đối chiếu bằng rubric; điểm không bao gồm phần tự luận.</p>
      <div className="mt-7 flex flex-wrap gap-3"><button onClick={start} className="inline-flex items-center gap-2 rounded-xl bg-violet-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-400"><RotateCcw size={16}/> Lượt mới · câu khác</button><button onClick={()=>setPhase('setup')} className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-gray-200 hover:bg-white/5">Đổi chủ đề</button></div>
    </section>
  </div>;

  const selected = Array.isArray(answers[question.id]) ? answers[question.id] as number[] : [];
  const isCorrect = selected.length === question.answer?.length && selected.every((choice)=>question.answer?.includes(choice));
  const isRevealed = revealed.includes(question.id);
  const next = () => index < session.length-1 ? setIndex(index+1) : setPhase('result');
  return <div className="max-w-6xl mx-auto">
    <header className="mb-6 flex flex-wrap items-end justify-between gap-3"><div><p className="text-sm font-semibold text-violet-300">LUYỆN THEO CHỦ ĐỀ · {topic}</p><h1 className="mt-1 text-2xl font-bold text-white">Câu {index+1} / {session.length}</h1></div><span className="text-sm text-gray-400">Đã làm {answerCount}</span></header>
    <div className="mb-6 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full bg-violet-400 transition-all" style={{width:`${((index+1)/session.length)*100}%`}}/></div>
    <div className="grid lg:grid-cols-[minmax(0,1fr)_260px] gap-5 items-start">
      <section className="min-h-[480px] rounded-2xl border border-white/10 bg-[#151923] p-5 md:p-8">
        <p className="text-xs font-semibold text-violet-300">{question.day} · {question.topic} · {question.workSample?'Lab thực chiến · ':''}{question.kind==='single'?'Một đáp án':question.kind==='multiple'?'Chọn các đáp án đúng':question.kind==='boolean'?'Đúng / sai':'Tự luận tình huống'}</p>
        {question.workSample && question.caseMaterial && <div className="mt-5 overflow-x-auto rounded-xl border border-white/10 bg-[#0d1016] p-4"><div className="mb-2 text-xs font-semibold uppercase tracking-wide text-sky-300">Artifact cần review · {question.topic}</div><pre className="whitespace-pre-wrap break-words font-mono text-xs leading-6 text-gray-200">{question.caseMaterial}</pre></div>}
        <h2 className="mt-5 text-lg font-semibold leading-8 text-white">{question.prompt}</h2>
        {question.kind==='written' ? <div className="mt-5"><label htmlFor="practice-written" className="sr-only">Câu trả lời</label><textarea id="practice-written" rows={7} value={typeof answers[question.id]==='string'?answers[question.id] as string:''} onChange={(event)=>setAnswers({...answers,[question.id]:event.target.value})} placeholder="Ghi quyết định, evidence và bước tiếp theo…" className="w-full rounded-xl border border-white/10 bg-[#0f1117] p-4 text-sm leading-6 text-white placeholder:text-gray-500 focus:border-violet-400 focus:outline-none"/></div> : <div className="mt-6 space-y-3">{question.options?.map((option,optionIndex)=>{const active=selected.includes(optionIndex);return <button key={`${question.id}-${optionIndex}`} onClick={()=>choose(optionIndex)} aria-pressed={active} className={`flex w-full items-start gap-3 rounded-xl border p-4 text-left text-sm leading-6 transition-colors ${active?'border-violet-400/60 bg-violet-400/10 text-white':'border-white/10 bg-[#10131a] text-gray-200 hover:border-white/25'}`}><span className="w-6 shrink-0 font-semibold text-gray-400">{question.kind==='boolean'?'•':String.fromCharCode(65+optionIndex)}</span>{option}</button>})}</div>}
        {isRevealed && <div className={`mt-5 rounded-xl p-4 ${question.kind==='written'?'bg-sky-500/10':isCorrect?'bg-emerald-500/10':'bg-amber-500/10'}`}><p className={`font-semibold ${question.kind==='written'?'text-sky-200':isCorrect?'text-emerald-300':'text-amber-200'}`}>{question.kind==='written'?'Rubric tự đối chiếu':isCorrect?'Chính xác':'Hãy xem lại cách xử lý'}</p><p className="mt-1 text-sm leading-6 text-gray-300">{question.explanation}</p>{question.kind==='written'&&<div className="mt-3 space-y-2">{question.rubric?.map((item,idx)=><label key={item} className="flex gap-3 rounded-lg bg-black/10 p-3 text-sm text-gray-200"><input type="checkbox" checked={rubricChecks[question.id]?.[idx]??false} onChange={(event)=>setRubricChecks({...rubricChecks,[question.id]:question.rubric!.map((_,n)=>n===idx?event.target.checked:(rubricChecks[question.id]?.[n]??false))})} className="mt-0.5 accent-violet-400"/>{item}</label>)}</div>}</div>}
        <div className="mt-6 flex flex-wrap justify-between gap-3 border-t border-white/10 pt-5"><button onClick={()=>setIndex(Math.max(0,index-1))} disabled={index===0} className="rounded-lg px-3 py-2 text-sm text-gray-300 hover:bg-white/5 disabled:opacity-30">← Câu trước</button><div className="flex gap-2">{!isRevealed&&<button onClick={()=>setRevealed([...revealed,question.id])} disabled={question.kind==='written'?!answers[question.id]:selected.length===0} className="rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-200 hover:bg-white/5 disabled:opacity-30">{question.kind==='written'?'Đối chiếu rubric':'Kiểm tra'}</button>}<button onClick={next} className="inline-flex items-center gap-2 rounded-lg bg-violet-500 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-400">{index===session.length-1?'Xem kết quả':'Tiếp'}<ArrowRight size={15}/></button></div></div>
      </section>
      <aside className="rounded-2xl border border-white/10 bg-[#151923] p-5"><h2 className="font-semibold text-white">Lượt học này</h2><div className="mt-4 grid grid-cols-5 gap-2">{session.map((item,idx)=><button key={item.id} aria-label={`Đi đến câu ${idx+1}`} aria-current={idx===index?'step':undefined} onClick={()=>setIndex(idx)} className={`h-9 rounded-lg text-xs font-semibold ${idx===index?'ring-2 ring-violet-300 ':''}${answers[item.id]?'bg-emerald-500/20 text-emerald-200':'bg-white/5 text-gray-400 hover:bg-white/10'}`}>{idx+1}</button>)}</div><p className="mt-4 text-xs leading-5 text-gray-400">Các câu đã gặp được lưu trên trình duyệt này để hạn chế lặp ở lượt sau.</p><button onClick={()=>setPhase('setup')} className="mt-5 w-full rounded-lg border border-white/10 px-3 py-2 text-sm text-gray-300 hover:bg-white/5">Thoát lượt luyện</button></aside>
    </div>
  </div>;
}
