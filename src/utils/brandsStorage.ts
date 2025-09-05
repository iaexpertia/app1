import { Brand } from '../types';

const BRANDS_STORAGE_KEY = 'cycling-brands';
const BRAND_CATEGORIES_STORAGE_KEY = 'brand-categories';

export const saveBrands = (brands: Brand[]): void => {
  localStorage.setItem(BRANDS_STORAGE_KEY, JSON.stringify(brands));
};

export const loadBrands = (): Brand[] => {
  const stored = localStorage.getItem(BRANDS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const addBrand = (brand: Brand): void => {
  const brands = loadBrands();
  const existingIndex = brands.findIndex(b => b.id === brand.id);
  
  if (existingIndex >= 0) {
    brands[existingIndex] = brand;
  } else {
    brands.push(brand);
  }
  
  saveBrands(brands);
};

export const removeBrand = (brandId: string): void => {
  const brands = loadBrands();
  const filteredBrands = brands.filter(b => b.id !== brandId);
  saveBrands(filteredBrands);
};

export const updateBrand = (brand: Brand): void => {
  const brands = loadBrands();
  const index = brands.findIndex(b => b.id === brand.id);
  
  if (index >= 0) {
    brands[index] = brand;
    saveBrands(brands);
  }
};

// Brand Categories management
export const getDefaultBrandCategories = (): string[] => {
  return [
    'Bicicletas',
    'Componentes',
    'Ropa',
    'Accesorios',
    'Nutrición',
    'Otros'
  ];
};

export const loadBrandCategories = (): string[] => {
  const stored = localStorage.getItem(BRAND_CATEGORIES_STORAGE_KEY);
  return stored ? JSON.parse(stored) : getDefaultBrandCategories();
};

export const saveBrandCategories = (categories: string[]): void => {
  localStorage.setItem(BRAND_CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
};

export const addBrandCategory = (category: string): void => {
  const categories = loadBrandCategories();
  if (!categories.includes(category)) {
    categories.push(category);
    saveBrandCategories(categories);
  }
};

export const removeBrandCategory = (category: string): void => {
  const categories = loadBrandCategories();
  const filteredCategories = categories.filter(c => c !== category);
  saveBrandCategories(filteredCategories);
};

// Alias for compatibility
export const getBrands = loadBrands;