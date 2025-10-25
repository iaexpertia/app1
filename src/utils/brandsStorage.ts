import { Brand } from '../types';
import { supabase } from './supabaseClient';

export const saveBrands = async (brands: Brand[]): Promise<void> => {
  for (const brand of brands) {
    await supabase
      .from('brands')
      .upsert({
        id: brand.id,
        name: brand.name,
        description: brand.description,
        logo_url: brand.logoUrl,
        website_url: brand.websiteUrl,
        category: brand.category,
        country: brand.country,
        founded_year: brand.foundedYear,
        is_featured: brand.isFeatured || false,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'id'
      });
  }
};

export const loadBrands = async (): Promise<Brand[]> => {
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error loading brands:', error);
    return [];
  }

  return (data || []).map(brand => ({
    id: brand.id,
    name: brand.name,
    description: brand.description,
    logoUrl: brand.logo_url,
    websiteUrl: brand.website_url,
    category: brand.category,
    country: brand.country,
    foundedYear: brand.founded_year,
    isFeatured: brand.is_featured
  }));
};

export const addBrand = async (brand: Brand): Promise<void> => {
  const { error } = await supabase
    .from('brands')
    .upsert({
      id: brand.id,
      name: brand.name,
      description: brand.description,
      logo_url: brand.logoUrl,
      website_url: brand.websiteUrl,
      category: brand.category,
      country: brand.country,
      founded_year: brand.foundedYear,
      is_featured: brand.isFeatured || false,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'id'
    });

  if (error) {
    console.error('Error adding brand:', error);
  }
};

export const removeBrand = async (brandId: string): Promise<void> => {
  const { error } = await supabase
    .from('brands')
    .delete()
    .eq('id', brandId);

  if (error) {
    console.error('Error removing brand:', error);
  }
};

export const updateBrand = async (brand: Brand): Promise<void> => {
  const { error } = await supabase
    .from('brands')
    .update({
      name: brand.name,
      description: brand.description,
      logo_url: brand.logoUrl,
      website_url: brand.websiteUrl,
      category: brand.category,
      country: brand.country,
      founded_year: brand.foundedYear,
      is_featured: brand.isFeatured || false,
      updated_at: new Date().toISOString()
    })
    .eq('id', brand.id);

  if (error) {
    console.error('Error updating brand:', error);
  }
};

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
  return getDefaultBrandCategories();
};

export const saveBrandCategories = (categories: string[]): void => {
  // Categories are now hardcoded, no need to save
};

export const addBrandCategory = (category: string): void => {
  // Categories are now hardcoded
};

export const removeBrandCategory = (category: string): void => {
  // Categories are now hardcoded
};

export const getBrands = loadBrands;
