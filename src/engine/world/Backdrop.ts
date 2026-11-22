import * as THREE from "three";
import type { Kit } from "../core/Kit";
import { backdropMaterial } from "../materials";
import { cvs } from "../textures/canvas";

/** Fog colour: the floor fades to this with distance, and the backdrop's horizon band matches it. */
export const BACKDROP_FLOOR = 0x2a1f1a;

/** Round display plinth the house stands on (top sits flush under the stone foundation). */
const PLINTH = { r: 6.3, h: 0.34, top: -0.37 } as const;

/**
 * Studio diorama: the house on a round dark-wood plinth with a thin brass rim, in front of a seamless
 * warm cyclorama with a soft spotlight pool behind the roof. No scenery, sky objects or particles.
 */
export function buildBackdrop(k: Kit): void {
  const { mesh, scene, std, T } = k;
  scene.background = null;
  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(160, 48, 24),
    backdropMaterial(new THREE.Vector3(0, 0.22, -1).normalize(), BACKDROP_FLOOR),
  );
  dome.renderOrder = -10;
  scene.add(dome);

  // studio floor: fades into the cyclorama with distance; takes no cast shadow (hard wedges on an empty floor)
  const floor = mesh(
    new THREE.CircleGeometry(150, 64),
    std({ color: 0x1c1512, roughness: 1 }),
    0,
    PLINTH.top - PLINTH.h,
    0,
    scene,
    false,
  );
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = false;

  // plinth: lacquered dark wood drum + brass rim at the top edge
  const wood = T.darkWood.clone();
  wood.wrapS = wood.wrapT = THREE.RepeatWrapping;
  wood.repeat.set(6, 1);
  wood.needsUpdate = true;
  mesh(
    new THREE.CylinderGeometry(PLINTH.r, PLINTH.r + 0.06, PLINTH.h, 96),
    std({ map: wood, color: 0x7a6254, roughness: 0.8 }),
    0,
    PLINTH.top - PLINTH.h / 2,
    0,
    scene,
    false,
  );
  mesh(
    new THREE.CylinderGeometry(PLINTH.r + 0.012, PLINTH.r + 0.012, 0.035, 96, 1, true),
    std({ color: 0xb8925a, metalness: 0.7, roughness: 0.35 }),
    0,
    PLINTH.top - 0.02,
    0,
    scene,
    false,
  );
  // soft contact shadow under the house, on the plinth top
  const contact = mesh(
    new THREE.PlaneGeometry(13, 10),
    new THREE.MeshBasicMaterial({ map: contactShadowTexture(), transparent: true, depthWrite: false }),
    0,
    PLINTH.top + 0.004,
    0.4,
    scene,
    false,
  );
  contact.rotation.x = -Math.PI / 2;
  contact.receiveShadow = false;
  // soft shadow the plinth throws on the studio floor
  const pool = mesh(
    new THREE.PlaneGeometry(17, 17),
    new THREE.MeshBasicMaterial({ map: contactShadowTexture(), transparent: true, depthWrite: false }),
    0,
    PLINTH.top - PLINTH.h + 0.004,
    0,
    scene,
    false,
  );
  pool.rotation.x = -Math.PI / 2;
  pool.receiveShadow = false;
}

/** Soft elliptical darkening (black with a radial alpha falloff). */
const contactShadowTexture = () =>
  cvs(128, 128, (g, w, h) => {
    const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, "rgba(8,5,4,.6)");
    gr.addColorStop(0.55, "rgba(8,5,4,.35)");
    gr.addColorStop(1, "rgba(8,5,4,0)");
    g.fillStyle = gr;
    g.fillRect(0, 0, w, h);
  });
