import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { gradeAnswer } from "@/lib/openai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userName,
      attemptId,
      step,
      questionId,
      question,
      answer,
      correctAnswer,
      maxScore,
    } = body;

    if (!userName || !attemptId || !answer) {
      return NextResponse.json(
        { error: "사용자 이름, 응시 ID, 답변은 필수입니다." },
        { status: 400 },
      );
    }

    // OpenAI로 채점
    const { score, feedback } = await gradeAnswer(
      question,
      correctAnswer,
      answer,
      maxScore,
    );

    // Supabase에 저장
    const { data, error } = await supabase
      .from("quiz_submissions")
      .insert({
        user_name: userName,
        attempt_id: attemptId,
        step: step,
        question_id: questionId,
        question: question,
        answer: answer,
        score: score,
        feedback: feedback,
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    return NextResponse.json({ score, feedback, data });
  } catch (error) {
    console.error("Grade API error:", error);
    return NextResponse.json(
      { error: "채점 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
