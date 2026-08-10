// ============================================================
// AI Exam Trainer — Module & Topic Data
// ============================================================

import { Module } from '@/types/question';

export const modules: Module[] = [
  {
    id: 'A',
    name: 'Toán học & Tư duy định lượng',
    description: 'Đại số tuyến tính, xác suất, thống kê, giải tích và tối ưu hóa',
    icon: 'Calculator',
    color: '#8B5CF6', // violet
    topics: [
      { id: 'A1', moduleId: 'A', name: 'Đại số tuyến tính cơ bản', targetCount: 36 },
      { id: 'A2', moduleId: 'A', name: 'Eigenvalue & Decomposition', targetCount: 23 },
      { id: 'A3', moduleId: 'A', name: 'Xác suất cơ bản', targetCount: 35 },
      { id: 'A4', moduleId: 'A', name: 'Phân phối xác suất', targetCount: 25 },
      { id: 'A5', moduleId: 'A', name: 'Thống kê mô tả & suy luận', targetCount: 29 },
      { id: 'A6', moduleId: 'A', name: 'Giải tích & Tối ưu hóa', targetCount: 35 },
      { id: 'A7', moduleId: 'A', name: 'Tư duy định lượng & Ước lượng', targetCount: 5 },
      { id: 'A8', moduleId: 'A', name: 'Lý thuyết thông tin', targetCount: 5 },
      { id: 'A9', moduleId: 'A', name: 'Distance metrics & Similarity', targetCount: 15 },
      { id: 'A10', moduleId: 'A', name: 'Số học máy tính & Ổn định số', targetCount: 15 },
    ],
  },
  {
    id: 'B',
    name: 'Lập trình & Xử lý dữ liệu',
    description: 'Python, cấu trúc dữ liệu, thuật toán, Numpy, Pandas, SQL',
    icon: 'Code2',
    color: '#06B6D4', // cyan
    topics: [
      { id: 'B1', moduleId: 'B', name: 'Python cơ bản', targetCount: 34 },
      { id: 'B2', moduleId: 'B', name: 'Python nâng cao', targetCount: 25 },
      { id: 'B3', moduleId: 'B', name: 'Cấu trúc dữ liệu & Thuật toán', targetCount: 23 },
      { id: 'B4', moduleId: 'B', name: 'Numpy & Pandas Data Wrangling', targetCount: 20 },
      { id: 'B5', moduleId: 'B', name: 'Cơ sở dữ liệu & SQL', targetCount: 15 },
      { id: 'B6', moduleId: 'B', name: 'Data Pipelines & Processing', targetCount: 10 },
      { id: 'B7', moduleId: 'B', name: 'Git & Version Control', targetCount: 5 },
      { id: 'B8', moduleId: 'B', name: 'API & Hệ thống', targetCount: 3 },
      { id: 'B9', moduleId: 'B', name: 'Testing & Debugging', targetCount: 16 },
      { id: 'B10', moduleId: 'B', name: 'Data Visualization', targetCount: 15 },
      { id: 'B11', moduleId: 'B', name: 'Regex & File Formats', targetCount: 15 },
    ],
  },
  {
    id: 'C',
    name: 'AI & Machine Learning',
    description: 'Supervised, Unsupervised, Deep Learning, NLP, Computer Vision, MLOps',
    icon: 'Brain',
    color: '#F59E0B', // amber
    topics: [
      { id: 'C1', moduleId: 'C', name: 'Học Có giám sát & Không giám sát', targetCount: 20 },
      { id: 'C2', moduleId: 'C', name: 'Đánh giá mô hình (Model Evaluation)', targetCount: 8 },
      { id: 'C3', moduleId: 'C', name: 'Học Sâu (Deep Learning)', targetCount: 15 },
      { id: 'C4', moduleId: 'C', name: 'Xử lý ngôn ngữ tự nhiên (NLP)', targetCount: 5 },
      { id: 'C5', moduleId: 'C', name: 'Thị giác máy tính (Computer Vision)', targetCount: 5 },
      { id: 'C6', moduleId: 'C', name: 'MLOps & Model Deployment', targetCount: 6 },
      { id: 'C7', moduleId: 'C', name: 'AI Product Thinking', targetCount: 3 },
      { id: 'C8', moduleId: 'C', name: 'Phân tích Chuỗi thời gian (Time Series)', targetCount: 3 },
      { id: 'C9', moduleId: 'C', name: 'Generative AI & Large Language Models (LLMs)', targetCount: 15 },
      { id: 'C10', moduleId: 'C', name: 'Reinforcement Learning', targetCount: 13 },
      { id: 'C11', moduleId: 'C', name: 'Time Series & Recommender Systems', targetCount: 10 },
      { id: 'C12', moduleId: 'C', name: 'Feature Engineering & AutoML', targetCount: 13 },
    ],
  },
  {
    id: 'D',
    name: 'Tư duy, Đạo đức & Quản trị AI',
    description: 'Logic, đạo đức AI, bias, privacy, safety, regulation',
    icon: 'Shield',
    color: '#10B981', // emerald
    topics: [
      { id: 'D1', moduleId: 'D', name: 'Logic & Tư duy phản biện', targetCount: 8 },
      { id: 'D2', moduleId: 'D', name: 'Đạo đức AI (AI Ethics)', targetCount: 4 },
      { id: 'D3', moduleId: 'D', name: 'Định kiến & Công bằng (Bias & Fairness)', targetCount: 4 },
      { id: 'D4', moduleId: 'D', name: 'Quyền riêng tư (Privacy)', targetCount: 3 },
      { id: 'D5', moduleId: 'D', name: 'An toàn AI (AI Safety & Security)', targetCount: 3 },
      { id: 'D6', moduleId: 'D', name: 'Tình huống nghề nghiệp', targetCount: 2 },
      { id: 'D7', moduleId: 'D', name: 'Case Studies', targetCount: 2 },
      { id: 'D8', moduleId: 'D', name: 'AI Regulation & Compliance', targetCount: 9 },
      { id: 'D8.1', moduleId: 'D', name: 'Quy định AI (AI Regulation)', targetCount: 3 },
      { id: 'D9', moduleId: 'D', name: 'IP, Môi trường & Xã hội', targetCount: 9 },
      { id: 'D10', moduleId: 'D', name: 'Giao tiếp & Documentation', targetCount: 12 },
    ],
  },
];

// Helper functions
export function getModule(moduleId: string): Module | undefined {
  return modules.find((m) => m.id === moduleId);
}

export function getTopic(topicId: string): { module: Module; topic: typeof modules[0]['topics'][0] } | undefined {
  for (const mod of modules) {
    const topic = mod.topics.find((t) => t.id === topicId);
    if (topic) return { module: mod, topic };
  }
  return undefined;
}

import { getQuestionsByModule } from './questions';

export function getModuleTotalQuestions(moduleId: string): number {
  return getQuestionsByModule(moduleId).length;
}

export function getTotalQuestions(): number {
  return modules.reduce((sum, m) => sum + getModuleTotalQuestions(m.id), 0);
}
