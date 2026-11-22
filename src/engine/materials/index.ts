import * as THREE from "three";
import { backdropFragment, backdropVertex } from "./backdrop.glsl";

/**
 * Studio backdrop dome. `horizonHex` is a display (sRGB) colour because the shader writes its output raw;
 * set it to what the fogged floor actually renders as, so wall and floor meet seamlessly.
 * `spotDir` points at the centre of the soft light pool on the wall.
 */
export const backdropMaterial = (spotDir: THREE.Vector3, horizonHex: number) =>
  new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
    uniforms: {
      sd: { value: spotDir },
      hz: {
        value: new THREE.Vector3(
          ((horizonHex >> 16) & 255) / 255,
          ((horizonHex >> 8) & 255) / 255,
          (horizonHex & 255) / 255,
        ),
      },
    },
    vertexShader: backdropVertex,
    fragmentShader: backdropFragment,
  });
