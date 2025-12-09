import React, { useState, useEffect, lazy, Suspense } from 'react';
import { MountainPass, ConquestData } from './types';
import { useLanguage } from './hooks/useLanguage';
import { Header } from './components/Header';
import { PassesList } from './components/PassesList';
import { PassModal } from './components/PassModal';
import { Footer } from './components/Footer';
import { CookieBanner } from './components/CookieBanner';
import { AccessibilityButton } from './components/AccessibilityButton';

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
const MyPassesView = lazy(() => import('./components/MyPassesView').then(m => ({ default: m.default })));
const PasswordReset = lazy(() => import('./components/PasswordReset').then(m => ({ default: m.PasswordReset })));
const ForgotPassword = lazy(() => import('./components/ForgotPassword').then(m => ({ default: m.ForgotPassword })));
const UpdatePassword = lazy(() => import('./components/UpdatePassword').then(m => ({ default: m.UpdatePassword })));
const LegalModal = lazy(() => import('./components/LegalModals').then(m => ({ default: m.LegalModal })));
const RacesView = lazy(() => import('./components/RacesView').then(m => ({ default: m.RacesView })));
const RaceHistoryView = lazy(() => import('./components/RaceHistoryView').then(m => ({ default: m.RaceHistoryView })));
import { mountainPasses } from './data/mountainPasses';
import {
  loadConquests,
  addConquest as addConquestLocalStorage,
  removeConquest as removeConquestLocalStorage,
  isPassConquered,
  updateConquestPhotos as updateConquestPhotosLocalStorage,
  getConquestByPassId as getConquestByPassIdLocalStorage,
  updateConquest
} from './utils/storage';
import {
  loadConquestsFromDB,
  addConquestToDB,
  removeConquestFromDB,
  updateConquestPhotos as updateConquestPhotosDB,
  subscribeToConquests
} from './utils/conquestService';
import {
  loadFavoritePassesFromDB,
  addFavoritePassToDB,
  removeFavoritePassFromDB,
  subscribeToFavoritePasses
} from './utils/favoritePassesService';
import { calculateUserStats } from './utils/stats';
import { isCurrentUserAdmin, ensureAdminExists, setCurrentUser, getCurrentUser, logoutUser } from './utils/cyclistStorage';
import { getAllPassesFromDB, createPassInDB } from './utils/passesService';
import { Cyclist } from './types';

type ActiveTab = 'passes' | 'map' | 'stats' | 'register' | 'admin' | 'database' | 'collaborators' | 'conquered' | 'brands' | 'news' | 'finder' | 'races' | 'mypasses' | 'racehistory';

function App() {
  // Check if we're on the password reset page
  const isPasswordResetPage = window.location.pathname === '/reset-password' ||
                               window.location.search.includes('token=');

  // Check if we're on the forgot password page
  const isForgotPasswordPage = window.location.pathname === '/forgot-password' ||
                                 window.location.pathname === '/auth/forgot-password';

  // Check if we're on the update password page (support both new and legacy paths)
  const isUpdatePasswordPage = window.location.pathname === '/auth/reset-password' ||
                                 window.location.pathname === '/update-password';

  const { language, t, changeLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState<ActiveTab>('passes');
  const [selectedPass, setSelectedPass] = useState<MountainPass | null>(null);
  const [photosPass, setPhotosPass] = useState<MountainPass | null>(null);
  const [conquests, setConquests] = useState<ConquestData[]>([]);
  const [conqueredPassIds, setConqueredPassIds] = useState<Set<string>>(new Set());
  const [favoritePassIds, setFavoritePassIds] = useState<Set<string>>(new Set());
  const [passes, setPasses] = useState<MountainPass[]>(mountainPasses);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLegalModal, setShowLegalModal] = useState<'privacy' | 'legal' | 'cookies' | null>(null);
  const [currentCyclist, setCurrentCyclist] = useState<Cyclist | null>(null);

  // If we're on password reset page, render only that component
  if (isPasswordResetPage) {
    return <PasswordReset />;
  }

  // If we're on forgot password page, render only that component
  if (isForgotPasswordPage) {
    return (
      <Suspense fallback={
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      }>
        <ForgotPassword />
      </Suspense>
    );
  }

  // If we're on update password page, render only that component
  if (isUpdatePasswordPage) {
    return (
      <Suspense fallback={
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      }>
        <UpdatePassword />
      </Suspense>
    );
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
    let conquestSubscription: any = null;
    let favoriteSubscription: any = null;

    const initializeApp = async () => {
      // Ensure admin user exists in database
      await ensureAdminExists();

      // Verificar si el usuario actual es admin al cargar
      const currentUserIsAdmin = await isCurrentUserAdmin();
      setIsAdmin(currentUserIsAdmin);

      // Cargar el ciclista actual
      const cyclist = await getCurrentUser();
      setCurrentCyclist(cyclist);

      // Cargar conquistas desde Supabase si hay un usuario logueado
      if (cyclist?.id) {
        const dbConquests = await loadConquestsFromDB(cyclist.id);
        setConquests(dbConquests);
        setConqueredPassIds(new Set(dbConquests.map(c => c.passId)));

        // Cargar favoritos desde Supabase
        const dbFavorites = await loadFavoritePassesFromDB(cyclist.id);
        setFavoritePassIds(dbFavorites);

        // Suscribirse a cambios en tiempo real para conquistas
        conquestSubscription = subscribeToConquests(cyclist.id, async (payload) => {
          console.log('Real-time conquest update received:', payload);
          const updatedConquests = await loadConquestsFromDB(cyclist.id);
          setConquests(updatedConquests);
          setConqueredPassIds(new Set(updatedConquests.map(c => c.passId)));
        });

        // Suscribirse a cambios en tiempo real para favoritos
        favoriteSubscription = subscribeToFavoritePasses(cyclist.id, async (payload) => {
          console.log('Real-time favorite update received:', payload);
          const updatedFavorites = await loadFavoritePassesFromDB(cyclist.id);
          setFavoritePassIds(updatedFavorites);
        });
      } else {
        // Si no hay usuario logueado, cargar desde localStorage como fallback
        const loadedConquests = loadConquests();
        setConquests(loadedConquests);
        setConqueredPassIds(new Set(loadedConquests.map(c => c.passId)));
        setFavoritePassIds(new Set());
      }

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
      if (conquestSubscription) {
        conquestSubscription.unsubscribe();
      }
      if (favoriteSubscription) {
        favoriteSubscription.unsubscribe();
      }
    };
  }, []);

  const handleToggleConquest = async (passId: string) => {
    const isConquered = conqueredPassIds.has(passId);

    // Optimistic UI update
    if (isConquered) {
      const updatedConquests = conquests.filter(c => c.passId !== passId);
      setConquests(updatedConquests);
      setConqueredPassIds(new Set(updatedConquests.map(c => c.passId)));
    } else {
      const newConquest: ConquestData = {
        passId,
        dateCompleted: new Date().toISOString().split('T')[0]
      };
      const updatedConquests = [...conquests.filter(c => c.passId !== passId), newConquest];
      setConquests(updatedConquests);
      setConqueredPassIds(new Set(updatedConquests.map(c => c.passId)));
    }

    // Save to database if user is logged in
    if (currentCyclist?.id) {
      if (isConquered) {
        const result = await removeConquestFromDB(currentCyclist.id, passId);
        if (!result.success) {
          console.error('Error removing conquest from DB:', result.error);
          // Revert optimistic update on error
          const revertedConquests = await loadConquestsFromDB(currentCyclist.id);
          setConquests(revertedConquests);
          setConqueredPassIds(new Set(revertedConquests.map(c => c.passId)));
        }
      } else {
        const newConquest: ConquestData = {
          passId,
          dateCompleted: new Date().toISOString().split('T')[0]
        };
        const result = await addConquestToDB(currentCyclist.id, newConquest);
        if (!result.success) {
          console.error('Error adding conquest to DB:', result.error);
          // Revert optimistic update on error
          const revertedConquests = await loadConquestsFromDB(currentCyclist.id);
          setConquests(revertedConquests);
          setConqueredPassIds(new Set(revertedConquests.map(c => c.passId)));
        }
      }
    } else {
      // Fallback to localStorage if no user is logged in
      if (isConquered) {
        removeConquestLocalStorage(passId);
      } else {
        const newConquest: ConquestData = {
          passId,
          dateCompleted: new Date().toISOString().split('T')[0]
        };
        addConquestLocalStorage(newConquest);
      }
    }
  };

  const handleToggleFavorite = async (passId: string) => {
    const isFavorite = favoritePassIds.has(passId);

    // Optimistic UI update
    if (isFavorite) {
      const newFavorites = new Set(favoritePassIds);
      newFavorites.delete(passId);
      setFavoritePassIds(newFavorites);
    } else {
      const newFavorites = new Set(favoritePassIds);
      newFavorites.add(passId);
      setFavoritePassIds(newFavorites);
    }

    // Save to database if user is logged in
    if (currentCyclist?.id) {
      if (isFavorite) {
        const result = await removeFavoritePassFromDB(currentCyclist.id, passId);
        if (!result.success) {
          console.error('Error removing favorite pass from DB:', result.error);
          // Revert optimistic update on error
          const revertedFavorites = await loadFavoritePassesFromDB(currentCyclist.id);
          setFavoritePassIds(revertedFavorites);
        }
      } else {
        const result = await addFavoritePassToDB(currentCyclist.id, passId);
        if (!result.success) {
          console.error('Error adding favorite pass to DB:', result.error);
          // Revert optimistic update on error
          const revertedFavorites = await loadFavoritePassesFromDB(currentCyclist.id);
          setFavoritePassIds(revertedFavorites);
        }
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
    if (currentCyclist?.id) {
      const result = await updateConquestPhotosDB(currentCyclist.id, passId, photos);
      if (result.success) {
        const updatedConquests = await loadConquestsFromDB(currentCyclist.id);
        setConquests(updatedConquests);
        setConqueredPassIds(new Set(updatedConquests.map(c => c.passId)));
      } else {
        console.error('Error updating photos:', result.error);
      }
    } else {
      updateConquestPhotosLocalStorage(passId, photos);
      const updatedConquests = loadConquests();
      setConquests(updatedConquests);
    }
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
    // Reload current cyclist to get updated tokens
    const cyclist = await getCurrentUser();
    setCurrentCyclist(cyclist);

    // Reload conquests after Strava sync
    if (cyclist?.id) {
      const dbConquests = await loadConquestsFromDB(cyclist.id);
      setConquests(dbConquests);
      setConqueredPassIds(new Set(dbConquests.map(c => c.passId)));
    } else {
      const loadedConquests = loadConquests();
      setConquests(loadedConquests);
      setConqueredPassIds(new Set(loadedConquests.map(c => c.passId)));
    }
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

  const handleAddPass = async (passToAdd: MountainPass) => {
    if (passes.find(p => p.id === passToAdd.id)) {
      return;
    }

    const createdPass = await createPassInDB(passToAdd);

    if (createdPass) {
      setPasses([...passes, createdPass]);
    } else {
      console.error('Error al guardar el puerto en la base de datos');
      alert('Error al guardar el puerto. Por favor intenta de nuevo.');
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

  const handleUpdateConquest = async (conquest: ConquestData) => {
    if (currentCyclist?.id) {
      const result = await addConquestToDB(currentCyclist.id, conquest);
      if (result.success) {
        const updatedConquests = await loadConquestsFromDB(currentCyclist.id);
        setConquests(updatedConquests);
        setConqueredPassIds(new Set(updatedConquests.map(c => c.passId)));
      } else {
        console.error('Error updating conquest in DB:', result.error);
      }
    } else {
      updateConquest(conquest);
      const updatedConquests = loadConquests();
      setConquests(updatedConquests);
      setConqueredPassIds(new Set(updatedConquests.map(c => c.passId)));
    }
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
        conqueredCount={conqueredPassIds.size}
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
      
      <main className="px-2 sm:px-4 lg:px-8">
        <Suspense fallback={
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        }>
          {activeTab === 'passes' && (
            <PassesList
              passes={activePasses}
              conqueredPassIds={conqueredPassIds}
              favoritePassIds={favoritePassIds}
              onToggleConquest={handleToggleConquest}
              onToggleFavorite={handleToggleFavorite}
              onViewDetails={handleViewDetails}
              onAddPhotos={handleAddPhotos}
              t={t}
            />
          )}

          {activeTab === 'finder' && (
            <PassFinderView
              passes={activePasses}
              conqueredPassIds={conqueredPassIds}
              favoritePassIds={favoritePassIds}
              onToggleConquest={handleToggleConquest}
              onToggleFavorite={handleToggleFavorite}
              onViewDetails={handleViewDetails}
              onAddPhotos={handleAddPhotos}
              t={t}
            />
          )}

          {activeTab === 'mypasses' && (
            <MyPassesView
              passes={activePasses}
              conqueredPassIds={conqueredPassIds}
              favoritePassIds={favoritePassIds}
              onToggleConquest={handleToggleConquest}
              onToggleFavorite={handleToggleFavorite}
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

          {activeTab === 'racehistory' && (
            <RaceHistoryView
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
            conquest={photosPass ? conquests.find(c => c.passId === photosPass.id) || null : null}
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
        onTabChange={setActiveTab}
      />

      <CookieBanner
        onOpenPrivacy={() => setShowLegalModal('privacy')}
        onOpenLegal={() => setShowLegalModal('legal')}
      />

      <AccessibilityButton />
    </div>
  );
}

export default App;