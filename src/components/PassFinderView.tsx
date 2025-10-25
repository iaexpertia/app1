import React, { useState, useMemo } from 'react';
import { Search, MapPin, TrendingUp } from 'lucide-react';
import { MountainPass } from '../types';
import { Translation } from '../i18n/translations';
import { PassCard } from './PassCard';

interface PassFinderViewProps {
  passes: MountainPass[];
  conqueredPassIds: Set<string>;
  onToggleConquest: (passId: string) => void;
  onViewDetails: (pass: MountainPass) => void;
  onAddPhotos: (passId: string) => void;
  t: Translation;
}

export const PassFinderView: React.FC<PassFinderViewProps> = ({
  passes,
  conqueredPassIds,
  onToggleConquest,
  onViewDetails,
  onAddPhotos,
  t
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  const regions = useMemo(() => {
    const uniqueRegions = Array.from(new Set(passes.map(pass => pass.region)));
    return uniqueRegions.sort();
  }, [passes]);

  const difficulties: Array<MountainPass['difficulty']> = ['Cuarta', 'Tercera', 'Segunda', 'Primera', 'Especial'];

  const latestPasses = useMemo(() => {
    return [...passes].slice(-6).reverse();
  }, [passes]);

  const filteredPasses = useMemo(() => {
    let filtered = passes;

    if (searchTerm) {
      filtered = filtered.filter(pass =>
        pass.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pass.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pass.country.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedRegion !== 'all') {
      filtered = filtered.filter(pass => pass.region === selectedRegion);
    }

    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(pass => pass.difficulty === selectedDifficulty);
    }

    return filtered;
  }, [passes, searchTerm, selectedRegion, selectedDifficulty]);

  const showResults = searchTerm || selectedRegion !== 'all' || selectedDifficulty !== 'all';

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">{t.passFinderTitle}</h1>
        <p className="text-slate-600">{t.passFinderDescription}</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
            <input
              type="text"
              placeholder={t.searchPass}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5 pointer-events-none" />
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">{t.selectRegion}</option>
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5 pointer-events-none" />
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">{t.selectDifficulty}</option>
              {difficulties.map((difficulty) => (
                <option key={difficulty} value={difficulty}>
                  {difficulty === 'Cuarta' && t.cuarta}
                  {difficulty === 'Tercera' && t.tercera}
                  {difficulty === 'Segunda' && t.segunda}
                  {difficulty === 'Primera' && t.primera}
                  {difficulty === 'Especial' && t.especial}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {showResults ? (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            {t.searchResults} ({filteredPasses.length})
          </h2>
          {filteredPasses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPasses.map((pass) => (
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
          ) : (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <p className="text-slate-600 text-lg">{t.noPassesFound}</p>
              <p className="text-slate-500 mt-2">{t.noPassesFoundDesc}</p>
            </div>
          )}
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            {t.latestPasses}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestPasses.map((pass) => (
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
        </div>
      )}
    </div>
  );
};
