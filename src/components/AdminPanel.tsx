import React, { useState, useEffect } from 'react';
import { MountainPass, Cyclist } from '../types';
import { Translation } from '../i18n/translations';
import { 
  loadCyclists, 
  saveCyclists, 
  removeCyclist, 
  updateCyclist 
} from '../utils/cyclistStorage';
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
  UserCheck
} from 'lucide-react';

interface AdminPanelProps {
  passes: MountainPass[];
  onUpdatePass: (pass: MountainPass) => void;
  t: Translation;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ passes, onUpdatePass, t }) => {
  const [cyclists, setCyclists] = useState<Cyclist[]>([]);
  const [editingCyclist, setEditingCyclist] = useState<Cyclist | null>(null);
  const [editingPass, setEditingPass] = useState<MountainPass | null>(null);
  const [activeTab, setActiveTab] = useState<'cyclists' | 'passes' | 'brands' | 'news' | 'collaborators'>('cyclists');

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
                <span className="text-sm text-slate-600">
                  {cyclists.length} {t.totalCyclists}
                </span>
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
              <h3 className="text-xl font-semibold text-slate-800 mb-4">{t.managePasses}</h3>
              
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
                <button className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                  <Plus className="h-4 w-4" />
                  <span>Añadir Marca</span>
                </button>
              </div>
              
              <div className="text-center py-12">
                <Tag className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <p className="text-xl text-slate-600 mb-2">Gestión de Marcas</p>
                <p className="text-slate-500">Funcionalidad en desarrollo para gestionar marcas de ciclismo</p>
              </div>
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
                <button className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                  <Plus className="h-4 w-4" />
                  <span>Nueva Noticia</span>
                </button>
              </div>
              
              <div className="text-center py-12">
                <Newspaper className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <p className="text-xl text-slate-600 mb-2">Gestión de Noticias</p>
                <p className="text-slate-500">Funcionalidad en desarrollo para crear y gestionar noticias</p>
              </div>
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
                <button className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                  <Plus className="h-4 w-4" />
                  <span>Añadir Colaborador</span>
                </button>
              </div>
              
              <div className="text-center py-12">
                <UserCheck className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <p className="text-xl text-slate-600 mb-2">Gestión de Colaboradores</p>
                <p className="text-slate-500">Funcionalidad en desarrollo para gestionar colaboradores y patrocinadores</p>
              </div>
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
      </div>
    </div>
  );
};