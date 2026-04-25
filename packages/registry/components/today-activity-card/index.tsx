import type * as React from "react";
import type { TodayState } from "./load";
import { loadTodayActivity } from "./load";
import {
  TodayActivityCardEmpty,
  TodayActivityCardError,
  TodayActivityCardLoading,
  TodayActivityCardOk,
  TodayActivityCardPartial,
  TodayActivityCardStale,
} from "./states";

export { loadTodayActivity };
export type { TodayData, TodayState } from "./load";

export function TodayActivityCard({
  state,
  className,
}: {
  state: TodayState;
  className?: string;
}): React.JSX.Element {
  switch (state.kind) {
    case "loading":
      return <TodayActivityCardLoading className={className} />;
    case "empty":
      return <TodayActivityCardEmpty className={className} />;
    case "error":
      return <TodayActivityCardError className={className} message={state.message} />;
    case "stale":
      return (
        <TodayActivityCardStale className={className} data={state.data} lastSync={state.lastSync} />
      );
    case "partial":
      return (
        <TodayActivityCardPartial className={className} data={state.data} missing={state.missing} />
      );
    case "ok":
      return <TodayActivityCardOk className={className} data={state.data} />;
  }
}
