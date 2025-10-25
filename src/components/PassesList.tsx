import React, { useState } from 'react';
import { MountainPass } from '../types';
import { Translation } from '../i18n/translations';
import { PassCard } from './PassCard';
import { Search, Filter, ChevronLeft, ChevronRight, Tag, Users, ExternalLink, Globe, Phone, Mail, Mountain } from 'lucide-react';
import { loadBrands } from '../utils/brandsStorage';
import { loadCollaborators } from '../utils/collaboratorStorage';
import { defaultBrands } from '../data/defaultBrands';
import { defaultCollaborators } from '../data/defaultCollaborators';

interface PassesListProps {
  passes: MountainPass[];
  conqueredPassIds: Set<string>;
  onToggleConquest: (passId: string) => void;
  onViewDetails: (pass: MountainPass) => void;
  onAddPhotos: (passId: string) => void;
  t: Translation;
}

export const PassesList: React.FC<PassesListProps> = ({
  passes,
  conqueredPassIds,
  onToggleConquest,
  onViewDetails,
  onAddPhotos,
  t
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [filterRegion, setFilterRegion] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [brandsSlideIndex, setBrandsSlideIndex] = useState(0);
  const [collaboratorsSlideIndex, setCollaboratorsSlideIndex] = useState(0);

  // Get unique regions from passes
  const availableRegions = [...new Set(passes.map(pass => pass.region))].sort();

  // Load brands and collaborators
  const brands = (() => {
    const loadedBrands = loadBrands();
    return loadedBrands.length > 0 ? loadedBrands : defaultBrands;
  })().filter(brand => brand.isActive);

  const collaborators = (() => {
    const loadedCollaborators = loadCollaborators();
    return loadedCollaborators.length > 0 ? loadedCollaborators : defaultCollaborators;
  })().filter(collaborator => collaborator.isActive);
  

  const nextBrandsSlide = () => {
    setBrandsSlideIndex((prev) => (prev + 1) % Math.ceil(brands.length / 3));
  };

  const prevBrandsSlide = () => {
    setBrandsSlideIndex((prev) => (prev - 1 + Math.ceil(brands.length / 3)) % Math.ceil(brands.length / 3));
  };

  const nextCollaboratorsSlide = () => {
    setCollaboratorsSlideIndex((prev) => (prev + 1) % Math.ceil(collaborators.length / 3));
  };

  const prevCollaboratorsSlide = () => {
    setCollaboratorsSlideIndex((prev) => (prev - 1 + Math.ceil(collaborators.length / 3)) % Math.ceil(collaborators.length / 3));
  };
  
  const filteredPasses = passes.filter(pass => {
    const matchesSearch = pass.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pass.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pass.region.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDifficulty = filterDifficulty === 'all' || pass.difficulty === filterDifficulty;
    const matchesRegion = filterRegion === 'all' || pass.region === filterRegion;
    const isConquered = conqueredPassIds.has(pass.id);
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'conquered' && isConquered) ||
                         (filterStatus === 'pending' && !isConquered);
    
    return matchesSearch && matchesDifficulty && matchesRegion && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-slate-500" />
            <span className="text-sm font-medium text-slate-700">{t.filters}</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full sm:w-auto">
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">{t.allDifficulties}</option>
              <option value="Cuarta">{t.cuarta}</option>
              <option value="Tercera">{t.tercera}</option>
              <option value="Segunda">{t.segunda}</option>
              <option value="Primera">{t.primera}</option>
              <option value="Especial">{t.especial}</option>
            </select>
            
            <select
              value={filterRegion}
              onChange={(e) => setFilterRegion(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">Todas las Regiones</option>
              {availableRegions.map(region => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">{t.allStatus}</option>
              <option value="conquered">{t.conqueredStatus}</option>
              <option value="pending">{t.pendingStatus}</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPasses.map(pass => (
          <PassCard
            key={pass.id}
            pass={pass}
            isConquered={conqueredPassIds.has(pass.id)}
            onToggleConquest={onToggleConquest}
            onViewDetails={onViewDetails}
            onAddPhotos={onAddPhotos}
            t={t}
          />
        ))}
      </div>
      
      {filteredPasses.length === 0 && (
        <div className="text-center py-12">
          <Mountain className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <p className="text-xl text-slate-600 mb-2">{t.noPassesFound}</p>
          <p className="text-slate-500">{t.noPassesFoundDesc}</p>
        </div>
      )}

      {/* Brands and Collaborators Section */}
      <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Brands Slide */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Tag className="h-6 w-6 text-orange-500 mr-3" />
              <h3 className="text-xl font-semibold text-slate-800">Marcas Destacadas</h3>
            </div>
            {brands.length > 3 && (
              <div className="flex space-x-2">
                <button
                  onClick={prevBrandsSlide}
                  className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4 text-slate-600" />
                </button>
                <button
                  onClick={nextBrandsSlide}
                  className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  <ChevronRight className="h-4 w-4 text-slate-600" />
                </button>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            {brands.slice(brandsSlideIndex * 3, (brandsSlideIndex * 3) + 3).map(brand => (
              <div key={brand.id} className="flex items-center space-x-4 p-4 border border-slate-200 rounded-lg hover:shadow-md transition-shadow">
                {brand.logo && (
                  <img 
                    src={brand.logo} 
                    alt={`${brand.name} logo`}
                    className="w-12 h-12 object-contain rounded-lg bg-slate-50 p-2"
                  />
                )}
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-800">{brand.name}</h4>
                  <p className="text-sm text-slate-600">{brand.category}</p>
                  <p className="text-xs text-slate-500 line-clamp-2">{brand.description}</p>
                </div>
                {brand.website && (
                  <a
                    href={brand.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-orange-500 hover:text-orange-600 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            ))}
          </div>
          
          {brands.length > 3 && (
            <div className="flex justify-center mt-4 space-x-1">
              {Array.from({ length: Math.ceil(brands.length / 3) }).map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === brandsSlideIndex ? 'bg-orange-500' : 'bg-slate-300'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Collaborators Slide */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Users className="h-6 w-6 text-orange-500 mr-3" />
              <h3 className="text-xl font-semibold text-slate-800">Nuestros Colaboradores</h3>
            </div>
            {collaborators.length > 3 && (
              <div className="flex space-x-2">
                <button
                  onClick={prevCollaboratorsSlide}
                  className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4 text-slate-600" />
                </button>
                <button
                  onClick={nextCollaboratorsSlide}
                  className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  <ChevronRight className="h-4 w-4 text-slate-600" />
                </button>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            {collaborators.slice(collaboratorsSlideIndex * 3, (collaboratorsSlideIndex * 3) + 3).map(collaborator => (
              <div key={collaborator.id} className="flex items-start space-x-4 p-4 border border-slate-200 rounded-lg hover:shadow-md transition-shadow">
                {collaborator.images.length > 0 && (
                  <img 
                    src={collaborator.images[0]} 
                    alt={collaborator.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-800">{collaborator.name}</h4>
                  <p className="text-sm text-slate-600">{collaborator.category}</p>
                  <p className="text-xs text-slate-500 line-clamp-2">{collaborator.description}</p>
                </div>
                <div className="flex space-x-1">
                  {collaborator.contactInfo.website && (
                    <a
                      href={collaborator.contactInfo.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 text-orange-500 hover:text-orange-600 transition-colors"
                    >
                      <Globe className="h-3 w-3" />
                    </a>
                  )}
                  {collaborator.contactInfo.phone && (
                    <a
                      href={`tel:${collaborator.contactInfo.phone}`}
                      className="p-1 text-orange-500 hover:text-orange-600 transition-colors"
                    >
                      <Phone className="h-3 w-3" />
                    </a>
                  )}
                  {collaborator.contactInfo.email && (
                    <a
                      href={`mailto:${collaborator.contactInfo.email}`}
                      className="p-1 text-orange-500 hover:text-orange-600 transition-colors"
                    >
                      <Mail className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {collaborators.length > 3 && (
            <div className="flex justify-center mt-4 space-x-1">
              {Array.from({ length: Math.ceil(collaborators.length / 3) }).map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === collaboratorsSlideIndex ? 'bg-orange-500' : 'bg-slate-300'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
};