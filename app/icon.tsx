import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "transparent",
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 64 64"
        width="32"
        height="32"
        fill="none"
      >
        <circle cx="32" cy="32" r="28" fill="#EDE9FE" />
        <g
          transform="translate(14 14) scale(1.5)"
          stroke="#7C3AED"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        >
          <path d="M15 6a9 9 0 0 0-9 9V3" />
          <circle cx="18" cy="6" r="3" />
          <circle cx="6" cy="18" r="3" />
        </g>
      </svg>
    </div>,
    {
      ...size,
    },
  );
}
