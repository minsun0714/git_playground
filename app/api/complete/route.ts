import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userName, attemptId } = body;

    if (!userName || !attemptId) {
      return NextResponse.json(
        { error: "사용자 이름과 응시 ID는 필수입니다." },
        { status: 400 },
      );
    }

    // 해당 응시의 최신 제출 기준 총점 계산
    const { data: submissions, error: fetchError } = await supabase
      .from("quiz_submissions")
      .select("question_id, score, created_at")
      .eq("attempt_id", attemptId)
      .order("created_at", { ascending: false });

    if (fetchError) {
      console.error("Supabase fetch error:", fetchError);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    const latestByQuestion = new Map<string, number>();
    for (const submission of submissions || []) {
      if (!latestByQuestion.has(submission.question_id)) {
        latestByQuestion.set(submission.question_id, submission.score || 0);
      }
    }

    const totalScore = Array.from(latestByQuestion.values()).reduce(
      (sum, score) => sum + score,
      0,
    );
    const completedAt = new Date().toISOString();

    // user_rankings 테이블에 응시 단위로 저장 (같은 응시 재호출 시에만 갱신)
    const { error: upsertError } = await supabase.from("user_rankings").upsert(
      {
        attempt_id: attemptId,
        user_name: userName,
        total_score: totalScore,
        completed_at: completedAt,
      },
      { onConflict: "attempt_id" },
    );

    if (upsertError) {
      console.error("Supabase upsert error:", upsertError);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    const { data: higherScores, error: higherScoreError } = await supabase
      .from("user_rankings")
      .select("total_score")
      .gt("total_score", totalScore);

    if (higherScoreError) {
      console.error("Supabase rank calc error:", higherScoreError);
      return NextResponse.json({ totalScore });
    }

    const distinctHigherScoreCount = new Set(
      (higherScores || []).map((row) => row.total_score),
    ).size;
    const rank = distinctHigherScoreCount + 1;

    return NextResponse.json({ totalScore, rank });
  } catch (error) {
    console.error("Complete API error:", error);
    return NextResponse.json(
      { error: "제출 처리 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
