/** Shared Web Audio graph handed to every instrument. */
export interface AudioCore {
  ctx: AudioContext;
  /** Final gain (into compressor → destination). */
  master: GainNode;
  /** Koto body bus (wooden resonance EQ → dry + hall reverb). */
  bus: GainNode;
  /** Hall reverb send. */
  wet: GainNode;
}

/** Note name ("A4", "C#5", "Bb3") → frequency in Hz (A4 = 440). */
export const NOTE = (n: string): number => {
  const m: Record<string, number> = { C: -9, D: -7, E: -5, F: -4, G: -2, A: 0, B: 2 };
  const oct = +n.slice(-1);
  const acc = n[1] === "#" ? 1 : n[1] === "b" ? -1 : 0;
  return 440 * Math.pow(2, (m[n[0]!]! + acc + (oct - 4) * 12) / 12);
};

/** Build the master chain, koto body, hall reverb and the quiet night-wind bed. */
export function createCore(): AudioCore | null {
  const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  const ctx = new AC();
  const master = ctx.createGain();
  master.gain.value = 0;
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -16;
  comp.ratio.value = 6;
  comp.attack.value = 0.003;
  comp.release.value = 0.25;
  master.connect(comp);
  comp.connect(ctx.destination);
  // koto body: wooden resonances
  const bus = ctx.createGain();
  const b1 = ctx.createBiquadFilter();
  b1.type = "peaking";
  b1.frequency.value = 230;
  b1.Q.value = 1.2;
  b1.gain.value = 4;
  const b2 = ctx.createBiquadFilter();
  b2.type = "peaking";
  b2.frequency.value = 1100;
  b2.Q.value = 1.4;
  b2.gain.value = 3;
  const b3 = ctx.createBiquadFilter();
  b3.type = "highshelf";
  b3.frequency.value = 4500;
  b3.gain.value = -6;
  bus.connect(b1);
  b1.connect(b2);
  b2.connect(b3);
  const dry = ctx.createGain();
  dry.gain.value = 0.85;
  b3.connect(dry);
  dry.connect(master);
  // hall reverb with pre-delay
  const conv = ctx.createConvolver(),
    sr = ctx.sampleRate,
    L = Math.floor(sr * 3.4),
    ir = ctx.createBuffer(2, L, sr);
  for (let c = 0; c < 2; c++) {
    const d = ir.getChannelData(c);
    let lp = 0;
    for (let i = 0; i < L; i++) {
      lp += 0.35 * (Math.random() * 2 - 1 - lp);
      d[i] = lp * Math.pow(1 - i / L, 3.2) * (i < sr * 0.012 ? 0 : 1);
    }
  }
  conv.buffer = ir;
  const wet = ctx.createGain();
  wet.gain.value = 0.42;
  const pre = ctx.createDelay();
  pre.delayTime.value = 0.025;
  b3.connect(pre);
  pre.connect(wet);
  wet.connect(conv);
  conv.connect(master);
  // night wind bed (very quiet)
  const nb = ctx.createBuffer(1, sr * 4, sr),
    nd = nb.getChannelData(0);
  let l2 = 0;
  for (let i = 0; i < nd.length; i++) {
    l2 += 0.02 * (Math.random() * 2 - 1 - l2);
    nd[i] = l2 * 3;
  }
  const ns = ctx.createBufferSource();
  ns.buffer = nb;
  ns.loop = true;
  const nf = ctx.createBiquadFilter();
  nf.type = "lowpass";
  nf.frequency.value = 700;
  const windG = ctx.createGain();
  windG.gain.value = 0.035;
  ns.connect(nf);
  nf.connect(windG);
  windG.connect(master);
  ns.start();
  const wl = ctx.createOscillator(),
    wlg = ctx.createGain();
  wl.frequency.value = 0.08;
  wlg.gain.value = 0.02;
  wl.connect(wlg);
  wlg.connect(windG.gain);
  wl.start();
  return { ctx, master, bus, wet };
}
