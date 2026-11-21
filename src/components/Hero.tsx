"use client";
import { Fragment } from "react";
import { profile, ui } from "@/content";
import { useApp } from "@/store/useApp";
import { useT } from "./hooks";

export function Roles() {
  return (
    <>
      {profile.roles.map((r, i) => (
        <Fragment key={r}>
          {i > 0 && <i>·</i>}
          {r}
        </Fragment>
      ))}
    </>
  );
}

/** Bottom-left name block, bottom-right hint and the vertical motto. */
export function Hero() {
  const section = useApp((s) => s.section);
  const everOpened = useApp((s) => s.everOpened);
  const t = useT();
  return (
    <>
      <section id="hero" className={section ? "hide" : undefined} aria-label={profile.name}>
        <div className="kicker">{t(ui.heroKicker)}</div>
        <h1>
          {profile.name}
          <span className="jp" lang="ja">
            {profile.nameKana}
          </span>
        </h1>
        <div className="line" />
        <div className="roles">
          <Roles />
        </div>
      </section>
      <div id="hint" className={everOpened ? "hide" : undefined} aria-hidden="true">
        <i />
        <span>{t(ui.hint)}</span>
      </div>
      <div className="vert" aria-hidden="true" lang="ja">
        {t(ui.vertical)}
      </div>
    </>
  );
}
