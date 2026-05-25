import type * as React from "react";
import type { Metric } from "../../lib/validation";
import type { TodayData } from "./load";

// Entrepta palette. Kept as literal hex so the component is portable
// (no CSS variables required in the host project).
const colors = {
  bg: "#0b0b0f",
  panel: "rgba(255,255,255,0.03)",
  border: "rgba(255,255,255,0.10)",
  text: "rgba(255,255,255,0.88)",
  muted: "rgba(255,255,255,0.55)",
  subtle: "rgba(255,255,255,0.70)",
  move: "#7c6bff", // violet
  exercise: "#10b981", // emerald
  steps: "#f59e0b", // amber
  warn: "#f59e0b",
  danger: "#f43f5e",
};

function clamp01(x: number): number {
  if (Number.isNaN(x) || !Number.isFinite(x)) return 0;
  return Math.min(1, Math.max(0, x));
}

function Ring({
  r,
  value,
  max,
  color,
  cx,
  cy,
}: {
  r: number;
  value: number;
  max: number;
  color: string;
  cx: number;
  cy: number;
}) {
  const circ = 2 * Math.PI * r;
  const p = clamp01(max > 0 ? value / max : 0);
  return (
    <>
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
        strokeDasharray={`${circ * p} ${circ}`}
        transform={`rotate(-90 ${cx} ${cy})`}
      />
    </>
  );
}

function Panel({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={className}
      style={{
        background: colors.panel,
        border: `1px solid ${colors.border}`,
        borderRadius: 18,
        padding: 18,
        color: colors.text,
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
      }}
    >
      {children}
    </section>
  );
}

function Header({
  status,
  statusColor,
}: {
  status: string;
  statusColor: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
      <div style={{ display: "flex", gap: 10, alignItems: "baseline" }}>
        <span
          style={{
            color: colors.muted,
            fontSize: 11,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          Today / Activity
        </span>
      </div>
      <span
        style={{
          color: statusColor,
          fontSize: 11,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
        }}
      >
        {status}
      </span>
    </div>
  );
}

function MetricRow({
  dot,
  label,
  value,
  suffix,
}: {
  dot: string;
  label: string;
  value: React.ReactNode;
  suffix?: string;
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
          opacity: 0.7,
        }}
      />
      <span
        style={{
          color: colors.muted,
          fontSize: 10,
          letterSpacing: "0.12em",
          minWidth: 78,
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
      <span style={{ flex: 1, minWidth: 0, textAlign: "right" }}>
        <span style={{ fontFamily: "ui-serif, Georgia, serif", fontSize: 26, fontWeight: 500 }}>
          {value}
        </span>
        {suffix ? (
          <span style={{ color: colors.muted, marginLeft: 6, fontSize: 11 }}>{suffix}</span>
        ) : null}
      </span>
    </div>
  );
}

function Footer({ left, right }: { left: React.ReactNode; right: React.ReactNode }) {
  return (
    <div
      style={{
        marginTop: 14,
        paddingTop: 12,
        borderTop: `1px dashed ${colors.border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
      }}
    >
      <span style={{ color: colors.muted, fontSize: 11 }}>{left}</span>
      <span style={{ color: colors.subtle, fontSize: 11 }}>{right}</span>
    </div>
  );
}

export function TodayActivityCardLoading({ className }: { className?: string }) {
  const cx = 72;
  const cy = 72;
  return (
    <Panel className={className}>
      <Header status="loading" statusColor={colors.muted} />
      <div
        style={{
          marginTop: 12,
          display: "grid",
          gridTemplateColumns: "minmax(0,1fr) minmax(0,1.15fr)",
          gap: 20,
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center" }}>
          <svg
            width={144}
            height={144}
            viewBox="0 0 144 144"
            role="img"
            aria-label="Activity rings"
          >
            <title>Activity rings</title>
            <Ring r={52} value={1} max={1} color={colors.move} cx={cx} cy={cy} />
            <Ring r={38} value={1} max={1} color={colors.exercise} cx={cx} cy={cy} />
            <Ring r={24} value={1} max={1} color={colors.steps} cx={cx} cy={cy} />
          </svg>
        </div>
        <div style={{ opacity: 0.75 }}>
          <MetricRow dot={colors.move} label="Move" value="—" suffix="kcal" />
          <div style={{ margin: "10px 0", borderTop: `1px dotted ${colors.border}` }} />
          <MetricRow dot={colors.exercise} label="Exercise" value="—" suffix="min" />
          <div style={{ margin: "10px 0", borderTop: `1px dotted ${colors.border}` }} />
          <MetricRow dot={colors.steps} label="Steps" value="—" />
        </div>
      </div>
      <Footer left="// syncing…" right={<output>waiting for data</output>} />
    </Panel>
  );
}

export function TodayActivityCardEmpty({ className }: { className?: string }) {
  const cx = 72;
  const cy = 72;
  return (
    <Panel className={className}>
      <Header status="empty" statusColor={colors.muted} />
      <div
        style={{
          marginTop: 12,
          display: "grid",
          gridTemplateColumns: "minmax(0,1fr) minmax(0,1.15fr)",
          gap: 20,
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center" }}>
          <svg
            width={144}
            height={144}
            viewBox="0 0 144 144"
            role="img"
            aria-label="No activity yet"
          >
            <title>No activity yet</title>
            <Ring r={52} value={0} max={1} color={colors.move} cx={cx} cy={cy} />
            <Ring r={38} value={0} max={1} color={colors.exercise} cx={cx} cy={cy} />
            <Ring r={24} value={0} max={1} color={colors.steps} cx={cx} cy={cy} />
          </svg>
        </div>
        <div>
          <MetricRow dot={colors.move} label="Move" value="—" suffix="kcal" />
          <div style={{ margin: "10px 0", borderTop: `1px dotted ${colors.border}` }} />
          <MetricRow dot={colors.exercise} label="Exercise" value="—" suffix="min" />
          <div style={{ margin: "10px 0", borderTop: `1px dotted ${colors.border}` }} />
          <MetricRow dot={colors.steps} label="Steps" value="—" />
        </div>
      </div>
      <Footer
        left="// no data yet — run the shortcut on iPhone"
        right={<span style={{ color: colors.muted }}>install shortcut →</span>}
      />
    </Panel>
  );
}

export function TodayActivityCardError({
  message,
  className,
}: {
  message?: string;
  className?: string;
}) {
  return (
    <Panel className={className}>
      <Header status="error" statusColor={colors.danger} />
      <div style={{ marginTop: 12, color: colors.muted, fontSize: 13, lineHeight: 1.5 }}>
        <div style={{ color: colors.text, marginBottom: 6 }}>Couldn’t load today’s activity.</div>
        <div
          style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" }}
        >
          {message ?? "unknown error"}
        </div>
      </div>
      <Footer
        left="// check env + database connection"
        right={<span style={{ color: colors.muted }}>see docs</span>}
      />
    </Panel>
  );
}

export function TodayActivityCardStale({
  data,
  className,
}: {
  data: TodayData;
  className?: string;
}) {
  const cx = 72;
  const cy = 72;
  const hoursAgo = data.hoursSinceSync;
  return (
    <Panel className={className}>
      <Header status="stale" statusColor={colors.warn} />
      <div
        style={{
          marginTop: 12,
          display: "grid",
          gridTemplateColumns: "minmax(0,1fr) minmax(0,1.15fr)",
          gap: 20,
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center" }}>
          <svg
            width={144}
            height={144}
            viewBox="0 0 144 144"
            role="img"
            aria-label="Activity rings"
          >
            <title>Activity rings</title>
            <Ring
              r={52}
              value={data.kcal}
              max={data.kcalGoal}
              color={colors.move}
              cx={cx}
              cy={cy}
            />
            <Ring
              r={38}
              value={data.exerciseMinutes}
              max={data.exerciseGoal}
              color={colors.exercise}
              cx={cx}
              cy={cy}
            />
            <Ring
              r={24}
              value={data.steps}
              max={data.stepsGoal}
              color={colors.steps}
              cx={cx}
              cy={cy}
            />
          </svg>
        </div>
        <div>
          <MetricRow dot={colors.move} label="Move" value={Math.round(data.kcal)} suffix="kcal" />
          <div style={{ margin: "10px 0", borderTop: `1px dotted ${colors.border}` }} />
          <MetricRow
            dot={colors.exercise}
            label="Exercise"
            value={Math.round(data.exerciseMinutes)}
            suffix="min"
          />
          <div style={{ margin: "10px 0", borderTop: `1px dotted ${colors.border}` }} />
          <MetricRow dot={colors.steps} label="Steps" value={Math.round(data.steps)} />
        </div>
      </div>
      <Footer
        left={`// last sync ${hoursAgo}h ago`}
        right={<span style={{ color: colors.warn }}>run shortcut</span>}
      />
    </Panel>
  );
}

function metricLabel(m: Metric): string {
  switch (m) {
    case "kcal":
      return "Move";
    case "exercise_minutes":
      return "Exercise";
    case "steps":
      return "Steps";
  }
}

export function TodayActivityCardPartial({
  data,
  missing,
  className,
}: {
  data: TodayData;
  missing: Metric[];
  className?: string;
}) {
  const cx = 72;
  const cy = 72;
  const missingText = missing.map(metricLabel).join(", ");
  return (
    <Panel className={className}>
      <Header status="partial" statusColor={colors.warn} />
      <div
        style={{
          marginTop: 12,
          display: "grid",
          gridTemplateColumns: "minmax(0,1fr) minmax(0,1.15fr)",
          gap: 20,
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center" }}>
          <svg
            width={144}
            height={144}
            viewBox="0 0 144 144"
            role="img"
            aria-label="Activity rings"
          >
            <title>Activity rings</title>
            <Ring
              r={52}
              value={data.kcal}
              max={data.kcalGoal}
              color={colors.move}
              cx={cx}
              cy={cy}
            />
            <Ring
              r={38}
              value={data.exerciseMinutes}
              max={data.exerciseGoal}
              color={colors.exercise}
              cx={cx}
              cy={cy}
            />
            <Ring
              r={24}
              value={data.steps}
              max={data.stepsGoal}
              color={colors.steps}
              cx={cx}
              cy={cy}
            />
          </svg>
        </div>
        <div>
          <MetricRow dot={colors.move} label="Move" value={Math.round(data.kcal)} suffix="kcal" />
          <div style={{ margin: "10px 0", borderTop: `1px dotted ${colors.border}` }} />
          <MetricRow
            dot={colors.exercise}
            label="Exercise"
            value={Math.round(data.exerciseMinutes)}
            suffix="min"
          />
          <div style={{ margin: "10px 0", borderTop: `1px dotted ${colors.border}` }} />
          <MetricRow dot={colors.steps} label="Steps" value={Math.round(data.steps)} />
        </div>
      </div>
      <Footer left={`// missing: ${missingText}`} right={`synced ${data.lastSyncLabel}`} />
    </Panel>
  );
}

export function TodayActivityCardOk({ data, className }: { data: TodayData; className?: string }) {
  const cx = 72;
  const cy = 72;
  return (
    <Panel className={className}>
      <Header status="synced" statusColor={colors.exercise} />
      <div
        style={{
          marginTop: 12,
          display: "grid",
          gridTemplateColumns: "minmax(0,1fr) minmax(0,1.15fr)",
          gap: 20,
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center" }}>
          <svg
            width={144}
            height={144}
            viewBox="0 0 144 144"
            role="img"
            aria-label="Activity rings"
          >
            <title>Activity rings</title>
            <Ring
              r={52}
              value={data.kcal}
              max={data.kcalGoal}
              color={colors.move}
              cx={cx}
              cy={cy}
            />
            <Ring
              r={38}
              value={data.exerciseMinutes}
              max={data.exerciseGoal}
              color={colors.exercise}
              cx={cx}
              cy={cy}
            />
            <Ring
              r={24}
              value={data.steps}
              max={data.stepsGoal}
              color={colors.steps}
              cx={cx}
              cy={cy}
            />
          </svg>
        </div>
        <div>
          <MetricRow dot={colors.move} label="Move" value={Math.round(data.kcal)} suffix="kcal" />
          <div style={{ margin: "10px 0", borderTop: `1px dotted ${colors.border}` }} />
          <MetricRow
            dot={colors.exercise}
            label="Exercise"
            value={Math.round(data.exerciseMinutes)}
            suffix="min"
          />
          <div style={{ margin: "10px 0", borderTop: `1px dotted ${colors.border}` }} />
          <MetricRow dot={colors.steps} label="Steps" value={Math.round(data.steps)} />
        </div>
      </div>
      <Footer left="// up to date" right={`synced ${data.lastSyncLabel}`} />
    </Panel>
  );
}
