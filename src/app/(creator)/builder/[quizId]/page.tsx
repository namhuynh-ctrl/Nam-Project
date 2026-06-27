"use client";

import { useState, useEffect, use, Suspense } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { 
  ArrowLeft, 
  Save, 
  Send, 
  Plus, 
  Trash2, 
  CheckCircle, 
  HelpCircle,
  FileText,
  UploadCloud,
  Sparkles,
  Loader2,
  Check,
  AlertCircle,
  Clock,
  Eye,
  Smartphone,
  X,
  ArrowRight,
  Award
} from "lucide-react";
import dummyQuizzes from "@/mocks/dummy_quizzes.json";
import dummyQuestionsData from "@/mocks/dummy_questions.json";
import { Quiz, Question, Answer, QuestionType } from "@/types";

function BuilderContent() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const quizId = params.quizId as string;
  const isAiDefault = searchParams.get("ai") === "true";

  const [quiz, setQuiz] = useState<Quiz>({
    id: "",
    creator_id: "creator-1",
    title: "",
    timer_minutes: 10,
    status: "draft"
  });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
  
  // AI Mock states
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiFileName, setAiFileName] = useState<string | null>(null);
  const [showAiToast, setShowAiToast] = useState(false);

  // Preview states
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewQuestionIdx, setPreviewQuestionIdx] = useState(0);
  const [previewAnswers, setPreviewAnswers] = useState<Record<string, string>>({});
  const [previewScore, setPreviewScore] = useState<number | null>(null);

  const handleStartPreview = () => {
    if (questions.length === 0) {
      alert("Đề thi phải có ít nhất 1 câu hỏi để xem trước!");
      return;
    }
    setPreviewQuestionIdx(0);
    setPreviewAnswers({});
    setPreviewScore(null);
    setIsPreviewOpen(true);
  };

  // Load initial data
  useEffect(() => {
    if (quizId === "new") {
      setQuiz({
        id: `quiz-${Date.now()}`,
        creator_id: "creator-1",
        title: "Bộ câu hỏi mới chưa đặt tên",
        timer_minutes: 15,
        status: "draft"
      });
      // Start with 1 default question
      const newQuestionId = `q-${Date.now()}-1`;
      setQuestions([
        {
          id: newQuestionId,
          quiz_id: "",
          type: "multiple_choice",
          content: "Câu hỏi trắc nghiệm số 1 của bạn?",
          points: 5,
          answers: [
            { id: `a-${Date.now()}-1`, question_id: newQuestionId, content: "Lựa chọn A", is_correct: true },
            { id: `a-${Date.now()}-2`, question_id: newQuestionId, content: "Lựa chọn B", is_correct: false },
            { id: `a-${Date.now()}-3`, question_id: newQuestionId, content: "Lựa chọn C", is_correct: false },
            { id: `a-${Date.now()}-4`, question_id: newQuestionId, content: "Lựa chọn D", is_correct: false }
          ]
        }
      ]);
      setActiveQuestionId(newQuestionId);
    } else {
      const existingQuiz = dummyQuizzes.find(q => q.id === quizId);
      if (existingQuiz) {
        setQuiz(existingQuiz as Quiz);
      }
      
      const existingQuestions = (dummyQuestionsData as Record<string, Question[]>)[quizId];
      if (existingQuestions) {
        setQuestions(existingQuestions);
        if (existingQuestions.length > 0) {
          setActiveQuestionId(existingQuestions[0].id);
        }
      }
    }
  }, [quizId]);

  // Edit quiz metadata
  const handleQuizMetaChange = (key: keyof Quiz, value: any) => {
    setQuiz(prev => ({ ...prev, [key]: value }));
  };

  // Add new question manual
  const handleAddQuestion = (type: QuestionType = "multiple_choice") => {
    const newId = `q-${Date.now()}`;
    const newQuestion: Question = {
      id: newId,
      quiz_id: quiz.id,
      type: type,
      content: type === "multiple_choice" ? "Câu hỏi trắc nghiệm mới?" : "Phát biểu đúng hay sai?",
      points: 5,
      answers: type === "multiple_choice" ? [
        { id: `a-${Date.now()}-1`, question_id: newId, content: "Lựa chọn A", is_correct: true },
        { id: `a-${Date.now()}-2`, question_id: newId, content: "Lựa chọn B", is_correct: false },
        { id: `a-${Date.now()}-3`, question_id: newId, content: "Lựa chọn C", is_correct: false },
        { id: `a-${Date.now()}-4`, question_id: newId, content: "Lựa chọn D", is_correct: false }
      ] : [
        { id: `a-${Date.now()}-1`, question_id: newId, content: "Đúng (True)", is_correct: true },
        { id: `a-${Date.now()}-2`, question_id: newId, content: "Sai (False)", is_correct: false }
      ]
    };
    
    setQuestions([...questions, newQuestion]);
    setActiveQuestionId(newId);
  };

  // Delete question
  const handleDeleteQuestion = (id: string) => {
    if (questions.length <= 1) {
      alert("Bộ đề thi phải có ít nhất 1 câu hỏi.");
      return;
    }
    const newQuestions = questions.filter(q => q.id !== id);
    setQuestions(newQuestions);
    if (activeQuestionId === id) {
      setActiveQuestionId(newQuestions[0].id);
    }
  };

  // Edit question content
  const handleQuestionChange = (id: string, field: keyof Question, value: any) => {
    setQuestions(questions.map(q => {
      if (q.id === id) {
        // If type changes, adjust answers
        if (field === "type") {
          const type = value as QuestionType;
          const answers = type === "multiple_choice" ? [
            { id: `a-${Date.now()}-1`, question_id: id, content: "Lựa chọn A", is_correct: true },
            { id: `a-${Date.now()}-2`, question_id: id, content: "Lựa chọn B", is_correct: false },
            { id: `a-${Date.now()}-3`, question_id: id, content: "Lựa chọn C", is_correct: false },
            { id: `a-${Date.now()}-4`, question_id: id, content: "Lựa chọn D", is_correct: false }
          ] : [
            { id: `a-${Date.now()}-1`, question_id: id, content: "Đúng (True)", is_correct: true },
            { id: `a-${Date.now()}-2`, question_id: id, content: "Sai (False)", is_correct: false }
          ];
          return { ...q, type, answers };
        }
        return { ...q, [field]: value };
      }
      return q;
    }));
  };

  // Edit answer text or is_correct status
  const handleAnswerChange = (qId: string, aId: string, field: "content" | "is_correct", value: any) => {
    setQuestions(questions.map(q => {
      if (q.id === qId) {
        const answers = q.answers.map(a => {
          if (a.id === aId) {
            return { ...a, [field]: value };
          }
          // If we set this answer to correct, and it is a single-choice answer list, make others incorrect
          if (field === "is_correct" && value === true) {
            return { ...a, is_correct: false };
          }
          return a;
        });
        return { ...q, answers };
      }
      return q;
    }));
  };

  // Mock AI PDF Upload action
  const handleAiUploadMock = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAiFileName(file.name);
    setIsAiLoading(true);

    // Simulated Gemini extraction logic (PRD requirement: loads within 10s)
    setTimeout(() => {
      setIsAiLoading(false);
      
      const newQuestionId1 = `q-ai-${Date.now()}-1`;
      const newQuestionId2 = `q-ai-${Date.now()}-2`;
      
      const aiQuestions: Question[] = [
        {
          id: newQuestionId1,
          quiz_id: quiz.id,
          type: "multiple_choice",
          content: `[AI] Theo nội dung trong tệp "${file.name}", tác nhân nào tác động trực tiếp và quan trọng nhất lên sự phát triển của công nghệ giáo dục hiện đại?`,
          points: 10,
          answers: [
            { id: `a-ai-${Date.now()}-1`, question_id: newQuestionId1, content: "Trí tuệ nhân tạo (AI)", is_correct: true },
            { id: `a-ai-${Date.now()}-2`, question_id: newQuestionId1, content: "Sách giáo khoa in ấn", is_correct: false },
            { id: `a-ai-${Date.now()}-3`, question_id: newQuestionId1, content: "Bảng đen viết phấn truyền thống", is_correct: false }
          ]
        },
        {
          id: newQuestionId2,
          quiz_id: quiz.id,
          type: "true_false",
          content: `[AI] Đúng hay Sai: Việc tối giản hóa các bước đăng nhập của học sinh (Zero-friction) giúp nâng cao tỷ lệ hoàn thành bài kiểm tra lên trên 30%?`,
          points: 10,
          answers: [
            { id: `a-ai-${Date.now()}-4`, question_id: newQuestionId2, content: "Đúng (True)", is_correct: true },
            { id: `a-ai-${Date.now()}-5`, question_id: newQuestionId2, content: "Sai (False)", is_correct: false }
          ]
        }
      ];

      setQuestions(prev => [...prev, ...aiQuestions]);
      setActiveQuestionId(newQuestionId1);
      setShowAiToast(true);
      setTimeout(() => setShowAiToast(false), 4000);
    }, 3000); // 3 seconds demo delay
  };

  // Save Quiz handler
  const handleSaveQuiz = (status: "draft" | "published") => {
    // Validate
    if (!quiz.title.trim()) {
      alert("Vui lòng điền tiêu đề cho đề thi!");
      return;
    }
    
    // Check if all questions have at least one correct answer
    const invalidQuestion = questions.find(q => !q.answers.some(a => a.is_correct));
    if (invalidQuestion) {
      alert(`Câu hỏi "${invalidQuestion.content.substring(0, 30)}..." chưa chọn đáp án đúng!`);
      return;
    }

    setQuiz(prev => ({ ...prev, status }));
    alert(status === "published" 
      ? `Đã xuất bản đề thi "${quiz.title}" thành công! Lấy link chia sẻ tại Dashboard.` 
      : "Đã lưu nháp đề thi thành công!"
    );
    router.push("/dashboard");
  };

  // Find currently active question
  const activeQuestion = questions.find(q => q.id === activeQuestionId);

  return (
    <div className="min-h-screen bg-bg-base text-text-primary flex flex-col font-sans">
      {/* Top Header Bar */}
      <header className="glass-panel sticky top-0 z-20 border-b border-border-subtle px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="p-2 hover:bg-bg-hover rounded-standard text-text-muted hover:text-text-primary transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex flex-col">
            <input 
              type="text" 
              value={quiz.title}
              onChange={(e) => handleQuizMetaChange("title", e.target.value)}
              placeholder="Nhập tiêu đề quiz..."
              className="bg-transparent border-b border-transparent hover:border-border-subtle focus:border-primary focus:outline-none text-lg font-bold text-text-primary py-0.5 max-w-sm sm:max-w-md transition-all"
            />
            <div className="flex items-center gap-4 mt-1 text-xs text-text-secondary">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Thời gian:</span>
                <input 
                  type="number" 
                  value={quiz.timer_minutes}
                  onChange={(e) => handleQuizMetaChange("timer_minutes", parseInt(e.target.value) || 1)}
                  className="w-12 bg-bg-surface border border-border-subtle rounded px-1.5 py-0.5 text-center text-text-primary focus:outline-none focus:border-primary"
                  min="1"
                />
                <span>phút</span>
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-border-subtle" />
              <span>Trạng thái hiện tại: <strong className="capitalize">{quiz.status === "published" ? "Đã Xuất Bản" : "Nháp"}</strong></span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={handleStartPreview}
            className="inline-flex items-center gap-1.5 py-2 px-4 rounded-standard bg-bg-surface hover:bg-bg-hover text-text-primary border border-border-subtle font-medium text-sm transition-all focus-ring cursor-pointer"
          >
            <Eye className="w-4 h-4 text-primary" />
            <span className="hidden sm:inline">Xem trước</span>
          </button>
          <button 
            onClick={() => handleSaveQuiz("draft")}
            className="inline-flex items-center gap-1.5 py-2 px-4 rounded-standard bg-bg-surface hover:bg-bg-hover text-text-primary border border-border-subtle font-medium text-sm transition-all focus-ring"
          >
            <Save className="w-4 h-4" />
            <span className="hidden sm:inline">Lưu nháp</span>
          </button>
          <button 
            onClick={() => handleSaveQuiz("published")}
            className="inline-flex items-center gap-1.5 py-2 px-4 rounded-standard bg-primary hover:bg-primary-hover text-white font-medium text-sm transition-all focus-ring shadow-lg shadow-primary/20"
          >
            <Send className="w-4 h-4" />
            <span>Xuất bản</span>
          </button>
        </div>
      </header>

      {/* Main Grid Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 overflow-hidden relative">
        {/* Toast Notification for AI success */}
        {showAiToast && (
          <div className="absolute top-4 right-4 z-50 bg-bg-card border border-success/30 rounded-card p-4 flex items-center gap-3 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="w-8 h-8 rounded-full bg-success/15 text-success flex items-center justify-center">
              <Check className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-text-primary">Trích xuất AI hoàn tất!</h4>
              <p className="text-xs text-text-secondary">Đã tự động thêm 2 câu hỏi vào đề thi của bạn.</p>
            </div>
          </div>
        )}

        {/* 1. Left Sidebar: Questions Navigation List */}
        <aside className="border-r border-border-subtle bg-bg-surface flex flex-col justify-between overflow-y-auto lg:h-[calc(100vh-77px)]">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Danh sách câu hỏi</span>
              <span className="text-xs text-text-muted">{questions.length} câu</span>
            </div>

            <div className="space-y-2">
              {questions.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => setActiveQuestionId(q.id)}
                  className={`w-full text-left p-3 rounded-standard text-sm flex items-start gap-3 transition-all ${
                    activeQuestionId === q.id 
                      ? "bg-primary/10 border border-primary/30 text-primary" 
                      : "bg-bg-base/40 border border-transparent hover:bg-bg-hover text-text-secondary"
                  }`}
                >
                  <span className="font-bold shrink-0">{idx + 1}.</span>
                  <span className="line-clamp-2 leading-tight flex-1">{q.content || "(Câu hỏi chưa nhập nội dung)"}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 border-t border-border-subtle bg-bg-surface sticky bottom-0 flex gap-2">
            <button 
              onClick={() => handleAddQuestion("multiple_choice")}
              className="flex-1 py-2 px-3 rounded-standard bg-bg-base hover:bg-bg-hover border border-border-subtle hover:border-text-secondary text-xs font-medium text-text-primary transition-all flex items-center justify-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Trắc nghiệm</span>
            </button>
            <button 
              onClick={() => handleAddQuestion("true_false")}
              className="flex-1 py-2 px-3 rounded-standard bg-bg-base hover:bg-bg-hover border border-border-subtle hover:border-text-secondary text-xs font-medium text-text-primary transition-all flex items-center justify-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Đúng/Sai</span>
            </button>
          </div>
        </aside>

        {/* 2. Center Panel: Question Editor */}
        <main className="col-span-2 p-6 overflow-y-auto lg:h-[calc(100vh-77px)]">
          {activeQuestion ? (
            <div className="max-w-xl mx-auto space-y-6">
              {/* Question Meta Row */}
              <div className="flex items-center justify-between border-b border-border-subtle/30 pb-4">
                <h3 className="font-semibold text-lg">Chỉnh sửa câu hỏi</h3>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 text-xs text-text-secondary">
                    <span>Điểm:</span>
                    <input 
                      type="number" 
                      value={activeQuestion.points}
                      onChange={(e) => handleQuestionChange(activeQuestion.id, "points", parseInt(e.target.value) || 1)}
                      className="w-10 bg-bg-surface border border-border-subtle rounded px-1.5 py-0.5 text-center text-text-primary focus:outline-none focus:border-primary"
                    />
                  </span>
                  <button 
                    onClick={() => handleDeleteQuestion(activeQuestion.id)}
                    className="p-1.5 text-text-muted hover:text-danger hover:bg-danger/10 rounded transition-all"
                    title="Xóa câu hỏi này"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Question Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-secondary block">Nội dung câu hỏi</label>
                <textarea
                  value={activeQuestion.content}
                  onChange={(e) => handleQuestionChange(activeQuestion.id, "content", e.target.value)}
                  placeholder="Nhập nội dung câu hỏi tại đây..."
                  rows={4}
                  className="w-full bg-bg-surface border border-border-subtle rounded-card p-4 text-sm text-text-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all leading-relaxed focus-ring"
                />
              </div>

              {/* Question Type Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-secondary block">Dạng câu hỏi</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleQuestionChange(activeQuestion.id, "type", "multiple_choice")}
                    className={`py-3 px-4 border rounded-card text-left transition-all ${
                      activeQuestion.type === "multiple_choice" 
                        ? "bg-primary/5 border-primary text-text-primary" 
                        : "bg-bg-surface border-border-subtle text-text-secondary hover:bg-bg-hover"
                    }`}
                  >
                    <div className="font-semibold text-sm">Trắc nghiệm</div>
                    <div className="text-xs text-text-muted mt-0.5">Chọn 1 trong nhiều đáp án.</div>
                  </button>
                  <button
                    onClick={() => handleQuestionChange(activeQuestion.id, "type", "true_false")}
                    className={`py-3 px-4 border rounded-card text-left transition-all ${
                      activeQuestion.type === "true_false" 
                        ? "bg-primary/5 border-primary text-text-primary" 
                        : "bg-bg-surface border-border-subtle text-text-secondary hover:bg-bg-hover"
                    }`}
                  >
                    <div className="font-semibold text-sm">Đúng / Sai</div>
                    <div className="text-xs text-text-muted mt-0.5">Lựa chọn khẳng định Đúng/Sai.</div>
                  </button>
                </div>
              </div>

              {/* Answers Options */}
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-text-secondary block">Các phương án trả lời</label>
                  <span className="text-[10px] text-text-muted italic">* Bấm tích tròn để đánh dấu đáp án đúng</span>
                </div>
                
                <div className="space-y-3">
                  {activeQuestion.answers.map((answer) => (
                    <div 
                      key={answer.id}
                      className={`flex items-center gap-3 p-3.5 border rounded-card bg-bg-surface transition-all ${
                        answer.is_correct 
                          ? "border-success/30 bg-success/5 shadow-inner" 
                          : "border-border-subtle"
                      }`}
                    >
                      {/* Check Correct Radio */}
                      <button
                        onClick={() => {
                          // Make this answer correct, reset others for this question
                          setQuestions(questions.map(q => {
                            if (q.id === activeQuestion.id) {
                              const answers = q.answers.map(a => ({
                                ...a,
                                is_correct: a.id === answer.id
                              }));
                              return { ...q, answers };
                            }
                            return q;
                          }));
                        }}
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                          answer.is_correct 
                            ? "bg-success border-success text-white scale-110 shadow-lg shadow-success/20" 
                            : "border-text-muted hover:border-text-secondary"
                        }`}
                      >
                        {answer.is_correct && <Check className="w-3.5 h-3.5" />}
                      </button>

                      {/* Answer content text input */}
                      <input 
                        type="text" 
                        value={answer.content}
                        onChange={(e) => handleAnswerChange(activeQuestion.id, answer.id, "content", e.target.value)}
                        placeholder="Nhập nội dung câu trả lời..."
                        className="flex-1 bg-transparent border-none text-sm text-text-primary placeholder-text-muted focus:outline-none focus:ring-0 py-0.5"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center text-text-muted">
              <HelpCircle className="w-12 h-12 mb-3" />
              <p>Chọn hoặc thêm câu hỏi mới để bắt đầu chỉnh sửa</p>
            </div>
          )}
        </main>

        {/* 3. Right Panel: AI Gemini Assistant Simulator */}
        <aside className="border-l border-border-subtle bg-bg-surface/50 p-6 overflow-y-auto lg:h-[calc(100vh-77px)] flex flex-col">
          <div className="flex-grow space-y-6">
            <div className="flex items-center gap-2 text-accent-magenta border-b border-border-subtle/30 pb-4">
              <Sparkles className="w-5 h-5 animate-pulse" />
              <h3 className="font-bold text-sm tracking-wide uppercase">AI Gemini Converter</h3>
            </div>

            <p className="text-xs text-text-secondary leading-relaxed">
              Trợ lý AI giúp trích xuất đề thi tự động. Hãy kéo thả hoặc tải lên tài liệu học thuật (PDF, DOCX, Ảnh bài tập) để Gemini tạo câu hỏi cho bạn.
            </p>

            {/* Simulated Drag & Drop Zone */}
            <div className="relative">
              <input 
                type="file" 
                accept=".pdf,.docx,.png,.jpg,.jpeg"
                onChange={handleAiUploadMock}
                disabled={isAiLoading}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10 disabled:cursor-not-allowed"
              />
              <div className="border-2 border-dashed border-border-subtle hover:border-accent-magenta/40 rounded-card p-6 flex flex-col items-center justify-center text-center bg-bg-base/30 transition-all">
                {isAiLoading ? (
                  <div className="flex flex-col items-center py-4">
                    <Loader2 className="w-8 h-8 text-accent-magenta animate-spin mb-3" />
                    <span className="text-xs font-semibold text-text-primary">Gemini đang phân tích...</span>
                    <span className="text-[10px] text-text-muted mt-1">Đọc tài liệu & sinh JSON (3s)</span>
                  </div>
                ) : aiFileName ? (
                  <div className="flex flex-col items-center">
                    <FileText className="w-8 h-8 text-primary mb-3" />
                    <span className="text-xs font-medium text-text-primary max-w-[180px] truncate" title={aiFileName}>
                      {aiFileName}
                    </span>
                    <span className="text-[10px] text-success mt-1.5 flex items-center gap-1 font-semibold">
                      <CheckCircle className="w-3.5 h-3.5" /> Trích xuất xong
                    </span>
                    <span className="text-[10px] text-text-muted mt-2 hover:underline">
                      Tải lên tệp khác
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-2">
                    <UploadCloud className="w-8 h-8 text-text-muted group-hover:text-text-secondary mb-3" />
                    <span className="text-xs font-medium text-text-primary">Tải tệp PDF, Ảnh đề thi lên</span>
                    <span className="text-[10px] text-text-muted mt-1.5">Tối đa 50MB</span>
                  </div>
                )}
              </div>
            </div>

            {/* Prompt settings box (visual only) */}
            <div className="glass-panel p-4 rounded-card border border-border-subtle bg-bg-surface">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-2">Prompt System AI</label>
              <div className="text-xs text-text-secondary italic leading-normal bg-bg-base/50 p-2.5 rounded border border-border-subtle/55">
                "Bạn là chuyên gia giáo dục. Hãy đọc tài liệu này và trích xuất các câu hỏi trắc nghiệm dưới dạng JSON..."
              </div>
            </div>
            
            {/* Security note */}
            <div className="flex items-start gap-2.5 p-3 rounded-card bg-primary/5 text-[10px] text-text-secondary leading-normal border border-primary/10">
              <AlertCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span>
                <strong>Bảo mật:</strong> Tài liệu upload sẽ được xóa ngay lập tức khỏi Storage sau khi AI phân tích xong để bảo vệ bản quyền.
              </span>
            </div>
          </div>

          <div className="text-[11px] text-text-muted text-center pt-4 border-t border-border-subtle/30">
            Powered by Gemini 1.5 Flash
          </div>
        </aside>
      </div>

      {/* 4. Teacher Preview Modal Overlay (Mobile Mockup Frame) */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="flex flex-col items-center gap-4">
            {/* Top Close bar */}
            <div className="flex items-center justify-between w-[360px] text-white">
              <div className="flex items-center gap-2 text-xs font-semibold text-text-secondary bg-bg-surface border border-border-subtle py-1 px-3 rounded-full">
                <Smartphone className="w-3.5 h-3.5" />
                <span>Xem trước: Chế độ di động</span>
              </div>
              <button 
                onClick={() => setIsPreviewOpen(false)}
                className="py-1 px-3 rounded-full bg-danger text-white text-xs font-semibold hover:bg-danger-hover transition-colors flex items-center gap-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Thoát</span>
              </button>
            </div>

            {/* Mobile Mockup Device Frame */}
            <div className="border-[8px] border-gray-800 rounded-[36px] w-[360px] h-[600px] bg-bg-base overflow-hidden flex flex-col justify-between shadow-2xl relative shadow-black/90">
              
              {/* Header inside Mobile Frame */}
              <div className="bg-bg-surface border-b border-border-subtle/50 px-4 py-3 flex items-center justify-between shrink-0">
                <span className="text-[10px] text-text-secondary font-bold truncate max-w-[140px]">
                  {quiz.title}
                </span>
                
                {/* Simulated Timer */}
                <span className="flex items-center gap-1 bg-primary/10 border border-primary/20 text-primary px-2 py-0.5 rounded-full font-mono text-[9px] font-semibold">
                  <Clock className="w-2.5 h-2.5" />
                  <span>{quiz.timer_minutes}:00</span>
                </span>
              </div>

              {/* Body inside Mobile Frame */}
              <div className="flex-1 overflow-y-auto p-4 flex flex-col justify-center bg-bg-base">
                {previewScore === null ? (
                  // Question content view
                  <div className="space-y-4">
                    {/* Progress */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[9px] text-text-secondary font-semibold">
                        <span>Câu hỏi {previewQuestionIdx + 1}/{questions.length}</span>
                        <span>Tiến độ: {Math.round(((previewQuestionIdx + 1) / questions.length) * 100)}%</span>
                      </div>
                      <div className="w-full h-1 bg-bg-surface rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary" 
                          style={{ width: `${((previewQuestionIdx + 1) / questions.length) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Question Card inside Frame */}
                    <div className="bg-bg-surface border border-border-subtle p-5 rounded-card space-y-4 shadow-sm">
                      <span className="text-[8px] font-bold text-text-muted uppercase tracking-wider">
                        Dạng: {questions[previewQuestionIdx].type === "multiple_choice" ? "Trắc nghiệm" : "Đúng/Sai"}
                      </span>
                      <h4 className="text-xs font-semibold text-text-primary leading-relaxed">
                        {questions[previewQuestionIdx].content}
                      </h4>

                      {/* Answers choices with verification */}
                      <div className="space-y-2.5">
                        {questions[previewQuestionIdx].answers.map((answer) => {
                          const chosenAId = previewAnswers[questions[previewQuestionIdx].id];
                          const isOptionSelected = chosenAId === answer.id;
                          const isOptionCorrect = answer.is_correct;

                          let choiceClass = "bg-bg-base border-border-subtle text-text-secondary hover:text-text-primary";
                          if (chosenAId) {
                            if (isOptionSelected) {
                              if (isOptionCorrect) {
                                choiceClass = "bg-success/15 border-success text-success font-semibold shadow-inner";
                              } else {
                                choiceClass = "bg-danger/15 border-danger text-danger font-semibold shadow-inner";
                              }
                            } else if (isOptionCorrect) {
                              // Highlight correct answer if wrong answer was clicked
                              choiceClass = "border-success/50 bg-bg-surface/50 text-text-primary border-dashed border-2";
                            }
                          }

                          return (
                            <button
                              key={answer.id}
                              onClick={() => {
                                setPreviewAnswers(prev => ({
                                  ...prev,
                                  [questions[previewQuestionIdx].id]: answer.id
                                }));
                              }}
                              className={`w-full text-left p-2.5 rounded-card border text-[11px] leading-snug flex items-center gap-2.5 transition-all ${choiceClass} cursor-pointer`}
                            >
                              <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 border text-[8px] ${
                                isOptionSelected && isOptionCorrect ? "bg-success border-success text-white animate-pulse" :
                                isOptionSelected && !isOptionCorrect ? "bg-danger border-danger text-white" :
                                !isOptionSelected && isOptionCorrect && chosenAId ? "border-success text-success" : "border-text-muted"
                              }`}>
                                {isOptionSelected && <Check className="w-2.5 h-2.5" />}
                              </div>
                              <span className="flex-1">{answer.content}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Navigation within preview frame */}
                    <div className="flex items-center justify-between gap-3 pt-1.5">
                      <button
                        disabled={previewQuestionIdx === 0}
                        onClick={() => setPreviewQuestionIdx(prev => prev - 1)}
                        className="py-1.5 px-3 rounded-standard bg-bg-surface disabled:opacity-40 border border-border-subtle text-[10px] font-medium text-text-primary flex items-center gap-1 cursor-pointer"
                      >
                        <ArrowLeft className="w-3 h-3" />
                        <span>Câu trước</span>
                      </button>

                      {previewQuestionIdx < questions.length - 1 ? (
                        <button
                          onClick={() => setPreviewQuestionIdx(prev => prev + 1)}
                          className="py-1.5 px-3 rounded-standard bg-bg-surface border border-border-subtle text-[10px] font-medium text-text-primary flex items-center gap-1 cursor-pointer"
                        >
                          <span>Câu sau</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            // Calculate score
                            let score = 0;
                            questions.forEach(q => {
                              const chosen = previewAnswers[q.id];
                              const correct = q.answers.find(a => a.is_correct);
                              if (chosen && correct && chosen === correct.id) {
                                score += q.points;
                              }
                            });
                            setPreviewScore(score);
                          }}
                          className="py-1.5 px-4 rounded-standard bg-success hover:bg-success-hover text-white text-[10px] font-bold flex items-center gap-1 cursor-pointer shadow"
                        >
                          <span>Nộp bài thử</span>
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  // Results view inside preview mockup
                  <div className="text-center space-y-4 py-4 animate-in zoom-in-95 duration-200">
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
                      <Award className="w-6 h-6" />
                    </div>
                    <div>
                      <h5 className="font-bold text-sm">Kết quả xem trước</h5>
                      <p className="text-[10px] text-text-secondary mt-0.5">Giả lập điểm số học sinh</p>
                    </div>

                    <div className="bg-bg-surface border border-border-subtle p-4 rounded-card max-w-[200px] mx-auto space-y-1">
                      <span className="text-3xl font-black text-primary">{previewScore}</span>
                      <span className="text-text-muted text-[10px] block">
                        Trên tổng {questions.reduce((sum, q) => sum + q.points, 0)} điểm
                      </span>
                    </div>

                    <div className="flex flex-col gap-2 pt-2 border-t border-border-subtle/30">
                      <button
                        onClick={() => {
                          setPreviewScore(null);
                          setPreviewQuestionIdx(0);
                          setPreviewAnswers({});
                        }}
                        className="w-full py-2 px-4 rounded-standard bg-bg-surface border border-border-subtle text-text-primary text-[10px] font-semibold hover:bg-bg-hover transition-all cursor-pointer"
                      >
                        Thi lại thử
                      </button>
                      <button
                        onClick={() => setIsPreviewOpen(false)}
                        className="w-full py-2 px-4 rounded-standard bg-primary text-white text-[10px] font-semibold hover:bg-primary-hover transition-all cursor-pointer"
                      >
                        Quay lại Sửa đề
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Home Indicator line of iOS mock */}
              <div className="h-6 bg-bg-surface border-t border-border-subtle/20 flex items-center justify-center shrink-0">
                <div className="w-24 h-1 bg-text-muted/30 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CreatorBuilder() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-bg-base text-text-primary flex flex-col items-center justify-center font-sans">
        <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
        <p className="text-xs text-text-secondary">Đang tải trình soạn thảo...</p>
      </div>
    }>
      <BuilderContent />
    </Suspense>
  );
}
