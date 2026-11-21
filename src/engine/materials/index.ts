import * as THREE from "three";
import { pointsFragment, pointsVertex } from "./points.glsl";
import { skyFragment, skyVertex } from "./sky.glsl";
import { waterFragment, waterVertex } from "./water.glsl";

export const skyMaterial = (moonDir: THREE.Vector3) =>
  new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
    uniforms: { md: { value: moonDir } },
    vertexShader: skyVertex,
    fragmentShader: skyFragment,
  });

export type WaterMaterial = THREE.ShaderMaterial & { uniforms: { t: { value: number } } };

export const waterMaterial = (moon: THREE.Vector3, lights: [THREE.Vector3, THREE.Vector3, THREE.Vector3]) =>
  new THREE.ShaderMaterial({
    transparent: true,
    fog: false,
    uniforms: { t: { value: 0 }, moon: { value: moon }, l1: { value: lights[0] }, l2: { value: lights[1] }, l3: { value: lights[2] } },
    vertexShader: waterVertex,
    fragmentShader: waterFragment,
  }) as WaterMaterial;

export interface PointsOpts {
  color: THREE.ColorRepresentation;
  size: number;
  amp: number;
  speed: number;
  bright: number;
  pixelRatio: number;
}
export type PointsMaterial = THREE.ShaderMaterial & { uniforms: { t: { value: number }; pr: { value: number } } };

export const pointsMaterial = (o: PointsOpts) =>
  new THREE.ShaderMaterial({
    uniforms: {
      t: { value: 0 },
      pr: { value: o.pixelRatio },
      col: { value: new THREE.Color(o.color) },
      sz: { value: o.size },
      amp: { value: o.amp },
      spd: { value: o.speed },
      br: { value: o.bright },
    },
    vertexShader: pointsVertex,
    fragmentShader: pointsFragment,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  }) as PointsMaterial;
