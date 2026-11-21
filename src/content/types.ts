export type Lang = "en" | "ja";
export const LANGS: readonly Lang[] = ["en", "ja"] as const;

/** A bilingual string. Every user-facing string in the site is one of these. */
export type L10n = { en: string; ja: string };
/** A bilingual list (e.g. bullet points). */
export type L10nList = { en: string[]; ja: string[] };

export const SECTION_KEYS = [
  "about",
  "projects",
  "experience",
  "skills",
  "quests",
  "gallery",
  "contact",
  "ren",
] as const;
export type SectionKey = (typeof SECTION_KEYS)[number];
export const isSectionKey = (v: unknown): v is SectionKey =>
  typeof v === "string" && (SECTION_KEYS as readonly string[]).includes(v);

/** Header shared by every panel. */
export interface PanelHead {
  kicker: L10n;
  title: L10n;
  sub: L10n;
}

export const t = (v: L10n, lang: Lang): string => v[lang] ?? v.en;
