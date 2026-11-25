# persian-core

Shared transliteration, lexicon and letter data for `noghteh`, `harf-bezan`
and `finglish-subs`. See `docs/SPEC.md` for the romanisation scheme and
lexicon schema this package implements, and `docs/RECONCILIATION.md` for how
the sibling repos' spelling disagreements were resolved.

## Install / build

```
npm install
npm run build   # dist/index.js (ESM) and dist/persian-core.global.js (IIFE, global `PersianCore`)
npm run lint
npm run test:ci
```

Zero runtime dependencies - the two build outputs are the whole public
surface, one for bundler-based consumers (noghteh, harf-bezan), one for
finglish-subs' bundler-less future adoption (not wired in here; see
`CLAUDE.md`'s hard constraints).

## API

```js
import { toAscii, toMacron, validateEntry, lookup, all } from 'persian-core';

toAscii('khāneh');              // 'khaneh'
toMacron('چون', 'choon');       // { ok: true, canonical: 'chūn', ambiguous: false }
lookup('بره');                  // both homograph entries: lamb (noun) and "(that) he/she goes" (verb)
validateEntry({ persian: 'کتاب', canonical: 'ketāb', register: 'formal', pos: 'noun', gloss: 'book', reviewed: false });
```

- `toMacron(persian, transliteration)` converts *any* existing spelling (ASCII,
  macron, or mixed) into the canonical macron form, by aligning sounds rather
  than guessing word by word - see `src/translit/macron.js`. It can't recover
  information an ASCII spelling never wrote down (vowel length); when it
  can't align confidently it returns `{ ok: false }` or `ambiguous: true`
  rather than a guess.
- `lookup(persian, { pos, register })` and `all()` read the seed lexicon
  (`src/lexicon/seed.json`, 615 entries). Every entry is `reviewed: false`;
  `src/lexicon/seed.notes.md` lists which ones are a guess and why.

## Regenerating the seed lexicon

```
node scripts/build-seed.mjs <dir-containing-noghteh,-harf-bezan,-finglish-subs>
```

Rebuilds `src/lexicon/seed.json` and `src/lexicon/seed.notes.md` from the
three sibling repos. The 15 disagreements audited in `docs/RECONCILIATION.md`
are hardcoded in `scripts/reconciled-entries.mjs` rather than re-derived -
keep the two in sync by hand (`src/lexicon/seed.test.js` checks they agree).
`scripts/audit-translit.mjs` is the original cross-repo audit that found
them, kept for re-auditing after any sibling repo's vocabulary changes.
