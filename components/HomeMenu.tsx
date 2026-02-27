"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GitBranch, Trophy } from "lucide-react";

interface HomeMenuProps {
  onStartQuiz: () => void;
  onShowRankings: () => void;
}

export default function HomeMenu({ onStartQuiz, onShowRankings }: HomeMenuProps) {
  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-4 bg-primary/10 rounded-full">
              <GitBranch className="w-12 h-12 text-primary" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">Git 학습 퀴즈</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button onClick={onStartQuiz} className="w-full" size="lg">
            응시
          </Button>
          <Button onClick={onShowRankings} variant="outline" className="w-full" size="lg">
            <Trophy className="w-4 h-4 mr-2" />
            랭킹
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
