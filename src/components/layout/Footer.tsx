import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ExternalLink, HeartPulse } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white border-t border-surface-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: About AIMAN */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-brand-800 text-white flex items-center justify-center font-bold text-sm">
                A
              </div>
              <span className="font-bold text-lg text-brand-950">AIMAN</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Empowering citizens with transparent, verified medicine price comparison and Jan Aushadhi generic discovery. Built with authentic PMBI and NPPA public health data.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-brand-800 font-medium">
              <ShieldCheck className="w-4 h-4 text-brand-600" />
              100% Sourced Public Records
            </div>
          </div>

          {/* Column 2: Public Data Sources */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Official Data Sources
            </h3>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <a
                  href="https://janaushadhi.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-700 flex items-center gap-1 transition-colors"
                >
                  PMBI Jan Aushadhi Portal
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://nppaipdms.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-700 flex items-center gap-1 transition-colors"
                >
                  NPPA Pharma Sahi Daam
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.nppa.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-700 flex items-center gap-1 transition-colors"
                >
                  NPPA Ceiling Price Lists
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </li>
              <li>
                <Link href="/sources" className="hover:text-brand-700 font-medium text-brand-800">
                  Data Verification Methodology &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Platform Navigation */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Platform
            </h3>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <Link href="/search" className="hover:text-brand-700 transition-colors">
                  Medicine Price Search
                </Link>
              </li>
              <li>
                <Link href="/kendras" className="hover:text-brand-700 transition-colors">
                  Jan Aushadhi Kendra Locator
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-brand-700 transition-colors">
                  Account Sign In
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-brand-700 transition-colors">
                  Create Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Compliance & Disclaimer */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Compliance & Safety
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-3">
              AIMAN does not sell medicines or replace registered medical practitioners. Always confirm substitutions with your doctor.
            </p>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li>
                <Link href="/disclaimer" className="hover:text-brand-700 font-semibold text-brand-800 underline">
                  Full Medical Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-brand-700">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-brand-700">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-surface-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>&copy; {new Date().getFullYear()} AIMAN Platform. All public medical datasets attributed to PMBI & NPPA.</p>
          <div className="flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-brand-700" />
            <span>Dedicated to affordable and accessible healthcare for all.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
