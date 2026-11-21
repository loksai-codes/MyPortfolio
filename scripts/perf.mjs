// Perf + leak check against the /dev/engine harness (build with ENGINE_HARNESS=1).
// Reports fps over 5 s at the home view (desktop 1440×860, real GPU), renderer counters, and GPU
// resources left after dispose().
import { chromium } from "@playwright/test";

const base = process.argv[2] ?? "http://localhost:3000";
const b = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=d3d11", "--ignore-gpu-blocklist", "--disable-frame-rate-limit=false"] });
const p = await (await b.newContext({ viewport: { width: 1440, height: 860 }, deviceScaleFactor: 1 })).newPage();
await p.goto(`${base}/dev/engine${process.env.Q ?? ""}`);
await p.waitForFunction(() => !!window.__engine, null, { timeout: 30000 });
await p.evaluate(() => window.__engine.ready);
await p.evaluate(() => window.__engine.openDoors());
await p.waitForTimeout(6000);
const fps = await p.evaluate(
  () =>
    new Promise((res) => {
      const ts = [];
      const f = (t) => {
        ts.push(t);
        if (t - ts[0] < 5000) requestAnimationFrame(f);
        else {
          const d = ts.slice(1).map((v, i) => v - ts[i]).sort((a, b) => a - b);
          res({ avg: +((ts.length - 1) / ((t - ts[0]) / 1000)).toFixed(1), p95ms: +d[Math.floor(d.length * 0.95)].toFixed(1) });
        }
      };
      requestAnimationFrame(f);
    }),
);
const before = await p.evaluate(() => window.__engine.stats());
const after = await p.evaluate(() => {
  const e = window.__engine;
  e.dispose();
  return e.stats();
});
console.log("fps (home view, 5 s):", fps);
console.log("live    :", before);
console.log("disposed:", after);
await b.close();
