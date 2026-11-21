import { notFound } from "next/navigation";
import DevEngine from "./DevEngine";

export const metadata = { robots: { index: false } };

export default function Page() {
  if (process.env.NODE_ENV === "production" && !process.env.ENGINE_HARNESS) notFound();
  return <DevEngine />;
}
