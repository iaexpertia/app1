import React, { useState, useEffect } from 'react';
import { MountainPass, Cyclist, Collaborator } from '../types';
import { Brand } from '../types';
import { Translation } from '../i18n/translations';
import { 
  loadCyclists, 
  saveCyclists, 
  removeCyclist, 
  updateCyclist 
} from '../utils/cyclistStorage';
import {
  loadCollaborators,
  saveCollaborators,
  addCollaborator,
  removeCollaborator,
  loadCategories,
  saveCategories,
  addCategory,
  removeCategory
} from '../utils/collaboratorStorage';
import {
  loadBrands,
  saveBrands,
  addBrand,
  removeBrand,
  loadBrandCategories,
  saveBrandCategories,
  addBrandCategory,
  removeBrandCategory
} from '../utils/brandsStorage';
import { defaultBrands } from '../data/defaultBrands';
import { 
  Settings, 
  Users, 
  Mountain, 
  Edit, 
  Trash2, 
  Save, 
  X,
  Plus,
  Store,
  Hotel,
  UtensilsCrossed,
  MapPin,
  User,
  Tag,
  Award as BrandIcon,
  Globe2,
  Calendar,
  MapPin as LocationIcon
} from 'lucide-react';

interface AdminPanelProps {
  passes: MountainPass[];
  onUpdatePass: (pass: MountainPass) => void;
  t: Translation;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ passes, onUpdatePass, t }) => {
  const [activeSection, setActiveSection] = useState<'cyclists' | 'passes' | 'collaborators' | 'brands'>('cyclists');
  const [cyclists, setCyclists] = useState<Cyclist[]>([]);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [brandCategories, setBrandCategories] = useState<string[]>([]);
  const [editingCyclist, setEditingCyclist] = useState<Cyclist | null>(null);
  const [editingPass, setEditingPass] = useState<MountainPass | null>(null);
  const [showAddCollaborator, setShowAddCollaborator] = useState(false);
  const [showAddBrand, setShowAddBrand] = useState(false);
  const [newCollaborator, setNewCollaborator] = useState<Partial<Collaborator>>({
    name: '',
    category: 'Tienda de Bicicletas',
    description: '',
    contactInfo: {},
    images: [],
    isActive: true,
    featured: false
  });
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
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCategoryInput, setNewCategoryInput] = useState('');
  const [newCategoryError, setNewCategoryError] = useState('');
  const [newBrandCategoryName, setNewBrandCategoryName] = useState('');
  const [brandCategoryError, setBrandCategoryError] = useState('');
  const [showAddBrandCategoryModal, setShowAddBrandCategoryModal] = useState(false);
  const [newBrandCategoryInput, setNewBrandCategoryInput] = useState('');
  const [newBrandCategoryError, setNewBrandCategoryError] = useState('');
  const [newSpecialty, setNewSpecialty] = useState('');

  useEffect(() => {
    setCyclists(loadCyclists());
    setCollaborators(loadCollaborators());
    const loadedBrands = loadBrands();
    if (loadedBrands.length === 0) {
      setBrands(defaultBrands);
      saveBrands(defaultBrands);
    } else {
      setBrands(loadedBrands);
    }
    setCategories(loadCategories());
    setBrandCategories(loadBrandCategories());
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

  const handleAddCollaborator = () => {
    if (!newCollaborator.name || !newCollaborator.category || !newCollaborator.description) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    const collaboratorToAdd: Collaborator = {
      id: Date.now().toString(),
      name: newCollaborator.name!,
      category: newCollaborator.category as any,
      description: newCollaborator.description!,
      contactInfo: newCollaborator.contactInfo || {},
      images: newCollaborator.images || [],
      isActive: newCollaborator.isActive || true,
      featured: newCollaborator.featured || false
    };

    addCollaborator(collaboratorToAdd);
    setCollaborators(loadCollaborators());
    setShowAddCollaborator(false);
    setNewCollaborator({
      name: '',
      category: 'Tienda de Bicicletas',
      description: '',
      contactInfo: {},
      images: [],
      isActive: true,
      featured: false
    });
  };

  const handleAddBrand = () => {
    if (!newBrand.name || !newBrand.category || !newBrand.description) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    const brandToAdd: Brand = {
      id: Date.now().toString(),
      name: newBrand.name!,
      category: newBrand.category as any,
      description: newBrand.description!,
      logo: newBrand.logo || '',
      website: newBrand.website || '',
      country: newBrand.country || '',
      foundedYear: newBrand.foundedYear,
      specialties: newBrand.specialties || [],
      isActive: newBrand.isActive || true,
      featured: newBrand.featured || false
    };

    addBrand(brandToAdd);
    setBrands(loadBrands());
    setShowAddBrand(false);
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

  const handleAddCategory = () => {
    console.log('handleAddCategory called with:', newCategoryName);
    console.log('Current categories:', categories);
    
    const trimmedCategory = newCategoryName.trim();
    
    if (!trimmedCategory) {
      setCategoryError('El nombre de la categoría es obligatorio');
      return;
    }

    // Verificar si la categoría ya existe (case-insensitive)
    const categoryExists = categories.some(cat => 
      cat.toLowerCase() === trimmedCategory.toLowerCase()
    );
    
    console.log('Category exists:', categoryExists);

    if (categoryExists) {
      console.log('Showing alert for duplicate category');
      alert('CATEGORÍA EXISTENTE: Ya existe una categoría con ese nombre');
      setCategoryError('Ya existe una categoría con ese nombre');
      return;
    }

    try {
      addCategory(trimmedCategory);
      setCategories(loadCategories());
      setNewCategoryName('');
      setCategoryError('');
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Error al añadir la categoría');
    }
  };

  const handleAddCategoryFromModal = () => {
    console.log('handleAddCategoryFromModal called with:', newCategoryInput);
    console.log('Current categories:', categories);
    
    const trimmedCategory = newCategoryInput.trim();
    
    if (!trimmedCategory) {
      setNewCategoryError('El nombre de la categoría es obligatorio');
      return;
    }

    // Verificar si la categoría ya existe (case-insensitive)
    const categoryExists = categories.some(cat => 
      cat.toLowerCase() === trimmedCategory.toLowerCase()
    );
    
    console.log('Category exists:', categoryExists);

    if (categoryExists) {
      console.log('Showing alert for duplicate category');
      alert('CATEGORÍA EXISTENTE: Ya existe una categoría con ese nombre');
      setNewCategoryError('Ya existe una categoría con ese nombre');
      return;
    }

    try {
      addCategory(trimmedCategory);
      setCategories(loadCategories());
      setNewCollaborator({ ...newCollaborator, category: trimmedCategory });
      setShowAddCategoryModal(false);
      setNewCategoryInput('');
      setNewCategoryError('');
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Error al añadir la categoría');
    }
  };

  const handleRemoveCategory = (categoryToRemove: string) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar la categoría "${categoryToRemove}"?`)) {
      removeCategory(categoryToRemove);
      setCategories(loadCategories());
    }
  };

  const handleAddBrandCategory = () => {
    const trimmedCategory = newBrandCategoryName.trim();
    
    if (!trimmedCategory) {
      setBrandCategoryError('El nombre de la categoría es obligatorio');
      return;
    }

    const categoryExists = brandCategories.some(cat => 
      cat.toLowerCase() === trimmedCategory.toLowerCase()
    );

    if (categoryExists) {
      alert('CATEGORÍA EXISTENTE: Ya existe una categoría con ese nombre');
      setBrandCategoryError('Ya existe una categoría con ese nombre');
      return;
    }

    try {
      addBrandCategory(trimmedCategory);
      setBrandCategories(loadBrandCategories());
      setNewBrandCategoryName('');
      setBrandCategoryError('');
    } catch (error) {
      console.error('Error adding brand category:', error);
      alert('Error al añadir la categoría');
    }
  };

  const handleAddBrandCategoryFromModal = () => {
    const trimmedCategory = newBrandCategoryInput.trim();
    
    if (!trimmedCategory) {
      setNewBrandCategoryError('El nombre de la categoría es obligatorio');
      return;
    }

    const categoryExists = brandCategories.some(cat => 
      cat.toLowerCase() === trimmedCategory.toLowerCase()
    );

    if (categoryExists) {
      alert('CATEGORÍA EXISTENTE: Ya existe una categoría con ese nombre');
      setNewBrandCategoryError('Ya existe una categoría con ese nombre');
      return;
    }

    try {
      addBrandCategory(trimmedCategory);
      setBrandCategories(loadBrandCategories());
      setNewBrand({ ...newBrand, category: trimmedCategory });
      setShowAddBrandCategoryModal(false);
      setNewBrandCategoryInput('');
      setNewBrandCategoryError('');
    } catch (error) {
      console.error('Error adding brand category:', error);
      alert('Error al añadir la categoría');
    }
  };

  const handleRemoveBrandCategory = (categoryToRemove: string) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar la categoría "${categoryToRemove}"?`)) {
      removeBrandCategory(categoryToRemove);
      setBrandCategories(loadBrandCategories());
    }
  };

  const handleAddSpecialty = () => {
    if (newSpecialty.trim() && !newBrand.specialties?.includes(newSpecialty.trim())) {
      setNewBrand({
        ...newBrand,
        specialties: [...(newBrand.specialties || []), newSpecialty.trim()]
      });
      setNewSpecialty('');
    }
  };

  const handleRemoveSpecialty = (specialty: string) => {
    setNewBrand({
      ...newBrand,
      specialties: newBrand.specialties?.filter(s => s !== specialty) || []
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Tienda de Bicicletas': return Store;
      case 'Hotel': return Hotel;
      case 'Restaurante': return UtensilsCrossed;
      case 'Guía Turístico': return MapPin;
      default: return Store;
    }
  };

  const getBrandCategoryIcon = (category: string) => {
    switch (category) {
      case 'Bicicletas': return BrandIcon;
      case 'Componentes': return Settings;
      case 'Ropa': return User;
      case 'Accesorios': return Plus;
      case 'Nutrición': return UtensilsCrossed;
      default: return Tag;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Settings className="h-8 w-8 text-orange-500 mr-3" />
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{t.adminPanel}</h2>
            <p className="text-slate-600">Panel de administración para gestionar ciclistas, puertos y colaboradores</p>
          </div>
        </div>
        
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveSection('cyclists')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeSection === 'cyclists'
                ? 'bg-orange-500 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Users className="h-4 w-4 inline mr-2" />
            {t.manageCyclists}
          </button>
          <button
            onClick={() => setActiveSection('passes')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeSection === 'passes'
                ? 'bg-orange-500 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Mountain className="h-4 w-4 inline mr-2" />
            {t.managePasses}
          </button>
          <button
            onClick={() => setActiveSection('collaborators')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeSection === 'collaborators'
                ? 'bg-orange-500 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Store className="h-4 w-4 inline mr-2" />
            Colaboradores
          </button>
          <button
            onClick={() => setActiveSection('brands')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeSection === 'brands'
                ? 'bg-orange-500 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Tag className="h-4 w-4 inline mr-2" />
            Marcas
          </button>
        </div>
      </div>

      {/* Cyclists Section */}
      {activeSection === 'cyclists' && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-slate-800">{t.registeredCyclists}</h3>
            <span className="text-sm text-slate-600">{cyclists.length} {t.totalCyclists}</span>
          </div>
          
          {cyclists.length === 0 ? (
            <p className="text-center text-slate-500 py-8">{t.noCyclists}</p>
          ) : (
            <div className="space-y-4">
              {cyclists.map(cyclist => (
                <div key={cyclist.id} className="border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-slate-800">{cyclist.name}</h4>
                      <p className="text-sm text-slate-600">{cyclist.email}</p>
                      {cyclist.isAdmin && (
                        <span className="inline-block px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full mt-1">
                          Administrador
                        </span>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingCyclist(cyclist)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCyclist(cyclist.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Passes Section */}
      {activeSection === 'passes' && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-slate-800">{t.managePasses}</h3>
            <span className="text-sm text-slate-600">{passes.length} puertos totales</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {passes.map(pass => (
              <div key={pass.id} className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-slate-800">{pass.name}</h4>
                  <button
                    onClick={() => setEditingPass(pass)}
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-sm text-slate-600">{pass.country}, {pass.region}</p>
                <p className="text-sm text-slate-600">{pass.maxAltitude}m - {pass.difficulty}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Collaborators Section */}
      {activeSection === 'collaborators' && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-slate-800">Gestionar Colaboradores</h3>
            <button
              onClick={() => setShowAddCollaborator(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Añadir Colaborador</span>
            </button>
          </div>

          {/* Categories Management */}
          <div className="mb-8 p-4 bg-slate-50 rounded-lg">
            <h4 className="text-lg font-semibold text-slate-800 mb-4">Gestionar Categorías</h4>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {categories.map(category => (
                <div key={category} className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg border">
                  <span className="text-sm font-medium">{category}</span>
                  <button
                    onClick={() => handleRemoveCategory(category)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
            
            <div className="flex space-x-2">
              <div className="flex-1">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => {
                    setNewCategoryName(e.target.value);
                    setCategoryError('');
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 ${
                    categoryError ? 'border-red-500' : 'border-slate-300'
                  }`}
                  placeholder="Nombre de nueva categoría"
                />
                {categoryError && (
                  <p className="text-red-500 text-sm mt-1">{categoryError}</p>
                )}
              </div>
              <button
                onClick={handleAddCategory}
                disabled={!!categoryError}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  categoryError
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                Añadir
              </button>
            </div>
          </div>
          
          <div className="space-y-4">
            {collaborators.map(collaborator => {
              const Icon = getCategoryIcon(collaborator.category);
              return (
                <div key={collaborator.id} className="border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Icon className="h-6 w-6 text-orange-500" />
                      <div>
                        <h4 className="font-semibold text-slate-800">{collaborator.name}</h4>
                        <p className="text-sm text-slate-600">{collaborator.category}</p>
                        <p className="text-sm text-slate-500">{collaborator.description}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => removeCollaborator(collaborator.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Brands Section */}
      {activeSection === 'brands' && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-slate-800">Gestionar Marcas</h3>
            <button
              onClick={() => setShowAddBrand(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Añadir Marca</span>
            </button>
          </div>

          {/* Brand Categories Management */}
          <div className="mb-8 p-4 bg-slate-50 rounded-lg">
            <h4 className="text-lg font-semibold text-slate-800 mb-4">Gestionar Categorías de Marcas</h4>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {brandCategories.map(category => (
                <div key={category} className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg border">
                  <span className="text-sm font-medium">{category}</span>
                  <button
                    onClick={() => handleRemoveBrandCategory(category)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
            
            <div className="flex space-x-2">
              <div className="flex-1">
                <input
                  type="text"
                  value={newBrandCategoryName}
                  onChange={(e) => {
                    setNewBrandCategoryName(e.target.value);
                    setBrandCategoryError('');
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 ${
                    brandCategoryError ? 'border-red-500' : 'border-slate-300'
                  }`}
                  placeholder="Nombre de nueva categoría de marca"
                />
                {brandCategoryError && (
                  <p className="text-red-500 text-sm mt-1">{brandCategoryError}</p>
                )}
              </div>
              <button
                onClick={handleAddBrandCategory}
                disabled={!!brandCategoryError}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  brandCategoryError
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                Añadir
              </button>
            </div>
          </div>
          
          <div className="space-y-4">
            {brands.map(brand => {
              const Icon = getBrandCategoryIcon(brand.category);
              return (
                <div key={brand.id} className="border border-slate-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      {brand.logo && (
                        <img 
                          src={brand.logo} 
                          alt={brand.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <Icon className="h-6 w-6 text-orange-500" />
                          <div>
                            <h4 className="font-semibold text-slate-800 text-lg">{brand.name}</h4>
                            <p className="text-sm text-slate-600">{brand.category}</p>
                          </div>
                          {brand.featured && (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                              Destacada
                            </span>
                          )}
                        </div>
                        
                        <p className="text-sm text-slate-600 mb-2">{brand.description}</p>
                        
                        <div className="flex flex-wrap gap-4 text-xs text-slate-500 mb-2">
                          {brand.country && (
                            <span className="flex items-center">
                              <LocationIcon className="h-3 w-3 mr-1" />
                              {brand.country}
                            </span>
                          )}
                          {brand.foundedYear && (
                            <span className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {brand.foundedYear}
                            </span>
                          )}
                          {brand.website && (
                            <a 
                              href={brand.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center text-blue-600 hover:text-blue-800"
                            >
                              <Globe2 className="h-3 w-3 mr-1" />
                              Web
                            </a>
                          )}
                        </div>
                        
                        {brand.specialties.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {brand.specialties.map((specialty, index) => (
                              <span 
                                key={index}
                                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                              >
                                {specialty}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => removeBrand(brand.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

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
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t.name}</label>
                <input
                  type="text"
                  value={editingCyclist.name}
                  onChange={(e) => setEditingCyclist({ ...editingCyclist, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={editingCyclist.email}
                  onChange={(e) => setEditingCyclist({ ...editingCyclist, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t.phone}</label>
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
              
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  onClick={() => setEditingCyclist(null)}
                  className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  {t.cancel}
                </button>
                <button
                  onClick={handleSaveCyclist}
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

      {/* Edit Pass Modal */}
      {editingPass && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t.name}</label>
                  <input
                    type="text"
                    value={editingPass.name}
                    onChange={(e) => setEditingPass({ ...editingPass, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t.country}</label>
                  <input
                    type="text"
                    value={editingPass.country}
                    onChange={(e) => setEditingPass({ ...editingPass, country: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t.region}</label>
                  <input
                    type="text"
                    value={editingPass.region}
                    onChange={(e) => setEditingPass({ ...editingPass, region: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t.altitude}</label>
                  <input
                    type="number"
                    value={editingPass.maxAltitude}
                    onChange={(e) => setEditingPass({ ...editingPass, maxAltitude: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t.description}</label>
                <textarea
                  value={editingPass.description}
                  onChange={(e) => setEditingPass({ ...editingPass, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t.imageUrl}</label>
                <input
                  type="url"
                  value={editingPass.imageUrl}
                  onChange={(e) => setEditingPass({ ...editingPass, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
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

      {/* Add Collaborator Modal */}
      {showAddCollaborator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-xl font-semibold text-slate-800">Añadir Colaborador</h3>
              <button
                onClick={() => setShowAddCollaborator(false)}
                className="text-slate-500 hover:text-slate-700 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Nombre <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newCollaborator.name || ''}
                  onChange={(e) => setNewCollaborator({ ...newCollaborator, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  placeholder="Nombre del colaborador"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Categoría <span className="text-red-500">*</span>
                </label>
                <div className="flex space-x-2">
                  <select
                    value={newCollaborator.category || 'Tienda de Bicicletas'}
                    onChange={(e) => setNewCollaborator({ ...newCollaborator, category: e.target.value })}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddCategoryModal(true);
                    }}
                    className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center"
                    title="Añadir nueva categoría"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Descripción <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={newCollaborator.description || ''}
                  onChange={(e) => setNewCollaborator({ ...newCollaborator, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  rows={3}
                  placeholder="Descripción del colaborador"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={newCollaborator.contactInfo?.email || ''}
                    onChange={(e) => setNewCollaborator({ 
                      ...newCollaborator, 
                      contactInfo: { ...newCollaborator.contactInfo, email: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="email@ejemplo.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono</label>
                  <input
                    type="tel"
                    value={newCollaborator.contactInfo?.phone || ''}
                    onChange={(e) => setNewCollaborator({ 
                      ...newCollaborator, 
                      contactInfo: { ...newCollaborator.contactInfo, phone: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="+34 123 456 789"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Sitio Web</label>
                <input
                  type="url"
                  value={newCollaborator.contactInfo?.website || ''}
                  onChange={(e) => setNewCollaborator({ 
                    ...newCollaborator, 
                    contactInfo: { ...newCollaborator.contactInfo, website: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  placeholder="https://www.ejemplo.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Dirección</label>
                <input
                  type="text"
                  value={newCollaborator.contactInfo?.address || ''}
                  onChange={(e) => setNewCollaborator({ 
                    ...newCollaborator, 
                    contactInfo: { ...newCollaborator.contactInfo, address: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  placeholder="Calle Ejemplo 123, Ciudad"
                />
              </div>
              
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={newCollaborator.featured || false}
                    onChange={(e) => setNewCollaborator({ ...newCollaborator, featured: e.target.checked })}
                    className="rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                  />
                  <span className="text-sm font-medium text-slate-700">Colaborador Destacado</span>
                </label>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  onClick={() => setShowAddCollaborator(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddCollaborator}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <Save className="h-4 w-4" />
                  <span>Añadir Colaborador</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Brand Modal */}
      {showAddBrand && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-xl font-semibold text-slate-800">Añadir Nueva Marca</h3>
              <button
                onClick={() => setShowAddBrand(false)}
                className="text-slate-500 hover:text-slate-700 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Nombre de la Marca <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newBrand.name || ''}
                    onChange={(e) => setNewBrand({ ...newBrand, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="Ej: Trek, Specialized, Shimano..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Categoría <span className="text-red-500">*</span>
                  </label>
                  <div className="flex space-x-2">
                    <select
                      value={newBrand.category || 'Bicicletas'}
                      onChange={(e) => setNewBrand({ ...newBrand, category: e.target.value })}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    >
                      {brandCategories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setShowAddBrandCategoryModal(true)}
                      className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center"
                      title="Añadir nueva categoría"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">País de Origen</label>
                  <input
                    type="text"
                    value={newBrand.country || ''}
                    onChange={(e) => setNewBrand({ ...newBrand, country: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="Ej: Estados Unidos, Italia, Japón..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Año de Fundación</label>
                  <input
                    type="number"
                    value={newBrand.foundedYear || ''}
                    onChange={(e) => setNewBrand({ ...newBrand, foundedYear: e.target.value ? parseInt(e.target.value) : undefined })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="Ej: 1976"
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
                  value={newBrand.description || ''}
                  onChange={(e) => setNewBrand({ ...newBrand, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  rows={3}
                  placeholder="Descripción de la marca, su historia y especialidades..."
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Logo (URL)</label>
                  <input
                    type="url"
                    value={newBrand.logo || ''}
                    onChange={(e) => setNewBrand({ ...newBrand, logo: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="https://ejemplo.com/logo.jpg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Sitio Web</label>
                  <input
                    type="url"
                    value={newBrand.website || ''}
                    onChange={(e) => setNewBrand({ ...newBrand, website: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="https://www.marca.com"
                  />
                </div>
              </div>
              
              {/* Specialties */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Especialidades</label>
                <div className="flex space-x-2 mb-3">
                  <input
                    type="text"
                    value={newSpecialty}
                    onChange={(e) => setNewSpecialty(e.target.value)}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="Ej: Bicicletas de carretera, Mountain bikes..."
                    onKeyPress={(e) => e.key === 'Enter' && handleAddSpecialty()}
                  />
                  <button
                    type="button"
                    onClick={handleAddSpecialty}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Añadir
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {newBrand.specialties?.map((specialty, index) => (
                    <span 
                      key={index}
                      className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      <span>{specialty}</span>
                      <button
                        onClick={() => handleRemoveSpecialty(specialty)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={newBrand.featured || false}
                    onChange={(e) => setNewBrand({ ...newBrand, featured: e.target.checked })}
                    className="rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                  />
                  <span className="text-sm font-medium text-slate-700">Marca Destacada</span>
                </label>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  onClick={() => setShowAddBrand(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddBrand}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <Save className="h-4 w-4" />
                  <span>Añadir Marca</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Brand Category Modal */}
      {showAddBrandCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-xl font-semibold text-slate-800 flex items-center">
                <Plus className="h-5 w-5 text-green-500 mr-2" />
                Nueva Categoría de Marca
              </h3>
              <button
                onClick={() => {
                  setShowAddBrandCategoryModal(false);
                  setNewBrandCategoryInput('');
                  setNewBrandCategoryError('');
                }}
                className="text-slate-500 hover:text-slate-700 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Nombre de la Categoría <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newBrandCategoryInput}
                  onChange={(e) => {
                    setNewBrandCategoryInput(e.target.value);
                    setNewBrandCategoryError('');
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                    newBrandCategoryError ? 'border-red-500' : 'border-slate-300'
                  }`}
                  placeholder="Ej: Cascos, Zapatillas, Herramientas..."
                  autoFocus
                />
                {newBrandCategoryError && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <X className="h-4 w-4 mr-1" />
                    {newBrandCategoryError}
                  </p>
                )}
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      <strong>Consejo:</strong> Usa nombres descriptivos como "Cascos", "Zapatillas", "Herramientas", etc.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowAddBrandCategoryModal(false);
                    setNewBrandCategoryInput('');
                    setNewBrandCategoryError('');
                  }}
                  className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddBrandCategoryFromModal}
                  disabled={!!newBrandCategoryError}
                  className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                    newBrandCategoryError
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-green-500 text-white hover:bg-green-600'
                  }`}
                >
                  <Plus className="h-4 w-4" />
                  <span>Crear Categoría</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {showAddCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-xl font-semibold text-slate-800 flex items-center">
                <Plus className="h-5 w-5 text-green-500 mr-2" />
                Nueva Categoría
              </h3>
              <button
                onClick={() => {
                  setShowAddCategoryModal(false);
                  setNewCategoryInput('');
                  setNewCategoryError('');
                }}
                className="text-slate-500 hover:text-slate-700 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Nombre de la Categoría <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newCategoryInput}
                  onChange={(e) => {
                    setNewCategoryInput(e.target.value);
                    setNewCategoryError('');
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                    newCategoryError ? 'border-red-500' : 'border-slate-300'
                  }`}
                  placeholder="Ej: Mecánico, Nutrición, Alojamiento..."
                  autoFocus
                />
                {newCategoryError && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <X className="h-4 w-4 mr-1" />
                    {newCategoryError}
                  </p>
                )}
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      <strong>Consejo:</strong> Usa nombres descriptivos como "Tienda de Bicicletas", "Alojamiento Rural", etc.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowAddCategoryModal(false);
                    setNewCategoryInput('');
                    setNewCategoryError('');
                  }}
                  className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddCategoryFromModal}
                  disabled={!!newCategoryError}
                  className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                    newCategoryError
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-green-500 text-white hover:bg-green-600'
                  }`}
                >
                  <Plus className="h-4 w-4" />
                  <span>Crear Categoría</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};