// Compare two screenshot sets: node scripts/compare-shots.mjs <dirA> <dirB> [filter-regex]
// Prints the mismatch % per shot (pixelmatch, same threshold as scripts/diff.mjs).
import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";

const [a, b, filter] = process.argv.slice(2);
if (!a || !b) throw new Error("usage: node scripts/compare-shots.mjs <dirA> <dirB> [filter-regex]");
const re = filter ? new RegExp(filter) : null;
const rows = [];
for (const f of fs
  .readdirSync(a)
  .filter((f) => f.endsWith(".png") && (!re || re.test(f)))
  .sort()) {
  const fb = path.join(b, f);
  if (!fs.existsSync(fb)) {
    rows.push({ shot: f, diff: "missing" });
    continue;
  }
  const x = PNG.sync.read(fs.readFileSync(path.join(a, f))),
    y = PNG.sync.read(fs.readFileSync(fb));
  if (x.width !== y.width || x.height !== y.height) {
    rows.push({ shot: f, diff: "size" });
    continue;
  }
  const n = pixelmatch(x.data, y.data, null, x.width, x.height, { threshold: 0.12 });
  rows.push({ shot: f, diff: ((n / (x.width * x.height)) * 100).toFixed(2) });
}
console.table(rows);
