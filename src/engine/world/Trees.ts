import * as THREE from "three";
import type { Kit } from "../core/Kit";
import { rnd } from "../core/rand";

/** Cloud-pruned niwaki pines (green pads) and one red maple (red pads), all pads instanced. */
export function buildNiwakiAndMaple(k: Kit): void {
  const { mesh, scene, std } = k;
  const padsG: THREE.Matrix4[] = [],
    padsR: THREE.Matrix4[] = [];
  const trunk = std({ color: 0x2a1d16, roughness: 0.9 });
  function niwaki(x: number, z: number, s: number, arr: THREE.Matrix4[]) {
    const pts = [
      new THREE.Vector3(x, -0.36, z),
      new THREE.Vector3(x + 0.3 * s, 1 * s, z + 0.1 * s),
      new THREE.Vector3(x - 0.2 * s, 2 * s, z),
      new THREE.Vector3(x + 0.15 * s, 3 * s, z - 0.1 * s),
    ];
    mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 16, 0.12 * s, 7), trunk, 0, 0, 0, scene, true);
    (
      [
        [0.0, 3.1, 0.0, 1.1],
        [0.9, 2.3, 0.2, 0.9],
        [-0.9, 1.9, -0.1, 0.85],
        [0.6, 1.3, -0.3, 0.7],
        [-0.4, 2.7, 0.3, 0.75],
        [0.2, 3.6, 0, 0.6],
      ] as const
    ).forEach(([dx, y, dz, r]) => {
      const dd = new THREE.Object3D();
      dd.position.set(x + dx * s, y * s, z + dz * s);
      dd.scale.set(r * s, r * s * 0.42, r * s * 0.9);
      dd.updateMatrix();
      arr.push(dd.matrix.clone());
      if (Math.abs(dx) > 0.3) {
        const br = [pts[1]!.clone().lerp(pts[2]!, 0.5), new THREE.Vector3(x + dx * s * 0.95, y * s - 0.05, z + dz * s)];
        mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(br), 4, 0.05 * s, 5), trunk, 0, 0, 0, scene, false);
      }
    });
  }
  niwaki(-5.9, -1.2, 1.1, padsG);
  niwaki(5.9, -0.6, 1.0, padsG);
  niwaki(-6.2, 3.6, 0.75, padsG);
  niwaki(5.4, -4.6, 1.2, padsG);
  niwaki(-4.6, -5.2, 1.0, padsG);
  niwaki(-5.4, 6.8, 0.85, padsR);
  const pg = new THREE.SphereGeometry(1, 14, 9);
  const ip = new THREE.InstancedMesh(pg, std({ color: 0x1f3a24, roughness: 0.95 }), padsG.length);
  padsG.forEach((m, i) => ip.setMatrixAt(i, m));
  ip.castShadow = true;
  scene.add(ip);
  const ir = new THREE.InstancedMesh(pg, std({ color: 0x8c2a1c, emissive: 0x3a0a04, roughness: 0.9 }), padsR.length);
  padsR.forEach((m, i) => ir.setMatrixAt(i, m));
  scene.add(ir);
}

/** Recursive sakura with instanced blossom clusters and a soft pink glow. */
export function buildSakura(k: Kit, px = 2.4, pz = -6.4, sc = 1): void {
  const { mesh, scene, std, glowSprite } = k;
  const T = new THREE.Group();
  T.position.set(px, -0.35, pz);
  T.scale.setScalar(sc);
  scene.add(T);
  const bark = std({ color: 0x2c1f1a, roughness: 0.9 });
  const bl: THREE.Matrix4[][] = [[], [], []];
  function blossom(p: THREE.Vector3) {
    for (let i = 0; i < 4; i++) {
      const d = new THREE.Object3D();
      const r = rnd(0.25, 0.45);
      d.position.set(p.x + rnd(-0.35, 0.35), p.y + rnd(-0.2, 0.3), p.z + rnd(-0.35, 0.35));
      d.scale.set(r, r * 0.75, r);
      d.updateMatrix();
      bl[i % 3]!.push(d.matrix.clone());
    }
  }
  function branch(p0: THREE.Vector3, dir: THREE.Vector3, len: number, rad: number, depth: number) {
    const p1 = p0.clone().add(dir.clone().multiplyScalar(len));
    const mid = p0
      .clone()
      .lerp(p1, 0.5)
      .add(new THREE.Vector3(rnd(-0.15, 0.15), rnd(-0.05, 0.1), rnd(-0.15, 0.15)));
    mesh(new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(p0, mid, p1), 6, rad, 6), bark, 0, 0, 0, T, depth < 2);
    if (depth >= 4) {
      blossom(p1);
      return;
    }
    const n = depth < 1 ? 3 : 2;
    for (let i = 0; i < n; i++) {
      const d = dir
        .clone()
        .add(new THREE.Vector3(rnd(-0.8, 0.8), rnd(0.05, 0.5), rnd(-0.8, 0.8)))
        .normalize();
      branch(p1, d, len * rnd(0.6, 0.8), rad * 0.62, depth + 1);
    }
  }
  const bm = [
    std({ color: 0xf6c3d2, emissive: 0xf1a0bb, emissiveIntensity: 0.18, roughness: 0.9 }),
    std({ color: 0xfadbe4, emissive: 0xf5b9cb, emissiveIntensity: 0.15, roughness: 0.9 }),
    std({ color: 0xeaa3ba, emissive: 0xd9809d, emissiveIntensity: 0.15, roughness: 0.9 }),
  ];
  branch(new THREE.Vector3(0, 0, 0), new THREE.Vector3(-0.15, 1, 0.05).normalize(), 1.5, 0.16, 0);
  const ig = new THREE.IcosahedronGeometry(1, 1);
  bl.forEach((arr, n) => {
    const im = new THREE.InstancedMesh(ig, bm[n]!, arr.length);
    arr.forEach((m, i) => im.setMatrixAt(i, m));
    T.add(im);
  });
  T.add(glowSprite(0xffb6cc, 6, new THREE.Vector3(0, 3, 0), 0.25));
}
