import { CyclingRace } from '../types';

const STORAGE_KEY = 'cycling-races';

export const loadRaces = (): CyclingRace[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading races:', error);
    return [];
  }
};

export const saveRaces = (races: CyclingRace[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(races));
  } catch (error) {
    console.error('Error saving races:', error);
  }
};

export const addRace = (race: CyclingRace): void => {
  const races = loadRaces();
  races.push(race);
  saveRaces(races);
};

export const updateRace = (updatedRace: CyclingRace): void => {
  const races = loadRaces();
  const index = races.findIndex(r => r.id === updatedRace.id);

  if (index !== -1) {
    races[index] = updatedRace;
    saveRaces(races);
  }
};

export const removeRace = (raceId: string): void => {
  const races = loadRaces();
  const filteredRaces = races.filter(r => r.id !== raceId);
  saveRaces(filteredRaces);
};

export const getRaceById = (raceId: string): CyclingRace | null => {
  const races = loadRaces();
  return races.find(r => r.id === raceId) || null;
};
