import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { Translation } from '../i18n/translations';
import { CyclingRace } from '../types';
import { loadRaces } from '../utils/racesStorage';
import { ShareButton } from './ShareButton';
import {
  Calendar,
  MapPin,
  Users,
  Trophy,
  Clock,
  DollarSign,
  ExternalLink,
  Mail,
  Navigation,
  Bike,
  Mountain,
  Search,
  Filter
} from 'lucide-react';
import 'leaflet/dist/leaflet.css';

interface RacesViewProps {
  t: Translation;
}

const raceIcon = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export const RacesView: React.FC<RacesViewProps> = ({ t }) => {
  const [races, setRaces] = useState<CyclingRace[]>([]);
  const [filteredRaces, setFilteredRaces] = useState<CyclingRace[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRace, setSelectedRace] = useState<CyclingRace | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');

  useEffect(() => {
    const loadedRaces = loadRaces();
    // Solo mostrar carreras activas
    const activeRaces = loadedRaces.filter(race => race.isActive !== false);
    setRaces(activeRaces);
    setFilteredRaces(activeRaces);
  }, []);

  useEffect(() => {
    let filtered = races;

    if (searchTerm) {
      filtered = filtered.filter(race =>
        race.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        race.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        race.region?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(race => race.type === selectedType);
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(race => race.category === selectedCategory);
    }

    setFilteredRaces(filtered);
  }, [searchTerm, selectedType, selectedCategory, races]);

  const types = ['Carretera', 'Contrarreloj', 'Criterium', 'Gravel', 'MTB'];
  const categories = ['Amateur', 'Master', 'Elite', 'Gran Fondo', 'Todos'];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Carretera': return <Bike className="w-4 h-4" />;
      case 'MTB': return <Mountain className="w-4 h-4" />;
      default: return <Bike className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-4">Calendario de Carreras</h1>
              <p className="text-orange-100 text-lg">
                Descubre las próximas carreras ciclistas y planifica tu temporada
              </p>
            </div>
            <ShareButton
              title="Calendario de Carreras"
              text="Descubre las próximas carreras ciclistas y planifica tu temporada"
              className="bg-white text-orange-600 hover:bg-orange-50"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar carreras por nombre o ubicación..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="all">Todos los tipos</option>
                {types.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="all">Todas las categorías</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => setViewMode('map')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'map'
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <MapPin className="w-4 h-4 inline mr-2" />
              Mapa
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Vista Lista
            </button>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-4 text-gray-600">
          {filteredRaces.length} {filteredRaces.length === 1 ? 'carrera encontrada' : 'carreras encontradas'}
        </div>

        {/* Map View */}
        {viewMode === 'map' && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
            <div style={{ height: '600px', width: '100%' }}>
              {filteredRaces.length > 0 && (
                <MapContainer
                  center={[
                    parseFloat(filteredRaces[0].lat) || 40.4168,
                    parseFloat(filteredRaces[0].lng) || -3.7038
                  ]}
                  zoom={6}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  {filteredRaces.map((race) => {
                    const lat = parseFloat(race.lat);
                    const lng = parseFloat(race.lng);

                    if (!isNaN(lat) && !isNaN(lng)) {
                      return (
                        <Marker
                          key={race.id}
                          position={[lat, lng]}
                          icon={raceIcon}
                          eventHandlers={{
                            click: () => setSelectedRace(race)
                          }}
                        >
                          <Popup>
                            <div className="p-2">
                              <h3 className="font-bold text-lg mb-2">{race.name}</h3>
                              <div className="space-y-1 text-sm">
                                <p><Calendar className="w-4 h-4 inline mr-1" />{formatDate(race.date)}</p>
                                <p><MapPin className="w-4 h-4 inline mr-1" />{race.city}, {race.region}</p>
                                <p>{getTypeIcon(race.type)} {race.type} - {race.category}</p>
                              </div>
                              <button
                                onClick={() => setSelectedRace(race)}
                                className="mt-2 text-orange-600 hover:text-orange-700 font-medium text-sm"
                              >
                                Ver detalles →
                              </button>
                            </div>
                          </Popup>
                        </Marker>
                      );
                    }
                    return null;
                  })}
                </MapContainer>
              )}
            </div>
          </div>
        )}

        {/* List View / Race Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRaces.map((race) => (
            <div
              key={race.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer"
              onClick={() => setSelectedRace(race)}
            >
              {race.posterUrl && (
                <div className="h-48 overflow-hidden">
                  <img
                    src={race.posterUrl}
                    alt={race.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900 flex-1">{race.name}</h3>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    race.category === 'Elite' ? 'bg-yellow-100 text-yellow-800' :
                    race.category === 'Amateur' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {race.category}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-orange-600" />
                    <span>{formatDate(race.date)}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-orange-600" />
                    <span>{race.city}, {race.region}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {getTypeIcon(race.type)}
                    <span>{race.type}</span>
                  </div>

                  {race.distance && (
                    <div className="flex items-center gap-2">
                      <Navigation className="w-4 h-4 text-orange-600" />
                      <span>{race.distance} km</span>
                    </div>
                  )}

                  {race.elevation && (
                    <div className="flex items-center gap-2">
                      <Mountain className="w-4 h-4 text-orange-600" />
                      <span>{race.elevation}m de desnivel</span>
                    </div>
                  )}
                </div>

                {race.price && (
                  <div className="flex items-center gap-2 text-green-600 font-semibold">
                    <DollarSign className="w-4 h-4" />
                    <span>{race.price}€</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredRaces.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl">
            <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No se encontraron carreras</h3>
            <p className="text-gray-500">Intenta ajustar tus filtros de búsqueda</p>
          </div>
        )}
      </div>

      {/* Race Detail Modal */}
      {selectedRace && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedRace(null)}
        >
          <div
            className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedRace.posterUrl && (
              <div className="h-64 overflow-hidden">
                <img
                  src={selectedRace.posterUrl}
                  alt={selectedRace.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-900">{selectedRace.name}</h2>
                <button
                  onClick={() => setSelectedRace(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="text-2xl">&times;</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-700">
                    <Calendar className="w-5 h-5 text-orange-600" />
                    <div>
                      <p className="text-sm text-gray-500">Fecha</p>
                      <p className="font-semibold">{formatDate(selectedRace.date)}</p>
                      {selectedRace.startTime && <p className="text-sm">{selectedRace.startTime}</p>}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-gray-700">
                    <MapPin className="w-5 h-5 text-orange-600" />
                    <div>
                      <p className="text-sm text-gray-500">Ubicación</p>
                      <p className="font-semibold">{selectedRace.city}</p>
                      <p className="text-sm">{selectedRace.region}, {selectedRace.country}</p>
                    </div>
                  </div>

                  {selectedRace.organizer && (
                    <div className="flex items-center gap-3 text-gray-700">
                      <Users className="w-5 h-5 text-orange-600" />
                      <div>
                        <p className="text-sm text-gray-500">Organizador</p>
                        <p className="font-semibold">{selectedRace.organizer}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  {selectedRace.distance && (
                    <div className="flex items-center gap-3 text-gray-700">
                      <Navigation className="w-5 h-5 text-orange-600" />
                      <div>
                        <p className="text-sm text-gray-500">Distancia</p>
                        <p className="font-semibold">{selectedRace.distance} km</p>
                      </div>
                    </div>
                  )}

                  {selectedRace.elevation && (
                    <div className="flex items-center gap-3 text-gray-700">
                      <Mountain className="w-5 h-5 text-orange-600" />
                      <div>
                        <p className="text-sm text-gray-500">Desnivel</p>
                        <p className="font-semibold">{selectedRace.elevation}m</p>
                      </div>
                    </div>
                  )}

                  {selectedRace.maxParticipants && (
                    <div className="flex items-center gap-3 text-gray-700">
                      <Users className="w-5 h-5 text-orange-600" />
                      <div>
                        <p className="text-sm text-gray-500">Plazas</p>
                        <p className="font-semibold">{selectedRace.maxParticipants} participantes</p>
                      </div>
                    </div>
                  )}

                  {selectedRace.price && (
                    <div className="flex items-center gap-3 text-gray-700">
                      <DollarSign className="w-5 h-5 text-orange-600" />
                      <div>
                        <p className="text-sm text-gray-500">Inscripción</p>
                        <p className="font-semibold text-green-600">{selectedRace.price}€</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {selectedRace.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Descripción</h3>
                  <p className="text-gray-600 leading-relaxed">{selectedRace.description}</p>
                </div>
              )}

              <div className="flex gap-4">
                {selectedRace.registrationUrl && (
                  <a
                    href={selectedRace.registrationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    Inscribirse
                    <ExternalLink className="w-5 h-5" />
                  </a>
                )}

                {selectedRace.contactEmail && (
                  <a
                    href={`mailto:${selectedRace.contactEmail}`}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    Contactar
                    <Mail className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
