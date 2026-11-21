import * as THREE from "three";
import { ROOM, type Kit } from "../core/Kit";
import { legacyIntensity } from "../core/legacyLights";

/** Hanging chochin (Skills hotspot, flickering point light) and the andon floor lamp. */
export function buildLanterns(k: Kit, lanternTex: THREE.Texture): void {
  const { H } = ROOM;
  const { M, box, mesh, scene, std, glowSprite, T } = k;
  // hanging chochin (skills)
  const g = new THREE.Group();
  g.position.set(-1.85, 1.72, 1.0);
  scene.add(g);
  const pts: THREE.Vector2[] = [];
  for (let i = 0; i <= 20; i++) {
    const t = i / 20;
    pts.push(new THREE.Vector2(Math.sin(t * Math.PI) * 0.22 + 0.06, (t - 0.5) * 0.6));
  }
  mesh(
    new THREE.LatheGeometry(pts, 40),
    std({
      map: lanternTex,
      emissive: 0xff7a3a,
      emissiveMap: lanternTex,
      emissiveIntensity: 0.9,
      roughness: 0.8,
      side: THREE.DoubleSide,
    }),
    0,
    0,
    0,
    g,
    false,
  );
  mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.06, 24), M.black, 0, 0.32, 0, g);
  mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.06, 24), M.black, 0, -0.32, 0, g);
  mesh(new THREE.CylinderGeometry(0.004, 0.004, H - 1.72 - 0.35, 4), M.black, 0, (H - 1.72) / 2 + 0.17, 0, g, false);
  mesh(new THREE.CylinderGeometry(0.015, 0.03, 0.16, 8), std({ color: 0xc8402f }), 0, -0.42, 0, g, false);
  const chochinLight = new THREE.PointLight(0xffa860, legacyIntensity(1.5), 7, 1.6);
  chochinLight.castShadow = false;
  g.add(chochinLight);
  g.add(glowSprite(0xff9a4a, 2.2, new THREE.Vector3(0, 0, 0), 0.55));
  k.register(g, "skills", new THREE.Vector3(-1.85, 1.18, 1.0));
  // andon floor lamp
  const a = new THREE.Group();
  a.position.set(2.45, 0, 1.55);
  scene.add(a);
  const ap = std({ map: T.washi, emissive: 0xffc070, emissiveMap: T.washi, emissiveIntensity: 1.1, roughness: 0.9 });
  box(0.32, 0.55, 0.32, ap, 0, 0.48, 0, a, false);
  (
    [
      [0.16, 0.16],
      [-0.16, 0.16],
      [0.16, -0.16],
      [-0.16, -0.16],
    ] as const
  ).forEach(([x, z]) => box(0.03, 0.8, 0.03, M.black, x, 0.4, z, a));
  box(0.36, 0.03, 0.36, M.black, 0, 0.76, 0, a);
  box(0.36, 0.03, 0.36, M.black, 0, 0.2, 0, a);
  const andonLight = new THREE.PointLight(0xffb870, legacyIntensity(1.1), 6, 1.8);
  andonLight.position.set(0, 0.5, 0);
  a.add(andonLight);
  a.add(glowSprite(0xffc070, 1.6, new THREE.Vector3(0, 0.5, 0), 0.45));

  k.onFrame((t) => {
    g.rotation.z = Math.sin(t * 0.8) * 0.03;
    g.rotation.x = Math.cos(t * 0.6) * 0.02;
    chochinLight.intensity = legacyIntensity(1.45 + Math.sin(t * 7) * 0.04 + Math.sin(t * 13.3) * 0.03);
    andonLight.intensity = legacyIntensity(1.05 + Math.sin(t * 9.1) * 0.04);
  });
}
