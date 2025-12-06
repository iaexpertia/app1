import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    google?: {
      translate?: {
        TranslateElement?: new (
          config: {
            pageLanguage: string;
            includedLanguages: string;
            layout: number;
            autoDisplay: boolean;
          },
          elementId: string
        ) => void;
        InlineLayout?: {
          SIMPLE: number;
        };
      };
    };
    googleTranslateElementInit?: () => void;
  }
}

interface GoogleTranslateProps {
  onReady?: () => void;
  onError?: () => void;
}

export default function GoogleTranslate({ onReady, onError }: GoogleTranslateProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef(false);
  const widgetInitializedRef = useRef(false);

  useEffect(() => {
    if (scriptLoadedRef.current) {
      return;
    }

    const initializeGoogleTranslate = () => {
      if (widgetInitializedRef.current) {
        return;
      }

      try {
        if (
          window?.google?.translate?.TranslateElement &&
          window?.google?.translate?.InlineLayout
        ) {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: 'es',
              includedLanguages: 'es,en,fr,it,de,pt,ca,eu,gl',
              layout: window.google.translate.InlineLayout.SIMPLE,
              autoDisplay: false
            },
            'google_translate_element'
          );

          widgetInitializedRef.current = true;

          setTimeout(() => {
            const selectElement = document.querySelector('.goog-te-combo');
            if (selectElement) {
              if (onReady) {
                onReady();
              }
            } else {
              if (onError) {
                onError();
              }
            }
          }, 1000);
        } else {
          if (onError) {
            onError();
          }
        }
      } catch (error) {
        console.error('Error initializing Google Translate:', error);
        if (onError) {
          onError();
        }
      }
    };

    if (typeof window !== 'undefined') {
      window.googleTranslateElementInit = initializeGoogleTranslate;
    }

    const existingScript = document.querySelector(
      'script[src*="translate.google.com"]'
    );

    if (existingScript) {
      scriptLoadedRef.current = true;
      setTimeout(initializeGoogleTranslate, 100);
      return;
    }

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    script.onerror = () => {
      console.error('Failed to load Google Translate script');
      if (onError) {
        onError();
      }
    };

    document.head.appendChild(script);
    scriptLoadedRef.current = true;

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [onReady, onError]);

  return (
    <div
      id="google_translate_element"
      ref={containerRef}
      className="google-translate-container"
      style={{ display: 'none' }}
    />
  );
}
