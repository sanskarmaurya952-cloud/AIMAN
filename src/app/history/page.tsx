'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  History,
  Search,
  Mic,
  Camera,
  Trash2,
  ArrowLeft,
  Loader2,
  ArrowRight,
  Clock,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@/lib/supabase/client';
import { SearchHistoryItem } from '@/lib/supabase/types';

export default function SearchHistoryPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [supabase] = useState(() => createClient());

  const [historyList, setHistoryList] = useState<SearchHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      setLoading(false);
      return;
    }

    if (user) {
      loadHistory();
    }
  }, [user, authLoading]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('search_history')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (!error && data) {
        setHistoryList(data as SearchHistoryItem[]);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (!confirm('Are you sure you want to clear your search history?')) return;
    setClearing(true);
    try {
      const { error } = await supabase
        .from('search_history')
        .delete()
        .eq('user_id', user!.id);

      if (!error) {
        setHistoryList([]);
      }
    } catch {
      // error
    } finally {
      setClearing(false);
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
          <History className="w-8 h-8 text-brand-700" />
        </div>
        <h1 className="text-xl font-bold text-slate-900">Sign in to view your search history</h1>
        <p className="text-xs text-slate-500 max-w-sm mt-1 mb-6">
          Your search queries are encrypted and stored under PostgreSQL Row Level Security.
        </p>
        <button
          onClick={() => router.push('/login?returnTo=/history')}
          className="px-6 py-2.5 bg-brand-800 hover:bg-brand-900 text-white rounded-lg text-sm font-semibold shadow-sm transition-colors"
        >
          Sign In
        </button>
      </div>
    );
  }

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'voice':
        return <Mic className="w-4 h-4 text-brand-700" />;
      case 'photo':
        return <Camera className="w-4 h-4 text-brand-700" />;
      default:
        return <Search className="w-4 h-4 text-brand-700" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
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
            <Clock className="w-4 h-4 text-brand-700" />
            Activity Log
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Your Medicine Search History
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Past medicine lookups across manual text, voice recognition, and packaging photo scans.
          </p>
        </div>

        {historyList.length > 0 && (
          <button
            type="button"
            onClick={handleClearHistory}
            disabled={clearing}
            className="px-3.5 py-2 border border-surface-300 rounded-lg text-xs font-semibold text-slate-600 hover:text-red-700 hover:bg-red-50 transition-colors flex items-center gap-1.5 self-start sm:self-center disabled:opacity-50"
          >
            {clearing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
            Clear History
          </button>
        )}
      </div>

      {historyList.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-surface-200 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center mx-auto border border-brand-200">
            <History className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">No Search History Found</h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            Your searches via manual input, voice search, and packaging scans will appear here.
          </p>
          <div className="pt-2">
            <Link
              href="/search"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-800 hover:bg-brand-900 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
            >
              Start Searching
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-surface-200 shadow-sm divide-y divide-surface-200 overflow-hidden">
          {historyList.map((item) => (
            <div
              key={item.id}
              className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-surface-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-brand-50 flex items-center justify-center border border-brand-200 shrink-0">
                  {getMethodIcon(item.input_method)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{item.query}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <span className="capitalize">{item.input_method} input</span>
                    {item.matched_medicine && (
                      <>
                        <span>&bull;</span>
                        <span className="text-brand-800 font-semibold">Matched: {item.matched_medicine}</span>
                      </>
                    )}
                    <span>&bull;</span>
                    <span>{new Date(item.created_at).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</span>
                  </div>
                </div>
              </div>

              <Link
                href={`/search?q=${encodeURIComponent(item.query)}&method=${item.input_method}`}
                className="px-3.5 py-1.5 border border-surface-300 rounded-lg text-xs font-semibold text-brand-800 hover:bg-brand-50 flex items-center gap-1 transition-colors shrink-0"
              >
                Re-check Price
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
