import React, { useState } from 'react';
import { MountainPass, NewsArticle } from '../types';
import { Translation } from '../i18n/translations';
import { PassCard } from './PassCard';
import { ShareButton } from './ShareButton';
import { Search, Filter, ChevronLeft, ChevronRight, Tag, Users, ExternalLink, Globe, Phone, Mail, Mountain, Calendar, MapPin, Trophy, Newspaper, Clock, User as UserIcon } from 'lucide-react';
import { loadBrands } from '../utils/brandsStorage';
import { loadCollaborators } from '../utils/collaboratorStorage';
import { loadRaces } from '../utils/racesStorage';
import { loadNews } from '../utils/newsStorage';
import { defaultBrands } from '../data/defaultBrands';
import { defaultCollaborators } from '../data/defaultCollaborators';

interface PassesListProps {
  passes: MountainPass[];
  conqueredPassIds: Set<string>;
  favoritePassIds: Set<string>;
  onToggleConquest: (passId: string) => void;
  onToggleFavorite: (passId: string) => void;
  onViewDetails: (pass: MountainPass) => void;
  onAddPhotos: (passId: string) => void;
  t: Translation;
}

export const PassesList: React.FC<PassesListProps> = ({
  passes,
  conqueredPassIds,
  favoritePassIds,
  onToggleConquest,
  onToggleFavorite,
  onViewDetails,
  onAddPhotos,
  t
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [brandsSlideIndex, setBrandsSlideIndex] = useState(0);
  const [collaboratorsSlideIndex, setCollaboratorsSlideIndex] = useState(0);
  const [racesSlideIndex, setRacesSlideIndex] = useState(0);
  const [newsSlideIndex, setNewsSlideIndex] = useState(0);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);

  // Get unique categories from passes
  const availableCategories = [...new Set(passes.map(pass => pass.category))];

  // Load brands and collaborators
  const brands = (() => {
    const loadedBrands = loadBrands();
    return loadedBrands.length > 0 ? loadedBrands : defaultBrands;
  })().filter(brand => brand.isActive);

  const collaborators = (() => {
    const loadedCollaborators = loadCollaborators();
    return loadedCollaborators.length > 0 ? loadedCollaborators : defaultCollaborators;
  })().filter(collaborator => collaborator.isActive);

  const races = loadRaces().filter(race => race.isActive && race.featured);

  const news = loadNews().filter(article => article.featured);

  const getCategoryText = (category: string) => {
    // Si la categoría ya está en español, la devolvemos tal como está
    // Si no, intentamos traducirla
    const categoryMap: Record<string, string> = {
      'Alps': 'Alpes',
      'Pyrenees': 'Pirineos',
      'Dolomites': 'Dolomitas',
      'Andes': 'Andes',
      'Other': 'Otros'
    };
    return categoryMap[category] || category;
  };

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

  const nextRacesSlide = () => {
    setRacesSlideIndex((prev) => (prev + 1) % Math.ceil(races.length / 3));
  };

  const prevRacesSlide = () => {
    setRacesSlideIndex((prev) => (prev - 1 + Math.ceil(races.length / 3)) % Math.ceil(races.length / 3));
  };

  const nextNewsSlide = () => {
    setNewsSlideIndex((prev) => (prev + 1) % Math.ceil(news.length / 3));
  };

  const prevNewsSlide = () => {
    setNewsSlideIndex((prev) => (prev - 1 + Math.ceil(news.length / 3)) % Math.ceil(news.length / 3));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleOpenArticle = (article: NewsArticle) => {
    if (article.externalUrl) {
      window.open(article.externalUrl, '_blank', 'noopener,noreferrer');
    } else {
      setSelectedArticle(article);
    }
  };

  const filteredPasses = passes.filter(pass => {
    // CRÍTICO: Solo mostrar puertos activos en el frontend público
    const isActive = pass.isActive ?? true; // Si no está definido, asumimos activo por defecto
    if (!isActive) return false; // Excluir puertos inactivos

    const matchesSearch = pass.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pass.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pass.region.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDifficulty = filterDifficulty === 'all' || pass.difficulty === filterDifficulty;
    const isConquered = conqueredPassIds.has(pass.id);
    const matchesStatus = filterStatus === 'all' ||
                         (filterStatus === 'conquered' && isConquered) ||
                         (filterStatus === 'pending' && !isConquered);

    return matchesSearch && matchesDifficulty && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Brands and Collaborators Section */}
      <div className="mb-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
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

      {/* Featured Races Section */}
      {races.length > 0 && (
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Trophy className="h-6 w-6 text-orange-500 mr-3" />
                <h3 className="text-xl font-semibold text-slate-800">Carreras Destacadas</h3>
              </div>
              {races.length > 3 && (
                <div className="flex space-x-2">
                  <button
                    onClick={prevRacesSlide}
                    className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4 text-slate-600" />
                  </button>
                  <button
                    onClick={nextRacesSlide}
                    className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    <ChevronRight className="h-4 w-4 text-slate-600" />
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {races.slice(racesSlideIndex * 3, (racesSlideIndex * 3) + 3).map(race => (
                <div key={race.id} className="flex items-start space-x-4 p-4 border border-slate-200 rounded-lg hover:shadow-md transition-shadow">
                  {race.posterUrl && (
                    <img
                      src={race.posterUrl}
                      alt={race.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-800 mb-1">{race.name}</h4>
                    <div className="flex items-center gap-3 text-xs text-slate-600 mb-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-orange-500" />
                        <span>{formatDate(race.date)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-orange-500" />
                        <span>{race.city}, {race.region}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2">{race.description}</p>
                  </div>
                  {race.registrationUrl && (
                    <a
                      href={race.registrationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors whitespace-nowrap"
                    >
                      Inscribirse
                    </a>
                  )}
                </div>
              ))}
            </div>

            {races.length > 3 && (
              <div className="flex justify-center mt-4 space-x-1">
                {Array.from({ length: Math.ceil(races.length / 3) }).map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === racesSlideIndex ? 'bg-orange-500' : 'bg-slate-300'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Featured News Section */}
      {news.length > 0 && (
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Newspaper className="h-6 w-6 text-orange-500 mr-3" />
                <h3 className="text-xl font-semibold text-slate-800">Noticias Destacadas</h3>
              </div>
              {news.length > 3 && (
                <div className="flex space-x-2">
                  <button
                    onClick={prevNewsSlide}
                    className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4 text-slate-600" />
                  </button>
                  <button
                    onClick={nextNewsSlide}
                    className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    <ChevronRight className="h-4 w-4 text-slate-600" />
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {news.slice(newsSlideIndex * 3, (newsSlideIndex * 3) + 3).map(article => (
                <div key={article.id} className="flex items-start space-x-4 p-4 border border-slate-200 rounded-lg hover:shadow-md transition-shadow">
                  {article.imageUrl && (
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-800 mb-1">{article.title}</h4>
                    <div className="flex items-center gap-3 text-xs text-slate-600 mb-2">
                      <div className="flex items-center gap-1">
                        <UserIcon className="h-3 w-3 text-orange-500" />
                        <span>{article.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-orange-500" />
                        <span>{article.readTime} min</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2">{article.summary}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleOpenArticle(article)}
                      className="px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors whitespace-nowrap"
                    >
                      Leer artículo
                    </button>
                    <ShareButton
                      title={article.title}
                      text={article.summary}
                      className="text-xs bg-blue-600 hover:bg-blue-700"
                    />
                  </div>
                </div>
              ))}
            </div>

            {news.length > 3 && (
              <div className="flex justify-center mt-4 space-x-1">
                {Array.from({ length: Math.ceil(news.length / 3) }).map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === newsSlideIndex ? 'bg-orange-500' : 'bg-slate-300'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

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
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full sm:w-auto">
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredPasses.map(pass => (
          <PassCard
            key={pass.id}
            pass={pass}
            isConquered={conqueredPassIds.has(pass.id)}
            isFavorite={favoritePassIds.has(pass.id)}
            onToggleConquest={onToggleConquest}
            onToggleFavorite={onToggleFavorite}
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

      {selectedArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedArticle(null)}>
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="relative">
              <img
                src={selectedArticle.imageUrl}
                alt={selectedArticle.title}
                className="w-full h-64 object-cover rounded-t-xl"
              />
              <button
                onClick={() => setSelectedArticle(null)}
                className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-slate-100 transition-colors"
              >
                <svg className="h-6 w-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-8">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold text-slate-800">{selectedArticle.title}</h1>
                <ShareButton
                  title={selectedArticle.title}
                  text={selectedArticle.summary}
                  className="bg-blue-600 hover:bg-blue-700"
                />
              </div>

              <div className="flex items-center space-x-4 text-sm text-slate-500 mb-6 pb-6 border-b border-slate-200">
                <span className="flex items-center">
                  <UserIcon className="h-4 w-4 mr-1" />
                  {selectedArticle.author}
                </span>
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {formatDate(selectedArticle.publishDate)}
                </span>
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {selectedArticle.readTime} min
                </span>
              </div>

              <div className="prose max-w-none">
                <p className="text-lg text-slate-600 mb-6 leading-relaxed">{selectedArticle.summary}</p>
                <div className="text-slate-700 leading-relaxed whitespace-pre-line">{selectedArticle.content}</div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
    </div>
  );
};