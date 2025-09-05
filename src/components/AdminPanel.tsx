import React, { useState, useEffect } from 'react';
import { MountainPass, Cyclist } from '../types';
import { Translation } from '../i18n/translations';
import { loadCyclists, saveCyclists, removeCyclist, updateCyclist } from '../utils/cyclistStorage';
import { loadBrands, exportBrands } from '../utils/brandsStorage';
import { loadCollaborators, exportCollaborators } from '../utils/collaboratorStorage';
import { loadNews, exportNews } from '../utils/newsStorage';
import { exportMountainPasses, exportCyclists } from '../utils/excelExport';
import { 
  Settings, 
  Users, 
  Mountain, 
  Edit, 
  Trash2, 
  Save, 
  X,
  Plus,
  Download,
  Tag,
  UserCheck,
  Newspaper
} from 'lucide-react';

interface AdminPanelProps {
  passes: MountainPass[];
  onUpdatePass: (pass: MountainPass) => void;
  t: Translation;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ passes, onUpdatePass, t }) => {
  const [activeTab, setActiveTab] = useState<'cyclists' | 'passes' | 'brands' | 'collaborators' | 'news'>('cyclists');
  const [cyclists, setCyclists] = useState<Cyclist[]>([]);
  const [editingCyclist, setEditingCyclist] = useState<Cyclist | null>(null);
  const [editingPass, setEditingPass] = useState<MountainPass | null>(null);
  const [showAddCyclist, setShowAddCyclist] = useState(false);
  const [newCyclist, setNewCyclist] = useState<Partial<Cyclist>>({
    name: '',
    email: '',
    phone: '',
    bikes: [],
    isAdmin: false
  });

  useEffect(() => {
    setCyclists(loadCyclists());
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

  const handleAddCyclist = () => {
    if (newCyclist.name && newCyclist.email && newCyclist.phone) {
      const cyclist: Cyclist = {
        id: Date.now().toString(),
        name: newCyclist.name,
        alias: newCyclist.alias,
        email: newCyclist.email,
        phone: newCyclist.phone,
        age: newCyclist.age,
        weight: newCyclist.weight,
        bikes: newCyclist.bikes || [],
        registrationDate: new Date().toISOString().split('T')[0],
        isAdmin: newCyclist.isAdmin || false
      };
      
      const updatedCyclists = [...cyclists, cyclist];
      saveCyclists(updatedCyclists);
      setCyclists(updatedCyclists);
      setNewCyclist({
        name: '',
        email: '',
        phone: '',
        bikes: [],
        isAdmin: false
      });
      setShowAddCyclist(false);
    }
  };

  const handleExportPasses = () => {
    exportMountainPasses(passes);
  };

  const handleExportCyclists = () => {
    exportCyclists(cyclists);
  };

  const handleExportBrands = () => {
    const brands = loadBrands();
    exportBrands(brands);
  };

  const handleExportCollaborators = () => {
    const collaborators = loadCollaborators();
    exportCollaborators(collaborators);
  };

  const handleExportNews = () => {
    const news = loadNews();
    exportNews(news);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Settings className="h-8 w-8 text-orange-500 mr-3" />
            <div>
              <h2 className="text-2xl font-bold text-slate-800">{t.adminPanel}</h2>
              <p className="text-slate-600">Gestiona ciclistas, puertos y contenido de la plataforma</p>
            </div>
          </div>
          
          {/* Admin Tabs */}
          <div className="flex space-x-1 bg-slate-200 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('cyclists')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'cyclists'
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <Users className="h-4 w-4" />
              <span>Ciclistas</span>
            </button>
            
            <button
              onClick={() => setActiveTab('passes')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'passes'
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <Mountain className="h-4 w-4" />
              <span>Puertos</span>
            </button>
            
            <button
              onClick={() => setActiveTab('brands')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'brands'
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <Tag className="h-4 w-4" />
              <span>Marcas</span>
            </button>
            
            <button
              onClick={() => setActiveTab('collaborators')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'collaborators'
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <UserCheck className="h-4 w-4" />
              <span>Colaboradores</span>
            </button>
            
            <button
              onClick={() => setActiveTab('news')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'news'
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <Newspaper className="h-4 w-4" />
              <span>Noticias</span>
            </button>
          </div>
        </div>

        {/* Cyclists Management */}
        {activeTab === 'cyclists' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Users className="h-6 w-6 text-orange-500 mr-3" />
                <div>
                  <h3 className="text-xl font-semibold text-slate-800">{t.manageCyclists}</h3>
                  <p className="text-slate-600">{cyclists.length} {t.totalCyclists}</p>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleExportCyclists}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>Exportar Excel</span>
                </button>
                <button
                  onClick={() => setShowAddCyclist(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Añadir Ciclista</span>
                </button>
              </div>
            </div>
            
            {cyclists.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <p className="text-xl text-slate-600">{t.noCyclists}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 font-semibold text-slate-700">Nombre</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-700">Email</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-700">Teléfono</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-700">Bicicletas</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-700">Admin</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-700">{t.actions}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cyclists.map(cyclist => (
                      <tr key={cyclist.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-slate-800">{cyclist.name}</p>
                            {cyclist.alias && <p className="text-sm text-slate-500">{cyclist.alias}</p>}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-600">{cyclist.email}</td>
                        <td className="py-3 px-4 text-slate-600">{cyclist.phone}</td>
                        <td className="py-3 px-4 text-slate-600">{cyclist.bikes.length}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
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
        )}

        {/* Passes Management */}
        {activeTab === 'passes' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Mountain className="h-6 w-6 text-orange-500 mr-3" />
                <div>
                  <h3 className="text-xl font-semibold text-slate-800">{t.managePasses}</h3>
                  <p className="text-slate-600">{passes.length} puertos totales</p>
                </div>
              </div>
              <button
                onClick={handleExportPasses}
                className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Exportar Excel</span>
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Nombre</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">País</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Altitud</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Dificultad</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">{t.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {passes.map(pass => (
                    <tr key={pass.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-slate-800">{pass.name}</p>
                          <p className="text-sm text-slate-500">{pass.region}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{pass.country}</td>
                      <td className="py-3 px-4 text-slate-600">{pass.maxAltitude}m</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          {pass.difficulty}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => setEditingPass(pass)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Brands Management */}
        {activeTab === 'brands' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Tag className="h-6 w-6 text-orange-500 mr-3" />
                <div>
                  <h3 className="text-xl font-semibold text-slate-800">Gestión de Marcas</h3>
                  <p className="text-slate-600">Administra las marcas de ciclismo</p>
                </div>
              </div>
              <button
                onClick={handleExportBrands}
                className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Exportar Excel</span>
              </button>
            </div>
            
            <div className="text-center py-8">
              <Tag className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <p className="text-xl text-slate-600 mb-2">Gestión de Marcas</p>
              <p className="text-slate-500">Funcionalidad de administración de marcas próximamente</p>
            </div>
          </div>
        )}

        {/* Collaborators Management */}
        {activeTab === 'collaborators' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <UserCheck className="h-6 w-6 text-orange-500 mr-3" />
                <div>
                  <h3 className="text-xl font-semibold text-slate-800">Gestión de Colaboradores</h3>
                  <p className="text-slate-600">Administra los colaboradores y patrocinadores</p>
                </div>
              </div>
              <button
                onClick={handleExportCollaborators}
                className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Exportar Excel</span>
              </button>
            </div>
            
            <div className="text-center py-8">
              <UserCheck className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <p className="text-xl text-slate-600 mb-2">Gestión de Colaboradores</p>
              <p className="text-slate-500">Funcionalidad de administración de colaboradores próximamente</p>
            </div>
          </div>
        )}

        {/* News Management */}
        {activeTab === 'news' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Newspaper className="h-6 w-6 text-orange-500 mr-3" />
                <div>
                  <h3 className="text-xl font-semibold text-slate-800">Gestión de Noticias</h3>
                  <p className="text-slate-600">Administra las noticias y artículos</p>
                </div>
              </div>
              <button
                onClick={handleExportNews}
                className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Exportar Excel</span>
              </button>
            </div>
            
            <div className="text-center py-8">
              <Newspaper className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <p className="text-xl text-slate-600 mb-2">Gestión de Noticias</p>
              <p className="text-slate-500">Funcionalidad de administración de noticias próximamente</p>
            </div>
          </div>
        )}

        {/* Add Cyclist Modal */}
        {showAddCyclist && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-800">Añadir Nuevo Ciclista</h3>
                <button
                  onClick={() => setShowAddCyclist(false)}
                  className="text-slate-500 hover:text-slate-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
                  <input
                    type="text"
                    value={newCyclist.name || ''}
                    onChange={(e) => setNewCyclist({ ...newCyclist, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={newCyclist.email || ''}
                    onChange={(e) => setNewCyclist({ ...newCyclist, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono</label>
                  <input
                    type="tel"
                    value={newCyclist.phone || ''}
                    onChange={(e) => setNewCyclist({ ...newCyclist, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isAdmin"
                    checked={newCyclist.isAdmin || false}
                    onChange={(e) => setNewCyclist({ ...newCyclist, isAdmin: e.target.checked })}
                    className="rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                  />
                  <label htmlFor="isAdmin" className="ml-2 text-sm text-slate-700">
                    Administrador
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAddCyclist(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50"
                >
                  {t.cancel}
                </button>
                <button
                  onClick={handleAddCyclist}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                >
                  Añadir
                </button>
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
                  className="text-slate-500 hover:text-slate-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-4">
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
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="editIsAdmin"
                    checked={editingCyclist.isAdmin || false}
                    onChange={(e) => setEditingCyclist({ ...editingCyclist, isAdmin: e.target.checked })}
                    className="rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                  />
                  <label htmlFor="editIsAdmin" className="ml-2 text-sm text-slate-700">
                    {t.adminRole}
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setEditingCyclist(null)}
                  className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50"
                >
                  {t.cancel}
                </button>
                <button
                  onClick={handleSaveCyclist}
                  className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                >
                  <Save className="h-4 w-4" />
                  <span>{t.saveChanges}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Pass Modal */}
        {editingPass && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-800">{t.editPass}</h3>
                <button
                  onClick={() => setEditingPass(null)}
                  className="text-slate-500 hover:text-slate-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
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
                  <label className="block text-sm font-medium text-slate-700 mb-1">Altitud Máxima (m)</label>
                  <input
                    type="number"
                    value={editingPass.maxAltitude}
                    onChange={(e) => setEditingPass({ ...editingPass, maxAltitude: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Desnivel (m)</label>
                  <input
                    type="number"
                    value={editingPass.elevationGain}
                    onChange={(e) => setEditingPass({ ...editingPass, elevationGain: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Distancia (km)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingPass.distance}
                    onChange={(e) => setEditingPass({ ...editingPass, distance: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Pendiente Media (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingPass.averageGradient}
                    onChange={(e) => setEditingPass({ ...editingPass, averageGradient: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Dificultad</label>
                  <select
                    value={editingPass.difficulty}
                    onChange={(e) => setEditingPass({ ...editingPass, difficulty: e.target.value as any })}
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
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">{t.imageUrl}</label>
                <input
                  type="url"
                  value={editingPass.imageUrl}
                  onChange={(e) => setEditingPass({ ...editingPass, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">{t.description}</label>
                <textarea
                  value={editingPass.description}
                  onChange={(e) => setEditingPass({ ...editingPass, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  rows={3}
                />
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setEditingPass(null)}
                  className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50"
                >
                  {t.cancel}
                </button>
                <button
                  onClick={handleSavePass}
                  className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                >
                  <Save className="h-4 w-4" />
                  <span>{t.saveChanges}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};