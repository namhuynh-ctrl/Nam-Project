import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabaseAdmin";

interface SubmitAttemptRequest {
  quizId?: string;
  studentId?: string;
  displayName?: string;
  durationSeconds?: number;
  answers?: Record<string, string>;
}

interface QuestionRow {
  id: string;
  points: number;
}

interface AnswerRow {
  id: string;
  question_id: string;
  is_correct: boolean;
}

function isValidAnswers(value: unknown): value is Record<string, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  return Object.values(value).every((answerId) => typeof answerId === "string");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as SubmitAttemptRequest;
    const quizId = body.quizId?.trim();
    const studentId = body.studentId?.trim() || "anonymous";
    const displayName = body.displayName?.trim() || "Thí sinh";
    const durationSeconds = Math.max(5, Math.round(body.durationSeconds || 5));

    if (!quizId || !isValidAnswers(body.answers)) {
      return NextResponse.json(
        { error: "Thiếu quizId hoặc answers không hợp lệ." },
        { status: 400 }
      );
    }

    if (displayName.length < 2 || displayName.length > 20) {
      return NextResponse.json(
        { error: "Tên hiển thị phải từ 2 đến 20 ký tự." },
        { status: 400 }
      );
    }

    const supabase = createSupabaseAdmin();

    const { data: quiz, error: quizError } = await supabase
      .from("quizzes")
      .select("id, status")
      .eq("id", quizId)
      .single();

    if (quizError || !quiz) {
      return NextResponse.json(
        { error: "Không tìm thấy quiz." },
        { status: 404 }
      );
    }

    if (quiz.status !== "published") {
      return NextResponse.json(
        { error: "Quiz chưa được xuất bản." },
        { status: 403 }
      );
    }

    const { data: questionsData, error: questionsError } = await supabase
      .from("questions")
      .select("id, points")
      .eq("quiz_id", quizId);

    if (questionsError || !questionsData || questionsData.length === 0) {
      return NextResponse.json(
        { error: "Quiz chưa có câu hỏi hợp lệ." },
        { status: 400 }
      );
    }

    const questions = questionsData as QuestionRow[];
    const questionIds = questions.map((question) => question.id);

    const { data: answersData, error: answersError } = await supabase
      .from("answers")
      .select("id, question_id, is_correct")
      .in("question_id", questionIds);

    if (answersError || !answersData) {
      return NextResponse.json(
        { error: "Không thể đọc đáp án để chấm điểm." },
        { status: 500 }
      );
    }

    const answers = answersData as AnswerRow[];
    const correctAnswerByQuestion = new Map(
      answers
        .filter((answer) => answer.is_correct)
        .map((answer) => [answer.question_id, answer.id])
    );
    const validAnswerKeys = new Set(
      answers.map((answer) => `${answer.question_id}:${answer.id}`)
    );

    let rawScore = 0;
    let maxRawScore = 0;

    for (const question of questions) {
      maxRawScore += question.points;
      const selectedAnswerId = body.answers[question.id];
      const correctAnswerId = correctAnswerByQuestion.get(question.id);

      if (selectedAnswerId && correctAnswerId && selectedAnswerId === correctAnswerId) {
        rawScore += question.points;
      }
    }

    const percentage = maxRawScore > 0 ? Math.round((rawScore / maxRawScore) * 100) : 0;
    const grade = maxRawScore > 0 ? Math.round((rawScore / maxRawScore) * 10) : 0;

    const { count: existingAttemptCount, error: countError } = await supabase
      .from("attempts")
      .select("id", { count: "exact", head: true })
      .eq("quiz_id", quizId)
      .eq("student_id", studentId);

    if (countError) {
      return NextResponse.json(
        { error: "Không thể xác định số lần làm bài." },
        { status: 500 }
      );
    }

    const attemptId = crypto.randomUUID();
    const attemptNumber = (existingAttemptCount || 0) + 1;

    const { error: attemptError } = await supabase.from("attempts").insert({
      id: attemptId,
      quiz_id: quizId,
      student_id: studentId,
      display_name: displayName,
      score: grade,
      max_score: 10,
      raw_score: rawScore,
      raw_max_score: maxRawScore,
      duration_seconds: durationSeconds,
      attempt_number: attemptNumber,
    });

    if (attemptError) {
      return NextResponse.json(
        { error: "Không thể lưu kết quả làm bài." },
        { status: 500 }
      );
    }

    const responseRows = Object.entries(body.answers)
      .filter(([questionId, answerId]) => (
        questionIds.includes(questionId)
        && answerId
        && validAnswerKeys.has(`${questionId}:${answerId}`)
      ))
      .map(([questionId, answerId]) => ({
        id: crypto.randomUUID(),
        attempt_id: attemptId,
        quiz_id: quizId,
        student_id: studentId,
        question_id: questionId,
        answer_id: answerId,
      }));

    if (responseRows.length > 0) {
      const { error: responsesError } = await supabase.from("responses").insert(responseRows);

      if (responsesError) {
        return NextResponse.json(
          { error: "Đã lưu điểm nhưng không thể lưu chi tiết câu trả lời." },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        attemptId,
        attemptNumber,
        score: rawScore,
        maxPoints: maxRawScore,
        percentage,
        grade,
        maxGrade: 10,
      },
    });
  } catch (error) {
    console.error("Submit attempt error:", error);
    const message = error instanceof Error ? error.message : "Lỗi hệ thống khi nộp bài.";

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
