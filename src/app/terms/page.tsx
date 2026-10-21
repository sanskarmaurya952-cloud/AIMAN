import React from 'react';
import Link from 'next/link';
import { FileText, ShieldAlert, ArrowLeft } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-800 hover:text-brand-950 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>

      <div className="border-b border-surface-200 pb-6">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-800 mb-2">
          <FileText className="w-4 h-4 text-brand-700" />
          Legal Terms
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Terms of Service
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Last revised: October 2026 &bull; User Agreement for AIMAN Healthcare Platform
        </p>
      </div>

      <div className="bg-brand-50 border border-brand-200 rounded-2xl p-6 space-y-2">
        <div className="flex items-center gap-2 font-bold text-sm text-brand-950">
          <ShieldAlert className="w-4 h-4 text-brand-800" />
          Summary of Essential Terms
        </div>
        <p className="text-xs text-slate-700 leading-relaxed">
          AIMAN is an informational price comparison tool. It is not an online pharmacy, medical practitioner, or prescribing service. You agree never to change or substitute medications without consulting a qualified medical doctor or registered pharmacist.
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-surface-200 shadow-sm space-y-6 text-xs sm:text-sm text-slate-600 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">1. Acceptance of Terms</h2>
          <p>
            By accessing or using the AIMAN web application, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, please discontinue use of the platform.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">2. No Medical Advice or Automatic Substitution</h2>
          <p>
            AIMAN extracts drug names and compares public prices against generic formulations under the Pradhan Mantri Bhartiya Janaushadhi Pariyojana. AIMAN does not guarantee biological equivalence, suitability, or safety for your individual health circumstances. Always confirm any generic substitution with your healthcare provider.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">3. Kendra Information & Availability</h2>
          <p>
            Kendra listings are derived from verified PMBI public directories. AIMAN does not control or operate individual Jan Aushadhi stores and cannot guarantee instantaneous physical stock or operating hours.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">4. Intellectual Property & Public Records</h2>
          <p>
            Official pharmaceutical data is attributed to the National Pharmaceutical Pricing Authority (NPPA) and Pharmaceuticals and Medical Devices Bureau of India (PMBI).
          </p>
        </section>
      </div>
    </div>
  );
}
