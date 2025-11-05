import React, { useState, useEffect, lazy, Suspense } from 'react';
import { MountainPass, ConquestData } from './types';
import { useLanguage } from './hooks/useLanguage';
import { Header } from './components/Header';
import { PassesList } from './components/PassesList';
import { PassModal } from './components/PassModal';
import { Footer } from './components/Footer';
import { CookieBanner } from './components/CookieBanner';

const InteractiveMap = lazy(() => import('./components/InteractiveMap').then(m => ({ default: m.InteractiveMap })));
const PhotosModal = lazy(() => import('./components/PhotosModal').then(m => ({ default: m.PhotosModal })));
const StatsView = lazy(() => import('./components/StatsView').then(m => ({ default: m.StatsView })));
const CyclistRegistration = lazy(() => import('./components/CyclistRegistration').then(m => ({ default: m.CyclistRegistration })));
const AdminPanel = lazy(() => import('./components/AdminPanel').then(m => ({ default: m.AdminPanel })));
const DatabaseView = lazy(() => import('./components/DatabaseView').then(m => ({ default: m.DatabaseView })));
const CollaboratorsView = lazy(() => import('./components/CollaboratorsView').then(m => ({ default: m.CollaboratorsView })));
const ConqueredPassesView = lazy(() => import('./components/ConqueredPassesView').then(m => ({ default: m.ConqueredPassesView })));
const BrandsView = lazy(() => import('./components/BrandsView').then(m => ({ default: m.BrandsView })));
const NewsView = lazy(() => import('./components/NewsView').then(m => ({ default: m.NewsView })));
const PassFinderView = lazy(() => import('./components/PassFinderView').then(m => ({ default: m.PassFinderView })));
const PasswordReset = lazy(() => import('./components/PasswordReset').then(m => ({ default: m.PasswordReset })));
const LegalModal = lazy(() => import('./components/LegalModals').then(m => ({ default: m.LegalModal })));
const RacesView = lazy(() => import('./components/RacesView').then(m => ({ default: m.RacesView })));
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
import { isCurrentUserAdmin, ensureAdminExists, setCurrentUser, getCurrentUser, logoutUser } from './utils/cyclistStorage';
import { getAllPassesFromDB } from './utils/passesService';
import { Cyclist } from './types';

type ActiveTab = 'passes' | 'map' | 'stats' | 'register' | 'admin' | 'database' | 'collaborators' | 'conquered' | 'brands' | 'news' | 'finder' | 'races';

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
    logoutUser();
    // Reset admin status immediately
    setIsAdmin(false);
    setCurrentCyclist(null);

    // Redirect to register tab
    setActiveTab('register');

    // Show a brief logout message
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 2000);
  };

  useEffect(() => {
    const initializeApp = async () => {
      const loadedConquests = loadConquests();
      setConquests(loadedConquests);
      setConqueredPassIds(new Set(loadedConquests.map(c => c.passId)));

      // Ensure admin user exists in database
      await ensureAdminExists();

      // Verificar si el usuario actual es admin al cargar
      const currentUserIsAdmin = await isCurrentUserAdmin();
      setIsAdmin(currentUserIsAdmin);

      // Cargar el ciclista actual
      const cyclist = await getCurrentUser();
      setCurrentCyclist(cyclist);

      // Cargar puertos desde la base de datos
      const dbPasses = await getAllPassesFromDB();
      if (dbPasses.length > 0) {
        setPasses(dbPasses);
      }
    };

    initializeApp();

    const handleUserChange = () => {
      initializeApp();
    };

    window.addEventListener('userChanged', handleUserChange);

    return () => {
      window.removeEventListener('userChanged', handleUserChange);
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

  const handleRegistrationSuccess = async () => {
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
    // Actualizar estado de admin después del registro/login
    const currentUserIsAdmin = await isCurrentUserAdmin();
    setIsAdmin(currentUserIsAdmin);
    const cyclist = await getCurrentUser();
    setCurrentCyclist(cyclist);
  };

  const handleSyncComplete = async () => {
    // Reload conquests after Strava sync
    const loadedConquests = loadConquests();
    setConquests(loadedConquests);
    setConqueredPassIds(new Set(loadedConquests.map(c => c.passId)));
    // Reload current cyclist to get updated tokens
    const cyclist = await getCurrentUser();
    setCurrentCyclist(cyclist);
  };

  const handleUpdatePass = async (updatedPass: MountainPass) => {
    const updatedPasses = passes.map(pass =>
      pass.id === updatedPass.id ? updatedPass : pass
    );
    setPasses(updatedPasses);

    // Recargar puertos desde la base de datos para asegurar sincronización
    const dbPasses = await getAllPassesFromDB();
    if (dbPasses.length > 0) {
      setPasses(dbPasses);
    }
  };

  const handleRefreshPasses = async () => {
    const dbPasses = await getAllPassesFromDB();
    if (dbPasses.length > 0) {
      setPasses(dbPasses);
    }
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

  // Filtrar solo puertos activos para mostrar en la vista pública
  const activePasses = passes.filter(pass => pass.isActive !== false);

  const userStats = calculateUserStats(activePasses, conquests);
  const conqueredPasses = activePasses.filter(pass => conqueredPassIds.has(pass.id));

  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        conqueredCount={conquests.length}
        totalCount={activePasses.length}
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
        <Suspense fallback={
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        }>
          {activeTab === 'passes' && (
            <PassesList
              passes={activePasses}
              conqueredPassIds={conqueredPassIds}
              onToggleConquest={handleToggleConquest}
              onViewDetails={handleViewDetails}
              onAddPhotos={handleAddPhotos}
              t={t}
            />
          )}

          {activeTab === 'finder' && (
            <PassFinderView
              passes={activePasses}
              conqueredPassIds={conqueredPassIds}
              onToggleConquest={handleToggleConquest}
              onViewDetails={handleViewDetails}
              onAddPhotos={handleAddPhotos}
              t={t}
            />
          )}

          {activeTab === 'map' && (
            <InteractiveMap
              passes={activePasses}
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
              onRefreshPasses={handleRefreshPasses}
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

          {activeTab === 'races' && (
            <RacesView
              t={t}
            />
          )}
        </Suspense>
      </main>
      
      <Suspense fallback={null}>
        {selectedPass && (
          <PassModal
            pass={selectedPass}
            onClose={() => setSelectedPass(null)}
            t={t}
          />
        )}

        {photosPass && (
          <PhotosModal
            pass={photosPass}
            conquest={photosPass ? getConquestByPassId(photosPass.id) : null}
            onClose={() => setPhotosPass(null)}
            onSavePhotos={handleSavePhotos}
            t={t}
          />
        )}

        {showLegalModal && (
          <LegalModal
            isOpen={showLegalModal !== null}
            onClose={() => setShowLegalModal(null)}
            type={showLegalModal || 'privacy'}
          />
        )}
      </Suspense>

      <Footer
        onShowPrivacy={() => setShowLegalModal('privacy')}
        onShowLegal={() => setShowLegalModal('legal')}
        onShowCookies={() => setShowLegalModal('cookies')}
      />

      <CookieBanner
        onOpenPrivacy={() => setShowLegalModal('privacy')}
        onOpenLegal={() => setShowLegalModal('legal')}
      />
    </div>
  );
}

export default App;