import React from 'react';
import { MountainPass } from '../types';
import { MapPin, Mountain, TrendingUp } from 'lucide-react';

interface InteractiveMapProps {
  passes: MountainPass[];
  conqueredPassIds: Set<string>;
  onPassClick: (pass: MountainPass) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  passes,
  conqueredPassIds,
  onPassClick
}) => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Mountain Pass Map</h2>
        <p className="text-slate-600">Interactive map showing your conquest progress across the world's most famous climbs.</p>
      </div>
      
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="relative bg-slate-100 rounded-lg h-96 overflow-hidden">
          {/* Simulated map background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50"></div>
          
          {/* Mountain pass markers */}
          <div className="relative h-full">
            {passes.map((pass, index) => {
              const isConquered = conqueredPassIds.has(pass.id);
              
              // Position calculation based on coordinates (simplified for demo)
              const left = ((pass.coordinates.lng + 180) / 360) * 100;
              const top = ((90 - pass.coordinates.lat) / 180) * 100;
              
              return (
                <button
                  key={pass.id}
                  onClick={() => onPassClick(pass)}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 hover:scale-110 ${
                    isConquered ? 'z-20' : 'z-10'
                  }`}
                  style={{
                    left: `${Math.max(5, Math.min(95, left))}%`,
                    top: `${Math.max(5, Math.min(95, top))}%`
                  }}
                >
                  <div className={`w-6 h-6 rounded-full border-2 ${
                    isConquered 
                      ? 'bg-green-500 border-green-600' 
                      : 'bg-orange-500 border-orange-600'
                  } shadow-lg`}>
                    <Mountain className="h-3 w-3 text-white m-0.5" />
                  </div>
                  
                  <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-lg opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap z-30">
                    <p className="text-xs font-semibold">{pass.name}</p>
                    <p className="text-xs text-slate-500">{pass.country}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
        
        <div className="mt-6 flex items-center justify-center space-x-8">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span className="text-sm text-slate-600">Conquered ({conqueredPassIds.size})</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
            <span className="text-sm text-slate-600">Pending ({passes.length - conqueredPassIds.size})</span>
          </div>
        </div>
      </div>
      
      {/* Pass list for map view */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {passes.map(pass => {
          const isConquered = conqueredPassIds.has(pass.id);
          return (
            <button
              key={pass.id}
              onClick={() => onPassClick(pass)}
              className={`text-left p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                isConquered 
                  ? 'border-green-300 bg-green-50' 
                  : 'border-slate-200 bg-white hover:border-orange-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-slate-800">{pass.name}</h3>
                <div className={`w-3 h-3 rounded-full ${
                  isConquered ? 'bg-green-500' : 'bg-orange-500'
                }`}></div>
              </div>
              
              <p className="text-sm text-slate-600 mb-2">{pass.region}, {pass.country}</p>
              
              <div className="flex items-center space-x-4 text-xs text-slate-500">
                <div className="flex items-center">
                  <Mountain className="h-3 w-3 mr-1" />
                  <span>{pass.maxAltitude}m</span>
                </div>
                <div className="flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>{pass.averageGradient}%</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};