"use client";

import React from 'react';
import { Globe, X, Check } from 'lucide-react';

interface TranslationToggleProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
  onClose: () => void;
}

export default function TranslationToggle({ 
  selectedLanguage, 
  onLanguageChange, 
  onClose 
}: TranslationToggleProps) {
  // Common languages with ISO codes
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish (Español)' },
    { code: 'fr', name: 'French (Français)' },
    { code: 'zh', name: 'Chinese (中文)' },
    { code: 'ar', name: 'Arabic (العربية)' },
    { code: 'hi', name: 'Hindi (हिन्दी)' },
    { code: 'ru', name: 'Russian (Русский)' },
    { code: 'pt', name: 'Portuguese (Português)' },
    { code: 'de', name: 'German (Deutsch)' },
    { code: 'ja', name: 'Japanese (日本語)' },
    { code: 'ko', name: 'Korean (한국어)' }
  ];
  
  return (
    <div className="bg-[#F0F9FA] border-t p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Globe size={18} className="text-[#006D77] mr-2" />
          <h3 className="font-medium text-gray-900">Translation Settings</h3>
        </div>
        <button 
          onClick={onClose}
          className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full"
        >
          <X size={16} />
        </button>
      </div>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">
          Real-time translation will automatically translate messages from your healthcare provider into your preferred language.
        </p>
        <div className="p-2 bg-blue-50 border border-blue-100 rounded-md text-sm text-blue-700 flex items-start">
          <Globe size={16} className="mr-2 mt-0.5 flex-shrink-0" />
          <p>
            For medical terminology, translations are medically reviewed to ensure accuracy. Some medical terms may remain in English.
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[200px] overflow-y-auto">
        {languages.map(language => (
          <button
            key={language.code}
            className={`flex items-center justify-between p-2 rounded-md text-sm ${
              selectedLanguage === language.code 
                ? 'bg-[#006D77] text-white' 
                : 'bg-white border hover:bg-gray-50'
            }`}
            onClick={() => onLanguageChange(language.code)}
          >
            <span>{language.name}</span>
            {selectedLanguage === language.code && (
              <Check size={14} />
            )}
          </button>
        ))}
      </div>
      
      <div className="mt-4 pt-3 border-t flex items-center justify-between">
        <span className="text-xs text-gray-500">
          Powered by medical translation AI
        </span>
        <button
          className="text-xs text-[#006D77] hover:underline"
          onClick={onClose}
        >
          Apply & Close
        </button>
      </div>
    </div>
  );
}
