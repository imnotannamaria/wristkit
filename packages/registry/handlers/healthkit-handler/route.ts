import { NextResponse } from "next/server";
import { createDb } from "../../lib/db";
import { samples } from "../../lib/schema";
import { IngestPayloadSchema } from "../../lib/validation";

export async function POST(req: Request) {
  const apiKey = req.headers.get("x-api-key");
  if (!apiKey || apiKey !== process.env.WRISTKIT_API_KEY) {
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

  const { db, close } = createDb(url);
  try {
    await db.insert(samples).values(
      parsed.data.samples.map((s) => ({
        metric: s.metric,
        value: s.value.toString(),
        unit: s.unit,
        recordedAt: new Date(s.recorded_at),
        source: s.source ?? null,
      })),
    );
  } finally {
    await close();
  }

  return NextResponse.json({ ok: true, inserted: parsed.data.samples.length });
}
