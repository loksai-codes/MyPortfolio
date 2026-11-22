"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { ui } from "@/content";
import { useApp } from "@/store/useApp";
import { useT } from "./hooks";

/**
 * Full-screen photo viewer, a true modal: focus goes to the close button, Tab stays inside,
 * everything behind it is inert, and closing (button, backdrop or Esc via BodyState) returns
 * focus to the thumbnail that opened it.
 */
export function Lightbox() {
  const lb = useApp((s) => s.lightbox);
  const close = useApp((s) => s.showLightbox);
  const t = useT();
  const ref = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!lb || !dialog) return;
    // The opener is the gallery thumbnail for this photo (Safari doesn't focus buttons on click).
    const opener =
      document.querySelector<HTMLElement>(`#panel figure[data-src="${CSS.escape(lb.src)}"] button`) ??
      (document.activeElement as HTMLElement | null);
    // Make the rest of the page inert while open; remember what we changed so React-managed inert stays intact.
    const touched = [...(dialog.parentElement?.children ?? [])].filter(
      (el): el is HTMLElement => el !== dialog && el instanceof HTMLElement && !el.inert,
    );
    touched.forEach((el) => (el.inert = true));
    document.body.classList.add("lb-open");
    closeBtn.current?.focus();
    return () => {
      touched.forEach((el) => (el.inert = false));
      document.body.classList.remove("lb-open");
      opener?.focus({ preventScroll: true });
    };
  }, [lb]);

  // Focus trap: cycle Tab / Shift+Tab through the dialog's focusable elements.
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Tab") return;
    const items = [...e.currentTarget.querySelectorAll<HTMLElement>("button, [href], [tabindex]:not([tabindex='-1'])")];
    if (!items.length) return;
    const first = items[0]!,
      last = items[items.length - 1]!;
    const active = document.activeElement;
    if (e.shiftKey && (active === first || !e.currentTarget.contains(active))) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && (active === last || !e.currentTarget.contains(active))) {
      e.preventDefault();
      first.focus();
    }
  };

  return (
    <div
      id="lightbox"
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label={lb ? lb.caption : t(ui.aImage)}
      tabIndex={-1}
      className={lb ? "show" : undefined}
      onKeyDown={onKeyDown}
      // Backdrop only: clicks on the photo or caption don't close it.
      onClick={(e) => e.target === e.currentTarget && close(null)}
    >
      {lb && (
        <>
          <button
            type="button"
            className="lb-close"
            ref={closeBtn}
            aria-label={t(ui.closeImage)}
            onClick={() => close(null)}
          >
            <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.3" />
            </svg>
          </button>
          <div className="lb-inner">
            <Image src={lb.src} alt={lb.caption} width={1000} height={750} sizes="92vw" />
            <p aria-hidden="true">{lb.caption}</p>
          </div>
        </>
      )}
    </div>
  );
}
