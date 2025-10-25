import React from 'react';
import { MountainPass } from '../types';
import { Translation } from '../i18n/translations';
import { 
  CheckCircle, 
  Circle, 
  Mountain, 
  TrendingUp, 
  MapPin,
  Info,
  Flag,
  Camera
} from 'lucide-react';

interface PassCardProps {
  pass: MountainPass;
  isConquered: boolean;
  onToggleConquest: (passId: string) => void;
  onViewDetails: (pass: MountainPass) => void;
  onAddPhotos?: (passId: string) => void;
  t: Translation;
}

const difficultyColors = {
  Cuarta: 'bg-green-100 text-green-800',
  Tercera: 'bg-blue-100 text-blue-800',
  Segunda: 'bg-yellow-100 text-yellow-800',
  Primera: 'bg-orange-100 text-orange-800',
  Especial: 'bg-red-100 text-red-800',
};

const categoryColors = {
  Alpes: 'bg-blue-100 text-blue-800 border-blue-300',
  Pirineos: 'bg-purple-100 text-purple-800 border-purple-300',
  Dolomitas: 'bg-pink-100 text-pink-800 border-pink-300',
  Andes: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  Otros: 'bg-gray-100 text-gray-800 border-gray-300',
  Provenza: 'bg-yellow-100 text-yellow-800 border-yellow-300'
};

export const PassCard: React.FC<PassCardProps> = ({ 
  pass, 
  isConquered, 
  onToggleConquest, 
  onViewDetails,
  onAddPhotos,
  t
}) => {
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

  const getCategoryText = (category: string) => {
    const categoryMap: Record<string, keyof Translation> = {
      'Alpes': 'alps',
      'Pirineos': 'pyrenees',
      'Dolomitas': 'dolomites', 
      'Andes': 'andes',
      'Otros': 'other'
    };
    return t[categoryMap[category]] || category;
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
    <div className={`bg-white rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 overflow-hidden ${
      isConquered ? 'ring-2 ring-green-400' : ''
    }`}>
      <div className="relative h-48">
        <img 
          src={pass.imageUrl} 
          alt={pass.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3 flex space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${categoryColors[pass.category]}`}>
            {getCategoryText(pass.category)}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[pass.difficulty]}`}>
            {getDifficultyText(pass.difficulty)}
          </span>
        </div>
        {isConquered && (
          <div className="absolute top-3 left-3">
            <CheckCircle className="h-8 w-8 text-green-500 bg-white rounded-full" />
          </div>
        )}
      </div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-slate-800 mb-1">{pass.name}</h3>
            <div className="flex items-center text-slate-600 text-sm">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{getRegionText(pass.region)}, {getCountryText(pass.country)}</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <Mountain className="h-4 w-4 text-orange-500" />
            <div>
              <p className="text-xs text-slate-500">{t.altitude}</p>
              <p className="text-sm font-semibold">{pass.maxAltitude}m</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-orange-500" />
            <div>
              <p className="text-xs text-slate-500">{t.elevation}</p>
              <p className="text-sm font-semibold">+{pass.elevationGain}m</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Flag className="h-4 w-4 text-orange-500" />
            <div>
              <p className="text-xs text-slate-500">{t.distance}</p>
              <p className="text-sm font-semibold">{pass.distance}km</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-orange-500" />
            <div>
              <p className="text-xs text-slate-500">{t.avgGradient}</p>
              <p className="text-sm font-semibold">{pass.averageGradient}%</p>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => onToggleConquest(pass.id)}
            className={`flex-1 py-2 px-3 rounded-lg transition-all duration-200 font-medium flex items-center justify-center space-x-2 ${
              isConquered 
                ? 'bg-green-500 hover:bg-green-600 text-white' 
                : 'bg-orange-500 hover:bg-orange-600 text-white'
            }`}
          >
            {isConquered ? <CheckCircle className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
            <span>{isConquered ? t.conquered : t.markAsDone}</span>
          </button>
          
          <button
            onClick={() => onViewDetails(pass)}
            className="px-3 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors duration-200"
          >
            <Info className="h-4 w-4 text-slate-600" />
          </button>
        </div>
      </div>
    </div>
  );
};