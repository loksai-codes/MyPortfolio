import { NOTE, type AudioCore } from "./core";

const cache = new Map<string, AudioBuffer>();

/** Karplus-Strong plucked string with a tsume (plectrum) excitation near the bridge. Cached per frequency. */
function ksBuffer(ctx: BaseAudioContext, f: number): AudioBuffer {
  const key = f.toFixed(2);
  const hit = cache.get(key);
  if (hit && hit.sampleRate === ctx.sampleRate) return hit;
  const sr = ctx.sampleRate,
    len = Math.floor(sr * (f < 200 ? 5 : 3.6)),
    buf = ctx.createBuffer(1, len, sr),
    y = buf.getChannelData(0);
  const P = sr / f,
    N = Math.floor(P),
    frac = P - N;
  // excitation: bright plectrum noise with pluck-position comb
  const ex = new Float32Array(N + 2);
  let lp = 0;
  for (let i = 0; i < N + 2; i++) {
    const r = Math.random() * 2 - 1;
    lp = lp + 0.72 * (r - lp);
    ex[i] = lp;
  }
  const pp = Math.max(1, Math.floor(N * 0.13));
  for (let i = N + 1; i >= pp; i--) ex[i]! -= ex[i - pp]! * 0.9;
  for (let i = 0; i < N + 2 && i < len; i++) y[i] = ex[i]! * 0.9;
  const decay = f < 200 ? 0.9985 : f < 400 ? 0.9975 : 0.9962;
  for (let n = N + 2; n < len; n++) {
    const a = y[n - N]!,
      b = y[n - N - 1]!,
      c = y[n - N - 2]!;
    const d = a * (1 - frac) + b * frac,
      e = b * (1 - frac) + c * frac;
    y[n] = decay * (0.5 * (d + e));
  }
  // short tsume click
  for (let i = 0; i < 60 && i < len; i++) y[i]! += (Math.random() * 2 - 1) * 0.25 * (1 - i / 60);
  // fade tail
  for (let i = len - 2000; i < len; i++) y[i]! *= (len - i) / 2000;
  cache.set(key, buf);
  return buf;
}

export interface KotoOpts {
  /** Oshide pitch bend: [startOffset, semitones, releaseTime?]. */
  bend?: [number, number, number?];
  /** Vibrato ramp-in time (s). */
  vib?: number;
}

/** Play one koto note at time t. */
export function koto(a: AudioCore, n: string | number, t: number, v = 0.5, opt: KotoOpts = {}) {
  const { ctx, bus } = a;
  const f = typeof n === "number" ? n : NOTE(n);
  const src = ctx.createBufferSource();
  src.buffer = ksBuffer(ctx, f);
  const g = ctx.createGain();
  g.gain.value = v;
  const pan = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
  if (opt.bend) {
    // oshide: press string to raise pitch
    const [s, semis, rel] = opt.bend;
    src.playbackRate.setValueAtTime(1, t + s);
    src.playbackRate.linearRampToValueAtTime(Math.pow(2, semis / 12), t + s + 0.14);
    if (rel) src.playbackRate.linearRampToValueAtTime(1, t + rel);
  }
  if (opt.vib) {
    const lfo = ctx.createOscillator(),
      lg = ctx.createGain();
    lfo.frequency.value = 5.2;
    lg.gain.setValueAtTime(0, t);
    lg.gain.linearRampToValueAtTime(14, t + opt.vib);
    lfo.connect(lg);
    lg.connect(src.detune);
    lfo.start(t);
    lfo.stop(t + opt.vib + 2.5);
  }
  src.connect(g);
  if (pan) {
    pan.pan.value = Math.max(-0.6, Math.min(0.6, Math.log2(f / 440) * 0.35));
    g.connect(pan);
    pan.connect(bus);
  } else g.connect(bus);
  src.start(t);
  src.stop(t + (f < 200 ? 5 : 3.6));
}
