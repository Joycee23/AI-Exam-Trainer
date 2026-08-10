// ============================================================
// AI Exam Trainer — Cheat Sheet Data
// ============================================================

import { CheatSheetModule } from '@/types/question';

export const cheatSheetData: CheatSheetModule[] = [
  {
    moduleId: 'A',
    moduleName: 'Toán học & Tư duy định lượng',
    sections: [
      {
        title: 'Linear Algebra',
        items: [
          { label: 'L2 Norm', formula: '||v||₂ = √(Σvᵢ²)', description: 'Độ dài vector = khoảng cách Euclid từ gốc tọa độ' },
          { label: 'L1 Norm', formula: '||v||₁ = Σ|vᵢ|', description: 'Tổng giá trị tuyệt đối các phần tử (Manhattan distance)' },
          { label: 'Dot Product', formula: 'a·b = Σaᵢbᵢ = |a||b|cosθ', description: 'Tích vô hướng. Vuông góc → a·b = 0' },
          { label: 'Cross Product', formula: 'a×b = |a||b|sinθ·n̂', description: 'Chỉ trong 3D. Kết quả là vector vuông góc với cả a và b' },
          { label: 'Orthogonal', formula: 'a·b = 0', description: 'Hai vector vuông góc khi dot product = 0' },
          { label: 'Invertible Matrix', formula: 'det(A) ≠ 0', description: 'Ma trận khả nghịch ⟺ det ≠ 0 ⟺ full rank ⟺ ∃ A⁻¹' },
          { label: 'Rank', formula: 'rank(A) = # linearly independent rows/cols', description: 'Số hàng/cột độc lập tuyến tính' },
          { label: 'Transpose', formula: '(AB)ᵀ = BᵀAᵀ', description: 'Transpose đổi hàng ↔ cột. Lưu ý thứ tự đảo khi nhân' },
          { label: 'Identity Matrix', formula: 'AI = IA = A', description: '1 trên đường chéo chính, 0 ở vị trí khác' },
          { label: 'Trace', formula: 'tr(A) = Σaᵢᵢ = Σλᵢ', description: 'Tổng đường chéo = Tổng eigenvalues' },
          { label: 'Determinant', formula: 'det(A) = Πλᵢ', description: 'Tích eigenvalues. det = 0 → singular (không khả nghịch)' },
        ],
      },
      {
        title: 'Eigenvalues & Decomposition',
        items: [
          { label: 'Eigenvalue Equation', formula: 'Av = λv', description: 'v là eigenvector, λ là eigenvalue' },
          { label: 'Characteristic Eq', formula: 'det(A - λI) = 0', description: 'Giải phương trình này để tìm eigenvalues' },
          { label: 'SVD', formula: 'A = UΣVᵀ', description: 'U: left singular vectors, Σ: singular values, Vᵀ: right singular vectors' },
          { label: 'PCA', formula: 'eigenvectors of covariance matrix', description: 'Giảm chiều dữ liệu. Giữ các principal components có variance lớn nhất' },
        ],
      },
      {
        title: 'Xác suất',
        items: [
          { label: 'Bayes Theorem', formula: 'P(A|B) = P(B|A)·P(A) / P(B)', description: 'Đảo ngược xác suất có điều kiện' },
          { label: 'Union', formula: 'P(A∪B) = P(A) + P(B) - P(A∩B)', description: 'Xung khắc: P(A∩B) = 0' },
          { label: 'Independent', formula: 'P(A∩B) = P(A)·P(B)', description: 'A, B độc lập khi xảy ra cùng lúc = tích' },
          { label: 'Conditional', formula: 'P(A|B) = P(A∩B) / P(B)', description: 'Xác suất A xảy ra khi biết B đã xảy ra' },
          { label: 'Expectation', formula: 'E[X] = Σxᵢ·P(xᵢ)', description: 'Giá trị trung bình kỳ vọng' },
          { label: 'Variance', formula: 'Var(X) = E[(X-μ)²] = E[X²] - (E[X])²', description: 'Đo độ phân tán quanh trung bình' },
        ],
      },
      {
        title: 'Giải tích & Tối ưu hóa',
        items: [
          { label: 'Power Rule', formula: 'd/dx(xⁿ) = nxⁿ⁻¹', description: 'Quy tắc đạo hàm lũy thừa' },
          { label: 'Chain Rule', formula: 'd/dx f(g(x)) = f\'(g(x))·g\'(x)', description: 'Đạo hàm hàm hợp. Nền tảng backpropagation' },
          { label: 'Gradient Descent', formula: 'θ = θ - α∇J(θ)', description: 'Cập nhật tham số ngược hướng gradient' },
          { label: 'Learning Rate', formula: 'α (alpha)', description: 'Quá lớn → overshooting. Quá nhỏ → hội tụ chậm' },
          { label: 'Convex Function', formula: 'f\'\'(x) ≥ 0', description: 'Hàm lồi. Mọi local minimum = global minimum' },
        ],
      },
    ],
  },
  {
    moduleId: 'B',
    moduleName: 'Lập trình & Xử lý dữ liệu',
    sections: [
      {
        title: 'Python Essentials',
        items: [
          { label: 'List Comprehension', formula: '[expr for x in iter if cond]', description: 'Tạo list ngắn gọn' },
          { label: 'Negative Index', formula: 'a[-1] = last element', description: '-1: cuối, -2: áp cuối' },
          { label: 'Slicing', formula: 'a[start:stop:step]', description: 'start inclusive, stop exclusive' },
          { label: 'Mutable', formula: 'list, dict, set', description: 'Thay đổi được sau khi tạo' },
          { label: 'Immutable', formula: 'int, float, str, tuple, frozenset', description: 'Không thay đổi được' },
          { label: 'Deep Copy', formula: 'import copy; copy.deepcopy(obj)', description: 'Copy toàn bộ nested objects' },
          { label: '*args', formula: 'def f(*args)', description: 'Nhận tuple các positional arguments' },
          { label: '**kwargs', formula: 'def f(**kwargs)', description: 'Nhận dict các keyword arguments' },
        ],
      },
      {
        title: 'Data Structures & Algorithms',
        items: [
          { label: 'Stack', formula: 'LIFO — push/pop', description: 'Last In First Out' },
          { label: 'Queue', formula: 'FIFO — enqueue/dequeue', description: 'First In First Out' },
          { label: 'Binary Search', formula: 'O(log n)', description: 'Yêu cầu sorted array' },
          { label: 'Hash Table', formula: 'O(1) average lookup', description: 'Python dict = hash table' },
          { label: 'Sorting', formula: 'O(n log n) — Merge/Quick/Tim', description: 'Python sort = Timsort' },
          { label: 'BFS', formula: 'Queue — level-by-level', description: 'Tìm đường ngắn nhất (unweighted)' },
          { label: 'DFS', formula: 'Stack/recursion — depth-first', description: 'Topological sort, cycle detection' },
        ],
      },
      {
        title: 'SQL Essentials',
        items: [
          { label: 'Query Order', formula: 'SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY → LIMIT', description: 'Thứ tự viết (khác execution order)' },
          { label: 'JOIN Types', formula: 'INNER, LEFT, RIGHT, FULL OUTER, CROSS', description: 'INNER: chỉ match. LEFT: giữ tất cả bên trái' },
          { label: 'Aggregate', formula: 'COUNT, SUM, AVG, MIN, MAX', description: 'Dùng với GROUP BY' },
          { label: 'Window Function', formula: 'ROW_NUMBER(), RANK(), LAG(), LEAD()', description: 'Tính toán trên partition mà không group' },
        ],
      },
    ],
  },
  {
    moduleId: 'C',
    moduleName: 'AI & Machine Learning',
    sections: [
      {
        title: 'Supervised vs Unsupervised',
        items: [
          { label: 'Supervised', formula: 'Input X + Label Y → Model', description: 'Classification (discrete) + Regression (continuous)' },
          { label: 'Unsupervised', formula: 'Input X (no label) → Pattern', description: 'Clustering, Dimensionality Reduction, Anomaly Detection' },
          { label: 'Semi-supervised', formula: 'Few labels + Many unlabeled', description: 'Kết hợp supervised + unsupervised' },
        ],
      },
      {
        title: 'Model Evaluation',
        items: [
          { label: 'Accuracy', formula: '(TP + TN) / Total', description: 'Không tốt cho imbalanced data' },
          { label: 'Precision', formula: 'TP / (TP + FP)', description: '"Predict Positive, bao nhiêu đúng?"' },
          { label: 'Recall', formula: 'TP / (TP + FN)', description: '"Actual Positive, tìm được bao nhiêu?"' },
          { label: 'F1 Score', formula: '2·P·R / (P + R)', description: 'Harmonic mean of Precision & Recall' },
          { label: 'AUC-ROC', formula: 'Area Under ROC Curve', description: 'ROC: TPR vs FPR. AUC = 1: perfect. AUC = 0.5: random' },
          { label: 'Cross Validation', formula: 'K-Fold: chia data thành K phần', description: 'Train trên K-1 phần, test trên 1 phần. Lặp K lần' },
        ],
      },
      {
        title: 'Deep Learning',
        items: [
          { label: 'ReLU', formula: 'f(x) = max(0, x)', description: 'Nhanh, tránh vanishing gradient. Vấn đề: dying ReLU' },
          { label: 'Sigmoid', formula: 'f(x) = 1 / (1 + e⁻ˣ)', description: 'Output [0,1]. Dùng cho binary classification output' },
          { label: 'Softmax', formula: 'eᶻⁱ / Σeᶻʲ', description: 'Output probability distribution. Dùng cho multi-class' },
          { label: 'Backpropagation', formula: 'Chain Rule + Gradient Descent', description: 'Tính gradient layer by layer từ output → input' },
          { label: 'Dropout', formula: 'Randomly zero out neurons (p=0.5)', description: 'Regularization. Chỉ dùng khi training' },
          { label: 'Batch Normalization', formula: 'Normalize activations per batch', description: 'Stabilize training, faster convergence' },
          { label: 'CNN', formula: 'Conv → Pool → FC', description: 'Feature extraction từ spatial data (images)' },
          { label: 'RNN/LSTM', formula: 'Sequential data processing', description: 'LSTM giải quyết vanishing gradient cho sequences' },
          { label: 'Transformer', formula: 'Self-Attention + FFN', description: 'Parallel processing. Foundation of GPT, BERT' },
        ],
      },
      {
        title: 'Generative AI & LLMs',
        items: [
          { label: 'Attention', formula: 'Attention(Q,K,V) = softmax(QKᵀ/√dₖ)V', description: 'Scaled dot-product attention' },
          { label: 'Temperature', formula: 'T=0: greedy, T↑: random', description: 'Kiểm soát mức độ "creative" của output' },
          { label: 'Top-k / Top-p', formula: 'Sampling strategy', description: 'Top-k: chọn từ k tokens. Top-p: chọn tokens tích lũy p%' },
          { label: 'Fine-tuning', formula: 'Pretrained model + Task-specific data', description: 'Adapt LLM cho task cụ thể' },
          { label: 'RAG', formula: 'Retrieval + Generation', description: 'Retrieve relevant docs → generate answer with context' },
          { label: 'Prompt Engineering', formula: 'Zero-shot / Few-shot / CoT', description: 'Chain-of-Thought: "Let\'s think step by step"' },
        ],
      },
    ],
  },
  {
    moduleId: 'D',
    moduleName: 'Tư duy, Đạo đức & Quản trị AI',
    sections: [
      {
        title: 'AI Ethics — FATE',
        items: [
          { label: 'Fairness', formula: 'No discrimination', description: 'Model không thiên vị nhóm nào' },
          { label: 'Accountability', formula: 'Clear responsibility', description: 'Ai chịu trách nhiệm khi AI sai?' },
          { label: 'Transparency', formula: 'Open process', description: 'Quy trình phát triển & quyết định minh bạch' },
          { label: 'Explainability', formula: 'Interpretable decisions', description: 'Giải thích được tại sao AI đưa ra quyết định' },
        ],
      },
      {
        title: 'Bias & Fairness',
        items: [
          { label: 'Demographic Parity', formula: 'P(Ŷ=1|G=a) = P(Ŷ=1|G=b)', description: 'Tỷ lệ positive prediction bằng nhau giữa các nhóm' },
          { label: 'Equal Opportunity', formula: 'TPR equal across groups', description: 'True Positive Rate bằng nhau' },
          { label: 'Equalized Odds', formula: 'TPR & FPR equal', description: 'Cả TPR và FPR bằng nhau' },
          { label: 'Sources of Bias', formula: 'Data → Model → Deployment', description: 'Historical, representation, measurement, aggregation bias' },
        ],
      },
      {
        title: 'Privacy & Safety',
        items: [
          { label: 'Differential Privacy', formula: 'Add calibrated noise', description: 'Bảo vệ cá nhân trong dataset' },
          { label: 'Federated Learning', formula: 'Train on device, share gradients', description: 'Không cần centralize data' },
          { label: 'Adversarial Attack', formula: 'Input + ε → Wrong prediction', description: 'Perturbation nhỏ đánh lừa model' },
          { label: 'Model Poisoning', formula: 'Corrupt training data', description: 'Attacker chèn data xấu vào training set' },
        ],
      },
      {
        title: 'AI Regulation',
        items: [
          { label: 'EU AI Act', formula: 'Minimal → Limited → High → Unacceptable', description: '4 risk levels. High-risk cần conformity assessment' },
          { label: 'GDPR', formula: 'Right to explanation', description: 'EU: quyền được giải thích quyết định tự động' },
          { label: 'Model Card', formula: 'Model documentation standard', description: 'Purpose, data, performance, limitations, ethics' },
          { label: 'Data Sheet', formula: 'Dataset documentation', description: 'Collection method, demographics, preprocessing, biases' },
        ],
      },
      {
        title: 'Logic & Critical Thinking',
        items: [
          { label: 'Modus Ponens', formula: 'A→B, A ⊢ B', description: 'Nếu A thì B. A đúng. Vậy B đúng.' },
          { label: 'Modus Tollens', formula: 'A→B, ¬B ⊢ ¬A', description: 'Nếu A thì B. B sai. Vậy A sai.' },
          { label: 'Contrapositive', formula: 'A→B ≡ ¬B→¬A', description: 'Phản đảo luôn tương đương mệnh đề gốc' },
          { label: 'Material Implication', formula: 'A→B ≡ ¬A∨B', description: 'Nếu A thì B ≡ Không A hoặc B' },
          { label: 'Hasty Generalization', formula: 'Small sample → General conclusion', description: 'Kết luận từ mẫu quá nhỏ' },
          { label: 'Ad Hominem', formula: 'Attack person, not argument', description: 'Tấn công cá nhân thay vì lý luận' },
        ],
      },
    ],
  },
];
