"use client";

import { createContext, useState, ReactNode, useEffect } from 'react';
import en from './locales/en.json';
import mr from './locales/mr.json';
import hi from './locales/hi.json';

const translations: Record<string, any> = { en, mr, hi };

type I18nContextType = {
  language: string;
  setLanguage: (language: string) => void;
  t: (key: string, values?: Record<string, string | number>) => string;
};

export const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && translations[savedLanguage]) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: string) => {
    if (translations[lang]) {
      setLanguageState(lang);
      localStorage.setItem('language', lang);
    }
  };

  const t = (key: string, values?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let result = translations[language];
    for (const k of keys) {
      result = result?.[k];
    }

    let template: string;

    if (typeof result === 'string') {
        template = result;
    } else {
        // Fallback to English if translation is missing
        let fallbackResult = translations['en'];
        for (const k of keys) {
            fallbackResult = fallbackResult?.[k];
        }
        template = fallbackResult || key;
    }

    if (values) {
      return template.replace(/\{\{(\w+)\}\}/g, (placeholder, placeholderKey) => {
        return values[placeholderKey] !== undefined ? String(values[placeholderKey]) : placeholder;
      });
    }

    return template;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}
