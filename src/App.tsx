import React, { useState, useEffect } from 'react';
import { MountainPass, ConquestData } from './types';
import { useLanguage } from './hooks/useLanguage';
import { Header } from './components/Header';
import { PassesList } from './components/PassesList';
import { PassModal } from './components/PassModal';
import { InteractiveMap } from './components/InteractiveMap';
import { PhotosModal } from './components/PhotosModal';
import { StatsView } from './components/StatsView';
import { CyclistRegistration } from './components/CyclistRegistration';
import { AdminPanel } from './components/AdminPanel';
import { DatabaseView } from './components/DatabaseView';
import { CollaboratorsView } from './components/CollaboratorsView';
import { ConqueredPassesView } from './components/ConqueredPassesView';
import { BrandsView } from './components/BrandsView';
import { NewsView } from './components/NewsView';
import { mountainPasses } from './data/mountainPasses';
import { 
  loadConquests, 
  addConquest, 
  removeConquest, 
  isPassConquered,
  updateConquestPhotos,
  getConquestByPassId,
  updateConquest
} from './utils/storage';
import { calculateUserStats } from './utils/stats';
import { isCurrentUserAdmin } from './utils/cyclistStorage';
import { LoginModal } from './components/LoginModal';
import { isUserLoggedIn, getCurrentAuthUser } from './utils/authStorage';
import { Shield } from 'lucide-react';

type ActiveTab = 'passes' | 'map' | 'stats' | 'register' | 'admin' | 'database' | 'collaborators' | 'conquered' | 'brands' | 'news';

function App() {
  const { language, t, changeLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState<ActiveTab>('passes');
  const [selectedPass, setSelectedPass] = useState<MountainPass | null>(null);
  const [photosPass, setPhotosPass] = useState<MountainPass | null>(null);
  const [conquests, setConquests] = useState<ConquestData[]>([]);
  const [conqueredPassIds, setConqueredPassIds] = useState<Set<string>>(new Set());
  const [passes, setPasses] = useState<MountainPass[]>(mountainPasses);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loadedConquests = loadConquests();
    setConquests(loadedConquests);
    setConqueredPassIds(new Set(loadedConquests.map(c => c.passId)));
    setIsAdmin(isCurrentUserAdmin());
    setIsLoggedIn(isUserLoggedIn());
    
    // Escuchar cambios de autenticación
    const handleAuthChange = () => {
      setIsLoggedIn(isUserLoggedIn());
      setIsAdmin(isCurrentUserAdmin());
    };

    const handleLogout = () => {
      setIsLoggedIn(false);
      setIsAdmin(false);
      // Redirigir a passes si estaba en una pestaña protegida
      const protectedTabs = ['register', 'database', 'admin'];
      if (protectedTabs.includes(activeTab)) {
        setActiveTab('passes');
      }
    };

    window.addEventListener('userLoggedIn', handleAuthChange);
    window.addEventListener('userLoggedOut', handleLogout);

    return () => {
      window.removeEventListener('userLoggedIn', handleAuthChange);
      window.removeEventListener('userLoggedOut', handleLogout);
    };
  }, []);

  const handleToggleConquest = (passId: string) => {
    if (isPassConquered(passId)) {
      removeConquest(passId);
      const updatedConquests = conquests.filter(c => c.passId !== passId);
      setConquests(updatedConquests);
      setConqueredPassIds(new Set(updatedConquests.map(c => c.passId)));
    } else {
      const newConquest: ConquestData = {
        passId,
        dateCompleted: new Date().toISOString().split('T')[0]
      };
      addConquest(newConquest);
      const updatedConquests = [...conquests.filter(c => c.passId !== passId), newConquest];
      setConquests(updatedConquests);
      setConqueredPassIds(new Set(updatedConquests.map(c => c.passId)));
    }
  };

  const handleViewDetails = (pass: MountainPass) => {
    setSelectedPass(pass);
  };

  const handleAddPhotos = (passId: string) => {
    const pass = passes.find(p => p.id === passId);
    if (pass) {
      setPhotosPass(pass);
    }
  };

  const handleSavePhotos = (passId: string, photos: string[]) => {
    updateConquestPhotos(passId, photos);
    const updatedConquests = loadConquests();
    setConquests(updatedConquests);
    setPhotosPass(null);
  };

  const handleRegistrationSuccess = () => {
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
    setIsAdmin(isCurrentUserAdmin());
  };

  const handleLoginRequired = () => {
    setShowLoginModal(true);
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setIsAdmin(isCurrentUserAdmin());
    // Disparar evento personalizado
    window.dispatchEvent(new CustomEvent('userLoggedIn'));
  };

  const handleUpdatePass = (updatedPass: MountainPass) => {
    const updatedPasses = passes.map(pass => 
      pass.id === updatedPass.id ? updatedPass : pass
    );
    setPasses(updatedPasses);
  };

  const handleAddPass = (passToAdd: MountainPass) => {
    if (!passes.find(p => p.id === passToAdd.id)) {
      setPasses([...passes, passToAdd]);
    }
  };

  const handleRemovePass = (passId: string) => {
    setPasses(passes.filter(p => p.id !== passId));
    // Also remove any conquest data for this pass
    removeConquest(passId);
    const updatedConquests = conquests.filter(c => c.passId !== passId);
    setConquests(updatedConquests);
    setConqueredPassIds(new Set(updatedConquests.map(c => c.passId)));
  };

  const handleUpdateConquest = (conquest: ConquestData) => {
    updateConquest(conquest);
    const updatedConquests = loadConquests();
    setConquests(updatedConquests);
  };

  const userStats = calculateUserStats(passes, conquests);
  const conqueredPasses = mountainPasses.filter(pass => conqueredPassIds.has(pass.id));

  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        conqueredCount={conquests.length}
        totalCount={passes.length}
        t={t}
        language={language}
        onLanguageChange={changeLanguage}
        showAdminTab={isAdmin}
        onLoginRequired={handleLoginRequired}
      />
      
      {showSuccessMessage && (
        <div className="bg-green-500 text-white px-4 py-3 text-center">
          <p>{t.registrationSuccess}</p>
        </div>
      )}
      
      <main>
        {activeTab === 'passes' && (
          <PassesList
            passes={passes}
            conqueredPassIds={conqueredPassIds}
            onToggleConquest={handleToggleConquest}
            onViewDetails={handleViewDetails}
            onAddPhotos={handleAddPhotos}
            t={t}
          />
        )}
        
        {activeTab === 'map' && (
          <InteractiveMap
            passes={passes}
            conqueredPassIds={conqueredPassIds}
            onPassClick={handleViewDetails}
            t={t}
          />
        )}
        
        {activeTab === 'stats' && (
          <StatsView
            stats={userStats}
            conqueredPasses={conqueredPasses}
            t={t}
          />
        )}
        
        {activeTab === 'register' && (
          isLoggedIn ? (
            <CyclistRegistration
              t={t}
              onRegistrationSuccess={handleRegistrationSuccess}
            />
          ) : (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="text-center py-12">
                <Shield className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <p className="text-xl text-slate-600 mb-2">Acceso restringido</p>
                <p className="text-slate-500 mb-4">Necesitas iniciar sesión para registrar un ciclista</p>
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Iniciar Sesión
                </button>
              </div>
            </div>
          )
        )}
        
        {activeTab === 'admin' && isAdmin && (
          <AdminPanel
            passes={passes}
            onUpdatePass={handleUpdatePass}
            t={t}
          />
        )}
        
        {activeTab === 'database' && (
          isLoggedIn ? (
            <DatabaseView
              allPasses={mountainPasses}
              userPasses={passes}
              onAddPass={handleAddPass}
              onRemovePass={handleRemovePass}
              t={t}
            />
          ) : (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="text-center py-12">
                <Shield className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <p className="text-xl text-slate-600 mb-2">Acceso restringido</p>
                <p className="text-slate-500 mb-4">Necesitas iniciar sesión para gestionar la base de datos</p>
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Iniciar Sesión
                </button>
              </div>
            </div>
          )
        )}
        
        {activeTab === 'collaborators' && (
          <CollaboratorsView
            t={t}
          />
        )}
        
        {activeTab === 'conquered' && (
          <ConqueredPassesView
            conqueredPasses={conqueredPasses}
            conquests={conquests}
            onUpdateConquest={handleUpdateConquest}
            onAddPhotos={handleAddPhotos}
            t={t}
          />
        )}
        
        {activeTab === 'brands' && (
          <BrandsView
            t={t}
          />
        )}
        
        {activeTab === 'news' && (
          <NewsView
            t={t}
          />
        )}
      </main>
      
      <PassModal
        pass={selectedPass}
        onClose={() => setSelectedPass(null)}
        t={t}
      />
      
      <PhotosModal
        pass={photosPass}
        conquest={photosPass ? getConquestByPassId(photosPass.id) : null}
        onClose={() => setPhotosPass(null)}
        onSavePhotos={handleSavePhotos}
        t={t}
      />
      
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
        t={t}
      />
    </div>
  );
}

export default App;