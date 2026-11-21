"use client";
import { isSectionKey, type SectionKey } from "@/content";

/** `#projects` → "projects" (null when the hash isn't a section). */
export function readHash(): SectionKey | null {
  if (typeof window === "undefined") return null;
  const h = decodeURIComponent(window.location.hash.slice(1));
  return isSectionKey(h) ? h : null;
}

/** Reflect the open section in the URL without adding history entries. */
export function writeHash(key: SectionKey | null) {
  const url = new URL(window.location.href);
  url.hash = key ?? "";
  const next = key ? url.toString() : url.toString().replace(/#$/, "");
  if (next !== window.location.href) history.replaceState(history.state, "", next);
}
