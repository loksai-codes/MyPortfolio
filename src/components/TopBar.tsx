"use client";
import { useEffect, useRef } from "react";
import { profile, sections, ui } from "@/content";
import { useApp } from "@/store/useApp";
import { closeSection, openSection } from "./actions";
import { useT } from "./hooks";
import { LanguageToggle } from "./LanguageToggle";
import { SoundToggle } from "./SoundToggle";

/** Brand seal, section nav (EN label + JA sub-label), language + sound toggles, mobile menu. */
export function TopBar() {
  const lang = useApp((s) => s.lang);
  const section = useApp((s) => s.section);
  const menuOpen = useApp((s) => s.menuOpen);
  const setMenu = useApp((s) => s.setMenu);
  const entered = useApp((s) => s.entered);
  const t = useT();
  const other = lang === "en" ? "ja" : "en";
  const bar = useRef<HTMLElement>(null);
  // The nav wraps below ~1366px, so publish the real bar height for the panel to start under it.
  useEffect(() => {
    const el = bar.current;
    if (!el) return;
    const root = document.documentElement.style;
    const ro = new ResizeObserver(() => root.setProperty("--bar-h", `${el.offsetHeight}px`));
    ro.observe(el);
    return () => {
      ro.disconnect();
      root.removeProperty("--bar-h");
    };
  }, []);
  return (
    <header id="bar" ref={bar} inert={!entered}>
      <a
        className="brand"
        href="#"
        id="home"
        onClick={(e) => {
          e.preventDefault();
          closeSection();
        }}
      >
        <div className="hanko" aria-hidden="true">
          {profile.seal}
        </div>
        <div>
          <b>{profile.name}</b>
          <small>{t(ui.brandSub)}</small>
        </div>
      </a>
      <nav id="nav" aria-label={t(ui.aSections)} className={menuOpen ? "open" : undefined}>
        {sections.map((s) => (
          <button
            type="button"
            key={s.key}
            data-key={s.key}
            className={section === s.key ? "on" : undefined}
            aria-current={section === s.key ? "true" : undefined}
            aria-controls="panel"
            onClick={() => {
              openSection(s.key);
              setMenu(false);
            }}
          >
            {s.label[lang]}
            <span lang={other}>{s.label[other]}</span>
          </button>
        ))}
      </nav>
      <div className="tools">
        <LanguageToggle />
        <SoundToggle />
        <button
          type="button"
          id="menuBtn"
          aria-label={t(ui.aMenu)}
          aria-expanded={menuOpen}
          aria-controls="nav"
          onClick={() => setMenu(!menuOpen)}
        >
          <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
            <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.3" />
          </svg>
        </button>
      </div>
    </header>
  );
}
