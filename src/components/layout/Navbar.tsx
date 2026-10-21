'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Pill, MapPin, ShieldCheck, Menu, X, ArrowRight, User as UserIcon, Bookmark, History } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-surface-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Platform Name */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-brand-800 text-white flex items-center justify-center shadow-sm group-hover:bg-brand-900 transition-colors">
              <Pill className="w-5 h-5 text-brand-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xl tracking-tight text-brand-950">AIMAN</span>
                <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded bg-brand-100 text-brand-800 border border-brand-200">
                  Jan Aushadhi
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">Medicine Price Comparison Platform</p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-700">
            <Link href="/search" className="hover:text-brand-700 transition-colors flex items-center gap-1.5">
              <Pill className="w-4 h-4 text-brand-600" />
              Compare Medicines
            </Link>
            <Link href="/kendras" className="hover:text-brand-700 transition-colors flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-brand-600" />
              Locate Kendras
            </Link>
            <Link href="/sources" className="hover:text-brand-700 transition-colors flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-brand-600" />
              Data Provenance
            </Link>
            <Link href="/disclaimer" className="hover:text-brand-700 transition-colors text-slate-500">
              Disclaimer
            </Link>
          </nav>

          {/* Desktop CTA / Auth buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/saved"
                  className="p-2 text-slate-600 hover:text-brand-800 hover:bg-brand-50 rounded-lg transition-colors"
                  title="Saved Medicines"
                >
                  <Bookmark className="w-4 h-4" />
                </Link>
                <Link
                  href="/history"
                  className="p-2 text-slate-600 hover:text-brand-800 hover:bg-brand-50 rounded-lg transition-colors"
                  title="Search History"
                >
                  <History className="w-4 h-4" />
                </Link>
                <Link
                  href="/profile"
                  className="px-3 py-1.5 text-xs font-semibold text-brand-900 bg-brand-50 hover:bg-brand-100 border border-brand-200 rounded-lg transition-colors flex items-center gap-2 ml-1"
                >
                  <div className="w-5 h-5 rounded-full bg-brand-800 text-white flex items-center justify-center text-[10px] font-bold">
                    {profile?.display_name ? profile.display_name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
                  </div>
                  <span>{profile?.display_name || user.email?.split('@')[0]}</span>
                </Link>
                <button
                  type="button"
                  onClick={() => signOut()}
                  className="px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors ml-1"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-brand-800 hover:text-brand-900 transition-colors rounded-lg hover:bg-brand-50"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 text-sm font-medium text-white bg-brand-800 hover:bg-brand-900 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                >
                  Register
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-surface-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <Link
            href="/search"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-800 hover:bg-brand-50 hover:text-brand-800"
          >
            Compare Medicines
          </Link>
          <Link
            href="/kendras"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-800 hover:bg-brand-50 hover:text-brand-800"
          >
            Locate Kendras
          </Link>
          <Link
            href="/sources"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-800 hover:bg-brand-50 hover:text-brand-800"
          >
            Data Provenance (PMBI / NPPA)
          </Link>
          <Link
            href="/disclaimer"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-600 hover:bg-slate-50"
          >
            Medical Disclaimer
          </Link>
          <div className="pt-3 border-t border-surface-200 flex flex-col gap-2">
            {user ? (
              <>
                <Link
                  href="/saved"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 px-4 text-xs font-semibold text-slate-700 bg-surface-50 border border-surface-200 rounded-lg flex items-center justify-center gap-1.5"
                >
                  <Bookmark className="w-3.5 h-3.5 text-brand-700" />
                  Saved Medicines
                </Link>
                <Link
                  href="/history"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 px-4 text-xs font-semibold text-slate-700 bg-surface-50 border border-surface-200 rounded-lg flex items-center justify-center gap-1.5"
                >
                  <History className="w-3.5 h-3.5 text-brand-700" />
                  Search History
                </Link>
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 px-4 text-sm font-medium text-brand-900 bg-brand-50 border border-brand-200 rounded-lg flex items-center justify-center gap-2"
                >
                  <UserIcon className="w-4 h-4 text-brand-700" />
                  My Profile ({profile?.display_name || user.email?.split('@')[0]})
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center py-2 px-4 text-sm font-medium text-slate-600 hover:text-slate-900"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 px-4 text-sm font-medium text-brand-800 border border-brand-200 rounded-lg hover:bg-brand-50"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 px-4 text-sm font-medium text-white bg-brand-800 rounded-lg shadow-sm hover:bg-brand-900"
                >
                  Register Account
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
