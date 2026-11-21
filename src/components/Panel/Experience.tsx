"use client";
import { experience } from "@/content";
import { useApp } from "@/store/useApp";
import { useT } from "../hooks";
import { PanelHeader } from "./PanelHeader";

export function ExperiencePanel() {
  const t = useT();
  const lang = useApp((s) => s.lang);
  return (
    <>
      <PanelHeader head={experience} />
      <div className="tl">
        {experience.list.map((e) => (
          <div className="it" key={e.when}>
            <div className="when">{e.when}</div>
            <div className="role">{t(e.role)}</div>
            <div className="co">{e.org}</div>
            <ul>
              {e.bullets[lang].map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <h3>{t(experience.honoursHeading)}</h3>
      <ul className="honours">
        {experience.honours.map((h) => (
          <li key={h.en}>{t(h)}</li>
        ))}
      </ul>
    </>
  );
}
