"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  LogOut,
  BookOpen,
  Clock,
  Play,
  Award,
  RotateCcw,
  Sparkles,
  User
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { Course, Quiz, Attempt } from "@/types";
import { HeaderControls } from "@/components/HeaderControls";
import { AppLogo } from "@/components/AppLogo";

export default function StudentDashboard() {
  const router = useRouter();

  const [studentId, setStudentId] = useState("");
  const [studentName, setStudentName] = useState("Học viên");
  const [courses, setCourses] = useState<Course[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initData = async () => {
      // Load student info
      const savedId = localStorage.getItem("student_id");
      const savedName = localStorage.getItem("student_name");

      if (!savedId || !savedName) {
        // If not logged in as student, redirect to home
        router.push("/");
        return;
      }

      setStudentId(savedId);
      setStudentName(savedName);

      // Fetch from Supabase
      const { data: members } = await supabase.from('course_members').select('course_id').eq('student_id', savedId);
      const joinedCourseIds = members?.map(m => m.course_id) || [];

      if (joinedCourseIds.length > 0) {
        const { data: coursesData } = await supabase.from('courses').select('*').in('id', joinedCourseIds);
        if (coursesData) setCourses(coursesData as Course[]);

        const { data: quizzesData } = await supabase.from('quizzes').select('*').in('course_id', joinedCourseIds).eq('status', 'published');
        if (quizzesData) {
          setQuizzes(quizzesData as Quiz[]);
          const quizIds = quizzesData.map(q => q.id);

          if (quizIds.length > 0) {
            const { data: attemptsData } = await supabase.from('attempts').select('*').eq('student_id', savedId).in('quiz_id', quizIds);
            if (attemptsData) setAttempts(attemptsData as Attempt[]);
          }
        }
      }
      setIsLoading(false);
    };
    initData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("student_id");
    localStorage.removeItem("student_name");
    localStorage.removeItem("joined_courses");
    router.push("/");
  };

  // Helper: Get attempts for student on specific quiz
  const getQuizAttempts = (quizId: string) => {
    return attempts.filter(a => a.quiz_id === quizId && a.student_id === studentId);
  };

  // Format seconds to mm:ss
  const formatDuration = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}p ${remainingSecs}s`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-base text-text-primary p-6 md:p-12 font-sans relative overflow-hidden">
      {/* Glow decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[35%] h-[35%] rounded-full bg-accent-magenta/5 blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="max-w-6xl mx-auto w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-4 z-10 relative mb-12">
        <div className="flex items-center">
          <AppLogo className="h-20 md:h-24 w-auto object-contain drop-shadow-sm" />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <HeaderControls />
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs py-2 px-3.5 rounded-standard bg-bg-surface hover:bg-bg-hover text-text-primary border border-border-subtle hover:border-text-secondary font-medium transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Về Trang chủ</span>
          </Link>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 py-2 px-4 rounded-standard bg-danger/10 hover:bg-danger/25 text-danger border border-danger/20 text-xs font-semibold transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Đăng xuất (Xóa thiết bị)</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto z-10 relative space-y-10">

        {/* Top Info Bar */}
        <div className="border-b border-border-subtle/30 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent-magenta/15 text-accent-magenta flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-text-secondary block">Xin chào học viên,</span>
              <h1 className="text-xl font-bold tracking-tight">{studentName}</h1>
            </div>
          </div>
        </div>

        {/* Dashboard Welcome Banner */}
        <div className="glass-panel p-6 rounded-card border border-border-subtle relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1 text-[10px] bg-primary/10 border border-primary/20 text-primary py-0.5 px-2 rounded-full font-semibold">
              <Sparkles className="w-3 h-3 text-accent-magenta animate-pulse" />
              Chế độ Học viên (LMS)
            </span>
            <h2 className="text-lg font-bold text-text-primary">Tiến trình học tập của bạn</h2>
            <p className="text-xs text-text-secondary">Làm đề thi thử, xem lịch sử làm bài và theo dõi bảng xếp hạng của lớp học.</p>
          </div>
          <div className="bg-bg-surface border border-border-subtle py-2 px-4 rounded-standard text-xs text-text-secondary">
            Khóa học đã tham gia: <strong className="text-text-primary">{courses.length}</strong>
          </div>
        </div>

        {/* Joined Courses List Section */}
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-text-primary tracking-tight">Khóa học của tôi</h2>

          {courses.length > 0 ? (
            <div className="space-y-8">
              {courses.map((course) => {
                const courseQuizzes = quizzes.filter(q => q.course_id === course.id);

                return (
                  <div
                    key={course.id}
                    className="glass-panel rounded-card border border-border-subtle overflow-hidden"
                  >
                    {/* Course Header Banner */}
                    <div className="bg-bg-surface px-6 py-4 border-b border-border-subtle/50 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-accent-magenta" />
                        <h3 className="font-semibold text-base text-text-primary">{course.title}</h3>
                      </div>
                      <span className="text-[10px] bg-bg-base border border-border-subtle py-1 px-3 rounded-full text-text-secondary font-semibold font-mono">
                        MÃ: {course.code}
                      </span>
                    </div>

                    {/* Quizzes List inside Course */}
                    <div className="p-6">
                      {courseQuizzes.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {courseQuizzes.map((quiz) => {
                            const quizAttempts = getQuizAttempts(quiz.id);
                            const attemptCount = quizAttempts.length;
                            // First attempt score/stats
                            const firstAttempt = quizAttempts.find(a => a.attempt_number === 1);

                            return (
                              <div
                                key={quiz.id}
                                className="bg-bg-base/40 border border-border-subtle/70 hover:border-border-hover p-5 rounded-card flex flex-col justify-between space-y-4 hover:shadow-lg transition-all"
                              >
                                <div className="space-y-2">
                                  <h4 className="font-bold text-sm text-text-primary line-clamp-1">
                                    {quiz.title}
                                  </h4>
                                  <div className="flex items-center gap-4 text-xs text-text-secondary">
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-3.5 h-3.5 text-text-muted" />
                                      {quiz.timer_minutes} phút làm bài
                                    </span>
                                  </div>
                                </div>

                                {/* Attempt Score Metrics */}
                                <div className="bg-bg-surface/50 border border-border-subtle/50 rounded-standard p-3.5 flex items-center justify-between text-xs">
                                  {firstAttempt ? (
                                    <>
                                      <div className="space-y-1">
                                        <span className="text-[10px] text-text-muted uppercase block font-semibold">Lần đầu (Xếp hạng)</span>
                                        <span className="font-bold text-text-primary">
                                          Điểm: <strong className="text-accent-magenta text-sm">{firstAttempt.score}</strong>/{firstAttempt.max_score}
                                        </span>
                                        <span className="text-text-secondary text-[10px] block">
                                          Thời gian: {formatDuration(firstAttempt.duration_seconds)}
                                        </span>
                                      </div>
                                      <div className="text-right space-y-1">
                                        <span className="text-[10px] text-text-muted uppercase block font-semibold">Tập luyện</span>
                                        <span className="text-text-secondary text-[10px]">
                                          Tổng số lần làm: <strong className="text-text-primary font-bold">{attemptCount}</strong>
                                        </span>
                                      </div>
                                    </>
                                  ) : (
                                    <div className="flex items-center gap-1.5 py-1 text-text-secondary">
                                      <span className="w-1.5 h-1.5 rounded-full bg-warning animate-ping" />
                                      <span>Chưa thực hiện bài thi này</span>
                                    </div>
                                  )}
                                </div>

                                {/* Actions buttons */}
                                <div className="flex items-center gap-2 pt-1">
                                  {firstAttempt ? (
                                    <button
                                      onClick={() => {
                                        sessionStorage.setItem("display_name", studentName);
                                        sessionStorage.setItem("quiz_id", quiz.id);
                                        // Generate new session ID
                                        router.push(`/quiz/session-${Date.now()}`);
                                      }}
                                      className="flex-1 py-2 px-4 rounded-standard bg-bg-surface hover:bg-bg-hover text-text-primary border border-border-subtle text-xs font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer"
                                    >
                                      <RotateCcw className="w-3.5 h-3.5 text-text-muted" />
                                      <span>Làm lại thử</span>
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => {
                                        sessionStorage.setItem("display_name", studentName);
                                        sessionStorage.setItem("quiz_id", quiz.id);
                                        router.push(`/quiz/session-${Date.now()}`);
                                      }}
                                      className="flex-1 py-2 px-4 rounded-standard bg-primary hover:bg-primary-hover text-white text-xs font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer shadow shadow-primary/20"
                                    >
                                      <Play className="w-3.5 h-3.5 fill-white" />
                                      <span>Bắt đầu thi</span>
                                    </button>
                                  )}

                                  <Link
                                    href={`/course/${course.id}/leaderboard/${quiz.id}`}
                                    className="py-2 px-3.5 rounded-standard bg-bg-surface hover:bg-bg-hover text-text-primary border border-border-subtle hover:border-text-secondary text-xs font-semibold transition-all flex items-center justify-center gap-1"
                                    title="Xem Bảng xếp hạng của lớp"
                                  >
                                    <Award className="w-3.5 h-3.5 text-accent-magenta" />
                                    <span className="hidden sm:inline">Bảng xếp hạng</span>
                                  </Link>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-6 text-xs text-text-muted">
                          Hiện tại chưa có bài Quiz nào được mở trong lớp này.
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="glass-panel p-12 rounded-card text-center flex flex-col items-center justify-center border-dashed border-border-subtle">
              <BookOpen className="w-12 h-12 text-text-muted mb-4" />
              <h3 className="text-lg font-semibold text-text-primary mb-1">Chưa tham gia lớp học nào</h3>
              <p className="text-text-secondary text-sm mb-6 max-w-sm">
                Nhập mã Code do giáo viên cung cấp ở trang chủ để đăng ký tham gia lớp học.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 py-2.5 px-5 rounded-standard bg-primary hover:bg-primary-hover text-white font-medium text-sm transition-all focus-ring"
              >
                <span>Nhập mã Code ngay</span>
              </Link>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="w-full text-center text-xs text-text-muted py-6 mt-10 border-t border-border-subtle/30 flex flex-col gap-1">
          <span>© 2026 Quiz Intelligence. All rights reserved.</span>
          <span className="font-medium">Designed by <strong className="text-accent-magenta font-bold">Operation Intelligence</strong></span>
        </footer>
      </main>
    </div>
  );
}
