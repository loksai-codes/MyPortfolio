import * as THREE from "three";
import { CameraRig, WIDE } from "./camera/CameraRig";
import { buildRen, type RenController } from "./characters/Ren";
import { Kit, type BaseTextures, type Interactive } from "./core/Kit";
import { INDIRECT_COMPENSATION, installLegacyLighting, legacyIntensity } from "./core/legacyLights";
import { Emitter, type EngineEvents } from "./events";
import { buildDesk } from "./house/Desk";
import { buildEntryDoors, type EntryDoors } from "./house/EntryDoors";
import { buildFoundation } from "./house/Foundation";
import { buildGalleryWall } from "./house/GalleryWall";
import { buildLanterns } from "./house/Lanterns";
import { buildRoof } from "./house/Roof";
import { buildRoom } from "./house/Room";
import { buildShelf } from "./house/Shelf";
import { buildShoji } from "./house/Shoji";
import { buildTansu } from "./house/Tansu";
import { buildTokonoma } from "./house/Tokonoma";
import { Picker } from "./interaction/Picker";
import { lanternTexture } from "./textures/lantern";
import { latticeTexture } from "./textures/lattice";
import { plasterTexture } from "./textures/plaster";
import { screenTexture } from "./textures/screen";
import { scrollTexture } from "./textures/scroll";
import { seigaihaTexture } from "./textures/seigaiha";
import { tatamiTexture } from "./textures/tatami";
import { washiTexture } from "./textures/washi";
import { darkWoodTexture, woodTexture } from "./textures/wood";
import type { EngineOptions, SectionKey } from "./types";
import { buildDistant } from "./world/Distant";
import { buildFx, type Fx } from "./world/Fx";
import { buildGarden } from "./world/Garden";
import { buildMountains } from "./world/Mountains";
import { buildPetals } from "./world/Petals";
import { buildSky } from "./world/Sky";
import { buildSakura } from "./world/Trees";

export type { EngineOptions, SectionKey } from "./types";

/**
 * The whole 3D washitsu: renderer, render loop, adaptive DPR, hidden-tab pause, camera rig,
 * picking, Ren, and DOM overlay positioning (hotspots + speech bubble). Framework-free.
 *
 *   const engine = new Engine(canvas, { onSelect, onHover, onRenSay, ... });
 *   engine.focus("projects"); engine.openDoors(); engine.petRen(); engine.dispose();
 */
export class Engine {
  readonly events = new Emitter<EngineEvents>();
  /** Resolves once all shader programs are compiled. */
  readonly ready: Promise<unknown>;
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(48, 1, 0.05, 200);
  private rig: CameraRig;
  private kit: Kit;
  private picker: Picker;
  private ren: RenController;
  private doors: EntryDoors;
  private fx: Fx;
  private raf = 0;
  private timers: ReturnType<typeof setTimeout>[] = [];
  private disposers: (() => void)[] = [];
  private hovered: Interactive | null = null;
  private focused: SectionKey | null = null;
  private hotspots = new Map<SectionKey, HTMLElement>();
  private bubble: HTMLElement | null = null;
  private lang = "en";
  private tmp = new THREE.Vector3();
  private disposed = false;

  constructor(
    private canvas: HTMLCanvasElement,
    private opts: EngineOptions,
  ) {
    installLegacyLighting();
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
    const r = this.renderer;
    r.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    r.outputColorSpace = THREE.SRGBColorSpace;
    r.toneMapping = THREE.ACESFilmicToneMapping;
    r.toneMappingExposure = 0.95;
    r.shadowMap.enabled = true;
    r.shadowMap.type = THREE.PCFShadowMap;
    r.shadowMap.autoUpdate = false;
    this.scene.fog = new THREE.Fog(0x221d42, 14, 62);
    this.rig = new CameraRig(
      this.camera,
      () => ({ w: window.innerWidth, h: window.innerHeight }),
      !!opts.reducedMotion,
    );

    // Wire option callbacks to events.
    const ev = this.events;
    if (opts.onSelect) ev.on("select", opts.onSelect);
    if (opts.onMiss) ev.on("miss", opts.onMiss);
    if (opts.onHover) ev.on("hover", opts.onHover);
    if (opts.onRenSay) ev.on("renSay", opts.onRenSay);
    if (opts.onSound) ev.on("sound", opts.onSound);

    // Base textures — created in the reference's order so seeded randomness lines up.
    const T: BaseTextures = {
      tatami: tatamiTexture(),
      plaster: plasterTexture(),
      wood: woodTexture(),
      darkWood: darkWoodTexture(),
      washi: washiTexture(),
      lattice: latticeTexture(),
      seigaiha: seigaihaTexture(),
    };
    const fam = opts.serifFamily;
    const st = opts.sceneText;
    const scrollTex = scrollTexture(st.scroll, fam);
    const lanternTex = lanternTexture(st.lantern, fam);
    const screenTex = screenTexture(st.terminal);

    const k = (this.kit = new Kit(this.scene, T, { clack: () => ev.emit("sound", "clack") }));
    this.buildLights();
    buildRoom(k);
    buildShoji(k);
    buildTokonoma(k, scrollTex);
    buildDesk(k, screenTex);
    buildTansu(k);
    buildGalleryWall(k, opts.galleryWall);
    buildShelf(k);
    buildLanterns(k, lanternTex);
    this.ren = buildRen(k);
    buildSky(k);
    buildMountains(k);
    buildDistant(k);
    buildRoof(k);
    buildFoundation(k);
    buildGarden(k);
    buildSakura(k);
    buildSakura(k, 6.4, 2.6, 0.85);
    buildPetals(k);
    this.fx = buildFx(k, r.getPixelRatio());
    this.doors = buildEntryDoors(k);
    r.shadowMap.needsUpdate = true;
    // Compile every shader program up front (in parallel where KHR_parallel_shader_compile exists) so the
    // first view of the garden doesn't stall the main thread mid-sequence.
    this.ready = r.compileAsync(this.scene, this.camera).catch(() => undefined);

    this.picker = new Picker(canvas, this.camera, k.interactive);
    this.bindInput();
    this.resize();
    this.rig.snapToDoor();
    this.loop();
  }

  // ---------------------------------------------------------------- public API

  /** Fly the camera to a section's object, or back home with null. */
  focus(key: SectionKey | null) {
    this.focused = key;
    this.rig.focus(key);
  }

  /** Slide the entry shoji open, pull the camera back, then Ren greets. */
  openDoors() {
    const rm = !!this.opts.reducedMotion;
    this.doors.open(rm);
    this.events.emit("sound", "doors");
    if (rm) {
      this.rig.flyHome(0);
      this.later(() => this.greet(), 600);
      return;
    }
    this.later(() => this.rig.flyHome(3600), 700);
    this.later(() => this.greet(), 4300);
  }

  /** Pet Ren: hop + chime, then ask the UI for a line. */
  petRen() {
    this.ren.hop();
    this.events.emit("sound", "chime");
    this.later(() => this.events.emit("renSay", "pet"), 250);
  }

  /** Ren's talking animation (driven by the voice start/end). */
  setRenTalking(on: boolean) {
    this.ren.setTalking(on);
  }

  /** The room is language-independent; kept for API symmetry and future painted text. */
  setLanguage(lang: string) {
    this.lang = lang;
  }

  /** Hover coming from a DOM hotspot (mouseenter/leave). */
  setHovered(key: SectionKey | null) {
    this.hovered = key ? (this.kit.interactive.find((i) => i.key === key) ?? null) : null;
  }

  /** DOM elements the engine positions every frame. */
  attachOverlay(o: { hotspots?: Map<SectionKey, HTMLElement>; bubble?: HTMLElement | null }) {
    if (o.hotspots) this.hotspots = o.hotspots;
    if (o.bubble !== undefined) this.bubble = o.bubble;
    this.kit.interactive.forEach((it) => (it.el = this.hotspots.get(it.key)));
  }

  /** Renderer counters (for perf/leak checks). */
  stats() {
    const { memory, render, programs } = this.renderer.info;
    return {
      ...memory,
      programs: programs?.length ?? 0,
      calls: render.calls,
      triangles: render.triangles,
      pixelRatio: this.renderer.getPixelRatio(),
    };
  }

  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    this.timers.forEach(clearTimeout);
    this.disposers.forEach((d) => d());
    this.events.clear();
    disposeScene(this.scene);
    this.renderer.dispose();
  }

  // ---------------------------------------------------------------- internals

  private greet() {
    this.ren.hop();
    this.events.emit("renSay", "hello");
    this.events.emit("doorsOpened");
  }

  private later(fn: () => void, ms: number) {
    this.timers.push(setTimeout(fn, ms));
  }

  private buildLights() {
    const s = this.scene;
    s.add(new THREE.HemisphereLight(0x5a6aa8, 0x2a1a10, legacyIntensity(0.4) * INDIRECT_COMPENSATION));
    s.add(new THREE.AmbientLight(0x3a3050, legacyIntensity(0.22) * INDIRECT_COMPENSATION));
    const moonL = new THREE.DirectionalLight(0xaebcff, legacyIntensity(0.9));
    moonL.position.set(-2.5, 6, -9);
    moonL.target.position.set(0.3, 0, 0);
    moonL.castShadow = true;
    moonL.shadow.mapSize.set(2048, 2048);
    const c = moonL.shadow.camera;
    c.left = -7;
    c.right = 7;
    c.top = 7;
    c.bottom = -7;
    c.near = 1;
    c.far = 25;
    moonL.shadow.bias = -0.0008;
    moonL.shadow.radius = 1;
    s.add(moonL, moonL.target);
  }

  private bindInput() {
    const on = <K extends keyof WindowEventMap>(t: EventTarget, type: K, fn: (e: WindowEventMap[K]) => void) => {
      t.addEventListener(type, fn as EventListener);
      this.disposers.push(() => t.removeEventListener(type, fn as EventListener));
    };
    on(window, "pointermove", (e) =>
      this.rig.pointer.set((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1),
    );
    on(this.canvas, "pointermove", (e) => {
      if (e.pointerType !== "mouse") return;
      const it = this.picker.pick(e.clientX, e.clientY);
      if (it !== this.hovered) {
        this.hovered = it;
        this.events.emit("hover", it?.key ?? null);
      }
    });
    on(this.canvas, "click", (e) => {
      const it = this.picker.pick(e.clientX, e.clientY);
      if (it) this.events.emit("select", it.key);
      else if (this.focused && window.innerWidth > WIDE) this.events.emit("miss");
    });
    on(window, "resize", () => this.resize());
  }

  private resize() {
    const w = window.innerWidth,
      h = window.innerHeight;
    this.renderer.setSize(w, h, false);
    this.rig.onResize();
  }

  private last = performance.now();
  private start = this.last;
  private perf = { n: 0, sum: 0 };

  private loop = () => {
    this.raf = requestAnimationFrame(this.loop);
    const now = performance.now();
    const raw = (now - this.last) / 1000;
    this.last = now;
    if (document.hidden) return; // paused while the tab is hidden
    const dt = Math.min(raw, 0.05),
      t = (now - this.start) / 1000;
    this.adaptPixelRatio(dt);
    this.rig.update(dt);
    for (const f of this.kit.frames) f(t, dt);
    this.updateInteractive(dt);
    this.ren.update(t, dt, this.rig.pointer, this.hovered?.key === "ren");
    this.positionBubble();
    this.renderer.render(this.scene, this.camera);
  };

  /** Drop the pixel ratio by .5 when the 120-frame average is under ~42 fps. */
  private adaptPixelRatio(dt: number) {
    const p = this.perf;
    p.n++;
    p.sum += dt;
    if (p.n < 120) return;
    const avg = p.sum / 120;
    const pr = this.renderer.getPixelRatio();
    if (avg > 1 / 42 && pr > 1) {
      this.renderer.setPixelRatio(Math.max(1, pr - 0.5));
      this.fx.materials.forEach((m) => (m.uniforms.pr.value = this.renderer.getPixelRatio()));
      this.resize();
    }
    p.n = 0;
    p.sum = 0;
  }

  private glowColor = new THREE.Color(0xffd9a0);

  private updateInteractive(dt: number) {
    const w = window.innerWidth,
      h = window.innerHeight;
    for (const it of this.kit.interactive) {
      const target = this.hovered === it ? 1 : 0;
      it.glow += (target - it.glow) * Math.min(1, dt * 8);
      const q = Math.round(it.glow * 50);
      if (it.lastGlow !== q) {
        it.lastGlow = q;
        it.group.traverse((o) => {
          const m = o as THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>;
          if (m.isMesh && o.userData.baseEm) {
            m.material.emissive.copy(o.userData.baseEm as THREE.Color).lerp(this.glowColor, it.glow * 0.35);
            m.material.emissiveIntensity = Math.max(
              o.userData.baseEI as number,
              it.glow * 0.6 + (o.userData.baseEI as number),
            );
          }
        });
      }
      const el = it.el;
      if (el) {
        el.classList.toggle("hover", this.hovered === it);
        this.tmp.copy(it.anchor).project(this.camera);
        const vis = this.tmp.z < 1 && Math.abs(this.tmp.x) < 1.1 && Math.abs(this.tmp.y) < 1.1;
        el.style.display = vis ? "" : "none";
        el.style.transform = `translate(${(this.tmp.x * 0.5 + 0.5) * w}px,${(-this.tmp.y * 0.5 + 0.5) * h}px) translate(-50%,-100%)`;
      }
    }
  }

  /** Pin the speech bubble above Ren's head (docked bottom-left via CSS while a panel is open). */
  private positionBubble() {
    const b = this.bubble;
    if (!b || this.focused) return;
    this.tmp.set(1.05, 1.12 + this.ren.hopLift * 0.22, 0.95).project(this.camera);
    b.style.left = (this.tmp.x * 0.5 + 0.5) * window.innerWidth + "px";
    b.style.top = (-this.tmp.y * 0.5 + 0.5) * window.innerHeight + "px";
  }
}

/** Dispose every geometry, material and texture reachable from the scene. */
function disposeScene(scene: THREE.Scene) {
  const textures = new Set<THREE.Texture>();
  const materials = new Set<THREE.Material>();
  const geometries = new Set<THREE.BufferGeometry>();
  const collectTextures = (m: THREE.Material) => {
    for (const v of Object.values(m)) if (v instanceof THREE.Texture) textures.add(v);
    const u = (m as THREE.ShaderMaterial).uniforms;
    if (u) for (const { value } of Object.values(u)) if (value instanceof THREE.Texture) textures.add(value);
  };
  scene.traverse((o) => {
    const m = o as THREE.Mesh & { customDepthMaterial?: THREE.Material };
    if (m.geometry) geometries.add(m.geometry);
    const mats = m.material ? (Array.isArray(m.material) ? m.material : [m.material]) : [];
    if (m.customDepthMaterial) mats.push(m.customDepthMaterial);
    mats.forEach((mat) => {
      materials.add(mat);
      collectTextures(mat);
    });
    if ((o as THREE.InstancedMesh).isInstancedMesh) (o as THREE.InstancedMesh).dispose();
  });
  geometries.forEach((g) => g.dispose());
  materials.forEach((m) => m.dispose());
  textures.forEach((t) => t.dispose());
  scene.clear();
}
