import { expect, test } from "@playwright/test";

test("contact CTA scrolls to contact, including a repeated click and French label", async ({
  page,
}) => {
  await page.goto("/");
  const email = page.locator(
    '#contact a[href="mailto:aiaa4solutions@gmail.com"]',
  );
  for (let attempt = 0; attempt < 2; attempt++) {
    await page.getByRole("link", { name: "Get in touch", exact: true }).click();
    await expect(page).toHaveURL(/\/#contact$/);
    await expect(email).toBeInViewport();
    await expect
      .poll(() =>
        page.locator("#contact").evaluate((e) => e.getBoundingClientRect().top),
      )
      .toBeGreaterThanOrEqual(0);
    await expect
      .poll(() =>
        page.locator("#contact").evaluate((e) => e.getBoundingClientRect().top),
      )
      .toBeLessThan(144);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  }
  await page.getByRole("button", { name: "Français", exact: true }).click();
  await page.getByRole("link", { name: "Me contacter", exact: true }).click();
  await expect(email).toBeInViewport();
  await expect(page.getByRole("dialog")).not.toBeVisible();
});
