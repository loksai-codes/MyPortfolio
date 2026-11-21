import { rnd } from "../core/rand";
import { cvs } from "./canvas";

/** Warm cedar with vertical grain. */
export const woodTexture = () =>
  cvs(256, 512, (g, w, h) => {
    g.fillStyle = "#5a3a22";
    g.fillRect(0, 0, w, h);
    for (let x = 0; x < w; x += 1) {
      g.fillStyle = `rgba(${Math.random() < 0.5 ? "30,15,5" : "140,95,60"},${rnd(0.05, 0.25)})`;
      g.fillRect(x + Math.sin(x) * 2, 0, 1, h);
    }
  });

/** Dark stained wood with horizontal grain. */
export const darkWoodTexture = () =>
  cvs(256, 256, (g, w, h) => {
    g.fillStyle = "#3a2416";
    g.fillRect(0, 0, w, h);
    for (let y = 0; y < h; y++) {
      g.fillStyle = `rgba(${Math.random() < 0.5 ? "15,8,3" : "110,70,40"},${rnd(0.05, 0.2)})`;
      g.fillRect(0, y, w, 1);
    }
  });
