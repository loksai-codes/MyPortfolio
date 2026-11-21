// Alternating fps comparison, reference vs port, home view after the doors (real GPU, 1440×860, DPR 1).
// Usage: node scripts/fps-compare.mjs [rounds=3]   (needs `ENGINE_HARNESS=1` build running on :3000)
import { chromium } from "@playwright/test";
import http from "node:http"; import fs from "node:fs"; import path from "node:path";
const rounds = +(process.argv[2] ?? 3);
const srv = http.createServer((q, s) => { const p = decodeURIComponent(new URL(q.url, "http://x").pathname); const f = path.join("reference", p === "/" ? "index.html" : p); if (!fs.existsSync(f)) return s.writeHead(404).end(); fs.createReadStream(f).pipe(s); });
await new Promise((r) => srv.listen(5071, r));
const b = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=d3d11", "--ignore-gpu-blocklist"] });
const measure = (p) => p.evaluate(() => new Promise((res) => { const ts = []; const f = (t) => { ts.push(t); if (t - ts[0] < 5000) requestAnimationFrame(f); else res(+((ts.length - 1) / ((t - ts[0]) / 1000)).toFixed(1)); }; requestAnimationFrame(f); }));
const out = { reference: [], port: [] };
for (let i = 0; i < rounds; i++) {
  for (const kind of ["reference", "port"]) {
    const p = await (await b.newContext({ viewport: { width: 1440, height: 860 }, deviceScaleFactor: 1 })).newPage();
    if (kind === "reference") {
      await p.goto("http://localhost:5071/");
      await p.addStyleTag({ content: "#intro{display:none!important}" });
      await p.waitForFunction(() => document.querySelector("#loadmsg")?.textContent === "");
      await p.evaluate(() => Scene.intro());
    } else {
      await p.goto("http://localhost:3000/dev/engine");
      await p.waitForFunction(() => !!window.__engine);
      await p.evaluate(() => window.__engine.ready.then(() => window.__engine.openDoors()));
    }
    await p.waitForTimeout(6000);
    out[kind].push(await measure(p));
    await p.context().close();
  }
}
const med = (a) => [...a].sort((x, y) => x - y)[Math.floor(a.length / 2)];
console.log("reference", out.reference, "median", med(out.reference));
console.log("port     ", out.port, "median", med(out.port));
await b.close(); srv.close();
