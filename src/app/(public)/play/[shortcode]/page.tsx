"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { HelpCircle, Clock, BookOpen, AlertCircle, Sparkles, ArrowLeft } from "lucide-react";
import dummyQuizzes from "@/mocks/dummy_quizzes.json";
import { Quiz } from "@/types";

export default function ParticipantJoin() {
  const router = useRouter();
  const params = useParams();
  const shortcode = params.shortcode as string; // Maps to quiz ID in our prototype

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Load quiz details based on shortcode
  useEffect(() => {
    const foundQuiz = dummyQuizzes.find(q => q.id === shortcode);
    if (foundQuiz) {
      setQuiz(foundQuiz as Quiz);
    }
  }, [shortcode]);

  // Handle Input change with validation on length
  const handleNameChange = (val: string) => {
    // Remove extra starting spaces
    if (val.startsWith(" ")) val = val.trimStart();
    setDisplayName(val);
    
    // Quick validation feedback
    if (val.length > 20) {
      setError("Tên tối đa 20 ký tự");
    } else if (val.trim().length > 0 && val.trim().length < 2) {
      setError("Tên tối thiểu 2 ký tự");
    } else {
      setError(null);
    }
  };

  // Submit Handler
  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedName = displayName.trim();
    
    // Strict backend-like validation
    if (trimmedName.length < 2 || trimmedName.length > 20) {
      setError("Tên phải từ 2 đến 20 ký tự và không chứa toàn khoảng trắng.");
      return;
    }

    setLoading(true);
    
    // Simulate API call to create session (returning session_id)
    setTimeout(() => {
      setLoading(false);
      // In prototype, we pass quizId and name in the session ID or search params
      const mockSessionId = `session-${Date.now()}`;
      // Redirect to the player page with sessionId and pass the displayName & quizId in sessionStorage or query
      sessionStorage.setItem("display_name", trimmedName);
      sessionStorage.setItem("quiz_id", shortcode);
      
      router.push(`/quiz/${mockSessionId}`);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-bg-base text-text-primary flex flex-col justify-between p-6 relative overflow-hidden font-sans">
      {/* Background glow effects */}
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-accent-magenta/5 blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="max-w-4xl mx-auto w-full flex items-center justify-between z-10">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Về trang chủ</span>
        </Link>
        <span className="text-xs text-text-muted">Wayground Zero-Friction Flow</span>
      </header>

      {/* Main Join Form Card */}
      <main className="max-w-md w-full mx-auto my-12 z-10 flex flex-col items-center justify-center">
        {quiz ? (
          <div className="w-full space-y-6">
            {/* Quiz Info Box */}
            <div className="text-center space-y-2">
              <span className="inline-flex items-center gap-1 py-1 px-2.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
                <Sparkles className="w-3 h-3 text-accent-magenta" />
                Sẵn sàng tham gia
              </span>
              <h1 className="text-2xl font-bold tracking-tight px-4">{quiz.title}</h1>
              
              <div className="flex items-center justify-center gap-4 text-xs text-text-secondary mt-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-text-muted" />
                  {quiz.timer_minutes} phút làm bài
                </span>
                <span className="w-1 h-1 bg-border-subtle rounded-full" />
                <span className="flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-text-muted" />
                  Trắc nghiệm & Đúng/Sai
                </span>
              </div>
            </div>

            {/* Input Form Card */}
            <div className="glass-panel p-8 rounded-card border border-border-subtle shadow-2xl relative overflow-hidden">
              <form onSubmit={handleJoin} className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="name-input" className="text-xs font-bold text-text-secondary tracking-wide uppercase">
                      Tên hiển thị của bạn
                    </label>
                    <span className={`text-[10px] ${displayName.length > 20 ? "text-danger" : "text-text-muted"}`}>
                      {displayName.length}/20 ký tự
                    </span>
                  </div>

                  <input
                    id="name-input"
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Ví dụ: Nam Huỳnh, Minh Nguyễn..."
                    autoFocus
                    className={`w-full bg-bg-base border rounded-standard px-4 py-3 text-base text-text-primary placeholder-text-muted focus:outline-none transition-all focus-ring ${
                      error ? "border-danger focus:border-danger focus:ring-danger/20" : "border-border-subtle"
                    }`}
                  />
                  
                  {error && (
                    <div className="flex items-center gap-1.5 text-xs text-danger mt-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{error}</span>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || displayName.trim().length < 2 || displayName.length > 20 || !!error}
                  className="w-full py-3 px-6 rounded-standard bg-primary hover:bg-primary-hover disabled:bg-bg-hover disabled:text-text-muted disabled:border-border-subtle disabled:cursor-not-allowed text-white font-medium transition-all duration-200 focus-ring shadow-lg shadow-primary/10 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      <span>Đang kết nối phòng thi...</span>
                    </>
                  ) : (
                    <span>Bắt đầu làm bài</span>
                  )}
                </button>
              </form>
            </div>
            
            <p className="text-[10px] text-text-muted text-center px-6 leading-relaxed">
              * Bằng cách tham gia, bạn đồng ý làm bài thi này. Điểm số sẽ được gửi trực tiếp đến giáo viên của bạn ngay sau khi hoàn thành.
            </p>
          </div>
        ) : (
          <div className="glass-panel p-8 rounded-card border border-border-subtle text-center space-y-4">
            <HelpCircle className="w-12 h-12 text-warning mx-auto animate-bounce" />
            <h2 className="text-lg font-bold text-text-primary">Không tìm thấy mã phòng thi</h2>
            <p className="text-text-secondary text-xs max-w-xs leading-relaxed">
              Mã quiz "{shortcode}" không tồn tại hoặc đã bị đóng bởi giáo viên. Vui lòng kiểm tra lại đường dẫn chia sẻ.
            </p>
            <Link 
              href="/" 
              className="inline-block py-2 px-4 rounded-standard bg-bg-surface hover:bg-bg-hover text-xs font-semibold border border-border-subtle text-text-primary transition-all"
            >
              Quay lại trang chủ
            </Link>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto w-full text-center text-[10px] text-text-muted pt-6 border-t border-border-subtle/20 z-10">
        Wayground Quiz Platform • Thiết lập Zero-Friction giúp học sinh vào làm bài trong 3 giây.
      </footer>
    </div>
  );
}
