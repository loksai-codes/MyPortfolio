import * as THREE from "three";
import type { Kit } from "../core/Kit";
import { rnd } from "../core/rand";
import { gravelTexture, mossTexture } from "../textures/ground";
import { buildKoi } from "./Koi";
import { buildGroundMist } from "./Mist";
import { buildPond } from "./Pond";
import { buildShishiOdoshi } from "./ShishiOdoshi";
import { buildNiwakiAndMaple } from "./Trees";

/**
 * Ground, raked gravel, stepping stones, pond + koi, shishi-odoshi, stone lanterns, bamboo fences,
 * niwaki pines + maple, ground mist. Order matches the reference (seeded randomness).
 */
export function buildGarden(k: Kit): void {
  const { mesh, scene, std, glowSprite } = k;
  // ground
  const ground = mesh(
    new THREE.PlaneGeometry(140, 90),
    std({ map: mossTexture(), roughness: 1 }),
    0,
    -0.36,
    -10,
    scene,
    false,
  );
  ground.rotation.x = -Math.PI / 2;
  // raked gravel courts (front + back)
  const gt = gravelTexture();
  const gravelMat = std({ map: gt, roughness: 1 });
  const gf = mesh(new THREE.PlaneGeometry(14, 6.5), gravelMat, 0, -0.345, 7.0, scene, false);
  gf.rotation.x = -Math.PI / 2;
  const gb = mesh(new THREE.PlaneGeometry(16, 6), gravelMat, 0, -0.345, -6.8, scene, false);
  gb.rotation.x = -Math.PI / 2;
  // stepping stones front path + back
  const stoneMat = std({ color: 0x5d5a55, roughness: 0.9 });
  (
    [
      [0.35, 4.25],
      [-0.1, 4.95],
      [0.3, 5.7],
      [-0.05, 6.45],
      [0.25, 7.25],
      [0, 8.1],
      [-0.3, -4.1],
      [0.25, -4.8],
      [-0.1, -5.6],
      [0.5, -6.3],
    ] as const
  ).forEach(([x, z]) => {
    const s = mesh(new THREE.CylinderGeometry(0.3, 0.32, 0.09, 9), stoneMat, x, -0.3, z);
    s.scale.z = 0.72;
    s.rotation.y = rnd(0, 3);
  });
  buildPond(k);
  buildKoi(k);
  buildShishiOdoshi(k);
  // stone lanterns along the path
  (
    [
      [-4.3, 4.5, 0.85],
      [1.4, 9.4, 0.7],
      [3.3, -5.2, 0.8],
    ] as const
  ).forEach(([x, z, s]) => {
    const g = new THREE.Group();
    g.position.set(x, -0.35, z);
    g.scale.setScalar(s);
    scene.add(g);
    const sm = std({ color: 0x6c6860, roughness: 0.95 });
    mesh(new THREE.CylinderGeometry(0.28, 0.32, 0.1, 6), sm, 0, 0.05, 0, g);
    mesh(new THREE.CylinderGeometry(0.07, 0.09, 0.55, 8), sm, 0, 0.38, 0, g);
    mesh(
      new THREE.BoxGeometry(0.3, 0.24, 0.3),
      std({ color: 0x221a10, emissive: 0xffb050, emissiveIntensity: 1.1 }),
      0,
      0.78,
      0,
      g,
    );
    mesh(new THREE.ConeGeometry(0.38, 0.24, 6), sm, 0, 1.0, 0, g);
    g.add(glowSprite(0xffa850, 1.2, new THREE.Vector3(0, 0.78, 0), 0.55));
  });
  // bamboo fences (takegaki)
  const fm = new THREE.InstancedMesh(
    new THREE.CylinderGeometry(0.025, 0.025, 1, 6),
    std({ color: 0x6e6a3a, roughness: 0.6 }),
    220,
  );
  const d = new THREE.Object3D();
  let n = 0;
  (
    [
      [-7, 2.5, -7, 10],
      [7, 2.5, 7, 10],
    ] as const
  ).forEach(([x0, z0, , z1]) => {
    for (let z = z0; z <= z1 && n < 200; z += 0.09) {
      d.position.set(x0, 0.25, z);
      d.rotation.set(0, 0, 0);
      d.scale.set(1, 1.2, 1);
      d.updateMatrix();
      fm.setMatrixAt(n++, d.matrix);
    }
    [0, 0.5].forEach((y) => {
      if (n < 219) {
        d.position.set(x0, y + 0.05, (z0 + z1) / 2);
        d.rotation.set(Math.PI / 2, 0, 0);
        d.scale.set(1.5, z1 - z0, 1.5);
        d.updateMatrix();
        fm.setMatrixAt(n++, d.matrix);
      }
    });
  });
  fm.count = n;
  scene.add(fm);
  buildNiwakiAndMaple(k);
  buildGroundMist(k);
}
