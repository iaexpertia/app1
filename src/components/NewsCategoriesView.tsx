import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Save, Power, PowerOff } from 'lucide-react';
import { NewsCategory } from '../types';
import { MultilingualInput } from './MultilingualInput';
import {
  loadAllNewsCategories,
  saveNewsCategory,
  updateNewsCategory,
  deleteNewsCategory,
  toggleNewsCategoryStatus
} from '../utils/newsCategoriesStorage';

const ICON_OPTIONS = ['Newspaper', 'Trophy', 'Package', 'MapPin', 'User', 'Mountain', 'Calendar', 'Star', 'Award', 'Target'];

const COLOR_OPTIONS = [
  { label: 'Rojo', value: 'bg-red-100 text-red-700' },
  { label: 'Azul', value: 'bg-blue-100 text-blue-700' },
  { label: 'Verde', value: 'bg-green-100 text-green-700' },
  { label: 'Naranja', value: 'bg-orange-100 text-orange-700' },
  { label: 'Morado', value: 'bg-purple-100 text-purple-700' },
  { label: 'Rosa', value: 'bg-pink-100 text-pink-700' },
  { label: 'Amarillo', value: 'bg-yellow-100 text-yellow-700' },
  { label: 'Gris', value: 'bg-gray-100 text-gray-700' },
  { label: 'Indigo', value: 'bg-indigo-100 text-indigo-700' },
  { label: 'Teal', value: 'bg-teal-100 text-teal-700' }
];

export const NewsCategoriesView: React.FC = () => {
  const [categories, setCategories] = useState<NewsCategory[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<NewsCategory | null>(null);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    name_translations: { es: '', en: '', fr: '', it: '' },
    color: 'bg-blue-100 text-blue-700',
    icon: 'Newspaper',
    display_order: 0,
    is_active: true
  });

  useEffect(() => {
    loadCategoriesData();
  }, []);

  const loadCategoriesData = async () => {
    const loadedCategories = await loadAllNewsCategories();
    setCategories(loadedCategories);
  };

  const handleOpenModal = (category?: NewsCategory) => {
    if (category) {
      setEditingCategory(category);
      setCategoryForm({
        name: category.name,
        name_translations: category.name_translations,
        color: category.color,
        icon: category.icon,
        display_order: category.display_order,
        is_active: category.is_active
      });
    } else {
      setEditingCategory(null);
      setCategoryForm({
        name: '',
        name_translations: { es: '', en: '', fr: '', it: '' },
        color: 'bg-blue-100 text-blue-700',
        icon: 'Newspaper',
        display_order: categories.length,
        is_active: true
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
  };

  const handleSaveCategory = async () => {
    if (!categoryForm.name.trim()) {
      alert('Por favor, ingrese un nombre para la categoría');
      return;
    }

    if (editingCategory) {
      const updated = await updateNewsCategory(editingCategory.id, categoryForm);
      if (updated) {
        await loadCategoriesData();
        handleCloseModal();
      }
    } else {
      const saved = await saveNewsCategory(categoryForm);
      if (saved) {
        await loadCategoriesData();
        handleCloseModal();
      }
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta categoría? Esta acción no se puede deshacer.')) {
      return;
    }

    const deleted = await deleteNewsCategory(id);
    if (deleted) {
      await loadCategoriesData();
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    const toggled = await toggleNewsCategoryStatus(id, !currentStatus);
    if (toggled) {
      await loadCategoriesData();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Categorías de Noticias</h2>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Agregar Categoría</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(category => (
          <div key={category.id} className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${category.color}`}>
                    {category.name}
                  </span>
                  {category.is_active ? (
                    <Power className="h-4 w-4 text-green-600" />
                  ) : (
                    <PowerOff className="h-4 w-4 text-gray-400" />
                  )}
                </div>
                <p className="text-xs text-gray-500">Orden: {category.display_order}</p>
                <p className="text-xs text-gray-500">Icono: {category.icon}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleToggleStatus(category.id, category.is_active)}
                  className={`p-1 rounded hover:bg-gray-100 ${category.is_active ? 'text-green-600' : 'text-gray-400'}`}
                  title={category.is_active ? 'Desactivar' : 'Activar'}
                >
                  {category.is_active ? <Power className="h-4 w-4" /> : <PowerOff className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => handleOpenModal(category)}
                  className="p-1 rounded hover:bg-gray-100 text-blue-600"
                  title="Editar"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteCategory(category.id)}
                  className="p-1 rounded hover:bg-gray-100 text-red-600"
                  title="Eliminar"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-1 border-t pt-2">
              <p className="text-xs text-gray-600">
                <span className="font-semibold">ES:</span> {category.name_translations.es || category.name}
              </p>
              <p className="text-xs text-gray-600">
                <span className="font-semibold">EN:</span> {category.name_translations.en || category.name}
              </p>
              <p className="text-xs text-gray-600">
                <span className="font-semibold">FR:</span> {category.name_translations.fr || category.name}
              </p>
              <p className="text-xs text-gray-600">
                <span className="font-semibold">IT:</span> {category.name_translations.it || category.name}
              </p>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre (Español) *
                </label>
                <input
                  type="text"
                  value={categoryForm.name}
                  onChange={e => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="ej: Competición"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Traducciones del Nombre
                </label>
                <MultilingualInput
                  values={categoryForm.name_translations}
                  onChange={(translations) => setCategoryForm({ ...categoryForm, name_translations: translations })}
                  placeholder="Nombre de la categoría"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color
                </label>
                <select
                  value={categoryForm.color}
                  onChange={e => setCategoryForm({ ...categoryForm, color: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {COLOR_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="mt-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${categoryForm.color}`}>
                    Vista previa
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Icono
                </label>
                <select
                  value={categoryForm.icon}
                  onChange={e => setCategoryForm({ ...categoryForm, icon: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {ICON_OPTIONS.map(icon => (
                    <option key={icon} value={icon}>
                      {icon}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Orden de visualización
                </label>
                <input
                  type="number"
                  value={categoryForm.display_order}
                  onChange={e => setCategoryForm({ ...categoryForm, display_order: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  min="0"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="categoryActive"
                  checked={categoryForm.is_active}
                  onChange={e => setCategoryForm({ ...categoryForm, is_active: e.target.checked })}
                  className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                />
                <label htmlFor="categoryActive" className="text-sm font-medium text-gray-700">
                  Categoría activa
                </label>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t border-gray-200">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveCategory}
                className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                <Save className="h-4 w-4" />
                <span>Guardar</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
