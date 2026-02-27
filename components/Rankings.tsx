"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Loader2 } from "lucide-react";

interface UserRanking {
  attempt_id: string;
  user_name: string;
  total_score: number;
  completed_at: string;
}

interface RankingsProps {
  userName?: string;
  attemptId?: string;
  showResultCard?: boolean;
  onRestart?: () => void;
}

export default function Rankings({
  userName,
  attemptId,
  showResultCard,
  onRestart,
}: RankingsProps) {
  const [rankings, setRankings] = useState<UserRanking[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [userScore, setUserScore] = useState<number | null>(null);
  const [userRank, setUserRank] = useState<number | null>(null);
  const observerRef = useRef<HTMLDivElement>(null);
  const shouldShowResultCard = showResultCard ?? Boolean(userName && attemptId);

  const fetchRankings = useCallback(async (pageNum: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/rankings?page=${pageNum}`);
      if (response.ok) {
        const data = await response.json();
        setRankings((prev) =>
          pageNum === 1 ? data.rankings : [...prev, ...data.rankings],
        );
        setHasMore(data.hasMore);
      }
    } catch (error) {
      console.error("Rankings fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const completeQuiz = useCallback(async () => {
    if (!userName || !attemptId) {
      return;
    }

    try {
      const response = await fetch("/api/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName, attemptId }),
      });

      if (response.ok) {
        const data = await response.json();
        setUserScore(data.totalScore);
        if (typeof data.rank === "number") {
          setUserRank(data.rank);
        }
      }
    } catch (error) {
      console.error("Complete error:", error);
    }
  }, [attemptId, userName]);

  useEffect(() => {
    if (shouldShowResultCard) {
      completeQuiz();
    }
    fetchRankings(1);
  }, [completeQuiz, fetchRankings, shouldShowResultCard]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 },
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loading]);

  useEffect(() => {
    if (page > 1 && hasMore && !loading) {
      fetchRankings(page);
    }
  }, [fetchRankings, hasMore, loading, page]);

  const fallbackUserRank = attemptId
    ? rankings.findIndex((r) => r.attempt_id === attemptId) + 1
    : 0;
  const displayedUserRank = userRank ?? fallbackUserRank;

  return (
    <div className="w-full max-w-lg mx-auto space-y-6">
      {/* 사용자 점수 카드 */}
      {shouldShowResultCard && (
        <Card className="shadow-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
          <CardHeader>
            <CardTitle className="text-center text-3xl flex items-center justify-center gap-3">
              <Trophy className="w-8 h-8" />
              퀴즈 완료!
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div>
              <p className="text-lg opacity-90">{userName}님의 점수</p>
              <p className="text-5xl font-bold mt-2">
                {userScore !== null ? userScore : "계산 중..."}점
              </p>
            </div>
            {displayedUserRank > 0 && (
              <p className="text-xl opacity-90">전체 순위: {displayedUserRank}위</p>
            )}
            {onRestart && (
              <Button
                onClick={onRestart}
                variant="secondary"
                size="lg"
                className="mt-4"
              >
                다시 시작하기
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* 랭킹 리스트 */}
      <Card className="shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="text-2xl">전체 랭킹</CardTitle>
            {!shouldShowResultCard && onRestart && (
              <Button onClick={onRestart} variant="outline">
                홈으로
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {rankings.map((ranking, index) => (
              <div
                key={`${ranking.user_name}-${index}`}
                className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                  ranking.attempt_id === attemptId
                    ? "bg-blue-100 border-2 border-blue-500"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${
                      index === 0
                        ? "bg-yellow-400 text-yellow-900"
                        : index === 1
                          ? "bg-gray-300 text-gray-700"
                          : index === 2
                            ? "bg-orange-400 text-orange-900"
                            : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold">{ranking.user_name}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(ranking.completed_at).toLocaleDateString(
                        "ko-KR",
                      )}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">
                    {ranking.total_score}
                  </p>
                  <p className="text-xs text-gray-500">점</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-center py-4">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              </div>
            )}
            <div ref={observerRef} className="h-4" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
