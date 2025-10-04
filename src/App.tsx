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
import { PasswordReset } from './components/PasswordReset';
import { Footer } from './components/Footer';
import { LegalModal } from './components/LegalModals';
import { CookieBanner } from './components/CookieBanner';
import { mountainPasses } from './data/mountainPasses';
import {
  loadConquests,
  addConquest,
  updateConquestPhotos,
  getConquestByPassId,
  syncConquestsFromSupabase
} from './utils/storage';
import { calculateUserStats } from './utils/stats';
import { isCurrentUserAdmin, loadCyclists, addCyclist, setCurrentUser, getCurrentUser } from './utils/cyclistStorage';
import { Cyclist } from './types';

type ActiveTab = 'passes' | 'map' | 'stats' | 'register' | 'admin' | 'database' | 'collaborators' | 'conquered' | 'brands' | 'news' | 'finder';

function App() {
  // Check if we're on the password reset page
  const isPasswordResetPage = window.location.pathname === '/reset-password' ||
                               window.location.search.includes('token=');

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
  const [currentCyclist, setCurrentCyclist] = useState<Cyclist | null>(null);

  // If we're on password reset page, render only that component
  if (isPasswordResetPage) {
    return <PasswordReset />;
  }

  const handleLogout = () => {
    // Clear current user session
    localStorage.removeItem('currentUserId');
    // Reset admin status immediately
    setIsAdmin(false);
    setCurrentCyclist(null);
    
    // Optionally redirect to passes tab
    setActiveTab('passes');
    
    // Show a brief message
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 2000);
  };

  useEffect(() => {
    const initializeApp = async () => {
      const cyclist = getCurrentUser();
      setCurrentCyclist(cyclist);

      if (cyclist) {
        await syncConquestsFromSupabase();
      }

      const loadedConquests = loadConquests();
      setConquests(loadedConquests);
      setConqueredPassIds(new Set(loadedConquests.map(c => c.passId)));

      const currentUserIsAdmin = isCurrentUserAdmin();
      setIsAdmin(currentUserIsAdmin);

      const cyclists = loadCyclists();
      if (cyclists.length === 0) {
        const defaultAdmin: Cyclist = {
          id: 'admin-default',
          name: 'Administrador',
          alias: 'Admin',
          email: 'admin@puertosconquistados.com',
          password: 'admin123',
          phone: '+34 000 000 000',
          bikes: [],
          registrationDate: new Date().toISOString().split('T')[0],
          isAdmin: true
        };
        await addCyclist(defaultAdmin);
        setCurrentUser(defaultAdmin.id);
      }
    };

    initializeApp();
  }, []);

  const handleToggleConquest = async (passId: string) => {
    const isConquered = conqueredPassIds.has(passId);

    if (isConquered) {
      try {
        const { removeConquest } = await import('./utils/storage');
        await removeConquest(passId);
        const updatedConquests = conquests.filter(c => c.passId !== passId);
        setConquests(updatedConquests);
        setConqueredPassIds(new Set(updatedConquests.map(c => c.passId)));
      } catch (err) {
        console.error('Error removing conquest:', err);
      }
    } else {
      const newConquest: ConquestData = {
        passId,
        dateCompleted: new Date().toISOString().split('T')[0]
      };
      try {
        await addConquest(newConquest);
        const updatedConquests = [...conquests.filter(c => c.passId !== passId), newConquest];
        setConquests(updatedConquests);
        setConqueredPassIds(new Set(updatedConquests.map(c => c.passId)));
      } catch (err) {
        console.error('Error adding conquest:', err);
      }
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

  const handleSavePhotos = async (passId: string, photos: string[]) => {
    try {
      await updateConquestPhotos(passId, photos);
      const updatedConquests = loadConquests();
      setConquests(updatedConquests);
      setPhotosPass(null);
    } catch (err) {
      console.error('Error saving photos:', err);
    }
  };

  const handleRegistrationSuccess = () => {
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
    // Actualizar estado de admin después del registro/login
    const currentUserIsAdmin = isCurrentUserAdmin();
    setIsAdmin(currentUserIsAdmin);
    const cyclist = getCurrentUser();
    setCurrentCyclist(cyclist);
  };

  const handleSyncComplete = () => {
    // Reload conquests after Strava sync
    const loadedConquests = loadConquests();
    setConquests(loadedConquests);
    setConqueredPassIds(new Set(loadedConquests.map(c => c.passId)));
    // Reload current cyclist to get updated tokens
    const cyclist = getCurrentUser();
    setCurrentCyclist(cyclist);
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

  const handleRemovePass = async (passId: string) => {
    setPasses(passes.filter(p => p.id !== passId));
    try {
      const { removeConquest } = await import('./utils/storage');
      await removeConquest(passId);
      const updatedConquests = conquests.filter(c => c.passId !== passId);
      setConquests(updatedConquests);
      setConqueredPassIds(new Set(updatedConquests.map(c => c.passId)));
    } catch (err) {
      console.error('Error removing pass:', err);
    }
  };

  const handleUpdateConquest = async (conquest: ConquestData) => {
    try {
      await addConquest(conquest);
      const updatedConquests = loadConquests();
      setConquests(updatedConquests);
    } catch (err) {
      console.error('Error updating conquest:', err);
    }
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
            onTabChange={setActiveTab}
            isAdmin={isAdmin}
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
            currentCyclist={currentCyclist || undefined}
            allPasses={passes}
            onSyncComplete={handleSyncComplete}
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

      <CookieBanner
        onOpenPrivacy={() => setShowLegalModal('privacy')}
        onOpenLegal={() => setShowLegalModal('legal')}
      />
    </div>
  );
}

export default App;