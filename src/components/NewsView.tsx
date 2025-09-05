import React, { useState, useEffect } from 'react';
import { Translation } from '../i18n/translations';
import { NewsArticle } from '../types';
import { loadNews } from '../utils/newsStorage';
import { exportNews } from '../utils/excelExport';
import { 
  Newspaper, 
  Calendar, 
  User, 
  ExternalLink,
  Clock,
  Tag,
  Search,
  Filter,
  TrendingUp,
  Award,
  Mountain,
  Download
} from 'lucide-react';

interface NewsViewProps {
  t: Translation;
}

const defaultNews: NewsArticle[] = [
  {
    id: 'tour-2024-preview',
    title: 'Tour de Francia 2024: Previa de las etapas de montaña más esperadas',
    summary: 'Analizamos las etapas clave que definirán el Tour de Francia 2024, incluyendo los puertos más duros y las estrategias de los favoritos.',
    content: 'El Tour de Francia 2024 promete ser uno de los más emocionantes de los últimos años...',
    author: 'Carlos Rodríguez',
    publishDate: '2024-01-15',
    category: 'Competición',
    imageUrl: 'https://images.pexels.com/photos/1666021/pexels-photo-1666021.jpeg',
    readTime: 8,
    featured: true
  },
  {
    id: 'new-bike-tech-2024',
    title: 'Las nuevas tecnologías en bicicletas que revolucionarán 2024',
    summary: 'Descubre las últimas innovaciones en componentes, materiales y diseño que están cambiando el mundo del ciclismo.',
    content: 'La industria del ciclismo no para de innovar...',
    author: 'María González',
    publishDate: '2024-01-12',
    category: 'Equipamiento',
    imageUrl: 'https://images.pexels.com/photos/276517/pexels-photo-276517.jpeg',
    readTime: 6,
    featured: true
  },
  {
    id: 'best-climbs-spain',
    title: 'Los 10 puertos de montaña más espectaculares de España',
    summary: 'Una guía completa de las subidas más impresionantes de la península ibérica, desde los Pirineos hasta Sierra Nevada.',
    content: 'España cuenta con algunos de los puertos más desafiantes...',
    author: 'Javier Martín',
    publishDate: '2024-01-10',
    category: 'Rutas',
    imageUrl: 'https://images.pexels.com/photos/1578662/pexels-photo-1578662.jpeg',
    readTime: 12,
    featured: false
  },
  {
    id: 'pogacar-interview',
    title: 'Entrevista exclusiva: Tadej Pogačar habla sobre sus objetivos para 2024',
    summary: 'El ciclista esloveno nos cuenta sus planes para la nueva temporada y sus puertos favoritos para entrenar.',
    content: 'En una entrevista exclusiva, Tadej Pogačar...',
    author: 'Ana López',
    publishDate: '2024-01-08',
    category: 'Entrevistas',
    imageUrl: 'https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg',
    readTime: 10,
    featured: true
  },
  {
    id: 'cycling-nutrition-tips',
    title: 'Nutrición para ciclistas: Cómo alimentarse en puertos de montaña',
    summary: 'Consejos nutricionales específicos para afrontar las subidas más duras con la energía necesaria.',
    content: 'La alimentación es clave para rendir en montaña...',
    author: 'Dr. Roberto Sánchez',
    publishDate: '2024-01-05',
    category: 'Noticias',
    imageUrl: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg',
    readTime: 7,
    featured: false
  }
];

export const NewsView: React.FC<NewsViewProps> = ({ t }) => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlyFeatured, setShowOnlyFeatured] = useState(false);

  const categories = ['Competición', 'Equipamiento', 'Rutas', 'Noticias', 'Entrevistas'];

  useEffect(() => {
    const loadedNews = loadNews();
    if (loadedNews.length === 0) {
      setNews(defaultNews);
    } else {
      setNews(loadedNews);
    }
    
    // Escuchar cambios en las noticias
    const handleNewsUpdate = () => {
      const updatedNews = loadNews();
      setNews(updatedNews.length > 0 ? updatedNews : defaultNews);
    };
    
    window.addEventListener('newsUpdated', handleNewsUpdate);
    
    return () => {
      window.removeEventListener('newsUpdated', handleNewsUpdate);
    };
  }, []);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Competición': return Award;
      case 'Equipamiento': return Tag;
      case 'Rutas': return Mountain;
      case 'Noticias': return Newspaper;
      case 'Entrevistas': return User;
      default: return Newspaper;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Competición': return 'bg-yellow-100 text-yellow-800';
      case 'Equipamiento': return 'bg-blue-100 text-blue-800';
      case 'Rutas': return 'bg-green-100 text-green-800';
      case 'Noticias': return 'bg-purple-100 text-purple-800';
      case 'Entrevistas': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredNews = news.filter(article => {
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFeatured = !showOnlyFeatured || article.featured;
    
    return matchesCategory && matchesSearch && matchesFeatured;
  });

  const featuredNews = filteredNews.filter(article => article.featured);
  const regularNews = filteredNews.filter(article => !article.featured);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <Newspaper className="h-8 w-8 text-orange-500 mr-3" />
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Noticias de Ciclismo</h2>
                <p className="text-slate-600">Mantente al día con las últimas noticias del mundo del ciclismo</p>
              </div>
            </div>
            <button
              onClick={() => exportNews(news)}
              className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Exportar Excel</span>
            </button>
          </div>
          </div>
        </div>
        
        {/* Search and Filters */}
        <div className="mb-6">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar noticias por título, contenido o autor..."
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

      {/* Featured News */}
      {featuredNews.length > 0 && (
        <div className="mb-12">
          <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center">
            <TrendingUp className="h-5 w-5 text-orange-500 mr-2" />
            Noticias Destacadas
          </h3>
          
          {/* Main Featured Article */}
          {featuredNews[0] && (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <img 
                    src={featuredNews[0].imageUrl} 
                    alt={featuredNews[0].title}
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-1/2 p-8">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(featuredNews[0].category)}`}>
                      {featuredNews[0].category}
                    </span>
                    <TrendingUp className="h-4 w-4 text-orange-500" />
                  </div>
                  
                  <h2 className="text-2xl font-bold text-slate-800 mb-4">{featuredNews[0].title}</h2>
                  <p className="text-slate-600 mb-6 leading-relaxed">{featuredNews[0].summary}</p>
                  
                  <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {featuredNews[0].author}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(featuredNews[0].publishDate)}
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {featuredNews[0].readTime} min
                      </span>
                    </div>
                  </div>
                  
                  <button className="inline-flex items-center space-x-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                    <span>Leer Artículo</span>
                    <ExternalLink className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Other Featured Articles */}
          {featuredNews.length > 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredNews.slice(1).map(article => {
                const Icon = getCategoryIcon(article.category);
                
                return (
                  <div key={article.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="relative h-48">
                      <img 
                        src={article.imageUrl} 
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 right-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(article.category)}`}>
                          {article.category}
                        </span>
                      </div>
                      <div className="absolute top-3 left-3">
                        <TrendingUp className="h-5 w-5 text-orange-500 bg-white rounded-full p-1" />
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-2">{article.title}</h3>
                      <p className="text-slate-600 text-sm mb-4 line-clamp-3">{article.summary}</p>
                      
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                        <span className="flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          {article.author}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {article.readTime} min
                        </span>
                      </div>
                      
                      <button className="w-full py-2 px-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium">
                        Leer Más
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Regular News */}
      {regularNews.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-slate-800 mb-6">
            Todas las Noticias
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularNews.map(article => {
              const Icon = getCategoryIcon(article.category);
              
              return (
                <div key={article.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="relative h-48">
                    <img 
                      src={article.imageUrl} 
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(article.category)}`}>
                        {article.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-2">{article.title}</h3>
                    <p className="text-slate-600 text-sm mb-4 line-clamp-3">{article.summary}</p>
                    
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                      <span className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        {article.author}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(article.publishDate)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="flex items-center text-xs text-slate-500">
                        <Clock className="h-3 w-3 mr-1" />
                        {article.readTime} min lectura
                      </span>
                      
                      <button className="px-3 py-1 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm">
                        Leer
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {filteredNews.length === 0 && (
        <div className="text-center py-12">
          <Newspaper className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <p className="text-xl text-slate-600 mb-2">No se encontraron noticias</p>
          <p className="text-slate-500">Intenta ajustar tu búsqueda o filtros</p>
        </div>
      )}
    </div>
  );
};