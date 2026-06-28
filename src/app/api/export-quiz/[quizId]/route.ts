import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabaseAdmin";
import { requireQuizOwner } from "@/lib/serverTeacherAuth";

interface RouteContext {
  params: Promise<{
    quizId: string;
  }>;
}

interface AttemptExportRow {
  student_id: string;
  display_name: string | null;
  score: number;
  max_score: number;
  raw_score: number | null;
  raw_max_score: number | null;
  duration_seconds: number;
  attempt_number: number;
  created_at: string;
}

function csvCell(value: string | number | null | undefined) {
  const raw = value === null || value === undefined ? "" : String(value);
  return `"${raw.replace(/"/g, '""')}"`;
}

function makeCsv(rows: AttemptExportRow[]) {
  const headers = [
    "Tên học sinh",
    "Student ID",
    "Điểm",
    "Điểm tối đa",
    "Điểm thô",
    "Điểm thô tối đa",
    "Thời gian làm bài (giây)",
    "Lần làm",
    "Thời điểm nộp",
  ];

  const body = rows.map((row) => [
    row.display_name || "Học viên ẩn danh",
    row.student_id,
    row.score,
    row.max_score,
    row.raw_score ?? "",
    row.raw_max_score ?? "",
    row.duration_seconds,
    row.attempt_number,
    row.created_at,
  ].map(csvCell).join(","));

  return [
    headers.map(csvCell).join(","),
    ...body,
  ].join("\n");
}

export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const { quizId } = await context.params;

    if (!quizId) {
      return NextResponse.json(
        { error: "Thiếu quizId." },
        { status: 400 }
      );
    }

    const owner = await requireQuizOwner(req, quizId);

    if (!owner.ok) {
      return NextResponse.json(
        { error: owner.error },
        { status: owner.status }
      );
    }

    const supabase = createSupabaseAdmin();

    const { data: quiz, error: quizError } = await supabase
      .from("quizzes")
      .select("id, title")
      .eq("id", quizId)
      .single();

    if (quizError || !quiz) {
      return NextResponse.json(
        { error: "Không tìm thấy quiz." },
        { status: 404 }
      );
    }

    const { data: attemptsData, error: attemptsError } = await supabase
      .from("attempts")
      .select("student_id, display_name, score, max_score, raw_score, raw_max_score, duration_seconds, attempt_number, created_at")
      .eq("quiz_id", quizId)
      .order("created_at", { ascending: true });

    if (attemptsError) {
      return NextResponse.json(
        { error: "Không thể tải dữ liệu kết quả." },
        { status: 500 }
      );
    }

    const csv = makeCsv((attemptsData || []) as AttemptExportRow[]);
    const safeTitle = String(quiz.title || "quiz")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9-_]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || "quiz";

    return new NextResponse(`\uFEFF${csv}`, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${safeTitle}-results.csv"`,
      },
    });
  } catch (error) {
    console.error("Export quiz error:", error);
    const message = error instanceof Error ? error.message : "Lỗi hệ thống khi xuất dữ liệu.";

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
