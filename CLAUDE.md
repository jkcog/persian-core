# CLAUDE.md

Guidance for Claude Code when working in this repository.

## What this is

`persian-core` is the shared foundation for a small suite of Persian-learning tools by the same author:

- **noghteh** (`jkcog/noghteh`): React/Vite game that teaches letter shapes and dot placement.
- **harf-bezan** (`jkcog/harf-bezan`): static ES-module course in colloquial spoken Persian, with colour-coded morphemes.
- **finglish-subs** (`jkcog/finglish-subs`): Chrome extension (no build step, plain scripts) that shows Finglish under Persian YouTube captions.

Each repo currently carries its own transliteration rules, vocabulary and letter data, and they disagree with each other. This package exists to hold one agreed version of that shared logic and data.

## Hard constraints

1. **finglish-subs is in Chrome Web Store review. Do not modify it.** Read it only. Any adoption there happens later, by the author, after approval.
2. **finglish-subs has no bundler**, so every module that it might consume must also build to a single plain browser file (UMD/IIFE exposing a global, like its current `translit.js`). Keep this in mind when choosing the module format and build tool.
3. **Zero runtime dependencies.** Dev dependencies are fine (test runner, bundler).
4. **Never renumber or rename existing ids** in noghteh's `words.json` or harf-bezan's step ids. They key audio files and saved progress. This package may reference them but never rewrite them.
5. **Persian text handling:** always normalise Arabic ي/ك to ی/ک; ZWNJ (U+200C) is meaningful in colloquial forms (می‌خوام) and must be preserved in stored spellings and stripped only for lookup keys.
6. Don't edit the three sibling repos in this task unless the prompt for that task says to. Propose changes as patches or notes instead.

## Where things come from (read these, don't reinvent them)

- `noghteh/src/letterShaping.js`: letter joining behaviour and dot data (`LETTERS`).
- `noghteh/src/vowelSlots.js`: aligns a transliteration to its Persian spelling to locate unwritten short vowels.
- `noghteh/src/letterFamilies.js`: letters grouped by shared base shape.
- `finglish-subs/src/translit.js`, `lexicon.js`, `verbs.js`: rule-based plus lexicon transliteration, verb-form generator.
- `harf-bezan/lessons/*.json`: morpheme `parts` (`prefix`/`stem`/`ending`/negative) and colloquial verb forms.

## Working style

- Small, reviewable PRs, one concern each. Run tests and lint before declaring anything done.
- Prefer data over code: spellings and glosses live in JSON/TSV with a schema and a validator, not hard-coded in functions.
- Every lexicon entry needs a source or review status (`reviewed: true|false`). Do not mark an entry reviewed on the basis of your own judgement; native-speaker review is the author's job. When unsure of a form, flag it in a `notes` file instead of guessing, as harf-bezan does with `lNN.notes.md`.
- Homographs are real (بره = "lamb" or "he/she goes", رود = "river" or "goes"). Lexicon keys must allow multiple entries per spelling, distinguished by part of speech or register.
- When a PR changes behaviour that the sibling repos rely on, say so in the PR description.
