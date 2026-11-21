import * as THREE from "three";
import type { Kit } from "../core/Kit";
import { racketStringsTexture } from "../textures/racketStrings";

/** Low cabinet with books, camera, ink stone and a tennis racket — the Side Quests hotspot. */
export function buildShelf(k: Kit): void {
  const { M, box, mesh, scene, std, T } = k;
  const g = new THREE.Group();
  g.position.set(-2.62, 0, 1.95);
  scene.add(g);
  const cab = std({ map: T.darkWood, color: 0x8a5a3a, roughness: 0.5 });
  box(0.42, 0.5, 0.95, cab, 0, 0.25, 0, g);
  box(0.012, 0.4, 0.44, std({ map: T.washi, roughness: 0.9 }), 0.212, 0.27, -0.22, g, false);
  box(0.012, 0.4, 0.44, std({ map: T.washi, roughness: 0.9 }), 0.212, 0.27, 0.22, g, false);
  box(0.44, 0.03, 0.97, M.dark, 0, 0.51, 0, g);
  // books
  (
    [
      [0x2e4a6e, 0.0],
      [0x7a2a2a, 0.035],
      [0xc9b88a, 0.07],
      [0x2d5a3a, 0.105],
    ] as const
  ).forEach(([c, y], i) =>
    box(0.24, 0.032, 0.17, std({ color: c, roughness: 0.8 }), 0.02, 0.545 + y, -0.3 + i * 0.005, g),
  );
  // camera
  const cm = new THREE.Group();
  cm.position.set(0.02, 0.53, 0.02);
  cm.rotation.y = 0.5;
  g.add(cm);
  box(0.17, 0.1, 0.07, std({ color: 0x1a1a1c, roughness: 0.4, metalness: 0.3 }), 0, 0.05, 0, cm);
  box(0.06, 0.03, 0.05, std({ color: 0x1a1a1c }), -0.04, 0.115, 0, cm);
  const lens = mesh(
    new THREE.CylinderGeometry(0.035, 0.04, 0.08, 18),
    std({ color: 0x222, metalness: 0.5, roughness: 0.3 }),
    0.02,
    0.05,
    0.07,
    cm,
  );
  lens.rotation.x = Math.PI / 2;
  mesh(
    new THREE.CircleGeometry(0.026, 16),
    std({ color: 0x3344aa, roughness: 0.05, metalness: 0.8 }),
    0.02,
    0.05,
    0.111,
    cm,
    false,
  );
  // ink stone + brush rest
  box(0.1, 0.02, 0.16, std({ color: 0x111, roughness: 0.3 }), 0.06, 0.53, 0.3, g);
  const br = mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.2, 6), std({ color: 0xa07a4a }), 0.0, 0.56, 0.3, g);
  br.rotation.z = Math.PI / 2;
  br.rotation.y = 0.3;
  mesh(new THREE.ConeGeometry(0.012, 0.04, 6), std({ color: 0x111 }), 0.1, 0.56, 0.33, g).rotation.z = -Math.PI / 2;
  // tennis racket leaning on the fusuma
  const rk = new THREE.Group();
  rk.position.set(-0.12, 0, 0.62);
  rk.rotation.set(0, 0, -0.2);
  g.add(rk);
  const frame = mesh(
    new THREE.TorusGeometry(0.12, 0.012, 8, 28),
    std({ color: 0xd8d8dc, metalness: 0.3, roughness: 0.4 }),
    0,
    0.52,
    0,
    rk,
  );
  frame.scale.y = 1.3;
  frame.rotation.y = Math.PI / 2;
  const strings = mesh(
    new THREE.PlaneGeometry(0.22, 0.29),
    std({ map: racketStringsTexture(), transparent: true, side: THREE.DoubleSide }),
    0,
    0.52,
    0,
    rk,
    false,
  );
  strings.rotation.y = Math.PI / 2;
  mesh(new THREE.CylinderGeometry(0.014, 0.016, 0.32, 8), std({ color: 0x222 }), 0, 0.2, 0, rk);
  mesh(new THREE.SphereGeometry(0.033, 14, 10), std({ color: 0xd4e34a, roughness: 0.9 }), 0.05, 0.03, 0.45, g);
  k.register(g, "quests", new THREE.Vector3(-2.62, 1.05, 1.95));
}
