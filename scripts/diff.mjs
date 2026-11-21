// Compares shots/reference vs shots/current -> shots/diff/*.png + shots/report.html (side-by-side + diff %).
import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";

const ref = path.resolve("shots/reference"), cur = path.resolve("shots/current"), out = path.resolve("shots/diff");
fs.mkdirSync(out, { recursive: true });
const rows = [];
for (const f of fs.readdirSync(ref).filter((f) => f.endsWith(".png")).sort()) {
  const cf = path.join(cur, f);
  if (!fs.existsSync(cf)) { rows.push({ f, pct: null }); continue; }
  const a = PNG.sync.read(fs.readFileSync(path.join(ref, f))), b = PNG.sync.read(fs.readFileSync(cf));
  if (a.width !== b.width || a.height !== b.height) { rows.push({ f, pct: "size" }); continue; }
  const d = new PNG({ width: a.width, height: a.height });
  const n = pixelmatch(a.data, b.data, d.data, a.width, a.height, { threshold: 0.12 });
  fs.writeFileSync(path.join(out, f), PNG.sync.write(d));
  // Region split: overlay UI vs centre. Report whole-frame mismatch.
  rows.push({ f, pct: ((n / (a.width * a.height)) * 100).toFixed(2) });
}
const html = `<!doctype html><meta charset=utf-8><title>Shot diff</title><style>body{font:13px system-ui;background:#111;color:#eee;margin:16px}
img{width:32%;margin-right:1%;vertical-align:top}h3{margin:28px 0 6px}.bad{color:#f77}</style>
${rows.map((r) => `<h3 class="${r.pct === null || r.pct === "size" || +r.pct > 3 ? "bad" : ""}">${r.f} — ${r.pct ?? "missing"}${r.pct && r.pct !== "size" ? "%" : ""}</h3>
<img src="reference/${r.f}"><img src="current/${r.f}"><img src="diff/${r.f}">`).join("")}`;
fs.writeFileSync(path.resolve("shots/report.html"), html);
console.table(rows.map((r) => ({ shot: r.f, diff: r.pct ?? "missing" })));
