import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  try {
    const file = path.join(process.cwd(), "public", "r", `${name}.json`);
    const content = await readFile(file, "utf8");
    return new NextResponse(content, {
      headers: {
        "content-type": "application/json",
        "cache-control": "public, max-age=300, stale-while-revalidate=86400",
      },
    });
  } catch {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
}
