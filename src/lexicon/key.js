const ZWNJ = /‌/g;

/**
 * Normalises a Persian spelling into a lookup key: strips ZWNJ and maps the
 * Arabic ي/ك to the Persian ی/ک. Never used on a *stored* spelling, which
 * keeps both (persian-core/CLAUDE.md).
 */
export const normalizeKey = (persian) =>
  persian
    .normalize('NFC')
    .replace(ZWNJ, '')
    .replace(/ي/g, 'ی')
    .replace(/ك/g, 'ک');
