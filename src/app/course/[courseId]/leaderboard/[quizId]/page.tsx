"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  Users,
  Trophy,
  Medal,
  User,
  Zap,
  BarChart3
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { Quiz, Course } from "@/types";
import { HeaderControls } from "@/components/HeaderControls";
import { AppLogo } from "@/components/AppLogo";

interface RankedStudent {
  student_id: string;
  display_name: string;
  first_score: number;
  max_score: number;
  first_duration: number;
  total_attempts: number;
  created_at: string;
}

export default function LeaderboardPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const quizId = params.quizId as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [rankings, setRankings] = useState<RankedStudent[]>([]);
  const [currentStudentId, setCurrentStudentId] = useState<string | null>(null);
  const [backPath, setBackPath] = useState("/dashboard");

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      // 1. Load course & quiz
      const { data: courseData } = await supabase.from('courses').select('*').eq('id', courseId).single();
      if (courseData) setCourse(courseData as Course);

      const { data: quizData } = await supabase.from('quizzes').select('*').eq('id', quizId).single();
      if (quizData) setQuiz(quizData as Quiz);

      // 2. Determine back path (if student, back to student dashboard, else builder/dashboard)
      const savedStudentId = localStorage.getItem("student_id") || sessionStorage.getItem("student_id");
      if (savedStudentId) {
        setCurrentStudentId(savedStudentId);
        setBackPath("/student/dashboard");
      } else {
        setBackPath("/dashboard");
      }

      // 3. Load attempts and student names
      const { data: quizAttemptsData } = await supabase.from('attempts').select('*').eq('quiz_id', quizId);
      const quizAttempts = quizAttemptsData || [];

      const { data: membersData } = await supabase.from('course_members').select('student_id, student_name').eq('course_id', courseId);
      const membersMap = new Map();
      if (membersData) {
        membersData.forEach(m => membersMap.set(m.student_id, m.student_name));
      }

      // Group attempts by student
      const studentIds = Array.from(new Set(quizAttempts.map(a => a.student_id)));
      const groupedRankings: RankedStudent[] = studentIds.map(stId => {
        const studentQuizAttempts = quizAttempts.filter(a => a.student_id === stId);

        // Find First Attempt (attempt_number === 1)
        const firstAttempt = studentQuizAttempts.find(a => a.attempt_number === 1);

        // Resilient fallback if attempt_number 1 is missing, find earliest
        const sortedByTime = [...studentQuizAttempts].sort((a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        const mainAttempt = firstAttempt || sortedByTime[0];

        return {
          student_id: stId,
          display_name: membersMap.get(stId) || "Học viên ẩn danh",
          first_score: mainAttempt.score,
          max_score: 10,
          first_duration: mainAttempt.duration_seconds,
          total_attempts: studentQuizAttempts.length,
          created_at: mainAttempt.created_at
        };
      });

      // 4. Sort Rankings according to rules:
      // Rule 1: First Attempt Score (descending)
      // Rule 2: First Attempt Time Duration (ascending)
      // Rule 3: Total attempts count (ascending)
      groupedRankings.sort((a, b) => {
        // 1. Score desc
        if (b.first_score !== a.first_score) {
          return b.first_score - a.first_score;
        }
        // 2. Duration asc
        if (a.first_duration !== b.first_duration) {
          return a.first_duration - b.first_duration;
        }
        // 3. Attempts count asc
        return a.total_attempts - b.total_attempts;
      });

      setRankings(groupedRankings);
      setIsLoading(false);
    };

    loadData();
  }, [courseId, quizId]);

  // Format duration to mm:ss
  const formatDuration = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs.toString().padStart(2, "0")}`;
  };

  // Top 3 Podium
  const podium = [
    rankings[1], // 2nd place (left)
    rankings[0], // 1st place (center)
    rankings[2]  // 3rd place (right)
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-base text-text-primary p-6 md:p-12 font-sans relative overflow-hidden">
      {/* Glow effects */}
      <div className="absolute top-[-20%] left-[25%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[150px] pointer-events-none" />
      <div className="absolute top-[-20%] left-[45%] w-[40%] h-[40%] rounded-full bg-accent-magenta/10 blur-[150px] pointer-events-none" />

      <div className="max-w-4xl mx-auto z-10 relative">

        {/* App Logo */}
        <div className="flex items-center justify-start mt-4 mb-4 -ml-4 md:-ml-8">
          <AppLogo className="h-16 md:h-20 w-auto object-contain drop-shadow-sm" />
        </div>

        {/* Navigation & Header */}
        <div className="flex items-center justify-between gap-4 border-b border-border-subtle/30 pb-5">
          <div className="space-y-1">
            <Link
              href={backPath}
              className="inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary transition-colors mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay lại Dashboard</span>
            </Link>

            <h1 className="text-2xl font-bold tracking-tight">Bảng Xếp Hạng Lớp Học</h1>

            {course && quiz && (
              <p className="text-xs text-text-secondary">
                Lớp: <strong className="text-text-primary">{course.title}</strong> • Đề: <strong className="text-text-primary">{quiz.title}</strong>
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <HeaderControls />
            <Link
              href={`/course/${courseId}/analytics/${quizId}`}
              className="bg-bg-surface hover:bg-bg-hover border border-border-subtle/50 px-4 py-2 rounded-standard text-xs text-text-primary font-semibold flex items-center gap-2 transition-colors"
            >
              <BarChart3 className="w-4 h-4 text-primary" />
              <span>Phân tích</span>
            </Link>
            <div className="bg-bg-surface border border-border-subtle/50 px-4 py-2 rounded-standard text-xs text-text-secondary flex items-center gap-2">
              <Users className="w-4 h-4 text-text-muted" />
              <span>Sĩ số đã thi: <strong className="text-text-primary">{rankings.length}</strong></span>
            </div>
          </div>
        </div>

        {/* 1. Gamified Podium Section (Top 3) */}
        {rankings.length > 0 && (
          <div className="grid grid-cols-3 gap-2 sm:gap-6 items-end justify-center max-w-lg mx-auto pt-10 pb-6">

            {/* 2nd Place (Left) */}
            {podium[0] ? (
              <div className="flex flex-col items-center space-y-3 animate-in slide-in-from-bottom-8 duration-500 delay-100">
                <div className="relative">
                  <div className="w-14 h-14 rounded-full border-2 border-slate-400 bg-bg-surface flex items-center justify-center text-slate-400 font-bold overflow-hidden shadow-lg shadow-slate-400/5">
                    <User className="w-6 h-6" />
                  </div>
                  <div className="absolute -bottom-1.5 -right-1 w-6 h-6 bg-slate-400 text-bg-base border border-slate-300 rounded-full flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                </div>
                <div className="text-center w-full">
                  <span className="font-semibold text-xs text-text-primary block truncate max-w-[85px] mx-auto">
                    {podium[0].display_name}
                  </span>
                  <span className="text-[10px] text-slate-400 block font-bold mt-0.5">
                    {podium[0].first_score}/{podium[0].max_score} đ
                  </span>
                  <span className="text-[9px] text-text-muted block">
                    {formatDuration(podium[0].first_duration)}s
                  </span>
                </div>
                {/* Podium pillar */}
                <div className="w-full bg-slate-400/10 border-t border-x border-slate-400/25 h-16 rounded-t-card flex items-center justify-center">
                  <Medal className="w-6 h-6 text-slate-400/50" />
                </div>
              </div>
            ) : <div />}

            {/* 1st Place (Center - Higher) */}
            {podium[1] ? (
              <div className="flex flex-col items-center space-y-3 animate-in slide-in-from-bottom-12 duration-500">
                <div className="relative">
                  {/* Glowing Crown decoration */}
                  <Trophy className="w-5 h-5 text-warning absolute -top-4.5 left-1/2 -translate-x-1/2 animate-bounce" />

                  <div className="w-18 h-18 rounded-full border-2 border-warning bg-bg-surface flex items-center justify-center text-warning font-bold overflow-hidden shadow-xl shadow-warning/10">
                    <User className="w-8 h-8" />
                  </div>
                  <div className="absolute -bottom-1.5 -right-1 w-7 h-7 bg-warning text-bg-base border border-warning rounded-full flex items-center justify-center font-bold text-sm shadow">
                    1
                  </div>
                </div>
                <div className="text-center w-full">
                  <span className="font-bold text-sm text-text-primary block truncate max-w-[100px] mx-auto">
                    {podium[1].display_name}
                  </span>
                  <span className="text-xs text-warning block font-bold mt-0.5">
                    {podium[1].first_score}/{podium[1].max_score} đ
                  </span>
                  <span className="text-[10px] text-text-muted block">
                    {formatDuration(podium[1].first_duration)}s
                  </span>
                </div>
                {/* Podium pillar */}
                <div className="w-full bg-warning/10 border-t border-x border-warning/25 h-24 rounded-t-card flex items-center justify-center relative">
                  <Trophy className="w-8 h-8 text-warning/50" />
                </div>
              </div>
            ) : <div />}

            {/* 3rd Place (Right) */}
            {podium[2] ? (
              <div className="flex flex-col items-center space-y-3 animate-in slide-in-from-bottom-6 duration-500 delay-200">
                <div className="relative">
                  <div className="w-14 h-14 rounded-full border-2 border-amber-600 bg-bg-surface flex items-center justify-center text-amber-600 font-bold overflow-hidden shadow-lg shadow-amber-600/5">
                    <User className="w-6 h-6" />
                  </div>
                  <div className="absolute -bottom-1.5 -right-1 w-6 h-6 bg-amber-600 text-bg-base border border-amber-700 rounded-full flex items-center justify-center font-bold text-xs">
                    3
                  </div>
                </div>
                <div className="text-center w-full">
                  <span className="font-semibold text-xs text-text-primary block truncate max-w-[85px] mx-auto">
                    {podium[2].display_name}
                  </span>
                  <span className="text-[10px] text-amber-600 block font-bold mt-0.5">
                    {podium[2].first_score}/{podium[2].max_score} đ
                  </span>
                  <span className="text-[9px] text-text-muted block">
                    {formatDuration(podium[2].first_duration)}s
                  </span>
                </div>
                {/* Podium pillar */}
                <div className="w-full bg-amber-600/10 border-t border-x border-amber-600/25 h-12 rounded-t-card flex items-center justify-center">
                  <Medal className="w-6 h-6 text-amber-600/50" />
                </div>
              </div>
            ) : <div />}

          </div>
        )}

        {/* 2. Detailed Leaderboard List Table */}
        <div className="glass-panel rounded-card border border-border-subtle overflow-hidden">
          <div className="px-6 py-4 bg-bg-surface border-b border-border-subtle/50 flex items-center justify-between text-xs text-text-secondary font-bold uppercase tracking-wider">
            <span>Bảng điểm chi tiết (Lần làm đầu tiên)</span>
            <span className="text-[10px] text-text-muted lowercase italic normal-case font-normal">
              * Sắp xếp: Điểm cao nhất &gt; Thời gian nhanh nhất &gt; Ít lượt thi nhất
            </span>
          </div>

          <div className="divide-y divide-border-subtle/30">
            {rankings.map((student, index) => {
              const isCurrentUser = student.student_id === currentStudentId;

              return (
                <div
                  key={student.student_id}
                  className={`px-6 py-4 flex items-center justify-between transition-colors ${
                    isCurrentUser ? "bg-primary/5 font-semibold border-l-4 border-primary" : "hover:bg-bg-hover/20"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Rank number */}
                    <span className="w-6 text-center font-bold text-sm text-text-muted">
                      {index + 1}
                    </span>

                    {/* Student Name */}
                    <span className={`text-sm ${isCurrentUser ? "text-primary" : "text-text-primary"}`}>
                      {student.display_name}
                      {isCurrentUser && <span className="text-[10px] bg-primary/10 border border-primary/20 text-primary py-0.5 px-2 rounded-full font-bold ml-2">Bạn</span>}
                    </span>
                  </div>

                  {/* Metrics */}
                  <div className="flex items-center gap-6 sm:gap-12 text-sm text-right text-text-secondary">
                    {/* Score */}
                    <div className="w-16">
                      <span className="font-bold text-text-primary block">
                        {student.first_score}/{student.max_score}
                      </span>
                      <span className="text-[9px] text-text-muted uppercase block font-semibold">Điểm</span>
                    </div>

                    {/* Duration */}
                    <div className="w-20">
                      <span className="font-semibold text-text-primary flex items-center justify-end gap-1">
                        <Clock className="w-3.5 h-3.5 text-text-muted" />
                        {formatDuration(student.first_duration)}
                      </span>
                      <span className="text-[9px] text-text-muted uppercase block font-semibold">Thời gian</span>
                    </div>

                    {/* Attempts count */}
                    <div className="w-16 hidden sm:block">
                      <span className="font-semibold text-text-primary flex items-center justify-end gap-1">
                        <Zap className="w-3.5 h-3.5 text-text-muted" />
                        {student.total_attempts}
                      </span>
                      <span className="text-[9px] text-text-muted uppercase block font-semibold">Lượt làm</span>
                    </div>
                  </div>
                </div>
              );
            })}

            {rankings.length === 0 && (
              <div className="p-12 text-center text-sm text-text-muted">
                Chưa có dữ liệu lượt làm bài nào cho đề thi này.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="w-full text-center text-xs text-text-muted py-6 mt-10 border-t border-border-subtle/30 flex flex-col gap-1">
          <span>© 2026 Quiz Intelligence. All rights reserved.</span>
          <span className="font-medium">Designed by <strong className="text-accent-magenta font-bold">Operation Intelligence</strong></span>
        </footer>
      </div>
    </div>
  );
}
