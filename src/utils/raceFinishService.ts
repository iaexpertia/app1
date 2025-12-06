import { supabase } from './supabaseClient';
import { RaceFinish } from '../types';

export const parseTimeToSeconds = (timeString: string): number => {
  const parts = timeString.split(':').map(part => parseInt(part, 10));

  if (parts.length === 3) {
    const [hours, minutes, seconds] = parts;
    return (hours * 3600) + (minutes * 60) + seconds;
  } else if (parts.length === 2) {
    const [minutes, seconds] = parts;
    return (minutes * 60) + seconds;
  }

  return 0;
};

export const formatSecondsToTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const addRaceFinish = async (
  cyclistId: string,
  raceId: string,
  raceName: string,
  year: number,
  finishTime: string,
  dateCompleted: string,
  notes?: string
): Promise<{ success: boolean; error?: string; data?: RaceFinish }> => {
  try {
    const finishTimeSeconds = parseTimeToSeconds(finishTime);

    const existingFinishes = await getRaceFinishesByRace(cyclistId, raceId);
    const isPR = existingFinishes.every(finish => finish.finish_time_seconds > finishTimeSeconds);

    const { data, error } = await supabase
      .from('race_finishes')
      .insert({
        cyclist_id: cyclistId,
        race_id: raceId,
        race_name: raceName,
        year: year,
        finish_time: finishTime,
        finish_time_seconds: finishTimeSeconds,
        notes: notes || '',
        date_completed: dateCompleted,
        is_pr: isPR
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    if (isPR && existingFinishes.length > 0) {
      await updatePRFlags(cyclistId, raceId);
    }

    return { success: true, data: data as RaceFinish };
  } catch (error: any) {
    console.error('Error adding race finish:', error);
    return { success: false, error: error.message };
  }
};

export const updatePRFlags = async (cyclistId: string, raceId: string): Promise<void> => {
  try {
    const { data: allFinishes } = await supabase
      .from('race_finishes')
      .select('*')
      .eq('cyclist_id', cyclistId)
      .eq('race_id', raceId)
      .order('finish_time_seconds', { ascending: true });

    if (!allFinishes || allFinishes.length === 0) return;

    const bestTime = allFinishes[0].finish_time_seconds;

    for (const finish of allFinishes) {
      const isPR = finish.finish_time_seconds === bestTime;
      if (finish.is_pr !== isPR) {
        await supabase
          .from('race_finishes')
          .update({ is_pr: isPR })
          .eq('id', finish.id);
      }
    }
  } catch (error) {
    console.error('Error updating PR flags:', error);
  }
};

export const getRaceFinishesByCyclist = async (cyclistId: string): Promise<RaceFinish[]> => {
  try {
    const { data, error } = await supabase
      .from('race_finishes')
      .select('*')
      .eq('cyclist_id', cyclistId)
      .order('date_completed', { ascending: false });

    if (error) {
      throw error;
    }

    return (data as RaceFinish[]) || [];
  } catch (error) {
    console.error('Error loading race finishes:', error);
    return [];
  }
};

export const getRaceFinishesByRace = async (cyclistId: string, raceId: string): Promise<RaceFinish[]> => {
  try {
    const { data, error } = await supabase
      .from('race_finishes')
      .select('*')
      .eq('cyclist_id', cyclistId)
      .eq('race_id', raceId)
      .order('year', { ascending: false });

    if (error) {
      throw error;
    }

    return (data as RaceFinish[]) || [];
  } catch (error) {
    console.error('Error loading race finishes by race:', error);
    return [];
  }
};

export const updateRaceFinish = async (
  finishId: string,
  finishTime: string,
  notes?: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const finishTimeSeconds = parseTimeToSeconds(finishTime);

    const { error } = await supabase
      .from('race_finishes')
      .update({
        finish_time: finishTime,
        finish_time_seconds: finishTimeSeconds,
        notes: notes || '',
        updated_at: new Date().toISOString()
      })
      .eq('id', finishId);

    if (error) {
      throw error;
    }

    const { data: finish } = await supabase
      .from('race_finishes')
      .select('cyclist_id, race_id')
      .eq('id', finishId)
      .single();

    if (finish) {
      await updatePRFlags(finish.cyclist_id, finish.race_id);
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error updating race finish:', error);
    return { success: false, error: error.message };
  }
};

export const deleteRaceFinish = async (finishId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { data: finish } = await supabase
      .from('race_finishes')
      .select('cyclist_id, race_id')
      .eq('id', finishId)
      .single();

    const { error } = await supabase
      .from('race_finishes')
      .delete()
      .eq('id', finishId);

    if (error) {
      throw error;
    }

    if (finish) {
      await updatePRFlags(finish.cyclist_id, finish.race_id);
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error deleting race finish:', error);
    return { success: false, error: error.message };
  }
};

export const getRaceStats = async (cyclistId: string, raceId: string): Promise<{
  totalFinishes: number;
  bestTime: string;
  averageTime: string;
  improvements: number;
}> => {
  try {
    const finishes = await getRaceFinishesByRace(cyclistId, raceId);

    if (finishes.length === 0) {
      return {
        totalFinishes: 0,
        bestTime: '--:--:--',
        averageTime: '--:--:--',
        improvements: 0
      };
    }

    const sortedFinishes = [...finishes].sort((a, b) => a.year - b.year);
    let improvements = 0;

    for (let i = 1; i < sortedFinishes.length; i++) {
      if (sortedFinishes[i].finish_time_seconds < sortedFinishes[i - 1].finish_time_seconds) {
        improvements++;
      }
    }

    const bestTimeSeconds = Math.min(...finishes.map(f => f.finish_time_seconds));
    const avgTimeSeconds = Math.floor(
      finishes.reduce((sum, f) => sum + f.finish_time_seconds, 0) / finishes.length
    );

    return {
      totalFinishes: finishes.length,
      bestTime: formatSecondsToTime(bestTimeSeconds),
      averageTime: formatSecondsToTime(avgTimeSeconds),
      improvements: improvements
    };
  } catch (error) {
    console.error('Error getting race stats:', error);
    return {
      totalFinishes: 0,
      bestTime: '--:--:--',
      averageTime: '--:--:--',
      improvements: 0
    };
  }
};

export const subscribeToRaceFinishes = (cyclistId: string, callback: (payload: any) => void) => {
  const subscription = supabase
    .channel('race_finishes_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'race_finishes',
        filter: `cyclist_id=eq.${cyclistId}`
      },
      callback
    )
    .subscribe();

  return subscription;
};
