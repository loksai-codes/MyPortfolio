import * as THREE from "three";
import type { Kit } from "../core/Kit";
import { rnd } from "../core/rand";
import { groundMistTexture } from "../textures/mist";

/** Low drifting mist sprites in the back and front gardens. */
export function buildGroundMist(k: Kit): void {
  const mt = groundMistTexture();
  const mist: THREE.Sprite[] = [];
  for (let i = 0; i < 26; i++) {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: mt, color: 0xb8b8e0, transparent: true, opacity: rnd(0.06, 0.14), depthWrite: false }));
    const far = i < 12;
    s.scale.set(rnd(6, 12), rnd(1.2, 2.2), 1);
    s.position.set(rnd(-14, 14), rnd(-0.1, 0.5), far ? rnd(-16, -7) : rnd(4, 12));
    k.scene.add(s);
    mist.push(s);
  }
  k.onFrame((_t, dt) => {
    mist.forEach((s, i) => {
      s.position.x += dt * (0.12 + (i % 3) * 0.05);
      if (s.position.x > 16) s.position.x = -16;
    });
  });
}
