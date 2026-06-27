"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { 
  Clock, 
  User, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  AlertTriangle,
  Award,
  BookOpen,
  Home,
  ShieldAlert
} from "lucide-react";
import { useTimer } from "@/hooks/useTimer";
import dummyQuizzes from "@/mocks/dummy_quizzes.json";
import dummyQuestionsData from "@/mocks/dummy_questions.json";
import { Quiz, Question, Answer } from "@/types";

export default function ParticipantPlayer() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.sessionId as string;

  const [displayName, setDisplayName] = useState("Thí sinh");
  const [quizId, setQuizId] = useState("quiz-1");
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  
  const [currentIdx, setCurrentIdx] = useState(0);
  // Store participant answers: key is questionId, value is answerId
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [cheatAttempts, setCheatAttempts] = useState(0);
  const [showCheatWarning, setShowCheatWarning] = useState(false);
  const [finalScore, setFinalScore] = useState({ score: 0, maxPoints: 0, percentage: 0 });

  // Load session storage data
  useEffect(() => {
    const savedName = sessionStorage.getItem("display_name");
    const savedQuizId = sessionStorage.getItem("quiz_id");
    
    if (savedName) setDisplayName(savedName);
    if (savedQuizId) setQuizId(savedQuizId);

    const activeQuizId = savedQuizId || "quiz-1";
    const foundQuiz = dummyQuizzes.find(q => q.id === activeQuizId);
    if (foundQuiz) {
      setQuiz(foundQuiz as Quiz);
    }

    const foundQuestions = (dummyQuestionsData as Record<string, Question[]>)[activeQuizId];
    if (foundQuestions) {
      setQuestions(foundQuestions);
    }
  }, [quizId]);

  // Anti-cheat: Block Right-click, Copy, Paste, Focus out
  useEffect(() => {
    if (isSubmitted) return;

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      triggerCheatWarning();
    };

    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      triggerCheatWarning();
    };

    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      triggerCheatWarning();
    };

    // Watch focus out
    const handleBlur = () => {
      triggerCheatWarning();
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("copy", handleCopy);
    document.addEventListener("paste", handlePaste);
    window.addEventListener("blur", handleBlur);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("paste", handlePaste);
      window.removeEventListener("blur", handleBlur);
    };
  }, [isSubmitted]);

  // Cheat handler
  const triggerCheatWarning = () => {
    setCheatAttempts(prev => {
      const next = prev + 1;
      if (next >= 3) {
        // Force submit if cheated too many times
        setShowCheatWarning(true);
        setTimeout(() => {
          handleSubmitQuiz();
        }, 1500);
      } else {
        setShowCheatWarning(true);
        setTimeout(() => setShowCheatWarning(false), 3000);
      }
      return next;
    });
  };

  // Timer Setup (defaults to 15 mins if loading)
  const { formattedTime, secondsLeft, isExpired, start } = useTimer({
    initialMinutes: quiz?.timer_minutes || 15,
    onExpire: () => {
      // Auto-submit when time is up
      handleSubmitQuiz();
    }
  });

  // Start timer once quiz metadata loads
  useEffect(() => {
    if (quiz) {
      start();
    }
  }, [quiz, start]);

  // Handle select option
  const handleSelectOption = (questionId: string, answerId: string) => {
    if (isSubmitted) return;
    
    const updated = { ...userAnswers, [questionId]: answerId };
    setUserAnswers(updated);
    
    // Simulate real-time sync with localstorage
    localStorage.setItem(`response-${sessionId}`, JSON.stringify(updated));
  };

  // Submit & Auto-grading
  const handleSubmitQuiz = () => {
    if (isSubmitted) return;
    
    // Grade the test
    let score = 0;
    let maxPoints = 0;

    questions.forEach(q => {
      maxPoints += q.points;
      const chosenAnswerId = userAnswers[q.id];
      const correctAnswer = q.answers.find(a => a.is_correct);
      
      if (chosenAnswerId && correctAnswer && chosenAnswerId === correctAnswer.id) {
        score += q.points;
      }
    });

    const percentage = maxPoints > 0 ? Math.round((score / maxPoints) * 100) : 0;
    setFinalScore({ score, maxPoints, percentage });
    setIsSubmitted(true);
    
    // Clear storage
    sessionStorage.removeItem("display_name");
    sessionStorage.removeItem("quiz_id");
    localStorage.removeItem(`response-${sessionId}`);
  };

  if (!quiz || questions.length === 0) {
    return (
      <div className="min-h-screen bg-bg-base text-text-primary flex flex-col items-center justify-center font-sans">
        <span className="w-8 h-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin mb-3" />
        <p className="text-sm text-text-secondary">Đang chuẩn bị đề thi...</p>
      </div>
    );
  }

  const currentQuestion = questions[currentIdx];
  const selectedAnswerId = userAnswers[currentQuestion.id];
  const progressPercent = Math.round(((currentIdx + 1) / questions.length) * 100);

  // Result Badge Calculations
  const getFeedback = (pct: number) => {
    if (pct >= 90) return { title: "Xuất Sắc!", badge: "bg-success/15 border-success text-success", icon: Award };
    if (pct >= 50) return { title: "Đã Hoàn Thành", badge: "bg-primary/15 border-primary text-primary", icon: CheckCircle2 };
    return { title: "Cần Cố Gắng", badge: "bg-warning/15 border-warning text-warning", icon: AlertTriangle };
  };

  const feedback = getFeedback(finalScore.percentage);

  return (
    <div className="min-h-screen bg-bg-base text-text-primary flex flex-col justify-between font-sans select-none relative">
      {/* 1. Header Row */}
      <header className="glass-panel sticky top-0 z-20 border-b border-border-subtle px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <User className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-text-secondary">Học sinh</span>
            <span className="font-semibold text-sm max-w-[120px] sm:max-w-none truncate">{displayName}</span>
          </div>
        </div>

        {/* Big digital timer */}
        {!isSubmitted && (
          <div className="flex items-center gap-2 bg-danger/10 border border-danger/25 text-danger px-3.5 py-1.5 rounded-full font-mono text-sm font-semibold animate-pulse">
            <Clock className="w-4 h-4 shrink-0" />
            <span>{formattedTime}</span>
          </div>
        )}

        <div className="text-right">
          <span className="text-xs text-text-secondary block">Mã đề thi</span>
          <span className="font-bold text-xs uppercase tracking-wider">{quizId}</span>
        </div>
      </header>

      {/* Cheat Alert Overlay */}
      {showCheatWarning && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 bg-danger border border-danger/30 text-white py-3 px-6 rounded-card shadow-2xl flex items-center gap-2.5 max-w-sm w-full mx-4 animate-bounce">
          <ShieldAlert className="w-5 h-5 shrink-0" />
          <div className="text-xs">
            <h5 className="font-bold">Hành vi gian lận bị hạn chế!</h5>
            <p className="opacity-90">
              {cheatAttempts >= 3 
                ? "Vi phạm quá 3 lần. Hệ thống tự động nộp bài..." 
                : `Cảnh báo vi phạm (${cheatAttempts}/3): Không được sao chép hoặc rời tab!`}
            </p>
          </div>
        </div>
      )}

      {/* 2. Main Play Body */}
      <main className="flex-1 max-w-2xl w-full mx-auto p-6 flex flex-col justify-center my-6 z-10">
        {!isSubmitted ? (
          <div className="space-y-6">
            {/* Progress indicator */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-text-secondary font-medium">
                <span>Câu hỏi {currentIdx + 1} trên {questions.length}</span>
                <span>Tiến độ: {progressPercent}%</span>
              </div>
              <div className="w-full h-2 bg-bg-surface rounded-full overflow-hidden border border-border-subtle/50">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-accent-magenta transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Question Card Box */}
            <div className="glass-panel p-8 rounded-card border border-border-subtle shadow-xl space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider">
                  Dạng: {currentQuestion.type === "multiple_choice" ? "Trắc nghiệm" : "Đúng / Sai"}
                </span>
                <span className="text-xs text-primary font-semibold">+{currentQuestion.points} điểm</span>
              </div>
              
              <h2 className="text-lg md:text-xl font-semibold text-text-primary leading-relaxed">
                {currentQuestion.content}
              </h2>

              {/* Choice lists */}
              <div className="space-y-3.5 pt-2">
                {currentQuestion.answers.map((answer) => {
                  const isSelected = selectedAnswerId === answer.id;
                  return (
                    <button
                      key={answer.id}
                      onClick={() => handleSelectOption(currentQuestion.id, answer.id)}
                      className={`w-full text-left p-4 min-h-[52px] rounded-card border text-sm flex items-center gap-4 transition-all duration-200 cursor-pointer ${
                        isSelected 
                          ? "bg-primary/10 border-primary text-text-primary font-semibold shadow-md shadow-primary/5" 
                          : "bg-bg-surface border-border-subtle hover:border-border-hover text-text-secondary hover:text-text-primary"
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                        isSelected 
                          ? "bg-primary border-primary text-white scale-105" 
                          : "border-text-muted"
                      }`}>
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <span className="leading-relaxed">{answer.content}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Nav Footer within card flow */}
            <div className="flex items-center justify-between gap-4 pt-2">
              <button
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx(currentIdx - 1)}
                className="py-2.5 px-4 rounded-standard bg-bg-surface disabled:opacity-40 disabled:cursor-not-allowed border border-border-subtle text-xs text-text-primary font-medium hover:bg-bg-hover flex items-center gap-1.5 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Câu trước</span>
              </button>

              {currentIdx < questions.length - 1 ? (
                <button
                  onClick={() => setCurrentIdx(currentIdx + 1)}
                  className="py-2.5 px-4 rounded-standard bg-bg-surface border border-border-subtle text-xs text-text-primary font-medium hover:bg-bg-hover flex items-center gap-1.5 transition-all"
                >
                  <span>Câu sau</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmitQuiz}
                  className="py-2.5 px-6 rounded-standard bg-success hover:bg-success-hover text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-lg shadow-success/15"
                >
                  <span>Nộp bài thi</span>
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Final Results Score Screen */
          <div className="glass-panel p-8 rounded-card border border-border-subtle shadow-2xl text-center space-y-6 max-w-md mx-auto animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-primary to-accent-magenta text-white flex items-center justify-center mx-auto shadow-xl shadow-primary/10">
              <feedback.icon className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className={`inline-flex items-center gap-1 py-1 px-3 rounded-full border text-xs font-semibold ${feedback.badge}`}>
                {feedback.title}
              </span>
              <h2 className="text-2xl font-bold pt-2">Kết quả làm bài</h2>
              <p className="text-xs text-text-secondary">Chúc mừng bạn đã hoàn thành bài kiểm tra!</p>
            </div>

            {/* Score circle layout */}
            <div className="bg-bg-surface/50 border border-border-subtle/50 rounded-card p-6 py-8 max-w-xs mx-auto space-y-2">
              <span className="text-5xl font-black bg-gradient-to-r from-primary to-accent-magenta bg-clip-text text-transparent">
                {finalScore.score}
              </span>
              <span className="text-text-muted text-sm block">Trên tổng {finalScore.maxPoints} điểm</span>
              <span className="text-xs text-success bg-success/10 py-1 px-2 rounded-full font-semibold inline-block">
                Đúng {finalScore.percentage}% số câu
              </span>
            </div>

            {/* Warning details if any cheating happened */}
            {cheatAttempts > 0 && (
              <div className="text-[10px] text-danger/80 bg-danger/5 py-2 px-3 border border-danger/10 rounded-standard max-w-xs mx-auto">
                Ghi nhận {cheatAttempts} lần vi phạm thoát màn hình / click chuột phải.
              </div>
            )}

            <div className="pt-2 border-t border-border-subtle/30">
              <Link 
                href="/"
                className="w-full py-3 px-6 rounded-standard bg-primary hover:bg-primary-hover text-white font-medium text-sm transition-all focus-ring shadow-lg shadow-primary/15 flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
                <span>Quay lại trang chủ</span>
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* 3. Footer */}
      <footer className="max-w-2xl mx-auto w-full text-center text-[10px] text-text-muted pb-6 z-10 border-t border-border-subtle/20 pt-4">
        Mọi câu trả lời được ghi nhận tự động. Trình thi bảo mật cao chống copy-paste.
      </footer>
    </div>
  );
}
