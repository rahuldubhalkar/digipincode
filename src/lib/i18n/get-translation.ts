import 'server-only';
import en from './locales/en.json';
import mr from './locales/mr.json';
import hi from './locales/hi.json';

const translations: Record<string, any> = { en, mr, hi };

export async function getTranslation(locale: string) {
    const dictionary = translations[locale] || translations['en'];

    return (key: string, values?: Record<string, string | number>): string => {
        const keys = key.split('.');
        
        const getFromDict = (dict: any) => {
          let curr = dict;
          for (const k of keys) {
            if (!curr || typeof curr !== 'object') return null;
            curr = curr[k];
          }
          return typeof curr === 'string' ? curr : null;
        };

        let template = getFromDict(dictionary) || getFromDict(translations['en']) || key;

        if (values) {
            return template.replace(/\{\{(\w+)\}\}/g, (placeholder, placeholderKey) => {
                return values[placeholderKey] !== undefined ? String(values[placeholderKey]) : placeholder;
            });
        }

        return template;
    };
}
