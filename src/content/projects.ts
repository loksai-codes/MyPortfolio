import type { L10n, PanelHead } from "./types";

export interface ProjectLink {
  label: L10n;
  href: string;
}

export interface Project {
  name: string;
  sub: L10n;
  text: L10n;
  /** Highlighted stat chips (dark). */
  stats: L10n[];
  /** Tech stack chips (not translated). */
  stack: string[];
  /** First link renders as the solid button, the rest as ghost buttons. */
  links: ProjectLink[];
}

const github = (href: string): ProjectLink => ({ label: { en: "GitHub", ja: "GitHub" }, href });
const liveDemo = (href: string): ProjectLink => ({ label: { en: "Live demo", ja: "ライブデモ" }, href });

/** Adding a project = adding one object to this list. */
export const projectList: Project[] = [
  {
    name: "Blind Flange",
    sub: { en: "Graph-based permit-to-work conflict checker", ja: "グラフで作業許可の競合を検出" },
    text: {
      en: "Before a work permit is approved, it walks the plant's piping graph to find conflicts with other open permits that tag matching misses, and shows the exact path that proves each one. It returns BLOCK, HOLD or CLEAR, and refuses to say CLEAR when a valve state is unknown.",
      ja: "作業許可を承認する前にプラントの配管グラフをたどり、タグ照合では見逃される他の許可との競合を見つけ、その根拠となる経路を正確に示します。判定は BLOCK・HOLD・CLEAR。バルブの状態が不明なときは CLEAR と言いません。",
    },
    stats: [
      { en: "286 tests", ja: "テスト 286件" },
      { en: "35/35 eval cases", ja: "評価 35/35" },
      { en: "13/13 mutations caught", ja: "変異検出 13/13" },
      { en: "9 MCP tools", ja: "MCPツール 9種" },
    ],
    stack: ["Python", "Neo4j Relate", "Cypher", "MCP", "Claude Code", "Cloud Run", "GitHub Actions"],
    links: [github("https://github.com/loksai-codes/blind-flange"), liveDemo("https://loksai-codes.github.io/blind-flange/")],
  },
  {
    name: "FreshCheck",
    sub: { en: "Freshness intelligence for AI answers", ja: "AI回答の「鮮度」を検証" },
    text: {
      en: "Catches facts that have gone stale. It checks time-sensitive claims in generated answers against live web evidence and keeps each claim's history in a bitemporal graph: when a value was true, and when FreshCheck learned it.",
      ja: "古くなった事実を見つけます。生成された回答の時事的な主張をライブのWeb証拠と照合し、各主張の履歴を二時間軸（バイテンポラル）グラフに記録。いつその値が正しかったか、いつ FreshCheck がそれを知ったか。",
    },
    stats: [
      { en: "Bitemporal claim history", ja: "二時間軸の履歴" },
      { en: "LLM gateway + fallbacks", ja: "フォールバック付きLLMゲートウェイ" },
      { en: "$5/day budget cap", ja: "1日5ドルの予算上限" },
    ],
    stack: ["FastAPI", "React", "TypeScript", "Groq", "Bifrost", "Tavily", "FalkorDB", "Docker"],
    links: [github("https://github.com/loksai-codes/FreshCheck")],
  },
  {
    name: "LeanKG",
    sub: { en: "English & Japanese documents → knowledge graph", ja: "英語・日本語の文書からナレッジグラフへ" },
    text: {
      en: "Rules first, LLM last. Dictionaries, regex, dependency patterns and spaCy/GiNZA do most of the work; only the hard sentences go to an LLM. It runs fully offline, records provenance on every edge, and stores “did not reduce” as negative evidence, never as a fact.",
      ja: "ルールが先、LLMは最後。辞書・正規表現・係り受けパターン・spaCy/GiNZA がほとんどを処理し、難しい文だけをLLMへ。完全オフラインでも動作し、すべてのエッジに出典を記録。「減らさなかった」は事実ではなく否定的証拠として保存します。",
    },
    stats: [
      { en: "Only 6–17% of sentences hit the LLM", ja: "LLMへ送る文は6〜17%のみ" },
      { en: "EN + 日本語 from day one", ja: "初日から英語＋日本語" },
      { en: "「ストレス」 = stress", ja: "「ストレス」と stress は同一" },
    ],
    stack: ["Python", "spaCy", "GiNZA", "Neo4j 5", "GLiNER", "RapidFuzz", "Groq (optional)"],
    links: [github("https://github.com/loksai-codes/LeanKG-")],
  },
];

export const projects: PanelHead & { list: Project[] } = {
  kicker: { en: "作品 · PROJECTS", ja: "PROJECTS · 作品" },
  title: { en: "Things I've built", ja: "つくったもの" },
  sub: { en: "Graphs, agents and honest answers", ja: "グラフ、エージェント、そして正直な答え" },
  list: projectList,
};
