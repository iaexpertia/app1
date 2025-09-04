import React, { useState, useEffect } from 'react';
import { MountainPass, Cyclist } from '../types';
import { Translation } from '../i18n/translations';
import { loadCyclists, updateCyclist, removeCyclist } from '../utils/cyclistStorage';
import { 
  Settings, 
  Users, 
  Mountain, 
  Edit3, 
  Trash2, 
  Save,
  Upload,
  Eye,
  EyeOff
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
  const [activeSection, setActiveSection] = useState<'cyclists' | 'passes'>('cyclists');
  const [cyclists, setCyclists] = useState<Cyclist[]>([]);
  const [editingCyclist, setEditingCyclist] = useState<Cyclist | null>(null);
  const [editingPass, setEditingPass] = useState<MountainPass | null>(null);
  const [showPasswords, setShowPasswords] = useState(false);

  useEffect(() => {
    setCyclists(loadCyclists());
  }, []);

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