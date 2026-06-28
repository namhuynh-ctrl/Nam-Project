import { NextRequest } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabaseAdmin";

export function getBearerToken(req: NextRequest) {
  const header = req.headers.get("authorization") || "";
  const [scheme, token] = header.split(" ");

  if (scheme?.toLowerCase() !== "bearer" || !token) {
    return null;
  }

  return token;
}

export async function getTeacherIdFromRequest(req: NextRequest) {
  const token = getBearerToken(req);

  if (!token) {
    return null;
  }

  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return null;
  }

  return data.user.id;
}

export async function requireQuizOwner(req: NextRequest, quizId: string) {
  const teacherId = await getTeacherIdFromRequest(req);

  if (!teacherId) {
    return {
      ok: false as const,
      status: 401,
      error: "Bạn cần đăng nhập giáo viên bằng Supabase Auth.",
    };
  }

  const supabase = createSupabaseAdmin();
  const { data: quiz, error } = await supabase
    .from("quizzes")
    .select("id, creator_id")
    .eq("id", quizId)
    .single();

  if (error || !quiz) {
    return {
      ok: false as const,
      status: 404,
      error: "Không tìm thấy quiz.",
    };
  }

  if (quiz.creator_id !== teacherId) {
    return {
      ok: false as const,
      status: 403,
      error: "Bạn không có quyền truy cập quiz này.",
    };
  }

  return {
    ok: true as const,
    teacherId,
  };
}
