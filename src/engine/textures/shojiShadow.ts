import { rnd } from "../core/rand";
import { cvs, noise } from "./canvas";

/**
 * Warm back-lit entry shoji paper. Panel 2 carries Ren's silhouette, panel 1 a hanging lantern,
 * panel 0 a few maple-leaf shadows, panel 3 is plain.
 */
export const shojiShadowTexture = (k: number) =>
  cvs(256, 320, (g, w, h) => {
    const gr = g.createRadialGradient(w * 0.5, h * 0.45, 10, w * 0.5, h * 0.5, w * 0.9);
    gr.addColorStop(0, "#fff0cf");
    gr.addColorStop(1, "#f0c98a");
    g.fillStyle = gr;
    g.fillRect(0, 0, w, h);
    noise(g, w, h, 0.08, "150,110,60");
    g.filter = "blur(7px)";
    if (k === 2) {
      g.save();
      g.translate(w * 0.45, h * 0.62);
      g.scale(0.62, 0.62);
      g.fillStyle = "rgba(70,38,14,.55)";
      g.strokeStyle = "rgba(70,38,14,.55)";
      g.lineCap = "round";
      g.beginPath();
      g.ellipse(0, 40, 62, 58, 0, 0, 7);
      g.fill();
      g.beginPath();
      g.ellipse(0, -30, 74, 66, 0, 0, 7);
      g.fill();
      [-1, 1].forEach((d) => {
        g.save();
        g.translate(d * 66, -50);
        g.rotate(d * 0.9);
        g.beginPath();
        g.ellipse(0, -34, 30, 48, 0, 0, 7);
        g.fill();
        g.restore();
        g.lineWidth = 7;
        g.beginPath();
        g.moveTo(d * 22, -90);
        g.quadraticCurveTo(d * 28, -130, d * 48, -160);
        g.stroke();
        g.beginPath();
        g.arc(d * 50, -164, 13, 0, 7);
        g.fill();
        g.beginPath();
        g.ellipse(d * 40, 92, 26, 13, 0, 0, 7);
        g.fill();
      });
      g.lineWidth = 22;
      g.beginPath();
      g.moveTo(50, 70);
      g.bezierCurveTo(120, 80, 130, 20, 104, -10);
      g.stroke();
      g.restore();
    }
    if (k === 1) {
      g.fillStyle = "rgba(70,38,14,.4)";
      g.fillRect(w * 0.7, 0, 3, h * 0.22);
      g.beginPath();
      g.ellipse(w * 0.7, h * 0.33, 34, 44, 0, 0, 7);
      g.fill();
    }
    if (k === 0) {
      g.fillStyle = "rgba(60,40,20,.28)";
      for (let i = 0; i < 10; i++) {
        g.save();
        g.translate(rnd(0, w * 0.6), rnd(0, h));
        g.rotate(rnd(-1, 0.4));
        g.beginPath();
        g.ellipse(0, 0, 30, 6, 0, 0, 7);
        g.fill();
        g.restore();
      }
    }
    g.filter = "none";
  });
