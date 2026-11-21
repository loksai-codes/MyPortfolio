import * as THREE from "three";
import type { Kit } from "../core/Kit";
import { rnd } from "../core/rand";
import { POND } from "./common";

interface KoiData {
  tail: THREE.Mesh;
  ph: number;
  sp: number;
  rx: number;
  rz: number;
  cx: number;
  cz: number;
  dir: number;
}

/** Six koi swimming elliptical loops with wagging tails. */
export function buildKoi(k: Kit): void {
  const { mesh, scene, std } = k;
  const PC = POND.C;
  const koiCols: [number, number][] = [
    [0xf26b2a, 0xffffff],
    [0xffffff, 0xe0402a],
    [0xf5a623, 0xf5a623],
    [0xffffff, 0x222222],
    [0xe8502a, 0xffe0c0],
    [0xfaf5ea, 0xf07a30],
  ];
  const koi: { g: THREE.Group; u: KoiData }[] = [];
  koiCols.forEach(([a, b], i) => {
    const g = new THREE.Group();
    const m1 = std({ color: a, roughness: 0.5 }),
      m2 = std({ color: b, roughness: 0.5 });
    const body = mesh(new THREE.SphereGeometry(0.12, 14, 10), m1, 0, 0, 0, g, false);
    body.scale.set(0.45, 0.32, 1.25);
    const spot = mesh(new THREE.SphereGeometry(0.06, 10, 8), m2, 0, 0.02, 0.03, g, false);
    spot.scale.set(0.6, 0.5, 1.2);
    const tail = mesh(
      new THREE.PlaneGeometry(0.14, 0.12),
      new THREE.MeshStandardMaterial({ color: a, side: THREE.DoubleSide, transparent: true, opacity: 0.85 }),
      0,
      0,
      -0.19,
      g,
      false,
    );
    tail.rotation.x = -Math.PI / 2;
    const u: KoiData = {
      tail,
      ph: i * 1.05,
      sp: rnd(0.18, 0.32),
      rx: rnd(0.55, 1.6),
      rz: rnd(0.35, 0.9),
      cx: PC.x + rnd(-0.5, 0.5),
      cz: PC.z + rnd(-0.25, 0.25),
      dir: i % 2 ? 1 : -1,
    };
    scene.add(g);
    koi.push({ g, u });
  });
  k.onFrame((t) => {
    koi.forEach(({ g, u }) => {
      const a = t * u.sp * u.dir + u.ph;
      const x = u.cx + Math.cos(a) * u.rx,
        z = u.cz + Math.sin(a) * u.rz;
      const nx = u.cx + Math.cos(a + 0.05 * u.dir) * u.rx,
        nz = u.cz + Math.sin(a + 0.05 * u.dir) * u.rz;
      g.position.set(x, -0.42 + Math.sin(t * 0.7 + u.ph) * 0.02, z);
      g.lookAt(nx, g.position.y, nz);
      u.tail.rotation.y = Math.sin(t * 6 + u.ph) * 0.5;
    });
  });
}
