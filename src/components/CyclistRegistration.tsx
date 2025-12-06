import React, { useState, useEffect } from 'react';
import { Cyclist, Bike } from '../types';
import { Translation } from '../i18n/translations';
import { addCyclist } from '../utils/cyclistStorage';
import { setCurrentUser } from '../utils/cyclistStorage';
import { loginUser } from '../utils/cyclistStorage';
import { loadCyclists } from '../utils/cyclistStorage';
import { isCurrentUserAdmin } from '../utils/cyclistStorage';
import { sendRegistrationEmail, sendPasswordRecoveryEmail } from '../utils/emailService';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Weight,
  Bike as BikeIcon,
  Plus,
  Trash2,
  Save,
  UserPlus,
  MapPin,
  Camera,
  X
} from 'lucide-react';

interface CyclistRegistrationProps {
  t: Translation;
  onRegistrationSuccess: () => void;
  onTabChange?: (tab: string) => void;
  isAdmin?: boolean;
}

export const CyclistRegistration: React.FC<CyclistRegistrationProps> = ({
  t,
  onRegistrationSuccess,
  onTabChange,
  isAdmin = false
}) => {
  const [cyclists, setCyclists] = useState<Cyclist[]>([]);
  const [hasRegisteredCyclists, setHasRegisteredCyclists] = useState(false);

  useEffect(() => {
    const fetchCyclists = async () => {
      const loadedCyclists = await loadCyclists();
      setCyclists(loadedCyclists);
      setHasRegisteredCyclists(loadedCyclists.length > 0);
    };
    fetchCyclists();
  }, []);
  
  const [formData, setFormData] = useState({
    name: '',
    alias: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    city: '',
    country: '',
    age: '',
    weight: '',
    profilePhoto: '',
    isAdmin: false,
  });
  
  const [bikes, setBikes] = useState<Omit<Bike, 'id'>[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle');
  const [showLogin, setShowLogin] = useState(false);
  const [showPasswordRecovery, setShowPasswordRecovery] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryStatus, setRecoveryStatus] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  
  // Captcha state
  const [captcha, setCaptcha] = useState({ num1: 0, num2: 0, answer: 0 });
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaError, setCaptchaError] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  // Generate new captcha
  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 20) + 1; // 1-20
    const num2 = Math.floor(Math.random() * 20) + 1; // 1-20
    const answer = num1 + num2;
    setCaptcha({ num1, num2, answer });
    setCaptchaInput('');
    setCaptchaError('');
  };

  // Initialize captcha on component mount
  useEffect(() => {
    generateCaptcha();
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = t.nameRequired;
    }
    
    if (!formData.email.trim()) {
      newErrors.email = t.emailRequired;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t.emailInvalid;
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = t.phoneRequired;
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    // Validate terms acceptance for first user
    if (!hasRegisteredCyclists && !acceptedTerms) {
      newErrors.terms = 'Debes aceptar los términos y condiciones';
    }
    
    // Validate captcha
    const userAnswer = parseInt(captchaInput);
    if (isNaN(userAnswer) || userAnswer !== captcha.answer) {
      setCaptchaError('La respuesta del captcha es incorrecta');
      newErrors.captcha = 'Captcha incorrecto';
    } else {
      setCaptchaError('');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors({ ...errors, photo: 'Por favor selecciona una imagen válida' });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, photo: 'La imagen no debe superar los 5MB' });
        return;
      }

      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData({ ...formData, profilePhoto: base64String });
        setPhotoPreview(base64String);
        setErrors({ ...errors, photo: '' });
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setFormData({ ...formData, profilePhoto: '' });
    setPhotoPreview(null);
  };

  const addBike = () => {
    setBikes([...bikes, {
      brand: '',
      model: '',
      type: 'Road',
      year: undefined
    }]);
  };

  const removeBike = (index: number) => {
    setBikes(bikes.filter((_, i) => i !== index));
  };

  const updateBike = (index: number, field: keyof Omit<Bike, 'id'>, value: any) => {
    const updatedBikes = [...bikes];
    updatedBikes[index] = { ...updatedBikes[index], [field]: value };
    setBikes(updatedBikes);
  };

  const handleLogin = async (email: string, password: string) => {
    // Authenticate user with stored credentials
    const success = await loginUser(email.trim(), password);

    if (success) {
      setShowLogin(false);
      onRegistrationSuccess();
      if (onTabChange) {
        onTabChange('passes');
      }
      return true;
    }
    return false;
  };

  const handlePasswordRecovery = async () => {
    if (!recoveryEmail.trim()) {
      setErrors({ ...errors, recoveryEmail: 'El email es obligatorio' });
      return;
    }

    // Clear recovery email error when starting recovery
    const newErrors = { ...errors };
    delete newErrors.recoveryEmail;
    setErrors(newErrors);

    setRecoveryStatus('sending');

    // Send recovery email
    try {
      const success = await sendPasswordRecoveryEmail(recoveryEmail.trim());
      if (success) {
        setRecoveryStatus('sent');
        setTimeout(() => {
          setShowPasswordRecovery(false);
          setRecoveryStatus('idle');
          setRecoveryEmail('');
          // Clear errors when closing modal
          const clearedErrors = { ...errors };
          delete clearedErrors.recoveryEmail;
          setErrors(clearedErrors);
        }, 3000);
      } else {
        setRecoveryStatus('failed');
      }
    } catch (error) {
      setRecoveryStatus('failed');
      setErrors({ ...errors, recoveryEmail: 'Email no registrado en el sistema' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const newCyclist: Cyclist = {
        id: Date.now().toString(),
        name: formData.name.trim(),
        alias: formData.alias.trim() || undefined,
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        city: formData.city.trim() || undefined,
        country: formData.country.trim() || undefined,
        password: formData.password.trim(),
        age: formData.age ? parseInt(formData.age) : undefined,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        profilePhoto: formData.profilePhoto || undefined,
        isAdmin: formData.isAdmin,
        bikes: bikes.map(bike => ({
          ...bike,
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
        })),
        registrationDate: new Date().toISOString().split('T')[0]
      };

      // Add cyclist to storage
      await addCyclist(newCyclist);
      setCurrentUser(newCyclist.id);

      // Try to send registration email
      setEmailStatus('sending');
      try {
        await sendRegistrationEmail(newCyclist);
        setEmailStatus('sent');
      } catch (emailError) {
        console.error('Failed to send registration email:', emailError);
        setEmailStatus('failed');
      }

      // Wait a moment to show the email status, then call success callback
      setTimeout(() => {
        onRegistrationSuccess();
      }, 2000);

    } catch (error) {
      console.error('Registration failed:', error);
      setErrors({ submit: 'Registration failed. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Login Modal Component
  const LoginModal = () => {
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [loginErrors, setLoginErrors] = useState<Record<string, string>>({});
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [loginCaptcha, setLoginCaptcha] = useState({ num1: 0, num2: 0, answer: 0 });
    const [loginCaptchaInput, setLoginCaptchaInput] = useState('');
    const [loginCaptchaError, setLoginCaptchaError] = useState('');

    // Generate captcha for login
    const generateLoginCaptcha = () => {
      const num1 = Math.floor(Math.random() * 20) + 1;
      const num2 = Math.floor(Math.random() * 20) + 1;
      const answer = num1 + num2;
      setLoginCaptcha({ num1, num2, answer });
      setLoginCaptchaInput('');
      setLoginCaptchaError('');
    };

    // Initialize login captcha
    React.useEffect(() => {
      generateLoginCaptcha();
    }, []);

    const handleLoginSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      if (!loginData.email || !loginData.password) {
        setLoginErrors({ 
          general: 'Por favor completa todos los campos' 
        });
        return;
      }

      // Validate captcha
      const userAnswer = parseInt(loginCaptchaInput);
      if (isNaN(userAnswer) || userAnswer !== loginCaptcha.answer) {
        setLoginCaptchaError('La respuesta del captcha es incorrecta');
        setLoginErrors({ 
          general: 'Por favor resuelve correctamente el captcha' 
        });
        return;
      } else {
        setLoginCaptchaError('');
      }

      // Clear previous errors
      setLoginErrors({});
      setIsLoggingIn(true);
      
      try {
        const success = await handleLogin(loginData.email, loginData.password);
        if (!success) {
          setLoginErrors({ 
            general: 'Email o contraseña incorrectos. Verifica tus credenciales.' 
          });
          // Generate new captcha on failed login
          generateLoginCaptcha();
        }
      } catch (error) {
        setLoginErrors({ 
          general: 'Error al iniciar sesión. Inténtalo de nuevo.' 
        });
        generateLoginCaptcha();
      } finally {
        setIsLoggingIn(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl max-w-md w-full p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Iniciar Sesión</h2>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
              <input
                type="email"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  loginErrors.general ? 'border-red-500' : 'border-slate-300'
                }`}
                placeholder="tu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  loginErrors.general ? 'border-red-500' : 'border-slate-300'
                }`}
                placeholder="Tu contraseña"
                required
              />
            </div>

            {/* Captcha */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Captcha</label>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-lg font-mono bg-slate-50 px-3 py-2 rounded border">
                  <span className="font-bold">{loginCaptcha.num1}</span>
                  <span>+</span>
                  <span className="font-bold">{loginCaptcha.num2}</span>
                  <span>=</span>
                  <span>?</span>
                </div>
                <input
                  type="number"
                  value={loginCaptchaInput}
                  onChange={(e) => {
                    setLoginCaptchaInput(e.target.value);
                    setLoginCaptchaError('');
                  }}
                  className={`w-20 px-3 py-2 border rounded-lg text-center focus:ring-2 focus:ring-blue-500 ${
                    loginCaptchaError ? 'border-red-500' : 'border-slate-300'
                  }`}
                  placeholder="?"
                  min="0"
                  max="100"
                />
              </div>
              {loginCaptchaError && (
                <p className="text-red-500 text-sm mt-1">{loginCaptchaError}</p>
              )}
            </div>

            {loginErrors.general && (
              <p className="text-red-500 text-sm">{loginErrors.general}</p>
            )}

            <div className="text-center mb-4">
              <a
                href="/forgot-password"
                className="text-sm text-orange-600 hover:text-orange-700 underline"
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setShowLogin(false)}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoggingIn}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
              >
                {isLoggingIn ? 'Iniciando...' : 'Iniciar Sesión'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Password Recovery Modal Component
  const PasswordRecoveryModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="bg-orange-100 p-3 rounded-full">
              <Mail className="h-8 w-8 text-orange-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Recuperar Contraseña</h2>
          <p className="text-slate-600">Te enviaremos un enlace para restablecer tu contraseña</p>
        </div>

        {recoveryStatus === 'sent' ? (
          <div className="text-center">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <p className="text-green-800 font-medium">¡Email enviado!</p>
              <p className="text-green-600 text-sm mt-1">
                Revisa tu bandeja de entrada y sigue las instrucciones
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email registrado
              </label>
              <input
                type="email"
                value={recoveryEmail}
                onChange={(e) => {
                  setRecoveryEmail(e.target.value);
                  // Clear error when user starts typing
                  if (errors.recoveryEmail) {
                    const newErrors = { ...errors };
                    delete newErrors.recoveryEmail;
                    setErrors(newErrors);
                  }
                }}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="tu@email.com"
                autoFocus
              />
              {errors.recoveryEmail && (
                <p className="text-red-500 text-sm mt-1">{errors.recoveryEmail}</p>
              )}
            </div>

            {recoveryStatus === 'failed' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">Error al enviar el email. Inténtalo de nuevo.</p>
              </div>
            )}

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowPasswordRecovery(false);
                  setRecoveryEmail('');
                  setRecoveryStatus('idle');
                  // Clear recovery email error when closing
                  const newErrors = { ...errors };
                  delete newErrors.recoveryEmail;
                  setErrors(newErrors);
                }}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handlePasswordRecovery}
                disabled={recoveryStatus === 'sending'}
                className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 transition-colors"
              >
                {recoveryStatus === 'sending' ? 'Enviando...' : 'Enviar Email'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-slate-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-orange-100 p-3 rounded-full">
                <UserPlus className="h-8 w-8 text-orange-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">{t.cyclistRegistration}</h1>
            <p className="text-slate-600">{t.registrationDescription}</p>
          </div>
          
          {hasRegisteredCyclists && (
            <div className="text-center mb-6">
              <p className="text-slate-600 mb-4">¿Ya tienes una cuenta?</p>
              <button
                onClick={() => setShowLogin(true)}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Iniciar Sesión
              </button>
            </div>
          )}
          
          {!hasRegisteredCyclists && (
            <div className="text-center mb-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-center mb-2">
                  <UserPlus className="h-6 w-6 text-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold text-blue-800">¡Bienvenido a CyclePeaks!</h3>
                </div>
                <p className="text-blue-700 text-sm">
                  Parece que eres el primer usuario. Completa tu registro para comenzar a conquistar puertos de montaña.
                </p>
              </div>
            </div>
          )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Photo Section */}
          <div className="flex flex-col items-center space-y-4 pb-6 border-b border-slate-200">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-slate-100 border-4 border-white shadow-lg">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Profile preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-16 h-16 text-slate-400" />
                  </div>
                )}
              </div>
              {photoPreview && (
                <button
                  type="button"
                  onClick={removePhoto}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  title="Eliminar foto"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="text-center">
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                <Camera className="w-4 h-4" />
                <span>{photoPreview ? 'Cambiar foto' : 'Subir foto de perfil'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-slate-500 mt-2">
                Opcional. Máximo 5MB. JPG, PNG o GIF
              </p>
              {errors.photo && <p className="text-red-500 text-sm mt-1">{errors.photo}</p>}
            </div>
          </div>

          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <User className="h-4 w-4 inline mr-1" />
                {t.name} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 ${
                  errors.name ? 'border-red-500' : 'border-slate-300'
                }`}
                placeholder={t.namePlaceholder}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <User className="h-4 w-4 inline mr-1" />
                {t.alias}
              </label>
              <input
                type="text"
                value={formData.alias}
                onChange={(e) => setFormData({ ...formData, alias: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder={t.aliasPlaceholder}
              />
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
                placeholder={t.emailPlaceholder}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Contraseña <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 ${
                  errors.password ? 'border-red-500' : 'border-slate-300'
                }`}
                placeholder="Mínimo 6 caracteres"
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Confirmar Contraseña <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 ${
                  errors.confirmPassword ? 'border-red-500' : 'border-slate-300'
                }`}
                placeholder="Repite tu contraseña"
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Phone className="h-4 w-4 inline mr-1" />
                {t.phone} <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 ${
                  errors.phone ? 'border-red-500' : 'border-slate-300'
                }`}
                placeholder={t.phonePlaceholder}
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <MapPin className="h-4 w-4 inline mr-1" />
                Ciudad
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="Tu ciudad"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <MapPin className="h-4 w-4 inline mr-1" />
                País
              </label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="Tu país"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                {t.age}
              </label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder={t.agePlaceholder}
                min="16"
                max="100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Weight className="h-4 w-4 inline mr-1" />
                {t.weight}
              </label>
              <input
                type="number"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder={t.weightPlaceholder}
                min="40"
                max="150"
                step="0.1"
              />
            </div>
          </div>

          {/* Admin Checkbox Section - Only visible to current admins */}
          {isAdmin && (
            <div className="border-t pt-6">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isAdmin}
                    onChange={(e) => setFormData({ ...formData, isAdmin: e.target.checked })}
                    className="w-5 h-5 text-orange-600 border-orange-300 rounded focus:ring-orange-500"
                  />
                  <div className="flex-1">
                    <span className="text-sm font-medium text-orange-900">
                      Registrar como Administrador
                    </span>
                    <p className="text-xs text-orange-700 mt-1">
                      Los administradores tienen acceso completo para gestionar puertos, ciclistas, marcas, colaboradores y noticias.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Captcha Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-800 mb-3 flex items-center">
              <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Verificación de Seguridad
            </h4>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-lg font-mono bg-white px-4 py-2 rounded border">
                <span className="font-bold text-blue-700">{captcha.num1}</span>
                <span className="text-blue-600">+</span>
                <span className="font-bold text-blue-700">{captcha.num2}</span>
                <span className="text-blue-600">=</span>
                <span className="text-blue-600">?</span>
              </div>
              
              <input
                type="number"
                value={captchaInput}
                onChange={(e) => {
                  setCaptchaInput(e.target.value);
                  setCaptchaError('');
                }}
                className={`w-20 px-3 py-2 border rounded-lg text-center font-mono focus:ring-2 focus:ring-blue-500 ${
                  captchaError ? 'border-red-500' : 'border-slate-300'
                }`}
                placeholder="?"
                min="0"
                max="100"
              />
              
              <button
                type="button"
                onClick={generateCaptcha}
                className="px-3 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-colors text-sm"
                title="Generar nueva suma"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
            
            {captchaError && (
              <p className="text-red-600 text-sm mt-2 flex items-center">
                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {captchaError}
              </p>
            )}
            
            <p className="text-blue-700 text-xs mt-2">
              Por favor, resuelve esta suma para verificar que eres humano
            </p>
          </div>

          {/* Email Status Messages */}
          {emailStatus === 'sent' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-green-800 font-medium">Registro completado exitosamente</p>
                  <p className="text-green-600 text-sm">Se ha enviado un email de confirmación a tu dirección</p>
                </div>
              </div>
            </div>
          )}

          {emailStatus === 'failed' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-yellow-800 font-medium">Registro completado</p>
                  <p className="text-yellow-600 text-sm">No pudimos enviar el email de confirmación, pero tu registro fue exitoso</p>
                </div>
              </div>
            </div>
          )}

          {/* Bikes Section */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800 flex items-center">
                <BikeIcon className="h-5 w-5 mr-2" />
                {t.bikes}
              </h3>
              <button
                type="button"
                onClick={addBike}
                className="flex items-center space-x-2 px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>{t.addBike}</span>
              </button>
            </div>

            {bikes.length === 0 && (
              <p className="text-slate-500 text-center py-4">{t.noBikesAdded}</p>
            )}

            <div className="space-y-4">
              {bikes.map((bike, index) => (
                <div key={index} className="bg-slate-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-slate-700">{t.bike} {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeBike(index)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        {t.brand}
                      </label>
                      <input
                        type="text"
                        value={bike.brand}
                        onChange={(e) => updateBike(index, 'brand', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                        placeholder={t.brandPlaceholder}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        {t.model}
                      </label>
                      <input
                        type="text"
                        value={bike.model}
                        onChange={(e) => updateBike(index, 'model', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                        placeholder={t.modelPlaceholder}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        {t.bikeType}
                      </label>
                      <select
                        value={bike.type}
                        onChange={(e) => updateBike(index, 'type', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="Road">{t.roadBike}</option>
                        <option value="Mountain">{t.mountainBike}</option>
                        <option value="Gravel">{t.gravelBike}</option>
                        <option value="Electric">{t.electricBike}</option>
                        <option value="Other">{t.otherBike}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        {t.year}
                      </label>
                      <input
                        type="number"
                        value={bike.year || ''}
                        onChange={(e) => updateBike(index, 'year', e.target.value ? parseInt(e.target.value) : undefined)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                        placeholder={t.yearPlaceholder}
                        min="1980"
                        max={new Date().getFullYear()}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-6 border-t">
            <button
              type="submit"
              disabled={isSubmitting || emailStatus === 'sending'}
              className="flex items-center space-x-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors relative"
            >
              {isSubmitting || emailStatus === 'sending' ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>
                    {emailStatus === 'sending' ? 'Enviando confirmación...' : t.registering}
                  </span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>{t.registerCyclist}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      
      {showLogin && <LoginModal />}
      {showPasswordRecovery && <PasswordRecoveryModal />}
      {showTermsModal && <TermsModal />}
    </div>
    </div>
  );
};