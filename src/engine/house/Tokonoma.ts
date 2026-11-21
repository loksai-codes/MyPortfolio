import * as THREE from "three";
import type { Kit } from "../core/Kit";
import { rnd } from "../core/rand";

/** Hanging scroll + ikebana in the alcove — the About hotspot. */
export function buildTokonoma(k: Kit, scrollTex: THREE.Texture): void {
  const { M, mesh, scene, std } = k;
  const g = new THREE.Group();
  scene.add(g);
  const s = mesh(new THREE.PlaneGeometry(0.6, 1.5), std({ map: scrollTex, roughness: 0.9 }), -2.97, 1.2, -1.45, g, false);
  s.rotation.y = Math.PI / 2;
  const rod = mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.72, 10), M.black, -2.95, 0.44, -1.45, g);
  rod.rotation.x = Math.PI / 2;
  const rod2 = mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.64, 10), M.dark, -2.96, 1.96, -1.45, g);
  rod2.rotation.x = Math.PI / 2;
  // ikebana
  mesh(new THREE.CylinderGeometry(0.07, 0.1, 0.26, 16), std({ color: 0x1f2b4a, roughness: 0.3, metalness: 0.1 }), -2.62, 0.27, -0.95, g);
  const stem = std({ color: 0x3d2b1a });
  const bl = std({ color: 0xf2b5c6, emissive: 0xf2b5c6, emissiveIntensity: 0.08 });
  (
    [
      [0.0, 0.55, 0.2],
      [-0.12, 0.45, -0.3],
      [0.1, 0.38, 0.5],
    ] as const
  ).forEach(([dz, h, rz]) => {
    const st = mesh(new THREE.CylinderGeometry(0.006, 0.008, h, 5), stem, -2.62, 0.4 + h / 2, -0.95 + dz, g);
    st.rotation.x = rz * 0.6;
    for (let n = 0; n < 5; n++)
      mesh(
        new THREE.IcosahedronGeometry(0.03, 0),
        bl,
        -2.62 + rnd(-0.04, 0.04),
        0.4 + h * rnd(0.5, 1.05),
        -0.95 + dz + rz * h * 0.3 + rnd(-0.05, 0.05),
        g,
        false,
      );
  });
  k.register(g, "about", new THREE.Vector3(-2.85, 2.12, -1.45));
}
