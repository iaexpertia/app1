import React, { useState, useEffect } from 'react';
import { Users, Mountain, Tag, UserCheck, Newspaper, Download, UserPlus, Plus, Edit, Trash2, X, Save } from 'lucide-react';
import { MountainPass, Cyclist, Brand, Collaborator, NewsArticle } from '../types';
import { exportCyclists, exportMountainPasses, exportBrands, exportCollaborators, exportNews } from '../utils/excelExport';
import { 
  loadCyclists, 
  addCyclist, 
  removeCyclist, 
  updateCyclist,
  saveCyclists 
} from '../utils/cyclistStorage';
import { 
  loadBrands, 
  addBrand, 
  removeBrand, 
  updateBrand,
  saveBrands,
  loadBrandCategories 
} from '../utils/brandsStorage';
import { 
  loadCollaborators, 
  addCollaborator, 
  removeCollaborator, 
  updateCollaborator,
  saveCollaborators,
  loadCategories as loadCollaboratorCategories 
} from '../utils/collaboratorStorage';
import { 
  loadNews, 
  addNews, 
  removeNews, 
  updateNews,
  saveNews 
} from '../utils/newsStorage';

interface AdminPanelProps {
  passes: MountainPass[];
  onUpdatePass: (pass: MountainPass) => void;
  t: (key: string) => string;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ passes, onUpdatePass, t }) => {
  const [activeTab, setActiveTab] = useState('cyclists');
  
  // Data states
  const [cyclists, setCyclists] = useState<Cyclist[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);
  
  // Modal states
  const [showCyclistModal, setShowCyclistModal] = useState(false);
  const [showPassModal, setShowPassModal] = useState(false);
  const [showBrandModal, setShowBrandModal] = useState(false);
  const [showCollaboratorModal, setShowCollaboratorModal] = useState(false);
  const [showNewsModal, setShowNewsModal] = useState(false);
  
  // Edit states
  const [editingCyclist, setEditingCyclist] = useState<Cyclist | null>(null);
  const [editingPass, setEditingPass] = useState<MountainPass | null>(null);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [editingCollaborator, setEditingCollaborator] = useState<Collaborator | null>(null);
  const [editingNews, setEditingNews] = useState<NewsArticle | null>(null);

  // Form states
  const [cyclistForm, setCyclistForm] = useState({
    name: '', alias: '', email: '', phone: '', age: '', weight: '', isAdmin: false
  });
  
  const [passForm, setPassForm] = useState({
    name: '', country: '', region: '', maxAltitude: 0, elevationGain: 0,
    averageGradient: 0, maxGradient: 0, distance: 0, difficulty: 'Cuarta',
    description: '', imageUrl: '', category: 'Otros'
  });
  
  const [brandForm, setBrandForm] = useState({
    name: '', category: 'Bicicletas', description: '', logo: '', website: '',
    country: '', foundedYear: '', specialties: '', featured: false
  });
  
  const [collaboratorForm, setCollaboratorForm] = useState({
    name: '', category: 'Tienda de Bicicletas', description: '', email: '',
    phone: '', website: '', address: '', images: '', featured: false
  });
  
  const [newsForm, setNewsForm] = useState({
    title: '', summary: '', content: '', author: '', category: 'Noticias',
    imageUrl: '', readTime: 5, featured: false, externalUrl: ''
  });

  // Load data on component mount
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = () => {
    setCyclists(loadCyclists());
    setBrands(loadBrands());
    setCollaborators(loadCollaborators());
    setNews(loadNews());
  };

  // Export handlers
  const handleExportCyclists = () => {
    exportCyclists(cyclists);
  };

  const handleExportPasses = () => {
    exportMountainPasses(passes);
  };

  const handleExportBrands = () => {
    exportBrands(brands);
  };

  const handleExportCollaborators = () => {
    exportCollaborators(collaborators);
  };

  const handleExportNews = () => {
    exportNews(news);
  };

  // Cyclist handlers
  const handleCreateCyclist = () => {
    const newCyclist: Cyclist = {
      id: Date.now().toString(),
      name: cyclistForm.name,
      alias: cyclistForm.alias || undefined,
      email: cyclistForm.email,
      phone: cyclistForm.phone,
      age: cyclistForm.age ? parseInt(cyclistForm.age) : undefined,
      weight: cyclistForm.weight ? parseFloat(cyclistForm.weight) : undefined,
      bikes: [],
      registrationDate: new Date().toISOString().split('T')[0],
      isAdmin: cyclistForm.isAdmin
    };
    
    addCyclist(newCyclist);
    setCyclists(loadCyclists());
    setShowCyclistModal(false);
    resetCyclistForm();
  };

  const handleEditCyclist = (cyclist: Cyclist) => {
    setEditingCyclist(cyclist);
    setCyclistForm({
      name: cyclist.name,
      alias: cyclist.alias || '',
      email: cyclist.email,
      phone: cyclist.phone,
      age: cyclist.age?.toString() || '',
      weight: cyclist.weight?.toString() || '',
      isAdmin: cyclist.isAdmin || false
    });
    setShowCyclistModal(true);
  };

  const handleUpdateCyclist = () => {
    if (!editingCyclist) return;
    
    const updatedCyclist: Cyclist = {
      ...editingCyclist,
      name: cyclistForm.name,
      alias: cyclistForm.alias || undefined,
      email: cyclistForm.email,
      phone: cyclistForm.phone,
      age: cyclistForm.age ? parseInt(cyclistForm.age) : undefined,
      weight: cyclistForm.weight ? parseFloat(cyclistForm.weight) : undefined,
      isAdmin: cyclistForm.isAdmin
    };
    
    updateCyclist(updatedCyclist);
    setCyclists(loadCyclists());
    setShowCyclistModal(false);
    setEditingCyclist(null);
    resetCyclistForm();
  };

  const handleDeleteCyclist = (cyclistId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este ciclista?')) {
      removeCyclist(cyclistId);
      setCyclists(loadCyclists());
    }
  };

  const resetCyclistForm = () => {
    setCyclistForm({
      name: '', alias: '', email: '', phone: '', age: '', weight: '', isAdmin: false
    });
  };

  // Brand handlers
  const handleCreateBrand = () => {
    const newBrand: Brand = {
      id: Date.now().toString(),
      name: brandForm.name,
      category: brandForm.category as any,
      description: brandForm.description,
      logo: brandForm.logo || undefined,
      website: brandForm.website || undefined,
      country: brandForm.country || undefined,
      foundedYear: brandForm.foundedYear ? parseInt(brandForm.foundedYear) : undefined,
      specialties: brandForm.specialties ? brandForm.specialties.split(',').map(s => s.trim()) : [],
      isActive: true,
      featured: brandForm.featured
    };
    
    addBrand(newBrand);
    setBrands(loadBrands());
    setShowBrandModal(false);
    resetBrandForm();
  };

  const handleEditBrand = (brand: Brand) => {
    setEditingBrand(brand);
    setBrandForm({
      name: brand.name,
      category: brand.category,
      description: brand.description,
      logo: brand.logo || '',
      website: brand.website || '',
      country: brand.country || '',
      foundedYear: brand.foundedYear?.toString() || '',
      specialties: brand.specialties.join(', '),
      featured: brand.featured
    });
    setShowBrandModal(true);
  };

  const handleUpdateBrand = () => {
    if (!editingBrand) return;
    
    const updatedBrand: Brand = {
      ...editingBrand,
      name: brandForm.name,
      category: brandForm.category as any,
      description: brandForm.description,
      logo: brandForm.logo || undefined,
      website: brandForm.website || undefined,
      country: brandForm.country || undefined,
      foundedYear: brandForm.foundedYear ? parseInt(brandForm.foundedYear) : undefined,
      specialties: brandForm.specialties ? brandForm.specialties.split(',').map(s => s.trim()) : [],
      featured: brandForm.featured
    };
    
    updateBrand(updatedBrand);
    setBrands(loadBrands());
    setShowBrandModal(false);
    setEditingBrand(null);
    resetBrandForm();
  };

  const handleDeleteBrand = (brandId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta marca?')) {
      removeBrand(brandId);
      setBrands(loadBrands());
    }
  };

  const resetBrandForm = () => {
    setBrandForm({
      name: '', category: 'Bicicletas', description: '', logo: '', website: '',
      country: '', foundedYear: '', specialties: '', featured: false
    });
  };

  // Collaborator handlers
  const handleCreateCollaborator = () => {
    const newCollaborator: Collaborator = {
      id: Date.now().toString(),
      name: collaboratorForm.name,
      category: collaboratorForm.category as any,
      description: collaboratorForm.description,
      contactInfo: {
        email: collaboratorForm.email || undefined,
        phone: collaboratorForm.phone || undefined,
        website: collaboratorForm.website || undefined,
        address: collaboratorForm.address || undefined
      },
      images: collaboratorForm.images ? collaboratorForm.images.split(',').map(s => s.trim()) : [],
      isActive: true,
      featured: collaboratorForm.featured
    };
    
    addCollaborator(newCollaborator);
    setCollaborators(loadCollaborators());
    setShowCollaboratorModal(false);
    resetCollaboratorForm();
  };

  const handleEditCollaborator = (collaborator: Collaborator) => {
    setEditingCollaborator(collaborator);
    setCollaboratorForm({
      name: collaborator.name,
      category: collaborator.category,
      description: collaborator.description,
      email: collaborator.contactInfo.email || '',
      phone: collaborator.contactInfo.phone || '',
      website: collaborator.contactInfo.website || '',
      address: collaborator.contactInfo.address || '',
      images: collaborator.images.join(', '),
      featured: collaborator.featured
    });
    setShowCollaboratorModal(true);
  };

  const handleUpdateCollaborator = () => {
    if (!editingCollaborator) return;
    
    const updatedCollaborator: Collaborator = {
      ...editingCollaborator,
      name: collaboratorForm.name,
      category: collaboratorForm.category as any,
      description: collaboratorForm.description,
      contactInfo: {
        email: collaboratorForm.email || undefined,
        phone: collaboratorForm.phone || undefined,
        website: collaboratorForm.website || undefined,
        address: collaboratorForm.address || undefined
      },
      images: collaboratorForm.images ? collaboratorForm.images.split(',').map(s => s.trim()) : [],
      featured: collaboratorForm.featured
    };
    
    updateCollaborator(updatedCollaborator);
    setCollaborators(loadCollaborators());
    setShowCollaboratorModal(false);
    setEditingCollaborator(null);
    resetCollaboratorForm();
  };

  const handleDeleteCollaborator = (collaboratorId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este colaborador?')) {
      removeCollaborator(collaboratorId);
      setCollaborators(loadCollaborators());
    }
  };

  const resetCollaboratorForm = () => {
    setCollaboratorForm({
      name: '', category: 'Tienda de Bicicletas', description: '', email: '',
      phone: '', website: '', address: '', images: '', featured: false
    });
  };

  // News handlers
  const handleCreateNews = () => {
    const newArticle: NewsArticle = {
      id: Date.now().toString(),
      title: newsForm.title,
      summary: newsForm.summary,
      content: newsForm.content,
      author: newsForm.author,
      publishDate: new Date().toISOString().split('T')[0],
      category: newsForm.category as any,
      imageUrl: newsForm.imageUrl,
      readTime: newsForm.readTime,
      featured: newsForm.featured,
      externalUrl: newsForm.externalUrl || undefined
    };
    
    addNews(newArticle);
    setNews(loadNews());
    setShowNewsModal(false);
    resetNewsForm();
  };

  const handleEditNews = (article: NewsArticle) => {
    setEditingNews(article);
    setNewsForm({
      title: article.title,
      summary: article.summary,
      content: article.content,
      author: article.author,
      category: article.category,
      imageUrl: article.imageUrl,
      readTime: article.readTime,
      featured: article.featured,
      externalUrl: article.externalUrl || ''
    });
    setShowNewsModal(true);
  };

  const handleUpdateNews = () => {
    if (!editingNews) return;
    
    const updatedArticle: NewsArticle = {
      ...editingNews,
      title: newsForm.title,
      summary: newsForm.summary,
      content: newsForm.content,
      author: newsForm.author,
      category: newsForm.category as any,
      imageUrl: newsForm.imageUrl,
      readTime: newsForm.readTime,
      featured: newsForm.featured,
      externalUrl: newsForm.externalUrl || undefined
    };
    
    updateNews(updatedArticle);
    setNews(loadNews());
    setShowNewsModal(false);
    setEditingNews(null);
    resetNewsForm();
  };

  const handleDeleteNews = (articleId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta noticia?')) {
      removeNews(articleId);
      setNews(loadNews());
    }
  };

  const resetNewsForm = () => {
    setNewsForm({
      title: '', summary: '', content: '', author: '', category: 'Noticias',
      imageUrl: '', readTime: 5, featured: false, externalUrl: ''
    });
  };

  const tabs = [
    { id: 'cyclists', label: 'Gestionar Ciclistas', icon: Users },
    { id: 'passes', label: 'Gestionar Puertos', icon: Mountain },
    { id: 'brands', label: 'Gestionar Marcas', icon: Tag },
    { id: 'collaborators', label: 'Gestionar Colaboradores', icon: UserCheck },
    { id: 'news', label: 'Gestionar Noticias', icon: Newspaper },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Panel de Administración</h1>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {activeTab === 'cyclists' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Gestión de Ciclistas</h2>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCyclistModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  Nuevo Ciclista
                </button>
                <button
                  onClick={handleExportCyclists}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Exportar Excel
                </button>
              </div>
            </div>
            
            {/* Cyclists Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {cyclists.map((cyclist) => (
                    <tr key={cyclist.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{cyclist.name}</div>
                          {cyclist.alias && <div className="text-sm text-gray-500">{cyclist.alias}</div>}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cyclist.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cyclist.phone}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          cyclist.isAdmin ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {cyclist.isAdmin ? 'Sí' : 'No'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEditCyclist(cyclist)}
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCyclist(cyclist.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {cyclists.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No hay ciclistas registrados
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'passes' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Gestión de Puertos de Montaña</h2>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowPassModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Mountain className="w-4 h-4" />
                  Nuevo Puerto
                </button>
                <button
                  onClick={handleExportPasses}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Exportar Excel
                </button>
              </div>
            </div>
            
            {/* Passes Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">País</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Altitud</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dificultad</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {passes.map((pass) => (
                    <tr key={pass.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{pass.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{pass.country}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{pass.maxAltitude}m</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {pass.difficulty}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => {
                            setEditingPass(pass);
                            setPassForm({
                              name: pass.name,
                              country: pass.country,
                              region: pass.region,
                              maxAltitude: pass.maxAltitude,
                              elevationGain: pass.elevationGain,
                              averageGradient: pass.averageGradient,
                              maxGradient: pass.maxGradient,
                              distance: pass.distance,
                              difficulty: pass.difficulty,
                              description: pass.description,
                              imageUrl: pass.imageUrl,
                              category: pass.category
                            });
                            setShowPassModal(true);
                          }}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
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
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Gestión de Marcas</h2>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowBrandModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Tag className="w-4 h-4" />
                  Nueva Marca
                </button>
                <button
                  onClick={handleExportBrands}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Exportar Excel
                </button>
              </div>
            </div>
            
            {/* Brands Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">País</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destacada</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {brands.map((brand) => (
                    <tr key={brand.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{brand.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{brand.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{brand.country || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          brand.featured ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {brand.featured ? 'Sí' : 'No'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEditBrand(brand)}
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteBrand(brand.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {brands.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No hay marcas registradas
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'collaborators' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Gestión de Colaboradores</h2>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCollaboratorModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <UserCheck className="w-4 h-4" />
                  Nuevo Colaborador
                </button>
                <button
                  onClick={handleExportCollaborators}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Exportar Excel
                </button>
              </div>
            </div>
            
            {/* Collaborators Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destacado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {collaborators.map((collaborator) => (
                    <tr key={collaborator.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{collaborator.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{collaborator.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{collaborator.contactInfo.email || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          collaborator.featured ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {collaborator.featured ? 'Sí' : 'No'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEditCollaborator(collaborator)}
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCollaborator(collaborator.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {collaborators.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No hay colaboradores registrados
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'news' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Gestión de Noticias</h2>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowNewsModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Newspaper className="w-4 h-4" />
                  Nueva Noticia
                </button>
                <button
                  onClick={handleExportNews}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Exportar Excel
                </button>
              </div>
            </div>
            
            {/* News Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Autor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destacada</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {news.map((article) => (
                    <tr key={article.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{article.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{article.author}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{article.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          article.featured ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {article.featured ? 'Sí' : 'No'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEditNews(article)}
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteNews(article.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {news.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No hay noticias registradas
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Cyclist Modal */}
      {showCyclistModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingCyclist ? 'Editar Ciclista' : 'Nuevo Ciclista'}
              </h3>
              <button
                onClick={() => {
                  setShowCyclistModal(false);
                  setEditingCyclist(null);
                  resetCyclistForm();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                <input
                  type="text"
                  value={cyclistForm.name}
                  onChange={(e) => setCyclistForm({...cyclistForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alias</label>
                <input
                  type="text"
                  value={cyclistForm.alias}
                  onChange={(e) => setCyclistForm({...cyclistForm, alias: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={cyclistForm.email}
                  onChange={(e) => setCyclistForm({...cyclistForm, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono *</label>
                <input
                  type="tel"
                  value={cyclistForm.phone}
                  onChange={(e) => setCyclistForm({...cyclistForm, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Edad</label>
                  <input
                    type="number"
                    value={cyclistForm.age}
                    onChange={(e) => setCyclistForm({...cyclistForm, age: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Peso (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={cyclistForm.weight}
                    onChange={(e) => setCyclistForm({...cyclistForm, weight: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={cyclistForm.isAdmin}
                    onChange={(e) => setCyclistForm({...cyclistForm, isAdmin: e.target.checked})}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Es administrador</span>
                </label>
              </div>
            </div>
            
            <div className="p-6 border-t flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowCyclistModal(false);
                  setEditingCyclist(null);
                  resetCyclistForm();
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={editingCyclist ? handleUpdateCyclist : handleCreateCyclist}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {editingCyclist ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Brand Modal */}
      {showBrandModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingBrand ? 'Editar Marca' : 'Nueva Marca'}
              </h3>
              <button
                onClick={() => {
                  setShowBrandModal(false);
                  setEditingBrand(null);
                  resetBrandForm();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                <input
                  type="text"
                  value={brandForm.name}
                  onChange={(e) => setBrandForm({...brandForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                <select
                  value={brandForm.category}
                  onChange={(e) => setBrandForm({...brandForm, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Bicicletas">Bicicletas</option>
                  <option value="Componentes">Componentes</option>
                  <option value="Ropa">Ropa</option>
                  <option value="Accesorios">Accesorios</option>
                  <option value="Nutrición">Nutrición</option>
                  <option value="Otros">Otros</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción *</label>
                <textarea
                  value={brandForm.description}
                  onChange={(e) => setBrandForm({...brandForm, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
                <input
                  type="url"
                  value={brandForm.logo}
                  onChange={(e) => setBrandForm({...brandForm, logo: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sitio Web</label>
                <input
                  type="url"
                  value={brandForm.website}
                  onChange={(e) => setBrandForm({...brandForm, website: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">País</label>
                  <input
                    type="text"
                    value={brandForm.country}
                    onChange={(e) => setBrandForm({...brandForm, country: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Año Fundación</label>
                  <input
                    type="number"
                    value={brandForm.foundedYear}
                    onChange={(e) => setBrandForm({...brandForm, foundedYear: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Especialidades (separadas por comas)</label>
                <input
                  type="text"
                  value={brandForm.specialties}
                  onChange={(e) => setBrandForm({...brandForm, specialties: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Bicicletas de carretera, Mountain bikes"
                />
              </div>
              
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={brandForm.featured}
                    onChange={(e) => setBrandForm({...brandForm, featured: e.target.checked})}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Marca destacada</span>
                </label>
              </div>
            </div>
            
            <div className="p-6 border-t flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowBrandModal(false);
                  setEditingBrand(null);
                  resetBrandForm();
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={editingBrand ? handleUpdateBrand : handleCreateBrand}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {editingBrand ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Collaborator Modal */}
      {showCollaboratorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingCollaborator ? 'Editar Colaborador' : 'Nuevo Colaborador'}
              </h3>
              <button
                onClick={() => {
                  setShowCollaboratorModal(false);
                  setEditingCollaborator(null);
                  resetCollaboratorForm();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                <input
                  type="text"
                  value={collaboratorForm.name}
                  onChange={(e) => setCollaboratorForm({...collaboratorForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                <select
                  value={collaboratorForm.category}
                  onChange={(e) => setCollaboratorForm({...collaboratorForm, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Tienda de Bicicletas">Tienda de Bicicletas</option>
                  <option value="Hotel">Hotel</option>
                  <option value="Restaurante">Restaurante</option>
                  <option value="Guía Turístico">Guía Turístico</option>
                  <option value="Equipamiento">Equipamiento</option>
                  <option value="Otros">Otros</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción *</label>
                <textarea
                  value={collaboratorForm.description}
                  onChange={(e) => setCollaboratorForm({...collaboratorForm, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={collaboratorForm.email}
                  onChange={(e) => setCollaboratorForm({...collaboratorForm, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <input
                  type="tel"
                  value={collaboratorForm.phone}
                  onChange={(e) => setCollaboratorForm({...collaboratorForm, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sitio Web</label>
                <input
                  type="url"
                  value={collaboratorForm.website}
                  onChange={(e) => setCollaboratorForm({...collaboratorForm, website: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                <input
                  type="text"
                  value={collaboratorForm.address}
                  onChange={(e) => setCollaboratorForm({...collaboratorForm, address: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URLs de Imágenes (separadas por comas)</label>
                <textarea
                  value={collaboratorForm.images}
                  onChange={(e) => setCollaboratorForm({...collaboratorForm, images: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={2}
                  placeholder="https://ejemplo.com/imagen1.jpg, https://ejemplo.com/imagen2.jpg"
                />
              </div>
              
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={collaboratorForm.featured}
                    onChange={(e) => setCollaboratorForm({...collaboratorForm, featured: e.target.checked})}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Colaborador destacado</span>
                </label>
              </div>
            </div>
            
            <div className="p-6 border-t flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowCollaboratorModal(false);
                  setEditingCollaborator(null);
                  resetCollaboratorForm();
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={editingCollaborator ? handleUpdateCollaborator : handleCreateCollaborator}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {editingCollaborator ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* News Modal */}
      {showNewsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingNews ? 'Editar Noticia' : 'Nueva Noticia'}
              </h3>
              <button
                onClick={() => {
                  setShowNewsModal(false);
                  setEditingNews(null);
                  resetNewsForm();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
                <input
                  type="text"
                  value={newsForm.title}
                  onChange={(e) => setNewsForm({...newsForm, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Resumen *</label>
                <textarea
                  value={newsForm.summary}
                  onChange={(e) => setNewsForm({...newsForm, summary: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={2}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contenido *</label>
                <textarea
                  value={newsForm.content}
                  onChange={(e) => setNewsForm({...newsForm, content: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Autor *</label>
                  <input
                    type="text"
                    value={newsForm.author}
                    onChange={(e) => setNewsForm({...newsForm, author: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                  <select
                    value={newsForm.category}
                    onChange={(e) => setNewsForm({...newsForm, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Competición">Competición</option>
                    <option value="Equipamiento">Equipamiento</option>
                    <option value="Rutas">Rutas</option>
                    <option value="Noticias">Noticias</option>
                    <option value="Entrevistas">Entrevistas</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL de Imagen *</label>
                <input
                  type="url"
                  value={newsForm.imageUrl}
                  onChange={(e) => setNewsForm({...newsForm, imageUrl: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tiempo de Lectura (min)</label>
                  <input
                    type="number"
                    value={newsForm.readTime}
                    onChange={(e) => setNewsForm({...newsForm, readTime: parseInt(e.target.value) || 5})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    min="1"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL Externa</label>
                  <input
                    type="url"
                    value={newsForm.externalUrl}
                    onChange={(e) => setNewsForm({...newsForm, externalUrl: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={newsForm.featured}
                    onChange={(e) => setNewsForm({...newsForm, featured: e.target.checked})}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Noticia destacada</span>
                </label>
              </div>
            </div>
            
            <div className="p-6 border-t flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowNewsModal(false);
                  setEditingNews(null);
                  resetNewsForm();
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={editingNews ? handleUpdateNews : handleCreateNews}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {editingNews ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};