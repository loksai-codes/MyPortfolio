import { cvs } from "./canvas";

/** Laptop terminal screen. Lines are [colour, text]. */
export const screenTexture = (lines: readonly (readonly [string, string])[]) =>
  cvs(512, 320, (g, w, h) => {
    g.fillStyle = "#0f1324";
    g.fillRect(0, 0, w, h);
    g.font = "20px monospace";
    lines.forEach(([col, text], i) => {
      g.fillStyle = col;
      g.fillText(text, 24, 44 + i * 34);
    });
  });
