// The 15 audited disagreements from docs/RECONCILIATION.md, hardcoded as
// final entries rather than re-derived by scripts/build-seed.mjs's generic
// conversion - these were already decided by hand (and by the author), so
// re-running toMacron over them would just be re-litigating a closed
// decision. Keep this file and docs/RECONCILIATION.md in sync by hand;
// test/seed.test.js checks they agree.
//
// `flag` (optional) explains why an entry still needs native review, for
// scripts/build-seed.mjs to carry into src/lexicon/seed.notes.md.

export const RECONCILED_KEYS = ['بره', 'رود', 'نه', 'چشم', 'غذا', 'برم', 'بخورم', 'دروغ', 'چون', 'و'];

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
    reviewed: false,
    parts: [
      { fin: 'bo', role: 'prefix', gloss: "'to' (subjunctive)" },
      { fin: 'khor', role: 'stem', gloss: 'eat' },
      { fin: 'am', role: 'ending', gloss: 'I' },
    ],
    sources: { harfBezan: 'l04-32' },
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
    canonical: 'chūn',
    register: 'colloquial',
    pos: 'conjunction',
    gloss: 'because',
    reviewed: false,
    sources: { harfBezan: 'l06-21' },
    flag: "و length not native-verified - revised from an earlier 'chon' guess to match how toMacron treats every other o-for-و word (see docs/RECONCILIATION.md)",
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
];
