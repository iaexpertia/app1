import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Collaborator } from '../types';
import { Store, Hotel, UtensilsCrossed, MapPin, Wrench, Building2, Phone, Mail, Globe } from 'lucide-react';

interface CollaboratorsMapProps {
  collaborators: Collaborator[];
}

const createCustomIcon = (category: string) => {
  const iconColors: Record<string, string> = {
    'Tienda de Bicicletas': '#f97316',
    'Hotel': '#3b82f6',
    'Restaurante': '#ef4444',
    'Guía Turístico': '#10b981',
    'Equipamiento': '#8b5cf6',
    'Otros': '#6b7280'
  };

  const color = iconColors[category] || '#6b7280';

  const svg = `
    <svg width="36" height="48" viewBox="0 0 36 48" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 0C8.059 0 0 8.059 0 18c0 13.5 18 30 18 30s18-16.5 18-30C36 8.059 27.941 0 18 0z" fill="${color}"/>
      <circle cx="18" cy="18" r="10" fill="white"/>
      <g transform="translate(18, 18)">
        ${getCategoryIconPath(category)}
      </g>
    </svg>
  `;

  return L.divIcon({
    html: svg,
    className: 'custom-marker-icon',
    iconSize: [36, 48],
    iconAnchor: [18, 48],
    popupAnchor: [0, -48]
  });
};

const getCategoryIconPath = (category: string): string => {
  switch (category) {
    case 'Tienda de Bicicletas':
      return '<path d="M-4,-4 L4,-4 L4,4 L-4,4 Z M-2,-6 L2,-6 L2,-4 L-2,-4 Z" fill="#f97316" stroke="none"/>';
    case 'Hotel':
      return '<path d="M-5,-5 L5,-5 L5,5 L-5,5 Z M-3,-3 L-1,-3 L-1,-1 L-3,-1 Z M1,-3 L3,-3 L3,-1 L1,-1 Z M-3,1 L-1,1 L-1,3 L-3,3 Z M1,1 L3,1 L3,3 L1,3 Z" fill="#3b82f6" stroke="none"/>';
    case 'Restaurante':
      return '<path d="M-2,-5 L-2,0 M0,-5 L0,5 M2,-5 L2,0 M-2,0 L2,0" stroke="#ef4444" stroke-width="1.2" fill="none"/>';
    case 'Guía Turístico':
      return '<circle cx="0" cy="-2" r="2" fill="#10b981"/><path d="M0,0 L0,5 M-3,5 L3,5" stroke="#10b981" stroke-width="1.5" fill="none"/>';
    case 'Equipamiento':
      return '<path d="M-3,-3 L3,3 M-3,3 L3,-3" stroke="#8b5cf6" stroke-width="2" stroke-linecap="round"/>';
    default:
      return '<circle cx="0" cy="0" r="4" fill="#6b7280"/>';
  }
};

export const CollaboratorsMap: React.FC<CollaboratorsMapProps> = ({ collaborators }) => {
  const collaboratorsWithCoords = useMemo(() => {
    return collaborators.filter(c => c.coordinates && c.coordinates.lat && c.coordinates.lng);
  }, [collaborators]);

  const center: [number, number] = useMemo(() => {
    if (collaboratorsWithCoords.length === 0) {
      return [40.4168, -3.7038];
    }

    const avgLat = collaboratorsWithCoords.reduce((sum, c) => sum + c.coordinates!.lat, 0) / collaboratorsWithCoords.length;
    const avgLng = collaboratorsWithCoords.reduce((sum, c) => sum + c.coordinates!.lng, 0) / collaboratorsWithCoords.length;

    return [avgLat, avgLng];
  }, [collaboratorsWithCoords]);

  const getCategoryText = (category: string) => {
    const categoryMap: Record<string, string> = {
      'Tienda de Bicicletas': 'Tienda de Bicicletas',
      'Hotel': 'Hotel',
      'Restaurante': 'Restaurante',
      'Guía Turístico': 'Guía Turístico',
      'Equipamiento': 'Equipamiento',
      'Otros': 'Otros'
    };
    return categoryMap[category] || category;
  };

  if (collaboratorsWithCoords.length === 0) {
    return (
      <div className="bg-slate-100 rounded-lg p-8 text-center">
        <MapPin className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <p className="text-slate-600">No hay colaboradores con ubicación disponible</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={center}
        zoom={6}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {collaboratorsWithCoords.map((collaborator) => (
          <Marker
            key={collaborator.id}
            position={[collaborator.coordinates!.lat, collaborator.coordinates!.lng]}
            icon={createCustomIcon(collaborator.category)}
          >
            <Popup maxWidth={300}>
              <div className="p-2">
                <div className="flex items-start mb-2">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-slate-800">{collaborator.name}</h3>
                    <p className="text-sm text-orange-600 font-medium">{getCategoryText(collaborator.category)}</p>
                  </div>
                </div>

                {collaborator.images.length > 0 && (
                  <img
                    src={collaborator.images[0]}
                    alt={collaborator.name}
                    className="w-full h-32 object-cover rounded-lg mb-2"
                  />
                )}

                <p className="text-sm text-slate-600 mb-3">{collaborator.description}</p>

                {collaborator.contactInfo.address && (
                  <p className="text-xs text-slate-500 mb-2 flex items-start">
                    <MapPin className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                    <span>{collaborator.contactInfo.address}</span>
                  </p>
                )}

                <div className="flex flex-wrap gap-2 mt-3">
                  {collaborator.contactInfo.website && (
                    <a
                      href={collaborator.contactInfo.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 px-2 py-1 bg-orange-500 text-white rounded text-xs hover:bg-orange-600 transition-colors"
                    >
                      <Globe className="h-3 w-3" />
                      <span>Web</span>
                    </a>
                  )}
                  {collaborator.contactInfo.phone && (
                    <a
                      href={`tel:${collaborator.contactInfo.phone}`}
                      className="inline-flex items-center space-x-1 px-2 py-1 bg-slate-500 text-white rounded text-xs hover:bg-slate-600 transition-colors"
                    >
                      <Phone className="h-3 w-3" />
                      <span>Llamar</span>
                    </a>
                  )}
                  {collaborator.contactInfo.email && (
                    <a
                      href={`mailto:${collaborator.contactInfo.email}`}
                      className="inline-flex items-center space-x-1 px-2 py-1 bg-slate-500 text-white rounded text-xs hover:bg-slate-600 transition-colors"
                    >
                      <Mail className="h-3 w-3" />
                      <span>Email</span>
                    </a>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
