/** Engine-local mirror of the content keys (the engine never imports content). */
export type SectionKey = "about" | "projects" | "experience" | "skills" | "quests" | "gallery" | "contact" | "ren";

export interface SceneText {
  scroll: { big: string; vertical: readonly string[]; seal: string };
  lantern: string;
  terminal: readonly (readonly [string, string])[];
  glyphs: string;
}

export type SoundCue = "clack" | "doors" | "chime";
export type RenCue = "hello" | "pet";

export interface EngineOptions {
  /** Resolved CSS font-family of Shippori Mincho B1 (from next/font) for painted glyphs. */
  serifFamily: string;
  sceneText: SceneText;
  /** Photo URLs for the 4 frames on the gallery wall. */
  galleryWall: readonly [string, string, string, string];
  reducedMotion?: boolean;
  onSelect?: (key: SectionKey) => void;
  /** Click on empty scene space. */
  onMiss?: () => void;
  onHover?: (key: SectionKey | null) => void;
  /** Ren wants to speak: the UI chooses the line (content stays out of the engine). */
  onRenSay?: (cue: RenCue) => void;
  onSound?: (cue: SoundCue) => void;
}
