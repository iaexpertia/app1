import React, { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, KeyRound } from 'lucide-react';
import { updatePassword, getCurrentSession } from '../../utils/supabaseAuthService';
import { supabase } from '../../utils/supabaseClient';

interface ResetPasswordPageProps {
  onNavigate: (page: string) => void;
}

export const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({ onNavigate }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'loading' | 'ready' | 'submitting' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const checkSession = async () => {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');
      const type = hashParams.get('type');

      if (accessToken && type === 'recovery') {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken || '',
        });

        if (error) {
          setStatus('error');
          setErrorMessage('El enlace de recuperacion ha expirado o no es valido');
          return;
        }

        setStatus('ready');
        return;
      }

      const session = await getCurrentSession();
      if (session) {
        setStatus('ready');
      } else {
        setStatus('error');
        setErrorMessage('No se encontro una sesion activa. El enlace puede haber expirado.');
      }
    };

    checkSession();
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!password) {
      newErrors.password = 'La contrasenya es obligatoria';
    } else if (password.length < 6) {
      newErrors.password = 'La contrasenya debe tener al menos 6 caracteres';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contrasenya';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Las contrasenyas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setStatus('submitting');
    setErrors({});

    const result = await updatePassword(password);

    if (result.success) {
      setStatus('success');
    } else {
      setStatus('ready');
      setErrors({ submit: result.error || 'Error al actualizar la contrasenya' });
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Verificando enlace de recuperacion...</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-8 text-white text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h1 className="text-2xl font-bold">Enlace Invalido</h1>
            </div>

            <div className="p-6 text-center">
              <p className="text-slate-600 mb-6">{errorMessage}</p>

              <button
                onClick={() => onNavigate('forgot-password')}
                className="w-full py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors mb-3"
              >
                Solicitar nuevo enlace
              </button>

              <button
                onClick={() => onNavigate('login')}
                className="w-full py-2 text-slate-600 hover:text-slate-800 transition-colors"
              >
                Volver al inicio de sesion
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-8 text-white text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h1 className="text-2xl font-bold">Contrasenya Actualizada</h1>
            </div>

            <div className="p-6 text-center">
              <p className="text-slate-600 mb-6">
                Tu contrasenya ha sido actualizada correctamente. Ya puedes iniciar sesion con tu nueva contrasenya.
              </p>

              <button
                onClick={() => onNavigate('login')}
                className="w-full py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors"
              >
                Ir a Iniciar Sesion
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-8 text-white text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <KeyRound className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold">Nueva Contrasenya</h1>
            <p className="text-teal-100 mt-1">Establece tu nueva contrasenya</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Nueva Contrasenya
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-10 pr-12 py-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 ${
                    errors.password ? 'border-red-500' : 'border-slate-300'
                  }`}
                  placeholder="Minimo 6 caracteres"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Confirmar Contrasenya
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full pl-10 pr-12 py-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 ${
                    errors.confirmPassword ? 'border-red-500' : 'border-slate-300'
                  }`}
                  placeholder="Repite tu contrasenya"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>

            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{errors.submit}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {status === 'submitting' ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Actualizando...
                </span>
              ) : (
                'Actualizar Contrasenya'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
