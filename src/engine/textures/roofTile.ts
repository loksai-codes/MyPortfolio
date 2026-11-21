import * as THREE from "three";
import { cvs, noise } from "./canvas";

/** Dark kawara roof tiles (repeating). */
export const roofTileTexture = () => {
  const t = cvs(256, 256, (g, w, h) => {
    g.fillStyle = "#181a20";
    g.fillRect(0, 0, w, h);
    for (let x = 0; x < w; x += 16) {
      const gr = g.createLinearGradient(x, 0, x + 16, 0);
      gr.addColorStop(0, "#0f1014");
      gr.addColorStop(0.45, "#2e313a");
      gr.addColorStop(0.6, "#24272e");
      gr.addColorStop(1, "#0c0d10");
      g.fillStyle = gr;
      g.fillRect(x, 0, 16, h);
    }
    for (let y = 0; y < h; y += 32) {
      g.fillStyle = "rgba(0,0,0,.35)";
      g.fillRect(0, y, w, 3);
    }
    noise(g, w, h, 0.15, "0,0,0");
  });
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
};
