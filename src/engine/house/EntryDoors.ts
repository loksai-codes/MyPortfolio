import * as THREE from "three";
import { ROOM, type Kit } from "../core/Kit";
import { shojiShadowTexture } from "../textures/shojiShadow";

const easeInOutCubic = (e: number) => (e < 0.5 ? 4 * e * e * e : 1 - Math.pow(-2 * e + 2, 3) / 2);

export interface EntryDoors {
  /** Start the slide-open animation (or jump to open when `instant`). */
  open(instant?: boolean): void;
}

/** Front frame, veranda, entry step and the four closed entry shoji (one shows Ren's shadow). */
export function buildEntryDoors(k: Kit): EntryDoors {
  const { W, H } = ROOM;
  const { M, box, mesh, scene, std, glowSprite, T } = k;
  // frame: posts + kamoi beam
  [-3.02, 3.02].forEach((x) => box(0.12, H, 0.12, M.wood, x, H / 2, 2.5));
  box(W + 0.3, 0.12, 0.14, M.wood, 0, 1.92, 2.5);
  box(W + 0.3, 0.1, 0.16, M.dark, 0, H - 0.02, 2.5);
  // engawa veranda + entry stepping stone
  box(W + 2, 0.08, 1.0, M.wood, 0, -0.02, 3.05, scene, false);
  for (let x = -3.9; x <= 3.9; x += 0.18) box(0.01, 0.081, 1.0, M.black, x, -0.02, 3.05, scene, false);
  const st = mesh(
    new THREE.CylinderGeometry(0.42, 0.46, 0.18, 10),
    std({ color: 0x5b5853, roughness: 0.9 }),
    0.2,
    -0.2,
    3.9,
  );
  st.scale.z = 0.6;
  // entry shoji (closed) with Ren's shadow on the paper
  const lat = std({
    color: 0x2a1a10,
    alphaMap: T.lattice,
    alphaTest: 0.5,
    roughness: 0.6,
    side: THREE.DoubleSide,
    transparent: true,
  });
  const doors: { g: THREE.Group; x0: number; mats: THREE.Material[] }[] = [];
  [-2.25, -0.75, 0.75, 2.25].forEach((x, i) => {
    const tx = shojiShadowTexture(i);
    const paper = std({
      map: tx,
      emissive: 0xffffff,
      emissiveMap: tx,
      emissiveIntensity: 0.95,
      roughness: 0.9,
      transparent: true,
      side: THREE.DoubleSide,
    });
    const p = new THREE.Group();
    p.position.set(x, 0.94, 2.58 + (i % 2) * 0.025);
    scene.add(p);
    mesh(new THREE.PlaneGeometry(1.48, 1.8), paper, 0, 0, 0, p, false);
    mesh(new THREE.PlaneGeometry(1.52, 1.86), lat.clone(), 0, 0, 0.012, p, false);
    const mats: THREE.Material[] = [];
    p.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) mats.push((o as THREE.Mesh).material as THREE.Material);
    });
    doors.push({ g: p, x0: x, mats });
  });
  lat.dispose(); // template only; each panel uses a clone
  const glow = glowSprite(0xffc070, 5, new THREE.Vector3(0, 1, 2.7), 0.35);
  scene.add(glow);

  let doorT = -1,
    doorStart = 0;
  const apply = (dt: number) => {
    const e = Math.min(1, dt / 2.2),
      ee = easeInOutCubic(e);
    doors.forEach((d, i) => {
      const dir = i < 2 ? -1 : 1;
      const inner = i === 1 || i === 2;
      d.g.position.x = d.x0 + dir * (inner ? 1.5 : 0) * ee + dir * ee * 1.8 * Math.max(0, (e - 0.45) / 0.55);
      const fade = Math.max(0, Math.min(1, (dt - 1.4) / 1.2));
      d.mats.forEach((m) => (m.opacity = 1 - fade));
      if (fade >= 1) d.g.visible = false;
    });
    glow.material.opacity = 0.35 * (1 - Math.min(1, dt / 2));
  };
  k.onFrame(() => {
    if (doorT < 0) return;
    doorT = (performance.now() - doorStart) / 1000;
    apply(doorT);
    if (doorT > 3) {
      doorT = -2;
      glow.visible = false;
    }
  });
  return {
    open(instant = false) {
      if (instant) {
        apply(3.1);
        glow.visible = false;
        doorT = -2;
        return;
      }
      doorT = 0;
      doorStart = performance.now();
    },
  };
}
