import React, { useState } from 'react';
import { MountainPass } from '../types';
import { Translation } from '../i18n/translations';
import { exportMountainPasses } from '../utils/excelExport';
import { createPassInDB } from '../utils/passesService';
import { getCurrentUser } from '../utils/cyclistStorage';
import { 
  Database, 
  Plus, 
  Minus, 
  Check, 
  Search, 
  Filter,
  Mountain,
  TrendingUp,
  MapPin,
  Flag,
  X,
  Save,
  Download
} from 'lucide-react';

interface DatabaseViewProps {
  allPasses: MountainPass[];
  userPasses: MountainPass[];
  onAddPass: (pass: MountainPass) => void;
  onRemovePass: (passId: string) => void;
  t: Translation;
}

export const DatabaseView: React.FC<DatabaseViewProps> = ({
  allPasses,
  userPasses,
  onAddPass,
  onRemovePass,
  t
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPass, setNewPass] = useState<Partial<MountainPass>>({
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
    famousWinners: [],
    imageUrl: '',
    category: 'Otros'
  });

  const userPassIds = new Set(userPasses.map(p => p.id));
  const availableCategories = [...new Set(allPasses.map(pass => pass.category))];

  const filteredPasses = allPasses.filter(pass => {
    const matchesSearch = pass.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pass.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pass.region.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDifficulty = filterDifficulty === 'all' || pass.difficulty === filterDifficulty;
    const matchesCategory = filterCategory === 'all' || pass.category === filterCategory;
    const isInUserPasses = userPassIds.has(pass.id);
    const matchesAvailability = !showOnlyAvailable || !isInUserPasses;
    
    return matchesSearch && matchesDifficulty && matchesCategory && matchesAvailability;
  });

  const getDifficultyText = (difficulty: string) => {
    const difficultyMap: Record<string, keyof Translation> = {
      'Cuarta': 'cuarta',
      'Tercera': 'tercera',
      'Segunda': 'segunda',
      'Primera': 'primera',
      'Especial': 'especial',
    };
    return t[difficultyMap[difficulty]] || difficulty;
  };

  const getCountryText = (country: string) => {
    const countryMap: Record<string, keyof Translation> = {
      'France': 'france',
      'Italy': 'italy',
      'Spain': 'spain',
      'England': 'england'
    };
    return t[countryMap[country]] || country;
  };

  const getRegionText = (region: string) => {
    const regionMap: Record<string, keyof Translation> = {
      'Provence': 'provence',
      'Lombardy': 'lombardy',
      'Asturias': 'asturias',
      'Lake District': 'lakeDistrict',
      'Friuli': 'friuli',
      'Sierra Nevada': 'sierraNevada'
    };
    return t[regionMap[region]] || region;
  };

  const difficultyColors = {
    Cuarta: 'bg-green-100 text-green-800',
    Tercera: 'bg-blue-100 text-blue-800',
    Segunda: 'bg-yellow-100 text-yellow-800',
    Primera: 'bg-orange-100 text-orange-800',
    Especial: 'bg-red-100 text-red-800',
  };

  const categoryColors = {
    Alpes: 'bg-blue-100 text-blue-800 border-blue-300',
    Pirineos: 'bg-purple-100 text-purple-800 border-purple-300',
    Dolomitas: 'bg-pink-100 text-pink-800 border-pink-300',
    Andes: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    Otros: 'bg-gray-100 text-gray-800 border-gray-300',
    Provenza: 'bg-yellow-100 text-yellow-800 border-yellow-300'
  };

  const handleAddNewPass = async () => {
    if (!newPass.name) {
      alert('Por favor completa al menos el nombre del puerto');
      return;
    }

    const passToAdd: MountainPass = {
      id: `custom-${Date.now()}`,
      name: newPass.name!,
      country: newPass.country || 'Sin especificar',
      region: newPass.region || 'Sin especificar',
      maxAltitude: newPass.maxAltitude || 0,
      elevationGain: newPass.elevationGain || 0,
      averageGradient: newPass.averageGradient || 0,
      maxGradient: newPass.maxGradient || 0,
      distance: newPass.distance || 0,
      difficulty: newPass.difficulty as any || 'Cuarta',
      coordinates: newPass.coordinates || { lat: 0, lng: 0 },
      description: newPass.description || '',
      famousWinners: [],
      imageUrl: newPass.imageUrl || 'https://images.pexels.com/photos/1666021/pexels-photo-1666021.jpeg',
      category: newPass.category || 'Otros'
    };

    const user = await getCurrentUser();
    const result = await createPassInDB(passToAdd, user?.email);

    alert(result.message);

    if (result.success) {
      onAddPass(passToAdd);
      setShowAddModal(false);
      setNewPass({
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
        famousWinners: [],
        imageUrl: '',
        category: 'Otros'
      });
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
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
    reader.onload = (e) => {
      const base64String = e.target?.result as string;
      setNewPass({ ...newPass, imageUrl: base64String });
    };
    reader.onerror = () => {
      alert('Error al leer el archivo. Por favor intenta de nuevo.');
    };
    reader.readAsDataURL(file);
  };
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="flex items-center">
            <Database className="h-8 w-8 text-orange-500 mr-3" />
            <div>
              <h2 className="text-2xl font-bold text-slate-800">{t.databaseTitle}</h2>
              <p className="text-slate-600">{t.databaseDescription}</p>
            </div>
          </div>
        </div>
        
        {/* Add New Pass Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
          >
            <Plus className="h-5 w-5" />
            <span>Añadir Nuevo Puerto</span>
          </button>
        </div>

        <div className="bg-white rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-orange-600">{allPasses.length}</p>
              <p className="text-sm text-slate-600">{t.availablePasses}</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{userPasses.length}</p>
              <p className="text-sm text-slate-600">{t.mySelectedPasses}</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">{allPasses.length - userPasses.length}</p>
              <p className="text-sm text-slate-600">Sin Seleccionar</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
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
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 w-full sm:w-auto">
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
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">{t.allCategories}</option>
              {availableCategories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            
            <label className="flex items-center space-x-2 w-full sm:col-span-2 lg:col-span-1">
              <input
                type="checkbox"
                checked={showOnlyAvailable}
                onChange={(e) => setShowOnlyAvailable(e.target.checked)}
                className="rounded border-slate-300 text-orange-500 focus:ring-orange-500"
              />
              <span className="text-sm text-slate-700">Solo Disponibles</span>
            </label>
          </div>
        </div>
      </div>
      
      {/* Passes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPasses.map(pass => {
          const isInUserPasses = userPassIds.has(pass.id);
          
          return (
            <div key={pass.id} className={`bg-white rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl overflow-hidden ${
              isInUserPasses ? 'ring-2 ring-green-400' : ''
            }`}>
              <div className="relative h-48">
                <img 
                  src={pass.imageUrl} 
                  alt={pass.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 flex space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${categoryColors[pass.category] || categoryColors.Otros}`}>
                    {pass.category}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[pass.difficulty]}`}>
                    {getDifficultyText(pass.difficulty)}
                  </span>
                </div>
                {isInUserPasses && (
                  <div className="absolute top-3 left-3">
                    <Check className="h-8 w-8 text-green-500 bg-white rounded-full p-1" />
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 mb-1">{pass.name}</h3>
                    <div className="flex items-center text-slate-600 text-sm">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{getRegionText(pass.region)}, {getCountryText(pass.country)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <Mountain className="h-4 w-4 text-orange-500" />
                    <div>
                      <p className="text-xs text-slate-500">{t.altitude}</p>
                      <p className="text-sm font-semibold">{pass.maxAltitude}m</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-orange-500" />
                    <div>
                      <p className="text-xs text-slate-500">{t.elevation}</p>
                      <p className="text-sm font-semibold">+{pass.elevationGain}m</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Flag className="h-4 w-4 text-orange-500" />
                    <div>
                      <p className="text-xs text-slate-500">{t.distance}</p>
                      <p className="text-sm font-semibold">{pass.distance}km</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-orange-500" />
                    <div>
                      <p className="text-xs text-slate-500">{t.avgGradient}</p>
                      <p className="text-sm font-semibold">{pass.averageGradient}%</p>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => isInUserPasses ? onRemovePass(pass.id) : onAddPass(pass)}
                  className={`w-full py-2 px-4 rounded-lg transition-all duration-200 font-medium flex items-center justify-center space-x-2 ${
                    isInUserPasses 
                      ? 'bg-red-500 hover:bg-red-600 text-white' 
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  {isInUserPasses ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  <span>
                    {isInUserPasses ? t.removeFromMyPasses : t.addToMyPasses}
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
      
      {filteredPasses.length === 0 && (
        <div className="text-center py-12">
          <Database className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <p className="text-xl text-slate-600 mb-2">{t.noPassesFound}</p>
          <p className="text-slate-500">{t.noPassesFoundDesc}</p>
        </div>
      )}

      {/* Add New Pass Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-xl font-semibold text-slate-800">Añadir Nuevo Puerto</h3>
              <button
                onClick={() => setShowAddModal(false)}
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
                    value={newPass.name || ''}
                    onChange={(e) => setNewPass({ ...newPass, name: e.target.value })}
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
                    value={newPass.country || ''}
                    onChange={(e) => setNewPass({ ...newPass, country: e.target.value })}
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
                    value={newPass.region || ''}
                    onChange={(e) => setNewPass({ ...newPass, region: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="Ej: Alpes"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Categoría</label>
                  <select
                    value={newPass.category || 'Otros'}
                    onChange={(e) => setNewPass({ ...newPass, category: e.target.value })}
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
                    value={newPass.maxAltitude || ''}
                    onChange={(e) => setNewPass({ ...newPass, maxAltitude: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="Ej: 2645"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Desnivel (m)</label>
                  <input
                    type="number"
                    value={newPass.elevationGain || ''}
                    onChange={(e) => setNewPass({ ...newPass, elevationGain: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="Ej: 1200"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Distancia (km)</label>
                  <input
                    type="number"
                    value={newPass.distance || ''}
                    onChange={(e) => setNewPass({ ...newPass, distance: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="Ej: 18.1"
                    step="0.1"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Pendiente Media (%)</label>
                  <input
                    type="number"
                    value={newPass.averageGradient || ''}
                    onChange={(e) => setNewPass({ ...newPass, averageGradient: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="Ej: 6.9"
                    step="0.1"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Pendiente Máxima (%)</label>
                  <input
                    type="number"
                    value={newPass.maxGradient || ''}
                    onChange={(e) => setNewPass({ ...newPass, maxGradient: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="Ej: 13.0"
                    step="0.1"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Dificultad UCI</label>
                  <select
                    value={newPass.difficulty || 'Cuarta'}
                    onChange={(e) => setNewPass({ ...newPass, difficulty: e.target.value as any })}
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
                    value={newPass.coordinates?.lat || ''}
                    onChange={(e) => setNewPass({ 
                      ...newPass, 
                      coordinates: { 
                        ...newPass.coordinates, 
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
                    value={newPass.coordinates?.lng || ''}
                    onChange={(e) => setNewPass({ 
                      ...newPass, 
                      coordinates: { 
                        ...newPass.coordinates, 
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
                <div className="space-y-3">
                  <input
                    type="url"
                    value={newPass.imageUrl || ''}
                    onChange={(e) => setNewPass({ ...newPass, imageUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="https://images.pexels.com/..."
                  />
                  
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 h-px bg-slate-300"></div>
                    <span className="text-sm text-slate-500">o</span>
                    <div className="flex-1 h-px bg-slate-300"></div>
                  </div>
                  
                  <div>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="w-full flex items-center justify-center px-4 py-2 border-2 border-dashed border-slate-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors cursor-pointer"
                    >
                      <div className="text-center">
                        <svg className="mx-auto h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="text-sm text-slate-600">
                          <span className="font-medium text-orange-600">Subir imagen</span> o arrastra aquí
                        </p>
                        <p className="text-xs text-slate-500">JPG, PNG, WEBP hasta 5MB</p>
                      </div>
                    </label>
                  </div>
                  
                  {newPass.imageUrl && (
                    <div className="mt-3">
                      <p className="text-sm text-slate-600 mb-2">Vista previa:</p>
                      <img 
                        src={newPass.imageUrl} 
                        alt="Vista previa"
                        className="w-full h-32 object-cover rounded-lg border border-slate-300"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
                <textarea
                  value={newPass.description || ''}
                  onChange={(e) => setNewPass({ ...newPass, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  rows={3}
                  placeholder="Descripción del puerto de montaña..."
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddNewPass}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <Save className="h-4 w-4" />
                  <span>Añadir Puerto</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};