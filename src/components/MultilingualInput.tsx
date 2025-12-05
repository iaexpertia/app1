import React from 'react';
import { Globe } from 'lucide-react';

interface MultilingualInputProps {
  label: string;
  type?: 'text' | 'textarea';
  translations: { es: string; en: string; fr: string; it: string };
  onChange: (translations: { es: string; en: string; fr: string; it: string }) => void;
  required?: boolean;
  rows?: number;
}

const languages = [
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
];

export const MultilingualInput: React.FC<MultilingualInputProps> = ({
  label,
  type = 'text',
  translations,
  onChange,
  required = false,
  rows = 3,
}) => {
  const handleChange = (lang: 'es' | 'en' | 'fr' | 'it', value: string) => {
    onChange({
      ...translations,
      [lang]: value,
    });
  };

  return (
    <div className="space-y-2">
      <label className="flex items-center text-sm font-medium text-slate-700">
        <Globe className="h-4 w-4 mr-2 text-orange-500" />
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {languages.map((lang) => (
          <div key={lang.code} className="space-y-1">
            <label className="flex items-center text-xs text-slate-600">
              <span className="mr-1">{lang.flag}</span>
              {lang.label}
            </label>
            {type === 'textarea' ? (
              <textarea
                value={translations[lang.code as 'es' | 'en' | 'fr' | 'it']}
                onChange={(e) => handleChange(lang.code as 'es' | 'en' | 'fr' | 'it', e.target.value)}
                rows={rows}
                required={required && lang.code === 'es'}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder={`${label} (${lang.label})`}
              />
            ) : (
              <input
                type="text"
                value={translations[lang.code as 'es' | 'en' | 'fr' | 'it']}
                onChange={(e) => handleChange(lang.code as 'es' | 'en' | 'fr' | 'it', e.target.value)}
                required={required && lang.code === 'es'}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder={`${label} (${lang.label})`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
