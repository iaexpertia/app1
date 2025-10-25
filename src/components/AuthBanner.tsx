import React from 'react';
import { AlertCircle, UserPlus, LogIn } from 'lucide-react';

interface AuthBannerProps {
  onRegister: () => void;
  message?: string;
}

export const AuthBanner: React.FC<AuthBannerProps> = ({ onRegister, message }) => {
  return (
    <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-6 w-6 flex-shrink-0" />
            <div>
              <p className="font-semibold text-lg">
                {message || '¡Regístrate para acceder a todas las funcionalidades!'}
              </p>
              <p className="text-sm text-orange-100 mt-1">
                Registra tus conquistas, consulta tus estadísticas y mucho más
              </p>
            </div>
          </div>
          <button
            onClick={onRegister}
            className="flex items-center gap-2 px-6 py-3 bg-white text-orange-600 rounded-lg font-semibold hover:bg-orange-50 transition-colors shadow-md"
          >
            <UserPlus className="h-5 w-5" />
            Registrarse / Iniciar Sesión
          </button>
        </div>
      </div>
    </div>
  );
};
