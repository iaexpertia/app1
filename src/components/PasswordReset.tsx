import React, { useState, useEffect } from 'react';
import { validateRecoveryToken, resetPassword } from '../utils/cyclistStorage';
import { Lock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export const PasswordReset: React.FC = () => {
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<'validating' | 'valid' | 'invalid' | 'success' | 'error'>('validating');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Get token and email from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('token');
    const urlEmail = urlParams.get('email');

    if (!urlToken || !urlEmail) {
      setStatus('invalid');
      setError('Enlace de recuperación inválido. Por favor, solicita un nuevo enlace.');
      return;
    }

    setToken(urlToken);
    setEmail(decodeURIComponent(urlEmail));

    // Validate token
    const validatedEmail = validateRecoveryToken(urlToken);
    if (!validatedEmail || validatedEmail.toLowerCase() !== decodeURIComponent(urlEmail).toLowerCase()) {
      setStatus('invalid');
      setError('El enlace de recuperación ha expirado o no es válido. Por favor, solicita uno nuevo.');
    } else {
      setStatus('valid');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate password
    if (newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setIsSubmitting(true);

    try {
      const success = resetPassword(token, newPassword);
      if (success) {
        setStatus('success');
        // Redirect to login after 3 seconds
        setTimeout(() => {
          window.location.href = '/';
        }, 3000);
      } else {
        setStatus('error');
        setError('Error al restablecer la contraseña. El enlace puede haber expirado.');
      }
    } catch (err) {
      setStatus('error');
      setError('Error al restablecer la contraseña. Por favor, inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'validating') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Validando enlace de recuperación...</p>
        </div>
      </div>
    );
  }

  if (status === 'invalid') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <div className="bg-red-100 p-3 rounded-full">
                <XCircle className="h-12 w-12 text-red-600" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">Enlace Inválido</h1>
            <p className="text-slate-600">{error}</p>
          </div>
          <div className="text-center">
            <a
              href="/"
              className="inline-block px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Volver al inicio
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
              Serás redirigido al inicio de sesión en unos momentos...
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
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Restablecer Contraseña</h1>
          <p className="text-slate-600">
            Ingresa tu nueva contraseña para <strong>{email}</strong>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Nueva Contraseña
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              placeholder="Mínimo 6 caracteres"
              required
              minLength={6}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Confirmar Contraseña
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              placeholder="Repite tu contraseña"
              required
              minLength={6}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-blue-800 text-sm font-medium mb-2">Requisitos de contraseña:</p>
            <ul className="text-blue-700 text-sm space-y-1">
              <li className={newPassword.length >= 6 ? 'text-green-600' : ''}>
                • Mínimo 6 caracteres
              </li>
              <li className={newPassword === confirmPassword && newPassword.length > 0 ? 'text-green-600' : ''}>
                • Las contraseñas deben coincidir
              </li>
            </ul>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isSubmitting ? 'Restableciendo...' : 'Restablecer Contraseña'}
          </button>

          <div className="text-center">
            <a
              href="/"
              className="text-sm text-orange-600 hover:text-orange-700 underline"
            >
              Volver al inicio de sesión
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};
