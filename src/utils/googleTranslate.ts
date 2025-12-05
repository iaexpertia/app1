declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}

const triggerTranslation = (selectElement: HTMLSelectElement, languageCode: string) => {
  selectElement.value = languageCode;

  const changeEvent = new Event('change', { bubbles: true });
  selectElement.dispatchEvent(changeEvent);

  setTimeout(() => {
    const clickEvent = new MouseEvent('click', { bubbles: true });
    selectElement.dispatchEvent(clickEvent);
  }, 100);
};

export const changeGoogleLanguage = (languageCode: string) => {
  const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;

  if (selectElement) {
    triggerTranslation(selectElement, languageCode);

    setTimeout(() => {
      if (selectElement.value !== languageCode) {
        triggerTranslation(selectElement, languageCode);
      }
    }, 500);
  } else {
    setTimeout(() => {
      const retrySelect = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (retrySelect) {
        triggerTranslation(retrySelect, languageCode);
      }
    }, 1000);
  }
};

export const getCurrentGoogleLanguage = (): string => {
  const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
  return selectElement?.value || 'es';
};

export const waitForGoogleTranslate = (): Promise<void> => {
  return new Promise((resolve) => {
    const checkInterval = setInterval(() => {
      const selectElement = document.querySelector('.goog-te-combo');
      if (selectElement) {
        clearInterval(checkInterval);
        setTimeout(() => resolve(), 500);
      }
    }, 100);

    setTimeout(() => {
      clearInterval(checkInterval);
      resolve();
    }, 5000);
  });
};

export const forceRetranslate = () => {
  const currentLang = getCurrentGoogleLanguage();
  if (currentLang && currentLang !== 'es') {
    setTimeout(() => {
      changeGoogleLanguage(currentLang);
    }, 300);
  }
};
