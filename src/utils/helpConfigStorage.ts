import { supabase } from './supabaseClient';

export interface HelpConfig {
  id: string;
  help_url: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export const loadHelpConfig = async (): Promise<HelpConfig | null> => {
  try {
    const { data, error } = await supabase
      .from('help_config')
      .select('*')
      .eq('is_active', true)
      .maybeSingle();

    if (error) {
      console.error('Error loading help config:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error loading help config:', error);
    return null;
  }
};

export const saveHelpConfig = async (helpUrl: string, isActive: boolean = true): Promise<boolean> => {
  try {
    const existingConfig = await supabase
      .from('help_config')
      .select('*')
      .maybeSingle();

    if (existingConfig.data) {
      const { error } = await supabase
        .from('help_config')
        .update({
          help_url: helpUrl,
          is_active: isActive,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingConfig.data.id);

      if (error) {
        console.error('Error updating help config:', error);
        return false;
      }
    } else {
      const { error } = await supabase
        .from('help_config')
        .insert([{
          help_url: helpUrl,
          is_active: isActive
        }]);

      if (error) {
        console.error('Error creating help config:', error);
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error('Error saving help config:', error);
    return false;
  }
};

export const updateHelpConfig = async (id: string, helpUrl: string, isActive: boolean): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('help_config')
      .update({
        help_url: helpUrl,
        is_active: isActive,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating help config:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error updating help config:', error);
    return false;
  }
};

export const deleteHelpConfig = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('help_config')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting help config:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting help config:', error);
    return false;
  }
};
