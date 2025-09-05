import React, { useState, useEffect } from 'react';
import { Collaborator } from '../types';
import { Translation } from '../i18n/translations';
import { loadCollaborators } from '../utils/collaboratorStorage';
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
  ChevronRight
} from 'lucide-react';

interface CollaboratorsViewProps {
  t: Translation;
}

export const CollaboratorsView: React.FC<CollaboratorsViewProps> = ({ t }) => {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentImageIndex, setCurrentImageIndex] = useState<Record<string, number>>({});

  useEffect(() => {
    const loadedCollaborators = loadCollaborators();
    if (loadedCollaborators.length === 0) {
      setCollaborators(defaultCollaborators);
    } else {
      setCollaborators(loadedCollaborators);
    }
  }, []);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Bike Shop': return Store;
      case 'Hotel': return Hotel;
      case 'Restaurant': return UtensilsCrossed;
      case 'Tour Guide': return MapPin;
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
      'Other': 'Otros'
    };
    return categoryMap[category] || category;
  };

  const filteredCollaborators = collaborators.filter(collaborator => {
    const isActive = collaborator.isActive;
    const matchesCategory = selectedCategory === 'all' || collaborator.category === selectedCategory;
    return isActive && matchesCategory;
  });

  const featuredCollaborators = filteredCollaborators.filter(c => c.featured);
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

  const categories = [...new Set(collaborators.map(c => c.category))];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Users className="h-8 w-8 text-orange-500 mr-3" />
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{t.collaborators}</h2>
            <p className="text-slate-600">{t.collaboratorsDescription}</p>
          </div>
        </div>
        
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
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

      {/* Featured Collaborators */}
      {featuredCollaborators.length > 0 && (
        <div className="mb-12">
          <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center">
            <Star className="h-5 w-5 text-yellow-500 mr-2" />
            Colaboradores Destacados
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {featuredCollaborators.map(collaborator => {
              const Icon = getCategoryIcon(collaborator.category);
              const currentIndex = currentImageIndex[collaborator.id] || 0;
              
              return (
                <div key={collaborator.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="relative h-64">
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
                              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => nextImage(collaborator.id, collaborator.images.length)}
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
                            >
                              <ChevronRight className="h-4 w-4" />
                            </button>
                            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                              {collaborator.images.map((_, index) => (
                                <div
                                  key={index}
                                  className={`w-2 h-2 rounded-full ${
                                    index === currentIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                                  }`}
                                />
                              ))}
                            </div>
                          </>
                        )}
                      </>
                    )}
                    <div className="absolute top-4 right-4 flex space-x-2">
                      <span className="px-3 py-1 bg-orange-500 text-white rounded-full text-sm font-medium">
                        {getCategoryText(collaborator.category)}
                      </span>
                      <Star className="h-6 w-6 text-yellow-400 bg-white rounded-full p-1" />
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center mb-3">
                      <Icon className="h-6 w-6 text-orange-500 mr-3" />
                      <h3 className="text-xl font-bold text-slate-800">{collaborator.name}</h3>
                    </div>
                    
                    <p className="text-slate-600 mb-4 leading-relaxed">{collaborator.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      {collaborator.contactInfo.address && (
                        <div className="flex items-center text-slate-600 text-sm">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>{collaborator.contactInfo.address}</span>
                        </div>
                      )}
                      {collaborator.contactInfo.phone && (
                        <div className="flex items-center text-slate-600 text-sm">
                          <Phone className="h-4 w-4 mr-2" />
                          <span>{collaborator.contactInfo.phone}</span>
                        </div>
                      )}
                      {collaborator.contactInfo.email && (
                        <div className="flex items-center text-slate-600 text-sm">
                          <Mail className="h-4 w-4 mr-2" />
                          <span>{collaborator.contactInfo.email}</span>
                        </div>
                      )}
                    </div>
                    
                    {collaborator.contactInfo.website && (
                      <a
                        href={collaborator.contactInfo.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                      >
                        <Globe className="h-4 w-4" />
                        <span>Visitar Web</span>
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
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
  );
};