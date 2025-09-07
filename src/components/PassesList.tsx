import React, { useState } from 'react';
import { MountainPass } from '../types';
import { PassCard } from './PassCard';
import { Search, Filter } from 'lucide-react';

interface PassesListProps {
  passes: MountainPass[];
  conqueredPassIds: Set<string>;
  onToggleConquest: (passId: string) => void;
  onViewDetails: (pass: MountainPass) => void;
}

export const PassesList: React.FC<PassesListProps> = ({
  passes,
  conqueredPassIds,
  onToggleConquest,
  onViewDetails
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

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
            placeholder="Search passes by name, country, or region..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
          />
        </div>
        
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-slate-500" />
            <span className="text-sm font-medium text-slate-700">Filters:</span>
          </div>
          
          <select
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
            className="px-3 py-1 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
            <option value="Extreme">Extreme</option>
          </select>
          
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-1 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">All Categories</option>
            <option value="Alps">Alps</option>
            <option value="Pyrenees">Pyrenees</option>
            <option value="Dolomites">Dolomites</option>
            <option value="Other">Other</option>
          </select>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">All Status</option>
            <option value="conquered">Conquered</option>
            <option value="pending">Pending</option>
          </select>
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
          />
        ))}
      </div>
      
      {filteredPasses.length === 0 && (
        <div className="text-center py-12">
          <Mountain className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <p className="text-xl text-slate-600 mb-2">No passes found</p>
          <p className="text-slate-500">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};