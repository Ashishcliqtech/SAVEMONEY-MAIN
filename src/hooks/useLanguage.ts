import { useTranslation } from 'react-i18next';
import { useLocalStorage } from './useLocalStorage';
import type { Language } from '../types';

export function useLanguage() {
  const { i18n } = useTranslation();
  const [language, setLanguageStorage] = useLocalStorage<Language>('language', 'en');

  const changeLanguage = (newLanguage: Language) => {
    i18n.changeLanguage(newLanguage);
    setLanguageStorage(newLanguage);
  };

  return {
    language,
    changeLanguage,
    isRTL: language === 'hi' && false, // Hindi is not RTL, but keeping for future languages
  };
}