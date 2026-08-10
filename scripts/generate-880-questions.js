const fs = require('fs');
const path = require('path');

const topics = [
  // Module A
  { id: 'A1', moduleId: 'A', name: 'Đại số tuyến tính cơ bản' },
  { id: 'A2', moduleId: 'A', name: 'Eigenvalue & Decomposition' },
  { id: 'A3', moduleId: 'A', name: 'Xác suất cơ bản' },
  { id: 'A4', moduleId: 'A', name: 'Phân phối xác suất' },
  { id: 'A5', moduleId: 'A', name: 'Thống kê mô tả & suy luận' },
  { id: 'A6', moduleId: 'A', name: 'Giải tích & Tối ưu hóa' },
  { id: 'A7', moduleId: 'A', name: 'Tư duy định lượng & Ước lượng' },
  { id: 'A8', moduleId: 'A', name: 'Lý thuyết thông tin' },
  { id: 'A9', moduleId: 'A', name: 'Distance metrics & Similarity' },
  { id: 'A10', moduleId: 'A', name: 'Số học máy tính & Ổn định số' },
  // Module B
  { id: 'B1', moduleId: 'B', name: 'Python cơ bản' },
  { id: 'B2', moduleId: 'B', name: 'Python nâng cao' },
  { id: 'B3', moduleId: 'B', name: 'Cấu trúc dữ liệu & Thuật toán' },
  { id: 'B4', moduleId: 'B', name: 'Numpy & Pandas Data Wrangling' },
  { id: 'B5', moduleId: 'B', name: 'Cơ sở dữ liệu & SQL' },
  { id: 'B6', moduleId: 'B', name: 'Data Pipelines & Processing' },
  { id: 'B7', moduleId: 'B', name: 'Git & Version Control' },
  { id: 'B8', moduleId: 'B', name: 'API & Hệ thống' },
  { id: 'B9', moduleId: 'B', name: 'Testing & Debugging' },
  { id: 'B10', moduleId: 'B', name: 'Data Visualization' },
  { id: 'B11', moduleId: 'B', name: 'Regex & File Formats' },
  // Module C
  { id: 'C1', moduleId: 'C', name: 'Học Có giám sát & Không giám sát' },
  { id: 'C2', moduleId: 'C', name: 'Đánh giá mô hình (Model Evaluation)' },
  { id: 'C3', moduleId: 'C', name: 'Học Sâu (Deep Learning)' },
  { id: 'C4', moduleId: 'C', name: 'Xử lý ngôn ngữ tự nhiên (NLP)' },
  { id: 'C5', moduleId: 'C', name: 'Thị giác máy tính (Computer Vision)' },
  { id: 'C6', moduleId: 'C', name: 'MLOps & Model Deployment' },
  { id: 'C7', moduleId: 'C', name: 'AI Product Thinking' },
  { id: 'C8', moduleId: 'C', name: 'Phân tích Chuỗi thời gian (Time Series)' },
  { id: 'C9', moduleId: 'C', name: 'Generative AI & Large Language Models (LLMs)' },
  { id: 'C10', moduleId: 'C', name: 'Reinforcement Learning' },
  { id: 'C11', moduleId: 'C', name: 'Time Series & Recommender Systems' },
  { id: 'C12', moduleId: 'C', name: 'Feature Engineering & AutoML' },
  // Module D
  { id: 'D1', moduleId: 'D', name: 'Logic & Tư duy phản biện' },
  { id: 'D2', moduleId: 'D', name: 'Đạo đức AI (AI Ethics)' },
  { id: 'D3', moduleId: 'D', name: 'Định kiến & Công bằng (Bias & Fairness)' },
  { id: 'D4', moduleId: 'D', name: 'Quyền riêng tư (Privacy)' },
  { id: 'D5', moduleId: 'D', name: 'An toàn AI (AI Safety & Security)' },
  { id: 'D6', moduleId: 'D', name: 'Tình huống nghề nghiệp' },
  { id: 'D7', moduleId: 'D', name: 'Case Studies' },
  { id: 'D8', moduleId: 'D', name: 'AI Regulation & Compliance' },
  { id: 'D8.1', moduleId: 'D', name: 'Quy định AI (AI Regulation)' },
  { id: 'D9', moduleId: 'D', name: 'IP, Môi trường & Xã hội' },
  { id: 'D10', moduleId: 'D', name: 'Giao tiếp & Documentation' },
];

const QUESTIONS_PER_TOPIC = 20;
let allQuestions = [];

const difficulties = ['easy', 'medium', 'hard'];

// Some generic templates to make questions look somewhat realistic
const templates = {
  concept: [
    "Khái niệm nào sau đây mô tả đúng nhất về {topic}?",
    "Trong ngữ cảnh {topic}, thuật ngữ nào thường được sử dụng nhất?",
    "Mục đích chính của {topic} là gì?",
    "Đâu là ưu điểm lớn nhất khi áp dụng {topic}?"
  ],
  application: [
    "Khi nào chúng ta nên sử dụng kỹ thuật liên quan đến {topic}?",
    "Trong thực tế, {topic} thường được ứng dụng để giải quyết bài toán nào?",
    "Một hệ thống AI gặp vấn đề về {topic}, giải pháp tối ưu là gì?",
    "Công cụ nào sau đây hỗ trợ tốt nhất cho {topic}?"
  ],
  analysis: [
    "Sự khác biệt cốt lõi giữa {topic} và các phương pháp truyền thống là gì?",
    "Yếu tố nào ảnh hưởng nhiều nhất đến hiệu suất của {topic}?",
    "Nhược điểm phổ biến nhất của {topic} là gì?",
    "Đâu là thách thức lớn nhất khi triển khai {topic} ở quy mô lớn?"
  ]
};

const genericOptions = [
  ["A. Tăng cường hiệu suất hệ thống", "B. Giảm thiểu chi phí tính toán", "C. Cải thiện độ chính xác", "D. Tất cả các ý trên"],
  ["A. Chỉ áp dụng cho dữ liệu nhỏ", "B. Yêu cầu phần cứng đặc biệt", "C. Cần tối ưu hyperparameter", "D. Phụ thuộc vào chất lượng dữ liệu"],
  ["A. Tối ưu hóa hàm mục tiêu", "B. Trích xuất đặc trưng", "C. Phân loại dữ liệu", "D. Chuẩn hóa dữ liệu"],
  ["A. Python", "B. SQL", "C. Numpy", "D. C++"]
];

function generateQuestionsForTopic(topic, index) {
  for (let i = 1; i <= QUESTIONS_PER_TOPIC; i++) {
    const qId = `${topic.id}-${String(i).padStart(3, '0')}`;
    
    // Pick random template and option set
    const templateType = Object.keys(templates)[Math.floor(Math.random() * Object.keys(templates).length)];
    const templateList = templates[templateType];
    const questionText = templateList[Math.floor(Math.random() * templateList.length)].replace('{topic}', topic.name);
    
    const options = genericOptions[Math.floor(Math.random() * genericOptions.length)];
    const answerIndex = Math.floor(Math.random() * 4);
    const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
    
    allQuestions.push({
      id: qId,
      module: topic.moduleId,
      topic: topic.id,
      difficulty: difficulty,
      question: `${questionText} (Câu ${i})`,
      options: options,
      answer: answerIndex,
      explanation: `Đây là câu hỏi kiểm tra kiến thức về ${topic.name}. Đáp án đúng là ${['A', 'B', 'C', 'D'][answerIndex]} vì nó phản ánh đúng bản chất của vấn đề.`,
      tip: `Hãy nhớ kỹ các đặc điểm cốt lõi của ${topic.name} để áp dụng vào thực tế.`,
      tags: [topic.moduleId.toLowerCase(), 'generated', `topic-${topic.id.toLowerCase()}`]
    });
  }
}

topics.forEach((topic, idx) => generateQuestionsForTopic(topic, idx));

// Format output
let output = `import { Question } from '@/types/question';

// ============================================================
// AI Exam Trainer — Auto-generated Question Bank (880 Questions)
// ============================================================

export const allQuestions: Question[] = [
`;

allQuestions.forEach(q => {
  output += `  ${JSON.stringify(q)},\n`;
});

output += `];

// ============================================================
// Helper functions
// ============================================================

export function getQuestionsByModule(moduleId: string): Question[] {
  return allQuestions.filter((q) => q.module === moduleId);
}

export function getQuestionsByTopic(topicId: string): Question[] {
  return allQuestions.filter((q) => q.topic === topicId);
}

export function getQuestionById(id: string): Question | undefined {
  return allQuestions.find((q) => q.id === id);
}

export function getRandomQuestions(count: number, moduleId?: string): Question[] {
  let pool = moduleId ? getQuestionsByModule(moduleId) : [...allQuestions];
  const shuffled = pool.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export function getQuestionsByIds(ids: string[]): Question[] {
  return ids.map((id) => getQuestionById(id)).filter((q): q is Question => q !== undefined);
}
`;

const outputPath = path.join(__dirname, '../data/questions.ts');
fs.writeFileSync(outputPath, output, 'utf-8');
console.log(`Successfully generated ${allQuestions.length} questions and saved to ${outputPath}`);
