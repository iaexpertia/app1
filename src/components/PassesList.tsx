import React, { useState } from 'react';
import { MountainPass } from '../types';
import { Translation } from '../i18n/translations';
import { PassCard } from './PassCard';
import { Search, Filter } from 'lucide-react';

interface PassesListProps {
  passes: MountainPass[];
  conqueredPassIds: Set<string>;
  onToggleConquest: (passId: string) => void;
  onViewDetails: (pass: MountainPass) => void;
  onAddPhotos: (passId: string) => void;
  t: Translation;
}

export const PassesList: React.FC<PassesListProps> = ({
  passes,
  conqueredPassIds,
  onToggleConquest,
  onViewDetails,
  onAddPhotos,
  t
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Get unique categories from passes
  const availableCategories = [...new Set(passes.map(pass => pass.category))];

  const getCategoryText = (category: string) => {
    // Si la categoría ya está en español, la devolvemos tal como está
    // Si no, intentamos traducirla
    const categoryMap: Record<string, string> = {
      'Alps': 'Alpes',
      'Pyrenees': 'Pirineos',
      'Dolomites': 'Dolomitas',
      'Andes': 'Andes',
      'Other': 'Otros'
    };
    return categoryMap[category] || category;
  };

  const filteredPasses = passes.filter(pass => {
    const matchesSearch = pass.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pass.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pass.region.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDifficulty = filterDifficulty === 'all' || pass.difficulty === filterDifficulty;
    const matchesCategory = filterCategory === 'all' || pass.category === filterCategory;
    const isConquered = conqueredPassIds.has(pass.id);
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'conquered' && isConquered) ||
                         (filterStatus === 'pending' && !isConquered);
    
    return matchesSearch && matchesDifficulty && matchesCategory && matchesStatus;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-slate-500" />
            <span className="text-sm font-medium text-slate-700">{t.filters}</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full sm:w-auto">
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">{t.allDifficulties}</option>
              <option value="Cuarta">{t.cuarta}</option>
              <option value="Tercera">{t.tercera}</option>
              <option value="Segunda">{t.segunda}</option>
              <option value="Primera">{t.primera}</option>
              <option value="Especial">{t.especial}</option>
            </select>
            
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">{t.allCategories}</option>
              {availableCategories.map(category => (
                <option key={category} value={category}>
                  {getCategoryText(category)}
                </option>
              ))}
            </select>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">{t.allStatus}</option>
              <option value="conquered">{t.conqueredStatus}</option>
              <option value="pending">{t.pendingStatus}</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPasses.map(pass => (
          <PassCard
            key={pass.id}
            pass={pass}
            isConquered={conqueredPassIds.has(pass.id)}
            onToggleConquest={onToggleConquest}
            onViewDetails={onViewDetails}
            onAddPhotos={onAddPhotos}
            t={t}
          />
        ))}
      </div>
      
      {filteredPasses.length === 0 && (
        <div className="text-center py-12">
          <Mountain className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <p className="text-xl text-slate-600 mb-2">{t.noPassesFound}</p>
          <p className="text-slate-500">{t.noPassesFoundDesc}</p>
        </div>
      )}
    </div>
  );
};