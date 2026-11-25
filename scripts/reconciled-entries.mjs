// The 15 audited disagreements from docs/RECONCILIATION.md, hardcoded as
// final entries rather than re-derived by scripts/build-seed.mjs's generic
// conversion - these were already decided by hand (and by the author), so
// re-running toMacron over them would just be re-litigating a closed
// decision. Keep this file and docs/RECONCILIATION.md in sync by hand;
// test/seed.test.js checks they agree.
//
// `flag` (optional) explains why an entry still needs native review, for
// scripts/build-seed.mjs to carry into src/lexicon/seed.notes.md.

export const RECONCILED_KEYS = ['بره', 'رود', 'نه', 'چشم', 'غذا', 'برم', 'بخورم', 'دروغ', 'چون', 'و', 'خورشید', 'دو', 'دوشنبه'];

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
];
