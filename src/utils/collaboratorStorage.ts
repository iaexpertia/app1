import { Collaborator } from '../types';
import { supabase } from './supabaseClient';

export const saveCollaborators = async (collaborators: Collaborator[]): Promise<void> => {
  for (const collaborator of collaborators) {
    await supabase
      .from('collaborators')
      .upsert({
        id: collaborator.id,
        name: collaborator.name,
        description: collaborator.description,
        logo_url: collaborator.logoUrl,
        website_url: collaborator.websiteUrl,
        email: collaborator.email,
        phone: collaborator.phone,
        address: collaborator.address,
        city: collaborator.city,
        country: collaborator.country,
        category: collaborator.category,
        latitude: collaborator.coordinates?.lat,
        longitude: collaborator.coordinates?.lng,
        is_featured: collaborator.isFeatured || false,
        rating: collaborator.rating,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'id'
      });
  }
};

export const loadCollaborators = async (): Promise<Collaborator[]> => {
  const { data, error } = await supabase
    .from('collaborators')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error loading collaborators:', error);
    return [];
  }

  return (data || []).map(collaborator => ({
    id: collaborator.id,
    name: collaborator.name,
    description: collaborator.description,
    logoUrl: collaborator.logo_url,
    websiteUrl: collaborator.website_url,
    email: collaborator.email,
    phone: collaborator.phone,
    address: collaborator.address,
    city: collaborator.city,
    country: collaborator.country,
    category: collaborator.category,
    coordinates: collaborator.latitude && collaborator.longitude ? {
      lat: collaborator.latitude,
      lng: collaborator.longitude
    } : undefined,
    isFeatured: collaborator.is_featured,
    rating: collaborator.rating
  }));
};

export const addCollaborator = async (collaborator: Collaborator): Promise<void> => {
  const { error } = await supabase
    .from('collaborators')
    .upsert({
      id: collaborator.id,
      name: collaborator.name,
      description: collaborator.description,
      logo_url: collaborator.logoUrl,
      website_url: collaborator.websiteUrl,
      email: collaborator.email,
      phone: collaborator.phone,
      address: collaborator.address,
      city: collaborator.city,
      country: collaborator.country,
      category: collaborator.category,
      latitude: collaborator.coordinates?.lat,
      longitude: collaborator.coordinates?.lng,
      is_featured: collaborator.isFeatured || false,
      rating: collaborator.rating,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'id'
    });

  if (error) {
    console.error('Error adding collaborator:', error);
  }
};

export const removeCollaborator = async (collaboratorId: string): Promise<void> => {
  const { error } = await supabase
    .from('collaborators')
    .delete()
    .eq('id', collaboratorId);

  if (error) {
    console.error('Error removing collaborator:', error);
  }
};

export const updateCollaborator = async (collaborator: Collaborator): Promise<void> => {
  const { error } = await supabase
    .from('collaborators')
    .update({
      name: collaborator.name,
      description: collaborator.description,
      logo_url: collaborator.logoUrl,
      website_url: collaborator.websiteUrl,
      email: collaborator.email,
      phone: collaborator.phone,
      address: collaborator.address,
      city: collaborator.city,
      country: collaborator.country,
      category: collaborator.category,
      latitude: collaborator.coordinates?.lat,
      longitude: collaborator.coordinates?.lng,
      is_featured: collaborator.isFeatured || false,
      rating: collaborator.rating,
      updated_at: new Date().toISOString()
    })
    .eq('id', collaborator.id);

  if (error) {
    console.error('Error updating collaborator:', error);
  }
};

export const getDefaultCategories = (): string[] => {
  return [
    'Tienda de Bicicletas',
    'Hotel',
    'Restaurante',
    'Guía Turístico',
    'Equipamiento',
    'Otros'
  ];
};

export const loadCategories = (): string[] => {
  return getDefaultCategories();
};

export const saveCategories = (categories: string[]): void => {
  // Categories are now hardcoded, no need to save
};

export const addCategory = (category: string): void => {
  // Categories are now hardcoded
};

export const removeCategory = (category: string): void => {
  // Categories are now hardcoded
};

export const getCollaborators = loadCollaborators;
