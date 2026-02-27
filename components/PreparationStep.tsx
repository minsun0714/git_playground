"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ActionModal from "@/components/ui/action-modal";
import { QuizStep } from "@/lib/quiz-data";

interface PreparationStepProps {
  step: QuizStep;
  userName: string;
  onGoHome: () => void;
  onStartExam: () => void;
}

export default function PreparationStep({
  step,
  userName,
  onGoHome,
  onStartExam,
}: PreparationStepProps) {
  const [isHomeConfirmOpen, setIsHomeConfirmOpen] = useState(false);

  const handleGoHomeClick = () => {
    setIsHomeConfirmOpen(true);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-3">
      <div className="flex justify-start">
        <Button onClick={handleGoHomeClick} variant="outline" size="sm">
          홈으로
        </Button>
      </div>

      <Card className="shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">과제 전 준비</span>
            <span className="text-sm font-medium text-primary">{userName}</span>
          </div>
          <CardTitle className="text-2xl">{step.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="prose prose-sm max-w-none border rounded-lg p-4 bg-gray-50 whitespace-pre-wrap">
            {step.content}
          </div>

          <div className="flex justify-end pt-4">
            <Button onClick={onStartExam} size="lg">
              시험 시작
            </Button>
          </div>
        </CardContent>
      </Card>

      <ActionModal
        open={isHomeConfirmOpen}
        title="홈으로 이동"
        description="홈으로 이동하면 지금까지 제출한 데이터가 모두 사라집니다. 계속하시겠습니까?"
        confirmText="이동"
        cancelText="취소"
        onConfirm={() => {
          setIsHomeConfirmOpen(false);
          onGoHome();
        }}
        onCancel={() => setIsHomeConfirmOpen(false)}
      />
    </div>
  );
}
