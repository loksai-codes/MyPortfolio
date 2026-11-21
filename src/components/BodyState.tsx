"use client";
import { useEffect } from "react";
import { initialLang, useApp } from "@/store/useApp";
import { prefetchAudio } from "@/audio/client";
import { isSectionKey } from "@/content";
import { closeSection, openSection } from "./actions";
import { writeHash } from "./deepLink";

/**
 * Mirrors store state onto <html>/<body> (the ported CSS keys off `body.entered`, `body.panel-open`,
 * `body.hov`, `html[lang]`) and owns global keyboard handling.
 */
export function BodyState() {
  const lang = useApp((s) => s.lang);
  const entered = useApp((s) => s.entered);
  const panelOpen = useApp((s) => s.section !== null);
  const hovering = useApp((s) => s.hovering);
  const webgl = useApp((s) => s.webgl);
  const section = useApp((s) => s.section);

  useEffect(() => {
    useApp.setState({ lang: initialLang() });
    prefetchAudio();
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dataset.lang = lang;
  }, [lang]);
  useEffect(() => {
    document.body.classList.toggle("entered", entered);
  }, [entered]);
  useEffect(() => {
    document.body.classList.toggle("panel-open", panelOpen);
  }, [panelOpen]);
  useEffect(() => {
    document.body.classList.toggle("hov", hovering);
  }, [hovering]);
  // No WebGL → switch to the text-only page.
  useEffect(() => {
    document.documentElement.classList.toggle("no-webgl", webgl === "fail");
  }, [webgl]);
  // Deep links: keep #section in the URL in sync, and follow manual hash edits once inside.
  useEffect(() => {
    if (entered && webgl !== "fail") writeHash(section);
  }, [section, entered, webgl]);
  useEffect(() => {
    const onHash = () => {
      const s = useApp.getState();
      if (!s.entered || s.webgl === "fail") return;
      const h = decodeURIComponent(location.hash.slice(1));
      if (isSectionKey(h)) {
        if (h !== s.section) openSection(h);
      } else if (!h) closeSection();
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const s = useApp.getState();
      if (s.lightbox) s.showLightbox(null);
      else if (s.menuOpen) s.setMenu(false);
      else closeSection();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return null;
}
