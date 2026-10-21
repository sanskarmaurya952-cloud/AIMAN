import React from 'react';
import { AlertCircle } from 'lucide-react';

interface DisclaimerBannerProps {
  compact?: boolean;
}

export function DisclaimerBanner({ compact = false }: DisclaimerBannerProps) {
  if (compact) {
    return (
      <div className="bg-brand-50 border border-brand-200 rounded-lg p-3 text-xs text-brand-900 flex items-start gap-2">
        <AlertCircle className="w-4 h-4 text-brand-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold">Informational Purpose Only:</span> AIMAN does not diagnose, prescribe, or authorize medicine substitutions. Always verify active ingredients, dosage, and suitability with a registered physician or pharmacist.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-brand-50 border-y border-brand-200 py-3 px-4">
      <div className="max-w-7xl mx-auto flex items-start sm:items-center gap-3 text-xs sm:text-sm text-brand-950">
        <AlertCircle className="w-5 h-5 text-brand-700 shrink-0 mt-0.5 sm:mt-0" />
        <p className="leading-relaxed">
          <strong className="font-semibold text-brand-900">Official Health Notice:</strong> AIMAN provides medicine price comparison against Jan Aushadhi generic equivalents using official PMBI and NPPA data. This platform does not provide medical advice or substitute professional consultation. Always confirm with your doctor or pharmacist before changing medicines.
        </p>
      </div>
    </div>
  );
}
