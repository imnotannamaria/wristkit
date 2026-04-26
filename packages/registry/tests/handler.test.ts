import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "../handlers/healthkit-handler/route";

vi.mock("next/server", () => ({
  NextResponse: {
    json: (body: unknown, init?: ResponseInit) =>
      new Response(JSON.stringify(body), {
        ...init,
        headers: { "content-type": "application/json" },
      }),
  },
}));

const mockInsertValues = vi.fn().mockResolvedValue(undefined);
const mockDb = { insert: () => ({ values: mockInsertValues }) };
const mockClose = vi.fn().mockResolvedValue(undefined);

vi.mock("../lib/db", () => ({
  createDb: vi.fn(() => ({ db: mockDb, close: mockClose })),
}));

const VALID_SAMPLE = {
  metric: "kcal",
  value: 540,
  unit: "kcal",
  recorded_at: "2026-04-26T23:59:00-03:00",
  source: "apple_watch",
};

function makeRequest(body: unknown, apiKey?: string): Request {
  return new Request("http://localhost/api/healthkit", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(apiKey ? { "x-api-key": apiKey } : {}),
    },
    body: JSON.stringify(body),
  });
}

describe("healthkit handler", () => {
  beforeEach(() => {
    vi.stubEnv("WRISTKIT_API_KEY", "test-key-abc");
    vi.stubEnv("WRISTKIT_DATABASE_URL", "postgres://localhost/test");
    mockInsertValues.mockClear();
    mockClose.mockClear();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns 401 when x-api-key is missing", async () => {
    const res = await POST(makeRequest({ samples: [VALID_SAMPLE] }));
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toBe("unauthorized");
  });

  it("returns 401 when x-api-key is wrong", async () => {
    const res = await POST(makeRequest({ samples: [VALID_SAMPLE] }, "wrong-key"));
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toBe("unauthorized");
  });

  it("returns 400 when payload is empty object", async () => {
    const res = await POST(makeRequest({}, "test-key-abc"));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("invalid payload");
  });

  it("returns 400 when samples array is empty", async () => {
    const res = await POST(makeRequest({ samples: [] }, "test-key-abc"));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("invalid payload");
  });

  it("returns 400 when metric is invalid", async () => {
    const res = await POST(
      makeRequest({ samples: [{ ...VALID_SAMPLE, metric: "heartrate" }] }, "test-key-abc"),
    );
    expect(res.status).toBe(400);
  });

  it("returns 200 and inserted count on valid payload", async () => {
    const res = await POST(
      makeRequest(
        {
          samples: [
            VALID_SAMPLE,
            {
              metric: "exercise_minutes",
              value: 45,
              unit: "min",
              recorded_at: "2026-04-26T23:59:00-03:00",
            },
            {
              metric: "steps",
              value: 8500,
              unit: "count",
              recorded_at: "2026-04-26T23:59:00-03:00",
            },
          ],
        },
        "test-key-abc",
      ),
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.inserted).toBe(3);
    expect(mockInsertValues).toHaveBeenCalledOnce();
    expect(mockClose).toHaveBeenCalledOnce();
  });
});
