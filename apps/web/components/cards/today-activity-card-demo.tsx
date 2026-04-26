"use client";

import { BigNumber, DottedRule, Panel, PanelFooter, PanelHeader } from "@/components/ds";

const C = {
  move: "#9d80ff",
  exercise: "#67e8c0",
  steps: "#f5a623",
  muted: "#666666",
  mutedSoft: "#3a3a3a",
  text: "#f5f5f5",
  border: "#1f1f1f",
  bg: "#0b0b0b",
  borderSoft: "#161616",
  hrv: "#f06c9b",
};

function RingLayer({
  v,
  max,
  color,
  r,
  cx,
  cy,
}: {
  v: number;
  max: number;
  color: string;
  r: number;
  cx: number;
  cy: number;
}) {
  const circ = 2 * Math.PI * r;
  const off = circ * (1 - Math.min(Math.max(v / max, 0), 1));
  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={9}
        strokeOpacity={0.18}
      />
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={9}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={off}
        style={{ transform: "rotate(-90deg)", transformOrigin: `${cx}px ${cy}px` }}
      />
    </g>
  );
}

function MetricRow({
  dot,
  label,
  value,
  suffix,
  over,
}: {
  dot: string;
  label: string;
  value: number;
  suffix: string;
  over?: boolean;
}) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
      <span
        aria-hidden
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          backgroundColor: dot,
          flexShrink: 0,
          marginTop: 4,
        }}
      />
      <span
        style={{
          color: C.muted,
          fontSize: 10,
          letterSpacing: "0.12em",
          minWidth: 72,
          textTransform: "uppercase" as const,
          fontFamily: "var(--font-mono)",
        }}
      >
        {label}
      </span>
      <span style={{ flex: 1, minWidth: 0, textAlign: "right" }}>
        <BigNumber
          value={value.toLocaleString("en-US")}
          suffix={suffix}
          suffixColor={over ? dot : C.muted}
        />
      </span>
    </div>
  );
}

export function TodayActivityCardDemo({
  moveKcal = 544,
  exerciseMin = 80,
  steps = 300,
  moveGoal = 600,
  exerciseGoal = 30,
  stepsGoal = 8000,
  footerNote = "// strength day · low cardio",
  updatedAt = "21:14",
  synced = true,
}: {
  moveKcal?: number;
  exerciseMin?: number;
  steps?: number;
  moveGoal?: number;
  exerciseGoal?: number;
  stepsGoal?: number;
  footerNote?: string;
  updatedAt?: string;
  synced?: boolean;
}) {
  const cx = 72;
  const cy = 72;
  const exerciseOver = exerciseMin > exerciseGoal;
  return (
    <Panel>
      <PanelHeader
        eyebrow="Today / Activity"
        status={synced ? "synced" : "offline"}
        statusColor={synced ? C.exercise : C.muted}
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0,1fr) minmax(0,1.15fr)",
          gap: 20,
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center" }}>
          <svg width={144} height={144} viewBox="0 0 144 144" aria-hidden="true">
            <RingLayer v={moveKcal} max={moveGoal} color={C.move} r={52} cx={cx} cy={cy} />
            <RingLayer
              v={exerciseMin}
              max={exerciseGoal}
              color={C.exercise}
              r={38}
              cx={cx}
              cy={cy}
            />
            <RingLayer v={steps} max={stepsGoal} color={C.steps} r={24} cx={cx} cy={cy} />
          </svg>
        </div>
        <div>
          <MetricRow dot={C.move} label="Move" value={moveKcal} suffix={`/ ${moveGoal} kcal`} />
          <DottedRule style={{ margin: "10px 0" }} />
          <MetricRow
            dot={C.exercise}
            label="Exercise"
            value={exerciseMin}
            suffix={`/ ${exerciseGoal} min${exerciseOver ? " ↑" : ""}`}
            over={exerciseOver}
          />
          <DottedRule style={{ margin: "10px 0" }} />
          <MetricRow dot={C.steps} label="Steps" value={steps} suffix={`/ ${stepsGoal / 1000}k`} />
        </div>
      </div>
      <PanelFooter note={footerNote} right={`updated ${updatedAt}`} />
    </Panel>
  );
}

// ─── Empty state ─────────────────────────────────────────────
export function TodayActivityCardEmpty() {
  const cx = 72;
  const cy = 72;
  return (
    <Panel>
      <PanelHeader eyebrow="Today / Activity" status="not connected" statusColor={C.muted} />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0,1fr) minmax(0,1.15fr)",
          gap: 20,
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center" }}>
          <svg width={144} height={144} viewBox="0 0 144 144" aria-hidden="true">
            {[52, 38, 24].map((r) => (
              <circle
                key={r}
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                stroke={r === 52 ? C.move : r === 38 ? C.exercise : C.steps}
                strokeWidth={9}
                strokeOpacity={0.22}
                strokeDasharray="2 4"
              />
            ))}
          </svg>
        </div>
        <div>
          {[
            { dot: C.move, label: "Move", suffix: "/ — kcal" },
            { dot: C.exercise, label: "Exercise", suffix: "/ — min" },
            { dot: C.steps, label: "Steps", suffix: "/ —" },
          ].map((m, i) => (
            <div key={m.label}>
              {i > 0 && <DottedRule style={{ margin: "10px 0" }} />}
              <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                <span
                  aria-hidden
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    backgroundColor: m.dot,
                    flexShrink: 0,
                    marginTop: 4,
                    opacity: 0.4,
                  }}
                />
                <span
                  style={{
                    color: C.muted,
                    fontSize: 10,
                    letterSpacing: "0.12em",
                    minWidth: 72,
                    textTransform: "uppercase" as const,
                  }}
                >
                  {m.label}
                </span>
                <span style={{ flex: 1, textAlign: "right" }}>
                  <span
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: 26,
                      fontWeight: 500,
                      color: C.mutedSoft,
                    }}
                  >
                    —
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      color: C.mutedSoft,
                      marginLeft: 6,
                    }}
                  >
                    {m.suffix}
                  </span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <PanelFooter
        note="// no data yet — run the shortcut on iPhone to sync"
        right={
          <a
            href="/shortcut"
            style={{
              background: "transparent",
              color: C.text,
              border: `1px solid ${C.border}`,
              padding: "5px 10px",
              borderRadius: 6,
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: "0.06em",
              cursor: "pointer",
              textTransform: "uppercase" as const,
              textDecoration: "none",
            }}
          >
            install shortcut →
          </a>
        }
      />
    </Panel>
  );
}

// ─── Loading state ───────────────────────────────────────────
export function TodayActivityCardLoading() {
  const cx = 72;
  const cy = 72;
  const RingPulse = ({ r, color }: { r: number; color: string }) => {
    const circ = 2 * Math.PI * r;
    return (
      <>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={9} strokeOpacity={0.18} />
        <circle
          cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={9} strokeLinecap="round"
          strokeDasharray={`${circ * 0.18} ${circ * 0.82}`}
          style={{ transform: "rotate(-90deg)", transformOrigin: `${cx}px ${cy}px`, animation: "tac-spin 1.6s linear infinite" }}
        />
      </>
    );
  };
  const Skel = ({ w }: { w: number }) => (
    <span style={{
      display: "inline-block", width: w, height: 14, borderRadius: 3,
      background: `linear-gradient(90deg, ${C.borderSoft} 0%, ${C.border} 50%, ${C.borderSoft} 100%)`,
      backgroundSize: "200% 100%", animation: "tac-shimmer 1.4s ease-in-out infinite", verticalAlign: "middle",
    }} />
  );
  return (
    <Panel>
      <style>{`
        @keyframes tac-spin { to { transform: rotate(270deg); } }
        @keyframes tac-shimmer { 0%,100% { background-position:0% 50%; } 50% { background-position:100% 50%; } }
        @keyframes tac-blink { 50% { opacity: 0.3; } }
      `}</style>
      <PanelHeader
        eyebrow="Today / Activity"
        status={<span style={{ animation: "tac-blink 1.2s ease-in-out infinite" }}>syncing…</span> as unknown as string}
        statusColor={C.text}
      />
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1.15fr)", gap: 20, alignItems: "center" }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <svg width={144} height={144} viewBox="0 0 144 144" aria-hidden="true">
            <RingPulse r={52} color={C.move} />
            <RingPulse r={38} color={C.exercise} />
            <RingPulse r={24} color={C.steps} />
          </svg>
        </div>
        <div style={{ opacity: 0.75 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
            <span aria-hidden style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: C.move, flexShrink: 0, marginTop: 4 }} />
            <span style={{ color: C.muted, fontSize: 10, letterSpacing: "0.12em", minWidth: 72, textTransform: "uppercase" as const }}>Move</span>
            <span style={{ flex: 1, textAlign: "right" }}><Skel w={72} /></span>
          </div>
          <DottedRule style={{ margin: "10px 0" }} />
          <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
            <span aria-hidden style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: C.exercise, flexShrink: 0, marginTop: 4 }} />
            <span style={{ color: C.muted, fontSize: 10, letterSpacing: "0.12em", minWidth: 72, textTransform: "uppercase" as const }}>Exercise</span>
            <span style={{ flex: 1, textAlign: "right" }}><Skel w={56} /></span>
          </div>
          <DottedRule style={{ margin: "10px 0" }} />
          <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
            <span aria-hidden style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: C.steps, flexShrink: 0, marginTop: 4 }} />
            <span style={{ color: C.muted, fontSize: 10, letterSpacing: "0.12em", minWidth: 72, textTransform: "uppercase" as const }}>Steps</span>
            <span style={{ flex: 1, textAlign: "right" }}><Skel w={84} /></span>
          </div>
        </div>
      </div>
      <PanelFooter note="// GET /api/healthkit/today" right="00:01" />
    </Panel>
  );
}

// ─── Partial state ────────────────────────────────────────────
export function TodayActivityCardPartial({
  moveKcal = 544, exerciseMin = 80, moveGoal = 600, exerciseGoal = 30, stepsGoal = 8000,
}: { moveKcal?: number; exerciseMin?: number; moveGoal?: number; exerciseGoal?: number; stepsGoal?: number }) {
  const cx = 72;
  const cy = 72;
  return (
    <Panel>
      <PanelHeader eyebrow="Today / Activity" status="partial" statusColor={C.steps} />
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1.15fr)", gap: 20, alignItems: "center" }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <svg width={144} height={144} viewBox="0 0 144 144" aria-hidden="true">
            <RingLayer v={moveKcal} max={moveGoal} color={C.move} r={52} cx={cx} cy={cy} />
            <RingLayer v={exerciseMin} max={exerciseGoal} color={C.exercise} r={38} cx={cx} cy={cy} />
            <circle cx={cx} cy={cy} r={24} fill="none" stroke={C.steps} strokeWidth={9} strokeOpacity={0.22} strokeDasharray="2 4" />
          </svg>
        </div>
        <div>
          <MetricRow dot={C.move} label="Move" value={moveKcal} suffix={`/ ${moveGoal} kcal`} />
          <DottedRule style={{ margin: "10px 0" }} />
          <MetricRow dot={C.exercise} label="Exercise" value={exerciseMin} suffix={`/ ${exerciseGoal} min`} />
          <DottedRule style={{ margin: "10px 0" }} />
          <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
            <span aria-hidden style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: C.steps, flexShrink: 0, marginTop: 4, opacity: 0.4 }} />
            <span style={{ color: C.muted, fontSize: 10, letterSpacing: "0.12em", minWidth: 72, textTransform: "uppercase" as const }}>Steps</span>
            <span style={{ flex: 1, textAlign: "right" }}>
              <span style={{ fontFamily: "var(--font-serif)", fontSize: 26, fontWeight: 500, color: C.mutedSoft }}>—</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: C.hrv, marginLeft: 8, letterSpacing: "0.04em" }}>permission denied</span>
            </span>
          </div>
        </div>
      </div>
      <PanelFooter note="// re-grant Steps in Health → Sources" right="updated 21:14" />
    </Panel>
  );
}

// ─── Stale state ──────────────────────────────────────────────
export function TodayActivityCardStale({
  moveKcal = 412, exerciseMin = 18, steps = 4280, moveGoal = 600, exerciseGoal = 30, stepsGoal = 8000, hoursAgo = 6,
}: { moveKcal?: number; exerciseMin?: number; steps?: number; moveGoal?: number; exerciseGoal?: number; stepsGoal?: number; hoursAgo?: number }) {
  const cx = 72;
  const cy = 72;
  const StaleRing = ({ v, max, color, r }: { v: number; max: number; color: string; r: number }) => {
    const circ = 2 * Math.PI * r;
    const off = circ * (1 - Math.min(Math.max(v / max, 0), 1));
    return (
      <g style={{ opacity: 0.55 }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={9} strokeOpacity={0.18} />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={9} strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={off}
          style={{ transform: "rotate(-90deg)", transformOrigin: `${cx}px ${cy}px` }} />
      </g>
    );
  };
  return (
    <Panel>
      <PanelHeader eyebrow="Today / Activity" status={`stale · ${hoursAgo}h`} statusColor={C.steps} />
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1.15fr)", gap: 20, alignItems: "center" }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <svg width={144} height={144} viewBox="0 0 144 144" aria-hidden="true">
            <StaleRing v={moveKcal} max={moveGoal} color={C.move} r={52} />
            <StaleRing v={exerciseMin} max={exerciseGoal} color={C.exercise} r={38} />
            <StaleRing v={steps} max={stepsGoal} color={C.steps} r={24} />
          </svg>
        </div>
        <div style={{ opacity: 0.7 }}>
          <MetricRow dot={C.move} label="Move" value={moveKcal} suffix={`/ ${moveGoal} kcal`} />
          <DottedRule style={{ margin: "10px 0" }} />
          <MetricRow dot={C.exercise} label="Exercise" value={exerciseMin} suffix={`/ ${exerciseGoal} min`} />
          <DottedRule style={{ margin: "10px 0" }} />
          <MetricRow dot={C.steps} label="Steps" value={steps} suffix={`/ ${stepsGoal / 1000}k`} />
        </div>
      </div>
      <PanelFooter note={`// last sync ${hoursAgo}h ago — automation may be paused`} right="retry →" />
    </Panel>
  );
}

// ─── Error state ──────────────────────────────────────────────
export function TodayActivityCardError({
  code = "401", detail = "auth expired", occurredAt = "21:14",
}: { code?: string; detail?: string; occurredAt?: string }) {
  return (
    <Panel>
      <PanelHeader eyebrow="Today / Activity" status="error" statusColor={C.hrv} />
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1.15fr)", gap: 20, alignItems: "center" }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <svg width={144} height={144} viewBox="0 0 144 144" aria-hidden="true">
            <circle cx={72} cy={72} r={52} fill="none" stroke={C.hrv} strokeWidth={9} strokeOpacity={0.18} strokeDasharray="3 5" />
            <circle cx={72} cy={72} r={38} fill="none" stroke={C.hrv} strokeWidth={9} strokeOpacity={0.14} strokeDasharray="3 5" />
            <circle cx={72} cy={72} r={24} fill="none" stroke={C.hrv} strokeWidth={9} strokeOpacity={0.10} strokeDasharray="3 5" />
            <g stroke={C.hrv} strokeWidth={2.4} strokeLinecap="round" opacity={0.85}>
              <line x1={66} y1={66} x2={78} y2={78} />
              <line x1={78} y1={66} x2={66} y2={78} />
            </g>
          </svg>
        </div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, lineHeight: 1.65 }}>
          <div style={{ display: "flex", gap: 10 }}>
            <span style={{ color: C.hrv, minWidth: 28 }}>{code}</span>
            <span style={{ color: C.text }}>{detail}</span>
          </div>
          <div style={{ display: "flex", gap: 10, color: C.muted, marginTop: 2 }}>
            <span style={{ minWidth: 28 }}>at</span>
            <span>POST /api/healthkit/sync</span>
          </div>
          <div style={{ display: "flex", gap: 10, color: C.muted, marginTop: 2 }}>
            <span style={{ minWidth: 28 }}>tz</span>
            <span>America/Sao_Paulo · {occurredAt}</span>
          </div>
          <DottedRule style={{ margin: "10px 0" }} />
          <div style={{ color: C.muted, fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 13, lineHeight: 1.45 }}>
            Your token expired in the background. Sign in once on iPhone to refresh.
          </div>
        </div>
      </div>
      <PanelFooter note="// last good sync 4h ago — showing nothing rather than guessing" right="retry →" />
    </Panel>
  );
}

// ─── Install card ─────────────────────────────────────────────
export function InstallCard() {
  return (
    <Panel>
      <PanelHeader icon="▲" eyebrow="Install" status="v0.1.0" statusColor={C.muted} />
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 13,
          color: C.text,
          lineHeight: 1.9,
          background: "#070707",
          borderRadius: 8,
          padding: "14px 16px",
          border: `1px solid ${C.borderSoft}`,
        }}
      >
        <div>
          <span style={{ color: C.mutedSoft }}>$ </span>
          <span style={{ color: C.muted }}>npx </span>
          <span style={{ color: C.move }}>wristkit</span>
          <span style={{ color: C.text }}> init</span>
        </div>
        <div style={{ marginTop: 6 }}>
          <span style={{ color: C.mutedSoft }}>$ </span>
          <span style={{ color: C.muted }}>npx wristkit </span>
          <span style={{ color: C.exercise }}>add today-activity-card</span>
        </div>
        <div style={{ marginTop: 6 }}>
          <span style={{ color: C.mutedSoft }}>$ </span>
          <span style={{ color: C.muted }}>npx wristkit </span>
          <span style={{ color: C.steps }}>shortcut</span>
        </div>
      </div>
      <PanelFooter note="// three commands to ship" right="MIT" />
    </Panel>
  );
}

// ─── Env card ─────────────────────────────────────────────────
export function EnvCard() {
  const items = [
    { k: "WRISTKIT_DATABASE_URL", ok: true },
    { k: "WRISTKIT_API_KEY", ok: true },
  ];
  return (
    <Panel>
      <PanelHeader icon="⚙" eyebrow="Environment" status="2 / 2 set" />
      <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1, justifyContent: "center" }}>
        {items.map((it) => (
          <div key={it.k} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ color: it.ok ? C.exercise : C.hrv, fontSize: 10 }}>
              {it.ok ? "●" : "○"}
            </span>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                color: C.text,
                flex: 1,
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {it.k}
            </span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: C.muted }}>
              {it.ok ? "set" : "missing"}
            </span>
          </div>
        ))}
      </div>
      <PanelFooter note="// loaded from .env.local" right="BYO Supabase" />
    </Panel>
  );
}
