import { VERIFIED_MEDICINES, MedicineRecord } from '@/data/verifiedMedicines';
import { parseMedicineQuery, calculateSimilarity, normalizeText, ParsedMedicineQuery } from './normalizer';

export type MatchConfidence =
  | 'HIGH_CONFIDENCE_EXACT'
  | 'HIGH_CONFIDENCE_ALIAS'
  | 'MEDIUM_CONFIDENCE_FUZZY'
  | 'AMBIGUOUS_STRENGTH'
  | 'NO_MATCH';

export interface ComparisonMetrics {
  branded_pack_size: number;
  branded_pack_mrp: number;
  branded_unit_price: number;
  jan_aushadhi_pack_size: number;
  jan_aushadhi_pack_mrp: number;
  jan_aushadhi_unit_price: number;
  nppa_ceiling_price_unit: number;
  equivalent_jan_aushadhi_mrp: number;
  potential_savings_amount: number;
  potential_savings_percent: number;
}

export interface MatchCandidate {
  medicine: MedicineRecord;
  confidence: MatchConfidence;
  similarity_score: number;
  matched_field: 'brand' | 'generic' | 'alias' | 'fuzzy';
  matched_term: string;
  is_strength_matched: boolean;
  is_form_matched: boolean;
  metrics: ComparisonMetrics;
}

export interface MedicineIdentificationResult {
  query: ParsedMedicineQuery;
  best_match: MatchCandidate | null;
  all_candidates: MatchCandidate[];
  is_ambiguous: boolean;
  ambiguity_reason?: string;
  disclaimer: string;
}

const MANDATORY_DISCLAIMER =
  'AIMAN provides medicine price comparison against Jan Aushadhi generic alternatives for informational purposes only. This application does not diagnose, prescribe, or authorize medicine substitutions. Always verify active ingredients, strength, and suitability with your physician or pharmacist before purchasing.';

/**
 * Calculates unit-normalized pricing and savings
 */
export function calculateComparisonMetrics(medicine: MedicineRecord): ComparisonMetrics {
  const branded_unit_price = Number((medicine.branded_mrp / medicine.pack_size).toFixed(2));
  const jan_aushadhi_unit_price = Number((medicine.jan_aushadhi_mrp / medicine.pack_size).toFixed(2));
  const equivalent_jan_aushadhi_mrp = Number(medicine.jan_aushadhi_mrp.toFixed(2));
  const potential_savings_amount = Number((medicine.branded_mrp - equivalent_jan_aushadhi_mrp).toFixed(2));
  const potential_savings_percent = Number(
    (((medicine.branded_mrp - equivalent_jan_aushadhi_mrp) / medicine.branded_mrp) * 100).toFixed(1)
  );

  return {
    branded_pack_size: medicine.pack_size,
    branded_pack_mrp: medicine.branded_mrp,
    branded_unit_price,
    jan_aushadhi_pack_size: medicine.pack_size,
    jan_aushadhi_pack_mrp: medicine.jan_aushadhi_mrp,
    jan_aushadhi_unit_price,
    nppa_ceiling_price_unit: medicine.nppa_ceiling_price,
    equivalent_jan_aushadhi_mrp,
    potential_savings_amount,
    potential_savings_percent,
  };
}

/**
 * The unified matching engine called by Text, Voice, and Photo OCR inputs
 */
export function identifyMedicine(rawInput: string): MedicineIdentificationResult {
  const parsed = parseMedicineQuery(rawInput);
  const candidates: MatchCandidate[] = [];

  if (!parsed.clean_name && !parsed.extracted_strength) {
    return {
      query: parsed,
      best_match: null,
      all_candidates: [],
      is_ambiguous: false,
      ambiguity_reason: 'Empty search query',
      disclaimer: MANDATORY_DISCLAIMER,
    };
  }

  for (const med of VERIFIED_MEDICINES) {
    const normBrand = normalizeText(med.brand_name);
    const normGeneric = normalizeText(med.generic_name);
    const metrics = calculateComparisonMetrics(med);

    const is_strength_matched = parsed.extracted_strength
      ? normalizeText(med.strength) === normalizeText(parsed.extracted_strength)
      : false;

    const is_form_matched = parsed.extracted_form
      ? normalizeText(med.dosage_form) === normalizeText(parsed.extracted_form)
      : true;

    // 1. Exact Brand match
    if (parsed.clean_name === normBrand || parsed.normalized.includes(normBrand)) {
      candidates.push({
        medicine: med,
        confidence: 'HIGH_CONFIDENCE_EXACT',
        similarity_score: 1.0,
        matched_field: 'brand',
        matched_term: med.brand_name,
        is_strength_matched,
        is_form_matched,
        metrics,
      });
      continue;
    }

    // 2. Exact Generic / Salt match
    if (parsed.clean_name === normGeneric || parsed.normalized.includes(normGeneric)) {
      candidates.push({
        medicine: med,
        confidence: 'HIGH_CONFIDENCE_EXACT',
        similarity_score: 0.95,
        matched_field: 'generic',
        matched_term: med.generic_name,
        is_strength_matched,
        is_form_matched,
        metrics,
      });
      continue;
    }

    // 3. Verified Alias match
    let aliasFound = false;
    for (const alias of med.aliases) {
      const normAlias = normalizeText(alias);
      if (parsed.clean_name === normAlias || parsed.normalized.includes(normAlias)) {
        candidates.push({
          medicine: med,
          confidence: 'HIGH_CONFIDENCE_ALIAS',
          similarity_score: 0.9,
          matched_field: 'alias',
          matched_term: alias,
          is_strength_matched,
          is_form_matched,
          metrics,
        });
        aliasFound = true;
        break;
      }
    }
    if (aliasFound) continue;

    // 4. Typo-tolerant Fuzzy match
    const brandSim = calculateSimilarity(parsed.clean_name, normBrand);
    const genericSim = calculateSimilarity(parsed.clean_name, normGeneric);
    const bestSim = Math.max(brandSim, genericSim);

    if (bestSim >= 0.7) {
      candidates.push({
        medicine: med,
        confidence: 'MEDIUM_CONFIDENCE_FUZZY',
        similarity_score: bestSim,
        matched_field: 'fuzzy',
        matched_term: bestSim === brandSim ? med.brand_name : med.generic_name,
        is_strength_matched,
        is_form_matched,
        metrics,
      });
    }
  }

  // Rank candidates: Exact > Alias > Fuzzy; prefer strength match when extracted
  candidates.sort((a, b) => {
    if (a.is_strength_matched && !b.is_strength_matched) return -1;
    if (!a.is_strength_matched && b.is_strength_matched) return 1;
    return b.similarity_score - a.similarity_score;
  });

  // Ambiguity check: if multiple distinct medicines or strengths matched with equal score
  let is_ambiguous = false;
  let ambiguity_reason: string | undefined;

  if (candidates.length > 1) {
    const topScore = candidates[0].similarity_score;
    const sameScoreCandidates = candidates.filter((c) => Math.abs(c.similarity_score - topScore) < 0.05);

    if (sameScoreCandidates.length > 1 && !parsed.extracted_strength) {
      // User didn't specify strength, e.g. "Paracetamol" has 500mg and 650mg
      const uniqueStrengths = new Set(sameScoreCandidates.map((c) => c.medicine.strength));
      if (uniqueStrengths.size > 1) {
        is_ambiguous = true;
        ambiguity_reason = `Multiple strengths found for this medicine (${Array.from(uniqueStrengths).join(
          ', '
        )}). Please select your prescribed dosage.`;
      }
    }
  }

  const best_match = candidates.length > 0 ? candidates[0] : null;

  return {
    query: parsed,
    best_match,
    all_candidates: candidates,
    is_ambiguous,
    ambiguity_reason,
    disclaimer: MANDATORY_DISCLAIMER,
  };
}
