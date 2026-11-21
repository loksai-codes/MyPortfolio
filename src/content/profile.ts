import type { L10n } from "./types";

export const profile = {
  name: "Loksai Palyam",
  nameKana: "ロクサイ・パリャム",
  /** Seal character on the hanko, panel spine and scroll. */
  seal: "蓮",
  roles: ["DevRel", "DevAdv", "FDE", "SDE"],
  jobTitle: "Associate Engineer — AI & Enterprise Automation",
  email: "loksaipalyam.in@gmail.com",
  siteUrl: "https://loksaipalyam.in",
  portrait: "/assets/portrait.jpg",
  withRen: "/assets/loksai-ren.jpg",
  links: {
    github: "https://github.com/loksai-dev",
    githubProjects: "https://github.com/loksai-codes",
    linkedin: "https://www.linkedin.com/in/loksai-palyam",
  },
  description: {
    en: "Loksai Palyam — engineer building AI backends, knowledge graphs and the stories that explain them. DevRel · DevAdv · FDE · SDE.",
    ja: "ロクサイ・パリャム — AIバックエンドとナレッジグラフ、そしてそれを伝える物語をつくるエンジニア。DevRel · DevAdv · FDE · SDE。",
  } satisfies L10n,
} as const;
