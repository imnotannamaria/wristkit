import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: 32,
        height: 32,
        background: "#050505",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg width="28" height="28" viewBox="0 0 64 64">
        <defs>
          <mask id="m">
            <rect width="64" height="64" fill="white" />
            <path d="M 46 12 L 22 52" stroke="black" strokeWidth="8" strokeLinecap="butt" />
          </mask>
        </defs>
        <circle cx="32" cy="32" r="22" fill="none" stroke="#f5f5f5" strokeWidth="4" mask="url(#m)" />
        <circle cx="32" cy="32" r="13" fill="none" stroke="#f5f5f5" strokeWidth="4" strokeOpacity="0.55" mask="url(#m)" />
        <path d="M 46 12 L 22 52" stroke="#9d80ff" strokeWidth="5" strokeLinecap="round" />
      </svg>
    </div>,
    { ...size },
  );
}
