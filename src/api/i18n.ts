import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import translationPL from '../localizations/pl.json';
import translationEN from '../localizations/eng.json';
import translationIT from '../localizations/it.json';

const resources = {
  en: { translation: translationEN },
  pl: { translation: translationPL },
  it: { translation: translationIT },
};

i18n.use(LanguageDetector).use(initReactI18next).init({
  fallbackLng: 'en',
  resources,
});

export default i18n;
