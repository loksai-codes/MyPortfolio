"use client";
import { REN_SECTION, type SectionKey } from "@/content";
import { useApp } from "@/store/useApp";
import { audio } from "@/audio/client";
import { bridge } from "./bridge";
import { renSay } from "./renSpeech";

let renTimer: ReturnType<typeof setTimeout> | undefined;

/** Open a section panel: focus the camera, play the koto "tok", Ren comments (reference `open()`). */
export function openSection(key: SectionKey) {
  const s = useApp.getState();
  s.open(key);
  audio.tok();
  clearTimeout(renTimer);
  if (key === "ren") bridge.engine?.petRen();
  else {
    const line = REN_SECTION[key];
    if (line) renTimer = setTimeout(() => renSay(line[useApp.getState().lang], 4200), 700);
  }
}

export function closeSection() {
  if (!useApp.getState().section) return;
  useApp.getState().close();
}
