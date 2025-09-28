import { useTranslation } from 'react-i18next';
import type { Language } from '../types';

export function useLanguage() {
  const { i18n } = useTranslation();

  const changeLanguage = (newLanguage: Language) => {
    i18n.changeLanguage(newLanguage);
  };

  return {
    changeLanguage,
    isRTL: false, // Hindi is not RTL, but keeping for future languages
  };
}