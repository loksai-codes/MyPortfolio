import * as THREE from "three";
import type { Kit } from "../core/Kit";
import { rnd } from "../core/rand";
import { waterMaterial } from "../materials";
import { POND, rock } from "./common";
import { MOON_POS } from "./Sky";

/** Dark basin, animated water shader reflecting moon + lanterns, ring of edge rocks. */
export function buildPond(k: Kit): void {
  const { mesh, scene, std } = k;
  const { C: PC, RX: RXp, RZ: RZp } = POND;
  const basin = mesh(new THREE.CircleGeometry(1, 48), std({ color: 0x0b1416, roughness: 1 }), PC.x, -0.62, PC.z, scene, false);
  basin.rotation.x = -Math.PI / 2;
  basin.scale.set(RXp, RZp, 1);
  const waterMat = waterMaterial(MOON_POS, [new THREE.Vector3(-1.85, 1.72, 1.0), new THREE.Vector3(2.45, 0.5, 1.55), new THREE.Vector3(0, 1.2, 1.5)]);
  const water = new THREE.Mesh(new THREE.CircleGeometry(1, 64), waterMat);
  water.rotation.x = -Math.PI / 2;
  water.scale.set(RXp, RZp, 1);
  water.position.copy(PC);
  water.renderOrder = 3;
  scene.add(water);
  // pond edge rocks
  const ri = new THREE.InstancedMesh(new THREE.DodecahedronGeometry(1, 1), std({ color: 0x55524d, roughness: 0.95, flatShading: true }), 34);
  const d = new THREE.Object3D();
  const cc = new THREE.Color();
  const tints = [0x55524d, 0x4a4843, 0x5f5b54];
  for (let i = 0; i < 34; i++) {
    const a = (i / 34) * Math.PI * 2,
      r = 1 + rnd(0.02, 0.12),
      sz = rnd(0.14, 0.3);
    d.position.set(PC.x + Math.cos(a) * RXp * r, -0.33, PC.z + Math.sin(a) * RZp * r);
    d.rotation.set(0, rnd(0, 6), 0);
    d.scale.set(sz, sz * 0.55, sz);
    d.updateMatrix();
    ri.setMatrixAt(i, d.matrix);
    ri.setColorAt(i, cc.set(tints[i % 3]!));
  }
  ri.castShadow = false;
  ri.receiveShadow = true;
  scene.add(ri);
  rock(k, PC.x + 1.5, -0.2, PC.z - 1.1, 0.55, 0x4d4a45);
  rock(k, PC.x - 1.6, -0.22, PC.z + 1.0, 0.42, 0x56534d);
  k.onFrame((t) => {
    waterMat.uniforms.t.value = t;
  });
}
