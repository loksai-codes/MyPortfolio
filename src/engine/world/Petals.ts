import * as THREE from "three";
import type { Kit } from "../core/Kit";
import { rnd } from "../core/rand";

interface Petal {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  r: number;
  rs: number;
  ph: number;
  life?: number;
}
const PN = 260;

function resetPetal(p: Partial<Petal>, init = false): Petal {
  p.x = rnd(-5, 6);
  p.y = init ? rnd(0, 6) : rnd(4, 6.5);
  p.z = init ? rnd(-9, 3) : rnd(-9, -4);
  p.vx = rnd(-0.05, 0.12);
  p.vy = -rnd(0.15, 0.32);
  p.vz = rnd(0.18, 0.45);
  p.r = rnd(0, 6);
  p.rs = rnd(0.5, 2.5);
  p.ph = rnd(0, 6);
  return p as Petal;
}

/** 260 instanced sakura petals drifting through the room; they settle on the tatami, then respawn. */
export function buildPetals(k: Kit): void {
  const petals = new THREE.InstancedMesh(
    new THREE.PlaneGeometry(0.035, 0.025),
    new THREE.MeshStandardMaterial({
      color: 0xf6bfd0,
      emissive: 0xf2a5bf,
      emissiveIntensity: 0.35,
      side: THREE.DoubleSide,
      roughness: 0.8,
    }),
    PN,
  );
  petals.castShadow = false;
  k.scene.add(petals);
  const pData: Petal[] = [];
  for (let i = 0; i < PN; i++) pData.push(resetPetal({}, true));
  const dummy = new THREE.Object3D();
  k.onFrame((t, dt) => {
    for (let i = 0; i < PN; i++) {
      const p = pData[i]!;
      p.x += (p.vx + Math.sin(t * 0.7 + p.ph) * 0.12) * dt;
      p.y += p.vy * dt;
      p.z += p.vz * dt;
      p.r += p.rs * dt;
      const fl = p.y < 0.05 && p.z > -2.5 && p.z < 2.5 && Math.abs(p.x) < 3;
      if (fl) {
        p.y = 0.065;
        p.vy = 0;
        p.vx = 0;
        p.vz = 0;
        p.rs = 0;
        p.life = (p.life ?? 0) + dt;
        if (p.life > 8) {
          p.life = 0;
          resetPetal(p);
        }
      } else if (p.y < -0.3 || p.z > 5) {
        resetPetal(p);
      }
      dummy.position.set(p.x, p.y, p.z);
      dummy.rotation.set(fl ? -Math.PI / 2 : p.r, fl ? 0 : p.r * 0.7, p.r * 0.3);
      dummy.updateMatrix();
      petals.setMatrixAt(i, dummy.matrix);
    }
    petals.instanceMatrix.needsUpdate = true;
  });
}
