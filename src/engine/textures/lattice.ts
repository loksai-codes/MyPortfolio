import * as THREE from "three";
import { cvs } from "./canvas";

/** Shoji kumiko lattice used as an alpha map (linear data, not colour). */
export const latticeTexture = () => {
  const t = cvs(256, 512, (g, w, h) => {
    g.clearRect(0, 0, w, h);
    g.fillStyle = "#fff";
    const cols = 3,
      rows = 7,
      th = 7;
    for (let i = 0; i <= cols; i++) g.fillRect((i * (w - th)) / cols, 0, th, h);
    for (let j = 0; j <= rows; j++) g.fillRect(0, (j * (h - th)) / rows, w, th);
    g.fillRect(0, 0, w, 16);
    g.fillRect(0, h - 26, w, 26);
    g.fillRect(0, 0, 14, h);
    g.fillRect(w - 14, 0, 14, h);
  });
  t.colorSpace = THREE.NoColorSpace;
  return t;
};
