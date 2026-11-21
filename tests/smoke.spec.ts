import { expect, test, type Page } from "@playwright/test";
import {
  about,
  contact,
  experience,
  gallery,
  projects,
  quests,
  renPanel,
  sections,
  skills,
  type Lang,
  type PanelHead,
  type SectionKey,
} from "../src/content";

const HEADS: Record<SectionKey, PanelHead> = {
  about,
  projects,
  experience,
  skills,
  quests,
  gallery,
  contact,
  ren: renPanel,
};

function trackErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(`console: ${m.text()}`);
  });
  return errors;
}

async function enterRoom(page: Page, lang: Lang) {
  await page.addInitScript((l) => localStorage.setItem("lp-lang", l), lang);
  await page.goto("/");
  await expect(page.locator("#enterQuiet")).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("lang", lang);
  await page.locator("#enterQuiet").click();
  await expect(page.locator("body")).toHaveClass(/entered/, { timeout: 20_000 });
  await expect(page.locator("#intro")).toHaveClass(/gone/);
}

for (const lang of ["en", "ja"] as const) {
  test(`loads, enters and opens every section (${lang})`, async ({ page }) => {
    const errors = trackErrors(page);
    await enterRoom(page, lang);
    // 3D engine came up (or the page fell back cleanly)
    await expect
      .poll(() =>
        page.evaluate(
          () => document.documentElement.classList.contains("no-webgl") || !!document.querySelector("#scene"),
        ),
      )
      .toBe(true);

    for (const s of sections) {
      // nav may be collapsed behind the mobile menu; click via DOM like a keyboard/AT user would
      await page.evaluate(
        (k) => (document.querySelector(`#nav button[data-key="${k}"]`) as HTMLButtonElement).click(),
        s.key,
      );
      await expect(page.locator("body")).toHaveClass(/panel-open/);
      await expect(page.locator("#panel-title")).toHaveText(HEADS[s.key].title[lang]);
      await expect(page.locator("#spineT")).toHaveText(s.kanji);
      await expect(page).toHaveURL(new RegExp(`#${s.key}$`));
    }
    // gallery tabs + lightbox
    await page.evaluate(() => (document.querySelector('#nav button[data-key="gallery"]') as HTMLButtonElement).click());
    for (const tab of gallery.tabs) {
      await page.locator(`#panel .gtabs button[data-tab="${tab.key}"]`).click();
      await expect(page.locator("#panel .ggrid figure")).toHaveCount(tab.items.length);
    }
    await page.locator("#panel .ggrid figure button").first().click();
    await expect(page.locator("#lightbox")).toHaveClass(/show/);
    await page.keyboard.press("Escape");
    await expect(page.locator("#lightbox")).not.toHaveClass(/show/);
    // close the panel
    await page.keyboard.press("Escape");
    await expect(page.locator("body")).not.toHaveClass(/panel-open/);

    expect(errors, errors.join("\n")).toEqual([]);
  });
}

test("language toggle switches copy and <html lang>", async ({ page }) => {
  const errors = trackErrors(page);
  await enterRoom(page, "en");
  await expect(page.locator(".hs .tag").first()).toHaveText(sections[0]!.tag.en);
  // (the open scroll covers the top-right toggles, as in the reference — switch with the panel closed)
  await page.locator('#bar .lang button[lang="ja"]').click();
  await expect(page.locator("html")).toHaveAttribute("lang", "ja");
  await expect(page.locator(".hs .tag").first()).toHaveText(sections[0]!.tag.ja);
  await page.evaluate(() => (document.querySelector('#nav button[data-key="about"]') as HTMLButtonElement).click());
  await expect(page.locator("#panel-title")).toHaveText(about.title.ja);
  expect(errors).toEqual([]);
});

test("deep link opens the section after entering", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("lp-lang", "en"));
  await page.goto("/#projects");
  await page.locator("#enterQuiet").click();
  await expect(page.locator("#panel-title")).toHaveText(projects.title.en, { timeout: 20_000 });
});

test("text fallback without JavaScript", async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto("/");
  await expect(page.locator("main.fallback")).toBeVisible();
  await expect(page.locator("main.fallback section")).toHaveCount(sections.length);
  await expect(page.locator("#fb-contact-title .l-en")).toHaveText(contact.title.en);
  await ctx.close();
});
