import { profile } from "./profile";
import type { L10n, PanelHead } from "./types";

export interface ContactRow {
  label: string;
  display: string;
  href: string;
}

export const contact: PanelHead & { text: L10n; rows: ContactRow[] } = {
  kicker: { en: "連絡先 · CONTACT", ja: "CONTACT · 連絡先" },
  title: { en: "The shoji is open.", ja: "障子は開いています。" },
  sub: { en: "Come in and say hello", ja: "どうぞ、お入りください" },
  text: {
    en: "A DevRel role, a forward-deployed engagement, or a graph problem that won't sit still: I'd love to hear about it.",
    ja: "DevRel の仕事でも、顧客先での開発でも、なかなか解けないグラフの課題でも、ぜひ聞かせてください。",
  },
  rows: [
    { label: "Email", display: profile.email, href: `mailto:${profile.email}` },
    { label: "GitHub", display: "github.com/loksai-dev", href: profile.links.github },
    { label: "GitHub · projects", display: "github.com/loksai-codes", href: profile.links.githubProjects },
    { label: "LinkedIn", display: "linkedin.com/in/loksai-palyam", href: profile.links.linkedin },
  ],
};
