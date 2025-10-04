import React, { useState, useEffect } from 'react';
import { Users, Mountain, Tag, UserCheck, Newspaper, Download, UserPlus, Plus, CreditCard as Edit, Trash2, X, Save, Upload, Database, FileSpreadsheet, Trophy, MapPin, Camera, User } from 'lucide-react';
import { MountainPass, Cyclist, Brand, Collaborator, NewsArticle, CyclingRace } from '../types';
import { exportCyclists, exportMountainPasses, exportBrands, exportCollaborators, exportNews, exportRaces } from '../utils/excelExport';
import { exportPassesToExcel, importPassesFromExcel, downloadExcelTemplate } from '../utils/excelUtils';
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
import { sendRegistrationEmail } from '../utils/emailService';
import {
  loadRaces,
  addRace,
  removeRace,
  updateRace
} from '../utils/racesStorage';

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
  const [races, setRaces] = useState<CyclingRace[]>([]);
  
  // Modal states
  const [showCyclistModal, setShowCyclistModal] = useState(false);
  const [showPassModal, setShowPassModal] = useState(false);
  const [showBrandModal, setShowBrandModal] = useState(false);
  const [showCollaboratorModal, setShowCollaboratorModal] = useState(false);
  const [showNewsModal, setShowNewsModal] = useState(false);
  const [showRaceModal, setShowRaceModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  
  // Edit states
  const [editingCyclist, setEditingCyclist] = useState<Cyclist | null>(null);
  const [editingPass, setEditingPass] = useState<MountainPass | null>(null);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [editingCollaborator, setEditingCollaborator] = useState<Collaborator | null>(null);
  const [editingNews, setEditingNews] = useState<NewsArticle | null>(null);
  const [editingRace, setEditingRace] = useState<CyclingRace | null>(null);

  // Import states
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importPreview, setImportPreview] = useState<string[]>([]);

  // Form states
  const [cyclistForm, setCyclistForm] = useState({
    name: '', alias: '', email: '', phone: '', city: '', country: '', age: '', weight: '', password: '', profilePhoto: '', isAdmin: false
  });
  const [cyclistPhotoPreview, setCyclistPhotoPreview] = useState<string | null>(null);
  
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

  const [raceForm, setRaceForm] = useState({
    name: '', date: '', city: '', region: '', country: '', lat: '', lng: '',
    distance: '', elevation: '', type: 'Carretera', category: 'Amateur',
    description: '', posterUrl: '', registrationUrl: '', startTime: '',
    maxParticipants: '', price: '', organizer: '', contactEmail: '',
    contactPhone: '', featured: false
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
    setRaces(loadRaces());
  };

  // Import handlers
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const isCsv = file.type === 'text/csv' || file.name.endsWith('.csv');

    if (isCsv) {
      setImportFile(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const lines = text.split('\n').slice(0, 6);
        setImportPreview(lines);
      };
      reader.readAsText(file);
    } else {
      alert('Por favor selecciona un archivo CSV');
    }
  };

  const handleImport = async () => {
    if (!importFile) return;

    try {
      const newPasses = await importPassesFromExcel(importFile);

      newPasses.forEach(pass => {
        onUpdatePass(pass);
      });

      alert(`Se han importado ${newPasses.length} puertos correctamente.`);
      setShowImportModal(false);
      setImportFile(null);
      setImportPreview([]);
    } catch (error) {
      console.error('Error importing file:', error);
      alert(`Error al importar el archivo. Verifica el formato.`);
    }
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

  const handleExportRaces = () => {
    exportRaces(races);
  };

  // Cyclist photo handlers
  const handleCyclistPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona una imagen válida');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen no debe superar los 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setCyclistForm({ ...cyclistForm, profilePhoto: base64String });
        setCyclistPhotoPreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeCyclistPhoto = () => {
    setCyclistForm({ ...cyclistForm, profilePhoto: '' });
    setCyclistPhotoPreview(null);
  };

  // Cyclist handlers
  const handleCreateCyclist = async () => {
    const newCyclist: Cyclist = {
      id: Date.now().toString(),
      name: cyclistForm.name,
      alias: cyclistForm.alias || undefined,
      email: cyclistForm.email,
      phone: cyclistForm.phone,
      city: cyclistForm.city || undefined,
      country: cyclistForm.country || undefined,
      age: cyclistForm.age ? parseInt(cyclistForm.age) : undefined,
      weight: cyclistForm.weight ? parseFloat(cyclistForm.weight) : undefined,
      password: cyclistForm.password,
      profilePhoto: cyclistForm.profilePhoto || undefined,
      bikes: [],
      registrationDate: new Date().toISOString().split('T')[0],
      isAdmin: cyclistForm.isAdmin
    };

    addCyclist(newCyclist);
    setCyclists(loadCyclists());

    // Send registration email
    try {
      await sendRegistrationEmail(newCyclist);
    } catch (error) {
      console.error('Error sending registration email:', error);
    }

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
      city: cyclist.city || '',
      country: cyclist.country || '',
      age: cyclist.age?.toString() || '',
      weight: cyclist.weight?.toString() || '',
      password: cyclist.password || '',
      profilePhoto: cyclist.profilePhoto || '',
      isAdmin: cyclist.isAdmin || false
    });
    setCyclistPhotoPreview(cyclist.profilePhoto || null);
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
      city: cyclistForm.city || undefined,
      country: cyclistForm.country || undefined,
      age: cyclistForm.age ? parseInt(cyclistForm.age) : undefined,
      weight: cyclistForm.weight ? parseFloat(cyclistForm.weight) : undefined,
      password: cyclistForm.password || editingCyclist.password,
      profilePhoto: cyclistForm.profilePhoto || undefined,
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
      name: '', alias: '', email: '', phone: '', city: '', country: '', age: '', weight: '', password: '', profilePhoto: '', isAdmin: false
    });
    setCyclistPhotoPreview(null);
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

  // Race handlers
  const handleCreateRace = () => {
    const newRace: CyclingRace = {
      id: Date.now().toString(),
      name: raceForm.name,
      date: raceForm.date,
      location: {
        city: raceForm.city,
        region: raceForm.region,
        country: raceForm.country,
        coordinates: {
          lat: parseFloat(raceForm.lat) || 0,
          lng: parseFloat(raceForm.lng) || 0
        }
      },
      distance: parseFloat(raceForm.distance) || 0,
      elevation: parseFloat(raceForm.elevation) || 0,
      type: raceForm.type as any,
      category: raceForm.category as any,
      description: raceForm.description,
      posterUrl: raceForm.posterUrl,
      registrationUrl: raceForm.registrationUrl || undefined,
      startTime: raceForm.startTime || undefined,
      maxParticipants: raceForm.maxParticipants ? parseInt(raceForm.maxParticipants) : undefined,
      price: raceForm.price ? parseFloat(raceForm.price) : undefined,
      organizer: raceForm.organizer || undefined,
      contactEmail: raceForm.contactEmail || undefined,
      contactPhone: raceForm.contactPhone || undefined,
      featured: raceForm.featured,
      isActive: true
    };

    addRace(newRace);
    setRaces(loadRaces());
    setShowRaceModal(false);
    resetRaceForm();
  };

  const handleEditRace = (race: CyclingRace) => {
    setEditingRace(race);
    setRaceForm({
      name: race.name,
      date: race.date,
      city: race.location.city,
      region: race.location.region,
      country: race.location.country,
      lat: race.location.coordinates.lat.toString(),
      lng: race.location.coordinates.lng.toString(),
      distance: race.distance.toString(),
      elevation: race.elevation.toString(),
      type: race.type,
      category: race.category,
      description: race.description,
      posterUrl: race.posterUrl,
      registrationUrl: race.registrationUrl || '',
      startTime: race.startTime || '',
      maxParticipants: race.maxParticipants?.toString() || '',
      price: race.price?.toString() || '',
      organizer: race.organizer || '',
      contactEmail: race.contactEmail || '',
      contactPhone: race.contactPhone || '',
      featured: race.featured
    });
    setShowRaceModal(true);
  };

  const handleUpdateRace = () => {
    if (!editingRace) return;

    const updatedRace: CyclingRace = {
      ...editingRace,
      name: raceForm.name,
      date: raceForm.date,
      location: {
        city: raceForm.city,
        region: raceForm.region,
        country: raceForm.country,
        coordinates: {
          lat: parseFloat(raceForm.lat) || 0,
          lng: parseFloat(raceForm.lng) || 0
        }
      },
      distance: parseFloat(raceForm.distance) || 0,
      elevation: parseFloat(raceForm.elevation) || 0,
      type: raceForm.type as any,
      category: raceForm.category as any,
      description: raceForm.description,
      posterUrl: raceForm.posterUrl,
      registrationUrl: raceForm.registrationUrl || undefined,
      startTime: raceForm.startTime || undefined,
      maxParticipants: raceForm.maxParticipants ? parseInt(raceForm.maxParticipants) : undefined,
      price: raceForm.price ? parseFloat(raceForm.price) : undefined,
      organizer: raceForm.organizer || undefined,
      contactEmail: raceForm.contactEmail || undefined,
      contactPhone: raceForm.contactPhone || undefined,
      featured: raceForm.featured
    };

    updateRace(updatedRace);
    setRaces(loadRaces());
    setShowRaceModal(false);
    setEditingRace(null);
    resetRaceForm();
  };

  const handleDeleteRace = (raceId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta carrera?')) {
      removeRace(raceId);
      setRaces(loadRaces());
    }
  };

  const resetRaceForm = () => {
    setRaceForm({
      name: '', date: '', city: '', region: '', country: '', lat: '', lng: '',
      distance: '', elevation: '', type: 'Carretera', category: 'Amateur',
      description: '', posterUrl: '', registrationUrl: '', startTime: '',
      maxParticipants: '', price: '', organizer: '', contactEmail: '',
      contactPhone: '', featured: false
    });
  };

  const tabs = [
    { id: 'cyclists', label: 'Gestionar Ciclistas', icon: Users },
    { id: 'passes', label: 'Gestionar Puertos', icon: Mountain },
    { id: 'brands', label: 'Gestionar Marcas', icon: Tag },
    { id: 'collaborators', label: 'Gestionar Colaboradores', icon: UserCheck },
    { id: 'news', label: 'Gestionar Noticias', icon: Newspaper },
    { id: 'races', label: 'Gestionar Carreras', icon: Trophy },
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
                  onClick={downloadExcelTemplate}
                  className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  Plantilla CSV
                </button>
                <button
                  onClick={() => setShowImportModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  Importar CSV
                </button>
                <button
                  onClick={() => exportPassesToExcel(passes)}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>Exportar CSV</span>
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

        {activeTab === 'races' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Gestión de Carreras</h2>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowRaceModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Trophy className="w-4 h-4" />
                  Nueva Carrera
                </button>
                <button
                  onClick={handleExportRaces}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Exportar CSV
                </button>
              </div>
            </div>

            {/* Races Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Localización</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Distancia</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {races.map((race) => (
                    <tr key={race.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{race.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(race.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{race.location.city}, {race.location.country}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{race.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{race.distance} km</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEditRace(race)}
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteRace(race.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {races.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No hay carreras registradas
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Cyclist Modal */}
      {showCyclistModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => {
            setShowCyclistModal(false);
            setEditingCyclist(null);
            resetCyclistForm();
          }}
        >
          <div
            className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b flex items-center justify-between sticky top-0 bg-white z-10">
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
              {/* Profile Photo Section */}
              <div className="flex flex-col items-center space-y-3 pb-4 border-b border-gray-200">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-300">
                    {cyclistPhotoPreview ? (
                      <img
                        src={cyclistPhotoPreview}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  {cyclistPhotoPreview && (
                    <button
                      type="button"
                      onClick={removeCyclistPhoto}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
                <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                  <Camera className="w-4 h-4" />
                  <span>{cyclistPhotoPreview ? 'Cambiar' : 'Subir foto'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCyclistPhotoUpload}
                    className="hidden"
                  />
                </label>
              </div>

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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña {!editingCyclist && '*'}
                </label>
                <input
                  type="password"
                  value={cyclistForm.password}
                  onChange={(e) => setCyclistForm({...cyclistForm, password: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder={editingCyclist ? "Dejar vacío para mantener la actual" : "Mínimo 6 caracteres"}
                  required={!editingCyclist}
                />
                {!editingCyclist && (
                  <p className="text-xs text-gray-500 mt-1">
                    Se enviará un email al ciclista con sus credenciales de acceso
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
                <input
                  type="text"
                  value={cyclistForm.city}
                  onChange={(e) => setCyclistForm({...cyclistForm, city: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">País</label>
                <input
                  type="text"
                  value={cyclistForm.country}
                  onChange={(e) => setCyclistForm({...cyclistForm, country: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
            
            <div className="p-6 border-t flex justify-end space-x-3 sticky bottom-0 bg-white">
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
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => {
            setShowBrandModal(false);
            setEditingBrand(null);
            resetBrandForm();
          }}
        >
          <div
            className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
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
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => {
            setShowCollaboratorModal(false);
            setEditingCollaborator(null);
            resetCollaboratorForm();
          }}
        >
          <div
            className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
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
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => {
            setShowNewsModal(false);
            setEditingNews(null);
            resetNewsForm();
          }}
        >
          <div
            className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
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

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Upload className="h-6 w-6 text-blue-500" />
                <h3 className="text-xl font-semibold text-slate-800">Importar Puertos de Montaña</h3>
              </div>
              <button
                onClick={() => {
                  setShowImportModal(false);
                  setImportFile(null);
                  setImportPreview([]);
                }}
                className="text-slate-500 hover:text-slate-700 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5" />
                  Formato CSV
                </h4>
                <p className="text-blue-700 text-sm mb-3">
                  Importa archivos en formato CSV con las siguientes columnas:
                </p>
                <div className="bg-white rounded border p-3 text-xs space-y-2">
                  <div className="text-blue-600">
                    <strong>Columnas requeridas (en orden):</strong>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-blue-700">
                    <div>• <strong>ID:</strong> Identificador único</div>
                    <div>• <strong>Nombre:</strong> Nombre del puerto</div>
                    <div>• <strong>País:</strong> País</div>
                    <div>• <strong>Región:</strong> Región</div>
                    <div>• <strong>Altitud Máxima (m):</strong> Altitud</div>
                    <div>• <strong>Desnivel (m):</strong> Desnivel</div>
                    <div>• <strong>Pendiente Media (%):</strong> Pendiente media</div>
                    <div>• <strong>Pendiente Máxima (%):</strong> Pendiente máxima</div>
                    <div>• <strong>Distancia (km):</strong> Distancia</div>
                    <div>• <strong>Dificultad:</strong> Cuarta/Tercera/Segunda/Primera/Especial</div>
                    <div>• <strong>Categoría:</strong> Categoría</div>
                    <div>• <strong>Latitud:</strong> Coordenada latitud</div>
                    <div>• <strong>Longitud:</strong> Coordenada longitud</div>
                    <div>• <strong>Descripción:</strong> Descripción del puerto</div>
                    <div>• <strong>URL Imagen:</strong> URL de la imagen</div>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 text-sm text-blue-700">
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Descarga la plantilla CSV para ver el formato correcto</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Seleccionar archivo CSV
                </label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                {importFile && (
                  <div className="mt-2 text-sm text-green-600 flex items-center gap-2">
                    <Database className="w-4 h-4" />
                    Archivo seleccionado: {importFile.name}
                  </div>
                )}
              </div>

              {importPreview.length > 0 && (
                <div>
                  <h4 className="font-semibold text-slate-800 mb-3">Vista previa del archivo:</h4>
                  <div className="bg-slate-50 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-xs text-slate-700 whitespace-pre-wrap">
                      {importPreview.join('\n')}
                    </pre>
                  </div>
                  <p className="text-sm text-slate-600 mt-2">
                    Mostrando las primeras 5 filas del archivo...
                  </p>
                </div>
              )}

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 mb-2">Importante</h4>
                <ul className="text-yellow-700 text-sm space-y-1">
                  <li>• Los puertos con el mismo ID serán actualizados</li>
                  <li>• Los puertos nuevos serán añadidos a la base de datos</li>
                  <li>• Verifica que el formato del archivo sea correcto antes de importar</li>
                  <li>• Se recomienda hacer una exportación antes de importar como respaldo</li>
                  <li>• El archivo debe estar en formato UTF-8</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-end space-x-3 p-6 border-t">
              <button
                onClick={() => {
                  setShowImportModal(false);
                  setImportFile(null);
                  setImportPreview([]);
                }}
                className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleImport}
                disabled={!importFile}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Upload className="h-4 w-4" />
                <span>Importar Puertos</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Race Modal */}
      {showRaceModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => {
            setShowRaceModal(false);
            setEditingRace(null);
            resetRaceForm();
          }}
        >
          <div
            className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingRace ? 'Editar Carrera' : 'Nueva Carrera'}
              </h3>
              <button
                onClick={() => {
                  setShowRaceModal(false);
                  setEditingRace(null);
                  resetRaceForm();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Carrera *</label>
                  <input
                    type="text"
                    value={raceForm.name}
                    onChange={(e) => setRaceForm({...raceForm, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha *</label>
                  <input
                    type="date"
                    value={raceForm.date}
                    onChange={(e) => setRaceForm({...raceForm, date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hora de Inicio</label>
                  <input
                    type="time"
                    value={raceForm.startTime}
                    onChange={(e) => setRaceForm({...raceForm, startTime: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad *</label>
                  <input
                    type="text"
                    value={raceForm.city}
                    onChange={(e) => setRaceForm({...raceForm, city: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Región / Provincia *</label>
                  <input
                    type="text"
                    value={raceForm.region}
                    onChange={(e) => setRaceForm({...raceForm, region: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">País *</label>
                  <input
                    type="text"
                    value={raceForm.country}
                    onChange={(e) => setRaceForm({...raceForm, country: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Latitud (GPS) *
                  </label>
                  <input
                    type="number"
                    step="0.000001"
                    value={raceForm.lat}
                    onChange={(e) => setRaceForm({...raceForm, lat: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="40.416775"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Longitud (GPS) *
                  </label>
                  <input
                    type="number"
                    step="0.000001"
                    value={raceForm.lng}
                    onChange={(e) => setRaceForm({...raceForm, lng: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="-3.703790"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Carrera</label>
                  <select
                    value={raceForm.type}
                    onChange={(e) => setRaceForm({...raceForm, type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Carretera">Carretera</option>
                    <option value="MTB">MTB</option>
                    <option value="Gravel">Gravel</option>
                    <option value="Ciclocross">Ciclocross</option>
                    <option value="Contrarreloj">Contrarreloj</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                  <select
                    value={raceForm.category}
                    onChange={(e) => setRaceForm({...raceForm, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Profesional">Profesional</option>
                    <option value="Amateur">Amateur</option>
                    <option value="Gran Fondo">Gran Fondo</option>
                    <option value="Marcha">Marcha</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Distancia (km) *</label>
                  <input
                    type="number"
                    step="0.1"
                    value={raceForm.distance}
                    onChange={(e) => setRaceForm({...raceForm, distance: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Desnivel (m) *</label>
                  <input
                    type="number"
                    value={raceForm.elevation}
                    onChange={(e) => setRaceForm({...raceForm, elevation: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Máximo de Participantes</label>
                  <input
                    type="number"
                    value={raceForm.maxParticipants}
                    onChange={(e) => setRaceForm({...raceForm, maxParticipants: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Precio Inscripción (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={raceForm.price}
                    onChange={(e) => setRaceForm({...raceForm, price: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Organizador</label>
                  <input
                    type="text"
                    value={raceForm.organizer}
                    onChange={(e) => setRaceForm({...raceForm, organizer: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email de Contacto</label>
                  <input
                    type="email"
                    value={raceForm.contactEmail}
                    onChange={(e) => setRaceForm({...raceForm, contactEmail: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono de Contacto</label>
                  <input
                    type="tel"
                    value={raceForm.contactPhone}
                    onChange={(e) => setRaceForm({...raceForm, contactPhone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL Inscripción</label>
                  <input
                    type="url"
                    value={raceForm.registrationUrl}
                    onChange={(e) => setRaceForm({...raceForm, registrationUrl: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="https://ejemplo.com/inscripcion"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL del Cartel *</label>
                  <input
                    type="url"
                    value={raceForm.posterUrl}
                    onChange={(e) => setRaceForm({...raceForm, posterUrl: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="https://ejemplo.com/cartel.jpg"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Puedes subir la imagen a un servicio como Imgur y copiar la URL aquí
                  </p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripción *</label>
                  <textarea
                    value={raceForm.description}
                    onChange={(e) => setRaceForm({...raceForm, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={raceForm.featured}
                      onChange={(e) => setRaceForm({...raceForm, featured: e.target.checked})}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Carrera destacada</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="p-6 border-t flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowRaceModal(false);
                  setEditingRace(null);
                  resetRaceForm();
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={editingRace ? handleUpdateRace : handleCreateRace}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {editingRace ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};