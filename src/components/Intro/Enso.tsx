import type { Moon } from "./introScene";

/** Brush-stroke ensō drawn around the moon (stroke-dash animation in intro.css). */
export function Enso({ moon }: { moon: Moon | null }) {
  const d = moon ? moon.r * 2.75 : 0;
  const style = moon ? { left: moon.x - d / 2, top: moon.y - d / 2, width: d, height: d } : { visibility: "hidden" as const };
  return (
    <svg id="ensoSvg" viewBox="0 0 200 200" style={style} aria-hidden="true">
      <defs>
        <filter id="brush" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves={2} seed={3} />
          <feDisplacementMap in="SourceGraphic" scale={2.2} />
        </filter>
      </defs>
      <path
        pathLength={1}
        d="M108 14 C 160 18, 190 62, 186 106 C 182 154, 138 188, 94 184 C 46 180, 12 140, 16 94 C 20 58, 44 28, 82 18"
        fill="none"
        stroke="#f2e8d5"
        strokeWidth={4.5}
        strokeLinecap="round"
        filter="url(#brush)"
        opacity={0.9}
      />
    </svg>
  );
}
