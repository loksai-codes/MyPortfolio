import * as THREE from "three";
import type { Kit } from "../core/Kit";
import { rnd } from "../core/rand";
import { skyMaterial } from "../materials";
import { cloudTexture } from "../textures/clouds";

export const MOON_POS = new THREE.Vector3(55, 26, -115);

/** Shader sky dome, stars, moon with halo and drifting clouds. */
export function buildSky(k: Kit): void {
  const { mesh, scene, glowSprite } = k;
  scene.background = null;
  const dome = new THREE.Mesh(new THREE.SphereGeometry(160, 32, 16), skyMaterial(MOON_POS.clone().normalize()));
  dome.renderOrder = -10;
  scene.add(dome);
  // stars
  const sg = new THREE.BufferGeometry(),
    sp: number[] = [];
  for (let i = 0; i < 900; i++) {
    const a = rnd(0, Math.PI * 2),
      e = Math.asin(rnd(0.06, 1)),
      r = 150;
    sp.push(Math.cos(a) * r * Math.cos(e), Math.sin(e) * r, Math.sin(a) * r * Math.cos(e));
  }
  sg.setAttribute("position", new THREE.Float32BufferAttribute(sp, 3));
  scene.add(
    new THREE.Points(
      sg,
      new THREE.PointsMaterial({
        color: 0xffffff,
        size: 1.6,
        sizeAttenuation: false,
        fog: false,
        transparent: true,
        opacity: 0.75,
        depthWrite: false,
      }),
    ),
  );
  // moon + halo
  mesh(
    new THREE.SphereGeometry(5.5, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0xfff3d6, fog: false }),
    MOON_POS.x,
    MOON_POS.y,
    MOON_POS.z,
    scene,
    false,
  );
  const halo = glowSprite(0xffe6c0, 46, MOON_POS, 0.55);
  halo.material.blending = THREE.AdditiveBlending;
  scene.add(halo);
  // clouds
  const ct = cloudTexture();
  const clouds: THREE.Sprite[] = [];
  for (let i = 0; i < 7; i++) {
    const s = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: ct,
        color: i % 2 ? 0x8a86b8 : 0x6e6a9c,
        transparent: true,
        opacity: rnd(0.35, 0.6),
        depthWrite: false,
        fog: false,
      }),
    );
    s.scale.set(rnd(40, 70), rnd(12, 20), 1);
    s.position.set(rnd(-120, 120), rnd(22, 44), -142 + rnd(-4, 4));
    scene.add(s);
    clouds.push(s);
  }
  k.onFrame((_t, dt) => {
    clouds.forEach((s, i) => {
      s.position.x += dt * (0.6 + (i % 3) * 0.3);
      if (s.position.x > 140) s.position.x = -140;
    });
  });
}
