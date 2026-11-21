import { audio } from "@/audio/client";

const PREFERRED: Record<"en" | "ja", string[]> = {
  ja: ["Kyoko", "Nanami", "Haruka", "Google 日本語", "Mizuki", "Ayumi", "O-Ren"],
  en: [
    "Samantha",
    "Aria",
    "Jenny",
    "Google US English",
    "Ava",
    "Zira",
    "Karen",
    "Tessa",
    "Moira",
    "Google UK English Female",
  ],
};

export interface SayOptions {
  /** Ren only talks out loud while the music is on (or when forced). */
  musicOn: boolean;
  force?: boolean;
  start?: () => void;
  end?: () => void;
}

/**
 * Ren's voice via the Web Speech API: picks a bright voice per language, high pitch, ducks the music
 * while speaking. Silently does nothing where speech synthesis is unavailable.
 */
class Voice {
  enabled = true;
  private voices: SpeechSynthesisVoice[] = [];
  private readonly ok: boolean;

  constructor() {
    this.ok =
      typeof window !== "undefined" && "speechSynthesis" in window && typeof SpeechSynthesisUtterance !== "undefined";
    if (!this.ok) return;
    const load = () => {
      try {
        this.voices = speechSynthesis.getVoices();
      } catch {
        this.voices = [];
      }
    };
    load();
    try {
      speechSynthesis.addEventListener("voiceschanged", load);
    } catch {
      /* old Safari */
    }
  }

  private pick(lang: "en" | "ja"): SpeechSynthesisVoice | null {
    const c = this.voices.filter((v) => (v.lang || "").toLowerCase().startsWith(lang));
    for (const n of PREFERRED[lang]) {
      const v = c.find((x) => x.name.includes(n));
      if (v) return v;
    }
    return c[0] ?? null;
  }

  setEnabled(on: boolean) {
    this.enabled = on;
    if (!on && this.ok) {
      try {
        speechSynthesis.cancel();
      } catch {
        /* ignore */
      }
    }
  }

  say(text: string, lang: "en" | "ja", o: SayOptions): boolean {
    if (!this.ok || !this.enabled || (!o.musicOn && !o.force)) return false;
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text.replace(/[✨♡~〜]/g, ""));
      const v = this.pick(lang);
      if (v) {
        u.voice = v;
        u.lang = v.lang;
      } else u.lang = lang === "ja" ? "ja-JP" : "en-US";
      u.pitch = 1.8;
      u.rate = lang === "ja" ? 1.05 : 1.07;
      u.volume = 1;
      u.onstart = () => {
        audio.duck(true);
        o.start?.();
      };
      u.onend = u.onerror = () => {
        audio.duck(false);
        o.end?.();
      };
      speechSynthesis.speak(u);
      return true;
    } catch {
      return false;
    }
  }
}

export const voice = new Voice();
