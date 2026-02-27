"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import RichStepContent from "@/components/RichStepContent";
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
  return (
    <div className="w-full max-w-4xl mx-auto space-y-3">
      <div className="flex justify-start">
        <Button
          onClick={onGoHome}
          variant="ghost"
          size="sm"
          className="px-0 hover:bg-transparent"
        >
          &lt; 홈으로
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
          <div className="prose prose-sm max-w-none border rounded-lg p-4 bg-gray-50">
            <RichStepContent content={step.content} />
          </div>

          <div className="flex justify-end pt-4">
            <Button onClick={onStartExam} size="lg">
              시험 시작
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
