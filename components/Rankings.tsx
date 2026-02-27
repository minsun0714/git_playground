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
  const [userRankFromServer, setUserRankFromServer] = useState<number | null>(
    null,
  );
  const listContainerRef = useRef<HTMLDivElement>(null);
  const userRowRef = useRef<HTMLDivElement>(null);
  const hasAutoScrolledRef = useRef(false);
  const shouldShowResultCard = showResultCard ?? Boolean(userName && attemptId);

  const enqueueNextPage = useCallback(() => {
    if (loading || !hasMore) {
      return;
    }

    setPage((prev) => prev + 1);
  }, [hasMore, loading]);

  const handleContainerScroll = useCallback(() => {
    const container = listContainerRef.current;
    if (!container || loading || !hasMore) {
      return;
    }

    const nearBottom =
      container.scrollTop + container.clientHeight >=
      container.scrollHeight - 80;

    if (nearBottom) {
      enqueueNextPage();
    }
  }, [enqueueNextPage, hasMore, loading]);

  const fetchRankings = useCallback(async (pageNum: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/rankings?page=${pageNum}`);
      if (response.ok) {
        const data = await response.json();
        setRankings((prev) => {
          const merged =
            pageNum === 1 ? data.rankings : [...prev, ...data.rankings];

          const dedupedByAttempt = new Map<string, UserRanking>();
          for (const ranking of merged) {
            dedupedByAttempt.set(ranking.attempt_id, ranking);
          }

          return Array.from(dedupedByAttempt.values()).sort((a, b) => {
            if (b.total_score !== a.total_score) {
              return b.total_score - a.total_score;
            }

            return (
              new Date(a.completed_at).getTime() -
              new Date(b.completed_at).getTime()
            );
          });
        });
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
          setUserRankFromServer(data.rank);
        }
      }
    } catch (error) {
      console.error("Complete error:", error);
    }
  }, [attemptId, userName]);

  useEffect(() => {
    const initialize = async () => {
      hasAutoScrolledRef.current = false;
      if (shouldShowResultCard) {
        await completeQuiz();
      }
      setPage(1);
      await fetchRankings(1);
    };

    void initialize();
  }, [completeQuiz, fetchRankings, shouldShowResultCard]);

  useEffect(() => {
    if (page <= 1) {
      return;
    }

    void fetchRankings(page);
  }, [fetchRankings, page]);

  useEffect(() => {
    handleContainerScroll();
  }, [handleContainerScroll, rankings]);

  useEffect(() => {
    if (!attemptId || !shouldShowResultCard || loading) {
      return;
    }

    const hasCurrentAttempt = rankings.some((r) => r.attempt_id === attemptId);

    if (!hasCurrentAttempt && hasMore) {
      enqueueNextPage();
      return;
    }

    if (
      hasCurrentAttempt &&
      userRowRef.current &&
      !hasAutoScrolledRef.current
    ) {
      userRowRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      hasAutoScrolledRef.current = true;
    }
  }, [
    attemptId,
    enqueueNextPage,
    hasMore,
    loading,
    rankings,
    shouldShowResultCard,
  ]);

  const displayRanks = rankings.reduce<number[]>((acc, ranking, index) => {
    if (index > 0 && rankings[index - 1].total_score === ranking.total_score) {
      acc.push(acc[index - 1]);
    } else {
      const previousRank = index > 0 ? acc[index - 1] : 0;
      acc.push(previousRank + 1);
    }

    return acc;
  }, []);

  const userRankFromList = (() => {
    if (!attemptId) {
      return 0;
    }

    const rankingIndex = rankings.findIndex((r) => r.attempt_id === attemptId);
    if (rankingIndex < 0) {
      return 0;
    }

    return displayRanks[rankingIndex] || 0;
  })();
  const userRank = userRankFromList || userRankFromServer || 0;
  const isLoadingMore = loading && page > 1;

  return (
    <div className="w-full max-w-lg mx-auto space-y-6">
      {/* 사용자 점수 카드 */}
      {shouldShowResultCard && (
        <Card className="shadow-xl bg-primary text-primary-foreground">
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
            {userRank > 0 && (
              <p className="text-xl opacity-90">전체 순위: {userRank}위</p>
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
              <Button
                onClick={onRestart}
                variant="ghost"
                className="px-0 hover:bg-transparent"
              >
                &lt; 홈으로
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div
            ref={listContainerRef}
            className="relative h-[420px] overflow-y-auto pr-1"
            onScroll={handleContainerScroll}
          >
            <div className="space-y-2">
              {rankings.map((ranking, index) =>
                (() => {
                  const displayRank = displayRanks[index] || index + 1;

                  return (
                    <div
                      key={`${ranking.user_name}-${index}`}
                      ref={
                        ranking.attempt_id === attemptId
                          ? userRowRef
                          : undefined
                      }
                      className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                        ranking.attempt_id === attemptId
                          ? "bg-primary/10 border-2 border-primary"
                          : "bg-gray-50 hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${
                            displayRank === 1
                              ? "bg-yellow-400 text-yellow-900"
                              : displayRank === 2
                                ? "bg-gray-300 text-gray-700"
                                : displayRank === 3
                                  ? "bg-orange-400 text-orange-900"
                                  : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {displayRank}
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
                        <p className="text-2xl font-bold text-primary">
                          {ranking.total_score}
                        </p>
                        <p className="text-xs text-gray-500">점</p>
                      </div>
                    </div>
                  );
                })(),
              )}
              <div className="h-4" />
              {isLoadingMore && (
                <div className="sticky bottom-0 z-10 flex justify-center bg-background/90 py-3 backdrop-blur-sm">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
