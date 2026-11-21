// Counts Web Audio nodes started during 8 s after "Enter with sound" — reference vs new.
// Usage: node scripts/audio-check.mjs [baseUrl]
import { chromium } from "@playwright/test";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const base = process.argv[2] ?? "http://localhost:3000/";
const srv = http.createServer((q, s) => {
  const p = decodeURIComponent(new URL(q.url, "http://x").pathname);
  const f = path.join("reference", p === "/" ? "index.html" : p);
  if (!fs.existsSync(f)) return s.writeHead(404).end();
  fs.createReadStream(f).pipe(s);
});
await new Promise((r) => srv.listen(5056, r));

const probe = () => {
  window.__audio = { buffers: 0, osc: 0, ctxState: "none", speak: 0 };
  const AC = window.AudioContext;
  window.AudioContext = class extends AC {
    constructor(...a) { super(...a); window.__ac = this; }
  };
  const bs = AudioBufferSourceNode.prototype.start;
  AudioBufferSourceNode.prototype.start = function (...a) { window.__audio.buffers++; return bs.apply(this, a); };
  const os = OscillatorNode.prototype.start;
  OscillatorNode.prototype.start = function (...a) { window.__audio.osc++; return os.apply(this, a); };
};

const browser = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=d3d11", "--autoplay-policy=no-user-gesture-required"] });
for (const [name, url] of [["reference", "http://localhost:5056/"], ["new", base]]) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 860 } });
  await ctx.addInitScript(probe);
  const page = await ctx.newPage();
  const errs = [];
  page.on("pageerror", (e) => errs.push(e.message));
  page.on("console", (m) => m.type() === "error" && errs.push(m.text()));
  await page.goto(url);
  await page.waitForTimeout(3500);
  await page.locator("#enterSound").click();
  await page.waitForTimeout(8000);
  const r = await page.evaluate(() => ({ ...window.__audio, ctxState: window.__ac?.state, sndOn: document.querySelector("#snd")?.classList.contains("on") }));
  // toggle off/on via the KOTO button
  await page.locator("#snd").click();
  const off = await page.evaluate(() => document.querySelector("#snd").classList.contains("on"));
  console.log(name.padEnd(10), JSON.stringify(r), "afterToggle on=", off, "errors:", errs.slice(0, 3));
  await ctx.close();
}
await browser.close();
srv.close();
