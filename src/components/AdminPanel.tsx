import React, { useState, useEffect } from 'react';
import { MountainPass, Cyclist } from '../types';
import { Translation } from '../i18n/translations';
import { 
  loadCyclists, 
  removeCyclist, 
  updateCyclist,
  addCyclist 
} from '../utils/cyclistStorage';
import { 
  loadCategories, 
  saveCategories, 
  addCategory 
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
  UserPlus
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
  const [cyclists, setCyclists] = useState<Cyclist[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [editingCyclist, setEditingCyclist] = useState<Cyclist | null>(null);
  const [editingPass, setEditingPass] = useState<MountainPass | null>(null);
  const [showAddCyclist, setShowAddCyclist] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [newCyclist, setNewCyclist] = useState<Partial<Cyclist>>({
    name: '',
    email: '',
    phone: '',
    isAdmin: false
  });

  useEffect(() => {
    setCyclists(loadCyclists());
    setCategories(loadCategories());
  }, []);

  const refreshCategories = () => {
    setCategories(loadCategories());
  };

  const handleDeleteCyclist = (cyclistId: string) => {
    if (window.confirm(t.confirmDeleteCyclist)) {
      removeCyclist(cyclistId);
      setCyclists(loadCyclists());
    }
  };

  const handleUpdateCyclist = (cyclist: Cyclist) => {
    updateCyclist(cyclist);
    setCyclists(loadCyclists());
    setEditingCyclist(null);
  };

  const handleAddCyclist = () => {
    if (!newCyclist.name || !newCyclist.email || !newCyclist.phone) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    const cyclistToAdd: Cyclist = {
      id: Date.now().toString(),
      name: newCyclist.name!,
      email: newCyclist.email!,
      phone: newCyclist.phone!,
      isAdmin: newCyclist.isAdmin || false,
      bikes: [],
      registrationDate: new Date().toISOString().split('T')[0]
    };

    addCyclist(cyclistToAdd);
    setCyclists(loadCyclists());
    setNewCyclist({
      name: '',
      email: '',
      phone: '',
      isAdmin: false
    });
    setShowAddCyclist(false);
  };

  const handleAddCategory = () => {
    console.log('handleAddCategory called');
    console.log('newCategoryName:', newCategoryName);
    console.log('categories:', categories);
    
    const trimmedCategory = newCategoryName.trim();
    
    if (!trimmedCategory) {
      console.log('Empty category name');
      setCategoryError('El nombre de la categoría es obligatorio');
      return;
    }

    // Verificar si la categoría ya existe
    const categoryExists = categories.some(cat => 
      cat.toLowerCase() === trimmedCategory.toLowerCase()
    );
    
    console.log('categoryExists:', categoryExists);
    
    if (categoryExists) {
      console.log('Category already exists, showing alert');
      alert('CATEGORÍA EXISTENTE: Ya existe una categoría con ese nombre');
      setCategoryError('Ya existe una categoría con ese nombre');
      return;
    }

    try {
      console.log('Adding new category');
      addCategory(trimmedCategory);
      refreshCategories();
      setNewCategoryName('');
      setCategoryError('');
      setShowAddCategory(false);
      console.log('Category added successfully');
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Error al añadir la categoría');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Settings className="h-8 w-8 text-orange-500 mr-3" />
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{t.adminPanel}</h2>
            <p className="text-slate-600">Panel de administración para gestionar ciclistas y puertos</p>
          </div>
        </div>
      </div>

      {/* Cyclists Management */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Users className="h-6 w-6 text-orange-500 mr-3" />
            <div>
              <h3 className="text-xl font-semibold text-slate-800">{t.manageCyclists}</h3>
              <p className="text-sm text-slate-600">{cyclists.length} {t.totalCyclists}</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddCyclist(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <UserPlus className="h-4 w-4" />
            <span>Añadir Ciclista</span>
          </button>
        </div>

        {cyclists.length === 0 ? (
          <p className="text-slate-500 text-center py-8">{t.noCyclists}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Nombre</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Email</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Teléfono</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Admin</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">{t.actions}</th>
                </tr>
              </thead>
              <tbody>
                {cyclists.map(cyclist => (
                  <tr key={cyclist.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4">{cyclist.name}</td>
                    <td className="py-3 px-4">{cyclist.email}</td>
                    <td className="py-3 px-4">{cyclist.phone}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        cyclist.isAdmin 
                          ? 'bg-orange-100 text-orange-800' 
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {cyclist.isAdmin ? 'Admin' : 'Usuario'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Categories Management */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Mountain className="h-6 w-6 text-orange-500 mr-3" />
            <div>
              <h3 className="text-xl font-semibold text-slate-800">Gestionar Categorías</h3>
              <p className="text-sm text-slate-600">{categories.length} categorías disponibles</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddCategory(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Añadir Categoría</span>
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {categories.map(category => (
            <div key={category} className="bg-slate-50 rounded-lg p-3 text-center">
              <span className="text-sm font-medium text-slate-700">{category}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Add Cyclist Modal */}
      {showAddCyclist && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800">Añadir Nuevo Ciclista</h3>
              <button
                onClick={() => setShowAddCyclist(false)}
                className="text-slate-500 hover:text-slate-700 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Nombre <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newCyclist.name || ''}
                  onChange={(e) => setNewCyclist({ ...newCyclist, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  placeholder="Nombre completo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={newCyclist.email || ''}
                  onChange={(e) => setNewCyclist({ ...newCyclist, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  placeholder="email@ejemplo.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Teléfono <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={newCyclist.phone || ''}
                  onChange={(e) => setNewCyclist({ ...newCyclist, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  placeholder="+34 123 456 789"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isAdmin"
                  checked={newCyclist.isAdmin || false}
                  onChange={(e) => setNewCyclist({ ...newCyclist, isAdmin: e.target.checked })}
                  className="rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                />
                <label htmlFor="isAdmin" className="text-sm text-slate-700">
                  {t.adminRole}
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowAddCyclist(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  {t.cancel}
                </button>
                <button
                  onClick={handleAddCyclist}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Añadir Ciclista
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {showAddCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800">Añadir Nueva Categoría</h3>
              <button
                onClick={() => {
                  setShowAddCategory(false);
                  setNewCategoryName('');
                  setCategoryError('');
                }}
                className="text-slate-500 hover:text-slate-700 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Nombre de la Categoría <span className="text-red-500">*</span>
                </label>
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
                  placeholder="Ej: Bike Shop, Hotel, Restaurant..."
                />
                {categoryError && (
                  <p className="text-red-500 text-sm mt-1">{categoryError}</p>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => {
                    setShowAddCategory(false);
                    setNewCategoryName('');
                    setCategoryError('');
                  }}
                  className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddCategory}
                  disabled={!!categoryError}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Añadir Categoría
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Cyclist Modal */}
      {editingCyclist && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800">{t.editCyclist}</h3>
              <button
                onClick={() => setEditingCyclist(null)}
                className="text-slate-500 hover:text-slate-700 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

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
                  id="editIsAdmin"
                  checked={editingCyclist.isAdmin || false}
                  onChange={(e) => setEditingCyclist({ ...editingCyclist, isAdmin: e.target.checked })}
                  className="rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                />
                <label htmlFor="editIsAdmin" className="text-sm text-slate-700">
                  {t.adminRole}
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setEditingCyclist(null)}
                  className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  {t.cancel}
                </button>
                <button
                  onClick={() => handleUpdateCyclist(editingCyclist)}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  {t.saveChanges}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};