import React, { useState } from 'react';
import { Users, Mountain, Tag, UserCheck, Newspaper, Download } from 'lucide-react';
import { Pass, Cyclist, Brand, Collaborator, News } from '../types';
import { exportCyclists, exportPasses, exportBrands, exportCollaborators, exportNews } from '../utils/excelExport';
import { getCyclists } from '../utils/cyclistStorage';
import { getBrands } from '../utils/brandsStorage';
import { getCollaborators } from '../utils/collaboratorStorage';
import { getNews } from '../utils/newsStorage';

interface AdminPanelProps {
  passes: Pass[];
  onUpdatePass: (pass: Pass) => void;
  t: (key: string) => string;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ passes, onUpdatePass, t }) => {
  const [activeTab, setActiveTab] = useState('cyclists');

  const handleExportCyclists = () => {
    const cyclists = getCyclists();
    exportCyclists(cyclists);
  };

  const handleExportPasses = () => {
    exportPasses(passes);
  };

  const handleExportBrands = () => {
    const brands = getBrands();
    exportBrands(brands);
  };

  const handleExportCollaborators = () => {
    const collaborators = getCollaborators();
    exportCollaborators(collaborators);
  };

  const handleExportNews = () => {
    const news = getNews();
    exportNews(news);
  };

  const tabs = [
    { id: 'cyclists', label: 'Gestionar Ciclistas', icon: Users },
    { id: 'passes', label: 'Gestionar Puertos', icon: Mountain },
    { id: 'brands', label: 'Gestionar Marcas', icon: Tag },
    { id: 'collaborators', label: 'Gestionar Colaboradores', icon: UserCheck },
    { id: 'news', label: 'Gestionar Noticias', icon: Newspaper },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Panel de Administración</h1>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {activeTab === 'cyclists' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Gestión de Ciclistas</h2>
              <button
                onClick={handleExportCyclists}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Download className="w-4 h-4" />
                Exportar Excel
              </button>
            </div>
            <p className="text-gray-600">Funcionalidad de gestión de ciclistas en desarrollo.</p>
          </div>
        )}

        {activeTab === 'passes' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Gestión de Puertos de Montaña</h2>
              <button
                onClick={handleExportPasses}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Download className="w-4 h-4" />
                Exportar Excel
              </button>
            </div>
            <p className="text-gray-600">Funcionalidad de gestión de puertos en desarrollo.</p>
          </div>
        )}

        {activeTab === 'brands' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Gestión de Marcas</h2>
              <button
                onClick={handleExportBrands}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Download className="w-4 h-4" />
                Exportar Excel
              </button>
            </div>
            <p className="text-gray-600">Funcionalidad de gestión de marcas en desarrollo.</p>
          </div>
        )}

        {activeTab === 'collaborators' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Gestión de Colaboradores</h2>
              <button
                onClick={handleExportCollaborators}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Download className="w-4 h-4" />
                Exportar Excel
              </button>
            </div>
            <p className="text-gray-600">Funcionalidad de gestión de colaboradores en desarrollo.</p>
          </div>
        )}

        {activeTab === 'news' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Gestión de Noticias</h2>
              <button
                onClick={handleExportNews}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Download className="w-4 h-4" />
                Exportar Excel
              </button>
            </div>
            <p className="text-gray-600">Funcionalidad de gestión de noticias en desarrollo.</p>
          </div>
        )}
      </div>
    </div>
  );
};