import { BigNumber, DottedRule, Label, Panel, PanelFooter, PanelHeader } from "@/components/ds";

const C = {
  move: "var(--ring-move)",
  exercise: "var(--ring-exercise)",
  steps: "var(--ring-steps)",
  sleep: "var(--status-info)",
  hrv: "var(--status-error)",
  muted: "var(--fg-muted)",
  mutedSoft: "var(--border-strong)",
  text: "var(--fg-primary)",
  border: "var(--border-subtle)",
  bg: "var(--bg-surface)",
};

// ─── SleepCard ───────────────────────────────────────────────
export function SleepCard() {
  const hours = 7.2;
  const goal = 8;
  const stages = [
    { kind: "awake", w: 3 },
    { kind: "light", w: 28 },
    { kind: "deep", w: 16 },
    { kind: "rem", w: 11 },
    { kind: "light", w: 22 },
    { kind: "deep", w: 8 },
    { kind: "rem", w: 9 },
    { kind: "light", w: 3 },
  ] as const;
  const stageColor = {
    deep: C.sleep,
    rem: "var(--fg-brand)",
    light: "var(--border-strong)",
    awake: C.mutedSoft,
  };
  const over = hours >= goal;
  return (
    <Panel>
      <PanelHeader icon="☾" eyebrow="Last Night / Sleep" status="synced" />
      <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 16 }}>
        <BigNumber
          value={hours.toFixed(1)}
          size={44}
          suffix={`/ ${goal}h`}
          suffixColor={over ? C.sleep : C.muted}
        />
        <span style={{ marginLeft: "auto", color: C.muted, fontSize: 11 }}>23:42 → 07:04</span>
      </div>
      <div
        style={{
          display: "flex",
          height: 44,
          borderRadius: 3,
          overflow: "hidden",
          marginBottom: 10,
        }}
      >
        {stages.map((s, i) => (
          <div
            key={`${s.kind}-${i}`}
            style={{
              width: `${s.w}%`,
              background: stageColor[s.kind],
              opacity: s.kind === "awake" ? 0.5 : 1,
              borderRight: i < stages.length - 1 ? `1px solid ${C.bg}` : "none",
            }}
          />
        ))}
      </div>
      <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
        {(
          [
            ["DEEP", C.sleep, "1h 12m"],
            ["REM", "var(--fg-brand)", "1h 44m"],
            ["LIGHT", "var(--border-strong)", "3h 58m"],
            ["AWAKE", C.mutedSoft, "14m"],
          ] as const
        ).map(([lbl, col, val]) => (
          <div key={lbl} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <Label dot={col} size={9}>
              {lbl}
            </Label>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                color: C.text,
                paddingLeft: 14,
              }}
            >
              {val}
            </span>
          </div>
        ))}
      </div>
      <PanelFooter note="// quality ∘ good · 4 cycles" right="updated 07:04" />
    </Panel>
  );
}

// ─── HrvCard ──────────────────────────────────────────────────
export function HrvCard() {
  const current = 62;
  const avg = 54;
  const series = [48, 52, 49, 55, 53, 58, 51, 56, 60, 57, 63, 58, 61, 62];
  const max = Math.max(...series);
  const min = Math.min(...series);
  const pad = 4;
  const W = 320;
  const H = 60;
  const path = series
    .map((v, i) => {
      const x = pad + (i / (series.length - 1)) * (W - pad * 2);
      const y = H - pad - ((v - min) / (max - min || 1)) * (H - pad * 2);
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  const delta = current - avg;
  return (
    <Panel>
      <PanelHeader icon="♡" eyebrow="HRV / 14d" status="synced" />
      <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 10 }}>
        <BigNumber value={current} size={44} suffix="ms" suffixColor={C.muted} />
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: delta >= 0 ? C.exercise : C.hrv,
          }}
        >
          {delta >= 0 ? "↑" : "↓"} {Math.abs(delta)}ms vs avg
        </span>
      </div>
      <svg
        width="100%"
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        style={{ display: "block" }}
        aria-hidden="true"
      >
        <line
          x1={pad}
          x2={W - pad}
          y1={H - pad - ((avg - min) / (max - min || 1)) * (H - pad * 2)}
          y2={H - pad - ((avg - min) / (max - min || 1)) * (H - pad * 2)}
          stroke={C.mutedSoft}
          strokeWidth="1"
          strokeDasharray="3 4"
        />
        <path
          d={path}
          fill="none"
          stroke={C.hrv}
          strokeWidth="1.6"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {series.map((v, i) => {
          const x = pad + (i / (series.length - 1)) * (W - pad * 2);
          const y = H - pad - ((v - min) / (max - min || 1)) * (H - pad * 2);
          const isLast = i === series.length - 1;
          return (
            <circle
              key={`${v}-${i}-${isLast ? "last" : "mid"}`}
              cx={x}
              cy={y}
              r={isLast ? 2.5 : 0}
              fill={C.hrv}
            />
          );
        })}
      </svg>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 6,
          fontFamily: "var(--font-mono)",
          fontSize: 9,
          color: C.mutedSoft,
          letterSpacing: "0.06em",
        }}
      >
        <span>14d ago</span>
        <span>7d</span>
        <span>today</span>
      </div>
      <PanelFooter note={`// avg ${avg}ms · range ${min}–${max}`} right="updated 07:04" />
    </Panel>
  );
}

// ─── HistoryCard ──────────────────────────────────────────────
export function HistoryCard({ metric = "move" }: { metric?: "move" | "exercise" | "steps" }) {
  const days = [
    { d: "T", v: 420 },
    { d: "W", v: 610 },
    { d: "T", v: 380 },
    { d: "F", v: 540 },
    { d: "S", v: 700 },
    { d: "S", v: 290 },
    { d: "M", v: 544, today: true },
  ];
  const metaMap = {
    move: { color: C.move, goal: 600, unit: "kcal", label: "MOVE" },
    exercise: { color: C.exercise, goal: 30, unit: "min", label: "EXERCISE" },
    steps: { color: C.steps, goal: 8000, unit: "k", label: "STEPS" },
  };
  const m = metaMap[metric];
  const peak = Math.max(...days.map((x) => x.v), m.goal);
  const streak = days.filter((x) => x.v >= m.goal).length;
  return (
    <Panel>
      <PanelHeader icon="▰" eyebrow={`7 Days / ${m.label}`} status="synced" />
      <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 16 }}>
        <BigNumber value={streak} size={40} suffix="/ 7 days hit" suffixColor={C.muted} />
        <Label style={{ marginLeft: "auto" }}>
          goal {m.goal}
          {m.unit === "k" ? "" : ` ${m.unit}`}
        </Label>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 10,
          height: 88,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: (m.goal / peak) * 88,
            borderTop: `1px dashed ${C.mutedSoft}`,
            opacity: 0.9,
          }}
        />
        {days.map((day) => {
          const h = (day.v / peak) * 88;
          const hit = day.v >= m.goal;
          return (
            <div
              key={day.d}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: h,
                  background: hit ? m.color : `${m.color}40`,
                  border: day.today ? `1.5px solid ${m.color}` : "none",
                  borderRadius: 2,
                }}
              />
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
        {days.map((d) => (
          <div
            key={d.d}
            style={{
              flex: 1,
              textAlign: "center",
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: d.today ? C.text : C.muted,
              fontWeight: d.today ? 600 : 400,
            }}
          >
            {d.d}
          </div>
        ))}
      </div>
      <PanelFooter
        note={`// peak ${Math.max(...days.map((d) => d.v))} ${m.unit === "k" ? "" : m.unit}`}
        right="window 7d"
      />
    </Panel>
  );
}

// ─── StreakCard ───────────────────────────────────────────────
export function StreakCard({ days = 23, best = 41 }: { days?: number; best?: number }) {
  return (
    <Panel style={{ display: "flex", flexDirection: "column" }}>
      <PanelHeader icon="⚑" eyebrow="Streak" />
      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
        <BigNumber value={days} size={56} color={C.exercise} />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: C.muted }}>days</span>
      </div>
      <div style={{ marginTop: 12, display: "flex", gap: 4, flexWrap: "wrap" }}>
        {Array.from({ length: 28 }, (_, i) => {
          const hit = i < 26 && i !== 8 && i !== 15;
          return (
            <div
              key={String(i)}
              style={{
                width: 10,
                height: 10,
                borderRadius: 2,
                background: hit ? C.exercise : C.mutedSoft,
                opacity: hit ? 0.4 + (i / 28) * 0.6 : 0.8,
              }}
            />
          );
        })}
      </div>
      <PanelFooter note={`// best ${best} days`} right="all time" />
    </Panel>
  );
}

// ─── StandCard ────────────────────────────────────────────────
export function StandCard() {
  const hours = 10;
  const goal = 12;
  const pattern = "011111111011110111001000";
  return (
    <Panel>
      <PanelHeader icon="↥" eyebrow="Stand / 24h" status="synced" />
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 14 }}>
        <BigNumber value={hours} size={44} suffix={`/ ${goal} hrs`} suffixColor={C.muted} />
        <Label style={{ marginLeft: "auto" }} dot={C.steps}>
          stand goal
        </Label>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(24, 1fr)", gap: 3 }}>
        {pattern.split("").map((c, i) => (
          <div
            key={String(i)}
            style={{
              aspectRatio: "1 / 1",
              background: c === "1" ? C.steps : C.mutedSoft,
              opacity: c === "1" ? 0.5 + i / 36 : 0.6,
              borderRadius: 2,
            }}
          />
        ))}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 6,
          fontFamily: "var(--font-mono)",
          fontSize: 9,
          color: C.mutedSoft,
          letterSpacing: "0.06em",
        }}
      >
        <span>00h</span>
        <span>06h</span>
        <span>12h</span>
        <span>18h</span>
        <span>23h</span>
      </div>
      <PanelFooter note="// idle ∘ 2h 14h · desk work" right="now 21:14" />
    </Panel>
  );
}

// ─── ShortcutStatus ───────────────────────────────────────────
export function ShortcutStatus() {
  const steps = [
    { k: "steps", ok: true },
    { k: "move", ok: true },
    { k: "exercise", ok: true },
    { k: "stand", ok: true },
    { k: "sleep", ok: true },
    { k: "POST", ok: true },
  ];
  return (
    <Panel>
      <PanelHeader icon="◐" eyebrow="iOS Shortcut" status="armed" statusColor={C.exercise} />
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 14 }}>
        <BigNumber value="23:00" size={34} color={C.text} />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: C.muted }}>
          next run
        </span>
      </div>
      <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
        {steps.map((s) => (
          <div
            key={s.k}
            style={{
              flex: 1,
              height: 6,
              borderRadius: 2,
              background: s.ok ? C.exercise : C.mutedSoft,
              opacity: s.ok ? 1 : 0.4,
            }}
          />
        ))}
      </div>
      <div
        style={{
          display: "flex",
          gap: 6,
          fontFamily: "var(--font-mono)",
          fontSize: 9,
          color: C.muted,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        {steps.map((s) => (
          <div key={s.k} style={{ flex: 1, textAlign: "center" }}>
            {s.k}
          </div>
        ))}
      </div>
      <PanelFooter note="// ran 21:14 · 5 samples" right="daily · 23:00" />
    </Panel>
  );
}

// ─── SnapshotLog ──────────────────────────────────────────────
export function SnapshotLog() {
  const entries = [
    { t: "21:14", status: 200, kcal: 544, min: 80, steps: 300, via: "shortcut" },
    { t: "14:02", status: 200, kcal: 310, min: 42, steps: 180, via: "shortcut" },
    { t: "07:41", status: 200, kcal: 120, min: 12, steps: 80, via: "shortcut" },
    { t: "y 23:11", status: 200, kcal: 612, min: 68, steps: 420, via: "shortcut" },
    {
      t: "y 19:02",
      status: 401,
      kcal: null,
      min: null,
      steps: null,
      via: "curl",
      err: "unauthorized",
    },
    { t: "y 12:00", status: 200, kcal: 340, min: 28, steps: 220, via: "shortcut" },
  ] as const;
  return (
    <Panel>
      <PanelHeader icon="≡" eyebrow="POST /api/wristkit-sync" status="6 recent" />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "68px 44px 1fr auto",
          rowGap: 8,
          columnGap: 12,
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          alignItems: "center",
        }}
      >
        {(["TIME", "CODE", "PAYLOAD", "SRC"] as const).map((h) => (
          <div key={h} style={{ color: C.mutedSoft, fontSize: 9, letterSpacing: "0.12em" }}>
            {h}
          </div>
        ))}
        {entries.map((e) => (
          <div key={`${e.t}-${e.status}`} style={{ display: "contents" }}>
            <div style={{ color: C.muted }}>{e.t}</div>
            <div
              style={{
                color: e.status === 200 ? C.exercise : "var(--status-error)",
                fontWeight: 600,
              }}
            >
              {e.status}
            </div>
            <div
              style={{
                color: C.text,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {"err" in e && e.err ? (
                <span style={{ color: "var(--status-error)" }}>× {e.err}</span>
              ) : (
                <>
                  <span style={{ color: C.move }}>{e.kcal}</span>
                  <span style={{ color: C.mutedSoft }}> · </span>
                  <span style={{ color: C.exercise }}>{e.min}m</span>
                  <span style={{ color: C.mutedSoft }}> · </span>
                  <span style={{ color: C.steps }}>{e.steps}</span>
                </>
              )}
            </div>
            <div style={{ color: C.muted, fontSize: 10 }}>{e.via}</div>
          </div>
        ))}
      </div>
      <PanelFooter note="// last 24h · x-api-key ✓" right="live tail" />
    </Panel>
  );
}
