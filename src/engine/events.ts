import type { RenCue, SectionKey, SoundCue } from "./types";

/** Events the engine emits. */
export interface EngineEvents {
  hover: SectionKey | null;
  select: SectionKey;
  miss: void;
  renSay: RenCue;
  sound: SoundCue;
  doorsOpened: void;
}

type Handler<T> = (payload: T) => void;

/** Minimal typed event emitter. */
export class Emitter<E extends object> {
  private handlers: { [K in keyof E]?: Set<Handler<E[K]>> } = {};

  on<K extends keyof E>(type: K, fn: Handler<E[K]>): () => void {
    (this.handlers[type] ??= new Set()).add(fn);
    return () => this.handlers[type]?.delete(fn);
  }

  emit<K extends keyof E>(type: K, ...payload: E[K] extends void ? [] : [E[K]]): void {
    this.handlers[type]?.forEach((fn) => fn(payload[0] as E[K]));
  }

  clear(): void {
    this.handlers = {};
  }
}
