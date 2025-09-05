import React, { useState } from 'react';
import { Translation } from '../i18n/translations';
import { login } from '../utils/authStorage';
import { 
  X, 
  User, 
  Mail, 
  LogIn,
  Shield,
  Mountain
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
  t: Translation;
}

export const LoginModal: React.FC<LoginModalProps> = ({ 
  isOpen, 
  onClose, 
  onLoginSuccess,
  t 
}) => {
  const [formData, setFormData] = useState({
    email: '',
    name: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email no válido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simular un pequeño delay para la experiencia de usuario
      await new Promise(resolve => setTimeout(resolve, 500));
      
      login(formData.email.trim(), formData.name.trim());
      
      // Reset form
      setFormData({ email: '', name: '' });
      setErrors({});
      
      onLoginSuccess();
      onClose();
    } catch (error) {
      console.error('Error during login:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full">
        <div className="p-6 border-b flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield className="h-6 w-6 text-orange-500" />
            <h3 className="text-xl font-semibold text-slate-800">Iniciar Sesión</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="text-center mb-6">
            <Mountain className="h-12 w-12 text-orange-500 mx-auto mb-3" />
            <p className="text-slate-600">
              Inicia sesión para acceder a todas las funcionalidades de la aplicación
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <User className="h-4 w-4 inline mr-1" />
                Nombre completo <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 ${
                  errors.name ? 'border-red-500' : 'border-slate-300'
                }`}
                placeholder="Introduce tu nombre completo"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Mail className="h-4 w-4 inline mr-1" />
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 ${
                  errors.email ? 'border-red-500' : 'border-slate-300'
                }`}
                placeholder="tu@email.com"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <Shield className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                <div className="text-sm text-blue-700">
                  <p className="font-medium mb-1">¿Por qué necesitas iniciar sesión?</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Para registrar tu perfil de ciclista</li>
                    <li>Para añadir puertos a tu colección personal</li>
                    <li>Para guardar tus conquistas y fotos</li>
                    <li>Para acceder al panel de administración (si eres admin)</li>
                  </ul>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <LogIn className="h-4 w-4" />
              <span>{isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}</span>
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-xs text-slate-500">
              Al iniciar sesión, aceptas nuestros términos de uso y política de privacidad
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};