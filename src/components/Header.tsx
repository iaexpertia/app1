import React from 'react';
import { Mountain, Award, Map } from 'lucide-react';

interface HeaderProps {
  activeTab: 'passes' | 'map' | 'stats';
  onTabChange: (tab: 'passes' | 'map' | 'stats') => void;
  conqueredCount: number;
  totalCount: number;
}

export const Header: React.FC<HeaderProps> = ({ 
  activeTab, 
  onTabChange, 
  conqueredCount, 
  totalCount 
}) => {
  return (
    <header className="bg-white shadow-lg border-b-2 border-orange-500">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-3">
            <Mountain className="h-8 w-8 text-orange-500" />
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Mountain Pass Conquest
              </h1>
              <p className="text-sm text-slate-600">
                {conqueredCount}/{totalCount} passes conquered
              </p>
            </div>
          </div>
          
          <nav className="flex space-x-1">
            <button
              onClick={() => onTabChange('passes')}
              className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                activeTab === 'passes'
                  ? 'bg-orange-500 text-white shadow-lg'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Mountain className="h-4 w-4" />
              <span>Passes</span>
            </button>
            
            <button
              onClick={() => onTabChange('map')}
              className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                activeTab === 'map'
                  ? 'bg-orange-500 text-white shadow-lg'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Map className="h-4 w-4" />
              <span>Map</span>
            </button>
            
            <button
              onClick={() => onTabChange('stats')}
              className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                activeTab === 'stats'
                  ? 'bg-orange-500 text-white shadow-lg'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Award className="h-4 w-4" />
              <span>Stats</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};