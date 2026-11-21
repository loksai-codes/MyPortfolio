import type { L10n, SectionKey } from "./types";

export interface SectionMeta {
  key: SectionKey;
  label: L10n;
  /** Vertical kanji on the panel spine. */
  kanji: string;
  /** Label of the hotspot floating over the 3D object. */
  tag: L10n;
}

/** Nav order = this order. */
export const sections: readonly SectionMeta[] = [
  {
    key: "about",
    label: { en: "About", ja: "自己紹介" },
    kanji: "掛軸",
    tag: { en: "Scroll · About", ja: "掛け軸 · 自己紹介" },
  },
  {
    key: "projects",
    label: { en: "Projects", ja: "作品" },
    kanji: "作品",
    tag: { en: "Desk · Projects", ja: "机 · 作品" },
  },
  {
    key: "experience",
    label: { en: "Experience", ja: "経歴" },
    kanji: "経歴",
    tag: { en: "Tansu · Experience", ja: "箪笥 · 経歴" },
  },
  {
    key: "skills",
    label: { en: "Skills", ja: "技術" },
    kanji: "技術",
    tag: { en: "Lantern · Skills", ja: "提灯 · 技術" },
  },
  {
    key: "quests",
    label: { en: "Side Quests", ja: "趣味" },
    kanji: "趣味",
    tag: { en: "Shelf · Side Quests", ja: "棚 · 趣味" },
  },
  {
    key: "gallery",
    label: { en: "Gallery", ja: "写真" },
    kanji: "写真",
    tag: { en: "Frames · Gallery & Events", ja: "額 · 写真・イベント" },
  },
  {
    key: "contact",
    label: { en: "Contact", ja: "連絡先" },
    kanji: "連絡",
    tag: { en: "Shoji · Contact", ja: "障子 · 連絡先" },
  },
  { key: "ren", label: { en: "Ren", ja: "レン" }, kanji: "蓮", tag: { en: "Ren", ja: "レン" } },
];

export const sectionMeta = (key: SectionKey): SectionMeta => sections.find((s) => s.key === key)!;
