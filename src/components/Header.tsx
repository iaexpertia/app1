import React, { useState } from 'react';
import { Mountain, Award, Map, UserPlus, Settings, Database, Menu, X, Users, Trophy, Tag, Newspaper, LogOut, UserCheck } from 'lucide-react';
import { LanguageSelector } from './LanguageSelector';
import { Translation } from '../i18n/translations';

interface HeaderProps {
  activeTab: 'passes' | 'map' | 'stats' | 'register' | 'admin' | 'database' | 'collaborators' | 'conquered' | 'brands' | 'news';
  onTabChange: (tab: 'passes' | 'map' | 'stats' | 'register' | 'admin' | 'database' | 'collaborators' | 'conquered' | 'brands' | 'news') => void;
  conqueredCount: number;
  totalCount: number;
  t: Translation;
  language: string;
  onLanguageChange: (language: string) => void;
  showAdminTab: boolean;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  activeTab, 
  onTabChange, 
  conqueredCount, 
  totalCount,
  t,
  language,
  onLanguageChange,
  showAdminTab,
  onLogout
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleTabChange = (tab: 'passes' | 'map' | 'stats' | 'register' | 'admin' | 'database' | 'collaborators' | 'conquered' | 'brands' | 'news') => {
    onTabChange(tab);
    setIsMobileMenuOpen(false); // Close mobile menu when tab is selected
  };

  const navigationItems = [
    { key: 'passes', icon: Mountain, label: t.passes, tooltip: 'Explora todos los puertos de montaña disponibles' },
    { key: 'conquered', icon: Trophy, label: 'Conquistados', tooltip: 'Ve tus puertos conquistados con fotos y notas' },
    { key: 'map', icon: Map, label: t.map, tooltip: 'Mapa interactivo con ubicaciones de puertos' },
    { key: 'stats', icon: Award, label: t.stats, tooltip: 'Estadísticas de tu progreso y conquistas' },
    { key: 'brands', icon: Tag, label: 'Marcas', tooltip: 'Marcas de ciclismo y equipamiento' },
    { key: 'collaborators', icon: Users, label: t.collaborators, tooltip: 'Colaboradores y servicios para ciclistas' },
    { key: 'news', icon: Newspaper, label: 'Noticias', tooltip: 'Últimas noticias del mundo del ciclismo' },
    { key: 'database', icon: Database, label: t.database, tooltip: 'Base de datos completa de puertos' },
    { key: 'admin', icon: Settings, label: t.admin, tooltip: 'Panel de administración del sistema' }
  ];

  const userActions = [
    { key: 'cyclist-register', icon: UserCheck, label: 'Registro Ciclista', tooltip: 'Registrar nuevo ciclista', action: () => handleTabChange('register') },
    { key: 'logout', icon: LogOut, label: 'Cerrar Sesión', tooltip: 'Cerrar sesión actual', action: onLogout }
  ];

  return (
    <header className="bg-white shadow-lg border-b-2 border-orange-500 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <Mountain className="h-8 w-8 text-orange-500" />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
                {t.appTitle}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600">
                {conqueredCount}/{totalCount} {t.passesConquered}
              </p>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4">
            <nav className="flex space-x-1 relative">
              {navigationItems.map((item) => {
                // Skip admin tab if user is not admin
                if (item.key === 'admin' && !showAdminTab) return null;
                
                const Icon = item.icon;
                return (
                  <div key={item.key} className="relative">
                    <button
                      onClick={() => handleTabChange(item.key as any)}
                      onMouseEnter={() => setHoveredItem(item.key)}
                      onMouseLeave={() => setHoveredItem(null)}
                      className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                        activeTab === item.key
                          ? 'bg-orange-500 text-white shadow-lg'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="hidden xl:inline">{item.label}</span>
                    </button>
                    
                    {/* Tooltip */}
                    {hoveredItem === item.key && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-800 text-white text-xs rounded-lg whitespace-nowrap z-50 shadow-lg">
                        {item.tooltip}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
            
            {/* User Actions */}
            <div className="flex items-center space-x-1 border-l border-slate-200 pl-4">
              {userActions.map((action) => {
                const Icon = action.icon;
                return (
                  <div key={action.key} className="relative">
                    <button
                      onClick={action.action}
                      onMouseEnter={() => setHoveredItem(action.key)}
                      onMouseLeave={() => setHoveredItem(null)}
                      className={`px-3 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                        action.key === 'logout'
                          ? 'text-red-600 hover:bg-red-50'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="hidden xl:inline">{action.label}</span>
                    </button>
                    
                    {/* Tooltip */}
                    {hoveredItem === action.key && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-800 text-white text-xs rounded-lg whitespace-nowrap z-50 shadow-lg">
                        {action.tooltip}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            <LanguageSelector
              currentLanguage={language}
              onLanguageChange={onLanguageChange}
            />
          </div>

          {/* Mobile Menu Button and Language Selector */}
          <div className="flex items-center space-x-3 lg:hidden">
            <LanguageSelector
              currentLanguage={language}
              onLanguageChange={onLanguageChange}
            />
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`lg:hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen 
            ? 'max-h-96 opacity-100 pb-4' 
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="bg-white border-t border-slate-200 mx-4 rounded-lg shadow-lg mt-2">
            <nav className="flex flex-col space-y-2 p-4">
            {navigationItems.map((item) => {
              // Skip admin tab if user is not admin
              if (item.key === 'admin' && !showAdminTab) return null;
              
              const Icon = item.icon;
              return (
                <button
                  key={item.key}
                  onClick={() => handleTabChange(item.key as any)}
                  className={`w-full px-4 py-3 rounded-lg transition-all duration-200 flex items-center space-x-3 text-left ${
                    activeTab === item.key
                      ? 'bg-orange-500 text-white shadow-lg'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
            
            {/* Mobile User Actions */}
            <div className="border-t border-slate-200 pt-2 mt-2">
              {userActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.key}
                    onClick={action.action}
                    className={`w-full px-4 py-3 rounded-lg transition-all duration-200 flex items-center space-x-3 text-left ${
                      action.key === 'logout'
                        ? 'text-red-600 hover:bg-red-50'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{action.label}</span>
                  </button>
                );
              })}
            </div>
            </nav>
          
          </div>
        </div>
      </div>
    </header>
  );
};