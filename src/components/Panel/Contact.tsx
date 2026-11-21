"use client";
import { contact, profile, ui } from "@/content";
import { useApp } from "@/store/useApp";
import { useT } from "../hooks";
import { PanelHeader } from "./PanelHeader";

export function Contact() {
  const t = useT();
  const showToast = useApp((s) => s.showToast);
  const copy = () => {
    navigator.clipboard
      .writeText(profile.email)
      .then(() => showToast(t(ui.copied)))
      .catch(() => showToast(profile.email));
  };
  return (
    <>
      <PanelHeader head={contact} />
      <p>{t(contact.text)}</p>
      <div className="contact">
        {contact.rows.map((r) => (
          <a className="row" key={r.label} href={r.href} target="_blank" rel="noopener">
            <span>
              <small>{r.label}</small>
              <b>{r.display}</b>
            </span>
            <span aria-hidden="true">↗</span>
          </a>
        ))}
      </div>
      <div className="links">
        <button type="button" className="btn" id="copyMail" onClick={copy}>
          {t(ui.copy)}
        </button>
      </div>
    </>
  );
}
