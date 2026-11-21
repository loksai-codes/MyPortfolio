"use client";
import { quests } from "@/content";
import { useT } from "../hooks";
import { PanelHeader } from "./PanelHeader";

export function Quests() {
  const t = useT();
  return (
    <>
      <PanelHeader head={quests} />
      <div className="quests">
        {quests.list.map((q) => (
          <div className="quest" key={q.kanji}>
            <div className="qk" aria-hidden="true">
              {q.kanji}
            </div>
            <div>
              <div className="qt">{t(q.title)}</div>
              <p>{t(q.text)}</p>
              <div className="qlv" aria-hidden="true">
                <i className="on" />
                <i className="on" />
                <i className="on" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
