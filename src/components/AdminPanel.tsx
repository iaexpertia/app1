import React, { useState, useEffect } from 'react';
import { MountainPass, Cyclist, Business } from '../types';
import { Translation } from '../i18n/translations';
import { loadCyclists, updateCyclist, removeCyclist } from '../utils/cyclistStorage';
import { loadBusinesses, addBusiness, removeBusiness, updateBusiness } from '../utils/businessStorage';
import { 
  Settings, 
  Users, 
  Mountain, 
  Edit3, 
  Trash2, 
  Save,
  Building2,
  Plus,
  Mail,
  Phone,
  MapPin,
  Globe,
  Eye,
  EyeOff,
  X
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
  const [activeSection, setActiveSection] = useState<'cyclists' | 'passes' | 'businesses'>('cyclists');
  const [cyclists, setCyclists] = useState<Cyclist[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [editingCyclist, setEditingCyclist] = useState<Cyclist | null>(null);
  const [editingPass, setEditingPass] = useState<MountainPass | null>(null);
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);
  const [showAddBusinessModal, setShowAddBusinessModal] = useState(false);
  const [newBusiness, setNewBusiness] = useState<Partial<Business>>({
    name: '',
    description: '',
    category: 'Bike Shop',
    contactInfo: {
      email: '',
      phone: '',
      website: '',
      address: ''
    },
    images: [],
    isActive: true
  });

  useEffect(() => {
    setCyclists(loadCyclists());
    setBusinesses(loadBusinesses());
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

  const handleAddBusiness = () => {
    if (!newBusiness.name || !newBusiness.contactInfo?.email) {
      alert('Por favor completa al menos el nombre y email del negocio');
      return;
    }

    const businessToAdd: Business = {
      id: `business-${Date.now()}`,
      name: newBusiness.name!,
      description: newBusiness.description || '',
      category: newBusiness.category as any || 'Bike Shop',
      contactInfo: {
        email: newBusiness.contactInfo?.email || '',
        phone: newBusiness.contactInfo?.phone || '',
        website: newBusiness.contactInfo?.website || '',
        address: newBusiness.contactInfo?.address || ''
      },
      images: newBusiness.images || [],
      isActive: true,
      createdDate: new Date().toISOString().split('T')[0]
    };

    addBusiness(businessToAdd);
    setBusinesses(loadBusinesses());
    setShowAddBusinessModal(false);
    setNewBusiness({
      name: '',
      description: '',
      category: 'Bike Shop',
      contactInfo: {
        email: '',
        phone: '',
        website: '',
        address: ''
      },
      images: [],
      isActive: true
    });
  };

  const handleUpdateBusiness = (business: Business) => {
    updateBusiness(business);
    setBusinesses(loadBusinesses());
    setEditingBusiness(null);
  };

  const handleDeleteBusiness = (businessId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este negocio?')) {
      removeBusiness(businessId);
      setBusinesses(loadBusinesses());
    }
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
            onClick={() => setActiveSection('businesses')}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
              activeSection === 'businesses'
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            <Building2 className="h-4 w-4" />
            <span>{t.manageBusinesses}</span>
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

      {/* Businesses Management */}
      {activeSection === 'businesses' && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-slate-800">{t.registeredBusinesses}</h3>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-600">{businesses.length} {t.totalBusinesses}</span>
              <button
                onClick={() => setShowAddBusinessModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>{t.addBusiness}</span>
              </button>
            </div>
          </div>

          {businesses.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <p className="text-xl text-slate-600">{t.noBusinesses}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {businesses.map((business) => (
                <div key={business.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  {business.images.length > 0 && (
                    <div className="relative h-32 mb-3">
                      <img 
                        src={business.images[0]} 
                        alt={business.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-slate-800">{business.name}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      business.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {business.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                  
                  <p className="text-sm text-slate-600 mb-2">{business.category}</p>
                  <p className="text-sm text-slate-700 mb-3 line-clamp-2">{business.description}</p>
                  
                  <div className="space-y-1 text-xs text-slate-600 mb-4">
                    <div className="flex items-center">
                      <Mail className="h-3 w-3 mr-1" />
                      <span>{business.contactInfo.email}</span>
                    </div>
                    {business.contactInfo.phone && (
                      <div className="flex items-center">
                        <Phone className="h-3 w-3 mr-1" />
                        <span>{business.contactInfo.phone}</span>
                      </div>
                    )}
                    {business.contactInfo.address && (
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span className="line-clamp-1">{business.contactInfo.address}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingBusiness(business)}
                      className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm"
                    >
                      <Edit3 className="h-3 w-3" />
                      <span>Editar</span>
                    </button>
                    <button
                      onClick={() => handleDeleteBusiness(business.id)}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <Trash2 className="h-3 w-3" />
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

      {/* Add Business Modal */}
      {showAddBusinessModal && (
        <AddBusinessModal
          business={newBusiness}
          onSave={handleAddBusiness}
          onClose={() => setShowAddBusinessModal(false)}
          onChange={setNewBusiness}
          t={t}
        />
      )}

      {/* Edit Business Modal */}
      {editingBusiness && (
        <EditBusinessModal
          business={editingBusiness}
          onSave={handleUpdateBusiness}
          onClose={() => setEditingBusiness(null)}
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

// Add Business Modal Component
interface AddBusinessModalProps {
  business: Partial<Business>;
  onSave: () => void;
  onClose: () => void;
  onChange: (business: Partial<Business>) => void;
  t: Translation;
}

const AddBusinessModal: React.FC<AddBusinessModalProps> = ({ 
  business, 
  onSave, 
  onClose, 
  onChange,
  t 
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave();
  };

  const addImage = () => {
    const url = prompt('Introduce la URL de la imagen:');
    if (url) {
      onChange({
        ...business,
        images: [...(business.images || []), url]
      });
    }
  };

  const removeImage = (index: number) => {
    onChange({
      ...business,
      images: (business.images || []).filter((_, i) => i !== index)
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex items-center justify-between">
          <h3 className="text-xl font-semibold text-slate-800">{t.addBusiness}</h3>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t.businessName} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={business.name || ''}
                onChange={(e) => onChange({ ...business, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t.businessCategory}</label>
              <select
                value={business.category || 'Bike Shop'}
                onChange={(e) => onChange({ ...business, category: e.target.value as any })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="Bike Shop">Tienda de Bicicletas</option>
                <option value="Hotel">Hotel</option>
                <option value="Restaurant">Restaurante</option>
                <option value="Tour Guide">Guía Turístico</option>
                <option value="Equipment">Equipamiento</option>
                <option value="Other">Otro</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t.description}</label>
            <textarea
              value={business.description || ''}
              onChange={(e) => onChange({ ...business, description: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t.email} <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={business.contactInfo?.email || ''}
                onChange={(e) => onChange({ 
                  ...business, 
                  contactInfo: { ...business.contactInfo, email: e.target.value } as any
                })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t.phone}</label>
              <input
                type="tel"
                value={business.contactInfo?.phone || ''}
                onChange={(e) => onChange({ 
                  ...business, 
                  contactInfo: { ...business.contactInfo, phone: e.target.value } as any
                })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t.website}</label>
              <input
                type="url"
                value={business.contactInfo?.website || ''}
                onChange={(e) => onChange({ 
                  ...business, 
                  contactInfo: { ...business.contactInfo, website: e.target.value } as any
                })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="https://..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t.address}</label>
              <input
                type="text"
                value={business.contactInfo?.address || ''}
                onChange={(e) => onChange({ 
                  ...business, 
                  contactInfo: { ...business.contactInfo, address: e.target.value } as any
                })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-slate-700">{t.images}</label>
              <button
                type="button"
                onClick={addImage}
                className="text-sm text-orange-600 hover:text-orange-700"
              >
                + Añadir imagen
              </button>
            </div>
            {business.images && business.images.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {business.images.map((image, index) => (
                  <div key={index} className="relative">
                    <img src={image} alt={`Imagen ${index + 1}`} className="w-full h-20 object-cover rounded" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
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
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              {t.addBusiness}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Edit Business Modal Component
interface EditBusinessModalProps {
  business: Business;
  onSave: (business: Business) => void;
  onClose: () => void;
  t: Translation;
}

const EditBusinessModal: React.FC<EditBusinessModalProps> = ({ 
  business, 
  onSave, 
  onClose, 
  t 
}) => {
  const [formData, setFormData] = useState(business);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const addImage = () => {
    const url = prompt('Introduce la URL de la imagen:');
    if (url) {
      setFormData({
        ...formData,
        images: [...formData.images, url]
      });
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
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex items-center justify-between">
          <h3 className="text-xl font-semibold text-slate-800">{t.editBusiness}</h3>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t.businessName}</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t.businessCategory}</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="Bike Shop">Tienda de Bicicletas</option>
                <option value="Hotel">Hotel</option>
                <option value="Restaurant">Restaurante</option>
                <option value="Tour Guide">Guía Turístico</option>
                <option value="Equipment">Equipamiento</option>
                <option value="Other">Otro</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t.description}</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t.email}</label>
              <input
                type="email"
                value={formData.contactInfo.email}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  contactInfo: { ...formData.contactInfo, email: e.target.value }
                })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t.phone}</label>
              <input
                type="tel"
                value={formData.contactInfo.phone}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  contactInfo: { ...formData.contactInfo, phone: e.target.value }
                })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t.website}</label>
              <input
                type="url"
                value={formData.contactInfo.website}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  contactInfo: { ...formData.contactInfo, website: e.target.value }
                })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="https://..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t.address}</label>
              <input
                type="text"
                value={formData.contactInfo.address}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  contactInfo: { ...formData.contactInfo, address: e.target.value }
                })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-slate-700">{t.images}</label>
              <button
                type="button"
                onClick={addImage}
                className="text-sm text-orange-600 hover:text-orange-700"
              >
                + Añadir imagen
              </button>
            </div>
            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative">
                    <img src={image} alt={`Imagen ${index + 1}`} className="w-full h-20 object-cover rounded" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="rounded border-slate-300 text-orange-500 focus:ring-orange-500"
            />
            <label htmlFor="isActive" className="text-sm text-slate-700">Negocio activo</label>
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