"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import ActionModal from "@/components/ui/action-modal";
import RichStepContent from "@/components/RichStepContent";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { QuizStep } from "@/lib/quiz-data";

interface StepData {
  answers: Record<string, string>;
  feedback: Record<string, { score: number; feedback: string }>;
  isSubmitted: boolean;
  submitCount: number;
}

interface QuizStepComponentProps {
  step: QuizStep;
  currentStep: number;
  totalSteps: number;
  userName: string;
  attemptId: string;
  savedData?: StepData;
  onNext: () => void;
  onPrevious: () => void;
  onGoHome: () => void;
  onComplete: () => void;
  onUpdateData: (data: StepData) => void;
}

export default function QuizStepComponent({
  step,
  currentStep,
  totalSteps,
  userName,
  attemptId,
  savedData,
  onNext,
  onPrevious,
  onGoHome,
  onComplete,
  onUpdateData,
}: QuizStepComponentProps) {
  const displayedTotalSteps = Math.max(totalSteps - 1, 1);
  const displayedCurrentStep = Math.min(
    Math.max(currentStep, 1),
    displayedTotalSteps,
  );
  const progressPercent =
    totalSteps > 0 ? Math.round(((currentStep + 1) / totalSteps) * 100) : 0;

  const [answers, setAnswers] = useState<Record<string, string>>(
    savedData?.answers || {},
  );
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<
    Record<string, { score: number; feedback: string }>
  >(savedData?.feedback || {});
  const [isSubmitted, setIsSubmitted] = useState(
    savedData?.isSubmitted || false,
  );
  const [submitCount, setSubmitCount] = useState(savedData?.submitCount || 0);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [isHomeConfirmOpen, setIsHomeConfirmOpen] = useState(false);

  // 저장된 데이터가 변경되면 state 업데이트
  useEffect(() => {
    if (savedData) {
      setAnswers(savedData.answers);
      setFeedback(savedData.feedback);
      setIsSubmitted(savedData.isSubmitted);
      setSubmitCount(savedData.submitCount || 0);
    } else {
      setAnswers({});
      setFeedback({});
      setIsSubmitted(false);
      setSubmitCount(0);
    }
  }, [currentStep, savedData]);

  const handleAnswerChange = (questionId: string, value: string) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);
    onUpdateData({ answers: newAnswers, feedback, isSubmitted, submitCount });
  };

  const handleSubmit = async () => {
    // 제출 횟수 확인 (최대 2번: 초기 제출 + 재제출 1번)
    if (submitCount >= 2) {
      setAlertMessage("재제출은 1번만 가능합니다.");
      return;
    }

    // 모든 질문에 답변했는지 확인
    const unanswered = step.questions.filter((q) => !answers[q.id]?.trim());
    if (unanswered.length > 0) {
      setAlertMessage("모든 질문에 답변해주세요.");
      return;
    }

    setLoading(true);
    const feedbackResults: Record<string, { score: number; feedback: string }> =
      {};

    try {
      for (const question of step.questions) {
        const response = await fetch("/api/grade", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userName,
            attemptId,
            step: step.id,
            questionId: question.id,
            question: question.question,
            answer: answers[question.id],
            correctAnswer: question.correctAnswer,
            maxScore: question.maxScore,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          feedbackResults[question.id] = {
            score: data.score,
            feedback: data.feedback,
          };
        }
      }

      setFeedback(feedbackResults);
      setIsSubmitted(true);
      const newSubmitCount = submitCount + 1;
      setSubmitCount(newSubmitCount);
      onUpdateData({
        answers,
        feedback: feedbackResults,
        isSubmitted: true,
        submitCount: newSubmitCount,
      });
    } catch (error) {
      console.error("Submission error:", error);
      setAlertMessage("제출 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentStep === totalSteps - 1) {
      onComplete();
    } else {
      onNext();
    }
  };

  const handleGoHomeClick = () => {
    setIsHomeConfirmOpen(true);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-3">
      <div className="flex items-start justify-between">
        <Button
          onClick={handleGoHomeClick}
          variant="ghost"
          size="sm"
          className="px-0 hover:bg-transparent"
          disabled={loading}
        >
          &lt; Home
        </Button>

        <div className="relative -mb-6 h-[4rem] w-44 shrink-0" aria-hidden>
          <span className="absolute left-1/2 top-2 -translate-x-1/2 text-3xl leading-none transition-transform duration-300 hover:-translate-y-0.5">
            ʕ•ᴥ•ʔ
          </span>
          <div className="absolute left-1/2 top-8 -translate-x-1/2 rounded-xl bg-background/80 px-3 py-1 text-sm font-semibold">
            {userName}
          </div>
          <span className="absolute left-9 top-[2.1rem] -rotate-12 text-lg leading-none">
            ᕦ
          </span>
          <span className="absolute right-9 top-[2.1rem] rotate-12 text-lg leading-none">
            ᕤ
          </span>
          <div className="absolute left-[36%] top-[1.9rem] h-2 w-px bg-foreground/20" />
          <div className="absolute left-[64%] top-[1.9rem] h-2 w-px bg-foreground/20" />
          <div className="sr-only">응시자: {userName}</div>
        </div>
      </div>

      <Card className="shadow-xl">
        <CardHeader>
          <div className="mb-2">
            <span className="text-sm text-gray-500">
              Step {displayedCurrentStep} / {displayedTotalSteps}
            </span>
          </div>
          <Progress value={progressPercent} />
          <CardTitle className="text-2xl">{step.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 단계 설명 */}
          <div className="prose prose-sm max-w-none border rounded-lg p-4 bg-gray-50">
            <RichStepContent content={step.content} />
          </div>

          {/* 질문들 */}
          {step.questions.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">질문</h3>
              {step.questions.map((question, index) => (
                <div key={question.id} className="space-y-3">
                  <label className="block text-sm font-medium">
                    {index + 1}. {question.question}
                    <span className="text-xs text-gray-500 ml-2">
                      (배점: {question.maxScore}점)
                    </span>
                  </label>
                  {question.type === "short" ? (
                    <Input
                      value={answers[question.id] || ""}
                      onChange={(e) =>
                        handleAnswerChange(question.id, e.target.value)
                      }
                      placeholder="답변을 입력하세요"
                      disabled={loading}
                    />
                  ) : (
                    <Textarea
                      value={answers[question.id] || ""}
                      onChange={(e) =>
                        handleAnswerChange(question.id, e.target.value)
                      }
                      placeholder="답변을 입력하세요"
                      rows={4}
                      disabled={loading}
                    />
                  )}
                  {feedback[question.id] && (
                    <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-blue-900">
                          점수: {feedback[question.id].score} /{" "}
                          {question.maxScore}
                        </span>
                      </div>
                      <p className="text-sm text-blue-800">
                        {feedback[question.id].feedback}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* 네비게이션 버튼 */}
          <div className="flex justify-between pt-4">
            <Button
              onClick={onPrevious}
              disabled={currentStep === 0 || loading}
              variant="outline"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              이전
            </Button>

            <div className="flex gap-3">
              {step.questions.length > 0 ? (
                <>
                  <Button
                    onClick={handleSubmit}
                    disabled={loading || submitCount >= 2}
                    variant={isSubmitted ? "secondary" : "default"}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        채점 중...
                      </>
                    ) : submitCount >= 2 ? (
                      "제출 완료"
                    ) : isSubmitted ? (
                      `재제출 (${2 - submitCount}회 남음)`
                    ) : (
                      "제출"
                    )}
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={!isSubmitted || loading}
                  >
                    {currentStep === totalSteps - 1 ? "완료" : "다음"}
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={currentStep === totalSteps - 1}
                >
                  다음
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
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

      <ActionModal
        open={Boolean(alertMessage)}
        title="안내"
        description={alertMessage || ""}
        confirmText="확인"
        hideCancel
        onConfirm={() => setAlertMessage(null)}
        onCancel={() => setAlertMessage(null)}
      />
    </div>
  );
}
