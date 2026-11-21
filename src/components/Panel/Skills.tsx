"use client";
import { skills } from "@/content";
import { useT } from "../hooks";
import { PanelHeader } from "./PanelHeader";

export function Skills() {
  const t = useT();
  return (
    <>
      <PanelHeader head={skills} />
      {skills.groups.map((g) => (
        <div className="sk" key={g.heading.en}>
          <div className="h">
            <b>{t(g.heading)}</b>
            <span lang="ja" aria-hidden="true">
              {g.kanji}
            </span>
          </div>
          <div className="chips">
            {g.items.map((x) => (
              <span className="chip" key={x}>
                {x}
              </span>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
