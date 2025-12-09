import React, { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle, KeyRound } from 'lucide-react';
import { requestPasswordReset } from '../../utils/supabaseAuthService';

interface ForgotPasswordPageProps {
  onNavigate: (page: string) => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onNavigate }) => {
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

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email invalido');
      return;
    }

    setStatus('sending');

    const result = await requestPasswordReset(email);

    if (result.success) {
      setStatus('sent');
    } else {
      setStatus('idle');
      setError(result.error || 'Error al enviar el email');
    }
  };

  if (status === 'sent') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-8 text-white text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h1 className="text-2xl font-bold">Email Enviado</h1>
            </div>

            <div className="p-6 text-center">
              <p className="text-slate-600 mb-2">
                Si el correo existe en nuestro sistema, recibiras un enlace para restablecer tu contrasenya.
              </p>
              <p className="text-slate-500 text-sm mb-6">
                Revisa tu bandeja de entrada y sigue las instrucciones.
              </p>

              <button
                onClick={() => onNavigate('login')}
                className="w-full py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors"
              >
                Volver al inicio de sesion
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
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-8 text-white text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <KeyRound className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold">Recuperar Contrasenya</h1>
            <p className="text-amber-100 mt-1">Te enviaremos un enlace de recuperacion</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Email registrado
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 ${
                    error ? 'border-red-500' : 'border-slate-300'
                  }`}
                  placeholder="tu@email.com"
                  autoFocus
                />
              </div>
              {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            </div>

            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full py-3 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {status === 'sending' ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Enviando...
                </span>
              ) : (
                'Enviar Email de Recuperacion'
              )}
            </button>

            <button
              type="button"
              onClick={() => onNavigate('login')}
              className="w-full flex items-center justify-center gap-2 py-2 text-slate-600 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al inicio de sesion
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
