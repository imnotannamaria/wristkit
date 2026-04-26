import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TodayActivityCard } from "../../components/today-activity-card/index";

const okData = {
  kcal: 480,
  kcalGoal: 600,
  exerciseMinutes: 35,
  exerciseGoal: 30,
  steps: 9_200,
  stepsGoal: 8_000,
  lastSync: new Date("2026-04-26T20:00:00Z"),
};

describe("TodayActivityCard", () => {
  it("loading state: shows 'loading' status and syncing text", () => {
    render(<TodayActivityCard state={{ kind: "loading" }} />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    expect(screen.getByText(/syncing/i)).toBeInTheDocument();
  });

  it("empty state: shows 'empty' status and shortcut hint", () => {
    render(<TodayActivityCard state={{ kind: "empty" }} />);
    expect(screen.getByText(/empty/i)).toBeInTheDocument();
    expect(screen.getByText(/install shortcut/i)).toBeInTheDocument();
  });

  it("error state: shows 'error' status and message", () => {
    render(
      <TodayActivityCard state={{ kind: "error", message: "WRISTKIT_DATABASE_URL not set" }} />,
    );
    expect(screen.getByText(/error/i)).toBeInTheDocument();
    expect(screen.getByText(/WRISTKIT_DATABASE_URL not set/)).toBeInTheDocument();
  });

  it("error state: shows default message when none provided", () => {
    render(<TodayActivityCard state={{ kind: "error" }} />);
    expect(screen.getByText(/unknown error/i)).toBeInTheDocument();
  });

  it("stale state: shows 'stale' status and data values", () => {
    const lastSync = new Date(Date.now() - 30 * 60 * 60 * 1000); // 30h ago
    render(<TodayActivityCard state={{ kind: "stale", data: okData, lastSync }} />);
    expect(screen.getByText(/stale/i)).toBeInTheDocument();
    expect(screen.getByText(/480/)).toBeInTheDocument();
    expect(screen.getByText(/35/)).toBeInTheDocument();
    expect(screen.getByText(/run shortcut/i)).toBeInTheDocument();
  });

  it("partial state: shows 'partial' status and missing metrics in footer", () => {
    render(<TodayActivityCard state={{ kind: "partial", data: okData, missing: ["steps"] }} />);
    expect(screen.getByText(/partial/i)).toBeInTheDocument();
    expect(screen.getByText(/missing:.*Steps/i)).toBeInTheDocument();
  });

  it("ok state: shows 'synced' status and all three metric values", () => {
    render(<TodayActivityCard state={{ kind: "ok", data: okData }} />);
    // "synced" appears in both the header status and the footer "synced HH:MM"
    expect(screen.getAllByText(/synced/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/480/)).toBeInTheDocument();
    expect(screen.getByText(/35/)).toBeInTheDocument();
    expect(screen.getByText(/9200/)).toBeInTheDocument();
    expect(screen.getByText(/up to date/i)).toBeInTheDocument();
  });

  it("all states render activity rings SVG", () => {
    const { unmount } = render(<TodayActivityCard state={{ kind: "ok", data: okData }} />);
    expect(screen.getByRole("img", { name: /activity rings/i })).toBeInTheDocument();
    unmount();

    render(<TodayActivityCard state={{ kind: "loading" }} />);
    expect(screen.getByRole("img", { name: /activity rings/i })).toBeInTheDocument();
  });
});
