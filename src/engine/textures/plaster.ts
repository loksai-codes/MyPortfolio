import { cvs, noise } from "./canvas";

/** Earthen tsuchikabe wall plaster. */
export const plasterTexture = () =>
  cvs(256, 256, (g, w, h) => {
    g.fillStyle = "#b9a47b";
    g.fillRect(0, 0, w, h);
    noise(g, w, h, 0.18, "90,70,40");
    noise(g, w, h, 0.12, "255,240,210");
  });
