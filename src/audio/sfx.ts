import { bell } from "./bell";
import type { AudioCore } from "./core";
import { koto } from "./koto";

/** UI "tok" when a panel opens. */
export const tok = (a: AudioCore) => koto(a, "E5", a.ctx.currentTime, 0.18);

/** Small bell on language switch. */
export const tick = (a: AudioCore) => bell(a, a.ctx.currentTime, 2300, 0.03);

/** Rising A–C–E arpeggio when Ren is petted. */
export const chime = (a: AudioCore) => {
  const t = a.ctx.currentTime;
  ["A4", "C5", "E5"].forEach((n, i) => koto(a, n, t + i * 0.08, 0.25));
};

/** Shishi-odoshi: bamboo clack + wooden knock + water trickle. */
export function clack(a: AudioCore) {
  const { ctx, master, wet } = a;
  const t = ctx.currentTime;
  [880, 1320].forEach((f, i) => {
    const o = ctx.createOscillator(),
      g = ctx.createGain();
    o.frequency.setValueAtTime(f, t);
    o.frequency.exponentialRampToValueAtTime(f * 0.8, t + 0.08);
    g.gain.setValueAtTime(0.32 / (i + 1), t);
    g.gain.exponentialRampToValueAtTime(0.0005, t + 0.18);
    o.connect(g);
    g.connect(master);
    g.connect(wet);
    o.start(t);
    o.stop(t + 0.2);
  });
  const sr = ctx.sampleRate,
    nb = ctx.createBuffer(1, Math.floor(sr * 0.05), sr),
    d = nb.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
  const ns = ctx.createBufferSource();
  ns.buffer = nb;
  const bp = ctx.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = 2200;
  const ng = ctx.createGain();
  ng.gain.value = 0.3;
  ns.connect(bp);
  bp.connect(ng);
  ng.connect(master);
  ng.connect(wet);
  ns.start(t);
  // water trickle after
  const wb = ctx.createBuffer(1, Math.floor(sr * 1.2), sr),
    wd = wb.getChannelData(0);
  for (let i = 0; i < wd.length; i++)
    wd[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / wd.length, 2) * (Math.random() < 0.02 ? 1 : 0.15);
  const ws = ctx.createBufferSource();
  ws.buffer = wb;
  const wf = ctx.createBiquadFilter();
  wf.type = "bandpass";
  wf.frequency.value = 1600;
  wf.Q.value = 1.5;
  const wg = ctx.createGain();
  wg.gain.value = 0.12;
  ws.connect(wf);
  wf.connect(wg);
  wg.connect(wet);
  ws.start(t + 0.05);
}

/** Wooden shoji slide + low koto note. */
export function doors(a: AudioCore) {
  const { ctx, master } = a;
  const t = ctx.currentTime;
  const sr = ctx.sampleRate,
    nb = ctx.createBuffer(1, Math.floor(sr * 1.4), sr),
    d = nb.getChannelData(0);
  let l = 0;
  for (let i = 0; i < d.length; i++) {
    l += 0.05 * (Math.random() * 2 - 1 - l);
    d[i] = l * 4 * Math.sin((Math.PI * i) / d.length);
  }
  const s = ctx.createBufferSource();
  s.buffer = nb;
  const bp = ctx.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = 380;
  bp.Q.value = 0.8;
  const g = ctx.createGain();
  g.gain.value = 0.5;
  s.connect(bp);
  bp.connect(g);
  g.connect(master);
  s.start(t);
  koto(a, "A2", t + 0.9, 0.4);
}
