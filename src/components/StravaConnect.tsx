import React, { useState } from 'react';
import { Cyclist, MountainPass } from '../types';
import { initiateStravaAuth, disconnectStrava } from '../utils/stravaAuth';
import { syncStravaActivities, getSyncStatus } from '../utils/stravaSync';
import { Activity, Link, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

interface StravaConnectProps {
  cyclist: Cyclist;
  passes: MountainPass[];
  onSyncComplete: () => void;
}

export const StravaConnect: React.FC<StravaConnectProps> = ({
  cyclist,
  passes,
  onSyncComplete,
}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const syncStatus = getSyncStatus(cyclist);

  const handleConnect = () => {
    initiateStravaAuth();
  };

  const handleDisconnect = () => {
    if (confirm('¿Estás seguro de que quieres desconectar tu cuenta de Strava?')) {
      disconnectStrava(cyclist);
      onSyncComplete();
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncMessage(null);

    try {
      const result = await syncStravaActivities(cyclist, passes);

      if (result.synced > 0) {
        setSyncMessage({
          type: 'success',
          text: `¡Sincronización completada! ${result.synced} nuevo${result.synced > 1 ? 's' : ''} puerto${result.synced > 1 ? 's' : ''} conquistado${result.synced > 1 ? 's' : ''} desde Strava.`,
        });
      } else {
        setSyncMessage({
          type: 'success',
          text: 'Sincronización completada. No se encontraron nuevos puertos.',
        });
      }

      onSyncComplete();
    } catch (error) {
      setSyncMessage({
        type: 'error',
        text: 'Error al sincronizar con Strava. Por favor, intenta de nuevo.',
      });
      console.error('Sync error:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
          <Activity className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Conexión con Strava</h3>
          <p className="text-sm text-gray-600">
            Sincroniza tus actividades automáticamente
          </p>
        </div>
      </div>

      {!syncStatus.connected ? (
        <div className="space-y-4">
          <p className="text-sm text-gray-700">
            Conecta tu cuenta de Strava para sincronizar automáticamente tus ascensos a
            puertos de montaña. El sistema detectará qué puertos has conquistado basándose
            en tus actividades.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-2">
              ¿Cómo funciona?
            </h4>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Conecta tu cuenta de Strava de forma segura</li>
              <li>Sincroniza tus actividades del último año</li>
              <li>El sistema identifica automáticamente los puertos conquistados</li>
              <li>Tus logros se añaden a tu perfil</li>
            </ul>
          </div>

          <button
            onClick={handleConnect}
            className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 font-medium"
          >
            <Link className="w-5 h-5" />
            Conectar con Strava
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-green-900">
                Cuenta conectada
              </p>
              <p className="text-xs text-green-700">
                Atleta ID: {syncStatus.athleteId}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSync}
              disabled={isSyncing}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-5 h-5 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Sincronizando...' : 'Sincronizar actividades'}
            </button>

            <button
              onClick={handleDisconnect}
              disabled={isSyncing}
              className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Desconectar
            </button>
          </div>

          {syncMessage && (
            <div
              className={`flex items-start gap-2 p-3 rounded-lg border ${
                syncMessage.type === 'success'
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
              }`}
            >
              {syncMessage.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              )}
              <p
                className={`text-sm ${
                  syncMessage.type === 'success' ? 'text-green-800' : 'text-red-800'
                }`}
              >
                {syncMessage.text}
              </p>
            </div>
          )}

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-xs text-gray-600">
              <strong>Nota:</strong> La sincronización busca actividades del último año y
              coincide puertos dentro de un radio de 5km. Las actividades ya sincronizadas
              no se duplicarán.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
