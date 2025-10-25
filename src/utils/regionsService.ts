import { supabase } from './supabaseClient';

export interface Region {
  id: string;
  name: string;
  country: string;
  created_at?: string;
  updated_at?: string;
}

export const loadRegions = async (): Promise<Region[]> => {
  try {
    const { data, error } = await supabase
      .from('regions')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error loading regions:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error loading regions:', error);
    return [];
  }
};

export const addRegion = async (name: string, country: string): Promise<Region | null> => {
  try {
    const { data, error } = await supabase
      .from('regions')
      .insert([{ name, country }])
      .select()
      .maybeSingle();

    if (error) {
      console.error('Error adding region:', error);
      alert('Error al añadir la región: ' + error.message);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error adding region:', error);
    alert('Error al añadir la región');
    return null;
  }
};

export const getRegionsByCountry = async (country: string): Promise<Region[]> => {
  try {
    const { data, error } = await supabase
      .from('regions')
      .select('*')
      .eq('country', country)
      .order('name');

    if (error) {
      console.error('Error loading regions by country:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error loading regions by country:', error);
    return [];
  }
};
