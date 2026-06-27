"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, PlayCircle, BookOpen } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [joinCode, setJoinCode] = useState("");

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = joinCode.trim();
    if (trimmed) {
      router.push(`/play/${encodeURIComponent(trimmed)}`);
    }
  };

  return (
    <div className="min-h-screen bg-bg-base flex flex-col justify-between p-6 md:p-12 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-accent-magenta/10 blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="max-w-6xl mx-auto w-full flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-bold text-white shadow-lg shadow-primary/20">
            W
          </div>
          <span className="font-semibold text-lg text-text-primary tracking-tight">Wayground Quiz</span>
        </div>
        <div className="text-sm text-text-muted">
          v1.0.0 (Prototype)
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto w-full flex flex-col items-center justify-center my-12 z-10 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border-subtle bg-bg-surface text-xs text-text-secondary mb-6">
          <Sparkles className="w-3.5 h-3.5 text-accent-magenta animate-pulse" />
          <span>Hỗ trợ tạo đề tự động bằng AI Gemini</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 max-w-2xl leading-tight">
          Nền tảng kiểm tra{" "}
          <span className="bg-gradient-to-r from-primary to-accent-magenta bg-clip-text text-transparent drop-shadow-sm">
            Zero-Friction
          </span>
        </h1>
        
        <p className="text-text-secondary text-lg max-w-xl mb-12">
          Soạn đề nhanh chóng trong vài giây và chia sẻ cho học sinh làm bài ngay không cần tài khoản rườm rà.
        </p>

        {/* Portals Grid */}
        <div className="grid md:grid-cols-2 gap-8 w-full max-w-3xl">
          {/* Creator Card */}
          <div className="glass-panel rounded-card p-8 flex flex-col items-start text-left relative overflow-hidden transition-all duration-300 hover:border-primary/30 group hover:translate-y-[-4px] hover:shadow-2xl hover:shadow-primary/5">
            <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-300">
              <BookOpen className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-semibold text-text-primary mb-2">Giáo Viên (Creator)</h2>
            <p className="text-text-secondary text-sm mb-8 flex-grow leading-relaxed">
              Tạo và quản lý danh sách Quiz, theo dõi điểm số, phân tích lỗi sai chi tiết của học sinh. Hỗ trợ upload tài liệu chuyển đổi thành đề thi bằng AI.
            </p>
            <Link 
              href="/dashboard" 
              className="w-full text-center py-3 px-6 rounded-standard bg-primary hover:bg-primary-hover text-white font-medium transition-all duration-200 focus-ring shadow-lg shadow-primary/15"
            >
              Vào Trang Quản Lý
            </Link>
          </div>

          {/* Participant Card */}
          <div className="glass-panel rounded-card p-8 flex flex-col items-start text-left relative overflow-hidden transition-all duration-300 hover:border-accent-magenta/30 group hover:translate-y-[-4px] hover:shadow-2xl hover:shadow-accent-magenta/5">
            <div className="w-12 h-12 rounded-lg bg-accent-magenta/10 text-accent-magenta flex items-center justify-center mb-6 group-hover:bg-accent-magenta group-hover:text-white transition-all duration-300">
              <PlayCircle className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-semibold text-text-primary mb-2">Học Sinh (Participant)</h2>
            <p className="text-text-secondary text-sm mb-4 leading-relaxed">
              Nhập mã tham gia (Join Code) hoặc click vào link thi thử dưới đây để bắt đầu làm bài thi trực tuyến.
            </p>

            {/* Join Code Input Form */}
            <form onSubmit={handleJoinSubmit} className="w-full flex items-center gap-2 mb-4">
              <input 
                type="text" 
                placeholder="Mã Code (vd: quiz-1)"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                className="flex-1 bg-bg-surface border border-border-subtle rounded-standard px-3 py-2 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-magenta focus:ring-2 focus:ring-accent-magenta/20 transition-all focus-ring"
              />
              <button 
                type="submit"
                disabled={!joinCode.trim()}
                className="py-2 px-4 rounded-standard bg-accent-magenta hover:bg-accent-magenta-hover disabled:bg-bg-surface disabled:text-text-muted disabled:border-border-subtle disabled:cursor-not-allowed text-white text-sm font-semibold transition-all focus-ring shadow-lg shadow-accent-magenta/10 shrink-0"
              >
                Tham gia
              </button>
            </form>

            <div className="w-full border-t border-border-subtle/30 my-2 pt-2">
              <span className="text-[10px] text-text-muted block mb-2 font-bold uppercase tracking-wider">Hoặc làm nhanh</span>
              <Link 
                href="/play/quiz-1" 
                className="w-full inline-block text-center py-2 px-6 rounded-standard bg-bg-surface hover:bg-bg-hover text-text-primary border border-border-subtle hover:border-text-secondary text-xs font-semibold transition-all duration-200 focus-ring"
              >
                Làm Bài Thi Thử (Quiz 1)
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto w-full text-center text-xs text-text-muted pt-8 border-t border-border-subtle/30 z-10">
        © 2026 Wayground Quiz Module. Thiết kế tối giản, bảo mật & tối ưu hiệu năng di động.
      </footer>
    </div>
  );
}
