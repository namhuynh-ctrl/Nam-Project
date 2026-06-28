"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, UserPlus, BookOpen, AlertCircle, CheckCircle2, Lock } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { Course } from "@/types";
import { HeaderControls } from "@/components/HeaderControls";
import { AppLogo } from "@/components/AppLogo";

export default function JoinCourse() {
  const router = useRouter();
  const params = useParams();
  const code = params.code as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [studentName, setStudentName] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [existingStudent, setExistingStudent] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    const initData = async () => {
      // Load course by code
      const { data: courseData } = await supabase
        .from('courses')
        .select('*')
        .ilike('code', code)
        .maybeSingle();

      if (courseData) {
        setCourse(courseData as Course);
      }
      setIsPageLoading(false);

      // Check if student profile already exists in local storage
      const savedName = localStorage.getItem("student_name");
      const savedId = localStorage.getItem("student_id");
      if (savedName && savedId) {
        setExistingStudent({ id: savedId, name: savedName });
      }
    };
    initData();
  }, [code]);

  const handleNameChange = (val: string) => {
    if (val.startsWith(" ")) val = val.trimStart();
    setStudentName(val);
    if (val.length > 20) {
      setError("Tên tối đa 20 ký tự");
    } else if (val.trim().length > 0 && val.trim().length < 2) {
      setError("Tên tối thiểu 2 ký tự");
    } else {
      setError(null);
    }
  };

  const handlePinChange = (val: string) => {
    // Only allow numbers, max 4 chars
    const numeric = val.replace(/[^0-9]/g, '');
    if (numeric.length <= 4) {
      setPinCode(numeric);
    }
    setError(null); // Clear error on pin change
  };

  const updateJoinedCoursesLocal = (courseId: string) => {
    const savedJoined = localStorage.getItem("joined_courses");
    const joined = savedJoined ? JSON.parse(savedJoined) : [];
    if (!joined.includes(courseId)) {
      joined.push(courseId);
    }
    localStorage.setItem("joined_courses", JSON.stringify(joined));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = studentName.trim();
    if (trimmedName.length < 2 || trimmedName.length > 20) {
      setError("Tên phải từ 2 đến 20 ký tự.");
      return;
    }
    if (pinCode.length < 4) {
      setError("Mã PIN phải đủ 4 số.");
      return;
    }
    if (!course) return;

    setLoading(true);

    // Check if name exists in course
    const { data: member } = await supabase
      .from('course_members')
      .select('*')
      .eq('course_id', course.id)
      .ilike('student_name', trimmedName)
      .maybeSingle();

    if (member) {
      // Name exists! Check PIN
      if (member.pin_code === pinCode) {
        // Success login
        localStorage.setItem("student_id", member.student_id);
        localStorage.setItem("student_name", member.student_name);
        localStorage.removeItem("is_teacher");
        updateJoinedCoursesLocal(course.id);
        localStorage.removeItem("is_teacher");
        router.push("/student/dashboard");
      } else {
        // Wrong PIN
        setLoading(false);
        setError("Tên này đã có người dùng. Nếu là bạn, hãy nhập đúng mã PIN. Nếu là người mới, vui lòng đổi tên khác (VD: Thêm số 2).");
      }
    } else {
      // New student
      const studentId = crypto.randomUUID();
      const { error: insertErr } = await supabase.from('course_members').insert({
        course_id: course.id,
        student_id: studentId,
        student_name: trimmedName,
        pin_code: pinCode
      });

      if (insertErr) {
        setLoading(false);
        setError("Có lỗi xảy ra khi lưu vào hệ thống. Vui lòng thử lại.");
        console.error(insertErr);
        return;
      }

      localStorage.setItem("student_id", studentId);
      localStorage.setItem("student_name", trimmedName);
      localStorage.removeItem("is_teacher");
      updateJoinedCoursesLocal(course.id);
      localStorage.removeItem("is_teacher");
      router.push("/student/dashboard");
    }
  };

  const handleContinueWithExisting = async () => {
    if (!course || !existingStudent) return;
    setLoading(true);

    // Make sure they are in course_members
    const { data: member } = await supabase
      .from('course_members')
      .select('id')
      .eq('course_id', course.id)
      .eq('student_id', existingStudent.id)
      .maybeSingle();

    if (!member) {
      // Link them to this new course
      await supabase.from('course_members').insert({
        course_id: course.id,
        student_id: existingStudent.id,
        student_name: existingStudent.name,
        pin_code: "0000" // Fallback PIN if they are just linked
      });
    }

    updateJoinedCoursesLocal(course.id);
    setLoading(false);
    router.push("/student/dashboard");
  };

  if (isPageLoading) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-base text-text-primary flex flex-col justify-between p-6 relative overflow-hidden font-sans">
      {/* Background glow */}
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-accent-magenta/5 blur-[120px] pointer-events-none" />

      {/* Navigation Header */}
      <div className="max-w-md mx-auto w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 z-10 relative">
        <AppLogo className="h-10 md:h-12 w-auto object-contain -ml-2 md:-ml-4 drop-shadow-sm" />

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-text-secondary hover:text-text-primary bg-bg-surface/50 px-3 py-1.5 rounded-full border border-border-subtle hover:border-text-secondary transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Về trang chủ</span>
          </Link>
          <HeaderControls />
        </div>
      </div>

      {/* Main Box */}
      <main className="max-w-md w-full mx-auto my-12 z-10 flex flex-col items-center justify-center">
        {course ? (
          <div className="w-full space-y-6">
            <div className="text-center space-y-2">
              <span className="inline-flex items-center gap-1 py-1 px-2.5 rounded-full bg-accent-magenta/10 border border-accent-magenta/20 text-accent-magenta text-xs font-semibold">
                <BookOpen className="w-3 h-3" />
                Mã lớp học hợp lệ
              </span>
              <h1 className="text-2xl font-bold tracking-tight px-4">{course.title}</h1>
              <p className="text-xs text-text-secondary">
                Mã phòng: <span className="font-mono font-bold uppercase text-primary">{course.code}</span>
              </p>
            </div>

            {/* Input Card */}
            <div className="glass-panel p-8 rounded-card border border-border-subtle shadow-2xl relative overflow-hidden">
              {existingStudent ? (
                <div className="space-y-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-success/15 text-success flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">Chào mừng quay lại, {existingStudent.name}</h3>
                    <p className="text-xs text-text-secondary mt-1">
                      Hệ thống ghi nhận bạn đã đăng nhập tài khoản học sinh trên máy này.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <button
                      onClick={handleContinueWithExisting}
                      disabled={loading}
                      className="w-full py-3 px-6 rounded-standard bg-primary hover:bg-primary-hover text-white text-sm font-semibold transition-all focus-ring shadow-lg shadow-primary/10 cursor-pointer disabled:opacity-50"
                    >
                      {loading ? 'Đang vào lớp...' : 'Tiếp tục vào lớp học'}
                    </button>
                    <button
                      onClick={() => {
                        localStorage.removeItem("student_name");
                        localStorage.removeItem("student_id");
                        localStorage.removeItem("joined_courses");
                        setExistingStudent(null);
                      }}
                      className="w-full py-2 px-6 rounded-standard bg-bg-surface hover:bg-bg-hover text-text-secondary hover:text-text-primary text-xs font-medium transition-all"
                    >
                      Đăng nhập tên khác
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleRegister} className="space-y-5">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label htmlFor="name-input" className="text-xs font-bold text-text-secondary tracking-wide uppercase">
                        Họ và tên của học sinh
                      </label>
                      <span className={`text-[10px] ${studentName.length > 20 ? "text-danger" : "text-text-muted"}`}>
                        {studentName.length}/20 ký tự
                      </span>
                    </div>
                    <input
                      id="name-input"
                      type="text"
                      required
                      value={studentName}
                      onChange={(e) => handleNameChange(e.target.value)}
                      placeholder="VD: Nam Huỳnh"
                      autoFocus
                      className={`w-full bg-bg-base border rounded-standard px-4 py-3 text-base text-text-primary placeholder-text-muted focus:outline-none transition-all focus-ring ${
                        error && error.includes("Tên") ? "border-danger focus:border-danger focus:ring-danger/20" : "border-border-subtle"
                      }`}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="pin-input" className="text-xs font-bold text-text-secondary tracking-wide uppercase flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5" />
                      Mã PIN bảo vệ (4 số)
                    </label>
                    <input
                      id="pin-input"
                      type="password"
                      inputMode="numeric"
                      required
                      value={pinCode}
                      onChange={(e) => handlePinChange(e.target.value)}
                      placeholder="Nhập 4 số tự chọn (VD: 1234)"
                      className={`w-full bg-bg-base border rounded-standard px-4 py-3 text-base font-mono tracking-widest text-text-primary placeholder-text-muted focus:outline-none transition-all focus-ring ${
                        error && error.includes("PIN") ? "border-danger focus:border-danger focus:ring-danger/20" : "border-border-subtle"
                      }`}
                    />
                    <p className="text-[10px] text-text-muted leading-relaxed pt-1">
                      * Dùng PIN này để khôi phục tài khoản nếu bạn dùng máy khác. Nếu sai PIN, bạn không thể dùng trùng tên.
                    </p>
                  </div>

                  {error && (
                    <div className="flex items-start gap-1.5 text-xs text-danger mt-1 font-medium bg-danger/5 p-2 rounded-standard border border-danger/10">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading || studentName.trim().length < 2 || studentName.length > 20 || pinCode.length < 4}
                    className="w-full mt-2 py-3 px-6 rounded-standard bg-accent-magenta hover:bg-accent-magenta-hover disabled:bg-bg-hover disabled:text-text-muted disabled:border-border-subtle disabled:cursor-not-allowed text-white font-medium transition-all duration-200 focus-ring shadow-lg shadow-accent-magenta/10 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        <span>Đang xử lý tham gia...</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        <span>Đăng ký & Vào lớp</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            <p className="text-[10px] text-text-muted text-center px-6 leading-relaxed">
              * Sau khi gia nhập lớp, bạn sẽ được tự động lưu tài khoản học sinh để theo dõi lịch sử làm bài thi.
            </p>
          </div>
        ) : (
          <div className="glass-panel p-8 rounded-card border border-border-subtle text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-warning mx-auto animate-bounce" />
            <h2 className="text-lg font-bold text-text-primary">Mã lớp học không hợp lệ</h2>
            <p className="text-text-secondary text-xs max-w-xs leading-relaxed">
              Mã khóa học `{code}` không tồn tại hoặc đã bị ẩn bởi giáo viên. Vui lòng kiểm tra lại mã code.
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
      <footer className="max-w-4xl mx-auto w-full text-center text-[10px] text-text-muted pt-6 border-t border-border-subtle/20 z-10 flex flex-col gap-1">
        <span>© 2026 Quiz Intelligence. Lưu trữ thông minh.</span>
        <span className="font-medium text-[11px]">Designed by <strong className="text-accent-magenta font-bold">Operation Intelligence</strong></span>
      </footer>
    </div>
  );
}
