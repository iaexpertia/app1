import { Cyclist } from '../types';

const CYCLISTS_STORAGE_KEY = 'mountain-pass-cyclists';

export const saveCyclists = (cyclists: Cyclist[]): void => {
  localStorage.setItem(CYCLISTS_STORAGE_KEY, JSON.stringify(cyclists));
};

export const loadCyclists = (): Cyclist[] => {
  const stored = localStorage.getItem(CYCLISTS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const getCurrentUser = (): Cyclist | null => {
  const currentUserId = localStorage.getItem('currentUserId');
  if (!currentUserId) return null;
  
  const cyclists = loadCyclists();
  return cyclists.find(c => c.id === currentUserId) || null;
};

export const setCurrentUser = (cyclistId: string): void => {
  localStorage.setItem('currentUserId', cyclistId);
};

export const isCurrentUserAdmin = (): boolean => {
  const currentUser = getCurrentUser();
  // Permitir acceso admin si no hay usuario actual (para setup inicial)
  if (!currentUser) {
    return true;
  }
  return currentUser?.isAdmin || false;
};

export const addCyclist = (cyclist: Cyclist): void => {
  const cyclists = loadCyclists();
  const existingIndex = cyclists.findIndex(c => c.id === cyclist.id);
  
  if (existingIndex >= 0) {
    cyclists[existingIndex] = cyclist;
  } else {
    cyclists.push(cyclist);
  }
  
  saveCyclists(cyclists);
};

export const removeCyclist = (cyclistId: string): void => {
  const cyclists = loadCyclists();
  const filteredCyclists = cyclists.filter(c => c.id !== cyclistId);
  saveCyclists(filteredCyclists);
};

export const updateCyclist = (cyclist: Cyclist): void => {
  const cyclists = loadCyclists();
  const index = cyclists.findIndex(c => c.id === cyclist.id);
  
  if (index >= 0) {
    cyclists[index] = cyclist;
    saveCyclists(cyclists);
  }
};

// Alias for getCyclists (for compatibility)
export const getCyclists = loadCyclists;