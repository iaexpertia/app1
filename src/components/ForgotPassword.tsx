import React, { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { supabase } from '../utils/supabaseClient';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('El email es obligatorio');
      return;
    }

    setStatus('sending');

    try {
      const redirectUrl = `${window.location.origin}/auth/reset-password.html`;

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: redirectUrl,
      });

      if (resetError) {
        throw resetError;
      }

      setStatus('sent');
    } catch (err: any) {
      console.error('Error sending password reset:', err);
      setStatus('idle');
      setError('Error al enviar el email. Inténtalo de nuevo.');
    }
  };

  const handleGoBack = () => {
    window.location.href = '/';
  };

  if (status === 'sent') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">Email Enviado</h1>
            <p className="text-slate-600 mb-4">
              Si el correo existe, recibirás un enlace para restablecer tu contraseña.
            </p>
            <p className="text-slate-500 text-sm">
              Revisa tu bandeja de entrada y haz clic en el enlace para continuar.
            </p>
          </div>

          <button
            onClick={handleGoBack}
            className="w-full px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
          >
            Volver al inicio
          </button>
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
              <Mail className="h-8 w-8 text-orange-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Recuperar Contraseña</h1>
          <p className="text-slate-600">
            Te enviaremos un enlace para restablecer tu contraseña
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email registrado
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 ${
                error ? 'border-red-500' : 'border-slate-300'
              }`}
              placeholder="tu@email.com"
              autoFocus
              required
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={status === 'sending'}
            className="w-full px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {status === 'sending' ? 'Enviando...' : 'Enviar Email'}
          </button>

          <button
            type="button"
            onClick={handleGoBack}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Volver al inicio de sesión</span>
          </button>
        </form>
      </div>
    </div>
  );
};
