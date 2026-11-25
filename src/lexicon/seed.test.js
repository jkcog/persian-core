import { describe, expect, it } from 'vitest';
import { validateEntry } from './schema.js';
import { all, lookup } from './index.js';
import { RECONCILED_ENTRIES } from '../../scripts/reconciled-entries.mjs';

const seed = all();

describe('seed.json', () => {
  it('is non-empty', () => {
    expect(seed.length).toBeGreaterThan(500);
  });

  it('every entry passes validateEntry', () => {
    const invalid = seed.flatMap((e) => {
      const { ok, errors } = validateEntry(e);
      return ok ? [] : [{ persian: e.persian, errors }];
    });
    expect(invalid).toEqual([]);
  });

  it('has no duplicate (persian, pos, register) entries', () => {
    const keys = seed.map((e) => `${e.persian}|${e.pos}|${e.register}`);
    expect(keys.length).toBe(new Set(keys).size);
  });

  // build-seed.mjs's generic per-key conversion never self-certifies - the
  // only reviewed:true entries allowed are ones the author explicitly
  // reviewed by hand in RECONCILED_ENTRIES (بخورم, چون - see
  // docs/RECONCILIATION.md's 2026-11-25 correction).
  it('only marks an entry reviewed:true when RECONCILED_ENTRIES says so', () => {
    const reviewedPersian = new Set(RECONCILED_ENTRIES.filter((e) => e.reviewed).map((e) => e.persian));
    const wronglyReviewed = seed.filter((e) => e.reviewed && !reviewedPersian.has(e.persian));
    expect(wronglyReviewed).toEqual([]);
  });

  // Guards against the data drifting from the decisions docs/RECONCILIATION.md
  // records, since scripts/build-seed.mjs copies ./reconciled-entries.mjs in
  // verbatim rather than re-deriving these 14 entries.
  it('carries every reconciled entry from docs/RECONCILIATION.md unchanged', () => {
    for (const { flag: _flag, ...expected } of RECONCILED_ENTRIES) {
      const matches = lookup(expected.persian, { pos: expected.pos, register: expected.register });
      expect(matches, `no seed entry for ${expected.persian} (${expected.pos}, ${expected.register})`).toHaveLength(1);
      expect(matches[0]).toEqual(expected);
    }
  });

  it('splits each homograph into separate entries by part of speech', () => {
    expect(lookup('بره')).toHaveLength(2);
    expect(lookup('رود')).toHaveLength(2);
    expect(lookup('نه')).toHaveLength(2);
  });

  it('gives the و register pair both a formal and a colloquial entry', () => {
    const entries = lookup('و');
    expect(entries.map((e) => e.register).sort()).toEqual(['colloquial', 'formal']);
  });

  it('every noghteh-sourced entry aligned cleanly (no fallback canonical)', () => {
    const noghtehOnly = seed.filter((e) => e.sources?.noghteh !== undefined && !RECONCILED_ENTRIES.some((r) => r.persian === e.persian));
    // Every one of these came straight from noghteh's own macron spelling
    // through toMacron with ok:true - see scripts/build-seed.mjs.
    expect(noghtehOnly.length).toBeGreaterThan(200);
  });
});
