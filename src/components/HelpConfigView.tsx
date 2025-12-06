import React, { useState, useEffect } from 'react';
import { Save, HelpCircle, ExternalLink, AlertCircle } from 'lucide-react';
import { loadHelpConfig, saveHelpConfig, HelpConfig } from '../utils/helpConfigStorage';

export const HelpConfigView: React.FC = () => {
  const [helpConfig, setHelpConfig] = useState<HelpConfig | null>(null);
  const [helpUrl, setHelpUrl] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const config = await loadHelpConfig();
    if (config) {
      setHelpConfig(config);
      setHelpUrl(config.help_url);
      setIsActive(config.is_active);
    }
  };

  const handleSave = async () => {
    if (!helpUrl.trim()) {
      setMessage({ type: 'error', text: 'Por favor ingresa una URL válida' });
      return;
    }

    try {
      new URL(helpUrl);
    } catch {
      setMessage({ type: 'error', text: 'La URL no es válida. Debe comenzar con http:// o https://' });
      return;
    }

    setLoading(true);
    const success = await saveHelpConfig(helpUrl, isActive);

    if (success) {
      setMessage({ type: 'success', text: 'Configuración de ayuda guardada exitosamente' });
      await loadData();
      window.dispatchEvent(new Event('helpConfigUpdated'));
    } else {
      setMessage({ type: 'error', text: 'Error al guardar la configuración' });
    }

    setLoading(false);

    setTimeout(() => setMessage(null), 5000);
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <HelpCircle className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Configuración de Ayuda</h2>
        </div>
        <p className="text-sm text-gray-600">
          Configura el enlace de ayuda que se mostrará en el menú del sitio web
        </p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
          message.type === 'success'
            ? 'bg-green-50 border border-green-200 text-green-800'
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{message.text}</span>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            URL de Ayuda *
          </label>
          <input
            type="url"
            value={helpUrl}
            onChange={(e) => setHelpUrl(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://ejemplo.com/ayuda"
            required
          />
          <p className="text-xs text-gray-500 mt-2">
            Ingresa la URL completa de la página de ayuda o documentación
          </p>

          {helpUrl && isValidUrl(helpUrl) && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-blue-800">
                <ExternalLink className="w-4 h-4" />
                <span>Vista previa:</span>
                <a
                  href={helpUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-blue-600"
                >
                  {helpUrl}
                </a>
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">
              Mostrar icono de ayuda en el sitio web
            </span>
          </label>
          <p className="text-xs text-gray-500 mt-1 ml-6">
            Si está desactivado, el icono de ayuda no se mostrará en el menú
          </p>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={handleSave}
            disabled={loading || !helpUrl.trim()}
            className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Guardando...' : 'Guardar Configuración'}
          </button>
        </div>
      </div>

      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="font-semibold text-yellow-900 mb-2 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          Nota Importante
        </h3>
        <ul className="text-sm text-yellow-800 space-y-1 ml-7">
          <li>El enlace de ayuda aparecerá como un icono en la barra de navegación del sitio</li>
          <li>Los usuarios podrán hacer clic para acceder a la página de ayuda configurada</li>
          <li>Asegúrate de que la URL sea accesible públicamente</li>
          <li>Se recomienda usar HTTPS para mayor seguridad</li>
        </ul>
      </div>
    </div>
  );
};
