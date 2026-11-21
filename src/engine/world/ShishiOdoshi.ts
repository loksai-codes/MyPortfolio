import * as THREE from "three";
import type { Kit } from "../core/Kit";
import { POND, rock } from "./common";

/** Bamboo deer-scarer that fills, tips and clacks every 7.5 s (emits the "clack" sound cue). */
export function buildShishiOdoshi(k: Kit): void {
  const { mesh, scene, std } = k;
  const PC = POND.C;
  const so = new THREE.Group();
  so.position.set(PC.x - POND.RX - 0.05, -0.35, PC.z - 0.75);
  so.rotation.y = 0.9;
  scene.add(so);
  const bam = std({ color: 0x8a9a4a, roughness: 0.45 }),
    bamD = std({ color: 0x5d6b2c, roughness: 0.5 });
  [-0.14, 0.14].forEach((x) => mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.55, 8), bamD, x, 0.27, 0, so));
  const piv = new THREE.Group();
  piv.position.set(0, 0.42, 0);
  so.add(piv);
  const tube = mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.9, 10), bam, 0, 0, 0, piv);
  tube.rotation.x = Math.PI / 2 - 0.35;
  const spout = mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.5, 8), bam, 0, 0.62, -0.65, so);
  spout.rotation.x = 0.9;
  mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.7, 8), bamD, 0, 0.3, -0.85, so);
  rock(k, 0, -0.25, 0.6, 0.22, 0x403e3a);
  mesh(new THREE.CylinderGeometry(0.3, 0.26, 0.32, 14), std({ color: 0x5a5650, roughness: 0.9 }), 0.5, -0.2, -0.5, so);

  let st = 0,
    fired = false;
  k.onFrame((_t, dt) => {
    st += dt;
    const T = 7.5,
      ph = st % T;
    let ang: number;
    if (ph < T - 1) ang = 0.25 * (ph / (T - 1));
    else {
      const q = ph - (T - 1);
      ang = q < 0.2 ? 0.25 + 0.35 * (q / 0.2) : 0.6 * (1 - Math.min(1, (q - 0.2) / 0.25));
    }
    piv.rotation.x = ang;
    if (ph >= T - 1 + 0.45 && !fired) {
      fired = true;
      k.emit.clack();
    }
    if (ph < 1) fired = false;
  });
}
