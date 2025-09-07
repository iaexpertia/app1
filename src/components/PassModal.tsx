import React from 'react';
import { MountainPass } from '../types';
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
}

const difficultyColors = {
  Easy: 'bg-green-100 text-green-800',
  Medium: 'bg-yellow-100 text-yellow-800',
  Hard: 'bg-orange-100 text-orange-800',
  Extreme: 'bg-red-100 text-red-800'
};

export const PassModal: React.FC<PassModalProps> = ({ pass, onClose }) => {
  if (!pass) return null;

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
              {pass.difficulty}
            </span>
          </div>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">{pass.name}</h2>
            <div className="flex items-center text-slate-600">
              <MapPin className="h-5 w-5 mr-2" />
              <span className="text-lg">{pass.region}, {pass.country}</span>
            </div>
          </div>
          
          <p className="text-slate-700 mb-6 leading-relaxed">{pass.description}</p>
          
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mountain className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-sm text-slate-500">Max Altitude</p>
                  <p className="text-lg font-semibold">{pass.maxAltitude}m</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-sm text-slate-500">Elevation Gain</p>
                  <p className="text-lg font-semibold">+{pass.elevationGain}m</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Award className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-sm text-slate-500">Average Gradient</p>
                  <p className="text-lg font-semibold">{pass.averageGradient}%</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-sm text-slate-500">Max Gradient</p>
                  <p className="text-lg font-semibold">{pass.maxGradient}%</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mountain className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-sm text-slate-500">Distance</p>
                  <p className="text-lg font-semibold">{pass.distance}km</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-sm text-slate-500">Category</p>
                  <p className="text-lg font-semibold">{pass.category}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-6">
            <div className="flex items-center mb-4">
              <Trophy className="h-5 w-5 text-orange-500 mr-2" />
              <h3 className="text-lg font-semibold text-slate-800">Famous Winners</h3>
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