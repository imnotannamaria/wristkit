import { expect, test } from "@playwright/test";

test.describe("home page", () => {
  test("renders hero and today activity card demo", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("Health data");
    await expect(page.getByText("Today / Activity").first()).toBeVisible();
  });

  test("install block tabs are interactive", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /\$ add/i }).click();
    await expect(page.locator("table").getByText("add today-activity-card").first()).toBeVisible();
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
    const activeLink = page.locator(".docs-nav-link--active");
    await expect(activeLink).toBeVisible();
    await expect(activeLink).toContainText("Installation");
  });
});

test.describe("registry API", () => {
  test("/r/today-activity-card returns valid JSON", async ({ request }) => {
    const res = await request.get("/r/today-activity-card");
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.name).toBe("today-activity-card");
    expect(Array.isArray(body.files)).toBe(true);
    expect(body.files.length).toBeGreaterThan(0);
  });

  test("/r/unknown returns 404", async ({ request }) => {
    const res = await request.get("/r/does-not-exist");
    expect(res.status()).toBe(404);
  });
});

test.describe("shortcut endpoint", () => {
  test("/shortcut returns application/x-apple-shortcut content-type", async ({ request }) => {
    const res = await request.get("/shortcut");
    const contentType = res.headers()["content-type"] ?? "";
    expect(contentType).toContain("apple-shortcut");
  });
});
