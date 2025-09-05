import React, { useState } from 'react';
import { Cyclist, Bike } from '../types';
import { Translation } from '../i18n/translations';
import { addCyclist } from '../utils/cyclistStorage';
import { setCurrentUser } from '../utils/cyclistStorage';
import { sendRegistrationEmail } from '../utils/emailService';
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
  const [formData, setFormData] = useState({
    name: '',
    alias: '',
    email: '',
    phone: '',
    age: '',
    weight: '',
  });
  
  const [bikes, setBikes] = useState<Omit<Bike, 'id'>[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle');

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
      const newCyclist: Cyclist = {
        id: Date.now().toString(),
        name: formData.name.trim(),
        alias: formData.alias.trim() || undefined,
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        age: formData.age ? parseInt(formData.age) : undefined,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        isAdmin: false,
        bikes: bikes.map(bike => ({
          ...bike,
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
        })),
        registrationDate: new Date().toISOString().split('T')[0]
      };
      
      addCyclist(newCyclist);
      
      // Set as current user for normal registration
      setCurrentUser(newCyclist.id);
      
      // Send confirmation email
      setEmailStatus('sending');
      try {
        const emailSuccess = await sendRegistrationEmail({
          name: newCyclist.name,
          email: newCyclist.email,
          alias: newCyclist.alias,
          registrationDate: newCyclist.registrationDate,
          bikes: newCyclist.bikes.map(bike => ({
            brand: bike.brand,
            model: bike.model,
            type: bike.type,
            year: bike.year
          }))
        });
        
        setEmailStatus(emailSuccess ? 'sent' : 'failed');
      } catch (error) {
        console.error('Error sending confirmation email:', error);
        setEmailStatus('failed');
      }
      
      // Reset form
      setFormData({
        name: '',
        alias: '',
        email: '',
        phone: '',
        age: '',
        weight: '',
      });
      setBikes([]);
      setErrors({});
      
      // Show success message with email status
      setTimeout(() => {
        onRegistrationSuccess();
        setEmailStatus('idle');
      }, 2000);
    } catch (error) {
      console.error('Error registering cyclist:', error);
      setEmailStatus('failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addBike = () => {
    setBikes([...bikes, { brand: '', model: '', year: undefined, type: 'Road' }]);
  };

  const removeBike = (index: number) => {
    setBikes(bikes.filter((_, i) => i !== index));
  };

  const updateBike = (index: number, field: keyof Omit<Bike, 'id'>, value: any) => {
    const updatedBikes = bikes.map((bike, i) => 
      i === index ? { ...bike, [field]: value } : bike
    );
    setBikes(updatedBikes);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center mb-8">
          <UserPlus className="h-8 w-8 text-orange-500 mr-3" />
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{t.cyclistRegistration}</h2>
            <p className="text-slate-600">{t.registrationDescription}</p>
          </div>
        </div>

                  <p className="text-green-800 font-medium">¡Email de confirmación enviado!</p>
                  <p className="text-green-600 text-sm">Revisa tu bandeja de entrada en {formData.email}</p>
                </div>
              </div>
            )}
            
            {emailStatus === 'failed' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-yellow-800 font-medium">Registro completado</p>
                  <p className="text-yellow-600 text-sm">No pudimos enviar el email de confirmación, pero tu registro fue exitoso</p>
                </div>
              </div>
            )}
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
                <Mail className="h-4 w-4 inline mr-1" />
                {t.email} <span className="text-red-500">*</span>
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
          
          {/* Admin Role Checkbox */}
          <div className="col-span-full">
            <div className="flex items-start space-x-3 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <input
                type="checkbox"
                id="isAdmin"
                checked={formData.isAdmin}
                onChange={(e) => setFormData({ ...formData, isAdmin: e.target.checked })}
                className="mt-1 rounded border-orange-300 text-orange-500 focus:ring-orange-500"
              />
              <div className="flex-1">
                <label htmlFor="isAdmin" className="block text-sm font-medium text-orange-800 cursor-pointer">
                  {t.adminRole}
                </label>
                <p className="text-xs text-orange-700 mt-1">
                  {t.adminRoleDescription}
                </p>
              </div>
            </div>
          </div>

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
    </div>
    </div>
  );
};