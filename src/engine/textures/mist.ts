import { cvs } from "./canvas";

/** Horizontal soft band between mountain ridges. */
export const mistBandTexture = () =>
  cvs(256, 64, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, 0, h);
    gr.addColorStop(0, "rgba(255,255,255,0)");
    gr.addColorStop(0.5, "rgba(255,255,255,.7)");
    gr.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = gr;
    g.fillRect(0, 0, w, h);
  });

/** Elliptical puff for low ground mist sprites. */
export const groundMistTexture = () =>
  cvs(128, 64, (g, w, h) => {
    const gr = g.createRadialGradient(64, 32, 0, 64, 32, 64);
    gr.addColorStop(0, "rgba(255,255,255,.5)");
    gr.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = gr;
    g.save();
    g.scale(1, 0.5);
    g.fillRect(0, 0, w, h * 2);
    g.restore();
  });
