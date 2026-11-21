import * as THREE from "three";
import type { SectionKey } from "../types";
import { glowTexture } from "../textures/glow";

export type Frame = (t: number, dt: number) => void;

export interface Interactive {
  group: THREE.Object3D;
  key: SectionKey;
  /** World point the hotspot label is pinned to. */
  anchor: THREE.Vector3;
  glow: number;
  lastGlow?: number;
  el?: HTMLElement;
}

/** Shared base textures (created once, in the reference's order). */
export interface BaseTextures {
  tatami: THREE.CanvasTexture;
  plaster: THREE.CanvasTexture;
  wood: THREE.CanvasTexture;
  darkWood: THREE.CanvasTexture;
  washi: THREE.CanvasTexture;
  lattice: THREE.CanvasTexture;
  seigaiha: THREE.CanvasTexture;
}

type StdParams = THREE.MeshStandardMaterialParameters;
type MatWithEmissive = THREE.Material & { emissive?: THREE.Color; emissiveIntensity?: number };

/** Room dimensions. */
export const ROOM = { W: 6, D: 5, H: 2.7 } as const;

/**
 * Build context handed to every world/house builder: scene, helpers, shared materials,
 * per-frame callbacks and the interactive registry. Framework-free.
 */
export class Kit {
  readonly interactive: Interactive[] = [];
  readonly frames: Frame[] = [];
  readonly M: Record<"tatami" | "plaster" | "wood" | "dark" | "black" | "iron", THREE.MeshStandardMaterial>;
  private glowTex?: THREE.CanvasTexture;

  constructor(
    readonly scene: THREE.Scene,
    readonly T: BaseTextures,
    readonly emit: { clack: () => void },
  ) {
    const std = this.std;
    this.M = {
      tatami: std({ map: T.tatami, roughness: 0.95 }),
      plaster: std({ map: T.plaster, roughness: 1 }),
      wood: std({ map: T.wood, roughness: 0.6 }),
      dark: std({ map: T.darkWood, roughness: 0.55 }),
      black: std({ color: 0x15110e, roughness: 0.4 }),
      iron: std({ color: 0x1b1b1b, metalness: 0.6, roughness: 0.4 }),
    };
  }

  /** MeshStandardMaterial with the reference defaults (roughness .8, metalness 0). */
  std = (o: StdParams = {}): THREE.MeshStandardMaterial =>
    new THREE.MeshStandardMaterial({ roughness: 0.8, metalness: 0, ...o });

  mesh = <G extends THREE.BufferGeometry, M extends THREE.Material>(
    geo: G,
    mat: M,
    x = 0,
    y = 0,
    z = 0,
    parent: THREE.Object3D = this.scene,
    shadow = true,
  ): THREE.Mesh<G, M> => {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    m.castShadow = shadow;
    m.receiveShadow = true;
    parent.add(m);
    return m;
  };

  box = (
    w: number,
    h: number,
    d: number,
    mat: THREE.Material,
    x?: number,
    y?: number,
    z?: number,
    parent?: THREE.Object3D,
    shadow?: boolean,
  ) => this.mesh(new THREE.BoxGeometry(w, h, d), mat, x, y, z, parent, shadow);

  /** Additive glow sprite (shared radial texture). */
  glowSprite = (color: THREE.ColorRepresentation, size: number, pos: THREE.Vector3, op = 0.6): THREE.Sprite => {
    this.glowTex ??= glowTexture();
    const sp = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: this.glowTex,
        color,
        transparent: true,
        opacity: op,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        fog: false,
      }),
    );
    sp.scale.set(size, size, 1);
    sp.position.copy(pos);
    sp.renderOrder = 5;
    return sp;
  };

  /** Make a group clickable; clones its emissive materials so hover glow is per-object. */
  register = (group: THREE.Object3D, key: SectionKey, anchor: THREE.Vector3) => {
    group.userData.key = key;
    this.interactive.push({ group, key, anchor, glow: 0 });
    group.traverse((o) => {
      const m = o as THREE.Mesh;
      const mat = m.isMesh ? (m.material as MatWithEmissive) : null;
      if (mat?.emissive) {
        const c = mat.clone() as MatWithEmissive;
        m.material = c;
        o.userData.baseEm = c.emissive!.clone();
        o.userData.baseEI = c.emissiveIntensity;
      }
    });
  };

  onFrame = (f: Frame) => {
    this.frames.push(f);
  };
}

/** Squashed sphere with rounded-box silhouette (zabuton cushion). */
export function rounded(w: number, h: number, d: number): THREE.BufferGeometry {
  const g = new THREE.SphereGeometry(0.5, 24, 12);
  g.scale(w, h * 1.6, d);
  const p = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < p.count; i++) {
    const x = (p.getX(i) / w) * 2,
      z = (p.getZ(i) / d) * 2;
    const k = Math.max(Math.abs(x), Math.abs(z));
    if (k > 0) {
      const f = Math.pow(k, 0.35) / k;
      p.setX(i, p.getX(i) * f * 1.0);
      p.setZ(i, p.getZ(i) * f);
    }
  }
  g.computeVertexNormals();
  return g;
}
