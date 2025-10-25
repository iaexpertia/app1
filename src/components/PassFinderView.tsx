import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, MapPin, TrendingUp, ChevronDown } from 'lucide-react';
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
  const [showDropdown, setShowDropdown] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const regions = useMemo(() => {
    const uniqueRegions = Array.from(new Set(passes.map(pass => pass.region)));
    return uniqueRegions.sort();
  }, [passes]);

  const difficulties: Array<MountainPass['difficulty']> = ['Cuarta', 'Tercera', 'Segunda', 'Primera', 'Especial'];

  const latestPasses = useMemo(() => {
    return [...passes].slice(-6).reverse();
  }, [passes]);

  const suggestionsPasses = useMemo(() => {
    if (!searchTerm.trim()) {
      return passes.sort((a, b) => a.name.localeCompare(b.name));
    }
    return passes
      .filter(pass =>
        pass.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pass.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pass.country.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [passes, searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (focusedIndex >= 0 && dropdownRef.current) {
      const dropdown = dropdownRef.current.querySelector('.dropdown-list');
      const focusedItem = dropdown?.children[focusedIndex] as HTMLElement;
      if (focusedItem && dropdown) {
        const dropdownRect = dropdown.getBoundingClientRect();
        const itemRect = focusedItem.getBoundingClientRect();

        if (itemRect.bottom > dropdownRect.bottom) {
          focusedItem.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        } else if (itemRect.top < dropdownRect.top) {
          focusedItem.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
      }
    }
  }, [focusedIndex]);

  const handleSelectPass = (pass: MountainPass) => {
    setSearchTerm(pass.name);
    setShowDropdown(false);
    setFocusedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev =>
          prev < suggestionsPasses.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < suggestionsPasses.length) {
          handleSelectPass(suggestionsPasses[focusedIndex]);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setFocusedIndex(-1);
        break;
    }
  };

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
          <div className="relative" ref={dropdownRef}>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5 z-10" />
            <input
              ref={inputRef}
              type="text"
              placeholder={t.searchPass}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowDropdown(true);
                setFocusedIndex(-1);
              }}
              onFocus={() => setShowDropdown(true)}
              onKeyDown={handleKeyDown}
              className="w-full pl-10 pr-10 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              autoComplete="off"
            />
            <ChevronDown
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5 cursor-pointer z-10"
              onClick={() => {
                setShowDropdown(!showDropdown);
                inputRef.current?.focus();
              }}
            />

            {showDropdown && suggestionsPasses.length > 0 && (
              <div className="dropdown-list absolute z-50 w-full mt-1 bg-white border border-slate-300 rounded-lg shadow-xl max-h-80 overflow-y-auto">
                {suggestionsPasses.map((pass, index) => (
                  <div
                    key={pass.id}
                    onClick={() => handleSelectPass(pass)}
                    onMouseEnter={() => setFocusedIndex(index)}
                    className={`px-4 py-3 cursor-pointer border-b border-slate-100 last:border-b-0 transition-colors ${
                      index === focusedIndex
                        ? 'bg-orange-50'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-slate-800">{pass.name}</div>
                        <div className="text-sm text-slate-500 flex items-center gap-2 mt-1">
                          <MapPin className="h-3 w-3" />
                          <span>{pass.region}, {pass.country}</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          pass.difficulty === 'Especial' ? 'bg-red-100 text-red-800' :
                          pass.difficulty === 'Primera' ? 'bg-orange-100 text-orange-800' :
                          pass.difficulty === 'Segunda' ? 'bg-yellow-100 text-yellow-800' :
                          pass.difficulty === 'Tercera' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {pass.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
