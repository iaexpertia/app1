import { useState, useEffect } from 'react';
import { getTranslation, Translation } from '../i18n/translations';
import { changeGoogleLanguage, waitForGoogleTranslate } from '../utils/googleTranslate';

export const useLanguage = () => {
  const [language, setLanguage] = useState<string>('es');
  const [t, setT] = useState<Translation>(getTranslation('es'));
  const [isGoogleTranslateReady, setIsGoogleTranslateReady] = useState(false);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'es';
    setLanguage(savedLanguage);
    setT(getTranslation(savedLanguage));

    waitForGoogleTranslate().then(() => {
      setIsGoogleTranslateReady(true);
      if (savedLanguage !== 'es') {
        changeGoogleLanguage(savedLanguage);
      }
    });
  }, []);

  const changeLanguage = (newLanguage: string) => {
    setLanguage(newLanguage);
    setT(getTranslation(newLanguage));
    localStorage.setItem('language', newLanguage);

    if (isGoogleTranslateReady) {
      changeGoogleLanguage(newLanguage);
    }
  };

  return { language, t, changeLanguage };
};