import { supabase } from './supabaseClient';

export interface NewsCategory {
  id: string;
  name: string;
  name_translations: { es: string; en: string; fr: string; it: string };
  color: string;
  icon: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const loadNewsCategories = async (): Promise<NewsCategory[]> => {
  try {
    const { data, error } = await supabase
      .from('news_categories')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error loading news categories:', error);
    return [];
  }
};

export const loadAllNewsCategories = async (): Promise<NewsCategory[]> => {
  try {
    const { data, error } = await supabase
      .from('news_categories')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error loading all news categories:', error);
    return [];
  }
};

export const saveNewsCategory = async (category: Omit<NewsCategory, 'id' | 'created_at' | 'updated_at'>): Promise<NewsCategory | null> => {
  try {
    const { data, error } = await supabase
      .from('news_categories')
      .insert([{
        ...category,
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving news category:', error);
    return null;
  }
};

export const updateNewsCategory = async (id: string, updates: Partial<Omit<NewsCategory, 'id' | 'created_at' | 'updated_at'>>): Promise<NewsCategory | null> => {
  try {
    const { data, error } = await supabase
      .from('news_categories')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating news category:', error);
    return null;
  }
};

export const deleteNewsCategory = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('news_categories')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting news category:', error);
    return false;
  }
};

export const toggleNewsCategoryStatus = async (id: string, isActive: boolean): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('news_categories')
      .update({
        is_active: isActive,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error toggling news category status:', error);
    return false;
  }
};
