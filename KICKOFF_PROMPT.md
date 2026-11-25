
You're starting `persian-core`, the shared foundation for three Persian-learning tools: noghteh, harf-bezan and finglish-subs. Read `CLAUDE.md` first, then read the files it lists under "Where things come from". Don't write code until you've done that.

**Context.** Each of the three repos has its own romanisation scheme and vocabulary. noghteh uses macrons (Bābā, Khāneh, Dorūgh). harf-bezan says it matches noghteh but writes colloquial forms and drops the macron on u ("unjā"). finglish-subs uses ASCII (oon, khaam, chai). A first audit (`node scripts/audit-translit.mjs ..`) found 102 words shared between repos; only 11 are spelled identically, 76 differ only in style (macrons, oo vs ū), and 15 differ in vowels or register. Some of those 15 are real bugs (e.g. غذا is "gheza" in finglish-subs but "Ghazā" in noghteh; چشم is "Chashm" in noghteh but "cheshm" in finglish-subs; برم is "beram" vs "baram"), some are homograph artefacts (بره lamb vs bere "goes"; رود river vs ravad), and some are genuine register differences (formal vs colloquial). I need to separate those three kinds.

**Phase 1: spec and audit, no package code yet. Deliver as one PR.**

1. Run the audit script and read its output. Improve it if it's misleading (e.g. make it detect homographs, and report per-repo counts of words that no other repo has). Keep it runnable with plain `node`.
2. Write `docs/SPEC.md` defining:
   - the canonical romanisation: macron scheme as the source of truth (ā, ī, ū, plus kh, gh, sh, zh, ch), and how ASCII output (oo, ee, aa-less `a`) is derived from it deterministically, so one stored spelling produces both. Decide how ع/ء, ه (final -eh vs -e), و (v/ū/o/ow), ی (y/ī/iy) and the unwritten short vowels (a/e/o) are handled, and list the cases where you're making a judgement call.
   - register: colloquial vs formal as an explicit field, not two competing spellings. Say how a learner-facing tool picks one.
   - the lexicon entry schema: persian (with ZWNJ preserved), canonical romanisation, register, part of speech, gloss, optional morpheme `parts` in harf-bezan's format, `reviewed` flag, optional source ids from noghteh/harf-bezan. Multiple entries per spelling must be allowed.
   - the module format and build output (ESM for the React and static apps; a single UMD/IIFE file for finglish-subs). Recommend a build tool and justify it in two sentences.
3. Produce `docs/RECONCILIATION.md`: a table of every genuine disagreement from the audit with your proposed canonical form, which repo is likely wrong, and your confidence. Mark anything you are not confident about as `needs native review`. Do not change any of the sibling repos.
4. Stop and summarise. List the open decisions that I need to make. Do not start Phase 2.

**Don't** refactor or move code from the other repos yet, don't touch finglish-subs, and don't invent corrections for spellings you're unsure of; flag them.

**Phase 2 (only after I approve the spec):** a package skeleton with the lexicon schema and a validator, a seed lexicon merged from all three repos' data using the reconciliation table, and `toMacron` / `toAscii` functions with tests that include every disagreement from the audit. I'll give you more detail then.

Before you start, enter plan mode and tell me your plan for Phase 1.


## Why it's shaped this way

- The first phase has no package code, so the design decisions get reviewed before anything depends on them.
- finglish-subs is fenced off in the constraints, because it's under store review.
- The "needs native review" rule matches how harf-bezan already handles unsure forms.
- Phase 2 is only sketched; reading trainer and frequency builder come after the core API exists, and can then go to parallel sub-agents.
