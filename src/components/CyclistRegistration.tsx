import React, { useState, useEffect } from 'react';
import { Cyclist, Bike } from '../types';
import { Translation } from '../i18n/translations';
import { Eye, EyeOff, Plus, Trash2, UserPlus, LogIn, Bike as BikeIcon, FileText, X } from 'lucide-react';
import { setCurrentUser } from '../utils/cyclistStorage';
import { loginUser } from '../utils/cyclistStorage';
import { loadCyclists } from '../utils/cyclistStorage';
import { sendRegistrationEmail, sendPasswordRecoveryEmail } from '../utils/emailService';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Weight, 
  Bike as LucideBikeIcon,
  Plus,
  Trash2,
  Save,
  UserPlus
} from 'lucide-react';

interface CyclistRegistrationProps {
  t: Translation;
  onRegistrationSuccess: () => void;
}

export const CyclistRegistration: React.FC<CyclistRegistrationProps> = ({ 
  t, 
  onRegistrationSuccess 
}) => {
  const [cyclists] = useState(() => loadCyclists());
  const hasRegisteredCyclists = cyclists.length > 0;
  
  const [formData, setFormData] = useState({
    name: '',
    alias: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    age: '',
    weight: '',
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
  const [selectedCountryCode, setSelectedCountryCode] = useState('+34');
  const [phoneNumber, setPhoneNumber] = useState('');
  
  // Captcha state
  const [captcha, setCaptcha] = useState({ num1: 0, num2: 0, answer: 0 });
  const [captchaInput, setCaptchaInput] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [captchaError, setCaptchaError] = useState('');

  // Country codes database
  const countryCodes = [
    { code: '+1', country: 'Estados Unidos / Canadá', flag: '🇺🇸' },
    { code: '+7', country: 'Rusia', flag: '🇷🇺' },
    { code: '+20', country: 'Egipto', flag: '🇪🇬' },
    { code: '+27', country: 'Sudáfrica', flag: '🇿🇦' },
    { code: '+30', country: 'Grecia', flag: '🇬🇷' },
    { code: '+31', country: 'Países Bajos', flag: '🇳🇱' },
    { code: '+32', country: 'Bélgica', flag: '🇧🇪' },
    { code: '+33', country: 'Francia', flag: '🇫🇷' },
    { code: '+34', country: 'España', flag: '🇪🇸' },
    { code: '+39', country: 'Italia', flag: '🇮🇹' },
    { code: '+41', country: 'Suiza', flag: '🇨🇭' },
    { code: '+43', country: 'Austria', flag: '🇦🇹' },
    { code: '+44', country: 'Reino Unido', flag: '🇬🇧' },
    { code: '+45', country: 'Dinamarca', flag: '🇩🇰' },
    { code: '+46', country: 'Suecia', flag: '🇸🇪' },
    { code: '+47', country: 'Noruega', flag: '🇳🇴' },
    { code: '+48', country: 'Polonia', flag: '🇵🇱' },
    { code: '+49', country: 'Alemania', flag: '🇩🇪' },
    { code: '+51', country: 'Perú', flag: '🇵🇪' },
    { code: '+52', country: 'México', flag: '🇲🇽' },
    { code: '+53', country: 'Cuba', flag: '🇨🇺' },
    { code: '+54', country: 'Argentina', flag: '🇦🇷' },
    { code: '+55', country: 'Brasil', flag: '🇧🇷' },
    { code: '+56', country: 'Chile', flag: '🇨🇱' },
    { code: '+57', country: 'Colombia', flag: '🇨🇴' },
    { code: '+58', country: 'Venezuela', flag: '🇻🇪' },
    { code: '+60', country: 'Malasia', flag: '🇲🇾' },
    { code: '+61', country: 'Australia', flag: '🇦🇺' },
    { code: '+62', country: 'Indonesia', flag: '🇮🇩' },
    { code: '+63', country: 'Filipinas', flag: '🇵🇭' },
    { code: '+64', country: 'Nueva Zelanda', flag: '🇳🇿' },
    { code: '+65', country: 'Singapur', flag: '🇸🇬' },
    { code: '+66', country: 'Tailandia', flag: '🇹🇭' },
    { code: '+81', country: 'Japón', flag: '🇯🇵' },
    { code: '+82', country: 'Corea del Sur', flag: '🇰🇷' },
    { code: '+84', country: 'Vietnam', flag: '🇻🇳' },
    { code: '+86', country: 'China', flag: '🇨🇳' },
    { code: '+90', country: 'Turquía', flag: '🇹🇷' },
    { code: '+91', country: 'India', flag: '🇮🇳' },
    { code: '+92', country: 'Pakistán', flag: '🇵🇰' },
    { code: '+93', country: 'Afganistán', flag: '🇦🇫' },
    { code: '+94', country: 'Sri Lanka', flag: '🇱🇰' },
    { code: '+95', country: 'Myanmar', flag: '🇲🇲' },
    { code: '+98', country: 'Irán', flag: '🇮🇷' },
    { code: '+212', country: 'Marruecos', flag: '🇲🇦' },
    { code: '+213', country: 'Argelia', flag: '🇩🇿' },
    { code: '+216', country: 'Túnez', flag: '🇹🇳' },
    { code: '+218', country: 'Libia', flag: '🇱🇾' },
    { code: '+220', country: 'Gambia', flag: '🇬🇲' },
    { code: '+221', country: 'Senegal', flag: '🇸🇳' },
    { code: '+222', country: 'Mauritania', flag: '🇲🇷' },
    { code: '+223', country: 'Malí', flag: '🇲🇱' },
    { code: '+224', country: 'Guinea', flag: '🇬🇳' },
    { code: '+225', country: 'Costa de Marfil', flag: '🇨🇮' },
    { code: '+226', country: 'Burkina Faso', flag: '🇧🇫' },
    { code: '+227', country: 'Níger', flag: '🇳🇪' },
    { code: '+228', country: 'Togo', flag: '🇹🇬' },
    { code: '+229', country: 'Benín', flag: '🇧🇯' },
    { code: '+230', country: 'Mauricio', flag: '🇲🇺' },
    { code: '+231', country: 'Liberia', flag: '🇱🇷' },
    { code: '+232', country: 'Sierra Leona', flag: '🇸🇱' },
    { code: '+233', country: 'Ghana', flag: '🇬🇭' },
    { code: '+234', country: 'Nigeria', flag: '🇳🇬' },
    { code: '+235', country: 'Chad', flag: '🇹🇩' },
    { code: '+236', country: 'República Centroafricana', flag: '🇨🇫' },
    { code: '+237', country: 'Camerún', flag: '🇨🇲' },
    { code: '+238', country: 'Cabo Verde', flag: '🇨🇻' },
    { code: '+239', country: 'Santo Tomé y Príncipe', flag: '🇸🇹' },
    { code: '+240', country: 'Guinea Ecuatorial', flag: '🇬🇶' },
    { code: '+241', country: 'Gabón', flag: '🇬🇦' },
    { code: '+242', country: 'República del Congo', flag: '🇨🇬' },
    { code: '+243', country: 'República Democrática del Congo', flag: '🇨🇩' },
    { code: '+244', country: 'Angola', flag: '🇦🇴' },
    { code: '+245', country: 'Guinea-Bisáu', flag: '🇬🇼' },
    { code: '+246', country: 'Territorio Británico del Océano Índico', flag: '🇮🇴' },
    { code: '+248', country: 'Seychelles', flag: '🇸🇨' },
    { code: '+249', country: 'Sudán', flag: '🇸🇩' },
    { code: '+250', country: 'Ruanda', flag: '🇷🇼' },
    { code: '+251', country: 'Etiopía', flag: '🇪🇹' },
    { code: '+252', country: 'Somalia', flag: '🇸🇴' },
    { code: '+253', country: 'Yibuti', flag: '🇩🇯' },
    { code: '+254', country: 'Kenia', flag: '🇰🇪' },
    { code: '+255', country: 'Tanzania', flag: '🇹🇿' },
    { code: '+256', country: 'Uganda', flag: '🇺🇬' },
    { code: '+257', country: 'Burundi', flag: '🇧🇮' },
    { code: '+258', country: 'Mozambique', flag: '🇲🇿' },
    { code: '+260', country: 'Zambia', flag: '🇿🇲' },
    { code: '+261', country: 'Madagascar', flag: '🇲🇬' },
    { code: '+262', country: 'Reunión', flag: '🇷🇪' },
    { code: '+263', country: 'Zimbabue', flag: '🇿🇼' },
    { code: '+264', country: 'Namibia', flag: '🇳🇦' },
    { code: '+265', country: 'Malaui', flag: '🇲🇼' },
    { code: '+266', country: 'Lesoto', flag: '🇱🇸' },
    { code: '+267', country: 'Botsuana', flag: '🇧🇼' },
    { code: '+268', country: 'Esuatini', flag: '🇸🇿' },
    { code: '+269', country: 'Comoras', flag: '🇰🇲' },
    { code: '+290', country: 'Santa Elena', flag: '🇸🇭' },
    { code: '+291', country: 'Eritrea', flag: '🇪🇷' },
    { code: '+297', country: 'Aruba', flag: '🇦🇼' },
    { code: '+298', country: 'Islas Feroe', flag: '🇫🇴' },
    { code: '+299', country: 'Groenlandia', flag: '🇬🇱' },
    { code: '+350', country: 'Gibraltar', flag: '🇬🇮' },
    { code: '+351', country: 'Portugal', flag: '🇵🇹' },
    { code: '+352', country: 'Luxemburgo', flag: '🇱🇺' },
    { code: '+353', country: 'Irlanda', flag: '🇮🇪' },
    { code: '+354', country: 'Islandia', flag: '🇮🇸' },
    { code: '+355', country: 'Albania', flag: '🇦🇱' },
    { code: '+356', country: 'Malta', flag: '🇲🇹' },
    { code: '+357', country: 'Chipre', flag: '🇨🇾' },
    { code: '+358', country: 'Finlandia', flag: '🇫🇮' },
    { code: '+359', country: 'Bulgaria', flag: '🇧🇬' },
    { code: '+370', country: 'Lituania', flag: '🇱🇹' },
    { code: '+371', country: 'Letonia', flag: '🇱🇻' },
    { code: '+372', country: 'Estonia', flag: '🇪🇪' },
    { code: '+373', country: 'Moldavia', flag: '🇲🇩' },
    { code: '+374', country: 'Armenia', flag: '🇦🇲' },
    { code: '+375', country: 'Bielorrusia', flag: '🇧🇾' },
    { code: '+376', country: 'Andorra', flag: '🇦🇩' },
    { code: '+377', country: 'Mónaco', flag: '🇲🇨' },
    { code: '+378', country: 'San Marino', flag: '🇸🇲' },
    { code: '+380', country: 'Ucrania', flag: '🇺🇦' },
    { code: '+381', country: 'Serbia', flag: '🇷🇸' },
    { code: '+382', country: 'Montenegro', flag: '🇲🇪' },
    { code: '+383', country: 'Kosovo', flag: '🇽🇰' },
    { code: '+385', country: 'Croacia', flag: '🇭🇷' },
    { code: '+386', country: 'Eslovenia', flag: '🇸🇮' },
    { code: '+387', country: 'Bosnia y Herzegovina', flag: '🇧🇦' },
    { code: '+389', country: 'Macedonia del Norte', flag: '🇲🇰' },
    { code: '+420', country: 'República Checa', flag: '🇨🇿' },
    { code: '+421', country: 'Eslovaquia', flag: '🇸🇰' },
    { code: '+423', country: 'Liechtenstein', flag: '🇱🇮' },
    { code: '+500', country: 'Islas Malvinas', flag: '🇫🇰' },
    { code: '+501', country: 'Belice', flag: '🇧🇿' },
    { code: '+502', country: 'Guatemala', flag: '🇬🇹' },
    { code: '+503', country: 'El Salvador', flag: '🇸🇻' },
    { code: '+504', country: 'Honduras', flag: '🇭🇳' },
    { code: '+505', country: 'Nicaragua', flag: '🇳🇮' },
    { code: '+506', country: 'Costa Rica', flag: '🇨🇷' },
    { code: '+507', country: 'Panamá', flag: '🇵🇦' },
    { code: '+508', country: 'San Pedro y Miquelón', flag: '🇵🇲' },
    { code: '+509', country: 'Haití', flag: '🇭🇹' },
    { code: '+590', country: 'Guadalupe', flag: '🇬🇵' },
    { code: '+591', country: 'Bolivia', flag: '🇧🇴' },
    { code: '+592', country: 'Guyana', flag: '🇬🇾' },
    { code: '+593', country: 'Ecuador', flag: '🇪🇨' },
    { code: '+594', country: 'Guayana Francesa', flag: '🇬🇫' },
    { code: '+595', country: 'Paraguay', flag: '🇵🇾' },
    { code: '+596', country: 'Martinica', flag: '🇲🇶' },
    { code: '+597', country: 'Surinam', flag: '🇸🇷' },
    { code: '+598', country: 'Uruguay', flag: '🇺🇾' },
    { code: '+599', country: 'Antillas Neerlandesas', flag: '🇧🇶' },
    { code: '+670', country: 'Timor Oriental', flag: '🇹🇱' },
    { code: '+672', country: 'Territorio Antártico Australiano', flag: '🇦🇶' },
    { code: '+673', country: 'Brunéi', flag: '🇧🇳' },
    { code: '+674', country: 'Nauru', flag: '🇳🇷' },
    { code: '+675', country: 'Papúa Nueva Guinea', flag: '🇵🇬' },
    { code: '+676', country: 'Tonga', flag: '🇹🇴' },
    { code: '+677', country: 'Islas Salomón', flag: '🇸🇧' },
    { code: '+678', country: 'Vanuatu', flag: '🇻🇺' },
    { code: '+679', country: 'Fiyi', flag: '🇫🇯' },
    { code: '+680', country: 'Palaos', flag: '🇵🇼' },
    { code: '+681', country: 'Wallis y Futuna', flag: '🇼🇫' },
    { code: '+682', country: 'Islas Cook', flag: '🇨🇰' },
    { code: '+683', country: 'Niue', flag: '🇳🇺' },
    { code: '+684', country: 'Samoa Americana', flag: '🇦🇸' },
    { code: '+685', country: 'Samoa', flag: '🇼🇸' },
    { code: '+686', country: 'Kiribati', flag: '🇰🇮' },
    { code: '+687', country: 'Nueva Caledonia', flag: '🇳🇨' },
    { code: '+688', country: 'Tuvalu', flag: '🇹🇻' },
    { code: '+689', country: 'Polinesia Francesa', flag: '🇵🇫' },
    { code: '+690', country: 'Tokelau', flag: '🇹🇰' },
    { code: '+691', country: 'Estados Federados de Micronesia', flag: '🇫🇲' },
    { code: '+692', country: 'Islas Marshall', flag: '🇲🇭' },
    { code: '+850', country: 'Corea del Norte', flag: '🇰🇵' },
    { code: '+852', country: 'Hong Kong', flag: '🇭🇰' },
    { code: '+853', country: 'Macao', flag: '🇲🇴' },
    { code: '+855', country: 'Camboya', flag: '🇰🇭' },
    { code: '+856', country: 'Laos', flag: '🇱🇦' },
    { code: '+880', country: 'Bangladés', flag: '🇧🇩' },
    { code: '+886', country: 'Taiwán', flag: '🇹🇼' },
    { code: '+960', country: 'Maldivas', flag: '🇲🇻' },
    { code: '+961', country: 'Líbano', flag: '🇱🇧' },
    { code: '+962', country: 'Jordania', flag: '🇯🇴' },
    { code: '+963', country: 'Siria', flag: '🇸🇾' },
    { code: '+964', country: 'Irak', flag: '🇮🇶' },
    { code: '+965', country: 'Kuwait', flag: '🇰🇼' },
    { code: '+966', country: 'Arabia Saudí', flag: '🇸🇦' },
    { code: '+967', country: 'Yemen', flag: '🇾🇪' },
    { code: '+968', country: 'Omán', flag: '🇴🇲' },
    { code: '+970', country: 'Palestina', flag: '🇵🇸' },
    { code: '+971', country: 'Emiratos Árabes Unidos', flag: '🇦🇪' },
    { code: '+972', country: 'Israel', flag: '🇮🇱' },
    { code: '+973', country: 'Baréin', flag: '🇧🇭' },
    { code: '+974', country: 'Catar', flag: '🇶🇦' },
    { code: '+975', country: 'Bután', flag: '🇧🇹' },
    { code: '+976', country: 'Mongolia', flag: '🇲🇳' },
    { code: '+977', country: 'Nepal', flag: '🇳🇵' },
    { code: '+992', country: 'Tayikistán', flag: '🇹🇯' },
    { code: '+993', country: 'Turkmenistán', flag: '🇹🇲' },
    { code: '+994', country: 'Azerbaiyán', flag: '🇦🇿' },
    { code: '+995', country: 'Georgia', flag: '🇬🇪' },
    { code: '+996', country: 'Kirguistán', flag: '🇰🇬' },
    { code: '+998', country: 'Uzbekistán', flag: '🇺🇿' }
  ];

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
    
    if (!acceptedTerms) {
      newErrors.terms = 'Debes aceptar los términos y condiciones para continuar';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
    const success = loginUser(email.trim(), password);
    
    if (success) {
     // Redirect to main passes page after successful login
     if (onRegistrationSuccess) {
      onRegistrationSuccess();
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
    
    // Simulate sending recovery email
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
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
    } catch (error) {
      setRecoveryStatus('failed');
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
        phone: `${selectedCountryCode} ${phoneNumber.trim()}`,
        password: formData.password.trim(),
        age: formData.age ? parseInt(formData.age) : undefined,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        isAdmin: formData.isAdmin,
        bikes: bikes.map(bike => ({
          ...bike,
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
        })),
        registrationDate: new Date().toISOString().split('T')[0]
      };

      // Add cyclist to storage
      addCyclist(newCyclist);
      setCurrentUser(newCyclist);

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
                Teléfono <span className="text-red-500">*</span>
              </label>
              <div className="flex space-x-2">
                <select
                  value={selectedCountryCode}
                  onChange={(e) => setSelectedCountryCode(e.target.value)}
                  className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 bg-white ${
                    errors.phone ? 'border-red-500' : 'border-slate-300'
                  }`}
                  style={{ minWidth: '120px' }}
                >
                  {countryCodes.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.flag} {country.code}
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 ${
                    errors.phone ? 'border-red-500' : 'border-slate-300'
                  }`}
                  placeholder="123 456 789"
                />
              </div>
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
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
          
          {/* Captcha Section */}
          
          {/* Terms and Conditions - Only for first user */}
          {!hasRegisteredCyclists && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="acceptTerms"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className={`mt-1 rounded border-slate-300 text-orange-500 focus:ring-orange-500 ${
                    errors.terms ? 'border-red-500' : ''
                  }`}
                />
                <label htmlFor="acceptTerms" className="text-sm text-slate-700 leading-relaxed">
                  <span className="text-red-500">*</span> Como primer usuario, acepto los{' '}
                  <button
                    type="button"
                    onClick={() => setShowTermsModal(true)}
                    className="text-orange-600 hover:text-orange-700 underline font-medium"
                  >
                    términos y condiciones
                  </button>{' '}
                  de uso de la plataforma CyclePeaks
                </label>
              </div>
              {errors.terms && (
                <p className="text-red-500 text-sm mt-2 ml-6">{errors.terms}</p>
              )}
              <p className="text-yellow-700 text-xs mt-2 ml-6">
                Es necesario aceptar los términos para crear la primera cuenta de administrador
              </p>
            </div>
          )}
          
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
                <LucideBikeIcon className="h-5 w-5 mr-2" />
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
      
      {/* Terms and Conditions Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 rounded-t-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-800">Términos y Condiciones</h2>
                <button
                  onClick={() => setShowTermsModal(false)}
                  className="text-slate-500 hover:text-slate-700 transition-colors p-2 hover:bg-slate-100 rounded-lg"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <p className="text-orange-800 text-sm">
                  <strong>Última actualización:</strong> {new Date().toLocaleDateString('es-ES')}
                </p>
              </div>
              
              {/* Terms and Conditions */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="acceptTerms"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="mt-1 rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                  />
                  <label htmlFor="acceptTerms" className="text-sm text-slate-700 leading-relaxed">
                    Acepto los{' '}
                    <button
                      type="button"
                      onClick={() => setShowTermsModal(true)}
                      className="text-orange-600 hover:text-orange-700 underline font-medium"
                    >
                      términos y condiciones
                    </button>{' '}
                    <span className="text-red-500">*</span>
                  </label>
                </div>
                <p className="text-xs text-slate-600 mt-2 ml-6">
                  Es obligatorio aceptar los términos y condiciones para completar el registro.
                </p>
                {errors.terms && (
                  <p className="text-red-600 text-sm mt-2 ml-6">{errors.terms}</p>
                )}
              </div>

              <div className="space-y-6">
                <section>
                  <h3 className="text-lg font-semibold text-slate-800 mb-3">1. Objeto y Aceptación</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Los presentes términos y condiciones regulan el uso de la plataforma CyclePeaks y el registro 
                    como usuario ciclista. Al marcar la casilla de aceptación y completar el registro, el usuario 
                    acepta expresamente y sin reservas estos términos y condiciones, así como la política de 
                    privacidad de la plataforma.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-slate-800 mb-3">2. Registro y Datos Personales</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Para el registro como ciclista, es necesario proporcionar datos personales veraces, exactos 
                    y actualizados. El usuario se compromete a:
                  </p>
                  <ul className="list-disc list-inside text-slate-600 mt-2 space-y-1">
                    <li>Proporcionar información personal veraz y actualizada</li>
                    <li>Mantener la confidencialidad de sus credenciales de acceso</li>
                    <li>Notificar cualquier uso no autorizado de su cuenta</li>
                    <li>Actualizar sus datos cuando sea necesario</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-slate-800 mb-3">3. Uso de la Plataforma</h3>
                  <p className="text-slate-600 leading-relaxed">
                    El usuario se compromete a utilizar la plataforma de forma adecuada y conforme a la ley, 
                    la moral, las buenas costumbres y el orden público. Queda prohibido:
                  </p>
                  <ul className="list-disc list-inside text-slate-600 mt-2 space-y-1">
                    <li>Utilizar la plataforma para fines distintos a los previstos</li>
                    <li>Reproducir, copiar, distribuir o modificar los contenidos sin autorización</li>
                    <li>Introducir virus, programas maliciosos o dañinos</li>
                    <li>Intentar acceder a áreas restringidas del sistema</li>
                    <li>Suplantar la identidad de otros usuarios</li>
                    <li>Realizar actividades que puedan dañar la imagen de CyclePeaks</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-slate-800 mb-3">4. Contenido del Usuario</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Los usuarios pueden subir fotografías, notas y otros contenidos relacionados con sus 
                    actividades ciclistas. Al hacerlo, el usuario:
                  </p>
                  <ul className="list-disc list-inside text-slate-600 mt-2 space-y-1">
                    <li>Garantiza que es titular de los derechos sobre el contenido subido</li>
                    <li>Otorga a CyclePeaks licencia para mostrar y almacenar dicho contenido</li>
                    <li>Se responsabiliza de que el contenido no infrinja derechos de terceros</li>
                    <li>Acepta que CyclePeaks puede moderar y eliminar contenido inapropiado</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-slate-800 mb-3">5. Protección de Datos y Privacidad</h3>
                  <p className="text-slate-600 leading-relaxed">
                    CyclePeaks se compromete a proteger la privacidad y los datos personales de los usuarios 
                    conforme al Reglamento General de Protección de Datos (RGPD) y la legislación aplicable. 
                    Los datos se utilizarán para:
                  </p>
                  <ul className="list-disc list-inside text-slate-600 mt-2 space-y-1">
                    <li>Gestionar el registro y la cuenta del usuario</li>
                    <li>Proporcionar los servicios de la plataforma</li>
                    <li>Mejorar la experiencia del usuario</li>
                    <li>Enviar comunicaciones relacionadas con el servicio</li>
                    <li>Cumplir con obligaciones legales</li>
                  </ul>
                  <p className="text-slate-600 leading-relaxed mt-2">
                    Para más información, consulte nuestra Política de Privacidad.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-slate-800 mb-3">6. Limitación de Responsabilidad</h3>
                  <p className="text-slate-600 leading-relaxed">
                    CyclePeaks es una plataforma digital informativa y de registro de actividades ciclistas. 
                    La plataforma no se responsabiliza de:
                  </p>
                  <ul className="list-disc list-inside text-slate-600 mt-2 space-y-1">
                    <li>Accidentes, lesiones o daños durante actividades ciclistas</li>
                    <li>La exactitud de la información sobre rutas o puertos de montaña</li>
                    <li>Interrupciones temporales del servicio</li>
                    <li>Pérdida de datos por causas técnicas</li>
                    <li>Daños derivados del uso indebido de la plataforma</li>
                  </ul>
                  <p className="text-slate-600 leading-relaxed mt-2">
                    El usuario practica ciclismo bajo su propia responsabilidad y riesgo.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-slate-800 mb-3">7. Propiedad Intelectual</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Todos los contenidos de CyclePeaks (diseño, código, textos, logotipos, etc.) están 
                    protegidos por derechos de propiedad intelectual. Queda prohibida su reproducción, 
                    distribución o modificación sin autorización expresa.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-slate-800 mb-3">8. Duración y Terminación</h3>
                  <p className="text-slate-600 leading-relaxed">
                    El usuario puede darse de baja en cualquier momento. CyclePeaks se reserva el derecho 
                    de suspender o cancelar cuentas que incumplan estos términos. En caso de baja, 
                    se procederá conforme a la política de privacidad respecto al tratamiento de datos.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-slate-800 mb-3">9. Modificaciones</h3>
                  <p className="text-slate-600 leading-relaxed">
                    CyclePeaks se reserva el derecho de modificar estos términos y condiciones en cualquier 
                    momento. Los cambios se notificarán a los usuarios y entrarán en vigor tras su publicación. 
                    El uso continuado de la plataforma implica la aceptación de las modificaciones.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-slate-800 mb-3">10. Legislación Aplicable y Jurisdicción</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Estos términos se rigen por la legislación española. Para cualquier controversia, 
                    las partes se someten a los juzgados y tribunales de Madrid, renunciando expresamente 
                    a cualquier otro fuero que pudiera corresponderles.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-slate-800 mb-3">11. Contacto</h3>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-slate-700">
                      <strong>Email:</strong> legal@cyclepeaks.com<br/>
                      <strong>Atención al usuario:</strong> support@cyclepeaks.com<br/>
                      <strong>Última actualización:</strong> {new Date().toLocaleDateString('es-ES')}
                    </p>
                  </div>
                </section>
              </div>
            </div>
            <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 p-6 rounded-b-xl">
              <div className="flex justify-end">
                <button
                  onClick={() => setShowTermsModal(false)}
                  className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
                >
                  Cerrar
                </button>
              </div>
              
              {/* Terms and Conditions Checkbox */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="acceptedTerms"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="mt-1 rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                  />
                  <div className="flex-1">
                    <label htmlFor="acceptedTerms" className="text-sm text-slate-700 cursor-pointer">
                      Acepto los{' '}
                      <button
                        type="button"
                        onClick={() => setShowTermsModal(true)}
                        className="text-orange-600 hover:text-orange-700 underline font-medium"
                      >
                        términos y condiciones
                      </button>{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <p className="text-xs text-slate-500 mt-1">
                      Es obligatorio aceptar los términos y condiciones para completar el registro.
                    </p>
                  </div>
                </div>
                {errors.terms && (
                  <p className="text-red-500 text-sm mt-2 ml-6">{errors.terms}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};