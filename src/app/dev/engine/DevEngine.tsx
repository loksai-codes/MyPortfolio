"use client";
import { useEffect, useRef } from "react";
import { gallery, sceneText } from "@/content";
import { assetUrl } from "@/content/gallery";
import { Engine } from "@/engine/Engine";
import { shippori } from "../../fonts";

/** Dev-only harness: bare engine (no overlay) for lighting/framing calibration against the reference. */
export default function DevEngine() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    let engine: Engine | undefined;
    let cancelled = false;
    const fam = shippori.style.fontFamily;
    Promise.all([document.fonts.load(`800 100px ${fam}`, sceneText.glyphs), document.fonts.ready]).then(() => {
      if (cancelled || !ref.current) return;
      engine = new Engine(ref.current, {
        serifFamily: fam,
        sceneText,
        galleryWall: gallery.wall.map(assetUrl) as unknown as [string, string, string, string],
      });
      (window as unknown as { __engine: Engine }).__engine = engine;
    });
    return () => {
      cancelled = true;
      engine?.dispose();
    };
  }, []);
  return <canvas id="scene" ref={ref} />;
}
