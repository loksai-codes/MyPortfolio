"use client";
import { Fragment } from "react";
import { LANGS, ui, type Lang } from "@/content";
import { audio } from "@/audio/client";
import { useApp } from "@/store/useApp";
import { useT } from "./hooks";

const LABEL: Record<Lang, string> = { en: "EN", ja: "日本語" };

/** EN | 日本語 switch (used in the top bar and on the intro screen). */
export function LanguageToggle({ as: Tag = "div" }: { as?: "div" | "span" }) {
  const lang = useApp((s) => s.lang);
  const setLang = useApp((s) => s.setLang);
  const t = useT();
  return (
    <Tag className="lang" role="group" aria-label={t(ui.aLanguage)}>
      {LANGS.map((l, i) => (
        <Fragment key={l}>
          {i > 0 && <i />}
          <button
            type="button"
            lang={l}
            className={lang === l ? "on" : undefined}
            aria-pressed={lang === l}
            onClick={() => {
              if (l === lang) return;
              setLang(l);
              audio.tick();
            }}
          >
            {LABEL[l]}
          </button>
        </Fragment>
      ))}
    </Tag>
  );
}
