import React, { useState, useEffect } from 'react';
import { MountainPass, ConquestData } from './types';
import { Header } from './components/Header';
import { PassesList } from './components/PassesList';
import { PassModal } from './components/PassModal';
import { InteractiveMap } from './components/InteractiveMap';
import { StatsView } from './components/StatsView';
import { mountainPasses } from './data/mountainPasses';
import { 
  loadConquests, 
  addConquest, 
  removeConquest, 
  isPassConquered 
} from './utils/storage';
import { calculateUserStats } from './utils/stats';

type ActiveTab = 'passes' | 'map' | 'stats';

function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('passes');
  const [selectedPass, setSelectedPass] = useState<MountainPass | null>(null);
  const [conquests, setConquests] = useState<ConquestData[]>([]);
  const [conqueredPassIds, setConqueredPassIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadedConquests = loadConquests();
    setConquests(loadedConquests);
    setConqueredPassIds(new Set(loadedConquests.map(c => c.passId)));
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

  const userStats = calculateUserStats(mountainPasses, conquests);
  const conqueredPasses = mountainPasses.filter(pass => conqueredPassIds.has(pass.id));

  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        conqueredCount={conquests.length}
        totalCount={mountainPasses.length}
      />
      
      <main>
        {activeTab === 'passes' && (
          <PassesList
            passes={mountainPasses}
            conqueredPassIds={conqueredPassIds}
            onToggleConquest={handleToggleConquest}
            onViewDetails={handleViewDetails}
          />
        )}
        
        {activeTab === 'map' && (
          <InteractiveMap
            passes={mountainPasses}
            conqueredPassIds={conqueredPassIds}
            onPassClick={handleViewDetails}
          />
        )}
        
        {activeTab === 'stats' && (
          <StatsView
            stats={userStats}
            conqueredPasses={conqueredPasses}
          />
        )}
      </main>
      
      <PassModal
        pass={selectedPass}
        onClose={() => setSelectedPass(null)}
      />
    </div>
  );
}

export default App;