import * as THREE from "three";
import type { Kit } from "../core/Kit";
import { rnd } from "../core/rand";

/** Flattened low-poly boulder. */
export function rock(k: Kit, x: number, y: number, z: number, s: number, col = 0x55524d, parent?: THREE.Object3D) {
  const m = k.mesh(new THREE.DodecahedronGeometry(s, 1), k.std({ color: col, roughness: 0.95, flatShading: true }), x, y, z, parent);
  m.scale.y = 0.55;
  m.rotation.y = rnd(0, 6);
  return m;
}

/** Pond centre and radii shared by pond, koi and shishi-odoshi. */
export const POND = { C: new THREE.Vector3(3.3, -0.33, 5.7), RX: 2.1, RZ: 1.25 } as const;
