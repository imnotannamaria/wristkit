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
