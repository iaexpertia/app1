declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}

export const changeGoogleLanguage = (languageCode: string) => {
  const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;

  if (selectElement) {
    selectElement.value = languageCode;
    selectElement.dispatchEvent(new Event('change'));
  } else {
    setTimeout(() => {
      const retrySelect = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (retrySelect) {
        retrySelect.value = languageCode;
        retrySelect.dispatchEvent(new Event('change'));
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
        resolve();
      }
    }, 100);

    setTimeout(() => {
      clearInterval(checkInterval);
      resolve();
    }, 5000);
  });
};
