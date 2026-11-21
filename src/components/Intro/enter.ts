"use client";
import { audio } from "@/audio/client";
import { useApp } from "@/store/useApp";
import { bridge } from "../bridge";
import { readHash } from "../deepLink";
import { openSection } from "../actions";

let entered = false;
let doorsQueued = false;

/** Called by the engine bridge once the 3D scene exists (opens queued doors). */
export function onEngineReady() {
  if (doorsQueued) {
    doorsQueued = false;
    bridge.engine?.openDoors();
  }
}

const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Leave the intro (reference `enter()`): fade/scale the intro out, open the doors at 0.9 s,
 * remove the intro at 2.4 s and reveal the overlay at 2.6 s. Reduced motion collapses the waits.
 */
export function enter(withSound: boolean) {
  if (entered) return;
  entered = true;
  if (withSound) audio.start();
  window.dispatchEvent(new Event("intro:leave"));
  const rm = reducedMotion();
  const [tDoors, tGone, tEntered] = rm ? [0, 50, 60] : [900, 2400, 2600];
  setTimeout(() => {
    if (bridge.engine) bridge.engine.openDoors();
    else doorsQueued = true;
  }, tDoors);
  setTimeout(() => window.dispatchEvent(new Event("intro:gone")), tGone);
  setTimeout(() => {
    useApp.getState().setEntered();
    const key = readHash();
    if (key) setTimeout(() => openSection(key), rm ? 0 : 600);
  }, tEntered);
}
