/** Uniform random in [a, b). Uses Math.random so the call order (and therefore seeded screenshots) matches the reference. */
export const rnd = (a: number, b: number): number => a + Math.random() * (b - a);
