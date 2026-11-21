import { cvs, noise, serifFont } from "./canvas";

export interface ScrollText {
  big: string;
  vertical: readonly string[];
  seal: string;
}

/** Hanging scroll (kakejiku) in the tokonoma: big calligraphy, ensō, vertical name, red seal. */
export const scrollTexture = (text: ScrollText, family: string) =>
  cvs(256, 640, (g, w, h) => {
    g.fillStyle = "#2e3a2c";
    g.fillRect(0, 0, w, h);
    g.fillStyle = "#b89a5a";
    g.fillRect(0, 96, w, 4);
    g.fillRect(0, h - 150, w, 4);
    g.fillStyle = "#efe5cf";
    g.fillRect(24, 104, w - 48, h - 258);
    noise(g, w, h, 0.05, "120,100,70");
    g.fillStyle = "#141210";
    g.textAlign = "center";
    g.font = serifFont(800, 150, family);
    g.fillText(text.big, w / 2, 290);
    g.font = serifFont(700, 30, family);
    text.vertical.forEach((c, i) => g.fillText(c, w / 2 + 70, 340 + i * 34));
    g.beginPath();
    g.strokeStyle = "#141210";
    g.lineWidth = 9;
    g.lineCap = "round";
    g.arc(w / 2 - 10, 250, 92, -0.4, Math.PI * 1.65);
    g.stroke();
    g.fillStyle = "#c8402f";
    g.fillRect(w / 2 + 55, h - 220, 32, 32);
    g.fillStyle = "#fff";
    g.font = "700 20px serif";
    g.fillText(text.seal, w / 2 + 71, h - 197);
  });
