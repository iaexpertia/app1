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
  Trophy
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
      'Sierra Nevada': 'sierraNevada'
    };
    return t[regionMap[region]] || region;
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative h-64">
          <img 
            src={pass.imageUrl} 
            alt={pass.name}
            className="w-full h-full object-cover rounded-t-2xl"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-slate-100 transition-colors"
          >
            <X className="h-5 w-5 text-slate-600" />
          </button>
          <div className="absolute bottom-4 left-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${difficultyColors[pass.difficulty]}`}>
              {getDifficultyText(pass.difficulty)}
            </span>
          </div>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">{pass.name}</h2>
            <div className="flex items-center text-slate-600">
              <MapPin className="h-5 w-5 mr-2" />
              <span className="text-lg">{getRegionText(pass.region)}, {getCountryText(pass.country)}</span>
            </div>
          </div>
          
          <p className="text-slate-700 mb-6 leading-relaxed">{pass.description}</p>
          
          <div className="grid grid-cols-2 gap-6 mb-6">
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