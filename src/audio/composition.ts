import { bell } from "./bell";
import type { AudioCore } from "./core";
import { koto, type KotoOpts } from "./koto";
import { shakuhachi } from "./shakuhachi";

type Event = [time: number, play: () => void];
type Phrase = [note: string, beats: number][];

const BEAT = 0.78;
const P1: Phrase = [
  ["A4", 1],
  ["A4", 1],
  ["B4", 2],
];
const P2: Phrase = [
  ["A4", 1],
  ["B4", 1],
  ["C5", 1],
  ["B4", 1],
  ["A4", 1],
  ["B4", 0.5],
  ["A4", 0.5],
  ["F4", 2],
];
const P3: Phrase = [
  ["E4", 1],
  ["C4", 1],
  ["E4", 1],
  ["F4", 1],
  ["E4", 1],
  ["E4", 0.5],
  ["C4", 0.5],
  ["B3", 2],
];
const END: Phrase = [
  ["E4", 1],
  ["F4", 1],
  ["B4", 0.5],
  ["A4", 0.5],
  ["F4", 1],
  ["E4", 4],
];
/** Sakura Sakura (miyako-bushi scale). */
const SAKURA: Phrase = [...P1, ...P1, ...P2, ...P3, ...P2, ...P3, ...P1, ...P1, ...END];
const SCALE = ["E3", "F3", "A3", "B3", "C4", "E4", "F4", "A4", "B4", "C5", "E5", "F5", "A5"];

const shift = (n: string, oct: number) => n.slice(0, -1) + (+n.slice(-1) + oct);

/**
 * Generative score: sharara glissando → Sakura Sakura (with bass, octave doubles, oshide bends and vibrato)
 * → improvised koto interlude with a shakuhachi drone → repeat. Events are queued with their start time
 * captured per note (`const tt`), then a 60 ms pump schedules everything due in the next 0.5 s.
 */
export class Composition {
  private queue: Event[] = [];
  private cursor = 0;
  private cycle = 0;

  constructor(private a: AudioCore) {}

  reset(at: number) {
    this.queue = [];
    this.cursor = at;
  }

  private k = (n: string, t: number, v: number, o?: KotoOpts) => koto(this.a, n, t, v, o);

  private sharara(t: number, from = 2, to = 12, step = 0.055, v = 0.22) {
    for (let i = from; i <= to; i++) this.k(SCALE[i]!, t + (i - from) * step, v * (0.6 + (0.4 * (i - from)) / (to - from)));
  }

  private addSakura(t0: number, oct = 0, vol = 1) {
    let t = t0,
      beat = 0;
    SAKURA.forEach(([n, d]) => {
      const name = oct ? shift(n, oct) : n;
      const long = d >= 2,
        tt = t,
        bb = beat;
      const op: KotoOpts = long ? (Math.random() < 0.5 ? { vib: 0.5 } : { bend: [d * BEAT * 0.45, 1, d * BEAT * 0.8] }) : {};
      this.queue.push([tt, () => this.k(name, tt, 0.55 * vol, op)]);
      if (bb % 4 === 0) this.queue.push([tt, () => this.k(shift(n, oct - 1), tt + 0.012, 0.28 * vol)]);
      if (bb % 4 === 0) {
        const lo = ["A2", "E3", "A2", "F3"][Math.floor(bb / 4) % 4]!;
        this.queue.push([tt, () => this.k(lo, tt, 0.32 * vol)]);
      }
      if (long && Math.random() < 0.35) this.queue.push([tt + BEAT, () => this.k(name, tt + BEAT, 0.18 * vol)]);
      t += d * BEAT;
      beat += d;
    });
    return t;
  }

  private addInterlude(t0: number, bars = 4) {
    let t = t0,
      idx = 7;
    {
      const ts = t,
        sn = Math.random() < 0.5 ? "A4" : "E4";
      this.queue.push([ts, () => shakuhachi(this.a, sn, ts, BEAT * 6, 0.04)]);
    }
    for (let b = 0; b < bars; b++) {
      const tb = t,
        root = ["A2", "E3"][b % 2]!;
      this.queue.push([tb, () => this.k(root, tb, 0.3)]);
      let beat = 0;
      while (beat < 4) {
        const d = [1, 1, 0.5, 0.5, 2, 1.5][Math.floor(Math.random() * 6)]!;
        if (beat + d > 4) break;
        idx = Math.max(4, Math.min(11, idx + [-2, -1, -1, 1, 1, 2, 0][Math.floor(Math.random() * 7)]!));
        const tt = tb + beat * BEAT,
          nm = SCALE[idx]!,
          op: KotoOpts = d >= 1.5 ? { bend: [d * BEAT * 0.5, 1, d * BEAT * 0.9] } : {};
        if (Math.random() < 0.8) this.queue.push([tt, () => this.k(nm, tt, 0.4, op)]);
        beat += d;
      }
      if (b === 1 && Math.random() < 0.6) {
        const tg = tb + BEAT * 3.4;
        this.queue.push([tg, () => this.sharara(tg, 4, 11, 0.05, 0.16)]);
      }
      t += 4 * BEAT;
    }
    const te = t;
    this.queue.push([te, () => this.k("A4", te, 0.45, { vib: 0.4 })]);
    this.queue.push([te, () => this.k("A3", te + 0.01, 0.3)]);
    return t + 2 * BEAT;
  }

  private compose(t: number) {
    {
      const ts = t;
      this.queue.push([ts, () => this.sharara(ts)]);
    }
    t += BEAT * 2.5;
    t = this.addSakura(t, 0, this.cycle % 2 ? 0.8 : 1);
    t += BEAT;
    t = this.addInterlude(t, 4);
    t += BEAT;
    this.cycle++;
    return t;
  }

  /** Call every ~60 ms while playing. */
  pump() {
    const now = this.a.ctx.currentTime;
    if (this.cursor < now + 3) this.cursor = this.compose(Math.max(this.cursor, now + 0.15));
    this.queue.sort((x, y) => x[0] - y[0]);
    while (this.queue.length && this.queue[0]![0] < now + 0.5) this.queue.shift()![1]();
    if (Math.random() < 0.004) bell(this.a, now + 0.3);
  }
}
