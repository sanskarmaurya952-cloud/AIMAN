'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  MapPin,
  Navigation,
  Phone,
  Building2,
  ExternalLink,
  Search,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Loader2,
  Pill,
} from 'lucide-react';
import { VERIFIED_KENDRAS, KendraRecord } from '@/data/verifiedKendras';
import { calculateDistance, formatDistance, PINCODE_COORDINATES } from '@/lib/geo/distance';
import { DisclaimerBanner } from '@/components/ui/DisclaimerBanner';

interface KendraWithDistance extends KendraRecord {
  distanceKm?: number;
}

function KendraLocatorComponent() {
  const searchParams = useSearchParams();
  const preselectedMedicine = searchParams.get('medicine');
  const initialPincode = searchParams.get('pincode') || '';

  const [searchInput, setSearchInput] = useState(initialPincode);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; source: string } | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  // Check initial pincode on mount
  useEffect(() => {
    if (initialPincode && PINCODE_COORDINATES[initialPincode]) {
      const coord = PINCODE_COORDINATES[initialPincode];
      setUserLocation({ lat: coord.lat, lng: coord.lng, source: `PIN Code ${initialPincode} (${coord.city})` });
    }
  }, [initialPincode]);

  const handleUseCurrentLocation = () => {
    setGeoError(null);
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser. Please enter your PIN code manually below.');
      return;
    }

    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          source: 'GPS Geolocation',
        });
        setGeoLoading(false);
      },
      (err) => {
        setGeoLoading(false);
        if (err.code === err.PERMISSION_DENIED) {
          setGeoError('Location access was denied. You can search by entering your 6-digit PIN code or city below.');
        } else {
          setGeoError('Could not determine your GPS location. Please use manual PIN code search.');
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setGeoError(null);
    const cleaned = searchInput.trim();

    if (PINCODE_COORDINATES[cleaned]) {
      const coord = PINCODE_COORDINATES[cleaned];
      setUserLocation({ lat: coord.lat, lng: coord.lng, source: `PIN Code ${cleaned} (${coord.city})` });
    } else {
      // Clear specific coords so text filter is applied across all records
      setUserLocation(null);
    }
  };

  // Filter and sort Kendras
  const filteredKendras: KendraWithDistance[] = useMemo(() => {
    let list: KendraWithDistance[] = VERIFIED_KENDRAS.map((k) => {
      if (userLocation) {
        const dist = calculateDistance(userLocation.lat, userLocation.lng, k.latitude, k.longitude);
        return { ...k, distanceKm: dist };
      }
      return { ...k };
    });

    const query = searchInput.trim().toLowerCase();
    if (query && !PINCODE_COORDINATES[query]) {
      list = list.filter(
        (k) =>
          k.name.toLowerCase().includes(query) ||
          k.district.toLowerCase().includes(query) ||
          k.state.toLowerCase().includes(query) ||
          k.pincode.includes(query) ||
          k.address.toLowerCase().includes(query)
      );
    }

    // Sort by distance if location active, otherwise alphabetical
    if (userLocation) {
      list.sort((a, b) => (a.distanceKm ?? 99999) - (b.distanceKm ?? 99999));
    } else {
      list.sort((a, b) => a.state.localeCompare(b.state) || a.district.localeCompare(b.district));
    }

    return list;
  }, [searchInput, userLocation]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
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
          <Building2 className="w-4 h-4 text-brand-700" />
          PMBI Kendra Discovery Network
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Locate Pradhan Mantri Jan Aushadhi Kendras
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Find government-authorized Jan Aushadhi stores offering quality generic medicines at affordable prices.
        </p>

        {preselectedMedicine && (
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-brand-50 border border-brand-200 rounded-lg text-xs font-semibold text-brand-900">
            <Pill className="w-3.5 h-3.5 text-brand-700" />
            Showing Kendras carrying generic equivalent for: <strong>{preselectedMedicine}</strong>
          </div>
        )}
      </div>

      {/* Search & Location Controls Card */}
      <div className="bg-white p-6 rounded-2xl border border-surface-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Manual input */}
          <form onSubmit={handleManualSearch} className="flex-1 w-full relative">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Enter 6-digit PIN Code (e.g. 110001, 226001, 400028) or City/District..."
              className="w-full pl-10 pr-24 py-3 text-sm border border-surface-300 rounded-xl focus:border-brand-600 focus:ring-1 focus:ring-brand-600 text-slate-900 bg-white"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-brand-800 hover:bg-brand-900 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              Filter
            </button>
          </form>

          <span className="text-xs text-slate-400 font-medium hidden sm:inline">OR</span>

          {/* Explicit GPS button */}
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={geoLoading}
            className="w-full sm:w-auto px-5 py-3 border border-brand-300 bg-brand-50 hover:bg-brand-100 text-brand-900 font-semibold rounded-xl text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 shadow-xs shrink-0 disabled:opacity-60"
          >
            {geoLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-brand-700" />
            ) : (
              <Navigation className="w-4 h-4 text-brand-700" />
            )}
            Use My Location (GPS)
          </button>
        </div>

        {/* Location Status Badge */}
        {userLocation && (
          <div className="flex items-center justify-between text-xs p-2.5 bg-green-50 border border-green-200 rounded-lg text-green-900">
            <div className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4 text-green-700" />
              Active Origin: <strong>{userLocation.source}</strong> (Kendras sorted by nearest distance)
            </div>
            <button
              type="button"
              onClick={() => {
                setUserLocation(null);
                setSearchInput('');
              }}
              className="text-[11px] underline text-green-800 hover:text-green-950 font-semibold"
            >
              Reset
            </button>
          </div>
        )}

        {/* Geolocation Error Alert */}
        {geoError && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>{geoError}</span>
          </div>
        )}
      </div>

      {/* Kendra Results List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">
            Verified Jan Aushadhi Stores ({filteredKendras.length} Found)
          </h2>
          <span className="text-xs text-slate-500">Source: PMBI Kendra Locator Database</span>
        </div>

        {filteredKendras.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-surface-200 text-center space-y-3">
            <AlertTriangle className="w-8 h-8 text-amber-600 mx-auto" />
            <h3 className="font-bold text-sm text-slate-900">No Jan Aushadhi Kendras Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No registered centres matched your filter &ldquo;{searchInput}&rdquo;. Try searching for a nearby district or major city.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredKendras.map((kendra) => (
              <div
                key={kendra.kendra_code}
                className="bg-white p-5 rounded-2xl border border-surface-200 shadow-xs hover:border-brand-300 transition-colors flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-brand-800 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                        {kendra.kendra_code}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 mt-1.5 leading-snug">{kendra.name}</h3>
                    </div>

                    {kendra.distanceKm !== undefined && (
                      <span className="px-2.5 py-1 bg-green-50 text-green-800 border border-green-200 rounded-full text-xs font-bold shrink-0">
                        {formatDistance(kendra.distanceKm)}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 mt-2 flex items-start gap-1.5 leading-relaxed">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>
                      {kendra.address}, PIN: <strong>{kendra.pincode}</strong>, {kendra.district}, {kendra.state}
                    </span>
                  </p>

                  <div className="mt-2 text-xs text-slate-600 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <a href={`tel:${kendra.contact}`} className="text-brand-800 font-semibold hover:underline">
                      {kendra.contact}
                    </a>
                  </div>
                </div>

                <div className="pt-3 border-t border-surface-200 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-500">Agency: {kendra.operating_agency}</span>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${kendra.latitude},${kendra.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-semibold text-brand-800 hover:text-brand-950 transition-colors"
                  >
                    Get Directions
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Real-time Inventory Disclaimer */}
      <div className="p-4 bg-brand-50 border border-brand-200 rounded-xl text-xs text-slate-700 space-y-1">
        <div className="font-bold flex items-center gap-1.5 text-brand-900">
          <ShieldCheck className="w-4 h-4 text-brand-700" />
          Kendra Stock & Hours Verification:
        </div>
        <p className="text-slate-600 leading-relaxed">
          AIMAN displays authorized Pradhan Mantri Bhartiya Janaushadhi Kendras verified from official PMBI portal listings. Due to dynamic local dispensary dispensing, <strong>real-time medicine stock and exact operating hours should be confirmed by telephone with the Kendra pharmacist</strong> prior to travel.
        </p>
      </div>

      <DisclaimerBanner />
    </div>
  );
}

export default function KendrasPage() {
  return (
    <div className="min-h-screen bg-surface-50">
      <Suspense fallback={<div className="p-8 text-center text-slate-500 text-sm">Loading Kendra locator...</div>}>
        <KendraLocatorComponent />
      </Suspense>
    </div>
  );
}
