import React, { useState, useEffect } from 'react';
import { Brand } from '../types';
import { Translation } from '../i18n/translations';
import { loadBrands, loadBrandCategories } from '../utils/brandsStorage';
import { defaultBrands } from '../data/defaultBrands';
import { 
  Tag, 
  ExternalLink, 
  Globe, 
  Calendar, 
  MapPin,
  Star,
  Search,
  Filter,
  Award,
  Bike,
  Shirt,
  Smartphone,
  Wrench
} from 'lucide-react';

interface BrandsViewProps {
  t: Translation;
}

export const BrandsView: React.FC<BrandsViewProps> = ({ t }) => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlyFeatured, setShowOnlyFeatured] = useState(false);

  useEffect(() => {
    const loadedBrands = loadBrands();
    if (loadedBrands.length === 0) {
      setBrands(defaultBrands);
    } else {
      setBrands(loadedBrands);
    }
    
    setCategories(loadBrandCategories());
  }, []);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Bicicletas': return Bike;
      case 'Componentes': return Wrench;
      case 'Ropa': return Shirt;
      case 'Accesorios': return Smartphone;
      case 'Nutrición': return Award;
      default: return Tag;
    }
  };

  const filteredBrands = brands.filter(brand => {
    const isActive = brand.isActive;
    const matchesCategory = selectedCategory === 'all' || brand.category === selectedCategory;
    const matchesSearch = brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         brand.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (brand.country && brand.country.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFeatured = !showOnlyFeatured || brand.featured;
    
    return isActive && matchesCategory && matchesSearch && matchesFeatured;
  });

  const featuredBrands = filteredBrands.filter(b => b.featured);
  const regularBrands = filteredBrands.filter(b => !b.featured);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Tag className="h-8 w-8 text-orange-500 mr-3" />
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Marcas de Ciclismo</h2>
            <p className="text-slate-600">Descubre las mejores marcas del mundo del ciclismo</p>
          </div>
        </div>
        
        {/* Search and Filters */}
        <div className="mb-6">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar marcas por nombre, descripción o país..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4">
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
                    {category}
                  </option>
                ))}
              </select>
              
              <label className="flex items-center space-x-2 w-full">
                <input
                  type="checkbox"
                  checked={showOnlyFeatured}
                  onChange={(e) => setShowOnlyFeatured(e.target.checked)}
                  className="rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                />
                <span className="text-sm text-slate-700">Solo Destacadas</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Brands */}
      {featuredBrands.length > 0 && (
        <div className="mb-12">
          <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center">
            <Star className="h-5 w-5 text-yellow-500 mr-2" />
            Marcas Destacadas
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {featuredBrands.map(brand => {
              const Icon = getCategoryIcon(brand.category);
              
              return (
                <div key={brand.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        {brand.logo && (
                          <img 
                            src={brand.logo} 
                            alt={`${brand.name} logo`}
                            className="w-16 h-16 object-contain rounded-lg bg-slate-50 p-2"
                          />
                        )}
                        <div>
                          <h3 className="text-xl font-bold text-slate-800 flex items-center">
                            {brand.name}
                            <Star className="h-5 w-5 text-yellow-400 ml-2" />
                          </h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <Icon className="h-4 w-4 text-orange-500" />
                            <span className="text-sm text-slate-600">{brand.category}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-slate-700 mb-4 leading-relaxed">{brand.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      {brand.country && (
                        <div className="flex items-center text-slate-600">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>{brand.country}</span>
                        </div>
                      )}
                      {brand.foundedYear && (
                        <div className="flex items-center text-slate-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>Fundada en {brand.foundedYear}</span>
                        </div>
                      )}
                    </div>
                    
                    {brand.specialties.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-slate-800 mb-2">Especialidades:</h4>
                        <div className="flex flex-wrap gap-2">
                          {brand.specialties.map((specialty, index) => (
                            <span 
                              key={index}
                              className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs"
                            >
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {brand.website && (
                      <a
                        href={brand.website}
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

      {/* Regular Brands */}
      {regularBrands.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-slate-800 mb-6">
            Todas las Marcas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularBrands.map(brand => {
              const Icon = getCategoryIcon(brand.category);
              
              return (
                <div key={brand.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        {brand.logo && (
                          <img 
                            src={brand.logo} 
                            alt={`${brand.name} logo`}
                            className="w-12 h-12 object-contain rounded-lg bg-slate-50 p-1"
                          />
                        )}
                        <div>
                          <h3 className="text-lg font-bold text-slate-800">{brand.name}</h3>
                          <div className="flex items-center space-x-1">
                            <Icon className="h-3 w-3 text-orange-500" />
                            <span className="text-xs text-slate-600">{brand.category}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-slate-600 text-sm mb-3 line-clamp-3">{brand.description}</p>
                    
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                      {brand.country && (
                        <span className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {brand.country}
                        </span>
                      )}
                      {brand.foundedYear && (
                        <span>{brand.foundedYear}</span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      {brand.website ? (
                        <a
                          href={brand.website}
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
                      
                      {brand.specialties.length > 0 && (
                        <span className="text-xs text-slate-500">
                          {brand.specialties.length} especialidad{brand.specialties.length !== 1 ? 'es' : ''}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {filteredBrands.length === 0 && (
        <div className="text-center py-12">
          <Tag className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <p className="text-xl text-slate-600 mb-2">No se encontraron marcas</p>
          <p className="text-slate-500">Intenta ajustar tu búsqueda o filtros</p>
        </div>
      )}
    </div>
    </div>
  );
};