import seed from './seed.json';
import { normalizeKey } from './key.js';

/** Every seed entry, unfiltered. */
export const all = () => seed;

/**
 * Looks up lexicon entries by Persian spelling. Multiple entries can share
 * a spelling (homographs, register pairs) - narrow with `pos` and/or
 * `register` when you need one specific entry.
 */
export const lookup = (persian, { pos, register } = {}) => {
  const key = normalizeKey(persian);
  return seed.filter(
    (entry) =>
      normalizeKey(entry.persian) === key &&
      (pos === undefined || entry.pos === pos) &&
      (register === undefined || entry.register === register),
  );
};
