import { Collaborator } from '../types';

const COLLABORATORS_STORAGE_KEY = 'mountain-pass-collaborators';

export const saveCollaborators = (collaborators: Collaborator[]): void => {
  localStorage.setItem(COLLABORATORS_STORAGE_KEY, JSON.stringify(collaborators));
};

export const loadCollaborators = (): Collaborator[] => {
  const stored = localStorage.getItem(COLLABORATORS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const addCollaborator = (collaborator: Collaborator): void => {
  const collaborators = loadCollaborators();
  const existingIndex = collaborators.findIndex(c => c.id === collaborator.id);
  
  if (existingIndex >= 0) {
    collaborators[existingIndex] = collaborator;
  } else {
    collaborators.push(collaborator);
  }
  
  saveCollaborators(collaborators);
};

export const removeCollaborator = (collaboratorId: string): void => {
  const collaborators = loadCollaborators();
  const filteredCollaborators = collaborators.filter(c => c.id !== collaboratorId);
  saveCollaborators(filteredCollaborators);
};

export const updateCollaborator = (collaborator: Collaborator): void => {
  const collaborators = loadCollaborators();
  const index = collaborators.findIndex(c => c.id === collaborator.id);
  
  if (index >= 0) {
    collaborators[index] = collaborator;
    saveCollaborators(collaborators);
  }
};