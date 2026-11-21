import type { L10n } from "@/content";

/**
 * Renders both languages; CSS shows the one matching `html[data-lang]`. Used only on the intro, which
 * paints before hydration, so Japanese visitors never see an English flash.
 */
export function Bi({ v }: { v: L10n }) {
  if (v.en === v.ja) return <>{v.en}</>;
  return (
    <>
      <span className="l-en" lang="en">
        {v.en}
      </span>
      <span className="l-ja" lang="ja">
        {v.ja}
      </span>
    </>
  );
}
