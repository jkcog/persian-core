# Reconciliation table (Phase 1)

Generated from `node scripts/audit-translit.mjs <dir>`'s "likely homographs"
and "genuine disagreements" output (15 words total). No sibling repo is
edited here or anywhere in this PR — this table only proposes what Phase 2's
seed lexicon should do.

Confidence is mine, not native-speaker-verified; anything below "high" is
also marked `needs native review` and must stay `reviewed: false` per
`CLAUDE.md` until the author checks it.

**Author review (2026-11-25)**: the author has since weighed in on every open
item below. Where a row says "Author decision", that's settled for Phase 2 —
not because I'm claiming native-speaker confidence, but because the author
made the call. Rows still marked `needs native review` got a best guess per
the author's request ("flag for native review but also make your best guess
for now") — the guess is mine, unverified, and the flag stays.

## Homographs (not a spelling bug — two lexicon entries, not one)

| Persian | Forms | Proposed entries | Confidence |
|---|---|---|---|
| بره | noghteh=Barreh (lamb) · harf-bezan=bere ("goes") · finglish-subs=bareh ("goes") | 1) noun "lamb" → canonical `barreh` (register n/a, doubled ر from shadda). 2) verb "(that) he/she goes", subjunctive 3sg of raftan → canonical **`bereh`** (Author decision; corrected from an earlier `bere` to apply `SPEC.md` §1's final-ه-is-always-`-eh` rule consistently — caught by `toMacron`'s own output while building the Phase 2 seed). | High on the homograph split. Verb form: harf-bezan's own paradigm is consistently e-final for this ending (boro/beram/berim/**bere**/berid — see `harf-bezan/lessons/l02.json:692`), and it matches the برم decision below (beram over baram), so `bereh` over `bareh` is the internally-consistent pick. finglish-subs' `bareh` is the one to treat as the spelling bug. |
| رود | noghteh=Rūd (river) · finglish-subs=ravad ("goes") | 1) noun "river" → canonical `rūd`. 2) verb "goes", 3sg present formal of raftan (consistent with finglish-subs' own `rūm`/`ravam` "I go" pattern). | High. |
| نه | noghteh=Noh (nine) · harf-bezan=na ("no") · finglish-subs=na ("no") | 1) number "nine" → canonical `noh`. 2) particle "no" → canonical `na`. harf-bezan and finglish-subs already agree on the "no" spelling. | High. |

## Genuine disagreements (same or unknown gloss — one of these is likely wrong)

| Persian | Forms | Proposed canonical | Likely-wrong repo | Confidence |
|---|---|---|---|---|
| چشم (eye) | noghteh=Chashm · finglish-subs=cheshm | `cheshm` (Author decision — proceed) | noghteh | High — چشم is pronounced with e, not a; noghteh's "Chashm" looks like a transcription slip. |
| غذا (food) | noghteh=Ghazā · finglish-subs=gheza | `ghazā` (Author decision — proceed) | finglish-subs | High — غذا is ghazā (stress on zā); finglish-subs' "gheza" has the wrong first vowel. |
| برم ((that) I go) | harf-bezan=beram · finglish-subs=baram | `beram` (Author decision — proceed) | finglish-subs | Medium-high — harf-bezan's own subjunctive paradigm for this verb is consistently e-stem (بره=bere, بریم=berim, بری=beri would follow); finglish-subs' "baram" is the outlier. |
| بخورم ((that) I eat) | harf-bezan=bokhoram · finglish-subs=bekhoram | `bokhoram` (Author decision) | finglish-subs | Author's own native intuition settles this one — "bokhoram feels correct." Also consistent with be-/bo- being an allomorph that surfaces as bo- before this stem (bokhor-, boro-, vs. bekon-, bezan- elsewhere); `bekhoram` is the one to drop. |
| دروغ (lie) | noghteh=Dorūgh · finglish-subs=dorogh | Best guess: **`dorūgh`** (long ū) — **needs native review** | finglish-subs (tentatively) | Low-medium. دروغ is widely said with a long vowel (dorūgh/"doroogh"), matching noghteh; finglish-subs' short "dorogh" is my tentative pick for the error, but I'm not confident enough to mark this reviewed. |
| چون (because) | harf-bezan=chon · finglish-subs=choon | Revised best guess: **`chūn`** (long ū) — **needs native review** | neither — see note | Low-medium on the *vowel length itself* (that's the native-review question), but high confidence this was never a cross-repo disagreement at all: `toMacron` (`src/translit/macron.js`) converts both `chon` and `choon` to the identical `chūn`, discovered while building the Phase 2 seed. harf-bezan and finglish-subs just used different ASCII spellings of the same long vowel — this word would sit in the "style only" table below if I were redoing the audit's classification today. |
| و (and) | harf-bezan=o (colloquial) · finglish-subs=va (formal) | both, as a register pair | — | Not a bug — see `SPEC.md` §2. This is the canonical example of the register field: `o` is `register: "colloquial"`, `va` is `register: "formal"`, same lemma. |

## Style only, not a bug (already covered by `SPEC.md`'s canonical/ASCII rules)

These showed up in the "genuine disagreements" bucket because the audit
script's loose-fold heuristic doesn't normalise every style axis, but each is
explained by one of the conventions §1 of `SPEC.md` settles:

| Persian | Forms | Explanation |
|---|---|---|
| چای (tea) | noghteh=Chāy · finglish-subs=chai | ay vs ai spelling of the same diphthong; canonical form is `chāy` (ā + y), ASCII derivation gives `chay`, not `chai` — a one-letter departure from finglish-subs' existing spelling, noted in `SPEC.md` §5. |
| اومدم (I came, colloq.) | harf-bezan=omadam · finglish-subs=oomadam | harf-bezan's documented practice of writing colloquial long vowels as a single letter rather than doubling (see `persian-core/CLAUDE.md`'s note on harf-bezan dropping the macron on u). Canonical form carries the macron (`ūmadam`); both `omadam` and `oomadam` are informal renderings of it. |
| آره (yeah, colloq.) | harf-bezan=āre · finglish-subs=areh | Macron presence (harf-bezan) and final -eh (finglish-subs) are independent style choices that happen to combine here. Canonical: `āreh` (macron **and** final -eh, per `SPEC.md` §1). |
| کی (who/when) | harf-bezan=key · finglish-subs=ki | "key" is an English-spelling-inspired rendering of the same long ī sound as "ki"; canonical is `kī`, ASCII derivation gives `kee`. |
| سه (three) | noghteh=Seh · finglish-subs=se | Final -eh vs -e, same axis as آره above. Canonical: `seh`. |

## Summary

- 3 homographs, cleanly separated by gloss (high confidence on the split).
- 1 of those 3 had a nested real spelling disagreement (بره's verb sense) —
  resolved by the author to `bereh`.
- 4 settled by author decision, ready for Phase 2 (چشم, غذا, برم, بخورم).
- 2 flagged `needs native review`, with a best guess to use meanwhile
  (دروغ → `dorūgh`, چون → `chūn`).
- 1 genuine register pair, not a bug (و).
- 5 explained entirely by canonical/ASCII conventions already in `SPEC.md`.

None of these are marked `reviewed: true` in the sense `CLAUDE.md` means —
that flag is reserved for the author's own native-speaker check of the
*lexicon entry itself* when Phase 2 builds the seed data. "Author decision"
above means the author chose which spelling the seed lexicon should carry;
it doesn't pre-empt that later review.
