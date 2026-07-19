import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#09090b",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 40,
      }}
    >
      <svg width="180" height="180" viewBox="0 0 64 64" aria-hidden="true">
        <defs>
          <mask id="m">
            <rect width="64" height="64" fill="white" />
            <path d="M 46 12 L 22 52" stroke="black" strokeWidth="8" strokeLinecap="butt" />
          </mask>
        </defs>
        <circle
          cx="32"
          cy="32"
          r="22"
          fill="none"
          stroke="#fafafa"
          strokeWidth="4"
          mask="url(#m)"
        />
        <circle
          cx="32"
          cy="32"
          r="13"
          fill="none"
          stroke="#fafafa"
          strokeWidth="4"
          strokeOpacity="0.55"
          mask="url(#m)"
        />
        <path d="M 46 12 L 22 52" stroke="#35a365" strokeWidth="5" strokeLinecap="round" />
      </svg>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div
          style={{
            fontSize: 96,
            fontWeight: 500,
            color: "#fafafa",
            fontFamily: "serif",
          }}
        >
          wristkit
        </div>
        <div style={{ fontSize: 32, color: "rgba(250,250,250,0.6)" }}>
          Apple Health, on the web — as React components.
        </div>
      </div>
    </div>,
    { ...size },
  );
}
