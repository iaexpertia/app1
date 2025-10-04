import React, { useState } from 'react';
import { MountainPass, ConquestData, Cyclist } from '../types';
import { Translation } from '../i18n/translations';
import { StravaConnect } from './StravaConnect';
import { Activity } from 'lucide-react';
import {
  Award,
  Calendar,
  Camera,
  FileText,
  Mountain,
  TrendingUp,
  MapPin,
  ChevronRight,
  ChevronLeft,
  Eye,
  Edit,
  Save,
  X,
  Plus
} from 'lucide-react';

interface ConqueredPassesViewProps {
  conqueredPasses: MountainPass[];
  conquests: ConquestData[];
  onUpdateConquest: (conquest: ConquestData) => void;
  onAddPhotos?: (passId: string) => void;
  t: Translation;
  currentCyclist?: Cyclist;
  allPasses: MountainPass[];
  onSyncComplete: () => void;
}

export const ConqueredPassesView: React.FC<ConqueredPassesViewProps> = ({
  conqueredPasses,
  conquests,
  onUpdateConquest,
  onAddPhotos,
  t,
  currentCyclist,
  allPasses,
  onSyncComplete
}) => {
  const [selectedPass, setSelectedPass] = useState<MountainPass | null>(null);
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [notesText, setNotesText] = useState('');
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showFullscreenPhoto, setShowFullscreenPhoto] = useState(false);

  const getConquestData = (passId: string): ConquestData | undefined => {
    return conquests.find(c => c.passId === passId);
  };

  const handleEditNotes = (passId: string) => {
    const conquest = getConquestData(passId);
    setEditingNotes(passId);
    setNotesText(conquest?.personalNotes || '');
  };

  const handleSaveNotes = (passId: string) => {
    const conquest = getConquestData(passId);
    if (conquest) {
      const updatedConquest = { ...conquest, personalNotes: notesText };
      onUpdateConquest(updatedConquest);
    }
    setEditingNotes(null);
    setNotesText('');
  };

  const handleCancelEdit = () => {
    setEditingNotes(null);
    setNotesText('');
  };

  const nextPhoto = (photos: string[]) => {
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = (photos: string[]) => {
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      'Cuarta': 'bg-green-100 text-green-800',
      'Tercera': 'bg-blue-100 text-blue-800',
      'Segunda': 'bg-yellow-100 text-yellow-800',
      'Primera': 'bg-orange-100 text-orange-800',
      'Especial': 'bg-red-100 text-red-800',
    };
    return colors[difficulty as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (conqueredPasses.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <Award className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <p className="text-xl text-slate-600 mb-2">No has conquistado ningún puerto todavía</p>
            <p className="text-slate-500">¡Empieza a conquistar puertos para verlos aquí!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Award className="h-8 w-8 text-orange-500 mr-3" />
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Puertos Conquistados</h2>
              <p className="text-slate-600">
                Has conquistado {conqueredPasses.length} puerto{conqueredPasses.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {currentCyclist && (
            <div className="mt-6">
              <StravaConnect
                cyclist={currentCyclist}
                passes={allPasses}
                onSyncComplete={onSyncComplete}
              />
            </div>
          )}
        </div>

        <div className="space-y-6">
        {conqueredPasses.map(pass => {
          const conquest = getConquestData(pass.id);
          const photos = conquest?.photos || [];
          const hasPhotos = photos.length > 0;
          const hasNotes = conquest?.personalNotes && conquest.personalNotes.trim().length > 0;

          return (
            <div key={pass.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="md:flex">
                {/* Image */}
                <div className="md:w-1/3">
                  <div className="relative h-48 md:h-full">
                    <img 
                      src={pass.imageUrl} 
                      alt={pass.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(pass.difficulty)}`}>
                        {pass.difficulty}
                      </span>
                    </div>
                    <div className="absolute top-3 left-3 flex gap-2">
                      <Award className="h-6 w-6 text-yellow-500 bg-white rounded-full p-1" />
                      {conquest?.syncedFromStrava && (
                        <div className="bg-orange-500 text-white rounded-full p-1" title="Sincronizado desde Strava">
                          <Activity className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="md:w-2/3 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-800 mb-1">{pass.name}</h3>
                      <div className="flex items-center text-slate-600 text-sm mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{pass.region}, {pass.country}</span>
                      </div>
                      {conquest?.dateCompleted && (
                        <div className="flex items-center text-slate-600 text-sm">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>Conquistado el {formatDate(conquest.dateCompleted)}</span>
                        </div>
                      )}
                      {conquest?.stravaActivityUrl && (
                        <a
                          href={conquest.stravaActivityUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-orange-500 text-sm mt-1 hover:text-orange-600"
                        >
                          <Activity className="h-4 w-4 mr-1" />
                          <span>Ver en Strava</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
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
                      <TrendingUp className="h-4 w-4 text-orange-500" />
                      <div>
                        <p className="text-xs text-slate-500">Distancia</p>
                        <p className="text-sm font-semibold">{pass.distance}km</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-orange-500" />
                      <div>
                        <p className="text-xs text-slate-500">Pendiente</p>
                        <p className="text-sm font-semibold">{pass.averageGradient}%</p>
                      </div>
                    </div>
                  </div>

                  {/* Photos Section */}
                  {hasPhotos && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-slate-800 flex items-center mb-2">
                        <Camera className="h-4 w-4 mr-1" />
                        Mis Fotos ({photos.length})
                      </h4>
                      
                      <div className="relative">
                        <div className="flex space-x-2 overflow-x-auto pb-2">
                          {photos.map((photo, index) => (
                            <div key={index} className="flex-shrink-0">
                              <img 
                                src={photo} 
                                alt={`Foto ${index + 1}`}
                                className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() => {
                                  setCurrentPhotoIndex(index);
                                  setShowFullscreenPhoto(true);
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Notes Section */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-slate-800 flex items-center">
                        <FileText className="h-4 w-4 mr-1" />
                        Notas y Fotos
                      </h4>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditNotes(pass.id)}
                          className="flex items-center space-x-1 px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-xs"
                        >
                          <FileText className="h-3 w-3" />
                          <span>Mis Notas</span>
                        </button>
                        <button
                          onClick={() => {
                            const photosPass = pass;
                            if (onAddPhotos) {
                              onAddPhotos(photosPass.id);
                            }
                          }}
                          className="flex items-center space-x-1 px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-xs"
                        >
                          <Camera className="h-3 w-3" />
                          <span>Fotos</span>
                        </button>
                      </div>
                    </div>
                    
                    {editingNotes === pass.id ? (
                      <div className="space-y-2">
                        <textarea
                          value={notesText}
                          onChange={(e) => setNotesText(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                          rows={3}
                          placeholder="Añade tus notas sobre esta ruta..."
                        />
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleSaveNotes(pass.id)}
                            className="flex items-center space-x-1 px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                          >
                            <Save className="h-3 w-3" />
                            <span>Guardar</span>
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="flex items-center space-x-1 px-3 py-1 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm"
                          >
                            <X className="h-3 w-3" />
                            <span>Cancelar</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-slate-50 rounded-lg p-3">
                        {hasNotes ? (
                          <p className="text-slate-700 text-sm leading-relaxed">{conquest?.personalNotes}</p>
                        ) : (
                          <p className="text-slate-500 text-sm italic">No hay notas añadidas</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                    <div className="flex items-center space-x-4 text-sm text-slate-600">
                      {hasPhotos && (
                        <span className="flex items-center">
                          <Camera className="h-4 w-4 mr-1" />
                          {photos.length} foto{photos.length !== 1 ? 's' : ''}
                        </span>
                      )}
                      {hasNotes && (
                        <span className="flex items-center">
                          <FileText className="h-4 w-4 mr-1" />
                          Con notas
                        </span>
                      )}
                    </div>
                    
                    <button
                      onClick={() => setSelectedPass(pass)}
                      className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                      <span>Ver Detalles</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Fullscreen Photo Modal */}
      {showFullscreenPhoto && conqueredPasses.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="relative max-w-full max-h-full">
            {(() => {
              const currentPass = conqueredPasses.find(p => getConquestData(p.id)?.photos?.length);
              const photos = getConquestData(currentPass?.id || '')?.photos || [];
              
              if (photos.length === 0) return null;
              
              return (
                <>
                  <img 
                    src={photos[currentPhotoIndex]} 
                    alt={`Foto ${currentPhotoIndex + 1}`}
                    className="max-w-full max-h-full object-contain"
                  />
                  
                  <button
                    onClick={() => setShowFullscreenPhoto(false)}
                    className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
                  >
                    <X className="h-6 w-6" />
                  </button>
                  
                  {photos.length > 1 && (
                    <>
                      <button
                        onClick={() => prevPhoto(photos)}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-opacity"
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </button>
                      <button
                        onClick={() => nextPhoto(photos)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-opacity"
                      >
                        <ChevronRight className="h-6 w-6" />
                      </button>
                    </>
                  )}
                  
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black bg-opacity-50 px-3 py-1 rounded-full">
                    {currentPhotoIndex + 1} / {photos.length}
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
      </div>
    </div>
  );
};