import type * as React from "react";

// ─── Panel ────────────────────────────────────────────────────
export function Panel({
  children,
  style,
  className,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}) {
  return (
    <div
      className={className}
      style={{
        backgroundColor: "var(--bg-panel)",
        border: "1px solid var(--border)",
        borderRadius: 14,
        padding: "18px 20px 16px",
        color: "var(--text)",
        fontFamily: "var(--font-mono)",
        boxSizing: "border-box",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─── PanelHeader ──────────────────────────────────────────────
export function PanelHeader({
  icon = "⚡",
  eyebrow,
  status,
  statusColor,
}: {
  icon?: React.ReactNode;
  eyebrow: string;
  status?: React.ReactNode;
  statusColor?: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 18,
        fontSize: 11,
        letterSpacing: "0.06em",
      }}
    >
      <span
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          textTransform: "uppercase",
          color: "var(--muted)",
        }}
      >
        <span aria-hidden style={{ fontSize: 13 }}>
          {icon}
        </span>
        {eyebrow}
      </span>
      {status && (
        <span
          style={{
            color: statusColor ?? "var(--synced)",
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 11,
          }}
        >
          <span style={{ fontSize: 8, lineHeight: 1 }}>●</span>
          {status}
        </span>
      )}
    </div>
  );
}

// ─── DottedRule ───────────────────────────────────────────────
export function DottedRule({
  vertical,
  style,
}: {
  vertical?: boolean;
  style?: React.CSSProperties;
}) {
  if (vertical) {
    return (
      <div
        style={{
          width: 1,
          alignSelf: "stretch",
          backgroundImage: "linear-gradient(to bottom, var(--border) 50%, transparent 50%)",
          backgroundSize: "1px 6px",
          backgroundRepeat: "repeat-y",
          opacity: 0.85,
          ...style,
        }}
      />
    );
  }
  return (
    <div
      style={{
        height: 1,
        backgroundImage: "linear-gradient(to right, var(--border) 50%, transparent 50%)",
        backgroundSize: "6px 1px",
        backgroundRepeat: "repeat-x",
        opacity: 0.85,
        ...style,
      }}
    />
  );
}

// ─── PanelFooter ──────────────────────────────────────────────
export function PanelFooter({
  note,
  right,
}: {
  note: string;
  right?: React.ReactNode;
}) {
  return (
    <>
      <div
        style={{
          marginTop: 16,
          marginBottom: 10,
          borderTop: "1px dashed var(--border)",
          opacity: 0.9,
        }}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          gap: 12,
          fontSize: 11,
          color: "var(--muted)",
        }}
      >
        <span
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {note}
        </span>
        {right && <span style={{ flexShrink: 0 }}>{right}</span>}
      </div>
    </>
  );
}

// ─── BigNumber ────────────────────────────────────────────────
export function BigNumber({
  value,
  suffix,
  size = 26,
  color,
  suffixColor,
}: {
  value: string | number;
  suffix?: string;
  size?: number;
  color?: string;
  suffixColor?: string;
}) {
  return (
    <span>
      <span
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: size,
          fontWeight: 500,
          color: color ?? "var(--text)",
          letterSpacing: "-0.02em",
        }}
      >
        {value}
      </span>
      {suffix != null && (
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: suffixColor ?? "var(--muted)",
            marginLeft: 6,
          }}
        >
          {suffix}
        </span>
      )}
    </span>
  );
}

// ─── Label ────────────────────────────────────────────────────
export function Label({
  children,
  dot,
  color,
  size = 10,
  style,
}: {
  children: React.ReactNode;
  dot?: string;
  color?: string;
  size?: number;
  style?: React.CSSProperties;
}) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8, ...style }}>
      {dot && (
        <span
          aria-hidden
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            backgroundColor: dot,
            flexShrink: 0,
          }}
        />
      )}
      <span
        style={{
          color: color ?? "var(--muted)",
          fontSize: size,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
        }}
      >
        {children}
      </span>
    </span>
  );
}

// ─── Ring ─────────────────────────────────────────────────────
export function Ring({
  value,
  max,
  color,
  size = 88,
  stroke = 9,
}: {
  value: number;
  max: number;
  color: string;
  size?: number;
  stroke?: number;
}) {
  const cx = size / 2;
  const cy = size / 2;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const ratio = Math.min(Math.max(max > 0 ? value / max : 0, 0), 1);
  const offset = circ * (1 - ratio);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeOpacity={0.18}
      />
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        style={{ transform: "rotate(-90deg)", transformOrigin: `${cx}px ${cy}px` }}
      />
    </svg>
  );
}
