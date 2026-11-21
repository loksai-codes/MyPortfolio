"use client";
import { useEffect, useState } from "react";
import { ui } from "@/content";
import { useApp } from "@/store/useApp";
import { bridge } from "./bridge";
import { useT } from "./hooks";
import { useRenSpeech } from "./renSpeech";

/**
 * Ren's speech bubble. Floats above Ren (engine positions it) or docks bottom-left while a panel is open.
 * Doubles as a polite live region so screen readers hear Ren too.
 */
export function RenBubble() {
  const { text, until, id } = useRenSpeech();
  const docked = useApp((s) => s.section !== null);
  const t = useT();
  // Bubble is visible from a new line until its deadline; only the timer callback sets state.
  const [hiddenId, setHiddenId] = useState(0);
  const show = until > 0 && hiddenId !== id;

  useEffect(() => {
    if (!until) return;
    const h = setTimeout(() => setHiddenId(id), Math.max(0, until - performance.now()));
    return () => clearTimeout(h);
  }, [until, id]);

  return (
    <div
      id="bubble"
      role="status"
      aria-live="polite"
      data-badge={t(ui.renBadge)}
      className={[show && "show", docked && "dock"].filter(Boolean).join(" ") || undefined}
      ref={(el) => {
        bridge.bubble = el;
        bridge.engine?.attachOverlay({ bubble: el });
      }}
    >
      {text}
    </div>
  );
}
