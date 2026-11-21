import * as THREE from "three";
import { ROOM, type Kit } from "../core/Kit";

/** Tatami floor, ceiling battens, plaster walls, tokonoma alcove, fusuma, transom, back engawa. */
export function buildRoom(k: Kit): void {
  const { W, D: Dp, H } = ROOM;
  const { M, box, mesh, scene, std, T } = k;

  // floor: 3 x 3 grid-ish tatami layout (8 mats + half)
  const fl = new THREE.Group();
  scene.add(fl);
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++) {
      const vertical = (i + j) % 2 === 0;
      const x = -2 + i * 2,
        z = -1.65 + j * 1.65;
      if (vertical) {
        box(0.98, 0.06, 1.63, M.tatami, x - 0.5, 0.03, z, fl, false);
        box(0.98, 0.06, 1.63, M.tatami, x + 0.5, 0.03, z, fl, false);
      } else {
        box(1.98, 0.06, 0.81, M.tatami, x, 0.03, z - 0.41, fl, false);
        box(1.98, 0.06, 0.81, M.tatami, x, 0.03, z + 0.41, fl, false);
      }
    }
  fl.children.forEach((o) => {
    const m = o as THREE.Mesh<THREE.BoxGeometry, THREE.MeshStandardMaterial>;
    const g = m.geometry.parameters;
    if (g.width < g.depth) {
      m.material = M.tatami.clone();
      const map = T.tatami.clone();
      map.needsUpdate = true;
      map.rotation = Math.PI / 2;
      map.center.set(0.5, 0.5);
      m.material.map = map;
    }
  });
  box(W + 0.2, 0.1, Dp + 0.4, M.dark, 0, -0.05, 0, scene, false);
  // ceiling
  box(W, 0.06, Dp, M.dark, 0, H + 0.03, 0);
  for (let x = -2.5; x <= 2.5; x += 0.5) box(0.05, 0.06, Dp, M.black, x, H - 0.02, 0, scene, false);
  // left wall (tokonoma + fusuma)
  box(0.12, H, Dp, M.plaster, -3.06, H / 2, 0);
  // tokonoma
  box(0.62, 0.14, 1.9, M.wood, -2.7, 0.07, -1.45); // platform
  box(0.08, H, 0.08, M.wood, -2.42, H / 2, -0.48); // tokobashira
  box(0.62, 0.1, 1.9, M.dark, -2.7, 2.05, -1.45); // otoshigake
  // fusuma (left front)
  const fus = std({ map: T.seigaiha, roughness: 0.85 });
  for (let n = 0; n < 2; n++) {
    const z = 0.15 + n * 1.1;
    box(0.05, 1.8, 1.06, fus, -2.99, 0.9, z);
    box(0.06, 0.04, 1.1, M.black, -2.98, 1.82, z);
    box(0.06, 1.84, 0.04, M.black, -2.98, 0.92, z - 0.55);
    box(0.06, 1.84, 0.04, M.black, -2.98, 0.92, z + 0.55);
    const pull = mesh(new THREE.CircleGeometry(0.04, 20), M.iron, -2.96, 0.9, z + (n ? -0.4 : 0.4));
    pull.rotation.y = Math.PI / 2;
  }
  box(0.1, 0.08, Dp, M.wood, -2.98, 1.86, 0);
  // right wall
  box(0.12, H, Dp, M.plaster, 3.06, H / 2, 0);
  [-2.45, -0.8, 0.9, 2.45].forEach((z) => box(0.1, H, 0.1, M.wood, 2.98, H / 2, z));
  box(0.08, 0.1, Dp, M.wood, 2.98, 1.86, 0);
  [-2.45, 2.45].forEach((z) => box(0.1, H, 0.1, M.wood, -2.98, H / 2, z));
  // back wall top transom with ranma lattice
  box(W, 0.85, 0.1, M.plaster, 0, H - 0.42, -2.5);
  box(W, 0.1, 0.12, M.wood, 0, 1.88, -2.48);
  // engawa + garden
  box(W + 2, 0.08, 1.1, M.wood, 0, -0.02, -3.1);
  for (let x = -3.9; x <= 3.9; x += 0.18) box(0.01, 0.081, 1.1, M.black, x, -0.02, -3.1, scene, false);
  box(0.14, H + 0.2, 0.14, M.wood, -3.2, H / 2, -3.6);
  box(0.14, H + 0.2, 0.14, M.wood, 3.2, H / 2, -3.6);
}
