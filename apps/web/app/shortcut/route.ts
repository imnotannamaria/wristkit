import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const file = path.join(
      process.cwd(),
      "..",
      "..",
      "packages",
      "registry",
      "shortcuts",
      "wristkit-sync.shortcut",
    );
    const content = await readFile(file);
    return new NextResponse(content, {
      headers: {
        "content-type": "application/x-apple-shortcut",
        "content-disposition": 'attachment; filename="wristkit-sync.shortcut"',
      },
    });
  } catch {
    return NextResponse.json({ error: "shortcut not found" }, { status: 404 });
  }
}
