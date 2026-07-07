import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "../handlers/wristkit-sync-handler/route";

vi.mock("next/server", () => ({
  NextResponse: {
    json: (body: unknown, init?: ResponseInit) =>
      new Response(JSON.stringify(body), {
        ...init,
        headers: { ...(init?.headers ?? {}), "content-type": "application/json" },
      }),
  },
}));

const mockInsertValues = vi.fn().mockResolvedValue(undefined);
const mockDb = { insert: () => ({ values: mockInsertValues }) };

vi.mock("../lib/db", () => ({
  createDb: vi.fn(() => ({ db: mockDb, close: async () => {} })),
}));

const VALID_PAYLOAD = {
  steps: 8500,
  moveKcal: 540,
  exerciseMin: 45,
};

let ipCounter = 0;
function uniqueIp(): string {
  ipCounter += 1;
  return `10.0.0.${ipCounter}`;
}

function makeRequest(body: unknown, apiKey?: string, ip?: string): Request {
  return new Request("http://localhost/api/wristkit-sync", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": ip ?? uniqueIp(),
      ...(apiKey ? { "x-api-key": apiKey } : {}),
    },
    body: JSON.stringify(body),
  });
}

describe("wristkit-sync handler", () => {
  beforeEach(() => {
    vi.stubEnv("WRISTKIT_API_KEY", "test-key-abc");
    vi.stubEnv("WRISTKIT_DATABASE_URL", "postgres://localhost/test");
    mockInsertValues.mockClear();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns 401 when x-api-key is missing", async () => {
    const res = await POST(makeRequest(VALID_PAYLOAD));
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toBe("unauthorized");
  });

  it("returns 401 when x-api-key is wrong", async () => {
    const res = await POST(makeRequest(VALID_PAYLOAD, "wrong-key-xx"));
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

  it("returns 400 when a metric is missing", async () => {
    const res = await POST(makeRequest({ steps: 1, moveKcal: 1 }, "test-key-abc"));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("invalid payload");
  });

  it("returns 400 when a metric is negative", async () => {
    const res = await POST(makeRequest({ ...VALID_PAYLOAD, steps: -1 }, "test-key-abc"));
    expect(res.status).toBe(400);
  });

  it("returns 400 when extra keys leak through", async () => {
    const res = await POST(makeRequest({ ...VALID_PAYLOAD, extra: "nope" }, "test-key-abc"));
    expect(res.status).toBe(400);
  });

  it("returns 415 when content-type is not JSON", async () => {
    const req = new Request("http://localhost/api/wristkit-sync", {
      method: "POST",
      headers: {
        "content-type": "text/plain",
        "x-api-key": "test-key-abc",
        "x-forwarded-for": uniqueIp(),
      },
      body: "hi",
    });
    const res = await POST(req);
    expect(res.status).toBe(415);
  });

  it("returns 429 after the per-IP limit is exhausted", async () => {
    const ip = "10.0.0.250";
    for (let i = 0; i < 30; i += 1) {
      await POST(makeRequest(VALID_PAYLOAD, "test-key-abc", ip));
    }
    const res = await POST(makeRequest(VALID_PAYLOAD, "test-key-abc", ip));
    expect(res.status).toBe(429);
    expect(res.headers.get("retry-after")).toBeTruthy();
  });

  it("returns 200 and inserts one row per metric on valid payload", async () => {
    const res = await POST(makeRequest(VALID_PAYLOAD, "test-key-abc"));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.inserted).toBe(3);
    expect(mockInsertValues).toHaveBeenCalledOnce();
    const inserted = mockInsertValues.mock.calls[0]?.[0] as Array<{
      metric: string;
      value: string;
      unit: string;
    }>;
    expect(inserted.map((r) => r.metric).sort()).toEqual(["exercise_minutes", "kcal", "steps"]);
  });
});
