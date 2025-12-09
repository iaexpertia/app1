import React, { useState, useEffect } from 'react';
import { Lock, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../utils/supabaseClient';

export const UpdatePassword: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [status, setStatus] = useState<'loading' | 'ready' | 'success' | 'error'>('loading');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          throw sessionError;
        }

        if (!session) {
          setStatus('error');
          setError('Sesión inválida. Por favor, solicita un nuevo enlace de recuperación.');
          return;
        }

        setUserEmail(session.user.email || '');
        setStatus('ready');
      } catch (err) {
        console.error('Error checking session:', err);
        setStatus('error');
        setError('Error al verificar la sesión. Por favor, intenta de nuevo.');
      }
    };

    checkSession();
  }, []);

  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('Debe tener al menos 8 caracteres');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Debe contener al menos 1 letra mayúscula');
    }

    if (!/[0-9]/.test(password)) {
      errors.push('Debe contener al menos 1 número');
    }

    if (!/[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/`~;']/.test(password)) {
      errors.push('Debe contener al menos 1 carácter especial (@, #, $, etc.)');
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    const validationErrors = validatePassword(newPassword);
    if (validationErrors.length > 0) {
      setError(validationErrors.join('. '));
      return;
    }

    setIsSubmitting(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) {
        throw updateError;
      }

      setStatus('success');
      setTimeout(() => {
        window.location.href = '/';
      }, 3000);
    } catch (err: any) {
      console.error('Error updating password:', err);
      setError(err.message || 'Error al actualizar la contraseña. Por favor, intenta de nuevo.');
      setIsSubmitting(false);
    }
  };

  const passwordErrors = validatePassword(newPassword);
  const isPasswordValid = newPassword.length > 0 && passwordErrors.length === 0;
  const passwordsMatch = newPassword.length > 0 && confirmPassword.length > 0 && newPassword === confirmPassword;

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <div className="bg-red-100 p-3 rounded-full">
                <AlertCircle className="h-12 w-12 text-red-600" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">Error</h1>
            <p className="text-slate-600">{error}</p>
          </div>
          <div className="text-center">
            <a
              href="/auth/forgot-password"
              className="inline-block px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Solicitar nuevo enlace
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">Contraseña Actualizada</h1>
            <p className="text-slate-600">
              Tu contraseña ha sido restablecida exitosamente.
            </p>
            <p className="text-slate-500 text-sm mt-2">
              Serás redirigido al inicio en unos momentos...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="bg-orange-100 p-3 rounded-full">
              <Lock className="h-8 w-8 text-orange-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Nueva Contraseña</h1>
          {userEmail && (
            <p className="text-slate-600">
              Establece una nueva contraseña para <strong>{userEmail}</strong>
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Nueva contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setError('');
                }}
                className="w-full px-3 py-2 pr-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="Ingresa tu nueva contraseña"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Confirmar contraseña
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError('');
                }}
                className="w-full px-3 py-2 pr-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="Confirma tu nueva contraseña"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <p className="text-slate-700 text-sm font-medium mb-3">Requisitos de contraseña:</p>
            <ul className="space-y-2">
              <li className={`text-sm flex items-center ${newPassword.length >= 8 ? 'text-green-600' : 'text-slate-600'}`}>
                <span className="mr-2">{newPassword.length >= 8 ? '✓' : '○'}</span>
                Mínimo 8 caracteres
              </li>
              <li className={`text-sm flex items-center ${/[A-Z]/.test(newPassword) ? 'text-green-600' : 'text-slate-600'}`}>
                <span className="mr-2">{/[A-Z]/.test(newPassword) ? '✓' : '○'}</span>
                Al menos 1 mayúscula
              </li>
              <li className={`text-sm flex items-center ${/[0-9]/.test(newPassword) ? 'text-green-600' : 'text-slate-600'}`}>
                <span className="mr-2">{/[0-9]/.test(newPassword) ? '✓' : '○'}</span>
                Al menos 1 número
              </li>
              <li className={`text-sm flex items-center ${/[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/`~;']/.test(newPassword) ? 'text-green-600' : 'text-slate-600'}`}>
                <span className="mr-2">{/[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/`~;']/.test(newPassword) ? '✓' : '○'}</span>
                Al menos 1 carácter especial (@, #, $, etc.)
              </li>
              <li className={`text-sm flex items-center ${passwordsMatch ? 'text-green-600' : 'text-slate-600'}`}>
                <span className="mr-2">{passwordsMatch ? '✓' : '○'}</span>
                Las contraseñas coinciden
              </li>
            </ul>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !isPasswordValid || !passwordsMatch}
            className="w-full px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isSubmitting ? 'Actualizando...' : 'Restablecer Contraseña'}
          </button>

          <div className="text-center">
            <a
              href="/"
              className="text-sm text-orange-600 hover:text-orange-700 underline"
            >
              Volver al inicio
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};
