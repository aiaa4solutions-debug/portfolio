import { expect, test } from "@playwright/test";
import { projects } from "../data/projects";

const origin = "https://herimalala.netlify.app";

test("home metadata and structured profile are present in the server response", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page).toHaveTitle(
    "Herimalala Ranaivoarisoa | Full Stack Developer",
  );
  await expect(page.locator('head link[rel="canonical"]')).toHaveAttribute(
    "href",
    /^https:\/\/herimalala\.netlify\.app\/?$/,
  );
  await expect(page.locator('head meta[name="description"]')).toHaveAttribute(
    "content",
    /Full Stack developer in Madagascar/,
  );
  const data = await page
    .locator('script[type="application/ld+json"]')
    .allTextContents();
  const parsed = data.map((value) => JSON.parse(value));
  expect(parsed.some((value) => value["@type"] === "ProfilePage")).toBe(true);
  expect(
    parsed
      .flatMap((value) => value["@graph"] ?? [])
      .some((value) => value["@type"] === "Person"),
  ).toBe(true);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.getByRole("link", { name: "Get in touch", exact: true }).click();
  await expect(
    page.locator('#contact a[href="mailto:aiaa4solutions@gmail.com"]'),
  ).toBeInViewport();
  await context.close();
});

test("projects have their own canonical, social cards and structured breadcrumbs", async ({
  page,
  request,
}) => {
  for (const project of projects) {
    await page.goto(project.href!);
    await expect(page.locator('head link[rel="canonical"]')).toHaveAttribute(
      "href",
      `${origin}${project.href}`,
    );
    await expect(
      page.locator('head meta[property="og:title"]'),
    ).toHaveAttribute("content", project.title);
    await expect(page.locator('head meta[property="og:url"]')).toHaveAttribute(
      "content",
      `${origin}${project.href}`,
    );
    const image = await page
      .locator('head meta[property="og:image"]')
      .getAttribute("content");
    expect(new URL(image!).pathname).toBe(`${project.href}/opengraph-image`);
    await expect(
      page.locator('head meta[name="twitter:title"]'),
    ).toHaveAttribute("content", project.title);
    const data = (
      await page.locator('script[type="application/ld+json"]').allTextContents()
    ).flatMap((value) => JSON.parse(value)["@graph"] ?? []);
    expect(
      data.some(
        (value) =>
          value["@type"] === "CreativeWork" && value.name === project.title,
      ),
    ).toBe(true);
    expect(data.some((value) => value["@type"] === "BreadcrumbList")).toBe(
      true,
    );
    const card = await request.get(new URL(image!).pathname);
    expect(card.status()).toBe(200);
    expect(card.headers()["content-type"]).toContain("image/png");
    expect((await card.body()).length).toBeGreaterThan(1000);
  }
});

test("robots and sitemap expose public pages while API responses are not indexable", async ({
  request,
}) => {
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.ok()).toBe(true);
  const xml = await sitemap.text();
  for (const project of projects)
    expect(xml).toContain(`${origin}${project.href}`);
  expect(xml).not.toContain("/api/");
  expect(xml).not.toContain("@modal");
  const robots = await request.get("/robots.txt");
  expect(await robots.text()).toContain("Disallow: /api/");
  const health = await request.get("/api/health");
  expect(health.headers()["x-robots-tag"]).toBe("noindex, nofollow");
  const icon = await request.get("/icon.svg");
  expect(icon.ok()).toBe(true);
});
