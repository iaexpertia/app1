import React from 'react';
import { UserPlus, LogIn, Lock } from 'lucide-react';

interface AuthRequiredBannerProps {
  onRegisterClick: () => void;
  message?: string;
}

export const AuthRequiredBanner: React.FC<AuthRequiredBannerProps> = ({
  onRegisterClick,
  message = 'Debes registrarte o iniciar sesión para acceder a todas las funcionalidades'
}) => {
  return (
    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex items-start gap-4">
        <div className="bg-white/20 p-3 rounded-lg">
          <Lock className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2">Acceso Restringido</h3>
          <p className="text-white/90 mb-4">{message}</p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={onRegisterClick}
              className="bg-white text-orange-600 hover:bg-orange-50 px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <UserPlus className="w-4 h-4" />
              Registrarse Ahora
            </button>
            <button
              onClick={onRegisterClick}
              className="bg-white/10 hover:bg-white/20 text-white border-2 border-white/30 px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-all duration-200"
            >
              <LogIn className="w-4 h-4" />
              Iniciar Sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
