"use client";
import { useEffect, useRef } from "react";
import { startIntroScene, type Moon } from "./introScene";

/** Mounts the 2D moonlit-garden painter; reports the moon position so the ensō can circle it. */
export function IntroCanvas({ onMoon }: { onMoon: (m: Moon) => void }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    return startIntroScene(ref.current, onMoon, still);
  }, [onMoon]);
  return <canvas id="introCv" ref={ref} aria-hidden="true" />;
}
