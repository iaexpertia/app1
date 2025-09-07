import React from 'react';
import { MountainPass } from '../types';
import { 
  CheckCircle, 
  Circle, 
  Mountain, 
  TrendingUp, 
  MapPin,
  Info,
  Flag
} from 'lucide-react';

interface PassCardProps {
  pass: MountainPass;
  isConquered: boolean;
  onToggleConquest: (passId: string) => void;
  onViewDetails: (pass: MountainPass) => void;
}

const difficultyColors = {
  Easy: 'bg-green-100 text-green-800',
  Medium: 'bg-yellow-100 text-yellow-800',
  Hard: 'bg-orange-100 text-orange-800',
  Extreme: 'bg-red-100 text-red-800'
};

const categoryColors = {
  Alps: 'bg-blue-50 text-blue-700 border-blue-200',
  Pyrenees: 'bg-purple-50 text-purple-700 border-purple-200',
  Dolomites: 'bg-pink-50 text-pink-700 border-pink-200',
  Andes: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Other: 'bg-slate-50 text-slate-700 border-slate-200'
};

export const PassCard: React.FC<PassCardProps> = ({ 
  pass, 
  isConquered, 
  onToggleConquest, 
  onViewDetails 
}) => {
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
            {pass.category}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[pass.difficulty]}`}>
            {pass.difficulty}
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
              <span>{pass.region}, {pass.country}</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <Mountain className="h-4 w-4 text-orange-500" />
            <div>
              <p className="text-xs text-slate-500">Altitude</p>
              <p className="text-sm font-semibold">{pass.maxAltitude}m</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-orange-500" />
            <div>
              <p className="text-xs text-slate-500">Elevation</p>
              <p className="text-sm font-semibold">+{pass.elevationGain}m</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Flag className="h-4 w-4 text-orange-500" />
            <div>
              <p className="text-xs text-slate-500">Distance</p>
              <p className="text-sm font-semibold">{pass.distance}km</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-orange-500" />
            <div>
              <p className="text-xs text-slate-500">Avg Gradient</p>
              <p className="text-sm font-semibold">{pass.averageGradient}%</p>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={() => onToggleConquest(pass.id)}
            className={`flex-1 py-2 px-4 rounded-lg transition-all duration-200 font-medium flex items-center justify-center space-x-2 ${
              isConquered 
                ? 'bg-green-500 hover:bg-green-600 text-white' 
                : 'bg-orange-500 hover:bg-orange-600 text-white'
            }`}
          >
            {isConquered ? <CheckCircle className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
            <span>{isConquered ? 'Conquered!' : 'Mark as Done'}</span>
          </button>
          
          <button
            onClick={() => onViewDetails(pass)}
            className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors duration-200"
          >
            <Info className="h-4 w-4 text-slate-600" />
          </button>
        </div>
      </div>
    </div>
  );
};