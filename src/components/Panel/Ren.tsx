"use client";
import Image from "next/image";
import { profile, renPanel, ui } from "@/content";
import { useApp } from "@/store/useApp";
import { voice } from "@/voice/Voice";
import { bridge } from "../bridge";
import { useT } from "../hooks";
import { PanelHeader } from "./PanelHeader";

export function RenPanel() {
  const t = useT();
  const voiceOn = useApp((s) => s.voiceOn);
  const setVoice = useApp((s) => s.setVoice);
  const lang = useApp((s) => s.lang);
  const soundOn = useApp((s) => s.soundOn);
  return (
    <>
      <PanelHeader head={renPanel} />
      <div className="portrait">
        <Image src={profile.withRen} alt={`${profile.name} with Ren`} width={224} height={224} sizes="112px" />
        <div className="meta">
          <b>{renPanel.portraitName}</b>
          {t(renPanel.sub)}
        </div>
      </div>
      <p>{t(renPanel.text)}</p>
      <div className="links">
        <button type="button" className="btn" id="petBtn" onClick={() => bridge.engine?.petRen()}>
          {t(ui.petRen)} ♡
        </button>
        <button
          type="button"
          className="btn ghost"
          id="voiceBtn"
          aria-pressed={voiceOn}
          onClick={() => {
            const next = !voiceOn;
            setVoice(next);
            voice.enabled = next;
            if (next) voice.say(ui.voiceTest[lang], lang, { musicOn: soundOn });
          }}
        >
          {t(voiceOn ? ui.voiceOn : ui.voiceOff)}
        </button>
      </div>
    </>
  );
}
