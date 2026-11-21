import { cvs } from "./canvas";

/** Blue-and-gold seigaiha wave pattern for the fusuma. */
export const seigaihaTexture = () =>
  cvs(512, 512, (g, w, h) => {
    g.fillStyle = "#22305e";
    g.fillRect(0, 0, w, h);
    const r = 34;
    for (let row = -1; row < h / (r * 0.5) + 2; row++) {
      for (let col = -1; col < w / (r * 2) + 2; col++) {
        const x = col * r * 2 + (row % 2 ? r : 0),
          y = row * r * 0.5;
        for (let k = 4; k > 0; k--) {
          g.beginPath();
          g.arc(x, y + r, (r * k) / 4, Math.PI, 0);
          g.fillStyle = k % 2 ? "#22305e" : "#2c3c72";
          g.fill();
          g.strokeStyle = "rgba(232,180,90,.55)";
          g.lineWidth = 1.4;
          g.stroke();
        }
      }
    }
    const gr = g.createLinearGradient(0, 0, 0, h);
    gr.addColorStop(0, "rgba(232,180,90,.25)");
    gr.addColorStop(0.3, "rgba(0,0,0,0)");
    g.fillStyle = gr;
    g.fillRect(0, 0, w, h);
  });
