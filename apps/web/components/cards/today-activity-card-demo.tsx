"use client";

import { Badge } from "@/components/entrepta/badge";
import { Button } from "@/components/entrepta/button";
import {
  Card,
  CardComment,
  CardFooter,
  CardHeader,
  CardLabel,
  CardMeta,
} from "@/components/entrepta/card";
import { Skeleton } from "@/components/entrepta/skeleton";

const MOVE = "var(--ring-move)";
const EXERCISE = "var(--ring-exercise)";
const STEPS = "var(--ring-steps)";

type RingState = "on" | "off" | "mute" | "pulse" | "err";

interface Ring {
  value?: number;
  max?: number;
  color: string;
  state: RingState;
}

interface RingVizProps {
  rings: Ring[];
  size?: number;
  stroke?: number;
  centerGlyph?: (cx: number, cy: number) => React.ReactNode;
}

function RingViz({ rings, size = 176, stroke = 11, centerGlyph }: RingVizProps) {
  const cx = size / 2;
  const cy = size / 2;
  const baseR = (size - stroke) / 2;
  const radii = [baseR, baseR - 16, baseR - 32];

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      <style>{"@keyframes tac-orbit { to { transform: rotate(360deg); } }"}</style>
      {rings.map((r, i) => {
        const radius = radii[i] ?? baseR;
        const circ = 2 * Math.PI * radius;
        const key = `ring-${i}`;

        if (r.state === "off" || r.state === "err") {
          return (
            <circle
              key={key}
              cx={cx}
              cy={cy}
              r={radius}
              fill="none"
              stroke={r.state === "err" ? "var(--status-error)" : r.color}
              strokeWidth={stroke}
              strokeOpacity={r.state === "err" ? 0.16 : 0.22}
              strokeDasharray="3 5"
            />
          );
        }

        if (r.state === "pulse") {
          return (
            <g key={key}>
              <circle
                cx={cx}
                cy={cy}
                r={radius}
                fill="none"
                stroke={r.color}
                strokeWidth={stroke}
                strokeOpacity={0.18}
              />
              <circle
                cx={cx}
                cy={cy}
                r={radius}
                fill="none"
                stroke={r.color}
                strokeWidth={stroke}
                strokeLinecap="round"
                strokeDasharray={`${circ * 0.18} ${circ * 0.82}`}
                style={{
                  transformOrigin: `${cx}px ${cy}px`,
                  animation: "tac-orbit 1.6s linear infinite",
                  animationDelay: `${i * -0.25}s`,
                }}
              />
            </g>
          );
        }

        const value = r.value ?? 0;
        const max = r.max ?? 1;
        const offset = circ * (1 - Math.min(Math.max(value / max, 0), 1));
        const opacity = r.state === "mute" ? 0.55 : 1;
        return (
          <g key={key} style={{ opacity }}>
            <circle
              cx={cx}
              cy={cy}
              r={radius}
              fill="none"
              stroke={r.color}
              strokeWidth={stroke}
              strokeOpacity={0.18}
            />
            <circle
              cx={cx}
              cy={cy}
              r={radius}
              fill="none"
              stroke={r.color}
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={offset}
              style={{ transform: "rotate(-90deg)", transformOrigin: `${cx}px ${cy}px` }}
            />
          </g>
        );
      })}
      {centerGlyph?.(cx, cy)}
    </svg>
  );
}

type MetricVariant = "on" | "off" | "mute" | "skel" | "missing";

interface MetricLineProps {
  token: string;
  label: string;
  value?: number;
  max: number;
  unit: string;
  variant?: MetricVariant;
  hint?: string;
  top?: boolean;
}

function MetricLine({
  token,
  label,
  value,
  max,
  unit,
  variant = "on",
  hint,
  top,
}: MetricLineProps) {
  const hit = variant === "on" && (value ?? 0) >= max;

  const renderValue = () => {
    if (variant === "skel") {
      return (
        <Skeleton
          style={{ width: 64, height: 18, display: "inline-block", verticalAlign: "middle" }}
        />
      );
    }
    if (variant === "off" || variant === "missing") {
      return (
        <em
          style={{
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontSize: 26,
            color: "var(--fg-muted)",
            letterSpacing: "-0.02em",
            fontWeight: 400,
          }}
        >
          —
        </em>
      );
    }
    return (
      <em
        style={{
          fontFamily: "var(--font-serif)",
          fontStyle: "italic",
          fontSize: 26,
          color: hit ? token : "var(--fg-primary)",
          letterSpacing: "-0.02em",
          fontWeight: 400,
          opacity: variant === "mute" ? 0.7 : 1,
        }}
      >
        {(value ?? 0).toLocaleString("en-US")}
      </em>
    );
  };

  const renderSuffix = () => {
    if (variant === "missing" && hint) {
      return (
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: "var(--status-error-fg)",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          {hint}
        </span>
      );
    }
    return (
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          color: "var(--fg-muted)",
          opacity: variant === "off" ? 0.7 : 1,
        }}
      >
        / {max.toLocaleString("en-US")} {unit}
        {hit && " ✓"}
      </span>
    );
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "10px 88px 1fr auto",
        alignItems: "baseline",
        columnGap: 12,
        padding: "10px 0",
        borderTop: top ? "none" : "1px solid var(--border-subtle)",
        opacity: variant === "off" ? 0.5 : 1,
      }}
    >
      <span
        aria-hidden
        style={{
          width: 8,
          height: 8,
          borderRadius: "9999px",
          background: token,
          alignSelf: "center",
          opacity: variant === "off" || variant === "missing" ? 0.35 : 1,
        }}
      />
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          color: "var(--fg-muted)",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        {label}
      </span>
      {renderSuffix()}
      {renderValue()}
    </div>
  );
}

function CardHeadline({
  kicker,
  children,
}: {
  kicker?: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 8 }}>
      {kicker && (
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: "var(--fg-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: 6,
          }}
        >
          {kicker}
        </div>
      )}
      <h3
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: 22,
          lineHeight: 1.2,
          color: "var(--fg-primary)",
          fontWeight: 400,
        }}
      >
        {children}
      </h3>
    </div>
  );
}

const italicBrand = { fontStyle: "italic", color: "var(--fg-brand)" } as const;

// ─── A · default ─────────────────────────────────────────────
export function TodayActivityCardDemo({
  moveKcal = 544,
  exerciseMin = 80,
  steps = 6480,
  moveGoal = 600,
  exerciseGoal = 30,
  stepsGoal = 8000,
  updatedAt = "21:14",
}: {
  moveKcal?: number;
  exerciseMin?: number;
  steps?: number;
  moveGoal?: number;
  exerciseGoal?: number;
  stepsGoal?: number;
  updatedAt?: string;
} = {}) {
  return (
    <Card>
      <CardHeader>
        <CardLabel>today / activity</CardLabel>
        <Badge variant="soft" color="success" dot>
          synced
        </Badge>
      </CardHeader>
      <div className="demo-split">
        <RingViz
          rings={[
            { value: moveKcal, max: moveGoal, color: MOVE, state: "on" },
            { value: exerciseMin, max: exerciseGoal, color: EXERCISE, state: "on" },
            { value: steps, max: stepsGoal, color: STEPS, state: "on" },
          ]}
        />
        <div>
          <MetricLine token={MOVE} label="MOVE" value={moveKcal} max={moveGoal} unit="kcal" top />
          <MetricLine
            token={EXERCISE}
            label="EXERCISE"
            value={exerciseMin}
            max={exerciseGoal}
            unit="min"
          />
          <MetricLine token={STEPS} label="STEPS" value={steps} max={stepsGoal} unit="" />
        </div>
      </div>
      <CardFooter>
        <span style={{ color: "var(--fg-muted)" }}>updated {updatedAt}</span>
      </CardFooter>
    </Card>
  );
}

// ─── B · empty ───────────────────────────────────────────────
export function TodayActivityCardEmpty() {
  return (
    <Card>
      <CardHeader>
        <CardLabel>today / activity</CardLabel>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <Badge variant="soft" color="neutral" dot>
            not connected
          </Badge>
          <CardMeta>0 snapshots</CardMeta>
        </span>
      </CardHeader>
      <div className="demo-split">
        <RingViz
          rings={[
            { color: MOVE, state: "off" },
            { color: EXERCISE, state: "off" },
            { color: STEPS, state: "off" },
          ]}
        />
        <div>
          <CardHeadline kicker="no data yet">
            <em style={italicBrand}>iPhone</em> hasn't checked in.{" "}
            <span style={{ color: "var(--fg-muted)" }}>Install the shortcut.</span>
          </CardHeadline>
          <MetricLine token={MOVE} label="MOVE" max={600} unit="kcal" variant="off" top />
          <MetricLine token={EXERCISE} label="EXERCISE" max={30} unit="min" variant="off" />
          <MetricLine token={STEPS} label="STEPS" max={8000} unit="" variant="off" />
        </div>
      </div>
      <CardFooter>
        <CardComment>run shortcut on iPhone · or POST /api/wristkit-sync</CardComment>
        <a href="/docs/shortcut-setup" style={{ color: "var(--fg-brand)" }}>
          install shortcut →
        </a>
      </CardFooter>
    </Card>
  );
}

// ─── C · loading ─────────────────────────────────────────────
export function TodayActivityCardLoading() {
  return (
    // biome-ignore lint/a11y/useSemanticElements: Card is a div; role="status" is the right ARIA contract here.
    <Card role="status" aria-live="polite" aria-label="Loading today's activity">
      <CardHeader>
        <CardLabel>today / activity</CardLabel>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <Badge variant="soft" color="info" dot>
            syncing…
          </Badge>
          <CardMeta>00:01</CardMeta>
        </span>
      </CardHeader>
      <div className="demo-split">
        <RingViz
          rings={[
            { color: MOVE, state: "pulse" },
            { color: EXERCISE, state: "pulse" },
            { color: STEPS, state: "pulse" },
          ]}
        />
        <div>
          <MetricLine token={MOVE} label="MOVE" max={600} unit="kcal" variant="skel" top />
          <MetricLine token={EXERCISE} label="EXERCISE" max={30} unit="min" variant="skel" />
          <MetricLine token={STEPS} label="STEPS" max={8000} unit="" variant="skel" />
        </div>
      </div>
      <CardFooter>
        <span style={{ color: "var(--fg-muted)" }}>syncing…</span>
      </CardFooter>
    </Card>
  );
}

// ─── D · stale ───────────────────────────────────────────────
export function TodayActivityCardStale({
  moveKcal = 412,
  exerciseMin = 18,
  steps = 4280,
  moveGoal = 600,
  exerciseGoal = 30,
  stepsGoal = 8000,
}: {
  moveKcal?: number;
  exerciseMin?: number;
  steps?: number;
  moveGoal?: number;
  exerciseGoal?: number;
  stepsGoal?: number;
} = {}) {
  return (
    <Card>
      <CardHeader>
        <CardLabel>today / activity</CardLabel>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <Badge variant="soft" color="warning" dot>
            stale · 6h
          </Badge>
          <CardMeta>cached</CardMeta>
        </span>
      </CardHeader>
      <div className="demo-split">
        <RingViz
          rings={[
            { value: moveKcal, max: moveGoal, color: MOVE, state: "mute" },
            { value: exerciseMin, max: exerciseGoal, color: EXERCISE, state: "mute" },
            { value: steps, max: stepsGoal, color: STEPS, state: "mute" },
          ]}
        />
        <div>
          <CardHeadline kicker="last sync · 15:08">
            <em style={italicBrand}>Six</em> hours ago.{" "}
            <span style={{ color: "var(--fg-muted)" }}>Shortcut may be paused.</span>
          </CardHeadline>
          <MetricLine
            token={MOVE}
            label="MOVE"
            value={moveKcal}
            max={moveGoal}
            unit="kcal"
            variant="mute"
            top
          />
          <MetricLine
            token={EXERCISE}
            label="EXERCISE"
            value={exerciseMin}
            max={exerciseGoal}
            unit="min"
            variant="mute"
          />
          <MetricLine
            token={STEPS}
            label="STEPS"
            value={steps}
            max={stepsGoal}
            unit=""
            variant="mute"
          />
        </div>
      </div>
      <CardFooter>
        <CardComment>showing cached values · automation due 23:00</CardComment>
      </CardFooter>
    </Card>
  );
}

// ─── E · error ───────────────────────────────────────────────
export function TodayActivityCardError() {
  return (
    <Card>
      <CardHeader>
        <CardLabel>today / activity</CardLabel>
        <Badge variant="soft" color="error" dot>
          error
        </Badge>
      </CardHeader>
      <div className="demo-split">
        <RingViz
          rings={[
            { color: "var(--status-error)", state: "err" },
            { color: "var(--status-error)", state: "err" },
            { color: "var(--status-error)", state: "err" },
          ]}
          centerGlyph={(cx, cy) => (
            <g stroke="var(--status-error)" strokeWidth={2.4} strokeLinecap="round" opacity={0.85}>
              <line x1={cx - 8} y1={cy - 8} x2={cx + 8} y2={cy + 8} />
              <line x1={cx + 8} y1={cy - 8} x2={cx - 8} y2={cy + 8} />
            </g>
          )}
        />
        <div>
          <div
            style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontSize: 22,
              color: "var(--status-error-fg)",
              letterSpacing: "-0.02em",
            }}
          >
            Something went wrong.
          </div>
          <p
            style={{
              marginTop: 8,
              fontSize: 13,
              lineHeight: 1.6,
              color: "var(--fg-secondary)",
            }}
          >
            We couldn't load today's activity. Check that the sync ran and try again later.
          </p>
        </div>
      </div>
      <CardFooter>
        <CardComment>showing nothing rather than guessing</CardComment>
        <Button variant="ghost" size="sm">
          docs
        </Button>
      </CardFooter>
    </Card>
  );
}

// ─── F · rings only (no card chrome) ─────────────────────────
export function TodayActivityCardRingsOnly() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 48,
        padding: "48px 24px",
      }}
    >
      <div style={{ position: "relative", width: 220, height: 220 }}>
        <RingViz
          size={220}
          stroke={14}
          rings={[
            { value: 544, max: 600, color: MOVE, state: "on" },
            { value: 80, max: 30, color: EXERCISE, state: "on" },
            { value: 6480, max: 8000, color: STEPS, state: "on" },
          ]}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: "var(--fg-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              marginBottom: 2,
            }}
          >
            today
          </div>
          <div
            style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontSize: 40,
              color: "var(--fg-primary)",
              lineHeight: 1,
              letterSpacing: "-0.02em",
            }}
          >
            3<span style={{ color: "var(--fg-muted)" }}>/3</span>
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: "var(--fg-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              marginTop: 2,
            }}
          >
            rings closed
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 14,
          fontFamily: "var(--font-mono)",
          fontSize: 12,
        }}
      >
        {[
          { c: MOVE, l: "MOVE", v: "544 / 600", u: "kcal" },
          { c: EXERCISE, l: "EXERCISE", v: "80 / 30", u: "min ✓" },
          { c: STEPS, l: "STEPS", v: "6480 / 8000", u: "" },
        ].map((r) => (
          <div key={r.l} style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
            <span
              aria-hidden
              style={{
                width: 8,
                height: 8,
                borderRadius: "9999px",
                background: r.c,
                alignSelf: "center",
              }}
            />
            <span
              style={{
                color: "var(--fg-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                minWidth: 80,
              }}
            >
              {r.l}
            </span>
            <em
              style={{
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontSize: 18,
                color: "var(--fg-primary)",
              }}
            >
              {r.v}
            </em>
            <span style={{ color: "var(--fg-muted)" }}>{r.u}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
