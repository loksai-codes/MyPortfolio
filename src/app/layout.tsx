import type { Metadata, Viewport } from "next";
import { profile, ui } from "@/content";
import { fontVars } from "./fonts";
import "@/styles/base.css";
import "@/styles/overlay.css";
import "@/styles/panel.css";
import "@/styles/intro.css";
import "@/styles/responsive.css";
import "@/styles/app.css";

const title = `${profile.name} — 和室 Portfolio`;

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title,
  description: profile.description.en,
  applicationName: title,
  authors: [{ name: profile.name, url: profile.siteUrl }],
  alternates: { canonical: "/", languages: { en: "/", ja: "/" } },
  openGraph: {
    type: "profile",
    title,
    description: `${ui.introTitle.en} — ${ui.introSub.en}`,
    url: profile.siteUrl,
    siteName: title,
    locale: "en_US",
    alternateLocale: ["ja_JP"],
  },
  twitter: { card: "summary_large_image", title, description: profile.description.en },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: "#0c0e22", width: "device-width", initialScale: 1 };

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  alternateName: profile.nameKana,
  jobTitle: profile.jobTitle,
  url: profile.siteUrl,
  image: `${profile.siteUrl}${profile.portrait}`,
  sameAs: [profile.links.github, profile.links.githubProjects, profile.links.linkedin],
};

// Runs before hydration: picks the saved/browser language so <html lang> and the first paint match.
const langBoot = `try{var s=localStorage.getItem("lp-lang");var l=s==="ja"||s==="en"?s:((navigator.language||"").indexOf("ja")===0?"ja":"en");document.documentElement.lang=l;document.documentElement.dataset.lang=l}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVars} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: langBoot }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
