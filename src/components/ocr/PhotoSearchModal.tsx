'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Camera,
  Upload,
  X,
  ArrowRight,
  AlertCircle,
  RotateCcw,
  CheckCircle2,
  Edit3,
  Loader2,
  FileImage,
  ShieldCheck,
} from 'lucide-react';
import { parseMedicineQuery } from '@/lib/matching/normalizer';

interface PhotoSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PhotoSearchModal({ isOpen, onClose }: PhotoSearchModalProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrProgress, setOcrProgress] = useState<number>(0);
  const [extractedText, setExtractedText] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage(null);

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('Selected image exceeds 10MB limit. Please upload a smaller packaging photo.');
      return;
    }

    // Validate type
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please upload a valid image file (JPG, PNG, or WebP).');
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setImagePreview(result);
      runOcr(result);
    };
    reader.readAsDataURL(file);
  };

  const runOcr = async (imageUrl: string) => {
    setIsProcessing(true);
    setOcrProgress(15);
    setErrorMessage(null);

    try {
      // Dynamic import of tesseract.js for fast initial page load
      const Tesseract = await import('tesseract.js');
      setOcrProgress(35);

      const worker = await Tesseract.createWorker('eng');
      setOcrProgress(60);

      const ret = await worker.recognize(imageUrl);
      setOcrProgress(90);
      await worker.terminate();

      const text = ret.data.text.trim();
      if (!text) {
        setErrorMessage(
          'Could not detect readable printed text. Ensure the medicine packaging name and strength are clear and well-lit.'
        );
      } else {
        setExtractedText(text);
      }
    } catch {
      // Fallback for sandboxed web workers or test environments
      setErrorMessage(
        'On-device OCR worker could not complete recognition. You can type or edit the medicine name directly below.'
      );
    } finally {
      setIsProcessing(false);
      setOcrProgress(100);
    }
  };

  const handleClearImage = () => {
    setImagePreview(null);
    setFileName('');
    setExtractedText('');
    setErrorMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const handleConfirmAndSearch = () => {
    if (!extractedText.trim()) return;
    onClose();
    router.push(`/search?q=${encodeURIComponent(extractedText.trim())}&method=photo`);
  };

  const parsedPreview = extractedText.trim() ? parseMedicineQuery(extractedText) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white rounded-2xl border border-surface-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-surface-200 flex items-center justify-between bg-surface-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-800 text-white flex items-center justify-center">
              <Camera className="w-4 h-4 text-brand-200" />
            </div>
            <div>
              <h2 className="font-bold text-base text-slate-900">Packaging Photo OCR Scanner</h2>
              <p className="text-[11px] text-slate-500">Extracts printed brand & strength details</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-surface-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto">
          {/* Hidden file inputs */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
          />
          <input
            type="file"
            ref={cameraInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            capture="environment"
            className="hidden"
          />

          {/* Upload Drop Zone / Camera triggers */}
          {!imagePreview ? (
            <div className="space-y-3">
              <div className="border-2 border-dashed border-surface-300 rounded-2xl p-6 text-center space-y-3 bg-surface-50 hover:bg-brand-50/30 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-brand-100 text-brand-800 flex items-center justify-center mx-auto">
                  <FileImage className="w-6 h-6 text-brand-700" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Select Medicine Packaging Photo</h3>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto mt-0.5">
                    Clear printed strip, carton, or bottle label (JPG, PNG, WebP up to 10MB)
                  </p>
                </div>
                <div className="flex justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="px-4 py-2 bg-brand-800 hover:bg-brand-900 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    Use Camera
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 border border-surface-300 bg-white hover:bg-surface-100 text-slate-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Upload from Gallery
                  </button>
                </div>
              </div>

              {/* Scope & Privacy Notice */}
              <div className="p-3 bg-brand-50/70 border border-brand-200 rounded-xl text-[11px] text-brand-950 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-brand-900">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-700" />
                  Client-Side Privacy Guarantee:
                </div>
                <p className="text-slate-600">
                  Packaging photos are processed purely inside your browser using client-side OCR. Images are never uploaded or permanently stored on external servers.
                </p>
                <p className="text-amber-800 font-medium">
                  Note: OCR is trained on printed packaging. It does not reliably transcribe doctors&apos; handwritten prescriptions.
                </p>
              </div>
            </div>
          ) : (
            /* Image Preview & OCR Status */
            <div className="space-y-4">
              <div className="relative rounded-xl overflow-hidden border border-surface-200 bg-slate-900/5 max-h-48 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imagePreview} alt="Medicine Packaging Preview" className="object-contain max-h-48 w-full" />
                <button
                  type="button"
                  onClick={handleClearImage}
                  className="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-white text-slate-700 rounded-lg shadow-sm border border-surface-200 text-xs font-semibold flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Retake
                </button>
              </div>

              {isProcessing && (
                <div className="p-4 bg-brand-50 border border-brand-200 rounded-xl text-center space-y-2">
                  <Loader2 className="w-6 h-6 animate-spin text-brand-700 mx-auto" />
                  <p className="text-xs font-semibold text-brand-900">Extracting printed packaging text ({ocrProgress}%)...</p>
                  <div className="w-full bg-brand-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-brand-700 h-1.5 rounded-full transition-all" style={{ width: `${ocrProgress}%` }} />
                  </div>
                </div>
              )}
            </div>
          )}

          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Editable Extracted Text */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Edit3 className="w-3.5 h-3.5 text-brand-700" />
                Extracted Packaging Text (Editable):
              </span>
              {extractedText && (
                <button
                  type="button"
                  onClick={() => setExtractedText('')}
                  className="text-[11px] text-slate-400 hover:text-slate-600"
                >
                  Clear
                </button>
              )}
            </label>
            <textarea
              rows={3}
              value={extractedText}
              onChange={(e) => setExtractedText(e.target.value)}
              placeholder="Extracted medicine name, strength, or active salt will appear here. You can clean up or type the name."
              className="w-full p-3 text-sm border border-surface-300 rounded-xl focus:border-brand-600 focus:ring-1 focus:ring-brand-600 text-slate-900 bg-white"
            />
          </div>

          {/* Extracted Details Preview */}
          {parsedPreview && parsedPreview.clean_name && (
            <div className="p-3 bg-brand-50 border border-brand-200 rounded-lg text-xs text-brand-950 space-y-1">
              <div className="font-semibold flex items-center gap-1.5 text-brand-900">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-700" />
                Detected Medicine Attributes:
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                <div>
                  <span className="text-slate-500">Extracted Name:</span>{' '}
                  <strong className="text-slate-900 capitalize">{parsedPreview.clean_name}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Detected Strength:</span>{' '}
                  <strong className="text-slate-900">{parsedPreview.extracted_strength || 'Not specified'}</strong>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-surface-50 border-t border-surface-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-surface-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-white transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleConfirmAndSearch}
            disabled={!extractedText.trim() || isProcessing}
            className="px-5 py-2 bg-brand-800 hover:bg-brand-900 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50"
          >
            Confirm & Search
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
