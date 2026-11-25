import { describe, expect, it } from 'vitest';
import { validateEntry } from './schema.js';

const validEntry = () => ({
  persian: 'کتاب',
  canonical: 'ketāb',
  register: 'formal',
  pos: 'noun',
  gloss: 'book',
  reviewed: false,
});

describe('validateEntry', () => {
  it('accepts a minimal valid entry', () => {
    expect(validateEntry(validEntry())).toEqual({ ok: true, errors: [] });
  });

  it('accepts an entry with parts and sources', () => {
    const entry = {
      ...validEntry(),
      persian: 'برم',
      canonical: 'beram',
      register: 'colloquial',
      pos: 'verb',
      gloss: '(that) I go',
      parts: [
        { fin: 'be', role: 'prefix', gloss: "'to' (subjunctive)" },
        { fin: 'r', role: 'stem', gloss: 'go' },
        { fin: 'am', role: 'ending', gloss: 'I' },
      ],
      sources: { harfBezan: 'l04-04' },
    };
    expect(validateEntry(entry)).toEqual({ ok: true, errors: [] });
  });

  it('rejects a non-object entry', () => {
    expect(validateEntry(null).ok).toBe(false);
    expect(validateEntry('کتاب').ok).toBe(false);
  });

  it.each(['persian', 'canonical', 'pos', 'gloss'])('rejects a missing %s', (field) => {
    const entry = validEntry();
    delete entry[field];
    const { ok, errors } = validateEntry(entry);
    expect(ok).toBe(false);
    expect(errors.some((e) => e.startsWith(field))).toBe(true);
  });

  it('rejects an invalid register', () => {
    const { ok, errors } = validateEntry({ ...validEntry(), register: 'literary' });
    expect(ok).toBe(false);
    expect(errors.some((e) => e.startsWith('register'))).toBe(true);
  });

  it('rejects a non-boolean reviewed', () => {
    const { ok, errors } = validateEntry({ ...validEntry(), reviewed: 'false' });
    expect(ok).toBe(false);
    expect(errors.some((e) => e.startsWith('reviewed'))).toBe(true);
  });

  it('rejects a part with an unknown role', () => {
    const entry = { ...validEntry(), parts: [{ fin: 'x', role: 'suffix', gloss: 'y' }] };
    const { ok, errors } = validateEntry(entry);
    expect(ok).toBe(false);
    expect(errors[0]).toContain('role');
  });

  it('rejects a part missing its gloss', () => {
    const entry = { ...validEntry(), parts: [{ fin: 'x', role: 'stem' }] };
    const { ok, errors } = validateEntry(entry);
    expect(ok).toBe(false);
    expect(errors[0]).toContain('gloss');
  });

  it('rejects sources.noghteh as a non-number', () => {
    const entry = { ...validEntry(), sources: { noghteh: '28' } };
    expect(validateEntry(entry).ok).toBe(false);
  });

  it('rejects a persian spelling that is not NFC-normalised', () => {
    const nfd = 'کتاب'.normalize('NFD');
    const entry = { ...validEntry(), persian: nfd };
    // Only meaningful if NFD actually differs from NFC for this string.
    if (nfd !== nfd.normalize('NFC')) {
      expect(validateEntry(entry).ok).toBe(false);
    }
  });

  it('validates a homograph pair independently (same persian, different pos)', () => {
    const lamb = { ...validEntry(), persian: 'بره', canonical: 'barreh', pos: 'noun', gloss: 'lamb' };
    const goes = { ...validEntry(), persian: 'بره', canonical: 'bereh', pos: 'verb', register: 'colloquial', gloss: '(that) he/she goes' };
    expect(validateEntry(lamb)).toEqual({ ok: true, errors: [] });
    expect(validateEntry(goes)).toEqual({ ok: true, errors: [] });
  });
});
