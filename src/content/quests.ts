import type { L10n, PanelHead } from "./types";

export interface Quest {
  kanji: string;
  title: L10n;
  text: L10n;
}

export const quests: PanelHead & { list: Quest[] } = {
  kicker: { en: "趣味 · SIDE QUESTS", ja: "SIDE QUESTS · 趣味" },
  title: { en: "Side quests", ja: "寄り道" },
  sub: { en: "Optional adventures outside the main storyline", ja: "本編の外にある、もうひとつの冒険" },
  list: [
    {
      kanji: "写",
      title: { en: "Fashion portrait photography", ja: "ファッションポートレート写真" },
      text: { en: "Capturing style, light and character in portrait frames.", ja: "ポートレートの中に、スタイルと光と人柄を写す。" },
    },
    {
      kanji: "書",
      title: { en: "Calligraphy", ja: "カリグラフィー" },
      text: { en: "Practising letterforms with ink, rhythm and precision.", ja: "墨とリズムと精度で、文字のかたちを磨く。" },
    },
    {
      kanji: "読",
      title: { en: "Reading", ja: "読書" },
      text: { en: "Exploring ideas across tech, fiction and philosophy.", ja: "テクノロジー、小説、哲学をまたいでアイデアを探す。" },
    },
    {
      kanji: "球",
      title: { en: "Tennis", ja: "テニス" },
      text: { en: "Court sessions for focus, footwork and endurance.", ja: "集中力とフットワークと持久力を鍛えるコート練習。" },
    },
  ],
};
