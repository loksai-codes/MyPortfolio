import { ImageResponse } from "next/og";
import { profile } from "@/content";

export const alt = `${profile.name} — ${profile.roles.join(" · ")}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Cormorant Garamond subset for the card (falls back to the default font if Google Fonts is unreachable). */
async function cormorant(text: string): Promise<ArrayBuffer | null> {
  try {
    const css = await (await fetch(`https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600&text=${encodeURIComponent(text)}`)).text();
    const url = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
    return url ? await (await fetch(url)).arrayBuffer() : null;
  } catch {
    return null;
  }
}

/** Social card: moonlit night, the ensō moon, name and roles. */
export default async function OpengraphImage() {
  const font = await cormorant(`WELCOME TO MY ROOM${profile.name}${profile.roles.join(" · ")}LP`);
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "linear-gradient(180deg, #05071a 0%, #171a48 50%, #46356c 80%, #7d4f6c 100%)",
          color: "#f2e8d5",
          fontFamily: font ? "Cormorant" : "serif",
        }}
      >
        {/* moon glow + moon */}
        <div
          style={{
            position: "absolute",
            left: 690,
            top: 40,
            width: 520,
            height: 520,
            borderRadius: 9999,
            background: "radial-gradient(circle, rgba(255,232,196,.35) 0%, rgba(255,232,196,0) 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 830,
            top: 180,
            width: 240,
            height: 240,
            borderRadius: 9999,
            background: "radial-gradient(circle at 35% 35%, #fffaf0 0%, #efdcb6 100%)",
          }}
        />
        {/* ensō ring */}
        <div
          style={{
            position: "absolute",
            left: 790,
            top: 140,
            width: 320,
            height: 320,
            borderRadius: 9999,
            border: "7px solid rgba(242,232,213,.85)",
            borderTopColor: "transparent",
            transform: "rotate(-20deg)",
          }}
        />
        {/* ridges */}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 150, background: "#18173a", display: "flex" }} />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 70, background: "#100f27", display: "flex" }} />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", paddingLeft: 90, zIndex: 1 }}>
          <div style={{ fontSize: 22, letterSpacing: 10, color: "#f0b8c8", marginBottom: 26 }}>WELCOME TO MY ROOM</div>
          <div style={{ fontSize: 118, lineHeight: 0.9, display: "flex", flexDirection: "column" }}>
            <span>Loksai</span>
            <span>Palyam</span>
          </div>
          <div style={{ width: 300, height: 2, margin: "34px 0 24px", background: "linear-gradient(90deg, #d9b46a, rgba(217,180,106,0))" }} />
          <div style={{ fontSize: 26, letterSpacing: 8, display: "flex" }}>{profile.roles.join("  ·  ")}</div>
        </div>
        <div
          style={{
            position: "absolute",
            right: 60,
            bottom: 96,
            width: 64,
            height: 64,
            borderRadius: 8,
            background: "#b8382c",
            transform: "rotate(-5deg)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 26,
            color: "#fbeee0",
            letterSpacing: 2,
          }}
        >
          LP
        </div>
      </div>
    ),
    { ...size, fonts: font ? [{ name: "Cormorant", data: font, weight: 600, style: "normal" }] : undefined },
  );
}
