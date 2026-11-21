import * as THREE from "three";
import type { Kit } from "../core/Kit";

export interface RenController {
  root: THREE.Group;
  /** Start a hop (pet / greeting). */
  hop(): void;
  /** Mouth/ear/antenna "talking" animation while the voice speaks. */
  setTalking(on: boolean): void;
  /** Current hop height factor 0..1 (used to lift the speech bubble). */
  readonly hopLift: number;
  /** Per-frame update; `look` is pointer parallax (-1..1), `hovered` whether Ren is under the pointer. */
  update(t: number, dt: number, look: THREE.Vector2, hovered: boolean): void;
}

/** Ren: a purple companion built from primitives (body, head, eyes, ears, glowing antennae and tail orb). */
export function buildRen(k: Kit): RenController {
  const { mesh, scene, std, glowSprite } = k;
  const R = new THREE.Group();
  R.position.set(1.05, 0.15, 0.95);
  R.rotation.y = -0.55;
  scene.add(R);
  const inner = new THREE.Group();
  R.add(inner);
  const fur = std({ color: 0x9f86d6, roughness: 0.95 });
  const furD = std({ color: 0x8a70c4, roughness: 0.95 });
  const pinkM = std({ color: 0xd9a3c4, roughness: 0.9 });
  const cream = std({ color: 0xe8ded8, roughness: 0.95 });
  const glowM = new THREE.MeshStandardMaterial({ color: 0xffe08a, emissive: 0xffcf5a, emissiveIntensity: 1.6, roughness: 0.3 });
  const eyeM = std({ color: 0x0d0a14, roughness: 0.08, metalness: 0.1 });
  const white = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const S = (r: number, ws = 24) => new THREE.SphereGeometry(r, ws, (ws * 0.75) | 0);
  // body + head
  const body = mesh(S(0.2), fur, 0, 0.17, 0, inner);
  body.scale.set(1, 1, 0.92);
  const belly = mesh(S(0.13), cream, 0, 0.15, 0.12, inner);
  belly.scale.set(1, 1.05, 0.5);
  const head = new THREE.Group();
  head.position.set(0, 0.45, 0);
  inner.add(head);
  const hm = mesh(S(0.25, 32), fur, 0, 0, 0, head);
  hm.scale.set(1.05, 0.95, 0.95);
  // eyes + cheeks
  const eyes: THREE.Group[] = [];
  [-1, 1].forEach((sd) => {
    const e = new THREE.Group();
    e.position.set(sd * 0.1, 0.02, 0.205);
    e.rotation.y = sd * 0.32;
    head.add(e);
    const em = mesh(S(0.055), eyeM, 0, 0, 0, e, false);
    em.scale.set(0.85, 1.15, 0.45);
    mesh(S(0.017, 10), white, -sd * 0.012 + 0.012, 0.025, 0.024, e, false);
    mesh(S(0.008, 8), white, -0.014, -0.022, 0.025, e, false);
    eyes.push(e);
    const ch = mesh(S(0.035), pinkM, sd * 0.165, -0.07, 0.16, head, false);
    ch.scale.set(1, 0.7, 0.4);
    ch.rotation.y = sd * 0.6;
  });
  const nose = mesh(S(0.022), furD, 0, -0.05, 0.235, head, false);
  nose.scale.set(1.3, 0.8, 0.7);
  // ears
  const ears: THREE.Group[] = [];
  const earOuter = pinkM.clone();
  earOuter.color.set(0xc49ac8);
  [-1, 1].forEach((sd) => {
    const ep = new THREE.Group();
    ep.position.set(sd * 0.2, 0.08, -0.03);
    head.add(ep);
    const ear = new THREE.Group();
    ear.rotation.set(0, sd * 0.35, sd * -0.95);
    ep.add(ear);
    const o = mesh(S(0.16), earOuter, 0, 0.15, 0, ear);
    o.scale.set(0.75, 1.05, 0.16);
    const i = mesh(S(0.13), pinkM, 0, 0.15, 0.018, ear, false);
    i.scale.set(0.65, 0.9, 0.1);
    ears.push(ep);
  });
  // antennae
  const orbs: THREE.Mesh<THREE.SphereGeometry, THREE.MeshStandardMaterial>[] = [];
  [-1, 1].forEach((sd) => {
    const pts = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(sd * 0.02, 0.1, 0), new THREE.Vector3(sd * 0.06, 0.2, 0.01), new THREE.Vector3(sd * 0.13, 0.3, 0.02)];
    const curve = new THREE.CatmullRomCurve3(pts);
    const a = new THREE.Group();
    a.position.set(sd * 0.07, 0.2, 0);
    a.rotation.z = sd * -0.15;
    head.add(a);
    mesh(new THREE.TubeGeometry(curve, 16, 0.014, 8), furD, 0, 0, 0, a, false);
    [0.35, 0.55, 0.75].forEach((t) => {
      const p = curve.getPoint(t);
      const tw = mesh(new THREE.CylinderGeometry(0.006, 0.009, 0.06, 6), furD, p.x + sd * 0.022, p.y + 0.015, p.z, a, false);
      tw.rotation.z = sd * -0.9;
      const tw2 = mesh(new THREE.CylinderGeometry(0.006, 0.009, 0.05, 6), furD, p.x - sd * 0.018, p.y + 0.02, p.z, a, false);
      tw2.rotation.z = sd * 0.7;
    });
    const tip = pts[3]!;
    orbs.push(mesh(S(0.035), glowM.clone(), tip.x, tip.y, tip.z, a, false));
  });
  // arms, feet
  [-1, 1].forEach((sd) => {
    const ar = mesh(S(0.07), fur, sd * 0.15, 0.2, 0.1, inner);
    ar.scale.set(0.75, 1.1, 0.8);
    ar.rotation.z = sd * 0.4;
    const ft = mesh(S(0.08), fur, sd * 0.1, 0.03, 0.07, inner);
    ft.scale.set(1, 0.5, 1.3);
  });
  // tail
  const tc = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.12, 0.08, -0.12),
    new THREE.Vector3(0.28, 0.1, -0.2),
    new THREE.Vector3(0.38, 0.22, -0.18),
    new THREE.Vector3(0.36, 0.36, -0.1),
    new THREE.Vector3(0.28, 0.42, -0.08),
  ]);
  mesh(new THREE.TubeGeometry(tc, 32, 0.04, 10), fur, 0, 0, 0, inner);
  orbs.push(mesh(S(0.05), glowM.clone(), 0.27, 0.44, -0.08, inner, false));
  glowM.dispose(); // template only
  const glows = orbs.map((o) => {
    const gs = glowSprite(0xffd070, 0.32, new THREE.Vector3(), 0.9);
    o.add(gs);
    return gs;
  });
  k.register(R, "ren", new THREE.Vector3(1.05, 1.15, 0.95));
  // Ren never casts into the static shadow map (matches the reference).
  R.traverse((o) => {
    if ((o as THREE.Mesh).isMesh) o.castShadow = false;
  });

  let hop = 0,
    talking = false,
    hopLift = 0;
  return {
    root: R,
    hop: () => {
      hop = 1;
    },
    setTalking: (on) => {
      talking = on;
    },
    get hopLift() {
      return hopLift;
    },
    update(t, dt, look, hovered) {
      hop = Math.max(0, hop - dt * 1.6);
      const hp = Math.sin((1 - hop) * Math.PI) * (hop > 0 ? 1 : 0);
      hopLift = hp;
      const tk = talking ? 1 : 0;
      inner.position.y = Math.sin(t * 2) * 0.012 + hp * 0.22 + tk * Math.abs(Math.sin(t * 11)) * 0.018;
      inner.scale.set(1 + Math.sin(t * 2) * 0.01, 1 - Math.sin(t * 2) * 0.01, 1);
      inner.rotation.y = Math.sin(t * 0.5) * 0.08;
      const lx = look.x * 0.5,
        ly = -look.y * 0.25;
      head.rotation.y += (lx - head.rotation.y) * dt * 3;
      head.rotation.x += (ly * 0.6 - head.rotation.x) * dt * 3;
      ears.forEach((e, i) => (e.rotation.z = Math.sin(t * 3 + i) * 0.06 + (hop > 0 ? Math.sin(t * 20) * 0.15 : 0) + (talking ? Math.sin(t * 9 + i) * 0.08 : 0)));
      const bl = t % 4.2 < 0.12 ? 0.1 : 1;
      eyes.forEach((e) => (e.scale.y += (bl - e.scale.y) * 0.5));
      const g = 1.4 + Math.sin(t * 2.5) * 0.5 + (hovered ? 1 : 0) + hp * 1.5 + (talking ? 1.2 + Math.sin(t * 14) * 0.6 : 0);
      orbs.forEach((o, i) => (o.material.emissiveIntensity = g + Math.sin(t * 3 + i) * 0.2));
      glows.forEach((gs) => (gs.material.opacity = 0.45 + g * 0.18));
    },
  };
}
