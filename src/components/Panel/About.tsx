"use client";
import Image from "next/image";
import { about, profile } from "@/content";
import { useT } from "../hooks";
import { PanelHeader } from "./PanelHeader";

export function About() {
  const t = useT();
  return (
    <>
      <PanelHeader head={about} />
      <div className="portrait">
        <Image src={profile.portrait} alt={profile.name} width={224} height={224} sizes="112px" priority={false} />
        <div className="meta">
          <b>{profile.name}</b>
          {t(about.now)}
          <br />
          {t(about.edu)}
        </div>
      </div>
      <p>{t(about.intro)}</p>
      <h3>{t(about.pathsHeading)}</h3>
      <div className="paths">
        {about.paths.map((p) => (
          <div className="path" key={p.abbr}>
            <div className="kj" aria-hidden="true">
              {p.kanji}
            </div>
            <div className="ab">{p.abbr}</div>
            <div className="nm">{t(p.name)}</div>
            <p>{t(p.text)}</p>
          </div>
        ))}
      </div>
    </>
  );
}
