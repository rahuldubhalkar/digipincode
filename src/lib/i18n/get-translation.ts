
import 'server-only';
import { promises as fs } from 'fs';
import path from 'path';

const translations: Record<string, any> = {};

async function loadTranslations(locale: string): Promise<Record<string, any>> {
    if (translations[locale]) {
        return translations[locale];
    }

    try {
        const filePath = path.join(process.cwd(), `src/lib/i18n/locales/${locale}.json`);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const json = JSON.parse(fileContent);
        translations[locale] = json;
        return json;
    } catch (error) {
        console.error(`Could not load translations for locale: ${locale}`, error);
        // Fallback to English if the requested locale is not found
        if (locale !== 'en') {
            return await loadTranslations('en');
        }
        return {};
    }
}

export async function getTranslation(locale: string) {
    const dictionary = await loadTranslations(locale);

    return (key: string, values?: Record<string, string | number>): string => {
        const keys = key.split('.');
        let result = dictionary;
        for (const k of keys) {
            result = result?.[k];
        }

        let template: string;

        if (typeof result === 'string') {
            template = result;
        } else {
            // Fallback to the key itself if no translation is found
            template = key;
        }

        if (values) {
            return template.replace(/\{\{(\w+)\}\}/g, (placeholder, placeholderKey) => {
                return values[placeholderKey] !== undefined ? String(values[placeholderKey]) : placeholder;
            });
        }

        return template;
    };
}
