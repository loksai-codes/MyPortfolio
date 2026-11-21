import * as THREE from "three";
import type { Kit } from "../core/Kit";
import { rnd } from "../core/rand";
import { pointsMaterial, type PointsMaterial } from "../materials";
import { moonbeamTexture } from "../textures/glow";

export interface Fx {
  /** Shader-point materials whose `pr` uniform follows the renderer pixel ratio. */
  materials: PointsMaterial[];
}

/** Fireflies in both gardens, dust motes in the moonbeam, and three additive moonbeam sheets. */
export function buildFx(k: Kit, pixelRatio: number): Fx {
  const materials: PointsMaterial[] = [];
  function points(
    n: number,
    b: [number, number, number, number, number, number],
    color: number,
    size: number,
    amp: number,
    speed: number,
    bright: number,
  ) {
    const g = new THREE.BufferGeometry(),
      pos: number[] = [],
      ph: number[] = [];
    for (let i = 0; i < n; i++) {
      pos.push(rnd(b[0], b[3]), rnd(b[1], b[4]), rnd(b[2], b[5]));
      ph.push(Math.random() * 10);
    }
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute("ph", new THREE.Float32BufferAttribute(ph, 1));
    const m = pointsMaterial({ color, size, amp, speed, bright, pixelRatio });
    materials.push(m);
    const pt = new THREE.Points(g, m);
    pt.frustumCulled = false;
    k.scene.add(pt);
  }
  // fireflies in the gardens
  points(46, [-6, -0.1, -9, 6, 1.6, -3.6], 0xd8ff8a, 60, 0.35, 1, 1);
  points(22, [-5, -0.1, 3.4, 5, 1.4, 7], 0xd8ff8a, 60, 0.35, 1, 1);
  // dust motes in the moonbeam
  points(260, [-1.2, 0.05, -2.4, 2.0, 1.85, 0.6], 0xc8d4ff, 10, 0.08, 0.25, 0.4);
  // moonbeam sheets
  const bm = new THREE.MeshBasicMaterial({
    map: moonbeamTexture(),
    color: 0x9fb2ff,
    transparent: true,
    opacity: 0.07,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    fog: false,
  });
  [1.85, 1.3, 0.75].forEach((y0) => {
    const s = y0 / 0.54;
    const g = new THREE.BufferGeometry();
    const v = [
      -1.2,
      y0,
      -2.45,
      1.2,
      y0,
      -2.45,
      -1.2 + 0.25 * s,
      0.02,
      -2.45 + 0.8 * s,
      1.2 + 0.25 * s,
      0.02,
      -2.45 + 0.8 * s,
    ];
    g.setAttribute("position", new THREE.Float32BufferAttribute(v, 3));
    g.setAttribute("uv", new THREE.Float32BufferAttribute([0, 0, 1, 0, 0, 1, 1, 1], 2));
    g.setIndex([0, 2, 1, 1, 2, 3]);
    const m = new THREE.Mesh(g, bm);
    m.renderOrder = 4;
    k.scene.add(m);
  });
  k.onFrame((t) => materials.forEach((m) => (m.uniforms.t.value = t)));
  return { materials };
}
