import React, { useState, useEffect } from 'react';
import { Translation } from '../i18n/translations';
import { RaceFinish } from '../types';
import { getRaceFinishesByCyclist, deleteRaceFinish, formatSecondsToTime } from '../utils/raceFinishService';
import { getCurrentUser } from '../utils/cyclistStorage';
import {
  Trophy,
  Calendar,
  Clock,
  TrendingDown,
  TrendingUp,
  Award,
  Trash2,
  FileText
} from 'lucide-react';

interface RaceHistoryViewProps {
  t: Translation;
}

export const RaceHistoryView: React.FC<RaceHistoryViewProps> = ({ t }) => {
  const [finishes, setFinishes] = useState<RaceFinish[]>([]);
  const [groupedFinishes, setGroupedFinishes] = useState<Map<string, RaceFinish[]>>(new Map());
  const [loading, setLoading] = useState(true);
  const [selectedFinish, setSelectedFinish] = useState<RaceFinish | null>(null);

  useEffect(() => {
    loadFinishes();
  }, []);

  const loadFinishes = async () => {
    setLoading(true);
    const user = await getCurrentUser();

    if (user?.id) {
      const allFinishes = await getRaceFinishesByCyclist(user.id);
      setFinishes(allFinishes);

      const grouped = new Map<string, RaceFinish[]>();
      allFinishes.forEach(finish => {
        if (!grouped.has(finish.race_id)) {
          grouped.set(finish.race_id, []);
        }
        grouped.get(finish.race_id)?.push(finish);
      });

      grouped.forEach((finishList) => {
        finishList.sort((a, b) => b.year - a.year);
      });

      setGroupedFinishes(grouped);
    }

    setLoading(false);
  };

  const handleDeleteFinish = async (finishId: string) => {
    if (confirm('¿Estás seguro de eliminar este finish?')) {
      const result = await deleteRaceFinish(finishId);
      if (result.success) {
        loadFinishes();
        setSelectedFinish(null);
      }
    }
  };

  const calculateImprovement = (finishes: RaceFinish[], index: number): number | null => {
    if (index === finishes.length - 1) return null;

    const currentTime = finishes[index].finish_time_seconds;
    const previousTime = finishes[index + 1].finish_time_seconds;

    return previousTime - currentTime;
  };

  const formatImprovement = (seconds: number): string => {
    const absSeconds = Math.abs(seconds);
    const minutes = Math.floor(absSeconds / 60);
    const secs = absSeconds % 60;

    if (minutes > 0) {
      return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
    return `${secs}s`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (finishes.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white py-12">
          <div className="max-w-7xl mx-auto px-4">
            <h1 className="text-4xl font-bold mb-4">Mi Historial de Carreras</h1>
            <p className="text-orange-100 text-lg">
              Lleva el registro de todas tus participaciones en carreras
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center bg-white rounded-xl p-12">
            <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Sin Finishes Registrados</h3>
            <p className="text-gray-500">
              Ve a la sección de Carreras y registra tus participaciones usando el botón "Finisher"
            </p>
          </div>
        </div>
      </div>
    );
  }

  const totalRaces = groupedFinishes.size;
  const totalFinishes = finishes.length;
  const prCount = finishes.filter(f => f.is_pr).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Mi Historial de Carreras</h1>
          <p className="text-orange-100 text-lg">
            Seguimiento completo de tus participaciones y récords personales
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Trophy className="w-8 h-8" />
                <div>
                  <p className="text-orange-100 text-sm">Carreras Diferentes</p>
                  <p className="text-3xl font-bold">{totalRaces}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-8 h-8" />
                <div>
                  <p className="text-orange-100 text-sm">Total Finishes</p>
                  <p className="text-3xl font-bold">{totalFinishes}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Award className="w-8 h-8" />
                <div>
                  <p className="text-orange-100 text-sm">Records Personales</p>
                  <p className="text-3xl font-bold">{prCount}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {Array.from(groupedFinishes.entries()).map(([raceId, raceFinishes]) => {
            const raceName = raceFinishes[0].race_name;
            const bestTime = Math.min(...raceFinishes.map(f => f.finish_time_seconds));
            const prFinish = raceFinishes.find(f => f.is_pr);

            return (
              <div key={raceId} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-slate-700 to-slate-800 text-white p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">{raceName}</h3>
                      <div className="flex items-center gap-4 text-slate-200">
                        <div className="flex items-center gap-2">
                          <Trophy className="w-4 h-4" />
                          <span>{raceFinishes.length} Finishes</span>
                        </div>
                        {prFinish && (
                          <div className="flex items-center gap-2 bg-yellow-500/20 px-3 py-1 rounded-full">
                            <Award className="w-4 h-4 text-yellow-300" />
                            <span className="text-yellow-100">PR: {prFinish.finish_time}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-3">
                    {raceFinishes.map((finish, index) => {
                      const improvement = calculateImprovement(raceFinishes, index);

                      return (
                        <div
                          key={finish.id}
                          className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                          onClick={() => setSelectedFinish(finish)}
                        >
                          <div className="flex items-center gap-4">
                            <div className="text-center min-w-[80px]">
                              <p className="text-2xl font-bold text-slate-800">{finish.year}</p>
                            </div>

                            <div className="flex items-center gap-3">
                              <Clock className="w-5 h-5 text-orange-600" />
                              <span className="text-xl font-semibold text-slate-800">
                                {finish.finish_time}
                              </span>

                              {finish.is_pr && (
                                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                                  <Trophy className="w-3 h-3" />
                                  PR
                                </span>
                              )}
                            </div>
                          </div>

                          {improvement !== null && (
                            <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                              improvement > 0
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {improvement > 0 ? (
                                <>
                                  <TrendingDown className="w-4 h-4" />
                                  <span className="font-semibold">-{formatImprovement(improvement)}</span>
                                </>
                              ) : (
                                <>
                                  <TrendingUp className="w-4 h-4" />
                                  <span className="font-semibold">+{formatImprovement(improvement)}</span>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedFinish && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedFinish(null)}
        >
          <div
            className="bg-white rounded-xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">{selectedFinish.race_name}</h3>
              <p className="text-gray-600">{selectedFinish.year}</p>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-500">Tiempo Final</p>
                  <p className="text-xl font-bold text-gray-900">{selectedFinish.finish_time}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-500">Fecha</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(selectedFinish.date_completed).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              {selectedFinish.notes && (
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-orange-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Notas</p>
                    <p className="text-gray-700">{selectedFinish.notes}</p>
                  </div>
                </div>
              )}

              {selectedFinish.is_pr && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3">
                  <Trophy className="w-6 h-6 text-yellow-600" />
                  <div>
                    <p className="font-semibold text-yellow-900">Record Personal</p>
                    <p className="text-sm text-yellow-700">¡Tu mejor tiempo en esta carrera!</p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setSelectedFinish(null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cerrar
              </button>
              <button
                onClick={() => handleDeleteFinish(selectedFinish.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
