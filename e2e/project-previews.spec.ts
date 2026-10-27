import { expect, test } from "@playwright/test";

const titles = [
  "AI Document Assistant",
  "Workflow Automation",
  "CRM Automation Platform",
  "Marketing Dashboard",
];

test("shows four demo visuals and opens and closes their enlarged previews", async ({
  page,
}) => {
  await page.goto("/");
  for (const title of titles) {
    const opener = page.getByRole("button", {
      name: `Enlarge preview: ${title}`,
      exact: true,
    });
    await opener.scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        opener
          .locator("img")
          .evaluate((img: HTMLImageElement) => img.naturalWidth),
      )
      .toBeGreaterThan(0);
    await opener.click();
    const dialog = page.getByRole("dialog", {
      name: `Demo preview: ${title}`,
      exact: true,
    });
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText("Concept preview · Fictional data");
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
    await expect(opener).toBeFocused();
  }
  await page.getByRole("button", { name: "Français", exact: true }).click();
  const frenchOpener = page.getByRole("button", {
    name: "Agrandir le visuel: Assistant documentaire IA",
    exact: true,
  });
  await frenchOpener.click();
  await expect(page.getByRole("dialog")).toContainText(
    "Maquette de démonstration · Données fictives",
  );
  await page
    .getByRole("button", { name: "Fermer le visuel", exact: true })
    .click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
});
