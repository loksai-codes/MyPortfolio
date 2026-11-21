import { cvs, serifFont } from "./canvas";

/** Red chochin paper with ribs and a glyph on each side. */
export const lanternTexture = (glyph: string, family: string) =>
  cvs(512, 256, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, 0, h);
    gr.addColorStop(0, "#ff9d4a");
    gr.addColorStop(0.5, "#ffd08a");
    gr.addColorStop(1, "#ff9d4a");
    g.fillStyle = gr;
    g.fillRect(0, 0, w, h);
    g.fillStyle = "#d8452e";
    g.globalAlpha = 0.85;
    g.fillRect(0, 0, w, h);
    g.globalAlpha = 1;
    const gr2 = g.createRadialGradient(w * 0.25, h / 2, 10, w * 0.25, h / 2, 140);
    gr2.addColorStop(0, "rgba(255,230,160,.9)");
    gr2.addColorStop(1, "rgba(255,230,160,0)");
    g.fillStyle = gr2;
    g.fillRect(0, 0, w, h);
    g.fillStyle = "rgba(60,20,10,.35)";
    for (let y = 0; y < h; y += 14) g.fillRect(0, y, w, 2);
    g.fillStyle = "#1a0d08";
    g.textAlign = "center";
    g.font = serifFont(800, 120, family);
    g.fillText(glyph, w * 0.25, h / 2 + 42);
    g.fillText(glyph, w * 0.75, h / 2 + 42);
  });
