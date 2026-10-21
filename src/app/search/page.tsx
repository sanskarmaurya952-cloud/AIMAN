'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Search,
  Pill,
  CheckCircle2,
  AlertTriangle,
  TrendingDown,
  Building2,
  MapPin,
  Bookmark,
  Printer,
  Share2,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  ExternalLink,
  Loader2,
} from 'lucide-react';
import { identifyMedicine, MedicineIdentificationResult, MatchCandidate } from '@/lib/matching/engine';
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@/lib/supabase/client';
import { DisclaimerBanner } from '@/components/ui/DisclaimerBanner';

function SearchComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const searchMethod = (searchParams.get('method') as 'manual' | 'voice' | 'photo') || 'manual';

  const { user } = useAuth();
  const [supabase] = useState(() => createClient());

  const [queryInput, setQueryInput] = useState(initialQuery);
  const [result, setResult] = useState<MedicineIdentificationResult | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<MatchCandidate | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  useEffect(() => {
    if (initialQuery.trim()) {
      const matchResult = identifyMedicine(initialQuery.trim());
      setResult(matchResult);
      setSelectedCandidate(matchResult.best_match);

      // Record in Supabase search_history if user is signed in
      if (user) {
        supabase
          .from('search_history')
          .insert({
            user_id: user.id,
            query: initialQuery.trim(),
            input_method: searchMethod,
            matched_medicine: matchResult.best_match?.medicine.brand_name || null,
          })
          .then();
      }
    } else {
      setResult(null);
      setSelectedCandidate(null);
    }
  }, [initialQuery, searchMethod, user, supabase]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryInput.trim()) return;
    router.push(`/search?q=${encodeURIComponent(queryInput.trim())}&method=manual`);
  };

  const handleSaveMedicine = async () => {
    if (!user) {
      router.push(`/login?returnTo=${encodeURIComponent(`/search?q=${queryInput}`)}`);
      return;
    }

    if (!selectedCandidate) return;

    setSaveStatus('saving');
    try {
      const { error } = await supabase.from('saved_medicines').insert({
        user_id: user.id,
        medicine_name: selectedCandidate.medicine.brand_name,
        generic_name: selectedCandidate.medicine.generic_name,
        dosage_form: selectedCandidate.medicine.dosage_form,
        strength: selectedCandidate.medicine.strength,
        branded_price: selectedCandidate.metrics.branded_pack_mrp,
        jan_aushadhi_price: selectedCandidate.metrics.jan_aushadhi_pack_mrp,
        savings_percentage: selectedCandidate.metrics.potential_savings_percent,
      });

      if (!error) {
        setSaveStatus('saved');
      } else {
        setSaveStatus('error');
      }
    } catch {
      setSaveStatus('error');
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `AIMAN Price Comparison: ${selectedCandidate?.medicine.brand_name}`,
          text: `Compare ${selectedCandidate?.medicine.brand_name} with Jan Aushadhi generic alternative on AIMAN.`,
          url: window.location.href,
        });
      } catch {
        // Share cancelled
      }
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      alert('Comparison link copied to clipboard!');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Search Bar Input */}
      <div className="bg-white p-5 rounded-2xl border border-surface-200 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              placeholder="Search medicine brand, generic name, or salt (e.g. Dolo 650, Metformin)..."
              className="w-full pl-10 pr-4 py-3 text-sm sm:text-base border border-surface-300 rounded-xl focus:border-brand-600 focus:ring-1 focus:ring-brand-600 text-slate-900 bg-white"
              required
            />
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-brand-800 hover:bg-brand-900 text-white rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5 shadow-sm shrink-0"
          >
            Search
          </button>
        </form>

        {/* Quick Suggestions */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-3">
          <span className="font-medium text-slate-700">Quick Examples:</span>
          {['Dolo 650', 'Metformin 500mg', 'Atorva 10', 'Azee 500', 'Pan 40'].map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => {
                setQueryInput(ex);
                router.push(`/search?q=${encodeURIComponent(ex)}&method=manual`);
              }}
              className="px-2 py-0.5 rounded bg-surface-100 hover:bg-brand-50 hover:text-brand-800 text-slate-700 border border-surface-200"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      {/* Case 1: Initial Empty Search State */}
      {!initialQuery && (
        <div className="text-center py-16 bg-white rounded-2xl border border-surface-200 p-8 space-y-4">
          <div className="w-16 h-16 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center mx-auto border border-brand-200">
            <Pill className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Search for a Prescribed Medicine</h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            Enter the brand name or active generic composition to compare verified commercial prices against official PMBI Jan Aushadhi rates.
          </p>
        </div>
      )}

      {/* Case 2: No Match Found */}
      {result && result.all_candidates.length === 0 && (
        <div className="bg-white rounded-2xl border border-surface-200 p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mx-auto border border-amber-200">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">No Verified Match Found</h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
            We could not locate an authentic PMBI or NPPA match for &ldquo;<strong>{initialQuery}</strong>&rdquo;. Please verify the spelling, check the active salt, or consult your pharmacist.
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-800 hover:text-brand-950 underline"
            >
              Try another search or browse verified formulations &rarr;
            </Link>
          </div>
        </div>
      )}

      {/* Case 3: Ambiguous Result (Multiple Strengths without dosage specified) */}
      {result && result.is_ambiguous && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-900">
            <AlertCircle className="w-4 h-4 text-amber-700" />
            Dosage Ambiguity Detected
          </div>
          <p className="text-xs sm:text-sm text-amber-950">
            {result.ambiguity_reason}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {result.all_candidates.map((cand) => (
              <button
                key={cand.medicine.id}
                type="button"
                onClick={() => setSelectedCandidate(cand)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  selectedCandidate?.medicine.id === cand.medicine.id
                    ? 'border-brand-700 bg-white shadow-sm ring-1 ring-brand-700'
                    : 'border-amber-200 bg-white/70 hover:bg-white'
                }`}
              >
                <div className="font-bold text-xs text-slate-900">{cand.medicine.brand_name}</div>
                <div className="text-[11px] text-slate-600">
                  {cand.medicine.generic_name} &bull; <strong>{cand.medicine.strength}</strong> ({cand.medicine.dosage_form})
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Case 4: Matched Medicine Price Comparison Card */}
      {selectedCandidate && (
        <div className="space-y-6">
          {/* Header Card: Confirmed Medicine Identity */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-surface-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-200 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-50 text-brand-800 border border-brand-200 mb-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-700" />
                  Verified Medicine Identity Match
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {selectedCandidate.medicine.brand_name}
                </h1>
                <p className="text-sm text-slate-600 mt-1">
                  Active Salt: <strong className="text-slate-800">{selectedCandidate.medicine.generic_name}</strong>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-start sm:self-center">
                <button
                  type="button"
                  onClick={handleSaveMedicine}
                  disabled={saveStatus === 'saving' || saveStatus === 'saved'}
                  className="px-3.5 py-2 border border-surface-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-surface-50 transition-colors flex items-center gap-1.5 disabled:opacity-60"
                >
                  <Bookmark className="w-3.5 h-3.5 text-brand-700" />
                  {saveStatus === 'saved' ? 'Saved' : saveStatus === 'saving' ? 'Saving...' : 'Save'}
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  className="p-2 border border-surface-300 rounded-lg text-slate-600 hover:bg-surface-50 transition-colors"
                  title="Share comparison"
                >
                  <Share2 className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="p-2 border border-surface-300 rounded-lg text-slate-600 hover:bg-surface-50 transition-colors"
                  title="Print summary"
                >
                  <Printer className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Medicine Specifications Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-3 bg-surface-50 rounded-lg border border-surface-200">
                <span className="text-slate-500 block">Dosage Form</span>
                <span className="font-semibold text-slate-800 text-sm">{selectedCandidate.medicine.dosage_form}</span>
              </div>
              <div className="p-3 bg-surface-50 rounded-lg border border-surface-200">
                <span className="text-slate-500 block">Strength</span>
                <span className="font-semibold text-slate-800 text-sm">{selectedCandidate.medicine.strength}</span>
              </div>
              <div className="p-3 bg-surface-50 rounded-lg border border-surface-200">
                <span className="text-slate-500 block">Standard Pack Size</span>
                <span className="font-semibold text-slate-800 text-sm">
                  {selectedCandidate.medicine.pack_size} {selectedCandidate.medicine.pack_unit}s
                </span>
              </div>
              <div className="p-3 bg-surface-50 rounded-lg border border-surface-200">
                <span className="text-slate-500 block">PMBI Product Code</span>
                <span className="font-mono font-bold text-brand-800 text-sm">
                  {selectedCandidate.medicine.jan_aushadhi_code}
                </span>
              </div>
            </div>
          </div>

          {/* Sourced Price Comparison Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Commercial Branded */}
            <div className="bg-white p-6 rounded-2xl border border-surface-200 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Commercial Brand</span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">{selectedCandidate.medicine.brand_name}</h3>
                <div className="mt-4">
                  <div className="text-3xl font-extrabold text-slate-900">
                    ₹{selectedCandidate.metrics.branded_pack_mrp.toFixed(2)}
                  </div>
                  <span className="text-xs text-slate-500">
                    for {selectedCandidate.medicine.pack_size} {selectedCandidate.medicine.pack_unit}s (₹{selectedCandidate.metrics.branded_unit_price}/unit)
                  </span>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-surface-200 text-[11px] text-slate-500">
                Representative commercial retail market price
              </div>
            </div>

            {/* Card 2: Jan Aushadhi Generic */}
            <div className="bg-brand-50/70 p-6 rounded-2xl border-2 border-brand-500 shadow-sm flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-3 right-3">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-brand-700 text-white">
                  Government PMBI
                </span>
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-900">Jan Aushadhi Generic</span>
                <h3 className="text-lg font-bold text-brand-950 mt-1">
                  {selectedCandidate.medicine.generic_name} {selectedCandidate.medicine.strength}
                </h3>
                <div className="mt-4">
                  <div className="text-3xl font-extrabold text-brand-950">
                    ₹{selectedCandidate.metrics.jan_aushadhi_pack_mrp.toFixed(2)}
                  </div>
                  <span className="text-xs text-brand-800">
                    for {selectedCandidate.medicine.pack_size} {selectedCandidate.medicine.pack_unit}s (₹{selectedCandidate.metrics.jan_aushadhi_unit_price}/unit)
                  </span>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-brand-200 text-[11px] text-brand-900 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-700" />
                Available at Pradhan Mantri Janaushadhi Kendras
              </div>
            </div>

            {/* Card 3: Potential Mathematical Savings */}
            <div className="bg-green-50/70 p-6 rounded-2xl border border-green-300 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-green-900">Estimated Savings</span>
                <div className="flex items-center gap-2 mt-1">
                  <TrendingDown className="w-6 h-6 text-green-700" />
                  <span className="text-2xl font-black text-green-800">
                    {selectedCandidate.metrics.potential_savings_percent}% Cheaper
                  </span>
                </div>
                <div className="mt-4">
                  <div className="text-3xl font-extrabold text-green-900">
                    ₹{selectedCandidate.metrics.potential_savings_amount.toFixed(2)}
                  </div>
                  <span className="text-xs text-green-800">
                    saved per pack of {selectedCandidate.medicine.pack_size} units
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-green-200">
                <Link
                  href={`/kendras?medicine=${encodeURIComponent(selectedCandidate.medicine.generic_name)}`}
                  className="w-full py-2.5 px-4 bg-brand-800 hover:bg-brand-900 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  Locate Nearby Kendras
                </Link>
              </div>
            </div>
          </div>

          {/* Sourced Data Provenance Banner */}
          <div className="bg-white p-5 rounded-xl border border-surface-200 shadow-sm text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-brand-700" />
                Data Provenance & Regulatory Traceability
              </span>
              <span className="text-slate-500">Verified Date: {selectedCandidate.medicine.verified_date}</span>
            </div>
            <p className="text-slate-600">
              <strong>Source Reference:</strong> {selectedCandidate.medicine.source_name} &bull; Statutory NPPA Price Cap: ₹{selectedCandidate.medicine.nppa_ceiling_price.toFixed(2)}/unit.
            </p>
            <div>
              <a
                href={selectedCandidate.medicine.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-brand-800 hover:text-brand-950 font-semibold underline"
              >
                View official Government Gazette documentation
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Mandatory Responsible Medical Disclaimer */}
          <DisclaimerBanner />
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-surface-50">
      <Suspense fallback={<div className="p-8 text-center text-slate-500 text-sm">Loading search comparison...</div>}>
        <SearchComponent />
      </Suspense>
    </div>
  );
}
