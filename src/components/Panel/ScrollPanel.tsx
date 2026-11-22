"use client";
import { useEffect, useRef, type ComponentType } from "react";
import { profile, sectionMeta, ui, type SectionKey } from "@/content";
import { useApp } from "@/store/useApp";
import { closeSection } from "../actions";
import { useT } from "../hooks";
import { About } from "./About";
import { Contact } from "./Contact";
import { ExperiencePanel } from "./Experience";
import { Gallery } from "./Gallery";
import { Projects } from "./Projects";
import { Quests } from "./Quests";
import { RenPanel } from "./Ren";
import { Skills } from "./Skills";

const PANELS: Record<SectionKey, ComponentType> = {
  about: About,
  projects: Projects,
  experience: ExperiencePanel,
  skills: Skills,
  quests: Quests,
  gallery: Gallery,
  contact: Contact,
  ren: RenPanel,
};

/** The hanging scroll (kakejiku) side panel. Content of the last section stays while it rolls up. */
export function ScrollPanel() {
  const section = useApp((s) => s.section);
  const last = useApp((s) => s.lastSection);
  const t = useT();
  const body = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const shown = section ?? last;
  const Content = shown ? PANELS[shown] : null;

  useEffect(() => {
    if (!section) return;
    if (body.current) body.current.scrollTop = 0;
    // Move focus into the panel for keyboard / screen-reader users (no scroll jump).
    closeBtn.current?.focus({ preventScroll: true });
  }, [section]);

  return (
    <aside id="panel" aria-labelledby="panel-title" aria-hidden={!section} inert={!section}>
      <div className="scroll">
        <div className="rod" />
        <div className="mount">
          <div className="sheet">
            <div className="spine" aria-hidden="true">
              <div className="vt" id="spineT" lang="ja">
                {shown ? sectionMeta(shown).kanji : ""}
              </div>
              <div className="seal">{profile.seal}</div>
            </div>
            <div className="body" id="pbody" ref={body} key={shown ?? "none"}>
              {Content && <Content />}
            </div>
          </div>
        </div>
        <div className="rod" />
      </div>
      <button type="button" id="close" ref={closeBtn} aria-label={t(ui.close)} onClick={closeSection}>
        <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
          <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.3" />
        </svg>
      </button>
    </aside>
  );
}
