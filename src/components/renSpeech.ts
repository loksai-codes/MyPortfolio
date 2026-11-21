"use client";
import { create } from "zustand";
import { voice } from "@/voice/Voice";
import { useApp } from "@/store/useApp";
import { bridge } from "./bridge";

interface Speech {
  text: string;
  /** performance.now() when the bubble should hide (0 = hidden). */
  until: number;
  id: number;
}

/** Ren's speech-bubble state (separate tiny store so the bubble re-renders alone). */
export const useRenSpeech = create<Speech>()(() => ({ text: "", until: 0, id: 0 }));

/** Show a line in Ren's bubble and speak it (reference `say()`). */
export function renSay(text: string, dur = 3200) {
  const until = performance.now() + Math.max(dur, text.length * 70);
  useRenSpeech.setState((s) => ({ text, until, id: s.id + 1 }));
  const { lang, soundOn } = useApp.getState();
  voice.say(text, lang, {
    musicOn: soundOn,
    start: () => bridge.engine?.setRenTalking(true),
    end: () => {
      bridge.engine?.setRenTalking(false);
      useRenSpeech.setState((s) => ({ until: Math.min(s.until, performance.now() + 900) }));
    },
  });
}
