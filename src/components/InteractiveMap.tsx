import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MountainPass } from '../types';
import { Translation } from '../i18n/translations';
import { Mountain, TrendingUp, CheckCircle, MapPin } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

interface InteractiveMapProps {
  passes: MountainPass[];
  conqueredPassIds: Set<string>;
  onPassClick: (pass: MountainPass) => void;
  t: Translation;
}

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Function to create bike icons based on difficulty and conquered status
const createBikeIcon = (difficulty: string, isConquered: boolean) => {
  // Color mapping based on UCI difficulty categories
  const difficultyColors = {
    'Cuarta': { bg: '#10b981', border: '#059669' }, // Green - 4th category
    'Tercera': { bg: '#3b82f6', border: '#1d4ed8' }, // Blue - 3rd category  
    'Segunda': { bg: '#eab308', border: '#ca8a04' }, // Yellow - 2nd category
    'Primera': { bg: '#f97316', border: '#ea580c' }, // Orange - 1st category
    'Especial': { bg: '#ef4444', border: '#dc2626' }, // Red - Special category
  };

  const colors = difficultyColors[difficulty as keyof typeof difficultyColors] || difficultyColors['Cuarta'];
  
  const pulseAnimation = isConquered ? `
    <style>
      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
      }
    </style>
  ` : '';

  const conqueredBadge = isConquered ? `
    <div style="
      position: absolute;
      top: -2px;
      right: -2px;
      background-color: #10b981;
      border: 2px solid white;
      border-radius: 50%;
      width: 16px;
      height: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
    ">
      <svg width="10" height="10" fill="white" viewBox="0 0 24 24">
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
    </div>
  ` : '';

  return new L.DivIcon({
    html: `
      <div style="position: relative;">
        <div style="
          background-color: ${colors.bg};
          border: 3px solid ${colors.border};
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 8px rgba(0,0,0,0.3);
          ${isConquered ? 'animation: pulse 2s infinite;' : ''}
        ">
          <svg width="18" height="18" fill="white" viewBox="0 0 24 24">
            <!-- Rueda trasera -->
            <circle cx="6" cy="16" r="3" fill="none" stroke="white" stroke-width="1.5"/>
            <!-- Rueda delantera -->
            <circle cx="18" cy="16" r="3" fill="none" stroke="white" stroke-width="1.5"/>
            <!-- Marco principal -->
            <path d="M6 16 L12 8 L18 16" fill="none" stroke="white" stroke-width="1.5"/>
            <!-- Tubo superior -->
            <path d="M9 10 L15 10" fill="none" stroke="white" stroke-width="1.5"/>
            <!-- Asiento -->
            <path d="M8 8 L10 8" fill="none" stroke="white" stroke-width="2"/>
            <!-- Manillar -->
            <path d="M15 8 L17 8" fill="none" stroke="white" stroke-width="2"/>
            <!-- Pedal -->
            <circle cx="12" cy="13" r="1" fill="white"/>
          </svg>
        </div>
        ${conqueredBadge}
      </div>
      ${pulseAnimation}
    `,
    className: 'custom-bike-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  passes,
  conqueredPassIds,
  onPassClick,
  t
}) => {
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
    const regionMap: Record<string, string> = {
      'Alpes': 'Alpes',
      'Pirineos': 'Pirineos',
      'Dolomitas': 'Dolomitas',
      'Asturias': 'Asturias',
      'Lake District': 'Distrito de los Lagos',
      'Sierra Nevada': 'Sierra Nevada',
      'Provenza': 'Provenza'
    };
    return regionMap[region] || region;
  };

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

  // Calculate center of all passes
  const centerLat = passes.reduce((sum, pass) => sum + pass.coordinates.lat, 0) / passes.length;
  const centerLng = passes.reduce((sum, pass) => sum + pass.coordinates.lng, 0) / passes.length;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">{t.mapTitle}</h2>
        <p className="text-slate-600">{t.mapDescription}</p>
      </div>
      
      {/* Map Legend */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-center space-x-8">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm text-slate-600">{t.conqueredStatus} ({conqueredPassIds.size})</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
              <Mountain className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm text-slate-600">{t.pending} ({passes.length - conqueredPassIds.size})</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <MapPin className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm text-slate-600">Total ({passes.length})</span>
          </div>
        </div>
      </div>

      {/* Interactive Map */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="h-96 w-full">
          <MapContainer
            center={[centerLat, centerLng]}
            zoom={6}
            style={{ height: '100%', width: '100%' }}
            className="rounded-xl"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {passes.map((pass) => {
              const isConquered = conqueredPassIds.has(pass.id);
              
              return (
                <Marker
                  key={pass.id}
                  position={[pass.coordinates.lat, pass.coordinates.lng]}
                  icon={createBikeIcon(pass.difficulty, isConquered)}
                  eventHandlers={{
                    click: () => onPassClick(pass),
                  }}
                >
                  <Popup>
                    <div className="p-2 min-w-[200px]">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-slate-800">{pass.name}</h3>
                        {isConquered && <CheckCircle className="h-5 w-5 text-green-500" />}
                      </div>
                      
                      <div className="flex items-center text-slate-600 text-sm mb-3">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{getRegionText(pass.region)}, {getCountryText(pass.country)}</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mb-3">
                        <div className="flex items-center">
                          <Mountain className="h-3 w-3 mr-1 text-orange-500" />
                          <span>{pass.maxAltitude}m</span>
                        </div>
                        <div className="flex items-center">
                          <TrendingUp className="h-3 w-3 mr-1 text-orange-500" />
                          <span>+{pass.elevationGain}m</span>
                        </div>
                        <div>
                          <span className="font-medium">{t.distance}:</span> {pass.distance}km
                        </div>
                        <div>
                          <span className="font-medium">{t.avgGradient}:</span> {pass.averageGradient}%
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          isConquered 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {getDifficultyText(pass.difficulty)}
                        </span>
                        
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          isConquered 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-slate-100 text-slate-800'
                        }`}>
                          {isConquered ? t.conqueredStatus : t.pending}
                        </span>
                      </div>
                      
                      <button
                        onClick={() => onPassClick(pass)}
                        className="w-full mt-3 px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
                      >
                        Ver Detalles
                      </button>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
      </div>
      
      {/* Pass Statistics */}
      <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Resumen de Puertos</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{conqueredPassIds.size}</div>
            <div className="text-sm text-green-700">{t.conqueredStatus}</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{passes.length - conqueredPassIds.size}</div>
            <div className="text-sm text-orange-700">{t.pending}</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{passes.length}</div>
            <div className="text-sm text-blue-700">Total</div>
          </div>
        </div>
        
        {/* Difficulty Color Classification */}
        <div className="mt-6 pt-6 border-t border-slate-200">
          <h4 className="text-md font-semibold text-slate-800 mb-4">Clasificación por Dificultad UCI</h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-green-600">
                <svg width="14" height="14" fill="white" viewBox="0 0 24 24">
                  <circle cx="6" cy="16" r="2.5" fill="none" stroke="white" strokeWidth="1"/>
                  <circle cx="18" cy="16" r="2.5" fill="none" stroke="white" strokeWidth="1"/>
                  <path d="M6 16 L12 8 L18 16" fill="none" stroke="white" strokeWidth="1"/>
                  <path d="M9 10 L15 10" fill="none" stroke="white" strokeWidth="1"/>
                  <path d="M8 8 L10 8" fill="none" stroke="white" strokeWidth="1.5"/>
                  <path d="M15 8 L17 8" fill="none" stroke="white" strokeWidth="1.5"/>
                  <circle cx="12" cy="13" r="0.8" fill="white"/>
                </svg>
              </div>
              <span className="text-sm text-slate-700 font-medium">{t.cuarta}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center border-2 border-blue-600">
                <svg width="14" height="14" fill="white" viewBox="0 0 24 24">
                  <circle cx="6" cy="16" r="2.5" fill="none" stroke="white" strokeWidth="1"/>
                  <circle cx="18" cy="16" r="2.5" fill="none" stroke="white" strokeWidth="1"/>
                  <path d="M6 16 L12 8 L18 16" fill="none" stroke="white" strokeWidth="1"/>
                  <path d="M9 10 L15 10" fill="none" stroke="white" strokeWidth="1"/>
                  <path d="M8 8 L10 8" fill="none" stroke="white" strokeWidth="1.5"/>
                  <path d="M15 8 L17 8" fill="none" stroke="white" strokeWidth="1.5"/>
                  <circle cx="12" cy="13" r="0.8" fill="white"/>
                </svg>
              </div>
              <span className="text-sm text-slate-700 font-medium">{t.tercera}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center border-2 border-yellow-600">
                <svg width="14" height="14" fill="white" viewBox="0 0 24 24">
                  <circle cx="6" cy="16" r="2.5" fill="none" stroke="white" strokeWidth="1"/>
                  <circle cx="18" cy="16" r="2.5" fill="none" stroke="white" strokeWidth="1"/>
                  <path d="M6 16 L12 8 L18 16" fill="none" stroke="white" strokeWidth="1"/>
                  <path d="M9 10 L15 10" fill="none" stroke="white" strokeWidth="1"/>
                  <path d="M8 8 L10 8" fill="none" stroke="white" strokeWidth="1.5"/>
                  <path d="M15 8 L17 8" fill="none" stroke="white" strokeWidth="1.5"/>
                  <circle cx="12" cy="13" r="0.8" fill="white"/>
                </svg>
              </div>
              <span className="text-sm text-slate-700 font-medium">{t.segunda}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center border-2 border-orange-600">
                <svg width="14" height="14" fill="white" viewBox="0 0 24 24">
                  <circle cx="6" cy="16" r="2.5" fill="none" stroke="white" strokeWidth="1"/>
                  <circle cx="18" cy="16" r="2.5" fill="none" stroke="white" strokeWidth="1"/>
                  <path d="M6 16 L12 8 L18 16" fill="none" stroke="white" strokeWidth="1"/>
                  <path d="M9 10 L15 10" fill="none" stroke="white" strokeWidth="1"/>
                  <path d="M8 8 L10 8" fill="none" stroke="white" strokeWidth="1.5"/>
                  <path d="M15 8 L17 8" fill="none" stroke="white" strokeWidth="1.5"/>
                  <circle cx="12" cy="13" r="0.8" fill="white"/>
                </svg>
              </div>
              <span className="text-sm text-slate-700 font-medium">{t.primera}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center border-2 border-red-600">
                <svg width="14" height="14" fill="white" viewBox="0 0 24 24">
                  <circle cx="6" cy="16" r="2.5" fill="none" stroke="white" strokeWidth="1"/>
                  <circle cx="18" cy="16" r="2.5" fill="none" stroke="white" strokeWidth="1"/>
                  <path d="M6 16 L12 8 L18 16" fill="none" stroke="white" strokeWidth="1"/>
                  <path d="M9 10 L15 10" fill="none" stroke="white" strokeWidth="1"/>
                  <path d="M8 8 L10 8" fill="none" stroke="white" strokeWidth="1.5"/>
                  <path d="M15 8 L17 8" fill="none" stroke="white" strokeWidth="1.5"/>
                  <circle cx="12" cy="13" r="0.8" fill="white"/>
                </svg>
              </div>
              <span className="text-sm text-slate-700 font-medium">{t.especial}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};