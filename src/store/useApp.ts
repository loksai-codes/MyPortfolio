"use client";
import { create } from "zustand";
import type { GalleryTabKey, Lang, SectionKey } from "@/content";

export type WebGLState = "pending" | "ok" | "fail";

interface AppState {
  lang: Lang;
  section: SectionKey | null;
  /** Last opened section: its content stays rendered while the scroll rolls up. */
  lastSection: SectionKey | null;
  /** Any panel opened yet (the hint never returns after that). */
  everOpened: boolean;
  /** Intro dismissed and the room is visible (drives `body.entered`). */
  entered: boolean;
  soundOn: boolean;
  voiceOn: boolean;
  galleryTab: GalleryTabKey;
  webgl: WebGLState;
  hovering: boolean;
  menuOpen: boolean;
  lightbox: { src: string; caption: string } | null;
  toast: { text: string; id: number } | null;
  setLang: (l: Lang) => void;
  open: (k: SectionKey) => void;
  close: () => void;
  setEntered: () => void;
  setSound: (on: boolean) => void;
  setVoice: (on: boolean) => void;
  setGalleryTab: (t: GalleryTabKey) => void;
  setWebgl: (s: WebGLState) => void;
  setHovering: (h: boolean) => void;
  setMenu: (o: boolean) => void;
  showLightbox: (v: { src: string; caption: string } | null) => void;
  showToast: (text: string) => void;
}

const LANG_KEY = "lp-lang";

export function initialLang(): Lang {
  if (typeof window === "undefined") return "en";
  try {
    const s = localStorage.getItem(LANG_KEY);
    if (s === "ja" || s === "en") return s;
    if ((navigator.language || "").startsWith("ja")) return "ja";
  } catch {
    /* storage blocked */
  }
  return "en";
}

export const useApp = create<AppState>()((set, get) => ({
  lang: "en",
  section: null,
  lastSection: null,
  everOpened: false,
  entered: false,
  soundOn: false,
  voiceOn: true,
  galleryTab: "events",
  webgl: "pending",
  hovering: false,
  menuOpen: false,
  lightbox: null,
  toast: null,
  setLang: (lang) => {
    if (lang === get().lang) return;
    try {
      localStorage.setItem(LANG_KEY, lang);
    } catch {
      /* storage blocked */
    }
    set({ lang });
  },
  open: (section) => set({ section, lastSection: section, everOpened: true, menuOpen: false }),
  close: () => set({ section: null }),
  setEntered: () => set({ entered: true }),
  setSound: (soundOn) => set({ soundOn }),
  setVoice: (voiceOn) => set({ voiceOn }),
  setGalleryTab: (galleryTab) => set({ galleryTab }),
  setWebgl: (webgl) => set({ webgl }),
  setHovering: (hovering) => set({ hovering }),
  setMenu: (menuOpen) => set({ menuOpen }),
  showLightbox: (lightbox) => set({ lightbox }),
  showToast: (text) => set({ toast: { text, id: Date.now() } }),
}));
