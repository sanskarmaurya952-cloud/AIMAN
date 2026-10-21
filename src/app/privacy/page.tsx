import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, EyeOff, Server, ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
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
          <ShieldCheck className="w-4 h-4 text-brand-700" />
          Data Protection Commitment
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Last updated: October 2026 &bull; Strict healthcare data privacy architecture
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-surface-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-lg bg-brand-100 text-brand-800 flex items-center justify-center">
            <EyeOff className="w-5 h-5 text-brand-700" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">Zero Photo Uploads</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Medicine packaging photos are parsed strictly on-device in your web browser using client-side WebAssembly (Tesseract.js). Photos are never uploaded, sent, or saved to external servers.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-surface-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-lg bg-brand-100 text-brand-800 flex items-center justify-center">
            <Lock className="w-5 h-5 text-brand-700" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">Row Level Security (RLS)</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            All user data (search queries, saved medicines, profiles) is isolated using PostgreSQL Row Level Security policies. No user or third party can access your records.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-surface-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-lg bg-brand-100 text-brand-800 flex items-center justify-center">
            <Server className="w-5 h-5 text-brand-700" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">No Data Selling</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            AIMAN does not sell, monetize, or broker medical search queries or user profiles to insurance companies, advertising networks, or data aggregators.
          </p>
        </div>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-surface-200 shadow-sm space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
        <h2 className="text-base font-bold text-slate-900">Information We Collect</h2>
        <p>
          We collect only the minimal information required to provide price comparison and Kendra discovery:
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>Authentication Information:</strong> Email address and encrypted password or Google OAuth identifier.</li>
          <li><strong>Phone Number (Optional):</strong> Mobile number provided by you for verified SMS alerts.</li>
          <li><strong>User Activity:</strong> Prescribed search terms and saved medicine bookmarks explicitly saved by you.</li>
          <li><strong>Geolocation (Transient):</strong> GPS coordinates are used exclusively in real time to calculate Kendra distances and are never permanently stored.</li>
        </ul>
      </div>
    </div>
  );
}
