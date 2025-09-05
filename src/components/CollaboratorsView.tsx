import React, { useState, useEffect } from 'react';
import { Collaborator } from '../types';
import { Translation } from '../i18n/translations';
import { loadCollaborators, loadCategories, addCategory, removeCategory } from '../utils/collaboratorStorage';
import { defaultCollaborators } from '../data/defaultCollaborators';
import { 
  Store, 
  Hotel, 
  UtensilsCrossed, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Star,
  Users,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter
} from 'lucide-react';

interface CollaboratorsViewProps {
  t: Translation;
}

export const CollaboratorsView: React.FC<CollaboratorsViewProps> = ({ t }) => {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState<Record<string, number>>({});
  const [featuredSlideIndex, setFeaturedSlideIndex] = useState(0);

  useEffect(() => {
    const loadedCollaborators = loadCollaborators();
    if (loadedCollaborators.length === 0) {
      setCollaborators(defaultCollaborators);
    } else {
      setCollaborators(loadedCollaborators);
    }
    
    // Función para cargar y refrescar categorías
    const refreshCategories = () => {
      setCategories(loadCategories());
    };
    
    refreshCategories();
    
    // Listener para cambios en localStorage (sincronización entre pestañas)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'collaborator-categories') {
        refreshCategories();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Extract unique cities from collaborators
  const cities = [...new Set(
    collaborators
      .filter(c => c.contactInfo.address)
      .map(c => {
        const address = c.contactInfo.address!;
        // Extract city from address (assuming format: "Street, City" or "Street, City, Country")
        const parts = address.split(',');
        return parts.length > 1 ? parts[parts.length - 1].trim() : parts[0].trim();
      })
      .filter(city => city.length > 0)
  )].sort();

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Tienda de Bicicletas': return Store;
      case 'Hotel': return Hotel;
      case 'Restaurante': return UtensilsCrossed;
      case 'Guía Turístico': return MapPin;
      default: return Store;
    }
  };

  const getCategoryText = (category: string) => {
    const categoryMap: Record<string, string> = {
      'Bike Shop': 'Tienda de Bicicletas',
      'Hotel': 'Hotel', 
      'Restaurant': 'Restaurante',
      'Tour Guide': 'Guía Turístico',
      'Equipment': 'Equipamiento',
      'Other': 'Otros',
      // También mapear las versiones en español por si acaso
      'Tienda de Bicicletas': 'Tienda de Bicicletas',
      'Restaurante': 'Restaurante',
      'Guía Turístico': 'Guía Turístico',
      'Equipamiento': 'Equipamiento',
      'Otros': 'Otros'
    };
    return categoryMap[category] || category;
  };

  const filteredCollaborators = collaborators.filter(collaborator => {
    const isActive = collaborator.isActive;
    const matchesCategory = selectedCategory === 'all' || collaborator.category === selectedCategory;
    
    const matchesCity = selectedCity === 'all' || (collaborator.contactInfo.address && 
      collaborator.contactInfo.address.toLowerCase().includes(selectedCity.toLowerCase()));
    
    const matchesSearch = searchTerm === '' || 
      collaborator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      collaborator.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (collaborator.contactInfo.address && collaborator.contactInfo.address.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return isActive && matchesCategory && matchesCity && matchesSearch;
  });

  const featuredCollaborators = collaborators.filter(c => c.isActive && c.featured);
  const regularCollaborators = filteredCollaborators.filter(c => !c.featured);

  const nextImage = (collaboratorId: string, totalImages: number) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [collaboratorId]: ((prev[collaboratorId] || 0) + 1) % totalImages
    }));
  };

  const prevImage = (collaboratorId: string, totalImages: number) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [collaboratorId]: ((prev[collaboratorId] || 0) - 1 + totalImages) % totalImages
    }));
  };
  const nextFeaturedSlide = () => {
    setFeaturedSlideIndex((prev) => (prev + 1) % Math.ceil(featuredCollaborators.length / 3));
  };

  const prevFeaturedSlide = () => {
    setFeaturedSlideIndex((prev) => (prev - 1 + Math.ceil(featuredCollaborators.length / 3)) % Math.ceil(featuredCollaborators.length / 3));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Users className="h-8 w-8 text-orange-500 mr-3" />
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{t.collaborators}</h2>
            <p className="text-slate-600">{t.collaboratorsDescription}</p>
          </div>
        </div>
        
        {/* Search and Filters */}
        <div className="mb-6">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar colaboradores por nombre, descripción o ubicación..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4 mb-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-slate-500" />
              <span className="text-sm font-medium text-slate-700">Filtros:</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full sm:w-auto">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">Todas las Categorías</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {getCategoryText(category)}
                  </option>
                ))}
              </select>
              
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">Todas las Ciudades</option>
                {cities.map(city => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Category Pills */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-slate-800">CATEGORÍAS</h3>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-orange-500 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Todos
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory === category
                    ? 'bg-orange-500 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {getCategoryText(category)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Collaborators Slide */}
      {featuredCollaborators.length > 0 && (
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Users className="h-6 w-6 text-orange-500 mr-3" />
                <h3 className="text-xl font-semibold text-slate-800">Colaboradores Destacados</h3>
              </div>
              {featuredCollaborators.length > 3 && (
                <div className="flex space-x-2">
                  <button
                    onClick={prevFeaturedSlide}
                    className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4 text-slate-600" />
                  </button>
                  <button
                    onClick={nextFeaturedSlide}
                    className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    <ChevronRight className="h-4 w-4 text-slate-600" />
                  </button>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              {featuredCollaborators.slice(featuredSlideIndex * 3, (featuredSlideIndex * 3) + 3).map(collaborator => {
                const Icon = getCategoryIcon(collaborator.category);
                const currentIndex = currentImageIndex[collaborator.id] || 0;
                
                return (
                  <div key={collaborator.id} className="flex items-center space-x-4 p-4 border border-slate-200 rounded-lg hover:shadow-md transition-shadow">
                    {collaborator.images.length > 0 && (
                      <div className="relative">
                        <img 
                          src={collaborator.images[currentIndex]} 
                          alt={collaborator.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        {collaborator.images.length > 1 && (
                          <>
                            <button
                              onClick={() => prevImage(collaborator.id, collaborator.images.length)}
                              className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70 transition-opacity"
                            >
                              <ChevronLeft className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => nextImage(collaborator.id, collaborator.images.length)}
                              className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70 transition-opacity"
                            >
                              <ChevronRight className="h-3 w-3" />
                            </button>
                          </>
                        )}
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <Icon className="h-5 w-5 text-orange-500" />
                        <h4 className="font-semibold text-slate-800">{collaborator.name}</h4>
                        <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
                          Destacado
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mb-1">{getCategoryText(collaborator.category)}</p>
                      <p className="text-xs text-slate-500 line-clamp-2">{collaborator.description}</p>
                      {collaborator.contactInfo.address && (
                        <p className="text-xs text-slate-500 mt-1 flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {collaborator.contactInfo.address}
                        </p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      {collaborator.contactInfo.website && (
                        <a
                          href={collaborator.contactInfo.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-orange-500 hover:text-orange-600 transition-colors"
                        >
                          <Globe className="h-4 w-4" />
                        </a>
                      )}
                      {collaborator.contactInfo.phone && (
                        <a
                          href={`tel:${collaborator.contactInfo.phone}`}
                          className="p-2 text-orange-500 hover:text-orange-600 transition-colors"
                        >
                          <Phone className="h-4 w-4" />
                        </a>
                      )}
                      {collaborator.contactInfo.email && (
                        <a
                          href={`mailto:${collaborator.contactInfo.email}`}
                          className="p-2 text-orange-500 hover:text-orange-600 transition-colors"
                        >
                          <Mail className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {featuredCollaborators.length > 3 && (
              <div className="flex justify-center mt-4 space-x-1">
                {Array.from({ length: Math.ceil(featuredCollaborators.length / 3) }).map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === featuredSlideIndex ? 'bg-orange-500' : 'bg-slate-300'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Regular Collaborators */}
      {regularCollaborators.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-slate-800 mb-6">
            Nuestros Colaboradores
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularCollaborators.map(collaborator => {
              const Icon = getCategoryIcon(collaborator.category);
              const currentIndex = currentImageIndex[collaborator.id] || 0;
              
              return (
                <div key={collaborator.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="relative h-48">
                    {collaborator.images.length > 0 && (
                      <>
                        <img 
                          src={collaborator.images[currentIndex]} 
                          alt={collaborator.name}
                          className="w-full h-full object-cover"
                        />
                        {collaborator.images.length > 1 && (
                          <>
                            <button
                              onClick={() => prevImage(collaborator.id, collaborator.images.length)}
                              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70 transition-opacity"
                            >
                              <ChevronLeft className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => nextImage(collaborator.id, collaborator.images.length)}
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70 transition-opacity"
                            >
                              <ChevronRight className="h-3 w-3" />
                            </button>
                          </>
                        )}
                      </>
                    )}
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-1 bg-orange-500 text-white rounded-full text-xs font-medium">
                        {getCategoryText(collaborator.category)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-center mb-2">
                      <Icon className="h-5 w-5 text-orange-500 mr-2" />
                      <h3 className="text-lg font-bold text-slate-800">{collaborator.name}</h3>
                    </div>
                    
                    <p className="text-slate-600 text-sm mb-3 line-clamp-2">{collaborator.description}</p>
                    
                    <div className="flex items-center justify-between">
                      {collaborator.contactInfo.website ? (
                        <a
                          href={collaborator.contactInfo.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 px-3 py-1 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm"
                        >
                          <Globe className="h-3 w-3" />
                          <span>Web</span>
                        </a>
                      ) : (
                        <div></div>
                      )}
                      
                      <div className="flex space-x-2">
                        {collaborator.contactInfo.phone && (
                          <a
                            href={`tel:${collaborator.contactInfo.phone}`}
                            className="text-slate-500 hover:text-orange-500 transition-colors"
                          >
                            <Phone className="h-4 w-4" />
                          </a>
                        )}
                        {collaborator.contactInfo.email && (
                          <a
                            href={`mailto:${collaborator.contactInfo.email}`}
                            className="text-slate-500 hover:text-orange-500 transition-colors"
                          >
                            <Mail className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {filteredCollaborators.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <p className="text-xl text-slate-600 mb-2">No hay colaboradores disponibles</p>
          <p className="text-slate-500">Próximamente añadiremos más colaboradores</p>
        </div>
      )}
      
    </div>
    </div>
  );
};