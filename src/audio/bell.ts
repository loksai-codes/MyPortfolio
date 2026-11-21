import type { AudioCore } from "./core";

/** Furin wind-chime: three inharmonic partials with fast attack and long decay. */
export function bell(a: AudioCore, t: number, f = 1900 + Math.random() * 700, v = 0.04) {
  const { ctx, master, wet } = a;
  [1, 2.76, 5.4].forEach((m, i) => {
    const o = ctx.createOscillator(),
      g = ctx.createGain();
    o.frequency.value = f * m;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(v / (i + 1.5), t + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0004, t + 2.6 / (i + 1));
    o.connect(g);
    g.connect(wet);
    g.connect(master);
    o.start(t);
    o.stop(t + 2.8);
  });
}
