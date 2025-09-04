import { Business } from '../types';

const BUSINESS_STORAGE_KEY = 'mountain-pass-businesses';

export const saveBusinesses = (businesses: Business[]): void => {
  localStorage.setItem(BUSINESS_STORAGE_KEY, JSON.stringify(businesses));
};

export const loadBusinesses = (): Business[] => {
  const stored = localStorage.getItem(BUSINESS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const addBusiness = (business: Business): void => {
  const businesses = loadBusinesses();
  const existingIndex = businesses.findIndex(b => b.id === business.id);
  
  if (existingIndex >= 0) {
    businesses[existingIndex] = business;
  } else {
    businesses.push(business);
  }
  
  saveBusinesses(businesses);
};

export const removeBusiness = (businessId: string): void => {
  const businesses = loadBusinesses();
  const filteredBusinesses = businesses.filter(b => b.id !== businessId);
  saveBusinesses(filteredBusinesses);
};

export const updateBusiness = (business: Business): void => {
  const businesses = loadBusinesses();
  const index = businesses.findIndex(b => b.id === business.id);
  
  if (index >= 0) {
    businesses[index] = business;
    saveBusinesses(businesses);
  }
};