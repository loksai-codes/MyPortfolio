"use client";
import { useEffect, useState } from "react";
import { profile, ui } from "@/content";
import { useApp } from "@/store/useApp";
import { Bi } from "../Bi";
import { Roles } from "../Hero";
import { LanguageToggle } from "../LanguageToggle";
import { enter } from "./enter";
import { Enso } from "./Enso";
import { IntroCanvas } from "./IntroCanvas";

/** Moonlit-garden title screen with the brushed ensō, name, roles and the two Enter buttons. */
export function IntroScreen() {
  const [phase, setPhase] = useState<"idle" | "leave" | "gone">("idle");
  const entered = useApp((s) => s.entered);
  const webgl = useApp((s) => s.webgl);
  const [moon, setMoon] = useState<{ x: number; y: number; r: number } | null>(null);

  useEffect(() => {
    const onLeave = () => setPhase("leave");
    const onGone = () => setPhase("gone");
    window.addEventListener("intro:leave", onLeave);
    window.addEventListener("intro:gone", onGone);
    return () => {
      window.removeEventListener("intro:leave", onLeave);
      window.removeEventListener("intro:gone", onGone);
    };
  }, []);

  const loadMsg = webgl === "pending" ? ui.loading : webgl === "fail" ? ui.loadFail : null;

  return (
    <div
      id="intro"
      className={phase === "idle" ? undefined : phase === "leave" ? "leave" : "leave gone"}
      aria-hidden={entered}
      inert={phase !== "idle"}
    >
      {phase !== "gone" && <IntroCanvas onMoon={setMoon} />}
      <Enso moon={moon} />
      <div className="intro-top">
        <span>
          <Bi v={ui.introTop} />
        </span>
        <LanguageToggle as="span" />
      </div>
      <div className="intro-ui">
        <div className="k">
          <Bi v={ui.introKicker} />
        </div>
        <h2>
          {profile.name.split(" ").map((w) => (
            <span className="w" key={w}>
              <span>{w}</span>
            </span>
          ))}
        </h2>
        <div className="jp" lang="ja">
          {profile.nameKana}
        </div>
        <div className="ln" />
        <div className="ro">
          <Roles />
        </div>
        <div className="intro-btns">
          <button type="button" className="main" id="enterSound" onClick={() => enter(true)}>
            <Bi v={ui.enterSound} />
          </button>
          <button type="button" id="enterQuiet" onClick={() => enter(false)}>
            <Bi v={ui.enterQuiet} />
          </button>
        </div>
      </div>
      <div className="intro-bot">
        <Bi v={ui.introBot} />
      </div>
      <div id="loadmsg" role="status">
        {loadMsg && <Bi v={loadMsg} />}
      </div>
    </div>
  );
}
