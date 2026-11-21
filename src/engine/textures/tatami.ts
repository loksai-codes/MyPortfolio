import { rnd } from "../core/rand";
import { cvs } from "./canvas";

/** Woven igusa mat with black heri borders. */
export const tatamiTexture = () =>
  cvs(512, 256, (g, w, h) => {
    g.fillStyle = "#bfae74";
    g.fillRect(0, 0, w, h);
    for (let x = 0; x < w; x += 2) {
      g.fillStyle = `rgba(${Math.random() < 0.5 ? "90,80,40" : "230,220,160"},${rnd(0.08, 0.25)})`;
      g.fillRect(x, 0, 1, h);
    }
    for (let y = 0; y < h; y += 9) {
      g.fillStyle = "rgba(80,70,30,.12)";
      g.fillRect(0, y, w, 1);
    }
    g.fillStyle = "#22261c";
    g.fillRect(0, 0, w, 16);
    g.fillRect(0, h - 16, w, 16);
    g.fillStyle = "rgba(200,180,110,.25)";
    for (let x = 0; x < w; x += 8) {
      g.fillRect(x, 4, 4, 2);
      g.fillRect(x + 4, h - 6, 4, 2);
    }
  });
