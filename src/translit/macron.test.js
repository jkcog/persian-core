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

// toMacron normalises *spelling convention* (macron vs ASCII, oo/o/u vs ū,
// consonant digraphs) for whatever sounds a transliteration actually
// encodes - it does not and cannot correct a wrong vowel choice, or recover
// a vowel length an ASCII spelling never wrote down. That's exactly why
// docs/RECONCILIATION.md resolves the 15 audited disagreements by hand
// (scripts/reconciled-entries.mjs) instead of trusting toMacron to pick a
// side. These tests cover every one of those 15 words, run through each
// repo's own original spelling, to document what toMacron actually does
// with them - not to re-derive the reconciled answer.
describe('toMacron', () => {
  it.each([
    ['چشم', 'Chashm', 'chashm'], // preserves the input's vowel choice as-is
    ['چشم', 'cheshm', 'cheshm'],
    ['غذا', 'Ghazā', 'ghazā'],
    ['برم', 'beram', 'beram'],
    ['برم', 'baram', 'baram'],
    ['بخورم', 'bokhoram', 'bokhūram'], // 'o' aligned to و is always its long sound
    ['بخورم', 'bekhoram', 'bekhūram'],
    ['دروغ', 'Dorūgh', 'dorūgh'],
    ['چون', 'chon', 'chūn'],
    ['چون', 'choon', 'chūn'],
    ['و', 'o', 'ū'],
    ['بره', 'Barreh', 'barreh'],
    ['بره', 'bere', 'bereh'], // final silent ه is always -eh canonically (docs/SPEC.md §1)
    ['بره', 'bareh', 'bareh'],
    ['رود', 'Rūd', 'rūd'],
    ['رود', 'ravad', 'ravad'],
    ['نه', 'Noh', 'noh'],
  ])('%s + %s -> %s', (persian, transliteration, expected) => {
    const { ok, canonical } = toMacron(persian, transliteration);
    expect(ok).toBe(true);
    expect(canonical).toBe(expected);
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
