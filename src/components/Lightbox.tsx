"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { ui } from "@/content";
import { useApp } from "@/store/useApp";
import { useT } from "./hooks";

/** Full-screen photo viewer; click anywhere or Esc to close. */
export function Lightbox() {
  const lb = useApp((s) => s.lightbox);
  const close = useApp((s) => s.showLightbox);
  const t = useT();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (lb) ref.current?.focus();
  }, [lb]);
  return (
    <div
      id="lightbox"
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label={t(ui.aImage)}
      tabIndex={-1}
      className={lb ? "show" : undefined}
      onClick={() => close(null)}
    >
      {lb && (
        <div className="lb-inner">
          <Image src={lb.src} alt={lb.caption} width={1000} height={750} sizes="92vw" />
          <p>{lb.caption}</p>
        </div>
      )}
    </div>
  );
}
