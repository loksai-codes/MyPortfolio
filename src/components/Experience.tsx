"use client";
import { useEffect, useRef } from "react";
import { gallery, REN_HELLO, REN_LINES, sceneText, ui } from "@/content";
import { assetUrl } from "@/content/gallery";
import { audio } from "@/audio/client";
import { Engine } from "@/engine/Engine";
import { useApp } from "@/store/useApp";
import { shippori } from "@/app/fonts";
import { closeSection, openSection } from "./actions";
import { bridge } from "./bridge";
import { writeHash } from "./deepLink";
import { useT } from "./hooks";
import { onEngineReady } from "./Intro/enter";
import { renSay } from "./renSpeech";

const wall = gallery.wall.map(assetUrl) as unknown as readonly [string, string, string, string];

function webglAvailable(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * Client-only (loaded with next/dynamic, ssr:false). Mounts the 3D engine on the canvas,
 * bridges store ⇄ engine, and disposes everything on unmount.
 */
export default function Experience() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const t = useT();

  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const store = useApp;
    if (!webglAvailable()) {
      store.getState().setWebgl("fail");
      return;
    }
    let engine: Engine | null = null;
    let cancelled = false;
    let lineI = 0;
    const unsubs: (() => void)[] = [];
    const fam = shippori.style.fontFamily;
    // Painted glyphs need the font; wait at most 2.5 s like the reference.
    const fonts = Promise.all([document.fonts.load(`800 100px ${fam}`, sceneText.glyphs), document.fonts.ready]).catch(() => {});
    Promise.race([fonts, new Promise((r) => setTimeout(r, 2500))]).then(() => {
      if (cancelled) return;
      try {
        engine = new Engine(el, {
          serifFamily: fam,
          sceneText,
          galleryWall: wall,
          reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
          onSelect: (key) => openSection(key),
          onMiss: () => closeSection(),
          onHover: (key) => store.getState().setHovering(!!key),
          onRenSay: (cue) => {
            const lang = store.getState().lang;
            if (cue === "hello") renSay(REN_HELLO[lang], 5200);
            else {
              const lines = REN_LINES[lang];
              renSay(lines[lineI++ % lines.length]!);
            }
          },
          onSound: (cue) => audio[cue](),
        });
      } catch (e) {
        console.warn("[experience] WebGL init failed", e);
        store.getState().setWebgl("fail");
        return;
      }
      bridge.engine = engine;
      engine.attachOverlay({ hotspots: bridge.hotspots, bubble: bridge.bubble });
      engine.setLanguage(store.getState().lang);
      store.getState().setWebgl("ok");
      // store → engine
      let prevSection = store.getState().section;
      let prevLang = store.getState().lang;
      unsubs.push(
        store.subscribe((s) => {
          if (s.section !== prevSection) {
            prevSection = s.section;
            engine?.focus(s.section);
            if (s.entered) writeHash(s.section);
          }
          if (s.lang !== prevLang) {
            prevLang = s.lang;
            engine?.setLanguage(s.lang);
          }
        }),
      );
      onEngineReady();
    });
    return () => {
      cancelled = true;
      unsubs.forEach((u) => u());
      engine?.dispose();
      if (bridge.engine === engine) bridge.engine = null;
    };
  }, []);

  return <canvas id="scene" ref={canvas} tabIndex={-1} aria-label={t(ui.aScene)} />;
}
