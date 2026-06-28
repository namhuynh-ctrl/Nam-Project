import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabaseAdmin";
import { QuestionType } from "@/types";

interface RouteContext {
  params: Promise<{
    quizId: string;
  }>;
}

interface QuizRow {
  id: string;
  course_id: string | null;
  title: string;
  timer_minutes: number;
  status: "draft" | "published";
}

interface QuestionRow {
  id: string;
  quiz_id: string;
  type: QuestionType;
  content: string;
  points: number;
}

interface AnswerRow {
  id: string;
  question_id: string;
  content: string;
}

export async function GET(_req: NextRequest, context: RouteContext) {
  try {
    const { quizId } = await context.params;

    if (!quizId) {
      return NextResponse.json(
        { error: "Thiếu quizId." },
        { status: 400 }
      );
    }

    const supabase = createSupabaseAdmin();

    const { data: quizData, error: quizError } = await supabase
      .from("quizzes")
      .select("id, course_id, title, timer_minutes, status")
      .eq("id", quizId)
      .single();

    if (quizError || !quizData) {
      return NextResponse.json(
        { error: "Không tìm thấy quiz." },
        { status: 404 }
      );
    }

    const quiz = quizData as QuizRow;

    if (quiz.status !== "published") {
      return NextResponse.json(
        { error: "Quiz chưa được xuất bản." },
        { status: 403 }
      );
    }

    const { data: questionsData, error: questionsError } = await supabase
      .from("questions")
      .select("id, quiz_id, type, content, points")
      .eq("quiz_id", quizId)
      .order("created_at", { ascending: true });

    if (questionsError) {
      return NextResponse.json(
        { error: "Không thể tải câu hỏi." },
        { status: 500 }
      );
    }

    const questions = (questionsData || []) as QuestionRow[];
    const questionIds = questions.map((question) => question.id);

    const { data: answersData, error: answersError } = questionIds.length > 0
      ? await supabase
        .from("answers")
        .select("id, question_id, content")
        .in("question_id", questionIds)
        .order("created_at", { ascending: true })
      : { data: [], error: null };

    if (answersError) {
      return NextResponse.json(
        { error: "Không thể tải đáp án." },
        { status: 500 }
      );
    }

    const answers = (answersData || []) as AnswerRow[];
    const safeQuestions = questions.map((question) => ({
      ...question,
      answers: answers.filter((answer) => answer.question_id === question.id),
    }));
    const publicQuiz = {
      id: quiz.id,
      course_id: quiz.course_id,
      title: quiz.title,
      timer_minutes: quiz.timer_minutes,
      status: quiz.status,
    };

    return NextResponse.json({
      success: true,
      data: {
        quiz: publicQuiz,
        questions: safeQuestions,
      },
    });
  } catch (error) {
    console.error("Public quiz payload error:", error);
    const message = error instanceof Error ? error.message : "Lỗi hệ thống khi tải quiz.";

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
