import * as THREE from "three";
import type { Kit } from "../core/Kit";
import { rnd } from "../core/rand";

/** Dark hills, a lit five-storey pagoda, a red torii, and instanced tree line + bushes. */
export function buildDistant(k: Kit): void {
  const { mesh, scene, std, glowSprite } = k;

  function pagoda(x: number, y: number, z: number, s: number) {
    const P = new THREE.Group();
    P.position.set(x, y, z);
    P.scale.setScalar(s);
    scene.add(P);
    const dk = new THREE.MeshBasicMaterial({ color: 0x0c0a18, fog: false }),
      win = new THREE.MeshBasicMaterial({ color: 0xffb860, fog: false });
    let yy = 0;
    for (let i = 0; i < 5; i++) {
      const w = 1.6 - i * 0.2;
      mesh(new THREE.BoxGeometry(w, 0.7, w), dk, 0, yy + 0.35, 0, P, false);
      const r = mesh(new THREE.ConeGeometry(w * 1.05, 0.45, 4, 1, true), dk, 0, yy + 0.85, 0, P, false);
      r.rotation.y = Math.PI / 4;
      r.scale.y = 0.7;
      mesh(new THREE.PlaneGeometry(w * 0.35, 0.22), win, 0, yy + 0.35, w / 2 + 0.01, P, false);
      yy += 0.95;
    }
    mesh(new THREE.CylinderGeometry(0.04, 0.05, 1.6, 6), dk, 0, yy + 0.6, 0, P, false);
    for (let n = 0; n < 6; n++) mesh(new THREE.TorusGeometry(0.1, 0.02, 4, 10), dk, 0, yy + 0.2 + n * 0.18, 0, P, false).rotation.x = Math.PI / 2;
    P.add(glowSprite(0xffb060, 3, new THREE.Vector3(0, 2, 0), 0.25));
  }

  function torii(x: number, y: number, z: number, s: number) {
    const G = new THREE.Group();
    G.position.set(x, y, z);
    G.scale.setScalar(s);
    scene.add(G);
    const v = std({ color: 0xb2392c, roughness: 0.6 }),
      bk = std({ color: 0x161012 });
    [-1, 1].forEach((d) => mesh(new THREE.CylinderGeometry(0.09, 0.11, 2.2, 10), v, d * 0.85, 1.1, 0, G));
    mesh(new THREE.BoxGeometry(2.5, 0.14, 0.2), bk, 0, 2.28, 0, G);
    mesh(new THREE.BoxGeometry(2.2, 0.1, 0.16), v, 0, 2.15, 0, G);
    mesh(new THREE.BoxGeometry(2, 0.09, 0.12), v, 0, 1.8, 0, G);
    G.add(glowSprite(0xff8a5a, 4, new THREE.Vector3(0, 1.4, 0), 0.2));
  }

  const hillM = std({ color: 0x0f1420, roughness: 1 });
  const h1 = mesh(new THREE.SphereGeometry(10, 24, 12), hillM, -24, -7.5, -34, scene, false);
  h1.scale.set(1.4, 0.6, 1);
  const h2 = mesh(new THREE.SphereGeometry(9, 24, 12), hillM, 22, -6.8, -30, scene, false);
  h2.scale.set(1.5, 0.55, 1);
  pagoda(-22, -1.9, -32, 2.1);
  torii(19, -2.1, -26, 1.4);
  // distant tree line
  const cg = new THREE.SphereGeometry(1, 10, 8);
  cg.translate(0, 1, 0);
  const tm = new THREE.InstancedMesh(cg, new THREE.MeshBasicMaterial({ color: 0x10142a, fog: false }), 160);
  const d = new THREE.Object3D();
  for (let i = 0; i < 160; i++) {
    const x = rnd(-70, 70),
      z = rnd(-30, -19),
      h = rnd(2.2, 4.2);
    d.position.set(x, -0.6, z);
    d.scale.set(h * 0.2, h * 0.5, h * 0.2);
    d.updateMatrix();
    tm.setMatrixAt(i, d.matrix);
  }
  scene.add(tm);
  const bush = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 10, 8), std({ color: 0x16241a, roughness: 1 }), 40);
  for (let i = 0; i < 40; i++) {
    const x = rnd(-12, 12),
      z = rnd(-15, -11),
      r = rnd(0.6, 1.3);
    d.position.set(x, -0.4, z);
    d.scale.set(r * 1.4, r * 0.7, r);
    d.updateMatrix();
    bush.setMatrixAt(i, d.matrix);
  }
  scene.add(bush);
}
