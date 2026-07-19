import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { createDb } from "../../lib/db";
import { samples } from "../../lib/schema";
import { IngestPayloadSchema } from "../../lib/validation";

// ─── config ──────────────────────────────────────────────────
const MAX_BODY_BYTES = 256 * 1024; // 256 KB is plenty for 1000 samples.
const RATE_LIMIT_MAX = 30; // requests per IP per window
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000; // 5 minutes

// ─── rate limit ──────────────────────────────────────────────
// In-memory bucket. Fine for a single Shortcut + the occasional retry.
// For production traffic, swap this for @vercel/firewall, @upstash/ratelimit,
// or a similar provider-backed bucket that survives cold starts.
type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

function rateLimit(ip: string): { ok: boolean; retryAfterSec: number } {
  const now = Date.now();
  // Bound memory on long-lived servers (`next start`, self-host): once the map
  // grows large, drop buckets whose window already elapsed, so spoofed
  // x-forwarded-for IPs can't accumulate forever. No-op on serverless.
  if (buckets.size > 1000) {
    for (const [key, b] of buckets) {
      if (b.resetAt <= now) buckets.delete(key);
    }
  }
  const existing = buckets.get(ip);
  if (!existing || existing.resetAt <= now) {
    buckets.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { ok: true, retryAfterSec: 0 };
  }
  if (existing.count >= RATE_LIMIT_MAX) {
    return { ok: false, retryAfterSec: Math.ceil((existing.resetAt - now) / 1000) };
  }
  existing.count += 1;
  return { ok: true, retryAfterSec: 0 };
}

function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]?.trim() || "unknown";
  return req.headers.get("x-real-ip") ?? "unknown";
}

// ─── auth ────────────────────────────────────────────────────
function apiKeyMatches(provided: string | null, expected: string | undefined): boolean {
  if (!provided || !expected) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

// ─── handler ─────────────────────────────────────────────────
export async function POST(req: Request) {
  const ip = clientIp(req);
  const rl = rateLimit(ip);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "rate_limited" },
      { status: 429, headers: { "retry-after": String(rl.retryAfterSec) } },
    );
  }

  if (!req.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.json({ error: "expected application/json" }, { status: 415 });
  }

  const contentLength = Number(req.headers.get("content-length") ?? "0");
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "payload too large" }, { status: 413 });
  }

  if (!apiKeyMatches(req.headers.get("x-api-key"), process.env.WRISTKIT_API_KEY)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const url = process.env.WRISTKIT_DATABASE_URL;
  if (!url) {
    return NextResponse.json({ error: "db not configured" }, { status: 500 });
  }

  const json = await req.json().catch(() => null);
  const parsed = IngestPayloadSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid payload", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  // The Shortcut sends a flat dictionary with today's three Apple Health
  // values and no timestamp. Expand into one row per metric, stamping
  // recorded_at with the ingest time — the Shortcut is scheduled at
  // end-of-day so this is close enough for the daily aggregate.
  const recordedAt = new Date();
  const rows = [
    { metric: "kcal" as const, value: parsed.data.moveKcal, unit: "kcal" },
    { metric: "exercise_minutes" as const, value: parsed.data.exerciseMin, unit: "min" },
    { metric: "steps" as const, value: parsed.data.steps, unit: "count" },
  ];

  const { db } = createDb(url);
  try {
    await db.insert(samples).values(
      rows.map((r) => ({
        metric: r.metric,
        value: r.value.toString(),
        unit: r.unit,
        recordedAt,
        source: "apple_watch",
      })),
    );
  } catch (err) {
    console.error("[wristkit-sync] ingest failed", err);
    return NextResponse.json({ error: "ingest failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, inserted: rows.length });
}
