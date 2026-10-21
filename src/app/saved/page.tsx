'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Bookmark,
  Pill,
  Trash2,
  TrendingDown,
  MapPin,
  ExternalLink,
  ArrowLeft,
  Loader2,
  AlertCircle,
  PlusCircle,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@/lib/supabase/client';
import { SavedMedicine } from '@/lib/supabase/types';

export default function SavedMedicinesPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [supabase] = useState(() => createClient());

  const [savedList, setSavedList] = useState<SavedMedicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      setLoading(false);
      return;
    }

    if (user) {
      loadSavedMedicines();
    }
  }, [user, authLoading]);

  const loadSavedMedicines = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('saved_medicines')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setSavedList(data as SavedMedicine[]);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleteId(id);
    try {
      const { error } = await supabase.from('saved_medicines').delete().eq('id', id);
      if (!error) {
        setSavedList((prev) => prev.filter((item) => item.id !== id));
      }
    } catch {
      // error
    } finally {
      setDeleteId(null);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-700" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-brand-100 text-brand-800 flex items-center justify-center mb-4">
          <Bookmark className="w-8 h-8 text-brand-700" />
        </div>
        <h1 className="text-xl font-bold text-slate-900">Sign in to view saved medicines</h1>
        <p className="text-xs text-slate-500 max-w-sm mt-1 mb-6">
          Your saved medicines and price comparisons are protected by Row Level Security and accessible only when signed in.
        </p>
        <button
          onClick={() => router.push('/login?returnTo=/saved')}
          className="px-6 py-2.5 bg-brand-800 hover:bg-brand-900 text-white rounded-lg text-sm font-semibold shadow-sm transition-colors"
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-800 hover:text-brand-950 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-800 mb-2">
            <Bookmark className="w-4 h-4 text-brand-700" />
            User Healthcare Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Saved Medicines & Comparison Watchlist
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Keep track of your regular prescribed medications and Jan Aushadhi generic equivalents.
          </p>
        </div>

        <Link
          href="/search"
          className="px-4 py-2 bg-brand-800 hover:bg-brand-900 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm self-start sm:self-center"
        >
          <PlusCircle className="w-4 h-4" />
          Compare New Medicine
        </Link>
      </div>

      {savedList.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-surface-200 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center mx-auto border border-brand-200">
            <Pill className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">No Saved Medicines Yet</h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            When you compare a medicine on AIMAN, click the &ldquo;Save&rdquo; bookmark button to store it here for quick reference and refills.
          </p>
          <div className="pt-2">
            <Link
              href="/search"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-800 hover:bg-brand-900 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
            >
              Start Searching Medicines
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savedList.map((item) => (
            <div
              key={item.id}
              className="bg-white p-5 rounded-2xl border border-surface-200 shadow-xs hover:border-brand-300 transition-colors flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{item.medicine_name}</h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Salt: <span className="font-semibold">{item.generic_name}</span> &bull; {item.strength} ({item.dosage_form})
                    </p>
                  </div>
                  {item.savings_percentage && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200 flex items-center gap-1">
                      <TrendingDown className="w-3 h-3" />
                      {item.savings_percentage}%
                    </span>
                  )}
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 text-xs p-3 bg-surface-50 rounded-xl border border-surface-200">
                  <div>
                    <span className="text-slate-500 block">Branded MRP:</span>
                    <span className="font-bold text-slate-900 text-sm">
                      ₹{item.branded_price ? item.branded_price.toFixed(2) : 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-brand-800 font-medium block">Jan Aushadhi:</span>
                    <span className="font-bold text-brand-900 text-sm">
                      ₹{item.jan_aushadhi_price ? item.jan_aushadhi_price.toFixed(2) : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-surface-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <Link
                    href={`/search?q=${encodeURIComponent(item.medicine_name)}&method=manual`}
                    className="font-semibold text-brand-800 hover:text-brand-950 flex items-center gap-1"
                  >
                    Compare Live
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                  <Link
                    href={`/kendras?medicine=${encodeURIComponent(item.generic_name || item.medicine_name)}`}
                    className="text-slate-600 hover:text-slate-900 flex items-center gap-1"
                  >
                    <MapPin className="w-3 h-3 text-slate-400" />
                    Kendras
                  </Link>
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  disabled={deleteId === item.id}
                  className="p-1.5 text-slate-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                  title="Remove from saved"
                >
                  {deleteId === item.id ? (
                    <Loader2 className="w-4 h-4 animate-spin text-red-600" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
