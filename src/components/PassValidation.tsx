import React, { useState, useEffect } from 'react';
import { Check, X, Eye } from 'lucide-react';
import { MountainPass } from '../types';
import { getPendingPassesFromDB, validatePassInDB, deletePassFromDB } from '../utils/passesService';
import { getCurrentUser } from '../utils/cyclistStorage';

export const PassValidation: React.FC = () => {
  const [pendingPasses, setPendingPasses] = useState<MountainPass[]>([]);
  const [selectedPass, setSelectedPass] = useState<MountainPass | null>(null);
  const [validationNotes, setValidationNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPendingPasses();
  }, []);

  const loadPendingPasses = async () => {
    const passes = await getPendingPassesFromDB();
    setPendingPasses(passes);
  };

  const handleValidate = async (passId: string) => {
    setLoading(true);
    const user = await getCurrentUser();

    if (!user) {
      alert('Debes estar autenticado para validar puertos');
      setLoading(false);
      return;
    }

    const success = await validatePassInDB(passId, user.email, validationNotes);

    if (success) {
      alert('Puerto validado correctamente');
      setValidationNotes('');
      setSelectedPass(null);
      loadPendingPasses();
      window.dispatchEvent(new Event('passesUpdated'));
    } else {
      alert('Error al validar el puerto');
    }

    setLoading(false);
  };

  const handleReject = async (passId: string) => {
    if (!confirm('¿Estás seguro de que quieres rechazar este puerto? Se eliminará permanentemente.')) {
      return;
    }

    setLoading(true);
    const success = await deletePassFromDB(passId);

    if (success) {
      alert('Puerto rechazado y eliminado');
      setSelectedPass(null);
      loadPendingPasses();
    } else {
      alert('Error al rechazar el puerto');
    }

    setLoading(false);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Puertos Pendientes de Validación</h2>
        <p className="text-sm text-gray-600 mt-1">
          {pendingPasses.length} puerto(s) esperando aprobación
        </p>
      </div>

      {pendingPasses.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No hay puertos pendientes de validación</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">País / Región</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Altitud</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dificultad</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pendingPasses.map((pass) => (
                <tr key={pass.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {pass.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {pass.country} / {pass.region}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {pass.maxAltitude}m
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      {pass.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedPass(pass)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Ver detalles"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleValidate(pass.id)}
                        className="text-green-600 hover:text-green-900"
                        title="Validar"
                        disabled={loading}
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleReject(pass.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Rechazar"
                        disabled={loading}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedPass && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-900">{selectedPass.name}</h3>
                <button
                  onClick={() => setSelectedPass(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">País / Región</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedPass.country} / {selectedPass.region}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Altitud Máxima</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedPass.maxAltitude}m</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Desnivel</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedPass.elevationGain}m</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Gradiente Medio</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedPass.averageGradient}%</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Gradiente Máximo</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedPass.maxGradient}%</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Distancia</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedPass.distance} km</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Dificultad</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedPass.difficulty}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Descripción</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedPass.description || 'Sin descripción'}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notas de Validación (opcional)</label>
                  <textarea
                    value={validationNotes}
                    onChange={(e) => setValidationNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Agregar notas sobre la validación..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => handleValidate(selectedPass.id)}
                    disabled={loading}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Check className="w-4 h-4" />
                    Validar Puerto
                  </button>
                  <button
                    onClick={() => handleReject(selectedPass.id)}
                    disabled={loading}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <X className="w-4 h-4" />
                    Rechazar Puerto
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
