"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, PlayCircle, BookOpen, AlertCircle, Lock, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { HeaderControls } from "@/components/HeaderControls";
import { useLanguage } from "@/contexts/LanguageContext";
import { AppLogo } from "@/components/AppLogo";

export default function Home() {
  const router = useRouter();
  const { t } = useLanguage();
  const isPinLoginEnabled = process.env.NEXT_PUBLIC_ENABLE_PIN_LOGIN === "true";
  const [joinCode, setJoinCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  // Teacher Auth State
  const [showTeacherLogin, setShowTeacherLogin] = useState(false);
  const [teacherPin, setTeacherPin] = useState("");
  const [teacherEmail, setTeacherEmail] = useState("");
  const [teacherPassword, setTeacherPassword] = useState("");
  const [teacherLoginMode, setTeacherLoginMode] = useState<"auth" | "pin">("auth");
  const [teacherLoading, setTeacherLoading] = useState(false);
  const [teacherError, setTeacherError] = useState<string | null>(null);
  useEffect(() => {
    const initAuth = async () => {
      const { data } = await supabase.auth.getSession();
      const isTeacher = localStorage.getItem("is_teacher") === "true" || Boolean(data.session?.user);
      const studentId = localStorage.getItem("student_id");

      if (data.session?.user) {
        localStorage.setItem("is_teacher", "true");
        localStorage.setItem("teacher_id", data.session.user.id);
      }

      if (isTeacher) {
        router.push("/dashboard");
      } else if (studentId) {
        router.push("/student/dashboard");
      }
    };

    initAuth();
  }, [router]);

  const handleJoinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = joinCode.trim();
    if (!trimmed) return;

    setLoading(true);
    setError(null);

    try {
      // Check if it is a course code in Supabase
      const { data } = await supabase
        .from('courses')
        .select('code')
        .ilike('code', trimmed)
        .single();

      if (data) {
        router.push(`/join-course/${encodeURIComponent(data.code)}`);
      } else {
        setError(`Không tìm thấy lớp học với mã "${trimmed}". Vui lòng kiểm tra lại.`);
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setError("Đã xảy ra lỗi khi kiểm tra mã. Vui lòng thử lại.");
      setLoading(false);
    }
  };

  const handleTeacherLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setTeacherError(null);
    setTeacherLoading(true);

    try {
      if (teacherLoginMode === "pin") {
        if (!isPinLoginEnabled) {
          setTeacherError("Đăng nhập bằng PIN đang bị tắt.");
          return;
        }

        if (teacherPin === "686868") {
          localStorage.setItem("is_teacher", "true");
          localStorage.setItem("teacher_id", "creator-1");
          localStorage.removeItem("student_id");
          localStorage.removeItem("student_name");
          router.push("/dashboard");
        } else {
          setTeacherError("Mã PIN không chính xác!");
        }
        return;
      }

      const email = teacherEmail.trim();
      const password = teacherPassword;

      if (!email || !password) {
        setTeacherError("Vui lòng nhập email và mật khẩu.");
        return;
      }

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError || !data.user) {
        setTeacherError(authError?.message || "Không thể đăng nhập giáo viên.");
        return;
      }

      localStorage.setItem("is_teacher", "true");
      localStorage.setItem("teacher_id", data.user.id);
      localStorage.removeItem("student_id");
      localStorage.removeItem("student_name");
      router.push("/dashboard");
    } finally {
      setTeacherLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-base flex flex-col justify-between p-6 md:p-12 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-accent-magenta/10 blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="max-w-6xl mx-auto w-full flex items-center justify-between z-10">
        <div className="flex items-center">
          <AppLogo className="h-20 md:h-24 w-auto object-contain drop-shadow-sm" />
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-text-muted hidden sm:block">
            v1.0.0
          </div>
          <HeaderControls />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto w-full flex flex-col items-center justify-center my-12 z-10 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border-subtle bg-bg-surface text-xs text-text-secondary mb-6">
          <Sparkles className="w-3.5 h-3.5 text-accent-magenta animate-pulse" />
          <span>{t.aiSlogan}</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 max-w-2xl leading-tight">
          {t.heroTitle1}{" "}
          <span className="bg-gradient-to-r from-primary to-accent-magenta bg-clip-text text-transparent drop-shadow-sm">
            {t.heroTitle2}
          </span>
        </h1>

        <p className="text-text-secondary text-lg max-w-xl mb-12">
          {t.heroDesc}
        </p>

        {/* Portals Grid */}
        <div className="grid md:grid-cols-2 gap-8 w-full max-w-3xl">
          {/* Creator Card */}
          <div className="glass-panel rounded-card p-8 flex flex-col items-start text-left relative overflow-hidden transition-all duration-300 hover:border-primary/30 group hover:translate-y-[-4px] hover:shadow-2xl hover:shadow-primary/5">
            <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-300">
              <BookOpen className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-semibold text-text-primary mb-2">{t.teacherCardTitle}</h2>
            <p className="text-text-secondary text-sm mb-8 flex-grow leading-relaxed">
              {t.teacherCardDesc}
            </p>

            {showTeacherLogin ? (
              <form onSubmit={handleTeacherLogin} className="w-full space-y-3">
                <div className={`${isPinLoginEnabled ? "grid-cols-2" : "grid-cols-1"} grid gap-2 p-1 rounded-standard bg-bg-surface border border-border-subtle`}>
                  <button
                    type="button"
                    onClick={() => setTeacherLoginMode("auth")}
                    className={`py-1.5 rounded text-xs font-semibold transition-all ${
                      teacherLoginMode === "auth" ? "bg-primary text-white" : "text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    Email
                  </button>
                  {isPinLoginEnabled && (
                    <button
                      type="button"
                      onClick={() => setTeacherLoginMode("pin")}
                      className={`py-1.5 rounded text-xs font-semibold transition-all ${
                        teacherLoginMode === "pin" ? "bg-primary text-white" : "text-text-secondary hover:text-text-primary"
                      }`}
                    >
                      PIN
                    </button>
                  )}
                </div>

                {teacherLoginMode === "auth" ? (
                  <div className="space-y-2">
                    <input
                      type="email"
                      autoFocus
                      placeholder="teacher@example.com"
                      value={teacherEmail}
                      onChange={(e) => setTeacherEmail(e.target.value)}
                      className={`w-full bg-bg-surface border rounded-standard px-3 py-2 text-sm text-text-primary placeholder-text-muted focus:outline-none transition-all focus-ring ${
                        teacherError ? 'border-danger focus:border-danger focus:ring-danger/20' : 'border-border-subtle focus:border-primary focus:ring-primary/20'
                      }`}
                    />
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-4 w-4 text-text-muted" />
                        </div>
                        <input
                          type="password"
                          placeholder="Mật khẩu"
                          value={teacherPassword}
                          onChange={(e) => setTeacherPassword(e.target.value)}
                          className={`w-full bg-bg-surface border rounded-standard pl-9 pr-3 py-2 text-sm text-text-primary placeholder-text-muted focus:outline-none transition-all focus-ring ${
                            teacherError ? 'border-danger focus:border-danger focus:ring-danger/20' : 'border-border-subtle focus:border-primary focus:ring-primary/20'
                          }`}
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={teacherLoading}
                        className="py-2 px-3 rounded-standard bg-primary hover:bg-primary-hover disabled:opacity-60 text-white text-sm font-semibold transition-all focus-ring shadow-lg shadow-primary/10 shrink-0"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-4 w-4 text-text-muted" />
                      </div>
                      <input
                        type="password"
                        autoFocus
                        placeholder={t.teacherPinPlaceholder}
                        value={teacherPin}
                        onChange={(e) => setTeacherPin(e.target.value)}
                        className={`w-full bg-bg-surface border rounded-standard pl-9 pr-3 py-2 text-sm font-mono tracking-widest text-text-primary placeholder-text-muted focus:outline-none transition-all focus-ring ${
                          teacherError ? 'border-danger focus:border-danger focus:ring-danger/20' : 'border-border-subtle focus:border-primary focus:ring-primary/20'
                        }`}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={teacherLoading}
                      className="py-2 px-3 rounded-standard bg-primary hover:bg-primary-hover disabled:opacity-60 text-white text-sm font-semibold transition-all focus-ring shadow-lg shadow-primary/10 shrink-0"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
                {teacherError && (
                  <div className="flex items-center gap-1.5 text-xs text-danger font-medium">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{teacherError}</span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setShowTeacherLogin(false);
                    setTeacherError(null);
                    setTeacherPin("");
                    setTeacherPassword("");
                  }}
                  className="text-[10px] text-text-muted hover:text-text-primary transition-colors underline underline-offset-2"
                >
                  Hủy bỏ
                </button>
              </form>
            ) : (
              <button
                onClick={() => setShowTeacherLogin(true)}
                className="w-full text-center py-3 px-6 rounded-standard bg-primary hover:bg-primary-hover text-white font-medium transition-all duration-200 focus-ring shadow-lg shadow-primary/15 cursor-pointer flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>{t.teacherLoginBtn}</span>
              </button>
            )}
          </div>

          {/* Participant Card */}
          <div className="glass-panel rounded-card p-8 flex flex-col items-start text-left relative overflow-hidden transition-all duration-300 hover:border-accent-magenta/30 group hover:translate-y-[-4px] hover:shadow-2xl hover:shadow-accent-magenta/5">
            <div className="w-12 h-12 rounded-lg bg-accent-magenta/10 text-accent-magenta flex items-center justify-center mb-6 group-hover:bg-accent-magenta group-hover:text-white transition-all duration-300">
              <PlayCircle className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-semibold text-text-primary mb-2">{t.studentCardTitle}</h2>
            <p className="text-text-secondary text-sm mb-4 leading-relaxed">
              {t.studentCardDesc}
            </p>

            {/* Join Code Input Form */}
            <form onSubmit={handleJoinSubmit} className="w-full space-y-3 mb-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder={t.joinPlaceholder}
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  className={`flex-1 bg-bg-surface border rounded-standard px-3 py-2 text-sm text-text-primary placeholder-text-muted focus:outline-none transition-all focus-ring ${
                    error ? 'border-danger focus:border-danger focus:ring-danger/20' : 'border-border-subtle focus:border-accent-magenta focus:ring-accent-magenta/20'
                  }`}
                />
                <button
                  type="submit"
                  disabled={!joinCode.trim() || loading}
                  className="py-2 px-4 rounded-standard bg-accent-magenta hover:bg-accent-magenta-hover disabled:bg-bg-surface disabled:text-text-muted disabled:border-border-subtle disabled:cursor-not-allowed text-white text-sm font-semibold transition-all focus-ring shadow-lg shadow-accent-magenta/10 shrink-0"
                >
                  {loading ? t.checking : t.joinBtn}
                </button>
              </div>

              {error && (
                <div className="flex items-center gap-1.5 text-xs text-danger font-medium text-left">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </form>

            <div className="w-full border-t border-border-subtle/30 my-2 pt-2">
              <span className="text-[10px] text-text-muted block mb-2 font-bold uppercase tracking-wider">{t.orTryClass}</span>
              <button
                type="button"
                onClick={() => {
                  setJoinCode("CF2610");
                }}
                className="w-full text-center py-2 px-6 rounded-standard bg-bg-surface hover:bg-bg-hover text-text-primary border border-border-subtle hover:border-text-secondary text-xs font-semibold transition-all duration-200 focus-ring"
              >
                {t.quickJoin}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto w-full text-center text-xs text-text-muted pt-8 border-t border-border-subtle/30 z-10 flex flex-col gap-1">
        <span>{t.footerCopyright}</span>
        <span className="font-medium">{t.footerDesign}</span>
      </footer>
    </div>
  );
}
