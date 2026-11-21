import type { L10n, L10nList, PanelHead, SectionKey } from "./types";

export const renPanel: PanelHead & { text: L10n; portraitName: string } = {
  kicker: { en: "相棒 · COMPANION", ja: "COMPANION · 相棒" },
  title: { en: "Meet Ren", ja: "レンです" },
  sub: { en: "Keeper of the lanterns", ja: "提灯の番人" },
  portraitName: "Ren · レン",
  text: {
    en: "Ren is my pet and the room's keeper. He keeps the lanterns lit while I code, and his antennae glow brighter when he's curious. He also knows where everything is, so ask him.",
    ja: "レンはぼくのペットで、この部屋の番人。コードを書いている間、提灯の灯りを守ってくれます。興味があると触角がもっと明るく光ります。部屋のことは何でも知っているので、聞いてみてね。",
  },
};

/** Said once after the doors open. */
export const REN_HELLO: L10n = {
  en: "Hi! I'm Ren. Welcome to Loksai's room! Click anything to explore.",
  ja: "こんにちは！レンだよ。ロクサイの部屋へようこそ！なんでもクリックしてみてね。",
};

/** Cycled when Ren is petted. */
export const REN_LINES: L10nList = {
  en: [
    "Hi! I'm Ren!",
    "The projects are on the laptop~",
    "Psst… try 日本語!",
    "The tea's still warm.",
    "Graphs everywhere!",
    "Loksai says hi from the desk.",
    "I keep the lanterns lit ✨",
    "Click the scroll to learn about him!",
  ],
  ja: [
    "こんにちは！レンだよ！",
    "作品はノートパソコンの中だよ〜",
    "ねえ、English も試してみて！",
    "お茶はまだあたたかいよ。",
    "どこもかしこもグラフ！",
    "ロクサイは机にいるよ。",
    "提灯はぼくが守ってる ✨",
    "掛け軸をクリックしてみて！",
  ],
};

/** Said ~0.7 s after a panel opens. */
export const REN_SECTION: Partial<Record<SectionKey, L10n>> = {
  about: { en: "This is Loksai! He builds AI systems, and loves explaining them.", ja: "こちらがロクサイ！AIシステムを作って、伝えるのが大好きなんだ。" },
  projects: { en: "These are the projects on his laptop. Blind Flange is my favourite!", ja: "ノートパソコンの中の作品だよ。ぼくのお気に入りはブラインドフランジ！" },
  experience: { en: "Here's where he has worked. Virtusa, IRMAI, and Wipro!", ja: "これまでの仕事だよ。Virtusa、IRMAI、そしてWipro！" },
  skills: { en: "The lantern lights up his whole toolbox.", ja: "提灯が道具箱ぜんぶを照らしているよ。" },
  quests: {
    en: "When he isn't coding, he takes photos, writes calligraphy, reads, and plays tennis.",
    ja: "コードを書いていないときは、写真、カリグラフィー、読書、テニスをしているよ。",
  },
  gallery: { en: "He has run more than fifteen events. Look at all these photos!", ja: "イベントを15回以上開いたんだ。写真を見てみて！" },
  contact: { en: "Want to say hello? The shoji is open!", ja: "あいさつしたい？障子は開いているよ！" },
};
