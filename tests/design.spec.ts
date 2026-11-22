import { expect, test, type Page } from "@playwright/test";

// Regression checks for the design-fix round: top bar fit, lightbox focus, intro language pill,
// and hotspot labels on phones.

async function enter(page: Page) {
  await page.addInitScript(() => localStorage.setItem("lp-lang", "en"));
  await page.goto("/");
  await page.locator("#enterQuiet").click();
  await expect(page.locator("body")).toHaveClass(/entered/, { timeout: 20_000 });
}

const inside = (r: { x: number; y: number; width: number; height: number } | null, w: number, h: number) =>
  !!r && r.x >= 0 && r.y >= 0 && r.x + r.width <= w && r.y + r.height <= h;

test.describe("desktop", () => {
  test.skip(({ isMobile }) => !!isMobile, "desktop-only");

  test("top bar never overflows; language + sound toggles stay visible on one line", async ({ page }) => {
    await enter(page);
    for (const width of [901, 960, 1024, 1100, 1195, 1280, 1365, 1440, 1920]) {
      await page.setViewportSize({ width, height: 800 });
      await page.waitForTimeout(150);
      const m = await page.evaluate(() => ({
        docW: document.documentElement.scrollWidth,
        barW: document.getElementById("bar")!.scrollWidth,
        vw: innerWidth,
        langLines: new Set(
          [...document.querySelectorAll("#bar .lang button")].map((b) => b.getBoundingClientRect().top),
        ).size,
        sndH: document.getElementById("snd")!.getBoundingClientRect().height,
      }));
      // fixed elements don't count towards the document's scrollWidth, so check the bar itself too
      expect(m.docW, `document @${width}`).toBeLessThanOrEqual(m.vw);
      expect(m.barW, `#bar @${width}`).toBeLessThanOrEqual(m.vw);
      expect(m.langLines, `language toggle on one line @${width}`).toBe(1);
      expect(m.sndH, `sound toggle not wrapped @${width}`).toBeLessThan(48);
      for (const sel of ["#snd", '#bar .lang button[lang="en"]', '#bar .lang button[lang="ja"]']) {
        expect(inside(await page.locator(sel).boundingBox(), width, 800), `${sel} inside viewport @${width}`).toBe(
          true,
        );
      }
    }
  });

  test("lightbox is a modal: focus trapped, Esc closes only it, focus returns to the thumbnail", async ({ page }) => {
    await enter(page);
    await page.locator('#nav button[data-key="gallery"]').click();
    await expect(page.locator("body")).toHaveClass(/panel-open/);
    const thumb = page.locator("#panel .ggrid figure button").nth(1);
    await thumb.focus();
    await page.keyboard.press("Enter");
    const dialog = page.locator("#lightbox");
    await expect(dialog).toHaveClass(/show/);
    await expect(dialog).toHaveAttribute("role", "dialog");
    await expect(dialog).toHaveAttribute("aria-modal", "true");
    await expect(dialog).toHaveAttribute("aria-label", (await thumb.getAttribute("aria-label"))!);
    await expect(page.locator("#lightbox .lb-close")).toBeFocused();
    for (const key of ["Tab", "Tab", "Tab", "Tab", "Tab", "Shift+Tab", "Shift+Tab"]) {
      await page.keyboard.press(key);
      expect(
        await page.evaluate(() => !!document.activeElement?.closest("#lightbox")),
        `focus inside after ${key}`,
      ).toBe(true);
    }
    expect(await page.evaluate(() => (document.getElementById("panel") as HTMLElement).inert)).toBe(true);
    await page.keyboard.press("Escape");
    await expect(dialog).not.toHaveClass(/show/);
    await expect(page.locator("body")).toHaveClass(/panel-open/); // Esc closed only the lightbox
    await expect(thumb).toBeFocused();
    expect(await page.evaluate(() => (document.getElementById("panel") as HTMLElement).inert)).toBe(false);
    // backdrop click and the close button also close it
    await thumb.click();
    await page.mouse.click(10, 10);
    await expect(dialog).not.toHaveClass(/show/);
    await thumb.click();
    await page.locator("#lightbox .lb-close").click();
    await expect(dialog).not.toHaveClass(/show/);
  });

  test("intro language pill holds ≥4.5:1 for both states even over white artwork", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".intro-top .lang")).toBeVisible();
    const ratios = await page.evaluate(() => {
      const rgb = (s: string) => (s.match(/[\d.]+/g) ?? []).map(Number);
      const lum = ([r, g, b]: number[]) =>
        [r!, g!, b!]
          .map((v) => v / 255)
          .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
          .reduce((a, v, i) => a + v * [0.2126, 0.7152, 0.0722][i]!, 0);
      const over = (top: number[], a: number, base: number[]) =>
        top.slice(0, 3).map((c, i) => c * a + base[i]! * (1 - a));
      const pill = rgb(getComputedStyle(document.querySelector(".intro-top .lang")!).backgroundColor);
      const bg = over(pill, pill[3] ?? 1, [255, 255, 255]); // worst case: pure white art behind the pill
      return [...document.querySelectorAll<HTMLElement>(".intro-top .lang button")].map((b) => {
        const cs = getComputedStyle(b);
        const fg = over(rgb(cs.color), Number(cs.opacity), bg);
        const [l1, l2] = [lum(fg), lum(bg)].sort((x, y) => y - x);
        return (l1! + 0.05) / (l2! + 0.05);
      });
    });
    expect(ratios).toHaveLength(2);
    for (const r of ratios) expect(r).toBeGreaterThanOrEqual(4.5);
  });
});

test.describe("mobile", () => {
  test.skip(({ isMobile }) => !isMobile, "mobile-only");

  for (const vp of [
    { width: 390, height: 844 },
    { width: 360, height: 740 },
  ]) {
    test(`every hotspot label is visible and none overlap @${vp.width}x${vp.height}`, async ({ page }) => {
      await page.setViewportSize(vp);
      await enter(page);
      const check = async (when: string) => {
        await page.waitForTimeout(1200); // let the eased offsets settle
        const boxes = await page.evaluate(() =>
          [...document.querySelectorAll<HTMLElement>(".hs")].map((el) => {
            const tag = el.querySelector<HTMLElement>(".tag")!;
            const r = tag.getBoundingClientRect();
            return {
              key: el.dataset.key!,
              shown: el.style.display !== "none" && getComputedStyle(tag).display !== "none" && r.width > 0,
              r: { x: r.x, y: r.y, w: r.width, h: r.height },
            };
          }),
        );
        for (const b of boxes) {
          expect(b.shown, `${b.key} label visible (${when})`).toBe(true);
          expect(
            b.r.x >= 0 && b.r.y >= 0 && b.r.x + b.r.w <= vp.width && b.r.y + b.r.h <= vp.height,
            `${b.key} inside viewport (${when})`,
          ).toBe(true);
        }
        for (let i = 0; i < boxes.length; i++)
          for (let j = i + 1; j < boxes.length; j++) {
            const a = boxes[i]!.r,
              c = boxes[j]!.r;
            const overlap = a.x < c.x + c.w && c.x < a.x + a.w && a.y < c.y + c.h && c.y < a.y + a.h;
            expect(overlap, `${boxes[i]!.key} vs ${boxes[j]!.key} (${when})`).toBe(false);
          }
      };
      // Labels glide to new places when Ren's bubble appears or hides (~0.3 s); check each state at rest.
      await expect(page.locator("#bubble")).toHaveClass(/show/, { timeout: 20_000 });
      await check("with Ren's greeting");
      await expect(page.locator("#bubble")).not.toHaveClass(/show/, { timeout: 20_000 });
      await check("after the greeting");
    });
  }
});
