import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import en from './locales/en/translation.json';
import es from './locales/es/translation.json';

const resources = {
    en: { translation: en },
    es: { translation: es },
};

const systemLanguageCode = Localization.getLocales()[0].languageCode ?? 'en';

i18n
    .use(initReactI18next)
    .init({
        compatibilityJSON: 'v4',
        resources,
        lng: systemLanguageCode,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        }
    });

export default i18n;