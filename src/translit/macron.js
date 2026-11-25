import { alignVowels } from './vowelSlots.js';

// ASCII derivation table from docs/SPEC.md §1 - a pure substitution over the
// canonical macron scheme. Consonant digraphs (kh/gh/sh/zh/ch) and the plain
// short vowels (a/e/o) are already ASCII-safe and pass through unchanged.
const ASCII_MAP = { ā: 'a', ī: 'ee', ū: 'oo' };

/** Deterministic ASCII rendering of a canonical (macron-scheme) spelling. */
export const toAscii = (canonical) =>
  canonical
    .normalize('NFC')
    .replace(/[āīū]/g, (ch) => ASCII_MAP[ch]);

// Canonical long-vowel spelling for a letter, independent of how an
// existing transliteration happened to spell the same sound (o/oo/ū all
// collapse to ū; e/eh both collapse to eh - see docs/SPEC.md §1).
const LONG_VOWEL_FOR = { ا: 'ā', آ: 'ā', و: 'ū', ی: 'ī', ه: 'eh' };

/**
 * Converts any existing transliteration of a Persian word into the
 * canonical macron spelling, using `alignVowels` (ported from noghteh's
 * vowelSlots.js) to work out which Persian letter each sound belongs to.
 * The input can be in any of the three sibling repos' own schemes - ASCII,
 * mixed, or already macron - since `alignVowels`'s sound table treats all
 * of their spellings of a given sound as the same sound.
 *
 * Returns { ok, canonical, ambiguous }. `ok` is false when nothing aligns
 * (the input doesn't match this Persian spelling at all); `ambiguous` is
 * true when alignment succeeded but more than one equally-simple reading
 * exists - callers should treat that as a guess needing review, not a
 * confident answer.
 */
export const toMacron = (persian, transliteration) => {
  // ZWNJ is a rendering joiner, never a sound - strip it before aligning,
  // same as lookup keys do (persian-core/CLAUDE.md), but here even for the
  // stored spelling: canonical romanisation has nothing to represent it with.
  const clean = persian.normalize('NFC').replace(/‌/g, '');
  const chars = [...clean];
  const aligned = alignVowels(clean, transliteration);
  if (!aligned.ok) return { ok: false, canonical: null, ambiguous: false };

  let canonical = '';
  chars.forEach((ch, i) => {
    const letter = aligned.letters[i];
    const slot = aligned.slots.find((s) => s.on === i);
    if (letter.kind === 'carrier') {
      canonical += slot ? slot.vowel : '';
      return;
    }
    if (letter.kind === 'consonant') canonical += letter.latin;
    else if (letter.kind === 'long') canonical += LONG_VOWEL_FOR[ch];
    // 'silent' contributes nothing.
    if (slot) canonical += slot.vowel;
  });

  return { ok: true, canonical, ambiguous: aligned.ambiguous };
};
