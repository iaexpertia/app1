import { supabase } from './supabaseClient';

export interface Region {
  id: string;
  name: string;
  country: string;
  created_at: string;
  updated_at: string;
}

export async function getAllRegions(): Promise<Region[]> {
  const { data, error } = await supabase
    .from('regions')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching regions:', error);
    return [];
  }

  return data || [];
}

export async function addRegion(name: string, country: string = 'Sin especificar'): Promise<{ success: boolean; message: string; region?: Region }> {
  const { data, error } = await supabase
    .from('regions')
    .insert({ name, country })
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      return {
        success: false,
        message: 'Esta región ya existe'
      };
    }
    console.error('Error adding region:', error);
    return {
      success: false,
      message: 'Error al agregar la región'
    };
  }

  return {
    success: true,
    message: 'Región agregada correctamente',
    region: data
  };
}
