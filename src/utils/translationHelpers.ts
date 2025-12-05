export function getTranslatedText(
  defaultText: string,
  translations: { es: string; en: string; fr: string; it: string } | undefined,
  language: string
): string {
  if (!translations) return defaultText;

  const langKey = language as 'es' | 'en' | 'fr' | 'it';
  return translations[langKey] || translations.es || defaultText;
}
