import { supabase } from './supabaseClient';
import { MountainPass } from '../types';

interface DBMountainPass {
  id: string;
  name: string;
  country: string;
  region: string;
  max_altitude: number;
  elevation_gain: number;
  average_gradient: number;
  max_gradient: number;
  distance: number;
  difficulty: string;
  coordinates_lat: number;
  coordinates_lng: number;
  description: string;
  image_url: string;
  category: string;
  famous_winners: any;
  created_at: string;
  updated_at: string;
}

function dbToMountainPass(dbPass: DBMountainPass): MountainPass {
  return {
    id: dbPass.id,
    name: dbPass.name,
    country: dbPass.country,
    region: dbPass.region,
    maxAltitude: dbPass.max_altitude,
    elevationGain: dbPass.elevation_gain,
    averageGradient: dbPass.average_gradient,
    maxGradient: dbPass.max_gradient,
    distance: dbPass.distance,
    difficulty: dbPass.difficulty as MountainPass['difficulty'],
    coordinates: {
      lat: dbPass.coordinates_lat,
      lng: dbPass.coordinates_lng,
    },
    description: dbPass.description,
    imageUrl: dbPass.image_url,
    category: dbPass.category,
    famousWinners: dbPass.famous_winners || [],
  };
}

function mountainPassToDB(pass: MountainPass): Omit<DBMountainPass, 'created_at' | 'updated_at'> {
  return {
    id: pass.id,
    name: pass.name,
    country: pass.country,
    region: pass.region,
    max_altitude: pass.maxAltitude,
    elevation_gain: pass.elevationGain,
    average_gradient: pass.averageGradient,
    max_gradient: pass.maxGradient,
    distance: pass.distance,
    difficulty: pass.difficulty,
    coordinates_lat: pass.coordinates.lat,
    coordinates_lng: pass.coordinates.lng,
    description: pass.description,
    image_url: pass.imageUrl,
    category: pass.category,
    famous_winners: pass.famousWinners || [],
  };
}

export async function getAllPassesFromDB(): Promise<MountainPass[]> {
  const { data, error } = await supabase
    .from('mountain_passes')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching passes:', error);
    return [];
  }

  return data.map(dbToMountainPass);
}

export async function createPassInDB(pass: MountainPass): Promise<MountainPass | null> {
  const dbPass = mountainPassToDB(pass);

  const { data, error } = await supabase
    .from('mountain_passes')
    .insert(dbPass)
    .select()
    .single();

  if (error) {
    console.error('Error creating pass:', error);
    return null;
  }

  return dbToMountainPass(data);
}

export async function updatePassInDB(pass: MountainPass): Promise<MountainPass | null> {
  const dbPass = mountainPassToDB(pass);

  const { data, error } = await supabase
    .from('mountain_passes')
    .update(dbPass)
    .eq('id', pass.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating pass:', error);
    return null;
  }

  return dbToMountainPass(data);
}

export async function deletePassFromDB(passId: string): Promise<boolean> {
  const { error } = await supabase
    .from('mountain_passes')
    .delete()
    .eq('id', passId);

  if (error) {
    console.error('Error deleting pass:', error);
    return false;
  }

  return true;
}

export async function syncPassesToDB(passes: MountainPass[]): Promise<{ success: number; errors: number }> {
  let success = 0;
  let errors = 0;

  for (const pass of passes) {
    const dbPass = mountainPassToDB(pass);

    const { error } = await supabase
      .from('mountain_passes')
      .upsert(dbPass, { onConflict: 'id' });

    if (error) {
      console.error(`Error syncing pass ${pass.name}:`, error);
      errors++;
    } else {
      success++;
    }
  }

  return { success, errors };
}

export async function importPassesFromCSV(csvContent: string): Promise<{ passes: MountainPass[]; errors: string[] }> {
  const lines = csvContent.split('\n').filter(line => line.trim());
  const headers = lines[0].split(',');
  const passes: MountainPass[] = [];
  const errors: string[] = [];

  for (let i = 1; i < lines.length; i++) {
    try {
      const values = lines[i].split(',');
      if (values.length >= headers.length) {
        const pass: MountainPass = {
          id: values[0] || `imported-${Date.now()}-${i}`,
          name: values[1] || '',
          country: values[2] || '',
          region: values[3] || '',
          maxAltitude: parseInt(values[4]) || 0,
          elevationGain: parseInt(values[5]) || 0,
          averageGradient: parseFloat(values[6]) || 0,
          maxGradient: parseFloat(values[7]) || 0,
          distance: parseFloat(values[8]) || 0,
          difficulty: (values[9] as MountainPass['difficulty']) || 'Cuarta',
          coordinates: {
            lat: parseFloat(values[10]) || 0,
            lng: parseFloat(values[11]) || 0,
          },
          description: values[12] || '',
          imageUrl: values[13] || '',
          category: values[14] || 'Otros',
          famousWinners: [],
        };
        passes.push(pass);
      }
    } catch (error) {
      errors.push(`Error en línea ${i + 1}: ${error}`);
    }
  }

  return { passes, errors };
}
