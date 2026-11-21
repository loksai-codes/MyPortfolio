import * as THREE from "three";

export type Draw = (g: CanvasRenderingContext2D, w: number, h: number) => void;

/** Paint a canvas and wrap it as an sRGB CanvasTexture (anisotropy 4), exactly like the reference `cvs`. */
export function cvs(w: number, h: number, draw: Draw): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const g = c.getContext("2d");
  if (!g) throw new Error("2D canvas unavailable");
  draw(g, w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

/** Speckle noise: w*h/30 tiny rects of random alpha. */
export function noise(g: CanvasRenderingContext2D, w: number, h: number, a: number, col = "0,0,0"): void {
  for (let i = 0; i < (w * h) / 30; i++) {
    g.fillStyle = `rgba(${col},${Math.random() * a})`;
    g.fillRect(Math.random() * w, Math.random() * h, 1 + Math.random() * 2, 1);
  }
}

/** Font stack used for painted glyphs (resolved next/font family + fallback). */
export const serifFont = (weight: number, px: number, family: string) => `${weight} ${px}px ${family}, serif`;
