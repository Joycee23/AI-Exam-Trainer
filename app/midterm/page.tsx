'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Bookmark, Check, Clock3, FileCheck2, RotateCcw } from 'lucide-react';
import { dataTrackQuestionCount, dataTrackQuestions, pickExamQuestions } from '@/data/data-track-bank';
import { midtermQuestions, type MidtermQuestion } from '@/data/midterm';
import { aiThucChienQuestions, aiThucChienQuestionCount, aiThucChienArtifactCount, pickAiThucChienExam } from '@/data/ai-thuc-chien-bank';

type Phase = 'intro' | 'exam' | 'result';
const EXAM_SECONDS = 90 * 60;
const EXAM_HISTORY_KEY = 'ai-exam-trainer-midterm-seen';
type ExamCourse = 'data-track'|'ai-thuc-chien';

function formatTime(seconds: number) {
  const safe = Math.max(0, seconds);
  return `${String(Math.floor(safe / 3600)).padStart(2, '0')}:${String(Math.floor((safe % 3600) / 60)).padStart(2, '0')}:${String(safe % 60).padStart(2, '0')}`;
}

export default function MidtermPage() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [course, setCourse] = useState<ExamCourse>('data-track');
  const [index, setIndex] = useState(0);
  const [questions, setQuestions] = useState<MidtermQuestion[]>(midtermQuestions);
  const [answers, setAnswers] = useState<Record<number, number[] | string>>({});
  const [marked, setMarked] = useState<number[]>([]);
  const [remaining, setRemaining] = useState(EXAM_SECONDS);
  const remainingRef = useRef(EXAM_SECONDS);
  const [checkedRubrics, setCheckedRubrics] = useState<Record<number, boolean[]>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const question = questions[index];
  const answered = Object.keys(answers).length;
  const objectiveCount = questions.filter((q) => q.kind !== 'written').length;
  const writtenCount = questions.filter((q) => q.kind === 'written').length;

  useEffect(() => {
    if (phase !== 'exam') return;
    const timer = window.setInterval(() => {
      if (remainingRef.current <= 1) {
        window.clearInterval(timer);
        remainingRef.current = 0;
        setRemaining(0);
        setPhase('result');
      } else {
        remainingRef.current -= 1;
        setRemaining(remainingRef.current);
      }
    }, 1000);
    return () => window.clearInterval(timer);
  }, [phase]);

  const autoScore = useMemo(() => questions.reduce((score, item) => {
    if (item.kind === 'written') return score;
    const selected = answers[item.id];
    if (!Array.isArray(selected) || !item.answer) return score;
    return score + (selected.length === item.answer.length && selected.every((n) => item.answer!.includes(n)) ? 1 : 0);
  }, 0), [answers, questions]);

  const choose = (option: number) => {
    if (question.kind === 'multiple') {
      const current = Array.isArray(answers[question.id]) ? answers[question.id] as number[] : [];
      const next = current.includes(option) ? current.filter((n) => n !== option) : [...current, option].sort();
      setAnswers({ ...answers, [question.id]: next });
    } else setAnswers({ ...answers, [question.id]: [option] });
    setShowExplanation(false);
  };

  const start = () => {
    let recentIds: number[] = [];
    try {
      recentIds = JSON.parse(localStorage.getItem(`${EXAM_HISTORY_KEY}-${course}`) ?? '[]') as number[];
    } catch { /* A new exam can still start when browser storage is unavailable. */ }
    const nextQuestions = course === 'ai-thuc-chien' ? pickAiThucChienExam(Math.random, recentIds) : pickExamQuestions(Math.random, recentIds);
    setQuestions(nextQuestions);
    setIndex(0);
    setAnswers({});
    setMarked([]);
    setCheckedRubrics({});
    remainingRef.current = EXAM_SECONDS;
    setPhase('exam');
    setRemaining(EXAM_SECONDS);
    try {
      localStorage.setItem(`${EXAM_HISTORY_KEY}-${course}`, JSON.stringify([...recentIds,...nextQuestions.map((item)=>item.id)].slice(-200)));
    } catch { /* Exam history is an enhancement; the exam itself does not depend on it. */ }
  };
  const submit = () => setPhase('result');
  const reset = () => { remainingRef.current = EXAM_SECONDS; setPhase('intro'); setIndex(0); setAnswers({}); setMarked([]); setCheckedRubrics({}); setShowExplanation(false); setRemaining(EXAM_SECONDS); };
  const toggleMarked = () => setMarked((current) => current.includes(question.id) ? current.filter((id) => id !== question.id) : [...current, question.id]);

  if (phase === 'intro') return (
    <div className="max-w-5xl mx-auto">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-8"><ArrowLeft size={16} /> Về trang học tập</Link>
      <section className="rounded-3xl border border-white/10 bg-[#151923] p-6 md:p-10">
        <p className="text-sm text-violet-300 font-semibold mb-3">{course === 'ai-thuc-chien' ? 'AI THỰC CHIẾN · ĐỀ LUYỆN TẬP' : 'AI DATA TRACK · ĐỀ LUYỆN TẬP'}</p>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white max-w-3xl">{course === 'ai-thuc-chien' ? 'Đề mô phỏng AI Thực Chiến · L3–4' : 'Midterm: dữ liệu cho AI xe tự hành'}</h1>
        <label htmlFor="exam-course" className="mt-6 block text-sm font-semibold text-white">Chọn chương trình</label><select id="exam-course" value={course} onChange={(event)=>setCourse(event.target.value as ExamCourse)} className="mt-2 w-full max-w-xl rounded-xl border border-white/10 bg-[#0f1117] px-4 py-3 text-white focus:border-violet-400 focus:outline-none"><option value="data-track">Data Track · dữ liệu xe tự hành</option><option value="ai-thuc-chien">AI Thực Chiến · L3–4</option></select>
        <p className="mt-4 max-w-2xl text-gray-300 leading-7">{course === 'ai-thuc-chien' ? `Mỗi lượt rút 50 câu từ ${aiThucChienQuestionCount} câu L3–4, có ${aiThucChienArtifactCount} artifact thực hành; phủ AI foundation, product, agent, RAG, vận hành hệ thống, neural networks, vision, sensing, tracking, fusion và data pipeline.` : `Mỗi lượt thi rút ngẫu nhiên 50 câu từ ngân hàng Data Track, phủ annotation 2D/3D, detection, tracking, pose, segmentation, quy trình QC, camera 360° và LiDAR.`}</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 border-y border-white/10 py-6">
          {[[String(course === 'ai-thuc-chien' ? aiThucChienQuestionCount : dataTrackQuestionCount),'câu trong ngân hàng'],['90 phút','thời lượng'],['4 dạng','câu hỏi'],[String((course === 'ai-thuc-chien' ? aiThucChienQuestions : dataTrackQuestions).filter((item)=>item.workSample).length),'câu thực hành có artifact']].map(([value,label]) => <div key={`${value}-${label}`}><div className="text-xl font-bold text-white">{value}</div><div className="text-sm text-gray-400 mt-1">{label}</div></div>)}
        </div>
        <div className="grid md:grid-cols-2 gap-7 mt-7">
          <div><h2 className="font-semibold text-white">Cấu trúc đề</h2><ul className="mt-3 space-y-2 text-sm text-gray-300"><li>30 câu trắc nghiệm một đáp án</li><li>8 câu chọn nhiều đáp án</li><li>6 câu đúng / sai</li><li>6 câu tự luận ngắn có rubric tự đối chiếu</li></ul></div>
          <div><h2 className="font-semibold text-white">Lưu ý khi làm</h2><ul className="mt-3 space-y-2 text-sm text-gray-300"><li>Đề sẽ tự nộp khi hết giờ.</li><li>Câu tự luận không được chấm tự động; dùng rubric để tự đánh giá sau khi nộp.</li><li>Đề tập trung vào slide hiện có; phần lab được kiểm tra qua quy trình và tình huống thực hành.</li></ul></div>
        </div>
        <button onClick={start} className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-violet-500 hover:bg-violet-400 px-6 py-3 font-semibold text-white transition-colors"><FileCheck2 size={18} /> Bắt đầu làm bài</button>
        <p className="text-xs text-gray-500 mt-3">Ngày thi 23 hoặc 24/10 là lịch dự kiến do lớp thông báo; đây là đề ôn tập, không phải đề thi chính thức.</p>
      </section>
    </div>
  );

  if (phase === 'result') {
    const percentage = Math.round(autoScore / objectiveCount * 100);
    return <div className="max-w-5xl mx-auto">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-7"><div><p className="text-sm text-violet-300 font-semibold">KẾT QUẢ MÔ PHỎNG</p><h1 className="text-3xl font-bold text-white mt-2">Bài làm đã được nộp</h1></div><button onClick={reset} className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2.5 text-sm text-gray-200 hover:bg-white/5"><RotateCcw size={16}/> Làm lại</button></div>
      <section className="rounded-2xl border border-white/10 bg-[#151923] p-6 md:p-8">
        <div className="flex flex-wrap items-end gap-x-6 gap-y-2"><div className="text-5xl font-bold text-white">{autoScore}<span className="text-2xl text-gray-500">/{objectiveCount}</span></div><div className="pb-1 text-gray-300">{percentage}% câu khách quan đúng</div></div>
        <p className="text-sm text-gray-400 mt-3">Câu tự luận: {writtenCount}. Hãy mở từng câu, đọc rubric và tự đánh giá; điểm trên không bao gồm tự luận.</p>
        <div className="mt-6 flex flex-wrap gap-3 text-sm"><span className="rounded-lg bg-white/5 px-3 py-2 text-gray-300">Đã trả lời: {answered}/{questions.length}</span><span className="rounded-lg bg-white/5 px-3 py-2 text-gray-300">Cần xem lại: {marked.length}</span><span className="rounded-lg bg-white/5 px-3 py-2 text-gray-300">Bỏ trống: {questions.length-answered}</span></div>
      </section>
      <div className="mt-6 grid sm:grid-cols-5 md:grid-cols-10 grid-cols-5 gap-2">{questions.map((q,i)=><button key={q.id} onClick={()=>{setIndex(i);setShowExplanation(true);}} className={`h-10 rounded-lg text-sm font-medium ${Array.isArray(answers[q.id]) && q.kind !== 'written' ? (answers[q.id] as number[]).length === q.answer?.length && (answers[q.id] as number[]).every(n=>q.answer?.includes(n)) ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300' : answers[q.id] ? 'bg-amber-500/20 text-amber-300' : 'bg-white/5 text-gray-400'}`}>{i+1}</button>)}</div>
      <section className="mt-6 rounded-2xl border border-white/10 bg-[#151923] p-6"><p className="text-xs text-violet-300 font-semibold">CÂU {index+1} · {question.day} · {question.topic}</p>{question.workSample && question.caseMaterial && <pre className="mt-4 overflow-x-auto whitespace-pre-wrap break-words rounded-xl border border-white/10 bg-[#0d1016] p-4 font-mono text-xs leading-6 text-gray-200">{question.caseMaterial}</pre>}<h2 className="mt-3 text-lg font-semibold text-white">{question.prompt}</h2>{question.kind==='written' ? <div className="mt-4"><p className="text-sm text-gray-400 mb-2">Đối chiếu bài viết của bạn với các ý chính:</p><div className="space-y-2">{question.rubric?.map((r,i)=><label key={i} className="flex gap-3 items-start rounded-lg bg-white/[0.03] p-3 text-sm text-gray-300"><input type="checkbox" checked={checkedRubrics[question.id]?.[i] ?? false} onChange={(e)=>setCheckedRubrics({...checkedRubrics,[question.id]:question.rubric!.map((_,n)=>n===i?e.target.checked:(checkedRubrics[question.id]?.[n]??false))})} className="mt-0.5 accent-violet-400"/><span>{r}</span></label>)}</div><p className="mt-3 text-xs text-gray-500">Tự đối chiếu, không cộng vào điểm trắc nghiệm.</p></div> : <div className="mt-4 space-y-2">{question.options?.map((o,i)=><div key={o} className={`rounded-lg p-3 text-sm ${question.answer?.includes(i) ? 'bg-emerald-500/10 text-emerald-200' : 'bg-white/[0.03] text-gray-400'}`}>{String.fromCharCode(65+i)}. {o}{question.answer?.includes(i) && <span className="ml-2 text-xs">· Đáp án</span>}</div>)}</div>}<p className="mt-4 text-sm leading-6 text-gray-300">{question.explanation}</p><div className="mt-5 flex justify-between"><button onClick={()=>{setIndex(Math.max(0,index-1));setShowExplanation(false);}} disabled={index===0} className="text-sm text-gray-300 disabled:opacity-30">← Trước</button><button onClick={()=>{setIndex(Math.min(questions.length-1,index+1));setShowExplanation(false);}} disabled={index===questions.length-1} className="text-sm text-gray-300 disabled:opacity-30">Tiếp →</button></div></section>
    </div>;
  }

  const selected = Array.isArray(answers[question.id]) ? answers[question.id] as number[] : [];
  const correct = question.kind !== 'written' && selected.length === question.answer?.length && selected.every((n) => question.answer?.includes(n));
  return <div className="max-w-6xl mx-auto">
    <header className="flex flex-wrap items-center justify-between gap-4 mb-6"><div><p className="text-sm text-violet-300 font-semibold">MIDTERM · DATA TRACK</p><h1 className="text-xl md:text-2xl font-bold text-white mt-1">Đề mô phỏng</h1></div><div className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 font-mono tabular-nums ${remaining<300?'border-rose-400/40 text-rose-300':'border-white/10 text-white'}`}><Clock3 size={17}/>{formatTime(remaining)}</div></header>
    <div className="h-1.5 rounded-full bg-white/10 mb-6 overflow-hidden"><div className="h-full bg-violet-400 transition-all" style={{width:`${(answered/questions.length)*100}%`}}/></div>
    <div className="grid lg:grid-cols-[minmax(0,1fr)_270px] gap-5 items-start">
      <section className="rounded-2xl border border-white/10 bg-[#151923] p-5 md:p-8 min-h-[490px]">
        <div className="flex flex-wrap justify-between gap-3"><div><p className="text-xs font-semibold tracking-wide text-violet-300">CÂU {index+1} / {questions.length} · {question.day}</p><p className="mt-1 text-sm text-gray-400">{question.workSample?'Lab thực chiến · ':''}{question.topic} · {question.kind==='single'?'Một đáp án':question.kind==='multiple'?'Nhiều đáp án':question.kind==='boolean'?'Đúng / sai':'Tự luận'}</p></div><button onClick={toggleMarked} className={`inline-flex items-center gap-2 text-sm ${marked.includes(question.id)?'text-amber-300':'text-gray-400 hover:text-white'}`}><Bookmark size={16} fill={marked.includes(question.id)?'currentColor':'none'}/>{marked.includes(question.id)?'Đã đánh dấu':'Đánh dấu xem lại'}</button></div>
        {question.workSample && question.caseMaterial && <div className="mt-6 overflow-x-auto rounded-xl border border-white/10 bg-[#0d1016] p-4"><div className="mb-2 text-xs font-semibold uppercase tracking-wide text-sky-300">Artifact cần review · {question.topic}</div><pre className="whitespace-pre-wrap break-words font-mono text-xs leading-6 text-gray-200">{question.caseMaterial}</pre></div>}
        <h2 className="mt-7 text-lg md:text-xl leading-8 font-semibold text-white">{question.prompt}</h2>
        {question.kind==='written' ? <div className="mt-5"><label htmlFor="written-answer" className="sr-only">Nhập câu trả lời tự luận</label><textarea id="written-answer" rows={7} value={typeof answers[question.id]==='string'?answers[question.id] as string:''} onChange={(e)=>setAnswers({...answers,[question.id]:e.target.value})} placeholder="Viết câu trả lời của bạn tại đây…" className="w-full rounded-xl border border-white/10 bg-[#0f1117] p-4 text-sm leading-6 text-white placeholder:text-gray-500 focus:border-violet-400 focus:outline-none"/><p className="text-xs text-gray-500 mt-2">Bài viết được giữ trong trình duyệt cho tới khi bạn rời phiên này.</p></div> : <div className="mt-6 space-y-3">{question.options?.map((option,i)=>{const active=selected.includes(i);return <button key={option} onClick={()=>choose(i)} aria-pressed={active} className={`w-full flex items-start gap-3 rounded-xl border p-4 text-left transition-colors ${active?'border-violet-400/60 bg-violet-400/10 text-white':'border-white/10 bg-[#10131a] text-gray-200 hover:border-white/25'}`}><span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border text-xs font-semibold ${active?'border-violet-300 bg-violet-400 text-white':'border-white/20 text-gray-400'}`}>{question.kind==='boolean'?<Check size={14}/>:String.fromCharCode(65+i)}</span><span className="text-sm leading-6">{option}</span></button>})}</div>}
        {showExplanation && question.kind!=='written' && <div className={`mt-5 rounded-xl p-4 ${correct?'bg-emerald-500/10':'bg-amber-500/10'}`}><p className={`font-semibold text-sm ${correct?'text-emerald-300':'text-amber-200'}`}>{correct?'Chính xác':'Chưa chính xác'}</p><p className="text-sm leading-6 text-gray-300 mt-1">{question.explanation}</p></div>}
        {phase==='exam' && <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5"><button onClick={()=>setIndex(Math.max(0,index-1))} disabled={index===0} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-300 hover:bg-white/5 disabled:opacity-30"><ArrowLeft size={16}/> Câu trước</button><div className="flex gap-2"><button onClick={()=>setShowExplanation(true)} disabled={!answers[question.id] || question.kind==='written'} className="rounded-lg px-3 py-2 text-sm text-gray-300 hover:bg-white/5 disabled:opacity-30">Kiểm tra</button><button onClick={()=>setIndex(Math.min(questions.length-1,index+1))} disabled={index===questions.length-1} className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/15 disabled:opacity-30">Câu tiếp <ArrowRight size={16}/></button></div></div>}
      </section>
      <aside className="rounded-2xl border border-white/10 bg-[#151923] p-5 lg:sticky lg:top-6"><div className="flex justify-between items-center"><h2 className="font-semibold text-white">Phiếu trả lời</h2><span className="text-xs text-gray-400">{answered}/{questions.length}</span></div><div className="grid grid-cols-5 gap-2 mt-4">{questions.map((q,i)=><button key={q.id} onClick={()=>{setIndex(i);setShowExplanation(false);}} aria-label={`Đi đến câu ${i+1}`} aria-current={i===index?'step':undefined} className={`relative h-9 rounded-lg text-xs font-semibold ${i===index?'ring-2 ring-violet-300 ':''}${answers[q.id]?(q.kind==='written'?'bg-sky-500/20 text-sky-200':'bg-emerald-500/20 text-emerald-200'):'bg-white/5 text-gray-400 hover:bg-white/10'} ${marked.includes(q.id)?'after:absolute after:right-1 after:top-1 after:h-1.5 after:w-1.5 after:rounded-full after:bg-amber-300':''}`}>{i+1}</button>)}</div><div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-gray-400"><span>● Đã trả lời</span><span className="text-amber-300">● Đánh dấu</span></div><div className="mt-5 border-t border-white/10 pt-4"><button onClick={submit} className="w-full rounded-xl bg-violet-500 px-4 py-3 text-sm font-semibold text-white hover:bg-violet-400">Nộp bài</button><p className="mt-2 text-center text-xs text-gray-500">Bạn có thể nộp trước khi hết giờ.</p></div></aside>
    </div>
  </div>;
}
