import { rnd } from "../core/rand";
import { cvs, noise } from "./canvas";

/** Fibrous washi paper. */
export const washiTexture = () =>
  cvs(256, 512, (g, w, h) => {
    g.fillStyle = "#f2e9d6";
    g.fillRect(0, 0, w, h);
    noise(g, w, h, 0.1, "150,130,100");
    g.strokeStyle = "rgba(170,150,120,.18)";
    for (let i = 0; i < 60; i++) {
      g.beginPath();
      const x = Math.random() * w,
        y = Math.random() * h;
      g.moveTo(x, y);
      g.quadraticCurveTo(x + rnd(-20, 20), y + rnd(-20, 20), x + rnd(-30, 30), y + rnd(-30, 30));
      g.stroke();
    }
  });
