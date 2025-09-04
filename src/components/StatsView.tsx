import React from 'react';
import { UserStats, MountainPass } from '../types';
import { Translation } from '../i18n/translations';
import { 
  Mountain, 
  TrendingUp, 
  Award, 
  Globe,
  Target,
  BarChart3,
  Info
} from 'lucide-react';

interface StatsViewProps {
  stats: UserStats;
  conqueredPasses: MountainPass[];
  t: Translation;
}

export const StatsView: React.FC<StatsViewProps> = ({ stats, conqueredPasses, t }) => {
  const [showTooltip, setShowTooltip] = React.useState(false);
  const progressPercentage = (stats.conqueredPasses / stats.totalPasses) * 100;
  
  const difficultyStats = conqueredPasses.reduce((acc, pass) => {
    acc[pass.difficulty] = (acc[pass.difficulty] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const categoryStats = conqueredPasses.reduce((acc, pass) => {
    acc[pass.category] = (acc[pass.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">{t.statsTitle}</h2>
        <p className="text-slate-600">{t.statsDescription}</p>
      </div>
      
      {/* Progress Overview */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex items-center mb-6">
          <Target className="h-6 w-6 text-orange-500 mr-3" />
          <h3 className="text-xl font-semibold text-slate-800">{t.overallProgress}</h3>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between text-sm text-slate-600 mb-2">
            <span>{t.passesConqueredStat}</span>
            <span>{stats.conqueredPasses} / {stats.totalPasses}</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-orange-400 to-orange-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <p className="text-right text-lg font-bold text-orange-600 mt-2">
            {progressPercentage.toFixed(1)}% {t.complete}
          </p>
        </div>
      </div>
      
      {/* Key Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <Mountain className="h-8 w-8 text-orange-500" />
            <span className="text-2xl font-bold text-slate-800">{stats.conqueredPasses}</span>
          </div>
          <h3 className="text-sm font-medium text-slate-600">{t.passesConqueredStat}</h3>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="h-8 w-8 text-green-500" />
            <span className="text-2xl font-bold text-slate-800">
              {(stats.totalElevationGain / 1000).toFixed(1)}k
            </span>
          </div>
          <h3 className="text-sm font-medium text-slate-600">{t.elevationGained}</h3>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Award className="h-8 w-8 text-purple-500" />
              <div className="relative">
                <button
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <Info className="h-4 w-4" />
                </button>
                {showTooltip && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-800 text-white text-xs rounded-lg whitespace-nowrap z-10">
                    Por ejemplo, si has conquistado puertos con pendientes de 8%, 6% y 10%, la dificultad media será 8.0%.
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                  </div>
                )}
              </div>
            </div>
            <span className="text-2xl font-bold text-slate-800">{stats.averageDifficulty}</span>
          </div>
          <h3 className="text-sm font-medium text-slate-600">{t.avgDifficulty}</h3>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <Globe className="h-8 w-8 text-blue-500" />
            <span className="text-2xl font-bold text-slate-800">{stats.countriesVisited.length}</span>
          </div>
          <h3 className="text-sm font-medium text-slate-600">{t.countriesVisited}</h3>
        </div>
      </div>
      
      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center mb-6">
            <BarChart3 className="h-6 w-6 text-orange-500 mr-3" />
            <h3 className="text-xl font-semibold text-slate-800">{t.difficultyBreakdown}</h3>
          </div>
          
          <div className="space-y-4">
            {Object.entries(difficultyStats).map(([difficulty, count]) => {
              const percentage = (count / stats.conqueredPasses) * 100;
              const colorMap: Record<string, string> = {
                Cuarta: 'bg-green-500',
                Tercera: 'bg-blue-500',
                Segunda: 'bg-yellow-500',
                Primera: 'bg-orange-500',
                Especial: 'bg-red-500',
                HC: 'bg-purple-500'
              };
              
              return (
                <div key={difficulty}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-700">{t[difficulty.toLowerCase() as keyof Translation] || difficulty}</span>
                    <span className="text-slate-600">{count} passes</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${colorMap[difficulty]} transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center mb-6">
            <Globe className="h-6 w-6 text-orange-500 mr-3" />
            <h3 className="text-xl font-semibold text-slate-800">{t.regionalDistribution}</h3>
          </div>
          
          <div className="space-y-4">
            {Object.entries(categoryStats).map(([category, count]) => {
              const percentage = (count / stats.conqueredPasses) * 100;
              const colorMap: Record<string, string> = {
                'Alpes': 'bg-blue-500',
                'Pirineos': 'bg-purple-500', 
                'Dolomitas': 'bg-pink-500',
                'Andes': 'bg-emerald-500',
                'Otros': 'bg-gray-500',
                'Provenza': 'bg-yellow-500'
              };
              
              return (
                <div key={category}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-700">{category}</span>
                    <span className="text-slate-600">{count} passes</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${colorMap[category]} transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Countries Visited */}
      {stats.countriesVisited.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
          <div className="flex items-center mb-6">
            <Globe className="h-6 w-6 text-orange-500 mr-3" />
            <h3 className="text-xl font-semibold text-slate-800">{t.countriesConquered}</h3>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {stats.countriesVisited.map(country => {
              const getCountryText = (country: string) => {
                const countryMap: Record<string, keyof Translation> = {
                  'France': 'france',
                  'Italy': 'italy',
                  'Spain': 'spain',
                  'England': 'england'
                };
                return t[countryMap[country]] || country;
              };
              
              return (
                <span 
                  key={country}
                  className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium"
                >
                  {getCountryText(country)}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};