import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabaseAdmin";
import { QuestionType } from "@/types";
import { requireQuizOwner } from "@/lib/serverTeacherAuth";

interface RouteContext {
  params: Promise<{
    quizId: string;
  }>;
}

interface QuizRow {
  id: string;
  title: string;
  timer_minutes: number;
  status: "draft" | "published";
  course_id: string | null;
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
  is_correct: boolean;
}

interface AttemptRow {
  id: string;
  score: number;
  max_score: number;
  duration_seconds: number;
  attempt_number: number;
  created_at: string;
}

interface ResponseRow {
  attempt_id: string;
  question_id: string;
  answer_id: string;
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

    const { data: quizData, error: quizError } = await supabase
      .from("quizzes")
      .select("id, title, timer_minutes, status, course_id")
      .eq("id", quizId)
      .single();

    if (quizError || !quizData) {
      return NextResponse.json(
        { error: "Không tìm thấy quiz." },
        { status: 404 }
      );
    }

    const quiz = quizData as QuizRow;

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
        .select("id, question_id, content, is_correct")
        .in("question_id", questionIds)
        .order("created_at", { ascending: true })
      : { data: [], error: null };

    if (answersError) {
      return NextResponse.json(
        { error: "Không thể tải đáp án." },
        { status: 500 }
      );
    }

    const { data: attemptsData, error: attemptsError } = await supabase
      .from("attempts")
      .select("id, score, max_score, duration_seconds, attempt_number, created_at")
      .eq("quiz_id", quizId)
      .order("created_at", { ascending: true });

    if (attemptsError) {
      return NextResponse.json(
        { error: "Không thể tải lượt làm bài." },
        { status: 500 }
      );
    }

    const attempts = (attemptsData || []) as AttemptRow[];
    const attemptIds = attempts.map((attempt) => attempt.id);

    const { data: responsesData, error: responsesError } = attemptIds.length > 0
      ? await supabase
        .from("responses")
        .select("attempt_id, question_id, answer_id")
        .in("attempt_id", attemptIds)
      : { data: [], error: null };

    if (responsesError) {
      return NextResponse.json(
        { error: "Không thể tải chi tiết câu trả lời." },
        { status: 500 }
      );
    }

    const answers = (answersData || []) as AnswerRow[];
    const responses = (responsesData || []) as ResponseRow[];
    const correctAnswerByQuestion = new Map(
      answers
        .filter((answer) => answer.is_correct)
        .map((answer) => [answer.question_id, answer.id])
    );

    const totalAttempts = attempts.length;
    const averageScore = totalAttempts > 0
      ? attempts.reduce((sum, attempt) => sum + attempt.score, 0) / totalAttempts
      : 0;
    const averageDurationSeconds = totalAttempts > 0
      ? attempts.reduce((sum, attempt) => sum + attempt.duration_seconds, 0) / totalAttempts
      : 0;

    const questionAnalytics = questions.map((question) => {
      const questionAnswers = answers.filter((answer) => answer.question_id === question.id);
      const questionResponses = responses.filter((response) => response.question_id === question.id);
      const correctAnswerId = correctAnswerByQuestion.get(question.id);
      const correctCount = questionResponses.filter((response) => response.answer_id === correctAnswerId).length;
      const totalResponses = questionResponses.length;

      return {
        id: question.id,
        content: question.content,
        type: question.type,
        points: question.points,
        totalResponses,
        correctCount,
        incorrectCount: Math.max(0, totalResponses - correctCount),
        correctRate: totalResponses > 0 ? Math.round((correctCount / totalResponses) * 100) : 0,
        answers: questionAnswers.map((answer) => {
          const selectedCount = questionResponses.filter((response) => response.answer_id === answer.id).length;

          return {
            id: answer.id,
            content: answer.content,
            isCorrect: answer.is_correct,
            selectedCount,
            selectedRate: totalResponses > 0 ? Math.round((selectedCount / totalResponses) * 100) : 0,
          };
        }),
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        quiz,
        summary: {
          totalAttempts,
          averageScore: Number(averageScore.toFixed(1)),
          averageDurationSeconds: Math.round(averageDurationSeconds),
          totalResponses: responses.length,
        },
        questions: questionAnalytics,
      },
    });
  } catch (error) {
    console.error("Quiz analytics error:", error);
    const message = error instanceof Error ? error.message : "Lỗi hệ thống khi tải analytics.";

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
