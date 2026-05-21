import { defineRouting } from 'next-intl/routing';
import { defaultLocale, locales } from '../locales/i18nHomepage';

export const routing = defineRouting({
    locales: locales,
    defaultLocale: defaultLocale,
    localeDetection: true,
    localePrefix: {
        mode: 'as-needed',
        prefixes: {
            'en': '/en',
            'ar': '/ar',
            'fa': '/fa'
        }
    },
    pathnames: {
        '/': '/',
        '/privacy-policy': {
            'en': '/privacy-policy',
            'ar': '/privacy-policy',
            'fa': '/privacy-policy'
        },
        '/terms-of-service': {
            'en': '/terms-of-service',
            'ar': '/terms-of-service',
            'fa': '/terms-of-service'
        }
    }
});