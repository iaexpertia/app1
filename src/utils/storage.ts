import { ConquestData } from '../types';
import { supabase } from './supabaseClient';
import { getCurrentUser } from './cyclistStorage';

export const saveConquests = async (conquests: ConquestData[]): Promise<void> => {
  const currentUser = await getCurrentUser();
  if (!currentUser) return;

  for (const conquest of conquests) {
    await supabase
      .from('conquests')
      .upsert({
        cyclist_id: currentUser.id,
        pass_id: conquest.passId,
        date_completed: conquest.dateCompleted,
        notes: conquest.notes,
        photos: conquest.photos || [],
        time_taken: conquest.timeTaken,
        weather_conditions: conquest.weatherConditions,
        bike_used: conquest.bikeUsed,
        difficulty_rating: conquest.difficultyRating,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'cyclist_id,pass_id'
      });
  }
};

export const loadConquests = async (): Promise<ConquestData[]> => {
  const currentUser = await getCurrentUser();
  if (!currentUser) return [];

  const { data, error } = await supabase
    .from('conquests')
    .select('*')
    .eq('cyclist_id', currentUser.id)
    .order('date_completed', { ascending: false });

  if (error) {
    console.error('Error loading conquests:', error);
    return [];
  }

  return (data || []).map(conquest => ({
    passId: conquest.pass_id,
    dateCompleted: conquest.date_completed,
    notes: conquest.notes,
    photos: conquest.photos || [],
    timeTaken: conquest.time_taken,
    weatherConditions: conquest.weather_conditions,
    bikeUsed: conquest.bike_used,
    difficultyRating: conquest.difficulty_rating
  }));
};

export const addConquest = async (conquest: ConquestData): Promise<void> => {
  const currentUser = await getCurrentUser();
  if (!currentUser) return;

  const { error } = await supabase
    .from('conquests')
    .upsert({
      cyclist_id: currentUser.id,
      pass_id: conquest.passId,
      date_completed: conquest.dateCompleted,
      notes: conquest.notes,
      photos: conquest.photos || [],
      time_taken: conquest.timeTaken,
      weather_conditions: conquest.weatherConditions,
      bike_used: conquest.bikeUsed,
      difficulty_rating: conquest.difficultyRating,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'cyclist_id,pass_id'
    });

  if (error) {
    console.error('Error adding conquest:', error);
  }
};

export const updateConquestPhotos = async (passId: string, photos: string[]): Promise<void> => {
  const currentUser = await getCurrentUser();
  if (!currentUser) return;

  const { error } = await supabase
    .from('conquests')
    .update({
      photos,
      updated_at: new Date().toISOString()
    })
    .eq('cyclist_id', currentUser.id)
    .eq('pass_id', passId);

  if (error) {
    console.error('Error updating conquest photos:', error);
  }
};

export const getConquestByPassId = async (passId: string): Promise<ConquestData | null> => {
  const currentUser = await getCurrentUser();
  if (!currentUser) return null;

  const { data, error } = await supabase
    .from('conquests')
    .select('*')
    .eq('cyclist_id', currentUser.id)
    .eq('pass_id', passId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return {
    passId: data.pass_id,
    dateCompleted: data.date_completed,
    notes: data.notes,
    photos: data.photos || [],
    timeTaken: data.time_taken,
    weatherConditions: data.weather_conditions,
    bikeUsed: data.bike_used,
    difficultyRating: data.difficulty_rating
  };
};

export const removeConquest = async (passId: string): Promise<void> => {
  const currentUser = await getCurrentUser();
  if (!currentUser) return;

  const { error } = await supabase
    .from('conquests')
    .delete()
    .eq('cyclist_id', currentUser.id)
    .eq('pass_id', passId);

  if (error) {
    console.error('Error removing conquest:', error);
  }
};

export const updateConquest = async (conquest: ConquestData): Promise<void> => {
  const currentUser = await getCurrentUser();
  if (!currentUser) return;

  const { error } = await supabase
    .from('conquests')
    .update({
      date_completed: conquest.dateCompleted,
      notes: conquest.notes,
      photos: conquest.photos || [],
      time_taken: conquest.timeTaken,
      weather_conditions: conquest.weatherConditions,
      bike_used: conquest.bikeUsed,
      difficulty_rating: conquest.difficultyRating,
      updated_at: new Date().toISOString()
    })
    .eq('cyclist_id', currentUser.id)
    .eq('pass_id', conquest.passId);

  if (error) {
    console.error('Error updating conquest:', error);
  }
};

export const isPassConquered = async (passId: string): Promise<boolean> => {
  const currentUser = await getCurrentUser();
  if (!currentUser) return false;

  const { data, error } = await supabase
    .from('conquests')
    .select('id')
    .eq('cyclist_id', currentUser.id)
    .eq('pass_id', passId)
    .maybeSingle();

  return !error && data !== null;
};
