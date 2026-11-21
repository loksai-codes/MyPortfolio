import type { L10n, PanelHead } from "./types";

export interface SkillGroup {
  heading: L10n;
  /** Small kanji next to the heading. */
  kanji: string;
  items: string[];
}

export const skills: PanelHead & { groups: SkillGroup[] } = {
  kicker: { en: "技術 · SKILLS", ja: "SKILLS · 技術" },
  title: { en: "The toolbox", ja: "道具箱" },
  sub: { en: "What the lantern lights up", ja: "提灯が照らすもの" },
  groups: [
    {
      heading: { en: "Languages", ja: "言語" },
      kanji: "言語",
      items: ["Python", "Java", "TypeScript", "SQL", "Cypher"],
    },
    {
      heading: { en: "GenAI & LLMs", ja: "生成AI・LLM" },
      kanji: "生成",
      items: [
        "Claude",
        "Gemini",
        "RAG",
        "LangGraph",
        "LangChain",
        "MCP",
        "Fine-tuning",
        "Hugging Face",
        "Prompt engineering",
      ],
    },
    {
      heading: { en: "Knowledge graphs", ja: "ナレッジグラフ" },
      kanji: "知識",
      items: ["GraphRAG", "Neo4j", "KùzuDB", "FalkorDB", "Graph Data Science", "Vector index", "Lineage & impact"],
    },
    {
      heading: { en: "Data", ja: "データ" },
      kanji: "資料",
      items: ["ClickHouse", "PostgreSQL", "DuckDB", "Pinecone", "Airflow", "dbt", "Pandas", "spaCy", "NetworkX"],
    },
    {
      heading: { en: "Backend", ja: "バックエンド" },
      kanji: "基盤",
      items: ["FastAPI", "Flask", "REST", "Async APIs", "JWT", "SQLAlchemy", "Microservices"],
    },
    {
      heading: { en: "Cloud & DevOps", ja: "クラウド・DevOps" },
      kanji: "雲",
      items: ["AWS", "Kubernetes", "Helm", "Terraform", "Docker", "GitHub Actions", "Cloud Run"],
    },
  ],
};
