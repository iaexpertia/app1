import { supabase } from './supabaseClient';
import { ConquestData } from '../types';

export interface DatabaseConquest {
  id: string;
  cyclist_id: string;
  pass_id: string;
  date_completed: string;
  notes: string | null;
  photos: string[];
  time_taken: string | null;
  weather_conditions: string | null;
  bike_used: string | null;
  difficulty_rating: number | null;
  created_at: string;
  updated_at: string;
}

function mapToConquestData(dbConquest: any): ConquestData {
  return {
    passId: dbConquest.pass_id,
    dateCompleted: dbConquest.date_completed,
    timeCompleted: dbConquest.time_completed || undefined,
    personalNotes: dbConquest.personal_notes || undefined,
    photos: dbConquest.photos || [],
    stravaActivityId: dbConquest.strava_activity_id || undefined,
    stravaActivityUrl: dbConquest.strava_activity_url || undefined,
    syncedFromStrava: dbConquest.synced_from_strava || undefined,
  };
}

export async function loadConquestsFromDB(cyclistId: string): Promise<ConquestData[]> {
  const { data, error } = await supabase
    .from('conquered_passes')
    .select('*')
    .eq('cyclist_id', cyclistId);

  if (error) {
    console.error('Error loading conquests:', error);
    return [];
  }

  return (data || []).map(mapToConquestData);
}

export async function addConquestToDB(
  cyclistId: string,
  conquest: ConquestData
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('conquered_passes')
    .upsert({
      cyclist_id: cyclistId,
      pass_id: conquest.passId,
      date_completed: conquest.dateCompleted,
      personal_notes: conquest.personalNotes || null,
      photos: conquest.photos || [],
      time_completed: conquest.timeCompleted || null,
      strava_activity_id: conquest.stravaActivityId || null,
      strava_activity_url: conquest.stravaActivityUrl || null,
      synced_from_strava: conquest.syncedFromStrava || false,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'cyclist_id,pass_id'
    });

  if (error) {
    console.error('Error adding conquest:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function removeConquestFromDB(
  cyclistId: string,
  passId: string
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('conquered_passes')
    .delete()
    .eq('cyclist_id', cyclistId)
    .eq('pass_id', passId);

  if (error) {
    console.error('Error removing conquest:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function updateConquestPhotos(
  cyclistId: string,
  passId: string,
  photos: string[]
): Promise<{ success: boolean; error?: string }> {
  const { data: existing, error: fetchError } = await supabase
    .from('conquered_passes')
    .select('*')
    .eq('cyclist_id', cyclistId)
    .eq('pass_id', passId)
    .maybeSingle();

  if (fetchError) {
    console.error('Error fetching conquest:', fetchError);
    return { success: false, error: fetchError.message };
  }

  if (!existing) {
    const result = await addConquestToDB(cyclistId, {
      passId,
      dateCompleted: new Date().toISOString().split('T')[0],
      photos,
    });
    return result;
  }

  const { error } = await supabase
    .from('conquered_passes')
    .update({
      photos,
      updated_at: new Date().toISOString(),
    })
    .eq('cyclist_id', cyclistId)
    .eq('pass_id', passId);

  if (error) {
    console.error('Error updating conquest photos:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function getConquestByPassId(
  cyclistId: string,
  passId: string
): Promise<ConquestData | null> {
  const { data, error } = await supabase
    .from('conquered_passes')
    .select('*')
    .eq('cyclist_id', cyclistId)
    .eq('pass_id', passId)
    .maybeSingle();

  if (error) {
    console.error('Error getting conquest:', error);
    return null;
  }

  return data ? mapToConquestData(data) : null;
}

export function subscribeToConquests(
  cyclistId: string,
  callback: (payload: any) => void
) {
  const subscription = supabase
    .channel(`conquered_passes:cyclist_id=eq.${cyclistId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'conquered_passes',
        filter: `cyclist_id=eq.${cyclistId}`,
      },
      callback
    )
    .subscribe();

  return subscription;
}
