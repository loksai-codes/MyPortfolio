import * as THREE from "three";
import type { SectionKey } from "../types";

type View = { p: [number, number, number]; t: [number, number, number] };
type ViewKey = SectionKey | "home" | "door";

/** Camera position + look target per view. */
export const VIEWS: Record<ViewKey, View> = {
  home: { p: [0, 2.6, 11.8], t: [0.2, 0.72, 0] },
  about: { p: [-0.9, 1.3, 0.4], t: [-2.95, 1.2, -1.45] },
  projects: { p: [0.05, 1.05, 1.75], t: [-0.05, 0.48, 0.45] },
  experience: { p: [0.6, 1.3, -0.1], t: [2.7, 0.8, -1.35] },
  skills: { p: [-0.4, 1.5, 2.6], t: [-1.85, 1.72, 1.0] },
  quests: { p: [0.1, 1.3, 3.7], t: [-2.6, 0.6, 1.9] },
  gallery: { p: [0.8, 1.35, 1.7], t: [3, 1.3, 1.7] },
  contact: { p: [-0.3, 1.3, 0.1], t: [-0.1, 1.45, -4] },
  ren: { p: [0.2, 1.05, 2.55], t: [1.05, 0.6, 0.95] },
  door: { p: [0, 1.3, 4.75], t: [0, 1.18, 2.5] },
};

/** Breakpoint where the side panel covers the right of the screen. */
export const WIDE = 900;

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/**
 * Eased camera tweens between views, pointer parallax smoothing, panel offset on wide screens
 * and the portrait pull-back for the home view.
 */
export class CameraRig {
  view: ViewKey = "home";
  private p = new THREE.Vector3(...VIEWS.home.p);
  private t = new THREE.Vector3(...VIEWS.home.t);
  private fromP = new THREE.Vector3();
  private fromT = new THREE.Vector3();
  private toP = new THREE.Vector3(...VIEWS.home.p);
  private toT = new THREE.Vector3(...VIEWS.home.t);
  private k = 1;
  private t0 = 0;
  private dur = 1900;
  /** Raw pointer position in -1..1 (set from pointermove). */
  readonly pointer = new THREE.Vector2();
  private parS = new THREE.Vector2();
  private lookS = new THREE.Vector3(0, 1.18, 2.5);

  constructor(
    private camera: THREE.PerspectiveCamera,
    private size: () => { w: number; h: number },
    private reducedMotion = false,
  ) {}

  private homeFor() {
    const { w, h } = this.size();
    const a = w / h;
    const v = VIEWS.home;
    const extra = a < 1 ? (1 / a - 1) * 3.2 : 0;
    return { p: new THREE.Vector3(v.p[0], v.p[1] + extra * 0.15, v.p[2] + extra), t: new THREE.Vector3(...v.t) };
  }

  private tween(dur: number) {
    this.fromP.copy(this.p);
    this.fromT.copy(this.t);
    this.k = 0;
    this.t0 = performance.now();
    this.dur = this.reducedMotion ? 0 : dur;
  }

  /** Fly to a section (or back home with null). */
  focus(key: SectionKey | null) {
    this.view = key ?? "home";
    this.tween(1900);
    if (!key) {
      const h = this.homeFor();
      this.toP.copy(h.p);
      this.toT.copy(h.t);
      return;
    }
    const v = VIEWS[key];
    this.toP.set(...v.p);
    this.toT.set(...v.t);
    // shift so the object sits left of the side panel on wide screens
    if (this.size().w > WIDE) {
      const dir = this.toT.clone().sub(this.toP);
      const right = new THREE.Vector3().crossVectors(dir, new THREE.Vector3(0, 1, 0)).normalize();
      this.toT.add(right.multiplyScalar(dir.length() * 0.28));
    } else {
      this.toT.y -= 0.25;
    }
  }

  /** Snap to the closed-door view (before the intro). */
  snapToDoor() {
    this.view = "door";
    this.p.set(...VIEWS.door.p);
    this.t.set(...VIEWS.door.t);
    this.toP.copy(this.p);
    this.toT.copy(this.t);
    this.k = 1;
    this.lookS.copy(this.t);
  }

  /** Slow pull-back from the doors to the home view. */
  flyHome(dur = 3600) {
    this.view = "home";
    this.tween(dur);
    const h = this.homeFor();
    this.toP.copy(h.p);
    this.toT.copy(h.t);
  }

  onResize() {
    const { w, h } = this.size();
    this.camera.aspect = w / h;
    this.camera.fov = w / h < 1 ? 62 : 44;
    this.camera.updateProjectionMatrix();
    if (this.view === "home" && this.k >= 1) {
      const hh = this.homeFor();
      this.p.copy(hh.p);
      this.toP.copy(hh.p);
    }
  }

  update(dt: number) {
    if (this.k < 1) {
      this.k = this.dur <= 0 ? 1 : Math.min(1, (performance.now() - this.t0) / this.dur);
      const e = easeInOutCubic(this.k);
      this.p.lerpVectors(this.fromP, this.toP, e);
      this.t.lerpVectors(this.fromT, this.toT, e);
    }
    const pf = this.reducedMotion ? 0 : this.view === "home" ? 1 : this.view === "door" ? 0.35 : 0.22;
    const kk = 1 - Math.exp(-dt * 2.6);
    this.parS.x += (this.pointer.x - this.parS.x) * kk;
    this.parS.y += (this.pointer.y - this.parS.y) * kk;
    const c = this.camera;
    c.position.set(this.p.x + this.parS.x * 0.4 * pf, this.p.y - this.parS.y * 0.16 * pf, this.p.z);
    if (this.dur <= 0) this.lookS.copy(this.t);
    else this.lookS.lerp(this.t, 1 - Math.exp(-dt * 9));
    c.lookAt(this.lookS.x + this.parS.x * 0.08 * pf, this.lookS.y, this.lookS.z);
  }
}
