"use client";
import { useEffect, useRef } from "react";
import { useApp } from "@/store/useApp";

const HOVERABLE = "button,a,.hs,figure,.path,.card,.lang";

/** Gold dot + trailing ring cursor. Grows over interactive elements (DOM or 3D objects). */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let x = -99,
      y = -99,
      x2 = -99,
      y2 = -99,
      raf = 0;
    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (dot.current) dot.current.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%)`;
      const target = e.target as Element | null;
      if (target && target.id !== "scene") useApp.getState().setHovering(!!target.closest?.(HOVERABLE));
    };
    const tick = () => {
      x2 += (x - x2) * 0.18;
      y2 += (y - y2) * 0.18;
      if (ring.current) ring.current.style.transform = `translate(${x2}px,${y2}px) translate(-50%,-50%)`;
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", move);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <>
      <div id="cur" ref={dot} aria-hidden="true" />
      <div id="cur2" ref={ring} aria-hidden="true" />
    </>
  );
}
