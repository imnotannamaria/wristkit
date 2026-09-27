import { expect, test } from "@playwright/test";

test.describe("home page", () => {
  test("renders hero and today activity card demo", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("Apple Health");
    await expect(page.getByText(/today\s*\/\s*activity/i).first()).toBeVisible();
  });

  test("hero IDE preview tabs are interactive", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("tab", { name: /page\.tsx/i }).click();
    await expect(page.getByText("loadTodayActivity").first()).toBeVisible();
  });
});

test.describe("docs", () => {
  test("installation page loads with code block", async ({ page }) => {
    await page.goto("/docs/installation");
    await expect(page.locator("h1")).toContainText(/install/i);
    await expect(page.locator("pre").first()).toBeVisible();
  });

  test("sidebar nav highlights active link", async ({ page }) => {
    await page.goto("/docs/installation");
    const activeLink = page.locator('a[aria-current="page"]');
    await expect(activeLink).toBeVisible();
    await expect(activeLink).toContainText("Installation");
  });
});

test.describe("shortcut endpoint", () => {
  test("/shortcut returns application/x-apple-shortcut content-type", async ({ request }) => {
    const res = await request.get("/shortcut");
    const contentType = res.headers()["content-type"] ?? "";
    expect(contentType).toContain("apple-shortcut");
  });
});

for (const width of [390, 820]) {
  test.describe(`responsive layout (${width}px)`, () => {
    test.use({ viewport: { width, height: 844 } });

    for (const path of [
      "/",
      "/docs",
      "/docs/installation",
      "/docs/components/today-activity-card",
    ]) {
      test(`no horizontal overflow on ${path}`, async ({ page }) => {
        await page.goto(path);
        // documentElement.scrollWidth must not exceed its clientWidth, otherwise
        // something is bleeding past the viewport and the page scrolls sideways.
        const overflow = await page.evaluate(() => {
          const el = document.documentElement;
          return el.scrollWidth - el.clientWidth;
        });
        expect(overflow).toBeLessThanOrEqual(1);
      });
    }
  });
}

test.describe("Entrepta themes and activity preview", () => {
  test("theme selection persists through reload and navigation", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /Theme: Entrepta/ }).click();
    await page.getByRole("button", { name: "Blossom", exact: true }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "blossom");
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "blossom");
    await page.goto("/docs/installation");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "blossom");
  });

  test("all five states remain usable with keyboard navigation", async ({ page }) => {
    await page.goto("/");
    const tabs = page.getByRole("tablist", { name: "Preview component state" });
    await tabs.getByRole("tab", { name: "Synced", exact: true }).focus();
    await page.keyboard.press("ArrowRight");
    await expect(tabs.getByRole("tab", { name: "Loading", exact: true })).toBeFocused();
    await expect(page.getByRole("region", { name: "Today's activity" })).toHaveAttribute(
      "aria-busy",
      "true",
    );
    for (const name of ["Empty", "Stale", "Error", "Synced"]) {
      await tabs.getByRole("tab", { name, exact: true }).click();
      await expect(page.getByRole("region", { name: "Today's activity" })).toBeVisible();
      await expect(page.getByRole("img", { name: "Activity rings" })).toBeVisible();
    }
  });

  test("installation includes the stylesheet from the registry", async ({ page }) => {
    await page.goto("/docs/installation");
    await page.getByRole("tab", { name: "styles.css", exact: true }).click();
    await expect(page.getByRole("tabpanel").filter({ hasText: "--wk-bg" })).toBeVisible();
  });
});

test.describe("small screens and reduced motion", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  for (const mode of ["dark", "light"]) {
    test(`all themes fit at 375px in ${mode} mode`, async ({ page }, testInfo) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto("/");
      for (const theme of ["entrepta", "blossom", "marmalade", "julia", "ivy", "bosco"]) {
        await page.evaluate(
          ({ theme, mode }) => {
            localStorage.setItem("wristkit:theme", theme);
            localStorage.setItem("wristkit:mode", mode);
          },
          { theme, mode },
        );
        await page.reload();
        await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
        if (mode === "light")
          await expect(page.locator("html")).toHaveAttribute("data-mode", "light");
        await expect(page.getByRole("region", { name: "Today's activity" })).toBeVisible();
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        );
        expect(overflow).toBeLessThanOrEqual(1);
      }
      await page.getByRole("tab", { name: "Loading", exact: true }).click();
      expect(
        await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches),
      ).toBe(true);
      const animation = await page
        .locator(".wk-ring-value")
        .first()
        .evaluate((el) => getComputedStyle(el).animationName);
      expect(animation).toBe("none");
      await page.getByRole("tab", { name: "Synced", exact: true }).click();
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({ path: testInfo.outputPath(`mobile-${mode}.png`), fullPage: true });
    });
  }
});

test("loading arcs stay on their tracks throughout the animation", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await page.getByRole("tab", { name: "Loading", exact: true }).click();
  const rings = page.locator(".wk-ring");
  await expect(rings).toHaveCount(3);
  for (const time of [0, 500, 1000, 1500]) {
    const offsets = await rings.evaluateAll(
      (elements, currentTime) =>
        elements.map((ring) => {
          const arc = ring.querySelector(".wk-ring-value");
          const trackElement = ring.querySelector(".wk-ring-track");
          if (!arc || !trackElement || arc.getAnimations().length === 0) {
            throw new Error("Expected an animated arc and a fixed track");
          }
          for (const animation of arc.getAnimations()) {
            animation.pause();
            animation.currentTime = currentTime;
          }
          const track = trackElement.getBoundingClientRect();
          const value = arc.getBoundingClientRect();
          return Math.max(
            Math.abs(track.x - value.x),
            Math.abs(track.y - value.y),
            Math.abs(track.width - value.width),
            Math.abs(track.height - value.height),
          );
        }),
      time,
    );
    for (const offset of offsets) expect(offset).toBeLessThan(1);
  }
});

test("theme settings support keyboard selection and restore focus", async ({ page }) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: /Theme: Entrepta/ });
  await trigger.focus();
  await page.keyboard.press("Enter");
  const settings = page.getByRole("region", { name: "Theme settings" });
  await expect(settings.getByRole("button").first()).toBeFocused();
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await expect(settings.getByRole("button", { name: "Blossom", exact: true })).toBeFocused();
  await page.keyboard.press("Enter");
  const updatedTrigger = page.getByRole("button", { name: /Theme: Blossom/ });
  await expect(updatedTrigger).toBeFocused();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "blossom");
  await page.keyboard.press("Enter");
  await page.keyboard.press("Escape");
  await expect(updatedTrigger).toBeFocused();
  await expect(updatedTrigger).toHaveAttribute("aria-expanded", "false");
});

test("the home content remains visible without JavaScript", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
  try {
    const page = await context.newPage();
    await page.goto("/");
    for (const element of await page.locator("[data-reveal], [data-type-in] > span").all()) {
      await expect(element).toHaveCSS("opacity", "1");
    }
    await page.getByRole("link", { name: "Add it to your site" }).click();
    await expect(page).toHaveURL(/\/docs\/installation$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Installation");
  } finally {
    await context.close();
  }
});

test("copying an installation block preserves its line breaks", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: async (text: string) => {
          document.documentElement.dataset.copiedCode = text;
        },
      },
    });
  });
  await page.goto("/docs/installation");
  const block = page.locator(".sheen").filter({
    has: page.locator("pre").filter({ hasText: "WRISTKIT_DATABASE_URL=your-" }),
  });
  await block.getByRole("button", { name: "Copy code", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute(
    "data-copied-code",
    "WRISTKIT_DATABASE_URL=your-supabase-transaction-pooler-url\nWRISTKIT_API_KEY=your-random-secret",
  );
});
