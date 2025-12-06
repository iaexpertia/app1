import React, { useState, useEffect } from 'react';
import { Translation } from '../i18n/translations';
import { CyclingRace, RaceFinish } from '../types';
import {
  Clock,
  Trophy,
  Award,
  Calendar,
  Save,
  X,
  TrendingDown,
  AlertCircle
} from 'lucide-react';
import {
  addRaceFinish,
  getRaceFinishesByRace,
  formatSecondsToTime
} from '../utils/raceFinishService';
import { getCurrentUser } from '../utils/cyclistStorage';

interface RaceFinishModalProps {
  race: CyclingRace;
  onClose: () => void;
  onSuccess: () => void;
  t: Translation;
}

export const RaceFinishModal: React.FC<RaceFinishModalProps> = ({
  race,
  onClose,
  onSuccess,
  t
}) => {
  const [finishTime, setFinishTime] = useState('');
  const [notes, setNotes] = useState('');
  const [dateCompleted, setDateCompleted] = useState(race.date);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [previousFinishes, setPreviousFinishes] = useState<RaceFinish[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      const user = await getCurrentUser();
      setCurrentUser(user);

      if (user?.id) {
        const finishes = await getRaceFinishesByRace(user.id, race.id);
        setPreviousFinishes(finishes);
      }
    };

    loadData();
  }, [race.id]);

  const validateTimeFormat = (time: string): boolean => {
    const patterns = [
      /^\d{1,2}:\d{2}:\d{2}$/,
      /^\d{1,2}:\d{2}$/
    ];
    return patterns.some(pattern => pattern.test(time));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!currentUser?.id) {
      setError('Debes iniciar sesión para registrar un finish');
      return;
    }

    if (!validateTimeFormat(finishTime)) {
      setError('Formato de tiempo inválido. Usa HH:MM:SS o MM:SS');
      return;
    }

    setIsSubmitting(true);

    const year = new Date(dateCompleted).getFullYear();

    const result = await addRaceFinish(
      currentUser.id,
      race.id,
      race.name,
      year,
      finishTime,
      dateCompleted,
      notes
    );

    setIsSubmitting(false);

    if (result.success) {
      onSuccess();
      onClose();
    } else {
      setError(result.error || 'Error al guardar el finish');
    }
  };

  const bestTime = previousFinishes.length > 0
    ? Math.min(...previousFinishes.map(f => f.finish_time_seconds))
    : null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Trophy className="w-6 h-6 text-orange-600" />
                Registrar Finish
              </h2>
              <p className="text-gray-600 mt-1">{race.name}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {previousFinishes.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <Award className="w-5 h-5" />
                Tu Historial en esta Carrera
              </h3>
              <div className="space-y-2">
                {previousFinishes.map((finish) => (
                  <div
                    key={finish.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-blue-900">{finish.year}</span>
                      <span className="text-blue-700">{finish.finish_time}</span>
                      {finish.is_pr && (
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs font-semibold flex items-center gap-1">
                          <Trophy className="w-3 h-3" />
                          PR
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {bestTime && (
                <div className="mt-3 pt-3 border-t border-blue-200">
                  <div className="flex items-center gap-2 text-blue-900 font-semibold">
                    <Trophy className="w-4 h-4" />
                    <span>Mejor Tiempo: {formatSecondsToTime(bestTime)}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tiempo Final *
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={finishTime}
                  onChange={(e) => setFinishTime(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="HH:MM:SS o MM:SS"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Ejemplos: 3:45:30 o 45:30
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="date"
                  value={dateCompleted}
                  onChange={(e) => setDateCompleted(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notas (Opcional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              rows={3}
              placeholder="Comparte detalles de tu experiencia..."
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              {isSubmitting ? 'Guardando...' : 'Guardar Finish'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
