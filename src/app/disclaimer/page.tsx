import React from 'react';
import Link from 'next/link';
import { ShieldAlert, AlertTriangle, CheckCircle2, ArrowLeft, FileText, Stethoscope } from 'lucide-react';

export default function DisclaimerPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      {/* Back button */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-800 hover:text-brand-950 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>

      {/* Header */}
      <div className="border-b border-surface-200 pb-6">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-800 mb-2">
          <ShieldAlert className="w-4 h-4 text-brand-700" />
          Official Health & Safety Notice
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Medical Disclaimer & Responsible Use Policy
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Last reviewed: October 2026 &bull; Compliant with Indian public health guidelines
        </p>
      </div>

      {/* Mandatory Statutory Notice Box */}
      <div className="bg-brand-50 border border-brand-200 rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex items-start gap-3">
          <Stethoscope className="w-6 h-6 text-brand-800 shrink-0 mt-0.5" />
          <div className="space-y-2">
            <h2 className="text-base font-bold text-brand-950">
              Not a Substitute for Professional Medical Advice
            </h2>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
              &ldquo;AIMAN provides AI-assisted medicine identification and price information for informational purposes only. AI and OCR results may be incorrect, and prices or availability may change. This application does not diagnose, prescribe, or authorize medicine substitutions. Always verify the exact medicine, active ingredient, strength, dosage form, and any substitution with your doctor or pharmacist before purchasing or using a medicine.&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* Key Safety Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-surface-200 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            No Automatic Substitution
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            The platform displays generic equivalents manufactured under the Pradhan Mantri Bhartiya Janaushadhi Pariyojana (PMBJP). However, lower price does not automatically imply clinical equivalence for every individual. Always consult your prescribing doctor.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-surface-200 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            Authentic Sourced Data
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            All prices and ceiling caps are sourced from public gazette orders of the National Pharmaceutical Pricing Authority (NPPA) and Pharmaceuticals & Medical Devices Bureau of India (PMBI).
          </p>
        </div>
      </div>

      {/* Distinction of Concepts */}
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-surface-200 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900">Important Price Concept Distinctions</h3>
        <ul className="space-y-3 text-xs sm:text-sm text-slate-600">
          <li className="flex items-start gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-700 mt-1.5 shrink-0" />
            <span>
              <strong>Jan Aushadhi Listed MRP:</strong> The official retail maximum price at government PMBJP Kendras.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-700 mt-1.5 shrink-0" />
            <span>
              <strong>Branded Market MRP:</strong> Representative retail price of leading commercial brands manufactured by pharmaceutical companies.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-700 mt-1.5 shrink-0" />
            <span>
              <strong>NPPA Ceiling Price:</strong> The statutory maximum cap notified by the Government of India under DPCO 2013, which commercial brands cannot exceed.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
