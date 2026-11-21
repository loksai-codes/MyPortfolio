"use client";
import { useCallback } from "react";
import type { L10n } from "@/content";
import { useApp } from "@/store/useApp";

/** Returns a translator bound to the current language. */
export function useT() {
  const lang = useApp((s) => s.lang);
  return useCallback((v: L10n) => v[lang] ?? v.en, [lang]);
}
