import { ConquestData } from '../types';
import { supabase } from '../lib/supabase';
import { getCurrentUser } from './cyclistStorage';

const STORAGE_KEY = 'mountain-pass-conquests';

export const saveConquests = (conquests: ConquestData[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(conquests));
};

export const loadConquests = (): ConquestData[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const addConquest = async (conquest: ConquestData): Promise<void> => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    throw new Error('No user logged in');
  }

  try {
    const { error } = await supabase
      .from('conquered_passes')
      .upsert({
        cyclist_id: currentUser.id,
        pass_id: conquest.passId,
        date_completed: conquest.dateCompleted,
        time_completed: conquest.timeCompleted,
        personal_notes: conquest.personalNotes,
        photos: conquest.photos || [],
        strava_activity_id: conquest.stravaActivityId,
        strava_activity_url: conquest.stravaActivityUrl,
        synced_from_strava: conquest.syncedFromStrava || false,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'cyclist_id,pass_id'
      });

    if (error) {
      throw error;
    }

    const conquests = loadConquests();
    const existingIndex = conquests.findIndex(c => c.passId === conquest.passId);

    if (existingIndex >= 0) {
      conquests[existingIndex] = conquest;
    } else {
      conquests.push(conquest);
    }

    saveConquests(conquests);
  } catch (err) {
    console.error('Error adding conquest:', err);
    throw err;
  }
};

export const updateConquestPhotos = async (passId: string, photos: string[]): Promise<void> => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    throw new Error('No user logged in');
  }

  try {
    const { error } = await supabase
      .from('conquered_passes')
      .update({
        photos,
        updated_at: new Date().toISOString()
      })
      .eq('cyclist_id', currentUser.id)
      .eq('pass_id', passId);

    if (error) {
      throw error;
    }

    const conquests = loadConquests();
    const existingIndex = conquests.findIndex(c => c.passId === passId);

    if (existingIndex >= 0) {
      conquests[existingIndex] = { ...conquests[existingIndex], photos };
    } else {
      const newConquest: ConquestData = {
        passId,
        dateCompleted: new Date().toISOString().split('T')[0],
        photos
      };
      conquests.push(newConquest);
    }

    saveConquests(conquests);
  } catch (err) {
    console.error('Error updating conquest photos:', err);
    throw err;
  }
};

export const getConquestByPassId = (passId: string): ConquestData | null => {
  const conquests = loadConquests();
  return conquests.find(c => c.passId === passId) || null;
};

export const removeConquest = async (passId: string): Promise<void> => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    throw new Error('No user logged in');
  }

  try {
    const { error } = await supabase
      .from('conquered_passes')
      .delete()
      .eq('cyclist_id', currentUser.id)
      .eq('pass_id', passId);

    if (error) {
      throw error;
    }

    const conquests = loadConquests();
    const filteredConquests = conquests.filter(c => c.passId !== passId);
    saveConquests(filteredConquests);
  } catch (err) {
    console.error('Error removing conquest:', err);
    throw err;
  }
};

export const syncConquestsFromSupabase = async (): Promise<void> => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return;
  }

  try {
    const { data, error } = await supabase
      .from('conquered_passes')
      .select('*')
      .eq('cyclist_id', currentUser.id);

    if (error) {
      throw error;
    }

    if (data) {
      const conquests: ConquestData[] = data.map(item => ({
        passId: item.pass_id,
        dateCompleted: item.date_completed,
        timeCompleted: item.time_completed,
        personalNotes: item.personal_notes,
        photos: item.photos || [],
        stravaActivityId: item.strava_activity_id,
        stravaActivityUrl: item.strava_activity_url,
        syncedFromStrava: item.synced_from_strava
      }));

      saveConquests(conquests);
    }
  } catch (err) {
    console.error('Error syncing conquests from Supabase:', err);
  }
};
