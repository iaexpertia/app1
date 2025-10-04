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
import { PassFinderView } from './components/PassFinderView';
import { Footer } from './components/Footer';
import { LegalModal } from './components/LegalModals';
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
import { isCurrentUserAdmin, loadCyclists, addCyclist, setCurrentUser } from './utils/cyclistStorage';
import { Cyclist } from './types';

type ActiveTab = 'passes' | 'map' | 'stats' | 'register' | 'admin' | 'database' | 'collaborators' | 'conquered' | 'brands' | 'news' | 'finder';

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
  const [showLegalModal, setShowLegalModal] = useState<'privacy' | 'legal' | 'cookies' | null>(null);

  const handleLogout = () => {
    // Clear current user session
    localStorage.removeItem('currentUserId');
    // Reset admin status immediately
    setIsAdmin(false);
    
    // Optionally redirect to passes tab
    setActiveTab('passes');
    
    // Show a brief message
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 2000);
  };

  useEffect(() => {
    const loadedConquests = loadConquests();
    setConquests(loadedConquests);
    setConqueredPassIds(new Set(loadedConquests.map(c => c.passId)));
    
    // Verificar si el usuario actual es admin al cargar
    const currentUserIsAdmin = isCurrentUserAdmin();
    setIsAdmin(currentUserIsAdmin);
    
    // Si no hay ciclistas registrados, crear un admin por defecto
    const cyclists = loadCyclists();
    if (cyclists.length === 0) {
      const defaultAdmin: Cyclist = {
        id: 'admin-default',
        name: 'Administrador',
        alias: 'Admin',
        email: 'admin@puertosconquistados.com',
        phone: '+34 000 000 000',
        bikes: [],
        registrationDate: new Date().toISOString().split('T')[0],
        isAdmin: true
      };
      addCyclist(defaultAdmin);
      setCurrentUser(defaultAdmin.id);
    }
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
    // Actualizar estado de admin después del registro/login
    const currentUserIsAdmin = isCurrentUserAdmin();
    setIsAdmin(currentUserIsAdmin);
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
        onLogout={handleLogout}
      />
      
      {showSuccessMessage && (
        <div className="bg-green-500 text-white px-4 py-3 text-center">
          <p>
            {activeTab === 'passes' && !isAdmin 
              ? 'Sesión cerrada correctamente' 
              : t.registrationSuccess
            }
          </p>
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

        {activeTab === 'finder' && (
          <PassFinderView
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
          <CyclistRegistration
            t={t}
            onRegistrationSuccess={handleRegistrationSuccess}
          />
        )}
        
        {activeTab === 'admin' && isAdmin && (
          <AdminPanel
            passes={passes}
            onUpdatePass={handleUpdatePass}
            t={t}
          />
        )}
        
        
        {activeTab === 'database' && (
          <DatabaseView
            allPasses={mountainPasses}
            userPasses={passes}
            onAddPass={handleAddPass}
            onRemovePass={handleRemovePass}
            t={t}
          />
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
      
      <Footer
        onShowPrivacy={() => setShowLegalModal('privacy')}
        onShowLegal={() => setShowLegalModal('legal')}
        onShowCookies={() => setShowLegalModal('cookies')}
      />
      
      <LegalModal
        isOpen={showLegalModal !== null}
        onClose={() => setShowLegalModal(null)}
        type={showLegalModal || 'privacy'}
      />
    </div>
  );
}

export default App;