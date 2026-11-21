/**
 * Text painted into 3D canvas textures. Kept here so the engine contains no copy.
 * These are deliberately language-independent (the room looks the same in EN and JA).
 */
export const sceneText = {
  scroll: { big: "道", vertical: ["ロ", "ク", "サ", "イ"], seal: "蓮" },
  lantern: "技",
  /** Laptop terminal: [colour, line]. */
  terminal: [
    ["#8b93b8", "$ ren --show projects"],
    ["#f2b5c6", "▸ blind-flange"],
    ["#7f88aa", "  Neo4j · MCP · 286 tests"],
    ["#e8b45a", "▸ FreshCheck"],
    ["#7f88aa", "  FalkorDB · Groq · bitemporal"],
    ["#a58bd8", "▸ LeanKG"],
    ["#7f88aa", "  spaCy · GiNZA · 日本語"],
    ["#9be3a9", "✓ 3 projects ready_"],
  ] as [string, string][],
  /** Glyphs to preload before painting textures. */
  glyphs: "道技ロクサイ蓮",
} as const;
