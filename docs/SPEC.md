# persian-core spec (Phase 1)

This defines the one agreed romanisation, lexicon schema, and build output that
`noghteh`, `harf-bezan` and `finglish-subs` will eventually consume. No package
code exists yet — see `KICKOFF_PROMPT.md` for why. This doc is the thing to
argue with before Phase 2 starts.

Sources of truth cited below are read, not reimplemented, where a sibling repo
already solved the problem correctly: `noghteh/src/vowelSlots.js` for sound
inventory and short-vowel alignment, `noghteh/src/letterShaping.js` for the
dotted/dotless letter set. Phase 2 should port their logic rather than write
new vowel/joining rules from scratch.

## 1. Canonical romanisation

**The macron scheme is the canonical, stored form.** Everything else —
including finglish-subs' ASCII output — is derived from it. This matches
noghteh's existing convention (Bābā, Khāneh, Dorūgh) and is the only one of
the three schemes that can round-trip to a unique Persian spelling, since it's
the only one that marks vowel length.

Letters: ā, ī, ū for the three long vowels; kh, gh, sh, zh, ch for the
consonant digraphs (خ غ/ق ش ژ چ). Short vowels (a, e, o) are written plain,
with no diacritic, exactly where `vowelSlots.js` locates an unwritten short
vowel slot.

### ASCII derivation (deterministic, one-way from canonical)

| canonical | ASCII | notes |
|---|---|---|
| ā | a | macron just dropped |
| ī | ee | |
| ū | oo | |
| kh, gh, sh, zh, ch | unchanged | already ASCII-safe |
| a, e, o (short) | unchanged | |

`toAscii(canonical)` is a pure string substitution over the macron scheme —
it never needs the Persian spelling. `toMacron` is the identity (canonical
*is* the macron form); the "macron" and "canonical" names are used
interchangeably below.

### ع / ء (hamza, ain)

Per `vowelSlots.js`'s `SOUNDS` table:
- **Word-initial**: a seat for an unwritten short vowel only (اسب → Asb, آمد
  is a different letter — see below). No consonant letter is written.
- **Word-medial or -final**: an apostrophe (`'`) when actually pronounced as a
  glottal stop (رئیس → ra'īs), silent otherwise. Persian orthography doesn't
  mark this distinction reliably, so **this is a judgement call per lexicon
  entry**, not a rule — see §4, `reviewed` flag.

### ه (heh)

- **Consonant** (h) wherever it's pronounced as one: هفت → haft.
- **Final silent heh** (the -e/-eh that marks a word as ending in an open
  vowel, e.g. خانه): written **`-eh`** in both canonical and ASCII forms.
  finglish-subs' existing data is inconsistent here (`se` for سه vs. `areh`
  for آره) — persian-core picks `-eh` uniformly for determinism. **Judgement
  call**: this departs slightly from finglish-subs' historical ASCII output,
  so existing consumers that special-cased `-e` will need updating in
  whichever later task actually wires this package into finglish-subs (not
  this one — finglish-subs is untouched per the hard constraint).

### و (vāv)

Per `vowelSlots.js`: consonant **v** (word-initial or after a vowel letter),
long vowel **ū** (→ `oo` in ASCII, e.g. دوست → dūst), or **silent** (the
specific خوا- cluster: خواهر → khāhar, not khvāhar). و is never written as a
plain short `o` in the canonical form — a word that sounds like short o today
(چون "chon") still stores `chūn` canonically if that's underlyingly a long
vowel, or `ch + short o` if it's genuinely a short-vowel slot the letter و
doesn't carry. **Judgement call, needs native review per entry**: several of
the audit's disagreements (چون chon/choon, دروغ dorūgh/dorogh) are exactly
this ambiguity and are not resolved by this spec — see
`RECONCILIATION.md`.

### ی (ye)

Per `vowelSlots.js`: consonant **y** (word-initial or after a vowel letter),
long vowel **ī** (→ `ee` in ASCII), or the **iy** glide fused with an
unwritten short i (پیاز → Piyāz).

### Unwritten short vowels (a / e / o)

Not a spelling rule but an alignment problem: Persian script doesn't write
them, so the canonical spelling carries them as plain letters with no
corresponding Persian character. **Reuse `vowelSlots.js`'s `alignVowels`
algorithm verbatim** (ported, not reimplemented) to locate which consonant a
given short vowel attaches to when generating or validating a canonical
spelling from a Persian string + known vowel sequence. This is already
correct and tested inside noghteh; duplicating its logic would just add a
second place for it to drift.

## 2. Register

Colloquial and formal are not two competing spellings of "the same" entry —
they're two entries, distinguished by an explicit field:

```
register: "formal" | "colloquial"
```

Example: و "and" is `va` (formal) or `o` (colloquial) — same word, same part
of speech, same gloss, different register, two lexicon entries sharing a
`lemma`/grouping key (see schema below).

**How a learner-facing tool picks one**: harf-bezan teaches colloquial
speech, so a tool built on this package defaults to `register: "colloquial"`
and falls back to the formal entry only when no colloquial entry exists for
that lemma. A tool aimed at formal/written Persian would invert the
preference. This package does not hardcode which register "wins" — it
exposes both and lets the caller choose a default.

## 3. Lexicon entry schema

```ts
type LexiconEntry = {
  persian: string;          // ZWNJ (U+200C) preserved, e.g. "می‌خوام"
  canonical: string;        // macron-scheme romanisation, e.g. "mikhām"
  register: "formal" | "colloquial";
  pos: string;              // part of speech, e.g. "verb", "noun", "pronoun"
  gloss: string;            // short English gloss
  parts?: {                 // optional morpheme breakdown, harf-bezan's shape
    fin: string;
    role: "prefix" | "stem" | "ending" | "neg";
    gloss: string;
  }[];
  reviewed: boolean;        // true only after native-speaker review
  sources?: {                // optional provenance, never used to rewrite ids
    noghteh?: number;        // words.json id
    harfBezan?: string;      // lesson step id, e.g. "l04-01"
  };
};
```

Notes:
- **Multiple entries per Persian spelling are expected and required** —
  homographs (بره = lamb / "goes", رود = river / "goes", نه = nine / "no")
  and register pairs both produce more than one entry keyed to the same
  `persian` string. Lookup is by (persian, pos) or (persian, register), never
  by `persian` alone.
- `reviewed` defaults to `false` on import. Per `CLAUDE.md`: an entry is only
  marked `true` after the author's own native-speaker review — this package
  (and Claude) never flips it based on its own confidence. Entries the
  reconciliation pass is unsure about go in `docs/RECONCILIATION.md` as
  `needs native review` and stay `reviewed: false` until the author resolves
  them.
- `sources` is provenance only, for tracing an entry back to where it came
  from during the Phase 2 merge. It is never used to renumber or key
  anything in noghteh or harf-bezan, per the hard constraint on existing ids.

## 4. Module format and build output

- The package itself is authored as **ESM** (`import`/`export`), consumed
  directly by noghteh (Vite/React) and harf-bezan (static ES modules) with no
  build step needed on their side.
- A separate build output produces a **single UMD/IIFE bundle exposing a
  global**, matching finglish-subs' current `translit.js` pattern, for the day
  the author chooses to adopt it there (finglish-subs itself is not touched by
  this package).
- **Recommended build tool: `tsup`.** It's esbuild-based, so it's fast and
  needs no config beyond the two output formats (`esm`, `iife`) and a global
  name; it adds exactly one dev dependency and nothing at runtime, keeping the
  zero-runtime-dependency constraint intact.

## 5. Judgement calls made in this spec (flag for the author)

1. Final silent ه is always written `-eh`, never `-e`, in both canonical and
   ASCII forms — departs from finglish-subs' own (inconsistent) practice.
2. و's long-vs-short vowel value is decided per lexicon entry, not by a
   general rule; several audited words are ambiguous (see
   `RECONCILIATION.md`, `needs native review`).
3. ع/ء's apostrophe-vs-silent value word-medially is likewise decided per
   entry, not by a general rule.
4. ASCII derivation always doubles ī/ū to `ee`/`oo` rather than ever dropping
   the macron to a bare `i`/`u` — chosen to stay unambiguous against the
   short vowels `e`/`o`, even though it means ASCII length differs from
   finglish-subs' existing single-letter spellings in a few cases (e.g. `o`
   vs `oo` for او-type long vowels in colloquial forms like اومدم).
