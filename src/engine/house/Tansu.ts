import * as THREE from "three";
import type { Kit } from "../core/Kit";

/** Step chest with iron fittings, bonsai and books — the Experience hotspot. */
export function buildTansu(k: Kit): void {
  const { M, box, mesh, scene, std, T } = k;
  const g = new THREE.Group();
  g.position.set(2.7, 0, -1.35);
  scene.add(g);
  const tw = std({ map: T.darkWood, color: 0x9a5a3a, roughness: 0.45 });
  box(0.55, 1.05, 1.3, tw, 0, 0.56, 0, g);
  const front = std({ map: T.wood, color: 0xc08060, roughness: 0.5 });
  const rows: [number, [number, number][]][] = [
    [
      0.16,
      [
        [-0.33, 0.6],
        [0.33, 0.6],
      ],
    ],
    [0.42, [[0, 1.24]]],
    [0.66, [[0, 1.24]]],
    [
      0.9,
      [
        [-0.33, 0.6],
        [0.33, 0.6],
      ],
    ],
  ];
  rows.forEach(([y, cells]) =>
    cells.forEach(([z, w]) => {
      box(0.02, 0.22, w - 0.04, front, -0.285, y + 0.06, z, g);
      const h = mesh(new THREE.TorusGeometry(0.04, 0.007, 6, 16, Math.PI), M.iron, -0.3, y + 0.07, z, g);
      h.rotation.y = Math.PI / 2;
      h.rotation.x = Math.PI;
      box(0.012, 0.05, 0.12, M.iron, -0.298, y + 0.1, z, g, false);
    }),
  );
  (
    [
      [0.03, -0.64],
      [0.03, 0.64],
      [1.07, -0.64],
      [1.07, 0.64],
    ] as const
  ).forEach(([y, z]) => box(0.56, 0.04, 0.04, M.iron, 0, y, z, g, false));
  // bonsai on top
  mesh(new THREE.BoxGeometry(0.18, 0.06, 0.12), std({ color: 0x2b3d5a, roughness: 0.4 }), 0, 1.12, 0.3, g);
  const tr = mesh(new THREE.CylinderGeometry(0.012, 0.02, 0.16, 6), std({ color: 0x3a2a1a }), 0, 1.22, 0.3, g);
  tr.rotation.z = 0.4;
  const lf = std({ color: 0x3d5a2a, roughness: 0.9 });
  (
    [
      [0, 1.32, 0.28],
      [0.05, 1.3, 0.36],
      [-0.05, 1.28, 0.25],
    ] as const
  ).forEach(([x, y, z]) => {
    const m = mesh(new THREE.SphereGeometry(0.07, 8, 6), lf, x, y, z, g);
    m.scale.y = 0.6;
  });
  // book stack
  (
    [
      [0x8a2e2e, 0],
      [0x2e4a8a, 0.03],
      [0xd8c79a, 0.06],
    ] as const
  ).forEach(([c, y], i) => box(0.2, 0.03, 0.28, std({ color: c, roughness: 0.8 }), 0, 1.1 + y, -0.3 + i * 0.01, g));
  k.register(g, "experience", new THREE.Vector3(2.7, 1.55, -1.35));
}
