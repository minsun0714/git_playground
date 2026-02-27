import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function tokenizeKoreanEnglish(text: string): string[] {
  const normalized = text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!normalized) {
    return [];
  }

  return normalized.split(" ").filter((token) => token.length >= 2);
}

function passesRelevanceGuard(
  question: string,
  correctAnswer: string,
  userAnswer: string,
): boolean {
  const answer = userAnswer.trim();
  if (!answer) {
    return false;
  }

  const nonsensePattern =
    /^(test|asdf|qwer|1234|aaaa|몰라요|모르겠어요|아무거나|그냥|ㅋㅋ+|ㅎㅎ+|ㅁㄴㅇ)+$/i;
  if (nonsensePattern.test(answer.replace(/\s+/g, ""))) {
    return false;
  }

  const answerTokens = new Set(tokenizeKoreanEnglish(answer));
  const referenceTokens = new Set(
    tokenizeKoreanEnglish(`${question} ${correctAnswer}`),
  );

  if (answerTokens.size === 0 || referenceTokens.size === 0) {
    return false;
  }

  let overlapCount = 0;
  for (const token of answerTokens) {
    if (referenceTokens.has(token)) {
      overlapCount += 1;
    }
  }

  return overlapCount >= 1;
}

export async function gradeAnswer(
  question: string,
  correctAnswer: string,
  userAnswer: string,
  maxScore: number = 10,
): Promise<{ score: number; feedback: string }> {
  try {
    const prompt = `당신은 Git 학습 과제를 채점하는 전문가입니다.

질문: ${question}

정답 가이드: ${correctAnswer}

학생 답변: ${userAnswer}

위 학생의 답변을 정답 가이드와 비교하여 ${maxScore}점 만점으로 채점해주세요.
채점 기준:
- 핵심 개념을 정확히 이해했는가
- 설명이 논리적이고 명확한가
- 기술적인 정확성

반드시 먼저 "질문과의 관련성"을 판단하세요.
- 질문과 무관한 답변(완전히 다른 주제, 의미 없는 문장, 질문 요구와 불일치)이면 isRelevant=false, score=0으로 반환해야 합니다.
- isRelevant=false인 경우 어떤 상황에서도 0점 이외 점수를 주면 안 됩니다.
- 빈약하지만 질문과 관련이 있는 경우에만 isRelevant=true로 판단하고 0~${maxScore} 범위에서 채점하세요.

JSON 형식으로 응답해주세요:
{
  "isRelevant": true 또는 false,
  "score": 0-${maxScore} 사이의 점수,
  "feedback": "간단한 피드백 (1-2문장)"
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(
      response.choices[0].message.content ||
        '{"isRelevant": false, "score": 0, "feedback": "채점 실패"}',
    );

    const isRelevantFromModel = Boolean(result.isRelevant);
    const isRelevantByGuard = passesRelevanceGuard(
      question,
      correctAnswer,
      userAnswer,
    );
    const isRelevant = isRelevantFromModel && isRelevantByGuard;
    const rawScore = Number(result.score);
    const normalizedScore = Number.isFinite(rawScore)
      ? Math.min(maxScore, Math.max(0, Math.round(rawScore)))
      : 0;

    return {
      score: isRelevant ? normalizedScore : 0,
      feedback:
        !isRelevant
          ? "질문과 관련성이 부족한 답변으로 판단되어 0점 처리되었습니다."
          : typeof result.feedback === "string" && result.feedback.trim()
            ? result.feedback
            : "채점 피드백을 생성하지 못했습니다.",
    };
  } catch (error) {
    console.error("OpenAI grading error:", error);
    return { score: 0, feedback: "채점 중 오류가 발생했습니다." };
  }
}
