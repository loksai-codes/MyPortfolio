"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { assetUrl, gallery } from "@/content";
import { useApp } from "@/store/useApp";
import { useT } from "../hooks";
import { PanelHeader } from "./PanelHeader";

/** Stats, featured talk, tabbed photo grid (events / awards / papers / news). Click a photo for the lightbox. */
export function Gallery() {
  const t = useT();
  const tabKey = useApp((s) => s.galleryTab);
  const setTab = useApp((s) => s.setGalleryTab);
  const showLightbox = useApp((s) => s.showLightbox);
  const tabsRef = useRef<HTMLDivElement>(null);
  const tab = gallery.tabs.find((x) => x.key === tabKey) ?? gallery.tabs[0]!;
  const switched = useRef(false);
  // After a tab switch renders, bring the tab bar to the top of the scroll (reference behaviour).
  useEffect(() => {
    if (!switched.current) return;
    switched.current = false;
    tabsRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
  }, [tabKey]);
  return (
    <>
      <PanelHeader head={gallery} />
      <div className="gstats">
        {gallery.stats.map((x) => (
          <div key={x.n}>
            <b>{x.n}</b>
            <span>{t(x.label)}</span>
          </div>
        ))}
      </div>
      <h3>{t(gallery.featureHeading)}</h3>
      <p>{t(gallery.featureText)}</p>
      <div className="gtabs" role="tablist" ref={tabsRef}>
        {gallery.tabs.map((x) => (
          <button
            type="button"
            role="tab"
            key={x.key}
            data-tab={x.key}
            aria-selected={x.key === tab.key}
            aria-controls="gallery-grid"
            className={x.key === tab.key ? "on" : undefined}
            onClick={() => {
              switched.current = true;
              setTab(x.key);
              if (x.key === tabKey) tabsRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
            }}
          >
            {t(x.label)}
            <span>{x.items.length}</span>
          </button>
        ))}
      </div>
      <div className="ggrid" id="gallery-grid" role="tabpanel">
        {tab.items.map((it) => {
          const src = assetUrl(it.src);
          const caption = t(it.caption);
          return (
            <figure key={it.src} data-src={src}>
              <button type="button" onClick={() => showLightbox({ src, caption })} aria-label={caption}>
                <Image src={src} alt={caption} width={480} height={360} sizes="(max-width: 900px) 45vw, 240px" />
              </button>
              <figcaption>{caption}</figcaption>
            </figure>
          );
        })}
      </div>
    </>
  );
}
