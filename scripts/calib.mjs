// 3D-only calibration: reference scene vs. ported engine, overlay hidden, seeded randomness.
// Usage: node scripts/calib.mjs [baseUrl=http://localhost:3000]  -> shots/calib/{ref,new}-<view>.png + diff %
import { chromium } from "@playwright/test";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";

const base = process.argv[2] ?? "http://localhost:3000";
const out = path.resolve("shots/calib");
fs.mkdirSync(out, { recursive: true });
const VIEWS = (process.env.VIEWS ?? "door,home,about,projects,skills,gallery,contact").split(",");

const seed = () => {
  let s = 0x2f6e2b1;
  Math.random = () => {
    s |= 0; s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};
const hideOverlay = `body>*:not(#scene){display:none!important} #scene{display:block!important}`;

function serve(root) {
  const srv = http.createServer((q, s) => {
    const p = decodeURIComponent(new URL(q.url, "http://x").pathname);
    const f = path.join(root, p === "/" ? "index.html" : p);
    if (!fs.existsSync(f)) return s.writeHead(404).end();
    s.writeHead(200, { "content-type": f.endsWith(".html") ? "text/html" : "image/jpeg" });
    fs.createReadStream(f).pipe(s);
  });
  return new Promise((r) => srv.listen(0, () => r({ srv, url: `http://localhost:${srv.address().port}/` })));
}

const browser = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=d3d11", "--ignore-gpu-blocklist", "--enable-gpu"] });
const { srv, url: refUrl } = await serve(path.resolve("reference"));
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function capture(kind) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 860 }, deviceScaleFactor: 1 });
  await ctx.addInitScript(seed);
  const page = await ctx.newPage();
  const errs = [];
  page.on("console", (m) => m.type() !== "log" && errs.push(m.text()));
  page.on("pageerror", (e) => errs.push(e.message));
  // hold the pointer at the centre so parallax is neutral on both
  if (kind === "ref") {
    await page.goto(refUrl);
    await page.addStyleTag({ content: hideOverlay });
    await page.waitForFunction(() => typeof Scene !== "undefined" && document.querySelector("#loadmsg")?.textContent === "", null, { timeout: 30000 });
  } else {
    await page.goto(`${base}/dev/engine`);
    await page.waitForFunction(() => !!window.__engine, null, { timeout: 30000 });
  }
  await page.mouse.move(720, 430);
  await wait(1500);
  for (const v of VIEWS) {
    if (v === "home") {
      await page.evaluate((k) => (k === "ref" ? Scene.intro() : window.__engine.openDoors()), kind);
      await wait(6500);
    } else if (v !== "door") {
      await page.evaluate(([k, key]) => (k === "ref" ? Scene.focus(key) : window.__engine.focus(key)), [kind, v]);
      await wait(2600);
    }
    const N = +(process.env.AVG ?? 1);
    let acc = null, last;
    for (let i = 0; i < N; i++) {
      const buf = await page.screenshot();
      last = PNG.sync.read(buf);
      if (!acc) acc = new Float64Array(last.data.length);
      for (let j = 0; j < acc.length; j++) acc[j] += last.data[j];
      if (i < N - 1) await wait(370);
    }
    for (let j = 0; j < acc.length; j++) last.data[j] = Math.round(acc[j] / N);
    fs.writeFileSync(path.join(out, `${kind}-${v}.png`), PNG.sync.write(last));
  }
  await ctx.close();
  return errs;
}

const e1 = await capture("ref");
const e2 = await capture("new");
srv.close();
await browser.close();
for (const v of VIEWS) {
  const a = PNG.sync.read(fs.readFileSync(path.join(out, `ref-${v}.png`)));
  const b = PNG.sync.read(fs.readFileSync(path.join(out, `new-${v}.png`)));
  const d = new PNG({ width: a.width, height: a.height });
  const n = pixelmatch(a.data, b.data, d.data, a.width, a.height, { threshold: 0.12 });
  fs.writeFileSync(path.join(out, `diff-${v}.png`), PNG.sync.write(d));
  // mean luminance to spot global exposure drift
  const lum = (p) => { let s = 0; for (let i = 0; i < p.data.length; i += 4) s += 0.2126 * p.data[i] + 0.7152 * p.data[i + 1] + 0.0722 * p.data[i + 2]; return (s / (p.data.length / 4)).toFixed(1); };
  console.log(v.padEnd(11), "diff", ((n / (a.width * a.height)) * 100).toFixed(2).padStart(6) + "%", " lum ref", lum(a), "new", lum(b));
}
console.log("ref console:", e1.slice(0, 5));
console.log("new console:", e2.slice(0, 5));
