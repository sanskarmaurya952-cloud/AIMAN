'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  Mic,
  Camera,
  CheckCircle2,
  MapPin,
  TrendingDown,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Building2,
  FileText,
} from 'lucide-react';
import { VoiceSearchModal } from '@/components/voice/VoiceSearchModal';
import { PhotoSearchModal } from '@/components/ocr/PhotoSearchModal';

export default function HomePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'text' | 'voice' | 'photo'>('text');
  const [searchQuery, setSearchQuery] = useState('');
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  const [photoModalOpen, setPhotoModalOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}&method=manual`);
  };

  const handleSampleClick = (medName: string) => {
    setSearchQuery(medName);
    router.push(`/search?q=${encodeURIComponent(medName)}&method=manual`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-brand-50/60 via-white to-surface-50 pt-12 pb-16 border-b border-surface-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-100/70 border border-brand-200 text-brand-900 text-xs font-semibold mb-6">
            <Building2 className="w-3.5 h-3.5 text-brand-700" />
            <span>Official PMBI Jan Aushadhi & NPPA Data Integration</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-brand-950 tracking-tight leading-tight max-w-3xl mx-auto">
            Compare Medicine Prices with Verified Jan Aushadhi Alternatives
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Discover affordable generic equivalents backed by the Government of India. 
            Identify prescribed medicines via <strong>Text</strong>, <strong>Voice</strong>, or <strong>Packaging Photo</strong> through one unified, safety-first pipeline.
          </p>

          {/* Unified Multi-Modal Input Container */}
          <div className="mt-10 max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-surface-200 overflow-hidden text-left">
            {/* Input Method Tabs */}
            <div className="grid grid-cols-3 border-b border-surface-200 bg-surface-50 text-xs sm:text-sm font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab('text')}
                className={`py-3 px-4 flex items-center justify-center gap-2 border-b-2 transition-all ${
                  activeTab === 'text'
                    ? 'border-brand-700 bg-white text-brand-900 shadow-sm'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Search className="w-4 h-4 text-brand-700" />
                <span>1. Manual Search</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('voice')}
                className={`py-3 px-4 flex items-center justify-center gap-2 border-b-2 transition-all ${
                  activeTab === 'voice'
                    ? 'border-brand-700 bg-white text-brand-900 shadow-sm'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Mic className="w-4 h-4 text-brand-700" />
                <span>2. Voice Search</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('photo')}
                className={`py-3 px-4 flex items-center justify-center gap-2 border-b-2 transition-all ${
                  activeTab === 'photo'
                    ? 'border-brand-700 bg-white text-brand-900 shadow-sm'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Camera className="w-4 h-4 text-brand-700" />
                <span>3. Photo / OCR</span>
              </button>
            </div>

            {/* Tab 1: Manual Search */}
            {activeTab === 'text' && (
              <div className="p-6">
                <form onSubmit={handleSearchSubmit} className="space-y-4">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Enter brand name or salt (e.g., Dolo 650, Paracetamol 500mg, Metformin)..."
                      className="w-full pl-11 pr-28 py-3.5 text-sm sm:text-base border border-surface-300 rounded-xl focus:border-brand-600 focus:ring-2 focus:ring-brand-100 transition-all text-slate-900 placeholder:text-slate-400 bg-white"
                      required
                    />
                    <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <button
                      type="submit"
                      className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 bg-brand-800 hover:bg-brand-900 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      Compare
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Sample Searches */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 pt-1">
                    <span className="font-medium text-slate-700">Verified Samples:</span>
                    {['Paracetamol 650mg', 'Metformin 500mg', 'Atorvastatin 10mg', 'Amlodipine 5mg'].map(
                      (sample) => (
                        <button
                          key={sample}
                          type="button"
                          onClick={() => handleSampleClick(sample)}
                          className="px-2.5 py-1 rounded-md bg-surface-100 hover:bg-brand-50 hover:text-brand-800 text-slate-700 border border-surface-200 transition-colors"
                        >
                          {sample}
                        </button>
                      )
                    )}
                  </div>
                </form>
              </div>
            )}

            {/* Tab 2: Voice Search Preview */}
            {activeTab === 'voice' && (
              <div className="p-6 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-brand-100 text-brand-800 flex items-center justify-center border border-brand-200">
                  <Mic className="w-8 h-8 text-brand-700" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">Voice-Assisted Medicine Search</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                    Speak your medicine name in English or Hindi. Our engine extracts the medicine name, dosage, and strength for confirmation before lookup.
                  </p>
                </div>
                <div className="bg-surface-50 p-3 rounded-lg border border-surface-200 text-xs text-slate-600 max-w-lg mx-auto italic">
                  &ldquo;Find the price information for paracetamol 650 and show nearby Jan Aushadhi Kendras&rdquo;
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => setVoiceModalOpen(true)}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-800 hover:bg-brand-900 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm"
                  >
                    <Mic className="w-4 h-4" />
                    Start Voice Search
                  </button>
                </div>
              </div>
            )}

            {/* Tab 3: Photo / OCR Preview */}
            {activeTab === 'photo' && (
              <div className="p-6 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-brand-100 text-brand-800 flex items-center justify-center border border-brand-200">
                  <Camera className="w-8 h-8 text-brand-700" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">Packaging Photo OCR Scanner</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                    Capture or upload a clear photo of printed medicine packaging (strips, bottles, or cartons) to automatically extract printed drug details.
                  </p>
                </div>
                <div className="border-2 border-dashed border-surface-300 rounded-xl p-4 max-w-lg mx-auto bg-surface-50 text-xs text-slate-500">
                  Supports JPG, PNG, WebP up to 10MB. Text is editable and confirmed by you before lookup.
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => setPhotoModalOpen(true)}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-800 hover:bg-brand-900 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm"
                  >
                    <Camera className="w-4 h-4" />
                    Upload / Scan Medicine
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Feature Pillar Highlights */}
      <section className="py-14 bg-white border-b border-surface-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl font-bold text-slate-900">Transparent & Verified Healthcare Discovery</h2>
            <p className="mt-2 text-sm text-slate-600">
              AIMAN provides genuine data provenance, mathematical price unit normalization, and physical Kendra discovery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="p-6 rounded-xl border border-surface-200 bg-surface-50 hover:border-brand-300 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-brand-100 text-brand-800 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-5 h-5 text-brand-700" />
              </div>
              <h3 className="text-base font-bold text-slate-900">PMBI & NPPA Verified</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Prices and formulations are directly mapped to official Jan Aushadhi product portfolios and NPPA ceiling price schedules. No fabricated rates or arbitrary approximations.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-xl border border-surface-200 bg-surface-50 hover:border-brand-300 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-brand-100 text-brand-800 flex items-center justify-center mb-4">
                <TrendingDown className="w-5 h-5 text-brand-700" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Exact Unit Normalization</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Direct per-tablet, per-capsule, or per-ml pricing comparisons. We never equate a 10-strip to a 100-bottle without mathematical unit conversion.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-xl border border-surface-200 bg-surface-50 hover:border-brand-300 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-brand-100 text-brand-800 flex items-center justify-center mb-4">
                <MapPin className="w-5 h-5 text-brand-700" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Nearby Kendra Discovery</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Locate verified Jan Aushadhi Kendras near your location or pincode with distance sorting, address details, and directions without paid map lock-in.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-14 bg-surface-50 border-b border-surface-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs uppercase font-bold tracking-wider text-brand-800 bg-brand-100 px-2.5 py-1 rounded">
              Standard Operating Process
            </span>
            <h2 className="text-2xl font-bold text-slate-900 mt-2">How AIMAN Works End-to-End</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Input Prescribed Drug',
                desc: 'Type medicine name, speak via voice recognition, or upload a photo of your printed medicine pack.',
              },
              {
                step: '02',
                title: 'Shared Normalization',
                desc: 'Text is parsed for active ingredient, formulation, dosage form, and strength (e.g., Paracetamol 650mg).',
              },
              {
                step: '03',
                title: 'Verified Comparison',
                desc: 'Our engine retrieves verified PMBI Jan Aushadhi prices and NPPA ceiling caps for the matching active salt.',
              },
              {
                step: '04',
                title: 'Locate & Verify',
                desc: 'Find the nearest Jan Aushadhi Kendra with directions. Confirm suitability with your doctor or pharmacist.',
              },
            ].map((item) => (
              <div key={item.step} className="bg-white p-6 rounded-xl border border-surface-200 relative">
                <div className="text-2xl font-extrabold text-brand-200">{item.step}</div>
                <h3 className="text-base font-bold text-slate-900 mt-2">{item.title}</h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mandatory Medical Safety & Disclaimer Notice */}
      <section className="py-10 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-brand-50 border border-brand-200 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start gap-4">
            <ShieldAlert className="w-8 h-8 text-brand-800 shrink-0 mt-1" />
            <div className="space-y-2">
              <h3 className="font-bold text-base text-brand-950">Responsible Use & Medical Disclaimer</h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                AIMAN provides AI-assisted medicine identification and price information for informational purposes only. AI and OCR results may be subject to reading uncertainty, and market prices or Kendra stock may change. <strong>This application does not diagnose, prescribe, or authorize medicine substitutions.</strong> Always verify the exact medicine, active ingredient, strength, dosage form, and any substitution with your doctor or pharmacist before purchasing or using a medicine.
              </p>
              <div className="pt-2">
                <Link
                  href="/disclaimer"
                  className="text-xs font-semibold text-brand-800 hover:text-brand-950 underline"
                >
                  Read the complete Medical Disclaimer and Provenance Terms &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Voice & Photo Multi-Modal Modals */}
      <VoiceSearchModal isOpen={voiceModalOpen} onClose={() => setVoiceModalOpen(false)} />
      <PhotoSearchModal isOpen={photoModalOpen} onClose={() => setPhotoModalOpen(false)} />
    </div>
  );
}
