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

// Categories management
const CATEGORIES_STORAGE_KEY = 'collaborator-categories';

export const getDefaultCategories = (): string[] => {
  return [
    'Bike Shop',
    'Hotel', 
    'Restaurant',
    'Tour Guide',
    'Equipment',
    'Other'
  ];
};

export const loadCategories = (): string[] => {
  const stored = localStorage.getItem(CATEGORIES_STORAGE_KEY);
  return stored ? JSON.parse(stored) : getDefaultCategories();
};

export const saveCategories = (categories: string[]): void => {
  localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
};

export const addCategory = (category: string): void => {
  const categories = loadCategories();
  if (!categories.includes(category)) {
    categories.push(category);
    saveCategories(categories);
  }
};

export const removeCategory = (category: string): void => {
  const categories = loadCategories();
  const filteredCategories = categories.filter(c => c !== category);
  saveCategories(filteredCategories);
};