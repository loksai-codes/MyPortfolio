import { ROOM, type Kit } from "../core/Kit";

/** Stone plinth, side engawa and exterior corner posts. */
export function buildFoundation(k: Kit): void {
  const { W } = ROOM;
  const { M, box, scene, std } = k;
  const st = std({ color: 0x4a4741, roughness: 0.95 });
  // stone plinth below the floor and verandas
  box(W + 2.4, 0.32, 7.4, st, 0, -0.21, 0, scene, false);
  box(W + 2.1, 0.05, 0.05, M.black, 0, -0.075, 3.58, scene, false);
  // engawa side extensions
  box(0.9, 0.08, 6.4, M.wood, -3.5, -0.02, 0, scene, false);
  box(0.9, 0.08, 6.4, M.wood, 3.5, -0.02, 0, scene, false);
  // outer corner posts visible past the room edges
  [-3.98, 3.98].forEach((x) => [-2.5, 2.5].forEach((z) => box(0.14, 2.8, 0.14, M.wood, x, 1.38, z)));
}
