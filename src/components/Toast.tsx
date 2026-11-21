"use client";
import { useEffect, useState } from "react";
import { useApp } from "@/store/useApp";

/** Bottom-centre notice (e.g. "Email copied"), visible for 1.8 s. */
export function Toast() {
  const toast = useApp((s) => s.toast);
  const [hiddenId, setHiddenId] = useState(0);
  const show = !!toast && hiddenId !== toast.id;
  useEffect(() => {
    if (!toast) return;
    const h = setTimeout(() => setHiddenId(toast.id), 1800);
    return () => clearTimeout(h);
  }, [toast]);
  return (
    <div className={`toast${show ? " show" : ""}`} id="toast" role="status" aria-live="polite">
      {toast?.text}
    </div>
  );
}
