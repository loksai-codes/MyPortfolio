import { cvs } from "./canvas";

/** Tennis racket string grid (transparent background). */
export const racketStringsTexture = () =>
  cvs(64, 64, (c, w, h) => {
    c.clearRect(0, 0, w, h);
    c.strokeStyle = "#eee";
    c.lineWidth = 1;
    for (let i = 0; i < w; i += 6) {
      c.beginPath();
      c.moveTo(i, 0);
      c.lineTo(i, h);
      c.stroke();
      c.beginPath();
      c.moveTo(0, i);
      c.lineTo(w, i);
      c.stroke();
    }
  });
