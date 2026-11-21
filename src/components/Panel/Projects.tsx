"use client";
import { projects } from "@/content";
import { useT } from "../hooks";
import { PanelHeader } from "./PanelHeader";

export function Projects() {
  const t = useT();
  return (
    <>
      <PanelHeader head={projects} />
      {projects.list.map((p, i) => (
        <article className="card" key={p.name}>
          <div className="num" aria-hidden="true">
            0{i + 1}
          </div>
          <h4>{p.name}</h4>
          <div className="sub">{t(p.sub)}</div>
          <p>{t(p.text)}</p>
          <div className="chips">
            {p.stats.map((x) => (
              <span className="chip stat" key={x.en}>
                {t(x)}
              </span>
            ))}
          </div>
          <div className="chips">
            {p.stack.map((x) => (
              <span className="chip" key={x}>
                {x}
              </span>
            ))}
          </div>
          <div className="links">
            {p.links.map((l, j) => (
              <a key={l.href} className={`btn${j ? " ghost" : ""}`} href={l.href} target="_blank" rel="noopener">
                {t(l.label)} ↗
              </a>
            ))}
          </div>
        </article>
      ))}
    </>
  );
}
