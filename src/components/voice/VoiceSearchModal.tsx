'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Mic,
  MicOff,
  X,
  ArrowRight,
  AlertCircle,
  RotateCcw,
  Volume2,
  CheckCircle2,
  Edit3,
} from 'lucide-react';
import { parseMedicineQuery } from '@/lib/matching/normalizer';

// Type definitions for SpeechRecognition API
interface IWindow extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

interface VoiceSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VoiceSearchModal({ isOpen, onClose }: VoiceSearchModalProps) {
  const router = useRouter();
  const [isListening, setIsListening] = useState(false);
  const [language, setLanguage] = useState<'en-IN' | 'hi-IN'>('en-IN');
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const win = window as unknown as IWindow;
    const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      setErrorMessage(
        'Browser Speech Recognition is not supported in your current browser. Please use Chrome, Edge, or enter text manually.'
      );
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = language;

    recognition.onstart = () => {
      setIsListening(true);
      setErrorMessage(null);
    };

    recognition.onresult = (event: any) => {
      let currentTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript;
      }
      setTranscript(currentTranscript);
    };

    recognition.onerror = (event: any) => {
      setIsListening(false);
      if (event.error === 'not-allowed' || event.error === 'permission-denied') {
        setErrorMessage(
          'Microphone permission was denied. Please allow microphone access in your browser address bar to use voice search.'
        );
      } else if (event.error === 'no-speech') {
        setErrorMessage('No speech was detected. Please click the microphone and try speaking again.');
      } else if (event.error === 'network') {
        setErrorMessage('Speech recognition network error. Please verify your connection or type manually.');
      } else {
        setErrorMessage(`Speech recognition error: ${event.error}`);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
    };
  }, [language]);

  if (!isOpen) return null;

  const handleStartListening = () => {
    setErrorMessage(null);
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.lang = language;
      recognitionRef.current.start();
    } catch {
      // Recognition may already be running
      try {
        recognitionRef.current.stop();
        recognitionRef.current.start();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleStopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.error(err);
      }
    }
    setIsListening(false);
  };

  const handleConfirmAndSearch = () => {
    if (!transcript.trim()) return;
    onClose();
    router.push(`/search?q=${encodeURIComponent(transcript.trim())}&method=voice`);
  };

  // Preview extracted details before confirming
  const parsedPreview = transcript.trim() ? parseMedicineQuery(transcript) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white rounded-2xl border border-surface-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-5 border-b border-surface-200 flex items-center justify-between bg-surface-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-800 text-white flex items-center justify-center">
              <Mic className="w-4 h-4 text-brand-200" />
            </div>
            <div>
              <h2 className="font-bold text-base text-slate-900">Voice Medicine Search</h2>
              <p className="text-[11px] text-slate-500">Shared Identification Pipeline</p>
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

        {/* Modal Content */}
        <div className="p-6 space-y-5">
          {/* Language Selector */}
          <div className="flex items-center justify-between text-xs border-b border-surface-200 pb-3">
            <span className="font-medium text-slate-600 flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-brand-700" />
              Recognition Language:
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setLanguage('en-IN')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                  language === 'en-IN'
                    ? 'bg-brand-800 text-white shadow-xs'
                    : 'bg-surface-100 text-slate-600 hover:bg-surface-200'
                }`}
              >
                English (India)
              </button>
              <button
                type="button"
                onClick={() => setLanguage('hi-IN')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                  language === 'hi-IN'
                    ? 'bg-brand-800 text-white shadow-xs'
                    : 'bg-surface-100 text-slate-600 hover:bg-surface-200'
                }`}
              >
                हिन्दी (Hindi)
              </button>
            </div>
          </div>

          {/* Microphone Activation Pulse Button */}
          <div className="text-center py-4 space-y-3">
            <button
              type="button"
              onClick={isListening ? handleStopListening : handleStartListening}
              disabled={!isSupported}
              className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto transition-all shadow-md ${
                isListening
                  ? 'bg-red-600 text-white ring-4 ring-red-200 animate-pulse'
                  : 'bg-brand-800 hover:bg-brand-900 text-white'
              } disabled:opacity-50`}
            >
              {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8 text-brand-200" />}
            </button>
            <p className="text-xs font-semibold text-slate-700">
              {isListening ? 'Listening... Speak medicine name & strength' : 'Click microphone to speak'}
            </p>
            <p className="text-[11px] text-slate-400 italic max-w-xs mx-auto">
              e.g. &ldquo;Find price for paracetamol 650&rdquo; or &ldquo;Dolo 650 tablet&rdquo;
            </p>
          </div>

          {/* Error Notice */}
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Editable Transcription Field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                <Edit3 className="w-3.5 h-3.5 text-brand-700" />
                Spoken Transcript (Editable):
              </label>
              {transcript && (
                <button
                  type="button"
                  onClick={() => setTranscript('')}
                  className="text-[11px] text-slate-400 hover:text-slate-600 flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Clear
                </button>
              )}
            </div>
            <textarea
              rows={2}
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Your speech transcript will appear here. You can edit any word before confirmation."
              className="w-full p-3 text-sm border border-surface-300 rounded-xl focus:border-brand-600 focus:ring-1 focus:ring-brand-600 text-slate-900 bg-white resize-none"
            />
          </div>

          {/* Extracted Details Confirmation Badge */}
          {parsedPreview && parsedPreview.clean_name && (
            <div className="p-3 bg-brand-50 border border-brand-200 rounded-lg text-xs text-brand-950 space-y-1">
              <div className="font-semibold flex items-center gap-1.5 text-brand-900">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-700" />
                Detected Query Elements:
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                <div>
                  <span className="text-slate-500">Medicine Salt/Brand:</span>{' '}
                  <strong className="text-slate-900 capitalize">{parsedPreview.clean_name}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Strength:</span>{' '}
                  <strong className="text-slate-900">{parsedPreview.extracted_strength || 'Not specified'}</strong>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-surface-50 border-t border-surface-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-surface-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-white transition-colors"
          >
            Cancel / Use Text Search
          </button>

          <button
            type="button"
            onClick={handleConfirmAndSearch}
            disabled={!transcript.trim()}
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
