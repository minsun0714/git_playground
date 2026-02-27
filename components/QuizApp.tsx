"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UserIntro from "./UserIntro";
import QuizStepComponent from "./QuizStepComponent";
import Rankings from "./Rankings";
import { quizSteps } from "@/lib/quiz-data";

const QUIZ_STORAGE_KEY = "git-quiz-progress-v1";
type QuizStage = "intro" | "quiz" | "rankings";

interface StepData {
  answers: Record<string, string>;
  feedback: Record<string, { score: number; feedback: string }>;
  isSubmitted: boolean;
  submitCount: number;
}

export default function QuizApp() {
  const router = useRouter();
  const [stage, setStage] = useState<QuizStage>("intro");
  const [userName, setUserName] = useState("");
  const [attemptId, setAttemptId] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [stepData, setStepData] = useState<Record<number, StepData>>({});
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(QUIZ_STORAGE_KEY);
      if (!raw) {
        return;
      }

      const saved = JSON.parse(raw) as {
        stage?: QuizStage;
        userName?: string;
        attemptId?: string;
        currentStep?: number;
        stepData?: Record<number, StepData>;
      };

      const navigationEntry = performance
        .getEntriesByType("navigation")
        .at(0) as PerformanceNavigationTiming | undefined;
      const isReload = navigationEntry?.type === "reload";

      if (!isReload) {
        localStorage.removeItem(QUIZ_STORAGE_KEY);
        setStage("intro");
        return;
      }

      const shouldRestoreQuiz =
        saved.stage === "quiz" &&
        typeof saved.userName === "string" &&
        typeof saved.attemptId === "string";

      if (!shouldRestoreQuiz) {
        setStage("intro");
        return;
      }

      const restoredUserName = saved.userName as string;
      const restoredAttemptId = saved.attemptId as string;

      setStage("quiz");

      setUserName(restoredUserName);

      setAttemptId(restoredAttemptId);

      if (
        typeof saved.currentStep === "number" &&
        saved.currentStep >= 0 &&
        saved.currentStep < quizSteps.length
      ) {
        setCurrentStep(saved.currentStep);
      }

      if (saved.stepData && typeof saved.stepData === "object") {
        setStepData(saved.stepData);
      }
    } catch (error) {
      console.error("퀴즈 진행 상태 복원 실패:", error);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (stage !== "quiz") {
      return;
    }

    try {
      localStorage.setItem(
        QUIZ_STORAGE_KEY,
        JSON.stringify({ stage, userName, attemptId, currentStep, stepData }),
      );
    } catch (error) {
      console.error("퀴즈 진행 상태 저장 실패:", error);
    }
  }, [attemptId, currentStep, isHydrated, stage, stepData, userName]);

  const handleStart = (name: string) => {
    setUserName(name);
    setAttemptId(crypto.randomUUID());
    setStage("quiz");
  };

  const updateStepData = (stepId: number, data: StepData) => {
    setStepData((prev) => ({ ...prev, [stepId]: data }));
  };

  const handleNext = () => {
    if (currentStep < quizSteps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleComplete = () => {
    localStorage.removeItem(QUIZ_STORAGE_KEY);
    setStage("rankings");
  };

  const handleRestart = () => {
    setStage("intro");
    setUserName("");
    setAttemptId("");
    setCurrentStep(0);
    setStepData({});
    localStorage.removeItem(QUIZ_STORAGE_KEY);
  };

  const handleGoHome = () => {
    setStage("intro");
    setUserName("");
    setAttemptId("");
    setCurrentStep(0);
    setStepData({});
    localStorage.removeItem(QUIZ_STORAGE_KEY);
    router.push("/");
  };

  if (!isHydrated) {
    return null;
  }

  if (stage === "intro") {
    return <UserIntro onStart={handleStart} />;
  }

  if (stage === "quiz") {
    return (
      <QuizStepComponent
        step={quizSteps[currentStep]}
        currentStep={currentStep}
        totalSteps={quizSteps.length}
        userName={userName}
        attemptId={attemptId}
        savedData={stepData[currentStep]}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onGoHome={handleGoHome}
        onComplete={handleComplete}
        onUpdateData={(data) => updateStepData(currentStep, data)}
      />
    );
  }

  return (
    <Rankings
      userName={userName}
      attemptId={attemptId}
      showResultCard={Boolean(userName && attemptId)}
      onRestart={handleRestart}
    />
  );
}
