import React from 'react';
import { Globe } from 'lucide-react';

export default function GoogleTranslateButton() {
  const handleTranslate = () => {
    const currentUrl = window.location.href;
    const translateUrl = `https://translate.google.com/translate?sl=auto&tl=es&u=${encodeURIComponent(currentUrl)}`;
    window.open(translateUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      id="googleTranslateBtn"
      onClick={handleTranslate}
      className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 rounded-full shadow-sm border border-gray-200 transition-all duration-200 hover:shadow-md active:scale-95"
      title="Traducir esta página con Google"
    >
      <Globe className="w-4 h-4" />
      <span className="text-sm font-medium">Google</span>
    </button>
  );
}
