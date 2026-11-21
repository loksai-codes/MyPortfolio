import { Fallback } from "@/components/Fallback";
import { SiteShell } from "@/components/SiteShell";

// Without JavaScript the interactive layer can't run: show the text version of the room instead.
const noScriptCss = `
.fallback{display:block!important}
html,body{overflow:auto!important;height:auto!important;cursor:auto!important}
#intro,#scene,#bar,#hero,#hint,.vert,#hotspots,#bubble,#panel,#cur,#cur2,.vign,.toast,#lightbox{display:none!important}
button,a{cursor:pointer!important}`;

export default function Page() {
  return (
    <>
      <noscript>
        <style>{noScriptCss}</style>
      </noscript>
      <SiteShell />
      <Fallback />
    </>
  );
}
