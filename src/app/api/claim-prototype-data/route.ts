import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabaseAdmin";
import { PROTOTYPE_CREATOR_ID } from "@/lib/creatorAuth";
import { getTeacherIdFromRequest } from "@/lib/serverTeacherAuth";

function isClaimEnabled() {
  return process.env.ENABLE_PROTOTYPE_CLAIM === "true";
}

export async function GET(req: NextRequest) {
  if (!isClaimEnabled()) {
    return NextResponse.json(
      { error: "Tính năng nhận dữ liệu prototype đang bị tắt." },
      { status: 403 }
    );
  }

  const teacherId = await getTeacherIdFromRequest(req);

  if (!teacherId) {
    return NextResponse.json(
      { error: "Bạn cần đăng nhập giáo viên bằng Supabase Auth." },
      { status: 401 }
    );
  }

  const supabase = createSupabaseAdmin();
  const { count: courseCount, error: courseError } = await supabase
    .from("courses")
    .select("id", { count: "exact", head: true })
    .eq("creator_id", PROTOTYPE_CREATOR_ID);

  const { count: quizCount, error: quizError } = await supabase
    .from("quizzes")
    .select("id", { count: "exact", head: true })
    .eq("creator_id", PROTOTYPE_CREATOR_ID);

  if (courseError || quizError) {
    return NextResponse.json(
      { error: "Không thể kiểm tra dữ liệu prototype." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    data: {
      teacherId,
      prototypeCourseCount: courseCount || 0,
      prototypeQuizCount: quizCount || 0,
      hasPrototypeData: Boolean((courseCount || 0) + (quizCount || 0)),
    },
  });
}

export async function POST(req: NextRequest) {
  if (!isClaimEnabled()) {
    return NextResponse.json(
      { error: "Tính năng nhận dữ liệu prototype đang bị tắt." },
      { status: 403 }
    );
  }

  const teacherId = await getTeacherIdFromRequest(req);

  if (!teacherId) {
    return NextResponse.json(
      { error: "Bạn cần đăng nhập giáo viên bằng Supabase Auth." },
      { status: 401 }
    );
  }

  if (teacherId === PROTOTYPE_CREATOR_ID) {
    return NextResponse.json(
      { error: "Tài khoản này đã là owner prototype." },
      { status: 400 }
    );
  }

  const supabase = createSupabaseAdmin();

  const { data: updatedCourses, error: courseError } = await supabase
    .from("courses")
    .update({ creator_id: teacherId })
    .eq("creator_id", PROTOTYPE_CREATOR_ID)
    .select("id");

  if (courseError) {
    return NextResponse.json(
      { error: "Không thể chuyển quyền sở hữu khóa học." },
      { status: 500 }
    );
  }

  const { data: updatedQuizzes, error: quizError } = await supabase
    .from("quizzes")
    .update({ creator_id: teacherId })
    .eq("creator_id", PROTOTYPE_CREATOR_ID)
    .select("id");

  if (quizError) {
    return NextResponse.json(
      { error: "Đã chuyển khóa học nhưng không thể chuyển quiz. Vui lòng kiểm tra lại dữ liệu." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    data: {
      teacherId,
      claimedCourses: updatedCourses?.length || 0,
      claimedQuizzes: updatedQuizzes?.length || 0,
    },
  });
}
