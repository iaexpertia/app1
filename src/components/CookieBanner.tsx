import React, { useState, useEffect } from 'react';
import { X, Settings, Shield, Cookie } from 'lucide-react';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  social: boolean;
}

interface CookieBannerProps {
  onOpenPrivacy: () => void;
  onOpenLegal: () => void;
}

export function CookieBanner({ onOpenPrivacy, onOpenLegal }: CookieBannerProps) {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
    social: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem('cookieConsent', JSON.stringify(prefs));
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setShowBanner(false);
    setShowSettings(false);
  };

  const acceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      social: true,
    };
    savePreferences(allAccepted);
  };

  const acceptNecessary = () => {
    const necessaryOnly: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      social: false,
    };
    savePreferences(necessaryOnly);
  };

  const saveCustomPreferences = () => {
    savePreferences(preferences);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-none">
      <div className="pointer-events-auto w-full max-w-7xl mx-4 mb-4">
        <div className="bg-white rounded-lg shadow-2xl border border-slate-200 overflow-hidden">
          {!showSettings ? (
            <div className="p-6 md:p-8">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Cookie className="w-8 h-8 text-orange-500" />
                  <h3 className="text-xl font-bold text-slate-900">
                    Configuración de Cookies
                  </h3>
                </div>
                <button
                  onClick={acceptNecessary}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label="Cerrar"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <p className="text-slate-600 mb-6 leading-relaxed">
                Utilizamos cookies para mejorar tu experiencia de navegación, analizar el tráfico del sitio
                y personalizar el contenido. Al hacer clic en "Aceptar todas", consientes el uso de todas las cookies.
                También puedes personalizar tus preferencias o aceptar solo las cookies necesarias.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                <div className="flex items-start space-x-3 p-4 bg-slate-50 rounded-lg">
                  <Shield className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm">Cookies Necesarias</h4>
                    <p className="text-xs text-slate-600 mt-1">
                      Esenciales para el funcionamiento del sitio
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 bg-slate-50 rounded-lg">
                  <Settings className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm">Cookies Analíticas</h4>
                    <p className="text-xs text-slate-600 mt-1">
                      Google Analytics para mejorar el rendimiento
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 bg-slate-50 rounded-lg">
                  <Cookie className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm">Cookies de Marketing</h4>
                    <p className="text-xs text-slate-600 mt-1">
                      Publicidad personalizada y seguimiento
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 bg-slate-50 rounded-lg">
                  <Share2 className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm">Cookies Redes Sociales</h4>
                    <p className="text-xs text-slate-600 mt-1">
                      Instagram, WhatsApp, Telegram, Facebook
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <button
                  onClick={acceptAll}
                  className="flex-1 bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                >
                  Aceptar todas
                </button>
                <button
                  onClick={acceptNecessary}
                  className="flex-1 bg-slate-200 text-slate-700 px-6 py-3 rounded-lg font-semibold hover:bg-slate-300 transition-colors"
                >
                  Solo necesarias
                </button>
                <button
                  onClick={() => setShowSettings(true)}
                  className="flex-1 border-2 border-slate-300 text-slate-700 px-6 py-3 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
                >
                  Personalizar
                </button>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                <button
                  onClick={onOpenPrivacy}
                  className="hover:text-orange-500 underline transition-colors"
                >
                  Política de Privacidad
                </button>
                <button
                  onClick={onOpenLegal}
                  className="hover:text-orange-500 underline transition-colors"
                >
                  Aviso Legal
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 md:p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Settings className="w-8 h-8 text-orange-500" />
                  <h3 className="text-xl font-bold text-slate-900">
                    Preferencias de Cookies
                  </h3>
                </div>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label="Volver"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900 mb-1">Cookies Necesarias</h4>
                    <p className="text-sm text-slate-600">
                      Estas cookies son esenciales para el funcionamiento del sitio web y no se pueden desactivar.
                    </p>
                  </div>
                  <div className="ml-4">
                    <input
                      type="checkbox"
                      checked={true}
                      disabled
                      className="w-5 h-5 text-orange-500 rounded cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900 mb-1">Cookies Analíticas</h4>
                    <p className="text-sm text-slate-600">
                      Utilizamos Google Analytics para analizar el uso del sitio web y mejorar nuestros servicios.
                    </p>
                  </div>
                  <div className="ml-4">
                    <input
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                      className="w-5 h-5 text-orange-500 rounded cursor-pointer"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900 mb-1">Cookies de Marketing</h4>
                    <p className="text-sm text-slate-600">
                      Estas cookies permiten mostrar publicidad personalizada basada en tus intereses.
                    </p>
                  </div>
                  <div className="ml-4">
                    <input
                      type="checkbox"
                      checked={preferences.marketing}
                      onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                      className="w-5 h-5 text-orange-500 rounded cursor-pointer"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900 mb-1">Cookies de Redes Sociales</h4>
                    <p className="text-sm text-slate-600">
                      Permiten integrar funcionalidades de redes sociales como Instagram, WhatsApp, Telegram y Facebook.
                    </p>
                  </div>
                  <div className="ml-4">
                    <input
                      type="checkbox"
                      checked={preferences.social}
                      onChange={(e) => setPreferences({ ...preferences, social: e.target.checked })}
                      className="w-5 h-5 text-orange-500 rounded cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={saveCustomPreferences}
                  className="flex-1 bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                >
                  Guardar preferencias
                </button>
                <button
                  onClick={() => setShowSettings(false)}
                  className="flex-1 bg-slate-200 text-slate-700 px-6 py-3 rounded-lg font-semibold hover:bg-slate-300 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const Share2 = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3"></circle>
    <circle cx="6" cy="12" r="3"></circle>
    <circle cx="18" cy="19" r="3"></circle>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
  </svg>
);
