// Cross-repo transliteration audit: finds Persian words that appear in more
// than one of noghteh / harf-bezan / finglish-subs and shows where the
// romanisations disagree.
// Usage: node scripts/audit-translit.mjs <dir-containing-the-three-repos>
import { readFileSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, resolve } from 'node:path';

const root = resolve(process.argv[2] ?? '..');
const require = createRequire(import.meta.url);
const need = (p) => { if (!existsSync(p)) { console.error('missing: ' + p); process.exit(1); } return p; };

const ZWNJ = /‌/g;
const normFa = (s) => s.replace(ZWNJ, '').replace(/ي/g, 'ی').replace(/ك/g, 'ک').trim();
// ASCII fold: strip macrons so ā/ī/ū compare with a/i/u.
const fold = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[\s\-']/g, '');
// Looser fold: also collapse the long-vowel spellings used for the same sounds.
const loose = (s) => fold(s).replace(/oo/g, 'u').replace(/ee/g, 'i').replace(/aa/g, 'a').replace(/kh/g, 'x');

const seen = new Map(); // fa -> [{repo, fin}]
const add = (repo, fa, fin) => {
  if (!fa || !fin || /\s/.test(normFa(fa))) return; // single words only
  const k = normFa(fa);
  if (!seen.has(k)) seen.set(k, []);
  seen.get(k).push({ repo, fin });
};

// Per-word English glosses, where the source data has them, so disagreements
// can be told apart from homographs (same spelling, unrelated meanings).
// noghteh and finglish-subs both carry a gloss per entry; harf-bezan's lesson
// JSON doesn't, so it's left out of the gloss comparison.
const glosses = new Map(); // fa -> Map<repo, Set<gloss word>>
const STOPWORDS = new Set(['a', 'the', 'to', 'of', 'on', 'in', 'is', 'and', 'or']);
const glossWords = (g) =>
  new Set(
    g
      .toLowerCase()
      .replace(/\(.*?\)/g, ' ')
      .split(/[^a-z]+/)
      .filter((w) => w && !STOPWORDS.has(w)),
  );
const addGloss = (repo, fa, gloss) => {
  if (!fa || !gloss) return;
  const k = normFa(fa);
  if (!glosses.has(k)) glosses.set(k, new Map());
  glosses.get(k).set(repo, glossWords(gloss));
};

// noghteh: [id, category, translation, transliteration, persian]
for (const [, , translation, tr, fa] of JSON.parse(readFileSync(need(join(root, 'noghteh/src/words.json')), 'utf8'))) {
  add('noghteh', fa, tr);
  addGloss('noghteh', fa, translation);
}

// harf-bezan: steps[].words[] and review items[].words[] with {fa, fin}
const idx = JSON.parse(readFileSync(need(join(root, 'harf-bezan/lessons/index.json')), 'utf8'));
for (const id of idx) {
  const l = JSON.parse(readFileSync(join(root, `harf-bezan/lessons/${id}.json`), 'utf8'));
  for (const s of l.steps) for (const it of [s, ...(s.items ?? [])]) for (const w of it.words ?? []) add('harf-bezan', w.fa, w.fin);
}

// finglish-subs: lexicon map {persian: finglish}, gloss map {persian: english}
const lex = require(need(join(root, 'finglish-subs/src/lexicon.js')));
for (const [fa, fin] of Object.entries(lex.map)) {
  add('finglish-subs', fa, fin);
  addGloss('finglish-subs', fa, lex.gloss[fa]);
}

// True when two repos have a gloss recorded for this word and they share no
// gloss word at all - a strong signal the spelling is a homograph, not a bug.
const looksLikeHomograph = (fa) => {
  const byRepo = glosses.get(fa);
  if (!byRepo || byRepo.size < 2) return false;
  const sets = [...byRepo.values()];
  for (let i = 0; i < sets.length; i++) {
    for (let j = i + 1; j < sets.length; j++) {
      if ([...sets[i]].some((w) => sets[j].has(w))) return false;
    }
  }
  return true;
};

const dedupe = (rows) => [...new Map(rows.map((r) => [r.repo + '|' + r.fin, r])).values()];
let shared = 0, exact = 0, asciiOnly = 0, differ = [], homographs = [];
const byPair = {};
const uniqueCount = { noghteh: 0, 'harf-bezan': 0, 'finglish-subs': 0 };
for (const [fa, rows0] of seen) {
  const rows = dedupe(rows0);
  const repos = new Set(rows.map((r) => r.repo));
  if (repos.size < 2) {
    uniqueCount[rows[0].repo]++;
    continue;
  }
  shared++;
  const forms = new Set(rows.map((r) => r.fin));
  const folds = new Set(rows.map((r) => fold(r.fin)));
  const looses = new Set(rows.map((r) => loose(r.fin)));
  if (forms.size === 1) exact++;
  else if (folds.size === 1) asciiOnly++; // only macron differences
  else if (looses.size > 1) {
    if (looksLikeHomograph(fa)) homographs.push({ fa, rows });
    else differ.push({ fa, rows });
  } else asciiOnly++;
  const key = [...repos].sort().join(' + ');
  byPair[key] = (byPair[key] ?? 0) + 1;
}

console.log('Distinct single words per repo:');
for (const r of ['noghteh', 'harf-bezan', 'finglish-subs']) console.log(`  ${r}: ${[...seen.values()].filter((v) => v.some((x) => x.repo === r)).length}`);
console.log('\nWords found in only one repo (no overlap to check):');
for (const r of ['noghteh', 'harf-bezan', 'finglish-subs']) console.log(`  ${r}: ${uniqueCount[r]}`);
console.log('\nWords shared between repos, by repo pair:');
for (const [k, n] of Object.entries(byPair)) console.log(`  ${k}: ${n}`);
console.log(`\nShared words: ${shared}`);
console.log(`  identical romanisation:                ${exact}`);
console.log(`  differ only by macron/oo/ee/kh style:  ${asciiOnly}`);
console.log(`  likely homographs (different glosses):  ${homographs.length}`);
console.log(`  genuinely different (vowels/colloq.):  ${differ.length}`);
console.log('\nLikely homographs (same spelling, repos disagree on the gloss - not a spelling bug):');
for (const h of homographs) console.log(`  ${h.fa}  ` + h.rows.map((r) => `${r.repo}=${r.fin}`).join('  '));
console.log('\nGenuine disagreements (same or unknown gloss - check spelling):');
for (const d of differ) console.log(`  ${d.fa}  ` + d.rows.map((r) => `${r.repo}=${r.fin}`).join('  '));
