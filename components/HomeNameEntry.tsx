"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GitBranch } from "lucide-react";

export default function HomeNameEntry() {
  const router = useRouter();
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      return;
    }

    router.push(`/play?name=${encodeURIComponent(trimmedName)}`);
  };

  return (
    <Card className="w-full max-w-lg shadow-xl">
      <CardHeader className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="p-4 bg-primary/10 rounded-full">
            <GitBranch className="w-12 h-12 text-primary" />
          </div>
        </div>
        <CardTitle className="text-3xl font-bold">Git 학습 퀴즈</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="home-name"
              className="block text-sm font-medium mb-2"
            >
              이름을 입력하세요
            </label>
            <Input
              id="home-name"
              type="text"
              placeholder="홍길동"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" size="lg">
            응시하기
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
