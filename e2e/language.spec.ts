import { expect, test } from "@playwright/test";

test("detects regional French and remembers an explicit English preference", async ({
  browser,
}) => {
  const context = await browser.newContext({ locale: "fr-MG" });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "fr");
  await expect(
    page.getByRole("link", { name: "Voir les projets", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "English", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await page.reload();
  await expect(
    page.getByRole("button", { name: "English", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(
    page.getByRole("link", { name: "View projects", exact: true }),
  ).toBeVisible();
  await context.close();
});

test("falls back to English and switches the demo to French", async ({
  browser,
}) => {
  const context = await browser.newContext({ locale: "de-DE" });
  const page = await context.newPage();
  await page.goto("/projects/btc-realtime");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await page.getByRole("button", { name: "Français", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Flux BTC multi-plateformes en temps réel",
  );
  await expect(
    page.getByRole("tab", { name: "Courbes", exact: true }),
  ).toBeVisible();
  await page.getByRole("switch", { name: "Simulation", exact: true }).click();
  await expect(page.getByTestId("mode-banner")).toContainText(
    "Mode simulation",
  );
  await expect(page.getByTestId("trade-row").first()).toBeVisible();
  await page.getByRole("tab", { name: "Courbes", exact: true }).click();
  await expect(page.getByText("Trait plein : dernier achat.", { exact: false })).toBeVisible();
  await expect(page.getByText("Binance achat", { exact: true })).toBeVisible();
  await context.close();
});

test("exposes the correct WhatsApp and email contacts", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('#contact a[href="https://calendly.com/aiaa4solutions"]')).toBeVisible();
  await expect(page.locator('footer a[aria-label="LinkedIn"]')).toHaveAttribute("href", "https://mg.linkedin.com/in/ranaivoarisoa");
  await expect(
    page.locator('#contact a[href="https://wa.me/261349403247"]'),
  ).toBeVisible();
  await expect(
    page.locator('#contact a[href="mailto:aiaa4solutions@gmail.com"]'),
  ).toHaveText("aiaa4solutions@gmail.com");
  await expect(page.locator('footer a[aria-label="GitHub"]')).toHaveAttribute(
    "href",
    /github\.com\/.+/,
  );
});
