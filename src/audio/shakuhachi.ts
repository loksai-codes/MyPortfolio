import { NOTE, type AudioCore } from "./core";

/** Breathy shakuhachi tone: meri→kari pitch rise, growing vibrato, band-passed breath noise. */
export function shakuhachi(a: AudioCore, n: string, t: number, dur: number, v = 0.045) {
  const { ctx, master, wet } = a;
  const f = NOTE(n);
  const o = ctx.createOscillator(),
    o2 = ctx.createOscillator(),
    g = ctx.createGain(),
    lp = ctx.createBiquadFilter();
  o.type = "sine";
  o2.type = "triangle";
  o2.frequency.value = f;
  lp.type = "lowpass";
  lp.frequency.value = f * 3;
  o.frequency.setValueAtTime(f * 0.94, t);
  o.frequency.linearRampToValueAtTime(f, t + 0.5); // meri → kari
  o2.frequency.setValueAtTime(f * 0.94, t);
  o2.frequency.linearRampToValueAtTime(f, t + 0.5);
  const vib = ctx.createOscillator(),
    vg = ctx.createGain();
  vib.frequency.value = 4.6;
  vg.gain.setValueAtTime(0, t);
  vg.gain.linearRampToValueAtTime(f * 0.014, t + dur * 0.8);
  vib.connect(vg);
  vg.connect(o.frequency);
  vg.connect(o2.frequency);
  const g2 = ctx.createGain();
  g2.gain.value = 0.25;
  o2.connect(g2);
  g2.connect(lp);
  o.connect(lp);
  lp.connect(g);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(v, t + 0.6);
  g.gain.setValueAtTime(v, t + dur - 0.7);
  g.gain.linearRampToValueAtTime(0, t + dur + 0.9);
  // breath
  const sr = ctx.sampleRate,
    nb = ctx.createBuffer(1, Math.floor(sr * (dur + 1.2)), sr),
    nd = nb.getChannelData(0);
  for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
  const ns = ctx.createBufferSource();
  ns.buffer = nb;
  const bp = ctx.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = f * 1.5;
  bp.Q.value = 3;
  const ng = ctx.createGain();
  ng.gain.setValueAtTime(0, t);
  ng.gain.linearRampToValueAtTime(v * 0.9, t + 0.15);
  ng.gain.linearRampToValueAtTime(v * 0.22, t + 0.7);
  ng.gain.linearRampToValueAtTime(0, t + dur + 0.8);
  ns.connect(bp);
  bp.connect(ng);
  ng.connect(master);
  ng.connect(wet);
  g.connect(master);
  g.connect(wet);
  [o, o2, vib, ns].forEach((x) => {
    x.start(t);
    x.stop(t + dur + 1.2);
  });
}
