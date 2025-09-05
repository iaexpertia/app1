import React, { useState } from 'react';
import { Mountain, Award, Map, UserPlus, Settings, Database, Menu, X, Users, Trophy, Tag, Newspaper } from 'lucide-react';
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
}

export const Header: React.FC<HeaderProps> = ({ 
  activeTab, 
  onTabChange, 
  conqueredCount, 
  totalCount,
  t,
  language,
  onLanguageChange,
  showAdminTab
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleTabChange = (tab: 'passes' | 'map' | 'stats' | 'register' | 'admin' | 'database' | 'collaborators' | 'conquered' | 'brands' | 'news') => {
    onTabChange(tab);
    setIsMobileMenuOpen(false); // Close mobile menu when tab is selected
  };

  const navigationItems = [
    { key: 'passes', icon: Mountain, label: t.passes },
    { key: 'conquered', icon: Trophy, label: 'Conquistados' },
    { key: 'map', icon: Map, label: t.map },
    { key: 'stats', icon: Award, label: t.stats },
    { key: 'brands', icon: Tag, label: 'Marcas' },
    { key: 'news', icon: Newspaper, label: 'Noticias' },
    { key: 'collaborators', icon: Users, label: t.collaborators },
    { key: 'register', icon: UserPlus, label: t.register },
    { key: 'database', icon: Database, label: t.database },
    { key: 'admin', icon: Settings, label: t.admin } // Siempre mostrar admin
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
            <nav className="flex space-x-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.key}
                    onClick={() => handleTabChange(item.key as any)}
                    className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                      activeTab === item.key
                        ? 'bg-orange-500 text-white shadow-lg'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden xl:inline">{item.label}</span>
                  </button>
                );
              })}
            </nav>
            
            <LanguageSelector
              currentLanguage={language}
              onLanguageChange={onLanguageChange}
            />
          </div>

          {/* Mobile Menu Button and Language Selector */}
          <div className="flex items-center space-x-2 lg:hidden">
            <div className="hidden sm:block">
              <LanguageSelector
                currentLanguage={language}
                onLanguageChange={onLanguageChange}
              />
            </div>
            
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
          <nav className="flex flex-col space-y-2">
            {navigationItems.map((item) => {
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
          </nav>
          
          {/* Mobile Language Selector */}
          <div className="mt-4 pt-4 border-t border-slate-200 sm:hidden">
            <LanguageSelector
              currentLanguage={language}
              onLanguageChange={onLanguageChange}
            />
          </div>
        </div>
      </div>
    </header>
  );
};