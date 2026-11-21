import * as THREE from "three";
import type { Interactive } from "../core/Kit";

/** Raycasts pointer positions against the registered interactive groups. */
export class Picker {
  private ray = new THREE.Raycaster();
  private ndc = new THREE.Vector2();

  constructor(
    private canvas: HTMLCanvasElement,
    private camera: THREE.Camera,
    private interactive: Interactive[],
  ) {}

  pick(clientX: number, clientY: number): Interactive | null {
    const r = this.canvas.getBoundingClientRect();
    this.ndc.set(((clientX - r.left) / r.width) * 2 - 1, (-(clientY - r.top) / r.height) * 2 + 1);
    this.ray.setFromCamera(this.ndc, this.camera);
    const hits = this.ray.intersectObjects(
      this.interactive.map((i) => i.group),
      true,
    );
    for (const h of hits) {
      let o: THREE.Object3D | null = h.object;
      while (o && !o.userData.key) o = o.parent;
      if (o) return this.interactive.find((i) => i.group === o) ?? null;
    }
    return null;
  }
}
