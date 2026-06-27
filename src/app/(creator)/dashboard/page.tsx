"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Plus, 
  Sparkles, 
  Search, 
  Trash2, 
  Edit, 
  Share2, 
  CheckCircle, 
  FileText, 
  Clock, 
  Users, 
  BarChart,
  ArrowLeft,
  Copy,
  Check
} from "lucide-react";
import dummyQuizzesData from "@/mocks/dummy_quizzes.json";
import { Quiz } from "@/types";

export default function CreatorDashboard() {
  const [quizzes, setQuizzes] = useState<Quiz[]>(dummyQuizzesData as Quiz[]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [sharedQuizId, setSharedQuizId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  // Share modal states
  const [activeShareQuiz, setActiveShareQuiz] = useState<Quiz | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Filter quizzes
  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || quiz.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate top level stats
  const totalQuizzes = quizzes.length;
  const totalParticipants = quizzes.reduce((sum, q) => sum + (q.participant_count || 0), 0);
  const publishedQuizzes = quizzes.filter(q => q.status === "published");
  const avgScore = publishedQuizzes.length > 0 
    ? (publishedQuizzes.reduce((sum, q) => sum + (q.average_score || 0), 0) / publishedQuizzes.length).toFixed(1)
    : "0.0";

  // Handle delete quiz
  const handleDeleteQuiz = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa bộ câu hỏi này?")) {
      setQuizzes(quizzes.filter(quiz => quiz.id !== id));
    }
  };

  // Copy share link
  const handleShare = (quizId: string) => {
    const shareUrl = `${window.location.origin}/play/${quizId}`;
    navigator.clipboard.writeText(shareUrl);
    setSharedQuizId(quizId);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      setSharedQuizId(null);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-bg-base text-text-primary p-6 md:p-12 font-sans relative">
      {/* Background decoration */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto z-10 relative">
        {/* Navigation / Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-text-muted hover:text-text-primary text-sm mb-3 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại trang chủ</span>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">Bảng Quản Lý Creator</h1>
            <p className="text-text-secondary text-sm">Tạo, soạn đề thi và theo dõi kết quả của học sinh.</p>
          </div>

          <div className="flex items-center gap-3">
            <Link 
              href="/builder/new?ai=true" 
              className="inline-flex items-center gap-2 py-2.5 px-4 rounded-standard bg-bg-surface hover:bg-bg-hover border border-border-subtle hover:border-accent-magenta text-text-primary font-medium text-sm transition-all focus-ring shadow-lg"
            >
              <Sparkles className="w-4 h-4 text-accent-magenta animate-pulse" />
              <span>Tạo nhanh bằng AI</span>
            </Link>
            <Link 
              href="/builder/new" 
              className="inline-flex items-center gap-2 py-2.5 px-4 rounded-standard bg-primary hover:bg-primary-hover text-white font-medium text-sm transition-all focus-ring shadow-lg shadow-primary/10"
            >
              <Plus className="w-4 h-4" />
              <span>Tạo thủ công</span>
            </Link>
          </div>
        </div>

        {/* Overview Stats Dashboard */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="glass-panel p-6 rounded-card flex items-center justify-between">
            <div>
              <span className="text-xs text-text-secondary block mb-1">Tổng số Quiz</span>
              <span className="text-3xl font-bold">{totalQuizzes}</span>
            </div>
            <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
          </div>

          <div className="glass-panel p-6 rounded-card flex items-center justify-between">
            <div>
              <span className="text-xs text-text-secondary block mb-1">Học sinh đã tham gia</span>
              <span className="text-3xl font-bold">{totalParticipants}</span>
            </div>
            <div className="w-12 h-12 rounded-lg bg-accent-magenta/10 text-accent-magenta flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="glass-panel p-6 rounded-card flex items-center justify-between">
            <div>
              <span className="text-xs text-text-secondary block mb-1">Điểm số trung bình</span>
              <span className="text-3xl font-bold">{avgScore}/10</span>
            </div>
            <div className="w-12 h-12 rounded-lg bg-success/10 text-success flex items-center justify-center">
              <BarChart className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          {/* Search */}
          <div className="relative w-full sm:w-80">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
              <Search className="w-4 h-4" />
            </span>
            <input 
              type="text" 
              placeholder="Tìm kiếm tiêu đề quiz..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-bg-surface border border-border-subtle rounded-standard text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all focus-ring"
            />
          </div>

          {/* Status filter tabs */}
          <div className="flex items-center gap-1 bg-bg-surface border border-border-subtle p-1 rounded-standard w-full sm:w-auto">
            <button 
              onClick={() => setStatusFilter("all")}
              className={`flex-1 sm:flex-none py-1.5 px-4 rounded-standard text-xs font-medium transition-all ${
                statusFilter === "all" ? "bg-bg-hover text-text-primary shadow" : "text-text-secondary hover:text-text-primary"
              }`}
            >
              Tất cả
            </button>
            <button 
              onClick={() => setStatusFilter("published")}
              className={`flex-1 sm:flex-none py-1.5 px-4 rounded-standard text-xs font-medium transition-all ${
                statusFilter === "published" ? "bg-success/15 text-success shadow" : "text-text-secondary hover:text-text-primary"
              }`}
            >
              Đã xuất bản
            </button>
            <button 
              onClick={() => setStatusFilter("draft")}
              className={`flex-1 sm:flex-none py-1.5 px-4 rounded-standard text-xs font-medium transition-all ${
                statusFilter === "draft" ? "bg-warning/15 text-warning shadow" : "text-text-secondary hover:text-text-primary"
              }`}
            >
              Nháp
            </button>
          </div>
        </div>

        {/* Quizzes List Cards */}
        {filteredQuizzes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredQuizzes.map((quiz) => (
              <div 
                key={quiz.id}
                className="glass-panel p-6 rounded-card border border-border-subtle flex flex-col justify-between hover:border-border-hover transition-all duration-300 shadow-md hover:shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    {/* Status badge */}
                    {quiz.status === "published" ? (
                      <span className="inline-flex items-center gap-1 py-1 px-2.5 rounded-standard bg-success/10 border border-success/20 text-success text-xs font-semibold">
                        <CheckCircle className="w-3 h-3" />
                        Đã xuất bản
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 py-1 px-2.5 rounded-standard bg-warning/10 border border-warning/20 text-warning text-xs font-semibold">
                        <Clock className="w-3 h-3" />
                        Bản nháp
                      </span>
                    )}
                    <span className="text-xs text-text-muted">
                      {quiz.created_at ? new Date(quiz.created_at).toLocaleDateString("vi-VN") : "Hôm nay"}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-text-primary mb-3 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                    {quiz.title}
                  </h3>

                  {/* Quick stats in card */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-text-secondary mb-6 border-b border-border-subtle/30 pb-4">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-text-muted" />
                      {quiz.timer_minutes} phút làm bài
                    </span>
                    {quiz.status === "published" && (
                      <>
                        <span className="w-1 h-1 bg-border-subtle rounded-full" />
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-text-muted" />
                          {quiz.participant_count} người làm
                        </span>
                        <span className="w-1 h-1 bg-border-subtle rounded-full" />
                        <span className="flex items-center gap-1">
                          <BarChart className="w-3.5 h-3.5 text-text-muted" />
                          Điểm TB: {quiz.average_score}/10
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center justify-between gap-3 mt-2">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => {
                        setActiveShareQuiz(quiz);
                        setCopiedLink(false);
                        setCopiedCode(false);
                      }}
                      disabled={quiz.status !== "published"}
                      className={`flex items-center gap-1 text-xs py-2 px-3.5 rounded-standard font-medium transition-all ${
                        quiz.status === "published"
                          ? "bg-bg-surface hover:bg-bg-hover text-text-primary border border-border-subtle hover:border-text-secondary cursor-pointer"
                          : "bg-bg-surface text-text-muted border border-border-subtle/30 cursor-not-allowed opacity-50"
                      }`}
                      title={quiz.status !== "published" ? "Chỉ chia sẻ được quiz đã xuất bản" : "Lấy link tham gia"}
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Chia sẻ</span>
                    </button>
                    <Link 
                      href={`/builder/${quiz.id}`}
                      className="flex items-center gap-1 text-xs py-2 px-3.5 rounded-standard bg-bg-surface hover:bg-bg-hover text-text-primary border border-border-subtle hover:border-text-secondary font-medium transition-all"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Sửa</span>
                    </Link>
                  </div>

                  <button 
                    onClick={() => handleDeleteQuiz(quiz.id)}
                    className="p-2 text-text-muted hover:text-danger hover:bg-danger/10 rounded-standard transition-all"
                    title="Xóa đề thi"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-panel p-12 rounded-card text-center flex flex-col items-center justify-center border-dashed border-border-subtle">
            <FileText className="w-12 h-12 text-text-muted mb-4" />
            <h3 className="text-lg font-semibold text-text-primary mb-1">Không tìm thấy quiz nào</h3>
            <p className="text-text-secondary text-sm mb-6 max-w-sm">
              Thử tìm kiếm từ khóa khác hoặc tạo mới bộ câu hỏi để bắt đầu.
            </p>
            <Link 
              href="/builder/new"
              className="inline-flex items-center gap-2 py-2.5 px-5 rounded-standard bg-primary hover:bg-primary-hover text-white font-medium text-sm transition-all focus-ring"
            >
              <Plus className="w-4 h-4" />
              <span>Tạo quiz thủ công đầu tiên</span>
            </Link>
          </div>
        )}
      </div>

      {/* Share Modal Overlay */}
      {activeShareQuiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="glass-panel w-full max-w-md rounded-card border border-border-subtle p-6 space-y-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border-subtle/30 pb-3">
              <div className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-base text-text-primary">Chia sẻ bài kiểm tra</h3>
              </div>
              <button 
                onClick={() => setActiveShareQuiz(null)}
                className="py-1 px-2.5 rounded-standard bg-bg-surface hover:bg-bg-hover text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors"
              >
                Đóng
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-5 text-center">
              <h4 className="font-semibold text-sm text-text-primary text-left line-clamp-1">
                {activeShareQuiz.title}
              </h4>

              {/* Dynamic QR Code */}
              <div className="bg-white p-3 rounded-card w-44 h-44 mx-auto flex items-center justify-center shadow-lg border border-border-subtle">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                    `${window.location.origin}/play/${activeShareQuiz.id}`
                  )}`} 
                  alt="QR Code" 
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-[10px] text-text-muted">Quét mã QR bằng điện thoại để làm bài thi nhanh</p>

              {/* Share URL Input */}
              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Đường dẫn tham gia</label>
                <div className="flex items-center gap-2 bg-bg-base border border-border-subtle rounded-standard p-1">
                  <input 
                    type="text" 
                    readOnly
                    value={`${window.location.origin}/play/${activeShareQuiz.id}`}
                    className="flex-1 bg-transparent border-none text-xs text-text-primary focus:outline-none pl-2 select-all"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/play/${activeShareQuiz.id}`);
                      setCopiedLink(true);
                      setTimeout(() => setCopiedLink(false), 2000);
                    }}
                    className="py-1.5 px-3 rounded-standard bg-primary text-white text-xs font-semibold hover:bg-primary-hover transition-all flex items-center gap-1 shrink-0 cursor-pointer"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? "Đã copy" : "Copy"}</span>
                  </button>
                </div>
              </div>

              {/* Join Code Input */}
              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Mã Code rút gọn</label>
                <div className="flex items-center gap-2 bg-bg-base border border-border-subtle rounded-standard p-1">
                  <span className="flex-1 text-xs text-text-primary pl-2 font-mono font-bold uppercase tracking-wide">
                    {activeShareQuiz.id}
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(activeShareQuiz.id);
                      setCopiedCode(true);
                      setTimeout(() => setCopiedCode(false), 2000);
                    }}
                    className="py-1.5 px-3 rounded-standard bg-bg-surface hover:bg-bg-hover text-text-primary border border-border-subtle text-xs font-semibold transition-all flex items-center gap-1 shrink-0 cursor-pointer"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? "Đã copy" : "Copy"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
