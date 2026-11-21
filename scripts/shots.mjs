// Screenshot capture for visual-regression comparison.
// Usage: node scripts/shots.mjs reference   -> serves ./reference statically, writes shots/reference/
//        node scripts/shots.mjs current [url] -> uses running app (default http://localhost:3000), writes shots/current/
// Both targets share the same DOM hooks (#enterQuiet, #nav button[data-key], .gtabs button[data-tab], #close).
import { chromium } from "@playwright/test";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const mode = process.argv[2] ?? "current";
const only = process.env.ONLY ? new RegExp(process.env.ONLY) : null;
const outDir = path.resolve("shots", mode);
fs.mkdirSync(outDir, { recursive: true });

const SECTIONS = ["about", "projects", "experience", "skills", "quests", "gallery", "contact", "ren"];
const GALLERY_TABS = ["awards", "papers", "news"];
const VIEWPORTS = { desktop: { width: 1440, height: 860 }, mobile: { width: 390, height: 844 } };

function serveStatic(root) {
  const types = { ".html": "text/html", ".jpg": "image/jpeg", ".png": "image/png", ".js": "text/javascript" };
  const srv = http.createServer((req, res) => {
    const p = decodeURIComponent(new URL(req.url, "http://x").pathname);
    const f = path.join(root, p === "/" ? "index.html" : p);
    if (!f.startsWith(root) || !fs.existsSync(f)) return res.writeHead(404).end();
    res.writeHead(200, { "content-type": types[path.extname(f)] ?? "application/octet-stream" });
    fs.createReadStream(f).pipe(res);
  });
  return new Promise((r) => srv.listen(0, () => r({ srv, url: `http://localhost:${srv.address().port}/` })));
}

// Deterministic randomness: identical seed for both targets.
const seedScript = () => {
  let s = 0x2f6e2b1;
  Math.random = () => {
    s |= 0; s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function run() {
  let url = process.argv[3] ?? "http://localhost:3000/";
  let server;
  if (mode === "reference") { server = await serveStatic(path.resolve("reference")); url = server.url; }
  const browser = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=d3d11", "--ignore-gpu-blocklist", "--enable-gpu"] });
  const errors = [];
  for (const [vpName, viewport] of Object.entries(VIEWPORTS)) {
    for (const lang of ["en", "ja"]) {
      const shot = async (page, name) => {
        const file = `${vpName}-${lang}-${name}.png`;
        if (only && !only.test(file)) return;
        await page.screenshot({ path: path.join(outDir, file) });
        console.log("  ✓", file);
      };
      const ctx = await browser.newContext({ viewport, deviceScaleFactor: 1, hasTouch: vpName === "mobile" });
      await ctx.addInitScript(seedScript);
      await ctx.addInitScript((l) => { try { localStorage.setItem("lp-lang", l); } catch {} }, lang);
      const page = await ctx.newPage();
      page.on("console", (m) => { if (m.type() === "error") errors.push(`[${vpName}/${lang}] ${m.text()}`); });
      page.on("pageerror", (e) => errors.push(`[${vpName}/${lang}] pageerror ${e.message}`));
      await page.goto(url, { waitUntil: "load" });
      await wait(4500); // intro animations settle
      await shot(page, "01-intro");
      await page.locator("#enterQuiet").click();
      await page.waitForFunction(() => document.body.classList.contains("entered"), null, { timeout: 30000 });
      await wait(7000); // doors + 3.6s camera pull-back + hero fade
      await shot(page, "02-home");
      for (const key of SECTIONS) {
        await page.evaluate((k) => document.querySelector(`#nav button[data-key="${k}"]`)?.click(), key);
        await wait(3200);
        await shot(page, `10-${key}`);
        if (key === "gallery") {
          for (const tab of GALLERY_TABS) {
            await page.evaluate((t) => document.querySelector(`.gtabs button[data-tab="${t}"]`)?.click(), tab);
            await wait(1400);
            await shot(page, `11-gallery-${tab}`);
          }
        }
      }
      await page.evaluate(() => document.querySelector("#close")?.click());
      await ctx.close();
    }
  }
  await browser.close();
  server?.srv.close();
  fs.writeFileSync(path.join(outDir, "console-errors.txt"), errors.join("\n"));
  console.log(errors.length ? `${errors.length} console errors (see console-errors.txt)` : "no console errors");
}
run().catch((e) => { console.error(e); process.exit(1); });
