import React, { useState, useEffect } from 'react';
import { MountainPass, ConquestData } from './types';
import { useLanguage } from './hooks/useLanguage';
import { Header } from './components/Header';
import { PassesList } from './components/PassesList';
import { PassModal } from './components/PassModal';
import { InteractiveMap } from './components/InteractiveMap';
import { StatsView } from './components/StatsView';
import { CyclistRegistration } from './components/CyclistRegistration';
import { AdminPanel } from './components/AdminPanel';
import { DatabaseView } from './components/DatabaseView';
import { mountainPasses } from './data/mountainPasses';
import { 
  loadConquests, 
  addConquest, 
  removeConquest, 
  isPassConquered 
} from './utils/storage';
import { calculateUserStats } from './utils/stats';
import { isCurrentUserAdmin } from './utils/cyclistStorage';

type ActiveTab = 'passes' | 'map' | 'stats' | 'register' | 'admin' | 'database';

function App() {
  const { language, t, changeLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState<ActiveTab>('passes');
  const [selectedPass, setSelectedPass] = useState<MountainPass | null>(null);
  const [conquests, setConquests] = useState<ConquestData[]>([]);
  const [conqueredPassIds, setConqueredPassIds] = useState<Set<string>>(new Set());
  const [passes, setPasses] = useState<MountainPass[]>(mountainPasses);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const loadedConquests = loadConquests();
    setConquests(loadedConquests);
    setConqueredPassIds(new Set(loadedConquests.map(c => c.passId)));
    setIsAdmin(isCurrentUserAdmin());
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

  const handleRegistrationSuccess = () => {
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
    setIsAdmin(isCurrentUserAdmin());
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
      </main>
      
      <PassModal
        pass={selectedPass}
        onClose={() => setSelectedPass(null)}
        t={t}
      />
    </div>
  );
}

export default App;