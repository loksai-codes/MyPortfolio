import * as THREE from "three";

/**
 * Colour/lighting parity with the original three r128 scene.
 *
 * r155+ removed "legacy" lighting. Two differences matter for this scene:
 *  1. Legacy mode multiplied every punctual/ambient/hemisphere irradiance by π.
 *     → all light intensities are passed through `legacyIntensity()` (× π).
 *  2. Point lights used a linear-window falloff `pow(saturate(1 - d/distance), decay)`
 *     instead of inverse-square. The warm lantern pools depend on that shape, so the
 *     falloff function is restored here (one guarded ShaderChunk edit, applied once).
 *
 * Colour management is disabled so hex colours stay linear, exactly as r128 treated them.
 */
let installed = false;

export function installLegacyLighting(): void {
  if (installed) return;
  installed = true;
  THREE.ColorManagement.enabled = false;
  const chunk = THREE.ShaderChunk.lights_pars_begin;
  const start = chunk.indexOf("float getDistanceAttenuation(");
  const end = chunk.indexOf("float getSpotAttenuation(");
  if (start < 0 || end < 0) {
    console.warn("[engine] getDistanceAttenuation not found — point-light falloff uses the modern curve");
    return;
  }
  const legacy = `float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	if ( cutoffDistance > 0.0 && decayExponent > 0.0 ) {
		return pow( saturate( - lightDistance / cutoffDistance + 1.0 ), decayExponent );
	}
	return 1.0;
}

`;
  THREE.ShaderChunk.lights_pars_begin = chunk.slice(0, start) + legacy + chunk.slice(end);
}

/** r128 legacy intensity → physically-based intensity. */
export const legacyIntensity = (i: number): number => i * Math.PI;

/**
 * Hemisphere + ambient ("indirect diffuse") render ~6% darker in r187 than in r128 at equal intensity.
 * Measured against the reference screenshots (6-frame averages): ×1.06 brings every view within 0.5 luminance.
 */
export const INDIRECT_COMPENSATION = 1.06;
