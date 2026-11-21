"use client";
import { useApp } from "@/store/useApp";
import type { AudioEngine } from "./AudioEngine";

/**
 * Audio facade used by the UI. The AudioEngine module is dynamic-imported on the first `start()`
 * (always inside a user gesture), so no audio code ships in the initial bundle. Until then, and while
 * music is off, every cue is a no-op (same as the reference).
 */
let engine: AudioEngine | null = null;
let loading: Promise<AudioEngine> | null = null;

function load() {
  loading ??= import("./AudioEngine").then((m) => (engine = new m.AudioEngine()));
  return loading;
}

/** Fetch the audio chunk when the browser is idle (creates no AudioContext). */
export function prefetchAudio() {
  const ric = (window as { requestIdleCallback?: (cb: () => void) => void }).requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 1200));
  ric(() => void load());
}

export const audio = {
  /** Must be called from a user gesture. Synchronous once prefetched, so Safari keeps the activation. */
  start() {
    const go = (e: AudioEngine) => {
      if (e.start()) useApp.getState().setSound(true);
    };
    if (engine) go(engine);
    else void load().then(go);
  },
  stop() {
    engine?.stop();
    useApp.getState().setSound(false);
  },
  duck: (d: boolean) => engine?.duck(d),
  tok: () => engine?.tok(),
  tick: () => engine?.tick(),
  chime: () => engine?.chime(),
  clack: () => engine?.clack(),
  doors: () => engine?.doors(),
};
