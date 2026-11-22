import type { L10n } from "./types";

/** UI strings (formerly `T`). */
export const ui = {
  brandSub: { en: "DEVREL · FDE · SDE", ja: "デブレル · FDE · SDE" },
  heroKicker: { en: "WELCOME TO MY ROOM", ja: "ようこそ、わたしの部屋へ" },
  introKicker: { en: "今宵、ようこそ — WELCOME, TONIGHT", ja: "今宵、ようこそ — WELCOME, TONIGHT" },
  introTop: { en: "月夜 · LOKSAI PALYAM", ja: "月夜 · LOKSAI PALYAM" },
  introBot: { en: "♪ KOTO · BEST WITH SOUND", ja: "♪ 箏の音とともにどうぞ" },
  heroLine: {
    en: "AI backends, knowledge graphs and the stories that explain them. Pull up a cushion — pick anything in the room.",
    ja: "AIバックエンド、ナレッジグラフ、そしてそれを伝える物語。座布団にどうぞ — 部屋の物を選んでください。",
  },
  hint: { en: "Pick an object in the room to explore", ja: "部屋の物を選んで探索" },
  introTitle: { en: "Welcome to Loksai's room", ja: "ロクサイの部屋へようこそ" },
  introSub: {
    en: "A small washitsu of projects, paths and one purple companion",
    ja: "作品と道と、紫の相棒がいる小さな和室",
  },
  vertical: { en: "一期一会 ・ 和の部屋", ja: "一期一会 ・ 和の部屋" },
  enterSound: { en: "ENTER · 入る", ja: "入る · ENTER" },
  enterQuiet: { en: "IN SILENCE", ja: "音なしで" },
  loading: { en: "Lighting the lanterns…", ja: "提灯に火を灯しています…" },
  loadFail: { en: "3D couldn't load — the menu still works.", ja: "3Dを読み込めませんでした。メニューは使えます。" },
  copied: { en: "Email copied", ja: "メールをコピーしました" },
  copy: { en: "Copy email", ja: "メールをコピー" },
  petRen: { en: "Pet Ren", ja: "レンをなでる" },
  close: { en: "Close", ja: "閉じる" },
  closeImage: { en: "Close image", ja: "画像を閉じる" },
  voiceOn: { en: "Ren's voice: on", ja: "レンの声：オン" },
  voiceOff: { en: "Ren's voice: off", ja: "レンの声：オフ" },
  voiceTest: { en: "Can you hear me now?", ja: "ぼくの声、聞こえる？" },
  liveDemo: { en: "Live demo", ja: "ライブデモ" },
  sound: { en: "SOUND", ja: "音" },
  // accessibility labels
  // starts with the visible label ("SOUND" / "音") so voice control can target it (WCAG 2.5.3)
  aMusic: { en: "Sound: koto music", ja: "音：箏の音楽" },
  aMenu: { en: "Menu", ja: "メニュー" },
  aSections: { en: "Sections", ja: "セクション" },
  aLanguage: { en: "Language", ja: "言語" },
  aScene: { en: "3D Japanese room", ja: "3Dの和室" },
  aSkip: { en: "Skip to content", ja: "本文へスキップ" },
  aImage: { en: "Enlarged image", ja: "拡大画像" },
  renBadge: { en: "レン", ja: "レン" },
  // fallback (no JS / no WebGL)
  fallbackNote: {
    en: "This is the text version of the room. Enable JavaScript and WebGL to step inside the 3D washitsu.",
    ja: "こちらは部屋のテキスト版です。3Dの和室に入るには JavaScript と WebGL を有効にしてください。",
  },
} satisfies Record<string, L10n>;

export type UIKey = keyof typeof ui;
