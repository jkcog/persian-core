// The subjunctive/imperative prefix be- is lexically conditioned, not a free
// phonological rule. It rounds to bo- before a handful of common monosyllabic
// stems (kon, khor) but not others that are phonologically identical in shape
// (goy/goo stays begoo, never bogoo; toon/doon keep be- too, since their
// vowel is long ū spelled "oo", not short o) - so this is an explicit list
// to extend with attested forms, not a regex to derive it from the stem's
// shape. raftan's boro is a separate, fully irregular imperative stem and is
// not part of this table.
const BO_STEMS = new Set(['kon', 'khor']);

/** 'be' or 'bo' for the subjunctive/imperative prefix attached to this Latin verb stem. */
export const subjunctivePrefix = (stemLatin) => (BO_STEMS.has(stemLatin) ? 'bo' : 'be');
