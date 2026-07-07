import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

/**
 * Serves the iOS Shortcut file with the correct MIME so Safari hands it
 * straight to the Shortcuts app on iPhone. The file is copied into
 * `apps/web/public/` by the prebuild script, so on Vercel we read it
 * from the deployment bundle.
 */
export async function GET() {
  try {
    const file = path.join(process.cwd(), "public", "wristkit-sync.shortcut");
    const content = await readFile(file);
    return new NextResponse(content, {
      headers: {
        "content-type": "application/x-apple-shortcut",
        "content-disposition": 'attachment; filename="wristkit-sync.shortcut"',
        "cache-control": "public, max-age=300, stale-while-revalidate=86400",
      },
    });
  } catch {
    return NextResponse.json({ error: "shortcut not found" }, { status: 404 });
  }
}
