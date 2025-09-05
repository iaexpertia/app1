import React, { useState, useEffect } from 'react';
import { MountainPass, Cyclist } from '../types';
import { Translation } from '../i18n/translations';
import { Brand, NewsArticle, Collaborator } from '../types';
import { exportCyclists, exportMountainPasses } from '../utils/excelExport';
import { 
  loadCyclists, 
  saveCyclists, 
  removeCyclist, 
  updateCyclist 
} from '../utils/cyclistStorage';
import { 
  loadBrands, 
  addBrand, 
  removeBrand, 
  updateBrand,
  loadBrandCategories 
} from '../utils/brandsStorage';
import { 
  loadNews, 
  addNews, 
  removeNews, 
  updateNews 
} from '../utils/newsStorage';
import { 
  loadCollaborators, 
  addCollaborator, 
  removeCollaborator, 
  updateCollaborator,
  loadCategories 
} from '../utils/collaboratorStorage';
import { 
  Settings, 
  Users, 
  Mountain, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Plus,
  User,
  Mail,
  Phone,
  Calendar,
  Weight,
  Bike,
  Shield,
  Tag,
  Newspaper,
  UserCheck,
  Download,
  Upload,
  Globe,
  MapPin,
  Camera,
  FileText
} from 'lucide-react';

interface AdminPanelProps {
  passes: MountainPass[];
  onUpdatePass: (pass: MountainPass) => void;
  t: Translation;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ passes, onUpdatePass, t }) => {
  const [cyclists, setCyclists] = useState<Cyclist[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [editingCyclist, setEditingCyclist] = useState<Cyclist | null>(null);
  const [editingPass, setEditingPass] = useState<MountainPass | null>(null);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [editingNews, setEditingNews] = useState<NewsArticle | null>(null);
  const [editingCollaborator, setEditingCollaborator] = useState<Collaborator | null>(null);
  const [showAddBrandModal, setShowAddBrandModal] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [showAddNewsModal, setShowAddNewsModal] = useState(false);
  const [showAddCollaboratorModal, setShowAddCollaboratorModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'cyclists' | 'passes' | 'brands' | 'news' | 'collaborators'>('cyclists');
  const [importStatus, setImportStatus] = useState<{
    type: 'success' | 'error';
    message: string;
    details?: string;
  } | null>(null);

  useEffect(() => {
    setCyclists(loadCyclists());
    setBrands(loadBrands());
    setNews(loadNews());
    setCollaborators(loadCollaborators());
  }, []);

  const handleDeleteCyclist = (cyclistId: string) => {
    if (window.confirm(t.confirmDeleteCyclist)) {
      removeCyclist(cyclistId);
      setCyclists(loadCyclists());
    }
  };

  const handleSaveCyclist = () => {
    if (editingCyclist) {
      updateCyclist(editingCyclist);
      setCyclists(loadCyclists());
      setEditingCyclist(null);
    }
  };

  const handleSavePass = () => {
    if (editingPass) {
      onUpdatePass(editingPass);
      setEditingPass(null);
    }
  };

  // Brand handlers
  const handleAddBrand = (brand: Omit<Brand, 'id'>) => {
    const newBrand: Brand = {
      ...brand,
      id: Date.now().toString()
    };
    addBrand(newBrand);
    setBrands(loadBrands());
    setShowAddBrandModal(false);
  };

  const handleDeleteBrand = (brandId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta marca?')) {
      removeBrand(brandId);
      setBrands(loadBrands());
    }
  };

  const handleSaveBrand = () => {
    if (editingBrand) {
      updateBrand(editingBrand);
      setBrands(loadBrands());
      setEditingBrand(null);
    }
  };

  // News handlers
  const handleAddNews = (article: Omit<NewsArticle, 'id'>) => {
    const newArticle: NewsArticle = {
      ...article,
      id: Date.now().toString()
    };
    addNews(newArticle);
    setNews(loadNews());
    setShowAddNewsModal(false);
  };

  const handleDeleteNews = (articleId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta noticia?')) {
      removeNews(articleId);
      setNews(loadNews());
    }
  };

  const handleSaveNews = () => {
    if (editingNews) {
      updateNews(editingNews);
      setNews(loadNews());
      setEditingNews(null);
    }
  };

  // Collaborator handlers
  const handleAddCollaborator = (collaborator: Omit<Collaborator, 'id'>) => {
    const newCollaborator: Collaborator = {
      ...collaborator,
      id: Date.now().toString()
    };
    addCollaborator(newCollaborator);
    setCollaborators(loadCollaborators());
    setShowAddCollaboratorModal(false);
  };

  const handleDeleteCollaborator = (collaboratorId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este colaborador?')) {
      removeCollaborator(collaboratorId);
      setCollaborators(loadCollaborators());
    }
  };

  const handleSaveCollaborator = () => {
    if (editingCollaborator) {
      updateCollaborator(editingCollaborator);
      setCollaborators(loadCollaborators());
      setEditingCollaborator(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getBikeTypeText = (type: string) => {
    const typeMap: Record<string, string> = {
      'Road': 'Carretera',
      'Mountain': 'Montaña',
      'Gravel': 'Gravel',
      'Electric': 'Eléctrica',
      'Other': 'Otra'
    };
    return typeMap[type] || type;
  };

  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current);
    return result;
  };

  const handleExportCSV = () => {
    const csvHeaders = [
      'id',
      'name',
      'country',
      'region',
      'maxAltitude',
      'elevationGain',
      'averageGradient',
      'maxGradient',
      'distance',
      'difficulty',
      'coordinates_lat',
      'coordinates_lng',
      'description',
      'imageUrl',
      'category'
    ];
    
    const csvData = passes.map(pass => [
      pass.id,
      `"${pass.name}"`,
      `"${pass.country}"`,
      `"${pass.region}"`,
      pass.maxAltitude,
      pass.elevationGain,
      pass.averageGradient,
      pass.maxGradient,
      pass.distance,
      `"${pass.difficulty}"`,
      pass.coordinates.lat,
      pass.coordinates.lng,
      `"${pass.description.replace(/"/g, '""')}"`,
      `"${pass.imageUrl}"`,
      `"${pass.category}"`
    ]);
    
    const csvContent = [
      csvHeaders.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `mountain_passes_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setImportStatus({
      type: 'success',
      message: 'CSV exportado correctamente',
      details: `${passes.length} puertos exportados`
    });
    
    setTimeout(() => setImportStatus(null), 5000);
  };

  const handleImportCSV = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        throw new Error('El archivo CSV debe tener al menos una fila de datos');
      }
      
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      const expectedHeaders = [
        'id', 'name', 'country', 'region', 'maxAltitude', 'elevationGain',
        'averageGradient', 'maxGradient', 'distance', 'difficulty',
        'coordinates_lat', 'coordinates_lng', 'description', 'imageUrl', 'category'
      ];
      
      // Verificar que todos los headers necesarios estén presentes
      const missingHeaders = expectedHeaders.filter(h => !headers.includes(h));
      if (missingHeaders.length > 0) {
        throw new Error(`Faltan las siguientes columnas: ${missingHeaders.join(', ')}`);
      }
      
      const newPasses: MountainPass[] = [];
      let errorCount = 0;
      
      for (let i = 1; i < lines.length; i++) {
        try {
          const values = parseCSVLine(lines[i]);
          
          if (values.length !== headers.length) {
            console.warn(`Fila ${i + 1}: Número incorrecto de columnas`);
            errorCount++;
            continue;
          }
          
          const rowData: Record<string, string> = {};
          headers.forEach((header, index) => {
            rowData[header] = values[index]?.replace(/^"|"$/g, '') || '';
          });
          
          const pass: MountainPass = {
            id: rowData.id || `imported-${Date.now()}-${i}`,
            name: rowData.name,
            country: rowData.country,
            region: rowData.region,
            maxAltitude: parseInt(rowData.maxAltitude) || 0,
            elevationGain: parseInt(rowData.elevationGain) || 0,
            averageGradient: parseFloat(rowData.averageGradient) || 0,
            maxGradient: parseFloat(rowData.maxGradient) || 0,
            distance: parseFloat(rowData.distance) || 0,
            difficulty: (rowData.difficulty as any) || 'Cuarta',
            coordinates: {
              lat: parseFloat(rowData.coordinates_lat) || 0,
              lng: parseFloat(rowData.coordinates_lng) || 0
            },
            description: rowData.description || '',
            famousWinners: [],
            imageUrl: rowData.imageUrl || 'https://images.pexels.com/photos/1666021/pexels-photo-1666021.jpeg',
            category: rowData.category || 'Otros'
          };
          
          // Validaciones básicas
          if (!pass.name || !pass.country || !pass.region) {
            console.warn(`Fila ${i + 1}: Faltan datos obligatorios (nombre, país, región)`);
            errorCount++;
            continue;
          }
          
          newPasses.push(pass);
        } catch (error) {
          console.error(`Error procesando fila ${i + 1}:`, error);
          errorCount++;
        }
      }
      
      // Actualizar los puertos (esto debería integrarse con el sistema de gestión de puertos)
      newPasses.forEach(pass => {
        onUpdatePass(pass);
      });
      
      setImportStatus({
        type: 'success',
        message: `Importación completada: ${newPasses.length} puertos importados`,
        details: errorCount > 0 ? `${errorCount} filas con errores fueron omitidas` : undefined
      });
      
    } catch (error) {
      setImportStatus({
        type: 'error',
        message: 'Error al importar el archivo CSV',
        details: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
    
    // Limpiar el input
    event.target.value = '';
    
    // Limpiar el mensaje después de 10 segundos
    setTimeout(() => setImportStatus(null), 10000);
  };

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
          
          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-1 bg-slate-200 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('cyclists')}
              className={`flex items-center space-x-2 py-2 px-4 rounded-md transition-colors ${
                activeTab === 'cyclists'
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">{t.manageCyclists}</span>
              <span className="sm:hidden">Ciclistas</span>
            </button>
            
            <button
              onClick={() => setActiveTab('passes')}
              className={`flex items-center space-x-2 py-2 px-4 rounded-md transition-colors ${
                activeTab === 'passes'
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <Mountain className="h-4 w-4" />
              <span className="hidden sm:inline">{t.managePasses}</span>
              <span className="sm:hidden">Puertos</span>
            </button>
            
            <button
              onClick={() => setActiveTab('brands')}
              className={`flex items-center space-x-2 py-2 px-4 rounded-md transition-colors ${
                activeTab === 'brands'
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <Tag className="h-4 w-4" />
              <span className="hidden sm:inline">Marcas</span>
              <span className="sm:hidden">Marcas</span>
            </button>
            
            <button
              onClick={() => setActiveTab('news')}
              className={`flex items-center space-x-2 py-2 px-4 rounded-md transition-colors ${
                activeTab === 'news'
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <Newspaper className="h-4 w-4" />
              <span className="hidden sm:inline">Noticias</span>
              <span className="sm:hidden">Noticias</span>
            </button>
            
            <button
              onClick={() => setActiveTab('collaborators')}
              className={`flex items-center space-x-2 py-2 px-4 rounded-md transition-colors ${
                activeTab === 'collaborators'
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <UserCheck className="h-4 w-4" />
              <span className="hidden sm:inline">Colaboradores</span>
              <span className="sm:hidden">Colab.</span>
            </button>
          </div>
        </div>

        {/* Cyclists Tab */}
        {activeTab === 'cyclists' && (
          <div>
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-slate-800">{t.registeredCyclists}</h3>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-slate-600">
                    {cyclists.length} {t.totalCyclists}
                  </span>
                  <button
                    onClick={() => exportCyclists(cyclists)}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    <span>Exportar Excel</span>
                  </button>
                </div>
              </div>
              
              {cyclists.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-xl text-slate-600 mb-2">{t.noCyclists}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cyclists.map(cyclist => (
                    <div key={cyclist.id} className="border border-slate-200 rounded-lg p-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Personal Information */}
                        <div className="space-y-4">
                          <div className="flex items-center space-x-3 mb-4">
                            <User className="h-5 w-5 text-orange-500" />
                            <h4 className="text-lg font-semibold text-slate-800">Información Personal</h4>
                            {cyclist.isAdmin && (
                              <Shield className="h-5 w-5 text-blue-500" title="Administrador" />
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
                              <p className="text-slate-900 font-medium">{cyclist.name}</p>
                            </div>
                            
                            {cyclist.alias && (
                              <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Alias</label>
                                <p className="text-slate-900">{cyclist.alias}</p>
                              </div>
                            )}
                            
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                              <div className="flex items-center space-x-2">
                                <Mail className="h-4 w-4 text-slate-500" />
                                <p className="text-slate-900">{cyclist.email}</p>
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono</label>
                              <div className="flex items-center space-x-2">
                                <Phone className="h-4 w-4 text-slate-500" />
                                <p className="text-slate-900">{cyclist.phone}</p>
                              </div>
                            </div>
                            
                            {cyclist.age && (
                              <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Edad</label>
                                <div className="flex items-center space-x-2">
                                  <Calendar className="h-4 w-4 text-slate-500" />
                                  <p className="text-slate-900">{cyclist.age} años</p>
                                </div>
                              </div>
                            )}
                            
                            {cyclist.weight && (
                              <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Peso</label>
                                <div className="flex items-center space-x-2">
                                  <Weight className="h-4 w-4 text-slate-500" />
                                  <p className="text-slate-900">{cyclist.weight} kg</p>
                                </div>
                              </div>
                            )}
                            
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">Fecha de Registro</label>
                              <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4 text-slate-500" />
                                <p className="text-slate-900">{formatDate(cyclist.registrationDate)}</p>
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">Rol</label>
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                cyclist.isAdmin 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {cyclist.isAdmin ? 'Administrador' : 'Usuario'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Bikes Information */}
                        <div className="space-y-4">
                          <div className="flex items-center space-x-3 mb-4">
                            <Bike className="h-5 w-5 text-orange-500" />
                            <h4 className="text-lg font-semibold text-slate-800">
                              Bicicletas ({cyclist.bikes.length})
                            </h4>
                          </div>
                          
                          {cyclist.bikes.length === 0 ? (
                            <div className="text-center py-4 bg-slate-50 rounded-lg">
                              <Bike className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                              <p className="text-slate-500 text-sm">No tiene bicicletas registradas</p>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {cyclist.bikes.map((bike, index) => (
                                <div key={bike.id} className="bg-slate-50 rounded-lg p-4">
                                  <div className="flex items-center justify-between mb-2">
                                    <h5 className="font-medium text-slate-800">
                                      Bicicleta {index + 1}
                                    </h5>
                                    <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                                      {getBikeTypeText(bike.type)}
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                                    <div>
                                      <span className="text-slate-500">Marca:</span>
                                      <span className="ml-2 text-slate-900 font-medium">{bike.brand}</span>
                                    </div>
                                    <div>
                                      <span className="text-slate-500">Modelo:</span>
                                      <span className="ml-2 text-slate-900 font-medium">{bike.model}</span>
                                    </div>
                                    {bike.year && (
                                      <div>
                                        <span className="text-slate-500">Año:</span>
                                        <span className="ml-2 text-slate-900">{bike.year}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-slate-200">
                        <button
                          onClick={() => setEditingCyclist(cyclist)}
                          className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                          <span>{t.editCyclist}</span>
                        </button>
                        <button
                          onClick={() => handleDeleteCyclist(cyclist.id)}
                          className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Eliminar</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Passes Tab */}
        {activeTab === 'passes' && (
          <div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-slate-800">{t.managePasses}</h3>
                <div className="flex space-x-3">
                  <button
                    onClick={() => exportMountainPasses(passes)}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    <span>Exportar Excel</span>
                  </button>
                  <button
                    onClick={handleExportCSV}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    <span>Exportar CSV</span>
                  </button>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleImportCSV}
                      className="hidden"
                      id="csv-import"
                    />
                    <label
                      htmlFor="csv-import"
                      className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors cursor-pointer"
                    >
                      <Upload className="h-4 w-4" />
                      <span>Importar CSV</span>
                    </label>
                  </div>
                </div>
              </div>
              
              {importStatus && (
                <div className={`mb-4 p-4 rounded-lg ${
                  importStatus.type === 'success' 
                    ? 'bg-green-50 border border-green-200 text-green-800' 
                    : 'bg-red-50 border border-red-200 text-red-800'
                }`}>
                  <p className="font-medium">{importStatus.message}</p>
                  {importStatus.details && (
                    <p className="text-sm mt-1">{importStatus.details}</p>
                  )}
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {passes.map(pass => (
                  <div key={pass.id} className="border border-slate-200 rounded-lg overflow-hidden">
                    <img 
                      src={pass.imageUrl} 
                      alt={pass.name}
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-4">
                      <h4 className="font-semibold text-slate-800 mb-2">{pass.name}</h4>
                      <p className="text-sm text-slate-600 mb-3">{pass.region}, {pass.country}</p>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                          {pass.difficulty}
                        </span>
                        <button
                          onClick={() => setEditingPass(pass)}
                          className="flex items-center space-x-1 px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                        >
                          <Edit className="h-3 w-3" />
                          <span>{t.editPass}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Brands Tab */}
        {activeTab === 'brands' && (
          <div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Tag className="h-6 w-6 text-orange-500" />
                  <h3 className="text-xl font-semibold text-slate-800">Gestión de Marcas</h3>
                </div>
                <button 
                  onClick={() => setShowAddBrandModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Añadir Marca</span>
                </button>
              </div>
              
              {brands.length === 0 ? (
                <div className="text-center py-12">
                  <Tag className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-xl text-slate-600 mb-2">No hay marcas registradas</p>
                  <p className="text-slate-500">Añade la primera marca de ciclismo</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {brands.map(brand => (
                    <div key={brand.id} className="border border-slate-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-slate-800">{brand.name}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          brand.featured ? 'bg-yellow-100 text-yellow-800' : 'bg-slate-100 text-slate-800'
                        }`}>
                          {brand.featured ? 'Destacada' : 'Normal'}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mb-2">{brand.category}</p>
                      <p className="text-xs text-slate-500 mb-4 line-clamp-2">{brand.description}</p>
                      
                      <div className="flex justify-between items-center">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          brand.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {brand.isActive ? 'Activa' : 'Inactiva'}
                        </span>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setEditingBrand(brand)}
                            className="flex items-center space-x-1 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors"
                          >
                            <Edit className="h-3 w-3" />
                            <span>Editar</span>
                          </button>
                          <button
                            onClick={() => handleDeleteBrand(brand.id)}
                            className="flex items-center space-x-1 px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition-colors"
                          >
                            <Trash2 className="h-3 w-3" />
                            <span>Eliminar</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* News Tab */}
        {activeTab === 'news' && (
          <div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Newspaper className="h-6 w-6 text-orange-500" />
                  <h3 className="text-xl font-semibold text-slate-800">Gestión de Noticias</h3>
                </div>
                <button 
                  onClick={() => setShowAddNewsModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Nueva Noticia</span>
                </button>
              </div>
              
              {news.length === 0 ? (
                <div className="text-center py-12">
                  <Newspaper className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-xl text-slate-600 mb-2">No hay noticias publicadas</p>
                  <p className="text-slate-500">Crea la primera noticia</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {news.map(article => (
                    <div key={article.id} className="border border-slate-200 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-semibold text-slate-800 text-lg">{article.title}</h4>
                            {article.featured && (
                              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                                Destacada
                              </span>
                            )}
                          </div>
                          <p className="text-slate-600 mb-2">{article.summary}</p>
                          <div className="flex items-center space-x-4 text-sm text-slate-500">
                            <span>Por {article.author}</span>
                            <span>{new Date(article.publishDate).toLocaleDateString('es-ES')}</span>
                            <span>{article.category}</span>
                            <span>{article.readTime} min lectura</span>
                          </div>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <button
                            onClick={() => setEditingNews(article)}
                            className="flex items-center space-x-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
                          >
                            <Edit className="h-3 w-3" />
                            <span>Editar</span>
                          </button>
                          <button
                            onClick={() => handleDeleteNews(article.id)}
                            className="flex items-center space-x-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm"
                          >
                            <Trash2 className="h-3 w-3" />
                            <span>Eliminar</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Collaborators Tab */}
        {activeTab === 'collaborators' && (
          <div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <UserCheck className="h-6 w-6 text-orange-500" />
                  <h3 className="text-xl font-semibold text-slate-800">Gestión de Colaboradores</h3>
                </div>
                <button 
                  onClick={() => setShowAddCollaboratorModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Añadir Colaborador</span>
                </button>
              </div>
              
              {collaborators.length === 0 ? (
                <div className="text-center py-12">
                  <UserCheck className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-xl text-slate-600 mb-2">No hay colaboradores registrados</p>
                  <p className="text-slate-500">Añade el primer colaborador</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {collaborators.map(collaborator => (
                    <div key={collaborator.id} className="border border-slate-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-slate-800">{collaborator.name}</h4>
                        <div className="flex space-x-2">
                          {collaborator.featured && (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                              Destacado
                            </span>
                          )}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            collaborator.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {collaborator.isActive ? 'Activo' : 'Inactivo'}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 mb-2">{collaborator.category}</p>
                      <p className="text-xs text-slate-500 mb-3 line-clamp-2">{collaborator.description}</p>
                      
                      {collaborator.contactInfo.address && (
                        <div className="flex items-center text-xs text-slate-500 mb-2">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>{collaborator.contactInfo.address}</span>
                        </div>
                      )}
                      
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => setEditingCollaborator(collaborator)}
                          className="flex items-center space-x-1 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors"
                        >
                          <Edit className="h-3 w-3" />
                          <span>Editar</span>
                        </button>
                        <button
                          onClick={() => handleDeleteCollaborator(collaborator.id)}
                          className="flex items-center space-x-1 px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition-colors"
                        >
                          <Trash2 className="h-3 w-3" />
                          <span>Eliminar</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Edit Cyclist Modal */}
        {editingCyclist && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-800">{t.editCyclist}</h3>
                <button
                  onClick={() => setEditingCyclist(null)}
                  className="text-slate-500 hover:text-slate-700 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
                    <input
                      type="text"
                      value={editingCyclist.name}
                      onChange={(e) => setEditingCyclist({ ...editingCyclist, name: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Alias</label>
                    <input
                      type="text"
                      value={editingCyclist.alias || ''}
                      onChange={(e) => setEditingCyclist({ ...editingCyclist, alias: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={editingCyclist.email}
                      onChange={(e) => setEditingCyclist({ ...editingCyclist, email: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono</label>
                    <input
                      type="tel"
                      value={editingCyclist.phone}
                      onChange={(e) => setEditingCyclist({ ...editingCyclist, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Edad</label>
                    <input
                      type="number"
                      value={editingCyclist.age || ''}
                      onChange={(e) => setEditingCyclist({ ...editingCyclist, age: e.target.value ? parseInt(e.target.value) : undefined })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      min="16"
                      max="100"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Peso (kg)</label>
                    <input
                      type="number"
                      value={editingCyclist.weight || ''}
                      onChange={(e) => setEditingCyclist({ ...editingCyclist, weight: e.target.value ? parseFloat(e.target.value) : undefined })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      min="40"
                      max="150"
                      step="0.1"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={editingCyclist.isAdmin || false}
                      onChange={(e) => setEditingCyclist({ ...editingCyclist, isAdmin: e.target.checked })}
                      className="rounded border-slate-300 text-blue-500 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-slate-700">{t.adminRole}</span>
                  </label>
                  <p className="text-xs text-slate-500 mt-1">{t.adminRoleDescription}</p>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    onClick={() => setEditingCyclist(null)}
                    className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    {t.cancel}
                  </button>
                  <button
                    onClick={handleSaveCyclist}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Save className="h-4 w-4" />
                    <span>{t.saveChanges}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Pass Modal */}
        {editingPass && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-800">{t.editPass}</h3>
                <button
                  onClick={() => setEditingPass(null)}
                  className="text-slate-500 hover:text-slate-700 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
                    <input
                      type="text"
                      value={editingPass.name}
                      onChange={(e) => setEditingPass({ ...editingPass, name: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">{t.country}</label>
                    <input
                      type="text"
                      value={editingPass.country}
                      onChange={(e) => setEditingPass({ ...editingPass, country: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">{t.region}</label>
                    <input
                      type="text"
                      value={editingPass.region}
                      onChange={(e) => setEditingPass({ ...editingPass, region: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Altitud (m)</label>
                    <input
                      type="number"
                      value={editingPass.maxAltitude}
                      onChange={(e) => setEditingPass({ ...editingPass, maxAltitude: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t.imageUrl}</label>
                  <input
                    type="url"
                    value={editingPass.imageUrl}
                    onChange={(e) => setEditingPass({ ...editingPass, imageUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t.description}</label>
                  <textarea
                    value={editingPass.description}
                    onChange={(e) => setEditingPass({ ...editingPass, description: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>
                
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    onClick={() => setEditingPass(null)}
                    className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    {t.cancel}
                  </button>
                  <button
                    onClick={handleSavePass}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Save className="h-4 w-4" />
                    <span>{t.saveChanges}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Brand Modal */}
        {showAddBrandModal && (
          <AddBrandModal
            onClose={() => setShowAddBrandModal(false)}
            onSave={handleAddBrand}
          />
        )}

        {/* Add News Modal */}
        {showAddNewsModal && (
          <AddNewsModal
            onClose={() => setShowAddNewsModal(false)}
            onSave={handleAddNews}
          />
        )}

        {/* Add Collaborator Modal */}
        {showAddCollaboratorModal && (
          <AddCollaboratorModal
            onClose={() => setShowAddCollaboratorModal(false)}
            onSave={handleAddCollaborator}
          />
        )}

        {/* Edit Brand Modal */}
        {editingBrand && (
          <EditBrandModal
            brand={editingBrand}
            onClose={() => setEditingBrand(null)}
            onSave={handleSaveBrand}
            onChange={setEditingBrand}
          />
        )}

        {/* Edit News Modal */}
        {editingNews && (
          <EditNewsModal
            article={editingNews}
            onClose={() => setEditingNews(null)}
            onSave={handleSaveNews}
            onChange={setEditingNews}
          />
        )}

        {/* Edit Collaborator Modal */}
        {editingCollaborator && (
          <EditCollaboratorModal
            collaborator={editingCollaborator}
            onClose={() => setEditingCollaborator(null)}
            onSave={handleSaveCollaborator}
            onChange={setEditingCollaborator}
          />
        )}
      </div>
    </div>
  );
};

// Add Brand Modal Component
const AddBrandModal: React.FC<{
  onClose: () => void;
  onSave: (brand: Omit<Brand, 'id'>) => void;
}> = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState<Omit<Brand, 'id'>>({
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

  const categories = ['Bicicletas', 'Componentes', 'Ropa', 'Accesorios', 'Nutrición', 'Otros'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.description) {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex items-center justify-between">
          <h3 className="text-xl font-semibold text-slate-800">Añadir Nueva Marca</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700">
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Categoría</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">País</label>
              <input
                type="text"
                value={formData.country || ''}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Año de Fundación</label>
              <input
                type="number"
                value={formData.foundedYear || ''}
                onChange={(e) => setFormData({ ...formData, foundedYear: e.target.value ? parseInt(e.target.value) : undefined })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                min="1800"
                max={new Date().getFullYear()}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Descripción <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              rows={3}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">URL del Logo</label>
              <input
                type="url"
                value={formData.logo || ''}
                onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Sitio Web</label>
              <input
                type="url"
                value={formData.website || ''}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="rounded border-slate-300 text-orange-500 focus:ring-orange-500"
              />
              <span className="text-sm text-slate-700">Marca Activa</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="rounded border-slate-300 text-orange-500 focus:ring-orange-500"
              />
              <span className="text-sm text-slate-700">Marca Destacada</span>
            </label>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>Guardar Marca</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Add News Modal Component
const AddNewsModal: React.FC<{
  onClose: () => void;
  onSave: (article: Omit<NewsArticle, 'id'>) => void;
}> = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState<Omit<NewsArticle, 'id'>>({
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

  const categories = ['Competición', 'Equipamiento', 'Rutas', 'Noticias', 'Entrevistas'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title && formData.summary && formData.author) {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex items-center justify-between">
          <h3 className="text-xl font-semibold text-slate-800">Crear Nueva Noticia</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700">
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Título <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Resumen <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              rows={2}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Contenido</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              rows={6}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Autor <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Categoría</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tiempo de Lectura (min)</label>
              <input
                type="number"
                value={formData.readTime}
                onChange={(e) => setFormData({ ...formData, readTime: parseInt(e.target.value) || 5 })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                min="1"
                max="60"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">URL de Imagen</label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">URL Externa (opcional)</label>
              <input
                type="url"
                value={formData.externalUrl || ''}
                onChange={(e) => setFormData({ ...formData, externalUrl: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
          
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="rounded border-slate-300 text-orange-500 focus:ring-orange-500"
              />
              <span className="text-sm text-slate-700">Noticia Destacada</span>
            </label>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>Publicar Noticia</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Add Collaborator Modal Component
const AddCollaboratorModal: React.FC<{
  onClose: () => void;
  onSave: (collaborator: Omit<Collaborator, 'id'>) => void;
}> = ({ onClose, onSave }) => {
  const [newCollaborator, setNewCollaborator] = useState<Omit<Collaborator, 'id'>>({
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
  const [newImageUrl, setNewImageUrl] = useState('');

  const categories = ['Tienda de Bicicletas', 'Hotel', 'Restaurante', 'Guía Turístico', 'Equipamiento', 'Otros'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCollaborator.name && newCollaborator.description) {
      onSave(newCollaborator);
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
      setNewImageUrl('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex items-center justify-between">
          <h3 className="text-xl font-semibold text-slate-800">Añadir Nuevo Colaborador</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700">
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newCollaborator.name}
                onChange={(e) => setNewCollaborator({ ...newCollaborator, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Categoría</label>
              <select
                value={newCollaborator.category}
                onChange={(e) => setNewCollaborator({ ...newCollaborator, category: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Descripción <span className="text-red-500">*</span>
            </label>
            <textarea
              value={newCollaborator.description}
              onChange={(e) => setNewCollaborator({ ...newCollaborator, description: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              rows={3}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={newCollaborator.contactInfo.email || ''}
                onChange={(e) => setNewCollaborator({ 
                  ...newCollaborator, 
                  contactInfo: { ...newCollaborator.contactInfo, email: e.target.value }
                })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono</label>
              <input
                type="tel"
                value={newCollaborator.contactInfo.phone || ''}
                onChange={(e) => setNewCollaborator({ 
                  ...newCollaborator, 
                  contactInfo: { ...newCollaborator.contactInfo, phone: e.target.value }
                })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Sitio Web</label>
              <input
                type="url"
                value={newCollaborator.contactInfo.website || ''}
                onChange={(e) => setNewCollaborator({ 
                  ...newCollaborator, 
                  contactInfo: { ...newCollaborator.contactInfo, website: e.target.value }
                })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Dirección</label>
              <input
                type="text"
                value={newCollaborator.contactInfo.address || ''}
                onChange={(e) => setNewCollaborator({ 
                  ...newCollaborator, 
                  contactInfo: { ...newCollaborator.contactInfo, address: e.target.value }
                })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
          
          {/* Images Section */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Imágenes del Colaborador
            </label>
            
            {/* Current Images */}
            {newCollaborator.images.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-slate-600 mb-2">Imágenes actuales ({newCollaborator.images.length}):</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {newCollaborator.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img 
                        src={image} 
                        alt={`Imagen ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border border-slate-300"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updatedImages = newCollaborator.images.filter((_, i) => i !== index);
                          setNewCollaborator({ ...newCollaborator, images: updatedImages });
                        }}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Add Image by URL */}
            <div className="space-y-3">
              <div className="flex space-x-3">
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newImageUrl.trim()) {
                      setNewCollaborator({
                        ...newCollaborator,
                        images: [...newCollaborator.images, newImageUrl.trim()]
                      });
                      setNewImageUrl('');
                    }
                  }}
                  disabled={!newImageUrl.trim()}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Añadir</span>
                </button>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="flex-1 h-px bg-slate-300"></div>
                <span className="text-sm text-slate-500">o</span>
                <div className="flex-1 h-px bg-slate-300"></div>
              </div>
              
              {/* Upload Image File */}
              <div>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    // Validar tipo de archivo
                    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
                    if (!validTypes.includes(file.type)) {
                      alert('Por favor selecciona un archivo de imagen válido (JPG, PNG, WEBP)');
                      return;
                    }

                    // Validar tamaño (5MB máximo)
                    const maxSize = 5 * 1024 * 1024; // 5MB en bytes
                    if (file.size > maxSize) {
                      alert('El archivo es demasiado grande. El tamaño máximo es 5MB');
                      return;
                    }

                    // Convertir a Base64
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      const base64String = event.target?.result as string;
                      setNewCollaborator({
                        ...newCollaborator,
                        images: [...newCollaborator.images, base64String]
                      });
                      // Reset file input
                      e.target.value = '';
                    };
                    reader.onerror = () => {
                      alert('Error al leer el archivo. Por favor intenta de nuevo.');
                    };
                    reader.readAsDataURL(file);
                  }}
                  className="hidden"
                  id="collaborator-image-upload"
                />
                <label
                  htmlFor="collaborator-image-upload"
                  className="w-full flex items-center justify-center px-4 py-3 border-2 border-dashed border-slate-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer"
                >
                  <div className="text-center">
                    <Camera className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                    <p className="text-sm text-slate-600">
                      <span className="font-medium text-blue-600">Subir imagen</span> o arrastra aquí
                    </p>
                    <p className="text-xs text-slate-500">JPG, PNG, WEBP hasta 5MB</p>
                  </div>
                </label>
              </div>
              
              {/* Tips */}
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start">
                  <Camera className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                  <div className="text-sm text-blue-700">
                    <p className="font-medium mb-1">Consejos para las imágenes:</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>Añade mínimo 2 imágenes para crear un carrusel</li>
                      <li>Usa imágenes de buena calidad (mínimo 800x600px)</li>
                      <li>Las imágenes se mostrarán en el orden que las añadas</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={newCollaborator.isActive}
                onChange={(e) => setNewCollaborator({ ...newCollaborator, isActive: e.target.checked })}
                className="rounded border-slate-300 text-orange-500 focus:ring-orange-500"
              />
              <span className="text-sm text-slate-700">Colaborador Activo</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={newCollaborator.featured}
                onChange={(e) => setNewCollaborator({ ...newCollaborator, featured: e.target.checked })}
                className="rounded border-slate-300 text-orange-500 focus:ring-orange-500"
              />
              <span className="text-sm text-slate-700">Colaborador Destacado</span>
            </label>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>Guardar Colaborador</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Edit Brand Modal Component
const EditBrandModal: React.FC<{
  brand: Brand;
  onClose: () => void;
  onSave: () => void;
  onChange: (brand: Brand) => void;
}> = ({ brand, onClose, onSave, onChange }) => {
  const categories = ['Bicicletas', 'Componentes', 'Ropa', 'Accesorios', 'Nutrición', 'Otros'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex items-center justify-between">
          <h3 className="text-xl font-semibold text-slate-800">Editar Marca</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700">
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
              <input
                type="text"
                value={brand.name}
                onChange={(e) => onChange({ ...brand, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Categoría</label>
              <select
                value={brand.category}
                onChange={(e) => onChange({ ...brand, category: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
            <textarea
              value={brand.description}
              onChange={(e) => onChange({ ...brand, description: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              rows={3}
            />
          </div>
          
          <div className="flex items-center space-x-6">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={brand.isActive}
                onChange={(e) => onChange({ ...brand, isActive: e.target.checked })}
                className="rounded border-slate-300 text-orange-500 focus:ring-orange-500"
              />
              <span className="text-sm text-slate-700">Marca Activa</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={brand.featured}
                onChange={(e) => onChange({ ...brand, featured: e.target.checked })}
                className="rounded border-slate-300 text-orange-500 focus:ring-orange-500"
              />
              <span className="text-sm text-slate-700">Marca Destacada</span>
            </label>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>Guardar Cambios</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Edit News Modal Component
const EditNewsModal: React.FC<{
  article: NewsArticle;
  onClose: () => void;
  onSave: () => void;
  onChange: (article: NewsArticle) => void;
}> = ({ article, onClose, onSave, onChange }) => {
  const categories = ['Competición', 'Equipamiento', 'Rutas', 'Noticias', 'Entrevistas'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex items-center justify-between">
          <h3 className="text-xl font-semibold text-slate-800">Editar Noticia</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700">
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Título</label>
            <input
              type="text"
              value={article.title}
              onChange={(e) => onChange({ ...article, title: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Resumen</label>
            <textarea
              value={article.summary}
              onChange={(e) => onChange({ ...article, summary: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              rows={2}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Autor</label>
              <input
                type="text"
                value={article.author}
                onChange={(e) => onChange({ ...article, author: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Categoría</label>
              <select
                value={article.category}
                onChange={(e) => onChange({ ...article, category: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={article.featured}
                onChange={(e) => onChange({ ...article, featured: e.target.checked })}
                className="rounded border-slate-300 text-orange-500 focus:ring-orange-500"
              />
              <span className="text-sm text-slate-700">Noticia Destacada</span>
            </label>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>Guardar Cambios</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Edit Collaborator Modal Component
const EditCollaboratorModal: React.FC<{
  collaborator: Collaborator;
  onClose: () => void;
  onSave: () => void;
  onChange: (collaborator: Collaborator) => void;
}> = ({ collaborator, onClose, onSave, onChange }) => {
  const categories = ['Tienda de Bicicletas', 'Hotel', 'Restaurante', 'Guía Turístico', 'Equipamiento', 'Otros'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex items-center justify-between">
          <h3 className="text-xl font-semibold text-slate-800">Editar Colaborador</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700">
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
              <input
                type="text"
                value={collaborator.name}
                onChange={(e) => onChange({ ...collaborator, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Categoría</label>
              <select
                value={collaborator.category}
                onChange={(e) => onChange({ ...collaborator, category: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
            <textarea
              value={collaborator.description}
              onChange={(e) => onChange({ ...collaborator, description: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              rows={3}
            />
          </div>
          
          <div className="flex items-center space-x-6">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={collaborator.isActive}
                onChange={(e) => onChange({ ...collaborator, isActive: e.target.checked })}
                className="rounded border-slate-300 text-orange-500 focus:ring-orange-500"
              />
              <span className="text-sm text-slate-700">Colaborador Activo</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={collaborator.featured}
                onChange={(e) => onChange({ ...collaborator, featured: e.target.checked })}
                className="rounded border-slate-300 text-orange-500 focus:ring-orange-500"
              />
              <span className="text-sm text-slate-700">Colaborador Destacado</span>
            </label>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>Guardar Cambios</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};