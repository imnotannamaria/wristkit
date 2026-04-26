import kleur from "kleur";

export async function shortcutCommand() {
  const url = "https://wristkit-web.vercel.app/shortcut";
  console.log(
    [
      "1. Open this URL on your iPhone:",
      `   ${url}`,
      "",
      "2. Tap “Add Shortcut”.",
      "",
      "3. Edit the two fields when prompted:",
      "   - URL: https://your-site.com/api/healthkit",
      "   - API key: <copy from your .env.local WRISTKIT_API_KEY>",
      "",
      "4. Set up an iOS Automation to run the Shortcut daily at 23:59.",
      "",
      kleur.green("Done. Open your site to see your data."),
    ].join("\n"),
  );
}
