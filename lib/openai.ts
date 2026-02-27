import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

JSON 형식으로 응답해주세요:
{
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
        '{"score": 0, "feedback": "채점 실패"}',
    );
    return result;
  } catch (error) {
    console.error("OpenAI grading error:", error);
    return { score: 0, feedback: "채점 중 오류가 발생했습니다." };
  }
}
