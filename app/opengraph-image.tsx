import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "72px",
          background:
            "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 45%, #5B21B6 100%)",
          color: "white",
          fontFamily:
            "Inter, Pretendard, Apple SD Gothic Neo, Noto Sans KR, sans-serif",
        }}
      >
        <div style={{ fontSize: 34, opacity: 0.9, marginBottom: 20 }}>
          신입 온보딩
        </div>
        <div style={{ fontSize: 86, fontWeight: 800, lineHeight: 1.05 }}>
          Git 학습 퀴즈
        </div>
        <div style={{ marginTop: 26, fontSize: 36, opacity: 0.95 }}>
          실시간 랭킹과 함께 학습하세요
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
