import type { L10n, PanelHead } from "./types";

export interface Path {
  /** Short label, e.g. "DevRel" (not translated). */
  abbr: string;
  /** Watermark kanji. */
  kanji: string;
  name: L10n;
  text: L10n;
}

export const about: PanelHead & { intro: L10n; now: L10n; edu: L10n; pathsHeading: L10n; paths: Path[] } = {
  kicker: { en: "自己紹介 · ABOUT", ja: "ABOUT · 自己紹介" },
  title: { en: "Hi, I'm Loksai.", ja: "ロクサイです。" },
  sub: { en: "Engineer · Anantapur, India", ja: "エンジニア · インド・アナンタプル" },
  intro: {
    en: "I build AI-powered backends, knowledge graphs and the tooling that makes them understandable. I'm happiest where code meets people: shipping the system, then explaining it so others can build on it.",
    ja: "AIを活用したバックエンド、ナレッジグラフ、そしてそれらを分かりやすくするツールを作っています。いちばん好きなのは、コードと人が出会う場所。システムを作って届け、ほかの人がその上に作れるように伝えることです。",
  },
  now: {
    en: "Associate Engineer — AI & Enterprise Automation, Virtusa (client: Air Liquide)",
    ja: "Virtusa アソシエイトエンジニア（AI・業務自動化／顧客：Air Liquide）",
  },
  edu: {
    en: "B.Tech CSE (Data Science), SRIT Anantapur · 2021–2025",
    ja: "SRIT コンピュータサイエンス工学（データサイエンス）学士 · 2021–2025",
  },
  pathsHeading: { en: "Four paths, one craft", ja: "四つの道、ひとつの技" },
  paths: [
    {
      abbr: "DevRel",
      kanji: "縁",
      name: { en: "Developer Relations", ja: "デベロッパーリレーションズ" },
      text: {
        en: "Conducted 15+ events at college and chaired the SRIT Academic Hub (Internet Society Hyderabad), with 10+ workshops on cloud, backend and AI.",
        ja: "大学で15回以上のイベントを主催。インターネットソサエティ・ハイデラバード支部 SRIT Academic Hub の議長として、クラウド・バックエンド・AIのワークショップを10回以上開催。",
      },
    },
    {
      abbr: "DevAdv",
      kanji: "伝",
      name: { en: "Developer Advocacy", ja: "デベロッパーアドボカシー" },
      text: {
        en: "I build projects to be read: live demos, evidence reports and README-first docs. Certified in Claude, Neo4j and AWS.",
        ja: "読まれることを前提に作ります。ライブデモ、エビデンスレポート、READMEファーストのドキュメント。Claude・Neo4j・AWS 認定。",
      },
    },
    {
      abbr: "FDE",
      kanji: "現",
      name: { en: "Forward Deployed Engineering", ja: "フォワードデプロイドエンジニア" },
      text: {
        en: "I sit with client users, find the workflows AI can shorten, and ship the tool. The AP AutoReply system cut manual tickets by 70%.",
        ja: "顧客の現場に入り、AIで短縮できる業務を見つけてツールとして届けます。AP自動返信システムで手作業のチケット対応を70%削減。",
      },
    },
    {
      abbr: "SDE",
      kanji: "創",
      name: { en: "Software Engineering", ja: "ソフトウェアエンジニア" },
      text: {
        en: "FastAPI, Kubernetes, ClickHouse, Neo4j. Took an analytics UI from 10 minutes to under 5 seconds.",
        ja: "FastAPI、Kubernetes、ClickHouse、Neo4j。分析画面の表示を10分から5秒未満に短縮。",
      },
    },
  ],
};
