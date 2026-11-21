import type { L10n, L10nList, PanelHead } from "./types";

export interface Job {
  when: string;
  role: L10n;
  org: string;
  bullets: L10nList;
}

export const experience: PanelHead & { list: Job[]; honoursHeading: L10n; honours: L10n[] } = {
  kicker: { en: "経歴 · EXPERIENCE", ja: "EXPERIENCE · 経歴" },
  title: { en: "Where I've worked", ja: "これまでの仕事" },
  sub: { en: "Enterprise AI, data and cloud", ja: "エンタープライズAI・データ・クラウド" },
  list: [
    {
      when: "Sep 2025 – Present",
      role: { en: "Associate Engineer — AI & Enterprise Automation", ja: "アソシエイトエンジニア（AI・業務自動化）" },
      org: "Virtusa · Air Liquide",
      bullets: {
        en: [
          "Introduced AI accelerators into Air Liquide's Alibaba Cloud migration programme.",
          "Cross-database validation PoC: 1M records checked in ~34 s, 69× faster than baseline.",
          "dbt lineage GraphRAG assistant on KùzuDB with Cypher-grounded answers.",
          "Supplier AP AutoReply (Gemini 2.5 Flash, ServiceNow) in Japanese, Mandarin and English: 70% fewer manual tickets, 160+ hours saved a month.",
        ],
        ja: [
          "Air Liquide の Alibaba Cloud 移行プログラムにAIアクセラレーターを導入。",
          "異種DB間の移行検証PoC：100万件を約34秒で検証（基準比69倍高速）。",
          "KùzuDB 上に dbt リネージの GraphRAG アシスタントを構築。Cypher に基づく回答。",
          "日本語・中国語・英語対応のサプライヤー支払自動返信（Gemini 2.5 Flash、ServiceNow）。手作業を70%削減、月160時間以上を節約。",
        ],
      },
    },
    {
      when: "Jun 2025 – Aug 2025",
      role: { en: "Technology Intern", ja: "テクノロジーインターン" },
      org: "Virtusa · Hyderabad",
      bullets: {
        en: [
          "Gemini + React payload generator for integration tests: 40% less setup time.",
          "LLM pipelines that pull NFR benchmarks out of architecture documents.",
        ],
        ja: ["Gemini と React による結合テスト用ペイロード生成：準備時間を40%短縮。", "設計書から非機能要件の指標を抽出するLLMパイプライン。"],
      },
    },
    {
      when: "Mar 2025 – Jun 2025",
      role: { en: "Software Engineer Intern", ja: "ソフトウェアエンジニアインターン" },
      org: "IRMAI · Remote",
      bullets: {
        en: [
          "SQLite → ClickHouse: analytics UI from 10 minutes to under 5 seconds (95% faster).",
          "Microservices on AKS with Helm; Terraform across AWS and Azure.",
          "Neo4j graph of 500+ compliance controls for automated gap analysis.",
        ],
        ja: [
          "SQLite から ClickHouse へ移行し、分析画面を10分から5秒未満に（95%高速化）。",
          "Helm で AKS にマイクロサービスを展開、Terraform で AWS・Azure を自動構築。",
          "500以上のコンプライアンス管理項目を Neo4j でグラフ化し、ギャップ分析を自動化。",
        ],
      },
    },
    {
      when: "SRIT · 2021 – 2025",
      role: { en: "Chair — SRIT Academic Hub", ja: "SRIT Academic Hub 議長" },
      org: "Internet Society · Hyderabad Chapter",
      bullets: {
        en: [
          "Conducted 15+ events at college: talks, workshops and bootcamps.",
          "Led 10+ technical workshops on cloud, backend engineering and AI for 100+ students.",
        ],
        ja: [
          "大学で講演・ワークショップ・ブートキャンプなど15回以上のイベントを主催。",
          "クラウド・バックエンド・AIの技術ワークショップを10回以上開催し、100名以上の学生を指導。",
        ],
      },
    },
    {
      when: "Aug 2023 – Nov 2023",
      role: { en: "Project Intern", ja: "プロジェクトインターン" },
      org: "Wipro · Hyderabad",
      bullets: {
        en: [
          "Fine-tuned M2M100 across 12 language pairs (BLEU 0.35, ROUGE-L 0.42).",
          "Human-in-the-loop review cut translation errors by 15%.",
        ],
        ja: ["M2M100 を12言語ペアでファインチューニング（BLEU 0.35、ROUGE-L 0.42）。", "人間参加型レビューで翻訳エラーを15%削減。"],
      },
    },
  ],
  honoursHeading: { en: "Honours & certificates", ja: "受賞・資格" },
  honours: [
    { en: "Winner, Jatayu Hackathon Season 4 — #1 of 200+", ja: "Jatayu ハッカソン シーズン4 優勝（200名以上中1位）" },
    { en: "AWS Certified Developer – Associate", ja: "AWS 認定デベロッパー – アソシエイト" },
    { en: "Claude Certified Developer – Foundations", ja: "Claude 認定デベロッパー – Foundations" },
    { en: "Neo4j Certified Professional", ja: "Neo4j 認定プロフェッショナル" },
    { en: "ClickHouse for Big Data Analytics", ja: "ClickHouse ビッグデータ分析" },
    {
      en: "Publication: CyberAid — an NLP system that helps citizens file cybercrime reports (NCIIRHS)",
      ja: "論文：CyberAid — 市民のサイバー犯罪届出を支援するNLPシステム（NCIIRHS）",
    },
  ],
};
