"use client";

import {
  TodayActivityCardDemo,
  TodayActivityCardEmpty,
  TodayActivityCardError,
  TodayActivityCardLoading,
  TodayActivityCardStale,
} from "@/components/cards/today-activity-card-demo";
import { Spotlight, useSpotlight } from "@/components/entrepta/spotlight";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/entrepta/tabs";
import { useState } from "react";

const STATES = [
  { id: "ok", label: "Synced", Component: TodayActivityCardDemo },
  { id: "loading", label: "Loading", Component: TodayActivityCardLoading },
  { id: "empty", label: "Empty", Component: TodayActivityCardEmpty },
  { id: "stale", label: "Stale", Component: TodayActivityCardStale },
  { id: "error", label: "Error", Component: TodayActivityCardError },
];

export function ActivityPreview() {
  const [state, setState] = useState("ok");
  const { onMouseMove, spotlight } = useSpotlight(500);
  return (
    <div className="activity-preview" onMouseMove={onMouseMove}>
      <Spotlight {...spotlight} />
      <div className="relative">
        <Tabs value={state} onValueChange={setState}>
          <div className="preview-caption">
            <span>Activity Card</span>
            <span>Interactive preview</span>
          </div>
          {STATES.map(({ id, Component }) => (
            <TabsContent key={id} value={id} className="m-0" tabIndex={-1}>
              <Component />
            </TabsContent>
          ))}
          <TabsList
            aria-label="Preview component state"
            className="mt-5 rounded-lg border border-[var(--border-subtle)]"
          >
            {STATES.map(({ id, label }) => (
              <TabsTrigger key={id} value={id}>
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <p className="preview-note">Sample data · configurable demo goals</p>
      </div>
    </div>
  );
}
