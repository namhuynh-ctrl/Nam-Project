"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  Sparkles,
  Search,
  Trash2,
  Edit,
  Share2,
  FileText,
  Clock,
  Users,
  BarChart,
  ArrowLeft,
  Copy,
  Check,
  BookOpen,
  Award,
  X,
  Download,
  ShieldCheck
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { Quiz, Course, Attempt } from "@/types";
import { HeaderControls } from "@/components/HeaderControls";
import { getActiveCreatorId, PROTOTYPE_CREATOR_ID } from "@/lib/creatorAuth";
import { AppLogo } from "@/components/AppLogo";

export default function CreatorDashboard() {
  const router = useRouter();

  // Core Data States
  const [courses, setCourses] = useState<Course[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [creatorId, setCreatorId] = useState(PROTOTYPE_CREATOR_ID);

  // Navigation / Selection states
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Create Course Modal states
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [newCourseTitle, setNewCourseTitle] = useState("");
  const [newCourseCode, setNewCourseCode] = useState("");
  const [courseModalError, setCourseModalError] = useState("");
  const [claimInfo, setClaimInfo] = useState<{
    prototypeCourseCount: number;
    prototypeQuizCount: number;
  } | null>(null);
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimError, setClaimError] = useState<string | null>(null);
  const [exportingQuizId, setExportingQuizId] = useState<string | null>(null);
  const [exportStatus, setExportStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Share modal states
  const [activeShareQuiz, setActiveShareQuiz] = useState<Quiz | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Load Data from Supabase
  const fetchData = useCallback(async (activeCreatorId: string) => {
    setIsLoading(true);

    const { data: coursesData } = await supabase
      .from('courses')
      .select('*')
      .eq('creator_id', activeCreatorId)
      .order('created_at', { ascending: false });

    if (coursesData) {
      setCourses(coursesData as Course[]);
      if (coursesData.length > 0 && !selectedCourseId) {
        setSelectedCourseId(coursesData[0].id);
      }
    }

    const { data: quizzesData } = await supabase
      .from('quizzes')
      .select('*')
      .eq('creator_id', activeCreatorId)
      .order('created_at', { ascending: false });

    if (quizzesData) {
      setQuizzes(quizzesData as Quiz[]);
    }

    // Fetch all attempts for these quizzes
    if (quizzesData && quizzesData.length > 0) {
      const quizIds = quizzesData.map(q => q.id);
      const { data: attemptsData } = await supabase
        .from('attempts')
        .select('*')
        .in('quiz_id', quizIds);

      if (attemptsData) {
        setAttempts(attemptsData as Attempt[]);
      }
    }

    if (!quizzesData || quizzesData.length === 0) {
      setAttempts([]);
    }

    setIsLoading(false);
  }, [selectedCourseId]);

  useEffect(() => {
    const initDashboard = async () => {
      const activeCreatorId = await getActiveCreatorId();

      if (!activeCreatorId) {
        router.push("/");
        return;
      }

      setCreatorId(activeCreatorId);
      await fetchData(activeCreatorId);

      if (activeCreatorId !== PROTOTYPE_CREATOR_ID) {
        const { data } = await supabase.auth.getSession();
        const token = data.session?.access_token;

        if (token) {
          const response = await fetch("/api/claim-prototype-data", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const json = await response.json();

          if (response.ok && json.success && json.data?.hasPrototypeData) {
            setClaimInfo({
              prototypeCourseCount: json.data.prototypeCourseCount,
              prototypeQuizCount: json.data.prototypeQuizCount,
            });
          }
        }
      }
    };

    initDashboard();
  }, [fetchData, router]);

  const handleClaimPrototypeData = async () => {
    setIsClaiming(true);
    setClaimError(null);

    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;

      if (!token) {
        setClaimError("Bạn cần đăng nhập bằng Supabase Auth để nhận dữ liệu.");
        return;
      }

      const response = await fetch("/api/claim-prototype-data", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await response.json();

      if (!response.ok || !json.success) {
        setClaimError(json.error || "Không thể nhận dữ liệu prototype.");
        return;
      }

      setClaimInfo(null);
      await fetchData(creatorId);
    } catch (err) {
      console.error(err);
      setClaimError("Không thể kết nối tới API nhận dữ liệu.");
    } finally {
      setIsClaiming(false);
    }
  };

  const handleExportQuiz = async (quiz: Quiz) => {
    setExportStatus(null);
    setExportingQuizId(quiz.id);

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

      const response = await fetch(`/api/export-quiz/${quiz.id}`, {
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
      const safeTitle = quiz.title
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
        message: `Đã export "${quiz.title}" thành công.`,
      });
    } catch (err) {
      console.error(err);
      setExportStatus({
        type: "error",
        message: "Không thể kết nối tới API export.",
      });
    } finally {
      setExportingQuizId(null);
    }
  };

  // Filter quizzes of the selected course
  const selectedCourse = courses.find(c => c.id === selectedCourseId);
  const courseQuizzes = quizzes.filter(quiz =>
    quiz.course_id === selectedCourseId &&
    quiz.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate course level stats
  const totalCourseQuizzes = courseQuizzes.length;

  // Unique students who attempted quizzes in this course
  const courseQuizIds = quizzes.filter(q => q.course_id === selectedCourseId).map(q => q.id);
  const courseAttempts = attempts.filter(a => courseQuizIds.includes(a.quiz_id));
  const uniqueStudents = Array.from(new Set(courseAttempts.map(a => a.student_id))).length;

  // Average score of FIRST attempts inside this course
  const firstAttempts = courseAttempts.filter(a => a.attempt_number === 1);
  const avgScore = firstAttempts.length > 0
    ? (firstAttempts.reduce((sum, a) => sum + a.score, 0) / firstAttempts.length).toFixed(1)
    : "0.0";

  // Create Course Handler
  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setCourseModalError("");

    const title = newCourseTitle.trim();
    const code = newCourseCode.trim().toUpperCase();

    if (!title || !code) {
      setCourseModalError("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    // Check if code already exists via Supabase
    const { data: existing } = await supabase.from('courses').select('id').eq('code', code).maybeSingle();
    if (existing) {
      setCourseModalError("Mã Code này đã tồn tại, vui lòng đặt mã khác.");
      return;
    }

    const { data: newCourse, error } = await supabase.from('courses').insert({
      title,
      code,
      creator_id: creatorId
    }).select().single();

    if (error) {
      setCourseModalError("Có lỗi xảy ra: " + error.message);
      return;
    }

    if (newCourse) {
      setCourses([newCourse as Course, ...courses]);
      setSelectedCourseId(newCourse.id);
      setNewCourseTitle("");
      setNewCourseCode("");
      setIsCourseModalOpen(false);
    }
  };

  // Delete Course Handler
  const handleDeleteCourse = async (id: string) => {
    if (confirm("Xóa khóa học sẽ không xóa các Quiz bên trong, nhưng chúng sẽ bị ngắt liên kết. Bạn có chắc chắn muốn xóa?")) {
      const { error } = await supabase.from('courses').delete().eq('id', id);
      if (!error) {
        const updated = courses.filter(c => c.id !== id);
        setCourses(updated);
        if (selectedCourseId === id) {
          setSelectedCourseId(updated.length > 0 ? updated[0].id : null);
        }
      }
    }
  };

  // Handle delete quiz
  const handleDeleteQuiz = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa bộ câu hỏi này?")) {
      const { error } = await supabase.from('quizzes').delete().eq('id', id);
      if (!error) {
        setQuizzes(quizzes.filter(quiz => quiz.id !== id));
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-base text-text-primary p-6 md:p-12 font-sans relative">
      {/* Background glow decoration */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto z-10 relative">

        {/* App Logo */}
        <div className="flex items-center justify-start mb-6 -ml-4 md:-ml-8">
          <AppLogo className="h-16 md:h-20 w-auto object-contain drop-shadow-sm" />
        </div>

        {/* Navigation / Top Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-4 mb-3">
              <Link href="/" className="inline-flex items-center gap-1.5 text-text-muted hover:text-text-primary text-sm transition-colors">
                <ArrowLeft className="w-4 h-4" />
                <span>Về trang chủ</span>
              </Link>
              <button
                onClick={() => {
                  supabase.auth.signOut().finally(() => {
                    localStorage.removeItem("is_teacher");
                    localStorage.removeItem("teacher_id");
                    router.push("/");
                  });
                }}
                className="inline-flex items-center gap-1.5 text-danger hover:text-danger/80 text-xs font-semibold py-1 px-2.5 rounded border border-danger/20 bg-danger/5 transition-colors"
              >
                Đăng xuất (Khóa máy)
              </button>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Bảng Quản Lý Giáo Viên</h1>
            <p className="text-text-secondary text-sm">Quản lý lớp học (Course), soạn đề thi Quiz và theo dõi bảng xếp hạng.</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCourseModalOpen(true)}
              className="inline-flex items-center gap-2 py-2.5 px-4 rounded-standard bg-bg-surface hover:bg-bg-hover border border-border-subtle hover:border-text-secondary text-text-primary font-medium text-sm transition-all focus-ring shadow"
            >
              <Plus className="w-4 h-4 text-accent-magenta" />
              <span>Tạo khóa học mới</span>
            </button>

            {/* Theme Toggle */}
            <HeaderControls />

            {selectedCourseId && (
              <>
                <Link
                  href={`/builder/new?course_id=${selectedCourseId}&ai=true`}
                  className="inline-flex items-center gap-2 py-2.5 px-4 rounded-standard bg-bg-surface hover:bg-bg-hover border border-border-subtle hover:border-accent-magenta text-text-primary font-medium text-sm transition-all focus-ring shadow"
                >
                  <Sparkles className="w-4 h-4 text-accent-magenta animate-pulse" />
                  <span>Tạo Quiz bằng AI</span>
                </Link>
                <Link
                  href={`/builder/new?course_id=${selectedCourseId}`}
                  className="inline-flex items-center gap-2 py-2.5 px-4 rounded-standard bg-primary hover:bg-primary-hover text-white font-medium text-sm transition-all focus-ring shadow shadow-primary/10"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tạo Quiz thủ công</span>
                </Link>
              </>
            )}
          </div>
        </div>

        {claimInfo && (
          <div className="glass-panel rounded-card border border-primary/25 bg-primary/5 p-4 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-standard bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-sm text-text-primary">Có dữ liệu prototype đang chờ nhận</h2>
                <p className="text-xs text-text-secondary mt-0.5">
                  {claimInfo.prototypeCourseCount} khóa học và {claimInfo.prototypeQuizCount} quiz hiện thuộc creator-1. Nhận dữ liệu để chuyển sang tài khoản giáo viên đang đăng nhập.
                </p>
                {claimError && (
                  <p className="text-xs text-danger mt-2 font-medium">{claimError}</p>
                )}
              </div>
            </div>
            <button
              onClick={handleClaimPrototypeData}
              disabled={isClaiming}
              className="inline-flex items-center justify-center gap-2 py-2 px-4 rounded-standard bg-primary hover:bg-primary-hover disabled:opacity-60 text-white text-xs font-semibold transition-all shrink-0"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isClaiming ? "Đang nhận..." : "Nhận dữ liệu prototype"}</span>
            </button>
          </div>
        )}

        {exportStatus && (
          <div className={`glass-panel rounded-card p-4 mb-8 border ${
            exportStatus.type === "success"
              ? "border-success/25 bg-success/5 text-success"
              : "border-danger/25 bg-danger/5 text-danger"
          }`}>
            <p className="text-xs font-semibold">{exportStatus.message}</p>
          </div>
        )}

        {/* Sidebar + Main workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* 1. Left Side: Courses Navigation List */}
          <aside className="space-y-4">
            <div className="flex items-center justify-between text-xs font-semibold text-text-secondary uppercase tracking-wider px-2">
              <span>Danh sách khóa học ({courses.length})</span>
            </div>

            <div className="space-y-1.5">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className={`w-full p-3 rounded-standard text-sm flex items-center justify-between transition-all group border ${
                    selectedCourseId === course.id
                      ? "bg-primary/10 border-primary/30 text-primary font-semibold"
                      : "bg-bg-surface/50 border-transparent hover:bg-bg-hover text-text-secondary"
                  }`}
                >
                  <button
                    onClick={() => setSelectedCourseId(course.id)}
                    className="flex-1 text-left truncate flex items-center gap-2 cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4 shrink-0" />
                    <span className="truncate">{course.title}</span>
                  </button>

                  {/* Delete Course button */}
                  <button
                    onClick={() => handleDeleteCourse(course.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-text-muted hover:text-danger rounded hover:bg-danger/10 transition-all cursor-pointer"
                    title="Xóa khóa học"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {courses.length === 0 && (
                <div className="text-center py-8 text-xs text-text-muted border border-dashed border-border-subtle rounded-standard p-4">
                  Chưa có khóa học nào. Hãy tạo khóa học để bắt đầu.
                </div>
              )}
            </div>
          </aside>

          {/* 2. Right Side: Selected Course Details and Quizzes */}
          <main className="lg:col-span-3 space-y-8">
            {selectedCourse ? (
              <div className="space-y-8">
                {/* Course Banner with Stats */}
                <div className="glass-panel p-6 rounded-card border border-border-subtle flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <h2 className="text-xl font-bold text-text-primary mb-1 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-accent-magenta" />
                      {selectedCourse.title}
                    </h2>
                    <span className="text-xs text-text-secondary">
                      Mã Code Lớp Học học sinh tự tham gia: <strong className="font-mono text-primary font-bold uppercase tracking-wider text-sm select-all">{selectedCourse.code}</strong>
                    </span>
                  </div>

                  {/* Course metrics */}
                  <div className="flex gap-6 shrink-0 border-t md:border-t-0 md:border-l border-border-subtle/30 pt-4 md:pt-0 md:pl-6 text-xs">
                    <div className="space-y-1">
                      <span className="text-[10px] text-text-secondary uppercase block">Số lượng đề</span>
                      <strong className="text-lg text-text-primary block">{totalCourseQuizzes}</strong>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-text-secondary uppercase block">Số học viên</span>
                      <strong className="text-lg text-text-primary block">{uniqueStudents}</strong>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-text-secondary uppercase block">Điểm TB Lớp</span>
                      <strong className="text-lg text-success block">{avgScore}/10</strong>
                    </div>
                  </div>
                </div>

                {/* Sub-Header bar for search */}
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-bold text-sm text-text-primary uppercase tracking-wide">Bài tập kiểm tra (Quiz)</h3>

                  {/* Search input inside Course */}
                  <div className="relative w-64">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                      <Search className="w-3.5 h-3.5" />
                    </span>
                    <input
                      type="text"
                      placeholder="Tìm kiếm Quiz..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 bg-bg-surface border border-border-subtle rounded-standard text-xs text-text-primary placeholder-text-muted focus:outline-none focus:border-primary transition-all focus-ring"
                    />
                  </div>
                </div>

                {/* Quizzes List under selected course */}
                {courseQuizzes.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {courseQuizzes.map((quiz) => {
                      const quizQuizAttempts = attempts.filter(a => a.quiz_id === quiz.id);
                      const quizFirstAttempts = quizQuizAttempts.filter(a => a.attempt_number === 1);
                      const quizAvgScore = quizFirstAttempts.length > 0
                        ? (quizFirstAttempts.reduce((sum, a) => sum + a.score, 0) / quizFirstAttempts.length).toFixed(1)
                        : "0.0";

                      return (
                        <div
                          key={quiz.id}
                          className="glass-panel p-6 rounded-card border border-border-subtle flex flex-col justify-between hover:border-border-hover transition-all duration-300 shadow-md hover:shadow-lg"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-4">
                              {/* Status badge */}
                              {quiz.status === "published" ? (
                                <span className="inline-flex items-center gap-1 py-1 px-2 rounded-standard bg-success/10 border border-success/20 text-success text-[10px] font-bold uppercase tracking-wide">
                                  Đã xuất bản
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 py-1 px-2 rounded-standard bg-warning/10 border border-warning/20 text-warning text-[10px] font-bold uppercase tracking-wide">
                                  Bản nháp
                                </span>
                              )}
                              <span className="text-[10px] text-text-muted">
                                {quiz.created_at ? new Date(quiz.created_at).toLocaleDateString("vi-VN") : "Hôm nay"}
                              </span>
                            </div>

                            <h4 className="text-base font-semibold text-text-primary mb-3 line-clamp-2 leading-snug">
                              {quiz.title}
                            </h4>

                            {/* Quizzes details */}
                            <div className="flex flex-wrap items-center gap-3 text-[11px] text-text-secondary mb-6 border-b border-border-subtle/30 pb-4">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-text-muted" />
                                {quiz.timer_minutes} phút
                              </span>
                              {quiz.status === "published" && (
                                <>
                                  <span className="w-1 h-1 bg-border-subtle rounded-full" />
                                  <span className="flex items-center gap-1">
                                    <Users className="w-3.5 h-3.5 text-text-muted" />
                                    {quizQuizAttempts.length} lượt làm
                                  </span>
                                  <span className="w-1 h-1 bg-border-subtle rounded-full" />
                                  <span className="flex items-center gap-1">
                                    <BarChart className="w-3.5 h-3.5 text-text-muted" />
                                    Điểm TB: {quizAvgScore}/10
                                  </span>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center justify-between gap-2 mt-2">
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => {
                                  setActiveShareQuiz(quiz);
                                  setCopiedLink(false);
                                  setCopiedCode(false);
                                }}
                                disabled={quiz.status !== "published"}
                                className={`flex items-center gap-1 text-[11px] py-1.5 px-3 rounded-standard font-medium transition-all ${
                                  quiz.status === "published"
                                    ? "bg-bg-surface hover:bg-bg-hover text-text-primary border border-border-subtle hover:border-text-secondary cursor-pointer"
                                    : "bg-bg-surface text-text-muted border border-border-subtle/30 cursor-not-allowed opacity-50"
                                }`}
                              >
                                <Share2 className="w-3 h-3" />
                                <span>Chia sẻ</span>
                              </button>

                              <Link
                                href={`/builder/${quiz.id}`}
                                className="flex items-center gap-1 text-[11px] py-1.5 px-3 rounded-standard bg-bg-surface hover:bg-bg-hover text-text-primary border border-border-subtle hover:border-text-secondary font-medium transition-all"
                              >
                                <Edit className="w-3.5 h-3.5" />
                                <span>Sửa</span>
                              </Link>

                              {quiz.status === "published" && (
                                <Link
                                  href={`/course/${selectedCourseId}/leaderboard/${quiz.id}`}
                                  className="flex items-center gap-1 text-[11px] py-1.5 px-3 rounded-standard bg-bg-surface hover:bg-bg-hover text-text-primary border border-border-subtle hover:border-text-secondary font-medium transition-all"
                                  title="Xem bảng xếp hạng"
                                >
                                  <Award className="w-3.5 h-3.5 text-accent-magenta" />
                                  <span>Xếp hạng</span>
                                </Link>
                              )}

                              {quiz.status === "published" && (
                                <Link
                                  href={`/course/${selectedCourseId}/analytics/${quiz.id}`}
                                  className="flex items-center gap-1 text-[11px] py-1.5 px-3 rounded-standard bg-bg-surface hover:bg-bg-hover text-text-primary border border-border-subtle hover:border-text-secondary font-medium transition-all"
                                  title="Xem phân tích câu hỏi"
                                >
                                  <BarChart className="w-3.5 h-3.5 text-primary" />
                                  <span>Phân tích</span>
                                </Link>
                              )}

                              {quiz.status === "published" && (
                                <button
                                  type="button"
                                  onClick={() => handleExportQuiz(quiz)}
                                  disabled={exportingQuizId === quiz.id}
                                  className="flex items-center gap-1 text-[11px] py-1.5 px-3 rounded-standard bg-bg-surface hover:bg-bg-hover disabled:opacity-60 disabled:cursor-wait text-text-primary border border-border-subtle hover:border-text-secondary font-medium transition-all"
                                  title="Xuất kết quả CSV"
                                >
                                  <Download className="w-3.5 h-3.5 text-success" />
                                  <span>{exportingQuizId === quiz.id ? "Đang export" : "Export"}</span>
                                </button>
                              )}
                            </div>

                            <button
                              onClick={() => handleDeleteQuiz(quiz.id)}
                              className="p-1.5 text-text-muted hover:text-danger hover:bg-danger/10 rounded transition-all cursor-pointer"
                              title="Xóa đề thi"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="glass-panel p-12 rounded-card text-center flex flex-col items-center justify-center border-dashed border-border-subtle">
                    <FileText className="w-12 h-12 text-text-muted mb-4" />
                    <h4 className="text-base font-semibold text-text-primary mb-1">Chưa có đề thi nào trong lớp học này</h4>
                    <p className="text-text-secondary text-xs mb-6 max-w-sm">
                      Chọn nút tạo đề thi bằng AI hoặc tạo thủ công ở phía trên góc phải để bổ sung bài tập kiểm tra cho lớp.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="glass-panel p-16 rounded-card text-center flex flex-col items-center justify-center border-dashed border-border-subtle">
                <BookOpen className="w-12 h-12 text-text-muted mb-4" />
                <h3 className="text-lg font-semibold text-text-primary mb-1">Chưa chọn khóa học nào</h3>
                <p className="text-text-secondary text-sm mb-6 max-w-sm">
                  Hãy chọn một khóa học ở menu bên trái, hoặc nhấn nút tạo khóa học mới để bắt đầu thiết lập lớp.
                </p>
                <button
                  onClick={() => setIsCourseModalOpen(true)}
                  className="inline-flex items-center gap-2 py-2.5 px-5 rounded-standard bg-primary hover:bg-primary-hover text-white font-medium text-sm transition-all focus-ring shadow"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tạo khóa học mới</span>
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* 3. Modal: Create Course Dialog */}
      {isCourseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="glass-panel w-full max-w-md rounded-card border border-border-subtle p-6 space-y-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border-subtle/30 pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-base text-text-primary">Tạo Khóa Học Mới</h3>
              </div>
              <button
                onClick={() => setIsCourseModalOpen(false)}
                className="p-1 hover:bg-bg-hover rounded-standard text-text-secondary hover:text-text-primary transition-colors text-sm font-semibold"
              >
                Đóng
              </button>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleCreateCourse} className="space-y-4">
              {courseModalError && (
                <div className="p-3 bg-danger/10 border border-danger/25 text-danger rounded-standard text-xs font-medium flex items-center gap-1.5">
                  <X className="w-4 h-4 shrink-0" />
                  <span>{courseModalError}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Tên lớp / Tên khóa học</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Lớp Toán Đại Số 10-A"
                  value={newCourseTitle}
                  onChange={(e) => setNewCourseTitle(e.target.value)}
                  className="w-full bg-bg-base border border-border-subtle rounded-standard px-3 py-2.5 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-primary transition-all focus-ring"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Mã Code tự chọn</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: TOAN10A"
                  value={newCourseCode}
                  onChange={(e) => setNewCourseCode(e.target.value.replace(/\s+/g, ""))}
                  className="w-full bg-bg-base border border-border-subtle rounded-standard px-3 py-2.5 text-sm text-text-primary font-mono font-bold uppercase placeholder-text-muted focus:outline-none focus:border-primary transition-all focus-ring"
                />
                <span className="text-[10px] text-text-muted block mt-1">* Mã viết liền không dấu, dùng để học sinh nhập tham gia.</span>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-standard bg-primary hover:bg-primary-hover text-white text-sm font-semibold transition-all shadow-lg shadow-primary/10 cursor-pointer"
              >
                Tạo lớp học
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 4. Share Modal Overlay */}
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
                <Image
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                    `${window.location.origin}/play/${activeShareQuiz.id}`
                  )}`}
                  alt="QR Code"
                  width={180}
                  height={180}
                  unoptimized
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

      {/* Footer */}
      <footer className="mt-12 text-center text-[10px] text-text-muted border-t border-border-subtle/20 pt-6 flex flex-col gap-1 z-10 relative">
        <span>© 2026 Quiz Intelligence.</span>
        <span className="font-medium text-[11px]">Designed by <strong className="text-accent-magenta font-bold">Operation Intelligence</strong></span>
      </footer>
    </div>
  );
}
