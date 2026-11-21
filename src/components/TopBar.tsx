"use client";
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
  const t = useT();
  const other = lang === "en" ? "ja" : "en";
  return (
    <header id="bar">
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
        <button type="button" id="menuBtn" aria-label={t(ui.aMenu)} aria-expanded={menuOpen} aria-controls="nav" onClick={() => setMenu(!menuOpen)}>
          ☰
        </button>
      </div>
    </header>
  );
}
