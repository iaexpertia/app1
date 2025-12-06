import React, { useState, useEffect } from 'react';
import { ChevronDown, Globe, Loader2, Languages } from 'lucide-react';
import GoogleTranslate from './GoogleTranslate';

interface LanguageSelectorProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
}

const languages = [
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' }
];

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLanguage,
  onLanguageChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [showGoogleTranslate, setShowGoogleTranslate] = useState(false);
  const [googleTranslateReady, setGoogleTranslateReady] = useState(false);
  const [googleTranslateError, setGoogleTranslateError] = useState(false);
  const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0];

  const handleLanguageChange = (langCode: string) => {
    setIsTranslating(true);
    onLanguageChange(langCode);
    setIsOpen(false);

    setTimeout(() => {
      setIsTranslating(false);
    }, 1500);
  };

  const handleGoogleTranslateReady = () => {
    setGoogleTranslateReady(true);
    setGoogleTranslateError(false);
  };

  const handleGoogleTranslateError = () => {
    setGoogleTranslateError(true);
    setGoogleTranslateReady(false);
  };

  const toggleGoogleTranslate = () => {
    const element = document.getElementById('google_translate_element');

    if (!element) {
      return;
    }

    const isCurrentlyVisible = element.style.display === 'block';

    if (isCurrentlyVisible) {
      element.style.display = 'none';
      setShowGoogleTranslate(false);
      return;
    }

    element.style.display = 'block';
    setShowGoogleTranslate(true);

    setTimeout(() => {
      const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (selectElement) {
        selectElement.focus();
        selectElement.click();
      }
    }, 100);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const element = document.getElementById('google_translate_element');
      const target = event.target as Node;

      if (showGoogleTranslate && element && !element.contains(target)) {
        const isGoogleTranslateButton = (event.target as Element).closest('[data-google-translate-button]');
        if (!isGoogleTranslateButton) {
          element.style.display = 'none';
          setShowGoogleTranslate(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showGoogleTranslate]);

  return (
    <>
      <GoogleTranslate
        onReady={handleGoogleTranslateReady}
        onError={handleGoogleTranslateError}
      />

      <div className="flex items-center space-x-2">
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center space-x-2 px-3 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 transition-colors duration-200"
            disabled={isTranslating}
          >
            {isTranslating ? (
              <Loader2 className="h-4 w-4 text-orange-600 animate-spin" />
            ) : (
              <Globe className="h-4 w-4 text-slate-600" />
            )}
            <span className="text-lg">{currentLang.flag}</span>
            <ChevronDown className={`h-4 w-4 text-slate-600 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {isOpen && (
            <div className="absolute right-0 top-full mt-2 bg-white border border-slate-200 rounded-lg shadow-lg z-50 min-w-[160px]">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors duration-200 flex items-center space-x-3 ${
                    currentLanguage === lang.code ? 'bg-orange-50 text-orange-700' : 'text-slate-700'
                  } ${lang === languages[0] ? 'rounded-t-lg' : ''} ${lang === languages[languages.length - 1] ? 'rounded-b-lg' : ''}`}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span className="text-sm font-medium">{lang.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={toggleGoogleTranslate}
            data-google-translate-button
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors duration-200 ${
              showGoogleTranslate
                ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md'
                : 'border-slate-300 bg-white hover:bg-slate-50 text-slate-600'
            }`}
            title="Google Translate"
            disabled={googleTranslateError}
          >
            {!googleTranslateReady && !googleTranslateError ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Languages className="h-4 w-4" />
            )}
            <span className="hidden sm:inline text-sm font-medium">Google</span>
          </button>

          {googleTranslateError && (
            <div className="absolute top-full mt-2 right-0 bg-red-50 border border-red-200 rounded-lg shadow-lg p-3 z-50 whitespace-nowrap text-xs text-red-700">
              Error al cargar el traductor
            </div>
          )}
        </div>
      </div>
    </>
  );
};