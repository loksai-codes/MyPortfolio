"use client";
import type { SectionKey } from "@/content";
import type { Engine } from "@/engine/Engine";

/**
 * Module-level handles shared between the React overlay and the imperative engine.
 * React components only call Engine methods; they never see Three.js objects.
 */
export const bridge: {
  engine: Engine | null;
  hotspots: Map<SectionKey, HTMLElement>;
  bubble: HTMLElement | null;
} = {
  engine: null,
  hotspots: new Map(),
  bubble: null,
};
