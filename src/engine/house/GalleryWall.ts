import * as THREE from "three";
import type { Kit } from "../core/Kit";

/** Four framed photos on the right wall + brass picture light — the Gallery hotspot. */
export function buildGalleryWall(k: Kit, photos: readonly [string, string, string, string]): void {
  const { M, box, mesh, scene, std } = k;
  const g = new THREE.Group();
  scene.add(g);
  const ld = new THREE.TextureLoader();
  const frames: [number, number, number, number, number][] = [
    [0, 1.62, 1.32, 0.46, 0.26],
    [1, 1.62, 2.08, 0.46, 0.26],
    [2, 1.12, 1.32, 0.42, 0.31],
    [3, 1.17, 2.08, 0.27, 0.4],
  ];
  frames.forEach(([i, y, z, w, h]) => {
    box(0.03, h + 0.07, w + 0.07, M.black, 2.985, y, z, g);
    box(0.032, h + 0.02, w + 0.02, std({ color: 0xf3ead8, roughness: 0.9 }), 2.98, y, z, g, false);
    const tx = ld.load(photos[i]!);
    tx.colorSpace = THREE.SRGBColorSpace;
    const ph = mesh(
      new THREE.PlaneGeometry(w - 0.03, h - 0.03),
      std({ map: tx, roughness: 0.7 }),
      2.962,
      y,
      z,
      g,
      false,
    );
    ph.rotation.y = -Math.PI / 2;
  });
  // small brass picture light
  box(0.08, 0.03, 0.5, std({ color: 0xb08a4a, metalness: 0.7, roughness: 0.3 }), 2.93, 1.93, 1.7, g, false);
  k.register(g, "gallery", new THREE.Vector3(2.95, 1.98, 1.7));
}
