import React from 'react';
import { MountainPass } from '../types';
import { Translation } from '../i18n/translations';
import {
  X,
  Mountain,
  TrendingUp,
  MapPin,
  Award,
  Calendar,
  Trophy,
  ExternalLink,
  Navigation
} from 'lucide-react';

interface PassModalProps {
  pass: MountainPass | null;
  onClose: () => void;
  t: Translation;
}

const difficultyColors = {
  Cuarta: 'bg-green-100 text-green-800',
  Tercera: 'bg-blue-100 text-blue-800',
  Segunda: 'bg-yellow-100 text-yellow-800',
  Primera: 'bg-orange-100 text-orange-800',
  Especial: 'bg-red-100 text-red-800',
};

export const PassModal: React.FC<PassModalProps> = ({ pass, onClose, t }) => {
  if (!pass) return null;

  const getDifficultyText = (difficulty: string) => {
    const difficultyMap: Record<string, keyof Translation> = {
      'Cuarta': 'cuarta',
      'Tercera': 'tercera',
      'Segunda': 'segunda',
      'Primera': 'primera',
      'Especial': 'especial',
    };
    return t[difficultyMap[difficulty]] || difficulty;
  };

  const getCountryText = (country: string) => {
    const countryMap: Record<string, keyof Translation> = {
      'France': 'france',
      'Italy': 'italy',
      'Spain': 'spain',
      'England': 'england'
    };
    return t[countryMap[country]] || country;
  };

  const getRegionText = (region: string) => {
    const regionMap: Record<string, keyof Translation> = {
      'Provence': 'provence',
      'Lombardy': 'lombardy',
      'Asturias': 'asturias',
      'Lake District': 'lakeDistrict',
      'Friuli': 'friuli',
      'Sierra Nevada': 'sierraNevada',
      'Pirineos': 'pirineos'
    };
    return t[regionMap[region]] || region;
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-[9999]" onClick={onClose}>
      <div className="bg-white rounded-xl sm:rounded-2xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="relative h-48 sm:h-64">
          <img
            src={pass.imageUrl}
            alt={pass.name}
            className="w-full h-full object-cover rounded-t-xl sm:rounded-t-2xl"
          />
          <button
            onClick={onClose}
            className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-white rounded-full p-2 hover:bg-slate-100 transition-colors"
          >
            <X className="h-5 w-5 text-slate-600" />
          </button>
          <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4">
            <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${difficultyColors[pass.difficulty]}`}>
              {getDifficultyText(pass.difficulty)}
            </span>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <div className="mb-4 sm:mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">{pass.name}</h2>
            <div className="flex items-center text-slate-600">
              <MapPin className="h-4 sm:h-5 w-4 sm:w-5 mr-2" />
              <span className="text-base sm:text-lg">{getRegionText(pass.region)}, {getCountryText(pass.country)}</span>
            </div>
          </div>

          <p className="text-sm sm:text-base text-slate-700 mb-4 sm:mb-6 leading-relaxed">{pass.description}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mountain className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-sm text-slate-500">{t.altitude}</p>
                  <p className="text-lg font-semibold">{pass.maxAltitude}m</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-sm text-slate-500">{t.elevation}</p>
                  <p className="text-lg font-semibold">+{pass.elevationGain}m</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Award className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-sm text-slate-500">{t.avgGradient}</p>
                  <p className="text-lg font-semibold">{pass.averageGradient}%</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-sm text-slate-500">{t.maxGradient}</p>
                  <p className="text-lg font-semibold">{pass.maxGradient}%</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mountain className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-sm text-slate-500">{t.distance}</p>
                  <p className="text-lg font-semibold">{pass.distance}km</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-sm text-slate-500">{t.category}</p>
                  <p className="text-lg font-semibold">{pass.category}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-6 mb-6">
            <div className="flex items-center mb-4">
              <Navigation className="h-5 w-5 text-orange-500 mr-2" />
              <h3 className="text-lg font-semibold text-slate-800">Ubicación</h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between bg-slate-50 rounded-lg p-3">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-slate-500" />
                  <div>
                    <p className="text-sm text-slate-500">Coordenadas</p>
                    <p className="font-mono text-slate-800">
                      {pass.coordinates.lat.toFixed(6)}, {pass.coordinates.lng.toFixed(6)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                <a
                  href={`https://www.google.com/maps?q=${pass.coordinates.lat},${pass.coordinates.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-2 bg-blue-500 text-white rounded-lg px-3 sm:px-4 py-2 sm:py-3 hover:bg-blue-600 transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span className="text-sm sm:text-base font-medium">Google Maps</span>
                </a>

                <a
                  href={`https://www.openstreetmap.org/?mlat=${pass.coordinates.lat}&mlon=${pass.coordinates.lng}&zoom=13`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-2 bg-green-500 text-white rounded-lg px-3 sm:px-4 py-2 sm:py-3 hover:bg-green-600 transition-colors"
                >
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm sm:text-base font-medium">OpenStreetMap</span>
                </a>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <div className="flex items-center mb-4">
              <Trophy className="h-5 w-5 text-orange-500 mr-2" />
              <h3 className="text-lg font-semibold text-slate-800">{t.famousWinners}</h3>
            </div>
            
            <div className="space-y-3">
              {pass.famousWinners.map((winner, index) => (
                <div key={index} className="flex items-center justify-between bg-slate-50 rounded-lg p-3">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-slate-500" />
                    <div>
                      <p className="font-medium text-slate-800">{winner.winner}</p>
                      <p className="text-sm text-slate-600">{winner.race} {winner.year}</p>
                    </div>
                  </div>
                  {winner.time && (
                    <span className="text-sm font-mono text-slate-600 bg-white px-2 py-1 rounded">
                      {winner.time}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};