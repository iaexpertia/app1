import React, { useState, useEffect } from 'react';
import { MountainPass, Cyclist, Brand, Collaborator, NewsArticle } from '../types';
import { Translation } from '../i18n/translations';
import { 
  loadCyclists, 
  saveCyclists, 
  removeCyclist, 
  updateCyclist 
} from '../utils/cyclistStorage';
import { loadBrands, saveBrands } from '../utils/brandsStorage';
import { loadCollaborators, saveCollaborators } from '../utils/collaboratorStorage';
import { loadNews, saveNews } from '../utils/newsStorage';
import { loadSocialMediaUrls, saveSocialMediaUrls } from './Footer';
import { exportCyclists, exportBrands, exportCollaborators, exportNews, exportMountainPasses } from '../utils/excelExport';
import { 
  Settings, 
  Users, 
  Mountain, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Download,
  Tag,
  UserCheck,
  Newspaper,
  Instagram,
  Facebook,
  Youtube,
  Linkedin,
  Globe
} from 'lucide-react';

interface AdminPanelProps {
  passes: MountainPass[];
  onUpdatePass: (pass: MountainPass) => void;
  t: Translation;
}

interface SocialMediaUrls {
  instagram: string;
  facebook: string;
  youtube: string;
  linkedin: string;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ passes, onUpdatePass, t }) => {
  const [activeTab, setActiveTab] = useState<'cyclists' | 'passes' | 'brands' | 'collaborators' | 'news' | 'social'>('cyclists');
  const [cyclists, setCyclists] = useState<Cyclist[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [socialUrls, setSocialUrls] = useState<SocialMediaUrls>({
    instagram: '',
    facebook: '',
    youtube: '',
    linkedin: ''
  });
  const [editingCyclist, setEditingCyclist] = useState<Cyclist | null>(null);
  const [editingPass, setEditingPass] = useState<MountainPass | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    setCyclists(loadCyclists());
    setBrands(loadBrands());
    setCollaborators(loadCollaborators());
    setNews(loadNews());
    setSocialUrls(loadSocialMediaUrls());
  }, []);

  const handleDeleteCyclist = (cyclistId: string) => {
    removeCyclist(cyclistId);
    setCyclists(loadCyclists());
    setShowDeleteConfirm(null);
  };

  const handleUpdateCyclist = (cyclist: Cyclist) => {
    updateCyclist(cyclist);
    setCyclists(loadCyclists());
    setEditingCyclist(null);
  };

  const handleUpdatePass = (pass: MountainPass) => {
    onUpdatePass(pass);
    setEditingPass(null);
  };

  const handleSaveSocialUrls = () => {
    saveSocialMediaUrls(socialUrls);
    // Trigger a custom event to notify Footer component
    window.dispatchEvent(new CustomEvent('socialMediaUpdated'));
    alert('URLs de redes sociales actualizadas correctamente');
  };

  const adminTabs = [
    { key: 'cyclists', icon: Users, label: 'Ciclistas', count: cyclists.length },
    { key: 'passes', icon: Mountain, label: 'Puertos', count: passes.length },
    { key: 'brands', icon: Tag, label: 'Marcas', count: brands.length },
    { key: 'collaborators', icon: UserCheck, label: 'Colaboradores', count: collaborators.length },
    { key: 'news', icon: Newspaper, label: 'Noticias', count: news.length },
    { key: 'social', icon: Globe, label: 'Redes Sociales', count: 0 }
  ];

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
        </div>

        {/* Admin Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="border-b border-slate-200">
            <nav className="flex space-x-8 px-6">
              {adminTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.key
                        ? 'border-orange-500 text-orange-600'
                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                    {tab.count > 0 && (
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        activeTab === tab.key
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {/* Cyclists Tab */}
            {activeTab === 'cyclists' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-slate-800">{t.registeredCyclists}</h3>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-slate-600">
                      {cyclists.length} {t.totalCyclists}
                    </span>
                    <button
                      onClick={() => exportCyclists(cyclists)}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      <span>Exportar CSV</span>
                    </button>
                  </div>
                </div>

                {cyclists.length === 0 ? (
                  <p className="text-slate-500 text-center py-8">{t.noCyclists}</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-200">
                          <th className="text-left py-3 px-4 font-medium text-slate-700">Nombre</th>
                          <th className="text-left py-3 px-4 font-medium text-slate-700">Email</th>
                          <th className="text-left py-3 px-4 font-medium text-slate-700">Teléfono</th>
                          <th className="text-left py-3 px-4 font-medium text-slate-700">Bicicletas</th>
                          <th className="text-left py-3 px-4 font-medium text-slate-700">Admin</th>
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
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                cyclist.isAdmin 
                                  ? 'bg-red-100 text-red-800' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {cyclist.isAdmin ? 'Admin' : 'Usuario'}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => setEditingCyclist(cyclist)}
                                  className="text-blue-600 hover:text-blue-800 transition-colors"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => setShowDeleteConfirm(cyclist.id)}
                                  className="text-red-600 hover:text-red-800 transition-colors"
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

            {/* Social Media Tab */}
            {activeTab === 'social' && (
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">Gestión de Redes Sociales</h3>
                  <p className="text-slate-600">Configura las URLs de las redes sociales que aparecerán en el footer</p>
                </div>

                <div className="space-y-6">
                  {/* Instagram */}
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-3 w-32">
                      <Instagram className="h-6 w-6 text-pink-500" />
                      <span className="font-medium text-slate-700">Instagram</span>
                    </div>
                    <input
                      type="url"
                      value={socialUrls.instagram}
                      onChange={(e) => setSocialUrls({ ...socialUrls, instagram: e.target.value })}
                      className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="https://instagram.com/cyclepeaks"
                    />
                  </div>

                  {/* Facebook */}
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-3 w-32">
                      <Facebook className="h-6 w-6 text-blue-600" />
                      <span className="font-medium text-slate-700">Facebook</span>
                    </div>
                    <input
                      type="url"
                      value={socialUrls.facebook}
                      onChange={(e) => setSocialUrls({ ...socialUrls, facebook: e.target.value })}
                      className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="https://facebook.com/cyclepeaks"
                    />
                  </div>

                  {/* YouTube */}
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-3 w-32">
                      <Youtube className="h-6 w-6 text-red-600" />
                      <span className="font-medium text-slate-700">YouTube</span>
                    </div>
                    <input
                      type="url"
                      value={socialUrls.youtube}
                      onChange={(e) => setSocialUrls({ ...socialUrls, youtube: e.target.value })}
                      className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="https://youtube.com/@cyclepeaks"
                    />
                  </div>

                  {/* LinkedIn */}
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-3 w-32">
                      <Linkedin className="h-6 w-6 text-blue-700" />
                      <span className="font-medium text-slate-700">LinkedIn</span>
                    </div>
                    <input
                      type="url"
                      value={socialUrls.linkedin}
                      onChange={(e) => setSocialUrls({ ...socialUrls, linkedin: e.target.value })}
                      className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="https://linkedin.com/company/cyclepeaks"
                    />
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end pt-6 border-t border-slate-200">
                    <button
                      onClick={handleSaveSocialUrls}
                      className="flex items-center space-x-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      <Save className="h-4 w-4" />
                      <span>Guardar URLs</span>
                    </button>
                  </div>

                  {/* Preview Section */}
                  <div className="bg-slate-50 rounded-lg p-6 border-t border-slate-200">
                    <h4 className="text-md font-semibold text-slate-800 mb-4">Vista Previa</h4>
                    <div className="flex space-x-4">
                      <a 
                        href={socialUrls.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-600 hover:text-pink-500 transition-colors"
                      >
                        <Instagram className="h-6 w-6" />
                      </a>
                      <a 
                        href={socialUrls.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-600 hover:text-blue-600 transition-colors"
                      >
                        <Facebook className="h-6 w-6" />
                      </a>
                      <a 
                        href={socialUrls.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-600 hover:text-red-600 transition-colors"
                      >
                        <Youtube className="h-6 w-6" />
                      </a>
                      <a 
                        href={socialUrls.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-600 hover:text-blue-700 transition-colors"
                      >
                        <Linkedin className="h-6 w-6" />
                      </a>
                    </div>
                    <p className="text-sm text-slate-500 mt-2">
                      Así aparecerán los iconos en el footer de la página
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Other existing tabs would go here */}
            {activeTab === 'passes' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-slate-800">Gestión de Puertos</h3>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-slate-600">
                      {passes.length} puertos totales
                    </span>
                    <button
                      onClick={() => exportMountainPasses(passes)}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      <span>Exportar CSV</span>
                    </button>
                  </div>
                </div>
                <p className="text-slate-500 text-center py-8">
                  Gestión de puertos disponible próximamente
                </p>
              </div>
            )}

            {activeTab === 'brands' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-slate-800">Gestión de Marcas</h3>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-slate-600">
                      {brands.length} marcas totales
                    </span>
                    <button
                      onClick={() => exportBrands(brands)}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      <span>Exportar CSV</span>
                    </button>
                  </div>
                </div>
                <p className="text-slate-500 text-center py-8">
                  Gestión de marcas disponible próximamente
                </p>
              </div>
            )}

            {activeTab === 'collaborators' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-slate-800">Gestión de Colaboradores</h3>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-slate-600">
                      {collaborators.length} colaboradores totales
                    </span>
                    <button
                      onClick={() => exportCollaborators(collaborators)}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      <span>Exportar CSV</span>
                    </button>
                  </div>
                </div>
                <p className="text-slate-500 text-center py-8">
                  Gestión de colaboradores disponible próximamente
                </p>
              </div>
            )}

            {activeTab === 'news' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-slate-800">Gestión de Noticias</h3>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-slate-600">
                      {news.length} noticias totales
                    </span>
                    <button
                      onClick={() => exportNews(news)}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      <span>Exportar CSV</span>
                    </button>
                  </div>
                </div>
                <p className="text-slate-500 text-center py-8">
                  Gestión de noticias disponible próximamente
                </p>
              </div>
            )}
          </div>
        </div>

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
              
              <div className="p-6">
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
                </div>
                
                <div className="flex justify-end space-x-3 pt-6 border-t mt-6">
                  <button
                    onClick={() => setEditingCyclist(null)}
                    className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    {t.cancel}
                  </button>
                  <button
                    onClick={() => handleUpdateCyclist(editingCyclist)}
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

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                {t.confirmDeleteCyclist}
              </h3>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  {t.cancel}
                </button>
                <button
                  onClick={() => handleDeleteCyclist(showDeleteConfirm)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};