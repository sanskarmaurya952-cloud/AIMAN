import { identifyMedicine } from '../src/lib/matching/engine';
import { calculateSimilarity, parseMedicineQuery } from '../src/lib/matching/normalizer';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion Failed: ${message}`);
  }
}

console.log('--- Running AIMAN Medicine Identification & Matching Tests ---');

// Test 1: Exact Brand Match
{
  const result = identifyMedicine('Dolo 650');
  assert(result.best_match !== null, 'Dolo 650 should return a match');
  assert(result.best_match?.medicine.brand_name === 'Dolo 650', 'Should match Dolo 650');
  assert(result.best_match?.confidence === 'HIGH_CONFIDENCE_EXACT', 'Confidence should be exact');
  console.log('✓ Test 1: Exact Brand Match Passed');
}

// Test 2: Common Typo Match
{
  const result = identifyMedicine('dollo 650');
  assert(result.best_match !== null, 'dollo 650 typo should match');
  assert(result.best_match?.medicine.generic_name === 'Paracetamol', 'Should identify Paracetamol');
  console.log('✓ Test 2: Common Typo Match Passed');
}

// Test 3: Alias Match
{
  const result = identifyMedicine('crocin 650');
  assert(result.best_match !== null, 'crocin 650 alias should match');
  assert(result.best_match?.medicine.generic_name === 'Paracetamol', 'Crocin alias should match Paracetamol');
  console.log('✓ Test 3: Verified Alias Match Passed');
}

// Test 4: Unknown Drug
{
  const result = identifyMedicine('NonExistentMedicine9999');
  assert(result.best_match === null, 'Unknown medicine should return no match');
  assert(result.all_candidates.length === 0, 'Candidates should be empty');
  console.log('✓ Test 4: Unknown Medicine Passed');
}

// Test 5: Ambiguity Detection (Paracetamol without strength)
{
  const result = identifyMedicine('Paracetamol');
  assert(result.is_ambiguous === true, 'Searching Paracetamol without strength should flag ambiguity');
  assert(result.all_candidates.length >= 2, 'Should return candidates for both 500mg and 650mg');
  console.log('✓ Test 5: Ambiguity Flagging Passed');
}

// Test 6: Dosage & Strength Distinction (500mg vs 650mg)
{
  const result500 = identifyMedicine('Paracetamol 500mg');
  const result650 = identifyMedicine('Paracetamol 650mg');
  assert(result500.best_match?.medicine.strength === '500mg', '500mg query must match 500mg');
  assert(result650.best_match?.medicine.strength === '650mg', '650mg query must match 650mg');
  console.log('✓ Test 6: Strength Distinction Passed');
}

// Test 7: Unit Math & Savings Calculation
{
  const result = identifyMedicine('Dolo 650');
  const metrics = result.best_match!.metrics;
  assert(metrics.branded_pack_mrp === 34.0, 'Branded MRP should be 34.0');
  assert(metrics.jan_aushadhi_pack_mrp === 14.5, 'Jan Aushadhi MRP should be 14.5');
  assert(metrics.potential_savings_amount === 19.5, 'Savings amount should be 19.5');
  assert(metrics.potential_savings_percent === 57.4, 'Savings percent should be 57.4%');
  console.log('✓ Test 7: Mathematical Unit Savings Passed');
}

// Test 8: Medical Disclaimer Integrity
{
  const result = identifyMedicine('Augmentin 625');
  assert(result.disclaimer.includes('does not diagnose, prescribe, or authorize medicine substitutions'), 'Must contain non-substitution disclaimer');
  console.log('✓ Test 8: Medical Disclaimer Integrity Passed');
}

console.log('All 8 Matching Engine Tests Passed Successfully!');
