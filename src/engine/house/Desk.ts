import * as THREE from "three";
import { rounded, type Kit } from "../core/Kit";

/** Low chabudai with laptop + tea set (Projects hotspot) and two zabuton cushions. */
export function buildDesk(k: Kit, screenTex: THREE.Texture): void {
  const { M, box, mesh, scene, std, glowSprite } = k;
  const g = new THREE.Group();
  g.position.set(0, 0, 0.55);
  scene.add(g);
  mesh(new THREE.CylinderGeometry(0.62, 0.62, 0.05, 48), M.wood, 0, 0.34, 0, g);
  mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.04, 48), M.dark, 0, 0.3, 0, g);
  (
    [
      [0.38, 0.38],
      [-0.38, 0.38],
      [0.38, -0.38],
      [-0.38, -0.38],
    ] as const
  ).forEach(([x, z]) => box(0.05, 0.29, 0.05, M.dark, x, 0.15, z, g));
  // laptop
  const lp = new THREE.Group();
  lp.position.set(-0.05, 0.365, 0.02);
  lp.rotation.y = -0.12;
  g.add(lp);
  const alu = std({ color: 0xb8b4ae, metalness: 0.7, roughness: 0.35 });
  box(0.46, 0.015, 0.32, alu, 0, 0, 0, lp);
  box(0.4, 0.002, 0.18, std({ color: 0x222, roughness: 0.6 }), 0, 0.009, -0.03, lp, false);
  const lid = new THREE.Group();
  lid.position.set(0, 0.008, -0.16);
  lid.rotation.x = -0.32;
  lp.add(lid);
  box(0.46, 0.3, 0.012, alu, 0, 0.15, 0, lid);
  mesh(
    new THREE.PlaneGeometry(0.42, 0.26),
    new THREE.MeshBasicMaterial({ map: screenTex, toneMapped: false }),
    0,
    0.15,
    0.007,
    lid,
    false,
  );
  lid.add(glowSprite(0x8ea0ff, 0.9, new THREE.Vector3(0, 0.15, 0.05), 0.35));
  // tea set
  const cer = std({ color: 0x3c4a3a, roughness: 0.35 });
  mesh(new THREE.CylinderGeometry(0.04, 0.032, 0.06, 16), cer, 0.32, 0.395, 0.15, g);
  mesh(
    new THREE.CylinderGeometry(0.035, 0.035, 0.002, 16),
    std({ color: 0x7a8a3a, roughness: 0.2 }),
    0.32,
    0.424,
    0.15,
    g,
    false,
  );
  const pot = mesh(
    new THREE.SphereGeometry(0.075, 20, 14),
    std({ color: 0x5a2e1e, roughness: 0.4 }),
    0.3,
    0.43,
    -0.18,
    g,
  );
  pot.scale.y = 0.8;
  const sp = mesh(new THREE.CylinderGeometry(0.008, 0.014, 0.08, 8), pot.material, 0.38, 0.45, -0.18, g);
  sp.rotation.z = -1;
  const hd = mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.14, 8), M.dark, 0.3, 0.44, -0.28, g);
  hd.rotation.x = Math.PI / 2;
  k.register(g, "projects", new THREE.Vector3(0, 0.95, 0.55));
  // zabuton cushions
  const zb = std({ color: 0x6e2b2b, roughness: 0.95 });
  const z1 = mesh(new THREE.BoxGeometry(0.6, 0.08, 0.6), zb, 0, 0.1, 1.45) as THREE.Mesh;
  z1.geometry.dispose();
  z1.geometry = rounded(0.6, 0.08, 0.6);
  const z2 = mesh(rounded(0.6, 0.08, 0.6), std({ color: 0x2b3d6e, roughness: 0.95 }), 1.05, 0.1, 0.95);
  z2.rotation.y = 0.3;
}
