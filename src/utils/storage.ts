import { ConquestData } from '../types';

const STORAGE_KEY = 'mountain-pass-conquests';

export const saveConquests = (conquests: ConquestData[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(conquests));
};

export const loadConquests = (): ConquestData[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const addConquest = (conquest: ConquestData): void => {
  const conquests = loadConquests();
  const existingIndex = conquests.findIndex(c => c.passId === conquest.passId);
  
  if (existingIndex >= 0) {
    conquests[existingIndex] = conquest;
  } else {
    conquests.push(conquest);
  }
  
  saveConquests(conquests);
};

export const updateConquestPhotos = (passId: string, photos: string[]): void => {
  const conquests = loadConquests();
  const existingIndex = conquests.findIndex(c => c.passId === passId);
  
  if (existingIndex >= 0) {
    conquests[existingIndex] = { ...conquests[existingIndex], photos };
  } else {
    // Si no existe la conquista, la creamos
    const newConquest: ConquestData = {
      passId,
      dateCompleted: new Date().toISOString().split('T')[0],
      photos
    };
    conquests.push(newConquest);
  }
  
  saveConquests(conquests);
};

export const getConquestByPassId = (passId: string): ConquestData | null => {
  const conquests = loadConquests();
  return conquests.find(c => c.passId === passId) || null;
};

export const removeConquest = (passId: string): void => {
  const conquests = loadConquests();
  const filteredConquests = conquests.filter(c => c.passId !== passId);
  saveConquests(filteredConquests);
};

export const updateConquest = (conquest: ConquestData): void => {
  const conquests = loadConquests();
  const index = conquests.findIndex(c => c.passId === conquest.passId);
  
  if (index >= 0) {
    conquests[index] = conquest;
    saveConquests(conquests);
  }
};

export const isPassConquered = (passId: string): boolean => {
  const conquests = loadConquests();
  return conquests.some(c => c.passId === passId);
};