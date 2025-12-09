import { supabase } from './supabaseClient';

export interface AuthResponse {
  success: boolean;
  error?: string;
  message?: string;
  userId?: string;
}

export interface RegisterData {
  name: string;
  alias?: string;
  email: string;
  password: string;
  phone?: string;
  avatarFile?: File;
}

export interface CyclistProfile {
  id: string;
  name: string;
  alias?: string;
  email: string;
  phone?: string;
  profile_picture_url?: string;
  is_admin: boolean;
  created_at: string;
}

export const signUp = async (data: RegisterData): Promise<AuthResponse> => {
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email.trim(),
      password: data.password,
    });

    if (authError) {
      if (authError.message.includes('already registered')) {
        return { success: false, error: 'Este email ya esta registrado' };
      }
      return { success: false, error: authError.message };
    }

    if (!authData.user) {
      return { success: false, error: 'Error al crear el usuario' };
    }

    const userId = authData.user.id;
    let profilePictureUrl: string | null = null;

    if (data.avatarFile) {
      const uploadResult = await uploadAvatar(userId, data.avatarFile);
      if (uploadResult.success && uploadResult.url) {
        profilePictureUrl = uploadResult.url;
      }
    }

    const { error: profileError } = await supabase.from('cyclists').insert({
      id: userId,
      name: data.name.trim(),
      alias: data.alias?.trim() || null,
      email: data.email.trim(),
      phone: data.phone?.trim() || null,
      profile_picture_url: profilePictureUrl,
      password: '',
      is_admin: false,
    });

    if (profileError) {
      console.error('Error creating cyclist profile:', profileError);
      return {
        success: false,
        error: 'Usuario creado pero hubo un error al guardar el perfil'
      };
    }

    return {
      success: true,
      message: 'Registro completado correctamente',
      userId
    };
  } catch (err: any) {
    console.error('Sign up error:', err);
    return { success: false, error: err.message || 'Error durante el registro' };
  }
};

export const signIn = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        return { success: false, error: 'Email o contrasenya incorrectos' };
      }
      return { success: false, error: error.message };
    }

    if (!data.user) {
      return { success: false, error: 'Error al iniciar sesion' };
    }

    return {
      success: true,
      message: 'Sesion iniciada correctamente',
      userId: data.user.id
    };
  } catch (err: any) {
    console.error('Sign in error:', err);
    return { success: false, error: err.message || 'Error al iniciar sesion' };
  }
};

export const signOut = async (): Promise<AuthResponse> => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, message: 'Sesion cerrada correctamente' };
  } catch (err: any) {
    console.error('Sign out error:', err);
    return { success: false, error: err.message || 'Error al cerrar sesion' };
  }
};

export const requestPasswordReset = async (email: string): Promise<AuthResponse> => {
  try {
    const redirectUrl = `${window.location.origin}/auth/reset-password`;

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: redirectUrl,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return {
      success: true,
      message: 'Si el email existe, recibiras un enlace de recuperacion'
    };
  } catch (err: any) {
    console.error('Password reset request error:', err);
    return { success: false, error: err.message || 'Error al enviar el email' };
  }
};

export const updatePassword = async (newPassword: string): Promise<AuthResponse> => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, message: 'Contrasenya actualizada correctamente' };
  } catch (err: any) {
    console.error('Update password error:', err);
    return { success: false, error: err.message || 'Error al actualizar la contrasenya' };
  }
};

export const getCurrentSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      console.error('Get session error:', error);
      return null;
    }

    return session;
  } catch (err) {
    console.error('Session check error:', err);
    return null;
  }
};

export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    return user;
  } catch (err) {
    console.error('Get user error:', err);
    return null;
  }
};

export const getCyclistProfile = async (userId: string): Promise<CyclistProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('cyclists')
      .select('id, name, alias, email, phone, profile_picture_url, is_admin, created_at')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('Get cyclist profile error:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Get profile error:', err);
    return null;
  }
};

export const uploadAvatar = async (
  userId: string,
  file: File
): Promise<{ success: boolean; url?: string; error?: string }> => {
  try {
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `${userId}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('profiles')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      console.error('Avatar upload error:', uploadError);
      return { success: false, error: uploadError.message };
    }

    const { data: publicUrlData } = supabase.storage
      .from('profiles')
      .getPublicUrl(filePath);

    return { success: true, url: publicUrlData.publicUrl };
  } catch (err: any) {
    console.error('Upload avatar error:', err);
    return { success: false, error: err.message || 'Error al subir el avatar' };
  }
};

export const updateCyclistAvatar = async (
  userId: string,
  avatarUrl: string
): Promise<AuthResponse> => {
  try {
    const { error } = await supabase
      .from('cyclists')
      .update({ profile_picture_url: avatarUrl })
      .eq('id', userId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, message: 'Avatar actualizado correctamente' };
  } catch (err: any) {
    console.error('Update avatar error:', err);
    return { success: false, error: err.message || 'Error al actualizar el avatar' };
  }
};

export const onAuthStateChange = (callback: (event: string, session: any) => void) => {
  return supabase.auth.onAuthStateChange((event, session) => {
    (async () => {
      callback(event, session);
    })();
  });
};
