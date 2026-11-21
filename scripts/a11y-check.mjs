// Fallback + accessibility checks: no-JS, no-WebGL, reduced motion + deep link + keyboard-only entry.
// Usage: node scripts/a11y-check.mjs [baseUrl]
import { chromium } from "@playwright/test";
import fs from "node:fs";

const base = process.argv[2] ?? "http://localhost:3000/";
fs.mkdirSync("shots/a11y", { recursive: true });
const out = (n) => `shots/a11y/${n}.png`;

// 1) JavaScript disabled → text page
{
  const b = await chromium.launch();
  const p = await (await b.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 860 } })).newPage();
  await p.goto(base);
  const visible = await p.locator("main.fallback").isVisible();
  const sections = await p.locator("main.fallback section").count();
  const introHidden = !(await p.locator("#intro").isVisible());
  await p.screenshot({ path: out("nojs"), fullPage: false });
  console.log("no-JS: fallback visible", visible, "sections", sections, "intro hidden", introHidden);
  await b.close();
}
// 2) WebGL unavailable → text page after hydration
{
  const b = await chromium.launch({ args: ["--disable-webgl", "--disable-webgl2", "--disable-gpu"] });
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage();
  const errs = [];
  p.on("pageerror", (e) => errs.push(e.message));
  await p.goto(base);
  await p.waitForTimeout(2500);
  const cls = await p.evaluate(() => document.documentElement.className);
  const visible = await p.locator("main.fallback").isVisible();
  await p.locator('main.fallback .lang button[lang="ja"]').click();
  await p.waitForTimeout(300);
  const jaTitle = await p.locator("#fb-projects-title .l-ja").isVisible();
  await p.screenshot({ path: out("nowebgl-ja") });
  console.log("no-WebGL: html class", JSON.stringify(cls), "fallback visible", visible, "JA toggle works", jaTitle, "errors", errs);
  await b.close();
}
// 3) Reduced motion + deep link + keyboard only
{
  const b = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=d3d11"] });
  const ctx = await b.newContext({ viewport: { width: 1440, height: 860 }, reducedMotion: "reduce" });
  const p = await ctx.newPage();
  const errs = [];
  p.on("pageerror", (e) => errs.push(e.message));
  p.on("console", (m) => m.type() === "error" && errs.push(m.text()));
  await p.goto(base + "#projects");
  await p.waitForTimeout(3000);
  // Tab until the "Enter in silence" button is focused
  let focused = "";
  for (let i = 0; i < 12 && focused !== "enterQuiet"; i++) {
    await p.keyboard.press("Tab");
    focused = await p.evaluate(() => document.activeElement?.id ?? "");
  }
  await p.keyboard.press("Enter");
  const t0 = Date.now();
  await p.waitForFunction(() => document.body.classList.contains("panel-open"), null, { timeout: 8000 });
  const openedAfter = Date.now() - t0;
  const hash = await p.evaluate(() => location.hash);
  const focusInPanel = await p.evaluate(() => !!document.activeElement?.closest("#panel"));
  await p.waitForTimeout(800);
  await p.screenshot({ path: out("reduced-deeplink") });
  await p.keyboard.press("Escape");
  await p.waitForTimeout(300);
  const closed = await p.evaluate(() => !document.body.classList.contains("panel-open") && location.hash === "");
  // keyboard nav: Tab into the nav and open Skills
  let navKey = "";
  for (let i = 0; i < 20 && navKey !== "skills"; i++) {
    await p.keyboard.press("Tab");
    navKey = await p.evaluate(() => document.activeElement?.getAttribute("data-key") ?? "");
  }
  await p.keyboard.press("Enter");
  await p.waitForTimeout(400);
  const skillsOpen = await p.evaluate(() => location.hash);
  console.log(
    "reduced+deeplink: tabbed to", focused, "| projects opened", openedAfter, "ms after Enter, hash", hash,
    "| focus moved into panel", focusInPanel, "| Esc closes + clears hash", closed, "| keyboard nav →", skillsOpen, "| errors", errs,
  );
  await b.close();
}
