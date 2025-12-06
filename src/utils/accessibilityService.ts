import { supabase } from './supabaseClient';

export interface AccessibilitySettings {
  fontSize: 'normal' | 'large' | 'extra-large';
  contrast: 'normal' | 'high' | 'low';
  nightMode: boolean;
  blueFilter: boolean;
  hideImages: boolean;
  reduceMotion: boolean;
  textToSpeech: boolean;
}

export const defaultSettings: AccessibilitySettings = {
  fontSize: 'normal',
  contrast: 'normal',
  nightMode: false,
  blueFilter: false,
  hideImages: false,
  reduceMotion: false,
  textToSpeech: false,
};

export const getAccessibilitySettings = async (): Promise<AccessibilitySettings> => {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    const saved = localStorage.getItem('accessibilitySettings');
    return saved ? JSON.parse(saved) : defaultSettings;
  }

  const { data, error } = await supabase
    .from('accessibility_settings')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) {
    console.error('Error loading accessibility settings:', error);
    return defaultSettings;
  }

  if (!data) {
    return defaultSettings;
  }

  return {
    fontSize: data.font_size as AccessibilitySettings['fontSize'],
    contrast: data.contrast as AccessibilitySettings['contrast'],
    nightMode: data.night_mode,
    blueFilter: data.blue_filter,
    hideImages: data.hide_images,
    reduceMotion: data.reduce_motion,
    textToSpeech: data.text_to_speech,
  };
};

export const saveAccessibilitySettings = async (settings: AccessibilitySettings): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
    return;
  }

  const dbSettings = {
    user_id: user.id,
    font_size: settings.fontSize,
    contrast: settings.contrast,
    night_mode: settings.nightMode,
    blue_filter: settings.blueFilter,
    hide_images: settings.hideImages,
    reduce_motion: settings.reduceMotion,
    text_to_speech: settings.textToSpeech,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from('accessibility_settings')
    .upsert(dbSettings, {
      onConflict: 'user_id',
    });

  if (error) {
    console.error('Error saving accessibility settings:', error);
    localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
  }
};

export const deleteAccessibilitySettings = async (): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    localStorage.removeItem('accessibilitySettings');
    return;
  }

  const { error } = await supabase
    .from('accessibility_settings')
    .delete()
    .eq('user_id', user.id);

  if (error) {
    console.error('Error deleting accessibility settings:', error);
  }
};
