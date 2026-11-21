import * as THREE from "three";
import { cvs, noise } from "./canvas";

/** Mossy ground, tiled 30×30. */
export const mossTexture = () => {
  const t = cvs(512, 512, (g, w, h) => {
    g.fillStyle = "#1c2a18";
    g.fillRect(0, 0, w, h);
    noise(g, w, h, 0.5, "10,20,8");
    noise(g, w, h, 0.3, "60,90,40");
  });
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(30, 30);
  return t;
};

/** Raked karesansui gravel with wavy furrows. */
export const gravelTexture = () =>
  cvs(1024, 1024, (g, w, h) => {
    g.fillStyle = "#7b7a80";
    g.fillRect(0, 0, w, h);
    noise(g, w, h, 0.5, "40,40,50");
    noise(g, w, h, 0.4, "230,230,235");
    g.strokeStyle = "rgba(30,30,40,.35)";
    g.lineWidth = 3;
    for (let y = 6; y < h; y += 14) {
      g.beginPath();
      for (let x = 0; x <= w; x += 10) g.lineTo(x, y + Math.sin(x * 0.012) * 4);
      g.stroke();
    }
    g.strokeStyle = "rgba(240,240,245,.18)";
    g.lineWidth = 2;
    for (let y = 12; y < h; y += 14) {
      g.beginPath();
      for (let x = 0; x <= w; x += 10) g.lineTo(x, y + Math.sin(x * 0.012) * 4);
      g.stroke();
    }
  });
