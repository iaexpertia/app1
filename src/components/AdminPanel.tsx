import React, { useState, useEffect } from 'react';
import { MountainPass, Cyclist } from '../types';
import { Translation } from '../i18n/translations';
import { 
  loadCyclists, 
  removeCyclist, 
  updateCyclist 
} from '../utils/cyclistStorage';
import { exportCyclistsToExcel, exportPassesToExcel } from '../utils/excelExport';
import { 
  Settings, 
  Users, 
  Mountain, 
  Edit, 
  Trash2, 
  Save, 
  X,
  Download,
  UserCheck,
  Shield
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
  const [editingCyclist, setEditingCyclist] = useState<Cyclist | null>(null);
  const [editingPass, setEditingPass] = useState<MountainPass | null>(null);
  const [activeTab, setActiveTab] = useState<'cyclists' | 'passes'>('cyclists');

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

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Settings className="h-8 w-8 text-orange-500 mr-3" />
            <div>
              <h2 className="text-2xl font-bold text-slate-800">{t.adminPanel}</h2>
              <p className="text-slate-600">Gestión completa del sistema</p>
            </div>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-slate-200 rounded-lg p-1 mb-6">
            <button
              onClick={() => setActiveTab('cyclists')}
              className={`flex-1 py-2 px-4 rounded-md transition-colors font-medium ${
                activeTab === 'cyclists'
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <Users className="h-4 w-4 inline mr-2" />
              {t.manageCyclists}
            </button>
            <button
              onClick={() => setActiveTab('passes')}
              className={`flex-1 py-2 px-4 rounded-md transition-colors font-medium ${
                activeTab === 'passes'
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <Mountain className="h-4 w-4 inline mr-2" />
              {t.managePasses}
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
                  <h3 className="text-xl font-semibold text-slate-800">{t.registeredCyclists}</h3>
                  <p className="text-slate-600">{cyclists.length} {t.totalCyclists}</p>
                </div>
              </div>
              <button
                onClick={() => exportCyclistsToExcel(cyclists)}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                <Download className="h-4 w-4" />
                <span>Exportar a Excel</span>
              </button>
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
                      <th className="text-left py-3 px-4 font-semibold text-slate-700">Ciclista</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-700">Contacto</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-700">Bicicletas</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-700">Registro</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-700">Rol</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-700">{t.actions}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cyclists.map(cyclist => (
                      <tr key={cyclist.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-semibold text-slate-800">{cyclist.name}</p>
                            {cyclist.alias && (
                              <p className="text-sm text-slate-600">"{cyclist.alias}"</p>
                            )}
                            {cyclist.age && (
                              <p className="text-xs text-slate-500">{cyclist.age} años</p>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm">
                            <p className="text-slate-800">{cyclist.email}</p>
                            <p className="text-slate-600">{cyclist.phone}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {cyclist.bikes.length} bicicleta{cyclist.bikes.length !== 1 ? 's' : ''}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-sm text-slate-600">
                            {new Date(cyclist.registrationDate).toLocaleDateString('es-ES')}
                          </p>
                        </td>
                        <td className="py-4 px-4">
                          {cyclist.isAdmin ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                              <Shield className="h-3 w-3 mr-1" />
                              Admin
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                              <UserCheck className="h-3 w-3 mr-1" />
                              Usuario
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setEditingCyclist(cyclist)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title={t.editCyclist}
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteCyclist(cyclist.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Eliminar ciclista"
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
                onClick={() => exportPassesToExcel(passes)}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                <Download className="h-4 w-4" />
                <span>Exportar a Excel</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {passes.map(pass => (
                <div key={pass.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-slate-800">{pass.name}</h4>
                      <p className="text-sm text-slate-600">{pass.region}, {pass.country}</p>
                    </div>
                    <button
                      onClick={() => setEditingPass(pass)}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title={t.editPass}
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-slate-500">Altitud:</span>
                      <span className="ml-1 font-medium">{pass.maxAltitude}m</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Desnivel:</span>
                      <span className="ml-1 font-medium">+{pass.elevationGain}m</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Distancia:</span>
                      <span className="ml-1 font-medium">{pass.distance}km</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Dificultad:</span>
                      <span className="ml-1 font-medium">{pass.difficulty}</span>
                    </div>
                  </div>
                </div>
              ))}
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
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {t.name}
                  </label>
                  <input
                    type="text"
                    value={editingCyclist.name}
                    onChange={(e) => setEditingCyclist({
                      ...editingCyclist,
                      name: e.target.value
                    })}
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
                    onChange={(e) => setEditingCyclist({
                      ...editingCyclist,
                      email: e.target.value
                    })}
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
                    onChange={(e) => setEditingCyclist({
                      ...editingCyclist,
                      phone: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={editingCyclist.isAdmin || false}
                      onChange={(e) => setEditingCyclist({
                        ...editingCyclist,
                        isAdmin: e.target.checked
                      })}
                      className="rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                    />
                    <span className="text-sm text-slate-700">{t.adminRole}</span>
                  </label>
                  <p className="text-xs text-slate-500 mt-1">{t.adminRoleDescription}</p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
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
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={editingPass.name}
                    onChange={(e) => setEditingPass({
                      ...editingPass,
                      name: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {t.country}
                  </label>
                  <input
                    type="text"
                    value={editingPass.country}
                    onChange={(e) => setEditingPass({
                      ...editingPass,
                      country: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {t.region}
                  </label>
                  <input
                    type="text"
                    value={editingPass.region}
                    onChange={(e) => setEditingPass({
                      ...editingPass,
                      region: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Altitud Máxima (m)
                  </label>
                  <input
                    type="number"
                    value={editingPass.maxAltitude}
                    onChange={(e) => setEditingPass({
                      ...editingPass,
                      maxAltitude: parseInt(e.target.value) || 0
                    })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Desnivel (m)
                  </label>
                  <input
                    type="number"
                    value={editingPass.elevationGain}
                    onChange={(e) => setEditingPass({
                      ...editingPass,
                      elevationGain: parseInt(e.target.value) || 0
                    })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Distancia (km)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingPass.distance}
                    onChange={(e) => setEditingPass({
                      ...editingPass,
                      distance: parseFloat(e.target.value) || 0
                    })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {t.imageUrl}
                  </label>
                  <input
                    type="url"
                    value={editingPass.imageUrl}
                    onChange={(e) => setEditingPass({
                      ...editingPass,
                      imageUrl: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {t.description}
                  </label>
                  <textarea
                    value={editingPass.description}
                    onChange={(e) => setEditingPass({
                      ...editingPass,
                      description: e.target.value
                    })}
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
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
        )}
      </div>
    </div>
  );
};