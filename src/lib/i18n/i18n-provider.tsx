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
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const savedLanguage = typeof window !== 'undefined' ? localStorage.getItem('language') : null;
    if (savedLanguage && translations[savedLanguage]) {
      setLanguageState(savedLanguage);
    }
    setIsHydrated(true);
  }, []);

  const setLanguage = (lang: string) => {
    if (translations[lang]) {
      setLanguageState(lang);
      if (typeof window !== 'undefined') {
        localStorage.setItem('language', lang);
      }
    }
  };

  const t = (key: string, values?: Record<string, string | number>): string => {
    const keys = key.split('.');
    
    const getFromDict = (dict: any) => {
      let curr = dict;
      for (const k of keys) {
        if (!curr || typeof curr !== 'object') return null;
        curr = curr[k];
      }
      return typeof curr === 'string' ? curr : null;
    };

    let template = getFromDict(translations[language]) || getFromDict(translations['en']) || key;

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
