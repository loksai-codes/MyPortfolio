"use client";
import { useEffect } from "react";
import { initialLang, useApp } from "@/store/useApp";
import { prefetchAudio } from "@/audio/client";
import { closeSection } from "./actions";

/**
 * Mirrors store state onto <html>/<body> (the ported CSS keys off `body.entered`, `body.panel-open`,
 * `body.hov`, `html[lang]`) and owns global keyboard handling.
 */
export function BodyState() {
  const lang = useApp((s) => s.lang);
  const entered = useApp((s) => s.entered);
  const panelOpen = useApp((s) => s.section !== null);
  const hovering = useApp((s) => s.hovering);

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
