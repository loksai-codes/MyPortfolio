"use client";
import type { PanelHead } from "@/content";
import { useT } from "../hooks";

/** Kicker, title, subtitle and the red rule shared by every panel. */
export function PanelHeader({ head }: { head: PanelHead }) {
  const t = useT();
  return (
    <>
      <div className="p-kicker">{t(head.kicker)}</div>
      <h2 className="p-title" id="panel-title">
        {t(head.title)}
      </h2>
      <div className="p-sub">{t(head.sub)}</div>
      <div className="rule" />
    </>
  );
}
