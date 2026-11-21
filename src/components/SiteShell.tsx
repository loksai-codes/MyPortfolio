"use client";
import dynamic from "next/dynamic";
import { BodyState } from "./BodyState";
import { Cursor } from "./Cursor";
import { Grain, Vignette } from "./Grain";
import { Hero } from "./Hero";
import { Hotspots } from "./Hotspots";
import { IntroScreen } from "./Intro/IntroScreen";
import { Lightbox } from "./Lightbox";
import { ScrollPanel } from "./Panel/ScrollPanel";
import { RenBubble } from "./RenBubble";
import { Toast } from "./Toast";
import { TopBar } from "./TopBar";

// three.js + the engine are split into their own chunk and never rendered on the server.
const Experience = dynamic(() => import("./Experience"), { ssr: false });

/** The interactive site: 3D canvas + HTML overlay, in the same DOM order as the reference. */
export function SiteShell() {
  return (
    <>
      <BodyState />
      <Experience />
      <Vignette />
      <TopBar />
      <Hero />
      <Hotspots />
      <RenBubble />
      <ScrollPanel />
      <Toast />
      <Lightbox />
      <IntroScreen />
      <Grain />
      <Cursor />
    </>
  );
}
