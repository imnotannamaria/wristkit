"use client";

import { useId } from "react";

export function WristKitMark({
  size = 64,
  color = "#f5f5f5",
  accent = "#9d80ff",
}: {
  size?: number;
  color?: string;
  accent?: string;
}) {
  const uid = useId().replace(/:/g, "");
  const maskId = `wk-${uid}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      style={{ display: "block", flexShrink: 0 }}
      aria-hidden="true"
    >
      <defs>
        <mask id={maskId}>
          <rect width="64" height="64" fill="white" />
          <path d="M 46 12 L 22 52" stroke="black" strokeWidth="8" strokeLinecap="butt" />
        </mask>
      </defs>
      {/* outer ring */}
      <circle
        cx="32"
        cy="32"
        r="22"
        fill="none"
        stroke={color}
        strokeWidth="4"
        mask={`url(#${maskId})`}
      />
      {/* inner ring */}
      <circle
        cx="32"
        cy="32"
        r="13"
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeOpacity="0.55"
        mask={`url(#${maskId})`}
      />
      {/* accent slash */}
      <path d="M 46 12 L 22 52" stroke={accent} strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}
