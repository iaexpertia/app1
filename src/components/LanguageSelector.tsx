import React, { useState, useEffect } from 'react';
import { ChevronDown, Globe, Loader2, Languages } from 'lucide-react';

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
  const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0];

  useEffect(() => {
    let checkCount = 0;
    const maxChecks = 30;

    const checkGoogleTranslate = () => {
      checkCount++;
      const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;

      if (selectElement) {
        setGoogleTranslateReady(true);
        console.log('✅ Google Translate widget is ready after', checkCount, 'checks');
        return true;
      }

      if (checkCount >= maxChecks) {
        console.error('❌ Google Translate widget did not load after', maxChecks, 'attempts');
        return false;
      }

      return false;
    };

    if (checkGoogleTranslate()) {
      return;
    }

    const interval = setInterval(() => {
      if (checkGoogleTranslate()) {
        clearInterval(interval);
      }
    }, 500);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleLanguageChange = (langCode: string) => {
    setIsTranslating(true);
    onLanguageChange(langCode);
    setIsOpen(false);

    setTimeout(() => {
      setIsTranslating(false);
    }, 1500);
  };

  const waitForGoogleTranslate = (): Promise<HTMLSelectElement | null> => {
    return new Promise((resolve) => {
      const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;

      if (selectElement) {
        console.log('✅ Google Translate select element found immediately');
        resolve(selectElement);
        return;
      }

      console.log('⏳ Waiting for Google Translate select element...');
      let attempts = 0;
      const maxAttempts = 30;

      const checkInterval = setInterval(() => {
        attempts++;
        const element = document.querySelector('.goog-te-combo') as HTMLSelectElement;

        if (element) {
          clearInterval(checkInterval);
          console.log('✅ Google Translate select element found after', attempts, 'attempts');
          resolve(element);
        } else if (attempts >= maxAttempts) {
          clearInterval(checkInterval);
          console.error('❌ Google Translate widget not found after', maxAttempts, 'attempts');
          console.log('Debug info:');
          console.log('- google_translate_element exists:', !!document.getElementById('google_translate_element'));
          console.log('- google object exists:', typeof window.google !== 'undefined');
          console.log('- .goog-te-combo exists:', !!document.querySelector('.goog-te-combo'));
          console.log('- All elements with class containing "goog":', document.querySelectorAll('[class*="goog"]').length);
          resolve(null);
        }
      }, 200);
    });
  };

  const toggleGoogleTranslate = async () => {
    const element = document.getElementById('google_translate_element');
    const isCurrentlyVisible = element?.style.display === 'block';

    if (isCurrentlyVisible) {
      if (element) {
        element.style.display = 'none';
      }
      setShowGoogleTranslate(false);
      return;
    }

    console.log('🔵 Toggling Google Translate ON');

    if (element) {
      element.style.display = 'block';
    }
    setShowGoogleTranslate(true);

    if (!googleTranslateReady) {
      console.log('⚠️ Google Translate widget is not ready yet, waiting...');
    }

    const selectElement = await waitForGoogleTranslate();

    if (selectElement) {
      console.log('🎯 Attempting to open select dropdown...');

      setTimeout(() => {
        try {
          selectElement.focus();
          console.log('✅ Focus set on select element');

          const mousedownEvent = new MouseEvent('mousedown', {
            bubbles: true,
            cancelable: true,
            view: window,
            button: 0
          });
          selectElement.dispatchEvent(mousedownEvent);

          const clickEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window,
            button: 0
          });
          selectElement.dispatchEvent(clickEvent);

          console.log('✅ Click events dispatched on select element');
        } catch (error) {
          console.error('❌ Error triggering select dropdown:', error);
        }
      }, 150);
    } else {
      console.error('❌ No se pudo encontrar el selector de Google Translate');

      if (element) {
        element.style.display = 'none';
      }
      setShowGoogleTranslate(false);

      alert('El traductor de Google no se ha cargado correctamente.\n\nPrueba:\n1. Recarga la página\n2. Verifica tu conexión a internet\n3. Si el problema persiste, puede que haya un bloqueador de scripts activo');
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const element = document.getElementById('google_translate_element');
      const target = event.target as Node;

      if (showGoogleTranslate && element && !element.contains(target)) {
        const isGoogleTranslateButton = (event.target as Element).closest('[title="Google Translate"]');
        if (!isGoogleTranslateButton) {
          setShowGoogleTranslate(false);
          element.style.display = 'none';
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      const element = document.getElementById('google_translate_element');
      if (element) {
        element.style.display = 'none';
      }
    };
  }, [showGoogleTranslate]);

  return (
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
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors duration-200 ${
            showGoogleTranslate
              ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md'
              : 'border-slate-300 bg-white hover:bg-slate-50 text-slate-600'
          }`}
          title="Google Translate - Traductor del navegador"
        >
          <Languages className="h-4 w-4" />
          <span className="hidden sm:inline text-sm font-medium">Google</span>
        </button>

        {showGoogleTranslate && !googleTranslateReady && (
          <div className="absolute top-full mt-2 right-0 bg-white border border-slate-200 rounded-lg shadow-lg p-3 z-50 whitespace-nowrap">
            <div className="flex items-center space-x-2 text-sm text-slate-600">
              <Loader2 className="h-4 w-4 animate-spin text-orange-500" />
              <span>Cargando traductor...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};