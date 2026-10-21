import { identifyMedicine } from '../src/lib/matching/engine';
import { VERIFIED_KENDRAS } from '../src/data/verifiedKendras';
import { calculateDistance, PINCODE_COORDINATES } from '../src/lib/geo/distance';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`[E2E Pipeline Assertion Failed]: ${message}`);
  }
}

console.log('================================================================');
console.log('      AIMAN: End-to-End Pipeline & Integration Test Suite       ');
console.log('================================================================\n');

// 1. Modality 1: Manual Search Pipeline Test
console.log('--- Step 1: Manual Text Input Modality ---');
{
  const result = identifyMedicine('Metformin 500');
  assert(result.best_match !== null, 'Metformin 500 should return valid match');
  assert(result.best_match?.medicine.brand_name === 'Glycomet 500', 'Should match Glycomet 500');
  assert(result.best_match?.metrics.potential_savings_percent > 70, 'Savings should be substantial');
  console.log(`✓ Manual text matched: ${result.best_match?.medicine.brand_name} (₹${result.best_match?.metrics.potential_savings_amount} saved)`);
}

// 2. Modality 2: Voice Recognition Input Modality Test
console.log('\n--- Step 2: Voice Transcription Modality ---');
{
  const simulatedVoiceTranscript = 'Find the price information for paracetamol 650 and show nearby Jan Aushadhi Kendras';
  const result = identifyMedicine(simulatedVoiceTranscript);
  assert(result.best_match !== null, 'Voice input should extract and match medicine');
  assert(result.best_match?.medicine.generic_name === 'Paracetamol', 'Should identify Paracetamol');
  assert(result.best_match?.medicine.strength === '650mg', 'Should extract 650mg dosage');
  console.log(`✓ Voice transcript matched: ${result.best_match?.medicine.brand_name} with strength ${result.best_match?.medicine.strength}`);
}

// 3. Modality 3: Packaging Photo OCR Input Modality Test
console.log('\n--- Step 3: Packaging Photo OCR Modality ---');
{
  const simulatedOcrText = 'Augmentin 625 Duo Amoxicillin and Potassium Clavulanate Tablets IP GlaxoSmithKline';
  const result = identifyMedicine(simulatedOcrText);
  assert(result.best_match !== null, 'OCR text should extract and match brand');
  assert(result.best_match?.medicine.brand_name.includes('Augmentin'), 'Should match Augmentin 625 Duo');
  assert(result.best_match?.medicine.jan_aushadhi_code === 'PMBI-0160', 'Should map to PMBI-0160');
  console.log(`✓ Photo OCR extracted: ${result.best_match?.medicine.brand_name} mapped to PMBI Code ${result.best_match?.medicine.jan_aushadhi_code}`);
}

// 4. Ambiguity Resolution Test
console.log('\n--- Step 4: Ambiguity Resolution Pipeline ---');
{
  const result = identifyMedicine('Paracetamol');
  assert(result.is_ambiguous === true, 'Omitting dosage should flag ambiguity');
  assert(result.all_candidates.length >= 2, 'Should provide multiple dosage choices (500mg, 650mg)');
  console.log(`✓ Ambiguity detected cleanly: ${result.ambiguity_reason}`);
}

// 5. Kendra Geolocation Distance Calculation Test
console.log('\n--- Step 5: Kendra Geolocation & Sorting Pipeline ---');
{
  // User at AIIMS New Delhi coordinates
  const userLat = 28.5672;
  const userLng = 77.2100;

  const kendrasWithDistance = VERIFIED_KENDRAS.map((k) => ({
    ...k,
    dist: calculateDistance(userLat, userLng, k.latitude, k.longitude),
  })).sort((a, b) => a.dist - b.dist);

  const nearest = kendrasWithDistance[0];
  assert(nearest.kendra_code === 'PMBJP-DL-001', 'Nearest Kendra to AIIMS coords should be AIIMS Delhi');
  assert(nearest.dist <= 0.1, 'Distance should be under 100 meters');
  console.log(`✓ Nearest Kendra resolved: ${nearest.name} (${nearest.dist} km)`);
}

// 6. PIN Code Fallback Centroid Test
console.log('\n--- Step 6: PIN Code Centroid Fallback ---');
{
  const lucknowPin = '226001';
  const centroid = PINCODE_COORDINATES[lucknowPin];
  assert(centroid !== undefined, 'Centroid for 226001 must exist');

  const nearestToLucknow = VERIFIED_KENDRAS.map((k) => ({
    ...k,
    dist: calculateDistance(centroid.lat, centroid.lng, k.latitude, k.longitude),
  })).sort((a, b) => a.dist - b.dist)[0];

  assert(nearestToLucknow.kendra_code === 'PMBJP-UP-001', 'Nearest Kendra for 226001 should be Hazratganj Lucknow');
  console.log(`✓ PIN ${lucknowPin} centroid mapped to nearest Kendra: ${nearestToLucknow.name} (${nearestToLucknow.dist} km)`);
}

// 7. Non-Substitution Medical Safety Integrity Test
console.log('\n--- Step 7: Responsible Medical Disclaimer Integrity ---');
{
  const result = identifyMedicine('Atorva 10');
  assert(result.disclaimer.includes('does not diagnose, prescribe, or authorize medicine substitutions'), 'Must contain non-substitution rule');
  console.log('✓ Mandatory statutory disclaimer verified in pipeline output.');
}

console.log('\n================================================================');
console.log('   ✓ ALL 7 END-TO-END PIPELINE INTEGRATION TESTS PASSED!       ');
console.log('================================================================');
