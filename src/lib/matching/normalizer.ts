/**
 * AIMAN Shared Medicine Query Normalizer & Similarity Engine
 */

export interface ParsedMedicineQuery {
  raw: string;
  normalized: string;
  clean_name: string;
  extracted_strength: string | null;
  extracted_form: string | null;
}

// Common dosage form aliases
const DOSAGE_FORM_MAP: Record<string, string> = {
  tab: 'Tablet',
  tabs: 'Tablet',
  tablet: 'Tablet',
  tablets: 'Tablet',
  cap: 'Capsule',
  caps: 'Capsule',
  capsule: 'Capsule',
  capsules: 'Capsule',
  syr: 'Syrup',
  syrup: 'Syrup',
  susp: 'Suspension',
  suspension: 'Suspension',
  inj: 'Injection',
  injection: 'Injection',
  drops: 'Drops',
};

/**
 * Standardize text: lowercases, trims whitespace, standardizes punctuation
 */
export function normalizeText(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^\w\s\.\+]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Parses user input (Text, Speech transcript, or OCR text)
 * and extracts name, strength, and dosage form
 */
export function parseMedicineQuery(input: string): ParsedMedicineQuery {
  const normalized = normalizeText(input);

  // 1. Extract Strength: e.g. 650mg, 500 mg, 10mg+5mg, 10/5 mg, 625mg
  let extracted_strength: string | null = null;
  const strengthRegex = /(\d+(\.\d+)?\s*(mg|mcg|gm|g|ml)(\s*[\+\/]\s*\d+(\.\d+)?\s*(mg|mcg|gm|g|ml))?|\b\d{2,4}\b)/i;
  const strengthMatch = normalized.match(strengthRegex);

  if (strengthMatch) {
    const rawVal = strengthMatch[0].replace(/\s+/g, '');
    // If it's just pure numbers like "650", attach "mg" as standard pharmaceutical default
    extracted_strength = rawVal.match(/^[0-9]+$/) ? `${rawVal}mg` : rawVal;
  }

  // 2. Extract Dosage Form
  let extracted_form: string | null = null;
  const tokens = normalized.split(/\s+/);
  for (const token of tokens) {
    if (DOSAGE_FORM_MAP[token]) {
      extracted_form = DOSAGE_FORM_MAP[token];
      break;
    }
  }

  // 3. Extract Clean Drug Name (remove matched strength and form tokens)
  let clean_name = normalized;
  if (strengthMatch) {
    clean_name = clean_name.replace(strengthMatch[0], ' ');
  }
  for (const formToken of Object.keys(DOSAGE_FORM_MAP)) {
    const regex = new RegExp(`\\b${formToken}\\b`, 'gi');
    clean_name = clean_name.replace(regex, ' ');
  }
  clean_name = clean_name.replace(/\s+/g, ' ').trim();

  return {
    raw: input,
    normalized,
    clean_name,
    extracted_strength,
    extracted_form,
  };
}

/**
 * Levenshtein distance for typo-tolerant matching
 */
export function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  const lenA = a.length;
  const lenB = b.length;

  for (let i = 0; i <= lenA; i++) matrix[i] = [i];
  for (let j = 0; j <= lenB; j++) matrix[0][j] = j;

  for (let i = 1; i <= lenA; i++) {
    for (let j = 1; j <= lenB; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1, // deletion
        matrix[i][j - 1] + 1, // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return matrix[lenA][lenB];
}

/**
 * Normalized string similarity score between 0.0 (completely different) and 1.0 (identical)
 */
export function calculateSimilarity(s1: string, s2: string): number {
  const norm1 = normalizeText(s1);
  const norm2 = normalizeText(s2);

  if (norm1 === norm2) return 1.0;
  if (!norm1 || !norm2) return 0.0;

  const distance = levenshteinDistance(norm1, norm2);
  const maxLen = Math.max(norm1.length, norm2.length);
  return Number((1 - distance / maxLen).toFixed(3));
}
