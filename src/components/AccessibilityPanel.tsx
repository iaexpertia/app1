import React, { useState, useEffect } from 'react';
import {
  X,
  Type,
  Eye,
  Moon,
  Palette,
  Volume2,
  ImageOff,
  RotateCcw,
  ChevronDown,
  Zap,
  Sun,
  Monitor
} from 'lucide-react';
import {
  AccessibilitySettings,
  getAccessibilitySettings,
  saveAccessibilitySettings,
  deleteAccessibilitySettings,
  defaultSettings
} from '../utils/accessibilityService';

interface AccessibilityPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccessibilityPanel: React.FC<AccessibilityPanelProps> = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);
  const [fontSizeOpen, setFontSizeOpen] = useState(false);
  const [contrastOpen, setContrastOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setIsLoading(true);
    const loadedSettings = await getAccessibilitySettings();
    setSettings(loadedSettings);
    applySettings(loadedSettings);
    setIsLoading(false);
  };

  const applySettings = (newSettings: AccessibilitySettings) => {
    const root = document.documentElement;

    root.classList.remove('font-size-large', 'font-size-extra-large');
    if (newSettings.fontSize === 'large') {
      root.classList.add('font-size-large');
    } else if (newSettings.fontSize === 'extra-large') {
      root.classList.add('font-size-extra-large');
    }

    root.classList.remove('contrast-high', 'contrast-low');
    if (newSettings.contrast === 'high') {
      root.classList.add('contrast-high');
    } else if (newSettings.contrast === 'low') {
      root.classList.add('contrast-low');
    }

    if (newSettings.nightMode) {
      root.classList.add('night-mode');
    } else {
      root.classList.remove('night-mode');
    }

    if (newSettings.blueFilter) {
      root.classList.add('blue-filter');
    } else {
      root.classList.remove('blue-filter');
    }

    if (newSettings.hideImages) {
      root.classList.add('hide-images');
    } else {
      root.classList.remove('hide-images');
    }

    if (newSettings.reduceMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }
  };

  const updateSettings = async (updates: Partial<AccessibilitySettings>) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);
    applySettings(newSettings);
    await saveAccessibilitySettings(newSettings);
  };

  const resetSettings = async () => {
    setSettings(defaultSettings);
    applySettings(defaultSettings);
    await deleteAccessibilitySettings();
  };

  const handleTextToSpeech = () => {
    if (!settings.textToSpeech) {
      if ('speechSynthesis' in window) {
        updateSettings({ textToSpeech: true });
        const utterance = new SpeechSynthesisUtterance('Lectura en voz alta activada');
        utterance.lang = 'es-ES';
        window.speechSynthesis.speak(utterance);
      } else {
        alert('Tu navegador no soporta la síntesis de voz');
      }
    } else {
      window.speechSynthesis.cancel();
      updateSettings({ textToSpeech: false });
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
      />
      <div className="fixed right-2 sm:right-4 top-16 sm:top-20 bg-slate-900 text-white rounded-xl sm:rounded-2xl shadow-2xl z-50 w-[calc(100vw-1rem)] sm:w-80 max-h-[85vh] sm:max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 bg-slate-900 p-4 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-6 h-6 text-orange-400" />
            <h2 className="text-lg font-semibold">Accesibilidad</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isLoading ? (
          <div className="p-8 flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-400"></div>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            <div className="space-y-2">
              <button
                onClick={() => setFontSizeOpen(!fontSizeOpen)}
                className="w-full flex items-center justify-between p-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Type className="w-5 h-5" />
                  <span>Tamaño de fuente</span>
                </div>
                <ChevronDown className={`w-5 h-5 transition-transform ${fontSizeOpen ? 'rotate-180' : ''}`} />
              </button>

              {fontSizeOpen && (
                <div className="pl-4 space-y-2">
                  <button
                    onClick={() => updateSettings({ fontSize: 'normal' })}
                    className={`w-full text-left p-2 rounded-lg transition-colors ${
                      settings.fontSize === 'normal' ? 'bg-orange-500 text-white' : 'bg-slate-800 hover:bg-slate-700'
                    }`}
                  >
                    Normal
                  </button>
                  <button
                    onClick={() => updateSettings({ fontSize: 'large' })}
                    className={`w-full text-left p-2 rounded-lg transition-colors ${
                      settings.fontSize === 'large' ? 'bg-orange-500 text-white' : 'bg-slate-800 hover:bg-slate-700'
                    }`}
                  >
                    Grande
                  </button>
                  <button
                    onClick={() => updateSettings({ fontSize: 'extra-large' })}
                    className={`w-full text-left p-2 rounded-lg transition-colors ${
                      settings.fontSize === 'extra-large' ? 'bg-orange-500 text-white' : 'bg-slate-800 hover:bg-slate-700'
                    }`}
                  >
                    Extra grande
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <button
                onClick={() => setContrastOpen(!contrastOpen)}
                className="w-full flex items-center justify-between p-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Palette className="w-5 h-5" />
                  <span>Modo de contraste</span>
                </div>
                <ChevronDown className={`w-5 h-5 transition-transform ${contrastOpen ? 'rotate-180' : ''}`} />
              </button>

              {contrastOpen && (
                <div className="pl-4 space-y-2">
                  <button
                    onClick={() => updateSettings({ contrast: 'normal' })}
                    className={`w-full text-left p-2 rounded-lg transition-colors flex items-center gap-2 ${
                      settings.contrast === 'normal' ? 'bg-orange-500 text-white' : 'bg-slate-800 hover:bg-slate-700'
                    }`}
                  >
                    <Monitor className="w-4 h-4" />
                    Normal
                  </button>
                  <button
                    onClick={() => updateSettings({ contrast: 'high' })}
                    className={`w-full text-left p-2 rounded-lg transition-colors flex items-center gap-2 ${
                      settings.contrast === 'high' ? 'bg-orange-500 text-white' : 'bg-slate-800 hover:bg-slate-700'
                    }`}
                  >
                    <Sun className="w-4 h-4" />
                    Alto contraste
                  </button>
                  <button
                    onClick={() => updateSettings({ contrast: 'low' })}
                    className={`w-full text-left p-2 rounded-lg transition-colors flex items-center gap-2 ${
                      settings.contrast === 'low' ? 'bg-orange-500 text-white' : 'bg-slate-800 hover:bg-slate-700'
                    }`}
                  >
                    <Moon className="w-4 h-4" />
                    Bajo contraste
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => updateSettings({ nightMode: !settings.nightMode })}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                settings.nightMode ? 'bg-orange-500 text-white' : 'bg-slate-800 hover:bg-slate-700'
              }`}
            >
              <Moon className="w-5 h-5" />
              <span>Modo nocturno</span>
            </button>

            <button
              onClick={() => updateSettings({ blueFilter: !settings.blueFilter })}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                settings.blueFilter ? 'bg-orange-500 text-white' : 'bg-slate-800 hover:bg-slate-700'
              }`}
            >
              <Eye className="w-5 h-5" />
              <span>Activar filtro azul</span>
            </button>

            <button
              onClick={() => updateSettings({ reduceMotion: !settings.reduceMotion })}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                settings.reduceMotion ? 'bg-orange-500 text-white' : 'bg-slate-800 hover:bg-slate-700'
              }`}
            >
              <Zap className="w-5 h-5" />
              <span>Reducir animaciones</span>
            </button>

            <button
              onClick={handleTextToSpeech}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                settings.textToSpeech ? 'bg-orange-500 text-white' : 'bg-slate-800 hover:bg-slate-700'
              }`}
            >
              <Volume2 className="w-5 h-5" />
              <span>Lectura en voz alta</span>
            </button>

            <button
              onClick={() => updateSettings({ hideImages: !settings.hideImages })}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                settings.hideImages ? 'bg-orange-500 text-white' : 'bg-slate-800 hover:bg-slate-700'
              }`}
            >
              <ImageOff className="w-5 h-5" />
              <span>Ocultar imágenes</span>
            </button>

            <button
              onClick={resetSettings}
              className="w-full flex items-center gap-3 p-3 bg-slate-800 hover:bg-red-600 rounded-lg transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Resetear todo</span>
            </button>

            <button
              onClick={onClose}
              className="w-full p-3 text-sm text-slate-400 hover:text-white transition-colors"
            >
              → Ocultar panel de accesibilidad
            </button>
          </div>
        )}
      </div>
    </>
  );
};
