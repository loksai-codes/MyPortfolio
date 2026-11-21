"use client";
import { sections } from "@/content";
import { openSection } from "./actions";
import { bridge } from "./bridge";
import { useT } from "./hooks";

/**
 * Floating labels pinned to the 3D objects. The engine writes their transform every frame
 * (via `bridge.hotspots`), so React renders them once and never re-renders on camera moves.
 */
export function Hotspots() {
  const t = useT();
  return (
    <div id="hotspots" aria-hidden="true">
      {sections.map((s) => (
        <button
          type="button"
          tabIndex={-1}
          key={s.key}
          className="hs"
          data-key={s.key}
          style={{ display: "none" }}
          ref={(el) => {
            if (el) bridge.hotspots.set(s.key, el);
            else bridge.hotspots.delete(s.key);
          }}
          onClick={() => openSection(s.key)}
          onMouseEnter={() => bridge.engine?.setHovered(s.key)}
          onMouseLeave={() => bridge.engine?.setHovered(null)}
        >
          <span className="tag">{t(s.tag)}</span>
          <span className="dot" />
        </button>
      ))}
    </div>
  );
}
