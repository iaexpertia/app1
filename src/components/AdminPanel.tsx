import React, { useState, useEffect } from 'react';
import { MountainPass, Cyclist, Brand, Collaborator, NewsArticle } from '../types';
import { Translation } from '../i18n/translations';
import { 
  loadCyclists, 
  saveCyclists, 
  removeCyclist, 
  updateCyclist 
} from '../utils/cyclistStorage';
import { loadBrands, saveBrands } from '../utils/brandsStorage';
import { loadCollaborators, saveCollaborators } from '../utils/collaboratorStorage';
import { loadNews, saveNews } from '../utils/newsStorage';
import { loadSocialMediaUrls, saveSocialMediaUrls } from './Footer';
import { exportCyclists, exportBrands, exportCollaborators, exportNews, exportMountainPasses } from '../utils/excelExport';
import { 
  Settings, 
  Users, 
  Mountain, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Download,
  Tag,
  UserCheck,
  Newspaper,
  Instagram,
  Facebook,
  Youtube,
  Linkedin,
  Globe,
  Plus,
  Upload
} from 'lucide-react';

interface AdminPanelProps {
  passes: MountainPass[];
  onUpdatePass: (pass: MountainPass) => void;
  t: Translation;
}

interface SocialMediaUrls {
  instagram: string;
  facebook: string;
  youtube: string;
  linkedin: string;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ passes, onUpdatePass, t }) => {
  const [activeTab, setActiveTab] = useState<'cyclists' | 'passes' | 'brands' | 'collaborators' | 'news' | 'social'>('cyclists');
  const [cyclists, setCyclists] = useState<Cyclist[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [socialUrls, setSocialUrls] = useState<SocialMediaUrls>({
    instagram: '',
    facebook: '',
    youtube: '',
    linkedin: ''
  });
  const [editingCyclist, setEditingCyclist] = useState<Cyclist | null>(null);
  const [editingPass, setEditingPass] = useState<MountainPass | null>(null);
  const [editingPort, setEditingPort] = useState<MountainPass | null>(null);
  const [showAddPortModal, setShowAddPortModal] = useState(false);
  const [showDeletePortConfirm, setShowDeletePortConfirm] = useState<string | null>(null);
  const [newPort, setNewPort] = useState<Partial<MountainPass>>({
    name: '',
    country: '',
    region: '',
    maxAltitude: 0,
    elevationGain: 0,
    averageGradient: 0,
    maxGradient: 0,
    distance: 0,
    difficulty: 'Cuarta',
    coordinates: { lat: 0, lng: 0 },
    description: '',
    imageUrl: '',
    category: 'Otros',
    famousWinners: []
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // Brand management states
  const [showAddBrandModal, setShowAddBrandModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [showDeleteBrandConfirm, setShowDeleteBrandConfirm] = useState<string | null>(null);
  const [newBrand, setNewBrand] = useState<Partial<Brand>>({
    name: '',
    category: 'Bicicletas',
    description: '',
    logo: '',
    website: '',
    country: '',
    foundedYear: undefined,
    specialties: [],
    isActive: true,
    featured: false
  });

  // Collaborator management states
  const [showAddCollaboratorModal, setShowAddCollaboratorModal] = useState(false);
  const [editingCollaborator, setEditingCollaborator] = useState<Collaborator | null>(null);
  const [showDeleteCollaboratorConfirm, setShowDeleteCollaboratorConfirm] = useState<string | null>(null);
  const [newCollaborator, setNewCollaborator] = useState<Partial<Collaborator>>({
    name: '',
    category: 'Tienda de Bicicletas',
    description: '',
    contactInfo: {
      email: '',
      phone: '',
      website: '',
      address: ''
    },
    images: [],
    isActive: true,
    featured: false
  });

  // News management states
  const [showAddNewsModal, setShowAddNewsModal] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsArticle | null>(null);
  const [showDeleteNewsConfirm, setShowDeleteNewsConfirm] = useState<string | null>(null);
  const [newNews, setNewNews] = useState<Partial<NewsArticle>>({
    title: '',
    summary: '',
    content: '',
    author: '',
    publishDate: new Date().toISOString().split('T')[0],
    category: 'Noticias',
    imageUrl: '',
    readTime: 5,
    featured: false,
    externalUrl: ''
  });

  useEffect(() => {
    setCyclists(loadCyclists());
    setBrands(loadBrands());
    setCollaborators(loadCollaborators());
    setNews(loadNews());
    setSocialUrls(loadSocialMediaUrls());
  }, []);

  const handleDeleteCyclist = (cyclistId: string) => {
    removeCyclist(cyclistId);
    setCyclists(loadCyclists());
    setShowDeleteConfirm(null);
  };

  const handleUpdateCyclist = (cyclist: Cyclist) => {
    updateCyclist(cyclist);
    setCyclists(loadCyclists());
    setEditingCyclist(null);
  };

  const handleUpdatePass = (pass: MountainPass) => {
    onUpdatePass(pass);
    setEditingPass(null);
  };

  const handleAddPort = () => {
    if (!newPort.name || !newPort.country || !newPort.region) {
      alert('Por favor completa al menos el nombre, país y región');
      return;
    }

    const portToAdd: MountainPass = {
      id: editingPort ? editingPort.id : `port-${Date.now()}`,
      name: newPort.name!,
      country: newPort.country!,
      region: newPort.region!,
      maxAltitude: newPort.maxAltitude || 0,
      elevationGain: newPort.elevationGain || 0,
      averageGradient: newPort.averageGradient || 0,
      maxGradient: newPort.maxGradient || 0,
      distance: newPort.distance || 0,
      difficulty: newPort.difficulty as any || 'Cuarta',
      coordinates: newPort.coordinates || { lat: 0, lng: 0 },
      description: newPort.description || '',
      famousWinners: newPort.famousWinners || [],
      imageUrl: newPort.imageUrl || 'https://images.pexels.com/photos/1666021/pexels-photo-1666021.jpeg',
      category: newPort.category || 'Otros'
    };

    onUpdatePass(portToAdd);
    setShowAddPortModal(false);
    setEditingPort(null);
    setNewPort({
      name: '',
      country: '',
      region: '',
      maxAltitude: 0,
      elevationGain: 0,
      averageGradient: 0,
      maxGradient: 0,
      distance: 0,
      difficulty: 'Cuarta',
      coordinates: { lat: 0, lng: 0 },
      description: '',
      imageUrl: '',
      category: 'Otros',
      famousWinners: []
    });
  };

  const handleDeletePort = (portId: string) => {
    // In a real app, you would call a delete function
    // For now, we'll just show an alert
    alert('Funcionalidad de eliminación disponible próximamente');
    setShowDeletePortConfirm(null);
  };

  // Brand management functions
  const handleAddBrand = () => {
    if (!newBrand.name || !newBrand.category || !newBrand.description) {
      alert('Por favor completa al menos el nombre, categoría y descripción');
      return;
    }

    const brandToAdd: Brand = {
      id: editingBrand ? editingBrand.id : `brand-${Date.now()}`,
      name: newBrand.name!,
      category: newBrand.category as any,
      description: newBrand.description!,
      logo: newBrand.logo,
      website: newBrand.website,
      country: newBrand.country,
      foundedYear: newBrand.foundedYear,
      specialties: newBrand.specialties || [],
      isActive: newBrand.isActive !== undefined ? newBrand.isActive : true,
      featured: newBrand.featured !== undefined ? newBrand.featured : false
    };

    const updatedBrands = editingBrand 
      ? brands.map(b => b.id === editingBrand.id ? brandToAdd : b)
      : [...brands, brandToAdd];
    
    setBrands(updatedBrands);
    saveBrands(updatedBrands);
    setShowAddBrandModal(false);
    setEditingBrand(null);
    setNewBrand({
      name: '',
      category: 'Bicicletas',
      description: '',
      logo: '',
      website: '',
      country: '',
      foundedYear: undefined,
      specialties: [],
      isActive: true,
      featured: false
    });
  };

  const handleDeleteBrand = (brandId: string) => {
    const updatedBrands = brands.filter(b => b.id !== brandId);
    setBrands(updatedBrands);
    saveBrands(updatedBrands);
    setShowDeleteBrandConfirm(null);
  };

  // Collaborator management functions
  const handleAddCollaborator = () => {
    if (!newCollaborator.name || !newCollaborator.category || !newCollaborator.description) {
      alert('Por favor completa al menos el nombre, categoría y descripción');
      return;
    }

    const collaboratorToAdd: Collaborator = {
      id: editingCollaborator ? editingCollaborator.id : `collaborator-${Date.now()}`,
      name: newCollaborator.name!,
      category: newCollaborator.category as any,
      description: newCollaborator.description!,
      contactInfo: newCollaborator.contactInfo || {
        email: '',
        phone: '',
        website: '',
        address: ''
      },
      images: newCollaborator.images || [],
      isActive: newCollaborator.isActive !== undefined ? newCollaborator.isActive : true,
      featured: newCollaborator.featured !== undefined ? newCollaborator.featured : false
    };

    const updatedCollaborators = editingCollaborator 
      ? collaborators.map(c => c.id === editingCollaborator.id ? collaboratorToAdd : c)
      : [...collaborators, collaboratorToAdd];
    
    setCollaborators(updatedCollaborators);
    saveCollaborators(updatedCollaborators);
    setShowAddCollaboratorModal(false);
    setEditingCollaborator(null);
    setNewCollaborator({
      name: '',
      category: 'Tienda de Bicicletas',
      description: '',
      contactInfo: {
        email: '',
        phone: '',
        website: '',
        address: ''
      },
      images: [],
      isActive: true,
      featured: false
    });
  };

  const handleDeleteCollaborator = (collaboratorId: string) => {
    const updatedCollaborators = collaborators.filter(c => c.id !== collaboratorId);
    setCollaborators(updatedCollaborators);
    saveCollaborators(updatedCollaborators);
    setShowDeleteCollaboratorConfirm(null);
  };

  // News management functions
  const handleAddNews = () => {
    if (!newNews.title || !newNews.summary || !newNews.author) {
      alert('Por favor completa al menos el título, resumen y autor');
      return;
    }

    const newsToAdd: NewsArticle = {
      id: editingNews ? editingNews.id : `news-${Date.now()}`,
      title: newNews.title!,
      summary: newNews.summary!,
      content: newNews.content || newNews.summary!,
      author: newNews.author!,
      publishDate: newNews.publishDate || new Date().toISOString().split('T')[0],
      category: newNews.category as any || 'Noticias',
      imageUrl: newNews.imageUrl || 'https://images.pexels.com/photos/1666021/pexels-photo-1666021.jpeg',
      readTime: newNews.readTime || 5,
      featured: newNews.featured !== undefined ? newNews.featured : false,
      externalUrl: newNews.externalUrl
    };

    const updatedNews = editingNews 
      ? news.map(n => n.id === editingNews.id ? newsToAdd : n)
      : [newsToAdd, ...news]; // Añadir al principio
    
    setNews(updatedNews);
    saveNews(updatedNews);
    setShowAddNewsModal(false);
    setEditingNews(null);
    setNewNews({
      title: '',
      summary: '',
      content: '',
      author: '',
      publishDate: new Date().toISOString().split('T')[0],
      category: 'Noticias',
      imageUrl: '',
      readTime: 5,
      featured: false,
      externalUrl: ''
    });
  };

  const handleDeleteNews = (newsId: string) => {
    const updatedNews = news.filter(n => n.id !== newsId);
    setNews(updatedNews);
    saveNews(updatedNews);
    setShowDeleteNewsConfirm(null);
  };
  const handleImportPorts = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csv = e.target?.result as string;
        const lines = csv.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        
        let importedCount = 0;
        
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;
          
          const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
          
          if (values.length >= headers.length) {
            const port: MountainPass = {
              id: values[0] || `imported-${Date.now()}-${i}`,
              name: values[1] || `Puerto ${i}`,
              country: values[2] || 'España',
              region: values[3] || 'Región',
              maxAltitude: parseInt(values[4]) || 1000,
              elevationGain: parseInt(values[5]) || 500,
              averageGradient: parseFloat(values[6]) || 7.0,
              maxGradient: parseFloat(values[7]) || 12.0,
              distance: parseFloat(values[8]) || 10.0,
              difficulty: (values[9] as any) || 'Segunda',
              coordinates: {
                lat: parseFloat(values[10]) || 40.0,
                lng: parseFloat(values[11]) || -3.0
              },
              description: values[12] || 'Puerto importado desde CSV',
              imageUrl: values[13] || 'https://images.pexels.com/photos/1666021/pexels-photo-1666021.jpeg',
              category: values[14] || 'Otros',
              famousWinners: []
            };
            
            onUpdatePass(port);
            importedCount++;
          }
        }
        
        alert(`Se importaron ${importedCount} puertos exitosamente`);
      } catch (error) {
        alert('Error al importar el archivo CSV. Verifica el formato.');
      }
    };
    
    reader.readAsText(file);
    event.target.value = ''; // Reset file input
  };

  const handleEditPort = (port: MountainPass) => {
    setEditingPort(port);
    setNewPort({
      name: port.name,
      country: port.country,
      region: port.region,
      maxAltitude: port.maxAltitude,
      elevationGain: port.elevationGain,
      averageGradient: port.averageGradient,
      maxGradient: port.maxGradient,
      distance: port.distance,
      difficulty: port.difficulty,
      coordinates: port.coordinates,
      description: port.description,
      imageUrl: port.imageUrl,
      category: port.category,
      famousWinners: port.famousWinners
    });
    setShowAddPortModal(true);
  };

  const handleSaveSocialUrls = () => {
    saveSocialMediaUrls(socialUrls);
    // Trigger a custom event to notify Footer component
    window.dispatchEvent(new CustomEvent('socialMediaUpdated'));
    alert('URLs de redes sociales actualizadas correctamente');
  };

  const adminTabs = [
    { key: 'cyclists', icon: Users, label: 'Ciclistas', count: cyclists.length },
    { key: 'passes', icon: Mountain, label: 'Puertos', count: passes.length },
    { key: 'brands', icon: Tag, label: 'Marcas', count: brands.length },
    { key: 'collaborators', icon: UserCheck, label: 'Colaboradores', count: collaborators.length },
    { key: 'news', icon: Newspaper, label: 'Noticias', count: news.length },
    { key: 'social', icon: Globe, label: 'Redes Sociales', count: 0 }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Settings className="h-8 w-8 text-orange-500 mr-3" />
            <div>
              <h2 className="text-2xl font-bold text-slate-800">{t.adminPanel}</h2>
              <p className="text-slate-600">Gestiona todos los aspectos de la plataforma</p>
            </div>
          </div>
        </div>

        {/* Admin Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="border-b border-slate-200">
            <nav className="flex space-x-8 px-6">
              {adminTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.key
                        ? 'border-orange-500 text-orange-600'
                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                    {tab.count > 0 && (
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        activeTab === tab.key
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {/* Cyclists Tab */}
            {activeTab === 'cyclists' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-slate-800">{t.registeredCyclists}</h3>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-slate-600">
                      {cyclists.length} {t.totalCyclists}
                    </span>
                    <button
                      onClick={() => exportCyclists(cyclists)}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      <span>Exportar CSV</span>
                    </button>
                  </div>
                </div>

                {cyclists.length === 0 ? (
                  <p className="text-slate-500 text-center py-8">{t.noCyclists}</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-200">
                          <th className="text-left py-3 px-4 font-medium text-slate-700">Nombre</th>
                          <th className="text-left py-3 px-4 font-medium text-slate-700">Email</th>
                          <th className="text-left py-3 px-4 font-medium text-slate-700">Teléfono</th>
                          <th className="text-left py-3 px-4 font-medium text-slate-700">Bicicletas</th>
                          <th className="text-left py-3 px-4 font-medium text-slate-700">Admin</th>
                          <th className="text-left py-3 px-4 font-medium text-slate-700">{t.actions}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cyclists.map((cyclist) => (
                          <tr key={cyclist.id} className="border-b border-slate-100 hover:bg-slate-50">
                            <td className="py-3 px-4">
                              <div>
                                <p className="font-medium text-slate-800">{cyclist.name}</p>
                                {cyclist.alias && (
                                  <p className="text-sm text-slate-500">"{cyclist.alias}"</p>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-slate-600">{cyclist.email}</td>
                            <td className="py-3 px-4 text-slate-600">{cyclist.phone}</td>
                            <td className="py-3 px-4 text-slate-600">{cyclist.bikes.length}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                cyclist.isAdmin 
                                  ? 'bg-red-100 text-red-800' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {cyclist.isAdmin ? 'Admin' : 'Usuario'}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => setEditingCyclist(cyclist)}
                                  className="text-blue-600 hover:text-blue-800 transition-colors"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => setShowDeleteConfirm(cyclist.id)}
                                  className="text-red-600 hover:text-red-800 transition-colors"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Social Media Tab */}
            {activeTab === 'social' && (
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">Gestión de Redes Sociales</h3>
                  <p className="text-slate-600">Configura las URLs de las redes sociales que aparecerán en el footer</p>
                </div>

                <div className="space-y-6">
                  {/* Instagram */}
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-3 w-32">
                      <Instagram className="h-6 w-6 text-pink-500" />
                      <span className="font-medium text-slate-700">Instagram</span>
                    </div>
                    <input
                      type="url"
                      value={socialUrls.instagram}
                      onChange={(e) => setSocialUrls({ ...socialUrls, instagram: e.target.value })}
                      className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="https://instagram.com/cyclepeaks"
                    />
                  </div>

                  {/* Facebook */}
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-3 w-32">
                      <Facebook className="h-6 w-6 text-blue-600" />
                      <span className="font-medium text-slate-700">Facebook</span>
                    </div>
                    <input
                      type="url"
                      value={socialUrls.facebook}
                      onChange={(e) => setSocialUrls({ ...socialUrls, facebook: e.target.value })}
                      className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="https://facebook.com/cyclepeaks"
                    />
                  </div>

                  {/* YouTube */}
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-3 w-32">
                      <Youtube className="h-6 w-6 text-red-600" />
                      <span className="font-medium text-slate-700">YouTube</span>
                    </div>
                    <input
                      type="url"
                      value={socialUrls.youtube}
                      onChange={(e) => setSocialUrls({ ...socialUrls, youtube: e.target.value })}
                      className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="https://youtube.com/@cyclepeaks"
                    />
                  </div>

                  {/* LinkedIn */}
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-3 w-32">
                      <Linkedin className="h-6 w-6 text-blue-700" />
                      <span className="font-medium text-slate-700">LinkedIn</span>
                    </div>
                    <input
                      type="url"
                      value={socialUrls.linkedin}
                      onChange={(e) => setSocialUrls({ ...socialUrls, linkedin: e.target.value })}
                      className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="https://linkedin.com/company/cyclepeaks"
                    />
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end pt-6 border-t border-slate-200">
                    <button
                      onClick={handleSaveSocialUrls}
                      className="flex items-center space-x-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      <Save className="h-4 w-4" />
                      <span>Guardar URLs</span>
                    </button>
                  </div>

                  {/* Preview Section */}
                  <div className="bg-slate-50 rounded-lg p-6 border-t border-slate-200">
                    <h4 className="text-md font-semibold text-slate-800 mb-4">Vista Previa</h4>
                    <div className="flex space-x-4">
                      <a 
                        href={socialUrls.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-600 hover:text-pink-500 transition-colors"
                      >
                        <Instagram className="h-6 w-6" />
                      </a>
                      <a 
                        href={socialUrls.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-600 hover:text-blue-600 transition-colors"
                      >
                        <Facebook className="h-6 w-6" />
                      </a>
                      <a 
                        href={socialUrls.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-600 hover:text-red-600 transition-colors"
                      >
                        <Youtube className="h-6 w-6" />
                      </a>
                      <a 
                        href={socialUrls.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-600 hover:text-blue-700 transition-colors"
                      >
                        <Linkedin className="h-6 w-6" />
                      </a>
                    </div>
                    <p className="text-sm text-slate-500 mt-2">
                      Así aparecerán los iconos en el footer de la página
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Other existing tabs would go here */}
            {activeTab === 'passes' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-slate-800">Gestión de Puertos</h3>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-slate-600">
                      {passes.length} puertos totales
                    </span>
                    <button
                      onClick={() => setShowAddPortModal(true)}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Añadir Puerto</span>
                    </button>
                    <div className="relative">
                      <input
                        type="file"
                        accept=".csv"
                        onChange={handleImportPorts}
                        className="hidden"
                        id="import-ports"
                      />
                      <label
                        htmlFor="import-ports"
                        className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors cursor-pointer"
                      >
                        <Upload className="h-4 w-4" />
                        <span>Importar CSV</span>
                      </label>
                    </div>
                    <button
                      onClick={() => exportMountainPasses(passes)}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      <span>Exportar CSV</span>
                    </button>
                  </div>
                </div>
                
                {/* Ports Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-3 px-4 font-medium text-slate-700">Nombre</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-700">País</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-700">Región</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-700">Altitud</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-700">Dificultad</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-700">Categoría</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-700">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {passes.map((pass) => (
                        <tr key={pass.id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium text-slate-800">{pass.name}</p>
                              <p className="text-sm text-slate-500">{pass.distance}km, {pass.averageGradient}%</p>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-slate-600">{pass.country}</td>
                          <td className="py-3 px-4 text-slate-600">{pass.region}</td>
                          <td className="py-3 px-4 text-slate-600">{pass.maxAltitude}m</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              pass.difficulty === 'Especial' ? 'bg-red-100 text-red-800' :
                              pass.difficulty === 'Primera' ? 'bg-orange-100 text-orange-800' :
                              pass.difficulty === 'Segunda' ? 'bg-yellow-100 text-yellow-800' :
                              pass.difficulty === 'Tercera' ? 'bg-blue-100 text-blue-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {pass.difficulty}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-600">{pass.category}</td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => {
                                  setEditingPort(pass);
                                  setShowAddPortModal(true);
                                }}
                                className="text-blue-600 hover:text-blue-800 transition-colors"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => setShowDeletePortConfirm(pass.id)}
                                className="text-red-600 hover:text-red-800 transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'brands' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-slate-800">Gestión de Marcas</h3>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-slate-600">
                      {brands.length} marcas totales
                    </span>
                    <button
                      onClick={() => setShowAddBrandModal(true)}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Añadir Marca</span>
                    </button>
                    <button
                      onClick={() => exportBrands(brands)}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      <span>Exportar CSV</span>
                    </button>
                  </div>
                </div>
                
                {/* Brands Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-3 px-4 font-medium text-slate-700">Marca</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-700">Categoría</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-700">País</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-700">Fundada</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-700">Estado</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-700">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {brands.map((brand) => (
                        <tr key={brand.id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-3">
                              {brand.logo && (
                                <img 
                                  src={brand.logo} 
                                  alt={`${brand.name} logo`}
                                  className="w-8 h-8 object-contain rounded"
                                />
                              )}
                              <div>
                                <p className="font-medium text-slate-800">{brand.name}</p>
                                <p className="text-sm text-slate-500 line-clamp-1">{brand.description}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-slate-600">{brand.category}</td>
                          <td className="py-3 px-4 text-slate-600">{brand.country || '-'}</td>
                          <td className="py-3 px-4 text-slate-600">{brand.foundedYear || '-'}</td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                brand.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {brand.isActive ? 'Activa' : 'Inactiva'}
                              </span>
                              {brand.featured && (
                                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                                  Destacada
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => {
                                  setEditingBrand(brand);
                                  setNewBrand({
                                    name: brand.name,
                                    category: brand.category,
                                    description: brand.description,
                                    logo: brand.logo,
                                    website: brand.website,
                                    country: brand.country,
                                    foundedYear: brand.foundedYear,
                                    specialties: brand.specialties,
                                    isActive: brand.isActive,
                                    featured: brand.featured
                                  });
                                  setShowAddBrandModal(true);
                                }}
                                className="text-blue-600 hover:text-blue-800 transition-colors"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => setShowDeleteBrandConfirm(brand.id)}
                                className="text-red-600 hover:text-red-800 transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {brands.length === 0 && (
                  <div className="text-center py-12">
                    <Tag className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-xl text-slate-600 mb-2">No hay marcas registradas</p>
                    <p className="text-slate-500">Añade la primera marca para comenzar</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'collaborators' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-slate-800">Gestión de Colaboradores</h3>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-slate-600">
                      {collaborators.length} colaboradores totales
                    </span>
                    <button
                      onClick={() => setShowAddCollaboratorModal(true)}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Añadir Colaborador</span>
                    </button>
                    <button
                      onClick={() => exportCollaborators(collaborators)}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      <span>Exportar CSV</span>
                    </button>
                  </div>
                </div>
                
                {/* Collaborators Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-3 px-4 font-medium text-slate-700">Colaborador</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-700">Categoría</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-700">Contacto</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-700">Estado</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-700">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {collaborators.map((collaborator) => (
                        <tr key={collaborator.id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-3">
                              {collaborator.images.length > 0 && (
                                <img 
                                  src={collaborator.images[0]} 
                                  alt={collaborator.name}
                                  className="w-8 h-8 object-cover rounded"
                                />
                              )}
                              <div>
                                <p className="font-medium text-slate-800">{collaborator.name}</p>
                                <p className="text-sm text-slate-500 line-clamp-1">{collaborator.description}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-slate-600">{collaborator.category}</td>
                          <td className="py-3 px-4">
                            <div className="text-sm text-slate-600">
                              {collaborator.contactInfo.email && (
                                <p>{collaborator.contactInfo.email}</p>
                              )}
                              {collaborator.contactInfo.phone && (
                                <p>{collaborator.contactInfo.phone}</p>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                collaborator.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {collaborator.isActive ? 'Activo' : 'Inactivo'}
                              </span>
                              {collaborator.featured && (
                                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                                  Destacado
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => {
                                  setEditingCollaborator(collaborator);
                                  setNewCollaborator({
                                    name: collaborator.name,
                                    category: collaborator.category,
                                    description: collaborator.description,
                                    contactInfo: collaborator.contactInfo,
                                    images: collaborator.images,
                                    isActive: collaborator.isActive,
                                    featured: collaborator.featured
                                  });
                                  setShowAddCollaboratorModal(true);
                                }}
                                className="text-blue-600 hover:text-blue-800 transition-colors"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => setShowDeleteCollaboratorConfirm(collaborator.id)}
                                className="text-red-600 hover:text-red-800 transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {collaborators.length === 0 && (
                  <div className="text-center py-12">
                    <UserCheck className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-xl text-slate-600 mb-2">No hay colaboradores registrados</p>
                    <p className="text-slate-500">Añade el primer colaborador para comenzar</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'news' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-slate-800">Gestión de Noticias</h3>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-slate-600">
                      {news.length} noticias totales
                    </span>
                    <button
                      onClick={() => setShowAddNewsModal(true)}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Añadir Noticia</span>
                    </button>
                    <button
                      onClick={() => exportNews(news)}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      <span>Exportar CSV</span>
                    </button>
                  </div>
                </div>
                
                {/* News Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-3 px-4 font-medium text-slate-700">Noticia</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-700">Autor</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-700">Categoría</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-700">Fecha</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-700">Estado</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-700">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {news.map((article) => (
                        <tr key={article.id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-3">
                              <img 
                                src={article.imageUrl} 
                                alt={article.title}
                                className="w-8 h-8 object-cover rounded"
                              />
                              <div>
                                <p className="font-medium text-slate-800 line-clamp-1">{article.title}</p>
                                <p className="text-sm text-slate-500 line-clamp-1">{article.summary}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-slate-600">{article.author}</td>
                          <td className="py-3 px-4 text-slate-600">{article.category}</td>
                          <td className="py-3 px-4 text-slate-600">
                            {new Date(article.publishDate).toLocaleDateString('es-ES')}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                {article.readTime} min
                              </span>
                              {article.featured && (
                                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                                  Destacada
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => {
                                  setEditingNews(article);
                                  setNewNews({
                                    title: article.title,
                                    summary: article.summary,
                                    content: article.content,
                                    author: article.author,
                                    publishDate: article.publishDate,
                                    category: article.category,
                                    imageUrl: article.imageUrl,
                                    readTime: article.readTime,
                                    featured: article.featured,
                                    externalUrl: article.externalUrl
                                  });
                                  setShowAddNewsModal(true);
                                }}
                                className="text-blue-600 hover:text-blue-800 transition-colors"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => setShowDeleteNewsConfirm(article.id)}
                                className="text-red-600 hover:text-red-800 transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {news.length === 0 && (
                  <div className="text-center py-12">
                    <Newspaper className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-xl text-slate-600 mb-2">No hay noticias registradas</p>
                    <p className="text-slate-500">Añade la primera noticia para comenzar</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Edit Cyclist Modal */}
        {editingCyclist && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-800">{t.editCyclist}</h3>
                <button
                  onClick={() => setEditingCyclist(null)}
                  className="text-slate-500 hover:text-slate-700 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      {t.name}
                    </label>
                    <input
                      type="text"
                      value={editingCyclist.name}
                      onChange={(e) => setEditingCyclist({ ...editingCyclist, name: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={editingCyclist.email}
                      onChange={(e) => setEditingCyclist({ ...editingCyclist, email: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      {t.phone}
                    </label>
                    <input
                      type="tel"
                      value={editingCyclist.phone}
                      onChange={(e) => setEditingCyclist({ ...editingCyclist, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isAdmin"
                      checked={editingCyclist.isAdmin || false}
                      onChange={(e) => setEditingCyclist({ ...editingCyclist, isAdmin: e.target.checked })}
                      className="rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                    />
                    <label htmlFor="isAdmin" className="text-sm font-medium text-slate-700">
                      {t.adminRole}
                    </label>
                  </div>
                  <p className="text-xs text-slate-500">{t.adminRoleDescription}</p>
                </div>
                
                <div className="flex justify-end space-x-3 pt-6 border-t mt-6">
                  <button
                    onClick={() => setEditingCyclist(null)}
                    className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    {t.cancel}
                  </button>
                  <button
                    onClick={() => handleUpdateCyclist(editingCyclist)}
                    className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    <Save className="h-4 w-4" />
                    <span>{t.saveChanges}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                {t.confirmDeleteCyclist}
              </h3>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  {t.cancel}
                </button>
                <button
                  onClick={() => handleDeleteCyclist(showDeleteConfirm)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Port Modal */}
        {showAddPortModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-800">
                  {editingPort ? 'Editar Puerto' : 'Añadir Nuevo Puerto'}
                </h3>
                <button
                  onClick={() => {
                    setShowAddPortModal(false);
                    setEditingPort(null);
                    setNewPort({
                      name: '',
                      country: '',
                      region: '',
                      maxAltitude: 0,
                      elevationGain: 0,
                      averageGradient: 0,
                      maxGradient: 0,
                      distance: 0,
                      difficulty: 'Cuarta',
                      coordinates: { lat: 0, lng: 0 },
                      description: '',
                      imageUrl: '',
                      category: 'Otros',
                      famousWinners: []
                    });
                  }}
                  className="text-slate-500 hover:text-slate-700 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Nombre del Puerto <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newPort.name || ''}
                      onChange={(e) => setNewPort({ ...newPort, name: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="Ej: Col du Galibier"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      País <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newPort.country || ''}
                      onChange={(e) => setNewPort({ ...newPort, country: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="Ej: Francia"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Región <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newPort.region || ''}
                      onChange={(e) => setNewPort({ ...newPort, region: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="Ej: Alpes"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Categoría</label>
                    <select
                      value={newPort.category || 'Otros'}
                      onChange={(e) => setNewPort({ ...newPort, category: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="Alpes">Alpes</option>
                      <option value="Pirineos">Pirineos</option>
                      <option value="Dolomitas">Dolomitas</option>
                      <option value="Andes">Andes</option>
                      <option value="Provenza">Provenza</option>
                      <option value="Otros">Otros</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Altitud Máxima (m)</label>
                    <input
                      type="number"
                      value={newPort.maxAltitude || ''}
                      onChange={(e) => setNewPort({ ...newPort, maxAltitude: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="Ej: 2645"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Desnivel (m)</label>
                    <input
                      type="number"
                      value={newPort.elevationGain || ''}
                      onChange={(e) => setNewPort({ ...newPort, elevationGain: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="Ej: 1200"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Distancia (km)</label>
                    <input
                      type="number"
                      value={newPort.distance || ''}
                      onChange={(e) => setNewPort({ ...newPort, distance: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="Ej: 18.1"
                      step="0.1"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Pendiente Media (%)</label>
                    <input
                      type="number"
                      value={newPort.averageGradient || ''}
                      onChange={(e) => setNewPort({ ...newPort, averageGradient: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="Ej: 6.9"
                      step="0.1"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Pendiente Máxima (%)</label>
                    <input
                      type="number"
                      value={newPort.maxGradient || ''}
                      onChange={(e) => setNewPort({ ...newPort, maxGradient: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="Ej: 13.0"
                      step="0.1"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Dificultad UCI</label>
                    <select
                      value={newPort.difficulty || 'Cuarta'}
                      onChange={(e) => setNewPort({ ...newPort, difficulty: e.target.value as any })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="Cuarta">4ª Categoría</option>
                      <option value="Tercera">3ª Categoría</option>
                      <option value="Segunda">2ª Categoría</option>
                      <option value="Primera">1ª Categoría</option>
                      <option value="Especial">Categoría Especial</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Latitud</label>
                    <input
                      type="number"
                      value={newPort.coordinates?.lat || ''}
                      onChange={(e) => setNewPort({ 
                        ...newPort, 
                        coordinates: { 
                          ...newPort.coordinates, 
                          lat: parseFloat(e.target.value) || 0 
                        } 
                      })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="Ej: 45.0914"
                      step="0.000001"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Longitud</label>
                    <input
                      type="number"
                      value={newPort.coordinates?.lng || ''}
                      onChange={(e) => setNewPort({ 
                        ...newPort, 
                        coordinates: { 
                          ...newPort.coordinates, 
                          lng: parseFloat(e.target.value) || 0 
                        } 
                      })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="Ej: 6.0669"
                      step="0.000001"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">URL de Imagen</label>
                  <input
                    type="url"
                    value={newPort.imageUrl || ''}
                    onChange={(e) => setNewPort({ ...newPort, imageUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="https://images.pexels.com/..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
                  <textarea
                    value={newPort.description || ''}
                    onChange={(e) => setNewPort({ ...newPort, description: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    rows={3}
                    placeholder="Descripción del puerto de montaña..."
                  />
                </div>
                
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    onClick={() => {
                      setShowAddPortModal(false);
                      setEditingPort(null);
                    }}
                    className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleAddPort}
                    className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    <Save className="h-4 w-4" />
                    <span>{editingPort ? 'Actualizar Puerto' : 'Añadir Puerto'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Port Confirmation Modal */}
        {showDeletePortConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                ¿Estás seguro de que quieres eliminar este puerto?
              </h3>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeletePortConfirm(null)}
                  className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleDeletePort(showDeletePortConfirm)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};