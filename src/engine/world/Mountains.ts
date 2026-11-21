import * as THREE from "three";
import type { Kit } from "../core/Kit";
import { mistBandTexture } from "../textures/mist";

/** Layered silhouette ridges, Mount Fuji with a snow cap, and mist bands between the ridges. */
export function buildMountains(k: Kit): void {
  const { mesh, scene } = k;
  function ridge(z: number, y0: number, amp: number, col: number, seed: number, peaks?: [number, number, number][]) {
    const g = new THREE.BufferGeometry(),
      v: number[] = [],
      idx: number[] = [];
    const N = 160,
      x0 = -170,
      x1 = 170;
    for (let i = 0; i <= N; i++) {
      const x = x0 + ((x1 - x0) * i) / N;
      let y =
        y0 +
        Math.sin(x * 0.035 + seed) * amp * 0.5 +
        Math.sin(x * 0.09 + seed * 2) * amp * 0.22 +
        Math.sin(x * 0.21 + seed * 3) * amp * 0.08;
      (peaks ?? []).forEach(([px, ph, pw]) => {
        y += ph * Math.exp(-Math.pow((x - px) / pw, 2));
      });
      v.push(x, y, z, x, -6, z);
      if (i < N) {
        const n = i * 2;
        idx.push(n, n + 1, n + 2, n + 1, n + 3, n + 2);
      }
    }
    g.setAttribute("position", new THREE.Float32BufferAttribute(v, 3));
    g.setIndex(idx);
    const m = mesh(g, new THREE.MeshBasicMaterial({ color: col, fog: false }), 0, 0, 0, scene, false);
    m.renderOrder = -5;
    return m;
  }
  ridge(-140, 9, 10, 0x2a2554, 1.3, [[-60, 6, 20]]);
  // Fuji
  const fg = new THREE.ConeGeometry(48, 30, 64, 6, true);
  const col: number[] = [];
  const pos = fg.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const y = (pos.getY(i) + 15) / 30;
    const snow = y > 0.72 + Math.sin(pos.getX(i) * 0.6) * 0.05 ? 1 : 0;
    const c = new THREE.Color(0x322e62).lerp(new THREE.Color(0x3c3a72), y);
    if (snow) c.set(0xc9c6e6);
    col.push(c.r, c.g, c.b);
  }
  fg.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
  const fuji = mesh(fg, new THREE.MeshBasicMaterial({ vertexColors: true, fog: false }), -30, 13, -130, scene, false);
  fuji.scale.y = 0.8;
  fuji.renderOrder = -6;
  ridge(-105, 3, 7, 0x231f48, 4.1);
  ridge(-75, 1, 5, 0x1a1739, 7.7, [
    [-22, 5, 9],
    [24, 4, 8],
  ]);
  ridge(-48, -0.5, 3, 0x121029, 2.9, [
    [-16, 3.2, 6],
    [15, 2.6, 6],
  ]);
  // mist bands between ridges
  const mt = mistBandTexture();
  (
    [
      [-110, 4, 0x5a4d80, 0.35],
      [-80, 2.5, 0x4a4074, 0.4],
      [-52, 1, 0x3a3466, 0.45],
    ] as const
  ).forEach(([z, y, c, o]) => {
    const m = mesh(
      new THREE.PlaneGeometry(340, 10),
      new THREE.MeshBasicMaterial({ map: mt, color: c, transparent: true, opacity: o, depthWrite: false, fog: false }),
      0,
      y,
      z,
      scene,
      false,
    );
    m.renderOrder = -4;
  });
}
