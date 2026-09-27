import type * as React from "react";
import type { TodayData } from "./load";
import "./styles.css";

const METRICS = [
  { id: "move", label: "Move", value: "kcal", goal: "kcalGoal", unit: "kcal" },
  {
    id: "exercise",
    label: "Exercise",
    value: "exerciseMinutes",
    goal: "exerciseGoal",
    unit: "min",
  },
  { id: "steps", label: "Steps", value: "steps", goal: "stepsGoal", unit: "steps" },
] as const;

type DisplayKind = "loading" | "empty" | "error" | "stale" | "ok";

export function ActivityRings({ data, kind = "ok" }: { data?: TodayData; kind?: DisplayKind }) {
  return (
    <svg className="wk-rings" viewBox="0 0 200 200" role="img" aria-label="Activity rings">
      <title>Activity rings</title>
      {METRICS.map((metric, index) => {
        const radius = 84 - index * 23;
        const value = data?.[metric.value] ?? 0;
        const goal = data?.[metric.goal] ?? 0;
        const progress =
          goal > 0 && Number.isFinite(value) ? Math.max(0, Math.min(value / goal, 1)) : 0;
        return (
          <g key={metric.id} className={`wk-ring wk-ring--${metric.id}`}>
            <circle className="wk-ring-track" cx="100" cy="100" r={radius} />
            {/* A zero-length dash with round caps still paints a dot, so an
                empty ring draws no value arc at all. */}
            {kind === "loading" || progress > 0 ? (
              <circle
                className="wk-ring-value"
                cx="100"
                cy="100"
                r={radius}
                pathLength="100"
                strokeDasharray={kind === "loading" ? "18 82" : `${progress * 100} 100`}
                transform="rotate(-90 100 100)"
              />
            ) : null}
          </g>
        );
      })}
      <path className="wk-ring-center" d="M94 99h12m-5-5 5 5-5 5" />
    </svg>
  );
}

function ActivityPanel({
  kind,
  data,
  className,
}: { kind: DisplayKind; data?: TodayData; className?: string }) {
  const status = kind === "ok" ? "synced" : kind;
  const notes: Record<DisplayKind, React.ReactNode> = {
    ok: "Up to date",
    loading: "Syncing your activity…",
    empty: "No data yet. Run the Shortcut on your iPhone.",
    error: "Something went wrong. We couldn't load today's activity.",
    stale: `Last sync ${data?.hoursSinceSync ?? 0}h ago. Run the Shortcut to update.`,
  };
  return (
    <section
      className={`wk-activity ${className ?? ""}`}
      data-state={kind}
      aria-label="Today's activity"
      aria-busy={kind === "loading"}
    >
      <header className="wk-activity-header">
        <span className="wk-activity-label">
          <span aria-hidden>↗</span> Today / Activity
        </span>
        <span className="wk-activity-status">
          <span aria-hidden className="wk-status-dot" />
          {status}
        </span>
      </header>
      <div className="wk-activity-body">
        <ActivityRings kind={kind} data={data} />
        <dl className="wk-metrics">
          {METRICS.map((metric) => (
            <div key={metric.id} className={`wk-metric wk-ring--${metric.id}`}>
              <dt>
                <span className="wk-metric-dot" aria-hidden />
                {metric.label}
              </dt>
              <dd>
                <span className="wk-metric-value">
                  {data ? Math.round(data[metric.value]).toLocaleString("en-US") : "—"}
                </span>
                <span className="wk-metric-goal">
                  {data ? `/ ${data[metric.goal].toLocaleString("en-US")} ` : ""}
                  {metric.unit}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
      <footer className="wk-activity-footer">
        <span aria-live="polite">{notes[kind]}</span>
        {kind === "ok" && data ? (
          <time dateTime={data.lastSyncIso}>Synced {data.lastSyncLabel}</time>
        ) : null}
        {kind === "empty" ? <span>Install Shortcut to connect.</span> : null}
        {kind === "error" ? <span>Please try again later.</span> : null}
      </footer>
    </section>
  );
}

export function TodayActivityCardLoading({ className }: { className?: string }) {
  return <ActivityPanel kind="loading" className={className} />;
}
export function TodayActivityCardEmpty({ className }: { className?: string }) {
  return <ActivityPanel kind="empty" className={className} />;
}
export function TodayActivityCardError({ className }: { className?: string }) {
  return <ActivityPanel kind="error" className={className} />;
}
export function TodayActivityCardStale({
  data,
  className,
}: { data: TodayData; className?: string }) {
  return <ActivityPanel kind="stale" data={data} className={className} />;
}
export function TodayActivityCardOk({ data, className }: { data: TodayData; className?: string }) {
  return <ActivityPanel kind="ok" data={data} className={className} />;
}
