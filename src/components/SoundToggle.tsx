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
      {/* speaker icon stands in for the text label on narrow screens */}
      <svg className="ico" viewBox="0 0 16 16" aria-hidden="true">
        <path d="M2 6h3l4-3v10l-4-3H2z" fill="currentColor" />
        <path d="M11.5 5.5a3.5 3.5 0 0 1 0 5" fill="none" stroke="currentColor" strokeWidth="1.3" />
      </svg>
      <span className="t">{t(ui.sound)}</span>
    </button>
  );
}
