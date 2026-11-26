import { describe, expect, it } from 'vitest';
import { subjunctivePrefix } from './prefixHarmony.js';

describe('subjunctivePrefix', () => {
  it.each([
    ['kon', 'bo'], // بکنم -> bokonam (kardan)
    ['khor', 'bo'], // بخورم -> bokhoram (khordan)
    ['goy', 'be'], // بگویم -> begoyam, not bogoyam, despite the same CoC shape as kon/khor
    ['rav', 'be'], // بروم -> beravam (raftan's formal stem; boro is a separate irregular override)
    ['r', 'be'], // بریم -> berim (raftan's bare colloquial stem has no vowel of its own)
    ['toon', 'be'], // بتونم -> betoonam: long ū spelled "oo", not the short o that triggers rounding
    ['gir', 'be'],
  ])('subjunctivePrefix(%s) -> %s', (stem, expected) => {
    expect(subjunctivePrefix(stem)).toBe(expected);
  });
});
