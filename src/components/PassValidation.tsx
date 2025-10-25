import React, { useState, useEffect } from 'react';
import { Check, X, Eye, Mountain, TrendingUp, Flag, MapPin } from 'lucide-react';
import { MountainPass } from '../types';
import { getPendingPassesFromDB, validatePassInDB, deletePassFromDB } from '../utils/passesService';
import { getCurrentUser } from '../utils/cyclistStorage';

export const PassValidation: React.FC = () => {
  const [pendingPasses, setPendingPasses] = useState<MountainPass[]>([]);
  const [selectedPass, setSelectedPass] = useState<MountainPass | null>(null);
  const [validationNotes, setValidationNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const difficultyColors: Record<string, string> = {
    'Cuarta': 'bg-green-100 text-green-800',
    'Tercera': 'bg-blue-100 text-blue-800',
    'Segunda': 'bg-yellow-100 text-yellow-800',
    'Primera': 'bg-orange-100 text-orange-800',
    'Especial': 'bg-red-100 text-red-800'
  };

  const categoryColors: Record<string, string> = {
    'Alpes': 'bg-blue-100 text-blue-800 border-blue-300',
    'Pirineos': 'bg-purple-100 text-purple-800 border-purple-300',
    'Dolomitas': 'bg-pink-100 text-pink-800 border-pink-300',
    'Andes': 'bg-emerald-100 text-emerald-800 border-emerald-300',
    'Otros': 'bg-gray-100 text-gray-800 border-gray-300',
    'Provenza': 'bg-yellow-100 text-yellow-800 border-yellow-300'
  };

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

    const result = await validatePassInDB(passId, user.email, validationNotes);

    if (result.success) {
      alert('Puerto validado correctamente');
      setValidationNotes('');
      setSelectedPass(null);
      await loadPendingPasses();
      window.dispatchEvent(new Event('passesUpdated'));
    } else {
      alert(result.message || 'Error al validar el puerto');
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
      await loadPendingPasses();
      window.dispatchEvent(new Event('passesUpdated'));
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingPasses.map((pass) => (
            <div key={pass.id} className="bg-white rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl overflow-hidden border-2 border-yellow-400">
              <div className="relative h-48">
                <img
                  src={pass.imageUrl}
                  alt={pass.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 flex space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${categoryColors[pass.category] || categoryColors.Otros}`}>
                    {pass.category}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[pass.difficulty]}`}>
                    {pass.difficulty}
                  </span>
                </div>
                <div className="absolute top-3 left-3">
                  <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    PENDIENTE
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 mb-1">{pass.name}</h3>
                    <div className="flex items-center text-slate-600 text-sm">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{pass.region}, {pass.country}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <Mountain className="h-4 w-4 text-orange-500" />
                    <div>
                      <p className="text-xs text-slate-500">Altitud</p>
                      <p className="text-sm font-semibold">{pass.maxAltitude}m</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-orange-500" />
                    <div>
                      <p className="text-xs text-slate-500">Desnivel</p>
                      <p className="text-sm font-semibold">+{pass.elevationGain}m</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Flag className="h-4 w-4 text-orange-500" />
                    <div>
                      <p className="text-xs text-slate-500">Distancia</p>
                      <p className="text-sm font-semibold">{pass.distance}km</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-orange-500" />
                    <div>
                      <p className="text-xs text-slate-500">Gradiente</p>
                      <p className="text-sm font-semibold">{pass.averageGradient}%</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedPass(pass)}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-all duration-200 font-medium flex items-center justify-center space-x-2"
                  >
                    <Eye className="h-4 w-4" />
                    <span>Ver</span>
                  </button>
                  <button
                    onClick={() => handleValidate(pass.id)}
                    disabled={loading}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition-all duration-200 font-medium flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    <Check className="h-4 w-4" />
                    <span>Validar</span>
                  </button>
                  <button
                    onClick={() => handleReject(pass.id)}
                    disabled={loading}
                    className="bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded-lg transition-all duration-200 font-medium flex items-center justify-center disabled:opacity-50"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
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
