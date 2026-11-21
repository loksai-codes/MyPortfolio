import * as THREE from "three";
import { ROOM, type Kit } from "../core/Kit";

/** Back shoji (moonlit, opened to the garden) — the Contact hotspot. */
export function buildShoji(k: Kit): void {
  const { M, box, mesh, scene, std, T } = k;
  const g = new THREE.Group();
  scene.add(g);
  const paper = std({
    map: T.washi,
    emissive: 0xbcc6ff,
    emissiveMap: T.washi,
    emissiveIntensity: 0.32,
    roughness: 0.9,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.93,
  });
  const lat = std({ color: 0x2f2015, alphaMap: T.lattice, alphaTest: 0.5, roughness: 0.6, side: THREE.DoubleSide });
  const depth = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, alphaMap: T.lattice, alphaTest: 0.5 });
  const pw = 1.52,
    ph = 1.84;
  (
    [
      [-2.24, -2.46],
      [-1.62, -2.4],
      [1.62, -2.4],
      [2.24, -2.46],
    ] as const
  ).forEach(([x, z]) => {
    const p = new THREE.Group();
    p.position.set(x, ph / 2 + 0.02, z);
    g.add(p);
    mesh(new THREE.PlaneGeometry(pw - 0.04, ph - 0.04), paper, 0, 0, 0, p, false);
    const l = mesh(new THREE.PlaneGeometry(pw, ph), lat, 0, 0, 0.012, p, true);
    l.customDepthMaterial = depth;
  });
  box(ROOM.W, 0.05, 0.14, M.wood, 0, 0.025, -2.45); // sill
  k.register(g, "contact", new THREE.Vector3(0, 1.55, -2.4));
}
