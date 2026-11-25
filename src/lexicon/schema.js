// Hand-rolled validator - no ajv/zod, per the zero-runtime-dependency
// constraint in CLAUDE.md. See docs/SPEC.md §3 for the schema this checks.

const REGISTERS = new Set(['formal', 'colloquial']);
const PART_ROLES = new Set(['prefix', 'stem', 'ending', 'neg', 'plain']);

const isString = (v) => typeof v === 'string';
const isNonEmptyString = (v) => isString(v) && v.length > 0;

const validateParts = (parts, errors) => {
  if (parts === undefined) return;
  if (!Array.isArray(parts)) {
    errors.push('parts must be an array when present');
    return;
  }
  parts.forEach((part, i) => {
    if (!part || typeof part !== 'object') {
      errors.push(`parts[${i}] must be an object`);
      return;
    }
    if (!isNonEmptyString(part.fin)) errors.push(`parts[${i}].fin must be a non-empty string`);
    if (!PART_ROLES.has(part.role)) {
      errors.push(`parts[${i}].role must be one of ${[...PART_ROLES].join('|')}, got ${JSON.stringify(part.role)}`);
    }
    if (!isNonEmptyString(part.gloss)) errors.push(`parts[${i}].gloss must be a non-empty string`);
  });
};

const validateSources = (sources, errors) => {
  if (sources === undefined) return;
  if (!sources || typeof sources !== 'object') {
    errors.push('sources must be an object when present');
    return;
  }
  if (sources.noghteh !== undefined && typeof sources.noghteh !== 'number') {
    errors.push('sources.noghteh must be a number (words.json id)');
  }
  if (sources.harfBezan !== undefined && !isNonEmptyString(sources.harfBezan)) {
    errors.push('sources.harfBezan must be a string (lesson step id)');
  }
};

/**
 * Validates one lexicon entry against docs/SPEC.md §3.
 * Returns { ok, errors }. Never mutates the entry, never guesses a missing
 * field, and never decides `reviewed` - that stays whatever the entry says.
 */
export const validateEntry = (entry) => {
  const errors = [];
  if (!entry || typeof entry !== 'object') {
    return { ok: false, errors: ['entry must be an object'] };
  }

  if (!isNonEmptyString(entry.persian)) errors.push('persian must be a non-empty string');
  if (!isNonEmptyString(entry.canonical)) errors.push('canonical must be a non-empty string');
  if (!isNonEmptyString(entry.pos)) errors.push('pos must be a non-empty string');
  if (!isNonEmptyString(entry.gloss)) errors.push('gloss must be a non-empty string');
  if (!REGISTERS.has(entry.register)) {
    errors.push(`register must be one of ${[...REGISTERS].join('|')}, got ${JSON.stringify(entry.register)}`);
  }
  if (typeof entry.reviewed !== 'boolean') errors.push('reviewed must be a boolean');

  // Stored spelling keeps ZWNJ (persian-core/CLAUDE.md); only lookup keys
  // strip it. NFC-normalising is the one thing we can assert generically.
  if (isString(entry.persian) && entry.persian.normalize('NFC') !== entry.persian) {
    errors.push('persian must be NFC-normalised');
  }

  validateParts(entry.parts, errors);
  validateSources(entry.sources, errors);

  return { ok: errors.length === 0, errors };
};
