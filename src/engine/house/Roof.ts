import * as THREE from "three";
import type { Kit } from "../core/Kit";
import { roofTileTexture } from "../textures/roofTile";

type Face = "f" | "b" | "l" | "r";

/** Hip-and-gable irimoya roof with curved eaves, fascia tubes, ridges, onigawara and rafters. */
export function buildRoof(k: Kit): void {
  const { M, box, mesh, scene, std } = k;
  const tile = roofTileTexture();
  const tm = std({ map: tile, roughness: 0.62, metalness: 0.05, side: THREE.DoubleSide });
  const EX = 4.4,
    EZ = 3.95,
    EY = 2.82,
    RX = 2.3,
    RY = 4.55,
    UP = 0.32,
    SAG = 0.16;
  /** u 0..1 across, v 0..1 eave→ridge */
  function P(u: number, v: number, face: Face): THREE.Vector3 {
    let x: number, z: number;
    const ex = -EX + 2 * EX * u;
    if (face === "f" || face === "b") {
      x = ex + (-RX + 2 * RX * u - ex) * v;
      z = (face === "f" ? EZ : -EZ) * (1 - v);
    } else {
      const sgn = face === "l" ? -1 : 1;
      const ez = -EZ + 2 * EZ * u;
      z = ez * (1 - v);
      x = sgn * (EX + (RX - EX) * v);
    }
    const edge = Math.pow(Math.abs(2 * u - 1), 5) * Math.pow(1 - v, 2);
    const y = EY + (RY - EY) * v - Math.sin(Math.PI * v) * SAG + UP * edge;
    return new THREE.Vector3(x, y, z);
  }
  const faces: Face[] = ["f", "b", "l", "r"];
  const G = new THREE.Group();
  scene.add(G);
  const lining = std({ color: 0xd8d0bc, roughness: 0.9 });
  faces.forEach((f) => {
    const g = new THREE.BufferGeometry(),
      v: number[] = [],
      uv: number[] = [],
      ix: number[] = [];
    const NU = 24,
      NV = 10;
    for (let j = 0; j <= NV; j++)
      for (let i = 0; i <= NU; i++) {
        const p = P(i / NU, j / NV, f);
        v.push(p.x, p.y, p.z);
        const len = f === "f" || f === "b" ? 2 * EX : 2 * EZ;
        uv.push((i / NU) * len * 1.4 * (1 - (j / NV) * 0.45), (j / NV) * 3.2);
      }
    for (let j = 0; j < NV; j++)
      for (let i = 0; i < NU; i++) {
        const a = j * (NU + 1) + i;
        ix.push(a, a + 1, a + NU + 1, a + 1, a + NU + 2, a + NU + 1);
      }
    g.setAttribute("position", new THREE.Float32BufferAttribute(v, 3));
    g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
    g.setIndex(ix);
    g.computeVertexNormals();
    const m = new THREE.Mesh(g, tm);
    m.castShadow = true;
    m.receiveShadow = true;
    G.add(m);
    // eave fascia
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 24; i++) pts.push(P(i / 24, 0, f).add(new THREE.Vector3(0, -0.04, 0)));
    G.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 48, 0.07, 6), M.dark));
    // white eave lining (plaster strip under tiles)
    const pts2 = pts.map((p) => p.clone().add(new THREE.Vector3(0, 0.07, 0)));
    G.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts2), 48, 0.03, 5), lining));
  });
  // hip ridges + main ridge
  const rm = std({ color: 0x22252d, roughness: 0.5, metalness: 0.2 });
  (
    [
      [0, "f"],
      [1, "f"],
      [0, "b"],
      [1, "b"],
    ] as const
  ).forEach(([u, f]) => {
    const pts: THREE.Vector3[] = [];
    for (let j = 0; j <= 10; j++) pts.push(P(u, j / 10, f).add(new THREE.Vector3(0, 0.06, 0)));
    G.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 24, 0.085, 8), rm));
  });
  const rg = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 2 * RX + 0.2, 12), rm);
  rg.rotation.z = Math.PI / 2;
  rg.position.set(0, RY + 0.08, 0);
  G.add(rg);
  box(2 * RX + 0.1, 0.12, 0.18, rm, 0, RY + 0.2, 0, G);
  [-1, 1].forEach((d) => {
    const og = new THREE.Group();
    og.position.set(d * (RX + 0.1), RY + 0.18, 0);
    G.add(og);
    box(0.14, 0.42, 0.34, rm, 0, 0.1, 0, og);
    const c = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.05, 6, 12, Math.PI), rm);
    c.position.y = 0.3;
    c.rotation.y = Math.PI / 2;
    og.add(c);
  });
  // rafters under the front eave
  const rf = new THREE.InstancedMesh(new THREE.BoxGeometry(0.05, 0.06, 1.4), M.dark, 40);
  const dd = new THREE.Object3D();
  for (let i = 0; i < 40; i++) {
    const x = -4.1 + (i * 8.2) / 39;
    dd.position.set(x, 2.78, 3.25);
    dd.rotation.x = -0.36;
    dd.updateMatrix();
    rf.setMatrixAt(i, dd.matrix);
  }
  G.add(rf);
  // underside soffit
  const soMat = M.dark.clone();
  soMat.side = THREE.DoubleSide;
  const so = mesh(new THREE.PlaneGeometry(8.8, 1.5), soMat, 0, 2.76, 3.25, G, false);
  so.rotation.x = Math.PI / 2 - 0.36;
}
