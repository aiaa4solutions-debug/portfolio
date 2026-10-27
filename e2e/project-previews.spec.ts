import { expect, test } from "@playwright/test";

const projects = [
  { title: "AI Document Assistant", slug: "ai-document-assistant" },
  { title: "Workflow Automation", slug: "workflow-automation" },
  { title: "CRM Automation Platform", slug: "crm-automation-platform" },
  { title: "Marketing Dashboard", slug: "marketing-dashboard" },
];

test("intercepts all four detail links and restores the portfolio on close", async ({
  page,
}) => {
  await page.goto("/");
  for (const [index, project] of projects.entries()) {
    const opener = page.getByRole("link", {
      name: `View project details: ${project.title}`,
      exact: true,
    });
    await opener.scrollIntoViewIfNeeded();
    // Mobile browsers may scroll when focusing a tapped link. Capture the
    // position at the actual navigation click, after that native focus step.
    await opener.evaluate((element) =>
      element.addEventListener(
        "click",
        () => {
          (element as HTMLElement).dataset.scrollAtOpen = String(
            window.scrollY,
          );
        },
        { once: true },
      ),
    );
    await opener.click();
    const beforeScroll = Number(
      await opener.getAttribute("data-scroll-at-open"),
    );
    await expect(page).toHaveURL(new RegExp(`/projects/${project.slug}$`));
    const dialog = page.getByRole("dialog", {
      name: `Project details: ${project.title}`,
      exact: true,
    });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("heading", { level: 1 })).toHaveText(
      project.title,
    );
    await expect(dialog).toContainText("Concept preview · Fictional data");
    await expect
      .poll(() =>
        dialog
          .locator("img")
          .evaluate((img: HTMLImageElement) => img.naturalWidth),
      )
      .toBeGreaterThan(0);
    if (index % 2)
      await page
        .getByRole("button", { name: "Close project details", exact: true })
        .click();
    else await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).not.toBeVisible();
    await expect(page).toHaveURL(/\/$/);
    await expect(opener).toBeFocused();
    await expect
      .poll(() =>
        page.evaluate(
          (before) => Math.abs(window.scrollY - before),
          beforeScroll,
        ),
      )
      .toBeLessThan(5);
  }
});

test("supports back, forward and refresh into the canonical full page", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("link", {
      name: "View project details: AI Document Assistant",
      exact: true,
    })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.goBack();
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await page.goForward();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.reload();
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "AI Document Assistant",
  );
  await page
    .getByRole("link", { name: "Close project details", exact: true })
    .click();
  await expect(page).toHaveURL(/\/#projects$/);
});

test("opens direct project URLs as full pages and rejects unknown slugs", async ({
  page,
  request,
}) => {
  for (const project of projects) {
    await page.goto(`/projects/${project.slug}`);
    await expect(page.getByRole("dialog")).not.toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      project.title,
    );
    await expect(
      page.getByRole("link", { name: "Close project details", exact: true }),
    ).toBeVisible();
  }
  expect((await request.get("/projects/nonexistent-project")).status()).toBe(
    404,
  );
});

test("localizes project details and clears the modal when navigating to contact", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "FR (Français)", exact: true }).click();
  await page
    .getByRole("link", {
      name: "Voir les détails du projet: Assistant documentaire IA",
      exact: true,
    })
    .click();
  await expect(page.getByRole("dialog")).toContainText(
    "Maquette de démonstration · Données fictives",
  );
  await expect(
    page.getByRole("button", {
      name: "Fermer les détails du projet",
      exact: true,
    }),
  ).toBeVisible();
  await page
    .getByRole("link", { name: "Discuter d’un projet similaire", exact: true })
    .click();
  await expect(page).toHaveURL(/\/#contact$/);
  await expect(page.getByRole("dialog")).not.toBeVisible();
});
