import { describe, expect, it } from 'vitest';
import { toAscii, toMacron } from './macron.js';

describe('toAscii', () => {
  it.each([
    ['bābā', 'baba'],
    ['khāneh', 'khaneh'],
    ['dorūgh', 'doroogh'],
    ['shīrīn', 'sheereen'],
    ['mikhām', 'mikham'],
    ['cheshm', 'cheshm'], // no macrons: unchanged
  ])('derives %s -> %s', (canonical, ascii) => {
    expect(toAscii(canonical)).toBe(ascii);
  });
});

// toMacron normalises *spelling convention* (macron vs ASCII, oo/u vs ū,
// consonant digraphs) for whatever sounds a transliteration actually
// encodes - it does not and cannot correct a wrong vowel choice, or recover
// a vowel length an ASCII spelling never wrote down. A bare 'o' for و is a
// special case of that last point: it's genuinely ambiguous between long
// and short (see the SOUNDS table in vowelSlots.js), so toMacron flags it
// (`ambiguous: true`) rather than guessing. That's exactly why
// docs/RECONCILIATION.md resolves the 15 audited disagreements by hand
// (scripts/reconciled-entries.mjs) instead of trusting toMacron to pick a
// side. These tests cover every one of those 15 words, run through each
// repo's own original spelling, to document what toMacron actually does
// with them - not to re-derive the reconciled answer.
describe('toMacron', () => {
  it.each([
    ['چشم', 'Chashm', 'chashm', false], // preserves the input's vowel choice as-is
    ['چشم', 'cheshm', 'cheshm', false],
    ['غذا', 'Ghazā', 'ghazā', false],
    ['برم', 'beram', 'beram', false],
    ['برم', 'baram', 'baram', false],
    // a bare 'o' for و is genuinely ambiguous between long and short (not
    // just a spelling convention) - بخورم really is short, but toMacron
    // can't know that from the spelling alone, so it defaults to the long
    // reading (unchanged from before) and now honestly flags it instead of
    // guessing silently. See docs/RECONCILIATION.md and reconciled-entries.mjs.
    ['بخورم', 'bokhoram', 'bokhūram', true],
    ['بخورم', 'bekhoram', 'bekhūram', true],
    ['دروغ', 'Dorūgh', 'dorūgh', false],
    ['چون', 'chon', 'chūn', true], // same ambiguity - چون is also genuinely short (see reconciled-entries.mjs), toMacron still can't tell
    ['چون', 'choon', 'chūn', false], // explicit 'oo' is unambiguously long
    ['و', 'o', 'ū', true],
    ['بره', 'Barreh', 'barreh', false],
    ['بره', 'bere', 'bereh', false], // final silent ه is always -eh canonically (docs/SPEC.md §1)
    ['بره', 'bareh', 'bareh', false],
    ['رود', 'Rūd', 'rūd', false],
    ['رود', 'ravad', 'ravad', false],
    ['نه', 'Noh', 'noh', false],
  ])('%s + %s -> %s', (persian, transliteration, expected, ambiguous) => {
    const result = toMacron(persian, transliteration);
    expect(result.ok).toBe(true);
    expect(result.canonical).toBe(expected);
    expect(result.ambiguous).toBe(ambiguous);
  });

  // Three of the fifteen can't be aligned at all - each for a different
  // honest reason - and that's exactly why they needed a hand decision:
  it('cannot recover a vowel غذا "gheza" never wrote down (needs the ا to be long)', () => {
    expect(toMacron('غذا', 'gheza').ok).toBe(false);
  });

  it('cannot place a trailing short vowel with no letter after it (و "va")', () => {
    expect(toMacron('و', 'va').ok).toBe(false);
  });

  it('cannot read ه as a plain "a" (نه "na" - ه is never a long-a letter)', () => {
    expect(toMacron('نه', 'na').ok).toBe(false);
  });

  it('reports ok:false when the transliteration does not match the word at all', () => {
    expect(toMacron('کتاب', 'xyz')).toEqual({ ok: false, canonical: null, ambiguous: false });
  });

  it('strips ZWNJ before aligning, but still aligns correctly either side of it', () => {
    const { ok, canonical } = toMacron('می‌خواستم', 'mikhāstam');
    expect(ok).toBe(true);
    expect(canonical).toBe('mīkhāstam');
  });
});
