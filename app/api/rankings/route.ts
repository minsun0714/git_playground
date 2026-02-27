import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 10;
    const offset = (page - 1) * limit;

    // 사용자별 총점 계산 및 랭킹 조회
    const { data, error } = await supabase
      .from("user_rankings")
      .select("*")
      .order("total_score", { ascending: false })
      .order("completed_at", { ascending: true })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    return NextResponse.json({
      rankings: data || [],
      page,
      hasMore: data && data.length === limit,
    });
  } catch (error) {
    console.error("Rankings API error:", error);
    return NextResponse.json(
      { error: "랭킹 조회 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
