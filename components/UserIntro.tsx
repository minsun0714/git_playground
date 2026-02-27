"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GitBranch } from "lucide-react";

interface UserIntroProps {
  onStart: (userName: string) => void;
  onGoHome: () => void;
}

export default function UserIntro({ onStart, onGoHome }: UserIntroProps) {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onStart(name.trim());
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-3">
      <div className="flex justify-start">
        <Button onClick={onGoHome} variant="outline" size="sm">
          홈으로
        </Button>
      </div>

      <Card className="shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-4 bg-primary/10 rounded-full">
              <GitBranch className="w-12 h-12 text-primary" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">Git 학습 퀴즈</CardTitle>
          <p className="text-gray-600">
            신입 온보딩 채점 과제에 오신 것을 환영합니다
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                이름을 입력하세요
              </label>
              <Input
                id="name"
                type="text"
                placeholder="홍길동"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full"
                required
              />
            </div>
            <Button type="submit" className="w-full" size="lg">
              시작하기
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
