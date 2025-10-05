import { supabase } from './supabaseClient';

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const loadSocialLinks = async (): Promise<SocialLink[]> => {
  const { data, error } = await supabase
    .from('social_links')
    .select('*')
    .order('platform', { ascending: true });

  if (error) {
    console.error('Error loading social links:', error);
    return [];
  }

  return data || [];
};

export const saveSocialLink = async (link: Omit<SocialLink, 'id' | 'created_at' | 'updated_at'>): Promise<boolean> => {
  const existingLinks = await loadSocialLinks();
  const duplicatePlatform = existingLinks.find(l => l.platform === link.platform);

  if (duplicatePlatform) {
    alert(`Ya existe un enlace para ${link.platform}. Por favor, edita el enlace existente.`);
    return false;
  }

  const { data, error } = await supabase
    .from('social_links')
    .insert({
      platform: link.platform,
      url: link.url,
      is_active: link.is_active
    })
    .select();

  if (error) {
    console.error('Error saving social link:', error);
    const errorMessage = error.code === '23505'
      ? `Ya existe un enlace para esta plataforma.`
      : `Error al guardar: ${error.message}`;
    alert(errorMessage);
    return false;
  }

  return true;
};

export const updateSocialLink = async (id: string, updates: Partial<SocialLink>): Promise<boolean> => {
  const { error } = await supabase
    .from('social_links')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    console.error('Error updating social link:', error);
    alert(`Error al actualizar: ${error.message}`);
    return false;
  }

  return true;
};

export const removeSocialLink = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('social_links')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error removing social link:', error);
    return false;
  }

  return true;
};
