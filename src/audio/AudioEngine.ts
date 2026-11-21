import { Composition } from "./composition";
import { createCore, type AudioCore } from "./core";
import * as sfx from "./sfx";

/**
 * Generative koto soundscape: Karplus-Strong koto playing Sakura Sakura with interludes, shakuhachi,
 * wind chimes and a night-wind bed, plus SFX. Created lazily on the first user gesture.
 */
export class AudioEngine {
  private core: AudioCore | null = null;
  private comp: Composition | null = null;
  private timer: ReturnType<typeof setInterval> | undefined;
  private _on = false;

  get on() {
    return this._on;
  }

  private init(): boolean {
    if (this.core) return true;
    this.core = createCore();
    if (!this.core) return false;
    this.comp = new Composition(this.core);
    return true;
  }

  start(): boolean {
    if (!this.init()) return false;
    const { ctx, master } = this.core!;
    void ctx.resume();
    if (this._on) return true;
    this._on = true;
    this.comp!.reset(ctx.currentTime + 0.4);
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0.8, ctx.currentTime + 2);
    clearInterval(this.timer);
    this.timer = setInterval(() => this._on && this.comp!.pump(), 60);
    return true;
  }

  stop() {
    if (!this.core) return;
    this._on = false;
    this.core.master.gain.setTargetAtTime(0, this.core.ctx.currentTime, 0.4);
    clearInterval(this.timer);
    this.comp!.reset(0);
  }

  /** Lower the music while Ren speaks. */
  duck(d: boolean) {
    if (!this.core) return;
    this.core.master.gain.setTargetAtTime(d ? 0.28 : this._on ? 0.8 : 0, this.core.ctx.currentTime, 0.25);
  }

  private play(fn: (a: AudioCore) => void) {
    if (this.core && this._on) fn(this.core);
  }
  tok = () => this.play(sfx.tok);
  tick = () => this.play(sfx.tick);
  chime = () => this.play(sfx.chime);
  clack = () => this.play(sfx.clack);
  doors = () => this.play(sfx.doors);

  dispose() {
    this.stop();
    void this.core?.ctx.close();
    this.core = null;
  }
}
