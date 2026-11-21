import type { L10n, PanelHead } from "./types";

export interface GalleryItem {
  /** File name in /public/assets without extension. */
  src: string;
  caption: L10n;
}
export const GALLERY_TABS = ["events", "awards", "papers", "news"] as const;
export type GalleryTabKey = (typeof GALLERY_TABS)[number];
export interface GalleryTab {
  key: GalleryTabKey;
  label: L10n;
  items: GalleryItem[];
}

export const assetUrl = (name: string) => `/assets/${name}.jpg`;

export const gallery: PanelHead & {
  stats: { n: string; label: L10n }[];
  featureHeading: L10n;
  featureText: L10n;
  tabs: GalleryTab[];
  /** Four photos framed on the 3D gallery wall (top-left, top-right, bottom-left, bottom-right). */
  wall: [string, string, string, string];
} = {
  kicker: { en: "写真 · GALLERY & EVENTS", ja: "GALLERY & EVENTS · 写真・イベント" },
  title: { en: "Events & moments", ja: "イベントと思い出" },
  sub: { en: "Giving back to the campus that raised me", ja: "育ててくれたキャンパスへの恩返し" },
  stats: [
    { n: "15+", label: { en: "events conducted at college", ja: "大学で主催したイベント" } },
    { n: "10+", label: { en: "technical workshops", ja: "技術ワークショップ" } },
    { n: "100+", label: { en: "students reached", ja: "参加した学生" } },
  ],
  featureHeading: {
    en: "Alumni Talk Series — “From Idea to Innovation: Winning the Hackathon”",
    ja: "卒業生トークシリーズ「アイデアからイノベーションへ：ハッカソンで勝つ」",
  },
  featureText: {
    en: "Back at SRIT as an alumnus on 21 September 2026, I spoke to second-year B.Tech CSM students about taking an idea to a hackathon win. Organised by the Department of CSE (AI & ML) with the Internet Society of India, Hyderabad Chapter.",
    ja: "2026年9月21日、卒業生として SRIT に戻り、B.Tech 2年生（CSM）にアイデアをハッカソン優勝へつなげる方法を話しました。主催は CSE（AI・ML）学科とインターネットソサエティ・インド ハイデラバード支部。",
  },
  tabs: [
    {
      key: "events",
      label: { en: "Events", ja: "イベント" },
      items: [
        {
          src: "event-talk",
          caption: {
            en: "Alumni talk: hackathon strategy with second-year students",
            ja: "卒業生トーク：2年生とハッカソンの戦略",
          },
        },
        {
          src: "event-audience",
          caption: { en: "From problem statement to solution", ja: "課題からソリューションへ" },
        },
        {
          src: "event-felicitation",
          caption: { en: "Felicitated by the department after the talk", ja: "講演後、学科から表彰" },
        },
        { src: "event-poster", caption: { en: "Alumni Talk Series poster", ja: "卒業生トークシリーズのポスター" } },
        {
          src: "event-collage",
          caption: {
            en: "Talks and workshops with the Internet Society Hyderabad Chapter",
            ja: "インターネットソサエティ・ハイデラバード支部との講演とワークショップ",
          },
        },
        { src: "event-session", caption: { en: "Packed hands-on lab sessions", ja: "満席のハンズオン講座" } },
      ],
    },
    {
      key: "awards",
      label: { en: "Awards", ja: "受賞" },
      items: [
        {
          src: "award-jatayu",
          caption: {
            en: "Winner — Virtusa Jatayu Season IV (GenAI ideathon)",
            ja: "Virtusa Jatayu シーズン4 優勝（生成AIアイデアソン）",
          },
        },
        {
          src: "award-thinktank",
          caption: {
            en: "SBU Growth Markets winner — team “The Think Tank” at Jatayu",
            ja: "Jatayu SBU Growth Markets 優勝チーム「The Think Tank」",
          },
        },
        {
          src: "award-alts-photo",
          caption: {
            en: "Receiving the paper-presentation prize at Presto 2K23, ALTS Anantapur",
            ja: "Presto 2K23（ALTS アナンタプル）論文発表で表彰",
          },
        },
        {
          src: "award-alts-cert",
          caption: {
            en: "Certificate of Achievement — Paper Presentation, Presto 2K23",
            ja: "Presto 2K23 論文発表 表彰状",
          },
        },
      ],
    },
    {
      key: "papers",
      label: { en: "Papers & certificates", ja: "論文・資格" },
      items: [
        {
          src: "paper-icimsss",
          caption: {
            en: "CyberAid: blockchain-integrated NLP for cybercrime complaints — ICIMSSS-24, K.S.R. College of Engineering",
            ja: "CyberAid：ブロックチェーン統合NLPによるサイバー犯罪届出 — ICIMSSS-24、K.S.R. 工科大学",
          },
        },
        {
          src: "paper-cuap",
          caption: {
            en: "“Blockchain and Cybersecurity” — national seminar, Central University of Andhra Pradesh (Nov 2024)",
            ja: "「ブロックチェーンとサイバーセキュリティ」— アーンドラ・プラデーシュ中央大学 全国セミナー（2024年11月）",
          },
        },
        {
          src: "paper-dmi",
          caption: {
            en: "Paper at an international conference, DMI St. John the Baptist University (Oct 2024)",
            ja: "DMI 聖ヨハネ・バプテスト大学 国際会議での論文発表（2024年10月）",
          },
        },
        {
          src: "cert-ide",
          caption: {
            en: "Innovation, Design & Entrepreneurship Bootcamp — MoE Innovation Cell & AICTE (2023)",
            ja: "イノベーション・デザイン・起業ブートキャンプ — 教育省イノベーションセル・AICTE（2023年）",
          },
        },
        {
          src: "cert-isoc",
          caption: {
            en: "Internet Society — Designing and Deploying Computer Networks (Nov 2024)",
            ja: "インターネットソサエティ「コンピュータネットワークの設計と構築」（2024年11月）",
          },
        },
        {
          src: "cert-neo4j",
          caption: { en: "Neo4j Certified Professional (Jan 2026)", ja: "Neo4j 認定プロフェッショナル（2026年1月）" },
        },
      ],
    },
    {
      key: "news",
      label: { en: "In the news", ja: "新聞掲載" },
      items: [
        {
          src: "news-1",
          caption: {
            en: "Sakshi (Telugu daily): talent at a national-level seminar",
            ja: "サクシ紙（テルグ語日刊紙）：全国セミナーでの活躍",
          },
        },
        { src: "news-2", caption: { en: "Featured in Sakshi", ja: "サクシ紙に掲載" } },
        {
          src: "news-3",
          caption: {
            en: "Sakshi: recognition for web application development",
            ja: "サクシ紙：Webアプリケーション開発での活躍",
          },
        },
      ],
    },
  ],
  wall: ["event-talk", "award-alts-photo", "event-collage", "event-poster"],
};
