import { supabase } from './supabaseClient';

interface AuthResponse {
  success: boolean;
  error?: string;
  message?: string;
}

/**
 * Servicio de autenticacion usando Supabase Auth
 * Proporciona funciones para recuperacion de contrasena sin servidor SMTP externo
 */

/**
 * Envia un Magic Link al email del usuario para recuperar contrasena
 * Supabase envia automaticamente el email con el enlace
 *
 * @param email - Email del usuario
 * @param redirectUrl - URL a la que redirigir despues de hacer clic en el enlace (opcional)
 * @returns Promise con resultado de la operacion
 */
export const requestPasswordReset = async (
  email: string,
  redirectUrl?: string
): Promise<AuthResponse> => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: redirectUrl || 'https://cyclepeaks.com/auth/reset-password',
    });

    if (error) {
      return {
        success: false,
        error: error.message
      };
    }

    return {
      success: true,
      message: 'Email enviado correctamente. Revisa tu bandeja de entrada.'
    };
  } catch (err: any) {
    console.error('Error requesting password reset:', err);
    return {
      success: false,
      error: err.message || 'Error al enviar el email de recuperacion'
    };
  }
};

/**
 * Actualiza la contrasena del usuario autenticado
 * Debe llamarse despues de que el usuario haga clic en el Magic Link
 *
 * @param newPassword - Nueva contrasena
 * @returns Promise con resultado de la operacion
 */
export const updatePassword = async (newPassword: string): Promise<AuthResponse> => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      return {
        success: false,
        error: error.message
      };
    }

    return {
      success: true,
      message: 'Contrasena actualizada correctamente'
    };
  } catch (err: any) {
    console.error('Error updating password:', err);
    return {
      success: false,
      error: err.message || 'Error al actualizar la contrasena'
    };
  }
};

/**
 * Verifica si el usuario tiene una sesion activa
 * Util para validar si el usuario llego desde un Magic Link valido
 *
 * @returns Promise con la sesion del usuario o null
 */
export const getCurrentSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      console.error('Error getting session:', error);
      return null;
    }

    return session;
  } catch (err) {
    console.error('Error checking session:', err);
    return null;
  }
};

/**
 * Cierra la sesion del usuario
 */
export const signOut = async (): Promise<AuthResponse> => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return {
        success: false,
        error: error.message
      };
    }

    return {
      success: true,
      message: 'Sesion cerrada correctamente'
    };
  } catch (err: any) {
    console.error('Error signing out:', err);
    return {
      success: false,
      error: err.message || 'Error al cerrar sesion'
    };
  }
};
