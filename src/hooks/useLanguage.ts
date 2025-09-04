import { useState, useEffect } from 'react';
import { getTranslation, Translation } from '../i18n/translations';

export const useLanguage = () => {
  const [language, setLanguage] = useState<string>('es');
  const [t, setT] = useState<Translation>(getTranslation('es'));

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'es';
    setLanguage(savedLanguage);
    setT(getTranslation(savedLanguage));
  }, []);

  const changeLanguage = (newLanguage: string) => {
    setLanguage(newLanguage);
    setT(getTranslation(newLanguage));
    localStorage.setItem('language', newLanguage);
  };

  return { language, t, changeLanguage };
};