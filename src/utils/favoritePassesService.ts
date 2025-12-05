import { supabase } from './supabaseClient';

export interface FavoritePass {
  id: string;
  cyclist_id: string;
  pass_id: string;
  created_at: string;
  updated_at: string;
}

export async function loadFavoritePassesFromDB(cyclistId: string): Promise<Set<string>> {
  const { data, error } = await supabase
    .from('favorite_passes')
    .select('pass_id')
    .eq('cyclist_id', cyclistId);

  if (error) {
    console.error('Error loading favorite passes:', error);
    return new Set();
  }

  return new Set((data || []).map(item => item.pass_id));
}

export async function addFavoritePassToDB(
  cyclistId: string,
  passId: string
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('favorite_passes')
    .upsert({
      cyclist_id: cyclistId,
      pass_id: passId,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'cyclist_id,pass_id'
    });

  if (error) {
    console.error('Error adding favorite pass:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function removeFavoritePassFromDB(
  cyclistId: string,
  passId: string
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('favorite_passes')
    .delete()
    .eq('cyclist_id', cyclistId)
    .eq('pass_id', passId);

  if (error) {
    console.error('Error removing favorite pass:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

export function subscribeToFavoritePasses(
  cyclistId: string,
  callback: (payload: any) => void
) {
  const subscription = supabase
    .channel(`favorite_passes:cyclist_id=eq.${cyclistId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'favorite_passes',
        filter: `cyclist_id=eq.${cyclistId}`,
      },
      callback
    )
    .subscribe();

  return subscription;
}
