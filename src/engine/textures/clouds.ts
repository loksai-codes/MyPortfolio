import { rnd } from "../core/rand";
import { cvs } from "./canvas";

/** Soft cloud puffs for distant sky sprites. */
export const cloudTexture = () =>
  cvs(256, 128, (g, w, h) => {
    for (let i = 0; i < 26; i++) {
      const x = rnd(30, w - 30),
        y = rnd(40, h - 30),
        r = rnd(18, 42);
      const gr = g.createRadialGradient(x, y, 0, x, y, r);
      gr.addColorStop(0, "rgba(255,255,255,.55)");
      gr.addColorStop(1, "rgba(255,255,255,0)");
      g.fillStyle = gr;
      g.fillRect(0, 0, w, h);
    }
  });
