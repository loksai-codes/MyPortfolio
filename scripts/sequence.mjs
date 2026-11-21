// Captures the intro → doors → camera pull-back sequence at fixed times after "Enter" for both targets.
// Usage: node scripts/sequence.mjs [baseUrl]  -> shots/seq/{ref,new}-<ms>.png and a contact sheet seq.png
import { chromium } from "@playwright/test";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";

const base = process.argv[2] ?? "http://localhost:3000/";
const TIMES = [300, 1200, 2000, 3000, 4500, 6500];
const out = path.resolve("shots/seq");
fs.mkdirSync(out, { recursive: true });
const srv = http.createServer((q, s) => {
  const p = decodeURIComponent(new URL(q.url, "http://x").pathname);
  const f = path.join("reference", p === "/" ? "index.html" : p);
  if (!fs.existsSync(f)) return s.writeHead(404).end();
  fs.createReadStream(f).pipe(s);
});
await new Promise((r) => srv.listen(5057, r));
const browser = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=d3d11", "--ignore-gpu-blocklist"] });
for (const [kind, url] of [["ref", "http://localhost:5057/"], ["new", base]]) {
  const page = await (await browser.newContext({ viewport: { width: 1440, height: 860 } })).newPage();
  await page.goto(url);
  await page.waitForTimeout(4500);
  await page.mouse.move(720, 430);
  await page.locator("#enterQuiet").click();
  const t0 = Date.now();
  for (const ms of TIMES) {
    const w = ms - (Date.now() - t0);
    if (w > 0) await page.waitForTimeout(w);
    await page.screenshot({ path: path.join(out, `${kind}-${ms}.png`) });
  }
  await page.close();
}
await browser.close();
srv.close();
// contact sheet: rows = ref/new, cols = times, quarter size
const S = 4, w = 360, h = 215, sheet = new PNG({ width: w * TIMES.length, height: h * 2 });
["ref", "new"].forEach((k, row) => TIMES.forEach((ms, col) => {
  const p = PNG.sync.read(fs.readFileSync(path.join(out, `${k}-${ms}.png`)));
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const si = (y * S * p.width + x * S) * 4, di = ((row * h + y) * sheet.width + col * w + x) * 4;
    for (let c = 0; c < 4; c++) sheet.data[di + c] = p.data[si + c];
  }
}));
fs.writeFileSync(path.resolve("shots/seq.png"), PNG.sync.write(sheet));
console.log("wrote shots/seq.png");
