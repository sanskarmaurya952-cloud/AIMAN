import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ExternalLink, ArrowLeft, Database, Building2, CheckCircle2 } from 'lucide-react';
import { VERIFIED_MEDICINES } from '@/data/verifiedMedicines';

export default function SourcesPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-800 hover:text-brand-950 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>

      <div className="border-b border-surface-200 pb-6">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-800 mb-2">
          <ShieldCheck className="w-4 h-4 text-brand-700" />
          Transparency & Data Integrity
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Official Data Provenance & Sources
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          All medicine pricing and Jan Aushadhi generic records are grounded in verified public records from the Government of India.
        </p>
      </div>

      {/* Primary Data Sources Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-surface-200 shadow-sm space-y-4">
          <div className="w-10 h-10 rounded-lg bg-brand-100 text-brand-800 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-brand-700" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">PMBI Jan Aushadhi Portal</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Maintained by the Pharmaceuticals and Medical Devices Bureau of India (PMBI) under the Department of Pharmaceuticals, Ministry of Chemicals and Fertilizers.
          </p>
          <div className="pt-2">
            <a
              href="https://janaushadhi.gov.in/product-portfolio/product-view-list"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-800 hover:text-brand-950 underline"
            >
              PMBI Product Portfolio List
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-surface-200 shadow-sm space-y-4">
          <div className="w-10 h-10 rounded-lg bg-brand-100 text-brand-800 flex items-center justify-center">
            <Database className="w-5 h-5 text-brand-700" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">NPPA Pharma Sahi Daam</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Official search tool and gazette notifications by the National Pharmaceutical Pricing Authority (NPPA), fixing statutory price ceilings under DPCO 2013.
          </p>
          <div className="pt-2">
            <a
              href="https://nppaipdms.gov.in/NPPA/PharmaSahiDaam/searchMedicine"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-800 hover:text-brand-950 underline"
            >
              Pharma Sahi Daam Search
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Sourced Records Table */}
      <div className="bg-white rounded-2xl border border-surface-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-surface-200">
          <h3 className="font-bold text-base text-slate-900">Verified Sourced Portfolio ({VERIFIED_MEDICINES.length} Essential Formulations)</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Representative sample of essential medicines mapped to official PMBI codes and NPPA orders.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-50 text-slate-700 uppercase font-semibold border-b border-surface-200">
              <tr>
                <th className="p-3">Brand Name</th>
                <th className="p-3">Generic Salt</th>
                <th className="p-3">Strength</th>
                <th className="p-3">PMBI Code</th>
                <th className="p-3">Jan Aushadhi MRP</th>
                <th className="p-3">NPPA Ceiling Cap</th>
                <th className="p-3">Source Gazette</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-200 text-slate-800">
              {VERIFIED_MEDICINES.map((med) => (
                <tr key={med.id} className="hover:bg-brand-50/40 transition-colors">
                  <td className="p-3 font-semibold text-slate-900">{med.brand_name}</td>
                  <td className="p-3">{med.generic_name}</td>
                  <td className="p-3">{med.strength}</td>
                  <td className="p-3 font-mono text-brand-800 font-semibold">{med.jan_aushadhi_code}</td>
                  <td className="p-3 font-semibold text-green-700">₹{med.jan_aushadhi_mrp.toFixed(2)}</td>
                  <td className="p-3 text-slate-600">₹{med.nppa_ceiling_price.toFixed(2)}/unit</td>
                  <td className="p-3 text-slate-500 text-[11px] truncate max-w-xs">{med.source_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
