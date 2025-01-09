import TRANSLATIONS from '../../data/translations.json';

export const i18n = {
  defaultLocale: 'de',
  locales: TRANSLATIONS.config.settings.availableLanguages,
} as const;

export type Locale = (typeof i18n)['locales'][number];
