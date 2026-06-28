"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  Clock,
  HelpCircle,
  PieChart,
  Users,
  XCircle,
} from "lucide-react";
import { HeaderControls } from "@/components/HeaderControls";
import { AppLogo } from "@/components/AppLogo";
import { supabase } from "@/lib/supabaseClient";

interface AnswerAnalytics {
  id: string;
  content: string;
  isCorrect: boolean;
  selectedCount: number;
  selectedRate: number;
}

interface QuestionAnalytics {
  id: string;
  content: string;
  type: "multiple_choice" | "true_false";
  points: number;
  totalResponses: number;
  correctCount: number;
  incorrectCount: number;
  correctRate: number;
  answers: AnswerAnalytics[];
}

interface AnalyticsPayload {
  success?: boolean;
  data?: {
    quiz: {
      id: string;
      title: string;
      timer_minutes: number;
      status: "draft" | "published";
      course_id: string | null;
    };
    summary: {
      totalAttempts: number;
      averageScore: number;
      averageDurationSeconds: number;
      totalResponses: number;
    };
    questions: QuestionAnalytics[];
  };
  error?: string;
}

function formatDuration(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}p ${secs.toString().padStart(2, "0")}s`;
}

export default function QuizAnalyticsPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const quizId = params.quizId as string;

  const [payload, setPayload] = useState<AnalyticsPayload["data"] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    const loadAnalytics = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { data } = await supabase.auth.getSession();
        const token = data.session?.access_token;

        if (!token) {
          setError("Vui lòng đăng nhập bằng Supabase Auth để xem phân tích.");
          return;
        }

        const response = await fetch(`/api/quiz-analytics/${encodeURIComponent(quizId)}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const json = await response.json() as AnalyticsPayload;

        if (!response.ok || !json.success || !json.data) {
          setError(json.error || "Không thể tải dữ liệu phân tích.");
          return;
        }

        setPayload(json.data);
      } catch (err) {
        console.error(err);
        setError("Không thể kết nối tới API phân tích.");
      } finally {
        setIsLoading(false);
      }
    };

    loadAnalytics();
  }, [quizId]);

  const handleExport = async () => {
    setExportStatus(null);
    setIsExporting(true);

    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;

      if (!token) {
        setExportStatus({
          type: "error",
          message: "Vui lòng đăng nhập bằng Supabase Auth để export kết quả.",
        });
        return;
      }

      const response = await fetch(`/api/export-quiz/${quizId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const json = await response.json().catch(() => null);
        setExportStatus({
          type: "error",
          message: json?.error || "Không thể export kết quả quiz.",
        });
        return;
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const safeTitle = (payload?.quiz.title || "quiz")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9-_]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 80) || "quiz";

      link.href = url;
      link.download = `${safeTitle}-results.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setExportStatus({
        type: "success",
        message: "Đã export CSV thành công.",
      });
    } catch (err) {
      console.error(err);
      setExportStatus({
        type: "error",
        message: "Không thể kết nối tới API export.",
      });
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-base text-text-primary p-6 md:p-12 font-sans relative overflow-hidden">
      <div className="absolute top-[-20%] left-[20%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent-magenta/10 blur-[150px] pointer-events-none" />

      <div className="max-w-5xl mx-auto z-10 relative">
        <div className="flex items-center justify-start mt-4 mb-4 -ml-4 md:-ml-8">
          <AppLogo className="h-16 md:h-20 w-auto object-contain drop-shadow-sm" />
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-subtle/30 pb-5">
          <div className="space-y-1">
            <Link
              href={`/course/${courseId}/leaderboard/${quizId}`}
              className="inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary transition-colors mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay lại bảng xếp hạng</span>
            </Link>
            <h1 className="text-2xl font-bold tracking-tight">Phân Tích Bài Quiz</h1>
            <p className="text-xs text-text-secondary">
              {payload?.quiz.title || "Quiz"} · Tỷ lệ đúng/sai và phân bố lựa chọn của học viên.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <HeaderControls />
            <button
              type="button"
              onClick={handleExport}
              disabled={isExporting}
              className="inline-flex items-center gap-2 py-2 px-3.5 rounded-standard bg-bg-surface hover:bg-bg-hover disabled:opacity-60 disabled:cursor-wait border border-border-subtle text-xs font-semibold text-text-primary transition-colors"
            >
              <BarChart3 className="w-4 h-4 text-success" />
              <span>{isExporting ? "Đang export..." : "Export CSV"}</span>
            </button>
          </div>
        </div>

        {exportStatus && (
          <div className={`glass-panel rounded-card p-4 mt-6 border ${
            exportStatus.type === "success"
              ? "border-success/25 bg-success/5 text-success"
              : "border-danger/25 bg-danger/5 text-danger"
          }`}>
            <p className="text-xs font-semibold">{exportStatus.message}</p>
          </div>
        )}

        {error || !payload ? (
          <div className="glass-panel rounded-card border border-border-subtle p-10 mt-8 text-center">
            <HelpCircle className="w-10 h-10 text-warning mx-auto mb-3" />
            <h2 className="font-bold text-lg mb-1">Không tải được phân tích</h2>
            <p className="text-sm text-text-secondary">{error || "Dữ liệu phân tích chưa sẵn sàng."}</p>
          </div>
        ) : (
          <main className="space-y-8 mt-8">
            <section className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="glass-panel rounded-card border border-border-subtle p-5">
                <Users className="w-5 h-5 text-primary mb-3" />
                <span className="text-[10px] text-text-secondary uppercase font-bold">Lượt làm</span>
                <strong className="block text-2xl mt-1">{payload.summary.totalAttempts}</strong>
              </div>
              <div className="glass-panel rounded-card border border-border-subtle p-5">
                <PieChart className="w-5 h-5 text-accent-magenta mb-3" />
                <span className="text-[10px] text-text-secondary uppercase font-bold">Điểm TB</span>
                <strong className="block text-2xl mt-1">{payload.summary.averageScore}/10</strong>
              </div>
              <div className="glass-panel rounded-card border border-border-subtle p-5">
                <Clock className="w-5 h-5 text-warning mb-3" />
                <span className="text-[10px] text-text-secondary uppercase font-bold">Thời gian TB</span>
                <strong className="block text-2xl mt-1">{formatDuration(payload.summary.averageDurationSeconds)}</strong>
              </div>
              <div className="glass-panel rounded-card border border-border-subtle p-5">
                <CheckCircle2 className="w-5 h-5 text-success mb-3" />
                <span className="text-[10px] text-text-secondary uppercase font-bold">Câu trả lời</span>
                <strong className="block text-2xl mt-1">{payload.summary.totalResponses}</strong>
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-sm uppercase tracking-wide">Phân tích từng câu</h2>
                <span className="text-xs text-text-secondary">{payload.questions.length} câu hỏi</span>
              </div>

              {payload.questions.map((question, index) => (
                <article
                  key={question.id}
                  className="glass-panel rounded-card border border-border-subtle p-6 space-y-5"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-2">
                      <span className="text-[10px] text-text-muted uppercase font-bold">
                        Câu {index + 1} · {question.type === "multiple_choice" ? "Trắc nghiệm" : "Đúng/Sai"} · {question.points} điểm
                      </span>
                      <h3 className="font-semibold text-base leading-relaxed">{question.content}</h3>
                    </div>
                    <div className={`shrink-0 inline-flex items-center gap-1.5 rounded-standard border px-3 py-1.5 text-xs font-bold ${
                      question.correctRate >= 70
                        ? "bg-success/10 border-success/20 text-success"
                        : question.correctRate >= 40
                          ? "bg-warning/10 border-warning/20 text-warning"
                          : "bg-danger/10 border-danger/20 text-danger"
                    }`}>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{question.correctRate}% đúng</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-text-secondary">
                      <span>{question.correctCount} đúng / {question.totalResponses} lượt trả lời</span>
                      <span>{question.incorrectCount} sai</span>
                    </div>
                    <div className="h-2 rounded-full bg-bg-surface border border-border-subtle overflow-hidden">
                      <div
                        className="h-full bg-success transition-all"
                        style={{ width: `${question.correctRate}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    {question.answers.map((answer) => (
                      <div key={answer.id} className="space-y-1.5">
                        <div className="flex items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-2 min-w-0">
                            {answer.isCorrect ? (
                              <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                            ) : (
                              <XCircle className="w-4 h-4 text-text-muted shrink-0" />
                            )}
                            <span className={`truncate ${answer.isCorrect ? "text-success font-semibold" : "text-text-secondary"}`}>
                              {answer.content}
                            </span>
                          </div>
                          <span className="shrink-0 text-text-secondary">
                            {answer.selectedCount} chọn · {answer.selectedRate}%
                          </span>
                        </div>
                        <div className="h-1.5 rounded-full bg-bg-surface overflow-hidden">
                          <div
                            className={`h-full ${answer.isCorrect ? "bg-success" : "bg-primary/60"}`}
                            style={{ width: `${answer.selectedRate}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </article>
              ))}

              {payload.questions.length === 0 && (
                <div className="glass-panel rounded-card border border-border-subtle p-10 text-center text-sm text-text-muted">
                  Chưa có câu hỏi nào để phân tích.
                </div>
              )}
            </section>
          </main>
        )}
      </div>
    </div>
  );
}
