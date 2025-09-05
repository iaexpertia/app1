import React, { useState, useEffect } from 'react';
import { MountainPass, Cyclist, Collaborator } from '../types';
import { Translation } from '../i18n/translations';
import { loadCyclists, updateCyclist, removeCyclist } from '../utils/cyclistStorage';
import { 
  loadCollaborators, 
  addCollaborator, 
  updateCollaborator, 
  removeCollaborator,
  loadCategories
} from '../utils/collaboratorStorage';
import { 
  Settings, 
  Users, 
  Mountain, 
import { 
  loadCollaborators, 
  addCollaborator, 
  removeCollaborator, 
  updateCollaborator,
  loadCategories,
  addCategory
} from '../utils/collaboratorStorage';
  Edit3, 
  Trash2, 
  Save,
  Upload,
  Eye,
  EyeOff,
  Store,
  Plus,
  X,
  Star,
  Globe,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';

interface AdminPanelProps {
  passes: MountainPass[];
  onUpdatePass: (pass: MountainPass) => void;
  t: Translation;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ 
  passes, 
  onUpdatePass, 
  t 
}) => {
  const [activeSection, setActiveSection] = useState<'cyclists' | 'passes' | 'collaborators'>('cyclists');
  const [cyclists, setCyclists] = useState<Cyclist[]>([]);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [editingCyclist, setEditingCyclist] = useState<Cyclist | null>(null);
  const [editingPass, setEditingPass] = useState<MountainPass | null>(null);
  const [editingCollaborator, setEditingCollaborator] = useState<Collaborator | null>(null);
  const [showAddCollaboratorModal, setShowAddCollaboratorModal] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);

  useEffect(() => {
    setCyclists(loadCyclists());
    setCollaborators(loadCollaborators());
    setCategories(loadCategories());
  }, []);

  // Función para refrescar categorías desde localStorage
  const refreshCategories = () => {
    const updatedCategories = loadCategories();
    setCategories(updatedCategories);
  };

  const handleUpdateCyclist = (cyclist: Cyclist) => {
    updateCyclist(cyclist);
    setCyclists(loadCyclists());
    setEditingCyclist(null);
  };

  const handleDeleteCyclist = (cyclistId: string) => {
    if (window.confirm(t.confirmDeleteCyclist)) {
      removeCyclist(cyclistId);
      setCyclists(loadCyclists());
    }
  };

  const handleUpdatePass = (pass: MountainPass) => {
    onUpdatePass(pass);
    setEditingPass(null);
  };

  const handleAddCollaborator = (collaborator: Collaborator) => {
    addCollaborator(collaborator);
    setCollaborators(loadCollaborators());
    refreshCategories();
    setShowAddCollaboratorModal(false);
  };

  const handleUpdateCollaborator = (collaborator: Collaborator) => {
    updateCollaborator(collaborator);
    setCollaborators(loadCollaborators());
    refreshCategories();
    setEditingCollaborator(null);
  };

  const handleDeleteCollaborator = (collaboratorId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este colaborador?')) {
      removeCollaborator(collaboratorId);
      setCollaborators(loadCollaborators());
    }
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim() && !categories.includes(newCategoryName.trim())) {
      const { addCategory } = require('../utils/collaboratorStorage');
      addCategory(newCategoryName.trim());
      refreshCategories();
      setNewCategoryName('');
      setShowAddCategoryModal(false);
    }
  };

  const handleRemoveCategory = (categoryToRemove: string) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar la categoría "${getCategoryText(categoryToRemove)}"?`)) {
      const { removeCategory } = require('../utils/collaboratorStorage');
      removeCategory(categoryToRemove);
      refreshCategories();
    }
  };

  const getCategoryText = (category: string) => {
    const categoryMap: Record<string, string> = {
      'Bike Shop': 'Tienda de Bicicletas',
      'Hotel': 'Hotel',
      'Restaurant': 'Restaurante',
      'Tour Guide': 'Guía Turístico',
      'Equipment': 'Equipamiento',
      'Other': 'Otros'
    };
    return categoryMap[category] || category;
  };
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Settings className="h-8 w-8 text-orange-500 mr-3" />
          <h2 className="text-2xl font-bold text-slate-800">{t.adminPanel}</h2>
        </div>
        
        <div className="flex space-x-1 bg-slate-100 rounded-lg p-1">
          <button
            onClick={() => setActiveSection('cyclists')}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
              activeSection === 'cyclists'
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>{t.manageCyclists}</span>
          </button>
          
          <button
            onClick={() => setActiveSection('passes')}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
              activeSection === 'passes'
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            <Mountain className="h-4 w-4" />
            <span>{t.managePasses}</span>
          </button>
          
          <button
            onClick={() => setActiveSection('collaborators')}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
              activeSection === 'collaborators'
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            <Store className="h-4 w-4" />
            <span>Gestionar Colaboradores</span>
          </button>
        </div>
      </div>

      {/* Cyclists Management */}
      {activeSection === 'cyclists' && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-slate-800">{t.registeredCyclists}</h3>
            <span className="text-sm text-slate-600">{cyclists.length} {t.totalCyclists}</span>
          </div>

          {cyclists.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <p className="text-xl text-slate-600">{t.noCyclists}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-medium text-slate-700">{t.name}</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-700">{t.email}</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-700">{t.phone}</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-700">{t.bikes}</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-700">{t.adminRole}</th>
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
                        <button
                          onClick={() => {
                            const updatedCyclist = { ...cyclist, isAdmin: !cyclist.isAdmin };
                            handleUpdateCyclist(updatedCyclist);
                          }}
                          className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                            cyclist.isAdmin 
                              ? 'bg-green-500 border-green-500 text-white' 
                              : 'border-slate-300 hover:border-orange-500'
                          }`}
                        >
                          {cyclist.isAdmin && (
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setEditingCyclist(cyclist)}
                            className="text-orange-500 hover:text-orange-700 transition-colors"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCyclist(cyclist.id)}
                            className="text-red-500 hover:text-red-700 transition-colors"
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

      {/* Passes Management */}
      {activeSection === 'passes' && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-slate-800">{t.managePasses}</h3>
            <span className="text-sm text-slate-600">{passes.length} {t.totalPasses}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {passes.map((pass) => (
              <div key={pass.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="relative h-32 mb-3">
                  <img 
                    src={pass.imageUrl} 
                    alt={pass.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                
                <h4 className="font-semibold text-slate-800 mb-2">{pass.name}</h4>
                <p className="text-sm text-slate-600 mb-3">{pass.country}, {pass.region}</p>
                
                <button
                  onClick={() => setEditingPass(pass)}
                  className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  <Edit3 className="h-4 w-4" />
                  <span>{t.editPass}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Collaborators Management */}
      {activeSection === 'collaborators' && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <h3 className="text-xl font-semibold text-slate-800">Gestionar Colaboradores</h3>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-600">{collaborators.length} colaboradores totales</span>
              <button
                onClick={() => setShowAddCollaboratorModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Añadir Colaborador</span>
              </button>
            </div>
          </div>

          {collaborators.length === 0 ? (
            <div className="text-center py-12">
              <Store className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <p className="text-xl text-slate-600">No hay colaboradores registrados</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {collaborators.map((collaborator) => (
                <div key={collaborator.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="relative h-32 mb-3">
                    <img 
                      src={collaborator.images[0] || 'https://images.pexels.com/photos/100582/pexels-photo-100582.jpeg'} 
                      alt={collaborator.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    {collaborator.featured && (
                      <Star className="absolute top-2 right-2 h-5 w-5 text-yellow-400 bg-white rounded-full p-1" />
                    )}
                    <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium ${
                      collaborator.isActive ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                    }`}>
                      {collaborator.isActive ? 'Activo' : 'Inactivo'}
                    </div>
                  </div>
                  
                  <h4 className="font-semibold text-slate-800 mb-1">{collaborator.name}</h4>
                  <p className="text-sm text-slate-600 mb-2">{collaborator.category}</p>
                  <p className="text-xs text-slate-500 mb-3 line-clamp-2">{collaborator.description}</p>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingCollaborator(collaborator)}
                        className="text-orange-500 hover:text-orange-700 transition-colors"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCollaborator(collaborator.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <button
                      onClick={() => {
                        const updatedCollaborator = { ...collaborator, featured: !collaborator.featured };
                        handleUpdateCollaborator(updatedCollaborator);
                      }}
                      className={`p-1 rounded transition-colors ${
                        collaborator.featured 
                          ? 'text-yellow-500 hover:text-yellow-700' 
                          : 'text-slate-400 hover:text-yellow-500'
                      }`}
                    >
                      <Star className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Edit Cyclist Modal */}
      {editingCyclist && (
        <EditCyclistModal
          cyclist={editingCyclist}
          onSave={handleUpdateCyclist}
          onClose={() => setEditingCyclist(null)}
          t={t}
        />
      )}

      {/* Edit Pass Modal */}
      {editingPass && (
        <EditPassModal
          pass={editingPass}
          onSave={handleUpdatePass}
          onClose={() => setEditingPass(null)}
          t={t}
        />
      )}

      {/* Add Collaborator Modal */}
      {showAddCollaboratorModal && (
        <AddCollaboratorModal
          onSave={handleAddCollaborator}
          onClose={() => setShowAddCollaboratorModal(false)}
          categories={categories}
          onCategoryAdded={refreshCategories}
          t={t}
        />
      )}

      {/* Edit Collaborator Modal */}
      {editingCollaborator && (
        <EditCollaboratorModal
          collaborator={editingCollaborator}
          onSave={handleUpdateCollaborator}
          onClose={() => setEditingCollaborator(null)}
          categories={categories}
          onCategoryAdded={refreshCategories}
          t={t}
        />
      )}

      {/* Add Category Modal */}
      {showAddCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-xl font-semibold text-slate-800">Añadir Nueva Categoría</h3>
              <button
                onClick={() => setShowAddCategoryModal(false)}
                className="text-slate-500 hover:text-slate-700 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Nombre de la Categoría
                </label>
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  placeholder="Ej: Nutrición Deportiva"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowAddCategoryModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddCategory}
                  disabled={!newCategoryName.trim()}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Save className="h-4 w-4" />
                  <span>Añadir</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Edit Cyclist Modal Component
interface EditCyclistModalProps {
  cyclist: Cyclist;
  onSave: (cyclist: Cyclist) => void;
  onClose: () => void;
  t: Translation;
}

const EditCyclistModal: React.FC<EditCyclistModalProps> = ({ 
  cyclist, 
  onSave, 
  onClose, 
  t 
}) => {
  const [formData, setFormData] = useState(cyclist);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <h3 className="text-xl font-semibold text-slate-800">{t.editCyclist}</h3>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t.name}</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t.alias}</label>
              <input
                type="text"
                value={formData.alias || ''}
                onChange={(e) => setFormData({ ...formData, alias: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t.email}</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t.phone}</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t.age}</label>
              <input
                type="number"
                value={formData.age || ''}
                onChange={(e) => setFormData({ ...formData, age: e.target.value ? parseInt(e.target.value) : undefined })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t.weight}</label>
              <input
                type="number"
                value={formData.weight || ''}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value ? parseFloat(e.target.value) : undefined })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                step="0.1"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              {t.saveChanges}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Edit Pass Modal Component
interface EditPassModalProps {
  pass: MountainPass;
  onSave: (pass: MountainPass) => void;
  onClose: () => void;
  t: Translation;
}

const EditPassModal: React.FC<EditPassModalProps> = ({ 
  pass, 
  onSave, 
  onClose, 
  t 
}) => {
  const [formData, setFormData] = useState(pass);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <h3 className="text-xl font-semibold text-slate-800">{t.editPass}</h3>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t.name}</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t.country}</label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t.region}</label>
              <input
                type="text"
                value={formData.region}
                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t.altitude}</label>
              <input
                type="number"
                value={formData.maxAltitude}
                onChange={(e) => setFormData({ ...formData, maxAltitude: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t.elevation}</label>
              <input
                type="number"
                value={formData.elevationGain}
                onChange={(e) => setFormData({ ...formData, elevationGain: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t.distance}</label>
              <input
                type="number"
                value={formData.distance}
                onChange={(e) => setFormData({ ...formData, distance: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                step="0.1"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t.imageUrl}</label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              placeholder="https://images.pexels.com/..."
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t.description}</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              rows={3}
              required
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              {t.saveChanges}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Add Collaborator Modal Component
interface AddCollaboratorModalProps {
  onSave: (collaborator: Collaborator) => void;
  onClose: () => void;
  categories: string[];
  onCategoryAdded: () => void;
  t: Translation;
}

const AddCollaboratorModal: React.FC<AddCollaboratorModalProps> = ({ 
  onSave, 
  onClose, 
  categories,
  onCategoryAdded,
  t
}) => {
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [formData, setFormData] = useState<Partial<Collaborator>>({
    name: '',
    category: 'Bike Shop',
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
  const [imageUrl, setImageUrl] = useState('');

  const getCategoryText = (category: string) => {
    const categoryMap: Record<string, string> = {
      'Bike Shop': 'Tienda de Bicicletas',
      'Hotel': 'Hotel',
      'Restaurant': 'Restaurante',
      'Tour Guide': 'Guía Turístico',
      'Equipment': 'Equipamiento',
      'Other': 'Otros'
    };
    return categoryMap[category] || category;
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim() && !categories.includes(newCategoryName.trim())) {
      const { addCategory } = require('../utils/collaboratorStorage');
      addCategory(newCategoryName.trim());
      onCategoryAdded(); // Refresca las categorías en el componente padre
      setFormData({ ...formData, category: newCategoryName.trim() }); // Selecciona la nueva categoría
      setNewCategoryName('');
      setShowAddCategoryModal(false);
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.description) {
      alert('Por favor completa al menos el nombre y la descripción');
      return;
    }

    const newCollaborator: Collaborator = {
      id: Date.now().toString(),
      name: formData.name!,
      category: formData.category as any || 'Other',
      description: formData.description!,
      contactInfo: formData.contactInfo || {},
      images: formData.images || [],
      isActive: formData.isActive || true,
      featured: formData.featured || false
    };

    onSave(newCollaborator);
  };

  const addImage = () => {
    if (imageUrl.trim()) {
      setFormData({
        ...formData,
        images: [...(formData.images || []), imageUrl.trim()]
      });
      setImageUrl('');
    }
  };

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images?.filter((_, i) => i !== index) || []
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex items-center justify-between">
          <h3 className="text-xl font-semibold text-slate-800">Añadir Nuevo Colaborador</h3>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Nombre del Colaborador <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="Ej: Ciclos Montaña Pro"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Categoría</label>
              <div className="flex space-x-2">
                <select
                  value={formData.category || 'Other'}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {getCategoryText(category)}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowAddCategoryModal(true)}
                  className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  title="Añadir nueva categoría"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Descripción <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              rows={3}
              placeholder="Descripción del negocio y servicios que ofrece..."
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.contactInfo?.email || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  contactInfo: { ...formData.contactInfo, email: e.target.value }
                })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="contacto@negocio.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono</label>
              <input
                type="tel"
                value={formData.contactInfo?.phone || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  contactInfo: { ...formData.contactInfo, phone: e.target.value }
                })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="+34 123 456 789"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Website</label>
              <input
                type="url"
                value={formData.contactInfo?.website || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  contactInfo: { ...formData.contactInfo, website: e.target.value }
                })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="https://www.negocio.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Dirección</label>
              <input
                type="text"
                value={formData.contactInfo?.address || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  contactInfo: { ...formData.contactInfo, address: e.target.value }
                })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="Calle Principal 123, Ciudad"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Imágenes</label>
            <div className="flex space-x-2 mb-2">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="https://images.pexels.com/..."
              />
              <button
                type="button"
                onClick={addImage}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Añadir
              </button>
            </div>
            
            {formData.images && formData.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {formData.images.map((img, index) => (
                  <div key={index} className="relative">
                    <img 
                      src={img} 
                      alt={`Imagen ${index + 1}`}
                      className="w-full h-20 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-6">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.isActive || false}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="rounded border-slate-300 text-orange-500 focus:ring-orange-500"
              />
              <span className="text-sm text-slate-700">Activo</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.featured || false}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="rounded border-slate-300 text-orange-500 focus:ring-orange-500"
              />
              <span className="text-sm text-slate-700">Destacado</span>
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
              <span>Añadir Colaborador</span>
            </button>
          </div>
        </form>
      </div>
      
      {/* Add Category Modal */}
      {showAddCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-xl font-semibold text-slate-800">Añadir Nueva Categoría</h3>
              <button
                onClick={() => setShowAddCategoryModal(false)}
                className="text-slate-500 hover:text-slate-700 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Nombre de la Categoría
                </label>
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  placeholder="Ej: Nutrición Deportiva"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowAddCategoryModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddCategory}
                  disabled={!newCategoryName.trim()}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Save className="h-4 w-4" />
                  <span>Añadir</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Edit Collaborator Modal Component
interface EditCollaboratorModalProps {
  collaborator: Collaborator;
  onSave: (collaborator: Collaborator) => void;
  onClose: () => void;
  categories: string[];
  onCategoryAdded: () => void;
  t: Translation;
}

const EditCollaboratorModal: React.FC<EditCollaboratorModalProps> = ({ 
  collaborator, 
  onSave, 
  onClose, 
  categories,
  onCategoryAdded,
  t
}) => {
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [formData, setFormData] = useState(collaborator);
  const [imageUrl, setImageUrl] = useState('');

  const getCategoryText = (category: string) => {
    const categoryMap: Record<string, string> = {
      'Bike Shop': 'Tienda de Bicicletas',
      'Hotel': 'Hotel',
      'Restaurant': 'Restaurante',
      'Tour Guide': 'Guía Turístico',
      'Equipment': 'Equipamiento',
      'Other': 'Otros'
    };
    return categoryMap[category] || category;
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim() && !categories.includes(newCategoryName.trim())) {
      const { addCategory } = require('../utils/collaboratorStorage');
      addCategory(newCategoryName.trim());
      onCategoryAdded(); // Refresca las categorías en el componente padre
      setFormData({ ...formData, category: newCategoryName.trim() }); // Selecciona la nueva categoría
      setNewCategoryName('');
      setShowAddCategoryModal(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const addImage = () => {
    if (imageUrl.trim()) {
      setFormData({
        ...formData,
        images: [...formData.images, imageUrl.trim()]
      });
      setImageUrl('');
    }
  };

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex items-center justify-between">
          <h3 className="text-xl font-semibold text-slate-800">Editar Colaborador</h3>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Nombre del Colaborador <span className="text-red-500">*</span>
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
              <div className="flex space-x-2">
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {getCategoryText(category)}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowAddCategoryModal(true)}
                  className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  title="Añadir nueva categoría"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
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
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.contactInfo.email || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  contactInfo: { ...formData.contactInfo, email: e.target.value }
                })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono</label>
              <input
                type="tel"
                value={formData.contactInfo.phone || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  contactInfo: { ...formData.contactInfo, phone: e.target.value }
                })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Website</label>
              <input
                type="url"
                value={formData.contactInfo.website || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  contactInfo: { ...formData.contactInfo, website: e.target.value }
                })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Dirección</label>
              <input
                type="text"
                value={formData.contactInfo.address || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  contactInfo: { ...formData.contactInfo, address: e.target.value }
                })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Imágenes</label>
            <div className="flex space-x-2 mb-2">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="https://images.pexels.com/..."
              />
              <button
                type="button"
                onClick={addImage}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Añadir
              </button>
            </div>
            
            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {formData.images.map((img, index) => (
                  <div key={index} className="relative">
                    <img 
                      src={img} 
                      alt={`Imagen ${index + 1}`}
                      className="w-full h-20 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-6">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="rounded border-slate-300 text-orange-500 focus:ring-orange-500"
              />
              <span className="text-sm text-slate-700">Activo</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="rounded border-slate-300 text-orange-500 focus:ring-orange-500"
              />
              <span className="text-sm text-slate-700">Destacado</span>
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
              className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>Guardar Cambios</span>
            </button>
          </div>
        </form>
      </div>
      
      {/* Add Category Modal */}
      {showAddCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-xl font-semibold text-slate-800">Añadir Nueva Categoría</h3>
              <button
                onClick={() => setShowAddCategoryModal(false)}
                className="text-slate-500 hover:text-slate-700 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Nombre de la Categoría
                </label>
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  placeholder="Ej: Nutrición Deportiva"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowAddCategoryModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddCategory}
                  disabled={!newCategoryName.trim()}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Save className="h-4 w-4" />
                  <span>Añadir</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};