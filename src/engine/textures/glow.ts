import { cvs } from "./canvas";

/** Radial white glow used by every additive sprite. */
export const glowTexture = () =>
  cvs(128, 128, (g, w, h) => {
    const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, "rgba(255,255,255,1)");
    gr.addColorStop(0.25, "rgba(255,255,255,.45)");
    gr.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = gr;
    g.fillRect(0, 0, w, h);
  });

/** Vertical fade with soft side edges for the moonbeam sheets. */
export const moonbeamTexture = () =>
  cvs(64, 128, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, 0, h);
    gr.addColorStop(0, "rgba(255,255,255,.9)");
    gr.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = gr;
    g.fillRect(0, 0, w, h);
    const sx = g.createLinearGradient(0, 0, w, 0);
    sx.addColorStop(0, "rgba(0,0,0,1)");
    sx.addColorStop(0.15, "rgba(0,0,0,0)");
    sx.addColorStop(0.85, "rgba(0,0,0,0)");
    sx.addColorStop(1, "rgba(0,0,0,1)");
    g.globalCompositeOperation = "destination-out";
    g.fillStyle = sx;
    g.fillRect(0, 0, w, h);
  });
