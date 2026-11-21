"use client";
import { ui } from "@/content";
import { audio } from "@/audio/client";
import { useApp } from "@/store/useApp";
import { useT } from "./hooks";

/** Koto music on/off with animated equaliser bars. */
export function SoundToggle() {
  const on = useApp((s) => s.soundOn);
  const t = useT();
  return (
    <button
      type="button"
      id="snd"
      className={`snd${on ? " on" : ""}`}
      aria-label={t(ui.aMusic)}
      aria-pressed={on}
      onClick={() => (on ? audio.stop() : audio.start())}
    >
      <span className="bars" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
        <i />
      </span>
      <span className="t">{t(ui.sound)}</span>
    </button>
  );
}
