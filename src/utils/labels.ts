/**
 * Small presentation helpers shared by the investigation components.
 */

/**
 * Technical suffixes that must never reach the end user: internal relation
 * keys such as "supports" / "challenges" / "unrelated".
 */
const TECHNICAL_KEYS = [
  'supports',
  'challenges',
  'insufficient',
  'unrelated',
  'pertinent_bridge',
  'unanswered_in_corpus',
  'insufficient_data',
];

/**
 * Removes a trailing technical reference code (e.g. " (Q001)" or " [S003]")
 * from a label so the end user reads a human title instead of an internal id.
 */
export function stripRefCode(label: string): string {
  return label
    .replace(/\s*[([]\s*[A-Z]{1,4}\s*\d{1,4}\s*[)\]]\s*$/u, '')
    .trim();
}

/**
 * Removes a trailing internal key kept for technical traceability
 * (e.g. "Soutient (supports)" becomes "Soutient").
 */
export function stripTechnicalSuffix(label: string): string {
  return label
    .replace(/\s*[([]\s*([A-Za-z_]{2,32})\s*[)\]]\s*$/u, (match, inner: string) =>
      TECHNICAL_KEYS.includes(inner.toLowerCase()) ? '' : match
    )
    .trim();
}

/**
 * Removes internal reference codes kept in parentheses inside narrative text
 * (e.g. "le registre technique (S003)" becomes "le registre technique").
 */
export function stripIdParentheticals(text: string): string {
  return text
    .replace(/\s*[([]\s*[A-Z]{1,4}\s*\d{2,4}\s*[)\]]/gu, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}
