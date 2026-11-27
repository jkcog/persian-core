// The 15 audited disagreements from docs/RECONCILIATION.md, hardcoded as
// final entries rather than re-derived by scripts/build-seed.mjs's generic
// conversion - these were already decided by hand (and by the author), so
// re-running toMacron over them would just be re-litigating a closed
// decision. Keep this file and docs/RECONCILIATION.md in sync by hand;
// test/seed.test.js checks they agree.
//
// `flag` (optional) explains why an entry still needs native review, for
// scripts/build-seed.mjs to carry into src/lexicon/seed.notes.md.

export const RECONCILED_KEYS = [
  'بره', 'رود', 'نه', 'چشم', 'غذا', 'برم', 'بخورم', 'بخور', 'بخوری', 'بخوره', 'بخورن', 'بخوریم',
  'خورد', 'خوردم', 'خوردن', 'می‌خورم', 'نخوردم', 'نمی‌خورم',
  'دروغ', 'چون', 'و', 'خورشید', 'دو', 'دوشنبه',
  'کندن',
];

export const RECONCILED_ENTRIES = [
  // --- homographs (docs/RECONCILIATION.md "Homographs") ---
  {
    persian: 'بره',
    canonical: 'barreh',
    register: 'formal',
    pos: 'noun',
    gloss: 'lamb',
    reviewed: false,
    sources: { noghteh: 144 },
  },
  {
    persian: 'بره',
    canonical: 'bereh',
    register: 'colloquial',
    pos: 'verb',
    gloss: '(that) he/she goes',
    reviewed: false,
    parts: [
      { fin: 'be', role: 'prefix', gloss: "'to' (subjunctive)" },
      { fin: 'r', role: 'stem', gloss: 'go' },
      { fin: 'e', role: 'ending', gloss: 'he/she' },
    ],
    sources: { harfBezan: 'l02-17' },
  },
  {
    persian: 'رود',
    canonical: 'rūd',
    register: 'formal',
    pos: 'noun',
    gloss: 'river',
    reviewed: false,
    sources: { noghteh: 202 },
  },
  {
    persian: 'رود',
    canonical: 'ravad',
    register: 'formal',
    pos: 'verb',
    gloss: 'goes',
    reviewed: false,
    flag: 'subjunctive/literary 3sg of raftan - register marked formal by default, not independently verified',
  },
  {
    persian: 'نه',
    canonical: 'noh',
    register: 'formal',
    pos: 'number',
    gloss: 'nine',
    reviewed: false,
    sources: { noghteh: 224 },
  },
  {
    persian: 'نه',
    canonical: 'na',
    register: 'colloquial',
    pos: 'particle',
    gloss: 'no',
    reviewed: false,
    sources: { harfBezan: 'l05-06' },
    flag: "register is arbitrary - 'na' doesn't actually vary by register, tagged colloquial only because harf-bezan is the colloquial source",
  },
  // --- resolved disagreements (docs/RECONCILIATION.md second table) ---
  {
    persian: 'چشم',
    canonical: 'cheshm',
    register: 'formal',
    pos: 'noun',
    gloss: 'eye',
    reviewed: false,
    sources: { noghteh: 36 },
  },
  {
    persian: 'غذا',
    canonical: 'ghazā',
    register: 'formal',
    pos: 'noun',
    gloss: 'food',
    reviewed: false,
    sources: { noghteh: 106 },
  },
  {
    persian: 'برم',
    canonical: 'beram',
    register: 'colloquial',
    pos: 'verb',
    gloss: '(that) I go',
    reviewed: false,
    parts: [
      { fin: 'be', role: 'prefix', gloss: "'to' (subjunctive)" },
      { fin: 'r', role: 'stem', gloss: 'go' },
      { fin: 'am', role: 'ending', gloss: 'I' },
    ],
    sources: { harfBezan: 'l04-04' },
  },
  {
    persian: 'بخورم',
    canonical: 'bokhoram',
    register: 'colloquial',
    pos: 'verb',
    gloss: '(that) I eat',
    reviewed: true, // author confirmed: و here is genuinely short, not an ASCII stand-in for long ū
    parts: [
      { fin: 'bo', role: 'prefix', gloss: "'to' (subjunctive)" },
      { fin: 'khor', role: 'stem', gloss: 'eat' },
      { fin: 'am', role: 'ending', gloss: 'I' },
    ],
    sources: { harfBezan: 'l04-32' },
  },
  {
    persian: 'بخور',
    canonical: 'bokhor',
    register: 'formal',
    pos: 'other',
    gloss: 'eat!',
    reviewed: false,
    flag: "build-seed had taken this straight from finglish-subs' own (buggy) bekhor with no sources - same be-/bo- allomorphy already settled for بخورم below (bokhor-, not bekhor-), just never applied to this sibling form",
  },
  // The rest of خوردن's colloquial paradigm (بخوری/بخوره/بخورن/بخوریم) had
  // the same bug one level deeper: build-seed's generic toMacron pass read
  // their bare 'o' as the long vowel by default, contradicting the author's
  // own already-settled, reviewed:true call on بخورم right above - that
  // their و is genuinely short. Fixed to match; the person-ending vowel
  // (-ī in بخوری/بخوریم) is untouched, since that's a separate, wider
  // question about whether ی person-endings should be long at all (flagged
  // for the author, not decided here).
  {
    persian: 'بخوری',
    canonical: 'bokhorī',
    register: 'colloquial',
    pos: 'verb',
    gloss: '(that) you eat',
    reviewed: false,
    parts: [
      { fin: 'bo', role: 'prefix', gloss: "'to' (subjunctive)" },
      { fin: 'khor', role: 'stem', gloss: 'eat' },
      { fin: 'i', role: 'ending', gloss: 'you' },
    ],
    sources: { harfBezan: 'l02-10' },
  },
  {
    persian: 'بخوره',
    canonical: 'bokhoreh',
    register: 'colloquial',
    pos: 'verb',
    gloss: "'to' (subjunctive) + eat + he/she",
    reviewed: false,
    parts: [
      { fin: 'bo', role: 'prefix', gloss: "'to' (subjunctive)" },
      { fin: 'khor', role: 'stem', gloss: 'eat' },
      { fin: 'e', role: 'ending', gloss: 'he/she' },
    ],
    sources: { harfBezan: 'l02-23' },
  },
  {
    persian: 'بخورن',
    canonical: 'bokhoran',
    register: 'colloquial',
    pos: 'verb',
    gloss: "'to' (subjunctive) + eat + they",
    reviewed: false,
    parts: [
      { fin: 'bo', role: 'prefix', gloss: "'to' (subjunctive)" },
      { fin: 'khor', role: 'stem', gloss: 'eat' },
      { fin: 'an', role: 'ending', gloss: 'they' },
    ],
    sources: { harfBezan: 'l02-35' },
  },
  {
    persian: 'بخوریم',
    canonical: 'bokhorīm',
    register: 'colloquial',
    pos: 'verb',
    gloss: "'to' (subjunctive) + eat + we",
    reviewed: false,
    parts: [
      { fin: 'bo', role: 'prefix', gloss: "'to' (subjunctive)" },
      { fin: 'khor', role: 'stem', gloss: 'eat' },
      { fin: 'im', role: 'ending', gloss: 'we' },
    ],
    sources: { harfBezan: 'l02-32' },
  },
  // Found going the other direction: once خوردن's و was confirmed short via
  // بخورم, every other خوردن form still carrying the long reading needed the
  // same fix - these had no بـ prefix to begin with, so they weren't part of
  // the بخور*-family sweep above. خوردم/نخوردم's own `parts.stem` already
  // said 'khord' (short) even while `canonical` still said the long form -
  // an internal inconsistency in the entry itself, not just a guess.
  {
    persian: 'خورد',
    canonical: 'khord',
    register: 'formal',
    pos: 'other',
    gloss: 'ate',
    reviewed: false,
  },
  {
    persian: 'خوردم',
    canonical: 'khordam',
    register: 'colloquial',
    pos: 'verb',
    gloss: 'I ate',
    reviewed: false,
    parts: [
      { fin: 'khord', role: 'stem', gloss: 'ate (past stem)' },
      { fin: 'am', role: 'ending', gloss: 'I' },
    ],
    sources: { harfBezan: 'l04-22' },
  },
  {
    persian: 'خوردن',
    canonical: 'khordan',
    register: 'formal',
    pos: 'verb',
    gloss: 'to eat/drink',
    reviewed: false,
  },
  {
    persian: 'می‌خورم',
    canonical: 'mīkhoram',
    register: 'colloquial',
    pos: 'verb',
    gloss: "I eat / I'm eating",
    reviewed: false,
    parts: [
      { fin: 'mi', role: 'prefix', gloss: 'present (replaces be-)' },
      { fin: 'khor', role: 'stem', gloss: 'eat' },
      { fin: 'am', role: 'ending', gloss: 'I' },
    ],
    sources: { harfBezan: 'l03-05' },
  },
  {
    persian: 'نخوردم',
    canonical: 'nakhordam',
    register: 'colloquial',
    pos: 'verb',
    gloss: 'not + ate (past stem) + I',
    reviewed: false,
    parts: [
      { fin: 'na', role: 'neg', gloss: 'not' },
      { fin: 'khord', role: 'stem', gloss: 'ate (past stem)' },
      { fin: 'am', role: 'ending', gloss: 'I' },
    ],
    sources: { harfBezan: 'l04-23' },
  },
  {
    persian: 'نمی‌خورم',
    canonical: 'nemīkhoram',
    register: 'colloquial',
    pos: 'verb',
    gloss: "I don't eat / I'm not eating",
    reviewed: false,
    parts: [
      { fin: 'ne', role: 'neg', gloss: 'not' },
      { fin: 'mi', role: 'prefix', gloss: 'present (replaces be-)' },
      { fin: 'khor', role: 'stem', gloss: 'eat' },
      { fin: 'am', role: 'ending', gloss: 'I' },
    ],
    sources: { harfBezan: 'l03-20' },
  },
  {
    persian: 'دروغ',
    canonical: 'dorūgh',
    register: 'formal',
    pos: 'noun',
    gloss: 'lie',
    reviewed: false,
    sources: { noghteh: 78 },
    flag: 'و length (long ū vs short o) not native-verified - best guess per docs/SPEC.md §1',
  },
  {
    persian: 'چون',
    canonical: 'chon',
    register: 'colloquial',
    pos: 'conjunction',
    gloss: 'because',
    reviewed: true, // author confirmed: same genuine short و as بخورم, not long
    sources: { harfBezan: 'l06-21' },
  },
  {
    persian: 'و',
    canonical: 'va',
    register: 'formal',
    pos: 'conjunction',
    gloss: 'and',
    reviewed: false,
  },
  {
    persian: 'و',
    canonical: 'o',
    register: 'colloquial',
    pos: 'conjunction',
    gloss: 'and',
    reviewed: false,
    sources: { harfBezan: 'l06-29' },
  },
  // --- و short/long corrections, found by harf-bezan's lexicon-audit tool
  // widening alignVowels's و ambiguity (2026-11-25, see RECONCILIATION.md) ---
  {
    persian: 'خورشید',
    canonical: 'khorshīd',
    register: 'formal',
    pos: 'noun',
    gloss: 'sun',
    reviewed: true, // author confirmed: short و
    sources: { noghteh: 43 },
  },
  {
    persian: 'دو',
    canonical: 'do',
    register: 'formal',
    pos: 'noun',
    gloss: 'two',
    reviewed: true, // author confirmed: short و
    sources: { noghteh: 217 },
  },
  {
    persian: 'دوشنبه',
    canonical: 'doshanbeh',
    register: 'formal',
    pos: 'noun',
    gloss: 'Monday',
    reviewed: true, // author confirmed: short و
    sources: { noghteh: 279 },
  },
  // --- added by hand, not from any sibling repo (2026-11-27) ---
  // کندن (kandan, "to dig/pull/pluck") has no vowel letters at all, so
  // toMacron has nothing to align and no sibling repo has this word -
  // without it, finglish-subs' rule-based fallback guessed "kenden"
  // (its default filler for an unmarked short vowel is 'e', not 'a').
  {
    persian: 'کندن',
    canonical: 'kandan',
    register: 'formal',
    pos: 'verb',
    gloss: 'to dig/pull/pluck',
    reviewed: false,
    flag: 'no sibling-repo source and no vowel letters for toMacron to check - high-confidence guess, not native-verified',
  },
];
