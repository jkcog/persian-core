// Builds src/lexicon/seed.json from the three sibling repos: the 15 audited
// disagreements come from ./reconciled-entries.mjs (already decided by hand
// per docs/RECONCILIATION.md), everything else is converted algorithmically
// with toMacron (src/translit/macron.js). Every entry not sourced purely
// from noghteh - or where toMacron couldn't confidently align - is listed
// in src/lexicon/seed.notes.md as `needs native review`, matching
// harf-bezan's own lNN.notes.md convention for unsure forms (CLAUDE.md).
//
// Usage: node scripts/build-seed.mjs <dir-containing-the-three-repos>
// (same convention as scripts/audit-translit.mjs - finglish-subs doesn't
// have to be a direct sibling on disk, just reachable under <dir>.)

import { readFileSync, existsSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { toMacron } from '../src/translit/macron.js';
import { validateEntry } from '../src/lexicon/schema.js';
import { RECONCILED_KEYS, RECONCILED_ENTRIES } from './reconciled-entries.mjs';
import { KNOWN_LETTERS } from '../src/translit/vowelSlots.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(process.argv[2] ?? '..');
const require = createRequire(import.meta.url);
const need = (p) => {
  if (!existsSync(p)) {
    console.error('missing: ' + p);
    process.exit(1);
  }
  return p;
};

const ZWNJ = /‌/g;
const normFa = (s) => s.normalize('NFC').replace(ZWNJ, '').replace(/ي/g, 'ی').replace(/ك/g, 'ک').trim();
// Single Persian words only - drops punctuation-attached tokens (چیه؟),
// numerals, etc. that the sibling repos occasionally store as "words".
const isPersianWord = (s) => {
  const key = normFa(s);
  return key.length > 0 && [...key].every((ch) => KNOWN_LETTERS.has(ch));
};

// ---------- load each repo's words, keyed by normalised Persian spelling ----------

const noghtehByKey = new Map();
for (const [id, , translation, fin, fa] of JSON.parse(readFileSync(need(join(root, 'noghteh/src/words.json')), 'utf8'))) {
  if (!fa || !isPersianWord(fa)) continue;
  noghtehByKey.set(normFa(fa), { fa: fa.normalize('NFC'), fin, translation, id });
}

const harfByKey = new Map(); // first occurrence only: fa, fin, parts, stepId
const harfGloss = new Map(); // best-effort single-word-step English gloss
const hbIndex = JSON.parse(readFileSync(need(join(root, 'harf-bezan/lessons/index.json')), 'utf8'));
for (const lessonId of hbIndex) {
  const lesson = JSON.parse(readFileSync(join(root, `harf-bezan/lessons/${lessonId}.json`), 'utf8'));
  for (const step of lesson.steps) {
    for (const item of [step, ...(step.items ?? [])]) {
      const words = item.words ?? [];
      // Prefer a "teach" step's plain statement ("I wanted") over a
      // "prompt" step's question phrasing ("How do you say: I wanted?") -
      // first occurrence in lesson order wins, and teach always precedes
      // the prompt that drills the same word.
      if (words.length === 1 && item.en && isPersianWord(words[0].fa)) {
        const key = normFa(words[0].fa);
        if (!harfGloss.has(key)) {
          harfGloss.set(key, item.en.replace(/^how do you say:\s*/i, '').replace(/\?$/, ''));
        }
      }
      for (const w of words) {
        if (!w.fa || !isPersianWord(w.fa)) continue;
        const key = normFa(w.fa);
        if (!harfByKey.has(key)) {
          harfByKey.set(key, { fa: w.fa.normalize('NFC'), fin: w.fin, parts: w.parts ?? [], stepId: item.id });
        }
      }
    }
  }
}

const lex = require(need(join(root, 'finglish-subs/src/lexicon.js')));
const finglishByKey = new Map();
for (const [fa, fin] of Object.entries(lex.map)) {
  if (!isPersianWord(fa)) continue;
  finglishByKey.set(normFa(fa), { fa: fa.normalize('NFC'), fin, gloss: lex.gloss[fa] });
}

// noghteh's `translation` column is title-cased as a UI label (House, Boy),
// not natural gloss casing - lowercase it, except the handful that are
// genuinely proper nouns.
const PROPER_NOUN_GLOSSES = new Set(['Iran', 'Persian', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']);
const glossCase = (s) => (PROPER_NOUN_GLOSSES.has(s) ? s : s[0].toLowerCase() + s.slice(1));

const allKeys = new Set([...noghtehByKey.keys(), ...harfByKey.keys(), ...finglishByKey.keys()]);
const reconciledKeySet = new Set(RECONCILED_KEYS.map(normFa));

// ---------- seed entries ----------

const entries = [];
const notes = []; // { persian, canonical, reasons: string[] }

for (const raw of RECONCILED_ENTRIES) {
  const { flag, ...entry } = raw;
  entries.push(entry);
  if (flag) notes.push({ persian: entry.persian, canonical: entry.canonical, reasons: [flag] });
}

for (const key of allKeys) {
  if (reconciledKeySet.has(key)) continue; // handled above, not re-derived

  const n = noghtehByKey.get(key);
  const h = harfByKey.get(key);
  const f = finglishByKey.get(key);
  const primary = n ? 'noghteh' : h ? 'harf-bezan' : 'finglish-subs';
  const src = n ?? h ?? f;

  const { ok, canonical, ambiguous } = toMacron(src.fa, src.fin);
  const canonicalFinal = (ok ? canonical : src.fin).toLowerCase();

  const isVerbShape = h?.parts?.some((p) => p.role === 'stem') && h?.parts?.some((p) => p.role === 'ending');
  const looksInfinitive = /^to /.test((n?.translation ?? f?.gloss ?? '').toLowerCase());
  const pos = isVerbShape || looksInfinitive ? 'verb' : primary === 'noghteh' ? 'noun' : 'other';

  const isColloq = /\(colloq\.\)/.test(f?.gloss ?? '');
  const register = primary === 'harf-bezan' ? 'colloquial' : primary === 'noghteh' || !isColloq ? 'formal' : 'colloquial';

  let gloss = (n?.translation && glossCase(n.translation)) ?? f?.gloss ?? harfGloss.get(key);
  const glossSourced = Boolean(gloss);
  if (!gloss) gloss = h?.parts?.length ? h.parts.map((p) => p.gloss).join(' + ') : src.fin;
  gloss = gloss.replace(/_/g, ' ').replace(/\s*\(colloq\.\)\s*$/, '');

  const entry = { persian: src.fa, canonical: canonicalFinal, register, pos, gloss, reviewed: false };
  if (h?.parts?.length) entry.parts = h.parts.map((p) => ({ fin: p.fin, role: p.role, gloss: p.gloss }));
  const sources = {};
  if (n) sources.noghteh = n.id;
  if (h) sources.harfBezan = h.stepId;
  if (Object.keys(sources).length) entry.sources = sources;
  entries.push(entry);

  const reasons = [];
  if (!ok) reasons.push('toMacron could not align this spelling at all - canonical form is a raw copy of the original transliteration, not derived');
  else if (ambiguous) reasons.push('toMacron found more than one equally-simple vowel alignment - canonical form is a guess among several');
  if (primary !== 'noghteh') reasons.push(`spelling taken from ${primary}, not noghteh's macron scheme - vowel length not independently verified`);
  if (!glossSourced) reasons.push('no gloss available from any repo - fell back to morpheme glosses or the raw transliteration');
  if (pos === 'other' && primary !== 'harf-bezan') reasons.push("part of speech defaulted to 'other' - not classified");
  if (reasons.length) notes.push({ persian: entry.persian, canonical: entry.canonical, reasons });
}

// ---------- validate before writing anything ----------

const invalid = entries.flatMap((e) => {
  const { ok, errors } = validateEntry(e);
  return ok ? [] : [{ entry: e, errors }];
});
if (invalid.length) {
  console.error(`${invalid.length} generated entries fail validateEntry:`);
  for (const { entry, errors } of invalid.slice(0, 10)) console.error(' ', entry.persian, errors);
  process.exit(1);
}

const seen = new Set();
for (const e of entries) {
  const dupKey = `${e.persian}|${e.pos}|${e.register}`;
  if (seen.has(dupKey)) console.error(`duplicate (persian, pos, register): ${dupKey}`);
  seen.add(dupKey);
}

entries.sort((a, b) => a.persian.localeCompare(b.persian) || a.pos.localeCompare(b.pos));

writeFileSync(join(__dirname, '../src/lexicon/seed.json'), JSON.stringify(entries, null, 2) + '\n');

const notesByPersian = new Map();
for (const n of notes) {
  if (!notesByPersian.has(n.persian)) notesByPersian.set(n.persian, []);
  notesByPersian.get(n.persian).push(n);
}
const notesMd = [
  '# seed.json notes',
  '',
  `Generated by \`node scripts/build-seed.mjs\`. ${notes.length} of ${entries.length} entries are flagged \`needs native review\` below - everything else came directly from noghteh's own macron-scheme spelling or one of docs/RECONCILIATION.md's resolved forms.`,
  '',
  '| Persian | Canonical | Why it needs review |',
  '|---|---|---|',
  ...[...notesByPersian.entries()].flatMap(([persian, group]) =>
    group.map((n) => `| ${persian} | ${n.canonical} | ${n.reasons.join('; ')} |`),
  ),
  '',
].join('\n');
writeFileSync(join(__dirname, '../src/lexicon/seed.notes.md'), notesMd);

console.log(`wrote ${entries.length} entries (${notes.length} flagged needs native review) to src/lexicon/seed.json`);
